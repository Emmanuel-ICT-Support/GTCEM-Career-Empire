# Performance and movement optimisation — 14 September 2026

Base: `029badea74060157c1067c57d5527c7abba1be86`. Preserve the published garden, bench, access, pond, flicker and first-day-card corrections.

## Changes

1. `playable-3d/app.js`: nine synchronous GPU pixel reads ran every second solely for hidden colour diagnostics. Normal play now skips them. Explicit visual tests retain them with `?diagnostics=pixels`. Paired on/off/off/on native Chromium trials (7 seconds stationary plus 2.4 seconds walking each) recorded eight frames over 200ms in each diagnostics-on trial and zero in each normal-play trial. Worst frames were 267–300ms with diagnostics and 51–67ms without. Earlier loaded-machine observations reached 500ms. Regular frame times were similar; this removes periodic stutter, not a universal FPS guarantee. Speed, collisions, camera and input handling are unchanged.
2. `playable-3d/assets/campus-buildings/{garden,careers,workplace}-shared-textures.glb`: externalise seven identical embedded PNGs. Six shared images total 1.632MB; the seventh reuses the existing plaza limestone. Model files shrink from 13.866MB to 3.232MB raw. Estimated compressed transfer saving, including shared PNGs, is **8.993MB**. Every geometry buffer and extracted image is byte-identical to its original. Original models retained.
3. Five lossless WebP files replace PNG references, saving **3.363MB**. Original PNGs retained. Decoded RGBA hashes match exactly, including transparent pixels.

| Replacement under playable-3d | Original MB | New MB |
|---|---:|---:|
| assets/plaza/grass-ecc-campus-v1-lossless.webp | 2.562 | 1.965 |
| assets/plaza/asphalt_day-lossless.webp | 0.813 | 0.617 |
| ecc-preview/assets/authored-courtyard/chapel-etched-glass-v2-lossless.webp | 2.627 | 1.709 |
| ecc-preview/assets/admin-signage/cleaned-ecc-crest-source-lossless.webp | 2.087 | 0.972 |
| environment/assets/media-mural-sharp-v2-lossless.webp | 2.057 | 1.521 |

Combined estimated cold transfer saving: **12.356MB**, before minor text/header differences. MB are decimal. This is an estimate based on gzip model payloads and image bytes, not a device-independent loading-time promise.

Affected module imports use stable `v=opt2-20260914` release keys, which remain cacheable across visits. No per-visit timestamps. Previously released lazy avatar, EST-poster and area-light behaviour remains.

## Verification

Four deterministic native Chromium screenshots (Arrival Gardens, ECC courtyard, SPACE and Chapel) are pixel-identical before/after at 1440×900. Draw calls and triangle counts are identical. Source checks and 90 manifest hashes / 30 reachable modules pass. All 18 unit tests pass. Eight targeted browser checks pass (normal startup, explicit pixel diagnostics, courtyard controls, Avatar Studio, desktop/phone Chapel and desktop/phone EST video/documents). Five real-physics routes pass. Cold local inventory: 110 requests including blob/internal resources, no failed responses or script errors; estimated unique file transfer 26.18MB. This is a local compressed-payload estimate; live transfer is checked separately. Receipts are recorded with the Blueprint at task close.

The Home Base test had stale coordinates (4.9, -1.7); expectations now match the existing accepted landmark (1.385, -0.877). No destination code changed. Video seeking requires the repository's range-capable test server; the plain Python server cannot reproduce production seeking.

## Remaining balance

The initial scene still draws about 3.30 million triangles and 546 calls at the arrival view on this machine. Further gains require separately measured culling, shadow scheduling or mesh work, with visual comparisons. No resolution, shadow, lighting or geometry reduction was introduced. Alternate avatars, including existing saved test choices, keep their current behaviour. Full hosted CI and physical school-device performance are distinct from these local checks.
