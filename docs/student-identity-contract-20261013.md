# Student identity and browser-save contract: review draft

Synthetic code-only preparation on live ECC merge
`f317370b605df20645661b365a7897570eebfd65`. No login or application-entry wiring,
production account/data, provider, credential, SQL, grant, RLS or server changes.
Parked Market copy5418756 and Admin preview PR56 remain separate.

## Current gap

`auth/auth.js:693` retrieves student password hashes; `:1138` compares browser
SHA-256 before writing local student labels. This creates no Auth session.
`game-session.mjs` verifies Auth but does not bind student membership or invalidate
an existing run on Auth changes. Student logout only clears legacy labels;
teacher logout calls Supabase sign-out. Mixed identities can disagree.

The schema has independent student IDs and no Auth mapping. Prototype policies
and anonymous grants are present; the school-privacy draft acknowledges a missing
student session/RPC flow. These source files do not establish deployed policy.
Existing economy aggregates are not a 3D cloud-save store.

## Inactive contract

`student-session-contract.mjs` is unimported by all application entries. It does
no automatic work or event subscription. Its future server membership endpoint
is not implemented. Tests inject synthetic responses. It cannot authenticate a
student or enforce server API access; client storage/code remain user-controlled.
Server authorization must independently enforce each protected operation.

A fresh getUser response must be followed by a trusted server membership:
matching Auth UUID, student/class/school UUIDs, role student, active membership,
and future expiresAt (epoch milliseconds). The server must derive subject from
validated JWT and membership from its own data. The callback's ID argument is
only a consistency hint. Local labels, password hashes, token presence and
editable user metadata provide no identity authority.

## Verification receipts and lifecycle

`verify()` returns either a current verification receipt, a failure, or an explicit
cancelled/verification-superseded result. A stale request never returns the newer
account's successful status or identity. `openStorage(receipt)` requires the exact
receipt object issued by this gate for its current generation and frozen identity.
Copies, UI status snapshots, old receipts and cancelled outcomes cannot open it.
Every returned storage wrapper remains bound to that generation and identity.

Each new verification revokes existing wrappers before asynchronous work starts.
The host must consume the result of its own request and only open storage for a
verified-student receipt. Logout, user/account changes and membership changes
invalidate access immediately; no old wrapper is retargeted to the next student.

The proposed lease is at most60seconds from fresh Auth verification, bounded by
the earlier server expiry. A slow membership reply cannot extend it. Renewal is
an explicit fresh verify operation using the same server checks, not extension
from local labels. An approved future host can schedule focused renewal before
expiry or on resume, with one request at a time; no polling/renewal is active here.
On expiry/failure, saving stays paused and existing records remain untouched.

A proposed2second total deadline bounds both Auth and membership verification;
the optional timeout is clamped to1-10000ms. These are review-stage UX proposals,
not deployed provider settings. Timeout/error cannot activate storage. SDK calls
may finish later, but late results are ignored. Timers clear on completion; retries
are explicit, not automatic loops.

`connectAuthEvents()` is explicit and returns cleanup; event callbacks only
invalidate synchronously, with no nested Auth request. The host verifies later
outside the callback. Reconnecting cleans up the prior listener. `dispose()`
revokes access before unsubscribe and refuses new verification. Cleanup failures
are raised and can be retried; they never preserve a valid storage wrapper.

## Lifetime rule and quarantine

An Auth UUID must not be recycled or reassigned to a different student/person;
student record IDs likewise must not be recycled. Class/school membership can
change for the same student, through fresh server verification. Genuine recovery
or account replacement requires a separately reviewed mapping/data migration.

The proposed local binding marker is ce-student-binding:<Auth UUID>, version1,
containing that Auth UUID and its immutable student UUID. Every verification checks
and probes this marker. A mismatch, unknown/corrupt format, or failed inspection
blocks access with mapping-review-required/storage failure. The marker and all
existing records are retained; there is no automatic overwrite, clearing or adoption.
This metadata does not confer identity authority or substitute for server proof.

New draft data keys include both IDs: ce-student:<Auth UUID>:<student UUID>:<key>.
Existing UID-only ce-player:<Auth UUID>: data is outside the new read prefix and
remains quarantined, not imported or deleted. This namespace is a proposed migration
boundary only; the deployed game's storage keys remain unchanged. Reassigning an
Auth UUID in a synthetic fresh gate fails against the remembered mapping and
cannot expose the former student's records. No quarantine migration is implemented.

## Persistence status semantics

Storage must be synchronous browser-like getItem/setItem/removeItem, not an async
cloud SDK. Binding metadata I/O does not count as saving progress. Availability
means current proof, inspected/probed mapping and no unresolved I/O failure.
lastSaveSucceeded acknowledges the latest successful data write only;
lastMutationSucceeded can acknowledge a successful write or removal. Removal has
its own message and never says progress was saved. Identity changes, renewal and
any read/write/removal failure clear the acknowledgement. Read/removal errors are
reported, not followed by a stale Saved message. A read retry never manufactures
a save acknowledgement; unrelated successful reads cannot clear a failed mutation.

All status outcomes state cross-device sync is unavailable. Cloud progress,
conflict handling and authoritative assessment/economy data remain separate work.

## Remediation requiring separate review

1. Approve the contract and a secure username flow preserving teacher-issued
   usernames without student-facing email. Password Auth accepts email/phone;
   use a reviewed server identity mapping, never browser guesses or fake tokens.
2. Review provisioning/reset and immutable Auth-to-student mapping. Preserve all
   existing IDs/data; do not convert browser hashes or local labels into authority.
3. Implement/test server membership and isolation using synthetic accounts in a
   separately authorized environment. Audit actual deployed schema/policies before
   choosing migrations; hardening SQL alone can break anonymous legacy callers.
4. After approval, wire receipt-bound storage, event cleanup, renewal and truthful
   status into fresh game runs. No such integration is included here.
5. Plan cross-device saving separately, including schema/API/RLS and conflicts.

Provisioning/resets, production migration, provider settings, server deployment,
grants and RLS application need explicit separate confirmation. None attempted.

## Evidence and limits

38focused Vitest checks pass:35contract/characterization cases plus3existing
session cases. They cover original ownership checks plus overlapping A-to-B races,
receipt generation/identity, mapping quarantine, renewal, read/removal failure,
verification deadlines and event cleanup. Three named characterization cases
expose unchanged released gaps; they are not secure-login acceptance and must
change when reviewed integration is enabled. No assertions are skipped or weakened.

Source/syntax/whitespace checks and270existing hashes/82reachable modules pass.
The initial PR55 head's hosted source/unit CI passed254tests; baseline browser
failures remain, so no full acceptance is claimed. This correction uses no real
accounts, student records or production credentials. No real auth/RLS, physical
device, cross-device or browser login acceptance is claimed.

Primary references: [getUser](https://supabase.com/docs/reference/javascript/auth-getuser),
[password sign-in](https://supabase.com/docs/reference/javascript/auth-signinwithpassword),
[Auth events](https://supabase.com/docs/reference/javascript/auth-onauthstatechange),
[row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
