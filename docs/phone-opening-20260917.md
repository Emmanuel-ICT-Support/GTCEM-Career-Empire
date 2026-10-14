# Phone opening-time follow-up — 17 September 2026

CE-CHANGE-20260917-75. Tania reports slow opening while desktop is fine, rejects 76 seconds as still too long, and identifies an iPhone 17 using mobile data. This addresses opening/downloads, not frame rate. Actual phone/network timing remains unverified.

## Final local candidate
The initial exact-geometry tree packing was insufficient: normal-cache diagnostic improved only 82,502ms to 71,833ms. Retain it for desktop, but add phone-specific derivatives selected once at boot when the pointer is coarse and the shorter viewport edge is at most 620px. Rotation does not switch or re-download the asset set. Desktop keeps original textures and rendering settings.

Phone assets retain the complete campus, geometry triangle counts, layouts, collisions, signs, both teachers and selected avatar. Supporting surface maps use 512px high-quality WebP; crest, Chapel recognition artwork and SPACE reference retain their source dimensions. The default schoolboy uses 1024px WebP maps; all 132 non-image buffer views (geometry, skin and animation data) are byte-identical. Other selected avatars are not substituted or eagerly downloaded. Both teacher assets remain unchanged and load only near the oval; Avatar Studio is still deferred.

Three phone tree models use Meshopt compression without triangle simplification, floating position/normal storage compatible with the game's geometry baking, and shared bark/leaf images. UVs/positions use reduced numeric precision; phone textures are intentionally lossy derivatives, not byte-identical originals. Outer building geometry uses no quantization to preserve the mixed-attribute batching pipeline. Smaller boulder maps and a 512x256 reflection panorama (linear-light 2x2 filtering, original exposure) remove further phone download weight. All source assets remain intact. No lighting, shadow, renderer resolution or scene-density settings change.

The existing Three.js loading manager selects a bounded same-origin asset map. Avatar downloads use that same resolver while retaining their existing timeout/retry and profile choice. Startup-only Three.js cache shares repeated completed loads and is cleared/disabled on completion or failure; no persistent cache or new vendor/provider.

## Measured result and limits
Controlled fresh phone context: 390x844, DPR3, touch/mobile, 4Mbps download, 80ms latency, 4x CPU slowdown, ordinary HTTP caching. Baseline **82,502ms / 38,918,517 transferred bytes**; final phone candidate **35,627ms / 13,897,783 transferred bytes**. Approximately 56.8% shorter and 64.3% fewer bytes in these single diagnostic runs. Local server text transfers differ from production compression; these are not promises of actual iPhone timings or sustained FPS.

The earlier 113s to 76s cache-disabled stress test remains historical evidence, not the final result. User explicitly found 76s too long. No claim that a 36-second simulated first visit is an acceptable physical-phone outcome; actual live feedback remains required.

## Verification and publication
Before/after phone views inspected. Final phone startup reports the same 2,254,780 rendered triangles and all 19 main-campus trees, complete scenery, no captured script/resource errors. Desktop selector check requested no phone assets. Desktop packed trees have independently verified identical triangle positions/normals/UVs to 1e-6, materials and exact texture bytes. Full local suite and source/package checks are being completed; publication remains pending.

Prototype failures were caught locally and corrected before release: redirected models need shared-texture paths relative to the original GLTF resource directory; material lookup relies on retained grass/reception filename identities; integer-position and mixed UV storage are incompatible with existing transform/batching helpers. No failed prototype was published.

Existing live source e36aee182049f2960e6d181b08c6d3df18b3e595 has zero file differences from local committed teacher candidate 0f559c5fb3db2af570b46d284c1dbf206fd5b9ba. Existing checkout and GitHub Pages destination retained. Preserve unrelated documentation. Previous hosted startup-performance timeout, actual iPhone/Safari validation and separate Blueprint-reader publication remain independent.

## Impact screening
Static asset derivatives and transient resource cache only. No added user/student data, profile changes, persistent storage, collection, provider, endpoint, permission, account, tenancy, payment or student-facing AI. File-download impact remains mapped; school/security productionComplete remains false. Runtime files and visual evidence are registered in the same release manifest and canonical record.


## Local verification complete; scoped release — 17 September 2026
CE-CHANGE-20260917-75: 35 unit tests and project source checks passed. Full local CI reached 23 browser passes, then the existing startup-performance test exceeded 90 seconds waiting for the rendered canvas; the run was stopped with 25 not run. Full CI is NOT green. Separate native-graphics regression run passed all 11 scenarios: three phone/desktop download/cache/retry checks, saved schoolboy/pants/base avatars, Studio loading/save/reload and recovery, Home Base, all teacher reactions, five-minute bounded wandering, obstacles, tap, pause and retry. Final phone trees preserve triangle counts/material settings and decoded bounds within 2mm. First view inspected; originals intact.

Candidate is scoped to phone download improvement, not a promise of actual iPhone loading time. Default-entry simulation: 38,918,517 to 13,897,783 bytes (64.3% less), 82,502 to 35,627ms (56.8% shorter). Teacher review links additionally load nearby teachers, as intended; other saved avatar models retain their existing files. Publishing to the existing game destination follows this live-loading repair; physical iPhone/Safari feedback and separate Blueprint-reader publication remain pending.
