# Baseline WCAG 2.2 AAA Audit: LLBS Braille Name Generator

Audit date: 2026-05-23. Auditor: Carol. Method: code inspection of `index.html`. No automated tool run was possible in this session; findings are based on static analysis of markup, CSS, and JavaScript.

## UI Surfaces Audited

- Page header: logo image and H1 heading.
- Name-entry form: label, hint paragraph, text input, submit button.
- Status live region: error, success, and info message states.
- Result section: generated braille image, download and copy buttons, alt-text textarea, share-text textarea, character counter, share-sheet button, braille breakdown list.
- "About LLBS" informational section.
- "About this tool" details/summary disclosure widget.
- Page footer.

## Level A Findings (must fix before release)

### A1 — Result image has an empty alt at parse time (1.1.1 Non-text Content)

Line 199: `<img id="result-img" alt="">`. The alt attribute is set dynamically at line 503 after generation. At parse time, before any interaction, the element carries an empty alt string. If a screen reader user navigates to the image element before generating a name, they hear nothing. The dynamic update at line 503 is correct in principle, but the initial empty string is misleading rather than decorative (an empty alt signals "decorative" in the accessibility tree). The element should carry `aria-hidden="true"` initially and have that removed, or the section should remain `hidden` until generation, which it does. Because the `<section id="result">` is `hidden` until generation, assistive technology will not reach this element in practice before a name is generated; this is a low-risk finding but technically fails 1.1.1 on the initial DOM.

Severity: low. The `hidden` attribute on the parent section mitigates real-world impact, but the pattern should be documented.

### A2 — No skip link or bypass mechanism (2.4.1 Bypass Blocks)

There is no skip link and no landmark-based bypass to the main content. The page has a `<main>` element, which provides the landmark, but there is no skip link pointing to it. VoiceOver and JAWS users can navigate by landmark, so the landmark alone is sufficient for experienced users. However, WCAG 2.4.1 requires a mechanism for all keyboard users, including those not using a screen reader. A skip link is the standard fix.

Severity: medium.

### A3 — Input autocomplete token is switched off (1.3.5 Identify Input Purpose, Level AA)

Line 190: `autocomplete="off"`. The input accepts a person's name. WCAG 1.3.5 (Level AA) requires that inputs collecting personal information use the correct autocomplete token. The correct value here is `autocomplete="name"`. Setting `off` actively defeats browser autofill and is contrary to the criterion. The profanity filter does not require blocking autofill; the filter runs on submission, not on fill.

Severity: medium. This is a Level AA failure.

### A4 — Error messages are not programmatically associated with the input (3.3.1 Error Identification)

Errors are written to `#status` (line 195, `role="status" aria-live="polite"`). The live region announces the error to screen reader users, which is good. However, the error message is not linked to the input using `aria-errormessage` or by updating `aria-describedby`. A screen reader user who returns focus to the input after hearing an error message cannot re-read the current error from the input itself. The fix is to add `aria-errormessage="status"` to the input and set `aria-invalid="true"` when validation fails, then clear both on success.

Severity: medium.

## Level AA Findings (must fix before release)

### AA1 — Muted text colour fails AAA contrast on background (1.4.6 Contrast Enhanced)

`--muted: #5A5A5A` on `--bg: #FBFAF7` yields a contrast ratio of approximately 5.7:1. WCAG 1.4.6 AAA requires 7:1 for normal text and 4.5:1 for large text. Affected elements include:

- `.byline` (line 51, `font-size: 0.9rem`, `color: var(--muted)`)
- `p.intro` (line 101, `color: var(--muted)`)
- `.hint` elements (line 104, `font-size: 0.875rem`, `color: var(--muted)`)
- `.char-count` (line 164, `font-size: 0.82rem`, `color: var(--muted)`)
- `footer` (line 170, `font-size: 0.82rem`, `color: var(--muted)`)

The hint and char-count text at sub-14px sizes are especially problematic because they combine a failing contrast ratio with small rendering size.

