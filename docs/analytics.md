# Lazo analytics

GA4 property 560957186, stream G-B3WTD82CQ0, covers the public Lazo, Pencil, Power Chords and account pages. Retired URLs immediately redirect to Pencil and do not create their own analytics events. Private administration and local/automated/test browsers are excluded.

GA4 uses basic consent mode: no Google script or GA request until explicit footer permission. Analytics cookies use lazo.tools so sessions span its subdomains. Ads storage, ad user data, personalization and Google Signals are disabled. Declines, DNT/GPC and owner/test exclusions win. Consent lasts up to 180 days, is shared across subdomains, and can be withdrawn inline. No blocking popup.

Events: page_view once per document, ui_click for links/buttons/disclosures, cta_click for fixed named calls to action. Parameters: canonical page_location/title, product, fixed action_id, element_type/index, safe link_url and selected product. Raw link text, private paths, form values, verification URLs, notes and workspace text are excluded. Internal anchors stay on their canonical document. Campaign source/medium/name/id/term/content accept only short safe UTM labels; never put personal information in campaign labels. External referrers retain origin only; internal subdomains do not become referral sources. No arbitrary URL query or hash is sent.

Campaign example: https://lazo.tools/?utm_source=linkedin&utm_medium=social&utm_campaign=launch. Use Acquisition reports for source/medium/campaign, Pages and screens for page views, and Events for ui_click/cta_click. Event parameters can be inspected in event details; custom reporting dimensions action_id, product, element_type may need registration in GA Admin. This release does not claim those admin dimensions or key-event settings were changed.

The existing first-party daily totals remain separate in account administration (90-day retention). They are not GA4 unique-user/session reports and are never imported into GA4. Consent declines disable both.

Verify with local fake-browser event queues and production excluded-mode checks. Never create fake live users, signups or campaign hits. Browser network/Realtime collection must be observed before claiming that production hits arrived.

## End-to-end verification — 9 November 2026

A labelled test visit was received in GA4 DebugView, including page_view, ui_click and cta_click. Verified action_id hero_launch_updates/open_faq, debug_mode=1, qa_run=lazo_e2e_20261109, canonical page_location, and campaign qa/debug/ga4_e2e. A Developer Traffic/Exclude filter Lazo developer QA exclusion was set Active before the visit, but new filters can take 24–36 hours to propagate. The test also appeared in unfiltered Realtime (one test user). Do not claim it was globally absent from reports.

Saved comparison Real visitors - exclude Lazo QA excludes Session campaign containing ga4_e2e, for processed reports. Realtime does not support that comparison. No data was deleted. Owner exclusion remains active. The temporary debug bypass has been removed; analytics=debug now excludes all collection, like analytics=test. Do not send another production debug test until filter effectiveness is established; use a separate QA property when immediate isolation is required.
