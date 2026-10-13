# Student identity and browser-save contract: review draft

Authorized scope: synthetic code-only preparation on live ECC merge
`f317370b605df20645661b365a7897570eebfd65`. No login, application entry,
production account, provider configuration, credential, SQL, grant, RLS or
server deployment changes. Market copy commit `5418756` remains on its separate
parked branch and is not included.

## Current gap

`auth/auth.js:693` retrieves student password hashes; `:1138` compares browser
SHA-256 before writing local student identity labels. This does not create an
Auth session. `playable-3d/game-session.mjs` instead verifies `auth.getUser()`
and uses `ce-player:<auth-user-id>:` browser storage. It does not bind a student
membership or invalidate an existing run on Auth changes. Student logout in
`src/services/session-banner.js` only clears legacy labels; teacher logout
calls Supabase sign-out. Mixed teacher/student identities can therefore disagree.

`data/sql/schema.sql` has separate student IDs and no Auth-user mapping.
`data-api-grants.sql` preserves anonymous prototype access; prototype RLS includes
`using (true)` policies. The school-privacy draft explicitly notes the missing
student session/RPC flow. Repository SQL is not evidence of what is deployed.
`add-game-progress-fields.sql` adds economy aggregates, not a 3D cloud-save store.

## Proposed contract and inactive scaffold

`playable-3d/student-session-contract.mjs` is deliberately unimported by every
application entry. It performs no automatic work, login, token creation or
remote database operations. Its future membership port is not implemented.
Tests inject synthetic Auth and membership responses only.

| Boundary | Required evidence or behavior |
| --- | --- |
| Auth | Fresh successful `client.auth.getUser()`; no local username, `studentLogin`, hash, token-presence flag or editable user metadata substitutes for it. |
| Membership | Trusted server response: matching `authUserId`, UUID `studentId`, `schoolId`, `classId`, `role: student`, `active: true`, and finite future `expiresAt` in epoch milliseconds. |
| Server ownership | The server must derive subject from a validated JWT and derive active student/class/school membership from its own data. The callback's Auth ID argument is a consistency hint, never authorization. |
| Local saves | Preserve `ce-player:<verified-auth-id>:`; no automatic import of legacy/unowned saves or another account's namespace. |
| Lifecycle | The future host must connect Auth/membership events to invalidation immediately, then verify again before opening a new storage wrapper. Logout and account switch never retarget an old wrapper. |
| Expiry/races | Proposed local proof lease is capped at 60 seconds from fresh Auth verification, or the earlier server expiry. Stale/late requests cannot reactivate an invalidated session. This is a review proposal, not a deployed server policy. |
| Status | Verification pending/unavailable pauses account saving. Capability is distinguished from a successful write and a failed write. Status always says cross-device sync is unavailable. |

This client guard protects accidental local save ownership. Client code and
storage remain user-controllable: it does not authenticate accounts, enforce
server access, certify learning or make browser saves authoritative. Server
authorization/RLS must enforce every protected operation independently. Merely
importing the scaffold would not complete secure login or fix the existing game.

## Remediation sequence requiring review

1. Approve the identity contract and choose a secure server-backed username flow
   preserving teacher-issued usernames and no student-facing email requirement.
   Supabase password sign-in accepts email/phone; do not guess aliases in browser
   code or expose privileged provisioning keys. No fake JWT/local-label bridge.
2. Separately review server-side Auth provisioning/reset and a unique mapping to
   existing student IDs. Preserve class/school ownership and old records; no
   automatic password-hash conversion or migration from client labels.
3. Implement/test the server membership endpoint and account/class/school
   isolation with wholly synthetic accounts in a separately authorized test
   environment. Verify actual deployed schema/policies through an approved audit
   before selecting or applying migrations. Review rollback and legacy callers;
   applying the hardening SQL alone can break their anonymous workflows.
4. After approval, wire verified membership, Auth-event invalidation and truthful
   status into a fresh game run. Guest behavior, assets and old saves remain
   separate. Expiry/account switch must block old wrappers before async work
   resumes; retries must not adopt another owner or silently overwrite progress.
5. Treat cross-device saving as a separate schema/API/RLS/concurrency design.
   This draft provides only same-browser persistence and creates no cloud store.

Code-only adapters/fixtures/docs can be reviewed independently. Production
provisioning or resets, record migration, provider settings, server deployment,
grants and RLS application require explicit separate confirmation. No such
operation has been attempted in this work.

## Evidence and limits

26 focused Vitest checks pass: 23 contract/characterization cases plus the three
existing game-session cases. They cover legacy labels, matching membership,
retained teacher/mismatched IDs, active student role and required class/school IDs,
verification failure, logout, expiry, account switch, late/mutable responses,
local write failure/retry and truthful same-browser status. Three named released
behavior characterization tests intentionally expose current production gaps;
they are not secure-login acceptance and must change when integration is approved.

No real accounts, student records or production credentials are used. No live
auth service, actual RLS isolation, physical device, cross-device sync or browser
login acceptance is claimed. There is no visual/runtime change to browser-test.

Primary API references: [server-verified getUser](https://supabase.com/docs/reference/javascript/auth-getuser),
[password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword),
[server row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
