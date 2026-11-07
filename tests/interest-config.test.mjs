import test from "node:test";
import assert from "node:assert/strict";
import { interestForm } from "../src/interest-config.js";
import { faqs } from "../src/site-content.js";

test("legacy interest configuration retains its historical Google Form identifiers", () => {
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

test("system messaging keeps Windows availability distinct from signup", () => {
  assert.deepEqual(interestForm.systems, [
    "Windows",
    "macOS",
    "Linux",
    "Other",
    "Not sure yet",
  ]);
  assert.doesNotMatch(
    faqs.map((item) => item.answer).join(" "),
    /initial platform|Pricing has not/,
  );
  assert.match(
    faqs.find((item) => item.id === "download").answer,
    /Windows is not ready yet/,
  );
});

test("signup and privacy copy distinguish account information from local work", () => {
  assert.match(faqs.find((item) => item.id === "free").answer, /free forever/);
  assert.match(
    faqs.find((item) => item.id === "website-data").answer,
    /separate account service/,
  );
  assert.match(
    faqs.find((item) => item.id === "access").answer,
    /verify your email/i,
  );
});
