# Brief: 015-llbs-bng-setup

## Summary

Adopt and backfill `timdixon82/LLBS-Braille-Name-Generator`, a small static page that generates a braille name for visitors. The repository currently has a single `index.html` and a short `README.md`. Stack: static front-end on GitHub Pages. This work runs the project-completeness backfill, then proceeds to wiki scaffolding and the setup build. Same shape as the LLBS, Braille-Reference, and timdixon82.github.io adoptions. Setup pending Tim's answers to Q63, Q64, and Q65.

- Status: done
- Branch: chore/project-setup
- Priority: 4
- Blockers: None
- Project: llbs-braille-name-generator
- Project-Name: LLBS Braille Name Generator

## Requirements

No formal requirements exist. Tad reverse-engineers and records the requirements and acceptance criteria during the backfill.

## Routing plan

1. Sonja clones the repository (completed) and creates this work folder.
2. Four-agent backfill in parallel: Tad, Jacob, Jed, Carol.
3. Sonja consolidates and surfaces any questions to Tim.
4. Tad scaffolds the project wiki and the `chore/project-setup` branch.
5. Sean adds the team's standard static-front-end setup (workflows, release-please, lint manifest, VERSION, README, CSP meta tag, self-hosted GoatCounter, the standing GitHub Pages security-header exception pointer).
6. Carol verifies and produces the release checklist.
7. Merge gate; pull request opened; merge only on Tim's express approval.

## Out of scope

- Adding new braille features. The setup adopts what is there; new features are separate work.
- Migration off GitHub Pages.

## Risk and rollback

Risk: a CSP or lint change breaks the existing single-file page.

Rollback: setup runs on `chore/project-setup` only; main untouched until Tim's express approval.

## Definition of done

- [ ] Four-agent backfill complete and recorded in this work folder.
- [ ] Project wiki scaffolded under `docs/`, with the standing GitHub Pages security-header exception pointer in place.
- [ ] VERSION file, expanded README, CSP meta tag, self-hosted GoatCounter using the team-default `timdixon82.goatcounter.com` site.
- [ ] Pinned linter manifest with all three linters exit 0.
- [ ] Five workflow files passing `actionlint`.
- [ ] Carol's test pass and release checklist complete.
- [ ] Pull request opened and the merge gate passes.

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`.
