# Career Empire economy and gameplay lab

Open the running local preview at http://127.0.0.1:8792/economy-lab/.

This is a separate illustrative prototype, not a replacement for the current Career Empire world. No login, student record, database or external service is used. Practice state stays in this browser under one separate key. Start with the failed project, reflection and free retry; try an extra shift and recovery; then test paid checkpoints, purchases, saving and contributions. Reset clears only this lab.

If the preview server has stopped, serve the parent outputs folder with a local static server. ES modules need HTTP rather than opening the HTML directly. All runtime dependencies are included locally. Formal assessment, real community aggregation and cross-tab transactional guarantees are not implemented. See the accompanying scoring-and-gameplay plan and validation receipt.

The procedural scene is new illustrative code. Three.js modules are reused from the inspected game vendor folder; original copyright/license headers are retained. See vendor/LICENSE.txt.

## 24 September presentation layer

Existing Economy Lab upgraded locally: scene-first full-height layout; compact available/saved/scenario-wellbeing HUD; My life modal with Overview, Earn & try, My space, Save & give and History; J shortcut and Escape; net-pay/tax/spend receipts in the panel and world; reconstructed running balances; four animated scene viewpoints with reduced-motion support; existing owned objects/fund effects retained. No pricing, reward, tax, saved schema, campus or separate Night Market changes. Review mode avoids writing the user save.

Access: My life button or J; Escape closes. Four view buttons inspect the scene. Use ?review=1 for a temporary world that never reads or writes the normal practice save. Browser tests must use review mode to avoid contaminating Tania's progress. Node checks: node --test work/economy.test.mjs work/economy-receipts.test.mjs (from the existing task root).

## My Life foundation — 24 September 2026

My Life local tracker now has Overview, Money, Belongings, Progress, My work and Our world. Work supports titled plain-text notes/drafts/reflections, explicit save status, resume of latest active work, up to 100 preserved versions/item, preview/copy of earlier versions, reversible archive, title search, backups, current-text downloads and validated merge-as-copies imports. Money keeps prior values/schema, now requires successful persistence before showing a transaction; same-origin Web Locks used where available. Review mode never reads/writes the normal work slot. Belongings has three illustrative SVG image cards alongside the existing 3D objects. Class-world funds remain a labelled simulation; active global UI/display removed and historical ledger entries preserved.

26 Node tests pass (15 existing economy/receipt checks and 11 work-store checks). Covers revision reload, archive/restore, unchanged-save deduplication, quota failure, stale-tab conflict, corrupt-save preservation, nonpersistent review, import duplicate/collision handling, validation/limits and storage-key isolation. JavaScript syntax and HTML ID/reference checks pass. Interactive browser verification attempted twice but denied because the browser security-check service was unavailable; no workaround used. New screens, file downloads/import UI, native locks and phone layout are not browser-verified this turn.

Run `node --test work/economy.test.mjs work/economy-receipts.test.mjs work/work-store.test.mjs` from the existing economy workspace. My work requires explicit Save work; new text remains in the editor after a failed save. Normal work survives reload; review mode does not. Work backup files contain user text and should be kept privately. This is a local preview, not secure student production storage.


## Dashboard first — 24 September 2026

CE-CHANGE-20260924-84. Tania approves making My Life the useful landing page and retaining Home Base as an optional place to visit. My Life is now the normal landing dashboard rather than a modal behind a decorative 3D overview. Four cards show latest saved work, next practice step, money/personal belongings and current simulated class-project funding. Continue resumes the latest active saved item without discarding unsaved editor text. Navigation opens full-page tracker sections. Home Base remains optional via Visit Home Base, with 3D code loaded only on request; money/work access no longer depends on 3D startup. Existing rules, balances, work schema, history and storage keys are unchanged.

26 existing economy/receipt/work-store tests pass. JavaScript syntax and HTML references checked. Browser inspection attempted but denied by unavailable browser security/policy-check service; no workaround or desktop/mobile visual pass claimed.

Next: verify desktop and phone layout plus dashboard/work/Home Base return routes when browser verification is available. Preserve the prior production boundaries: local demo, no authenticated student/class ownership, no module adapter or assessment-credit claim. No public deployment.


## My Life game styling — 24 September 2026
Tania requests consistency with the existing game colours, tones, fonts and imagery. Updated Economy Lab presentation to the existing playable-3d/style.css forest ink #243f38, accent #286758, soft paper #f7f9f4, muted green borders, amber focus rings, Georgia headings and Arial/Helvetica controls. Smaller corner radii and restrained surfaces align with the playable-world UI. Dashboard includes existing campus concept artwork (explicitly labelled, not a screenshot of the current world) and a demo collection strip using the three existing SVG purchase illustrations; this strip does not imply ownership. Original assets are preserved. Reused source: work/night-market/Assets/landing-screenshots/ecc-future-campus-hero.png; byte-identical local copy outputs/economy-lab/assets/campus-evening.png. No generated artwork, font downloads, external services, pricing, storage or progression changes. Backup: work/style-before-20260924.
Browser review attempted; blocked by unavailable admin-policy security check. No bypass or visual/device acceptance claim. Source/asset checks completed; interactive layout review remains pending. This is a presentation follow-up to CE-CHANGE-20260924-84, not production approval or publication.


