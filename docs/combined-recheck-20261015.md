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
qualification stay explicit. Hosted terminal results are pending.

Detailed local evidence: `coverage/combined-recheck-20261015/`. Disk space was
2.4 GiB at initial inspection and after focused checks; no deletion or security
setting change was used. Live main remains the published Markets revision.
