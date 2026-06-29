# Current Workspace Status

Last updated: 2026-06-29.

This repo currently has intentional work in progress across EST Prep, Initiative, avatar/media generation, and Remotion scenes. There are also many untracked generated/source media files, especially under `Assets/`, `remotion-est-scenes/`, and `exports/`.

Guidance for other Codex chats:

- Do not delete, move, compress, or rename media/source assets unless the user explicitly asks.
- Treat broad `git status` output as noisy; prefer targeted checks like `git status --short --untracked-files=no` or status for specific paths.
- `exports/` is generated output and is ignored to keep video/screenshots out of routine Git status.
- Separate future cleanup into deliberate chunks: EST Prep code, Initiative code, avatar assets, Remotion scenes, and generated exports.
- The local `main` branch may contain committed-but-unpushed work. Check branch status before assuming `origin/main` is the full current state.

This note is only a handoff aid. If it becomes stale, update it rather than expanding `AGENTS.md`.
