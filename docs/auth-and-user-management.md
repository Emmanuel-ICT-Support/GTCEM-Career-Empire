# Authentication And User Management Rules

## Purpose

This document defines the non-negotiable rules for account creation, login, and class membership in the Career Empire platform.

These rules are intended to keep the platform appropriate for school use, reduce student account complexity, and give teachers full control over class setup.

## Core Principles

- Teachers are verified users.
- Students do not self-register.
- Students do not use email addresses.
- Teachers create and manage student accounts.
- Every student account belongs to a school and a class.

## Teacher Account Rules

### Who Can Register As A Teacher

Teacher self-registration is allowed only when the email address ends with one of these domains:

- `cewa.edu.au`
- any domain ending in `.wa.edu.au`

### Teacher Registration Requirements

Each teacher account must include:

- full name
- verified school email
- password
- school name

### Teacher Verification Rule

Teacher registration must be rejected if the email domain does not match an approved domain.

Examples:

- `teacher@cewa.edu.au` -> allowed
- `teacher@education.wa.edu.au` -> allowed
- `teacher@tkc.wa.edu.au` -> allowed
- `teacher@gmail.com` -> rejected
- `teacher@student.school` -> rejected

## Student Account Rules

### Student Self-Registration

Student self-registration is not allowed.

Students should not create their own accounts.

### Who Creates Student Accounts

Only teachers create student accounts.

When a teacher creates a student, the student must be assigned to:

- a school
- a class
- a teacher owner or class owner

### Student Email Rule

Student email addresses must not be collected or required.

No student email field should appear in the student creation workflow.

## Student Username Rules

Student usernames should be simple, school-safe, and anonymous enough for classroom use.

The username should contain:

- a first name, nickname, or initials
- plus a number or short identifier

Examples:

- `Mia27`
- `TB14`
- `Liam204`
- `JS88`

The username should not require:

- surname
- email address
- personal phone number
- date of birth

### Username Validation Rules

Recommended validation:

- minimum 3 characters
- maximum 20 characters
- letters and numbers only
- no spaces
- no symbols except optional underscore if desired

### Recommended Pattern

Good default pattern:

- `[A-Za-z]{1,10}[0-9]{1,6}`

This keeps usernames simple and easy for teachers to issue.

## Password Rules

### Teachers

Teachers should use full password-based login.

### Students

Two acceptable options:

1. Teacher-created password
2. Teacher-issued short join code or temporary password

Recommended first implementation:

- teacher creates username
- system generates temporary password
- teacher shares credentials with student
- student changes password only if desired and if age/school policy allows

## Class And School Ownership

Every student account must belong to:

- one school
- one class

Each class must belong to:

- one teacher account
- one school

This gives the system clear ownership for dashboards, analytics, and permissions.

## Permissions Model

### Teachers Can

- register with approved school email
- create classes
- create student accounts
- reset student passwords
- assign modules to classes
- enable or disable modules
- view class analytics
- view student learning evidence

### Students Can

- log in with teacher-issued username
- access only their own profile
- play assigned modules
- view their own stats and dashboards
- view permitted class leaderboard and community data

### Students Cannot

- create accounts
- join random classes without teacher assignment
- edit school or class ownership
- view other students' private evidence

## Recommended Data Model Additions

### Teacher

- id
- full_name
- email
- email_domain
- password_hash
- school_id
- role
- created_at

### Class

- id
- teacher_id
- school_id
- class_name
- class_code
- active

### Student

- id
- username
- password_hash
- display_name
- school_id
- class_id
- created_by_teacher_id
- active

## Recommended User Flows

### Teacher Registration Flow

1. Teacher enters name, school email, password, school name
2. System validates approved email domain
3. System creates teacher account
4. Teacher creates first class

### Student Creation Flow

1. Teacher opens class dashboard
2. Teacher enters student display name
3. Teacher enters student username
4. System generates or accepts a simple password
5. Student is assigned automatically to teacher's class and school

### Student Login Flow

1. Student enters username
2. Student enters password
3. System loads the correct class, school, and player profile

## UI Rules

### Teacher Registration Screen

- must clearly explain approved teacher email requirement
- must reject non-approved email domains with a clear message

### Student Creation Screen

- must not include an email field
- should suggest username format examples
- should show class assignment clearly

### Student Login Screen

- should ask for username, not email
- should be visually simple and low-friction

## Validation Messages

Recommended examples:

- `Only school staff with a cewa.edu.au email or a WA school email can register as a teacher.`
- `Student accounts are created by teachers only.`
- `Student usernames should use a first name or initials plus a number, such as Mia27 or TB14.`

## Implementation Recommendation

When the platform moves to a real backend, this should be the order:

1. teacher authentication
2. school and class creation
3. teacher-managed student creation
4. student login
5. permissions and dashboard access

This keeps the system safe, simple, and appropriate for classroom rollout.
