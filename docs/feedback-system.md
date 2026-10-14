# Feedback System

## Purpose

Add a feedback button to each major screen so teachers and students can:

- report bugs
- make suggestions
- ask short questions

Each report should record:

- page path
- actor role
- login name
- feedback type
- message
- timestamp

## Storage

Primary storage:

- Supabase table `feedback_reports`

Fallback:

- local browser storage if Supabase is unavailable

## Current Fields

- `page_path`
- `actor_role`
- `login_name`
- `feedback_type`
- `message`
- `created_at`

## Intended Use

This gives you a simple inbox of real classroom feedback tied to who was signed in and where they were in the platform.
