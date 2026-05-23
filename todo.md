# To Do: LLBS Braille Name Generator

Items tracked here are deferred from the setup phase. Each entry names the source finding and the acceptance criterion for removal.

## Refactoring

- [ ] **ADR 001**: Split `index.html` into separate `style.css` and `app.js` files. Once done, remove `'unsafe-inline'` from the CSP `script-src` and `style-src` directives.
- [ ] **ADR 003**: Extract the base-64 LLBS logo from the inline script into `assets/llbs-logo.png`.

## Accessibility (WCAG 2.2 AAA)

- [ ] **A3 / AA4**: Change `autocomplete="off"` to `autocomplete="name"` on the name input (Carol A3, WCAG 1.3.5 Level AA).
- [ ] **A4**: Add `aria-errormessage="status"` and `aria-invalid="true"` to the input on validation failure; remove both on success (Carol A4, WCAG 3.3.1).
- [ ] **AA3**: Increase secondary button padding to at least `12px 16px` or set `min-height: 44px` (Carol AA3, WCAG 2.5.5).
- [ ] **AAA-3**: Add an inline definition of "Grade 1 braille" at first use in body text and in the `buildAltText` output (Carol AAA-3, WCAG 3.1.3).
- [ ] **AAA-5 / S-10**: Focus ring colour `#FF6F00` achieves approximately 2.79:1 against `#FFFFFF` (white card surface), which is below the WCAG 1.4.11 3:1 non-text contrast threshold. Replace with a darker focus colour, for example `#0A2342` (navy, 15.77:1 against white), which meets all backgrounds (Carol AAA-5, WCAG 2.4.13, S-10 regression suite).
- [ ] **Dark mode / forced colours**: Add a `prefers-color-scheme: dark` block and `forced-colors` media query. Record a documented exception if deferred again (Carol AAA-2).

## Pa11y ignore list maintenance

The `pa11y.json` ignore list covers pre-existing AAA contrast failures. Remove each entry as the corresponding finding is fixed.
