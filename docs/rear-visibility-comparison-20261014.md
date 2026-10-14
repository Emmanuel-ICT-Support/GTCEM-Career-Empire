# Rear-building visibility comparison — 14 October 2026

Recommendation: keep the approved current view. Small lateral camera changes retain the original canopy and grounded height, but do not meet both strict rear-building thresholds. No game source or test assertion changed. Checkpoint9046e27 remains the tested gameplay baseline (66/70 historical cases verified).

## Screenshot options for approval

Use the settled current view for aesthetic comparison; initial capture has decorative textures still hydrating. Camera trials below are private renderer-only previews, not deployable repairs. Player position, all19trees and all geometry remain fixed; height stays3.185m (existing grounded follow-camera height), FOV55desktop/62phone. Only camera X shifts ±1.5m, then aims at the player. Ground collisions and gameplay were not changed or retested for these preview cameras.

| Option | Desktop | Phone | Recommendation |
|---|---|---|---|
|Current settled view|[Screenshot](../coverage/broad-repairs/rear-comparison/1280-current-after-8s.png)|[Screenshot](../coverage/broad-repairs/rear-comparison/390-current-after-8s.png)|Preserve current look pending requirement/design decision|
|Camera1.5m left|[Screenshot](../coverage/broad-repairs/rear-comparison/1280-camera-left-1-5m.png)|[Screenshot](../coverage/broad-repairs/rear-comparison/390-camera-left-1-5m.png)|Canopy retained; changes composition; fails both numeric targets|
|Camera1.5m right|[Screenshot](../coverage/broad-repairs/rear-comparison/1280-camera-right-1-5m.png)|[Screenshot](../coverage/broad-repairs/rear-comparison/390-camera-right-1-5m.png)|Canopy retained; SPACE falls outside sampled phone view; reject as visibility fix|

## Loading versus physical occlusion

At the first entryReady frame, both original building roots already exist and have rendered: desktop71/71Media and26/26SPACE meshes; phone71/71Media and13/26SPACE meshes (remaining submeshes outside view or otherwise culled). Eight seconds later desktop visibility is unchanged, Media6.06% andSPACE0%; phone changes slightly from13.85% to12.5%Media,SPACE stays0%. Surface hydration visibly changes ground/wall detail; it does not remove the foreground tree/building blockers. Thus additional load waiting does not solve these cases. An eventual all-submeshes-drawn assertion may also conflict with phone frustum culling; it remains unchanged.

| Width | View | Media visible target pixels | SPACE visible target pixels |
|---|---|---|---|
|1280|current|6.06% (2/33)|0.00% (0/14)|
|1280|current-after-8s|6.06% (2/33)|0.00% (0/14)|
|1280|camera-left-1-5m|6.06% (2/33)|6.25% (1/16)|
|1280|camera-right-1-5m|5.56% (2/36)|5.26% (1/19)|
|390|current|13.85% (9/65)|0.00% (0/6)|
|390|current-after-8s|12.50% (8/64)|0.00% (0/6)|
|390|camera-left-1-5m|4.05% (3/74)|0.00% (0/31)|
|390|camera-right-1-5m|20.00% (10/50)|No target pixels in sampled view|

The test counts visible rays out of all sampled rays hitting each rear building, not the fraction of the whole screen covered by that building. Foreground authored eucalyptus leaves/bark, original landscape trees, Chapel glass and nearer campus/reception meshes occlude those rays. It uses48×32 samples and hardcoded minimum60%Media/80%SPACE.

## Threshold provenance and decision

First available local introduction:172f5ba22eb47f87d989bb280f9c1108ec86b5b3, 13October2026, “Integrate reviewed campus startup and photo-to-Market release into ECC”. It added the whole22-line probe with60%/80% thresholds and stationary all-meshes-drawn checks. Commit message identifies imported test snapshotcb05d4e; that object is absent in this isolated Git object store. No accessible repo rationale ties the specific percentages to explicit aesthetic approval. This is recent integrated test policy; evidence is insufficient to call it an obsolete design assumption. Do not silently lower thresholds or skip tests.

User options: preserve the current look and explicitly review whether unobstructed rear facades at initial player-start is intended, or authorize a broader composition/layout study preserving canopy and grounded camera. The small offset screenshots show the safe magnitude explored but are not a successful fix. Any foreground-tree repositioning/pruning, start-point change, or different framing needs concrete additional preview and user aesthetic approval; none is implemented here. After that decision and release-owner integration, run the one complete verification pass.

Evidence: private metrics.json, original/settled screenshots and errors.json per width undercoverage/broad-repairs/rear-comparison. Both error lists empty. First private attempt had a diagnostic newline parse error, produced no valid comparison and was corrected; metrics above are from the completed run. Direct release-owner handoff was denied by automatic review; exact prepared message/commits/files are in docs/broad-integration-handoff-20261014.md for parent forwarding.
