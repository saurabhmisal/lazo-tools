import { ArrowLeft, Link2 } from "lucide-react";
import { AnalyticsPreferences } from "./AnalyticsPreferences.jsx";
import { ToolsMenu } from "./ToolsMenu.jsx";

export function ToolPlaceholder({ tool }) {
  return (
    <div className="simple-site tool-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="nav-brand" href="../" aria-label="Lazo home">
          <Link2 size={25} strokeWidth={2} aria-hidden="true" /> Lazo
        </a>
        <nav className="simple-nav" aria-label="Main navigation">
          <ToolsMenu base="../" />
          <a className="tool-home-link" href="../">Back to Lazo</a>
        </nav>
      </header>
      <main id="main" className="tool-placeholder">
        <div className="tool-placeholder-copy">
          <p className="tool-family">By Lazo</p>
          <h1>{tool.name}</h1>
          <p className="tool-status"><span aria-hidden="true" />Page coming soon</p>
          <p>A home for {tool.name} under Lazo. More details soon.</p>
          <a className="text-link tool-back" href="../">
            <ArrowLeft size={16} aria-hidden="true" /> Back to Lazo
          </a>
        </div>
      </main>
      <AnalyticsPreferences />
      <footer className="tool-footer">
        <p>Lazo tools</p>
        <details>
          <summary>Privacy</summary>
          <p>Google Analytics records visits only after you allow it. You can change your choice above. Browser exclusions apply across Lazo pages.</p>
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses data</a>
        </details>
        <small>&copy; {new Date().getFullYear()} Lazo</small>
      </footer>
    </div>
  );
}
