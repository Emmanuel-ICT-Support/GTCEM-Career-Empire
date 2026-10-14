# Focused hosted workflow receipt — 14 October 2026

The isolated ECC branch `repair/integration-followup-20261014` is published.
GitHub native access worked without changing credentials or security. No human
push action was required. Main remains `fec76572a26af62678ac6324216ac460e93deb36`;
this task did not create a PR, merge, deploy, integrate Markets, or run the full
browser suite.

The tested code commit is `b7c899bfdd325f69b023a12784ddb87c877be244`.
[Focused run 38591295644](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38591295644)
completed **success** at 15:43:53 UTC. The branch calls the actual `ci.yml`
workflow through its focused reusable entry, so verification exercises the
changed workflow and reporter. Ordinary main/PR CI retains its full scope.

## Verified scope

| Check | Hosted result |
| --- | --- |
| Source and release integrity | Passed: 280 exact asset hashes and 87 reachable modules |
| Relevant policy, render-quality and saved-control units | 15 passed in three files |
| Existing count proof and focused workflow/import guards | 10 passed |
| Focused software browser inventory and executions | Exactly two unique cases, both passed; no retries/skips/interruption |
| Downloaded artifact evidence proof | Complete, no missing/unexpected cases or errors |
| Full critical, browser and aggregate test jobs | Skipped by focused scope |

The browser cases were the cold complete-campus handover with real walking,
and paused Stats changes with honest cached-frame behavior. Both recorded the
actual renderer as ANGLE / Vulkan / SwiftShader Device (Subzero).

Cold handover measured **23,309.1 ms**; navigation-to-ready measured
**27,667.1 ms** for cold skip and **30,655.5 ms** for Stats. These are measured
waits, not an accepted student waiting deadline. The report retains
`softwareStartupFixed: false`, a null/unassessed software deadline, hosted GPU
performance not verified, and school-device validation outstanding. Prior
Apple M3 / Metal qualification remains separate evidence; this CPU run cannot
verify the accelerated eight-second target or physical school devices.

## First attempt and repair

[Run 38589716790](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38589716790)
failed at `9be6fc506e99e8d049667ef5469fffea41acc27c`. Source checks, 15 units
and nine then-existing proof tests passed, but software collection failed:
`ecc-root-causes.playwright.config.mjs` imported the ignored/untracked local
`ecc-admin-preview.playwright.config.mjs`, absent in a clean hosted checkout.
Compatibility did not execute and evidence proof failed from missing artifacts.

Commit `b7c899b` makes both diagnostic configs import the tracked root
Playwright config with explicit equivalent paths/browser settings, and adds a
guard requiring every relative config import to be Git-tracked. The separate
software diagnostic now writes to a new default output folder so it cannot
erase earlier failure evidence. No game runtime optimization or acceptance
threshold changed. The first failure is retained alongside the successful run.

## Preservation and evidence

The game runtime and assets have zero diff from `c72b4390f0821712f3ef834be09ff48fe50933c0`.
`app.js` SHA-256 remains
`f9d5ee35aeec6d24d4436b2ebbc735a05fd8043a6dab57f85342d971140d85d6`.
Successful-save Echo guidance and immediate quality application remain intact.
Existing visuals, geometry, gates, avatars, photo and accepted tour are retained.
Market `d0912bb` remains separate and unpublished.

The original broad run 38543515871 still records 186 passes, 42 failures,
one interrupted and four not started. This focused result does not replace it
or establish a complete 234-case execution.

Downloaded logs, JSON, proof and screenshot are saved locally under
`coverage/hosted-focused-verification-38591295644/`; the first attempt is under
`coverage/hosted-focused-verification-38589716790/`. Artifact identities and
digests are recorded in `focused-hosted-workflow-20261014.json`. The completed
campus screenshot was visually inspected. Documentation-only receipt changes
do not match the focused workflow's path filters and need no new browser run.

The branch is ready for the parent's release review with these stated limits.
No execution or access blocker remains for this requested branch publication
and focused verification. A later release decision and representative physical
school-device validation remain separate work.
