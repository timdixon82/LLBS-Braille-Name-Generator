# Decision 007: Extract pure braille/text helpers to scripts/braille.js for unit testing

- Date: 2026-07-14
- Status: accepted
- Decided by: Team standard (unit test coverage for archetype-B CI bring-up); flagged for Jacob's confirmation

## Context

Decision 002 split the single-file page into `index.html`, `styles/main.css`, and `scripts/app.js`, and explicitly kept `BRAILLE_MAP`, `SPECIAL_CHAR_MAP`, and `BLOCKED` in `app.js`, "because they are small enough to keep with the code." At that time there was no test harness, so testability was not a factor.

The CI archetype bring-up (branch `sean/ci-archetype-bringup`) adds a real Vitest suite. `app.js` has no `export`s and runs DOM-wiring at top-level import time, so it cannot be imported into a test runner directly. The braille-mapping logic — the part of this project with the highest correctness risk — needed to be extracted into a DOM-free module to be unit-testable, following the same incremental multi-file pattern already accepted on the sibling Braille-Reference project (its Decision Record 005).

## Decision

Extract the following pure, DOM-free functions and data from `scripts/app.js` into a new `scripts/braille.js` module: `BRAILLE_MAP`, `BLOCKED`, `normaliseForFilter`, `isProfane`, `asciifyForBraille`, `tidyDisplayName`, `buildAltText`, `buildShareText`, `dataURLToBlob`, and a new pure `buildBreakdown` that returns `{ summary, items }` instead of writing to the DOM directly.

`app.js` imports these from `./braille.js` via a native ES module `import`, no build step. A thin `renderBreakdown` wrapper stays in `app.js` and calls the pure `buildBreakdown` before writing its result into the `<ul>` — this is the one function whose original form mixed pure computation with DOM writes, so it was split rather than moved wholesale.

Everything that touches `document`, `window`, canvas, or a DOM event stays in `app.js`: `render`, `drawCell`, `drawBrailleRow`, `chooseNameFontSize`, `generate`, all event listeners, and the new `renderBreakdown` wrapper.

`scripts/braille.test.js` unit-tests the extracted module directly, including the `BRAILLE_MAP` alphabet checked against the independent Unicode Braille Patterns formula (U+2800 + dot bitmask), not against the map's own output.

This supersedes the "remain in app.js" line in Decision 002 for `BRAILLE_MAP` and `BLOCKED`; `SPECIAL_CHAR_MAP` also moved as it is only used by `asciifyForBraille`. Decision 002's core file split (HTML/CSS/JS) is otherwise unaffected.

## Consequences

- `docs/decisions/006-braille-translation-posture.md`'s note that the blocked-word list is base64-encoded "in `scripts/app.js`" is now inaccurate; it lives in `scripts/braille.js`. This is a location detail only — the encoding, decoding, and brand-protection posture are unchanged.
- No CSP, build-step, or hosting change: `scripts/braille.js` is same-origin, loaded via a relative, extension-qualified `import` specifier, consistent with Decision 003 (no build step).
- This record is flagged for Jacob's architectural confirmation, following the same pattern used when Braille-Reference's equivalent extraction was reviewed and recorded (that project's Decision Record 005). If Jacob's review differs, this record should be updated accordingly.
