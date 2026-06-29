# Career Empire Project Memory

Last updated: 2026-05-06

## Purpose

This document is the quick memory layer for the Career Empire / Megatrends workspace. Read it before major edits so the next change fits the larger project rather than treating each page as an isolated prototype.

## Current North Star

Career Empire is becoming a connected Careers and Employability game ecosystem:

- students build a future life and career over time
- each curriculum module is a playable learning experience
- module actions affect shared stats such as salary, net worth, job security, work-life balance, savings, tax, mastery, and employability skills
- student work creates teacher-visible evidence, not just game scores
- classes contribute to community funds, leaderboards, and global comparison views

The core design risk is drifting back into "digital worksheet with decoration." Each module should create decisions, trade-offs, feedback, consequences, and saved evidence.

Visual priority:

- This is a visual game, so logos, stills, character art, and generated images should carry real weight wherever possible.
- Keep asset ratios/focus intentional: make visual assets prominent without overwhelming the UI, avoid tiny icons floating in large empty boxes, and scale text/imagery together so panels feel like game surfaces rather than worksheets.

## Main Areas Of The Repo

- `index.html`: original Megatrends game and platform landing experience. It contains major gameplay, save/sync, mini-game, dashboard-linking, and Supabase logic in one large file.
- `auth/`: teacher signup/login, class creation, student creation, student login, password reset, and student management screens.
- `dashboards/`: student hub, teacher dashboard, leaderboard, community page, global index, and shared dashboard rendering logic.
- `modules/est-prep/`: live prototype for EST Prep: Decode, Recall, Respond.
- `modules/lifelong-learning/`: Lifelong Learning module implementation/prototype.
- `modules/year10-megatrends/`: simpler no-login Year 10 Megatrends Explorer with arcade rounds, automation checker, and PDF output.
- `src/services/`: shared browser services for Supabase access, feedback reports, and the economy ledger.
- `data/`: module manifests, employability skill data, job automation data, schema SQL, seed SQL, and RLS policies.
- `docs/`: design specs, module plans, database/auth plans, economy standard, and EST/Lifelong Learning design packs.
- `remotion-est-scenes/`: Remotion scene work for EST videos/visual assets.
- `Assets/`: curriculum docs, generated images, characters, videos, icons, and source materials.

## Major Active Projects

### 1. Core Platform

Goal:

- create a reusable platform shell that all modules plug into
- keep identity, shared stats, module progress, employability skills, evidence, class membership, leaderboards, and community/global systems consistent

Important docs:

- `docs/year12-careers-ecosystem-blueprint.md`
- `docs/platform-skeleton.md`
- `docs/module-template.md`
- `docs/economy-ledger-standard.md`

Current state:

- shared dashboard pages exist
- Supabase browser helper exists
- economy ledger exists
- feedback widget exists
- module manifests exist for Megatrends, Lifelong Learning, and EST Prep

Main issues:

- shared state logic is still spread across pages and modules
- `index.html`, `dashboards/dashboard.js`, `modules/lifelong-learning/lifelong-learning.js`, and `modules/est-prep/est-prep.js` each contain their own stat/progress logic
- the platform still needs a clear module loader and shared progression/skill/economy engines

### 2. Auth, Schools, Classes, And Permissions

Goal:

- teacher accounts use approved school domains
- teachers create classes and student accounts
- students log in with teacher-issued usernames, not email addresses
- teachers can only manage their own classes/students
- students only access their own progress

Important docs:

- `docs/auth-schema-and-flows.md`
- `docs/auth-and-user-management.md`
- `docs/database-schema.md`
- `docs/permissions-map.md`
- `data/sql/schema.sql`
- `data/sql/rls-policies-prototype.sql`
- `data/sql/rls-policies-schools.sql`

Current state:

- auth screens are present
- schema draft includes schools, teachers, classes, students, modules, module progress, evidence, player profiles, assets, community votes, and feedback reports
- dashboards query Supabase when available and fall back to local/demo data where needed

Main issues:

