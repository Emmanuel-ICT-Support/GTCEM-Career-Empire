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

## Hosted guided-photo result and full-roster check

Run 38519108558 finished at 05:58:18 UTC: exactly two terminal cases, Sprout
PASS and expanded photo FAIL. Candidate equivalence and exact-count proof both
passed. The browser step took 3.1m; job 4m27s. Artifact 11873515896 retains
rendered frames and count proof. Sprout was actually drawn in Town and Market.

The corrected photo fixture retained the real photo and tour through My Life,
and the guided course return reached Initiative (step 6). The later synthetic
roof-landing leg requested F immediately after that fresh return, before campus
scenery was prepared. Ordinary exploration does not eagerly load the full campus
at this point. The test now follows Initiative, Mara and the normal final tour
action: this action prepares campus and routes outside the Market. The subsequent
Flyover controls then have their existing intended gate. No readiness flag or
timeout is changed. This targeted retry remains pending.

The current selectable creatures are Echo, Sprout, Moss, Bloom, Spark, Pax and
Atlas; No companion and Phone / journal remain selectable guidance modes. A new
compact matrix uses the actual picker, real W movement, skin-aware frustum and
onAfterRender evidence. Each selection carries unchanged from Town into Market
and back via the visible Return to campus control. Expected receipt: 18 rows,
14 creature renders/follows plus four intentionally mesh-free guidance rows.
The test observes selected-only model requests and records each row independently.
No local browser is used for this hosted matrix. No all-companion pass is claimed
until its exact receipt is complete.

## Full-roster terminal result and immediate panel close

Run 38520495898 ended at 06:12:58 UTC with both jobs failed. The focused
job had exactly one Sprout pass and one photo failure. The complete matrix
reported 18 rows: 10 passed / 8 failed. Echo passed both scenes; all seven
creatures and both mesh-free guidance modes passed Market. The remaining
eight Town rows failed only at the real W movement predicate, after selection,
ready state, frustum, active-scene and draw assertions succeeded. All seven
creatures were drawn in both scenes. Full following acceptance is still pending.

The matrix incorrectly assumed W must decrease Z. Market return deliberately
sets yaw=Math.PI; the saved Town failures show increasing Z and the helper
following near the player. This is a direction assumption in the test, not
a mesh failure. The corrected predicate measures actual planar distance moved
while preserving real keyboard input, the 0.2m threshold and ten-second limit.

The photo test completed its original pre-Market Flyover and Land/L controls,
then its five-second Stats-close assertion saw tour step 4. The saved final
evidence shows step 5 with campus ready. Previously the tour observed panel
closure in the game render loop. The repair explicitly notifies on closing
Stats or Options, advancing the existing tour immediately without waiting
for the next heavy draw. Switching tools internally suppresses the close
notification, so opening another panel does not count as finishing Stats.
Existing frame observation remains a fallback. No deadline is raised.

Working source/syntax checks and 21 relevant units in three files passed.
The exact staged manifest is verified before committing. The forthcoming
hosted retry retains the original two cases and all 18 roster rows, and adds
a separate authentic pre-Market keyboard flight check. No broad repair is
merged, and no local browser is used. The original pre-Market photo fixture
uses the normal teacher/photo action, which prepares real campus scenery;
the cold My Life return was a separate later scene.

The independent pre-Market flight test creates the real teacher photo from the
post-mural checkpoint, chooses the real loaded Sprout, and requires campusReady
from ordinary orientation preparation. It uses the visible speed slider and
actual E/W/A/S/D/L key controls to fly to Arrival Gardens and land. Its probe
only reads camera/player coordinates; there are no camera/player assignments,
no manufactured ready flags, and no Market runtime request before landing.
It stops at the menu beat (3), complementing the full photo/course/Market case.
Its 120-second cap does not change the original photo or companion deadlines.
Syntax and discovery list exactly four focused cases; browser results remain
pending. The earlier synthetic roof-target landing coverage is retained in
the original case and is not presented as keyboard flight acceptance.
