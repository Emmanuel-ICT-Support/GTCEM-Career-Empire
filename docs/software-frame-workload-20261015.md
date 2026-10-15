# Software frame workload — 15 October 2026

No runtime optimization is retained. The controlled software failure is now
attributed to blocking first-use GL shader queries and delayed animation frames
while submitted campus work is outstanding. A per-mesh GPU cost has not been
isolated. Both bounded compile experiments failed; neither establishes improved
cold readiness and usable movement. Native graphics, original trees, camera,
Market features and assets remain byte-identical to `7adf4f9` / `7c52ecc`.

## Reproduction and actual measurements

The opt-in `qa/software-workload.spec.js` observes existing GL calls, renderer
submissions, texture hydration, navigation ticks, 50ms timers and long tasks.
It introduces no extra GL queries, fences or draws. Each movement window uses
the existing controlled benchmark reset and a real 1.8-second W hold, followed
by a 0.7-second release. It does not move the actor to fabricate progress.

All samples use 1280×844, the mocked owned-account contract and
`?review=1&mode=full`. These are entry timings from navigation, not natural video
handover timings. Cold means a fresh Chrome context plus disabled shader disk
cache; no system/driver caches were deleted. Local SwiftShader LLVM 10.0.0 is
not an identical reproduction of hosted Linux Subzero.

| Execution | Visible entry | Four walking speeds (m/s) | Result |
| --- | ---: | --- | --- |
| Unchanged baseline, first profile | 35.613s | 0.749, 0, 0.822, 0.816 | Failed movement |
| Unchanged baseline, refined GL profile | 30.762s | 0.003, 0, 0.796, 0.807 | Failed movement |
| Whole-scene compile experiment | Not reached | Not reached | 120s test deadline |
| Visible-material compile experiment | 28.426s | <0.001, 0, 0.803, 0.955 | Failed movement |
| Native Metal control | 2.386s | 2.664, 2.673, 2.688, 2.685 | Passed |
| Final unchanged software diagnostic | 32.915s | 0.655, 0, 0.797, 1.754 | Failed speed and readiness |

The final retained probe separately asserts the unchanged 8-second visible-entry
and >2.2m/s first walking requirements. Earlier experimental probes stopped on
the failed speed assertion; their readiness measurements also exceed 8 seconds,
but that assertion was not reached. No measured software window meets the speed
requirement. The native control passes both requirements and has no uncaught
page errors; the final software run has no uncaught page errors either.

## What blocks progress

The first unchanged campus draw submitted 348 calls / 888,290 triangles and
occupied the renderer call for 26.418 seconds in the first profile and 21.530
seconds in the refined profile. The latter records individual
`getProgramInfoLog` waits of 7.576 and 4.149 seconds while Three initializes
programs on first use. These are measured CPU wall times inside synchronous GL
queries, including driver waits; they are not direct compiler CPU or GPU timer
measurements.

After entry, a 5.559-second navigation/rAF gap starts with one scene submission
still uncompleted and no texture-upload reservation. There are 111 timer ticks
inside that gap, with a maximum adjacent interval of 51.2ms. This distinguishes
it from a five-second synchronous JavaScript task and is consistent with browser
frame scheduling/backpressure around outstanding GPU work. The refined baseline
also has a 4.585-second gap encompassing a complete key hold. Input can arrive
and be released between animation callbacks; bounded physics catch-up cannot
make that a usable visual response. Raising the catch-up limit would not repair
visible frame delivery.

All decorative uploads in the first baseline finished before the first measured
movement. Texture-queue starvation is therefore ruled out for that failure.
The preceding blocker probe independently records accepted keys, no UI/hidden
blockers and no input resets. This does not prove the same cause for all 16
movement investigations or clear any of the other 33 historical failures.

## Bounded experiments and remaining limit

The whole-scene `compileAsync` attempt permitted an interleaved scene draw and
never reached entry before the test deadline. Its final in-page observation was
unavailable after context closure; retain its report/screenshot, without treating
it as a quantified compiler comparison.

The refinement prepares only the visible entry materials before allowing its
first scene draw. It selected 355 objects and returned from `compileAsync` in
93.7ms. The actual backend reports `KHR_parallel_shader_compile` unsupported;
the first draw still blocks on the same GL log queries. Its 28.426s entry is
within the observed variable software timings, and its walking still fails.
There is no established repeatable improvement. Both changes exist only in
intercepted diagnostic responses; the game files were never changed.

The remaining work is to isolate the expensive programs/scene draws further
and reduce their real cost while preserving the visual contract. No readiness
flag, deadline, resolution, garment, tree, camera or Market behavior was changed.
Software startup/movement remain open; acceptable software wait is unassessed
and physical school hardware remains unvalidated.

## Validation and evidence

- One native diagnostic passed; five actual software diagnostic executions
  failed, including the whole-scene timeout. An earlier `.mjs` import error
  happened before collection and is retained separately.
- Default collection remains exactly the same 243 normalized unique IDs.
- Release verification passes: 284 exact asset hashes, 89 reachable modules.
- New QA file syntax and whitespace checks pass. The supported config lists
  exactly one opt-in case; it is outside the normal case inventory.
- All 477 previously inventoried evidence files remain byte-identical. New raw
  reports, streamed logs, screenshots, observations and an SHA-256 inventory
  are retained under the evidence root in the JSON receipt.
- The earlier 282 units, 22 policy/accounting checks and isolated source check
  remain applicable: this follow-up changes QA/docs only. They were not rerun.
  The sparse working checkout still cannot pass `npm run check` without its
  deliberately omitted Assets; see `safe-validation-checkpoint-20261015.md`.

Normal complete checkout reproduction:

```sh
CE_TEST_RENDERER=software CE_COLD_SHADERS=1 CE_RECORD_BACKEND=1 \
CE_TEST_OUTPUT=/tmp/ecc-workload \
npx playwright test --config qa/software-workload.playwright.config.mjs
```

Use `CE_TEST_RENDERER=native` for the control. Add
`CE_PROFILE_CANDIDATE=visible-parallel-compile` to reproduce the rejected
visible-material experiment. Each command creates a fresh evidence leaf.
This sparse workspace used the documented private range server with a read-only
fallback to original Assets, rather than modifying the checkout.

Exact results, paths and digests: `software-frame-workload-20261015.json`.
The historical full result remains **202 passed / 41 failed / 243 exact cases**
for run 38674943796; no new full suite, live merge or deployment was performed.
