# Pending historical cases — 14 October 2026

Exactly 31 entries from CI38496584315 remain pending. This is a checklist, not proof each still fails. Current accounting:30 repaired native passes,9 unchanged native passes,31 pending. Phone source repair9de0962 has unit/source checks only and does not reduce this count. Browser slot remains with release owner.

| # | File | Exact historical case | Next check |
|---|---|---|---|
| 1 | companion-visible.spec.js | selected Sprout is visibly rendered in the active town and Market scenes | Release owner: hosted Sprout mesh visibility; do not edit here. |
| 2 | discovery-intro.spec.js | canonical no-query entry skips intro into the real scene without writing trail progress | Inherited bounded ready-DOM repair; current verification pending. |
| 3 | entry-visibility-probe.spec.js | initial complete campus, unobstructed rear buildings and parcel walking 1280 | Known physical rear-building occlusion. Retain grounded camera, trees and thresholds; major visual repair needs user review. |
| 4 | entry-visibility-probe.spec.js | initial complete campus, unobstructed rear buildings and parcel walking 390 | Known physical rear-building occlusion. Retain grounded camera, trees and thresholds; major visual repair needs user review. |
| 5 | photo-handover.spec.js | actual photo review precedes accurate orientation handover, Mara map target and Market entry | Release owner: photo/tour handover; do not edit here. |
| 6 | startup-campus-entry.spec.js | video to complete exterior, walking and automatic parcel at 1280 | Holds required trees yet expects no tree request; reconcile without weakening real frame/building/parcel/8s assertions. |
| 7 | startup-campus-entry.spec.js | video to complete exterior, walking and automatic parcel at 390 | Holds required trees yet expects no tree request; reconcile without weakening real frame/building/parcel/8s assertions. |
| 8 | startup-costs.spec.js | measure complete campus handover costs cold-skip | 8s cold-skip budget is still unmet historically; measure stages, retain deadline. |
| 9 | arrival-gardens.spec.js | arrival walk reaches Studio and retains avatar save after reload | Walking starts at first draw before entryReady; verify focus and ready frame before real route. |
| 10 | avatar-studio-entry.spec.js | Home Base returns to ECC welcome; Studio remains separate | Expected Home coordinates still exactly match ECC_HOME; await actual travel/readiness, do not alter target. |
| 11 | chapel.spec.js | Chapel reflection and campus return at 1440px | Reflection walking and outdoor return need fresh state/input evidence; CHAPEL.z remains -8.8. |
| 12 | chapel.spec.js | Chapel reflection and campus return at 390px | Reflection walking and outdoor return need fresh state/input evidence; CHAPEL.z remains -8.8. |
| 13 | est-wall-video.spec.js | EST requires wall play, seeks and restarts at 1440px | Real wall Play projection hidden historically; inspect actual interior camera/matrix/DOM before changing visibility. |
| 14 | est-wall-video.spec.js | EST requires wall play, seeks and restarts at 390px | Real wall Play projection hidden historically; inspect actual interior camera/matrix/DOM before changing visibility. |
| 15 | first-play.spec.js | Arrival is playable while distant models and textures wait, then opens the whole campus | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 16 | first-play.spec.js | background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 17 | first-play.spec.js | a failed entry texture retries before optional landscape loads | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 18 | game-entry-loading.spec.js | game entry loads only the active avatar and worn clothes | Waits for full campus without requesting it; selected-only and worn-clothes checks remain valid. |
| 19 | game-entry-loading.spec.js | game entry loads only the active avatar and worn clothes | Waits for full campus without requesting it; selected-only and worn-clothes checks remain valid. |
| 20 | startup-performance.spec.js | normal play avoids GPU pixel probes and uses shared building textures | Short movement hold after Aerial; retain >0.5m and zero-readback assertions, inspect focus/live frames. |
| 21 | startup-surface-gate.spec.js | complete intro reaches natural end and hands over to usable movement | Natural EOF or owned parcel/reward lifecycle: inspect actual input, readiness and fresh diagnostics. |
| 22 | startup-surface-gate.spec.js | mocked owned-account parcel, map and shared wallet persist without a duplicate reward | Natural EOF or owned parcel/reward lifecycle: inspect actual input, readiness and fresh diagnostics. |
| 23 | phone-startup.spec.js | phone opening uses smaller phone assets once and releases startup cache | 9de0962 phone resolver composition; unit/source pass, browser pending. |
| 24 | phone-startup.spec.js | failed phone tree load clears temporary cache and supports retry without reloading the character | 9de0962 phone resolver composition; unit/source pass, browser pending. |
| 25 | playable-scenery.spec.js | campus waits for both buildings and keeps destinations and movement | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |
| 26 | playable-scenery.spec.js | failed campus loading explains retry instead of revealing missing buildings | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |
| 27 | playable-startup.spec.js | startup loads only the active avatar and keeps the studio and hall usable | Requires actual rendered frame; preserve Studio/EST and selected-only asset checks. |
| 28 | startup-exterior.spec.js | delayed courtyard must not hold game entry | firstFrame read can precede first scene submission; inspect genuine failed-courtyard retry and stable colliders. |
| 29 | startup-exterior.spec.js | failed courtyard keeps curriculum usable and retry opens campus once | firstFrame read can precede first scene submission; inspect genuine failed-courtyard retry and stable colliders. |
| 30 | teachers.spec.js | teachers: reactions, bounded collision, lazy loading, mobile and recovery | Hardcoded 4273 URLs bypass isolated baseURL; inspect actual loading/reactions/collision/mobile/failure with scoped URL. |
| 31 | test-character-controls.spec.js | Dress ups named colours, lazy archive and saved per-style choices 390 | Inherited character-only request-count repair; phone verification pending. |

## Source findings and restrictions

The private campus LoadingManager bypassed DefaultLoadingManager phone resolution, confirmed by original packed and mobile downloads in recovered server logs.9de0962 composes device resolution with deferred-image placeholders; no tree geometry/placements/collisions change. Cascade import tags and manifest are updated only on the isolated branch. Browser budgets, retry and desktop-original asset verification remain pending.

prepareNextTask exits for no next guidance task or an already prepared task; full campus is not guaranteed to finish merely by waiting in a fresh classic run. Tests requiring full campus should invoke real student travel/Aerial. A hidden loading DOM is not an entry-ready or rendered-frame assertion.

Home coordinates still match the authored ECC_HOME calculation (approximately1.385,-0.877), and Chapel return remains -8.8. Those are valid destination expectations; do not weaken them to fit stale samples.

EST screen control uses the actual screen projected through the active camera. The two hidden-control failures remain unproven runtime defects until current interior rendering is inspected.

The two rear-building failures are physical occlusion, not absent assets. Do not remove trees, raise the walking camera or lower visibility thresholds. Coordinate a reviewable visual repair.

Release owner owns photo-handover.spec.js and companion-visible.spec.js. No full suite, push, merge or deployment yet.
