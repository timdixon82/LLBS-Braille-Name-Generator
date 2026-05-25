# LLBS Braille Name Generator

Type a name and get a shareable Grade 1 braille image in seconds — built for Lincoln and Lindsey Blind Society.

## What it does

Supporters and staff of [Lincoln and Lindsey Blind Society (LLBS)](https://www.llbs.co.uk) use this tool to create branded social media images showing a name in Grade 1 (uncontracted) Unified English Braille. The page renders a 1080 x 1080 pixel PNG, generates ready-to-use alt text and post text, and offers a one-tap share sheet.

Everything runs in the browser — no server, no cookies, no uploaded data.

## Using the tool

1. Open the page at <https://timdixon82.github.io/LLBS-Braille-Name-Generator/>.
2. Type a name in the "Name to convert" field and press "Generate braille image".
3. Download the PNG, copy it, or use the share sheet to send it to any app.
4. Add the generated alt text when posting so blind and partially sighted people can access the content.

### Pre-filling via URL

You can share a link that pre-fills and generates a name automatically:

```
https://timdixon82.github.io/LLBS-Braille-Name-Generator/?name=Jane+Smith
```

The `?name=` parameter pre-fills the field and triggers generation on load. The typed name is also preserved in browser history via `history.replaceState`, which is what enables the shareable link. See `docs/decisions/005-braille-translation-posture.md` for the privacy note on browser history.

### What names work

- Letters A to Z and spaces are converted to Grade 1 braille.
- Accented letters (for example é, ñ, ö) are kept in the printed name but reduced to their base letter for the braille dots.
- Numbers, punctuation, and unsupported characters are accepted in the input but ignored during conversion.
- Maximum 30 characters.

## Accessibility

The tool targets WCAG 2.2 AAA. Key provisions:

- Every generated image has machine-readable alt text built automatically.
- The braille breakdown list reads each letter and its dot numbers to screen readers.
- All controls are keyboard-operable with a visible focus indicator.
- The page meets the team's contrast requirements (minimum 7:1 for normal text).

Automated accessibility tests (axe-core, Pa11y) run on every pull request. Manual screen reader testing with VoiceOver and JAWS is required before each release.

## Development setup

Requirements: Node.js LTS.

```
npm ci
npm run lint
```

The lint suite covers HTML (html-validate), CSS (Stylelint), and JavaScript (ESLint). All three must exit 0 before a pull request is merged.

## Braille scope

This tool converts names to Grade 1 (uncontracted) braille — each letter is spelled out dot by dot, with no capital indicators, number indicators, or Grade 2 contractions. This is an intentional decision recorded in `docs/decisions/005-braille-translation-posture.md`. For a full educational braille reference, see the [LLBS Braille Reference](https://github.com/timdixon82/Braille-Reference) project.

## Privacy

Page view counts are collected via [GoatCounter](https://www.goatcounter.com) at `timdixon82.goatcounter.com`. No user content (names, generated images) is transmitted or stored. See `docs/privacy.md` for the full privacy posture.

## Licence

Source code: MIT. The LLBS logo is the property of Lincoln and Lindsey Blind Society and is used with permission. It is not covered by the code licence.
