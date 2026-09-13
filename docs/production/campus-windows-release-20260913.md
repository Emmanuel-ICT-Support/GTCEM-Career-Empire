# Approved campus windows and paving release — 13 September 2026

Tania accepted the campus standard and explicitly authorised the final window/flicker changes and live publication. Baseline main: d442671; campus rollout checkpoint: 1ff0ece.

English and Media retains its oval-facing curved curtain wall, silver framing, fins, plinth and original mural. Single glass sheets reveal authored art/film/drawing displays, monitors, desks and easels. SPACE retains its approved outside shape and rear foyer; two practice half courts, hoops/nets, padding and timber sports flooring replace generic shallow office panels. These are visual interior hints within existing non-enterable footprints. Campus glass uses restrained reflections, lower opacity and single surfaces where possible; Careers/EST transparent panes remain separate for sorting. Exact crest, Chapel photo and gameplay are preserved.

Flicker repair removes six obsolete model-display ramps crossing the new Careers/EST paths. Curved ribbons and new teaching-building junctions are now clipped into non-overlapping polygons before triangulation; the same ground location is drawn once within each path network. Source data remains editable. Four regression tests cover cross-junctions, duplicate triangles, planted holes and oblique overlaps. No new runtime dependency.

The completed concurrent EST phone-playback repair is retained, with its focused tests and cache keys; see ../est-mobile-video-20260913.md.

Local source checks and 14 unit tests pass. Eleven real-physics routes pass, including Studio, Chapel, EST, Media, SPACE and oval. Browser screenshots confirm clearer windows and the removed path conflicts. Local full browser CI cannot launch Chromium under the Mac sandbox (permission 1100); hosted release CI is pending. Physical-school-device performance remains a separate follow-up. Publication and live verification are still pending at this commit.

Evidence and precise final live receipt are canonical in the existing Blueprint under private/production-evidence/2026-09-13/campus-windows-release. No global refresh or Blueprint reader publication is implied.


Hosted rendering diagnosis: retained traces from cfc6683 show about 14 seconds between frames and GPU readback-stall warnings even with one worker. This runner has no hardware GPU; serialisation alone did not resolve it. Campus CI now caps only the test framebuffer to 0.25 DPR and shadow maps to 256 pixels using a checked response adapter in the test fixture. Production files, geometry, materials, quality controls and gameplay assertions remain unchanged. This suite verifies gameplay at a reduced raster budget; it does not certify full-quality rendering or school-device speed. Full-size visual evidence remains the actual hardware-rendered committed build.


Follow-up trace confirms the test adapter applied (320×180 framebuffer) but CPU-only frames still take about 8 seconds. CI therefore draws only a 24-index/vertex sample of explicitly named decorative foliage meshes, retaining every asset load, instance placement, collider, building, player and gameplay assertion. This is functional coverage with reduced foliage drawing, not a visual or fidelity acceptance test. Full-size hardware-rendered production evidence and shipped foliage remain unchanged. The fixture fails if renderer insertion points change.
