import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { faqs } from "../src/site-content.js";
import { interestForm } from "../src/interest-config.js";

let compiler;
let cacheDir;
let page;
let resources;
const plainText = (html) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

before(async () => {
  // Compile JSX for content assertions only; no browser or listening server.
  cacheDir = await mkdtemp(join(tmpdir(), "lazo-copy-tests-"));
  compiler = await createServer({
    cacheDir,
    configFile: false,
    appType: "custom",
    esbuild: { jsx: "automatic" },
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  const { App } = await compiler.ssrLoadModule("/src/App.jsx");
  const { FAQSection, PlaybookSection } = await compiler.ssrLoadModule(
    "/src/SiteSections.jsx",
  );
  page = renderToStaticMarkup(createElement(App));
  resources = {
    faq: renderToStaticMarkup(createElement(FAQSection)),
    playbooks: renderToStaticMarkup(createElement(PlaybookSection)),
  };
});
after(async () => {
  await compiler?.close();
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true });
});

test("hero and metadata use the same punctuated tagline without repeating it in the footer", async () => {
  const headline = page.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g) || [];
  assert.equal(headline.length, 1);
  assert.equal(plainText(headline[0]), "A doer for a thinker!");
  const footer = page.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.doesNotMatch(plainText(footer), /A doer for a thinker!/);
  const metadata = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.match(metadata, /<title>Lazo \| A doer for a thinker!<\/title>/);
  assert.match(
    metadata,
    /property="og:title"\s+content="Lazo \| A doer for a thinker!"/,
  );
  assert.doesNotMatch(metadata, /Imagination,? executed!/);
});

test("navigation stays minimal and supporting resources remain available on demand", () => {
  const header = page.match(/<header\b[\s\S]*?<\/header>/)[0];
  const footer = page.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.match(header, /href="#mission">Why Lazo<\/a>/);
  assert.equal(
    (header.match(/<nav\b[\s\S]*?<\/nav>/)[0].match(/<a\b/g) || []).length,
    2,
  );
  assert.match(footer, />FAQ<\/button>/);
  assert.match(footer, />PM playbooks<\/button>/);
  assert.match(footer, />About &amp; privacy<\/button>/);
  assert.equal((page.match(/Get launch updates/g) || []).length, 3);
  assert.doesNotMatch(page, /id="playbooks"|id="faq"|workspace-window/);
  assert.match(resources.faq, /id="faq"/);
  assert.match(resources.playbooks, /id="playbooks"/);
});

test("the opening section has one reading flow and a single signup action", async () => {
  const hero = page.match(/<section\b[^>]*class="hero"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /aria-describedby="hero-description"/);
  assert.match(
    plainText(hero),
    /Launching soon.*A doer for a thinker!.*Lazo is being built as your PM extension/,
  );
  assert.equal((hero.match(/href="#release"/g) || []).length, 1);
  assert.equal((hero.match(/class="hero-title-word"/g) || []).length, 2);
  assert.doesNotMatch(hero, /<br\s*\/?\s*>/);
  assert.match(plainText(hero), /Free forever Runs on your own system/);
  const css = await readFile(
    new URL("../src/lazo-identity.css", import.meta.url),
    "utf8",
  );
  assert.match(
    css,
    /\.simple-site \.hero-intro\s*\{[^}]*display: flex;[^}]*flex-direction: column;/,
  );
  assert.match(
    css,
    /\.simple-site \.hero-actions \.button\s*\{[^}]*min-height: 48px;/,
  );
  assert.match(
    css,
    /\.simple-site \.hero-product-note\s*\{[^}]*flex-wrap: wrap;/,
  );
});

