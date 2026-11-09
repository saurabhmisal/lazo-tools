import {LazoMark} from "./LazoMark.jsx";
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Link2,ArrowLeft} from 'lucide-react';
import terms from './terms-content.json';
import {AnalyticsPreferences} from './AnalyticsPreferences.jsx';
import './styles.css';import './lazo-identity.css';import './tools.css';import './brand-type.css';import './family-theme.css';
function TermsPage(){return <div className="simple-site"><header className="site-header"><a className="nav-brand" href="../"><LazoMark base="../"/> Lazo</a><a href="../">Back to Lazo</a></header><main className="legal-page"><a className="text-link" href="../"><ArrowLeft size={16} aria-hidden="true"/> Back</a><p className="eyebrow">LAZO · VERSION {terms.version}</p><h1>{terms.title}</h1><p>Last updated {terms.updated}</p><p className="legal-summary">Keep independent backups. Review AI outputs. You keep ownership of your work. The limits below apply only where the law allows.</p>{terms.sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}<p><a href="https://accounts.lazo.tools/privacy">Privacy</a> · <a href="mailto:support@lazo.tools">Contact Lazo</a></p></main><footer className="tool-footer"><a href="../">Lazo</a><a href="./">Terms &amp; Conditions</a><a href="https://accounts.lazo.tools/privacy">Privacy</a><small>© 2026 Lazo</small></footer><AnalyticsPreferences/></div>}
createRoot(document.getElementById('root')).render(<TermsPage/>);
