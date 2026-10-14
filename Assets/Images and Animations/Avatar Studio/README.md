# Avatar Studio Assets

This folder is for production-bound avatar artwork and reference sheets.

## Model Sheets

- `model-sheets/ecc-avatar-model-sheet-v1.png`
  - Built-in image generation output.
  - Purpose: first full-body ECC-style student avatar reference.
  - Use as a proportion, uniform, pose, and expression guide for later modular parts.
  - Do not treat as the final avatar rig; it still needs layer separation and style QA before live use.
- `model-sheets/ecc-avatar-model-sheet-v2-female.png`
  - Built-in image generation output.
  - Purpose: companion full-body female-presenting ECC-style student avatar reference.
  - Uses blazer, tie/jumper accents, plaid skirt, tights, and school shoes as lookbook-inspired wardrobe guidance.
  - Do not treat as the final avatar rig; it still needs layer separation and style QA before live use.

## Animation Sprites

- `animation-sprites/`
  - Transparent whole-pose and expression sprites extracted from the model sheets.
  - Purpose: Remotion walk/point/celebration/expression tests and sprite-style game moments.
  - Includes a `manifest.json`, contact-sheet preview, and matching Remotion-public copy under `remotion-est-scenes/public/avatar-animation-sprites/`.
  - These are not final limb-separated avatar-builder layers; treat them as the animation source bridge between model sheets and the production rig.

## Avatar Builder Layer Rigs

- `layers/ecc-boy-base-neutral/`
- `layers/ecc-girl-base-neutral/`
  - First-pass transparent limb-separated rigs extracted from the neutral model-sheet poses.
  - Purpose: Avatar Builder source handoff and Remotion rig prototyping with independently movable head, hair, arms, legs, shoes, uniform, accessories, and expression plates.
  - Includes per-rig README files, recomposed previews, contact sheets, and a combined `layers/rig-manifest.json`.
  - A matching Remotion-public copy lives under `remotion-est-scenes/public/avatar-builder-rigs/`.
  - These are usable as the first rig source, but they still need an illustration polish pass to redraw hidden joint pixels before extreme walk, run, and jump animation.

## Modular Target

Future export packs should preserve the same canvas, lighting, and anchor points across:

- head
- hair front and back
- face and expressions
- torso and uniform
- upper arms
- forearms and hands
- thighs
- lower legs and shoes
- accessories

## Production Plan

Use `docs/avatar-production-plan.md` as the source of truth for:

- the first two base avatars
- shared canvas size
- normalized anchor points
- required layer slots
- expression swaps
- uniform swaps
- Remotion rig targets

The same slot and anchor vocabulary is mirrored in `modules/avatar/avatar-parts.js` so Avatar Studio can later swap from prototype SVG layers to production PNG/WebP layers without changing saved profile data.
