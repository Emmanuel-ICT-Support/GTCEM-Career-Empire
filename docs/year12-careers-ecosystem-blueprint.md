# Year 12 Careers And Employability Game Ecosystem Blueprint

## Purpose

This document defines the long-term structure for a full Year 12 Careers and Employability gaming ecosystem.

The goal is not to build unrelated mini-games. The goal is to build one connected career-simulation platform where:

- each curriculum module becomes a playable learning experience
- each module contributes to a shared student profile
- each student affects class, community, and global outcomes
- teachers can monitor both engagement and learning evidence
- employability skills are explicitly taught, practiced, and tracked

Megatrends is the first working module. It should now become Module 1 inside a larger system.

## Design Vision

The experience should feel like a hybrid of:

- life simulation
- strategy/progression game
- curriculum-aligned learning platform
- classroom competition and collaboration system

Students are building a future life over time, not just completing isolated lessons.

They should feel that every action affects:

- their personal career
- their finances and lifestyle
- their employability skills
- their class standing
- their contribution to the wider community and global index

## Core Game Loop

Every module should follow the same high-level loop:

1. Enter a module with a clear curriculum challenge
2. Make decisions, complete tasks, and play short game activities
3. Produce evidence of learning, not just game interaction
4. Earn gains or losses in shared life stats
5. Gain progress in module mastery
6. Gain progress in employability skills
7. Contribute tax, points, or influence to class and global systems
8. Unlock further choices, assets, or progression

## Platform Structure

The system should be split into two layers.

### 1. Core Platform

This is shared across the whole curriculum.

It includes:

- player identity and login
- shared life stats
- employability skill tracking
- class membership
- teacher controls
- student inventory and assets
- leaderboards
- class community systems
- global school comparison systems
- save/load and progress history

### 2. Curriculum Modules

Each module plugs into the core platform.

Examples:

- Megatrends
- Lifelong Learning
- Work environments
- Employment types
- Career planning
- Financial capability
- Job applications and interviews
- Workplace communication
- Teamwork and collaboration
- Problem-solving and decision-making

Each module should contain:

- curriculum outcomes
- game activities
- decision points
- knowledge checks
- evidence tasks
- skill events
- rewards and penalties linked to shared stats

## Shared Student Stats

These should exist across all modules.

### Personal Progress Stats

- Career level
- Career success
- Salary
- Net worth
- Savings
- Tax contributed
- Employability score
- Overall curriculum mastery

### Lifestyle And Wellbeing Stats

- Work-life balance
- Health and wellbeing
- Social/family status
- Reputation
- Resilience

### Learning Stats

- Module completion percentage
- Module mastery
- Assessment evidence submitted
- Reflection quality
- Quiz performance
- Participation consistency

### Competitive/Collaborative Stats

- Class contribution
- Community impact score
- Global index contribution
- Leaderboard ranking

## Employability Skills Framework

The employability skills should be a formal progression system, not a decorative badge system.

Based on the source document, the top-level categories are:

- Communication
- Digital Literacy
- Teamwork
- Time Management
- Critical Thinking
- Problem-Solving

### Communication

Sub-skills:

- Terminology, spelling, and grammar
- Purpose, audience, and format
- Non-verbal communication
- Active listening

### Digital Literacy

Sub-skills:

- Reliable online research
- Online safety
- Electronic communication
- Work-related software

### Teamwork

Sub-skills:

- Build rapport
- Perform team roles
- Reliability and task completion
- Reach consensus

### Time Management

Sub-skills:

- Plan and prioritise
- Use productivity tools
- Track progress and adapt

### Critical Thinking

Sub-skills:

- Research and gather reliable information
- Analyse and evaluate information
- Reflect on bias

### Problem-Solving

Sub-skills:

- Questioning techniques
- Generate solutions
- Apply decision-making models

## How Employability Skills Should Work In Game

Each meaningful activity should trigger one or more employability skill events.

Examples:

- typed reflection response -> Communication
- selecting trustworthy evidence -> Digital Literacy
- completing a collaborative scenario -> Teamwork
- finishing a timed planner challenge -> Time Management
- comparing options in a branching decision -> Critical Thinking
- resolving a workplace issue simulation -> Problem-Solving

Skill growth should happen at two levels:

- category level
- sub-skill level

Example:

- `Communication +3`
- `Communication > Purpose, audience, and format +5`

This allows teachers to see both broad capability and specific weaknesses.

## Module Design Standard

Every module should use a consistent instructional pattern.

### Recommended Module Flow

1. Introduction hook
2. Scenario or narrative problem
3. Decision or game interaction
4. Explicit teaching moment
5. Check for understanding
6. Applied task or reflection
7. Reward and progression update
8. Contribution to shared systems

### Required Learning Evidence

Every module should contain at least one item that proves learning.

Possible evidence types:

- typed explanation
- short-answer reflection
- multiple-choice knowledge check
- drag-and-drop classification
- prioritisation activity
- decision justification
- teacher-visible response log

The important principle is:

students must demonstrate understanding, not merely click through a game.

## Current Module Assessment

Megatrends already contains useful foundations:

- scenarios
- concept quiz
- typed lock-in sentence
- mini-game reward loop
- shared stats like salary, net worth, job security, work-life balance, and mastery

This is a strong prototype.

However, it should be refactored so that:

- content is separated from engine logic
- shared stats are managed centrally
- module outcomes are reusable
- teacher reporting becomes consistent across all modules

## Teacher Dashboard Requirements

The teacher dashboard should be a serious teaching tool, not just an admin screen.

### Class Setup

- Create class
- Generate class code
- Add or approve students
- Assign modules
- Turn modules on/off

### Progress Monitoring

