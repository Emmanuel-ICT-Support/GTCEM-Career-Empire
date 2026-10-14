# Approved runtime testing split and broader release recommendation

The user approved the split testing approach on 14 October: accelerated student
graphics retain the eight-second startup target; software rendering has separate
functional checks and measured waiting time. This approval does not declare the
approximately 24-second software limitation fixed, establish an acceptable
numerical software waiting deadline, approve Markets publication, or certify
school devices.

## Implemented qualification

`npm run test:gpu-performance` selects the two desktop/phone entry-to-parcel
cases and the cold-skip cost case. Reports use the actual WebGL renderer, rather
than a CI flag. Recognised accelerated hardware must meet the unchanged strict
`< 8000 ms` target. A software or unidentified backend cannot qualify this lane.

`npm run test:software-compatibility` selects cold startup with actual walking
and the paused Stats/frame-cache case. This lane explicitly requests software
graphics and validates the reported backend. Geometry, real readiness, walking,
wallet/savings and honest frame assertions remain. Its waiting-time acceptance
field is **null / not assessed**; passing functionality does not mean software
startup meets eight seconds.

The Stats cache case now explicitly launches software, the only backend with
the paused-frame cache it tests. Its initial-entry observer uses the existing
60-second whole-case execution watchdog; the previous separate 30-second setup
assumption could expire just before software became ready. No whole-case limit
or frame/wallet assertion was relaxed. These execution watchdogs are test
resource bounds, not student waiting-time acceptance deadlines.

The workflow has a separate software compatibility job and artifact. Its
results stay outside the primary browser count-proof artifact pattern, avoiding
duplicate inventory accounting. The existing full primary count proof remains
unchanged. Runtime summaries report actual backend evidence, functional
outcomes, the GPU budget and software waits independently. GPU measurements
cannot be manufactured by a label, expected failure or missing attachment.
Hosted CPU jobs report GPU performance as **not verified**, not passed.

No hardware runner was invented or provisioned. The GPU command runs on an
available accelerated machine and checks the actual renderer. The hosted
workflow changes are saved locally and have not been executed on GitHub.

## Focused results on the unchanged game runtime

| Lane | Cases | Result | Measurements |
| --- | ---: | --- | --- |
| Verified Apple M3 / ANGLE Metal | 3 | 3 passed | Handover 1.638 s desktop, 1.282 s phone layout, 1.595 s cold skip; all below eight seconds |
| SwiftShader LLVM / Vulkan | 2 | 2 functional passes | Cold handover 22.678 s; navigation-to-ready 30.179 s for Stats and 30.892 s for cold skip |

Both reports retain `softwareStartupFixed: false` and school-device validation
as outstanding. These are five executions of four distinct cases: cold skip is
intentionally observed in both lanes. No retry, skipped case, new optimisation,
physics change, geometry reduction or broad suite execution occurred.

The 47-ID original failure ledger now has focused passing evidence for 46 native
cases and the software-specific Stats case. This does not rewrite the original
hosted result or establish that every old software journey passes. Software
compatibility was verified here for only the two named cases.

The full current inventory was **collected only**: 234 unique cases, zero
collection errors. All original 233 IDs remain. The extra case is the already
committed `c72b439` held-entry save regression, unchanged by this split. The
initial comparison assumed a current total of 233 and stopped; the preserved
comparison receipt identifies the existing regression and corrects that count.
Any later full run must account for all 234 current cases exactly.

Thirteen focused policy/reporting and render-quality units pass, along with all five
existing count-proof tests. Workflow YAML parses with Ruby Psych; Python/Node
YAML parsers are unavailable locally. The first Vitest launch could not write
its shared dependency cache under the sandbox; the approved rerun passed.
Source/release checks pass (280 exact hashes and 87 modules); final results are
recorded in `approved-runtime-lanes-checkpoint-20261014.json`.

## Required realistic school-device validation

Still outstanding: identify representative school laptop/desktop and mobile
browser/GPU tiers, then measure cold entry on the actual school delivery/network
conditions. Require an actual completed campus frame, both buildings, original
trees, real walking and automatic parcel behavior; record the renderer and cache
conditions. The accelerated target remains eight seconds. Observe software
fallback functionality and waiting separately; an acceptable wait has not been
numerically agreed. Mac automation and phone-sized layouts do not satisfy this
physical-device validation.

## Broader release recommendation and exceptions

Recommend bringing the broader candidate to the parent's release review under
the approved split, using the qualified accelerated results and clearly stated
software limitation. The rejected lighting-cache optimisation stays out.
Publication is not performed by this testing-strategy approval.

Verified scope includes the merged broader repairs atop published PR57 and the
`c72b439` successful-save/Echo and immediate-quality fixes. Runtime remains
byte-identical to `c72b439`; all original assets and current gates remain intact.
Previous 259/259 runtime unit confirmation, the original failure-ledger focused
evidence and the five new lane executions support this candidate's reviewed
scope. No full combined browser pass is claimed.

Exceptions/limits for review: original hosted run 38543515871 remains failed
(186 passed, 42 failed, one interrupted, four not started); only the named
software compatibility checks are newly passed; hardware performance is proven
on this Mac, with real school-device validation outstanding; the changed
workflow has no hosted execution result yet. Any broader publication decision
must retain these limits rather than calling software fixed or full CI green.
Market `d0912bb` remains separate, unintegrated and unpublished pending preview
approval. Live PR57 is not changed by this task.

Evidence is preserved in `coverage/broader-targeted-20261014/approved-gpu-performance`,
`approved-software-compatibility` and `approved-split-inventory`, with separate
lane JSON reports. Original failed measurements and reports remain intact.
