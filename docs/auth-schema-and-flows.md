# Auth Schema And Screen Flows

## Purpose

This document translates the authentication rules into a practical build specification.

It defines:

- the core database entities
- the required relationships
- validation rules
- login and registration flows
- the minimum screens needed to implement the system

## System Scope

The authentication system must support:

- teacher registration with restricted email domains
- teacher login
- school creation or assignment
- class creation
- teacher-managed student account creation
- student login by username
- role-based access control

## Roles

### Teacher

Teachers are verified staff users who can:

- register using an approved school email domain
- create and manage classes
- create student accounts
- assign modules
- view dashboards and analytics
- review evidence

### Student

Students are managed users who can:

- log in with a teacher-issued username and password
- access their own dashboard and module progress
- contribute to class and global systems

## Core Entities

### School

Purpose:

- groups teachers and classes under one organisation

Fields:

- `id`
- `name`
- `sector`
- `region`
- `created_at`

### Teacher

Purpose:

- authenticated staff account with permission to create and manage classes

Fields:

- `id`
- `full_name`
- `email`
- `email_domain`
- `password_hash`
- `school_id`
- `role`
- `is_active`
- `created_at`
- `last_login_at`

Validation:

- email domain must be `cewa.edu.au` or end with `.wa.edu.au`

### Class

Purpose:

- represents a teacher-owned class inside a school

Fields:

- `id`
- `teacher_id`
- `school_id`
- `name`
- `year_level`
- `class_code`
- `is_active`
- `created_at`

Validation:

- class belongs to exactly one teacher
- class belongs to exactly one school
- class code must be unique

### Student

Purpose:

- teacher-created account for classroom play

Fields:

- `id`
- `display_name`
- `username`
- `password_hash`
- `school_id`
- `class_id`
- `created_by_teacher_id`
- `is_active`
- `created_at`
- `last_login_at`

Validation:

- no email field
- username must be unique within the platform
- username should follow school-safe naming rules

### Enrollment History

Optional but useful later.

Purpose:

- preserve changes if students move classes or teachers

Fields:

- `id`
- `student_id`
- `class_id`
- `start_date`
- `end_date`
- `active`

## Recommended Relational Structure

### One-to-many

- one school -> many teachers
- one school -> many classes
- one school -> many students
- one teacher -> many classes
- one teacher -> many students created
- one class -> many students

### Access Rules

- teachers can only see their own classes
- teachers can only manage students in their own classes
- students can only access their own profile and progress

## Username Rules

### Format

Recommended pattern:

- `letters + numbers`

Example formats:

- `Mia27`
- `TB14`
- `JS88`
- `Ava204`

### Validation

- min length: 3
- max length: 20
- only letters and numbers
- no spaces
- no email-like values

### Rejected Examples

- `mia.smith@email.com`
- `Mia Smith`
- `@liam`
- `123`

## Password Rules

### Teacher Password

- standard secure password policy
- recommended minimum 10 characters

### Student Password

For phase one:

- teacher can set a simple starter password
- or system can generate a temporary password

Later:

- allow teacher password reset
- optional forced password change on first login

## Domain Restriction Logic

Allowed teacher domains:

- `cewa.edu.au`
- any domain ending in `.wa.edu.au`

Pseudo-rule:

```text
if email domain is cewa.edu.au or ends with .wa.edu.au -> permit teacher registration
else -> reject
```

## Authentication Flows

### 1. Teacher Registration Flow

Screen: `Teacher Sign Up`

Inputs:

- full name
- school email
- password
- school name

Flow:

1. Teacher enters details
2. System validates email domain
3. System creates teacher account
4. System signs teacher in
5. Teacher lands on class setup

Failure states:

- invalid email domain
- email already in use
- weak password

### 2. Teacher Login Flow

Screen: `Teacher Login`

Inputs:

- school email
- password

Flow:

1. Teacher enters credentials
2. System authenticates
3. Teacher lands on teacher dashboard

### 3. First Class Setup Flow

Screen: `Create First Class`

Inputs:

- class name
- year level

Flow:

1. Teacher creates class
2. System generates class code
3. Teacher lands on student management

### 4. Student Creation Flow

Screen: `Add Students`

Inputs:

- display name
- username
- password or generate password

Flow:

1. Teacher selects class
2. Teacher enters student account details
3. System validates username
4. Student is created and attached to class and school
5. Teacher receives printable/shareable credentials

### 5. Student Login Flow

Screen: `Student Login`

Inputs:

- username
- password

Flow:

1. Student enters username and password
2. System authenticates
3. Student lands on student dashboard
4. Dashboard loads profile, class, modules, and stats

Failure states:

- username not found
- incorrect password
- inactive account

## Minimum Screen Set

These are the first auth-related screens that should exist.

### Public

- welcome / choose login type
- teacher sign up
- teacher login
- student login

### Teacher Only

- create class
- class list
- add students
- student account manager
- teacher dashboard

### Student Only

- student dashboard
- module map
- profile overview

## Suggested Screen Copy

### Teacher Sign Up

`Only school staff with a cewa.edu.au email or a WA school email can create teacher accounts.`

### Student Login

`Use the username and password your teacher gave you. Student email addresses are not used in this system.`

### Add Student

`Create a simple username using a first name or initials plus a number, such as Mia27 or TB14.`

## Backend Recommendation

When implementation begins, the cleanest backend path is:

- auth provider for teacher login
- database tables for teachers, classes, and students
- app-level student authentication with username/password

If using Supabase later, a practical split is:

- teachers in auth users
- students in a custom `students` table with managed credentials

This avoids forcing student emails into the system.

## Security Notes

- never expose full student records across classes
- limit teacher access to owned classes
- store passwords as hashes only
- log login times and account creation events
- provide teacher-driven password reset for student accounts

## Build Order

### Phase A

- schema creation
- teacher signup/login screens
- class creation

### Phase B

- student creation screen
- username validation
- student login

### Phase C

- role-based routing
- teacher/student dashboard protection
- password reset flows

## Recommended Immediate Deliverables

The next build artifacts should be:

1. SQL-style schema draft
2. wireframe copy for the auth screens
3. role and permission map
4. backend implementation decision

## Outcome

Once this auth layer exists, the whole platform becomes much more stable because:

- classes are real
- teachers own class data
- students keep persistent identities
- dashboards become meaningful
- modules can be assigned intentionally
