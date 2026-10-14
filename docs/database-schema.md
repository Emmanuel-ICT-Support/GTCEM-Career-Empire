# Database Schema

## Purpose

This document defines the implementation-ready database structure for the Career Empire platform.

It is designed to support:

- teacher authentication
- teacher-owned classes
- teacher-created student accounts
- module assignment
- module progress
- employability skill tracking
- dashboards
- assessment evidence
- class and global analytics

## Design Principles

- teacher and student roles must remain clearly separated
- student email addresses are not stored
- every student belongs to a school and class
- classes belong to teachers
- module progress and skill growth must be queryable for dashboards
- evidence of learning must be stored separately from raw game progress

## Table Overview

The first implementation should include these tables:

- `schools`
- `teachers`
- `classes`
- `students`
- `modules`
- `class_modules`
- `student_module_progress`
- `employability_skills`
- `student_skill_progress`
- `assessment_evidence`
- `player_profiles`
- `player_assets`
- `community_votes`
- `feedback_reports`

## 1. schools

Purpose:

- stores school identity and allows grouping of teachers, classes, and students

Suggested fields:

```sql
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  region text,
  created_at timestamptz not null default now()
);
```

## 2. teachers

Purpose:

- stores teacher accounts linked to approved school email domains

Suggested fields:

```sql
create table teachers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  email_domain text not null,
  password_hash text not null,
  school_id uuid not null references schools(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
```

Validation rule:

- `email_domain` must be one of:
  - `cewa.edu.au`
  - any domain ending in `.wa.edu.au`

## 3. classes

Purpose:

- stores teacher-owned classes

Suggested fields:

```sql
create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id),
  school_id uuid not null references schools(id),
  name text not null,
  year_level text,
  class_code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
```

## 4. students

Purpose:

- stores teacher-created student login identities

Important:

- no student email field

