# Decision 001: Split the single-file page into separate HTML, CSS, and JavaScript files

- Date: 2026-05-25
- Status: accepted
- Decided by: Team standard (Decision 006, standard 1 in the AgentTeam global wiki)
- Applied: chore/project-setup branch

## Context

The repository was adopted with a single `index.html` containing all structure, presentation, and behaviour inline. The team's standing standard requires splitting adopted single-file projects into separate files.

## Decision

Extract the inline `<style>` block to `styles/main.css`. Extract the inline `<script>` block to `scripts/app.js`. The `BRAILLE_MAP`, `SPECIAL_CHAR_MAP`, and `BLOCKED` data remain in `app.js` because they are small enough to keep with the code.

The refactor is behaviour-preserving. The page looks and works the same as before.

## Consequences

- The file split unblocks a clean Content Security Policy. Without it, `'unsafe-inline'` would be required in `script-src` and `style-src`. After the split, neither is needed.
- Diffs are now reviewable. The 22 KB base64 logo blob was also extracted to `assets/llbs-logo.png` as part of this setup (see ADR 003).
- The `scripts/app.js` module is loaded with `type="module"`, which defers execution until after HTML parsing — a safe change since the original script was already at the bottom of `<body>`.
