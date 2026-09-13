# Approved standard rollout — 13 September 2026

Tania approved courtyard af04666 and authorised its standard for the rest of the existing playable world. This local rollout applies it to Avatar Studio, the remaining ECC teaching buildings and approaches, Careers/EST, and supporting paths and gardens. The original approved courtyard and reference artwork remain the governing examples.

## What changed

- **Avatar Studio:** authored sandstone tower/returns, bevelled edges, separate framed windows and doors, timber soffits, layered roof/fins, real furniture/shelving and an economical photographic room background. Existing entrance and editor behaviour remain.
- **SPACE:** retained grey hall, tall steel bays, blue mural and corrected rear foyer; opened up the visual shell behind windows to create real depth, added room furnishings and cladding detail, and extended shadow coverage to this northern location.
- **English and Media:** retained the curved facade, fins, books/furniture, mural and orientation; adopted the accepted sandstone, timber and restrained glass treatment, with landscaped approaches.
- **Home Economics:** replaced the plain low block with a glazed, framed, furnished frontage and shaded roof edge within the existing footprint; added its name and clear path connection.
- **Careers and EST:** retained their authored models and entrances; carried through the approved stone, timber, glazing and paving materials. Original GLBs remain unchanged.
- **Gardens and circulation:** denser authored native-style groundcover and shrubs, pale coping, consistent sawn-paving joints and new clear teaching-building connections. The new plants use spatial groups and lower detail beyond 30 metres.
- **Lighting:** the accepted central courtyard lighting stays fixed. Outside that area, the same directional light and its target translate together to provide nearby shadows without enlarging the shadow map across the whole campus.

The exact original crest, supplied Chapel photograph, right-hand welcome sign and Home Base position remain. Chapel wellbeing, walking/collisions, avatar/editor/save flows, EST, paused wardrobe and curriculum-state timing are preserved. This is a rollout across existing locations, not new curriculum or a new world layout.

## Performance and loading

| Fixed view | Before median FPS | After median FPS | Draw calls before → after | Triangles before → after |
|---|---:|---:|---:|---:|
| Arrival | 14.0 | 33.5 | 1,005 → 552 | 7,187,596 → 3,310,954 |
| Courtyard | 23.0 | 41.5 | 340 → 330 | 2,284,884 → 2,151,880 |

These are eight-second local Mac samples at 1440 × 900 / DPR 1, Flourishing / Auto. Runs vary significantly; the raw ranges and intermediate runs are retained. They do not establish sustained school-device or physical-phone performance. Snapshot FPS during camera transitions is excluded from the benchmark claims. Rendering counts include the effect of culling and shadow coverage.

No new image/model download is required: the accepted textures, HDR and room image are shared. Four now-unused optional plant GLB loads total **2,873,028 bytes**; their source files are retained. This is a reduction in these requested assets, not a measured internet transfer saving or total cold-start claim. New runtime code and procedural geometry have their own CPU/GPU cost. Sharing one botanical module avoids building duplicate geometry caches.

## Verification

- Eleven real Rapier routes pass: Studio, reception, Careers, EST, northern campus, Home Base, Chapel approach, Media, SPACE, Home Economics and oval. The tested wall and pond still block movement.
- Eight fixed before/after views inspected in the actual renderer. The original Careers camera intersected the existing Studio; both Careers captures use the same corrected oblique walking view. A retained tree partially screens that view.
- The actual production page works at 390 × 844: compact settings, Low/Auto, Disrepair/Growth/Flourishing, Home Base, Chapel reflection/return, Studio entry and Save & return. Desktop browser viewport testing is not a physical-phone benchmark.
- Source/module checks and six unit tests pass. Full CI was attempted; all 37 browser cases stopped at Chromium launch with macOS MachPort permission error 1100, before app assertions. No full CI success is claimed.
- Accepted courtyard GLB, crest/photo and all retained source image/model files are unchanged. The courtyard import query changes only to share the updated botanical module; its default hero geometry/placement is retained.

## Blueprint and next use

The canonical Blueprint records Tania's exact acceptance, the approved source/screenshot hash, rollout plan, source evidence, assets and measured limits under CE-CHANGE-20260913-47. AGENTS and handoff now treat the courtyard as accepted. Do not repeat its appearance approval or restart its rebuild.

The authored architecture/palette, metre-based surface mapping, shared plant kit, spatial/distance detail, transparent-glass batching and local shadow coverage are reusable. Carry this standard into future destination additions by the existing fidelity tiers. Current remaining release work is sustained target-device performance and the normal publication checks. No public deployment was requested or performed.

Global refresh remains incomplete. Historical /mnt/data byte identity gaps, broader source checkpoints, independent game-clone monitor coverage and the stale Blueprint AGENTS publication receipt remain separately recorded. The local comparison HTML has checked image references; only the actual game and screenshots, not the HTML file in a browser, were visually verified.

[Open the visual comparison](review.html) · [Walk the local game](http://127.0.0.1:4285/playable-3d/)
