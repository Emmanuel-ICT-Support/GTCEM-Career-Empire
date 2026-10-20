# Software startup: support decision and bounded experiment

**Subsequent decision:** the user approved the proposed split on 14 October.
It is now implemented and scoped checks are recorded in
[approved-runtime-lanes-20261014.md](approved-runtime-lanes-20261014.md).
The investigation below is retained as the evidence preceding that decision;
software startup remains unfixed and no numerical software wait was approved.

The software startup failure is **not fixed**. One reversible lighting-cache
candidate preserved the scene but did not meet the unchanged eight-second
handover target. It is not included in runtime source or the release assets.
No full-suite rerun, broad publication or Market integration occurred.

## What the available requirements establish

`render-quality.mjs` deliberately detects actual SwiftShader, llvmpipe, softpipe
and software-rasterizer names. Auto uses its existing software policy, including
0.5 resolution and disabled shadows. Frame submission and paused-panel caching
also have intentional software paths. Software rendering is therefore an
implemented compatibility path, not a branch enabled by `CI`.

The published Living Blueprint **V2.28 / 14 October 2026** was read and verified
against Git blob `cb1d1b90635c6e4b47f70c225753e91a4c499192` (4,446,787 bytes).
Its `operations.productionPlan.visualReview.windowRelease.localChecks` records
GPU-free CI stalls, retained real graphics and incomplete full-suite acceptance.
Its rollout performance limits distinguish local Mac samples from sustained
school-device benchmarks. `styleGuide.translation` requires architectural
richness and measured optimisation, rather than indiscriminate visual reduction.
No explicit GPU/CPU browser support matrix or universal eight-second school-device
startup guarantee was found in this snapshot or the reviewed ECC requirements.
[Published source](https://github.com/taniab1975/career-empire-blueprint/blob/main/blueprint-records.json).

The eight-second startup assertion already exists in integration commit
`172f5ba`. That commit itself records an 8.825-second cold skip against the
strict target. `03bee4d` retained eight seconds while requiring the original
19 trees and both buildings. These tests do not classify the actual renderer,
so the same assertion currently applies on native and software backends.
That explains the present test contract; it does not establish a separately
approved CPU performance tier. The target remains unchanged pending a decision.

Chromium describes SwiftShader as CPU rendering and documents its use on
GPU-less test bots. Automatic WebGL fallback is deprecated. This supports
distinguishing the environments, but it does not decide Career Empire's student
support policy. [Chromium SwiftShader documentation](https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md).

## Cold measurements and one minimal candidate

All five executions use one case, zero retries, a fresh Chrome process/profile,
and `--disable-gpu-shader-disk-cache`. Browser: Chrome 155.0.8059.40; native
renderer: Apple M3 / ANGLE Metal; software: SwiftShader LLVM 10 / Vulkan.
HTTP routing disables browser cache. OS/driver caches were not flushed.
These are local delivery measurements, not WAN or physical school-device results.

| Variant | Backend | Click to actual ready | Navigation to ready | First draw CPU | 8 s result |
| --- | --- | ---: | ---: | ---: | --- |
| Unchanged control | Software | 24.370 s | 33.131 s | 23.192 s | Fail |
| Unchanged control | Native | 1.865 s | 2.075 s | 0.821 s | Pass |
| Cached lighting | Software | 25.391 s | 32.097 s | 23.338 s | Fail |
| Cached lighting | Native | 1.880 s | 2.101 s | 0.780 s | Pass |
| Cached lighting, expanded attribution | Software | 26.355 s | 32.823 s | 24.026 s | Fail |

The candidate reuses the exact original RoomEnvironment prefilter result at its
unchanged size, format, colour space and filtering, instead of recomputing it.
Its captured texture is 6,291,456 bytes (910,565 bytes gzip); it remains ignored QA
evidence. No model, material, tree, building, surface, camera, shadow policy,
pixel ratio, paid gate or ready condition was reduced. Each case retained actual
entry readiness, the real keyboard walk and automatic parcel dialog. All three
software failures reached the final eight-second assertion after that walk.

The controlled comparison renders original and cached lighting in the same
scene/camera/pose before any animation update. Native pixels match exactly;
software has a maximum 2/255 channel difference and mean below 0.049/255.
Both comparisons report 19 trees, two buildings and genuine `entryReady`.
Native screenshots were inspected. These observations support fidelity at the
tested view, not acceptance of a new lighting asset on every student device.

## What the shader profile now proves

Before readiness, the software control queried 41 programs; the candidate
queried 36, removing five prefilter programs. Hardware control/candidate queried
46/41 because its existing shadow policy differs from software Auto.

The control's program queries consumed 23.287 seconds. The cache reduced that
measured category to 14.040 seconds, but the first draw still took 23.338 seconds.
Expanded profiling located 9.583 seconds in one `getExtension` call, with another
14.564 seconds across program-info queries. Thus the earlier attribution of all
23 seconds to shader compilation was too specific: driver/GPU setup and queued
work can block at different query boundaries. Removing a query or changing its
timing does not remove the underlying work. The exact extension argument and
driver-internal breakdown were not captured.

The remaining expensive variants include ordinary mapped/alpha-tested basic
materials, campus glazing, paving, reception artwork and pond materials. There
is no evidence that deleting a particular tree or replacing one decorative
shader would safely recover the target. This experiment does not prove that
further optimisation is impossible, or that all original hosted failures are
infrastructure-only. Linux CI used SwiftShader Subzero; the local LLVM backend
is not an identical CI reproduction.

## Proposed test strategy — requires the user's decision

Recommend defining the eight-second performance target for **supported,
GPU-backed student browsers**, while retaining CPU rendering as a separately
measured compatibility path. Confirm representative school hardware/browser
tiers first; this Mac alone cannot establish that matrix.

If approved, use a GPU-capable reference runner for the unchanged performance
and normal journey checks. Assign intentionally software-specific checks, such
as paused-frame caching, explicitly to a software lane. Retain real input,
geometry, recovery, saves and honest frames there, with separately agreed,
bounded functional deadlines and timing reports. Keep every original inventory
ID accounted for across the assigned lanes; extra cross-backend observations
must not inflate the primary pass count. This is not a proposal to skip failures
or merely raise all timeouts.

If CPU rendering must meet the same eight seconds, keep this performance blocker
red and plan deeper graphics/driver work against the unchanged visual contract.
No current evidence justifies calling that limit unavoidable or waiving it.
The proposed lane/support change has **not** been implemented; the original
software failures remain open until the user chooses a support contract and
the corresponding verification passes.

Machine-readable measurements: `software-startup-experiment-20261014.json`.
Original reports, profiles, texture capture and screenshots are preserved under
`coverage/broader-targeted-20261014/shader-*`. Original hosted run 38543515871
and the 47-ID failure ledger remain intact. Runtime remains byte-identical to
`c72b439`; live main remains `fec76572` and Market `d0912bb` stays separate.
