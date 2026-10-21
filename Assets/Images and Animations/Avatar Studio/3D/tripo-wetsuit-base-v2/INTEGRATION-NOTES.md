# Tripo interim → Career Empire integration notes

## Tripo export status
- Tripo GLB exported; **hair still baked** on the mesh (not a separate hair layer).
- **Idle** and **walk** animations are present (Mixamo-style bones).
- Playable interim file: `out/neutral-wetsuit-base-v2-HAIR-rigged-idle-walk.glb` (also copied to `viewer/player.glb` for local QA).
- Local QA: open `viewer/index.html` (Three.js orbit + WASD; height normalized to ~1.7 m).

## Live playable-3d (do not overwrite)
- Live map: https://career-empire-3d-blueprint-v2.taniabyrnes.chatgpt.site/playable-3d/
- Loads `./assets/avatar-a.glb` and `./assets/avatar-b.glb` via `characters.js`.
- Those kits use **Blender bones** (`head`, `forearm.L`, …) plus **material slots** `Skin` / `Hair` / `Eye` / `Top` / `Bottom` / `Outer` / `Jumper` / `Shoe` and `userData.slot` variants.
- **DO NOT overwrite** those avatar kits with the Tripo Mixamo mesh — bone names, slot materials, and variant `userData` will not match Avatar Studio.

## Recommended paths
- **Town walk only:** use a **simplePlayer** path (drop Tripo interim as a standalone walkable mesh; normalize scale/origin). Keep Avatar Studio on the existing Blender-bone kits.
- **Megatrends drop** (when Mac is online): place under `Avatar Studio/3D` or `Career Empire World/3D/avatar-base` for further DCC / pipeline work — not as a direct replace of `avatar-a` / `avatar-b`.
