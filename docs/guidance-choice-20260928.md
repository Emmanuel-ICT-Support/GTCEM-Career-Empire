# Optional guidance — 28 September 2026

Tania approved an opening choice after student feedback about creature companions. Based on live bc954a9 (PR41), preserving travel fixes and separate unpublished opening-opportunities work.

## Behaviour

The first screen asks “How would you like to find your way?” with No companion, Friendly creature, and Phone / journal. No companion is initially selected. All modes share the existing next steps, documents, Avatar Studio and Market guidance and saved task progress. Help/Journal/What next? opens it on demand in the town. Guidance options changes the presentation later. Journal is a screen panel, not an additional 3D prop.

Friendly creature opens the existing seven portrait choices: Echo, Sprout, Moss, Bloom, Spark, Pax and Atlas. Only the committed creature is fetched after Continue; no creature model is loaded for No companion or Phone / journal. Switching away aborts/disposes the selected model and suppresses the fallback creature. No global preload, new artwork, model replacement, animation requirement or world redesign.

Preferences use ce-guidance-v2 per existing browser-local character. Existing ce-helper-v1 preference is retained and preselects that creature only if Friendly creature is requested. Returning characters receive the new choice once. Existing guide-task state is unchanged; preference is neither student identity nor assessed learning evidence. Unavailable storage retains tab-only behaviour and a notice. Missing creature files retain the existing Echo fallback/retry.

## Scope and recovery

Runtime: playable-3d/app.js, echo-guide.js, helper-model.js, helper-picker.js, helper-picker.css, helper-state.js, index.html and release-manifest.json.
Tests: tests/e2e/helper-fixtures.js, helpers.spec.js, guidance.spec.js; tests/unit/helper-state.test.mjs; guidance.playwright.config.mjs. Documentation: this file and the scoped AGENTS.md note. All seven GLBs and portraits are unchanged; original metrics remain in helper-selector-20260927.md.

Restore through the tested Git history, preserving separate local work. Reverting this change leaves the previous helper preference available. No account, server data, curriculum mapping, rewards, assessment, teacher visibility, supplier or deployment-target change. Course documents remain pending, as disclosed in the existing game.

## Validation and release

Initial scoped browser run: 12 passed (desktop/390px choices, zero-model modes, persistence, shared progress, Echo fallback, staged loading). Source checks and 92 unit/coverage tests pass. Mobile opening screenshot inspected. All seven additional creature checks pass: every model, missing-file fallback/retry, profile isolation, reduced motion, phone scrolling/keyboard, rapid replacement and denied storage. Final complete CI (including pending-download cancellation) is running. Release package verifies 210 exact hashes and 53 reachable modules; publication/public verification pending. Evidence is under evidence/guidance. Physical devices and student acceptance are not claimed.

Canonical Blueprint record: CE-CHANGE-20260928-98. The game release does not publish the separate Blueprint reader.
