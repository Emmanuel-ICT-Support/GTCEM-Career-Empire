# Bounded photo handover and avatar test triage

Based on PR57 head `2eaafa4082042731fce1c25ecf8a54f2bd49f46a` in the isolated ECC checkout. PR57 remains draft; this repair is local pending the next focused release decision.

## Game changes

Photo Continue previously closed its review before awaiting the wallet summary and lazy tour module. The review now stays visible with a disabled "Opening your campus tour…" button until the tour is ready. A failed module load retains the actual photo and re-enables Continue. Each retry uses a new module URL because a browser retains a rejected module import. The handover is marked seen only when the tour can start.

After choosing Sprout, the first tour beat previously kept its old action/copy while the selected GLB loaded. The tour now says that Sprout is getting ready and that the student may skip while it prepares. The next beat still waits for the real selected model; no ready flag, movement gate, reward or deadline is fabricated.

The original photo, eight tour beats, earned-money calculation, Market/Admin curriculum and paid gates, selected-only helper loading, eight primary avatars, wardrobe choices, startup geometry, opening video and map are retained. No Market curriculum redesign or icon integration is included.

## Focused verification

- Five native Chrome journeys passed in one 3.2-minute run: actual Sprout town and Market rendering; canonical no-query intro Skip with real keyboard movement; the full photo/tour/Flyover/Market journey; Dress ups at 1280 and 390 pixels.
- The photo journey deliberately holds the lazy tour module, verifies that the review remains visible, returns HTTP 503 once, verifies the retained-photo retry UI, retries successfully, holds the selected Sprout model, verifies preparation feedback, then completes the real controls. Reward assertions still require each destination reward once.
- Two additional native focused reproductions passed: held photo/tour and selected companion preparation, plus town menu selection and active camera/frustum/frame evidence. Screenshots show the actual Sprout beside the player. The original production visibility test also passes without changing its frustum assertion.
- Thirteen route/wallet units and eight archived-profile/wardrobe units passed (21 tests, four files).
- Changed runtime modules pass syntax checks. The project source check passes using a temporary read-only link to the original checkout's Assets folder, removed immediately afterwards; the sparse checkout omits that unchanged folder. The staged release manifest is checked separately against Git bytes.

Private browser evidence is under `coverage/post-photo-tour/handover-release-focused/` and `coverage/post-photo-tour/handover-native-patch/`. It is not published.

## Test assumptions corrected separately

The immediate intro shell precedes the lazy game DOM. The canonical test now awaits an actual ready entry frame and proves real keyboard movement before reading the helper/clue DOM. Its existing 30-second entry and ten-second movement deadlines remain bounded, and the old trail storage assertion remains intact.

The Dress ups "expected 3, received 6" failure was **a total-GLB request-count race**, not a three-versus-six garment-option mismatch. Campus assets continue streaming after Studio is usable. Its selected-only assertions now count the actual character/wardrobe asset paths, retaining the lazy Test characters catalog assertion and unchanged labels, options, individual colours, Undo/Redo and saved-style checks. No garment choices were reduced.

## Remaining release blockers and evidence limits

CI run 38496584315 on the previous exact head completed with source/unit and all seven critical journeys passing, and 158/228 full browser cases passing / 70 failing. This local run is focused evidence, not a new full-CI pass.

The hosted software-renderer Sprout visibility failure remains unresolved. Local software WebGL did not reach the existing 30-second entry-ready gate in the one valid full-world visibility reproduction, so it never reached Sprout selection. Earlier private attempts stopped at errors in the read-only lazy-initialization probe; those errors were corrected and are not classified as game defects. An isolated software renderer successfully loads and visibly draws the supplied Sprout at the intended 0.84-unit height. Native town/Market screenshots prove those views work on that renderer only; they do not establish a hosted software pass. No speculative helper normalization, culling or camera patch is included.

Both strict initial rear-building visibility cases fail against exact published `e88724dc` as well as PR57. This is still a real unmet user requirement and an explicit next repair. The Media/SPACE thresholds and scene are retained; baseline status does not waive visibility acceptance.

The remaining browser failures have been inventoried, not individually repaired or declared baseline. No further full-suite run, push, merge, deployment, auth/backend work, credentials change, historical branch restore or icon integration was performed for this checkpoint.
