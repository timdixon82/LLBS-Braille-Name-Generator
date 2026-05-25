# Decision 004: GitHub Pages security-header exception

- Date: 2026-05-25
- Status: accepted
- Decided by: Standing exception (Decision 011 in the AgentTeam global wiki), approved by Tim Dixon 2026-05-23

## Summary

This project qualifies for the standing GitHub Pages security-header exception recorded in the AgentTeam global wiki at `docs/exceptions/github-pages-security-headers.md`.

GitHub Pages cannot deliver `X-Frame-Options` or `Permissions-Policy` as HTTP response headers. The standing exception allows projects to omit these two headers on GitHub Pages, provided the compensating controls listed in the exception are in place.

## Compensating controls in this project

All five conditions of the standing exception are met:

1. The page is static — no server-side form handling, no session management.
2. No personal data is collected, transmitted, or stored by the page itself.
3. No login or authenticated section exists.
4. No third-party origins are loaded at runtime. All assets (CSS, JavaScript, fonts, analytics count.js, the LLBS logo) are served from the same origin.
5. A Content Security Policy meta tag and a Referrer-Policy meta tag are present in `index.html`, as required by the exception.

## No per-project risk assessment required

The standing exception is approved once at the global level. This record is a one-paragraph pointer, not a repeated approval. If this project ever adds a login page, a form that handles personal data, or a third-party script, this record must be updated and the project's security posture re-assessed with Jed.
