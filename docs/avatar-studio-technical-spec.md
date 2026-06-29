# Avatar Studio Technical Spec

This project is an avatar layering system, not a set of loose character pictures. Every usable avatar asset must obey the same canvas, anchors, layer order, and compatibility rules.

## Master Canvas

- Active Take 2 size: `1280 x 720 px`
- Legacy extraction-rig size: `1024 x 1536 px`
- Format: transparent PNG with alpha
- Do not crop tightly around the item.
- Each file stays on the full master canvas, with the part already positioned on the character.
- Remove contact-sheet labels, boxes, checkerboards, shadows, neighbouring items, and backgrounds.

## Starter Rigs

The active production rig is:

- `ecc-boy-take-2-layered`

The Take 2 source stack is:

- `Neutral Boy Smooth Transparent background.png`
- `Boy Pants.png`
- `Boy Shirt and tie.png`
- `Shoes Corrected.png`
- `Brown Shoes.png` (approved alternate shoe layer)
- `Boy Blazer.png`
- no hair (uses the smoothed neutral base head with no hair layer)
- `Boy Hair.png`
- `Black hair.png` (approved alternate hair layer)

The browser-facing part manifest is:

`modules/avatar/avatar-parts.js`

The legacy layer manifest is retained as pipeline material, but the live Avatar Studio preview now follows the Take 2 canvas, anchors, and layer order.

## Current Status

The active starter preview uses `Neutral Boy Smooth Transparent background.png` as the live base rig, then layers selected shirt, pants, shoes, blazer, and hair files on top. The original `Neutral Boy Transparent background.png` is retained as source material, but the live classroom base removes garment seams, folds, and centre-front shading so it reads as a smooth non-gendered underlayer. The module scales and crops only the empty side space in the preview; it does not move or resize individual artwork layers.

The old `1024 x 1536` modular stack is retained as pipeline material, but it is not currently trusted for live rendering. Runtime CSS skin tinting and eye-colour overlays are not used for Take 2 because the supplied base already has baked skin and blue eyes. No hair, brown hair, and black Take 2 hair are active because they use either the smoothed neutral base head or approved full-canvas hair layers. Black and brown shoe options are active because both have approved full-canvas layers. Girl preset, alternate skin tones, alternate eye colours, freckles, expressions, accessories, and extra outfits stay disabled until matching `1280 x 720` layers exist.

Expression plates are deliberately parked for now. The current `head/base.png` already contains the neutral facial features, so adding `face/expression-neutral.png` creates a duplicate face/head effect. Expressions should only be enabled after we create an expressionless head base or expression plates that contain only the changed mouth/eyes/brows.

A valid layer must contain only the named part plus its deliberate hidden overlap pixels. It must not contain a duplicate head, collar, torso, hands, or neighbouring clothing.

## Required Anchor Points

Every rig should define these points in pixel coordinates:

| Anchor | Purpose |
| --- | --- |
| `headCenter` | Hair and face shape registration |
| `leftEye` | Left eye colour, glasses, expressions |
| `rightEye` | Right eye colour, glasses, expressions |
| `browLine` | Brows and expression overlays |
| `noseBridge` | Glasses bridge and nose options |
| `mouthCenter` | Mouth and expression overlays |
| `leftEar` | Earrings, headphones, hair side coverage |
| `rightEar` | Earrings, headphones, hair side coverage |
| `neckCenter` | Base head/neck alignment |
| `neckOpening` | Shirt, tie, jumper, blazer collar |
| `leftShoulder` | Shirt/blazer/jumper width |
| `rightShoulder` | Shirt/blazer/jumper width |
| `waistLine` | Shirt-to-bottom overlap |
| `hips` | Skirt/trouser position |
| `leftHandRest` | Sleeve and hand overlap |
| `rightHandRest` | Sleeve and hand overlap |
| `leftFoot` | Left shoe |
| `rightFoot` | Right shoe |
| `feetBaseline` | Shoe/ground alignment |

## Layer Order

Target starter order once layers are accepted:

1. `Neutral Boy Smooth Transparent background.png`
2. `Boy Pants.png`
3. `Boy Shirt and tie.png`
4. `Shoes Corrected.png` or `Brown Shoes.png`
5. `Boy Blazer.png`
6. no hair, `Boy Hair.png`, or `Black hair.png`

The current Take 2 boy hair is a single front layer. Long hair, braids, curls, and ponytails should use both a back layer and a front layer where possible.

## Overlap Rules

Assets should not be cut exactly to the visible edge. They need hidden overlap pixels:

- Shirt goes 5-15 px under jumper/blazer and bottoms.
- Jumper goes 5-15 px under blazer.
- Blazer covers shirt/jumper sleeve and shoulder edges.
- Skirts/trousers tuck 5-15 px under shirt/jumper.
- Shoes overlap trouser hems/tights/socks by 5-15 px.
- Hair front overlaps forehead, collar edges, and shoulders where needed.
- Hair back can disappear under body/clothing where needed.

These overlaps are deliberate. They prevent transparent gaps between neck/body, shirt/skirt, sleeves/wrists, and shoes/feet.

## Compatibility Rules

Each asset belongs to a rig family:

- `ecc-girl-standard`
- `ecc-boy-standard`

Face accessories align to face anchors. Clothing aligns to body anchors. If a future face shape or body type moves the anchors, it becomes a new compatible rig variant.

Do not add body types until matching clothing variants are ready. Body variants multiply the clothing workload.

## Starter Pack Definition

The first clean Take 2 pack contains:

- neutral boy base
- pants
- shirt and tie
- shoes (`Shoes Corrected.png` default, `Brown Shoes.png` alternate)
- blazer with jumper/crest
- hair (no hair option, `Boy Hair.png` default, `Black hair.png` alternate)

For now, only the boy Take 2 base, current shirt/pants/blazer layers, no hair plus brown/black Take 2 hair, and black/brown shoe layers are active. Everything else stays planned/disabled in the UI until its layer exists and passes the same full-canvas alignment rules.

## Layer Acceptance Test

Before wiring any asset into the live selector:

- Open the PNG on a dark background.
- Confirm it is `1280 x 720` for Take 2 assets.
- Confirm it contains only the intended part.
- Confirm it has no duplicate body, collar, face, shoes, or neighbouring items.
- Stack it with the base rig and check neck, shoulders, cuffs, waist, and feet.
- Only then mark the related button active in `modules/avatar/avatar-parts.js`.

## Prompt For New Art Layers

Use this wording for any future art request:

> Create one transparent PNG avatar layer on a 1280 x 720 px canvas. Do not crop the item. Keep it aligned to the supplied Take 2 ECC boy avatar anchors. Remove all sheet background, labels, boxes, shadows, and neighbouring items. The asset must stack correctly with the existing Take 2 rig, including hidden overlap at any neck, cuff, waist, sleeve, or shoe join. Keep the existing ECC style, lighting, scale, and perspective. Do not redesign the character.
