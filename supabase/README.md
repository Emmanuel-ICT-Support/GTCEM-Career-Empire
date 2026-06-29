# Supabase Setup For Career Empire

This folder contains the Supabase-specific starting point for the Career Empire platform.

## What Supabase Will Handle

- teacher authentication
- class and school data
- teacher-created student accounts
- module progress
- employability skill progress
- assessment evidence
- shared player profile data

## Recommended Auth Split

### Teachers

Use Supabase Auth with email/password.

Reason:

- teachers have approved school email addresses
- login flow is standard
- password reset is straightforward

### Students

Do not use Supabase email auth for students.

Instead:

- store students in the `students` table
- teachers create student usernames
- students log in with teacher-issued username and password
- validate student login through app logic against the `students` table

This matches the platform rule that student email addresses are not collected.

## First Setup Steps

1. Create a Supabase project
2. Open the SQL editor
3. Run `data/sql/schema.sql`
4. Run `data/sql/seed-modules.sql`
5. Run `data/sql/seed-employability-skills.sql`
6. Run `data/sql/add-feedback-reports.sql`
7. Run `data/sql/add-game-progress-fields.sql`
8. Run `data/sql/seed-schools.sql`
9. Run `data/sql/data-api-grants.sql`
10. Choose one RLS mode:
    - for browser-prototype access, run `data/sql/rls-policies-prototype.sql`
    - for production privacy hardening, run `data/sql/rls-policies-school-privacy.sql`
11. Copy `config/supabase-config.example.js` to a real config file
12. Paste your project URL and anon key into that config file

## Suggested Config File

Create:

`config/supabase-config.js`

From:

`config/supabase-config.example.js`

Then include it in any page that needs Supabase before `src/services/supabase-browser.js`.

## Recommended First Integration Order

1. teacher signup
2. teacher login
3. create class
4. add students
5. student login
6. sync player profile and module progress

## Important Note

Do not commit your real Supabase anon key if you later move to a private deployment workflow with environment variables.

For the browser prototype phase, the anon key is expected to be public, but keep service-role keys out of the front end.

Before using live student data, apply `data/sql/rls-policies-school-privacy.sql` so anonymous reads from student/sensitive tables are removed, teacher reads are scoped to their school, and the Global Index has aggregate-only RPC summaries available.

`data/sql/rls-policies-school-privacy.sql` intentionally removes direct anonymous access to student gameplay tables. The current browser-only student login needs an RPC or backend session flow before that hardened script can be applied without breaking student login and gameplay writes.
