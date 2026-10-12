# Lightweight startup exteriors

Isolated source candidate atop2c29a24. Port8910preview and user'stabs unchanged. No browser/GPU job; releaseowner retains testing slot.

Cause: entryOnly skipped addSurroundings, which owned both the oval and market exterior along with heavier Media/SPACE/decorative trees. entryReady therefore did not imply these outdoor landmarks existed. Full loading occurred after Chapel or northward travel only.

Split the exact existing market-shell construction into createMarketExterior. New addExteriorLandmarks creates that shell at43,-26, the original129-point oval outline centered-4,-54, and original1939 continued2-unit grass tiles, sharing the current grass material even before image arrival. Entry integration creates this layer immediately. Full addSurroundings reuses it and adds the unchanged heavier surroundings, avoiding duplicate market/ground/oval. Original market signs now appear during entry through an idempotent helper. Original market footprint collider moves to early setup with a once-only guard, so visible walls remain solid.

No new artwork/model downloads or activity imports. Media/SPACE detail, gardens, decorative packed eucalypt, interiors, night-market activity/characters and teachers remain on their existing deferred paths. Existing guest/auth storage, trail checkpoints, access guards, map/Stats and movement remain unchanged. Existing buildings may still occlude distant landmarks from a particular ground-level camera; this restores instantiation rather than promising every place appears in one view.

130units/source checks pass. New units verify existing market placement, exact oval bounds129vertices,1939 shared-material ground tiles, placeholder compatibility, idempotent repeated setup, and no decorative eucalypt objects. These units use real bundledThree geometry with browser import wiring adapted toNode; static batching is isolated for geometry assertions. Runtime visuals/network/physics combined acceptance is pending releaseowner's sole browser slot; no public deployment or fullCI claim.
