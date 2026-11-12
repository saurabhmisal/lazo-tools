# Lazo

**Imagination, executed.**

Lazo is a family of practical AI tools for people who turn complex problems into shipped products. The focus is on source-linked knowledge, clear decisions, useful automation and human control.

## Explore the products

| Product | Purpose | Explore |
| --- | --- | --- |
| **Pencil** | A local-first workspace for notes, projects, source-linked knowledge and decisions. Its desktop and browser experiences are evolving toward a more capable agent harness. | [Website and demo](https://pencil.lazo.tools/) · [Public site repository](https://github.com/saurabhmisal/pencil-site) |
| **Power Chords** | Independent, open-source agent capabilities and repeatable workflows that help builders move from evidence to useful output. | [Website](https://powerchords.lazo.tools/) · [Source and installation](https://github.com/saurabhmisal/power-chords) |

## How we build

- **Evidence first.** Keep sources, decisions and their context traceable.
- **People stay in control.** Scope permissions and ask before consequential actions.
- **Small and composable.** Prefer clear capabilities over a bloated all-in-one experience.
- **Useful over impressive.** Make the working path obvious, measurable and maintainable.

This repository contains the **Lazo launch website**, not the private Pencil desktop source or the independently maintained Power Chords codebase. Current product capabilities and download requirements are documented in their respective repositories.

## Develop

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Build And Check

```sh
npm run build
npm test
```

The static website is in `dist/client`. The additional server packaging is retained for portability and is not deployed to GitHub Pages. Relative asset URLs support both a project Pages URL and a custom domain.

## Publish

The `Publish Lazo` workflow builds and tests pushes to `main`, then publishes only `dist/client` to GitHub Pages. Pull requests run build and checks without deploying. Actions are pinned to specific revisions; only the deployment job receives Pages write permission.

GitHub Pages manages HTTPS certificates. Custom-domain DNS and HTTPS enforcement are configured in repository Pages settings; no private certificate or API key belongs in this repository.

## Data And Privacy

The interest form submits directly to a Google Form for confirmation. Its response storage and owner/editor links are not included. No signup responses, credentials, source portrait, private development notes, or QA screenshots are part of this repository.

The workspace preview and PM illustration are concepts, not released-capability demonstrations. The current illustration uses a CSS transition; continuous character video remains future work. The site requests fonts from Google Fonts. Playbook content stays in browser memory until closed or reloaded.


## Optional Analytics

GA4 uses a dedicated Lazo property and only loads after a visitor allows analytics. It records visits and selected button clicks, not signup details or playbook text. Without a valid deployment Measurement ID it stays inactive. See [setup, consent, event definitions and verification](docs/analytics.md).


## Lazo design standard

Follow [the shared design principles](docs/DESIGN_PRINCIPLES.md) for palette, Source Sans 3 typography, responsive layout, character identity and accessible motion. The Lazo website owns the shared style source and exports it with `npm run build:family`.
