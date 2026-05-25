# Decision Record 001: Project foundations and deferred refactors

## Status

Accepted. Decided during work 015-llbs-bng-setup, 2026-05-23.

## Context

The LLBS Braille Name Generator is a single `index.html` file, adopted by the team and put through the standard setup backfill. The team's standing standards (Decision Record 006) require splitting single-file projects into separate HTML, CSS, and JavaScript files. They also require self-hosting the LLBS logo, which is currently embedded as a base-64 data URL inside the script.

The setup build is scoped to infrastructure: linters, CI, release-please, GoatCounter, and accessibility fixes required by Tim's Q63B and Q65A answers. The file split and logo extraction are not in scope for the setup build because they are larger refactors that carry a risk of breaking the existing page behaviour and are better verified on a dedicated branch.

## Decision

### ADR 001 deferred: file split

Splitting `index.html` into separate HTML, CSS (`style.css`), and JavaScript (`app.js`) files is deferred to a follow-on branch. The split is a pure refactor with no change to behaviour, appearance, or accessibility. Once the split is done, the Content Security Policy can remove `'unsafe-inline'` from `script-src` and `style-src`.

### ADR 002: no build step

The deployed site is the HTML, CSS, and JavaScript in the repository. No bundler, transpiler, or template engine is used. The diff between source and deployed artefact is one-to-one. This is the team's standard for a static front-end with no framework dependency.

### ADR 003 deferred: logo as a committed image asset

Moving the base-64 embedded LLBS logo from the inline script to a committed `assets/llbs-logo.png` is deferred to the same follow-on branch as the file split. The logo is large and makes the HTML diff unreadable; extracting it is the right action, but it is grouped with the file split to keep the setup build minimal.

### ADR 004: GitHub Pages security-header exception

This project qualifies for the team's standing GitHub Pages security-header exception. The exception is recorded at [docs/exceptions/github-pages-security-headers.md](../exceptions/github-pages-security-headers.md).

### ADR 005: Braille translation posture

The generator uses Grade 1 (uncontracted) Unified English Braille for the 26 letters plus space. It intentionally does not include capital indicators, number indicators, or Grade 2 contractions. Accented letters are reduced to their base ASCII equivalent. Digits and punctuation are dropped. This is a deliberate scope decision: the tool is a social-share aid, not a braille production system. The Braille-Reference project is the place for richer UEB coverage.

## Consequences

- The setup pull request on `chore/project-setup` carries linters, CI, accessibility fixes, and analytics but does not split the file.
- The CSP on the setup branch retains `'unsafe-inline'` for script and style because the code is inline.
- A follow-on branch will carry the file split, logo extraction, and the updated CSP.
