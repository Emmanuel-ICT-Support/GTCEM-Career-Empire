The live playable game is https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/playable-3d/. Its source is Emmanuel-ICT-Support/GTCEM-Career-Empire main, published from the repository root. The Blueprint at taniab1975.github.io/career-empire-blueprint/ is the planning reader; its embedded playable copy is a preview, never proof of game deployment. Verify the exact target and remote before publishing. Arrival Gardens update is scoped to playable-3d; preserve existing module integration, avatar choices and unrelated work.

> **Current planning authority - 9 September 2026:** [Career Empire Living Blueprint](https://taniab1975.github.io/career-empire-blueprint/) owns current priorities, decisions, approvals, delivery status and visual evidence. Read its Start Here and [session protocol](https://taniab1975.github.io/career-empire-blueprint/production/operating-protocol.md) before work; log meaningful outcomes there and update AGENTS.md and affected documentation at task close.
>
> This document's earlier priorities/design narrative are retained as historical context, not new approval. Keep applicable repository setup, testing and safety guidance. [GitHub task reconciliation](https://taniab1975.github.io/career-empire-blueprint/production/github-tracking-audit-2026-09-09.md) explains linked execution tickets; an open issue or old proposal does not establish current implementation or approval. No new game/asset production is authorised by this notice.

# AGENTS.md

Lean guidance for AI coding agents in this repo. Keep this file compact because it is loaded into context often; put longer workflow notes in `docs/`.

## Project

Career Empire / Megatrends is a mostly static browser learning-game ecosystem: HTML, CSS, plain JavaScript, JSON data, dashboards, Supabase-facing browser helpers, media assets, and Remotion scenes.

The product goal is a connected careers/employability game. Preserve decisions, feedback, consequences, saved evidence, salary/community signals, and teacher visibility. Do not drift into decorative worksheets.

Before major design or architecture work, read `docs/project-memory.md`. For local setup details, read `docs/local-dev-workflow.md`.

## Current Focus

Near-term priority order: EST CORE reliability and UX, teacher dashboard audit/cleanup, teacher video overhaul, shared state/economy/evidence refactor planning. Megatrends and Lifelong Learning are parked unless specifically requested.

For current workspace cleanup/status context, read `docs/current-workspace-status.md` before deleting, ignoring, or reorganizing WIP files.

## Key Areas

- `modules/est-prep/`: current priority module.
- `dashboards/`: student hub, teacher dashboard, leaderboard/community views, shared dashboard code.
- `student/`, `teacher/`, `auth/`: entry and auth flows.
- `src/services/`: shared browser services such as Supabase, feedback, economy/evidence helpers.
- `data/`: module manifests, content banks, SQL schema/policies/seeds.
- `Assets/`: user-owned source/classroom/generated media. Do not delete, rename, compress, or move unless asked.
- `remotion-est-scenes/`: Remotion video scenes and public video assets.

## Commands

Run from repo root:

- `npm run dev`: static server on port `8000`.
- `npm run check`: lightweight project validation.
- `npm test`: Vitest unit tests.
- `npm run test:e2e`: Playwright browser tests.
- `npm run ci`: check, unit tests, and browser tests.

Use `npm run check` after code, data, asset-reference, HTML, CSS, or JS changes. For visual/frontend changes, also verify the affected page in a browser.

## Testing

Testing is part of done. Run `npm test` for shared logic, state/economy/evidence, scoring, moderation, data transforms, or reusable behavior. Run `npm run test:e2e` for navigation, page loads, student/teacher flows, EST Prep UI, dashboards, auth, or browser interactions. Run `npm run ci` before committing or opening a PR when changes affect user-facing behavior or multiple areas.

When adding features or touching legacy areas, add focused regression coverage where practical. If tests are not added or run, say why and name the remaining risk.

## Editing

- Keep changes scoped and preserve existing patterns.
- Do not revert unrelated user/local changes.
- This is a static app; avoid new dependencies/build steps unless clearly needed.
- Use plain JavaScript compatible with classic browser scripts unless the surrounding code already uses modules.
- Maintain cache-busting query strings for imported CSS/JS; bump them when needed.
- Keep files ASCII unless the file already uses non-ASCII or the content requires it.
- Preserve exact asset paths, casing, and spaces. Check EST asset references carefully.
- Do not add secrets, service-role keys, private credentials, or production-only config. Browser Supabase config must stay public/client-safe.

## EST Prep

EST Prep uses `modules/est-prep/` plus `data/modules/est-prep-rounds/content-stage.json`. Its intended arc is CORE (what to say), TERM (right language), VTCS (what the question wants), BOSS (final response).

When changing EST screens, keep one primary action per screen where possible, make game-state feedback obvious, and ensure overlays/helper panels do not block answer buttons.

## Dashboards And Evidence

Teacher dashboard work should preserve class-level visibility, student evidence and written responses, long-answer comparison, economy/community signals, feedback, and store request review. Prefer incremental consolidation through `src/services/` when extracting shared state, economy, or evidence logic.

## Git

Check status before editing and before finishing. Leave unrelated untracked files alone. Commit only relevant files with clear user-facing/reliability messages. Include issue numbers and closing keywords when completing GitHub issues. Push only when requested or when the workflow clearly calls for it.

Paving stage, 10 September 2026: Tania authorised individual-element upgrades and publication of the improved paving. Consistent world-scale stone, route edges, Studio apron and avenue connection are tested; this is not whole-environment acceptance. Saved full CI: 30 browser tests pass; navigation/save/reload/mobile pass. Next separate candidate: sky and lighting. Blueprint CE-CHANGE-20260910-29 reader integration remains pending.

## Approved school avatar release — 10 September 2026
Tania approved the playable repair and explicitly requested live publication. CE-CHANGE-20260910-35 restores the intact original schoolboy with two forearm twist tracks repaired; original geometry, textures, weights and rig preserved. See docs/production/avatar-polish-20260910.md. Preserve the current live environment and paused wardrobe work.

## Campus map release authorised — 10 September 2026
CE-CHANGE-20260910-36: Tania accepted the landscape direction and explicitly requested two existing building replacements plus live publication. Careers Advice Centre (-19,18) and First Workplace (15,18) replace the two provisional outer buildings; both face north onto connected paths. Town hall retained for future ECC; native Studio retained. Earlier start (-7,23.3) included. Existing planting meshes reused unchanged. Local gameplay/entrance checks and source-bound Blueprint release precede live game verification. Preserve separate gait follow-up and unrelated records.


## ECC integration and missing buildings — 10 September 2026
CE-CHANGE-20260910-38: Tania accepted the separate exterior candidate as OK for now and explicitly authorised live integration, relocation of EST to an existing empty building, and an Original Career Empire sign/link to https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/. Local integration is saved in the existing /private/tmp/ce-avatar-release; no new checkout. Chapel interior concept, approved build and placement follow this campus release separately.

Tania reported both outer buildings missing. Both published GLBs still return HTTP 200; local real-physics route checks confirm Careers Advice Centre and First Workplace remain present and reachable. Startup previously revealed the scene before background scenery completed; local startup now awaits all scenery, loads assets concurrently, and widens the aerial view. This is a plausible partial-loading explanation, not proof of the exact screenshot cause. Six unit tests and the focused campus entrance test pass; full release checks remain pending.

EST target remains a necessary unanswered choice: First Workplace on the right (recommended) or Careers Advice Centre on the left. Do not infer an answer or publish the current interim EST hotspot. New hub and Original Career Empire link are local only; live game remains d85de992. Next: obtain target, relocate and label EST, finish gameplay/visual and Blueprint release checks, then publish the already-authorised combined update. Preserve global refresh checkpoint and existing gait/lighting/hosted timing follow-ups.


## Confirmed EST location — 10 September 2026
Tania confirmed: “Yes first building on right please”. The existing First Workplace at (15,18) becomes EST Prep; Careers Advice Centre remains unchanged. Local navigation now approaches its north-facing doorway at (16,14), with arrival/return at (16,12.5). The old central EST hotspot is removed. Original Career Empire sign and new-tab link join the authorised ECC release. Publication and final validation remain in progress; no further building-choice approval is required.


## Chapel interior and sign repair — 10 September 2026
CE-CHANGE-20260910-39: Tania explicitly authorised a photo-backed quiet Chapel, placement and the sign repair, then selected the A Place to Pause concept as the fidelity target. Existing checkout only. Native interior in playable-3d/chapel.js; actual cross/tree imagery copied unchanged from supplied photos. Preserve the live ECC exterior, both outer buildings, right-hand EST, avatar and existing modules. Runtime/visual validation and publication remain in progress; see docs/production/chapel-reflection-20260910.md. Earlier EST-choice and campus-publication pending notes are superseded by verified 9c593f62. Keep gait/lighting/hosted CI follow-ups separate.

Local close: source checks and six unit tests passed. Full browser suite passed 32/33; the new mobile reflection check used a stale diagnostic sample. Corrected diagnostic waiting and the desktop/mobile Chapel retest both pass (all 33 browser scenarios now checked). Real Rapier checks pass for the paved exterior approach, central/side aisles and return; the direct line through a planter is correctly blocked. Sign panel gap .08125m and support setback .11m verified. Actual screenshots retained in canonical Chapel evidence. Canonical Blueprint tests: 73 passed; TypeScript, focused lint and production build passed. Source-bound reader/game publication remains pending; no global refresh claim.


Final additions: exact EST Lab video plays on the rear wall with pause/restart/mute and automatically pauses on leaving. Desktop/mobile playback and Chapel/arrival regression checks pass. Phone camera fits the complete video. Four entry-path teal cones removed; sign posts remain behind both separated panels. Full set: six unit tests and 35 browser scenarios checked across the main run and focused retests; earlier failed checks/logs retained. Publication remains pending.


## ECC session recovered — 11 September 2026
Original missing game worktree restored in place at f436726; approved revision4 preview restored with exact hashes. Stage 1 is banked, not awaiting approval. Continue separate Stage 2 skyline.html review; camera request is pending. See docs/production/ecc-session-recovery-20260911.md and rolling handoff. Preserve record 41, unrelated steward edits and null global refresh. No new publication.


## SPACE revision 2 — 11 September 2026
Tania requests a more faithful building from SPACE4.jpg, Space 3.jpg and SPACE 4.jpg. Clean ImageGen reference and photo-led exterior now replace only the provisional SPACE in the separate skyline preview. Long hall, repeated tall steel frames, louvres, blue feature wall, wrap canopy, terrace/stairs and glazed foyer are the recognition cues. Foyer connection is interpretive; no surveyed plan exists. Review SPACE close-up before acceptance. Live game, approved Stage 1 and other buildings unchanged. See docs/production/space-revision2-20260911.md.


## SPACE rear-corner correction — revision 3
Tania clarifies that the glazed foyer is beyond the white-door side wall: grey wall, then grey upper cladding with cream/red brick lower wall, then around the rear corner, facing opposite the main hall frontage. This supersedes revision 2’s inferred left-front foyer location. Regenerated a two-view image reference and moved/rotated the actual 3D foyer to the back corner. Added the side-wall material transition and rear court circular paving. New SPACE rear foyer camera complements the front close-up. Generated views remain illustrative; exact dimensions are not surveyed. Approval of the corrected candidate remains pending.


## English and Media / oval — current 11 September 2026
SPACE revision3 is accepted (Tania: Yes good). Current separate skyline preview adds curved glass English and Media, painted north end toward SPACE, shared Aussie-rules oval and exact continued campus grass material/grid for all three stages. New candidate awaits appearance review; bank and pause wider surroundings after this bounded change. Generated mural is a source-derived reconstruction, not an exact scan. See docs/production/media-oval-20260911.md and private evidence/media-oval. Stage 1 source remains untouched; camera and combined release remain pending. No publication or global-refresh success.


## Media/oval revision2 — compact recognisable campus
Tania clarifies representative/recognisable is sufficient; bring SPACE and Media closer to admin, avoid wasted space. Separate mural atlas regions sharpen iconic cues. SPACE west of reception/Chapel, Media southwest with glass toward shared oval and painted end toward SPACE; comparable larger scales. Existing core, accepted SPACE geometry and Stage1 retained. See media-oval-20260911.md revision2 and evidence/media-oval-revision2. Local candidate only; pause wider surrounding work after review.


## Media/oval revision2 approved — 11 September 2026
Tania accepts current candidate (Great! whats nexg). Bank its mural and compact representative layout; pause wider surroundings production. Next bounded production step is the already-requested comfortable whole-body walking camera, then combined environment/gameplay review and regression checks. No publication authorization inferred. Approval with exact source hashes saved under media-oval-revision2/approval.json.


## Walking camera candidate — 11 September 2026
Outdoor full-body camera implemented locally: steady wider view/lower target, no Studio-approach zoom jump; Chapel outdoor return angle corrected. Specialised indoor/Studio cameras retained. Approved environment files stay banked and unchanged. See docs/production/walking-camera-20260911.md. Review camera then combined environment integration/regressions; no publication.


## Walking camera approved — 11 September 2026
Tania: Yes much better. Bank the current outdoor camera and Chapel return with exact app/index hashes in walking-camera/approval.json. Next: combine approved environment and camera for integrated in-game review and regression checks. No publication authorised by this acceptance.


## Combined approved world — 11 September 2026
Approved atmosphere/grass, SPACE/Media/oval and outdoor camera integrated locally. Production modules in playable-3d/environment/ preserve world-preview approval snapshots. Media closed footprint has collision; outer surroundings remain non-enterable beyond the original walkable boundary. Next: combined review and verified release. No publication claimed. See docs/production/combined-world-20260911.md.


## Recovered omitted review steps and Home Base correction
Recovered from Design ECC Campus Hub task 01a08a33-c916-7c40-acea-18b13a26bacd, turn 01a08b3e-3170-7ce2-8cc3-3128f44d9647: campus edges soften abrupt lawn boundaries, materials/planting form a consistent palette with less repetition, and arrival composition strengthens the first ECC welcome/Chapel view with clear paths and less clutter. Later five-pass plan folds arrival composition into every pass. AGENTS stage-lighting notes explicitly defer smooth stage blending to integration. These were not completed by merely integrating static presets. Correction: retain these remaining checks as open before final combined lock/release. Previously accepted assets remain accepted.

Tania additionally corrects Home Base: return to the actual WELCOME TO ECC sign, not Avatar Studio. Home Base now returns to (-3.2,-1.7), south of the welcome sign at (-3.2,-4.6), facing the sign and admin/Chapel. Avatar Studio remains its own button and physical entrance; unsaved-change protection retained. Desktop/phone destination and Studio save-return checks passed.


## Walkable oval and tree edge — 12 September 2026
Tania requests walking on the football field and trees around the oval edge, following the aerial. This supersedes the previous visual-only oval boundary. Outdoor physics ground now matches the existing continued grass rectangle, with an inset walking boundary. The route across connecting grass and oval is open. Existing Media collision is retained; SPACE, its rear foyer, Home Economics, goalposts and new tree trunks have collision. Thirty-three reused eucalypts form a staggered western/southern belt outside the playing line, scaling with the approved development stages. Architecture, orientation, glass/mural assets, indoor limits and banked world-preview sources remain unchanged.

Local desktop and phone browser probes exercise actual movement physics from the original arrival area across connecting grass to the oval centre; west/south bounds, ground height, SPACE frontage and Home Base welcome return pass. Local source checks pass. Test-only probes are not shipped. Screenshots and results: private/production-evidence/2026-09-12/walkable-oval/. Visual reference is the supplied aerial, interpreted compactly rather than surveyed. Wider material/arrival polish and smooth stage transitions remain open. No publication, remote CI or new global-refresh success is claimed.


## Preview connection recovery — 12 September 2026
User reports preview failure. Browser showed ERR_CONNECTION_REFUSED; no process was listening on 127.0.0.1:4269. Restarted the local Python preview from /private/tmp/ce-avatar-release. Saved game checkpoint ef0c0c3 is intact. The stop cause is unknown; no game code changes or publication. Local preview availability depends on the server process remaining active.


Preview follow-up: all review URLs share port 4269. Server PID 84222 remains listening; a fresh in-app reload succeeds. Older error tabs need Reload; restarting the server does not replace their displayed error page. No evidence of lost chat or game files.


## Mobile play area — 12 September 2026
Tania reports the Find your place and other panels crowd the phone play area. Phone and short-landscape layouts now collapse guidance and view/phase settings into 44px buttons, open at most one card, and collapse on scene/movement/destination interaction or Escape. Header/location are smaller; redundant footer labels are hidden on phones; walking buttons are enlarged to 44px; destination bar respects bottom safe-area. The 600px minimum scene height is removed on phones so short displays keep controls on screen. Desktop cards remain expanded. Added mobile-play.css/js; no camera, world assets or gameplay physics changes.

Verified through the in-app browser at 390x844, 320x568 and 844x390: panels and movement/destinations remain inside viewport, guidance toggles, settings replace guidance, Growth selection works, movement closes cards, Home Base returns to the welcome sign. Browser size restored after checks. Source syntax/dev check passes. These are desktop browser viewport checks, not physical iPhone/Android testing. Local candidate only; remaining world polish and publication gates stay open.


## Authorised phone review release — 12 September 2026
Tania explicitly requests publishing this campus/mobile candidate to the live game for phone review. Public main was verified at f436726, an ancestor of candidate da7b9cb. Publish to Emmanuel-ICT-Support/GTCEM-Career-Empire; this acceptance does not complete remaining world polish. Prior manifest retained in docs/pre-mobile-release-manifest.json.


## Touch-and-hold movement fix
Tania reports holding an arrow selects it as an item. Disable WebKit selection, touch callouts and dragging across movement buttons and decorative SVG descendants; route icon pointer events to buttons, suppress native contextmenu/dragstart/selectstart. Existing pointer capture, held movement and release/cancel logic retained. Source checks pass; physical-phone confirmation pending.


## Phone thumb joystick
Tania accepts the proposed joystick. Mobile and short-landscape layouts replace arrows with a 120px captured-pointer joystick, 12% dead zone and proportional speed. Diagonal input is capped at walking speed. Release/cancel/lost capture, blur/visibility, resize, screen/destination and modal entry reset input. Desktop arrows and keyboard remain. Browser phone-size drag verified diagonal travel, centred inactive knob after release and Home Base welcome return. Physical-phone review pending.
