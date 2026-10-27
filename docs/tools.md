# Lazo Tool Pages

| Tool | Public URL | Current state |
| --- | --- | --- |
| Everyday | https://lazo.tools/everyday/ | Page placeholder |
| Power Chords | https://lazo.tools/power-chords/ | Page placeholder |

These are standalone static HTML entries, so direct visits and reloads work on GitHub Pages without SPA rewrites. Each entry has its own title, description and tool identity. Both currently render `src/ToolPlaceholder.jsx`; their individual pages can be developed later without changing the public URLs.

`src/tools.js` holds the shared public names and slugs. `src/ToolsMenu.jsx` provides the compact navigation from the homepage and tool pages. Public feature descriptions and download claims have intentionally not been added.

The homepage also introduces both tools in a compact "More from Lazo" section before the signup. It uses the same registry and stable page URLs, with simple "Page coming soon" labels until individual pages are developed.

Preserve the existing shared consent and browser/test exclusions when replacing a placeholder. Only approved canonical page identities reach Analytics. Test via the excluded browser or `?analytics=test`, never by creating new production traffic.
