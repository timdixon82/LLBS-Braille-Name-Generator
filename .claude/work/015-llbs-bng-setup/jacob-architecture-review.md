# Jacob: Architecture Review, LLBS Braille Name Generator

## Architecture summary

The repository is a single `index.html` plus a minimal `README.md`, deployed on GitHub Pages. The page is a self-contained static front-end:

- Structure, presentation, and behaviour all inline in one HTML file.
- Behaviour is pure client-side JavaScript with no build step, no framework, and no runtime dependency on any third-party origin.
- The Lincoln & Lindsey Blind Society (LLBS) logo is embedded as a base64 `data:image/png` literal inside the script (line 462, the file's bulk).
- Translation is a hard-coded `BRAILLE_MAP` of Grade 1 (uncontracted) Unified English Braille for the 26 lowercase letters plus space. A `SPECIAL_CHAR_MAP` reduces selected ligatures (`ß` to `ss`, `æ` to `ae`, etc.); other accents are stripped via Unicode NFD plus diacritic removal. Digits and punctuation are silently dropped.
- The image is composed on a hidden 1080x1080 `<canvas>`, exported via `toDataURL('image/png')`, and offered for download, clipboard copy, and `navigator.share` (with iOS-specific fallbacks). A `?name=` query parameter pre-fills and auto-generates.
- An inline base64-encoded profanity blocklist (decoded at startup via `atob`) guards the LLBS brand by rejecting slurs before render.

The shape matches the existing static-front-end pattern from Periodic-Table, Clock-Practice, LLBS, and Braille-Reference.

## Strengths

- True zero-dependency static delivery: no fonts, scripts, or images fetched from third-party origins. The standing GitHub Pages security-header exception (Decision 011) applies cleanly.
- Accessible by design: semantic landmarks, labelled controls, `aria-live` status region, visible focus, descriptive alt text built for every generated image, and explicit reminders to add alt text when sharing.
- Defensive UX: profanity filter (with leetspeak normalisation and asterisk expansion), input length cap (30), graceful clipboard and share fallbacks for iOS Safari, synchronous blob caching to satisfy iOS user-gesture rules.
- Algorithm is transparent and auditable: a 27-entry literal map, easy to verify against the UEB Grade 1 specification.

## Risks

1. **Single-file delivery breaks Decision 006, standard 1.** The team standard mandates splitting adopted single-file projects into HTML, CSS, JS, plus data files. Also blocks dropping `'unsafe-inline'` from CSP.
2. **Inline base64 logo (the long line at 462) is data, not code.** It bloats the HTML, makes diffs unreviewable, prevents browser caching, and is the single largest barrier to a CSP that excludes `data:` from `img-src`. It should become a committed PNG.
3. **Translation algorithm is intentionally lossy.** Grade 1 only, no capital indicators, no number indicators, accented letters reduced to base, digits and punctuation dropped. The "About this tool" disclosure is honest, but this posture should be an explicit ADR rather than implicit in code, especially given the close relationship with the Braille-Reference project.
4. **Profanity filter is best-effort and locale-bound.** Word list is English only, base64-obfuscated (cosmetic, not a security control), and the asterisk expansion is bounded at 200 variants (not a true bound on adversarial input). Acceptable as brand protection, not as a content-safety guarantee.
5. **CSP not yet present.** Sean's setup will add a meta-tag CSP; once the HTML/CSS/JS split lands, that CSP can exclude `'unsafe-inline'`.
6. **No tests, no version manifest, no linter manifest.** Standard adoption gaps; closed by the setup build.
7. **Canvas-rendered text** depends on a font stack ('Avenir Next', etc.) the visitor's device may not have. Rendered PNGs will therefore vary; acceptable but worth noting.
8. **`history.replaceState` writes the entered name into the URL.** Intentional (enables sharing the `?name=` link), but a privacy nuance worth declaring: the visitor's typed name is preserved in browser history.

## Proposed Architecture Decision Records

The setup branch should add five ADRs to the project wiki's `decisions/` folder. All are drafted by Jacob and confirmed by Tim through Sonja.

1. **ADR 001 - Split the single file into separate files.** Pure application of Decision 006, standard 1. Extract `<style>` to `style.css`, the inline `<script>` to `app.js`, and the `BRAILLE_MAP`/`SPECIAL_CHAR_MAP`/`BLOCKED` literals to a small `data/braille-map.js` (or a single `app.js` if the data is small enough to keep with the code). Behaviour-preserving refactor verified by regression.
2. **ADR 002 - No build step, no framework.** The deployed site is the HTML, CSS, and JS in the repository. No bundler, no transpiler, no template engine. Aligns with the team's static-front-end posture and keeps the diff between source and deployed artefact one-to-one.
3. **ADR 003 - Logo is a committed image asset, not an inline data URL.** Move the base64 PNG out of the script and into `assets/llbs-logo.png`, referenced by relative URL from both the page header `<img>` and the canvas via `new Image()` with `crossOrigin` not required (same origin). Improves caching, reviewability, and CSP posture. Note licence and attribution in the README.
4. **ADR 004 - GitHub Pages security-header coverage by standing exception.** This project meets every condition in `docs/exceptions/github-pages-security-headers.md` (Decision 011): static, no personal data, no login, no server-side form, no third-party origins. The project's `docs/exceptions/` folder records a one-paragraph pointer; no per-project risk assessment is repeated.
5. **ADR 005 - Braille translation posture: Grade 1, no indicators, lossy reduction of accents.** State plainly what the algorithm does and does not do. Records the intentional scope (visual demonstration of a name, not braille production), names the limits (no capital indicator, no number indicator, no contractions, accents folded to base letter, digits and punctuation dropped, English-only), and points to the Braille-Reference project as the place where richer UEB coverage lives. This separation of concerns is the architectural relationship: Braille-Reference is the educational reference; this generator is a single-purpose social-share tool.

## Relationship to the larger Braille-Reference project

LLBS-Braille-Name-Generator and Braille-Reference are siblings, not layers. They share a domain (UEB Grade 1) but have different jobs and deliberately different scopes. ADR 005 names the boundary so future feature requests ("can it do contractions?", "can it show capital indicators?") land in Braille-Reference unless the social-share use case genuinely needs them. If the two ever need to share a braille map, that is a deliberate future decision (small shared JSON, vendored into each repository); they are not coupled today and should not be coupled implicitly.

## Cross-cutting candidates

Two patterns are worth Sonja considering for the global wiki:

- **Pattern: client-side image composition for social sharing.** The hidden-canvas plus `toDataURL` plus `navigator.share` plus iOS-Safari synchronous-blob workaround is a reusable shape for any future tool that lets a visitor generate a branded PNG for sharing. Worth a `docs/patterns/canvas-social-share.md` in the global wiki.
- **Pattern: standing brand-safety filter for user-supplied text on charity-branded outputs.** The leetspeak normalisation, base64-list-of-slurs, and bounded asterisk expansion is a reasonable starter shape. Worth a `docs/patterns/brand-safety-input-filter.md` if Tim agrees, with a clear note that it is brand protection, not a content-safety guarantee.

Both are flagged to Sonja for her ingest decision; default remains project-specific.

## Open questions for Tim, batched

- **Q59.** The braille map covers only the 26 letters and space. Should ADR 005 also commit to never adding capital indicators, number indicators, or Grade 2 contractions to this tool, leaving all of that to Braille-Reference? Recommended: A, yes, scope this tool deliberately small.
  A. Yes, freeze scope at Grade 1 letters and space only.
  B. Allow capital and number indicators here, but no contractions.
  C. Open scope to full Grade 2 in this tool.
- **Q60.** Brand-safety filter scope. The filter is English-only and best-effort. Acceptable as is, or should it be tightened or loosened?
  A. Keep as is; document its limits in ADR 005.
  B. Tighten: add a server-side or build-time review step before the page accepts new entries (not currently possible on Pages, would force a hosting change).
  C. Loosen: remove the filter and rely on the user.
  Recommended: A.
- **Q61.** Should the canvas use a font that is committed to the repository (per Decision 006, standard 2 on self-hosted fonts) so the rendered PNG looks the same on every device, or accept device-dependent rendering?
  A. Self-host one display font, fall back to system stack.
  B. Accept device-dependent rendering; document the trade-off.
  Recommended: B for now, A only if Tim wants pixel-consistent shareable images. A licence-permissive font would need sourcing first.
- **Q62.** Should the `?name=` query parameter remain (it enables shareable links) given that it writes the typed name into the browser history via `history.replaceState`? Recommended: A, keep with a one-line note in the README.
  A. Keep as is, note in README.
  B. Keep but stop writing to history.
  C. Remove the parameter.
- **Q63.** Promote the two cross-cutting patterns (`canvas-social-share`, `brand-safety-input-filter`) to the global wiki now, or keep project-specific until a second project needs them?
  A. Promote both now.
  B. Promote canvas-social-share now; keep brand-safety project-specific.
  C. Keep both project-specific until a second use case appears.
  Recommended: B.
