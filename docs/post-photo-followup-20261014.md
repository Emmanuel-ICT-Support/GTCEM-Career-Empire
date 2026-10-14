# Draft PR57 follow-up

The user additionally requested a Blueprint menu button and explicit numbered
course phases. These changes remain in draft PR57; merge/publication is pending.

Blueprint links to `https://taniab1975.github.io/career-empire-blueprint/#overview`
inside Options on the ordinary game route and Places in the full-campus view.
It uses a native link, keyboard focus, an accessible new-tab label and
`target="_blank" rel="noopener noreferrer"`. No new top-level control or modal.
The destination returned HTTP 200. Three installed-Chrome checks passed for
1280/390 ordinary routes and 1280 full view, including exact destination and
`window.opener === null`. The 390 screenshot was visually inspected.

The student outline now starts with Phase 0 (intro, exploration/world overview),
then Phase 1 (Mara's noodle workplace and first paid Initiative gig), then Phase 2
(read the changing world). Phases 3-11 retain the source sequence and the later
return to Mara at Phase 6. The local supplied source assigns J0 to the first paid
gig: its stable ID stays J0/Phase 1, J1 stays changing world/Phase 2, J5 stays the
later Mara visit/Phase 6 and J10 stays adaptability/Phase 11. A new INTRO row covers
Phase 0, without a new formal curriculum unit or assessment claim. The private
teacher ledger/197 traceability entries remain outside this repository.

The course uses phases, with weeks, lessons, dates and assessments still to be
planned. The post-photo celebration remains "First mission complete!" and uses
recorded earnings; it is not labelled a paid gig. Unit 3 covers Phases 1-6 and
Unit 4 covers Phases 7-11. The PDF has two visually checked A4 pages with Unit 4
on page 2, and retains weekly reflection in the existing school portfolio.
PDF source: 150785 bytes, SHA256
`d101e9fb8700158a3902c76ce45d20b21adc7fce567637a26b0c3717184eec58`.
Library replacement succeeded for the existing
`libfile_fb731128a6bc8191b717ebbad8cc32a7`; readback confirms two pages and Phases
0, 1, 2, 6 and 11. Its retained PDF includes Library provenance metadata.

## Original hosted CI and compatibility repairs

Exact original commit `5bb26c2b815fc749a96b2578a664e5898fc66dc5`, CI run
`38487929320`, finished **failure**. Source/unit coverage passed; startup passed
(37.4 seconds); critical journeys had two passes (desktop/390 real Admin-door
walking) and four failures. Full browser shards were skipped.

- Actual-photo test: stale `await setMode('market');}` instrumentation marker.
  This same marker failure is recorded on exact published base e88724dc in run
  38348338780. The unnecessary timing interception was removed from photo and
  Market-handover checks so they exercise actual student controls.
- Companion Market test: still expected instant Market mode after the shortcut.
  Local reproduction confirmed Town at the outside entrance. The affected route
  tests now walk to the door and explicitly enter, then wait for the actual HUD
  and two animation frames before issuing another walking command.
- Teacher-return test: still expected the removed orientation-handover dialog.
  It now checks the new tour, optional companion and Skip tour before continuing
  the existing photo, teacher, Market, My Life and fresh-reset assertions.
- Natural-intro test: Chapel waypoint timed out at z=-5.28 against -7.6 in 20s.
  That journey passed on the exact base run; this failure is **unresolved**, not
  claimed as a proven baseline failure. No startup/Chapel/physics gate was changed
  to hide it, and no historical startup polling campaign was resumed.

A real review-mode regression was also repaired: explicit Admin review menu
re-entry returns directly to Reception, while ordinary shortcuts stay outdoors.
Desktop/390 existing public-review checks passed with original saves and unpaid
gates retained. Five affected photo, companion, teacher and Admin-door scenarios
passed in `ci-repaired-critical.log`; five Admin/Blueprint scenarios passed in
`ci-review-blueprint.log`. Seventeen focused landing/Admin/course units passed
after the phase revision. Syntax and whitespace passed. Browser logs and source
comparison evidence are retained under ignored `coverage/post-photo-tour`.

Further old Market tests retain unrelated expectations, including an objective
label absent from unchanged base `night-market.js` and an immediate exit-door
cue which can instead show Talk to Echo. These are reported separately from
the changed outside-entry route; source/CI readiness must not be called fully
green while any hosted job fails or has not completed.

The first broader route-compatibility batch ended with 4 passes and 8 failures
(4.4 minutes). The entry wait was then repaired; the bounded second batch
recorded 5 passes and 5 failures, with one interrupted and one not run (6.3
minutes). It passed both queue replays and three unchanged My Life header
checks; the remaining failures reached older exit-cue, objective-copy,
collection-role and arrangement-button expectations. The source base already
contains the newer objective and arrangement UI. No production curriculum
was rolled back and no assertion was silently skipped. The outline check was
run separately after stopping repeated unrelated legacy waits.

The separate revised My Life phase-outline browser check passed (2.0 seconds),
including Phases 0/1/2/11, twelve phase cards, printable PDF link and preserved
My work navigation. All five Market/Admin curriculum modules have exact bytes
matching published base e88724dc, recorded in unchanged-market-curriculum.json.
