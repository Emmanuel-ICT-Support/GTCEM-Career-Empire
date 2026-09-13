# ECC Admin glass signage — 13 September 2026

Supplied cleaned ECC crest replaces the Admin gable crest; front Emmanuel sign now uses translucent teal glass in the original frame, with subtle iridescence, polished edges and stainless standoffs. Matching glass face on the existing Admin fascia retains ADMINISTRATION wording. Building geometry/style, original structural fascia, welcome frame/base/location and colliders are preserved.

The requested modern campus reference informed the restrained cyan/teal finish, fine edging and integration with warm stone and blue steel. No building redesign or new mechanics.

## Exact implementation

- `playable-3d/ecc-preview/admin-signage.js`: physical glass materials, original-frame front panel, Admin fascia glazing, edge details, fixings, and both crest placements.
- `playable-3d/ecc-preview/assets/admin-signage/cleaned-ecc-crest-source.png`: supplied PNG copied byte-for-byte. It contains an opaque grey checkerboard; a rendering-only exterior mask removes that checker without repainting source pixels or removing the crest lettering. Original source file remains intact.
- `playable-3d/ecc-preview/authored-courtyard.js`: minimal integration replaces the two former crest planes and Admin label with the signage module. All concurrent window/material edits retained.

The front panel is 1.44 × 1.76 m inside the original frame. Top crest remains .71 × 1.01 m at its original position; front crest fits the glass face at 1.04 × 1.477 m. Glass is alpha-blended with environment reflection, clearcoat and restrained thin-film iridescence; it does not add a costly second full-campus refraction render. The first full-transmission experiment was replaced after local inspection. No extra glow lights.

## Evidence and checks

Actual courtyard, Home Base/oblique, aerial, phone (390 × 844), and phone Low/Growth screenshots retained in `private/production-evidence/2026-09-13/ecc-admin-signage`. Both supplied reference images remain there unchanged. Source receipt lists exact hashes and saved module copies. Geometry GLB equals approved rollout bytes; welcome position, obstacles and garden-bed declarations match the pre-task snapshot.

Source checks and all 14 unit tests pass. Browser scenery loads ready with no scenery errors; phone has no horizontal overflow. Existing Rapier initialization deprecation warning remains. These are local browser checks, not a full browser CI pass or sustained physical-device benchmark. Appearance acceptance remains the user's.

[Play the local courtyard](http://127.0.0.1:4285/playable-3d/?view=ecc-courtyard). Current signage is implemented in the actual playable repository; this task does not claim it live yet. The concurrent campus release owns deployment and must include the new module/PNG and refresh its source manifest. Initial monitor run found another scan lock; no lock removed or global refresh claimed.
