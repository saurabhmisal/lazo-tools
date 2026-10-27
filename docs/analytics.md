# Website analytics

The GA4 integration uses the public `VITE_GA_MEASUREMENT_ID` repository variable. Without a valid ID, it stays inactive. No Google Cloud billing project is needed.

Lazo has a dedicated **Lazo** Analytics account (`413598303`), **Lazo Website** GA4 property (`560957186`), and web stream (`16212321552`) for `https://lazo.tools/`. Measurement ID: `G-B3WTD82CQ0`. Reporting uses India time and INR. Enhanced Measurement and optional account data sharing were disabled during setup. Open the [Lazo Analytics dashboard](https://analytics.google.com/analytics/web/#/a413598303p560957186/reports/intelligenthome) using an authorized Google account.

## Activation

1. In the intended owner's Google Analytics account, create a separate **Lazo** account and **Lazo Website** GA4 property, then a web stream for `https://lazo.tools/`. Use the owner's reporting timezone and currency.
2. Turn **Enhanced Measurement OFF** on that stream. The site emits its own limited events; automatic form, outbound-link and history events are outside this collection design. Leave Google Signals, advertising features and user-provided data collection off.
3. Set the public GitHub repository variable `VITE_GA_MEASUREMENT_ID` to the stream's real `G-…` ID and rebuild/publish. This is a public identifier, not a password. Local development uses `.env.local`; previews and noncanonical hosts do not collect.
4. In a browser, test no consent, decline, allow, reload, withdrawal and another-tab withdrawal. Before opt-in, there must be no Google tag or Analytics collection requests. After opt-in, check a single `page_view` and the expected `cta_tapped` in Network and GA4 Realtime. Ad blockers can prevent delivery.
5. Confirm the actual request payload excludes form values, playbook text, query strings, fragments and incoming referrers. Check that no automatic form/scroll/outbound events arrive. Test invalid form submission and Google confirmation separately; the website never reports a confirmed signup.

## Events

| Event | Parameters | Meaning |
| --- | --- | --- |
| `page_view` | Fixed canonical page URL and title, empty referrer | One per document after consent |
| `cta_tapped` | `cta_id` from the fixed allowlist | A button/link interaction, not a completed signup |

Allowed CTA IDs: `header_launch_updates`, `hero_launch_updates`, `open_google_form`, `open_playbooks`, `open_faq`. No user ID or custom user properties are set. Google may still process technical connection/device information when the tag is allowed; excluding app-entered content does not make Analytics anonymous.

Consent is separate from launch-update consent and lasts up to 180 days in this browser. Withdrawal blocks subsequent site events and expires GA cookies; it does not erase data already sent. The tag is never loaded before opt-in. Visits without consent are intentionally absent from reports.

## Owner And Setup-Test Exclusion

Open [exclude this browser](https://lazo.tools/?analytics=exclude) once in each browser/profile the owner uses. The exclusion is saved in browser storage and blocks both page views and CTA events before saved consent can activate the tag. It follows that browser across network changes, but not across devices, profiles, private browsing sessions or cleared storage. The footer confirms the exclusion and offers a way to include the browser again; re-including does not automatically grant analytics consent.

All future browser QA should start at [the excluded test URL](https://lazo.tools/?analytics=test), before visiting the ordinary production URL. This also persists exclusion for that browser. Browsers that report WebDriver automation are automatically excluded and cannot opt in. Local/preview hosts remain untracked. Unit tests use a fake browser, never the live Google tag. Do not perform a new production collection test merely to verify UI changes.

If storage is unavailable, the exclusion link still blocks the current visit, but must be used again for future visits. No exclusion parameter is sent to Google. Cross-tab changes immediately block collection in open tabs.

Network-wide exclusion across other devices requires identifying the owner's public IP addresses/ranges and configuring GA internal-traffic rules; a browser exclusion is not an IP filter. Do not guess those addresses or exclude broad networks. Exclusions only affect future collection. Previously collected owner/test events remain in historical reports and cannot be reliably separated without an identifier that was captured at the time.

Automated tests exercise the consent state machine, duplicate prevention and payload restrictions using a fake browser. They do not establish live delivery or replace browser/network verification. Verify delivery in Realtime after deployment and explicit consent; standard reports can take longer to populate.

References: [Google Analytics setup](https://support.google.com/analytics/answer/14183469), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google tag configuration](https://developers.google.com/tag-platform/gtagjs/configure).
