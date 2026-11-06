# Lazo website standard

Applies to lazo.tools, Everyday, Pencil, Power Chords and the account service, including new public pages.

- Use self-hosted Source Sans 3, normal upright headings at weight 600, restrained tracking and readable body line spacing. Keep product logos authentic.
- Use emerald #2e7d63 (hover #25674f), charcoal #181b19, pearl #f4f5f0 and emerald tint #89d0b2. Panels #202823, muted text #aeb7ae, borders #3c443d. Light illustration surfaces may use pearl with charcoal text.
- Show the shared optional Google Analytics notice and equally accessible Allow / Decline controls. No Google script or collection before permission. Keep a Change control after a choice.
- Use G-B3WTD82CQ0 with fixed canonical page identities and an explicit click allowlist. Never send form details, email addresses, verification tokens, query strings, document names, playbook text or referrers. Private administration pages and offline/local editions are not tracked.
- Preserve owner/test exclusions. The exclusion flag is shared across lazo.tools subdomains; analytics permission is recorded per website. An exclusion always overrides permission.
- Build reusable static consent assets with `npm run build:family`. Copy the generated analytics.js and brand-theme.css to the product landing source; retain the matching brand-type.css and licensed font. Power Chords copies these through its landing builder. The account service explicitly serves these assets and only allows the required Google endpoints.
- Test consent, decline, withdrawal, owner exclusion and canonical payloads before publishing. Check desktop and narrow screens for legible text and wrapping.
