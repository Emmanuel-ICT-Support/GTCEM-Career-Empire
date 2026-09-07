# Career Empire playable-3d (EST District review)

Static Three.js town + Avatar Studio review build (from local `127.0.0.1:4186`).

- Avery default: **Bald Tripo base (segmented)** → `assets/player-bald-base.glb`
- Modular Body A / Body B kits unchanged (`avatar-a.glb` / `avatar-b.glb`)
- School-safe: three / rapier / lucide vendored locally (no CDN)

## Open locally

Serve this folder over HTTP (ES modules need a server), e.g.:

```sh
npx --yes serve -l 4186 .
```

Then open http://127.0.0.1:4186/

EST Prep `/existing/` module only works when the full Megatrends game root is also available; town walk + studio work standalone.
