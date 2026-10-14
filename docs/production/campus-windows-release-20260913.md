# Approved campus windows and paving release — 13 September 2026

Tania accepted the campus standard and explicitly authorised the final window/flicker changes and live publication. Baseline main: d442671; campus rollout checkpoint: 1ff0ece.

English and Media retains its oval-facing curved curtain wall, silver framing, fins, plinth and original mural. Single glass sheets reveal authored art/film/drawing displays, monitors, desks and easels. SPACE retains its approved outside shape and rear foyer; two practice half courts, hoops/nets, padding and timber sports flooring replace generic shallow office panels. These are visual interior hints within existing non-enterable footprints. Campus glass uses restrained reflections, lower opacity and single surfaces where possible; Careers/EST transparent panes remain separate for sorting. Exact crest, Chapel photo and gameplay are preserved.

Flicker repair removes six obsolete model-display ramps crossing the new Careers/EST paths. Curved ribbons and new teaching-building junctions are now clipped into non-overlapping polygons before triangulation; the same ground location is drawn once within each path network. Source data remains editable. Four regression tests cover cross-junctions, duplicate triangles, planted holes and oblique overlaps. No new runtime dependency.

The completed concurrent EST phone-playback repair is retained, with its focused tests and cache keys; see ../est-mobile-video-20260913.md.

Local source checks and 14 unit tests pass. Eleven real-physics routes pass, including Studio, Chapel, EST, Media, SPACE and oval. Browser screenshots confirm clearer windows and the removed path conflicts. Local full browser CI cannot launch Chromium under the Mac sandbox (permission 1100); hosted release CI is pending. Physical-school-device performance remains a separate follow-up. Publication and live verification are still pending at this commit.

Evidence and precise final live receipt are canonical in the existing Blueprint under private/production-evidence/2026-09-13/campus-windows-release. No global refresh or Blueprint reader publication is implied.


Hosted rendering diagnosis: retained traces from cfc6683 show about 14 seconds between frames and GPU readback-stall warnings even with one worker. This runner has no hardware GPU; serialisation alone did not resolve it. Campus CI now caps only the test framebuffer to 0.25 DPR and shadow maps to 256 pixels using a checked response adapter in the test fixture. Production files, geometry, materials, quality controls and gameplay assertions remain unchanged. This suite verifies gameplay at a reduced raster budget; it does not certify full-quality rendering or school-device speed. Full-size visual evidence remains the actual hardware-rendered committed build.


Follow-up trace confirms the test adapter applied (320×180 framebuffer) but CPU-only frames still take about 8 seconds. CI therefore draws only a 24-index/vertex sample of explicitly named decorative foliage meshes, retaining every asset load, instance placement, collider, building, player and gameplay assertion. This is functional coverage with reduced foliage drawing, not a visual or fidelity acceptance test. Full-size hardware-rendered production evidence and shipped foliage remain unchanged. The fixture fails if renderer insertion points change.


Final release decision: hosted full-graphics browser tests are not passing on the GPU-free runner; traces establish multi-second rendering stalls, while the same committed game works in the hardware-rendered browser and real-physics route checks. Reduced raster/foliage experiments were unsuccessful and have been removed from the final tests. Tests retain the full production scene, one CI worker, first-failure stopping and failure evidence. Do not claim a full CI pass. Publication uses the user-authorised release scope, successful source/unit/package/physics checks and actual hardware-browser verification. No branch rule/check requirement is overridden (main rules returned empty; no legacy protection was returned). Physical-device performance remains open.

The completed CE-CHANGE-20260913-49 signage receipt now supplies all three matching files. The final release includes the supplied cleaned crest and architectural glass sign, preserving geometry, positions and the user-requested refinement. Manifest now includes 78 exact assets and the new signage module. Its earlier incomplete import was fixed before publication; no incomplete candidate went live.


The completed diagnostic run returned 28 passed/9 failed. In addition to graphics timing stalls it exposed two concrete test-platform issues: Chapel screenshots used the macOS-only /private/tmp path, and Python's basic test server did not support media byte ranges (native video seeks reset to zero). The tests now save screenshots through Playwright's portable output path, and the local test server supports HTTP byte ranges as production does. Graphics-timeout limitations remain explicit; no full CI success is claimed.


## Verified live checkpoint — supersedes earlier pending-release notes

Tania-authorised campus release is live and verified at 61826d685d434ceb8ecedaf7adf5be5d7280b651 (2026-09-13T06:50:00Z); reviewed candidate b876b64238c5c6860919e66b618d4c6fe9b9ac9b, PR #11.

English/Media retains its curved oval-facing facade with clearer glass and art/film/drawing displays. SPACE reveals two practice half courts, hoops and timber flooring. Campus glazing is clearer. Overlapping path geometry and six obsolete display ramps were removed to repair marked flicker. The accepted campus rollout, completed EST native-video repair and completed cleaned-crest/glass-signage receipt are included. Working gameplay, connected Chapel/Admin/Services and Home Base remain intact.

Source/package checks (78 assets and 28 reachable modules), 14 unit tests, eleven real-physics routes and actual full-size browser views passed. All 78 published release files match the checked source; the deployed game was inspected in the browser. Final candidate hosted CI: 24 browser tests passed, one arrival-walk timeout, 12 not run. Prior diagnostics established severe GPU-free rendering stalls; the full suite has NOT passed. Reduced-graphics experiments were removed from final tests. Sustained physical school-device performance remains unverified.

Live game: https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/playable-3d/

Keep the newer crest sharpness/sign positioning and Chapel glazing/metal-figure follow-up separate until its owner completes and verifies it. Review sustained performance on a representative school laptop and phone; then reuse the approved architecture/material/planting standard for future destinations by fidelity tier. Preserve paused avatar/wardrobe and curriculum-state timing.

Global refresh remains incomplete (lastSuccessfulRefreshAt is null). Retain missing /mnt/data source byte-identity checkpoints, the independently verified September 12 game-clone monitoring gap, and pending canonical reader integration/review receipts. Game deployment does not publish the Blueprint reader.

The first automatic merge review rejected publication over validation prerequisites. Tania then confirmed that she did not intend to block the already requested merge; the same exact candidate merged successfully. No branch protection was changed. Failure history and renewed authorisation are preserved in the evidence.


Closing record checks: planning exports regenerated; 26 scoped Blueprint tests pass (after replacing the now-published signage local preview with its live URL). Registry scan retains 10 folders, 5 discovered working copies, zero in-registry coverage failures, 173 pending intake observations and 12 pending changes. Independent September 12 game clone remains manually verified outside that registry. No global refresh or Blueprint reader publication. New signage/Chapel working changes are outside the released source and remain untouched.
