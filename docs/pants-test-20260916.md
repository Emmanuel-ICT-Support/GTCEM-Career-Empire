# Pants outfit test release — 16 September 2026

Tania explicitly requested: “ok upload into the game lets test”. Continue the inspected corrected GLB, preserving pants and hems. Source base is current game main 03d6eaa15029615156328f1fd3367d8f4b67088b, including latest courtyard removals.

Added `pantstest` as a separate simple-body option, labelled Pants test. Loads the exact corrected GLB (SHA-256 2d5d3cb7db44aab51b70717f6638b2dedee56145897bd133eebcf6db043c9845), uses authored 1× walk speed and existing 1.7m normalization/frozen idle. Existing default remains School student. Existing legacy/matching avatars remain available.

`?outfit=pants` opens an unsaved Pants test draft in Avatar Studio. Saved profile changes only on Save & return. Style explains that clothing changes are unavailable for this fixed outfit. All five meshes stay visible even if previous profile has outer=none; the body mask must never be exposed by hiding pants. This proves complete dressed-avatar use, not universal clothing or body compatibility.

Validation: 35 unit tests and development source checks pass. Desktop Studio opening, turn, walk toggle, save to town and reload tested. Additional mobile/source/live verification recorded in release evidence. No physical-device performance certification or final appearance acceptance claimed. Original GLB and current game scenery preserved.

Publication is authorised; pending upload/live receipt. Canonical evidence: private/production-evidence/2026-09-16/pants-game-release. Public Blueprint reader publication remains separate.

Final local verification: 35 unit tests, source checks, 93 manifest hashes and 31 modules pass. Desktop and 390px Studio views rendered; unsaved opening, walk/turn, protected pants-on, save to world and reload checked without captured script errors or failed responses. All five outfit meshes stay visible with outer=none. Publication authorised; live receipt pending.


## Separate pants workflow release — 19 September 2026

Tania explicitly approves live publication of the proven Avatar Studio workflow. Pants test now loads the exact walking base and EveryWear pants as separate GLBs, binds the garment to the base bones, and offers Style > Pants On/Off. Full body remains intact. Native walk and front/rear/toggle behaviour were checked locally; rear waist/seat fit and knee/ankle folds remain known limitations and are disclosed in Studio. This is workflow acceptance, not final garment-fit acceptance. Preserve prior assets, newer game changes and all unrelated work.
