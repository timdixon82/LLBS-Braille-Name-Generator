# GitHub actions log

- [2026-07-19 13:25:25] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator status
- [2026-07-19 13:25:31] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator checkout -b fix/dependabot-js-yaml
- [2026-07-19 13:25:45] Bash | pwd; git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator status
- [2026-07-19 13:25:52] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator diff --stat package-lock.json
- [2026-07-19 13:25:55] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator diff package-lock.json
- [2026-07-19 13:26:18] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator add package-lock.json
- [2026-07-19 13:26:22] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator commit -m "$(cat <<'EOF'
fix: bump js-yaml to 4.3.0 to resolve Dependabot alert #5

Resolves the moderate-severity quadratic-complexity DoS in js-yaml's
merge key handling (vulnerable range >= 4.0.0, <= 4.1.1). js-yaml is
a transitive dev dependency pulled in via cosmiconfig for lint
tooling; `npm update js-yaml` alone was sufficient to move the
resolved version, no package.json override was needed.
EOF
)"
- [2026-07-19 13:26:28] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator push -u origin fix/dependabot-js-yaml
- [2026-07-19 13:26:36] Bash | gh pr create --repo timdixon82/LLBS-Braille-Name-Generator --base main --head fix/dependabot-js-yaml --title "fix: bump js-yaml to 4.3.0 to resolve Dependabot alert #5" --body "$(cat <<'EOF'
## Summary

- Resolves Dependabot alert #5: moderate-severity quadratic-complexity denial-of-service in `js-yaml`'s merge key handling via repeated aliases (vulnerable range `>= 4.0.0, <= 4.1.1`, fixed in `4.2.0`).
- `js-yaml` is a transitive dev dependency pulled in via `cosmiconfig`, used only by lint tooling. It is not shipped to the published site.
- `npm update js-yaml` moved the resolved version from `4.1.1` to `4.3.0` without needing a `package.json` `overrides` entry — cosmiconfig's own dependency range already permitted the newer version.

## Verification

- `package-lock.json` now resolves `js-yaml` to `4.3.0` (confirmed via grep; only two occurrences of `js-yaml` remain in the lockfile, the version-range declaration and the resolved package entry).
- `npm run lint` (html-validate, stylelint, eslint) passes clean.
- `npm test` (vitest) passes: 53/53 tests.
- No test update accompanies this change: it is a dev-tooling dependency bump only, with no application code or behaviour change (carve-out 1/2 in Sean's test-discipline rules).

## Test plan

- [x] `js-yaml` resolves to `4.3.0` in `package-lock.json`
- [x] `npm run lint` passes
- [x] `npm test` passes (53/53)
- [ ] Jed: confirm no new security exposure introduced
- [ ] Carol: functional and accessibility passes
EOF
)"
- [2026-07-19 13:27:14] Bash | gh pr diff 16 --repo timdixon82/LLBS-Braille-Name-Generator
- [2026-07-19 13:27:15] Bash | gh pr view 16 --repo timdixon82/LLBS-Braille-Name-Generator --json title,body,files,additions,deletions,commits
- [2026-07-19 13:27:24] Bash | gh pr diff 16 --repo timdixon82/LLBS-Braille-Name-Generator --name-only
- [2026-07-19 13:27:34] Bash | until gh pr checks 16 --repo timdixon82/LLBS-Braille-Name-Generator 2>&1 | grep -q "pending"; test $? -ne 0; do sleep 10; done; gh pr checks 16 --repo timdixon82/LLBS-Braille-Name-Generator
- [2026-07-19 13:27:41] Bash | gh pr comment 16 --repo timdixon82/LLBS-Braille-Name-Generator --body "$(cat <<'EOF'
Carol's test report for PR #16 (Dependabot alert #5, js-yaml bump)