- security is still prototype-grade and needs production hardening
- RLS policies need careful review before real student/classroom use
- demo/local fallback behaviour and live Supabase behaviour need clearer separation
- `config/supabase-config.js` should be handled carefully so secrets are not accidentally exposed

### 3. Megatrends Module

Goal:

- keep Megatrends as Module 1: future-of-work scenario play that teaches Impactful Technology, Climate Change, Demographic Shifts, and Economic Power Shifts
- connect scenario choices, concept lock-in, arcade breaks, community votes, and mastery gains to the shared student profile

Important files:

- `index.html`
- `data/modules/megatrends.module.json`
- `docs/year12-careers-ecosystem-blueprint.md`

Current state:

- playable prototype exists
- concept lock-in and mini-games exist
- Supabase progress/evidence/profile syncing exists
- community vote and class/global systems are represented

Main issues:

- `index.html` is very large and should be decomposed
- mini-game scoring/rewards may need balancing
- gameplay refinements should preserve learning evidence while making the arcade/reward loop feel cleaner
- Megatrends should eventually become a registered module instead of living mostly in the root page

### 4. Lifelong Learning Module

Goal:

- make Lifelong Learning feel like a career-learning simulator, not question-answer-reflection-submit
- students manage time, money, energy, and momentum while responding to barriers, training choices, roadblocks, and pathway decisions

Important docs/files:

- `docs/lifelong-learning-gameplay-redesign.md`
- `docs/lifelong-learning-design-pack.md`
- `docs/lifelong-learning-game-concept.md`
- `data/modules/lifelong-learning.module.json`
- `modules/lifelong-learning/`

Current state:

- module manifest is detailed and design-ready
- prototype implementation exists
- module already considers Supabase progress/evidence and economy events

Main issues:

- the strongest design direction is a five-chapter campaign with resource pressure and delayed payoff
- the implementation should prioritise trade-offs, unlocks, recovery from setbacks, and teacher-visible justifications
- avoid letting the module become a static reflection workflow

### 5. EST Prep Module

Goal:

- turn EST revision into an exam-training simulator with a coherent four-lab arc
- students stabilise content, sharpen glossary language, decode VTCS question parts, and perform in a Boss Round

Important docs/files:

- `docs/est-game-arc-rubric.md`
- `docs/est-visual-system-plan.md`
- `docs/est-prep-design-pack.md`
- `docs/est-mechanic-system.md`
- `docs/est-topic-game-map.md`
- `docs/vault-bridge-workflow.md`
- `data/modules/est-prep.module.json`
- `modules/est-prep/`

Current state:

- live prototype exists
- module has content check, glossary, decoder, and boss round mechanics
- Remotion EST scene work exists separately
- guide characters and visual assets are being assembled
- Vault Bridge is the approved visual/gameplay direction for the Glossary Check playtest

Main issues:

- `modules/est-prep/est-prep.js` is very large
- the visual system says one screen should usually equal one action, but dense multi-step screens can creep back in
- every lab should justify its place in the larger arc: Knowledge Reactor -> Glossary Check -> VTCS Decoder -> Boss Round -> rewards
- use the game-or-worksheet rubric before adding more EST tasks
- next Vault Bridge iteration should use 15 path pieces, five sets of three options, correct-piece lock-in, wrong-piece drop-away, and reset to the entrance after a wrong answer

### 6. Year 10 Megatrends Explorer

Goal:

- provide a simpler, no-login Megatrends experience for Year 10 students
- teach the four megatrends in accessible language
- include quick arcade play, automation risk checking, and a downloadable PDF

Important files:

- `modules/year10-megatrends/index.html`
- `modules/year10-megatrends/year10-megatrends.js`
- `modules/year10-megatrends/year10-megatrends.css`
- `data/automation-risk-jobs.json`

Current state:

- standalone module exists
- includes scenarios, writing, arcade game variants, job automation lookup, and PDF generation

Main issues:

- it is intentionally no-login, so it does not yet feed the shared platform profile
- PDF generation depends on the jsPDF CDN
- if this becomes classroom-critical, add offline/dependency fallback thinking

