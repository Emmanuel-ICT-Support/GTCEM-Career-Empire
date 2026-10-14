# Targeted broader failure investigation, 14 October 2026

The original hosted run remains failed: 186 passed, 42 failed, one interrupted
and four not started out of 233 IDs. Its reports, count proof, logs and ZIPs
are preserved. This investigation does not rerun the 233-case suite or approve
publication. Live PR57 main `fec76572` is preserved; the separate Market preview
`d0912bb` has not been integrated.

Application candidate: `c72b4390f0821712f3ef834be09ff48fe50933c0`.
Application SHA-256:
`f9d5ee35aeec6d24d4436b2ebbc735a05fd8043a6dab57f85342d971140d85d6`.
Only test diagnostics, the bounded runner and this ledger changed afterward.

## Completed native checks

The ledger contains exactly the original 47 nongreen IDs, with original
outcomes separate from follow-on evidence. Targeted selection is checked against
Playwright's collected IDs before browser launch. Each batch uses one worker,
zero retries and a new evidence directory. The initial movement selection
matched ten cases instead of nine and was stopped before browser launch; the
anchored selector then collected exactly nine.

| Group | Passing distinct cases | Other result |
| --- | ---: | --- |
| Previously committed control and observer follow-on | 7 | Native proof; original software confirmations remain separate |
| Startup, eight-second budgets and recovery | 14 | All passed with original assertions |
| Movement and navigation | 9 | Phone legacy Market failed initial loading once, then passed unchanged |
| Scene journeys, Stats/map, companion and avatar remainder | 16 | Cached-frame Stats precondition failed on native rendering |
| Total | **46 of 47** | One backend-specific case needs software diagnosis |

All five previously unfinished avatar cases completed and passed, including
the named-character rig/switching/persistence scenario. The genuine natural
video-to-Chapel journey passed, as did teacher cancellation/return, both suit
shadow journeys, complete scenery, both fresh maps and the Sprout/module return.
These are native results, not clearance of the original software failures or
a physical school-device acceptance claim.

## Measured software startup cause

The [subsequent bounded support/optimisation review](software-startup-decision-20261014.md)
refines the initial compilation attribution below. Expanded profiling shows
blocking time moving from program queries to an extension query when the
lighting prefilter is cached. These are GPU/driver query boundaries, not proof
that all measured time is compiler work. The cache did not solve startup and
no runtime optimisation or test-strategy exception was adopted.

Sequential cold-skip measurements on the same machine, browser and unchanged
application used actual reported WebGL renderers:

| Renderer | Click to ready | First full-campus CPU draw | Eight-second assertion |
| --- | ---: | ---: | --- |
| Apple M3 / ANGLE Metal | 1,668.1 ms | 738.9 ms | Passed |
| SwiftShader LLVM 10 / Vulkan | 24,135.8 ms | 22,682.5 ms | Failed |

The software world was built in 94 ms and integrated in 54 ms. A 22.7-second
main-thread task occurred in the first renderer call after geometry integration.
Optional WebGL profiling recorded 49 program-info queries taking 23,042.8 ms
in total. Suppressing shader log checks moved the same stall into program-status
queries; it did not remove compilation. `compileAsync` also failed to improve
handover, and this backend reported no `KHR_parallel_shader_compile` support.
Neither experiment is retained in runtime source. No graphics, shader precision,
camera, scenery, movement rate or performance threshold was reduced.

This establishes a backend-sensitive compilation stall for these measured
startup runs. It does not establish that every hosted failure has this cause.
The eight-second software failures remain open; no exception has been accepted.

## Stats trace

The cached-world test assumes the software paused-frame path. Native rendering
continues drawing behind the panel and therefore fails its stable-frame
precondition. That native failure is retained. A software probe keeps the
original 30-second entry assertion: its first draw completed at 31.4 seconds,
so the probe failed before reaching Stats. Actual-draw recording is opt-in and
read-only; a separate post-failure trace does not convert that deadline failure
into a passing result.

The completed post-deadline trace reached the visible Stats panel and used its
real Save $5 button. Wallet/savings changed to 1300/500. Across four subsequent
one-second samples, actual draws, the internal counter and the published counter
all stayed at two. Thus this trace confirms working software caching and honest
publication after entry, while the unchanged entry assertion still fails. It
does not reproduce or dismiss the original hosted extra third frame. A first
trace stopped at a null, not-yet-published Market snapshot; the corrected trace
uses the visible wallet UI and preserves both attempts.

Both map software rechecks failed their existing initial-entry assertion before
the original five-second fresh-run-ID failure was reached (103.6 and 89.2 seconds
including blocked browser calls). Their original identity assertion is retained.
The optional identity trace therefore does not establish an observer defect or
a reset defect. These failures remain in the ledger at their actual stages.

## Asset ownership and source integrity

This checkout's sparse pattern is `/*` then `!/Assets/`. The QA runner temporarily
creates only an `Assets` symlink to the original 8 October checkout's existing
directory, owned by `tania.byrnes`. While the link exists Git can report 844
apparent tracked deletions because the directory is a link. After removing the
runner-owned link, the asset diff is **zero**. No source asset was restored,
removed, staged or changed. The Market preview remains separate.

`npm run check` failed once with the sparse-excluded Assets directory absent.
With the read-only original-assets link, the dev check and release verifier
passed: **280 exact hashes and 87 reachable modules**. The link was removed
afterward and the asset diff was zero. This is a workspace availability issue,
not evidence of deleted release assets. The earlier full unit confirmation at
`c72b439` remains 259/259 in 59 files; no new runtime change requires another
blanket unit/browser run.

The GitHub branch API independently still reported exact live main
`fec76572a26af62678ac6324216ac460e93deb36` during this investigation. It is an
ancestor of the candidate. The runtime directories have zero diff from
`c72b439`; no unreviewed Market source was copied in.

## Evidence and remaining work

Machine-readable ledger: `docs/broader-failure-ledger-20261014.json`.
Ignored evidence: `coverage/broader-targeted-20261014/`, with original full-run
evidence in `coverage/full-integration-run-38543515871/`.

Original software movement, readiness/recovery, scene, companion and Stats
failures remain open unless their own focused confirmation proves otherwise.
The native passes narrow the reproduction conditions; they do not waive the
software requirements. Publication stays on hold for review of the specific
remaining failures and any explicitly proposed exception.
