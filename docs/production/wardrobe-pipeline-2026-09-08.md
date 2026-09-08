# Wardrobe pipeline and Tripo shirt fitting — 8 September 2026

## Verified local work

The supplied `white+dress+shirt+3d+model.zip` was preserved under the blueprint's private production evidence/shirt-source directory before extraction. It contains a textured FBX dress shirt with a teal tie. No generation, rerigging purchase or credit use was performed by this workflow.

The existing player is the 41-joint Tripo avatar with the `preset:biped:walk` clip. The shirt has been fitted to this rig in Blender 5.2.1. The garment was generated with sleeves down, while the avatar bind pose has arms extended. A simple scale plus nearest-vertex transfer produced shoulder and sleeve failures. Those trials are rejected.

Current recipe: identify lower sleeve regions by connected geometry, blend the transition over the shoulders, fit in the avatar's rest pose, recompute imported custom normals after deformation, transfer weights from a temporary combined torso/arm mesh using nearest face interpolation, smooth the transferred weights and bind to the existing armature. Original arm faces covered by sleeves are masked in the dressed export only; original source files are retained. The torso base is excluded from the dressed export. Inspect cuffs, shoulder folds and rear hem from multiple angles during the complete walk loop.

Reproducible recipe: `fit-tripo-shirt.py` in this directory. It currently expects local workspace inputs and must be run from the consolidation workspace. Review files are in its `outputs` directory. A successful file export does not by itself establish game readiness. Do not replace the live player without the animation and browser checks recorded below.

## METATAILOR research: facts versus recommendation

Official sources checked 8 September 2026:

- [Tripo METATAILOR bridge](https://www.tripo3d.ai/blog/metatailor-x-tripo): clothes/accessories can be passed from Tripo to METATAILOR for avatar fitting; the announcement describes a beta integration with compatibility limitations.
- [METATAILOR FAQ](https://www.metatailor.com/faq): custom avatars and wearables supported; its technical FAQ says no Mac version currently. It describes rigged dressed FBX export. General and technical FAQ statements conflict on glTF availability, so use FBX as the planned interchange and confirm installer capabilities before any commitment.
- [Pricing](https://www.metatailor.com/pricing): free plan lists auto-fit, automatic skin weights, unlimited avatar/asset imports, three outfit save slots and five FBX exports/month. Pro is listed at $35/month or $336/year. No subscription was purchased. Commercial-use entitlement must be checked for the selected plan rather than inferred from export availability.

Recommendation: METATAILOR merits a single free fitting/export trial on a supported Windows computer if one is available. Use this existing shirt and existing avatar, not new paid generations. Acceptance requires that the original skeleton and walk survive FBX -> Blender -> GLB, clothing remains fitted throughout walking and no body parts disappear unintentionally. The Tripo bridge is a connector to a separate application; it does not establish Mac support. Do not pay for a plan until the round trip succeeds.

## Repeatable wardrobe production

1. Keep a canonical, unchanged avatar body and skeleton, plus source clothing files. Fit each garment once to that body.
2. Separate garment fitting from weight transfer: transfer attaches movement; it does not resize clothes or resolve overlapping fabric.
3. Use fitted template meshes for shirt, trousers and blazer. Derive colour/crest variants from these templates instead of regenerating equivalent geometry.
4. Use clothing-specific body masks for hidden torso/limb areas. Never permanently remove covered geometry from the canonical unclothed/base avatar.
5. Store top, bottom, shoes and hair as named components sharing the avatar skeleton; keep rigid accessories attached to the relevant bone. An exported dressed character is a test milestone, not yet the modular wardrobe system.
6. Check idle, complete walk loop and representative bends from front/side/back. Then check materials, bounds and movement in Three.js. Preserve the earlier live player for rollback.
7. Only after one outfit passes should additional wardrobe components be processed in batches. No paid asset generation is authorised.

## Current acceptance record

- Local Blender rendering: front walk samples at frames 1, 18 and 36; side and rear review performed.
- Shirt design preserved: white fabric, existing collar/button details and teal tie.
- Earlier failures: procedural substitute and naive nearest-vertex fit rejected.
- Live deployment: this record does not claim the new shirt is deployed.
- Modular garment switching, alternate body fits and facial expressions: not implemented by this shirt trial.

Additional validation: the initial dressed GLB loaded in the local Three.js game via a test-only asset substitution. Town position changed from [2.55,0,17] to [2.554,0,14.786], the runtime exposed walk and idle actions, and there were no browser page errors. This validates a local preview, not a live deployment. Subsequent fitting aligns sleeve cross sections to the actual forearm/wrist centres and limits cuff influence to the wrist bone; body/hem vertices are excluded from that assignment. Imported custom normals must be reset after fitting: leaving them unchanged caused misleading hard seams and apparent tears. The final exported file and editable packed Blender source are `outputs/avatar-uniform-shirt.glb` and `outputs/avatar-uniform-shirt.blend` in the consolidation workspace.

Final local round-trip check: corrected GLB loaded in Three.js with no browser page errors; Avatar Studio screenshot saved as `outputs/uniform-shirt-game-test.png`. The prototype remains unpublished. Front cuff fit improved, but rear wrist intersections and shoulder contour still need artistic cleanup before final wardrobe acceptance. This is a working fitted prototype, not a claim of a finished production outfit. No credits were spent.
