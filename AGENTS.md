# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This repository contains the Career Empire / Megatrends learning game ecosystem. It is mostly a static browser app with HTML, CSS, JavaScript, JSON data, media assets, Supabase-facing browser helpers, dashboards, and Remotion video scene work.

The project goal is a connected careers and employability game where students make decisions, build a future-life profile, earn salary/community contributions, and create teacher-visible evidence. Avoid drifting toward decorative worksheets; gameplay should include decisions, feedback, consequences, and saved evidence.

## Main Areas

- `index.html`: original Megatrends/platform landing experience and large prototype surface.
- `student/`, `teacher/`, `auth/`: student/teacher entry and auth flows.
- `dashboards/`: student hub, teacher dashboard, leaderboard, community, global index, shared dashboard JS/CSS.
- `modules/est-prep/`: EST Prep module. Current priority area.
- `modules/lifelong-learning/`: Lifelong Learning module.
- `modules/year10-megatrends/`: standalone Year 10 no-login Megatrends Explorer.
- `src/services/`: shared browser services such as Supabase helper, feedback widget, economy ledger.
- `data/`: module manifests, JSON banks, SQL schema/policies/seeds.
- `docs/`: design memory, workflows, module plans, auth/database notes.
- `Assets/`: source documents, videos, generated images, characters, icons, and classroom materials.
- `remotion-est-scenes/`: Remotion video scenes and public video assets.

Read `docs/project-memory.md` before major design or architecture work. Read `docs/local-dev-workflow.md` for the basic local workflow.

## Current Working Priorities

The near-term order is:

1. EST CORE reliability and UX cleanup.
2. Teacher dashboard feature audit and cleanup priorities.
3. Teacher video overhaul: key features, transcript, animations, and screen-play snippets.
4. Shared state, economy, and evidence logic refactor plan.
5. Megatrends and Lifelong Learning are parked for later review.

## Commands

Run from the repository root:

```bash
npm run dev
```

Starts a static server on port `8000`.

```bash
npm run check
```

Runs the lightweight project check. It validates JavaScript syntax, JSON syntax, EST Prep script/style links, CSS imports, and EST Prep asset references.

```bash
npm test
```

Runs Vitest unit tests.

```bash
npm run test:e2e
```

Runs Playwright browser smoke/end-to-end tests.

```bash
npm run ci
```

Runs the full local CI sequence: project check, unit tests, and browser tests.

Use `npm run check` after code or reference changes. For visual/frontend changes, also test the affected page in a browser.

Useful local URLs:

- `http://localhost:8000/`
- `http://localhost:8000/student/index.html`
- `http://localhost:8000/teacher/index.html`
- `http://localhost:8000/dashboards/student.html`
- `http://localhost:8000/dashboards/teacher.html`
- `http://localhost:8000/modules/est-prep/`
- `http://localhost:8000/modules/lifelong-learning/`
- `http://localhost:8000/modules/year10-megatrends/`

## Testing Policy

Testing is part of the definition of done for code changes.

- Run `npm run check` before finishing any code, data, asset-reference, or HTML/CSS/JS change.
- Run `npm test` when changing shared logic, state/economy/evidence code, scoring, moderation, data transforms, or other behavior that can be unit tested.
- Run `npm run test:e2e` when changing navigation, page load behavior, student/teacher flows, EST Prep UI, dashboards, auth screens, or browser interactions.
- Run `npm run ci` before committing or opening a PR when the change affects user-facing behavior or more than one area.

New features must include relevant tests in the same change:

- Add Vitest unit tests for pure logic and reusable services.
- Add Playwright tests for critical browser flows, page loading, navigation, and high-risk UI interactions.
- Prefer small, stable tests around observable behavior rather than brittle implementation details.

Legacy feature areas should gain coverage as they are touched:

- When modifying an older untested area, add at least one focused regression test for the behavior being changed.
- If a bug is fixed, add a test that would have failed before the fix where practical.
- If the code is too tightly coupled to test directly, extract the smallest useful pure helper or add a Playwright smoke/regression test around the user-visible behavior.

Do not skip tests silently. If tests are not added or not run, state why in the final response and describe the remaining risk.

## Editing Guidelines

- Keep changes scoped. This repo often has unrelated local work or generated media.
- Do not revert user changes unless explicitly asked.
- Prefer existing patterns over introducing frameworks or build steps.
- This is a static app; avoid adding dependencies unless there is a clear reason.
- Use plain JavaScript compatible with classic browser scripts unless the surrounding code already uses modules.
- Maintain existing cache-busting query strings when updating imported CSS/JS; bump them when needed to force browser refresh.
- Keep files ASCII unless the file already uses non-ASCII or the content requires it.
- For large prototypes, make the smallest reliability or UX fix that solves the observed issue before refactoring.

## Assets And Media

- Treat `Assets/` as user-owned source material and generated/classroom media.
- Do not delete, rename, compress, or relocate assets unless the task specifically asks for it.
- Paths often contain spaces. Preserve exact casing and spacing.
- When adding references from `modules/est-prep/`, verify relative paths carefully and run `npm run check`.

## Supabase And Secrets

- Be careful with `config/supabase-config.js`.
- Do not add secrets, service role keys, private credentials, or production-only config.
- Browser code must only use safe public/client-side configuration.
- SQL and RLS work belongs under `data/sql/` or `supabase/` and should be reviewed carefully before real classroom use.

## EST Prep Notes

EST Prep is split across:

- `modules/est-prep/index.html`
- `modules/est-prep/est-prep.js`
- `modules/est-prep/est-prep-render.js`
- `modules/est-prep/est-prep-state.js`
- `modules/est-prep/est-prep-content.js`
- `modules/est-prep/est-prep-glossary.js`
- `modules/est-prep/est-prep-boss.js`
- matching CSS files
- `data/modules/est-prep-rounds/content-stage.json`

The intended EST arc is:

1. CORE: what to say.
2. TERM: the right language.
3. VTCS: what the question wants.
4. BOSS: the final response.

When changing EST screens, keep one primary action per screen where possible, keep the game-state feedback obvious, and verify that overlays or helper panels do not block answer buttons.

## Dashboard And Evidence Notes

Teacher dashboard work should preserve:

- class-level visibility
- student evidence and written responses
- long-answer comparison
- economy/community signals
- feedback and store request review surfaces

Shared state/economy/evidence logic is still spread across pages and modules. Prefer incremental consolidation through `src/services/` when extracting reusable logic.

## Git Hygiene

- Check status before editing and before finishing.
- Leave unrelated untracked files alone.
- Commit only the files relevant to the task.
- Use clear commit messages that describe the user-facing or reliability outcome.
- When completing GitHub issues, include the issue number in the commit message and PR title/body so GitHub links the work automatically.
- If the work fully completes an issue, use a GitHub closing keyword in the commit or PR body, for example `Closes #11` or `Fixes #11`.
- Push only when requested or when the workflow clearly calls for it.
