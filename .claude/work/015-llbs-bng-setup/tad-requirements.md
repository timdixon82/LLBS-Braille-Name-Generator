# Requirements: LLBS Braille Name Generator

## What this project is

The LLBS Braille Name Generator is a single-page web tool for Lincoln and Lindsey Blind Society (LLBS). A visitor types a name into a form, and the tool produces a square image showing that name in Grade 1 (uncontracted) Unified English Braille. The visitor can then download the image, copy it, or share it on social media. The tool exists to let supporters and staff create shareable braille images to raise awareness of LLBS and of braille literacy.

The site is a single HTML file hosted on GitHub Pages. It has no server-side code, no database, no cookies, and no external network requests at runtime.

## Functional requirements

### FR-1: Name input

1. The page presents a labelled text input. The label reads "Name to convert".
2. The input accepts letters, accented letters, and spaces. Numbers and punctuation are accepted in the input field but ignored during conversion.
3. The maximum input length is 30 characters, enforced by the `maxlength` HTML attribute.
4. A hint below the field tells the user what characters are accepted and states the 30-character limit.
5. The field carries an `aria-describedby` reference to the hint, so screen readers read the hint alongside the label.
6. A primary "Generate braille image" button submits the form.
7. If the `?name=` URL query parameter is present, the tool pre-fills the field and triggers generation automatically when the logo has loaded.

### FR-2: Name normalisation

1. The tool converts the raw input into a display name: words are title-cased (first letter upper, rest lower), and extra spaces are collapsed.
2. The tool converts the input into a braille string: accented letters are stripped to their base ASCII equivalent (for example, "e" from "e" with an acute accent). The ligatures "ae", "oe", and special characters such as the German sharp-s (which becomes "ss") are expanded. The result is lower-case letters and spaces only.

### FR-3: Profanity filter

1. Before generating an image, the tool checks the normalised input against a blocked-word list.
2. If a match is found, generation is refused and an error message is shown. No image is produced.
3. The filter handles leet-speak substitutions (for example, "3" standing in for "e") and wildcard asterisk characters.

### FR-4: Image generation

1. The tool renders a 1080 by 1080 pixel square PNG image onto an off-screen HTML Canvas element.
2. The image contains, from top to bottom: a navy and teal header bar; the LLBS logo (embedded as a base-64 data URL so no network request is needed); the display name in large bold text; the braille cells for each letter; an explanatory note that braille is read by touch; and the LLBS website address (www.llbs.co.uk) in teal at the bottom.
3. Braille cells are drawn as a 2 by 3 grid. Filled circles represent raised dots. Empty circles show dot positions that are not raised.
4. The cell size scales to fit the length of the name within the canvas width.
5. If the logo has not yet loaded when the user submits, an error message is shown and generation is deferred until loading completes.
6. The page image element and the share image both use the same canvas output, converted to a PNG data URL.

### FR-5: Alt text and share text

1. After generation, the tool automatically produces a plain-English alt text string for the image: "{Name}" written in Grade 1 braille below the Lincoln and Lindsey Blind Society logo. The dots shown would be raised on the page to be read by touch.
2. The alt text is shown in a read-only text area with a "Copy alt text" button.
3. A reminder note, marked as a landmark note with `role="note"`, prompts the user to add alt text before posting.
4. The tool automatically produces a share text string combining the name, the LLBS hashtag, and the alt text, suitable for pasting into a social media post.
5. A character counter below the share text field updates live and warns when the text exceeds 280 characters (the X platform limit).
6. The share text is editable so the user can shorten it before copying.

### FR-6: Download and clipboard actions

1. A "Download PNG" button saves the generated image as a PNG file named "braille-{name}.png".
2. A "Copy image" button copies the image to the clipboard using the Clipboard API.
3. A "Copy post text" button copies the share text to the clipboard.
4. The image and file are cached synchronously after render so action buttons work without async delays.

### FR-7: Native share sheet

1. A "Open share sheet" button triggers the browser Web Share API, sending the PNG file and the share text.
2. If the browser supports file sharing via the Web Share API, the image is shared as a file attachment.
3. If the browser supports text sharing only (not file sharing), the tool falls back to sharing text alone and informs the user.
4. If the Web Share API is not available, the share sheet button is not shown (or is hidden by capability detection).
5. On iOS and iPadOS, the tool shows an additional tip explaining how to save the image to Photos and share from there.

