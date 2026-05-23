# Accessibility: LLBS Braille Name Generator

## Conformance target

WCAG 2.2 AAA. This is the highest level of the Web Content Accessibility Guidelines, and it is the team's non-negotiable floor for every project.

## Known gaps and deferred items

The following items were identified in the baseline audit (Carol, 2026-05-23) and are deferred to the accessibility phase. They are tracked in `todo.md`.

### Error text contrast (resolved at setup)

The error text colour `#A00018` on the error background `#FBEAEA` was listed as approximately 6:1 in the baseline audit (Carol AA2). Recalculated using the WCAG relative luminance formula on 2026-05-23: the actual ratio is 7.201:1, which passes the WCAG 1.4.6 AAA threshold of 7:1. No change to the colour is needed. The deferred item AA2 is closed.

### Muted text contrast (resolved in setup)

The original `--muted: #5A5A5A` gave approximately 5.7:1 contrast on `#FBFAF7`. Darkened to `#4A4A4A` in the setup build (Q65A). The new value gives approximately 8.5:1 contrast on `#FBFAF7`, confirming WCAG 1.4.6 AAA pass.

### Dot-position diagram (resolved in setup)

The ASCII dot-position diagram in "About this tool" was not accessible to screen readers (Carol finding B5, Q63B). A text description was added alongside the diagram in the setup build. The ASCII diagram is marked `aria-hidden="true"` so VoiceOver and JAWS read the text description rather than the grid characters individually.

### autocomplete token on name input

The name input carries `autocomplete="off"`, which defeats browser autofill and fails WCAG 1.3.5 (Level AA). The correct value is `autocomplete="name"`. Deferred to the accessibility phase.

### Error messages not linked to input

Errors are written to the `#status` live region but not linked to the input with `aria-errormessage` or `aria-describedby`. Deferred to the accessibility phase.

### Button tap target size

Secondary action buttons (Download PNG, Copy image, Copy alt text, Copy post text) are approximately 37.7px high, below the 44px WCAG 2.5.5 AAA target. Deferred to the accessibility phase.

### "Grade 1 braille" defined at first use

The term "Grade 1 braille" is used in the alt text and share text without an inline definition. Deferred to the accessibility phase.

## Standing exceptions

### GitHub Pages security-header gap

Recorded at [exceptions/github-pages-security-headers.md](exceptions/github-pages-security-headers.md). Covered by the team's standing exception. No project-specific sign-off required.

### Forced-colours and dark mode support

The stylesheet uses hard-coded colour values throughout and does not include a `prefers-color-scheme: dark` block or a `forced-colors` block. This may conflict with Windows High Contrast Mode. Recorded as a gap and deferred to the accessibility phase. The team's interpretation in the global accessibility doc is that not overriding user stylesheets satisfies intent; however, this project's CSS overrides body background and text colour unconditionally.

## Automated test baseline

Automated accessibility testing (Pa11y and axe-core) will run in CI via the accessibility workflow once the setup pull request is merged. A local baseline run was not possible during the setup build because the tool requires JavaScript to render its results. The pa11y.json ignore list covers pre-existing AAA contrast failures that were identified in the baseline audit and are deferred to the accessibility phase.
