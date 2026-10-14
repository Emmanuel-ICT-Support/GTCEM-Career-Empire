# Pending historical cases — 14 October 2026

Updated after the phone/readiness verification batch:36 repaired native passes,9 other native passes,25 pending. These are distinct historical-case observations, not hosted CI totals.

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
| 10 | chapel.spec.js | Chapel reflection and campus return at 1440px | Reflection walking and outdoor return need fresh state/input evidence; CHAPEL.z remains -8.8. |
| 11 | chapel.spec.js | Chapel reflection and campus return at 390px | Reflection walking and outdoor return need fresh state/input evidence; CHAPEL.z remains -8.8. |
| 12 | est-wall-video.spec.js | EST requires wall play, seeks and restarts at 1440px | Real wall Play projection hidden historically; inspect actual interior camera/matrix/DOM before changing visibility. |
| 13 | est-wall-video.spec.js | EST requires wall play, seeks and restarts at 390px | Real wall Play projection hidden historically; inspect actual interior camera/matrix/DOM before changing visibility. |
| 14 | first-play.spec.js | Arrival is playable while distant models and textures wait, then opens the whole campus | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 15 | first-play.spec.js | background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 16 | first-play.spec.js | a failed entry texture retries before optional landscape loads | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 17 | startup-performance.spec.js | normal play avoids GPU pixel probes and uses shared building textures | Short movement hold after Aerial; retain >0.5m and zero-readback assertions, inspect focus/live frames. |
| 18 | startup-surface-gate.spec.js | complete intro reaches natural end and hands over to usable movement | Natural EOF or owned parcel/reward lifecycle: inspect actual input, readiness and fresh diagnostics. |
| 19 | startup-surface-gate.spec.js | mocked owned-account parcel, map and shared wallet persist without a duplicate reward | Natural EOF or owned parcel/reward lifecycle: inspect actual input, readiness and fresh diagnostics. |
| 20 | playable-scenery.spec.js | campus waits for both buildings and keeps destinations and movement | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |
| 21 | playable-scenery.spec.js | failed campus loading explains retry instead of revealing missing buildings | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |
| 22 | playable-startup.spec.js | startup loads only the active avatar and keeps the studio and hall usable | Requires actual rendered frame; preserve Studio/EST and selected-only asset checks. |
| 23 | startup-exterior.spec.js | failed courtyard keeps curriculum usable and retry opens campus once | firstFrame read can precede first scene submission; inspect genuine failed-courtyard retry and stable colliders. |
| 24 | teachers.spec.js | teachers: reactions, bounded collision, lazy loading, mobile and recovery | Hardcoded 4273 URLs bypass isolated baseURL; inspect actual loading/reactions/collision/mobile/failure with scoped URL. |
| 25 | test-character-controls.spec.js | Dress ups named colours, lazy archive and saved per-style choices 390 | Inherited character-only request-count repair; phone verification pending. |

## New verified root causes

Following companions shadow fixed-world interaction buttons because the Echo proximity branch precedes Studio, Chapel, teachers and Original Game. Actual route failures show Talk to Echo; four source reproductions verify the proposed reorder and retain normal companion interaction. Proposal patch is private coverage/broad-repairs/interaction-priority.patch; actual app priority logic has not been changed pending coordination.

EST starts near its rear wall. Camera back-clamping plus forced lookAt(player+0.9) projects wall-screen centre far above the viewport. A bundled-Three projection reproduction yields Y2.409 at1440/fov55 and2.087 at390/fov62, exceeding the existing0.85 control threshold. Proposed distance-proportional indoor camera height yields0.701/0.608 while retaining the outdoor camera and wall clamp. This is a source/math proposal, not a rendered fix. Private reproduction:coverage/broad-repairs/est-camera-projection.mjs.

Physical rear-building occlusion remains separate: preserve trees, grounded camera and strict visibility thresholds. Release owner retains photo/companion tests. No full suite or deployment.
