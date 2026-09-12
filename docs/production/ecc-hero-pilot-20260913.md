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
This is a materially richer local candidate, not final hero fidelity or a verified new deployment. Perceived 80–90% richness has not been achieved/certified. Natural foliage, less repetitive roof/material microdetail, deeper coherent glazing/interiors and target-device performance remain. Browser frame rates fluctuate; draw-call/triangle reductions are reproducible workload evidence, not a guaranteed FPS improvement. New PBR maps add approximately 28 MiB including mipmaps over the replaced maps, plus CPU creation work; total GPU memory was not measured. No new mesh/image downloads or paid credits.

Original current-conversation /mnt/data/image.png and /mnt/data/Campus.jpeg were inaccessible; retained approved canonical campus/corridor originals were inspected. Exact three-panel comparison stays open. Current public baseline remains d442671: Pages succeeded, existing hosted CI failed at Run checks and tests. No new push/publication.

Next destination after ECC acceptance: Avatar Studio exterior, with avatar/wardrobe work still separately paused.
