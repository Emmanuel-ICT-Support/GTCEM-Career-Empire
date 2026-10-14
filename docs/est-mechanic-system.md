# EST Mechanic System

## Purpose

This document turns the EST topic map into a reusable mechanic system for the GitHub-built module.

Instead of designing each topic as a one-off activity, the EST module should reuse a small set of mechanic families with a shared content shape and UI language.

This keeps the build:
- visually rich
- easier to code
- easier to extend
- more consistent for students
- faster to populate with new EST content

## Core Principle

The EST module should separate:
- `what the student is learning`
- `how the interaction works`
- `what content is loaded into that interaction`

That means:
- topics are content
- mechanics are delivery
- stage/bay structure is progression

## Recommended Reusable Mechanics

### 1. `quiz`

Use for:
- direct recall
- glossary definitions
- command verbs
- content checkpoints

Best for:
- fast checks
- low-friction revision
- visible score and streak systems

Student action:
- read prompt
- choose best answer
- receive instant explanation

Why this stays:
- already present in the EST and Canva-style prototypes
- simplest mechanic to reuse across many topics

### 2. `flashcards`

Use for:
- glossary lock-in
- command verbs
- STAR steps
- key concept revision

Best for:
- retrieval practice
- self-paced review
- confidence tracking

Student action:
- flip card
- self-assess confidence
- revisit unknown items

Why this stays:
- strong support mechanic before harder tasks

### 3. `sort`

Use for:
- initiative vs weak initiative
- effective vs weak communication
- essential vs non-essential spending
- strong vs weak planning
- growth vs non-growth examples

Best for:
- classification
- pattern recognition
- misconception correction

Student action:
- drag or tap cards into buckets
- get per-card feedback
- complete the board

Why this stays:
- visually strong
- easy to theme by topic
- already fits existing EST content bays

### 4. `scenario`

Use for:
- initiative
- finance
- time management
- communication
- life events

Best for:
- workplace judgement
- applied decision making
- consequence-based learning

Student action:
- read a realistic situation
- choose the strongest next move
- review why it earns marks

Why this stays:
- many EST topics are best assessed through situational judgement rather than plain definition recall

### 5. `detective`

Use for:
- spotting workplace problems
- identifying missed initiative
- finding communication mistakes
- selecting useful labour market evidence
- identifying missing answer elements

Best for:
- noticing
- diagnosis
- evidence evaluation

Student action:
- inspect a scene, answer, dataset, or workplace snapshot
- find the issue or strongest evidence
- justify or classify what was found

Why this stays:
- high visual potential
- makes students actively scan for what matters

### 6. `builder`

Use for:
- STAR
- selection criteria
- command verb structures
- short-answer response construction
- cover letter structure

Best for:
- sequencing
- assembling answers
- teaching what a mark-worthy response looks like

Student action:
- drag blocks into order
- fill missing answer steps
- build strongest response skeleton

Why this stays:
- essential for EST performance because students must construct responses, not just recognise answers

### 7. `compare`

Use for:
- weak vs strong cover letters
- weak vs strong short answers
- two selection criteria responses
- two uses of evidence

Best for:
- judgement of quality
- examiner-style thinking
- identifying what earns more marks

Student action:
- compare two or more options
- choose which is stronger
- explain or inspect the reason

Why this stays:
- directly supports marking-key thinking

## Recommended Priority Order

If we want fast progress, build in this order:

1. `quiz`
2. `sort`
3. `scenario`
4. `builder`
5. `compare`
6. `flashcards`
7. `detective`

This order gives us broad EST coverage early without needing the most complex UI first.

## Topic To Mechanic Pairing

| Topic cluster | Primary mechanic | Secondary mechanic |
| --- | --- | --- |
| Command verbs | quiz | builder |
| Glossary | flashcards | quiz |
| Initiative | scenario | detective |
| Communication | scenario | sort |
| Non-verbal communication | detective | compare |
| Time management | sort | scenario |
| Personal finance | scenario | sort |
| Unexpected life events | scenario | compare |
| Labour market information | detective | quiz |
| Growth, emerging, green industries | sort | detective |
| Megatrends and future of work | scenario | sort |
| Cover letters | compare | builder |
| Selection criteria | builder | compare |
| STAR | builder | quiz |
| Short-answer EST structure | builder | compare |

## Shared UX Rules Across Mechanics

Every EST mechanic should follow the same broad structure:

1. Brief mission framing
2. One clear question or challenge at a time
3. Immediate feedback
4. Short explanation linked to EST logic
5. Visible marks/readiness/confidence gain
6. Teacher-visible evidence where appropriate

## Shared Feedback Pattern

Each mechanic should provide:
- whether the answer was correct or strongest
- why
- what this means for EST success
- what the student should remember next time

Short feedback format:
- `result`
- `reason`
- `est tip`

Example:
- Result: Correct
- Reason: This response shows initiative because the worker acted early without waiting to be told.
- EST tip: In a short answer, mention both the action and why it improves the workplace.

## Shared Reward Pattern

Every mechanic should award some combination of:
- marks
- module xp
- readiness
- confidence
- salary or shared-economy bonuses

Suggested weighting:
- `quiz`: low reward, high frequency
- `sort`: medium reward
- `scenario`: medium reward
- `builder`: high reward
- `compare`: medium-high reward
- `detective`: high reward
- `flashcards`: low reward, strong study value

## Evidence Expectations

Not every mechanic needs typed writing, but each should create something visible or trackable.

Examples:
- `quiz`: answer accuracy and misconception log
- `flashcards`: known vs still learning data
- `sort`: category accuracy and repeat errors
- `scenario`: decision accuracy by topic
- `detective`: issue-spotting accuracy
- `builder`: assembled answer artifact
- `compare`: quality judgement accuracy

## Practical UI Reuse

The mechanic family should drive component reuse in the EST codebase.

Suggested future component pattern:
- `renderQuizRound(round)`
- `renderSortRound(round)`
- `renderScenarioRound(round)`
- `renderBuilderRound(round)`
- `renderCompareRound(round)`
- `renderDetectiveRound(round)`
- `renderFlashcardRound(round)`

This will scale better than topic-specific rendering code.

## Suggested EST Build Phases

### Phase 1

Ship a stable reusable set for:
- quiz
- sort
- scenario

Topics covered first:
- initiative
- communication
- time management
- personal finance
- command verbs

### Phase 2

Add:
- builder
- compare

Topics covered:
- cover letters
- selection criteria
- STAR
- short-answer structure

### Phase 3

Add:
- detective
- upgraded flashcards

Topics covered:
- labour market information
- industries
- megatrends
- non-verbal communication
- answer diagnostics

## Recommendation For The Current EST Prototype

The current prototype in [est-prep.js](/Users/tania.byrnes/Desktop/Megatrends/modules/est-prep/est-prep.js) already points in the right direction:
- topic groups exist
- training bays exist
- glossary rounds exist

The next implementation step should be to refactor content into mechanic-shaped data rather than embedding topic logic directly into bespoke structures.

That will make it much easier to:
- add more EST topics
- keep the visuals strong
- maintain consistency
- reuse the same mechanics across other modules later
