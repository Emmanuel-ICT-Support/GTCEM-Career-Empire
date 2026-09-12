# Combined approved world — 11 September 2026

Tania: ok lets do that and lock it in. Assemble accepted atmosphere/grass, SPACE/Media/oval and outdoor camera into one playable version. This is the previously agreed combined integration step; no additional buildings, wardrobe or curriculum features.

The runtime now loads production copies of the accepted surroundings modules and texture files from environment/, preserving original approval snapshots in world-preview/. The environment adapter copies accepted sky, lighting, grass tints and original-pivot plant scaling. It wraps the existing phase behaviour rather than replacing gameplay state. Extended grass shares the original material so all stages match. Studio/interior exposure and specialised cameras retain previous values. The accepted outdoor follow camera is retained; the town aerial camera frames the combined campus.

The non-enterable Media footprint meets the original playable boundary, so an oriented collision block prevents walking through it. The walkable boundary itself is unchanged: the outer oval and SPACE remain visual surroundings. This integration does not claim new enterable destinations or an expanded playable school. Accepted model architecture/materials/orientation remain as selected. Original approval files are unchanged.

Verification covers desktop and phone stage switches, matching old/extended grass material and tints, both new buildings loaded, aerial view, walking, camera turns, Studio approach/save/reload, EST/Chapel entry and returns. Separate focused checks cover media playback/document controls and the new collision boundary. Test-only scene probes are browser-injected and are not shipped. Screenshots, source snapshots and checks are retained under private/production-evidence/2026-09-11/combined-world/.

Lock this as a local source checkpoint after checks. Keep prior public release receipt and manifest historical; no public release is claimed. Current remote CI/private cloud backups are not inspected in this integration. Wider building work remains paused. Global refresh remains incomplete.


## Recovered omitted review steps and Home Base correction
Recovered from Design ECC Campus Hub task 01a08a33-c916-7c40-acea-18b13a26bacd, turn 01a08b3e-3170-7ce2-8cc3-3128f44d9647: campus edges soften abrupt lawn boundaries, materials/planting form a consistent palette with less repetition, and arrival composition strengthens the first ECC welcome/Chapel view with clear paths and less clutter. Later five-pass plan folds arrival composition into every pass. AGENTS stage-lighting notes explicitly defer smooth stage blending to integration. These were not completed by merely integrating static presets. Correction: retain these remaining checks as open before final combined lock/release. Previously accepted assets remain accepted.

Tania additionally corrects Home Base: return to the actual WELCOME TO ECC sign, not Avatar Studio. Home Base now returns to (-3.2,-1.7), south of the welcome sign at (-3.2,-4.6), facing the sign and admin/Chapel. Avatar Studio remains its own button and physical entrance; unsaved-change protection retained. Desktop/phone destination and Studio save-return checks passed.

Combined checks passed on desktop/phone: stage material parity, buildings, camera/movement and Studio persistence; focused EST play/seek/restart and all three source documents pass. Home Base welcome return and independent Studio save-return pass. Final welcome camera angle clears the existing foreground tree. Dev check passes; Blueprint suite passes (74 tests). This is a saved intermediate combined checkpoint, not a final environment lock: recovered blending/edge/material/arrival work remains open.


## Walkable oval and tree edge — 12 September 2026
Tania requests walking on the football field and trees around the oval edge, following the aerial. This supersedes the previous visual-only oval boundary. Outdoor physics ground now matches the existing continued grass rectangle, with an inset walking boundary. The route across connecting grass and oval is open. Existing Media collision is retained; SPACE, its rear foyer, Home Economics, goalposts and new tree trunks have collision. Thirty-three reused eucalypts form a staggered western/southern belt outside the playing line, scaling with the approved development stages. Architecture, orientation, glass/mural assets, indoor limits and banked world-preview sources remain unchanged.

Local desktop and phone browser probes exercise actual movement physics from the original arrival area across connecting grass to the oval centre; west/south bounds, ground height, SPACE frontage and Home Base welcome return pass. Local source checks pass. Test-only probes are not shipped. Screenshots and results: private/production-evidence/2026-09-12/walkable-oval/. Visual reference is the supplied aerial, interpreted compactly rather than surveyed. Wider material/arrival polish and smooth stage transitions remain open. No publication, remote CI or new global-refresh success is claimed.


## Mobile play area — 12 September 2026
Tania reports the Find your place and other panels crowd the phone play area. Phone and short-landscape layouts now collapse guidance and view/phase settings into 44px buttons, open at most one card, and collapse on scene/movement/destination interaction or Escape. Header/location are smaller; redundant footer labels are hidden on phones; walking buttons are enlarged to 44px; destination bar respects bottom safe-area. The 600px minimum scene height is removed on phones so short displays keep controls on screen. Desktop cards remain expanded. Added mobile-play.css/js; no camera, world assets or gameplay physics changes.

Verified through the in-app browser at 390x844, 320x568 and 844x390: panels and movement/destinations remain inside viewport, guidance toggles, settings replace guidance, Growth selection works, movement closes cards, Home Base returns to the welcome sign. Browser size restored after checks. Source syntax/dev check passes. These are desktop browser viewport checks, not physical iPhone/Android testing. Local candidate only; remaining world polish and publication gates stay open.


## Authorised phone review release — 12 September 2026
Tania explicitly requests publishing this campus/mobile candidate to the live game for phone review. Public main was verified at f436726, an ancestor of candidate da7b9cb. Publish to Emmanuel-ICT-Support/GTCEM-Career-Empire; this acceptance does not complete remaining world polish. Prior manifest retained in docs/pre-mobile-release-manifest.json.


## Touch-and-hold movement fix
Tania reports holding an arrow selects it as an item. Disable WebKit selection, touch callouts and dragging across movement buttons and decorative SVG descendants; route icon pointer events to buttons, suppress native contextmenu/dragstart/selectstart. Existing pointer capture, held movement and release/cancel logic retained. Source checks pass; physical-phone confirmation pending.


## Phone thumb joystick
Tania accepts the proposed joystick. Mobile and short-landscape layouts replace arrows with a 120px captured-pointer joystick, 12% dead zone and proportional speed. Diagonal input is capped at walking speed. Release/cancel/lost capture, blur/visibility, resize, screen/destination and modal entry reset input. Desktop arrows and keyboard remain. Browser phone-size drag verified diagonal travel, centred inactive knob after release and Home Base welcome return. Physical-phone review pending.
