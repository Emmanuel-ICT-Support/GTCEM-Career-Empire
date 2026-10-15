# Combined controls and route follow-up

This isolated follow-up continues the combined repair after full hosted run
38674943796 (202 passed / 41 failed). No new full suite, PR, merge or live
publication is part of this checkpoint. Opening and password work remain
separate. The prior full result and its 243-case ledger remain authoritative.

## Root causes and changes

**Paused horizontal drift is a real runtime defect.** The old frame path cleared
input but still stepped physics while Options, the companion picker or Echo was
open. An interpolated display pose can therefore snap toward the pending body
pose, even with zero input. A deterministic execution of production navigation
reproduced 30 physics steps for a paused frame, including a pending 3 cm offset.
Three regression checks fail on that old path and pass after the repair. The
exact contribution of this snap versus stale diagnostics to the hosted 3 cm
reading was not uniquely traced; both paths are addressed.

The repaired path skips movement physics while paused and retains staged
preparation, scene updates, UI work and normal resumed walking. The browser pause
case now measures the live displayed position instead of a diagnostics snapshot
published before movement. Its strict less-than-2-cm horizontal bound, four
button/outside/Escape cycles and real movement after each resume are unchanged.

**Echo hiding and Market Stats evidence supports readiness/test timing faults.**
The hosted assertions ran during initial software rendering and returned no
usable predicate result. The Echo error snapshot already omitted the first-day
card. A bounded unmodified software probe observed Echo open with the exact
existing CSS hide rule working, and Stats showing the correct $14 balance while
entry was still pending. Neither probe required a CSS or Market data repair.
This does not establish an isolated hosted scheduler cause or acceptable UI
responsiveness on school hardware.

The complete Echo saved journey and four Stats journeys now wait for actual entry
readiness before their five-second UI assertions. The separate held-geometry
avatar-save scenario additionally checks that Echo hides the arrival card before
entry is ready, preserving early guidance coverage. Stats remains lazy loaded;
all saved amounts, tax, purchase/ticket, saving, withdrawal, donation and reopen
assertions remain. An initial software follow-up hit the generic 30-second whole-
case deadline after reaching correct money states. Its functional journey budget
is now 60 seconds, including the 30-second entry precondition. Individual UI
limits and startup/movement performance assertions are unchanged. Software cold
startup is not accepted or fixed by this test budget.

**Three route drivers used obsolete or colliding paths.** Both Market gate cases
now press forward after the corrected published exit orientation, preserving two
actual exit/re-entry cycles, same-run identity and reward history. The paid-shift
crew route walks south around the existing workbench before heading east. It
uses real keyboard waypoints and normal collision. Both desktop and phone retain
actual paid shift, review-only My Work transfer, crew celebration and campus
return. Market camera, positions, obstacles, curriculum and wages are unchanged.

## Verification

- Final native Chrome/Metal run: **13/13 passed** in 3.1 minutes, including
  actual desktop/phone paid shifts, gate cycles, early Echo/save, four Stats
  variants, strict pause/resume and touch dismissal. The earlier 13/13 run used
  an initial pause-guard layout; the final layout retains background preparation.
- **282/282 units in 63 files** and **14/14 accounting checks passed**. The
  three new pause checks reproduce the old physics stepping and pass the repair.
- **284 exact staged hashes / 89 modules passed**, and collection retains the
  same **243 unique case IDs**. No full browser inventory was executed again.
- Final software-config run: **3 passed / 1 failed** in 3.0 minutes. Echo and
  default Stats at 1280/390 passed completely. Options missed its unchanged
  30-second entry-ready precondition, so its pause assertions were never reached.
  Its later snapshot shows entry ready, two frames and a 5.234-second last render
  on actual SwiftShader. Software pause is **not qualified** by that run.
- The first software attempt is retained: **1 passed / 3 failed**. Both Stats
  journeys hit the generic 30-second total after correct money updates, and
  Options failed the same entry precondition. The two Stats journeys pass after
  the explicit 60-second functional budget; the startup precondition was not
  enlarged to clear Options.
- Filesystem source checking **failed on 215 missing Assets references** because
  Assets are excluded from this sparse checkout; it reported no other failures.
  Exact Git package verification passes separately. Source syntax and whitespace
  checks passed.

The machine-readable result, exact revalidated IDs, report/runtime hashes,
remaining-case list and recovery receipt are in
[`combined-controls-followup-20261015.json`](combined-controls-followup-20261015.json).
The software failure is retained and no full-green claim is made.

The browser inventory retains all 243 candidate IDs, with no additions/removals.
Final native evidence revalidates eight cases that failed in the original full run:
all four regressions, both gate drivers, the phone crew route and desktop full-
mode Stats. These focused outcomes do not update the full-run 202/41 total.

## Remaining groups before another full suite

The other **33 originally failed cases** were not cleared by these focused
checks. They cover Admin preview state (2); Studio approach (1); avatar fallback
recovery (1); Chapel approach/movement/return (3); curriculum loading/fallback
(4); rear-building real walking (2); EST-to-Chapel transitions (2); optional
surface readiness/walking (2); warm reload first frame (2); ordinary movement
performance (3); live map movement (2); phone startup walking (1); first-frame
scenery/startup (2); desktop parcel handover (1); startup walking performance
(1); intro metadata and owned parcel walking (2); suit animation/shadow stop (2).
Some may change with the pause repair, but no passing result is inferred.

The two spawn rear-facade visibility exceptions do not excuse walking failures.
Eight-second accelerated startup, real walking, collisions and original geometry
remain required. The previous 22.942-second SwiftShader cold handover remains an
unresolved limitation, with no approved software waiting deadline. Physical
school-device validation remains outstanding.

## Evidence incident and recovery

Running the repository coverage command unexpectedly cleared its configured
`coverage/` output root, deleting ignored prior evidence. This was an execution
mistake, not an intended cleanup. Tracked source, committed ledgers and unrelated
`evidence/` and QA images were preserved. All seven original hosted recheck
artifacts were recovered from GitHub, verifying each archive digest and retaining
320 original artifact files; the baseline accounting artifact and 9,550,412-byte
baseline log were recovered too. Current reports/error contexts were restored
to their previous evidence paths. Older local-only experiment files and some
screenshots from the first follow-up run could not be fully recovered. Do not
claim complete recovery or that no files were deleted in this follow-up.

Recovered artifacts and new authoritative follow-up reports live outside the
coverage cleanup root in `../ecc-evidence-recovery-20261015/`. Later checks use
unit execution without coverage cleaning. The successful 13-case report from the
first native run is retained; the failed first software run is retained too.
No credentials or security settings were changed.

## Review publication

The checked revision is published to the review-only ref
`repair/combined-controls-20261015`, continuing the same combined history. The
full-suite trigger ref `repair/markets-combined-20261015` stays at `5f317cd`; pushing
runtime changes to that ref would automatically launch another full run. No PR
was created and no full workflow, merge or live deployment was started here.
The final response identifies the exact published commit. Current live main was
checked separately rather than updated by this task.
