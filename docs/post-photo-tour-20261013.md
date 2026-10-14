# Post-photo companion tour and safe landing - draft

Based on published ECC main `e88724dcae46de7739625fbbd54ae77091378c3c` in
`feat/post-photo-tour-landing-20261013`. Implementation and a draft PR are
authorized; merge and deployment require parent publication confirmation.
Auth PR55 and parked Market copy remain separate and are not ancestors.

## Student experience

The actual completed photo stays visible until its existing Continue action.
Continue loads an eight-beat tour on demand: recorded earnings/congratulations,
existing companion choice and greeting, student-controlled Flyover back to the
campus start, Options, actual Stats, My Life course outline, Initiative and safe
role boundaries, then Mara's workplace. No player-name form or video download.
Every beat has one primary action plus skip/close; Options supports replay.
No companion and phone/journal choices remain valid. Failed companion loading
does not claim the selected creature appeared.

Land is always visible during Flyover, including hidden-controls mode; L lands,
while F/Escape retain Return to player. Landing probes nearby low outdoor ground
and capsule clearance, excluding authored building footprints. Camera height is
never copied into player height. Invalid/unavailable ground fails closed; the
verified campus start is a final fallback. Landing away from the start keeps the
return beat pending. Only the player's actual landed position advances it.
The bottom-right map tracks the flying camera and marks the campus start.

Ordinary Places/Market, map and guide shortcuts arrive outside the campus Market
building at approximately `(43, -17.8)`, facing inward. The two experience aliases
also start outside at `(43, -18)`. Roof landing near the Market resolves to the
outside approach. Students walk forward and explicitly enter, then approach Mara.
The explicit `market-review=1&admin-review=1` shortcut retains direct Reception.
Existing paid gates, curriculum, photos, visual assets and wages are unchanged.

## Course outline and storage

Library sources were materialized into the Mac task workspace using the Library
transfer helper and their actual bytes inspected: source JSON 194604 bytes,
SHA256 `e94f239dd4ac511084fd40b59529f49d2428bd5a2eef94809f95fdebbae72a2c`,
197 unique traceability IDs and 11 undated stages; student text 4804 bytes.
Sources: `libfile_18af0ff4fad88191a5b2682a0b1d1cb4` and
`libfile_97c06d8633988191b3c562185be3aec7`.

The teacher audit remains outside the public repository. Student JSON/HTML/PDF
contain only the supplied overview, Learn/Experience stages and throughout-unit
guidance. They retain Draft learning sequence, Unit 3/Unit 4, proposed activities,
weekly portfolio reflection and the school assessment-outline distinction.
No invented weeks, dates, additional formal units or assessment-completion claims.

My Life adds Course outline alongside existing Progress and My work, with the
student PDF, tour return/replay links and existing student-portfolio link. It does
not duplicate portfolio or My work records. The existing same-run guest handoff
retains photo, companion, wallet and the tour's next beat. Ordinary guest entry
still starts fresh. Tour state has its own tiny game-run key and never dispatches
curriculum completion or pays rewards. Existing orientation rewards remain
idempotent and earnings come from recorded transactions.

## Verification

248 unit tests pass, including nine landing cases and three student-copy cases.
Source checks, changed-module syntax and whitespace pass; the staged package
verifies 278 exact hashes and 85 reachable local modules.
Ten distinct focused browser scenarios pass across the nine-case final batch and
repaired actual-photo rerun. They check actual retained photo/capture, selected Sprout
appearance, early/start/roof landing, repeated keyboard input, persistent Land
and map in clean view, map/menu approaches, desktop/390 touch landing, retained
Admin bypass, skip/close/replay, reduced motion, course and same-run handoff/reset.
Logs and screenshots are in ignored `coverage/post-photo-tour`.

The first browser run exposed a stale pre-PR56 timing-marker fixture and a
case-sensitive draft-label assertion. Actual checks then caught clean-view Land
visibility and the hidden discovery-route Flyover slot; both were repaired.
Physics coordinates are checked within 1 mm; fixtures do not reseed return
handoffs. These failure logs are retained separately from passing reruns.

The student PDF is 148208 bytes and two A4 pages. Installed Chrome generated it;
macOS PDFKit rendered both exact PDF pages for visual inspection, with Unit 4
starting page 2 and no clipping/overlap. No dependencies were downloaded.
Disk headroom was checked before rendering/browser work (4.4-5.3 GiB after cleanup).
No physical-device, full hosted CI, secure student-authentication, learning
effectiveness, production merge or deployment acceptance is claimed.

Landing API reference: https://rapier.rs/docs/user_guides/javascript/scene_queries/
