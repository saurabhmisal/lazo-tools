import { ArrowLeft, ArrowRight, Link2 } from "lucide-react";
import { AnalyticsPreferences } from "./AnalyticsPreferences.jsx";
import { ToolsMenu } from "./ToolsMenu.jsx";
import { ToolLogo } from "./ToolLogo.jsx";

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
          {tool.url ? (
            <a className="tool-logo-link" href={tool.url} aria-label={`Visit ${tool.name} website`}>
              <ToolLogo tool={tool} base="../" className="tool-page-logo" loading="eager" />
            </a>
          ) : (
            <ToolLogo tool={tool} base="../" className="tool-page-logo" loading="eager" />
          )}
          <h1>{tool.name}</h1>
          <p className="tool-status"><span aria-hidden="true" />{tool.url ? "Dedicated website" : "Page coming soon"}</p>
          <p>{tool.description}</p>
          {tool.url && (
            <p className="tool-website-action">
              <a className="button button-primary" href={tool.url}>
                Explore {tool.name} <ArrowRight size={16} aria-hidden="true" />
              </a>
            </p>
          )}
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
