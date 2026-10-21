import assert from "node:assert/strict";
import test from "node:test";
import {
  extensionBenefits,
  createPlaybook,
  faqs,
  playbooks,
} from "../src/site-content.js";

test("the pitch describes PM support rather than four product stages", () => {
  assert.deepEqual(
    extensionBenefits.map((item) => item.id),
    ["context", "follow-through", "alignment"],
  );
  for (const item of extensionBenefits) {
    assert.ok(item.title.trim() && item.description.length > 50);
    assert.ok(item.outcome.trim());
    assert.ok(!["Research", "Strategy", "Build", "Learn"].includes(item.title));
  }
});
test("extension positioning preserves PM judgment and final decisions", () => {
  assert.match(
    faqs.find((item) => item.id === "extension").answer,
    /final decisions remain yours/,
  );
  assert.match(
    faqs.find((item) => item.id === "ai").answer,
    /decisions are yours/,
  );
  assert.match(faqs.find((item) => item.id === "ai").answer, /final say/);
});
test("each playbook produces a complete distinct Markdown download", () => {
  assert.equal(
    new Set(playbooks.map((item) => item.id)).size,
    playbooks.length,
  );
  for (const item of playbooks) {
    const text = createPlaybook(item.id);
    assert.ok(text.startsWith(`# ${item.title}\n`));
    assert.ok(text.includes(item.question));
    assert.ok(text.includes(item.outcome));
    assert.ok(text.includes(item.guardrail));
    assert.equal((text.match(/^### \d\./gm) || []).length, 4);
    assert.ok(text.includes("not AI-generated research"));
  }
});
test("custom questions and context are included without corrupting the heading", () => {
  const text = createPlaybook(
    "prototype",
    "  How\n\ncan setup improve?  ",
    " Keep existing components. ",
  );
  assert.ok(text.includes("## Product question\nHow can setup improve?"));
  assert.ok(text.includes("## Your context\nKeep existing components."));
});
test("empty questions use the selected default and empty notes omit the context section", () => {
  const text = createPlaybook("experiment", " \n ", "  ");
  assert.ok(
    text.includes(playbooks.find((item) => item.id === "experiment").question),
  );
  assert.ok(!text.includes("## Your context"));
});
test("export enforces the same limits as the editor", () => {
  const text = createPlaybook("discovery", "Q".repeat(500), "N".repeat(2500));
  assert.ok(text.includes("Q".repeat(280)) && !text.includes("Q".repeat(281)));
  assert.ok(
    text.includes("N".repeat(1800)) && !text.includes("N".repeat(1801)),
  );
});
test("unknown playbooks cannot silently export a different template", () => {
  assert.throws(() => createPlaybook("unknown"), /Unknown playbook/);
});
test("FAQ categories are complete and question identifiers are unique", () => {
  assert.equal(new Set(faqs.map((item) => item.id)).size, faqs.length);
  for (const category of ["Product", "Data", "Release"])
    assert.ok(faqs.some((item) => item.category === category));
  for (const item of faqs)
    assert.ok(item.question.endsWith("?") && item.answer.length > 50);
});
