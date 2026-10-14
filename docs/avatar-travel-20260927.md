# Avatar travel repair — 27 September 2026

Canonical record: CE-CHANGE-20260927-98, docs/production/avatar-travel-20260927.md in the existing production-blueprint checkout.

## Scope and history

Repair is based on helper-release ebf933cef47505e13da3a3e120d855e3414992c0, the tested tree of live PR40 (merge 7913118). Existing local helper release notes are preserved. Concurrent opening-recovery has newer staged teaching/world/NPC work; this task does not overwrite it. The repair is local, not deployed.

Compared app.js and characters.js with the earlier verified playable release 3cba2ae (22 September), the wardrobe history and the 24/27 September grounding/loading changes. The older release already has the timing defects below. There is no independently recorded visual acceptance of walking at all frame rates, so it is a historical working baseline, not proof of ideal gait. Helper selection did not introduce the movement-loop defects.

## Findings and exact repair

- The old loop called setWalking(false) on every render frame without a 60 Hz physics tick. On a high-refresh display this repeatedly restarted the walk clip instead of advancing through its stride. Only update gait state after an actual physics step.
- Old elapsed time was capped at 80 ms, reducing simulated travel whenever rendering fell below 12.5 FPS. Allow bounded catch-up of 250 ms (at most 15 collision steps). Hidden-tab/focus reset prevents a resume leap. This fixes simulated travel timing, not GPU frame rate.
- Old walk playback was fixed regardless of Shift, analog magnitude or collision-resolved speed. Apply actual horizontal metres per simulation second to the walk action only. Idle and crossfade durations now use real elapsed time.
- Preserve existing maximum walk/run travel speeds (2.8/4.6 world units per second) and per-model authored baseline cadence. Add acceleration 20 and braking 28 units/s²; walk starts reach full speed in approximately 0.14 s, full-speed run stops in approximately 0.17 s.
- Use shortest-arc exponential turning in the fixed-step simulation, following actual resolved travel direction. Preserve camera-relative yaw and normalized diagonals.
- Interpolate visual position between physics poses; collision and Market movement always use physical positions, never the interpolated render position. Detect external teleports and reset interpolation. Reset navigation on scene transitions, focus loss, hidden tabs and existing guide/pause gates.
- Preserve original world collisions, paving, camera rays, geometry, materials, helper selector, all seven helpers and NPCs. The paving regression harness now calls loadEntry before loadScenery, matching staged production loading introduced by 7a6a614.

No new animation or model assets, root-motion rewrite or foot IK. The existing walk clip is speed-scaled for running; this is not a newly authored run animation or a claim of perfect foot locking.

## Verification

91 unit tests pass. Source checks pass. 210 working-tree manifest hashes match. Native Chromium desktop 1280 and phone layout 390 checks pass for walking, faster running, stopping and a 90-degree camera-relative turn. The final interpolated runtime also passes three helper scenarios (desktop/phone choice and persistence; switching across supplied models), paving and room-camera obstruction. Final timing comparison and 8 FPS follow-up both pass: eight distinct browser scenarios pass across the final runs. At throttled 8 FPS, walk averaged 2.76 units/s and run 4.11 units/s including their starts. In a two-second 144 Hz simulation the old Schoolboy walk repeatedly reset and ended at clip time 0.026 s; repaired playback advanced normally to 1.20 s. Pants base also passes at 30/60/144 Hz.

Initial browser trace recording hit ENOSPC; the Mac had approximately 338 MB free. No user files were deleted. Trace recording was disabled, and timed movement was changed to browser-local timers so delayed automation messages cannot artificially extend a key hold. One low-FPS stop assertion sampled before the bounded deceleration/fade had finished; settle sampling extended to 700 ms. The original high-refresh comparison incorrectly tested blend weight rather than clip time; blend weight can remain high while the clip continually restarts. The corrected comparison measures clip progress.

Evidence: evidence/movement/unit.log, acceptance.log, timing-final.log, probe.json, travel-1280.png and travel-390.png. Local preview: http://127.0.0.1:8811/playable-3d/?review=1&repair=travel . Physical-device/student acceptance, hosted CI, public release and Blueprint reader publication are separate and not claimed.

## Concurrent integration boundary

The runtime patch dry-run conflicts with newer opening-recovery app.js/index.html. No sibling files were changed. Preserve that checkout's new per-frame chapter hooks while integrating, then update its manifest/cache keys and run merged-build tests. The verified local preview is the published helper/world tree plus this repair, not the unpublished opening-week build.

## Suit flicker follow-up

Tania reports the preview cannot open and the suit flickers while walking. Restored an independent local server and verified HTTP200 plus the actual in-app game beyond the chooser. The retained preview tab is working; the public game is unchanged.

Confirmed separate rendering regression from fddbdc8: Auto refreshed moving shadows at10Hz. In the bundled Three renderer, projectObject updates skeletons before the render-frame counter increments, then the shadow pass updates and stamps skeletons for that incremented frame. Skipping the following shadow pass can therefore retain the preceding pose's bone data for a frame. Cached maps also leave stale self-shadows. Native same-pose renders reproduce both: manually refreshing skeletons removes the pose jump, while refreshing shadows removes the remaining lighting difference. Repeated fresh renders are pixel-identical. Original Schoolboy and Pants base assets remain unchanged.

app.js now refreshes shadows on every rendered frame while the walk action has visible blend weight, including its zero-speed fade to idle, or the player position/rotation/actor changes. Idle shadow reuse and original resolution remain. Index cache key updated. No vendor rewrite, suit replacement, world/helper/NPC edits or public release.

New tests: tests/e2e/suit-flicker.spec.js and suit-flicker.playwright.config.mjs; evidence/movement/suit-playable-final.log and suit-walking-1280.png / suit-walking-390.png. Early test caught a paused-but-visible walk fade; use enabled plus blend weight, not isRunning. Idle check waits for settled state rather than assuming an exact wall-clock delay. Final results recorded in verification.json.

User review — 27 September 2026: Tania reports “much better!” after viewing the local movement and suit-shadow repair. This is positive visual feedback on the local preview, not authorisation to publish or proof of physical-device/full-game acceptance.

## Authorised live release — 27 September 2026

After positive preview feedback, Tania explicitly requests “send to live please”. This supersedes earlier no-publication instructions for this scoped repair. Current remote main verified as79131181a7682cb7916ebf6f78aaca5e5ee7be4b, same runtime tree as the reviewed helper-release base. Publish movement and suit-shadow repair only; preserve separately staged opening-recovery work. Live release and public verification pending.