Fix: darken `--muted` to at least `#4A4A4A` (approximately 7.1:1 on `#FBFAF7`) or use `--text: #1A1A1A` for informational copy that needs to be readable.

Severity: high. Affects multiple surfaces including the usage hint that explains acceptable input.

### AA2 — Error state colour (`#A00018`) on error background (`#FBEAEA`) is approximately 6:1 (1.4.6)

The error text colour `#A00018` on `#FBEAEA` is approximately 6:1, below the AAA threshold of 7:1. Because error messages are the primary feedback mechanism for blind users, this is a meaningful gap.

Fix: darken the error text to `#8C0016` or similar to reach 7:1.

Severity: medium.

### AA3 — Secondary buttons do not reliably meet 44 by 44 CSS pixel tap target (2.5.5 Target Size Enhanced)

The base button style (line 115) is `padding: 10px 16px` at `font-size: 0.92rem`. At 16px base, line-height 1.2, the computed height is approximately 10 + (0.92 * 16 * 1.2) + 10 = approximately 37.7px, below the AAA 44px target. Only `button.primary-large` (padding 13px top/bottom) approaches the threshold. The many secondary action buttons (Download PNG, Copy image, Copy alt text, Copy post text) are undersized.

Fix: increase secondary button padding to at least `12px 16px`, or set `min-height: 44px`.

Severity: medium. Particularly relevant for low-vision users who may also use touch.

## Level AAA Gaps

### AAA-1 — No `prefers-reduced-motion` media query

There are no CSS animations or transitions declared, so there is nothing to suppress. This is a pass by absence. No action needed.

### AAA-2 — No `prefers-color-scheme` or `forced-colors` support

The stylesheet uses hard-coded colour values throughout. It does not include a `prefers-color-scheme: dark` block or a `forced-colors` block. WCAG 1.4.8 Visual Presentation asks that users can select foreground and background colours. The team's interpretation in `docs/accessibility.md` is that respecting the operating system and not overriding user stylesheets satisfies intent; however, the current CSS overrides body background and text colour unconditionally, which may conflict with Windows High Contrast Mode.

Recording as a gap for the exceptions register rather than a blocking issue, since the team's documented position accepts this with a noted exception.

### AAA-3 — "Grade 1 (uncontracted) Unified English Braille" is jargon not defined at first use in body text (3.1.3 Unusual Words)

The phrase appears in the "About this tool" disclosure widget (line 253). The body of the page uses "Grade 1 braille" in the alt text (line 439) and share text (line 442) without defining it. A first-time user who is not familiar with braille grades will not know that Grade 1 means uncontracted letter-by-letter braille as distinct from the contracted Grade 2. The intro paragraph (line 185) explains braille generally but does not explain grades.

Fix: add a brief inline definition at first use, for example: "Grade 1 braille (where each letter is spelled out dot by dot, without abbreviations)".

### AAA-4 — No `autocomplete="name"` (see also A3 above, Level AA criterion 1.3.5)

Covered under A3.

### AAA-5 — Focus appearance: the focus ring may not meet 2.4.13 enhanced threshold on all surfaces

`outline: 3px solid #FF6F00` is applied globally. The focus-ring colour `#FF6F00` on `#FBFAF7` background must meet a 3:1 contrast against both the component's unfocused colour and the adjacent background. On the white card background `#FFFFFF`, `#FF6F00` yields approximately 3.1:1 — which is on the boundary. On input borders (`--navy: #0A2342`), the ring colour must also contrast 3:1 against the border. This is likely marginal and should be verified with a live rendering test.

Recommendation: increase the focus ring to `4px` and verify contrast against all adjacent surfaces.

## Braille-Specific Accessibility Findings

### B1 — Result image: accessible name is set dynamically and is descriptive — pass

At line 503, `resultImg.alt` is set to the output of `buildAltText()` (line 438). The generated string, for example `'"Jane" written in Grade 1 braille below the Lincoln & Lindsey Blind Society logo. The dots shown would be raised on the page to be read by touch.'`, is descriptive and meaningful. A screen reader user who reaches the image element after generation will hear a useful description. This is the right pattern for a tool of this type.

