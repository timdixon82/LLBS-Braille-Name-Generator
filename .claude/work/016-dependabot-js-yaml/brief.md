# Brief: 016-dependabot-js-yaml

## Summary

Resolve the one remaining open Dependabot alert on the repository: a moderate-severity denial-of-service issue in `js-yaml`, a transitive dev dependency in the root `package-lock.json`. Two other alerts (high-severity `adm-zip`, high-severity `form-data`) were already fixed by the v1.8.1 template sync merged in PR #15.

Preamble fields:

- Status: `done`
- Branch: `fix/dependabot-js-yaml` (merged)
- Mockup mode: D (no mockup; dependency bump only, no UI change)
- Priority: 1
- Blockers: None

## Requirements

GitHub Dependabot alert #5: `js-yaml` quadratic-complexity DoS in merge key handling via repeated aliases. Vulnerable range `>= 4.0.0, <= 4.1.1`; fixed in `4.2.0`. Currently resolved to `4.1.1` in `package-lock.json`, pulled in transitively (via `cosmiconfig`, used by lint tooling). Dev dependency only; not shipped to the published site.

## Routing plan

Sean bumps `js-yaml` to a patched version (or updates the parent dependency / adds an override) on a branch. Because this is a dependency/security fix, Jed reviews for security conformance before Carol tests. Carol runs functional and accessibility checks in parallel. Sonja reviews and brings to Tim for the merge decision.

## Out of scope

- The two already-fixed alerts (`adm-zip`, `form-data`) — no action needed, already resolved by PR #15.
- Any application code change. This is a dev-tooling dependency bump only.
- Upgrading other unrelated dependencies.

## Risk and rollback

Risk: bumping a transitive dev dependency could shift lockfile resolution for other packages in an unexpected way and break local lint/build tooling.

Rollback: revert the branch's commit; the dependency change is isolated to `package-lock.json` (and `package.json` if an override is needed), so reverting restores the prior lockfile state with no application-code impact.

## Definition of done

- [x] `js-yaml` resolves to `4.2.0` or later everywhere it appears in `package-lock.json`
- [x] Dependabot alert #5 shows as closed/fixed after the change is merged
- [x] CI (lint, build, accessibility, security workflows) passes on the branch
- [x] Jed confirms no new security exposure introduced
- [x] Carol's functional and accessibility passes both pass

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