Functional: PASS. Diff is scoped to package-lock.json only. js-yaml does not appear in scripts/ or styles/, and the deploy workflow's rsync allow-list (.github/workflows/deploy.yml) only includes /index.html, /styles/***, /scripts/app.js, /scripts/braille.js, /data/***, /assets/*** -- no node_modules path is ever copied to the published site. Confirms this is a no-op for the live application. Sean's lint (53/53 tests) and build results carry forward.

Accessibility: N/A for this PR. No HTML, CSS, template, or static-asset change, so there is no new UI surface to test against WCAG 2.2 AAA. Noting this explicitly rather than skipping silently, per the team's accessibility gate process.

CI: all required checks pass (Pa11y and axe at WCAG 2.2 AAA, Playwright tests, build, dependency-review, lint, semgrep, trivy).

Verdict: release-ready from a testing standpoint, pending Jed's security sign-off and Tim's merge approval.
EOF
)"
- [2026-07-19 13:27:45] Bash | git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator fetch origin fix/dependabot-js-yaml --quiet && git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator diff main..origin/fix/dependabot-js-yaml --stat
- [2026-07-19 13:27:50] Bash | cd /tmp && git -C /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator show origin/fix/dependabot-js-yaml:package-lock.json > /private/tmp/claude-501/-Users-timdixon-Code-Github-LLBS-Braille-Name-Generator/68ce3ff0-50a8-4ea8-96b3-a6262e4f4aa2/scratchpad/package-lock-branch.json 2>&1 | head -5; npm --prefix /Users/timdixon/Code/Github/LLBS-Braille-Name-Generator audit --json 2>&1 | grep -i "js-yaml" | head -20
- [2026-07-19 13:28:06] Bash | gh pr comment 16 --repo timdixon82/LLBS-Braille-Name-Generator --body "$(cat <<'EOF'
## Security review (Jed)

**Scope confirmed.** Diff is exactly a package-lock.json version bump for js-yaml (4.1.1 -> 4.3.0), no package.json change, no application code touched. No secrets, credentials, or unexpected files in the diff.

**Alert resolution confirmed.** GHSA-h67p-54hq-rp68 (quadratic-complexity DoS in merge-key handling via repeated aliases) affects js-yaml >= 4.0.0, <= 4.1.1, fixed in 4.2.0. 4.3.0 is within the fixed range.

**No new advisories introduced.** Checked GHSA-mh29-5h37-fv8m (prototype pollution in merge) - affects 4.0.0-4.1.0, fixed in 4.1.1, so 4.3.0 is unaffected. No other open advisories found against js-yaml 4.3.0 or its dependents at this resolution.

**Blast radius.** js-yaml remains a dev-only dependency (`dev: true` in the lockfile), pulled in transitively via cosmiconfig for lint tooling. Not shipped to the published site, so this carries no production/runtime risk either way.

Approved. No blocking issues. Handing to Carol for functional/accessibility testing.
EOF
)"
- [2026-07-19 13:37:51] Bash | gh pr merge 16 --repo timdixon82/LLBS-Braille-Name-Generator --merge --delete-branch=false
- [2026-07-19 13:37:54] Bash | gh pr view 16 --repo timdixon82/LLBS-Braille-Name-Generator --json state,mergedAt,mergeCommit -q '{state, mergedAt, mergeCommit: .mergeCommit.oid}'
- [2026-07-19 13:38:03] Bash | git -C "/Users/timdixon/Code/Github/LLBS-Braille-Name-Generator" branch -vv | grep main
git -C "/Users/timdixon/Code/Github/LLBS-Braille-Name-Generator" config branch.main.merge
- [2026-07-19 13:38:11] Bash | git -C "/Users/timdixon/Code/Github/LLBS-Braille-Name-Generator" fetch origin main
git -C "/Users/timdixon/Code/Github/LLBS-Braille-Name-Generator" merge --ff-only origin/main
- [2026-07-19 13:38:14] Bash | gh api repos/timdixon82/LLBS-Braille-Name-Generator/dependabot/alerts/5 --jq '{number, state, fixed_at}'
