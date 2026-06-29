# Career Empire / Megatrends

Career Empire is a browser-based careers and employability learning game ecosystem. Students make choices, build a future-life profile, practise career and EST skills, earn economy/community outcomes, and create teacher-visible evidence.

The app is currently a mostly static HTML/CSS/JavaScript project with JSON data, media assets, Supabase-facing browser helpers, dashboards, and Remotion video scenes.

## Project Shape

- `index.html`: platform landing page and original Megatrends prototype surface.
- `student/`, `teacher/`, `auth/`: student and teacher entry/auth flows.
- `dashboards/`: student hub, teacher dashboard, leaderboard, community, global index, and shared dashboard assets.
- `modules/est-prep/`: EST Prep module. This is the current priority area.
- `modules/lifelong-learning/`: Lifelong Learning module.
- `modules/year10-megatrends/`: standalone Year 10 no-login Megatrends Explorer.
- `src/services/`: shared browser services such as Supabase helper, feedback widget, response moderation, and economy ledger.
- `data/`: module manifests, JSON banks, SQL schema, policies, and seed files.
- `docs/`: design memory, workflows, module plans, testing notes, auth/database notes.
- `Assets/`: classroom source material, generated media, videos, characters, icons, and other large assets.
- `remotion-est-scenes/`: Remotion scenes for EST and Career Empire video assets.

## Current Priorities

1. EST CORE reliability and UX cleanup.
2. Teacher dashboard feature audit and cleanup.
3. Teacher video overhaul using current dashboard features, transcript, animations, and screen-play snippets.
4. Shared state, economy, and evidence logic consolidation.
5. Megatrends and Lifelong Learning polish later.

## Local Setup

Install dependencies:

```bash
npm install
```

Start the static dev server:

```bash
npm run dev
```

The default local server is:

```text
http://localhost:8000/
```

Useful local pages:

- `http://localhost:8000/`
- `http://localhost:8000/student/index.html`
- `http://localhost:8000/teacher/index.html`
- `http://localhost:8000/dashboards/student.html`
- `http://localhost:8000/dashboards/teacher.html`
- `http://localhost:8000/modules/est-prep/`
- `http://localhost:8000/modules/lifelong-learning/`
- `http://localhost:8000/modules/year10-megatrends/`

## Checks And Tests

Run the lightweight project check:

```bash
npm run check
```

This validates JavaScript syntax, JSON syntax, EST Prep links, CSS imports, and EST Prep asset references.

Run unit tests:

```bash
npm test
```

Run unit tests with coverage:

```bash
npm run coverage
```

Run browser smoke/end-to-end tests:

```bash
npm run test:e2e
```

Run the full local CI sequence:

```bash
npm run ci
```

GitHub Actions runs CI on pushes and pull requests to `main`. Coverage reports are uploaded as the `coverage-report` artifact.

## Testing Direction

Testing is part of the definition of done for code changes.

- New features should include relevant Vitest or Playwright tests.
- Legacy areas should gain focused regression coverage when touched.
- Shared state, economy, evidence, scoring, moderation, and dashboard aggregation logic are priority unit-test targets.
- User-facing flows, navigation, EST Prep screens, dashboards, and auth paths are priority Playwright targets.

See `docs/testing-priority-coverage.md` for the first coverage pass and next suggested targets.

## Supabase And Security

This repo includes browser-facing Supabase integration. Browser publishable/anon keys are not private secrets, but they must only be used with safe RLS policies and table grants.

Important files:

- `config/supabase-config.example.js`: placeholder config.
- `config/supabase-config.js`: current browser config. Do not add service-role keys or private credentials here.
- `data/sql/schema.sql`: schema and baseline grants.
- `data/sql/rls-policies-prototype.sql`: permissive prototype policies.
- `data/sql/rls-policies-school-privacy.sql`: hardened school/privacy policies.
- `supabase/README.md`: setup notes and RLS warnings.

Before using live student data, confirm the Supabase project is using hardened policies and that anonymous access cannot read or modify sensitive classroom/student records beyond the intended browser flows.

## Documentation

- `AGENTS.md`: working guidance for AI coding agents.
- `docs/project-memory.md`: design/project memory. Read this before major design or architecture work.
- `docs/local-dev-workflow.md`: local workflow notes.
- `docs/testing-priority-coverage.md`: current unit coverage priorities and coverage reporting notes.
- `supabase/README.md`: Supabase setup and security notes.
- `remotion-est-scenes/README.md`: Remotion scene and render notes.
- `Assets/employability-logos/README.md`: employability logo asset notes.

## Asset Handling

Treat `Assets/` as user-owned classroom/source media.

- Do not delete, rename, compress, or relocate assets unless explicitly asked.
- Preserve exact filename casing and spacing. GitHub Actions runs on Linux, so asset references are case-sensitive.
- After changing EST Prep asset references, run `npm run check`.

## Git Workflow

- `main` is the live primary branch.
- Keep changes scoped and commit only files relevant to the task.
- Leave unrelated untracked local files alone.
- Include GitHub issue numbers in commits or PRs when completing issue work.
- Use closing keywords such as `Closes #17` when the work fully completes an issue.
