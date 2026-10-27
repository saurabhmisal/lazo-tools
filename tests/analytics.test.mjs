import assert from "node:assert/strict";
import test from "node:test";
import { createAnalytics } from "../src/analytics.js";

function fixture({ host = "lazo.tools", id = "G-TEST123456", stored = null, excluded = false,
  automated = false, href = "https://lazo.tools/?email=private@example.com#secret", storageBlocked = false } = {}) {
  const scripts = [], events = {}, storageEvents = {}, writes = [];
  let cookies = "_ga=old; _ga_TEST123456=old; unrelated=keep";
  const storage = new Map(stored ? [["lazo.analytics-consent.v1", JSON.stringify(stored)]] : []);
  if (excluded) storage.set("lazo.analytics-excluded.v1", "true");
  const win = { location: { protocol: "https:", hostname: host, href }, navigator: { webdriver: automated },
    localStorage: {
      getItem: k => { if (storageBlocked) throw Error("unavailable"); return storage.get(k); },
      setItem: (k,v) => { if (storageBlocked) throw Error("unavailable"); storage.set(k,v); },
    },
    addEventListener: (k,v) => { storageEvents[k] = v; } };
  win.history = { replaceState: (_state, _title, url) => { win.location.href = new URL(url, win.location.href).href; } };
  const doc = { referrer: "https://private.example/secret", createElement: () => ({}),
    head: { appendChild: s => scripts.push(s) }, addEventListener: (k,v) => { events[k] = v; },
    get cookie() { return cookies; }, set cookie(v) { writes.push(v); } };
  const analytics = createAnalytics({ measurementId: id, window: win, document: doc, now: () => 100000000000 });
  return { analytics, win, doc, scripts, events, storageEvents, writes, storage, calls: () => (win.dataLayer || []).map(x => Array.from(x)) };
}

test("absent/invalid IDs and non-production hosts never load or collect", () => {
  for (const options of [{ id: "" }, { id: "G-bad?email=private" }, { host: "localhost" }, { host: "preview.example" }]) {
    const f = fixture(options);
    assert.equal(f.analytics.snapshot().configured, false);
    assert.equal(f.analytics.setConsent("granted"), false);
    assert.equal(f.analytics.trackCta("hero_launch_updates"), false);
    assert.equal(f.scripts.length, 0);
  }
});
test("basic consent: no Google script, dataLayer, or click events before opt-in", () => {
  const f = fixture();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.win.dataLayer, undefined);
  assert.equal(f.analytics.trackCta("hero_launch_updates"), false);
  f.analytics.setConsent("denied");
  assert.equal(f.scripts.length, 0);
  assert.equal(f.win.dataLayer, undefined);
});
test("one page view and one script across repeated consent; fixed sanitized payloads", () => {
  const f = fixture();
  f.analytics.setConsent("granted"); f.analytics.setConsent("granted");
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].referrerPolicy, "no-referrer");
  assert.equal(f.calls().filter(c => c[0] === "event" && c[1] === "page_view").length, 1);
  const config = f.calls().find(c => c[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  f.events.click({ target: { closest: () => ({ getAttribute: () => "hero_launch_updates" }) } });
  assert.equal(f.calls().at(-1)[1], "cta_tapped");
  assert.equal(f.analytics.trackCta("private@example.com"), false);
  assert.doesNotMatch(JSON.stringify(f.calls()), /private|secret|email=/);
});
test("revocation disables collection, expires only GA cookies and survives reload", () => {
  const f = fixture(); f.analytics.setConsent("granted"); f.analytics.setConsent("denied");
  assert.equal(f.win["ga-disable-G-TEST123456"], true);
  assert.equal(f.analytics.trackCta("open_google_form"), false);
  assert(f.writes.some(x => x.startsWith("_ga=")));
  assert(f.writes.every(x => !x.includes("unrelated")));
  assert.equal(fixture({ stored: { choice: "denied", at: 100000000000 } }).scripts.length, 0);
});
test("valid stored consent restores; expired and malformed choices default off", () => {
  assert.equal(fixture({ stored: { choice: "granted", at: 100000000000 } }).scripts.length, 1);
  for (const at of [0, "yesterday", 100000000001]) {
    const f = fixture({ stored: { choice: "granted", at } });
    assert.equal(f.scripts.length, 0);
    assert.equal(f.analytics.snapshot().choice, null);
  }
});
test("another tab's withdrawal disables this tab and notifies preferences", () => {
  const f = fixture(); let state;
  f.analytics.subscribe(value => { state = value; });
  f.analytics.setConsent("granted");
  f.storageEvents.storage({ key: "lazo.analytics-consent.v1", newValue: null });
  assert.equal(f.analytics.trackCta("open_faq"), false);
  assert.equal(state.choice, "denied");
});

