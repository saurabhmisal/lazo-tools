import { useEffect, useState } from "react";
import { getAnalytics } from "./analytics.js";

export function AnalyticsPreferences() {
  const [state, setState] = useState({ configured: false, choice: null });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const analytics = getAnalytics();
    setState(analytics.snapshot());
    return analytics.subscribe(setState);
  }, []);
  if (!state.configured) return null;
  const choose = choice => { getAnalytics().setConsent(choice); setOpen(false); };
  return (
    <aside className="analytics-preferences" aria-label="Website analytics preferences">
      {state.choice === null || open ? <>
        <p>Allow Google Analytics to measure visits and button clicks? We do not send form details or playbook text. Analytics cookies are optional.</p>
        <div>
          <button type="button" className="button button-secondary" onClick={() => choose("denied")}>Decline analytics</button>
          <button type="button" className="button button-secondary" onClick={() => choose("granted")}>Allow analytics</button>
        </div>
      </> : <button type="button" className="text-link" onClick={() => setOpen(true)}>
        Analytics: {state.choice === "granted" ? "on" : "off"} · Change
      </button>}
    </aside>
  );
}