## Original Career Workshop shop imagery — 24 September 2026
User correction: My Money and Belongings must reuse the images from the existing Career Workshop shop. Replaced the three SVG placeholders in the dashboard collection strip and owned-item gallery with byte-identical original study-desk.png, laptop-upgrade.png and wellbeing-pack.png, sourced from work/night-market/Assets/Images and Animations/Global Shop/items and mapped by the existing shop/shop.js catalogue codes. Gallery names now match Focused Study Desk, Laptop Upgrade and Wellbeing Pack. Preserved artwork aspect ratios. The demo still represents the Wellbeing Pack as a green corner in 3D; explanatory copy makes this distinction explicit. Existing SVGs retained unused; no save/rule/schema changes or market bridge edits. Source image identity, references and JavaScript syntax checked. Browser visual verification remains blocked by the previously unavailable security service; no publication or production acceptance claim. Supersedes the placeholder-image choice in the preceding styling note.


## Progress grounded in built experiences — 24 September 2026
Tania rejects starting Progress with unbuilt changing-job/adaptation/trade-off learning activities. Replaced that page with three orientation prompts: know how to enter/leave buildings; visit the markets and meet Mara; access EST Prep through the existing destination control. Overview next-step card now points to this orientation guide. Removed the simulated paid checkpoint and trial panels from Progress navigation; retained underlying economy history/rules and hidden source controls for compatibility, without presenting them as available curriculum. No completion ticks, awards or inferred visits: explicit copy says these actions are not automatically tracked yet. Saved work remains separately summarised. No work-store/market bridge changes. Syntax/source checks pass; browser visual verification remains unverified. No publication.


## Getting-started additions — 24 September 2026
Tania adds visiting the Career Workshop shop and exploring the Avatar Studio to Progress. Both are now orientation prompts alongside building access, markets and EST Prep; overview wording includes all five. Browsing requires no purchase. No automatic completion, reward, storage or market bridge changes. JavaScript syntax checked; visual/browser acceptance remains unverified.


## Chapel orientation invitation — 24 September 2026
Tania adds “Take some time out in the chapel” to Progress. Added as an optional quiet pause with no task, reward or completion requirement. Overview also mentions the chapel. Existing shop and Avatar Studio additions retained. Syntax verified; no storage/rule/market bridge changes or publication.


## Oval exploration prompt — 24 September 2026
Tania adds “Head to the oval for a people surprise”. Added this wording to My Progress with a short invitation to look around and discover who is there. This adds a prompt only, not a new oval encounter or a verified visit trigger. Seven orientation prompts now displayed. Tania selected both game-only badges and cash for future first-exploration milestones; amount remains undecided and automatic tracking/rewards remain unimplemented. No save, economy rule or market bridge changes. JavaScript syntax checked; no new browser verification or publication.


## Exploration rewards and authorised release — 24 September 2026
Tania approves provisional $100 plus a game-only badge per first exploration milestone and explicitly authorises push to live when ready. Implemented seven one-time local-demo events in the existing economy ledger: first building interior, shop, Avatar Studio, chapel, market, EST module, and nearby loaded oval teacher. Fixed deterministic event IDs prevent repeat rewards; bonuses are separate from wages/tax and reconcile in transaction history. Maximum $700 bonuses plus preserved $1,000 seed. Old balances/events are preserved; no retroactive visits inferred. Progress displays checkmarks, badge names and $100 received; overview retains the orientation guide. Storage-write failure does not show success; review avoids normal storage. Same-origin concurrent writes use the existing economy Web Lock. Local character profiles share this anonymous practice slot. Explicit economy reset resets these practice rewards too.

Packaged the existing outputs/economy-lab in work/night-market/economy-lab for same-origin game access, with My Life link in the playable world and a return link in Progress. The original port8792 preview is retained; connected visits/rewards are on port8793/economy-lab with the game. These origins do not share localStorage, and existing8792 saves are not migrated automatically. Existing market My work bridge now targets the same-origin tracker; exact origin/source/resource validation and revision preservation remain. No authenticated student data or assessed mastery claim. Existing Career Workshop $100,000 showroom remains a separate memory-only demo; spending these exploration bonuses uses the tracker shop.

Validation: six new reward tests pass (all seven payouts/deduplication, unknown milestone rejection, reload, quota failure, review isolation, corrupt preservation),26 existing tracker/economy checks pass,36 market/overlay regression tests pass using Vitest, dev-check and syntax checks pass. An initial wrong-runner invocation of the Vitest files failed, then the correct runner passed. Local manifest hashes refreshed, but staged-package/hosted-CI/browser acceptance are not complete. Browser security service again denied review access at8793; no bypass used. Production fetch did not return during checks; current remote main reconciliation is not proven. Do not publish this older3cba2ae-based dirty checkout wholesale.

Release is authorised but NOT READY and NOT PUBLISHED. Next: restore browser verification, complete real visit/readiness/receipt/reload/mobile and market-work bridge regression flows, fetch/reconcile current production (including loading work), validate the exact staged package and existing release workflow, then publish under the existing approval and verify public assets. No repeat approval needed for the agreed scope. The current code is a local implementation checkpoint, not a production-ready claim. No new raster art.
