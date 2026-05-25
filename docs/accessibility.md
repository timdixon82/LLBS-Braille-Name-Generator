# Project Accessibility: LLBS Braille Name Generator

This project meets WCAG 2.2 at AAA, interpreted in the global wiki's `accessibility.md`.

This page records only what is specific to this project: its accessibility notes and a pointer to its exceptions.

## Project-specific notes

None beyond the Pa11y ignore register below.

## Pa11y ignore register

`pa11y.json` at the repository root holds temporarily-ignored Pa11y findings. Each entry must be documented here. Remove the entry from `pa11y.json` when the underlying issue is fixed.

| Pa11y code | WCAG criterion | Finding | Status |
|---|---|---|---|
| `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail` | 1.4.6 Contrast Enhanced (AAA) | Deferred pending design-system AAA contrast audit. | Deferred |
| `WCAG2AAA.Principle1.Guideline1_4.1_4_6.G18.Fail` | 1.4.6 Contrast Enhanced (AAA) | Same scope as G17. | Deferred |
| `color-contrast` | 1.4.6 Contrast Enhanced (AAA) | axe 4.11 reports a contrast failure on the decorative arrow glyph (`→`) inside `.llbs-cta`. The element is marked `aria-hidden="true"`, which removes it from the accessibility tree. WCAG 1.4.3 Note 1 explicitly excludes decorative text that is programmatically hidden. This is a known axe limitation: axe checks contrast on rendered glyphs regardless of `aria-hidden` state. | Documented false positive — not a genuine WCAG failure |

## Exceptions

Documented accessibility exceptions for this project are in `exceptions/`. Every exception needs Tim's approval.
