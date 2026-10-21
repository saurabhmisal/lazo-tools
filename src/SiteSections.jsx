import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Copy,
  Download,
  FlaskConical,
  LockKeyhole,
  Link2,
  Search,
  NotebookPen,
  Users,
} from "lucide-react";
import {
  extensionBenefits,
  createPlaybook,
  faqs,
  playbooks,
} from "./site-content.js";
import { interestForm } from "./interest-config.js";

const icons = {
  context: Link2,
  "follow-through": NotebookPen,
  alignment: Users,
};
const playbookIcons = {
  discovery: Search,
  prototype: Code2,
  experiment: FlaskConical,
};

function SectionRule({ number, title, note }) {
  return (
    <div className="section-rule">
      <span>
        {number} / {title}
      </span>
      <i />
      <span>{note}</span>
    </div>
  );
}

export function CapabilitySection() {
  return (
    <section
      className="page-section capability-section"
      id="capabilities"
      aria-labelledby="capabilities-title"
    >
      <SectionRule
        number="02"
        title="WHY LAZO"
        note="YOUR ATTENTION, WHERE IT BELONGS."
      />
      <div className="section-intro">
        <div>
          <span className="eyebrow">LESS TO CARRY. MORE ROOM TO THINK.</span>
          <h2 id="capabilities-title">
            Your thinking, extended.
            <br />
            Your work, carried forward.
          </h2>
        </div>
        <p>
          We are building Lazo to reduce the chasing, context-switching, and
          coordination around your decisions, not to make those decisions for
          you.
        </p>
      </div>
      <div className="extension-outcomes">
        {extensionBenefits.map((benefit) => {
          const Icon = icons[benefit.id];
          return (
            <article key={benefit.id}>
              <Icon
                size={23}
                strokeWidth={1.7}
                className={`symbol-${benefit.color}`}
                aria-hidden="true"
              />
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
              <p className="extension-outcome">{benefit.outcome}</p>
            </article>
          );
        })}
      </div>
      <div className="connected-line">
        <Link2 size={19} />
        <p>Support for the work. Ownership stays with you.</p>
        <span className="mono">YOUR FINAL SAY. ALWAYS.</span>
      </div>
    </section>
  );
}

