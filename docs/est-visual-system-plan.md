# EST Visual System Plan

## Purpose
This document defines the visual and interaction system for the EST revision module so the experience feels like a game journey rather than a long digital worksheet.

The goal is not to decorate dense screens. The goal is to:
- reduce cognitive load
- create a clearer sense of mission and progression
- improve feedback and emotional payoff
- make each topic feel more playable and memorable
- keep all changes reusable across the EST ecosystem

## Design Rule
One screen should usually equal one action.

That means:
- intro screen
- challenge screen
- feedback screen
- transition screen
- reward/bank screen

It does not mean:
- long scrolling pages with multiple tasks, explanations, and writing prompts stacked together

## Core EST Experience Arc
Every EST strand should feel like this:

1. Mission arrival
2. One focused challenge
3. Immediate feedback
4. Step unlocked / next challenge
5. Final response build
6. Reward + bank + continue

## Visual Design Principles

### 1. Lower information density
- Cut unnecessary text.
- Show one task at a time.
- Use short action-led instructions.

### 2. Strong visual hierarchy
- One dominant action per screen.
- Large answer cards.
- Clear progress at the top.

### 3. Meaningful motion
- Motion should signal:
  - success
  - warning
  - unlock
  - progress
  - transition

### 4. Reusable components over one-off pages
- Build a small set of shared EST components.
- Reuse them across all strands.

### 5. Reward clarity
- Students should always understand:
  - what they just did
  - whether it worked
  - what unlocked next
  - what they earned

## Component Kit

### 1. Scene Frame
Purpose:
- Main wrapper for each EST challenge screen.

Contains:
- mission header
- progress rail
- single challenge area
- fixed bottom action area

Asset type:
- coded component

Tool:
- code in `est-prep.js` / `est-prep.css`

Priority:
- highest

### 2. Mission Header
Purpose:
- Give context without dumping too much text.

Contains:
- strand name
- step name
- short objective
- optional guide character prompt

Asset type:
- coded UI

Tool:
- code

Priority:
- highest

### 3. Progress Rail
Purpose:
- Show where the player is in the topic arc.

Contains:
- 4 step nodes
- active state
- complete state
- locked state

Asset type:
- coded UI

Tool:
- code

Priority:
- highest

### 4. Choice Card
Purpose:
- Make decision-making feel tactile and readable.

States:
- default
- hover
- selected
- correct
- wrong
- disabled

Asset type:
- coded UI

Tool:
- code

Priority:
- highest

### 5. Feedback Banner
Purpose:
- Deliver immediate reaction without slowing pacing too much.

Variants:
- correct
- nearly there
- incorrect
- hint

Asset type:
- coded UI

Tool:
- code

Priority:
- highest

### 6. Transition Card
Purpose:
- Break up steps and create a sense of journey.

Use cases:
- step unlocked
- next chamber loading
- mission update

Asset type:
- coded UI with optional motion graphic

Tool:
- code first, Remotion optional

Priority:
- high

### 7. Celebration Overlay
Purpose:
- Make wins feel noticeable.

Use cases:
- signal restored
- chamber complete
- full strand complete
- salary banked

Asset type:
- coded UI with animation

Tool:
- code, optional Remotion influence

Priority:
- high

### 8. Mission Guide
Purpose:
- A light-touch character or operator to guide the player.

Use cases:
- intro
- hint
- encouragement
- transition

Rules:
- keep lines short
- do not overuse
- do not replace gameplay with exposition

Asset type:
- character art + coded panel

Tool:
- image generation or existing art + code

Priority:
- medium-high

### 9. Response Forge Stepper
Purpose:
- Make writing feel built, not dumped.

Use cases:
- sentence starter 1
- sentence starter 2
- sentence starter 3
- build final paragraph
- coach feedback

Asset type:
- coded UI

Tool:
- code

Priority:
- high

### 10. Reward Bank Card
Purpose:
- Show what was earned and where it goes.

Shows:
- salary
- tax
- readiness
- marks
- next unlock

Asset type:
- coded UI

Tool:
- code

Priority:
- medium-high

## Animation and Feedback Checklist

### Correct answer
- green pulse
- tick pop
- slight card lift
- short positive line

### Wrong answer
- red flash
- soft shake
- one-line correction

### Nearly there
- amber glow
- hint text
- no harsh punishment

### Unlock
- fade/slide reveal
- progress node fills
- optional sound cue later

### Chamber clear
- overlay burst
- progress completion animation
- earnings summary

### Final strand complete
- stronger celebration
- reward bank card
- clear next action

## Asset Production List

### Batch 1: Essential shared assets
1. EST mission guide character
2. Neutral mission background system
3. Progress rail styles
4. Choice card state styles
5. Feedback state styles
6. Chamber-complete celebration style
7. Transition card template

### Batch 2: Topic-specific visual assets
1. Initiative scene art
2. Time Management scene art
3. Personal Finance scene art
4. Cover Letter / STAR scene art
5. Communication scene art
6. Future of Work scene art

### Batch 3: Motion layer
1. Correct answer pulse sequence
2. Wrong answer feedback motion
3. Step unlock transition
4. Final chamber completion animation
5. Reward bank micro-animation

## Tool Guide

### Canva
Use for:
- layout ideation
- quick scene mockups
- composition experiments
- stakeholder-facing previews

Do not rely on Canva for:
- final interactive gameplay logic

### Image generation
Use for:
- guide character art
- topic scene illustrations
- environmental backdrops
- pose variations

### Remotion
Use for:
- topic intro scenes
- short transition animations
- looped mission visuals
- celebration scenes

### Direct code
Use for:
- actual gameplay screens
- button states
- progress rails
- feedback states
- navigation logic
- reward banking states

## Prototype Recommendation

### Best strand for the visual prototype
Initiative

Why:
- clearest behaviour-based arc
- strong scenarios
- easiest to make feel active
- already structurally solid

### Prototype goal
Turn one strand into a fully scene-based, visually paced experience with:
- no long scrolling
- clear transitions
- reusable component styles
- satisfying feedback loops

## EST Strand Review Checklist
Use this before calling a strand complete.

### Flow
- Does it begin with a mission arrival?
- Does each step feel distinct?
- Is scrolling minimal?
- Is the final action obvious?

### Clarity
- Is there only one main task on screen?
- Are instructions short?
- Are choices easy to scan?
- Is the next step obvious?

### Game feel
- Is there immediate feedback?
- Is failure safe?
- Is progression visible?
- Is there at least one satisfying celebration moment?

### Visual design
- Are pages uncluttered?
- Are important elements large enough?
- Is color used consistently for state?
- Is motion meaningful rather than decorative?

### Ecosystem link
- Is the reward bank clear?
- Is the earnings logic visible?
- Does the strand feel connected to the wider Career Empire?

## Proposed Build Order

### Phase 1: System setup
1. Scene Frame
2. Mission Header
3. Progress Rail
4. Choice Card states
5. Feedback Banner states

### Phase 2: Prototype strand
1. Initiative visual redesign
2. Transition screens
3. Celebration overlay
4. Reward bank card

### Phase 3: Shared rollout
1. Time Management
2. Personal Finance
3. Communication
4. Cover Letter / STAR
5. Future of Work

### Phase 4: Motion polish
1. Animated guide moments
2. Remotion scene intros
3. Better reward animations
4. Step unlock motion system

## Immediate Next Step
Build the `Initiative` strand as the visual prototype using:
- scene-based flow
- reduced text
- reusable feedback states
- transition screens
- reward bank clarity

Once Initiative feels genuinely fun, roll the same visual system across the other EST strands.
