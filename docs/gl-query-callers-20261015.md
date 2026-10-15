# GL query callers and device relevance — 15 October 2026

No runtime change is retained. Exact stacks show the queries originate in the
game's bundled Three renderer. Disabling optional shader logs moves the wait to
required uniform discovery and does not repair software readiness or movement.
No further compile experiment was run.

## Callers and the minimal query experiment

Three defaults `renderer.debug.checkShaderErrors` to true (`three.module.js:14999`).
The application does not override it. `WebGLProgram.onFirstUse` calls
`getProgramInfoLog` at line6496 before constructing `WebGLUniforms`. The normal
renderer reaches this through `getUniforms → setProgram → renderBufferDirect`.
Both uniform and attribute discovery are already cached on each program, so this
is not an application query repeated every animation frame.

The largest captured baseline query is 7.420s for program5,
`CubemapFromEquirect`. The complete stack captured in the query-off comparison is:

`animate → WebGLRenderer → WebGLBackground.getBackground → WebGLCubeMaps.get →
WebGLCubeRenderTarget.fromEquirectangularTexture → CubeCamera.update → render →
getUniforms → onFirstUse`.

The application supplies its original equirectangular campus sky at `world.js:211`.
This identifies sky conversion, rather than the earlier cached RoomEnvironment
experiment, as the context of this particular synchronization point. Other slow
queries identify Basic and Standard material programs. These wall times include
possible compilation and prior driver/GPU work; they do not prove that sky shader
compilation alone takes seven seconds or establish an unavoidable backend limit.

Three [documents](https://threejs.org/docs/pages/WebGLRenderer.html#debug) its
optional production shader-error switch. A route-only experiment set it to false
before any rendering, leaving materials, assets, quality and readiness unchanged.
`getProgramInfoLog` disappeared, but the wait moved to
`getProgramParameter(ACTIVE_UNIFORMS)` at `three.module.js:5507`, called by
`onFirstUse:6581`. Sky conversion waited15.056s there; a Basic material waited5.416s.
The bundled uniform loader needs that reflection before uploading uniforms, and
already caches the result. Removing or pretending to answer it is not a safe
application-level fix. The optional switch is rejected: it loses error reporting
without establishing useful performance improvement.

| Execution | Visible entry | Walking windows (m/s) | Result |
| --- | ---: | --- | --- |
| Software, exact caller trace | 30.169s | 0.900, 0, 0.826, 0.837 | Failed |
| Software, shader checks off | 42.773s | 1.474, 0, 0, 0.825 | Failed |
| Native Metal, shader checks off | 4.557s | 2.727, 2.714, 2.727, 2.687 | Passed |
| Software, GL methods unwrapped | 74.173s | 1.475, 0, 0, 0 | Failed |

All four runs use the unchanged 8s / >2.2m/s diagnostic requirements, fresh Chrome
contexts, disabled shader disk cache, one worker and zero retries. Each waits for
the actual completed entry frame. Software is actual SwiftShader LLVM10/Vulkan;
native is actual Apple M3 Metal. There were no uncaught page errors. Samples are
not paired repetitions; the variability prevents claiming a causal speed ratio.
The earlier unchanged native control passed at2.386s and2.664–2.688m/s.

## Harness attribution

The GL profiler calls the original method exactly once and records existing
results. It does not add GL queries, draws or fences. In the unwrapped control,
all GL methods were left untouched and recorded GL-call count is zero; the first
campus renderer call still occupied59.120s. This rules out the GL observer as the
sole cause, without claiming that every possible browser/harness effect is absent.
Renderer-duration, navigation and timer observations remained, and response
routing still supplies cold-cache conditions.

The fixture's renderer-name `getExtension/getParameter` calls run after the test
body. They do not create the earlier first-render shader-query stack. The game's
pixel readbacks are opt-in (`?diagnostics=pixels`) and were inactive here. The
captured slow caller is normal runtime work, not a test issuing extra shader-log
queries. Software scene cost remains unresolved; it is not proven irreducible.

## Does this represent student devices?

[Chromium's documentation](https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md)
identifies SwiftShader as CPU rendering used on GPU-less bots and documents
explicit flags to select it. The local diagnostic and dedicated CI compatibility
lane force that backend. An ordinary GPU-backed student browser is not modeled by
that forced selection. Automatic software fallback is deprecated in Chromium.

The application deliberately implements software compatibility policies, so it
cannot honestly be dismissed as CI-only. However, the verified school-device
record still has an empty representative-device list, an outstanding acceptance
status and no accepted numerical software wait. No evidence establishes how many
actual students use this backend. This is a device-validation gap, not permission
to classify their browsers as supported or unsupported without measurement.

Recommendation: stop speculative software-only engine/visual changes at this
checkpoint. Further work would be disproportionate before representative school
backends are known, especially if it reduces the requested sky, materials, trees
or sharp native visuals. Preserve the accelerated8s target, actual renderer,
completed campus frame, original19trees/two buildings, real walking and automatic
parcel checks on school laptop/desktop and physical mobile browsers under the
school network. Keep software functionality/waits separately explicit and red
where they fail; do not report the approved testing split as a software fix.

## Native status and smallest next batch

Current combined-runtime evidence covers **5 of the33 cases**: three strict
movement cases and two public Admin cases. **28 are not revalidated**, rather
than proven native failures. Older pre-combination passes and new diagnostic
probes do not clear these current full-journey cases.

| Group | Cases | Native passes | Not revalidated |
| --- | ---: | ---: | ---: |
| Movement/input/frame progress | 16 | 3 | 13 |
| Readiness/state publication | 13 | 2 | 11 |
| Chapel journey deadline | 1 | 0 | 1 |
| Animation/shadow stop | 2 | 0 | 2 |
| Intro metadata availability | 1 | 0 | 1 |

Smallest useful next batch: **two unchanged native cases**, one worker, zero
retries, bounded240s total: `first-play.spec.js` — “Arrival retains complete geometry
and usable walking while optional surfaces wait” (original120s case budget), and
`avatar-recovery.spec.js` — “failed startup avatar can retry without reloading or
changing the saved profile” (original90s). These test held optional surfaces plus
real walking/Studio, and fallback/retry/profile preservation. They are proposed,
not executed in this pass. A pass would clear only those two IDs; Chapel, suit,
natural-video and all sibling journeys would remain open.

All33 IDs, current raw native report references and the exact two proposed IDs
are in `native-remaining-33-status-20261015.json`. Four new diagnostic runs give
one native pass and three software failures, not a new primary-suite result.
Normal inventory remains243 exact prior IDs; release checks remain284 hashes /
89 modules.411 prior raw files and477 older inventoried evidence files remain
byte-identical. QA syntax/whitespace checks pass. Runtime/Assets/Markets remain
unchanged; no full rerun, live merge or deployment occurred. Raw paths, digests,
stacks and primary sources are in `gl-query-callers-20261015.json`.

To reproduce the rejected switch, use the existing opt-in workload config with
`CE_PROFILE_CANDIDATE=shader-errors-off`. For the method-observer control use
`CE_GL_OBSERVERS=off` and leave the candidate unset. Both remain QA-only response
injections; no game flag or production behavior is added.
