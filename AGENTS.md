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
