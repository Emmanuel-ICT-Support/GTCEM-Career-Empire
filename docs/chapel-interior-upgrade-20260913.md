# Chapel interior upgrade


## Verified interior candidate
Broad 22m by 18m room with a bounded central raised clerestory roof, lower timber ceilings on all four sides, deep white relief beams and wide glazed seating wings, continuous light ribbons and 15 staggered pendants; warm soft area lighting and local room reflections; woven upholstery/carpet, frosted-glass ripples and metal-mounted original rainbow cross; 98 instanced chairs; vertical look and clear Chapel overview.

The original altar reference supplies the rainbow-cross pixels. The existing reference-derived woman/tree artwork is reused with its portrait proportions preserved. Original ECC-Chapel-4/5/6.jpg are archived unchanged. This is a playable interpretation of the supplied room, not a survey-accurate reconstruction.

After Tania clarified ECC-Chapel-4 is the side perspective, the ceiling is rebuilt as a bounded central raised roof approximately 9.9m by 8.5m, surrounded by lower timber ceilings and high perimeter glazing. These are interpreted proportions, not surveyed dimensions. The earlier long-spine candidate is superseded. Ceiling uses jointed raised timber panels with clerestory glazing; floating seam bars are removed. All four timber columns, sanctuary folding screen, coloured cross and altar remain present in the final reviewed scene. Entry camera shows ceiling and sanctuary together. Drag down to look up; Recenter restores the view. Chapel overview uses a clear aisle angle. Reflections are captured from the actual room once per load, not from an outdoor-only environment.

Materials, seating and architecture share resources. Static meshes are batched by material/shadow behavior. 98 seats use instancing; room has 38 mesh objects after batching. Entrance sample: 33 draw calls/135,166 triangles. 15 decorative pendants use emissive materials; four area lights add no shadow maps. Existing one directional shadow remains. Added official Three.js r180 RectAreaLightUniformsLib/RectAreaLightTexturesLib (matching vendored renderer), approximately 310KB total source; license headers retained. Source URLs: https://raw.githubusercontent.com/mrdoob/three.js/r180/examples/jsm/lights/RectAreaLightUniformsLib.js and RectAreaLightTexturesLib.js in the same directory.

14 unit tests and source checks pass. Actual Rapier routes pass for central/left/right aisles, both widened outer aisles, reflection approach and return to door. Browser checks: direct entry, ceiling look-up, recenter, overview, reflection modal/close, Home Base return, and 390x844 with no horizontal overflow. No sustained school-device performance certification or full browser CI claim.

Exact five changed source/dependency files and hashes: private/production-evidence/2026-09-13/chapel-interior-upgrade/receipt.json. This receipt also preserves pre-edit source, references, physics harness/results and review screenshots. Exterior revision5 was explicitly accepted by Tania; interior publication explicitly requested. Combined release task owns deployment. Current candidate not yet claimed live.

[Playable interior preview](http://127.0.0.1:4285/playable-3d/?view=chapel-interior)

![Before](../evidence/chapel-interior-upgrade-20260913/before.png)
![After](../evidence/chapel-interior-upgrade-20260913/after.png)
![Ceiling](../evidence/chapel-interior-upgrade-20260913/ceiling.png)
![Room overview](../evidence/chapel-interior-upgrade-20260913/overview.png)


## Separate publication approval
Tania accepted the final corrected side perspective and requested live publication: “great! love it send to live if all good to go”. Chapel task now owns the interior-only release, after exterior PR #12 completed and the other task closed. Cache keys and release manifest are refreshed; approved Chapel geometry/material source is unchanged. Full hosted graphics CI retains earlier environment-related timeouts; no full pass is claimed.

Release review caught a stray undefined `next` reference in the interaction early-return guard. Removed only that duplicate camera-label statement; the correct label update remains in setMode. Four regression cases exercise Studio, EST video, module and Chapel reflection states. Visuals unchanged. Packaged-source hashes supersede app/index hashes only for this correction and release cache keys.