test("a saved browser exclusion overrides previously granted consent before loading Google", () => {
  const f = fixture({ excluded: true, stored: { choice: "granted", at: 100000000000 } });
  assert.equal(f.analytics.snapshot().excluded, true);
  assert.equal(f.analytics.snapshot().exclusionPersistent, true);
  assert.equal(f.scripts.length, 0);
  assert.equal(f.win.dataLayer, undefined);
  assert.equal(f.analytics.setConsent("granted"), false);
  assert.equal(f.analytics.trackCta("header_launch_updates"), false);
  assert.equal(f.win["ga-disable-G-TEST123456"], true);
});

test("owner and test links persist exclusion before restoring consent", () => {
  for (const mode of ["exclude", "test"]) {
    const f = fixture({ href: `https://lazo.tools/?analytics=${mode}`,
      stored: { choice: "granted", at: 100000000000 } });
    assert.equal(f.analytics.snapshot().excluded, true);
    assert.equal(f.scripts.length, 0);
    assert.equal(f.storage.get("lazo.analytics-excluded.v1"), "true");
    assert.equal(f.analytics.trackCta("hero_launch_updates"), false);
  }
});

test("automated browsers cannot enable production analytics", () => {
  const f = fixture({ automated: true, stored: { choice: "granted", at: 100000000000 } });
  assert.equal(f.analytics.snapshot().excluded, true);
  assert.equal(f.analytics.setExcluded(false), false);
  assert.equal(f.analytics.setConsent("granted"), false);
  assert.equal(f.scripts.length, 0);
});

test("excluding an active browser blocks clicks, persists, and resets consent", () => {
  const f = fixture();
  f.analytics.setConsent("granted");
  assert.equal(f.analytics.setExcluded(true), true);
  assert.equal(f.analytics.trackCta("hero_launch_updates"), false);
  assert.equal(f.win["ga-disable-G-TEST123456"], true);
  assert.equal(f.storage.get("lazo.analytics-excluded.v1"), "true");
  assert.equal(JSON.parse(f.storage.get("lazo.analytics-consent.v1")).choice, "denied");
});

test("re-including cleans the exclusion link without opting into collection", () => {
  const f = fixture({ href: "https://lazo.tools/?analytics=exclude&keep=1#release" });
  assert.equal(f.analytics.setExcluded(false), true);
  assert.equal(f.analytics.snapshot().excluded, false);
  assert.equal(f.analytics.snapshot().choice, "denied");
  assert.equal(f.storage.get("lazo.analytics-excluded.v1"), "false");
  assert.equal(f.win.location.href, "https://lazo.tools/?keep=1#release");
  assert.equal(f.scripts.length, 0);
  f.analytics.setConsent("granted");
  assert.equal(f.scripts.length, 1);
});

test("cross-tab exclusion cannot be overridden by a consent grant from another tab", () => {
  const f = fixture(); let state;
  f.analytics.subscribe(value => { state = value; });
  f.analytics.setConsent("granted");
  f.storageEvents.storage({ key: "lazo.analytics-excluded.v1", newValue: "true" });
  f.storageEvents.storage({ key: "lazo.analytics-consent.v1",
    newValue: JSON.stringify({ choice: "granted", at: 100000000000 }) });
  assert.equal(state.excluded, true);
  assert.equal(f.analytics.trackCta("header_launch_updates"), false);
  assert.equal(f.win["ga-disable-G-TEST123456"], true);
});

test("test links fail closed when browser storage is unavailable", () => {
  const f = fixture({ href: "https://lazo.tools/?analytics=test", storageBlocked: true });
  assert.equal(f.analytics.snapshot().excluded, true);
  assert.equal(f.analytics.snapshot().exclusionPersistent, false);
  assert.equal(f.analytics.setConsent("granted"), false);
  assert.equal(f.scripts.length, 0);
});

test("clearing preferences in another tab revokes collection", () => {
  const f = fixture();
  f.analytics.setConsent("granted");
  f.storageEvents.storage({ key: null, newValue: null });
  assert.equal(f.analytics.snapshot().choice, "denied");
  assert.equal(f.analytics.trackCta("header_launch_updates"), false);
});
