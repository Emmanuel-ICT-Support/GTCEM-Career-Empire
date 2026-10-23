# Career Empire discovery review candidate

**Local review only; not live.** No push, merge, deployment, firewall changes, authentication grants, real student-record access or initiative teaching audit. This change covers the discovery interface, optional guidance and the handover to the next market experience. The deeper market curriculum is unchanged.

## Base and isolation

Base `dee8291bd3cc8ae713f47ad9fbc89d5624092730`, tree `867c993c4e76d8aacd4a40394c7343e03ec06d9c`, was verified through the GitHub connector as remote main when work began. Independent writable checkout: `task-2/career-empire-review`, branch `review/discovery-handover-20261020`. The original clean checkout remains unchanged. The original was already sparse and partially cloned with `blob:none`; the copy inherited those missing files. Text dependencies used by unit tests were restored from the exact base through the permitted read-only connector. Three baseline CSS files were later restored from existing local Git blobs and verified against the manifest, without downloads or overwriting candidate edits.

## Behavior

- My Journey banks Chapel discovery, actual saved mural image and final photo independently of trail replay/retake. Existing Chapel photos survive; the current Chapel checkpoint requires neither entry nor a photograph, so its existing picture is honestly labelled Chapel discovery.
- First completion introduces life beyond school and initiative as a learnable skill. Exactly two choices: **Head straight to the market** and **Keep exploring**. Both market travel and the map use the safe entrance at `(43, -17.8)`. Exploration retains a small travel reminder; entering the market retires the reminder and marker. Reload does not force the celebration or tour to reopen.
- Discovery adds **no currency**, including parcel, cleanup, mural/final photo, oval proximity and market-arrival legacy exploration bonuses. Historic wallet records are preserved byte-for-byte. Full-mode exploration and market learning rules remain available unchanged. Optional cleanup gives a plain thank-you, not money. Existing money history is behind an optional Stats disclosure.
- Companion and plain Help share contextual information and actions. A chosen companion adds its portrait/personality and continues physically following through the existing selected-model path. Hide/show persists separately from selection; Help remains available while hidden. Only the chosen model loads. Selection does not open a conversation automatically. Companion choice is optional from the start.
- The gift gives the agreed photo-trail explanation once per run/save. If a companion is chosen it is attributed to that companion in the same panel; otherwise the gift says the identical copy. No duplicate explanation overlay.
- Reveal has one slider instruction, one Go exploring action after full reveal, optional Need help with hint/Take me there, and no irrelevant Flyover banner. Warm colour panels and picture framing reuse existing assets.
- Chapel Continue from doorway explicitly records the checkpoint and opens the mural clue. Close/Escape only dismisses it. Automatic proximity no longer records the checkpoint before that choice. Step inside remains voluntary; returning from inside also records the checkpoint. No response, photo or minimum dwell is required.
- The mural camera has a phone-like frame, round Take photo shutter and explicit click/tap-to-frame then shutter instructions. Keyboard arrows/Enter/Space remain available, with optional directional controls. Artwork retains its natural ratio so frame coordinates still map to the original source image. It uses the in-game picture, not a webcam.
- The oval clue briefly celebrates the banked mural photo and focuses on the next picture, with the same main-action/help layout. The tour, flyover, avatar editing and course outline stay optional.

## Save lifecycle and movement assistance

My Journey uses the existing run storage; it does not change authentication or establish cloud saving.

- Ordinary guest play is memory for the current run. **Reload or a new ordinary entry starts a new guest run.** An explicit one-shot module handoff carries the current run, including My Journey, through that navigation. Reload after the handoff has been consumed starts fresh.
- A server-verified player uses an existing player namespace in browser-local storage. The same verified player in that same browser can reload without losing it. Clearing browser data removes it. No cross-device/account-server persistence is promised.
- Actual storage failure retains tab memory and says saving is unavailable. Intentional guest memory is described as a run, not misreported as a browser failure. The clue footer, Stats and handover share this wording. Downloading the final photo keeps a separate file.
- Take me there closes the clue and travels to its current pictured target: parcel, Chapel doorway, mural or oval. It never collects a shot. Chapel is reached at its doorway; continuation or an interior return records that visit. Closing a Chapel choice does not advance it.

