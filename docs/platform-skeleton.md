> **Current planning authority - 9 September 2026:** [Career Empire Living Blueprint](https://taniab1975.github.io/career-empire-blueprint/) owns current priorities, decisions, approvals, delivery status and visual evidence. Read its Start Here and [session protocol](https://taniab1975.github.io/career-empire-blueprint/production/operating-protocol.md) before work; log meaningful outcomes there and update AGENTS.md and affected documentation at task close.
>
> This document's earlier priorities/design narrative are retained as historical context, not new approval. Keep applicable repository setup, testing and safety guidance. [GitHub task reconciliation](https://taniab1975.github.io/career-empire-blueprint/production/github-tracking-audit-2026-09-09.md) explains linked execution tickets; an open issue or old proposal does not establish current implementation or approval. No new game/asset production is authorised by this notice.

# Platform Skeleton

## Immediate Build Goal

Create a reusable platform shell that all modules can plug into.

## Core Areas

### Shared Data

- player profile
- shared stats
- employability skills
- classes and teachers
- module registry
- assets and purchases

### Shared Screens

- login / join class
- student dashboard
- teacher dashboard
- module map
- leaderboard / community / global views
- inventory / lifestyle upgrades

### Shared Systems

- progression engine
- stat updates
- employability skill events
- assessment evidence capture
- teacher analytics

## Suggested Folder Structure

```text
data/
  employability-skills.json
  module-contract.schema.json
  modules/
    megatrends.module.json
    lifelong-learning.module.json

docs/
  year12-careers-ecosystem-blueprint.md
  module-template.md
  platform-skeleton.md

src/
  core/
    player-state.js
    progression-engine.js
    skill-engine.js
    economy-engine.js
  modules/
    megatrends/
    lifelong-learning/
  dashboards/
    student/
    teacher/
  ui/
    components/
```

## First Code Refactor Targets

1. Move shared state out of the current all-in-one page
2. Move module content into structured data files
3. Create a module loader
4. Create a student dashboard shell
5. Create a teacher dashboard shell

## What Megatrends Becomes

Megatrends should become:

- a registered module
- a consumer of shared player stats
- a contributor to employability skills
- a source of teacher-visible assessment evidence

## What Lifelong Learning Becomes

Lifelong Learning should be:

- the second module built against the new contract
- more explicit about reflection, growth mindset, goal-setting, and skill transfer
- designed from day one to report learning evidence and employability skill growth
