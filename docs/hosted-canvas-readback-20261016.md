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
