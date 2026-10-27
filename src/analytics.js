// Only these fixed, non-personal values can become analytics parameters.
export const CTA_IDS = Object.freeze([
  "header_launch_updates", "hero_launch_updates", "open_google_form",
  "open_playbooks", "open_faq",
]);
const CONSENT_KEY = "lazo.analytics-consent.v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const PAGE = Object.freeze({
  page_location: "https://lazo.tools/", page_title: "Lazo | You, but amplified!", page_referrer: "",
});

export function createAnalytics({ measurementId, window: win, document: doc, now = Date.now }) {
  const configured = /^G-[A-Z0-9]{6,20}$/.test(measurementId || "")
    && win?.location?.protocol === "https:" && win.location.hostname === "lazo.tools";
  let choice = null;
  let started = false;
  let pageSent = false;
  const listeners = new Set();
  if (configured) {
    try {
      const saved = JSON.parse(win.localStorage.getItem(CONSENT_KEY));
      if (["granted", "denied"].includes(saved?.choice) && Number.isFinite(saved.at)
          && saved.at <= now() && now() - saved.at < MAX_AGE) choice = saved.choice;
    } catch { /* Storage can be unavailable; default remains no collection. */ }
  }
  const snapshot = () => ({ configured, choice });
  const gtag = (...args) => win.gtag(...args);
  function activate() {
    if (!configured || choice !== "granted") return;
    win[`ga-disable-${measurementId}`] = false;
    if (!started) {
      started = true;
      win.dataLayer = win.dataLayer || [];
      win.gtag = function () { win.dataLayer.push(arguments); };
      gtag("consent", "default", {
        analytics_storage: "granted", ad_storage: "denied",
        ad_user_data: "denied", ad_personalization: "denied",
      });
      gtag("js", new Date(now()));
      gtag("config", measurementId, {
        send_page_view: false, allow_google_signals: false,
        allow_ad_personalization_signals: false, ignore_referrer: true,
        cookie_flags: "SameSite=Lax;Secure", cookie_expires: MAX_AGE / 1000,
        ...PAGE,
      });
      const script = doc.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.referrerPolicy = "no-referrer";
      doc.head.appendChild(script);
    } else gtag("consent", "update", { analytics_storage: "granted" });
    if (!pageSent) {
      pageSent = true;
      gtag("event", "page_view", { ...PAGE, send_to: measurementId });
    }
  }
  function clearCookies() {
    for (const entry of doc.cookie.split(";")) {
      const name = entry.trim().split("=")[0];
      if (name !== "_ga" && !name.startsWith("_ga_")) continue;
      for (const domain of ["", "; Domain=lazo.tools", "; Domain=.lazo.tools"]) {
        doc.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;
      }
    }
  }
  function apply(next, persist) {
    choice = next;
    if (persist) {
      try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: now() })); } catch {}
    }
    if (choice === "granted") activate();
    else if (configured) {
      win[`ga-disable-${measurementId}`] = true;
      if (started) gtag("consent", "update", { analytics_storage: "denied" });
      clearCookies();
    }
    for (const listener of listeners) listener(snapshot());
  }
  function trackCta(id) {
    if (!configured || choice !== "granted" || !CTA_IDS.includes(id)) return false;
    gtag("event", "cta_tapped", { cta_id: id, ...PAGE, send_to: measurementId });
    return true;
  }
  // Never inspect field values, labels, free text, query strings, fragments or referrers.
  if (configured) {
    doc.addEventListener("click", event => {
      const id = event.target?.closest?.("[data-analytics-cta]")?.getAttribute("data-analytics-cta");
      trackCta(id);
    });
    win.addEventListener("storage", event => {
      if (event.key !== CONSENT_KEY) return;
      let saved;
      try { saved = JSON.parse(event.newValue); } catch {}
      const valid = Number.isFinite(saved?.at) && saved.at <= now() && now() - saved.at < MAX_AGE;
      apply(valid && saved.choice === "granted" ? "granted" : "denied", false);
    });
    apply(choice, false);
  }
  return Object.freeze({
    snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setConsent(next) {
      if (!configured || !["granted", "denied"].includes(next)) return false;
      apply(next, true); return true;
    },
    trackCta,
  });
}

let instance;
export function getAnalytics() {
  if (typeof window === "undefined") return null;
  return instance ||= createAnalytics({ measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID, window, document });
}
