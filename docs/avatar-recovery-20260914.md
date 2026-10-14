# Avatar loading recovery and student texture optimisation

Approved scope: steps 1–2 of the avatar plan. Base b0ffee210b2f7c9bb7b97cc5273bf08e41575e3e. All campus/visual and previous performance changes retained.

- `playable-3d/avatar-download.js` bounds the network phase, including response-body download, to 60 seconds with AbortController. HTTP errors reject promptly; deadlines are cleared after success/failure. GLB parsing follows the completed download. This is a download deadline, not a guarantee against a browser/GPU freeze.
- `characters.js` uses the bounded download for every avatar, preserves the per-body promise cache and clears failed entries before retry. No saved body substitution.
- `app.js` offers an in-place Retry button when the startup avatar fails. The world and renderer are retained; profile data is unchanged. General startup failures offer a page reload. Existing Studio selection retry remains available.
- `assets/player-schoolboy-2k-20260914.glb` replaces only the two embedded 4096px JPEG textures with 2048px high-quality JPEGs. Original retained. File: 3,670,640 to 2,999,076 bytes (18.3% smaller); texture pixel count 75% lower. Geometry, skeleton, animation, material definitions and non-image buffers are identical. Texture pixels are not lossless/pixel-identical; visual comparisons show no obvious degradation at arrival, full-body Studio and portrait zoom. Clothing, silhouette and motion are unchanged.
- Stable version keys updated for the changed modules; release manifest contains 91 exact files and 31 reachable modules.

Validation: 21 unit tests passed, including response-body timeout/abort, timer cleanup, HTTP failure and successful fresh attempt. Four native Chromium browser checks passed: failed startup recovery without navigation or profile changes; Home Base/Studio entry; normal startup without pixel probes; explicit visual diagnostics. All six avatars loaded, constructed and rendered using the revised loader. Arrival and Studio screenshot draw/triangle counts match the baseline. No sustained physical-device FPS or full hosted CI claim.

Private evidence and final release receipt are recorded in the Career Empire Blueprint under `private/production-evidence/2026-09-14/avatar-recovery`.
