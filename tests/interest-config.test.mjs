import test from "node:test";
import assert from "node:assert/strict";
import { interestForm } from "../src/interest-config.js";
import { faqs } from "../src/site-content.js";

test("interest intake uses the verified Google Form, not a public response Sheet", () => {
  const action = new URL(interestForm.action);
  assert.equal(action.origin, "https://docs.google.com");
  assert.match(
    action.pathname,
    /^\/forms\/u\/0\/d\/e\/1FAIpQLScR04CQMXzgAhlYP0BEC64KJhW7b09PRaMr71i5wflsh20rCQ\/formResponse$/,
  );
  assert.match(interestForm.url, /\/viewform$/);
  assert.equal(new Set(Object.values(interestForm.fields)).size, 5);
  for (const field of Object.values(interestForm.fields))
    assert.match(field, /^entry\.\d+$/);
  assert.equal(
    interestForm.consent,
    "Email me about Lazo launch and early-access updates.",
  );
});

test("system preference includes alternatives and is not advertised as support", () => {
  assert.deepEqual(interestForm.systems, [
    "Windows",
    "macOS",
    "Linux",
    "Other",
    "Not sure yet",
  ]);
  assert.doesNotMatch(
    faqs.map((item) => item.answer).join(" "),
    /initial platform|macOS|Windows|Linux|Pricing has not/,
  );
  assert.match(
    faqs.find((item) => item.id === "download").answer,
    /not a promise of platform support/,
  );
});

test("launch and privacy copy distinguish free software, interest data, and local playbooks", () => {
  assert.match(faqs.find((item) => item.id === "free").answer, /free forever/);
  assert.match(
    faqs.find((item) => item.id === "website-data").answer,
    /private response Sheet/,
  );
  assert.match(
    faqs.find((item) => item.id === "access").answer,
    /does not.*guarantee/,
  );
});
