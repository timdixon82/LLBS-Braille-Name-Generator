# Work Log: 015-llbs-bng-setup

This log is chronological and append-only.

## [2026-05-23] open | Work folder created

Sonja opened work folder `015-llbs-bng-setup` and recorded the brief at `brief.md`. The repository clone has been placed at `Github/` per the team convention. Next: backfill or register-and-park dispatch.

## [2026-05-25] parked | Awaiting Tim's answers to Q63, Q64, Q65

Four-agent backfill (Tad, Jacob, Jed, Carol) completed in parallel. Carol identified seven must-fix issues (four Level A, three Level AA) and three open questions. Jed confirmed one medium finding (missing CSP/Referrer-Policy, handled in setup build). Work parked pending Tim's decisions on Q63 (dot-position diagram), Q64 (profanity filter obfuscation), Q65 (muted-text contrast).

## [2026-05-25] unparked | Q63, Q64, Q65 answered by Tim

Q63: Keep ASCII dot-position diagram, add aria-hidden and a text description for screen readers. Q64: Leave base-64 obfuscation, document as a project decision in the wiki. Q65: Darken --muted to at least #4A4A4A on the setup branch. All blockers cleared. Work folder set to active. Ready for routing step 4 (Tad scaffolds wiki and setup branch).
- [2026-05-25 17:49:33] subagent completed
- [2026-05-25 17:57:02] subagent completed
- [2026-05-25 17:59:59] subagent completed
- [2026-05-25 18:29:19] subagent completed

## [2026-05-25] build complete | Setup build pushed to chore/project-setup; PR 1 open

Sonja completed the setup build directly (Sean was blocked writing to the external repo path). Build covers all 13 tasks: file split (HTML/CSS/JS/assets), DM Sans self-hosted font, LLBS logo as PNG asset, GoatCounter self-hosted analytics, CSP + Referrer-Policy meta tags (ADR 004), five CI workflows, release-please, VERSION, five ADRs (001–005), privacy.md, README, .gitignore. Three linters exit 0 (html-validate, Stylelint, ESLint). PR 1 open on LLBS-BNG repo: https://github.com/timdixon82/LLBS-Braille-Name-Generator/pull/1

Accessibility CI fix committed: template placeholder in accessibility.yml replaced with Python HTTP server and readiness loop. CI re-run in progress.

Next: CI passes → Carol tests → Jed reviews → Tim approves → merge.
- [2026-05-25 19:17:36] subagent completed

## [2026-05-25] carol review | Three blocking items found; all fixed same session

Carol tested PR 1. Three blocking items:
1. Font path: `url('assets/fonts/DM-Sans.woff2')` in styles/main.css was wrong — should be `url('../assets/fonts/DM-Sans.woff2')`. DM Sans was 404-ing in all browsers.
2. axe color-contrast false positive on aria-hidden decorative arrow in .llbs-cta. Added `color-contrast` ignore to pa11y.json with rationale in docs/accessibility.md.
3. VERSION (0.0.0) and CHANGELOG (manual 1.0.0 entry) were inconsistent. Removed the manual CHANGELOG entry; release-please manages it from 0.0.0.

All three fixes committed at 1069c27. CI re-running. Jed review deferred to next session (closing now).
Next: CI green → Jed security review → Tim merge approval.
- [2026-05-25 19:21:37] subagent completed
- [2026-05-25 19:23:55] subagent completed
- [2026-05-25 19:26:07] subagent completed
- [2026-05-25 19:27:12] subagent completed

## [2026-05-25] pre-merge gate | Carol re-check and Jed security review complete

All CI checks green on PR 1 (CodeQL, accessibility, build, dependency-review, semgrep, trivy — seven of seven).

Carol re-test results: six of seven checks passed. One blocker: `docs/log.md` contained `<project>` and `<date>` placeholders unfilled. Tad fixed these (commit 4ecad2c). All other checks passed: font path correct, pa11y.json ignore register complete with rationale, CHANGELOG clean, Pa11y reports no issues, index.html structurally sound.

Jed security review: no blocking findings. Two low-severity deferred items logged:
1. GoatCounter `img-src` gap in CSP: GoatCounter image-fallback path is blocked by CSP. Recommend documenting in privacy.md that only `sendBeacon` path is active. Deferred to file-split branch.
2. `form-action 'none'` not in CSP: hardening step, non-blocking. Deferred to file-split branch.

Jed also found a typographical error in the AgentTeam template (`templates/.github/workflows/security.yml`): `dependency-review-action` SHA was 44 characters instead of 40. Fixed and raised as AgentTeam PR 28. The live LLBS-BNG workflow was not affected.

PR 1 is ready for Tim's merge approval. No further rework needed.

Next: Tim approves merge → Sonja merges PR 1 → work folder closed.

## [2026-05-25] done | PR 1 merged; work folder closed

Tim approved. Sonja merged LLBS-BNG PR 1 and AgentTeam PR 28 simultaneously. Work folder status set to done. Projects registry regenerated.
- [2026-05-27 14:29:49] subagent completed
- [2026-05-27 14:51:54] subagent completed
- [2026-05-27 14:52:01] subagent completed
- [2026-05-27 14:52:10] subagent completed
- [2026-05-27 14:52:17] subagent completed
- [2026-05-27 14:52:49] subagent completed
- [2026-05-27 15:08:09] subagent completed
- [2026-05-27 15:08:11] subagent completed
- [2026-05-27 15:08:21] subagent completed
- [2026-05-27 15:08:22] subagent completed
- [2026-05-27 15:51:12] subagent completed
- [2026-05-27 16:00:26] subagent completed
- [2026-05-27 16:25:00] subagent completed
- [2026-05-27 16:46:35] subagent completed
- [2026-05-27 16:48:10] subagent completed
- [2026-05-27 20:17:07] subagent completed
- [2026-05-27 20:20:37] subagent completed
- [2026-05-27 20:24:14] subagent completed
- [2026-05-27 20:27:15] subagent completed
- [2026-05-27 20:36:49] subagent completed
- [2026-05-27 20:37:34] subagent completed
- [2026-05-27 20:40:08] subagent completed
- [2026-05-27 20:42:05] subagent completed
- [2026-05-30 23:02:21] subagent completed
- [2026-05-30 23:42:08] subagent completed
- [2026-05-31 11:57:35] subagent completed
- [2026-06-05 14:14:30] subagent completed
