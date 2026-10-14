# ECC hero-fidelity pilot — 13 September 2026

Governing authority: canonical Career Empire Blueprint CE-CHANGE-20260913-47 / CE-VISUAL-20260913-HERO. The existing production-blueprint checkout remains the sole plan/decision authority. This document is the game implementation receipt.

## Scope
Local pilot on live baseline d442671. Retains connected Chapel/Admin/Student Services, exact crest, current layout, entrances/colliders, approved walking camera, EST, Studio, joystick and original GLBs. No avatar/wardrobe or curriculum state-trigger production.

- Shared deterministic sandstone/paving PBR maps; red-channel height and green-channel roughness packed into one data texture per family.
- Window reveals and inexpensive room impressions, retained roof forms with richer fascia/Chapel roof band, timber entrance soffits, planter coping and contact-AO cards.
- More grasses/flowers/shrubs/rocks inside existing beds, using unchanged source GLBs and instancing.
- Warmer directional Flourishing sunlight and lower fill; existing Growth/Disrepair and discrete state control preserved.
- Exact static batching of opaque SPACE/Media and repeated shade geometry, pooled identical Media materials, transparent sorting retained. Original instance matrices split into 12-unit cells so offscreen plants can be culled without removing detail.

## Verification
Source checks, six service unit tests and full 36-scenario browser suite exercised. Initial full browser run: 35 passed, new batching regression failed. It exposed loss of shear when decomposing a transparent world matrix under non-uniform scaling. Fixed by retaining the exact matrix; focused retest passed. Existing campus routes, walls/pond collision, Home Base/Studio separation, desktop/phone Chapel and EST controls, startup and saved-avatar flows passed. No claim of one clean all-green CI invocation: combined run plus targeted fix/retest is the evidence.

Fixed arrival/Home Base/aerial desktop and phone viewport screenshots, plus identical normal-player forecourt and services views, retained in the canonical pilot evidence. Test-only viewpoint injection stays outside shipped runtime. Full material/geometry source lives in this repository; Blueprint carries the reference hashes, visual standard, comparison and measured results.

## Limits and next work
This is a materially richer local candidate, not final hero fidelity or a verified new deployment. Perceived 80–90% richness has not been achieved/certified. Natural foliage, less repetitive roof/material microdetail, deeper coherent glazing/interiors and target-device performance remain. Browser frame rates fluctuate; draw-call/triangle reductions are reproducible workload evidence, not a guaranteed FPS improvement. Final stone/paving PBR maps use 512-pixel textures sampled from the same authored pattern: course/paving scale is unchanged. These sets add approximately 4 MiB including mipmaps over the replaced maps, with roughly 1.4 MiB for room/contact maps; total GPU memory was not measured. Fixed normal player views were rechecked after this final memory reduction. No new mesh/image downloads or paid credits.

Original current-conversation /mnt/data/image.png and /mnt/data/Campus.jpeg were inaccessible; retained approved canonical campus/corridor originals were inspected. Exact three-panel comparison stays open. Current public baseline remains d442671: Pages succeeded, existing hosted CI failed at Run checks and tests. No new push/publication.

Next destination after ECC acceptance: Avatar Studio exterior, with avatar/wardrobe work still separately paused.

## Courtyard slice — final local checkpoint, 13 September 2026

Actual recessed Admin/Services rooms and glazing, photographed sandstone with normal/AO/roughness maps, roof/timber/slatted-link detail, four fine-leaf native trees and layered shrubs/grass in the ECC beds and two existing foreground beds. Flourishing sunlight/fill revised. Existing collision footprints, connected Chapel/Admin/Services, original GLBs, controls, quiet reflection and EST retained.

This is a local playable iteration and remains below the approved hero reference. Overall architectural and landscape composition, convincing interiors/reflections and natural foliage still need further art work. No 80–90% fidelity, physical-device acceptance, wider rollout or deployment is claimed.

| View | Draw calls before → after | Triangles before → after | Change | Ready time before → after | FPS samples before → after |
|---|---:|---:|---:|---:|---|
| 1440 px | 352 → 358 | 1,800,401 → 1,917,123 | +6.5% | 2.58 → 2.70 s | [31, 37, 37] → [32, 33, 33] |
| 390 px | 224 → 230 | 929,365 → 823,987 | -11.3% | 2.00 → 2.16 s | [59, 60, 59] → [59, 56, 60] |

Local Chromium/Metal, DPR 1, Auto, Flourishing; identical player [0, -2.8], yaw 0, normal walking camera. Three one-second samples after six seconds settling. Draw/triangle counters describe the main camera render and exclude shadow-pass work, consistently with the baseline. Phone figures simulate a viewport on the Mac, not a physical phone. Runs varied substantially; do not infer a guaranteed FPS or a network-loading speedup.

Added encoded resources: 481,637 bytes (approximately 470 KiB); three 1K JPEG maps and one reusable geometry module. Estimated added material-map GPU allocation ~12.5 MiB including mipmaps, plus reflection-map/geometry costs; total GPU memory unmeasured. No paid assets or generation credits. Sandstone Blocks 08 by Rob Tuytel, [Poly Haven](https://polyhaven.com/a/sandstone_blocks_08), CC0; upstream hashes and provenance retained beside the assets.

Ten distinct focused browser scenarios passed across the initial seven passes and the isolated four-test rerun (one overlap): paths/collisions, arrival-to-Studio/save/reload, startup/avatar choices, phase/movement, loading failure handling, desktop/phone Chapel and the new courtyard-link/quality/resize/return check. The initial run retained two timing failures during concurrent screenshot work; both passed in isolation. Source checks and module syntax passed. These are scoped checks, not a claim of a fresh full-repository CI run.

Rejected experiments: depth-based screen-space occlusion had insufficient benefit for its cost and introduced edge artefacts; removed from shipped code. The suspected shadow-camera initialization defect was ruled out by the actual renderer code/runtime matrices; unnecessary update removed. The final foliage uses four nondegenerate triangles per folded leaf, preserving the silhouette while reducing redundant geometry; no new full-screen render targets remain.

Reusable standard: real apertures and inexpensive rooms behind glass; shared photo-based PBR maps with provenance; cached, instanced, fine-leaf vegetation; material-level AO and directional light; retain a fixed normal-player comparison and measure both image and cost.

Next: Keep the next visual work on this same ECC courtyard: close the remaining interior/glass and natural landscape composition gap, and verify sustained walking performance on school hardware before calling it the HERO benchmark. Avatar Studio exterior follows only after ECC acceptance; avatar/wardrobe and world-state timing remain parked.

Access: supplied 13 September screenshot and retained original concepts available. Original /mnt/data/image.png and /mnt/data/Campus.jpeg and read_thread remain unavailable. GitHub main d442671 verified again; its Pages run succeeded and existing hosted CI failed. Independent current game clone remains outside the older scan registry and was manually verified. Global refresh stays null; retained backlog and stale Blueprint publication reviews are not cleared.
