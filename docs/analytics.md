# Lazo website counts

Updated 9 November 2026. All public family pages use the shared `src/analytics.js` module. No Google tag loads. Historical GA4 data is unchanged.

## What is counted

The browser sends only an allowlisted canonical public page and fixed action name to `https://accounts.lazo.tools/api/metrics`, with credentials omitted and no referrer. No account identifier, visitor/session ID, cookie identifier, arbitrary URL, query, fragment, form value, note or workspace text is part of the payload. The collector stores daily page/action totals for 90 days. Repeat views count again; these are not unique visitor counts.

The account administration page shows the last 30 days in India time. Website counts are separate from authenticated account download/security records. Hosting providers still process connection information for delivery/security. Short-lived keyed abuse limits are kept separately; IP addresses are not added to the totals.

## Preferences and tests

There is no consent popup or analytics cookie. A small footer control allows an opt-out. Only an explicit preference writes a functional choice cookie/local setting. Earlier declines, owner exclusions, Do Not Track, Global Privacy Control and automated browsers remain excluded. Cross-subdomain opt-out/exclusion cookies stop collection on other family pages; already open tabs recheck on focus. Clearing storage never silently enables an open tab.

Use `?analytics=test` for production QA and `?analytics=exclude` on each owner browser/profile. These exclude that browser across the family; they do not exclude every browser installed on a device or remove historical events. Local previews never collect. Never send synthetic production events to prove collection.

## Build and verification

`npm run build:family` exports the shared script/styles for product sites. PC page builds fingerprint the script. The collector rejects extra fields, unknown pages/events/origins and requests over 1 KB; it uses separate abuse limits. Unit/integration checks cover privacy signals, owner/test links, explicit preferences, canonical payloads, no anonymous sessions/cookies, permissions, expiry and failure tolerance.

This minimal measurement approach reduces stored data. It does not certify compliance in every jurisdiction; public terms and privacy disclosures preserve applicable rights.
