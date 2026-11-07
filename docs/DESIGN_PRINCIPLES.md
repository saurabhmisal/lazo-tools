# Lazo design principles

Approved direction — 7 November 2026. Apply this standard to every Lazo landing page, supporting page, browser workspace and future app screen. Product personality comes from content, composition and illustration, with one shared visual language.

## One family, purposeful surfaces

| Product | Application |
| --- | --- |
| Lazo | Navy wordmark and navigation, generous ivory/neutral space, restrained green primary actions. |
| Pencil | Ivory writing canvas, navy reading text, green actions. Keep notes, sources and writing prominent. |
| Everyday | Deep ink/charcoal surfaces, ivory text, light green actions. Character illustrations provide warmth. |
| Power Chords | Prominent existing PC loop mark, navy and ivory interface, green selected and interactive details. Keep identity in typography and composition. |
| Shared account pages | Calm ivory and navy, readable forms and the same green actions. |

## Palette

- Navy `#172b4d`: words, navigation and structured content on light surfaces.
- Ivory `#f7f5ee`: quiet canvas; panel white `#fffef9`.
- Green `#267057`: primary actions on light surfaces; hover `#1c5844`.
- Deep ink `#17201f`: Everyday shell; dark panels `#202d2a`.
- Mint `#9bd7b5`: actions on dark surfaces, paired with deep ink text.
- Supporting text `#526171` on light surfaces, `#bdc9c2` on dark surfaces.
- Decorative icon colours may vary inside illustrations. Status and meaning must also be conveyed in words/icons, not colour alone.

Use semantic variables in `brand-theme.css` / `family-theme.css`. Never recolour every surface by copying hardcoded colours between products. Do not change established character likeness or redraw a logo as an approximation.

## Typography

Use self-hosted Commissioner throughout the interface: regular 400 body, semibold 600 headings and controls. Avoid synthetic styles and decorative heading italics. Self-hosted Kalam is restricted to illustration annotations; code retains a system monospace face. Both font licenses are retained.

Body text 16–18px, line height 1.6–1.7; secondary descriptions 14–16px. Form fields at least 16px to avoid mobile input zoom. Main reading columns usually 60–72 characters. Headings use fluid sizes and natural wrapping. Never shrink essential instructions to make a composition fit.

## Layout and accessibility

- Design from 320px upward; verify 320, 390, 768, 1280 and 1920px. No horizontal page overflow. Long technical strings wrap or scroll inside their own containers.
- Let grids reflow and text grow. Use stable image/canvas aspect ratios, explicit image dimensions, comfortable gutters and restrained section spacing.
- Primary control targets at least 44×44px with visible keyboard focus. Preserve native labels, semantic headings and keyboard behaviour.
- Normal reading text should achieve at least 4.5:1 contrast; essential boundaries/focus at least 3:1. Test actual pairings, not just swatches.
- Avoid broad button/style overrides that turn quiet navigation and disclosure controls into primary calls to action.

## Character and motion

Keep the existing face, longer messy hair, glasses, baggy green shirt, gold left-ear earring and ring, yellow-strap Apple Watch, white shoes with black tick. Keep one silhouette per frame, consistent proportions and a desk behind the character. Devices and outcomes remain legible.

Use gentle motion, a stable camera and a clear thinking-to-progress story. No rapid pose-cell jumps, shaking, flashing or layered ghost characters. Reserve animation space to avoid layout shifts. Pause offscreen/when hidden, preserve manual pause, provide replay where appropriate, and show a useful still for reduced-motion users. Scale canvas backing resolution to display size and cap the live drawing rate; do not autoplay the heavyweight GIF download as the page renderer.

Illustrations are concepts, not recordings of released capabilities. Preserve those labels and all existing signup/download/consent boundaries.

## Release discipline

Review shared page templates and representative detailed pages, dialogs, forms, menus and workspace states on phones, tablets and desktop. Capture before/after evidence. Publish only after relevant tests and builds pass. A website theme update does not imply that existing downloadable native installers have been rebuilt; carry this standard into their next reviewed release.

## Shared source and reuse

The Lazo website repository owns `src/brand-type.css` and `src/family-theme.css`. Run `npm run build:family` to export the shared styles, reading font/license, analytics consent script and this guide. All product sites use these same exported files, with `data-brand="everyday"` selecting the ink theme. Do not independently invent another palette or font in a product site.
