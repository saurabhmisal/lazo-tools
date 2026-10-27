# Lazo Tool Pages

| Tool | Public URL | Current state |
| --- | --- | --- |
| Everyday | https://lazo.tools/everyday/ | Page placeholder |
| Power Chords | https://lazo.tools/power-chords/ | Introduction linking to https://powerchords.lazo.tools/ |

These are standalone static HTML entries, so direct visits and reloads work on GitHub Pages without SPA rewrites. Each entry has its own title, description and tool identity. Both currently render `src/ToolPlaceholder.jsx`; their individual pages can be developed later without changing the public URLs.

`src/tools.js` holds the shared public names and slugs. `src/ToolsMenu.jsx` provides the compact navigation from the homepage and tool pages. Public feature descriptions and download claims have intentionally not been added.

The homepage introduces both tools in a compact "More from Lazo" section before signup, with one short description each. Everyday uses its existing app logo and placeholder page. Power Chords uses the selected Loop PC logo, copied unchanged from the approved standalone brand asset, and links directly to https://powerchords.lazo.tools/ from its card and Tools menu. Its Lazo introduction page also has a linked logo and an Explore Power Chords action. Fixed 44px logo slots keep the cards stable as images load.

Preserve the existing shared consent and browser/test exclusions when replacing a placeholder. Only approved canonical page identities reach Analytics. Test via the excluded browser or `?analytics=test`, never by creating new production traffic.

The individual pages reuse the exact homepage descriptions from `src/tools.js` and the shared `ToolLogo` component. Page logos are 64px; homepage logos remain 44px. Nested pages resolve the same local image with a `../` prefix, and their descriptions also match in search/social metadata and the no-JavaScript fallback.
