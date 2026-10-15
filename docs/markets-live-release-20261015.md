# Markets-only release candidate — 15 October 2026

Tania approved the reviewed Markets improvements for the actual ECC game.
`release/markets-curriculum-20261015` starts from current live main
`fec76572a26af62678ac6324216ac460e93deb36`. Its before-release live manifest
matches that Git commit exactly. The source branch is not merged wholesale.

| Reviewed source commit | Live-based cherry-pick |
| --- | --- |
| d0912bb0d468c4b8f572c256c243c7e631338a03 | 3f181a0 |
| 06f17bca994eb1d0bed5daf54b0bc417ab2355a9 | 760b2be |
| 48a0fdba95316d5dbedc589757ed4fcd973450d5 | ab44ab9 |

This adds supported Initiative actions, concise teaching, an illustrated Crew
Recall story sort, an existing-resource takeaway, and honest practice stickers
inside the existing collection. Exit now uses the grounded `MARKET_APPROACH`
position/yaw; the guidance card leaves room for the map at desktop/phone sizes.
Existing $20 gross, $2 tax, $18 net, crew pass, legacy events and guest/account
rules remain. Practice remains distinct from verified mastery.

## Integration boundary

Cache conflicts in `app.js`, `index.html` and `guest-shell.mjs` were resolved
against the current live files. The final target manifest was rebuilt from its
own files: **282 hashes, 87 modules**, rather than the source branch's 284/89.
No changes to original assets, trees, world/environment geometry, real auth,
opening/photo/tour runtime, selected-avatar loading or student records are part
of this release. New Initiative modules and existing artwork load on demand.

The broader repair branch remains at
`13399399ba2a5184bb3ff8b404a968cc1602a1b1`; its runtime fixes at `c72b439`
are preserved there and are **not included** in this Markets-only release.
That branch's focused hosted run passed, but its earlier full run remained
failed. A future merge must retain these Markets changes as well as the saved
quality/Echo fixes, rather than copying an older app/manifest over either.
The new opening sequence and classroom passcode candidate remain separate.

## Target verification

- Source/filesystem checks passed using a temporary read-only link to the
  unchanged original Assets. The link is removed before staging; asset diff is zero.
- Release integrity passed: 282 exact hashes and 87 reachable modules.
- All **258 target units in 57 files** passed. The first run had three failures
  from an unchanged baseline photo harness that expected a synchronous handler;
  its existing async harness correction was ported without runtime changes.
- All **five count-proof tests** passed.
- All **21 scoped Markets browser IDs** have passing evidence across bounded
  runs: 25 executions, 22 passes and three earlier harness failures preserved.
  This is not a single all-green full-suite run. The first run had 15 passes,
  two failures and four not reached; the follow-up had three passes, one
  failure and three not reached; the final four passed in 8.2 seconds.

The failures were an old doorway assertion without walking from the corrected
outdoor exit, a duplicate companion-picker dismissal race, and capitalised
`Wallet $8.00` versus the existing `Market wallet $8.00`. Repairs only change
test observation/serialization. Actual movement, money, case-note preservation,
private-save isolation, crew-pass, trial and collection assertions remain.

Browser coverage includes desktop/390 teaching and recall, keyboard/drag/reduced
motion, grey/colour practice stickers, original one-page image and takeaway,
actual walking through a paid shift, My Work review transfer, legacy reflection
and purchases, and exterior exit/re-entry at 1280/854/390. Screenshots of the
story board and corrected phone exterior were visually inspected. No physical
school-device or full legacy browser acceptance is claimed.

Detailed local reports are retained under
`coverage/markets-release-20261015/`, including `focused-case-proof.json` with
all expected IDs, every bounded run, final outcomes and no missing cases.
A transient no-space error prevented one edit; the edit succeeded after the
bounded browser process released resources. No unrelated files were deleted.

Publication and exact live verification are the next step. The existing GitHub
Pages target builds main/root; neither the prior review link nor a separate
preview host is used for this authorized release.
