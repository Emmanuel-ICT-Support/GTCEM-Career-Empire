# Broader integration: terminal hosted result and focused follow-on

The one full run [38543515871](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38543515871)
finished **failure** at 10:22:40 UTC on 14 October. Application/tests candidate
082805ba08e0f490062ff6be25f65619ad8eee50; QA commit
fb7cb02f5bc7233cb858f283f9a17cc63e9b2595 differs only by the QA workflow.
Hosted source checks, 280 hashes/87 modules, 257 units and collection of 233
unique cases passed. No duplicate full run, broader merge or live publication.

| Shard | Passed | Failed | Interrupted | Not started |
| --- | ---: | ---: | ---: | ---: |
| 1 | 55 | 8 | 0 | 0 |
| 2 | 45 | 9 | 0 | 0 |
| 3, cancelled at 45-minute job limit | 35 | 18 | 1 | 4 |
| 4 | 51 | 7 | 0 | 0 |
| Total | **186** | **42** | **1** | **4** |

Zero skipped or flaky cases. Shard 3 uploaded failure evidence but was killed
before emitting its JSON report. The workflow's JSON-only count proof correctly
fails completeness: 175 reported, 151 passed, 24 failed, 58 missing. Its
[count-proof artifact](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38543515871/artifacts/11886141073)
is preserved unchanged. Reconciliation adds the 53 terminal CASE_END events,
one unfinished CASE_START and four unstarted inventory IDs from shard 3's job
log. All 233 unique inventory IDs are accounted for, without claiming complete
execution or treating the cancelled shard as successful.

The interrupted case is the named-character switching/rig/persistence scenario.
Four following whole-characters cases did not start: simulated-phone failure
recovery, saved Test character, failed saved primary model, and catalog URL.

## Findings and small follow-on

Two runtime faults have source evidence and focused fixes. Successful avatar
saving wrote the arrival marker but Echo observed that marker only inside the
entry-ready movement update. The existing guidance adapter is now notified
immediately after successful persistence; disabled/failed saves cannot complete
the task. No course or Market completion is granted. Quality selection also
used the old Auto resolution until another world frame ran. Its handler now
applies the existing renderQuality policy immediately, with unchanged native,
software, Low and High policies.

Two photo-return failures asserted the superseded “completed a mini overview”
copy. They now expect the approved companion-campus-tour copy; wallet,
initiative, collection and once-only reward assertions remain intact. The
full-campus test sampled the new-frame count immediately after asynchronous
readiness; it now polls for an actual advanced frame within the existing
five-second assertion and 90-second case budgets, keeping all geometry and
collider checks.

Both hosted Admin failures happened on re-entry after exit, after initial
Reception, cancellation/retry and Auth isolation had passed. A read-only
software diagnostic reached the correct actual Market mode and active
Reception, and its published state also caught up. That complete diagnostic
still failed its 120-second deadline later in the normal-gate journey; it is
not a software full-flow pass. The test now requires a visible current dialog
and reads actual route/district/wallet state for re-entry, rather than relying
on a frame-throttled diagnostics publication. No Admin route or paid gate was
changed. Read-only route and published-state observations are attached.

Three strict hosted performance failures remain open: complete campus handover
at both widths and cold-skip costs measured 23.55–27.09 seconds against the
unchanged eight-second budget. Remaining failures include real movement,
walking waypoints, ready frames, optional-surface recovery, Stats, companion
switching and the natural Chapel journey. Low SwiftShader frame rates and
expired observation windows are evidence, not proof that every failure is
test-only. No movement/performance threshold or scenery/camera requirement is
waived. These require bounded failure-specific diagnosis before another full
run; neither this follow-on nor earlier native observations makes the full
integration green.

## Focused evidence

Twelve relevant units pass, including executing the actual save and quality
handlers with no ready entry or new world frame. Eight distinct native Chrome
cases pass across the two focused batches: Admin desktop/phone; held-entry
successful save; existing Echo save/revisit; quality/hidden-frame controls;
photo-return/rewards desktop/phone; full-campus roots/colliders/new frame.
The instrumented Admin observer also passes at both widths (2/2); there are eight distinct native scenarios across ten passing executions.
Full follow-on unit confirmation passes 259/259 tests in 59 files. Working source checks and staged 280 hashes/87 modules pass. This is not a new
full-suite or physical-device pass.

Local ignored evidence is under coverage/full-integration-run-38543515871:
reconciled-counts.json, failure-inventory.json (all 42 failures with exact
errors and artifact paths), shard-3-job.log, downloaded shard ZIPs, original
reports/screenshots, targeted-followup.json, targeted-contracts.json and the
software Admin diagnostic. The reconciliation is reproducible with
reconcile.py. Published focused PR57 main remains fec76572; this follow-on is
unpublished on repair/integration-followup-20261014.

The subsequent bounded investigation is recorded in
[broader-root-causes-20261014.md](broader-root-causes-20261014.md), with a
47-ID machine-readable failure ledger. It adds native verification and measured
software-renderer evidence without changing this original hosted outcome.
