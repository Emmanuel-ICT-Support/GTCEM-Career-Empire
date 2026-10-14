# Pending historical cases — 14 October 2026

Updated after the phone/readiness verification batch:47 repaired native passes,13 other native passes,10 pending. These are distinct historical-case observations, not hosted CI totals.

| # | File | Exact historical case | Next check |
|---|---|---|---|
| 1 | companion-visible.spec.js | selected Sprout is visibly rendered in the active town and Market scenes | Release owner: hosted Sprout mesh visibility; do not edit here. |
| 2 | entry-visibility-probe.spec.js | initial complete campus, unobstructed rear buildings and parcel walking 1280 | Known physical rear-building occlusion. Retain grounded camera, trees and thresholds; major visual repair needs user review. |
| 3 | entry-visibility-probe.spec.js | initial complete campus, unobstructed rear buildings and parcel walking 390 | Known physical rear-building occlusion. Retain grounded camera, trees and thresholds; major visual repair needs user review. |
| 4 | photo-handover.spec.js | actual photo review precedes accurate orientation handover, Mara map target and Market entry | Release owner: photo/tour handover; do not edit here. |
| 5 | startup-campus-entry.spec.js | video to complete exterior, walking and automatic parcel at 1280 | Holds required trees yet expects no tree request; reconcile without weakening real frame/building/parcel/8s assertions. |
| 6 | startup-campus-entry.spec.js | video to complete exterior, walking and automatic parcel at 390 | Holds required trees yet expects no tree request; reconcile without weakening real frame/building/parcel/8s assertions. |
| 7 | startup-costs.spec.js | measure complete campus handover costs cold-skip | 8s cold-skip budget is still unmet historically; measure stages, retain deadline. |
| 8 | first-play.spec.js | Arrival is playable while distant models and textures wait, then opens the whole campus | Old optional-tree/global-loading assumptions conflict required initial geometry; retain real movement/retry/no-duplication checks. |
| 9 | playable-scenery.spec.js | campus waits for both buildings and keeps destinations and movement | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |
| 10 | playable-scenery.spec.js | failed campus loading explains retry instead of revealing missing buildings | Old global loading overlay assertion precedes current lazy DOM; preserve complete buildings and real walking. |

## Verified world interaction and EST repairs

42516eb moves companion interaction below fixed Studio/Chapel/teacher/Original Game actions. Actual arrival/Studio and both Chapel routes pass with original walking/save/return assertions. EST interior camera height follows actual rear-wall clearance; projected Play stays below the header on desktop and phone. Outdoor camera, trees and wall collisions remain unchanged. Both real video/seek/restart and document regressions pass; five source/projection units pass. Manifest validates280 exact hashes/87 modules.

d93522e isolates teacher URLs to configured origin, selects mobile target by identity, and waits a real resized render before the tap. Full teacher test passes20.9s including all reactions, collision separation/bounds, lazy loading, actual mobile click, Studio pause and failed-asset recovery.

Physical rear-building occlusion remains separate; strict visibility thresholds and grounded camera are retained. Release owner retains photo/companion tests. No full suite, push or deployment.
