# Remaining-failure investigation checkpoint

This is a symptom/root-cause investigation partition, not a declaration that33 cases share five proven causes or have been fixed. All33 IDs appear once. Full run38674943796 remains202passed/41failed.

| Investigation group | Cases | Current evidence |
| --- | ---: | --- |
| movement-input-frame-progress | 16 | Three strict native movement cases pass. Software accepts keys, but a4.4067s frame-sample gap spans a1.802s key hold with no recorded UI/visibility blocker or reset. Exact blocking workload is still under investigation. |
| readiness-state-publication | 13 | Late/missing first-frame or state observations. Native Admin2pass. Software Admin initial/reentry actual office active; reentry published state lacked market; fullcase later timed out in normal Market state query. |
| chapel-journey-deadline | 1 | Original route reached actual Chapel door; mode observation90.902s overlaps original90s deadline. No deadline waiver. |
| animation-shadow-stop | 2 | Original software cases lacked required idle/shadow-off recent frames within10s. Specific animation versus frame scheduling cause unproven. |
| intro-metadata-availability | 1 | Static Git-matched intro is exactly66.000000s. No stale-duration repair justified; original metadata availability query timed out before later handover assertions. |

Two Admin and three movement cases in this set pass in bounded native runs. Software accepts movement input but did not make the required progress. The additional software trace found a4.4067s frame-sample gap spanning a1.802s key hold,37physicssteps, no recorded UI/visibility blocker and no reset calls. That supports missed physics sampling between delayed frames for this case; it does not prove all16 share this cause. Software Public Admin initial and reentry actual states were active; its fullcase failed later querying the normal Market return. No Admin gates were loosened.

Stats separately reports its successful functional journey,31.4629s to readiness and96.5ms to content. It explicitly does not qualify startup performance. The old22.942s cold measurement remains unresolved, not accepted.

See [the16-path evidence-loss audit](evidence-loss-audit-20261015.md) and [the33-case machine-readable partition](remaining-failure-partition-20261015.json). Runner guards, audit and this diagnostic partition form a separately verified checkpoint. No full suite, merge or deployment has been launched.
