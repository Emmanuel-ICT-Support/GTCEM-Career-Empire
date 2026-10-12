# Market guidance and Mara briefing — 12 October 2026

Isolated branch `ux/market-guidance-20261012`, based on supplied guest-first commit `e54056b68155e16699505a834d0e42a2126cc7fa`. No push, publication, or edits to another checkout. Return this scoped commit to the release owner; preserve newer guest-first work during integration.

## Experience and content decisions

Travel arrives at local `(0,0,15)`, facing negative Z, outside the existing entrance at Z=10.8. Forward walking crosses the gate into the courtyard. The entrance is a courtyard gateway, not an enclosed building; retain its established architecture. Paving/navigation extends to the outside arrival area. Only Mara's floating guide stands out initially. Customer/queue/Sam guides appear after accepting; nearby optional activities reveal their labels independently, without restricting interaction, and earned crew/savings/shelf guidance follows relevant progress. Existing physical stall/building plaques stay in place.

Workbench and collection text is a plane mounted flush on the front of each solid blue panel. Collection lettering moves with the collection unit. Remove floating duplicate workbench/results boards; trial results remain in the dialog/journal. No sign-plan choices or consequences removed. Remove old numbered wayfinding `02` and `05`. Waiting customer becomes `WAITING FOR A PHONE ORDER`; queue sign becomes `WATCH CUSTOMER FLOW`, while the familiar interaction action remains `Observe the queue`.

The queue activity is intentional: its opening simulation shows prepaid phone-order customers mistakenly joining ordering while their bags sit at collection. The student can watch, ask, trial alternative sign wording/position, collection arrangement and Sam's role, check results and hand over. Numbering was old wayfinding, not a curricular code or customer priority.

Mara's silent briefing has four illustrated beats plus the job card. Real market scene captures are produced synchronously from the already-loaded scene, with the player omitted from pictures; no unrelated campus discoveries or result spoilers. Timings before the held job card are 6/10/9/8 seconds; allow approximately six seconds to read the finishing card (~39 seconds total). Caption fades and the playful lunch-rush card animate. Pause/Play, Next, Skip, Replay and immediate Take the shift/optional thinking guide stay available. Reduced-motion disables animations and automatic advancement. Journal replay works after acceptance without dispatching accept again. No voiceover or heavyweight video.

Retain Mara's ownership, freshly made rice bowls, busy/disorganised queue, prepaid phone orders showing their order at collection, walk-up order/pay at ordering, Sam packing and staffing tradeoffs, investigation/trial/observation/handover, optional journal guide. Opening explicitly names initiative; concise skills label names initiative, problem solving and working with others. Job pay remains `$20 gross − $2 community tax = $18 plus crew pass`; help, retries and mixed results keep full pay. Campus orientation/Market Explorer rewards are separate unchanged mechanics.

## Curriculum placement

Before this change: post-trial `Name what you practised` explicitly connected initiative/problem solving before handover/payment; optional Initiative reference sheet was reachable there, from the case note and journal. The original one-pager is `Assets/EST Preparation/initiative-one-page-summary.png`. Case note choices record notice/information/action/result/people/transfer, with simulation record, download and Save to My work. `economy-lab/work-ui.mjs` exposes `Open Initiative one-pager` for imported Market work. These are student-facing practice/reference surfaces, not an admin assessment module.

Now: opening light skill focus and post-trial reflection remain; optional `Teacher curriculum context` sits inside the existing Initiative reference sheet. It links the official SCSA 2027 Year 12 syllabus using the research worker's verified mapping: Unit 3 enterprising behaviours printed p.9, communication/teamwork pp.7/11, questioning/alternatives/plan–implement–evaluate pp.8/12; repeated revision can support Unit 4 continuous improvement p.13. No invented codes or claim of assessment compliance. Fictional community tax is explicitly a game mechanic. Correction after locating the separate local implementation: Markets Administration already existed in the opening-recovery/review-game lineage. It was absent from this published main lineage, not future work. See the Administration restoration follow-up.

## Generated asset

`playable-3d/assets/market/lunch-rush.jpg` — 768×512, 172,568 bytes, generated using built-in imagegen, re-encoded for lightweight lazy delivery. Source PNG is outside the checkout under task-2/generated_images. Illustration requested an affectionate comedic tightly packed crowd of ~24 diverse young adult customers, eager friendly faces, smartphones and steaming takeaway rice bowls, stylized polished 3D cartoon campus palette, no signs/readable text/logos, no queue-layout solution. It appears as an animated illustrated card only when the briefing opens; no initial campus request.

## Validation and local evidence

See final handoff for exact completed test totals and commit. Focused new browser scenarios cover actual outside arrival → forward entry → Mara, lazy art, all image/caption beats, Skip/Replay, accepted progress, reduced motion, returning practice and unrestricted optional activity access. Existing Market agency scenarios cover trial comparison, reflection, full $18 payment, purchases and celebration on desktop/simulated phone. Guest-first regression protects old browser saves and fresh guest reload.

Local-only screenshots are copied to task-2/evidence; the original supplied screenshot is `before-user-market.png`. After images cover 1280×844 and 390×844 arrival, inside gate, all briefing beats and accepted-shift panels. No screenshots uploaded to Library. Native Chrome uses isolated automated profiles, not the user's game tab. Physical phone and full hosted CI not claimed.

Final validation: 123 unit tests and coverage pass; development checks pass; 244 staged release hashes and 65 reachable modules pass. Nine distinct native-Chrome browser scenarios pass across the final scoped runs: two actual Market desktop/phone scenarios, reduced-motion/autoplay/pause/returning-practice/optional-access/teacher-link scenario, four existing Market mechanics scenarios, fresh-guest/save-preservation scenario, and verified-account persistence scenario. Final scenario run after the split-view and enlarged panel lettering passes 4/4; prior mechanics run passes 8/8. No full CI or physical-phone claim.

Built-in imagegen final prompt:

> Use case: stylized-concept. Asset type: transparent cutout for a playful school campus game briefing. A funny exaggerated tightly packed huge lunch-rush crowd of about 24 diverse hungry young adult market customers, expressive friendly faces, several holding smartphones with blank screens and eagerly looking at steaming takeaway RICE BOWLS held by some people. Stylized polished low-poly 3D cartoon characters, matching a warm educational 3D campus game, teal blue ochre muted palette, soft daylight. Wide clustered composition, full silhouettes, no background or floor, actual alpha transparency, no signs, no readable text, no logos. Affectionate comedic anticipation, nobody angry or distressed. Keep all people and bowls inside image edges. This is an illustrative comic exaggeration, not a queue layout solution.

The game uses the JPEG as a rounded illustrated postcard so alpha is not needed at runtime. Original PNG is retained locally.

Final phone screenshot inspection found the existing interaction-button/minimap overlap. Scoped Market CSS moves the interaction button above the map; a rectangle assertion covers this at 390px. All original map functions and visibility preferences remain.
