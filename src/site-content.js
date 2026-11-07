export const extensionBenefits = [
  {
    id: "context",
    title: "Keep the context close.",
    color: "lime",
    description:
      "Keep the evidence and reasoning beside each decision.",
    outcome: "Less catching up. More clarity.",
  },
  {
    id: "follow-through",
    title: "Leave the legwork to Lazo.",
    color: "coral",
    description:
      "Turn your direction into drafts and next steps to review.",
    outcome: "Less chasing. More momentum.",
  },
  {
    id: "alignment",
    title: "Bring people with you.",
    color: "blue",
    description:
      "Share the decision, its reasons and the next step.",
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
      "Define the problem before choosing a solution.",
    steps: [
      {
        title: "Name the user and the moment",
        text: "Name the user, their goal and where they get stuck.",
      },
      {
        title: "Collect evidence, not just opinions",
        text: "Collect observations, behaviour and source excerpts. Label assumptions.",
      },
      {
        title: "Find the pattern",
        text: "Group recurring problems. Check counterexamples and differences between users.",
      },
      {
        title: "Write the next question",
        text: "Choose one uncertainty to investigate next.",
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
      "Make one product bet testable.",
    steps: [
      {
        title: "Choose the narrowest useful flow",
        text: "Define the start, the user outcome and what is out of scope.",
      },
      {
        title: "Write the acceptance criteria",
        text: "Define what users must be able to do, including error and recovery states.",
      },
      {
        title: "Investigate before rebuilding",
        text: "Check existing components and constraints. Reuse what works.",
      },
      {
        title: "Make it testable",
        text: "Test one realistic task with a user. Label prototype limits.",
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
    purpose: "Decide what you need to learn.",
    steps: [
      {
        title: "State a falsifiable hypothesis",
        text: "State the behaviour you expect to change, and why.",
      },
      {
        title: "Choose signals and guardrails",
        text: "Define the outcome, time window and risks. Record the baseline and data limits.",
      },
      {
        title: "Plan the smallest credible test",
        text: "Choose participants, measurement and review criteria. Check feasibility.",
      },
      {
        title: "Define the decision in advance",
        text: "Set criteria to continue, revise or stop. Separate observations from conclusions.",
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
      "Lazo is a family of free tools for thinking and doing: Pencil, Everyday and Power Chords. You set the direction. The tools help with the work.",
  },
  {
    id: "extension",
    category: "Product",
    question: "What do you mean by an extension of me?",
    answer:
      "Tools that work from your context and direction. Less searching, drafting and chasing. You review the work and make the calls.",
  },
  {
    id: "teams",
    category: "Product",
    question: "Is Lazo meant to replace my team?",
    answer:
      "No. Lazo helps you prepare the context, drafts and updates you share with your team.",
  },
  {
    id: "ai",
    category: "Product",
    question: "Does AI make the product decisions?",
    answer:
      "You make the decisions. AI can help prepare the work; you review it. No agents run in this website’s concept workspace.",
  },
  {
    id: "local",
    category: "Data",
    question: "Does running on my own system mean everything is offline?",
    answer:
      "No. The apps run on your computer. If you connect an external AI service, selected context may go to that provider.",
  },
  {
    id: "website-data",
    category: "Data",
    question: "What happens to text I enter on this website?",
    answer:
      "Playbook text stays in this browser session and clears when you close it or reload. Signup uses a separate account service. Optional Google Analytics measures visits and clicks only with consent; form details and playbook text are excluded. Fonts are hosted by Lazo. Use the footer controls to change analytics preferences.",
  },
  {
    id: "download",
    category: "Release",
    question: "Can I download Lazo now?",
    answer:
      "Yes. Sign up for a product and verify your email. Available downloads start automatically. Pencil and Everyday are unsigned Apple Silicon previews; Windows is not ready yet.",
  },
  {
    id: "free",
    category: "Release",
    question: "Is Lazo free?",
    answer:
      "Yes. Lazo tools are free forever. External AI or other services may charge separately.",
  },
  {
    id: "access",
    category: "Release",
    question: "How do I get started?",
    answer:
      "Choose a tool, enter your name, email and system, then verify your email. Phone is optional. Signup does not subscribe you to marketing.",
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
