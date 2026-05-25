# LLBS Braille Name Generator

A free, accessible web tool that turns any name into a braille image you can share.

The tool was built for [Lincoln and Lindsey Blind Society (LLBS)](https://www.llbs.co.uk), a charity that has supported people with vision impairment in Greater Lincolnshire for over 100 years. It runs entirely in your browser. Nothing you type is sent to a server.

## What it does

Type a name, press the button, and within a second you have a 1080 by 1080 pixel image showing that name in Grade 1 (uncontracted) Unified English Braille, alongside the LLBS logo. The tool writes the alt text for you so you can copy it straight into a social media post.

This is the fastest way to create a shareable, accessible braille image for LLBS social media, newsletters, or events.

## Who it is for

This tool is designed with blind and partially sighted people in mind. The target audience includes LLBS staff and supporters who want to create braille images for social media, and anyone who wants to show a friend or colleague what their name looks like in braille.

Every part of the tool is designed to be usable with a screen reader, a keyboard, or a touch device.

## How to use it

1. Visit [LLBS Braille Name Generator](https://timdixon82.github.io/LLBS-Braille-Name-Generator/) in any modern browser.
2. Type a name in the "Name to convert" field. Up to 30 characters, letters and spaces only. Numbers and punctuation are ignored.
3. Press "Generate braille image".
4. Download the image, copy it, or use the share sheet to send it to another app.
5. Copy the alt text from the "Alt text" field and add it when you post.

You can also pre-fill a name from a link: add `?name=John%20Smith` to the end of the address. The tool will fill in the name and generate the image straight away.

## What the braille shows

Each letter is shown as Grade 1 (uncontracted) Unified English Braille. This means every letter is spelled out dot by dot, with no abbreviations or contractions. Capital indicators are not included, so the braille shows the lowercase form of each letter.

Accented letters are kept in the printed name but reduced to their base letter for the braille. For example, the name "Renée" prints as "Renée" but brailles as "renee".

## File structure

```
index.html              The tool. A single HTML file that runs in the browser.
assets/
  analytics/
    count.js            Self-hosted GoatCounter analytics script.
docs/                   Project wiki: decisions, accessibility notes, exceptions.
.github/workflows/      Continuous integration, accessibility, security, and release workflows.
package.json            Development tooling (linters). Not served to the browser.
VERSION                 Current release version.
CHANGELOG.md            Release history.
```

## Running it locally

The tool is a plain HTML file with no build step. Open `index.html` directly in a browser, or serve the project root with any local HTTP server.

To run the linters:

```
npm install
npm run lint
```

## Accessibility

The tool is built to meet WCAG 2.2 AAA, the highest level of the Web Content Accessibility Guidelines. It is tested with VoiceOver on macOS and JAWS on Windows.

Key accessibility features include a skip link, labelled form controls, a live status region that announces the result without moving focus, a braille breakdown list that gives screen reader users full access to the dot patterns, and alt text generated automatically for every image.

Accessibility findings and exceptions are recorded in [docs/accessibility.md](docs/accessibility.md).

## Security

This is a static, client-side tool. No data is sent to any server other than the GoatCounter page-view beacon. A Content Security Policy meta tag restricts scripts and styles to the same origin. See [docs/exceptions/github-pages-security-headers.md](docs/exceptions/github-pages-security-headers.md) for the standing GitHub Pages security-header exception.

## Analytics

This tool uses GoatCounter to count page views. GoatCounter records the page path, the referring site, a coarse browser profile, and an approximate country. It does not collect the name you type, any personal data, or any identifying cookie. See [docs/privacy.md](docs/privacy.md) for the full privacy statement.

## Licence

MIT. See [LICENSE](LICENSE).

Copyright 2026 Tim Dixon.
