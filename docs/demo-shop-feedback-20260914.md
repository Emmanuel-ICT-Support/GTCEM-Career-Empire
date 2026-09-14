# Demo shop and student feedback — 14 September 2026

Tania requested a resetting $100,000 presentation shop and a desk in the **separate Careers Advice Centre**, explicitly distinct from EST. She then requested a bottom-right feedback form: good parts, awful/not-working parts, and suggestions. This continues the published Initiative fix; no further Initiative changes are included.

## Result
- `shop/index.html?demo=1` opens a memory-only $100,000 wallet with an empty inventory. Purchases deduct normally. Reset restores exactly $100,000 and clears demo purchases; reopening/reloading does the same. This path never reads or writes student economy storage, profiles, assets or the ledger. The normal shop keeps its existing economy behavior.
- Careers navigation and the authored exterior doorway (-18, 15) open a separate Careers scene. The left desk launches the existing shop in demo mode; closing returns to the same desk. Town returns to the Careers entrance. The scene reuses `assets/est-interior.glb` furniture/room geometry with distinct Careers/shop signage, without the EST video or learning station handlers. No new image/model assets. EST content and progression are unchanged.
- The playable game's fixed bottom-right Feedback button opens one accessible modal with three optional questions (at least one answer required). It pauses movement, supports Escape/focus return, avoids duplicated iframe launchers, and preserves the original `feedback_reports` / `teacher-feedback` review format. Signed-in identity uses existing routing; demo visitors can submit without a login. Feedback appears in the existing teacher dashboard review inbox. No email integration was added.
- Phone destinations/joystick remain above the feedback row. Offline feedback explicitly says it remains on the device and has **not reached the teacher**. Backend errors retain the answers for retry. Submission is disabled while sending.

## Validation
- 33 unit tests passed: all 16 products, repeated purchases, overspending prevention, opening/manual reset, no demo economy persistence, normal-shop budget preservation, feedback delivery/error/local fallback and gameplay overlay suppression, plus existing suites.
- Actual desktop browser: walk to desk, open shop, repeated purchases ($98,200 after two desks); car purchase ($91,500), close/reopen ($100,000), manual reset, correct room return.
- Actual 390×844 CSS viewport: joystick route to desk, laptop purchase ($98,400), return to Careers, Town exit at the correct entrance, door re-entry. Phone bar and Feedback rectangles do not overlap. Form layout/empty validation/Escape checked.
- Complete three-answer submission exercised in `tests/fixtures/feedback-development.html`, which uses a local mock and never sends live feedback. Success produced the exact teacher-inbox payload; error and offline messaging checked. Existing live feedback endpoint returned HTTP 200 on a zero-row read. No fabricated feedback was sent to Tania; a real teacher receipt has not been exercised.
- Browser captured no runtime errors in the checked flows. Physical devices and full hosted performance suite are not certified.

Source/manifest checks, release commit and live publication receipt will be recorded at close. Canonical Blueprint record: CE-CHANGE-20260914-52. Blueprint reader publication remains separate from the game release and its existing validation gaps.
