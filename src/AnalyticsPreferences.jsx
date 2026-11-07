import { useEffect, useState } from "react";
import { getAnalytics, ANALYTICS_NOTICE } from "./analytics.js";

export function AnalyticsPreferences() {
  const [state, setState] = useState({ configured: false, choice: null });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const analytics = getAnalytics();
    setState(analytics.snapshot());
    return analytics.subscribe(setState);
  }, []);
  if (!state.configured) return null;
  if (state.excluded) return (
    <aside className="analytics-preferences" aria-label="Website analytics preferences">
      <p>
        This browser is excluded from analytics. Your visits and clicks are not recorded.
        {!state.exclusionPersistent && !state.automated && " Storage is unavailable; keep the exclusion link for future visits."}
      </p>
      {!state.automated && <button type="button" className="text-link" onClick={() => getAnalytics().setExcluded(false)}>
        Include this browser again
      </button>}
      <a href="https://accounts.lazo.tools/privacy">Privacy details</a>
    </aside>
  );
  const choose = choice => { getAnalytics().setConsent(choice); setOpen(false); };
  return (
    <aside className="analytics-preferences" aria-label="Website analytics preferences">
      {state.choice === null || open ? <>
        <p>{ANALYTICS_NOTICE}</p>
        <div>
          <button type="button" className="button button-secondary" onClick={() => choose("denied")}>Decline analytics</button>
          <button type="button" className="button button-secondary" onClick={() => choose("granted")}>Allow analytics</button>
        </div>
      </> : <button type="button" className="text-link" onClick={() => setOpen(true)}>
        Analytics: {state.choice === "granted" ? "on" : "off"} · Change
      </button>}
      <a href="https://accounts.lazo.tools/privacy">Privacy details</a>
    </aside>
  );
}