- View completion by student
- View completion by module
- View class averages
- View employability skill growth
- View assessment evidence
- View weak curriculum areas

### Diagnostic Support

The system should identify:

- which students are disengaged
- which students are stuck
- which employability skills are underdeveloped
- which concepts the whole class is missing

### Teaching Suggestions

The dashboard should eventually surface prompts such as:

- reteach Critical Thinking for this class
- assign the Lifelong Learning module to students below 40 percent
- prompt Student A to revisit reflective writing
- provide extension work for students who have mastered the module

## Student Dashboard Requirements

The student dashboard should feel like a game profile and a learning profile at the same time.

### Student Dashboard Sections

- Profile overview
- Shared life stats
- Current salary, assets, and lifestyle
- Module map and completion status
- Employability skills progress
- Achievements and badges
- Class leaderboard
- Community contribution
- Global index
- Inventory and purchases

### Student Economy

Students should be able to spend earned currency on cosmetic and progression items.

Examples:

- cars
- furniture
- houses
- room upgrades
- status items
- optional productivity tools

These items can be:

- cosmetic only
- cosmetic plus small gameplay modifiers

Examples of safe modifiers:

- study desk gives small reflection bonus
- planner app gives small time-management bonus
- ergonomic chair gives small wellbeing bonus

Avoid making purchases so powerful that they distort learning.

## Community, Class, And Global Systems

The ecosystem should include three layers of competition/collaboration.

### 1. Personal Layer

Students manage:

- life stats
- income
- assets
- module mastery
- employability skills

### 2. Class Layer

Students contribute to:

- class leaderboard
- community tax fund
- class projects or votes
- class readiness index

### 3. Global Layer

Classes or schools contribute to:

- cross-school leaderboards
- global readiness index
- module championships
- employability skill comparisons

This gives the platform a larger sense of purpose and scale.

## Data Model Proposal

This is the minimum long-term data model.

### Player

- id
- name
- email or username
- class_id
- school_id
- avatar
- created_at

### PlayerStats

- player_id
- career_level
- salary
- net_worth
- savings
- tax_paid
- work_life_balance
- wellbeing
- social_status
- reputation
- resilience
- career_success

### Module

- id
- title
- curriculum_area
- description
- status
- order

### ModuleProgress

- player_id
- module_id
- completion_percent
- mastery_percent
- attempts
- unlocked
- completed
- last_played_at

### EmployabilitySkill

- id
- category
- subskill
- description
- icon

### PlayerSkillProgress

- player_id
- skill_id
- xp
- level
- evidence_count
- last_updated_at

### AssessmentEvidence

- id
- player_id
- module_id
- task_type
- prompt
- response
- score
- teacher_feedback
- created_at

### Class

- id
- school_id
- teacher_id
- class_name
- class_code

### Teacher

- id
- name
- school_id
- login_identifier

### School

- id
- name
- region

### Asset

- id
- name
- category
- cost
- effect_type
- effect_value

### PlayerAsset

- player_id
- asset_id
- purchased_at

## Technical Direction

The current prototype has too much logic inside single files. The next build should move toward a modular structure.

### Recommended App Areas

- `core/`
  Shared stats, progression rules, skill tracking, economy, saving
- `modules/`
  Each curriculum module in its own folder
- `dashboards/`
  Teacher and student interfaces
- `data/`
  Content definitions, skill definitions, module content
- `ui/`
  Shared components

### Recommended Immediate Refactor

- pull module content out of `index.html`
- separate shared player state from Megatrends-specific state
- define module config objects
- define employability skill config objects
- define dashboard pages as separate screens

## Build Phases

### Phase 1. Foundation

- Define shared data model
- Define shared stat system
- Define employability skills system
- Define module contract
- Refactor Megatrends into Module 1

### Phase 2. Dashboard Shell

- Student dashboard
- Teacher dashboard
- Class creation and student assignment
- Module visibility toggles

### Phase 3. Lifelong Learning Module

- Build as Module 2 using the new system
- Track employability skills explicitly
- Add teacher-visible evidence

### Phase 4. Economy And Assets

- Purchasable items
- Lifestyle upgrades
- Cosmetic progression

### Phase 5. Cross-Class And Cross-School Play

- Global index
- School comparison
- Shared competitions and events

### Phase 6. Teacher Intelligence Layer

- weakness detection
- intervention suggestions
- targeted module recommendations

## Non-Negotiable Principles

These should guide every future build decision.

### 1. Learning Must Be Visible

A student should not be able to progress only through random clicking or arcade performance.

### 2. Game Rewards Must Reinforce Curriculum

The reward system should strengthen learning behaviours, not distract from them.

### 3. Shared Stats Must Matter

Every module should contribute to the same larger student story.

### 4. Teacher Time Must Be Respected

Teacher tools should reduce workload, not create more admin.

### 5. The System Must Be Expandable

Adding a new module should not require rewriting the whole platform.

## Recommended Next Deliverables

The next three artifacts should be:

1. Product map
   A one-page visual map of the whole ecosystem

2. Data schema
   A formal schema for players, classes, modules, skills, and evidence

3. Module contract
   A template that every new module must follow

## Immediate Recommendation

The smartest next step is:

build the platform skeleton before building another major game.

That means we should next create:

- a shared game architecture
- a module definition format
- an employability skills data file
- a simple student dashboard shell
- a simple teacher dashboard shell

Once that exists, Lifelong Learning can be built properly as Module 2.

## Working Conclusion

You do not need to throw Megatrends away.

You need to promote it from "a standalone game" into "the first module in a connected curriculum platform."

That gives you:

- consistency
- scalability
- better assessment
- better teacher oversight
- clearer curriculum alignment
- a stronger long-term product
