# Combined Markets and saved repair recheck

Tania requested the separate repair branch and a recheck on 15 October.
This task permits publishing a CI candidate, with **no merge or deployment to
live**. It excludes the requested opening-flow and classroom-passcode revision.

## Exact integration

Base: published Markets main `423d2ab590285eeb87ab38f675ff4a9df1e2852e`.
Saved repairs: `13399399ba2a5184bb3ff8b404a968cc1602a1b1`, including
the `c72b439` successful-save notification and immediate quality application.
Candidate branch: `repair/markets-combined-20261015`.

The three-way merge preserves both histories. Cache conflicts use a new
combined app/guest-shell tag; the release manifest is rebuilt from actual
combined files. The old repair manifest is not substituted over current main.
Market navigation conflicts keep **KeyW** after the published grounded exit,
rather than restoring the older reversed exit direction.

Market curriculum, recall, takeaway, practice stickers, shared money and
collection files are byte-identical to published main. Original assets,
avatars, photo/tour runtime, real authentication and session ownership are
unchanged. Shared app changes add saved repairs without replacing the
published `MARKET_APPROACH` position/yaw and grounded arrival.

Runtime repairs cover composed asset URL handling, reuse of existing tree
geometry, full-mode header wrapping, EST-only camera/control framing,
fixed-world interaction priority, successful-save Echo notification and
immediate renderer quality application. Original geometry and trees remain.

## Baseline and comparable inventory

Live run [38667011027](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38667011027)
reported all **242** cases exactly once: **175 passed, 67 failed**, no skipped,
interrupted or unexecuted cases. Its proof correctly reports failure.
The small original accounting artifact is retained locally and its complete
case ledger is committed as `qa/combined-baseline-20261015.json`.

The combined candidate collects **243** cases without collection errors.
There is one added existing held-entry avatar-save regression. Six test IDs
change with their names; explicit old/new mappings retain all 242 logical
baseline cases. Two mappings record the user's waived spawn rear-building
occlusion percentages. Those cases still require complete geometry, original
trees, actual walking, collisions and visible facades on physical approach.

Four other renamed fixtures had held required geometry while expecting it to
remain unloaded, contrary to already-published main's entry contract. They now
hold optional surfaces and retain real readiness, movement, retry and course
access checks. These are reported as harness/contract corrections, not new
runtime performance fixes. Other tests retain movement/loading requirements.
The earlier approved accelerated/software reporting split is retained:
accelerated startup remains strictly below eight seconds; measured software
waiting has no approved numerical acceptance deadline and is not called fixed.

## Focused target checks

- **279 units in 62 files passed.**
- **14 accounting/policy proof tests passed.** New guards demonstrate that
  missing shards, removed baseline movement cases and real movement failures
  keep the aggregate failed, including when cases are explicitly renamed.
- **284 exact staged release hashes and 89 modules passed.**
- **14 distinct native Chrome cases have passing evidence** across two bounded
  runs, covering the held-save regression, both rear-building walking routes,
  all nine dedicated Market curriculum cases, and both accelerated entry cases.
- The two entry handovers measured **506.3 ms** and **484.4 ms** on the actual
  Apple/Metal backend and passed the unchanged eight-second budget. These are
  Mac test observations, not school-device or delivery-network certification.

The first focused run passed five cases, then failed to load the original
one-page image because the local read-only sparse-asset server rejected an
existing canonical symlink. That server mapping was corrected, with no game
or assertion changes; the failed attempt is retained. The remaining nine cases
passed. No Assets link was created or removed, and no files were deleted.

Local source filesystem checks rely on Assets omitted by sparse checkout;
the hosted source check uses the complete tracked checkout. Local exact Git
release checks are passed separately. Workflow YAML parses successfully.

## Full hosted recheck

`combined-recheck.yml` is limited to this candidate branch. It runs full source
checks and unit coverage, collects the entire inventory, then executes every
primary case once across four independent single-worker shards. Essential
journeys are included in the same partition; failure in one does not prevent
the rest from running. Retries and fail-fast are off. Each job has a 45-minute
resource bound; missing reports still fail exact accounting.

The separate two-case software lane remains outside primary case totals.
The aggregate compares every logical baseline ID, records improved/regressed/
unchanged/new cases and preserves requirement-adjusted mappings. A failure or
missing case remains a failure. Software timing and unverified school-device
qualification stay explicit. Hosted terminal results follow below.

Detailed local evidence: `coverage/combined-recheck-20261015/`. Disk space was
2.4 GiB at initial inspection and after focused checks; no deletion or security
setting change was used. Live main remains the published Markets revision.

## Terminal hosted result

