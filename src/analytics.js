import { tools } from "./tools.js";

// Only these fixed, non-personal values can become analytics parameters.
export const CTA_IDS = Object.freeze([
  "header_launch_updates", "hero_launch_updates", "open_google_form",
  "open_playbooks", "open_faq",
]);
const CONSENT_KEY = "lazo.analytics-consent.v1";
const EXCLUSION_KEY = "lazo.analytics-excluded.v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const PAGE = Object.freeze({
  page_location: "https://lazo.tools/", page_title: "Lazo | You, but amplified!", page_referrer: "",
});

export function analyticsPageForPath(pathname) {
  const tool = tools.find(({ slug }) =>
    [`/${slug}`, `/${slug}/`, `/${slug}/index.html`].includes(pathname));
  return tool ? Object.freeze({
    page_location: `https://lazo.tools/${tool.slug}/`,
    page_title: `${tool.name} | Lazo`,
    page_referrer: "",
  }) : PAGE;
}

export function createAnalytics({ measurementId, window: win, document: doc, now = Date.now }) {
  const page = analyticsPageForPath(win?.location?.pathname);
  const configured = /^G-[A-Z0-9]{6,20}$/.test(measurementId || "")
    && win?.location?.protocol === "https:" && win.location.hostname === "lazo.tools";
  let choice = null;
  const automated = win?.navigator?.webdriver === true;
  let excluded = automated;
  let exclusionPersistent = false;
  let started = false;
  let pageSent = false;
  const listeners = new Set();
  if (configured) {
    try {
      exclusionPersistent = win.localStorage.getItem(EXCLUSION_KEY) === "true";
      excluded ||= exclusionPersistent;
    } catch {}
    // Resolve owner/test exclusion before restoring any saved consent.
    try {
      const mode = new URL(win.location.href).searchParams.get("analytics");
      if (mode === "exclude" || mode === "test") {
        excluded = true;
        try {
          win.localStorage.setItem(EXCLUSION_KEY, "true");
          exclusionPersistent = true;
        } catch {}
      }
    } catch {}
    try {
      const saved = JSON.parse(win.localStorage.getItem(CONSENT_KEY));
      if (["granted", "denied"].includes(saved?.choice) && Number.isFinite(saved.at)
          && saved.at <= now() && now() - saved.at < MAX_AGE) choice = saved.choice;
    } catch { /* Storage can be unavailable; default remains no collection. */ }
  }
  const snapshot = () => ({ configured, choice, excluded, exclusionPersistent, automated });
  const gtag = (...args) => win.gtag(...args);
  function activate() {
    if (!configured || excluded || choice !== "granted") return;
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
        ...page,
      });
      const script = doc.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.referrerPolicy = "no-referrer";
      doc.head.appendChild(script);
    } else gtag("consent", "update", { analytics_storage: "granted" });
    if (!pageSent) {
      pageSent = true;
      gtag("event", "page_view", { ...page, send_to: measurementId });
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
    if (choice === "granted" && !excluded) activate();
    else if (configured) {
      win[`ga-disable-${measurementId}`] = true;
      if (started) gtag("consent", "update", { analytics_storage: "denied" });
      clearCookies();
    }
    for (const listener of listeners) listener(snapshot());
  }
  function trackCta(id) {
    if (!configured || excluded || choice !== "granted" || !CTA_IDS.includes(id)) return false;
    gtag("event", "cta_tapped", { cta_id: id, ...page, send_to: measurementId });
    return true;
  }
  // Event payloads never contain form text, URLs from the browser, or referrers.
  if (configured) {
    doc.addEventListener("click", event => {
      const id = event.target?.closest?.("[data-analytics-cta]")?.getAttribute("data-analytics-cta");
      trackCta(id);
    });
    win.addEventListener("storage", event => {
      if (event.key === EXCLUSION_KEY || event.key === null) {
        exclusionPersistent = event.newValue === "true";
        excluded = automated || exclusionPersistent;
        apply("denied", false);
        return;
      }
      if (event.key !== CONSENT_KEY) return;
      let saved;
      try { saved = JSON.parse(event.newValue); } catch {}
      const valid = Number.isFinite(saved?.at) && saved.at <= now() && now() - saved.at < MAX_AGE;
      apply(valid && saved.choice === "granted" ? "granted" : "denied", false);
    });
    // Also revoke consent in older open tabs that predate browser exclusions.
    apply(excluded ? "denied" : choice, excluded);
  }
  return Object.freeze({
    snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setConsent(next) {
      if (!configured || excluded || !["granted", "denied"].includes(next)) return false;
      apply(next, true); return true;
    },
    setExcluded(next) {
      if (!configured || automated || typeof next !== "boolean") return false;
      excluded = next;
      exclusionPersistent = false;
      try {
        win.localStorage.setItem(EXCLUSION_KEY, String(next));
        exclusionPersistent = next;
      } catch {}
      if (!next) {
        try {
          const url = new URL(win.location.href);
          if (["exclude", "test"].includes(url.searchParams.get("analytics"))) {
            url.searchParams.delete("analytics");
            win.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
          }
        } catch {}
      }
      // Re-including a browser never opts it back into analytics automatically.
      apply("denied", true);
      return true;
    },
    trackCta,
  });
}

let instance;
export function getAnalytics() {
  if (typeof window === "undefined") return null;
  return instance ||= createAnalytics({ measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID, window, document });
}
