# Initiative answer-button review repair — 14 September 2026

User clarification: the failing controls are “Shows initiative”, “Needs more initiative”, and the other choices beside the three Spot the Initiative videos. This supersedes the initial interpretation of video Play/PiP controls.

## Reproduction and root cause

Reproduced on the public EST page on 14 September: complete all three Step 1 cards, finish Step 1, start Step 2, then select **Spot the Initiative: Review 3 cards**. All three first-card answer buttons are disabled, no feedback/Next/Try Again appears, and only the first of the three review cards is reachable. The review state persists when returning to Initiative.

`jumpArcStep` opens a completed step with `phase: "review"`. `renderArcTrainingBay` reads the previously earned answer and disables all choices whenever that answer exists. It also suppresses the feedback overlay in review mode. There is no separate review-attempt state. This combination strands the learner on a static answered card. No click exception is emitted because disabled buttons never dispatch the handler.

Fresh answers do dispatch `setTrainingChoiceEncoded` → `setTrainingChoice` → feedback and work on the live page. Coordinate clicks also succeed. The videos load independently; no video/modal or asset-path change is needed. The public failure is a saved-state interaction defect, not evidence of a recent performance regression. Current main b0ffee210b2f7c9bb7b97cc5273bf08e41575e3e contains the same EST source blob 8378c27 as the shallow September 13 boundary; earlier available history includes the review path in the May 10 Initiative pilot. The exact original introduction cannot be established from this partial history alone.

## Repair

Completed-step review keeps `reviewing` and `reviewAnswer` separately in the existing arc flow. Buttons use that attempt, support wrong-answer feedback/retry and correct-answer progression, and leave earned answers and banked scores unchanged. Existing saved `phase: "review"` states recover without a reset. Standard uncompleted practice follows its existing path. The entry HTML uses a new content-script cache key.

Runtime changes: `modules/est-prep/est-prep-content.js`, `modules/est-prep/index.html`. Regression coverage: `tests/unit/initiative-review.test.mjs`. Documentation: this file and AGENTS.md. No CSS, question wording, video, reward, other module files or game navigation changes.

## Validation

- All 21 project unit tests pass. Three new tests cover all nine video choices, review/retry/advance without altering earned answers or scores, and old/reloaded review state. An initial test setup omitted earlier completed cards; corrected that fixture and reran successfully.
- Project check passes: 25 JavaScript files, 15 JSON files, 27 EST entry references, 5 CSS imports, 214 EST assets; existing playable manifest verifies 90 hashes and 30 modules. These are local checks, not a deployment receipt.
- Actual browser, desktop: every choice on all three videos, six wrong-answer/retry paths, correct feedback, Next, Finish Step 1, Start Step 2. Completed-step review now works, including a wrong answer and retry.
- Actual browser at 390×844: all nine choices during completed-step review, retry/Next controls, and direct coordinate click on Shows initiative. No runtime errors captured. This is responsive Chromium testing, not physical-phone/Safari testing.
- New page on the same local origin restores saved review feedback and allows Finish Step 1; re-entered review remains usable. Three completed cards remain recorded throughout review.
- Actual screenshots and action log retained in task evidence and canonical Blueprint private evidence. No new visual assets were created.
- Full live 3D hall/frame rerun stalled at loading in this browser session. Earlier live hall entry and direct EST route were inspected, but a complete repaired in-game-frame run is not claimed. No full hosted CI or physical-device test is claimed.

## Separate finding and release status

The initial PiP investigation found an unsupported-browser rejection hidden by the existing handler. It is unrelated to the clarified request. Its experimental patch/tests were removed from the game change and retained only as private task investigation artifacts; no PiP fix ships here.

Source repair is validated locally; live game publication has not occurred. Do not report this as live until the repair is published and public bytes/interaction are verified. Canonical Blueprint records this bounded result separately from overall reader reconciliation/publication.
