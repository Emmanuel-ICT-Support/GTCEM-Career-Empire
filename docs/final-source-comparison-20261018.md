# Final-source comparison - 18 October 2026

Full252-case run on c44a956:250passed,2failed,zero skipped/interrupted/flaky/unrun. Exact inventory partition. All242published baseline cases mapped;65of67previous failures now pass, with zero previously passing cases regressed. This includes recovered repairs and a different browser environment; it is not a one-change causal proof.

The only failures are suit-flicker cadence at1280and390:2moving frames each against unchanged>5during1300ms. Original graphics and trees retained; real/accelerated-device qualification is unavailable. See qa/cadence-boundary-20261018.json.

| Published failed case | Final source |
| --- | --- |
| admin-preview.spec.js — public shortcut opens isolated fresh Admin and preserves normal gates 1280 | passed |
| admin-preview.spec.js — public shortcut opens isolated fresh Admin and preserves normal gates 390 | passed |
| chapel-approach.spec.js — live keyboard route reaches the actual Chapel door without changing position or progress directly | passed |
| entry-visibility-probe.spec.js — initial complete campus, unobstructed rear buildings and parcel walking 1280 | passed |
| entry-visibility-probe.spec.js — initial complete campus, unobstructed rear buildings and parcel walking 390 | passed |
| market-gate.spec.js — physical market gate exits and re-enters without clicks 1280 | passed |
| market-gate.spec.js — physical market gate exits and re-enters without clicks 390 | passed |
| market-stats.spec.js — Market money and collection stay available 1280 &mode=full | passed |
| navigation-map.spec.js — live default map and Stats 1280 | passed |
| navigation-map.spec.js — live default map and Stats 390 | passed |
| navigation-map.spec.js — returning photo handover and once-only rewards 1280 | passed |
| navigation-map.spec.js — returning photo handover and once-only rewards 390 | passed |
| render-budget.spec.js — Auto keeps controls available, manual quality works, and hidden views stop rendering | passed |
| runtime-recovery.spec.js — pending Market travel yields to visible Character Studio and late completion stays cancelled | passed |
| runtime-recovery.spec.js — stalled Market travel releases the campus and normal retry remains visible and walkable | passed |
| staged-entry.spec.js — sharp entry prepares the next task without loading distant campus or recording completion | passed |
| staged-entry.spec.js — skipping avatar prepares market kits without a market visit | passed |
| arrival-gardens.spec.js — arrival walk reaches Studio and retains avatar save after reload | passed |
| avatar-recovery.spec.js — failed startup avatar can retry without reloading or changing the saved profile | passed |
| avatar-studio-entry.spec.js — Home Base returns to ECC welcome; Studio remains separate | passed |
| chapel.spec.js — Chapel reflection and campus return at 1440px | passed |
| chapel.spec.js — Chapel reflection and campus return at 390px | passed |
| curriculum-loading.spec.js — curriculum rooms remain accessible when campus decoration and Studio fail | passed |
| curriculum-loading.spec.js — slow saved avatar, Studio and poster never gate EST at 1280px | passed |
| curriculum-loading.spec.js — slow saved avatar, Studio and poster never gate EST at 390px | passed |
| curriculum-loading.spec.js — failed avatar keeps fallback playable, retry restores saved avatar without rewriting it | passed |
| curriculum-loading.spec.js — unavailable saved clothing uses fallback and never fetches other outfits | passed |
| est-wall-video.spec.js — EST requires wall play, seeks and restarts at 1440px | passed |
| est-wall-video.spec.js — EST requires wall play, seeks and restarts at 390px | passed |
| first-play.spec.js — Arrival is playable while distant models and textures wait, then opens the whole campus | passed |
| first-play.spec.js — background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar | passed |
| first-play.spec.js — a failed entry texture retries before optional landscape loads | passed |
| game-entry-loading.spec.js — game entry loads only the active avatar and worn clothes | passed |
| game-entry-loading.spec.js — game entry loads only the active avatar and worn clothes | passed |
| startup-campus-entry.spec.js — video to complete exterior, walking and automatic parcel at 1280 | passed |
| startup-campus-entry.spec.js — video to complete exterior, walking and automatic parcel at 390 | passed |
| startup-costs.spec.js — measure complete campus handover costs cold-skip | passed |
| startup-performance.spec.js — normal play avoids GPU pixel probes and uses shared building textures | passed |
| startup-surface-gate.spec.js — complete intro reaches natural end and hands over to usable movement | passed |
| startup-surface-gate.spec.js — mocked owned-account parcel, map and shared wallet persist without a duplicate reward | passed |
| suit-flicker.spec.js — playable suit shadows follow every walking frame at 1280 | failed |
| suit-flicker.spec.js — playable suit shadows follow every walking frame at 390 | failed |
| whole-characters.spec.js — named characters: selected-only startup, lazy tests, rig measurements, switching and persistence | passed |
| header-controls.spec.js — banner controls are clear and destinations work at 854 | passed |
| movement.spec.js — player travel, gait, turn and stop at 1280 | passed |
| movement.spec.js — player travel, gait, turn and stop at 390 | passed |
| movement.spec.js — player travel, gait, turn and stop at 1280 at 8 FPS | passed |
| night-market-agency.spec.js — Home Economics entrance and return use real navigation | passed |
| night-market-agency.spec.js — complete keyboard shift, learning, review transfer and return 390 | passed |
| night-market-research.spec.js — research mission and pass 1280 | passed |
| night-market-research.spec.js — research mission and pass 390 | passed |
| night-market-research.spec.js — fresh review uses the actual game and leaves existing saves untouched | passed |
| night-market.spec.js — legacy night market complete loop and saved rewards at 1280px | passed |
| night-market.spec.js — legacy night market complete loop and saved rewards at 390px | passed |
| night-market.spec.js — market failure leaves campus and curriculum reachable | passed |
| phone-startup.spec.js — phone opening uses smaller phone assets once and releases startup cache | passed |
| phone-startup.spec.js — failed phone tree load clears temporary cache and supports retry without reloading the character | passed |
| playable-scenery.spec.js — campus waits for both buildings and keeps destinations and movement | passed |
| playable-scenery.spec.js — failed campus loading explains retry instead of revealing missing buildings | passed |
| playable-startup.spec.js — startup loads only the active avatar and keeps the studio and hall usable | passed |
| stall-refine.spec.js — Juniper food and staff clear the shallow counter in packing and collection roles | passed |
| startup-exterior.spec.js — delayed courtyard must not hold game entry | passed |
| startup-exterior.spec.js — failed courtyard keeps curriculum usable and retry opens campus once | passed |
| teachers.spec.js — teachers: reactions, bounded collision, lazy loading, mobile and recovery | passed |
| test-character-controls.spec.js — Dress ups named colours, lazy archive and saved per-style choices 1280 | passed |
| trial-launch.spec.js — plan to visible trial has a clear next step at 1280 | passed |
| trial-launch.spec.js — plan to visible trial has a clear next step at 390 | passed |
