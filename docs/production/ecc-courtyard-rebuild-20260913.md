# ECC courtyard rebuild — 13 September 2026

The existing game now contains an authored replacement for the visible ECC courtyard architecture, with an editable Blender master. This is a local quality candidate, not a declaration that the 80–90% hero target has been met. The approved middle-panel concept remains the governing reference.

## What changed

- Connected curved Chapel, gabled Administration and Student Services rebuilt as a coherent architectural asset. The final main roofs run across the wings, with real tiles, enclosed ends, soffits, slim covered links, recessed glazing and room geometry.
- Photographic sandstone, bevelled paving and coping, restrained paving grain, warm interior light and garden HDR reflections. Generated reception back-wall imagery sits behind actual room geometry; it is a game asset, never gameplay evidence.
- Layered strappy groundcover, fine-leaf shrubs, branching eucalypts, garden rocks and two additional forecourt beds. Existing useful rocks, crest and surrounding campus assets are retained.
- The welcome sign is on the **right**, and Home Base returns to it at (4.9, −1.7).
- The **supplied Chapel photograph** provides the iconic tree-glass and figure surface beside the entrance. Original image bytes are retained. This is a photographic surface, not an exact free-standing 3D sculpture; the 304 × 356 source limits close-up clarity.
- Existing movement, destinations, avatar interfaces, Studio save/return, Chapel reflection and EST remain. The shared Flourishing sun/fill adjustment also affects the surrounding outdoor world. Other phase presets and curriculum/state triggers remain unchanged.

## Actual evidence

[Before screenshot](https://taniab1975.github.io/career-empire-blueprint/evidence/ecc-hero-20260913/rebuild/ecc-rebuild-before.png) · [Rebuilt screenshot](https://taniab1975.github.io/career-empire-blueprint/evidence/ecc-hero-20260913/rebuild/ecc-rebuild-after.png) · [Phone view](https://taniab1975.github.io/career-empire-blueprint/evidence/ecc-hero-20260913/rebuild/ecc-rebuild-phone.png) · [Interactive comparison](https://taniab1975.github.io/career-empire-blueprint/evidence/ecc-hero-20260913/rebuild/ECC-courtyard-rebuild-review.html).

Before and after use the actual game at 1440 × 900, DPR 1, Avery at (0, 0.16, −2.8), normal walking camera, Flourishing / Auto. Screenshots are unretouched. The previous source is 69cf624. The review harness adds measurement controls only; no camera or scene alteration is used for the comparison. The final screenshot is taken directly from the production page.

## Performance and loading

| Measurement | Previous courtyard | Rebuilt courtyard |
|---|---:|---:|
| Visible triangles | 1,917,123 | 2,284,884 |
| Draw calls | 358 | 340 |
| Short desktop FPS sample, median | 53.5 | 41.5 |
| Sample FPS range | 51–60 | 32–47 |

The rebuild adds about **19% triangles** and uses about **5% fewer draw calls**. New runtime assets and their loading modules total **5.82 MB**. The architecture GLB is **2.22 MB**, reduced from **9.25 MB** without simplifying its geometry; WebP reduces transport size for the new 1024-pixel paving maps. These are file sizes, not a claim about download time or GPU memory reduction.

Frame rates varied across short desktop runs; an earlier rebuilt sample reached 60 FPS. The final recorded comparison above is retained rather than selecting the fastest result. These are eight-second samples on this Mac, not a sustained school-hardware or physical-phone benchmark. Cached localhost readiness was about 1.2 seconds for the rebuild, but cache state and range requests make it unsuitable as an internet-load comparison. Browser network totals are retained in the raw evidence and must not be treated as an exact cold payload size.

## Verification and limits

Seven real-physics routes pass: Studio, reception, Careers, EST, northern campus, new Home Base and Chapel approach. Doors are reachable while the tested wall and pond remain solid. Manual desktop checks cover Chapel entry, reflection and return, Studio save/return and the moved Home Base. At 390 × 844, compact settings, Low quality, Growth selection, Home Base and Chapel entry work; this is desktop viewport testing.

Source and module syntax checks pass. The CI source/unit stages passed (six unit tests). All 37 automated browser cases were blocked at browser launch by the macOS sandbox, before application assertions. Scoped browser/physics checks do not replace a full CI pass. No deployment or physical-device acceptance is claimed.

## Gap to the hero target

The rebuild establishes more coherent architecture, room depth, a planted approach and warm light. It still needs stronger species variety and natural variation in the planting, more convincing close-up interior dressing and a higher-resolution/fully modelled Chapel recognition treatment to stand beside the reference at close range. Its overall art quality remains a review candidate. Passing technical checks does not close the HERO acceptance gate.

## Blueprint and reusable standard

The canonical Blueprint records the authorisation, both requested changes, source photo, generation provenance, staged progress, actual screenshots, rejected experiments, editable master, compression recipe and verification limits under CE-CHANGE-20260913-47. The governing hero-fidelity standard and three tiers are retained. Global refresh stays incomplete; old /mnt/data byte identities, broader source refresh, hosted CI and independent-clone monitoring remain unresolved.

Reusable work: editable geometry in metres; separate gameplay collision contract; real window/room depth with economical background textures; shared photo PBR maps and environment reflections; instanced native foliage; material batching; compressed GLB and WebP transport; same-camera evidence before promoting a visual standard. Production source and complete asset provenance are retained canonically.

**Next environment:** Avatar Studio exterior, after ECC visual and target-device acceptance. Supporting paths/landscape follow the accepted kit; background buildings use progressively cheaper geometry and distant representations. No whole-world rewrite is authorised by this pilot.

[Walk the local courtyard](http://127.0.0.1:4285/playable-3d/?view=ecc-courtyard). The local preview requires its server to remain running. Nothing in this rebuild has been published.

Evidence is retained locally in the canonical Blueprint; the public-style paths above have not been published in this task.
