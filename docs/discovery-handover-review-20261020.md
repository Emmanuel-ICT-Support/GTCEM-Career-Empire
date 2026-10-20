# Discovery handover review candidate

Local review only. No push, merge, deployment, permissions, authentication grants, student-record access or market curriculum changes.

## Base and isolation

Remote `Emmanuel-ICT-Support/GTCEM-Career-Empire` main was freshly read through the GitHub connector as `dee8291bd3cc8ae713f47ad9fbc89d5624092730`, tree `867c993c4e76d8aacd4a40394c7343e03ec06d9c`. The original clean checkout remains unchanged. An independent copy lives in `task-2/career-empire-review` on `review/discovery-handover-20261020`. Its missing text dependencies were restored from that exact commit through read-only connector calls; baseline blobs were checked into this copy's object database, not changed upstream.

## Result

- First photo-finish Continue opens a concise celebration and the agreed life-beyond-school/initiative introduction. Exactly two choices: Head straight to the market; Keep exploring.
- Straight travel uses the existing safe entrance (`43, -17.8`) and verifies arrival. Failed travel retains the handover for retry or exploration. Keep exploring returns focus and gameplay, with a persistent next-experience travel reminder. The map uses the identical entrance. Entering the market retires both next-experience indications. Reload does not automatically reopen the celebration or tour.
- Stats leads with My Journey and banked discoveries, including actual saved mural and final images. A pre-existing saved Chapel photo is retained. The current trail records a Chapel visit rather than taking a new Chapel photo; for that case the existing Chapel image is honestly labelled Chapel discovery. No photo-taking mechanic was invented. Banked records survive replay/retake independently of the trail and do not create duplicate wallet awards. Existing guest-run/account save boundaries remain intact. Storage failure is described as tab-only; damaged journey data is not overwritten.
- The existing finances remain behind an optional Game money details disclosure. The handover and optional tour no longer introduce earnings/tax. Existing award amounts, ledger and market rules are unchanged.
- Companion and plain Help use the same contextual content and actions. Selected companions add their portrait and a short personality line. Selection creates no automatic conversation. The actual selected model retains physical following, with separate persisted hide/show choice and Help access while hidden. Only the selected model loads; replacement still disposes the previous model.
- The older campus tour, flyover, avatar choice and course outline remain optional in Options. The unrelated full-campus guidance flow is retained.

## Verification and limits

Final source: `npm test -- --configLoader runner --no-cache` — **75 files, 347 tests passed**, zero failed (4.56 seconds). Eleven changed/new production JavaScript modules pass `node --check`. `git diff --check` passes. Changed runtime manifest entries are refreshed and three new modules added.

Playwright `--list` collects **5 new component scenarios**: both choices/later travel, failed travel recovery, Stats banking/reload, companion/no-companion/hide/show Help, and narrow reduced-motion keyboard focus/escape/target sizes. The fixture deliberately labels its synthetic save and absent campus assets. It is not evidence of real campus rendering or actual GLB pixels.

**Browser execution denied:** the existing test server attempted to bind `127.0.0.1:4273`; the sandbox returned `PermissionError: [Errno 1] Operation not permitted`. Zero browser cases executed. No retry, permission expansion, alternative server or workaround was attempted. No screenshots were generated or visually inspected. Responsive/accessibility browser assertions, actual companion pixels and full game navigation still need execution in an authorized complete environment.

`node scripts/dev-check.mjs` fails because this sparse checkout lacks EST styles, scripts, linked pages and binary image/video assets. The full release-manifest checker also requires baseline binary blobs absent from the partial clone; direct Git DNS remains unavailable. No complete release/CI clearance is claimed. Initial unit attempts with missing dependencies and the newly introduced handover dependency in navigation fixtures are retained; the fixtures now include that dependency and add blocking-state coverage without reducing movement assertions.

**Known postmerge movement failures in `curriculum-loading` and `ecc-courtyard` remain open.** They were neither rerun nor weakened by this change. Historical software cadence/hardware qualification limits remain as documented in AGENTS.md.

Raw logs and generated receipts are separate from source, in sibling `task-2/review-receipts/`:

- `unit-final-reviewed-source.log`: final 347/347 result.
- `changed-module-syntax.json`: 11 syntax checks.
- `browser-collection.log`: five collected scenarios.
- `browser-attempt-1.log`: denied server bind before browser tests.
- `source-check-final.log`: sparse-checkout reference failures.
- Earlier failed/incomplete attempt logs are preserved alongside these.
