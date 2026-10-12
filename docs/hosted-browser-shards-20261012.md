# Next hosted validation: four isolated browser shards

The existing main push / main pull-request triggers are unchanged. The original PR53 run on a4007ad is not cancelled or modified. This change is local, to be published only after that run produces its full failure inventory.

One prerequisite job runs source/release checks and unit coverage once, then collects the full browser inventory. Four standard ubuntu-latest jobs run file-level Playwright shards with one worker each and maxFailures zero. Matrix fail-fast is false. Existing assertions, per-case deadlines, project/browser settings, graphics and tracing configuration are unchanged; no fullyParallel setting is introduced.

Each shard uploads one uniquely named evidence artifact with its actual JSON result and existing screenshots. The final test gate compares stable test IDs against the complete inventory and reports passed/failed/skipped/interrupted/flaky/unrun counts. Missing shards, missing/duplicate/unexpected cases, runner errors, failed prerequisite jobs or non-passing outcomes prevent a complete result. A small separate count-proof artifact contains no duplicated screenshots. New artifact retention is three days; existing artifacts are untouched.

Local validation: parsed YAML confirms unchanged triggers and one checks/coverage invocation. Actual Playwright collection assigns 52, 39, 45 and 45 cases; their union is exactly the original 181, each once. Four Node tests verify success, missing/duplicate detection, collection-versus-execution distinction and failed/skipped/interrupted/runner-error rejection. Collection does not constitute execution or a hosted pass.

The repository is public (verified through its existing GitHub read connection). GitHub documents public repository standard-hosted-runner usage as free, a Free-plan concurrency limit of 20, and a maximum matrix size of 256. This matrix uses at most four simultaneous standard Ubuntu jobs. No paid larger runners, new services, settings or billing limits are introduced. Artifact storage is subject to the account's separate shared allowance, which this connection cannot inspect; evidence is partitioned rather than duplicated and retained briefly. No additional paid capacity is requested or enabled.

References: https://docs.github.com/en/billing/concepts/product-billing/github-actions ; https://docs.github.com/en/actions/reference/limits ; https://playwright.dev/docs/test-sharding . Hosted execution and consolidated terminal outcomes remain pending.
