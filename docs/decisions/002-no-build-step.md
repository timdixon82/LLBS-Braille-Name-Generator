# Decision 002: No build step, no framework

- Date: 2026-05-25
- Status: accepted
- Decided by: Team standard (static front-end stack standard)

## Context

The page is a self-contained client-side tool with a single HTML entry point. No backend exists and no server-side rendering is needed.

## Decision

The deployed site is the HTML, CSS, and JavaScript in the repository. No bundler, no transpiler, no template engine. The code that ships is the code in `index.html`, `styles/main.css`, and `scripts/app.js`.

## Consequences

- The diff between source and deployed artefact is one-to-one. What is reviewed is what runs.
- Dependabot updates only affect development tooling (linters). No runtime dependency graph exists.
- If the tool ever needs a build step (for example, to code-split a growing script or to use TypeScript), a new decision record replaces this one.