### B2 — Status live region announces the result — pass

Line 195: `<div id="status" role="status" aria-live="polite">`. After generation, line 510 writes a success message including the display name. The live region fires on `textContent` update, so VoiceOver and JAWS will announce the result without the user moving focus. The `downloadBtn.focus()` call at line 519 also moves focus to the first action button, which is good for keyboard users.

### B3 — Braille breakdown is text-accessible — pass

The ordered list at line 241 carries `aria-label="Letter by letter braille breakdown"`. Each list item is built at runtime (line 449) with the letter name and its dot numbers as a plain text string, for example "J — dots 2 4 5". This gives a screen reader user full access to the braille content without seeing the visual glyph image. This is the most important accessibility provision in the tool for its target audience and it is implemented correctly.

### B4 — The term "Grade 1 braille" is used without inline definition in announced text (gap, see AAA-3)

The alt text and share text both use "Grade 1 braille". A sighted user can expand "About this tool" to read the definition. A screen reader user who copies the alt text for use on social media will broadcast a term their followers may not understand. Consider adding "(uncontracted)" after "Grade 1 braille" in the `buildAltText` output.

### B5 — The visual dot-position diagram in "About this tool" is not accessible (1.1.1)

Lines 255 to 258: the braille cell dot-numbering diagram is rendered as preformatted text with `&middot;` characters and `<br>` line breaks. This reads as a sequence of dots and numbers without meaningful structure in a screen reader. The pattern "1 dot 4 / 2 dot 5 / 3 dot 6" is not self-explanatory aurally.

Fix: replace with a text description, for example: "A braille cell has six dot positions arranged in two columns of three. The left column is numbered 1 at the top, 2 in the middle, and 3 at the bottom. The right column is numbered 4 at the top, 5 in the middle, and 6 at the bottom."

### B6 — Logo image has a non-empty alt but its `src` is initially empty (1.1.1)

Line 181: `<img id="page-logo" src="" alt="Lincoln &amp; Lindsey Blind Society">`. The `src` is set to the embedded base64 data URL at line 464 via JavaScript. Before JavaScript executes, the image element exists in the DOM with an empty `src` and a non-empty `alt`. Most browsers will not render a broken image icon when `src` is empty, but some may. Screen readers will still expose the alt text, so the name is correct. The pattern is acceptable but the initial empty `src` is unusual. No blocking issue.

## Recommended Deferred Items

1. Add a `prefers-color-scheme: dark` block and a `forced-colors` media query for Windows High Contrast Mode support. Record a documented exception in `docs/exceptions/` if deferred.
2. Verify the 2.4.13 focus-ring contrast ratio in a live browser against all adjacent surfaces.
3. Run axe-core and Pa11y in the build pipeline once the setup branch includes workflow files, to catch any issues not visible by code inspection alone.
4. Commission manual screen reader testing on VoiceOver and JAWS once the setup branch is merged to confirm the live-region timing and the braille breakdown announcement behaviour.

## Open Questions

Q59 — The page currently uses `autocomplete="off"` on the name field. The brief says no new features are in scope for this setup adoption. Should the team fix the `autocomplete="name"` issue now on the `chore/project-setup` branch, or log it as a known gap for a follow-on ticket? Recommended: fix now (a one-line change with no risk of breaking existing behaviour).

Q60 — Should the muted colour (`--muted: #5A5A5A`) be darkened to meet 7:1 AAA contrast as part of this setup adoption, or deferred to a future visual-design pass? The change affects hint text, the intro paragraph, the char-count, and the footer. Recommended: fix now, since contrast is a baseline requirement for the target audience.

Q61 — The dot-position diagram in "About this tool" (lines 255-258) is a visual-only representation. For a braille tool serving blind and partially sighted users, replacing it with a text description seems clearly necessary. Should this fix be included in the setup branch? Recommended: yes.
