# Restoring the existing Markets Administration — 12 October 2026

## What happened

Markets Administration was already implemented in the separate local `opening-recovery` lineage, retained by `/Users/tania.byrnes/Documents/Codex/2026-10-04/task/review-game` (Git HEAD `7913118` plus local work). The canonical Blueprint record is `production-blueprint/docs/production/world-market-framework-20260925.md`, especially Administration layout/entry repairs and the Nora/Dev/opportunities chapters. Current main/PR48 and the guest-first lineage do not contain its `opening-district.js` or `opening-chapters.js`; the tracked history has no deletion of those modules. This is a missing integration of the separate local implementation, not evidence that the new Market briefing removed it. The earlier claim that the fuller Admin area was future work was wrong and has been corrected.

Both newly supplied screenshots were materialized through Library's supported transfer helper and inspected locally. They show the older Sunday Market with the obsolete numbered/floating signs and Market Shelf, consistent with the published older Market lineage. The screenshots do not themselves show the Administration interior.

Latest published guest-first `9c5d7c70b73474d566d83fd94601cc28b554a2a7` adds interior-entry guards beyond initial `e54056b`. Reconciled that exact commit in `800e83c`: retain latest guards, published documentation/tests and existing new Market/physical gate work. Release owner should cherry-pick the scoped Admin restoration onto its current combined branch, not revert app.js to the local historical copy. No deployment performed here.

## Existing content preserved

- Cream cutaway Administration offices, reception desk/receptionist, west corridor, original actors and stepped-free Places shortcuts. Preparing on west approach prevents the previous blank entrance/collision failure. Reception explains the next assignment.
- Nora: reliable-information/source checking, author/date/place/evidence and limits; regional bulletin, Mara's roster/order record, town-feed claim and old overseas archive; two-source briefing, provisional pathway comparison. Mara remains the record author and her original portrait is retained.
- Signal or Spin: six fictional headlines, route plus reason, explanations and alternate recovery examples, tab score/stamp and checked bulletin. Evidence Express remains its separate optional keyboard/touch/relaxed arcade break. Original art and code are restored, not regenerated.
- Dev: six work blocks, three stations, technology/climate/demography/economy pressures, visible parcels, bottlenecks, comparison and revisable trials.
- Opportunities: fictional ads and Alex's supplied evidence; submission method, role criteria, SAO/STAR/CAR guidance, application preview/review and practice conversation.
- Original Carolan source/depth mapping and printable two-part field guides preserved. No invented curriculum codes, new assessment-compliance claim, or rewritten question bank.

Original progression is after Mara's first paid gig. Before then, Journal now clearly identifies Administration as the next assignment and explains the prerequisite rather than making it appear absent. Afterward, walk through the west entrance or choose Journal → Explore the administration centre. Original optional teaching/activity choices and office shortcuts remain. Do not equate a score/stamp/source selection with independent understanding.

The historical one-time $5 research fee is restored to the existing practice event ledger, with replay/double-payment protection. It is distinct from Mara's unchanged $20 gross − $2 community tax = $18 plus crew pass. No unrelated $8 Market Rush feature transplanted. No student saves reset. Chapter/arcade practice remains tab-local as originally disclosed; guest-first storage remains scoped to the same run. Original purchased keepsakes, reflections, money and legacy events are retained.

Eleven supporting source files are copied byte-for-byte; the twelfth, opening-district.js, has one whitespace-only normalization; `market-admin-source-receipt-20261012.json` records their SHA256 values. Three original actor GLBs and original arcade illustrations are copied from the same source. New actor kits are registered/requested only when Administration is prepared; chapters and arcade art load on their own explicit entry. No extra initial campus download.

## Legacy UI audit — no ambiguous deletion

Little Finds already is a tiny optional keepsake shop: $4 plant and $6 lantern, paid from practice earnings; neither changes skill/wellbeing scores. Save & Contribute is a money choice: move $5 to savings, withdraw it, or contribute $2 to light the second lantern; it does not save coursework. Your Market Shelf displays purchased keepsakes and the earned crew ticket. Actual coursework reflection/case note/handover is in the journal and My work flow.

Recommendation to parent/user: keep the small shop and reversible savings with clear names/one-line context; review whether the separate shelf display is redundant with the journal and Little Finds. Do not delete saved ownership/work records. Current correction removes no potentially useful legacy mechanism; old `02`/`05` numbering was already removed by the first guidance commit.

## Validation

140 original/restored unit tests passed before adding two focused research-fee tests; the new pair also passes. Six browser module/mechanics scenarios pass at 1280px/390px: Admin reception/sources/allocation/application plus existing first-gig trial, full wages, reflection, purchases and crew celebration. Two actual keyboard west-door walkthroughs pass: entry → Reception → Nora's activity → Opportunities → return, same wallet/run, no page errors. Desktop and phone pixels inspected; screenshots are local only under task-2/evidence.

The first continuous-key QA attempt overshot the narrow corridor because it used sampled diagnostics; balanced short keyboard presses fixed the test route. A later QA expectation incorrectly looked for the receptionist's button after My next task had already moved directly to Nora; corrected the test to follow the existing shortcut. No game mechanic was changed for these test failures.

Final reconciled test totals and release hash verification are recorded in the final handoff. Full hosted CI, physical phone, classroom engagement and learning transfer are not claimed. Nothing has been published from this checkout.

Final reconciled validation: 142 unit/coverage tests, 262 release hashes and 74 reachable runtime modules pass. Six post-reconciliation browser scenarios pass (Admin source/allocation/application on desktop/390px, fresh-guest save preservation, verified-account persistence, actual gate exit/re-entry on desktop/390px). Two physical Administration west-door scenarios and four original Market mechanics scenarios passed in the earlier focused runs. The final PR49 initial-interior-guard scenario result is in the handoff. No full-CI or physical-phone claim.
