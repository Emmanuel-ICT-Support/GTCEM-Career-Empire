# Curriculum-First Progressive Loading

Approved by Tania on 22 September 2026. Canonical records: CE-CHANGE-20260922-79 and PROD-20260922-LOADING-01.

Optional cosmetic/customisation assets must never block the core world or curriculum experiences. Startup loads the core world/navigation and essential interactions, then restores only the active saved avatar and its selected outfit. A download-free temporary avatar keeps the game usable while that model is slow or unavailable. Saved preferences are never replaced with fallback settings.

## Cause and fix

On main `0886faf`, EST Prep, Careers and Chapel all awaited `ensureCampus()`, including distant trees, detail textures and environment decoration. A browser test reproduced EST remaining inaccessible when one tree failed. Startup separately waited indefinitely for manual avatar retry, and EST room construction awaited its video poster.

Room entry now awaits only its own room resources. The poster loads independently. Avatar download runs alongside core startup; late completion preserves the student's current room, position and orientation. Construction occurs before the working actor is disposed, and a failed model exposes Retry saved avatar without blocking navigation or rewriting the profile.

Studio stays on demand. Early/failed visits show: “Avatar Studio is getting ready. The studio is still setting things up. Explore Career Empire and pop back in a few minutes.” Moving to another destination cancels late Studio entry. Catalogue options/thumbnails stay separate from selected full 3D item downloads. Explicit wardrobe links also retain a playable world while Studio prepares.

The existing safe exterior boundary remains until exterior colliders are ready. EST, Careers and Chapel destination buttons work during that wait; returning uses Arrival Gardens when the exterior is unavailable. Home Base and flyover retain their exterior-readiness gate. No new interior is invented for scenery-only buildings. Existing artwork, curriculum content, teacher assets and profile schema remain unchanged. The emergency EST fallback link is corrected to the actual relative module URL.

## Validation

- Baseline fault reproduction: EST entry failed with one decorative tree unavailable.
- 20 distinct focused Chromium scenarios passed across the scoped runs: curriculum and module entry; Careers/Chapel/returns; desktop and 390px navigation; slow/failed avatar, saved garment, Studio and poster; saved bodies, selected-only downloads, save/reload, late-entry cancellation, scenery retries, wardrobe controls and EST media.
- 42 unit tests passed. Source/package hashes and final retry-control checks are recorded in the task's validation receipt.
- Controlled fresh-browser comparison with an identical eight-second saved-avatar delay: first playable frame **8,676 ms → 863 ms**. Separate blocked-resource desktop/390px tests reached first frame at **906/918 ms** and EST at **3,830/3,819 ms**. These are local native Chromium measurements, not public-network or physical-phone guarantees.
- An initial retry test read diagnostics before its first sample; the assertion now waits safely and passes. The original runtime failure and the test-only correction remain in local evidence.

Game publication, hosted CI, physical-device acceptance and Blueprint reader publication remain separate. This document records a tested source change, not live deployment.
