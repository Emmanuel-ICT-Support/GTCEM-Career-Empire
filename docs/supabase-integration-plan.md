# Supabase Integration Plan

## Goal

Connect the existing Career Empire prototype to Supabase without breaking the current local prototype flow.

## Current State

Right now the project has:

- prototype auth screens
- prototype student and teacher dashboards
- local storage persistence for the game
- SQL schema draft

## Target State

The app should eventually use:

- Supabase Auth for teachers
- database tables for schools, teachers, classes, students, modules, skills, evidence, and player profiles
- role-aware teacher and student dashboards

## Integration Strategy

### Step 1. Preserve the local prototype

Do not remove the current local-storage flow yet.

Reason:

- it keeps the game playable while the backend is added
- it lets us compare local prototype vs real backend behaviour

### Step 2. Add Supabase configuration and client bootstrap

Add:

- browser client bootstrap
- project config file
- docs for setup

### Step 3. Implement teacher auth first

Why first:

- teachers have the cleanest authentication model
- teachers create the identity structure for everyone else

### Step 4. Implement class creation

Once teacher auth works:

- create school lookup or school creation flow
- create first class
- generate class code

### Step 5. Implement teacher-created student accounts

This should:

- create rows in `students`
- attach each student to school and class
- save teacher ownership

### Step 6. Implement student login

This should:

- accept username and password
- validate against the `students` table
- load the student profile and dashboard

### Step 7. Sync game progress

Replace local-only game saves with:

- `player_profiles`
- `student_module_progress`
- `community_votes`
- `assessment_evidence`

## Technical Notes

### Teacher auth

Use Supabase Auth.

### Student auth

Use app-managed auth flow against `students`.

### Permissions

Later, add row-level security so:

- teachers see only their own classes
- students see only their own data

## Immediate Build Sequence

1. configure Supabase
2. seed modules and employability skills
3. wire teacher signup/login screens
4. wire create-class screen
5. wire add-students screen
6. wire student login

## Success Definition

This phase is successful when:

- a teacher can register with an approved school email
- a teacher can create a class
- a teacher can add students
- a student can log in with a username
- the student dashboard loads the correct profile
