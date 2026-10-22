import { useEffect, useRef, useState } from "react";
import { PressureStory } from "./PressureStory.jsx";
import { useSectionReveals } from "./useSectionReveals.js";
import {
  FAQSection,
  PlaybookSection,
  ReleaseSection,
  SiteFooter,
} from "./SiteSections.jsx";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Bot,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Code2,
  Command,
  Copy,
  FileCode2,
  FileSearch,
  FileText,
  FlaskConical,
  Folder,
  Layers3,
  LaptopMinimal,
  Lightbulb,
  Link2,
  LockKeyhole,
  MessageSquareText,
  NotebookPen,
  Search,
  Target,
  X,
} from "lucide-react";

const examples = {
  "User interviews": {
    tag: "RESEARCH / EVIDENCE",
    body: "A sample synthesis of eight onboarding interviews.",
    points: [
      "People want to experience value before configuring everything.",
      "A concrete example makes the first step easier to understand.",
      "Advanced options can wait until the basics are working.",
    ],
    note: "Opportunity: help a new user complete one meaningful task before asking them to set up their entire workspace.",
  },
  "Onboarding analytics": {
    tag: "RESEARCH / EVIDENCE",
    body: "An illustrative measurement plan, not live analytics.",
    points: [
      "Track the first meaningful action, not just account creation.",
      "Segment the journey by the job a person came to do.",
      "Compare time to first value before and after the experiment.",
    ],
    note: "Pair behavioral evidence with interviews. A number can tell you where to look; a conversation can help explain why.",
  },
  "Competitive examples": {
    tag: "RESEARCH / EVIDENCE",
    body: "A framework for learning from other onboarding experiences.",
    points: [
      "What is the very first decision a new user must make?",
      "How quickly can someone see a useful result?",
      "Which setup steps are genuinely necessary?",
    ],
    note: "Look for patterns, not interfaces to copy. Keep the user problem at the center.",
  },
  "Synthesize interviews": {
    tag: "AGENT / REVIEW BEFORE ACTION",
    body: "Example task brief for a scoped research agent.",
    points: [
      "Read only the interviews selected for this project.",
      "Group observations by theme and retain supporting excerpts.",
      "Distinguish direct evidence from interpretation.",
    ],
    note: "The PM reviews the synthesis and decides what happens next. No agent runs from this website.",
  },
  "Analyze user feedback": {
    tag: "AGENT / REVIEW BEFORE ACTION",
    body: "Example task brief for making sense of customer feedback.",
    points: [
      "Separate reported problems from requested solutions.",
      "Identify repeated jobs, constraints, and moments of friction.",
      "Keep a traceable link back to each source.",
    ],
    note: "Useful feedback starts a better question. It does not automatically become a roadmap commitment.",
  },
  "Review prototype copy": {
    tag: "AGENT / REVIEW BEFORE ACTION",
    body: "Example writing review task.",
    points: [
      "Make the next action clear without explaining the interface.",
      "Use specific, human language.",
      "Flag promises that the product does not yet deliver.",
    ],
    note: "Suggested edits stay as drafts until you choose to use them.",
  },
  "Onboarding narrative": {
    tag: "DRAFTS / WRITING",
    body: "A shorter, example-driven path to a useful first outcome.",
    points: [
      "Start with the job: what did you come here to do?",
      "Show one relevant example instead of an empty workspace.",
      "Let the next step follow naturally from a small win.",
    ],
    note: "Working draft: help a new user accomplish something useful before asking them to understand everything.",
  },
  "In-app guidance": {
    tag: "DRAFTS / WRITING",
    body: "Sample copy directions for the proposed experiment.",
    points: [
      'Welcome: "What would you like to make progress on?"',
      'First step: "Start with an example."',
      'Next step: "Make it your own."',
    ],
    note: "Keep instructions close to the task. Remove copy that repeats what the interface already makes obvious.",
  },
  "Inspect onboarding flow": {
    tag: "BUILD / CODE ANALYSIS",
    body: "An example of a bounded code investigation.",
    points: [
      "Locate the first-run entry point and its dependencies.",
      "Trace the setup steps before the first meaningful action.",
      "Propose the smallest change that tests the idea.",
    ],
    note: "Illustrative analysis only. This website does not access your files, repositories, or terminal.",
  },
  "Find relevant components": {
    tag: "BUILD / CODE ANALYSIS",
    body: "Keep the change focused on the existing product.",
    points: [
      "Find the welcome screen and example picker.",
      "Reuse existing components and accessibility patterns.",
      "Identify focused tests for the first-run path.",
    ],
    note: "A fuller stack means understanding enough of the system to make better decisions, not rebuilding everything yourself.",
  },
  "Suggest quick wins": {
    tag: "BUILD / CODE ANALYSIS",
    body: "Possible small experiments, subject to evidence and review.",
    points: [
      "Defer nonessential setup.",
      "Open a relevant example by default.",
      "Clarify the first action and its expected outcome.",
    ],
    note: "Start with the smallest useful experiment. Learn before committing to a broader rebuild.",
  },
};

