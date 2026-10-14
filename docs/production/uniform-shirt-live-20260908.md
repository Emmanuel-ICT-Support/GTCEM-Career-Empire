# Uniform shirt prototype release — 8 September 2026

User explicitly requested publishing the locally reviewed shirt prototype. The Tripo player now loads `playable-3d/assets/player-uniform-shirt-20260908.glb`. Existing saved profiles with body `tripo` receive the shirt; Body A/B remain unchanged. Current scenery update 8fc60db is included.

The exported avatar contains seven meshes, one skin, 133,000 triangles and the original `preset:biped:walk` clip (123 channels). File size: 8,497,616 bytes. SHA-256: `a273dffe0c0fe189b631f4de1fa65b833c46ea2839f08dd13cabd9b8bf223736`. The shirt is fitted to the existing rig, not a new paid generation. Source shirt, editable Blender file and fitting recipe were preserved. No additional credits were spent.

Known prototype limitations: shoulder shaping and rear wrist intersections still need cleanup; this release does not introduce modular wardrobe switching or a new idle animation. The studio idle remains the existing static walk-frame fallback. Styling copy describes the displayed outfit accurately.

Rollback: restore the asset URL in `characters.js` to `./assets/player-tripo-20260908.glb`, restore the former outfit description and bump the app/character cache keys. The previous asset remains in the repository. Original source avatar geometry is preserved separately; covered arm faces are removed only in the dressed export.

Validation: fitted avatar previously passed local Three.js load/movement/Avatar Studio checks without page errors. Release checks passed: project validation, 6 unit tests with coverage, and all 27 browser tests, including startup, body switching, scenery and movement. Live verification follows the Pages deployment.
