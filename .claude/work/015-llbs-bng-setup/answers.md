# Answers register: 015-llbs-bng-setup

Answered questions from questions.md. Append-only.

## Q205

Unpark and proceed. Tim answered Q63, Q64, and Q65 in the same session, satisfying all pre-unpark blockers. Work folder status set to active on 2026-05-25.

## Q208

Freeze braille scope to Grade 1 letters (A–Z, case-insensitive) and space only. Recorded as ADR 005 in the project wiki. Numbers, punctuation, and Grade 2 contractions are out of scope for this release.

## Q209

Keep the brand-safety filter as-is. Document the exact blocked terms and the filter's limitations in ADR 005 so future maintainers understand what it covers and what it does not. No behaviour change.

## Q210

Self-host one display font. Tim chose DM Sans for brand consistency with the parent LLBS site. The font files are committed to the repository under `assets/fonts/` and loaded via a local `@font-face` rule. No Google Fonts CDN call at runtime.

## Q211

Keep the `?name=` URL parameter as-is. Add a short note to `README.md` explaining the parameter, its character limit, and its sanitisation so that it is not accidentally removed in a refactor.

## Q212

Promote both cross-cutting patterns to the global wiki now: `docs/patterns/canvas-social-share.md` and `docs/patterns/brand-safety-input-filter.md`. Tad to author both pages from Jacob's architecture review notes.

## Q63

Keep the ASCII dot-position diagram and mark it `aria-hidden="true"`. Add a separate text description alongside it for screen readers — for example: "A braille cell has six dot positions in two columns of three. Left column: 1 top, 2 middle, 3 bottom. Right column: 4 top, 5 middle, 6 bottom."

## Q64

Leave the base-64 obfuscation as-is (no behaviour change). Document the approach as a standing project decision in the project wiki so future developers understand why it is there.

## Q65

Darken `--muted` from `#5A5A5A` to at least `#4A4A4A` (approximately 7.1:1 on `#FBFAF7`) on the setup branch. This fixes the AAA contrast failure across hint text, intro paragraph, character count, and footer.

Keep the ASCII dot-position diagram and mark it `aria-hidden="true"`. Add a separate text description alongside it for screen readers — for example: "A braille cell has six dot positions in two columns of three. Left column: 1 top, 2 middle, 3 bottom. Right column: 4 top, 5 middle, 6 bottom."