Suggested fields:

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  username text not null unique,
  password_hash text not null,
  school_id uuid not null references schools(id),
  class_id uuid not null references classes(id),
  created_by_teacher_id uuid not null references teachers(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
```

Validation rule:

- username should match the agreed classroom-safe pattern

Recommended pattern:

```text
[A-Za-z]{1,10}[0-9]{1,6}
```

## 5. modules

Purpose:

- stores platform modules such as Megatrends and Lifelong Learning

Suggested fields:

```sql
create table modules (
  id text primary key,
  title text not null,
  curriculum_area text not null,
  theme text,
  status text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

Example ids:

- `megatrends`
- `lifelong-learning`

## 6. class_modules

Purpose:

- stores which modules are enabled for each class

Suggested fields:

```sql
create table class_modules (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  is_enabled boolean not null default true,
  assigned_at timestamptz not null default now(),
  unique (class_id, module_id)
);
```

## 7. student_module_progress

Purpose:

- stores each student’s progress in a module

Suggested fields:

```sql
create table student_module_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  module_id text not null references modules(id),
  completion_percent integer not null default 0,
  mastery_percent integer not null default 0,
  attempts integer not null default 0,
  unlocked boolean not null default false,
  completed boolean not null default false,
  last_played_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, module_id)
);
```

## 8. employability_skills

Purpose:

- stores top-level and sub-skill definitions

Suggested fields:

```sql
create table employability_skills (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  category_title text not null,
  subskill_id text not null,
  subskill_title text not null,
  description text,
  sort_order integer not null default 0
);
```

This table should be seeded from `data/employability-skills.json`.

## 9. student_skill_progress

Purpose:

- stores growth in employability skills by student

Suggested fields:

```sql
create table student_skill_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  skill_id uuid not null references employability_skills(id),
  xp integer not null default 0,
  level integer not null default 1,
  evidence_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (student_id, skill_id)
);
```

## 10. assessment_evidence

Purpose:

- stores teacher-visible evidence of learning from modules

Suggested fields:

```sql
create table assessment_evidence (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  evidence_type text not null,
  prompt text not null,
  response_text text,
  auto_score numeric,
  teacher_feedback text,
  created_at timestamptz not null default now()
);
```

Examples:

- typed reflection
- quiz result
- lock-in sentence
- decision justification

## 11. player_profiles

Purpose:

- stores cross-module life-sim style stats for each student

Suggested fields:

```sql
create table player_profiles (
  student_id uuid primary key references students(id),
  career_title text,
  annual_salary integer not null default 0,
  cumulative_net_worth integer not null default 0,
  savings integer not null default 0,
  tax_paid integer not null default 0,
  career_level numeric not null default 1,
  career_success integer not null default 0,
  job_security integer not null default 0,
  work_life_balance integer not null default 0,
  wellbeing integer not null default 0,
  social_status integer not null default 0,
  resilience integer not null default 0,
  years_played integer not null default 0,
  tech_mastery integer not null default 0,
  climate_mastery integer not null default 0,
  demo_mastery integer not null default 0,
  economic_mastery integer not null default 0,
  last_community_vote text,
  updated_at timestamptz not null default now()
);
```

## 12. player_assets

Purpose:

- stores student purchases such as cars, houses, furniture, or other upgrades

Suggested fields:

```sql
create table player_assets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  asset_code text not null,
  asset_name text not null,
  asset_category text not null,
  purchase_cost integer not null default 0,
  purchased_at timestamptz not null default now()
);
```

## 13. community_votes

Purpose:

- stores class/community vote choices from student gameplay

Suggested fields:

```sql
create table community_votes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  class_id uuid not null references classes(id),
  module_id text not null references modules(id),
  vote_key text not null,
  created_at timestamptz not null default now()
);
```

## 14. feedback_reports

Purpose:

- stores user-reported bugs, suggestions, and questions from the in-app feedback button

Suggested fields:

```sql
create table feedback_reports (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  actor_role text,
  login_name text,
  feedback_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);
```

## Recommended Constraints

### Teacher Domain Constraint

Enforce at application level and optionally with a database check:

```sql
check (email_domain = 'cewa.edu.au' or email_domain like '%.wa.edu.au')
```

### Student Username Constraint

Enforce in application logic and optionally with a database regex if supported.

### Class Ownership Constraint

Ensure:

- `classes.teacher_id` belongs to the same `school_id`
- `students.class_id` and `students.school_id` align

## Suggested Indexes

```sql
create index idx_classes_teacher_id on classes(teacher_id);
create index idx_students_class_id on students(class_id);
create index idx_students_school_id on students(school_id);
create index idx_student_module_progress_student_id on student_module_progress(student_id);
create index idx_student_module_progress_module_id on student_module_progress(module_id);
create index idx_student_skill_progress_student_id on student_skill_progress(student_id);
create index idx_assessment_evidence_student_id on assessment_evidence(student_id);
create index idx_assessment_evidence_class_id on assessment_evidence(class_id);
create index idx_community_votes_class_id on community_votes(class_id);
```

## Recommended Seed Data

The following should be seeded early:

- approved module list
- employability skill categories and sub-skills
- possibly starter asset catalog

## Dashboard Query Goals

This schema should support queries like:

- all students in a teacher’s class
- class average mastery by module
- weakest employability skills in a class
- student assessment evidence history
- class leaderboard by net worth or mastery
- global index across schools

## Security Model Notes

### Teachers

Teachers should only be able to:

- view their own classes
- manage their own students
- view evidence from their own classes

### Students

Students should only be able to:

- view their own player profile
- view their own progress
- submit their own evidence

## Phase 1 Minimum Viable Database

If we want the smallest useful first release, these are the essential tables:

- `schools`
- `teachers`
- `classes`
- `students`
- `modules`
- `class_modules`
- `student_module_progress`
- `player_profiles`

Then add:

- `employability_skills`
- `student_skill_progress`
- `assessment_evidence`

## Build Recommendation

The immediate next implementation step should be:

1. create the tables above
2. seed modules and employability skills
3. wire teacher signup/login
4. wire class creation
5. wire student creation and student login
6. connect module progress and player profiles

That sequence gives the platform a real identity structure before deeper gameplay is added.
