import {LazoMark} from "./LazoMark.jsx";
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
          <LazoMark base="../" /> Lazo
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
          <p className="tool-status"><span aria-hidden="true" />{tool.url ? "By Lazo" : "Page coming soon"}</p>
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
          <p>Cookie-free counts of page views and button clicks. No visitor IDs or work content. Use the analytics control to opt out.</p>
          <a href="https://accounts.lazo.tools/privacy#analytics">Privacy details</a>
        </details>
        <a href="../terms/">Terms &amp; Conditions</a>
        <small>&copy; {new Date().getFullYear()} Lazo</small>
      </footer>
    </div>
  );
}
