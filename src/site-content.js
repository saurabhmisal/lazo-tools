export const extensionBenefits = [
  {
    id: "context",
    title: "Keep the context close.",
    color: "lime",
    description:
      "Keep the evidence, reasoning, and open questions connected, so returning to a decision does not mean reconstructing the whole story.",
    outcome: "Less catching up. More clarity.",
  },
  {
    id: "follow-through",
    title: "Leave the legwork to Lazo.",
    color: "coral",
    description:
      "Turn the direction you choose into drafts and next steps you can review. Spend less energy chasing the details and more on moving the work forward.",
    outcome: "Less chasing. More momentum.",
  },
  {
    id: "alignment",
    title: "Bring people with you.",
    color: "blue",
    description:
      "Give stakeholders a shared view of the decision, the reasoning, and what comes next, so collaboration starts from the same understanding.",
    outcome: "Less repetition. Better alignment.",
  },
];

export const playbooks = [
  {
    id: "discovery",
    title: "Find the problem",
    eyebrow: "DISCOVERY",
    color: "lime",
    question: "Why do new users leave before experiencing value?",
    purpose:
      "Separate the problem you can observe from the solution you are assuming.",
    steps: [
      {
        title: "Name the user and the moment",
        text: "Describe who is struggling, what they are trying to achieve, and where the friction appears.",
      },
      {
        title: "Collect evidence, not just opinions",
        text: "Bring together customer observations, relevant behavioral signals, and source excerpts. Mark assumptions separately.",
      },
      {
        title: "Find the pattern",
        text: "Group repeated problems. Look for counterexamples and differences between users who succeed and those who struggle.",
      },
      {
        title: "Write the next question",
        text: "Choose one uncertainty to investigate before committing to a solution.",
      },
    ],
    outcome:
      "A one-page problem brief: user, job, evidence, assumptions, and next research question.",
    guardrail:
      "Do not treat a small set of interviews as a quantified estimate of the whole market.",
  },
  {
    id: "prototype",
    title: "Make the first version",
    eyebrow: "PROTOTYPING",
    color: "blue",
    question: "How could a relevant example make the first session easier?",
    purpose:
      "Turn one product bet into something concrete enough to inspect and challenge.",
    steps: [
      {
        title: "Choose the narrowest useful flow",
        text: "Name the starting point, the desired user outcome, and what is deliberately out of scope.",
      },
      {
        title: "Write the acceptance criteria",
        text: "Describe what someone must be able to do. Include the most important empty, error, and recovery states.",
      },
      {
        title: "Investigate before rebuilding",
        text: "Find existing components, product conventions, and implementation constraints. Reuse what already works.",
      },
      {
        title: "Make it testable",
        text: "Prepare one realistic task and review the flow with a user. Separate prototype behavior from production promises.",
      },
    ],
    outcome:
      "A focused prototype brief: flow, acceptance criteria, constraints, and a usability task.",
    guardrail:
      "A convincing prototype is not evidence that production reliability, security, or accessibility is complete.",
  },
  {
    id: "experiment",
    title: "Test the next bet",
    eyebrow: "EXPERIMENTATION",
    color: "violet",
    question:
      "Does starting with an example help users complete a meaningful first task?",
    purpose: "Decide what you need to learn before deciding what to scale.",
    steps: [
      {
        title: "State a falsifiable hypothesis",
        text: "Connect the proposed change to a specific user behavior and explain why you expect it to change.",
      },
      {
        title: "Choose signals and guardrails",
        text: "Define the primary outcome, measurement window, and potential harms. Record the baseline and any data limitations.",
      },
      {
        title: "Plan the smallest credible test",
        text: "Choose participants, exposure, instrumentation, and review criteria. Check feasibility before choosing a method.",
      },
      {
        title: "Define the decision in advance",
        text: "Write what would justify continuing, revising, or stopping. Keep observations distinct from conclusions.",
      },
    ],
    outcome:
      "An experiment brief: hypothesis, population, measurement, guardrails, and decision criteria.",
    guardrail:
      "A movement in a metric is not automatically a causal result. Review the test design and uncertainty.",
  },
];

