# Approved icon integration and grounded sightline options

Based on local `1e723b78a69bf863643556f457b9fc9ee13e9a6c`; the earlier photo handover and focused test commits are retained. This is an independent local icon change, not a publication or visibility acceptance.

## Approved skill family

The six parent and 21 subset 256px WebP assets are copied unchanged into `dashboards/skill-icons/v3/`. All 27 SHA-256 values match the approved v3 package. The image payload is 383,746 bytes. The package manifest retains the approved IDs, labels, original numbering and parent/subset relationship; there is no Digital Literacy 2.2.

The existing dashboard/STAR portfolio UI now resolves an icon by category and subskill ID. This avoids matching a meaningful subset to the wrong illustration when the existing display-array order differs from the approved numbering. The six parent logo paths in the shared skill JSON change; every other taxonomy field, label, order, description and stable ID is byte-equivalent after parsing. No learning, STAR evidence, points, rewards, account or saved-data logic is changed.

Subset cards use 64px artwork with adjacent text so the parent badge remains legible. Images load lazily and decode asynchronously. The normal 3D game imports no icon module or manifest and starts zero icon/taxonomy requests. No new boot preload, larger PNG/512px exports, dependencies or image conversion.

The new icons live under the dashboard directory to preserve the original `Assets` spelling and avoid a Mac case-insensitive root-folder collision. Original source Assets remain untouched. All dashboard pages using the shared renderer/styles receive the same cache tag.

## Focused checks

- Desktop and 390px phone preview each render all 27 approved icons at natural 256px size after scrolling the existing skill cards into view. Labels are unchanged, all skill images have lazy loading, and no subset-card text overflows. Screenshots inspected. The browser uses a local untracked preview context; this does not verify a real student login.
- A normal canonical game entry reaches its actual entry-ready gate and requests zero `skill-icons/v3` assets or employability taxonomy JSON.
- Source/syntax checks pass. `npm run check` passes with a temporary read-only original Assets link (removed after the check), including 278 exact existing game asset hashes / 85 reachable modules. The separate icon manifest and all 27 assets were verified independently.
- One repeated private browser check initially failed because its expected path prefix still used the first temporary asset location. The two final-path card checks were corrected and passed; no missing production image was observed.

## Sightline comparison remains a visual decision

Four real-control grounded camera-offset routes pass across desktop/phone, and two small planting-gap routes pass. The camera candidates preserve the original 3.1m height, 6.4m follow distance and FOV, taper before the parcel and retain real walking; they do not make Media/SPACE clearly recognisable. The planting candidate shifts two existing right-hand foreground trees 0.60/0.65m within their current beds, preserving all trees, geometry, materials, paths and camera. It modestly clears the Chapel/Administration cue but does not remove the rear-building obstruction.

Four further captures compare the current and planting-gap opening after the same decorative surfaces settle. The actual first-frame captures and timings are retained separately. Local unthrottled planting-candidate entry times are 1.87s desktop / 1.89s phone. These measurements are not cold-network or hosted software acceptance.

No production camera/spawn/tree-placement change or weakened visibility test was committed. The supplied two options are the current grounded composition and the small planting gap, each at desktop and phone widths. Rear-building recognisability remains unresolved; loading another silhouette at the same coordinates would not solve physical occlusion. The original full-visibility test expectations should be reconciled with the chosen composition after that decision, rather than treating off-screen meshes as failed loads.

Private evidence: `coverage/post-photo-tour/skill-icon-final-cards/`, `skill-icon-final-ui/`, `sightline-options/`, `planting-gap-options/` and `stable-opening-options/`. Library deliverable screenshots are staged separately under the task output directory. No broad CI, push, merge, deployment, Market redesign or historical branch restore. Hosted software Sprout uncertainty remains.
