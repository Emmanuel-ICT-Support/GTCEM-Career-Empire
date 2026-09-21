# Dress ups and game entry loading

The body choice previously labelled “Wardrobe base” is now “Dress ups”. Its saved identifier and all existing character profiles are unchanged.

A fresh public normal-game opening was observed at 150.1 seconds, versus 7.8 seconds on cached reload. Requests confirmed only the active avatar and worn clothes downloaded; unused wardrobe and avatar alternatives were absent. The campus waterfall delayed crest, glass, trees and shared building textures behind earlier batches.

Normal game entry now starts independent campus and courtyard downloads together and preloads the rendering engine modules. Artwork, geometry and desktop/phone asset choices are unchanged. Direct Studio entry continues to defer the landscape until Town is selected. Failed landscape prefetch falls back to the existing guarded scenery loader. Avatar/clothing requests with no response headers retry once after 12 seconds, within the existing overall 60-second download budget. Manual retry remains available.

Verification: 40 unit tests and 17 focused native Chromium scenarios passed, covering normal desktop and phone entry, active-only avatars, deferred Studio loading, saved characters, recovery and wardrobe controls. The local test server now accommodates concurrent module requests; a captured full-suite failure had been an HDRLoader module connection reset. This test-server change is separate from production loading improvements. Full-suite and live follow-up receipts are recorded in the canonical Blueprint under CE-CHANGE-20260921-77.

The initial wardrobe release is live in PR #25, merge 3a2e83c77c407a87f1f1eafb21a3ef7201c5d5fa; all 152 downloaded public hashes matched. Its live Chromium checks passed; one Safari clothing request stalled, motivating the bounded retry above. Do not infer physical-phone or classroom acceptance. Tania will perform the physical-phone check.

Full CI was attempted: source/manifest checks and all 40 unit/coverage tests passed; the browser run recorded 20 passes before an older 2D Girl wardrobe test exceeded its context-teardown timeout (37 not run). No assertion failure in the new 3D flow was reported. This is not a full-suite pass. The isolated legacy rerun and final live results are retained separately.


## Final live verification checkpoint

“Dress ups” was visibly confirmed selected under Identity > Body in the actual live in-app browser. Existing user profiles/tab were not saved or modified. Pages and all 152 public hashes pass. Live Safari-engine Studio checks: 3/3 pass, desktop first frame 5.652s, phone-size first frame 3.908s. Normal-game Safari-engine checks: 2/2 pass; desktop cold 11.416s/cached 7.722s, phone-size cold 12.880s/cached 16.705s. These are measured browser runs, not physical-device guarantees.

Chromium fresh-network checks remain inconsistent: three Studio navigation load-event timeouts, normal-game desktop avatar timeout, phone cold 60.94s/cached 2.60s. Preserve both sets of evidence; do not generalise Safari success into cross-browser readiness or treat Chrome timing as unused wardrobe downloads. No full hosted CI, physical-phone or student acceptance is claimed. The rename/publication request is complete; loading reliability remains open. Exact receipts: canonical Blueprint private/production-evidence/2026-09-21/wardrobe-release/receipt.json.
