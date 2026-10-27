import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import config from "../vite.config.mjs";
import { tools } from "../src/tools.js";

test("each Lazo tool has a distinct static entry and placeholder identity", async () => {
  const compiler = await createServer({ configFile: false, appType: "custom",
    esbuild: { jsx: "automatic" }, server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { ToolPlaceholder } = await compiler.ssrLoadModule("/src/ToolPlaceholder.jsx");
    assert.deepEqual(tools.map(tool => tool.slug), ["everyday", "power-chords"]);
    for (const tool of tools) {
      const html = renderToStaticMarkup(createElement(ToolPlaceholder, { tool }));
      assert.match(html, new RegExp(`<h1>${tool.name}</h1>`));
      assert.ok(html.includes(`<p>${tool.description}</p>`));
      if (tool.logo) {
        assert.ok(html.includes(`src="../${tool.logo}"`));
        await readFile(new URL(`../public/${tool.logo}`, import.meta.url));
      } else {
        assert.ok(html.includes(tool.mark));
      }
      assert.ok(html.includes(tool.url ? "Dedicated website" : "Page coming soon"));
      assert.match(html, /href="\.\.\/">Back to Lazo/);
      assert.match(html, /href="\.\.\/everyday\/"/);
      assert.match(html, /href="https:\/\/powerchords\.lazo\.tools\/"/);
      assert.doesNotMatch(html, /🤘/);
      if (tool.url) {
        assert.ok(html.includes(`href="${tool.url}" aria-label="Visit ${tool.name} website"`));
        assert.ok(html.includes(`Explore ${tool.name}`));
      }
      assert.doesNotMatch(html, /github\.com|skills engine|Product Sense Engine|<form\b|Download now/i);
      const entry = await readFile(new URL(`../${tool.slug}/index.html`, import.meta.url), "utf8");
      assert.ok(entry.includes(`<title>${tool.name} | Lazo</title>`));
      assert.ok(entry.includes(`<meta name="description" content="${tool.description}"`));
      assert.ok(entry.includes(`<meta property="og:description" content="${tool.description}"`));
      assert.ok(entry.includes(`data-tool="${tool.slug}"`));
      assert.match(entry, /<noscript>[\s\S]*Back to Lazo/);
      assert.ok(Object.values(config.build.rollupOptions.input).some(path => path.endsWith(`/${tool.slug}/index.html`)));
    }
  } finally { await compiler.close(); }
});

test("built tool URLs have their own HTML and valid nested asset paths", async () => {
  for (const { slug, name } of tools) {
    const html = await readFile(new URL(`../dist/client/${slug}/index.html`, import.meta.url), "utf8");
    assert.ok(html.includes(`<title>${name} | Lazo</title>`));
    assert.match(html, /src="\.\.\/assets\//);
    assert.doesNotMatch(html, /(?:src|href)="\/assets\//);
    for (const [, asset] of html.matchAll(/(?:src|href)="([^\"]+\.(?:js|css))"/g)) {
      await readFile(new URL(`../dist/client/${slug}/${asset}`, import.meta.url));
    }
  }
});
