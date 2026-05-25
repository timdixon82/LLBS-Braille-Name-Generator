# Decision 003: LLBS logo stored as a committed PNG, not an inline data URL

- Date: 2026-05-25
- Status: accepted
- Decided by: Team standard (Decision 006, standard 2 in the AgentTeam global wiki)

## Context

The original `index.html` embedded the LLBS logo as a 22 KB base64 data URL string inside the JavaScript, taking up roughly 80 % of the file's size. This made diffs unreadable, blocked browser caching, and forced the Content Security Policy to allow `data:` in `img-src` for the page logo.

## Decision

The base64 string is extracted, decoded, and committed as `assets/llbs-logo.png`. The page `<img id="page-logo">` references it with `src="assets/llbs-logo.png"`. The canvas `logoImg` also loads it from the same path via `logoImg.src = 'assets/llbs-logo.png'`.

## Consequences

- The diff for future logo updates is a binary PNG diff, not a 22 KB base64 line change.
- The browser caches the PNG separately from the page HTML.
- `img-src data:` is still required in the Content Security Policy because the canvas generates PNG data URLs for download and sharing — but the page header logo no longer needs it.
- Attribution: the LLBS logo is the property of Lincoln and Lindsey Blind Society and is used with permission. The README records this.
