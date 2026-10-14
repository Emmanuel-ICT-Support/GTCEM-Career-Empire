# Two teacher NPCs on the oval — 17 September 2026

CE-CHANGE-20260917-74. Implemented and checked locally; uncommitted and unpublished. User supplied both models and explicitly clarified that the brown-haired teacher is Mr Middleton and the bald teacher is Mr Psandodakis, requesting BOTH. This resolves the earlier apparent mismatch and credit pause. The source filename is “Mr Psanodakis.glb”; the displayed name follows the user's prose “Mr Psandodakis”. The original reference belongs to Mr Psandodakis. Do not discard or replace Middleton.

## Behaviour
Both teachers use independent models, animation mixers and Rapier capsules in the existing town physics world; no extra world step/render loop, player profile or Studio option. Walking targets stay inside an inset oval centred (-4,-54) with radii (8,4); spawn positions (-7,-54) and (-1,-54). Speed .8 world units/s, occasional idle pauses, smooth walking turns and collision response against existing scenery, player and each other. Stalled movement returns to idle and retries a later target. Horizontal correction is limited to requested travel to prevent idle drift.

Click/tap a nearby visible teacher, press E for the nearby greeting or use the Say hello button. Teacher stops, faces the player, performs one reaction, pauses and resumes wandering. Further taps while reacting do not restart the clip. Mr Middleton cycles wave → laugh → look around (explicit user selection). Mr Psandodakis cycles nod → cheer → clap → dance, using his supplied clips. He has no idle clip: resting uses the neutral first frame of his nod animation, not a borrowed skeleton or fabricated moving animation. Longest dance is about 23 seconds; it plays once. Existing gestures/appearance are preserved.

## Assets and performance
Middleton source: 2,390,408 bytes, 23,776 triangles, one material, 41 joints, four animations and three 2K textures; SHA256 4d73dbaeea72056618171fb72dc0d459e4161ba9c491ddbe8bb822a6c7c29d4c. Game copy byte-identical.
Psandodakis source: 2,765,708 bytes, 24,486 triangles, one material, 41 joints, five animations and three 4K textures; SHA256 2f3cabc8dfe660a9cc4f7c66819570144319dc4d93e1b36fb66c92fe38651e3a. Game copy uses three 2K JPEG maps (quality 95); source geometry/accessor payloads, rig, nodes, materials and animations verified unchanged. Game copy is 2,839,440 bytes, SHA256 4b4f2d7e1a2e40ee713ac7b71cad051e3a0eb1fffca51cf0e38e920f6130f4e5. This reduces decoded texture pixel/GPU storage by 75%, not transfer bytes; original Downloads file preserved. GPU allocations/device speed not directly measured.

On-demand teacher module and sequential model loading start within 28 units of the oval after boot, never blocking initial playability. Each teacher failure is isolated; leaving and returning to the approach retries only missing teachers. No Avatar Studio or alternate player asset is fetched for NPC animation. Simulation/animation pauses outside town, hidden page and modal activities, and beyond 42 units. Original campus and player choices preserved.

## Validation and limits
Seven supplied reactions and repeat-click guard passed; five simulated minutes of both teachers wandering stayed in bounds, included walk/idle and maintained >.60m centre separation in the recorded run. An added blocking enclosure prevented escape. Maximum step about .01334m at 60Hz. Phone-size direct tapping, Studio pause/return, absence from player picker, ordinary-boot absence of teacher and Studio requests, and isolated failed-asset recovery passed without page errors. Full test receipts and screenshots retained privately. These are local browser/physics checks, not hosted CI or sustained physical-device performance. New regression scenario is tests/e2e/teachers.spec.js. No live publication or final visual acceptance claimed.

Local review: http://127.0.0.1:4273/playable-3d/?view=teachers . Individual viewpoints: view=mr-middleton and view=mr-psandodakis. Normal arrival remains unchanged.

## Security/privacy screening and continuation
Static staff names and user-supplied character likenesses are local game content; no student data, upload endpoint, real-time AI, dialogue service, chat, analytics, new third-party runtime, credentials, database, roles or tenancy changes. No external generation/upload or credits spent. Proposed distribution is the existing game's static asset origin; this task has not published it. Existing deployment/security/readiness gaps remain unverified. The current change record maps supplied-content processing and static download impacts to the WA baseline and explicitly keeps productionComplete false.

Next: review both actual in-game teachers, then perform a fresh release review against current remote game source and manifest before publication. Preserve unrelated game documentation edits and Blueprint work. Earlier single-teacher/mismatch/pause entries are historical. Both original GLBs and the reference remain unchanged.


## Final local verification
Saved Playwright regression passed on the final optimized assets (21.4 seconds): all seven reactions, repeat guard, two-NPC five-minute simulation, obstacle enclosure, mobile click, Studio pause, cold-start absence and isolated load retry. Minimum centre separation .624m in this run; both stayed inside the oval. All 35 existing unit tests, development source check, diff whitespace check and all 97 working-copy manifest hashes pass. Blueprint impact/integration entry and regenerated export parity pass. Visual close-up inspected for both supplied identities; no final user appearance acceptance, hosted CI, physical-device or public deployment claim. Local review link prepared in Codex.


## Teacher publication authorised — 17 September 2026
Tania explicitly requests “Publish to live please” for BOTH tested teachers. Release owner: this task, CE-CHANGE-20260917-74. Remote main b4b22db1f3a0a4f1174ade4fbc94205ce3d4e166 has zero file differences from the tested source baseline 6fb20d0, verified through GitHub comparison after local fetch failed with unresolved deltas. Publish only teacher runtime, supplied game assets, regression test and this release documentation; preserve unrelated work. Prior no-publication statements describe historical checkpoints. Deployment and live verification pending.