function Dialog({ title, children, onClose, className = "" }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-label={title}
      className={`dialog ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-header">
        <span className="mono">{title}</span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

function ResourcePanel({ title, color, icon: Icon, entries, onOpen }) {
  return (
    <section className="resource-panel">
      <h3>
        <span className={`mini-icon ${color}`}>
          <Icon size={14} />
        </span>
        <span>{title}</span>
        <ChevronRight size={14} />
      </h3>
      <div className="resource-entries">
        {entries.map(([name, note]) => (
          <button
            className="resource-entry"
            onClick={() => onOpen(name)}
            key={name}
          >
            <FileText size={17} />
            <span>
              <strong>{name}</strong>
              <small>{note}</small>
            </span>
            <ArrowUp size={12} className="entry-arrow" />
          </button>
        ))}
      </div>
    </section>
  );
}

function Workspace({ view, setView, onOpen, onSearch }) {
  const tabStrip = useRef(null);
  useEffect(() => {
    const strip = tabStrip.current;
    const selected = strip?.querySelector('[aria-selected="true"]');
    if (!strip || !selected) return;
    if (
      selected.offsetLeft < strip.scrollLeft ||
      selected.offsetLeft + selected.offsetWidth >
        strip.scrollLeft + strip.clientWidth
    ) {
      strip.scrollTo({ left: selected.offsetLeft - 8, behavior: "instant" });
    }
  }, [view]);
  const [checks, setChecks] = useState([true, false, false]);
  const [copyStatus, setCopyStatus] = useState("");
  const sidebar = [
    ["Project", Folder],
    ["Research", FileSearch],
    ["Writing", NotebookPen],
    ["Agents", Bot],
    ["Code", Code2],
    ["Tasks", CheckSquare],
    ["Meetings", MessageSquareText],
    ["Memory", BookOpen],
  ];
  const tabs = [
    "Overview",
    "Research",
    "Writing",
    "Agents",
    "Code",
    "Tasks",
    "Meetings",
    "Memory",
  ];
  const code =
    'const firstRun = {\n  startWith: "a relevant example",\n  setup: "only what is needed",\n  nextStep: "one meaningful action"\n};';
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("Example code copied.");
    } catch {
      setCopyStatus("Clipboard unavailable in this browser.");
    }
  }
  function choose(name) {
    setView(name === "Project" ? "Overview" : name);
  }
  return (
    <div className="workspace-window" aria-label="Illustrative Lazo workspace">
      <div className="window-bar">
        <Link2 size={15} aria-hidden="true" />
        <span>LAZO / EXAMPLE PROJECT</span>
        <span className="window-label">LOCAL WORKSPACE</span>
        <button
          className="mobile-workspace-search icon-button"
          onClick={onSearch}
          aria-label="Search example workspace"
          title="Search example workspace"
        >
          <Search size={13} />
        </button>
      </div>
      <div className="workspace-body">
        <aside
          className="app-sidebar"
          aria-label="Example workspace navigation"
        >
          <div className="sidebar-head">
            <span>
              L<span>.</span>
            </span>
            <ChevronDown size={12} />
          </div>
          <button
            className="search-trigger"
            onClick={onSearch}
            aria-label="Search example workspace"
          >
            <Search size={13} />
            <span>Search...</span>
            <Command size={11} />
          </button>
          <nav>
            {sidebar.map(([name, Icon]) => (
              <button
                key={name}
                className={
                  (name === "Project" && view === "Overview") || name === view
                    ? "selected"
                    : ""
                }
                onClick={() => choose(name)}
              >
                <Icon size={15} />
                <span>{name}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-project">
            <span>
              <Layers3 size={12} /> Better onboarding
            </span>
            <button onClick={() => choose("Project")}>
              <Folder size={12} /> Overview
            </button>
            <button onClick={() => choose("Research")}>
              <FileText size={12} /> Research & evidence
            </button>
            <button onClick={() => choose("Writing")}>
              <NotebookPen size={12} /> Drafts
            </button>
          </div>
        </aside>
        <div className="workspace-main">
          <div className="project-heading">
            <span className="eyebrow">PROJECT</span>
            <h2>A better onboarding experience</h2>
          </div>
          <div
            className="workspace-tabs"
            ref={tabStrip}
            role="tablist"
            aria-label="Example project views"
          >
            {tabs.map((tab) => (
              <button
                role="tab"
                aria-selected={view === tab}
                aria-controls="workspace-tab-content"
                id={`view-${tab.toLowerCase()}`}
                tabIndex={view === tab ? 0 : -1}
                key={tab}
                onClick={() => choose(tab)}
                onKeyDown={(e) => {
                  if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
                  e.preventDefault();
                  const i =
                    (tabs.indexOf(tab) +
                      (e.key === "ArrowRight" ? 1 : -1) +
                      tabs.length) %
                    tabs.length;
                  choose(tabs[i]);
                  document
                    .getElementById(`view-${tabs[i].toLowerCase()}`)
                    ?.focus();
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            className="project-content"
            id="workspace-tab-content"
            role="tabpanel"
            aria-labelledby={`view-${view.toLowerCase()}`}
            tabIndex={0}
          >
            {view === "Overview" && (
              <>
                <div className="goal-block">
                  <h3>
                    <Target size={16} /> GOAL
                  </h3>
                  <p>
                    Make it easier for new users to get value in their first
                    week.
                  </p>
                </div>
                <div className="question-block">
                  <h3>
                    <Lightbulb size={16} /> KEY QUESTIONS
                  </h3>
                  <ul>
                    <li>
                      What are the biggest friction points in the first session?
                    </li>
                    <li>How do successful users differ in behavior?</li>
                    <li>
                      What would a simpler, clearer onboarding experience look
                      like?
                    </li>
                    <li>What should we test next?</li>
                  </ul>
                </div>
                <div className="project-footer">
                  <span className="tiny-dot lime" /> A question worth exploring.
                  <span>YOUR CONTEXT, CONNECTED.</span>
                </div>
              </>
            )}
            {view === "Research" && (
              <>
                <div className="content-kicker">
                  <FileSearch size={17} /> RESEARCH & EVIDENCE
                </div>
                <h3 className="view-title">Start with what people need.</h3>
                <p className="view-intro">
                  An example synthesis, with the evidence close at hand.
                </p>
                <button
                  className="evidence-quote"
                  onClick={() => onOpen("User interviews")}
                >
                  <q>
                    I wanted to try something useful before setting everything
                    up.
                  </q>
                  <span>
                    ILLUSTRATIVE INTERVIEW EXCERPT <ArrowRight size={13} />
                  </span>
                </button>
                <div className="insight-line">
                  <span className="tiny-dot lime" />
                  <p>
                    Let new users reach a small win before asking for a big
                    commitment.
                  </p>
                </div>
              </>
            )}
            {view === "Writing" && (
              <>
                <div className="content-kicker">
                  <NotebookPen size={17} /> WORKING DRAFT
                </div>
                <h3 className="view-title">
                  A first step, not a setup project.
                </h3>
                <p className="view-intro">
                  Help a new user complete one meaningful task. Start with a
                  relevant example, make it easy to adapt, and let the rest
                  follow.
                </p>
                <div className="draft-note">
                  <span className="mono">THE PRODUCT BET</span>
                  <p>
                    A useful first outcome will teach us more than a longer
                    onboarding checklist.
                  </p>
                </div>
                <button
                  className="text-link"
                  onClick={() => onOpen("Onboarding narrative")}
                >
                  Read the narrative <ArrowRight size={13} />
                </button>
              </>
            )}
            {view === "Agents" && (
              <>
                <div className="content-kicker">
                  <Bot size={17} /> SCOPED AGENT BRIEF
                </div>
                <h3 className="view-title">A specialist. A clear boundary.</h3>
                <p className="view-intro">
                  Synthesize the selected interviews. Keep the source excerpts.
                  Flag assumptions for review.
                </p>
                <div className="scope-list">
                  <span>
                    <Check size={13} /> Selected project evidence only
                  </span>
                  <span>
                    <Check size={13} /> Draft output for your review
                  </span>
                  <span>
                    <LockKeyhole size={13} /> No actions run from this preview
                  </span>
                </div>
                <button
                  className="text-link"
                  onClick={() => onOpen("Synthesize interviews")}
                >
                  Inspect the brief <ArrowRight size={13} />
                </button>
              </>
            )}
            {view === "Code" && (
              <>
                <div className="content-kicker">
                  <Code2 size={17} /> BUILD / EXPERIMENT SKETCH
                </div>
                <h3 className="view-title">Make the idea tangible.</h3>
                <div className="code-header">
                  <span>first-run.js</span>
                  <button
                    className="icon-button"
                    onClick={copyCode}
                    title="Copy example code"
                    aria-label="Copy example code"
                  >
                    {copyStatus === "Example code copied." ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <pre>
                  <code>{code}</code>
                </pre>
                <span className="code-caption" role="status">
                  {copyStatus ||
                    "Illustrative code, not a production implementation."}
                </span>
              </>
            )}
            {view === "Tasks" && (
              <>
                <div className="content-kicker">
                  <FlaskConical size={17} /> NEXT EXPERIMENT
                </div>
                <h3 className="view-title">Learn something worth knowing.</h3>
                <p className="view-intro">
                  Test a simpler first-run experience before expanding the
                  scope.
                </p>
                <div className="experiment-checks">
                  {[
                    "Define the first meaningful action",
                    "Test a relevant starting example",
                    "Review what changed for users",
                  ].map((text, i) => (
                    <label key={text}>
                      <input
                        type="checkbox"
                        checked={checks[i]}
                        onChange={() =>
                          setChecks((old) =>
                            old.map((v, j) => (j === i ? !v : v)),
                          )
                        }
                      />
                      <span>{text}</span>
                    </label>
                  ))}
                </div>
                <p className="check-progress" aria-live="polite">
                  {checks.filter(Boolean).length} of 3 experiment steps
                  considered
                </p>
              </>
            )}
            {view === "Meetings" && (
              <>
                <div className="content-kicker">
                  <MessageSquareText size={17} /> VIRTUAL JAM / EXAMPLE AGENDA
                </div>
                <h3 className="view-title">Pressure-test the plan.</h3>
                <p className="view-intro">
                  Bring a research, product, and technical perspective to the
                  same question.
                </p>
                <ol className="meeting-list">
                  <li>Which assumption is least supported?</li>
                  <li>What is the smallest useful experiment?</li>
                  <li>What would change our decision?</li>
                </ol>
                <p className="muted-note">
                  An illustrative agenda, not a recorded meeting.
                </p>
              </>
            )}
            {view === "Memory" && (
              <>
                <div className="content-kicker">
                  <BookOpen size={17} /> PROJECT MEMORY
                </div>
                <h3 className="view-title">Keep the why with the work.</h3>
                <p className="view-intro">
                  Evidence, decisions, and open questions stay connected to the
                  project.
                </p>
                <div className="memory-row">
                  <span>Working hypothesis</span>
                  <p>A relevant example could help users reach value sooner.</p>
                </div>
                <div className="memory-row">
                  <span>Still to learn</span>
                  <p>
                    Which starting example best matches the user's real job?
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <aside
          className="workspace-resources"
          aria-label="Example project resources"
        >
          <ResourcePanel
            title="RESEARCH & EVIDENCE"
            color="lime"
            icon={FileSearch}
            onOpen={onOpen}
            entries={[
              ["User interviews", "Key themes and quotes"],
              ["Onboarding analytics", "Drop-off points and activation"],
              ["Competitive examples", "Patterns and opportunities"],
            ]}
          />
          <ResourcePanel
            title="AGENTS"
            color="blue"
            icon={Bot}
            onOpen={onOpen}
            entries={[
              ["Synthesize interviews", "Extract key themes"],
              ["Analyze user feedback", "Find common friction points"],
              ["Review prototype copy", "Suggest improvements"],
            ]}
          />
          <ResourcePanel
            title="DRAFTS & WRITING"
            color="violet"
            icon={NotebookPen}
            onOpen={onOpen}
            entries={[
              ["Onboarding narrative", "Draft v2 / clear value proposition"],
              ["In-app guidance", "Notes and copy ideas"],
            ]}
          />
          <ResourcePanel
            title="CODE & ANALYSIS"
            color="coral"
            icon={FileCode2}
            onOpen={onOpen}
            entries={[
              ["Inspect onboarding flow", "Review current implementation"],
              ["Find relevant components", "Search the codebase"],
              ["Suggest quick wins", "Identify low-effort improvements"],
            ]}
          />
        </aside>
      </div>
    </div>
  );
}

export function App() {
  const page = useRef(null);
  useSectionReveals(page);
  const [view, setView] = useState("Overview");
  const [detail, setDetail] = useState(null);
  const [opened, setOpened] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [policyOpen, setPolicyOpen] = useState(false);
  const resource = examples[opened];
  const matchingResources = Object.keys(examples).filter((name) =>
    `${name} ${examples[name].tag}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="simple-site" ref={page}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="nav-brand" href="#" aria-label="Lazo home">
          <Link2 size={25} strokeWidth={2} aria-hidden="true" /> Lazo
        </a>
        <nav className="simple-nav" aria-label="Main navigation">
          <a className="why-link" href="#mission">
            Why Lazo
          </a>
          <a className="button button-primary" href="#release">
            Get launch updates <ArrowRight size={16} />
          </a>
        </nav>
      </header>
      <main id="main">
        <section
          className="hero"
          aria-labelledby="hero-title"
          aria-describedby="hero-description"
        >
          <div className="hero-intro">
            <div className="hero-heading">
              <p className="simple-launch">
                <span className="tiny-dot coral" aria-hidden="true" /> Launching
                soon
              </p>
              <h1 id="hero-title" className="hero-subtitle">
                <span className="hero-title-word">A doer</span>{" "}
                <em className="hero-title-word">for a thinker!</em>
              </h1>
            </div>
            <div className="hero-invitation">
              <p className="hero-description" id="hero-description">
                Lazo is being built as your PM extension, carrying the legwork
                so you can focus on the decisions and strategy that matter.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#release">
                  Get launch updates <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
              <p className="hero-product-note">
                <span>
                  <Check size={14} aria-hidden="true" /> Free forever
                </span>
                <span>
                  <LaptopMinimal size={14} aria-hidden="true" /> Runs on your
                  own system
                </span>
              </p>
            </div>
          </div>
        </section>
        <section
          className="simple-mission page-section"
          id="mission"
          aria-labelledby="mission-title"
        >
          <PressureStory onExplore={() => setDetail("workspace")} />
          <h2 id="mission-title">
            An extension of you, not another thing to manage
          </h2>
          <div className="mission-summary">
            <div>
              <h3>The problem</h3>
              <p>
                PMs are expected to deliver more, faster, while chasing context
                and stakeholder follow-ups. Lazo is being built to carry that
                legwork.
              </p>
            </div>
            <div>
              <h3>Our mission</h3>
              <p>
                Be the extension that turns a PM's direction into progress,
                handling the legwork while they keep the final say.
              </p>
            </div>
            <div>
              <h3>Our vision</h3>
              <p>
                A PM's ambition should never be limited by what they can carry
                alone.
              </p>
            </div>
          </div>
        </section>
        <ReleaseSection />
      </main>
      <SiteFooter
        onAbout={() => setPolicyOpen(true)}
        onPlaybooks={() => setDetail("playbooks")}
        onFAQ={() => setDetail("faq")}
      />
      {detail === "workspace" && (
        <Dialog
          title="ILLUSTRATIVE WORKSPACE"
          className="workspace-dialog"
          onClose={() => setDetail(null)}
        >
          <Workspace
            view={view}
            setView={setView}
            onOpen={setOpened}
            onSearch={() => {
              setQuery("");
              setSearchOpen(true);
            }}
          />
        </Dialog>
      )}
      {detail === "playbooks" && (
        <Dialog
          title="PM PLAYBOOKS"
          className="support-dialog"
          onClose={() => setDetail(null)}
        >
          <PlaybookSection />
        </Dialog>
      )}
      {detail === "faq" && (
        <Dialog
          title="QUESTIONS & ANSWERS"
          className="support-dialog"
          onClose={() => setDetail(null)}
        >
          <FAQSection />
        </Dialog>
      )}
      {resource && (
        <Dialog title={resource.tag} onClose={() => setOpened(null)}>
          <div className="resource-detail">
            <span className="eyebrow">ILLUSTRATIVE WORKSPACE</span>
            <h2>{opened}</h2>
            <p className="detail-intro">{resource.body}</p>
            <ul>
              {resource.points.map((point) => (
                <li key={point}>
                  <Check size={15} />
                  {point}
                </li>
              ))}
            </ul>
            <p className="detail-note">{resource.note}</p>
            <button className="text-link" onClick={() => setOpened(null)}>
              <ArrowLeft size={14} /> Back to the workspace
            </button>
          </div>
        </Dialog>
      )}
      {searchOpen && (
        <Dialog
          title="SEARCH EXAMPLE WORKSPACE"
          onClose={() => setSearchOpen(false)}
          className="search-dialog"
        >
          <div className="search-box">
            <Search size={20} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find evidence, drafts, or agent briefs..."
              aria-label="Search example resources"
            />
          </div>
          <div className="search-results" aria-live="polite">
            {matchingResources.length ? (
              matchingResources.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSearchOpen(false);
                    setOpened(name);
                  }}
                >
                  <FileText size={17} />
                  <span>
                    <strong>{name}</strong>
                    <small>{examples[name].tag}</small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))
            ) : (
              <div className="no-results">
                <Search size={25} />
                <p>No matching resources.</p>
                <span>Try "interviews", "code", or "writing".</span>
              </div>
            )}
          </div>
          <div className="search-disclaimer">
            Sample project content. No personal files are searched.
          </div>
        </Dialog>
      )}
      {policyOpen && (
        <Dialog title="ABOUT THIS WEBSITE" onClose={() => setPolicyOpen(false)}>
          <div className="resource-detail">
            <h2>A look at what's taking shape.</h2>
            <p>
              Lazo is a workspace for product managers, launching soon. It is
              being built as an extension of you, with your direction and final
              say at the center. Free forever, on your own system.
            </p>
            <p>
              The sample project is fictional. No agents run, no files or
              repositories are accessed. Changes to example checkboxes are
              temporary.
            </p>
            <p>
              Playbook text stays in this browser session and is not sent to a
              server or an AI model. Copy and download happen only when you
              choose them. Closing the playbooks or reloading clears the text.
              Google Fonts supplies the website fonts.
            </p>
            <p>
              The early-interest form submits your details to Google Forms and
              Lazo's private response Sheet for launch and early-access updates.
              It is separate from the local playbook editor.
            </p>
            <p>
              The illustrative workspace is not a released version of Lazo or a
              promise of final functionality. The early-interest form records
              your interest; it does not create a Lazo account or guarantee
              early access.
            </p>
          </div>
        </Dialog>
      )}
    </div>
  );
}
