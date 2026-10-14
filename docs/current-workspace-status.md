# Current Workspace Status

Last updated: 2026-09-11.

This repo currently has intentional work in progress across EST Prep, Initiative, avatar/media generation, and Remotion scenes. There are also many untracked generated/source media files, especially under `Assets/`, `remotion-est-scenes/`, and `exports/`.

Guidance for other Codex chats:

- Do not delete, move, compress, or rename media/source assets unless the user explicitly asks.
- Treat broad `git status` output as noisy; prefer targeted checks like `git status --short --untracked-files=no` or status for specific paths.
- `exports/` is generated output and is ignored to keep video/screenshots out of routine Git status.
- Separate future cleanup into deliberate chunks: EST Prep code, Initiative code, avatar assets, Remotion scenes, and generated exports.
- The local `main` branch may contain committed-but-unpushed work. Check branch status before assuming `origin/main` is the full current state.

This note is only a handoff aid. If it becomes stale, update it rather than expanding `AGENTS.md`.

11 September 2026: the current `/private/tmp/ce-avatar-release` game working copy now contains the clearer replacement EST Lab Systems film at `Assets/EST Preparation/est-lab-systems.mp4`. It matches `/Users/tania.byrnes/Desktop/Megatrends/Assets/EST Preparation/est-lab-systems.mp4` with SHA-256 `8d78d63b4a0db0b4629fcbf5374a4706caececfa7368568ab79e2a08c1ef20cc`. Existing EST Revision 3 controls remain the source of truth: immediate wall play, no autoplay, seek/restart, and in-window CORE/TERM/VTCS source documents. Local `npm run check` and focused EST wall-video Playwright checks pass; live publication and Blueprint receipt remain pending.
