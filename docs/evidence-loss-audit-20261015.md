# Evidence loss audit and safe runner

**No complete pre-cleanup file manifest exists. An exact inventory of every lost local-only file is impossible from retained evidence.** This is the exact known-path list, with provenance limits and unknown extent stated separately. It is not a complete loss or recovery claim.

| Known path | Status | What can be reproduced |
| --- | --- | --- |
| coverage/combined-recheck-20261015/native-focused-report.json | original local raw result unavailable | Same14 logical cases/code are available at25b378d. Committed summaries retain counts and506.3/484.4ms observations. |
| coverage/combined-recheck-20261015/native-followup-report.json | original local raw result unavailable | Same14 logical cases/code are available at25b378d. Committed summaries retain counts and506.3/484.4ms observations. |
| coverage/combined-recheck-20261015/native-focused-proof.json | original local raw result unavailable | Same14 logical cases/code are available at25b378d. Committed summaries retain counts and506.3/484.4ms observations. |
| coverage/combined-recheck-20261015/partial-shard-4-summary.json | original intermediate projection unavailable | Underlying hosted reports/contexts/logs and committed final243-case ledger remain; intermediate counts and analysis can be recomputed. |
| coverage/combined-recheck-20261015/partial-three-shard-ledger.json | original intermediate projection unavailable | Underlying hosted reports/contexts/logs and committed final243-case ledger remain; intermediate counts and analysis can be recomputed. |
| coverage/combined-recheck-20261015/partial-three-shard-diagnosis.json | original intermediate projection unavailable | Underlying hosted reports/contexts/logs and committed final243-case ledger remain; intermediate counts and analysis can be recomputed. |
| coverage/combined-recheck-20261015/baseline-movement-diagnostics.json | original intermediate projection unavailable | Underlying hosted reports/contexts/logs and committed final243-case ledger remain; intermediate counts and analysis can be recomputed. |
| coverage/combined-recheck-20261015/phone-shift-route-diagnosis.json | original intermediate projection unavailable | Underlying hosted reports/contexts/logs and committed final243-case ledger remain; intermediate counts and analysis can be recomputed. |
| coverage/combined-recheck-20261015/contract-preservation-audit.json | original local source-comparison report unavailable | Git comparisons at423d2ab and25b378d can reproduce source equality. |
| coverage/combined-recheck-20261015/units.json | original local JSON unavailable; payload not independently recorded | Hosted checks retain279passed; immutable25b378d unit code is available; later282-test raw reports remain. |
| coverage/combined-recheck-20261015/read-hosted-artifact.py | original helper source unavailable | Replacement restore-hosted.py and receipts exist outside coverage. |
| coverage/combined-recheck-20261015/baseline-failure-evidence.json | reconstructed projection; original JSON bytes lost | 67 failure blocks reconstructed from restored hosted baseline log38667011027. |
| coverage/combined-followup-20261015/diagnosis.spec.js | original diagnostic source unavailable | Tool history contains the creation instructions and partial observations; behavior can be freshly tested. |
| coverage/combined-followup-20261015/diagnosis-report.json | original diagnostic raw report unavailable | Completed tool result records2passed and partial Echo/Stats observations. |
| coverage/combined-followup-20261015/unit-coverage.log | original command log unavailable | Later non-cleaning unit logs/results are retained. |
| coverage/combined-followup-20261015/native/echo-phone-and-reduced-motion-leave-Echo-and-player-visible-chromium/echo-phone.png | original screenshot unavailable | A separate final native run retains its own image and raw report. |

## What remains and what cannot be recovered

The earlier14 focused cases are control-completion1, physical rear-building approach2, dedicated Markets learning9, and campus entry2, at25b378d. Git retains their code and committed summaries. Fresh execution can test the same behavior but cannot recover original wall-clock measurements, timestamps or pixels. The intact later13-case raw reports concern7c52ecc and do not replace the earlier14-case raw evidence.

Seven original hosted artifacts from38674943796 have320 files independently verified against their recovery receipts; archive digests match the previously committed receipt. Raw shards, original hosted error contexts, check inventory, aggregate proof and software report remain. Baseline242-case accounting and the9550412-byte hosted log for38667011027 were retrieved. The67-block failure JSON and artifact receipts were regenerated projections; no claim is made that their earlier local JSON bytes were recovered. No pre-cleanup checksum exists for the old local baseline log.

The committed243-case ledger, first/final13-case native reports and first/final software reports remain. Unrelated evidence/ and QA images were preserved. Some older local-only evidence remains unrecoverable. Historical document references and unknown screenshot names are not counted as confirmed losses.

## Runner protection and its scope

Coverage now uses an atomic fresh run directory, clean=false and cleanOnRerun=false. The managed command accepts test-file filters only, rejects output/config/cleanup overrides, and saves log/results/finish status inside that new run. Direct Vitest calls also allocate a fresh output path. Default and supported tracked QA browser configurations select fresh output leaves. Old private configurations with explicit paths are not invoked. Current diagnoses use fresh configurations/output paths and testInfo.outputPath for screenshots. Manual shell redirection or legacy tests with hard-coded output filenames must not target retained evidence.

Two actual coverage runs passed4 selected tests each. The second left477 inventoried prior files and first-run outputs byte-identical;5 guard tests also pass. This proves preservation of those inventoried files and does not retroactively establish the complete earlier deletion inventory.

Fresh evidence for this task: /Users/tania.byrnes/Documents/Codex/2026-10-13/task/ecc-safe-runs/diagnosis-2026-10-15T04-29-27-581Z-WIGIHf. [Machine-readable audit](evidence-loss-audit-20261015.json) includes each path, provenance, loss limits and current hashes.
