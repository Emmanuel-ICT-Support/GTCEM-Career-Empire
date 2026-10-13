# Public Market Admin preview shortcut — 13 October 2026

Authorized independent scope: Options -> Preview tools -> Open Market Admin for
review, without completing Mara. Based on live PR54 merge
`f317370b605df20645661b365a7897570eebfd65`. Parked Market copy5418756 and auth
preparation4f050def/PR55 are not ancestors and are excluded from this candidate.

The link explicitly labels a public preview and opens a separate temporary tab.
Its clean URL contains only experience=night-market, market-review=1 and
admin-review=1. It carries no original guest handoff or account-looking parameters.
The original game tab keeps its run, progress and saves.

In the preview, all app activity storage is document memory and Market practice
uses the existing review store. Reception loads on demand; Admin/chapter access,
walking boundaries and entrance interactions use the explicit preview allowance.
`marketComplete` is unchanged and still means paid. Mara is not accepted,
completed or paid by the shortcut. Preview wage/research-fee commits are blocked;
no tax or crew pass is granted. Entering this preview skips exploration credit.
A visible notice says Public Admin preview, not saved, no wages or crew pass.

Normal guest/authenticated storage and progression are unchanged when the two
preview flags are absent. Genuine session verification remains unchanged and
still runs in the preview. This is public curriculum navigation, not a secure
teacher role or permission to protected account data. Existing payment gates,
assets, avatars, startup/discovery/photos and curriculum text are retained.

The existing cancellation/title guard and fresh-URL retry remain in use. Admin
navigation is started after Market entry without blocking the rendering loop.
Closing a loading panel prevents late travel. Return to Market, campus exit and
re-entry remain supported; closing/reloading the preview discards its practice.

## Focused validation

- 42 unit checks pass: five new flag/URL/transient-storage/no-payment checks plus
  37 existing Market/agency/Admin-fee/boundary checks.
- 11 installed-Chrome browser scenarios pass in32seconds. New cases cover
  shortcut clicks and rendered Reception at1280/390, fresh unpaid guest state,
  byte-identical original run/save data, normal Mara gate, Admin-to-Market back,
  campus exit/re-entry, delayed-module cancellation, failed-module retry, and
  preserved owner storage with a mocked verified Auth response.
- Six existing paid Reception/Admin curriculum browser regressions pass in that
  same run. No captured page errors. Desktop/phone screenshots inspected and
  tested dialogs avoid horizontal overflow. Screenshots and logs remain in
  ignored coverage/ecc-admin-preview and coverage/admin-preview-browser.log.
- Source/reference, changed-module syntax and whitespace checks pass. Staged
  release verification passes271exact hashes and83reachable local modules.

The Auth case is synthetic contract coverage, not real student-login acceptance.
No real accounts, credentials, provider/SQL/RLS changes, physical devices, full
CI or broad startup probes. No merge or deployment is claimed by this candidate;
publication follows scoped review through the existing native access.

## Exact-head CI harness repair

The first PR56 head reproduced three runtime-recovery unit failures: two Market
construction/navigation assertions and the paused-diagnostics check. Both VM
contexts omitted the new adminReviewRequested dependency; the real app already
initializes it. Added false to the two normal-play contexts only. All existing
assertions and runtime code remain unchanged. The affected nine recovery tests
and five preview unit tests now pass together (14 checks). Required source and
271hash/83module release checks pass again. No broad/browser rerun is needed for
this fixture-only repair; no merge/deployment is authorized by this note.