export function PlaybookSection() {
  const [selectedId, setSelectedId] = useState("discovery");
  const [question, setQuestion] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const selected = playbooks.find((item) => item.id === selectedId);
  const text = createPlaybook(selectedId, question, notes);
  useEffect(() => setStatus(""), [selectedId, question, notes]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Playbook copied.");
    } catch {
      setStatus(
        "Clipboard unavailable. You can download the playbook instead.",
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/markdown;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `lazo-${selectedId}-playbook.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Playbook download started.");
  }
  function moveTab(event, i) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? playbooks.length - 1
          : (i + (event.key === "ArrowRight" ? 1 : -1) + playbooks.length) %
            playbooks.length;
    setSelectedId(playbooks[next].id);
    document.getElementById(`playbook-tab-${playbooks[next].id}`)?.focus();
  }
  return (
    <section
      className="page-section playbook-section"
      id="playbooks"
      aria-labelledby="playbooks-title"
    >
      <SectionRule
        number="03"
        title="PM PLAYBOOKS"
        note="A SMALL START. REAL MOMENTUM."
      />
      <div className="section-intro">
        <div>
          <span className="eyebrow">A CLEARER STARTING POINT.</span>
          <h2 id="playbooks-title">
            One good question.
            <br />A way forward.
          </h2>
        </div>
        <p>
          Give the next conversation a clearer starting point. Shape a brief,
          explore a question, and bring your team along.
        </p>
      </div>
      <div className="playbook-picker" role="tablist" aria-label="PM playbooks">
        {playbooks.map((item, i) => {
          const Icon = playbookIcons[item.id];
          return (
            <button
              id={`playbook-tab-${item.id}`}
              role="tab"
              aria-selected={selectedId === item.id}
              aria-controls="playbook-panel"
              tabIndex={selectedId === item.id ? 0 : -1}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              onKeyDown={(event) => moveTab(event, i)}
            >
              <span className={`tiny-dot ${item.color}`} />
              <Icon size={18} />
              <span>{item.title}</span>
              <span className="mono">0{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div
        id="playbook-panel"
        className="playbook-layout"
        role="tabpanel"
        aria-labelledby={`playbook-tab-${selectedId}`}
      >
        <div className="playbook-inputs">
          <span className="eyebrow">YOUR STARTING POINT</span>
          <h3>Make it about your product.</h3>
          <label htmlFor="product-question">Your product question</label>
          <textarea
            id="product-question"
            rows={3}
            maxLength={280}
            value={question}
            placeholder={selected.question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <div className="field-meta">
            <span>Optional</span>
            <span>{question.length}/280</span>
          </div>
          <label htmlFor="product-context">Context and constraints</label>
          <textarea
            id="product-context"
            rows={4}
            maxLength={1800}
            value={notes}
            placeholder="Who is it for? What do you already know? What is out of scope?"
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="field-meta">
            <span>Optional</span>
            <span>{notes.length}/1800</span>
          </div>
          <div className="session-note">
            <LockKeyhole size={15} />
            <p>
              Your text stays in this browser. Closing the playbooks or
              reloading clears it. Nothing is submitted to an AI model.
            </p>
          </div>
        </div>
        <article className={`playbook-document accent-${selected.color}`}>
          <div className="document-toolbar">
            <span className="mini-heading">LAZO / {selected.eyebrow}</span>
            <div>
              <button
                className="icon-button"
                onClick={copy}
                aria-label="Copy playbook"
                title="Copy playbook"
              >
                <Copy size={17} />
              </button>
              <button
                className="icon-button"
                onClick={download}
                aria-label="Download playbook"
                title="Download Markdown playbook"
              >
                <Download size={17} />
              </button>
            </div>
          </div>
          <div className="document-content">
            <span className="document-type mono">
              WORKING TEMPLATE / NOT AI-GENERATED
            </span>
            <h3>{question.replace(/\s+/g, " ").trim() || selected.question}</h3>
            <p className="document-purpose">{selected.purpose}</p>
            {notes.trim() && (
              <div className="document-context">
                <span className="mini-heading">YOUR CONTEXT</span>
                <p>{notes}</p>
              </div>
            )}
            <ol className="playbook-steps">
              {selected.steps.map((step, i) => (
                <li key={step.title}>
                  <span className="mono">0{i + 1}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="document-outcome">
              <span className="mini-heading">TAKE FORWARD</span>
              <p>{selected.outcome}</p>
            </div>
            <p className="document-guardrail">{selected.guardrail}</p>
          </div>
          <div className="document-actions">
            <button className="button button-primary" onClick={download}>
              <Download size={15} /> Download playbook
            </button>
            <span role="status" aria-live="polite">
              {status || "Markdown / No account required"}
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [category, setCategory] = useState("All");
  const visible = faqs.filter(
    (item) => category === "All" || item.category === category,
  );
  return (
    <section
      className="page-section faq-section"
      id="faq"
      aria-labelledby="faq-title"
    >
      <SectionRule
        number="06"
        title="QUESTIONS & ANSWERS"
        note="A LITTLE MORE CONTEXT."
      />
      <div className="faq-layout">
        <div className="faq-intro">
          <span className="eyebrow">THE THINGS YOU MIGHT BE WONDERING.</span>
          <h2 id="faq-title">
            Good questions.
            <br />
            Straight answers.
          </h2>
          <div className="faq-filters" role="group" aria-label="FAQ categories">
            {["All", "Product", "Data", "Release"].map((label) => (
              <button
                key={label}
                onClick={() => setCategory(label)}
                aria-pressed={category === label}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="question-count mono" aria-live="polite">
            {visible.length} questions
          </span>
        </div>
        <div className="faq-list">
          {visible.map((item) => (
            <details key={item.id} name="frequent-questions">
              <summary>
                <span>{item.question}</span>
                <ChevronDown className="details-chevron" size={17} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReleaseSection() {
  return (
    <section
      className="page-section release-section"
      id="release"
      aria-labelledby="release-title"
    >
      <div className="release-layout">
        <div>
          <h2 id="release-title">Be part of what's next</h2>
          <p>Lazo is launching soon. Get launch and early-access updates.</p>
          <p className="release-cost">
            Lazo is free forever. External AI services may charge separately.
          </p>
        </div>
        <form
          className="interest-form"
          action={interestForm.action}
          method="POST"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lazo early interest"
        >
          <div className="interest-field">
            <label htmlFor="interest-email">Email address</label>
            <input
              id="interest-email"
              name={interestForm.fields.email}
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>
          <div className="interest-field">
            <label htmlFor="interest-system">Which system do you use?</label>
            <select
              id="interest-system"
              name={interestForm.fields.system}
              defaultValue=""
              required
            >
              <option value="" disabled>
                Choose your system
              </option>
              {interestForm.systems.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
          </div>
          <details className="interest-optional">
            <summary>
              Tell us more <span>(optional)</span>
              <ChevronDown size={16} />
            </summary>
            <div className="interest-field">
              <label htmlFor="interest-name">Your name</label>
              <input
                id="interest-name"
                name={interestForm.fields.name}
                autoComplete="name"
                maxLength={100}
              />
            </div>
            <div className="interest-field">
              <label htmlFor="interest-blocker">
                What slows your product work down?
              </label>
              <textarea
                id="interest-blocker"
                name={interestForm.fields.blocker}
                rows={3}
                maxLength={1800}
              />
            </div>
          </details>
          <label className="interest-consent">
            <input
              type="checkbox"
              name={interestForm.fields.consent}
              value={interestForm.consent}
              required
            />
            <span>{interestForm.consent}</span>
          </label>
          <button className="button button-primary" type="submit">
            Get launch updates <ArrowRight size={15} />
          </button>
          <p className="interest-privacy">
            Saved privately via Google Forms. No confidential work details,
            please.
          </p>
          <p className="interest-note">
            Google Forms confirms your submission in a new tab.{" "}
            <a
              href={interestForm.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the form directly
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

export function SiteFooter({ onAbout, onPlaybooks, onFAQ }) {
  return (
    <footer className="simple-footer">
      <a className="footer-brand" href="#" aria-label="Lazo home">
        <Link2 size={21} aria-hidden="true" /> Lazo
      </a>
      <nav aria-label="More about Lazo">
        <button onClick={onFAQ}>FAQ</button>
        <button onClick={onPlaybooks}>PM playbooks</button>
        <button onClick={onAbout}>About & privacy</button>
      </nav>
      <small>© {new Date().getFullYear()} Lazo</small>
    </footer>
  );
}