test("launch copy preserves free software, external costs, and human ownership", () => {
  assert.match(plainText(page), /Lazo is launching soon/);
  assert.doesNotMatch(
    plainText(page),
    /Free, forever|desktop direction|local-first/,
  );
  const free = faqs.find((item) => item.id === "free").answer;
  assert.match(free, /free forever/);
  assert.match(free, /runs on your own system/);
  assert.match(free, /provider's usage charges may still apply separately/);
  assert.match(
    faqs.find((item) => item.id === "ai").answer,
    /you review the work and keep the final say/,
  );
});

test("privacy and release answers distinguish local work from external services", () => {
  assert.match(
    faqs.find((item) => item.id === "local").answer,
    /does not mean every feature works offline/,
  );
  assert.match(
    faqs.find((item) => item.id === "website-data").answer,
    /optional name or blocker/,
  );
  assert.match(
    faqs.find((item) => item.id === "website-data").answer,
    /Closing the playbooks or reloading clears it/,
  );
  assert.match(
    faqs.find((item) => item.id === "access").answer,
    /does not create an account or guarantee/,
  );
  assert.match(plainText(page), /Illustrated concept/);
  assert.match(
    plainText(resources.playbooks),
    /WORKING TEMPLATE \/ NOT AI-GENERATED/,
  );
});

test("the launch page has only three main sections and a short reading path", () => {
  const main = page.match(/<main\b[\s\S]*?<\/main>/)[0];
  assert.equal((main.match(/<section\b/g) || []).length, 3);
  assert.ok(plainText(main).split(/\s+/).length < 250);
  assert.doesNotMatch(
    main,
    /principles-grid|extension-outcomes|closing-section/,
  );
  const ids = new Set(
    [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
  );
  for (const [, target] of page.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `Missing anchor: ${target}`);
  }
});

test("the illustrated story has a stable static fallback and no live-product claims", () => {
  assert.match(page, /class="story-canvas"[^>]*role="img"/);
  assert.match(page, /data-motion="still"/);
  assert.match(page, /data-static-art="composed"/);
  assert.match(page, /--story-duration:12000ms/);
  assert.match(page, /More inputs\. Same deadline\./);
  assert.match(page, /You set the direction/);
  assert.match(page, /You keep the final say/);
  assert.match(page, /Illustrated concept\. Lazo is in development\./);
  assert.match(page, /aria-label="Download animation as GIF"/);
  assert.match(page, /assets\/thinker-scene-poster-v4\.png/);
  assert.doesNotMatch(page, /New_DP\.png/);
  const heroEnd = page.indexOf("</section>");
  assert.ok(page.indexOf('class="pressure-story"') > heroEnd);
});

test("the story separates incoming artifacts from reviewable work and routes flow below the portrait", () => {
  for (const label of [
    "Meeting notes",
    "Feedback",
    "Product ideas",
    "Metrics",
    "Requests",
    "Prototype",
    "MVP",
    "Live survey",
    "Leadership updates",
    "People in the loop",
    "Stakeholders unblocked",
    "Outputs",
  ])
    assert.ok(page.includes(`>${label}</span>`), label);
  assert.equal(
    (page.match(/class="story-input story-motion"/g) || []).length,
    5,
  );
  assert.equal(
    (page.match(/class="story-output story-output-\d story-motion"/g) || [])
      .length,
    6,
  );
  assert.equal(
    (page.match(/class="flow-token flow-token-in-\d story-motion"/g) || [])
      .length,
    5,
  );
  assert.equal(
    (page.match(/class="flow-token flow-token-out-\d story-motion"/g) || [])
      .length,
    6,
  );
  assert.match(page, /Less chasing\. Clearer next moves\./);
  assert.doesNotMatch(page, /story-connection/);
  assert.doesNotMatch(page, />Evidence brief<|>Draft for review<|>Next steps</);
});

test("input and output icons keep their colours in the moving stream", () => {
  const expectedCounts = {
    blue: 4,
    violet: 4,
    cyan: 4,
    amber: 4,
    rose: 4,
    mint: 2,
  };
  for (const [tone, count] of Object.entries(expectedCounts)) {
    assert.equal(
      (page.match(new RegExp("story-color-" + tone + '"', "g")) || []).length,
      count,
      tone,
    );
  }
  assert.equal(
    (page.match(/class="story-source-icon story-color-/g) || []).length,
    5,
  );
  assert.equal(
    (page.match(/class="story-output-icon story-color-/g) || []).length,
    6,
  );
});

test("the PM problem, mission, and vision are distinct and brief", () => {
  const mission = page.match(
    /<section\b[^>]*id="mission"[\s\S]*?<\/section>/,
  )[0];
  const headings = [...mission.matchAll(/<h3>(.*?)<\/h3>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(headings, ["The problem", "Our mission", "Our vision"]);
  const paragraphs = [
    ...mission.matchAll(/<h3>[^<]+<\/h3>\s*<p>([\s\S]*?)<\/p>/g),
  ];
  assert.equal(paragraphs.length, 3);
  for (const [, paragraph] of paragraphs) {
    assert.ok(plainText(paragraph).split(/\s+/).length < 35);
  }
  const problemText = plainText(paragraphs[0][1]);
  assert.match(problemText, /expected to deliver more, faster/);
  assert.match(problemText, /stakeholder follow-ups/);
  assert.match(problemText, /Lazo is being built to carry that legwork/);
  assert.ok(problemText.split(/\s+/).length <= 30);
  const missionText = plainText(paragraphs[1][1]);
  const visionText = plainText(paragraphs[2][1]);
  assert.match(missionText, /Be the extension that turns/);
  assert.match(missionText, /direction into progress/);
  assert.match(missionText, /legwork while they keep the final say/);
  assert.match(visionText, /ambition should never be limited/);
  assert.match(visionText, /what they can carry alone/);
  for (const text of [missionText, visionText]) {
    assert.ok(text.split(/\s+/).length <= 25);
    assert.equal((text.match(/[.!?](?:\s|$)/g) || []).length, 1);
  }
});

test("the compact form preserves Google fields, required consent, and optional context", () => {
  const form = page.match(/<form\b[\s\S]*?<\/form>/)[0];
  assert.ok(form.includes(`action="${interestForm.action}"`));
  assert.match(form, /method="POST"/);
  assert.match(form, /target="_blank"/);
  const names = [...form.matchAll(/\bname="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(names.sort(), Object.values(interestForm.fields).sort());
  assert.match(form, /<input\b[^>]*id="interest-email"[^>]*required=""/);
  const select = form.match(/<select\b[\s\S]*?<\/select>/)[0];
  assert.match(select, /required=""/);
  for (const system of interestForm.systems) {
    assert.ok(select.includes(`value="${system}"`));
  }
  const optional = form.match(/<details\b[\s\S]*?<\/details>/)[0];
  assert.doesNotMatch(optional, /\bopen(?:=|\s|>)/);
  assert.doesNotMatch(optional, /required=/);
  assert.match(optional, /id="interest-name"/);
  assert.match(optional, /id="interest-blocker"/);
  assert.match(form, /<input\b[^>]*type="checkbox"[^>]*required=""/);
  assert.ok(form.includes(interestForm.consent));
  assert.match(form, /Google Forms confirms your submission in a new tab/);
});
