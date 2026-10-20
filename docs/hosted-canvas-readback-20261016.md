# Hosted canvas readback investigation — 16 October 2026

No graphics reduction, movement-limit change, live merge or deployment is authorized by this evidence.

## Retained repairs and exact execution

`58c009f` corrects the post-success Stats recovery hook and the real crew route around the original stage bench. `2e4917e` has exactly the same Git tree (`3b5fb989f942d52d30932487b209c419ebb04483`). Its exact-head run [38825227918](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38825227918) executed all 18 focused cases: 11 passed, 7 failed. State 4/4 passed. Avatar retry passed there; the phone crew journey timed out on its earlier Mara return. Results are variable and do not establish a software performance fix.

`dc4326a` moves that Mara segment onto the existing settled real-keyboard helper, retaining its 15-second limit. Its [38830148561](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38830148561) executed all 18: readiness 6 passed / 3 failed, movement 2 passed / 3 failed, state 4 passed / 0 failed. Both crew journeys pass; strict movement, scenery walking and both post-landing walks remain failed. This is 12 passed / 6 failed, not full-suite clearance.

## What the profiler establishes

At `69d999f`, ordinary desktop and phone movement profiles spend approximately 95–98% of sampled time outside JavaScript. Observed GL, frame-gate, physics and renderer-clear calls do not individually exceed 10 ms. This does not identify native work by itself.

The desktop native trace at `dc4326a` identifies four application-main-thread stalls inside Chromium `LayerTreeHost::DoUpdateLayers → GLES2::ReadPixels → ImplementationBase::WaitForCmd → CommandBufferHelper::Finish`: 2215, 2207, 2208 and 2252 ms, totalling 8882 ms. The corresponding GPU command-buffer work runs concurrently. These are browser-native canvas readbacks; the application pixel diagnostics are opt-in and inactive. Trace metadata identifies `chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`. Raw evidence is the `movement-browser-trace` attachment in the `targeted-movement` artifact (12016353817, approximately 4 MB compressed) of run 38830148561.

Removing the explicit application `gl.flush()` at `a1a3680` did not repair movement and an Options timeout appeared. The experiment is reverted at `2e4917e`; do not repeat it without materially new evidence.

## Browser comparison, not a runtime fix

[Playwright documents](https://playwright.dev/docs/browsers#chromium-new-headless-mode) that an unspecified channel uses separate headless shell, while `channel: 'chromium'` selects the full Chromium new-headless implementation. `71fffe9` adds an opt-in channel override; only the focused workflow selects full Chromium for comparison. Original game source, assets, assertions, timeouts, physics catch-up and inventory are unchanged. Detailed runs also attach actual browser GPU/system capabilities.

Comparison run [38830849494](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38830849494) also fails strict movement. Browser system information confirms SwiftShader with `gpu_compositing: disabled_software`. Four native readbacks take 3100, 3097, 3119 and 3245 ms. The binary is full `chromium-1223/chrome-linux64/chrome`; selecting full Chromium alone does not fix the bottleneck. An opt-in `CE_GPU_COMPOSITING=1` hosted comparison now explicitly requests ANGLE/SwiftShader compositing and records whether it actually activates. This changes browser launch configuration only. No claim of runtime repair, representative school-device qualification or a cleared full 245-case suite follows from a browser-mode comparison.


## Completed-frame runtime repair

The explicit-driver comparison `77b309e` activated SwiftShader GPU compositing but worsened execution: its movement group failed 0 passed / 5 failed. Those launch flags are removed from the focused workflow. They remain opt-in diagnostic configuration, not a required browser setting or an accepted repair.

`f9b082f44116b7b96fcaf1f913d537c5f40dea4b` keeps the last completed software-rendered pixels visible on a 2D presentation canvas. The unchanged WebGL renderer prepares the next original frame outside visible browser compositing. Its existing zero-timeout fence releases a copy only after GPU completion. Software drawing-buffer preservation keeps those exact pixels available; native rendering retains its original context attributes and visible canvas. A temporary 1×1 backend probe draws nothing, loads no assets, and releases its context. Input and accessibility remain on the original scene canvas. Portrait frames are excluded from world presentation. No scene triangle, material, resolution policy, tree, camera, movement threshold, catch-up limit, startup gate, save key or money rule changes.

[Hosted run 38832550725](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38832550725) passes all 18 focused cases exactly once, zero retries: readiness 9/9, movement 5/5, state 4/4. This uses the original headless-shell fallback environment, with no comparison flags. Source/coverage/accounting checks pass. Local focused units pass 43/43; release verification passes 285 hashes and 90 modules. The ordinary desktop native trace contains zero `GLES2::ReadPixels` events during the measured movement window, versus four 2.2-second waits before repair. Walking speeds are 2.375 m/s desktop, 2.631 m/s phone, 2.666 m/s under the existing 8-FPS callback limiter; running speeds are 4.283, 4.283 and 3.981 m/s. All original movement/gait/turn/stop assertions pass. Original-scene desktop and phone screenshots were visually inspected. Raw movement trace, measurements and screenshots are in artifact 12017647171 (`targeted-movement`, approximately 9.3 MB compressed).

This removes the measured synchronous presentation stall; it does not make CPU rasterization equivalent to accelerated hardware or qualify any representative school device. The full isolated 245-case hosted recheck and its separate software compatibility lane are next. No full clearance, live merge or deployment is claimed yet.
