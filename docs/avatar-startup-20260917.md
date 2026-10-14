# Saved-avatar startup and lazy Studio — 17 September 2026

CE-CHANGE-20260917-71. User explicitly requested inspection and the smallest safe implementation, preserving unrelated work. Local implementation and tests complete; not committed or published. Existing September 16 pants-game checkout retained, HEAD 11e0593a925e921e14e14c9c234c72a11d9a8749. Pre-existing AGENTS and pants-test documentation edits retained. No original visual/model assets changed.

## Inspection and decision

loadProfiles restores activeId from career-empire-3d-profiles-v2-tripo; missing/invalid data uses existing starters. loadStartupCharacter already awaits only active().body. loadCharacterKit caches one selected GLB and clears failed downloads for retry. Alternate models already load on selection; no current warmAvatarChoices call. Normal boot is town, never automatic Studio. The pants URL intentionally requests an unsaved Studio preview.

The avoidable boot work was static OrbitControls loading and eager construction of the preview scene, floor, lights and shadows. Moved these unchanged into dynamically imported studio.js, requested only by setMode('studio'). Shared saved-profile validation metadata remains at boot because it is required to normalize the saved in-world avatar; there is no separate remotely fetched clothing catalog or thumbnail library in this path. Preview creation/editor DOM already happen on Studio entry. New mode-request guard prevents a delayed import from reopening Studio after the player returns to town. Studio resources are reused on later entries, and previews retain existing disposal behavior. Pants deep link now enters Studio before selecting its unsaved draft.

## Observed requests and checks

Seven native-Metal Chromium browser scenarios passed, no failures/skips: saved schoolboy, pants and modular Body A boot; change body and save; reload saved Body B; enter/exit again; delayed entry cancellation; pants preview; existing avatar download retry; existing Home Base/Studio route. Three saved-profile scenarios include a different inactive jacket profile: no inactive model requests occurred. Exactly one selected avatar GLB requested at boot. Neither studio.js nor OrbitControls requested before entry. Body B loads only after selection. No captured script errors in the three full saved-profile flows. 35 unit tests and development source checks passed.

Local unthrottled first-ready observations were 2158 ms (schoolboy), 2293 ms (pants), 2014 ms (Body A). These are local test observations, not a controlled before/after speedup, public-host speed or physical-device certification. Browser report: private/production-evidence/2026-09-17/avatar-startup/browser-tests.json.

## Remaining costs and limits

Startup still waits for complete campus scenery and environment integration, plus the selected model's download/decode/GPU work. Current GLBs: schoolboy ~2.9 MiB, pants ~4.2 MiB, jacket test ~50 MiB, Body A/B ~1.1 MiB each. A saved jacket avatar still needs that large file. Legacy A/B GLBs embed all garment meshes in the one rigged package: unused clothing geometry is still in that download, though hidden in-world. Splitting those model packages into independently loadable clothing is a separate asset-pipeline change; this patch does not claim that optimization. No new textures, outfits, camera appearance or world changes.

No deployment, hosted CI or physical phone test. The existing known Blueprint broad-validator failure is unrelated; scoped integration/export checks are reported separately. Next performance work should measure live network and campus setup independently, then target the measured bottleneck. Avoid assuming the recent pants change caused a new multi-avatar preload.

## Security/privacy impact and session closure

Synthetic browser-local profiles only; no real student data, database access, new providers, endpoints, analytics, permissions, authentication, roles, tenant access or retention behavior. Static same-origin editor download timing changes; no upload feature. Existing transport, residency, identity and isolation deployment evidence remains unverified and is not invalidated or promoted by this local test. All twelve impact answers and seventeen triggers are recorded in change-integrations.json. Existing ST4S source/deployment backlog remains open. Implementation is tested locally; productionComplete remains false. Canonical handoff/AGENTS and game AGENTS updated; source history retained.

## Closing validation
Scoped change-integration and security-impact validation passed; regenerated planning exports match canonical records. All 94 working-tree manifest hashes match (not a committed-release check). Both changed JavaScript modules parse and development source checks pass. Full Blueprint governance validation reproduces the inherited unknown field chapelInteriorPublication error; no full governance pass claimed.

## Publication authorisation
Tania explicitly requested push to live on 17 September 2026. Release branch is based on current main b780fe1c4ddf5fcb59edcbcf2b329149652c9e70, whose tree matches the tested pants source. Only the scoped startup files, test and documentation are included; unrelated existing edits remain unstaged. Live verification pending.
