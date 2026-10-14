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

### Startup loading

Only the saved active body's GLB is required at startup. Avatar Studio fetches other
bodies on selection, shares in-flight requests, and caches successful loads for
profile changes and undo/redo. Failed body downloads can be retried; saving waits
until the selected body is available.

The town exterior, all six existing plaza textures, physics, and active body load
concurrently. The initial plaza keeps its existing textures, geometry, lighting,
and phase appearance. EST interior downloads when the player comes within seven
world units of its entrance, or explicitly enters. Entry waits for the hall asset;
failed requests can be retried. A later hall load applies the current world phase.

Regression coverage: `tests/e2e/playable-startup.spec.js` checks startup requests,
saved body selection, studio changes/undo/save, hall entry, caching, and retry.