export const faqs = [
  {
    id: "what",
    category: "Product",
    question: "What is Lazo?",
    answer:
      "Lazo is a free workspace for product managers, launching soon. It runs on your own system and is being built as an extension of you: connecting context, preparing the next steps, and easing stakeholder coordination. You focus on the decisions and strategy that matter.",
  },
  {
    id: "extension",
    category: "Product",
    question: "What do you mean by an extension of me?",
    answer:
      "Lazo is being designed to work from your direction and support the legwork around it. That means less time chasing context, preparing drafts, and repeating explanations. Your judgment, relationships, and final decisions remain yours.",
  },
  {
    id: "teams",
    category: "Product",
    question: "Is Lazo meant to replace my team?",
    answer:
      "No. Lazo is being built to strengthen collaboration, not replace it. Clearer context, tangible ideas, and better-prepared decisions help you work with design, engineering, and other stakeholders from a shared starting point.",
  },
  {
    id: "ai",
    category: "Product",
    question: "Does AI make the product decisions?",
    answer:
      "No. The decisions are yours. Lazo is being built to work from the direction and boundaries you set; you review the work and keep the final say. The aim is less legwork, not less control. No agents run from this website's illustrative workspace.",
  },
  {
    id: "local",
    category: "Data",
    question: "Does running on my own system mean everything is offline?",
    answer:
      "No. Lazo is being built to run on your own system, but connecting an external AI service may send selected context to that provider. Running locally does not mean every feature works offline.",
  },
  {
    id: "website-data",
    category: "Data",
    question: "What happens to text I enter on this website?",
    answer:
      "The early-interest form sends your email, system preference, update consent, and any optional name or blocker you provide through Google Forms to Lazo's private response Sheet. Response summaries are not public. Playbook text is not submitted to a server or AI model. Closing the playbooks or reloading clears it. Fonts are requested from Google Fonts. Where enabled, optional Google Analytics records visits and selected button clicks after you allow it; form details and playbook text are excluded. Change this choice near the footer.",
  },
  {
    id: "download",
    category: "Release",
    question: "Can I download Lazo now?",
    answer:
      "Not yet. Lazo is launching soon. Join the early-interest list to hear about launch and early access. The system question helps us understand what people use; it is not a promise of platform support.",
  },
  {
    id: "free",
    category: "Release",
    question: "Is Lazo free?",
    answer:
      "Yes. Lazo is free forever and runs on your own system. If you choose to connect an external AI or other service, that provider's usage charges may still apply separately.",
  },
  {
    id: "access",
    category: "Release",
    question: "How can I hear when Lazo launches?",
    answer:
      "Use the early-interest form below. We will use your email for Lazo launch and early-access updates. Joining records your interest; it does not create an account or guarantee an early-access invitation. Google Forms shows the confirmation after your response is saved.",
  },
];

export function createPlaybook(id, question = "", notes = "") {
  const selected = playbooks.find((item) => item.id === id);
  if (!selected) throw new Error("Unknown playbook");
  const heading =
    question.replace(/\s+/g, " ").trim().slice(0, 280) || selected.question;
  const context = notes.trim().slice(0, 1800);
  return `# ${selected.title}\n\nLazo / PM playbook\n\n## Product question\n${heading}\n\n## Intent\n${selected.purpose}\n${context ? `\n## Your context\n${context}\n` : ""}\n## Working steps\n${selected.steps.map((step, i) => `\n### ${i + 1}. ${step.title}\n${step.text}\n`).join("")}\n## Take forward\n${selected.outcome}\n\n## Keep in mind\n${selected.guardrail}\n\n---\nA starting template, not AI-generated research or a completed product decision.\n`;
}