## Verification

- Final unit source: **352 tests passed across 76 files**, zero failed. Includes real component method checks for zero discovery wallet writes, preservation of legacy savings, suppression of the second legacy exploration-reward path, the unchanged full-mode reward path, guest/handoff/player/browser-clear save lifecycle, slider progression, companion selection/disposal/hide/show and following geometry.
- **11 focused browser component scenarios passed** in installed Chrome, one worker, zero retries (12.3 seconds in the final combined run). An enhanced camera rerun also passed (one case, 4.5 seconds), verifying click-to-frame coordinates, keyboard movement, missing-artwork error/no award, and **zero getUserMedia calls**. The earlier missing-browser-executable attempt is retained; no browser download was performed.
- All **263 browser cases collect** (252 existing plus 11 new), without skipping tests. Relevant older journeys now follow the optional Help/current clue controls and two-choice handover. Their movement assertions and safeguards remain; old discovery-currency expectations are replaced with unchanged-wallet assertions. The full 263-case gameplay suite has **not** been executed on this sparse copy.
- Production JavaScript syntax and Git whitespace checks pass. Changed runtime manifest hashes and cache references are refreshed. Full source/release checks remain blocked by missing baseline files, not waived.

## Visual inspection and remaining blockers

User-approved supported execution approval allowed the server bound only to `127.0.0.1:4273` and the local Chrome runner. No all-interface bind or security-setting change was made. The prior bind denials and uncertain/disconnected sessions remain in raw logs; a stopped server was checked before restarting.

Desktop and 390px reduced-motion screenshots were generated and inspected. A focus-loop failure was fixed without weakening its assertion; a cramped reveal layout was corrected so the main action is visible without covering Help. The fixture labels its synthetic saves and unavailable campus assets. The handover, My Journey, reminder, Help and production discovery-panel layout/state paths are evidenced.

**This is not complete world/artwork visual clearance.** Chapel, mural, oval picture files, selected companion portraits/GLBs and other baseline assets are absent. Screenshots intentionally show that missing-art state; they are not substituted artwork or proof of actual photo capture, companion GLB pixels, physical campus travel, a physical phone or a school device. Git fetch from verified origin still fails with `Could not resolve host: github.com`; no network bypass or credential/security change was attempted. Initial investigation recorded 78 distinct missing source-check paths (95 references) and 188 missing manifest files. Three locally available stylesheets were restored, leaving 185 manifest files absent. All investigated paths are tracked in the base; none has an effective LFS filter, although global LFS executable filters are installed. Missing remote payloads were not downloaded to inspect historical pointer contents.

**Known postmerge movement failures `curriculum-loading` and `ecc-courtyard` remain open.** Their tests were not weakened or rerun. Historical software cadence and school-device qualification limits remain as documented in AGENTS.md. No all-green CI or deployment claim.

## Evidence, kept outside source

Sibling `task-2/review-receipts/` contains:

- `unit-final-complete-source.log`: final unit results; earlier failed/incomplete unit attempts are retained.
- `browser-final-colourful-source.log`: final combined 11-case browser result.
- `camera-ratio-final.log`: enhanced camera check with native image-ratio handling.
- `browser-final-collection-complete-source.log`: all 263 cases collected.
- `final-reviewed-panels/`: inspected handover, Stats, reminder, gift, Chapel and oval screenshots; desktop and narrow/reduced-motion variants.
- `verified-camera-ratio/mural-camera-phone-reduced-motion.png`: inspected final camera component screenshot, with unavailable baseline artwork clearly visible.
- `missing-assets-investigation.json`, `missing-source-assets.txt`, `missing-manifest-assets.txt`, `local-css-restoration.json`: exact missing-file inventory, baseline blob identities and CSS hash receipts.
- `source-check-final.log`, `release-check.log`: baseline source/reference and missing-blob/DNS failures. No passing release qualification is inferred from component tests.

The separate initiative teaching/instruction audit is not implemented or published by this branch.
