# Lazo

Imagination, executed!

Lazo is being built as an extension of the product manager: carrying supporting legwork while people keep direction and final say. Free forever, running on your own system. This repository contains the static launch website, not the upcoming product itself.

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
