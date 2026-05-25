# Exception: GitHub Pages security-header gap

## Status

Covered by the team's standing exception. Approved by Tim Dixon on 2026-05-23 in the global wiki. No project-specific sign-off is required.

## Statement

This project relies on the team's standing exception for the GitHub Pages security-header gap. The exception, the headers affected (`X-Frame-Options` and `Permissions-Policy`), the residual-risk acceptance, and the compensating controls are recorded once in the global wiki.

LLBS Braille Name Generator meets every condition the standing exception names: a static front-end of HTML, CSS, and JavaScript; no personal data collected or transmitted by the site; no login, no authenticated session, no cookie; no form that submits data to a server and no action with a side effect; and no external scripts or styles from third-party origins.

Compensating controls in place for this project:

- A `Content-Security-Policy` meta tag in `index.html` restricts scripts to `'self'` (plus `'unsafe-inline'` required for the current single-file inline script, to be removed when ADR 001 is implemented), styles to `'self'` plus `'unsafe-inline'`, and images to `'self'`, `data:`, and `blob:` for the canvas output.
- A `Referrer-Policy` meta tag in `index.html` limits referrer information to `strict-origin-when-cross-origin`.

This pointer file exists so the project's exception ledger remains complete on its own. A reader auditing this project's security posture will find this entry and read the team-wide assessment.

## References

- Decision Record 011 in the global wiki: standing GitHub Pages security-header exception.
- Decision Record 006 in the global wiki: standards for adopted static front-end projects.