[Run 38674943796](https://github.com/Emmanuel-ICT-Support/GTCEM-Career-Empire/actions/runs/38674943796)
finished **failure** at 03:53:08 UTC on 15 October, testing merge commit
`25b378d6659fd0bba5abe70acb211ebf082f7cbb`. All four shards completed and
uploaded reports before their resource limits. Source/release checks, 279 units
in 62 files and all 14 accounting tests passed.

| Primary inventory | Passed | Failed | Skipped / interrupted / flaky / not run |
| --- | ---: | ---: | --- |
| Published Markets baseline | 175 | 67 | 0 / 0 / 0 / 0 |
| Combined candidate | 202 | 41 | 0 / 0 / 0 / 0 |

The aggregate reports **243/243 IDs exactly once**, with no missing, unexpected
or duplicate cases and no missing baseline case. Shards report 58/6, 50/8,
42/20 and 52/7 passes/failures. The full proof correctly fails on 41 failed
cases; exact inventory coverage is not a passing test result.

Of the original 242 logical cases, **30 improved, 4 regressed, 171 stayed
passing and 37 stayed failed**. The added held-entry avatar-save case passed.
Thus passes are `175+30-4+1=202`; failures are `67-30+4=41`. Six explicit ID
mappings preserve renamed cases. This mixes runtime repairs, test/observer
corrections and the previously approved GPU/software reporting split; 30 green
transitions are not evidence of 30 separately established runtime fixes.

The complete before/after ledger, assertion excerpts, individual dispositions,
artifact IDs/digests and qualification limits are in
[`combined-recheck-result-20261015.json`](combined-recheck-result-20261015.json).
All four downloaded reports match the hosted proof's exact IDs, outcomes,
partition and counts. The four archive digests and small proof archive digest
were independently verified. Original reports, logs and failed attempts remain
under local `coverage/combined-recheck-20261015/` and in the hosted artifacts.

### Four new regressions

- Echo staged guidance: the arrival card did not hide within five seconds even
  though Echo opened. Entry was still pending with one rendered frame. An
  async style/readiness cause is plausible but unproven.
- Market Stats default entry, 1280 and 390: the generic Stats panel opened but
  its Market money heading was absent within five seconds. Full-mode desktop
  is also still failed from baseline. Market collection code is unchanged;
  module/readiness timing requires investigation.
- Options pause: horizontal movement was **0.03 m** against the unchanged
  **less than 0.02 m** limit. The test excludes height, so vertical settling
  does not explain it. Actual drift versus stale diagnostics remains unresolved.

### Remaining failures and evidence limits

**Three confirmed stale route drivers** remain failed: two Market gate cases
still press KeyS to re-enter after the corrected published yaw now faces
forward. They walk away to world-edge z36 rather than the entrance at z-22.
The phone paid-shift case receives $18 and saves its work, then walks straight
east into the existing workbench at x4.2/z-2.8: its x3.171 stopping point matches
the collision boundary near 3.175. A driver should walk around the obstacle.
Neither diagnosis permits restoring the old camera orientation or removing
collisions, and no repair or successful rerun of these drivers is claimed.

**Walking and performance remain open.** Three movement tests fail on actual
SwiftShader: desktop 0.0104 m/s and phone 0.5937 m/s against greater than 2.2,
and the eight-FPS run ratio 1.483 against greater than 3.281. Other failures
include Studio approach, two slow-fallback walks, optional-surface walking,
phone startup movement, the default live-map pair, desktop Chapel movement,
desktop parcel handover and owned-account automatic parcel walking. Some use
diagnostics, so input, low frame rate and observation freshness are not fully
separated. They remain failed without a threshold change.

**Both rear-building cases still fail real walking**, before the facade-on-
approach assertions. Complete original geometry and 19 trees were verified;
desktop reverse travel stopped short of z23.3 and phone east travel stopped
short of x28. The user's two spawn-occlusion exceptions do not clear either
case. Of four renamed geometry fixtures, staged entry and delayed courtyard
now pass; both first-play fixtures remain failed.

**Readiness/recovery is not fully verified.** Two playable first-frame cases
and two warm-reload cases miss the five-second rendered-frame assertion.
Three failed-avatar/clothing cases initially observe undefined fallback;
their later snapshots show fallback and its retry button, with entry still
pending. Their complete retry/persistence paths were not reached. The failed
optional-surface case later shows ready geometry and a visible recoverable
surface failure, but its readiness poll and later retry journey did not pass.

Admin preview desktop/phone show Reception but published diagnostics report
the office inactive; the early failure has no actual preview-state attachment
and its saved page snapshot is the original tab, leaving the cause unresolved.
Chapel approach physically reaches the door but mode readiness at 90.902 s
overlaps its unchanged 90-second test limit. Phone Chapel return later shows
the exact correct exterior position, and phone EST-to-Chapel later shows the
Chapel, after their assertions already failed; desktop EST-to-Chapel lacks a
page snapshot. These are retained timing/observation failures, not successful
complete journeys. Two walking-suit tests never observe the required stopped
animation/shadow state, and the natural-intro case fails its exact-duration
metadata predicate before its later handover checks. Root causes for these
remaining cases are not established by this run.

All nine dedicated Markets curriculum cases passed, including the actual paid
shift/recall/Stats/exit journey. Existing archived-avatar/lazy-startup and whole-
character coverage also has passing cases; this does not clear other failed
journeys or establish a full-suite pass.

### Separate runtime qualification

The separate software lane passed **2/2**, excluded from the 243 primary
executions. Actual SwiftShader cold handover was **22,942.2 ms**, with navigation
readiness **30,427.8 ms** and **27,334.8 ms**. Software startup remains **unfixed**;
its waiting acceptance is **null/unassessed**. Hosted GPU performance is
unverified. The earlier native Metal measurements of 506.3/484.4 ms retain the
eight-second budget; representative physical school devices remain untested.

No code changes were made after the tested merge to clear failures. This
terminal receipt is documentation only. Live main remains
`423d2ab590285eeb87ab38f675ff4a9df1e2852e`; no merge, deployment, opening/passcode
revision, file deletion, or credential/security change occurred in this task.
