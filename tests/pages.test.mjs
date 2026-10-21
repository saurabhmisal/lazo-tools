import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import config from "../vite.config.mjs";

test("static assets support a GitHub project path and a custom domain", () => {
  assert.equal(config.base, "./");
  const component = readFileSync(
    new URL("../src/PressureStory.jsx", import.meta.url),
    "utf8",
  );
  for (const name of ["pm-pressure-v2.png", "pm-composed-v2.png"]) {
    assert.ok(component.includes("import.meta.env.BASE_URL}assets/" + name));
    for (const base of [
      "https://saurabhmisal.github.io/lazo-tools/",
      "https://lazo.tools/",
    ]) {
      const url = new URL(`./assets/${name}`, base);
      assert.ok(url.pathname.endsWith(`/assets/${name}`));
      if (base.includes("github.io"))
        assert.ok(url.pathname.startsWith("/lazo-tools/"));
    }
  }
});

test("the Pages workflow publishes only the built client with scoped permissions", () => {
  const workflow = readFileSync(
    new URL("../.github/workflows/pages.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /path: dist\/client/);
  assert.match(workflow, /run: npm run build/);
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /needs: build/);
  assert.match(workflow, /pages: write/);
  assert.doesNotMatch(workflow, /contents: write|pull_request_target/);
  for (const line of workflow
    .split("\n")
    .filter((line) => line.includes("uses:"))) {
    assert.match(line, /@[a-f0-9]{40}\b/);
  }
});

test("production HTML does not use root-relative asset URLs", () => {
  const html = readFileSync(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /src="\.\/assets\//);
  assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
});