### FR-8: Braille breakdown

1. Below the share section, the tool displays a numbered list showing each letter and the dot numbers that make up its braille cell.
2. Spaces in the name are shown as "(space) — empty cell".
3. The summary line above the list states how many letters the braille contains.

### FR-9: About section and footer

1. A section headed "About Lincoln and Lindsey Blind Society" describes LLBS briefly and includes a labelled call-to-action link to www.llbs.co.uk.
2. The page footer shows the charity name and charity number (1132353).

### FR-10: Accessibility baseline

1. The page has one H1 ("Braille Name Generator"). H2 headings descend in order with no skipped levels.
2. All interactive elements are keyboard-operable and carry a visible focus indicator (3px solid orange outline).
3. Status messages use `role="status"` and `aria-live="polite"` so screen readers announce them without interrupting the user.
4. The canvas element carries `aria-hidden="true"` because the result image and alt text area are the accessible outputs.
5. The logo `img` element carries a meaningful alt attribute ("Lincoln and Lindsey Blind Society").
6. SVG icons inside buttons carry `aria-hidden="true"` because the button label is provided by the adjacent text.

## Acceptance criteria

Each item below is a condition that can be tested as true or false.

- [ ] Typing a name and pressing "Generate braille image" produces a 1080 by 1080 PNG image on screen.
- [ ] The image contains the display name in title case and the correct braille cells for each letter.
- [ ] Entering a name longer than 30 characters is prevented by the input field.
- [ ] Entering a blocked word shows an error message and produces no image.
- [ ] Entering a name containing accented letters produces correct braille for the base letters.
- [ ] The "Download PNG" button saves the image as a PNG file.
- [ ] The "Copy image" button copies the image to the clipboard (on supporting browsers).
- [ ] The alt text field is populated automatically after generation and matches the expected format.
- [ ] The "Copy alt text" button copies the alt text to the clipboard.
- [ ] The share text field is populated automatically after generation and contains the name, hashtag, and alt text.
- [ ] The character counter updates live as the share text is edited, and flags text over 280 characters.
- [ ] The "Open share sheet" button triggers the Web Share API on supporting browsers.
- [ ] Visiting the page with `?name=John` pre-fills the field and generates the image automatically.
- [ ] All interactive elements are reachable and operable with the keyboard alone.
- [ ] The status region announces messages to a screen reader without moving focus.
- [ ] The page passes an automated accessibility check (for example, axe-core) with no critical or serious violations.
- [ ] The page renders without horizontal scrolling at 320px viewport width.
- [ ] The LLBS logo is present in the generated image.
- [ ] The braille breakdown list correctly shows dot numbers for each letter in the input.

## Out of scope

The following items are not covered by this tool and should not be added as part of the project setup.

- Grade 2 (contracted) Unified English Braille. The tool uses Grade 1 only.
- Number or punctuation braille cells. Numbers and punctuation are stripped before generation.
- Capital indicators in the braille output. The tool intentionally omits them for visual simplicity.
- Audio or tactile output. The tool produces images only.
- Server-side processing or user accounts.
- Migration off GitHub Pages.
- Analytics. GoatCounter may be added in the standard setup but is not a feature of the tool itself.

## What good looks like

The tool works first time for any visitor on any modern browser or device. Someone types a name, presses the button, and within a second has an image they can share. The alt text and share text are already written for them, so sharing is accessible by default. The page looks and behaves correctly at any screen size, and every control is usable with a keyboard or a screen reader.

## Open questions for Tim

The items below need Tim's input. All questions are batched here for Sonja to assign Q-numbers and present to Tim.

- Q59 (proposed) — The README currently contains only a title and one-line description with a typo ("Braile" instead of "Braille"). The setup will replace it with an expanded README meeting the team standard. Is there any additional content Tim wants in the README, such as a note about who the intended audience is or how LLBS uses the tool?
- Q60 (proposed) — The page does not currently display a version number. The team standard requires the version to appear in a user-reachable place. Proposed placement is a small, unobtrusive line in the page footer alongside the charity number. Is that acceptable, or does Tim prefer a different location?
- Q61 (proposed) — The profanity filter blocks a list of terms that are embedded in the page source as base-64 encoded strings. This provides minimal obfuscation but is not a security control (any user can decode it). Is Tim content with this approach, or would he prefer the list to be documented and reviewed as a standing decision in the project wiki?
