# Startup readiness candidate — 12 October

Base: deployed PR46/main400286972404f781b82a5f3a17ba001bb0602121. Isolated branch perf/cold-start-20261012. No deployment, push or merge. This handoff covers startup only; the separate map/Stats/destination/photo-finish UX task owns those changes.

## Observed problem and fix

User screenshots were materialized and viewed locally without touching the active tab or saves. The first screenshot showed a rendered player/courtyard still at Preparing Arrival Gardens. The next pair showed the connected computer panel and the current quiet post-video world, Antonio and parcel with untextured ground at the same status. An earlier full-game header alone was not proof of a cache problem.

Public cold probes at4Mbps,100ms latency and4x CPU slowdown found first view4.9–7.1s, while the chosen avatar became ready17.8–22.3s. Its roughly2.95MB compressed GLB competed with crest, rock and surface requests. The intro MP4 was not requested before Play. The stalled status had two real dependencies: loadEntry awaited every deferred surface, and Careers/Workplace GLB parsing independently awaited the same limestone PNG and other external maps.

The candidate gives the selected character a bounded8-second scheduling head start over speculative Arrival work, keeping the download-free player available on failure. Arrival paths/colliders and full campus geometry no longer await decorative surface completion. External building maps use a generated1px placeholder during GLB parsing, then hydrate the original GLTF texture targets from their original URLs. Embedded textures and all geometry remain intact; UV transforms, samplers, colour space, orientation and texture identity are retained. No model, image or video asset is edited or removed.

Surface waits report a retryable failure after15 seconds; late responses still restore the exact artwork. The queue handles textures registered during later building parsing. Once missing surfaces finish, the notice clears. Existing Retry handles missing detail. Character identity/storage, clue progression, wallet, map and avatar choices remain unchanged. Test characters and the whole main set are not preloaded.

## Timing evidence

Two sequential before/after pairs used the same isolated Chrome/Metal setup,1280x900,4Mbps,100ms,4xCPU, range-capable gzip/cache servers. Baseline served exact release bytes for every changed existing module. Times are seconds:

| Metric | Cold before | Cold candidate | Warm before | Warm candidate |
|---|---:|---:|---:|---:|
| Loading screen hidden/intro available |4.72–4.99|4.63–4.70|1.07–1.19|1.05–1.07|
| Actual movement observed |6.45–6.68|6.37–6.44|4.27–4.44|2.83–2.87|
| Selected avatar visible |22.23–22.59|11.40–11.41|3.15–3.18|1.79–1.83|

This is about49% less cold selected-avatar wait, with little cold first-movement improvement. It is primarily a readiness/stall fix, not a large first-frame speedup. Diagnostic timing has roughly1-second sampling resolution; exact fetch endpoints are retained separately. Both serve identical avatar bytes (2,950,378 gzip bytes). Completed wire bytes at the selected-avatar-plus1.5s sample fall from7,992,866 to5,047,985–5,497,340 because scenery is scheduled later, not discarded. Warm candidate still downloads about971,877bytes of crest detail that had not completed in its earlier cold sample; baseline warm is fully cached at that sampling point. Do not interpret those totals as complete-world size or an all-assets warm-cache comparison. No page errors occurred in these timing runs. Full request/long-task/navigation records: startup-performance-evidence-20261012.json.

## Verification and limits

118 unit tests and project source checks pass. The held-limestone fault test passes its ORIGINAL30-second campus-ready assertion, with actual ready marks4.45s and11.68s in separate runs while the image remains held. Keyboard movement works; a recovery notice appears; releasing the image clears the notice and restores all queued surfaces. A real GLTF target contract check verifies target/source identity, UV/repeat/offset/rotation, wrapping, colour space and flipY. Native full66-second video playback reaches natural EOF and hands over to movement. Fresh keyboard approach auto-opens the parcel without E/click. Parcel/map/shared-wallet progression persists with exactly one$25 reward. Five named-avatar scenarios and six additional saved-character/import/retry scenarios pass. Legacy jacket visibility/walk/save/reload passes on the repository's standard range server (14.1s). Its earlier benchmark-server failures were retained as history; that server compresses the52.3MB experimental GLB on demand and a captured header wait was5.1s. A stronger visible-Studio/ready-save guard is retained in its reload assertion.

Required full CI was attempted: source checks and118units/coverage pass, but its standard web-server bind fails under the sandbox. No full-CI or hosted pass is claimed. Existing Echo/Chapel limitations remain separate and their tests/configuration are untouched. Physical school hardware/phone performance remains untested.

## Separate parcel investigation

Returning progress at step1 reproducibly enters the parcel radius without an automatic reminder on original code: Cerys at[-7.001,0.085,15.939], clue closed, step1 retained. The original auto-trigger is deliberately enabled only at step0. This is separate from texture readiness; the first parcel trigger is not gated by pathsReady. A three-line re-approach candidate opens the current clue while retaining hysteresis and avoiding a new reward. It passed fresh natural-video approach/dismiss/leave/re-approach and a diagnostic returning Cerys run (clue open at z16.567, progress unchanged), but the formal returning case still needs a clean confirmed rerun. It is NOT included in this startup commit. Work-in-progress patch and test copy are outside the commit in the task workspace. Do not represent that follow-up as deployed or fully accepted. A fresh live first-approach failure has not been reproduced in the isolated checks.

Shared runtime files for coordinated integration: app.js, world.js, campus-landscape.js, deferred-textures.js and index.html. Preserve other task's app/discovery edits rather than replacing files wholesale.

Release-owner integration: worker1f101a6 was cherry-picked as9b8a897 onto exact main4002869 on release/startup-ready-20261012. The complete checkout passes scoped `npm run ci`: source/release checks,118 units/coverage and19 native Edge browser scenarios (3.0m) covering strict held-image readiness/recovery, natural66s EOF→movement→fresh automatic parcel, GLTF target/UV preservation, wallet/reload/map, canonical intro/returning entry and named/legacy Studio save/failure behavior. The held limestone case reaches campus-ready at4.026s with the image still blocked. First attempt targeted an expired localhost8831 preview and failed connection; the separate standard range server8835 supplies the confirmed final pass. No full-browser-suite pass claimed. Echo/config, discovery routing, returning-parcel WIP and map/Stats implementation are unchanged. Public deployment verification follows.
