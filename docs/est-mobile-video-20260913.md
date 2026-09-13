# EST mobile playback repair — 13 September 2026

User request: diagnose and minimally fix the existing EST film on phones, preserving desktop and design. Owner: EST repair task. Scope: playable-3d/est-wall-video.js and its import cache keys, focused regression coverage. Existing campus rollout is concurrent and preserved.

Canonical game inspected at 1ff0ece; GitHub main d442671. Live and local wall-video implementation match. It fetches the whole 18,186,474-byte film into a Blob, then awaits metadata before calling play; this loses direct user-gesture execution on cold playback and adds a full-download/memory dependency. Existing playsinline is correct. HTML video is moved into the cinema dialog and also supplies a Three.js VideoTexture.

Asset: Assets/EST Preparation/est-lab-systems.mp4?v=8d78d63b4a0d. H.264 High level 3.1, 1280x720, 30 fps, 8-bit full-range 4:2:0, AAC-LC, 60.053 s, 2.423 Mbps. moov precedes mdat (fast start). Live GET Range bytes=0-1023 returns 206, video/mp4, correct Content-Range and permissive CORS. No path/case or encoding failure found.

Plan/checklist: retain original media bytes and visual design; use direct native streaming; call play synchronously in tap handlers; retain pause/restart and cancellation; test cold playback, range seeking, sound and return/reopen on desktop and WebKit as available. Log browser screenshots and exact test limits. Update canonical AGENTS/handoff and game documentation at close. No publication claimed; coordinate through this record so the concurrent campus release preserves the fix.

Policy evidence: https://webkit.org/blog/6784/new-video-policies-for-ios/ — sound playback must directly follow a user gesture; playsinline enables inline iPhone playback. Muting is not required for explicit tapped playback and would change existing sound behavior.

## Implementation and results

Removed full fetch/Blob/object URL and asynchronous metadata gate. Preparation now asks the native video for metadata once; Play and Restart call native play synchronously. Failed loads can reload on the next tap. Pause no longer has a pending download continuation that could start playback later. Preserved playsinline, audible user-requested playback, Three.js VideoTexture, cinema controls, original poster and exact film bytes. Cache keys updated through world.js, app.js and index.html.

Four focused player regression tests pass. Final project unit run passes 14 tests (including concurrent campus tests); project source check passes. Initial test used the Node test runner and was corrected to the repository's Vitest runner; initial failure retained. Full CI passed unit/coverage stages but all browser scenarios stopped at Chromium launch with macOS permission 1100, before app assertions. Existing EST browser regression now also checks native URL, inline playback and unmuted sound; its complete seek/document flow remains unexecuted this run.

In-app browser: desktop playback reached 0.469588 s unmuted; Restart reached 0.000113 s and continued playing. At 390x844, the film rendered and controls remained visible; restart returned to the first system scene, Back to hall paused at 28.783836 s, and reopening resumed playback. Screenshot: private/production-evidence/2026-09-13/est-mobile-video/phone-playback.png. This is a desktop Chromium viewport check, not iOS emulation. Attempts to automate the native seek control were unavailable; live HTTP range support was independently verified. No WebKit runtime is installed; physical Safari/phone acceptance remains open.

No conversion is required by the observed codec/container. If a particular device later proves incompatible, make a separate derivative without overwriting the original: ffmpeg -i input.mp4 -c:v libx264 -profile:v high -level:v 3.1 -pix_fmt yuv420p -vf scale=1280:720 -r 30 -crf 20 -preset medium -c:a aac -b:a 128k -ar 48000 -movflags +faststart output-mobile.mp4 . Recheck colour-range conversion, captions, duration, audio and seeking before changing the asset path. No derivative was created in this repair.

The legacy modules/est-prep hero player is a separate HTML/chapter implementation; the reported 3D phone app uses the wall-video implementation above. No legacy chapter redesign or curriculum change made.

## Release handoff and phone check

Local fix only; no push/publication in this task. The concurrent campus release must retain the repaired wall-video module, its cache keys and tests, refresh its manifest from final source and verify served bytes. Existing environment edits were not reverted or staged by this task. Physical phone: after verified publication, reload the game, enter EST Prep and immediately tap Play on a fresh session; verify picture and sound, pause/resume, seek forward/back, Restart, full screen, documents/back to film and Back to hall/reopen. Repeat on mobile data and after returning from a backgrounded app. A local preview does not update the live phone app.

Closing documentation validation: generated exports match canonical records. Blueprint impact tests: 12 pass, one blocked by the pre-existing stale AGENTS.md release review hash; no review receipt refreshed without a final release review. Start scan: 10 folders, zero in-registry coverage failures, 169 pending intake observations and 10 pending changes. Closing scan requested; its result is recorded separately. Concurrent campus edits continue, so the scoped source receipt is a dated snapshot, not a final publication manifest.
