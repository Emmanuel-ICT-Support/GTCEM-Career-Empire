# Focused Phase 0 release checkpoint

The original hosted companion failure was caused by the test observation.
The probe called inherited `Object3D.updateWorldMatrix` before the first draw,
then `Frustum.intersectsObject` calculated and cached a skinned bounding sphere
without refreshing `SkinnedMesh.bindMatrixInverse`. This cached world-space
coordinates as local bounds and the real renderer subsequently culled Sprout.
The production helper loader is unchanged.

An isolated selected-Sprout comparison in the software renderer passed (5.2s):
old probe: intersects=false, zero draws, blank capture; skin-aware update:
intersects=true, one draw, visible Sprout. Both captures were visually inspected.
The committed probe now calls `updateMatrixWorld(true)` and also requires an
actual `onAfterRender` draw in the current frame. Existing root visibility,
frustum intersection, active scene, frame advancement, readiness, real WASD
movement and deadlines remain enforced. No culling is disabled.

Local software-rendered two-case run: companion Town and Market PASS (37.261s),
with both Sprout captures saved. Expanded photo journey reached the real menu,
Stats and My Life course outline, then FAILED on its return: the test's init
script reseeded the original post-mural fixture, erasing the captured photo
and saved tour from the same-run handoff. That fixture now seeds once per test
context. This corrected full photo journey still needs terminal validation.
The failed run had exactly two cases: one pass, one failure (1.7m).

The first actual photo review now hides the historical direct Market button
and points to the companion tour. The focused test asserts it is hidden both
before continuing and after the deliberately failed module load. It follows
Flyover to the start, Options, recorded Stats, My Life course return, and then
Initiative before ordinary outside-Market entry. No six-skill intro was added.
Existing later photo revisit and ordinary menu/map navigation remain available.

`npm run check` passed for working source; HEAD release verification covered
278 hashes and 85 reachable modules. The updated staged release manifest is
checked separately before committing. The broad historical suite remains
158 PASS / 70 FAIL at 2eaafa4, not a full green claim.

No local browser remains in use after this checkpoint. Publication remains
conditional on BOTH exact focused hosted cases passing. Screenshot Library
upload remains separately blocked pending direct user approval; no upload
was attempted again.
