# Release Process: LLBS Braille Name Generator

## Overview

This project follows the team's standard release process for static front-end projects. The process uses release-please to automate version bumps and changelog entries, and GitHub Pages for deployment.

## Branching

All work happens on feature or fix branches. No one commits directly to `main`. Pull requests are opened against `main`, reviewed by the team, and merged only with Tim's express approval.

Branch names follow the team convention: a type prefix followed by a short kebab-case description. For example, `feature/add-number-support` or `fix/contrast-muted-colour`.

## Commit messages

Commit messages must follow the Conventional Commits format. release-please reads them to determine the next version number:

- `fix:` triggers a patch release (1.0.0 to 1.0.1).
- `feat:` triggers a minor release (1.0.0 to 1.1.0).
- A breaking change marked with `!` triggers a major release (1.0.0 to 2.0.0).

## Release-please

The release workflow runs on every push to `main`. release-please opens a release pull request when conventional commits have accumulated. When Tim merges that release pull request, release-please creates a GitHub release, tags the commit, and updates `VERSION` and `CHANGELOG.md`.

## Deployment

The site is deployed on GitHub Pages from the `main` branch. Every push to `main` triggers a new deployment automatically, because GitHub Pages serves the branch directly with no build step.

## Merge gate

The pull request must pass all CI checks before it can be merged:

- CI: HTML, CSS, and JavaScript linters all exit 0.
- Accessibility: Pa11y and axe-core report no WCAG 2.2 AAA violations outside the documented ignore list.
- Security: Semgrep, Trivy, and dependency review pass.
- CodeQL: no code scanning alerts.

Sonja merges only with Tim's express approval given at the time. No one else may merge to `main`.