### 7. Dashboards, Evidence, And Feedback

Goal:

- make teacher and student dashboards the visible payoff layer for gameplay
- teachers should see completion, mastery, evidence quality, weak skill areas, class progress, and suggested interventions
- students should see career profile growth, module progress, community impact, and skill development

Important docs/files:

- `docs/feedback-system.md`
- `dashboards/dashboard.js`
- `dashboards/student.html`
- `dashboards/teacher.html`
- `src/services/feedback-widget.js`

Current state:

- dashboards are built and read from Supabase where possible
- feedback widget records page path, actor role, login name, type, message, and timestamp with local fallback

Main issues:

- dashboard calculations mix live data, local/session data, and seeded/demo data
- teacher dashboard needs clearer action loops, not only diagnostics
- feedback reports need a practical review/inbox workflow

## Cross-Cutting Standards

### Economy

Use `window.CareerEmpireEconomy.appendEvent({...})` for earning, spending, tax, savings, and progress events.

Required fields:

- `moduleId`
- `eventType`
- `checkpoint`
- `label`

Important rule:

- do not invent dashboard totals from net worth when saved fields such as savings or tax exist

### Evidence

Assessment evidence should be stored separately from raw game progress. Teacher-visible learning artefacts include:

- typed concept statements
- written explanations
- reflections
- scenario justifications
- EST responses
- quiz/check outcomes where useful

### Employability Skills

The formal skill categories are:

- Communication
- Digital Literacy
- Teamwork
- Time Management
- Critical Thinking
- Problem-Solving

Skill growth should connect to actual activity type, not decorative badges.

### Module Design

Every module should answer:

- What is the student fantasy?
- What decisions does the student make?
- What trade-offs or pressures matter?
- What feedback is immediate?
- What is saved as evidence?
- What stats or skill XP change?
- How does this affect the wider class/community/global system?

## Known Repo And Project Risks

- Current git state includes many existing deleted and untracked asset/document changes. Treat these as user-owned unless explicitly told otherwise.
- Large monolithic files make regression risk high:
  - `index.html`
  - `modules/est-prep/est-prep.js`
  - `dashboards/dashboard.js`
  - `auth/auth.js`
- Asset paths include spaces and some typo-prone names. Be careful with links and case-sensitive references.
- Supabase, localStorage, and demo fallback logic overlap. Check both logged-in and demo flows after changes.
- RLS and auth should be reviewed before any real production/classroom deployment.
- Several screens use CDN dependencies. Decide whether offline classroom use matters before relying on them further.
- Game feel and learning evidence need to stay balanced. More interactivity is useful only if it still teaches and records something meaningful.

## Recommended Near-Term Priorities

1. Stabilise the asset/document repo state so future diffs are easier to review.
2. Extract shared player/session/economy/progress logic into reusable services.
3. Move Megatrends toward the module contract instead of keeping it mostly inside `index.html`.
4. Refine Megatrends mini-game flow and reward balancing.
5. Build Lifelong Learning around the resource loop: money, time, energy, momentum.
6. Continue EST Prep visual/gameplay polish using the one-action-per-screen rule.
7. Tighten dashboard data contracts so student, teacher, leaderboard, community, and global views agree.
8. Harden auth and RLS policies before live classroom data is trusted.
9. Add lightweight browser smoke tests for the main student, teacher, and module flows.
10. Create a feedback review workflow so reports from the widget turn into an actionable backlog.

## Operating Rules For Future Work

- Check `git status --short` before edits and preserve unrelated user changes.
- Prefer `rg` for finding code and content.
- Use module manifests in `data/modules/` as the design contract for module work.
- Keep gameplay edits connected to saved evidence, shared stats, and employability skill growth.
- When editing UI, verify the actual browser experience if the change affects layout or interaction.
- Before adding new mechanics, check whether an existing shared service or pattern should own the behaviour.
- When uncertain, preserve the project fantasy: students are building a future career, not completing disconnected worksheets.
