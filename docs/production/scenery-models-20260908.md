# Scenery replacement, 8 September 2026

Replaces all 36 procedural cylinder/cone trees with the supplied tree and replaces the Home Base copy of the EST building with the supplied city building. Original tree positions, random-number sequence, ground/roads, EST exterior/interior, destinations, avatars, controls and physics are retained. The original scenery remains a fallback if downloads fail.

Home Base is centred at (-17, 0, 5), faces east (+90 degrees Y), and is uniformly scaled to fit its existing 4 x 7.2 collision footprint. Its label is lowered to 1.5 units above ground. This is a compact stylised multi-storey building at the existing game's scale, not a full-size architectural simulation. EST Prep remains the existing purpose-built hall to preserve the entrance and restoration phases.

## Uploaded asset decisions

| Source | Decision | Shipped asset | Bytes | Triangles |
| --- | --- | --- | ---: | ---: |
| tree+3d+model (1).zip | Used for all 36 trees | tree.glb | 399,884 | 11,890 |
| Same tree | Distant LOD | tree-low.glb | 263,844 | 3,561 |
| city building 3d model.glb | Home Base exterior | city.glb | 427,916 | 23,999 |
| modern+building+3d+model.zip | Inspected and optimised, excluded from live scene | None | 0 downloaded | 0 rendered |

The modern model is a tall tower. There are no spare generic building lots in the current scene: only EST Prep and Home Base. Squeezing the tower into either would give inappropriate scale or require changing the layout/collisions. An optimised copy was retained as a separate deliverable for a future district, without adding it to page downloads.

## Optimisation

The city source was 56,624,636 bytes and 1,759,471 triangles. Close-position vertices were welded at 0.00001 source units before decimation; decimation without welding produced visible tearing and was rejected. The tree's first lower-detail near version was also rejected because too much foliage detail was lost. Final models were rendered and inspected before integration.

Blender 5.2.1: apply object rotation/scale, retain UVs, weld high-detail tree/city, decimate, reduce 4096px textures to 1024px, export JPEG colour at quality 82, remove metallic/roughness/normal texture dependencies and use simple material constants. Export GLB with Draco level 6, without animation. Both tree LODs share a material/texture at runtime. The existing local Draco decoder is reused.

All new downloads total 1,091,644 bytes (1.09 MB decimal). They start after world entry, so the startup's existing avatar and hall lazy-loading remains intact. Initial fallback scenery may briefly appear on slow connections. At 4 Mbps the added bytes alone represent about 2.2 seconds of background transfer; this is arithmetic, not a measured network test.

The tree renderer uses two instanced detail bands, grounded and uniformly scaled to each original tree's height, with its original random yaw. Near detail enters at 24 units and leaves at 28 units. LOD selection updates four times per second and shares geometry/materials across all instances. Phase colours are applied even if the phase changes before download completion.

## Verification

- Project syntax/reference check and unit coverage suite: passed (6 unit tests).
- Focused scenery/startup browser suite: passed (4 tests), including held-back downloads, failed-download fallback, all 36 trees, phase switching during load, movement, Home Base interaction, avatar body loading/saving, and EST hall entry.
- Full repository browser regression suite: all 27 tests passed (2.4 minutes).
- Direct keyboard collision checks: Home Base stopped the avatar at x=-14.775; EST front stopped it at z=-9.675, on its original 0.24-height step.
- Desktop visual QA: spawn, Home Base close-up and aerial overview. Mobile layout inspected at 390 x 844, DPR 2.
- Same local Mac/Chromium Metal desktop spawn view, 1440 x 1000: baseline 60 fps / 228 draw calls / 99,897 triangles; updated 60 fps / 228 draw calls / 292,997 triangles. Updated aerial sample: 60 fps / 240 calls / 283,802 triangles. These are renderer diagnostic samples, not a long-duration benchmark.
- Mobile emulation on the same Mac: 59 fps / 178 calls / 292,119 triangles. This does not establish performance on physical low-end phones. Geometry workload has increased despite efficient downloading and instancing.

Trees beyond the existing ground tile boundary retain their original coordinates; no terrain or world-layout redesign was included.
