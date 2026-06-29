# Avatar Modular Art Brief

Last updated: 2026-06-02

## Starter Pack Added

The first starter art pass now exists in the ECC rig folders. These are not the final full wardrobe/hair library, but they prove the production direction:

- `sheet-base.png` for each ECC rig, sliced from the newer contact-sheet art and used as the live Avatar Studio base.
- `skin/mask.png` for each ECC rig, generated from the sliced base image so skin-tone updates affect the face and hands.
- Eye colour overlays for brown, amber, green, blue, and grey.
- `accessories/small-earrings.png` for each ECC rig.
- `hair/crop-front.png` and `hair/crop-back.png` for each ECC rig.

These starter files are full-canvas transparent `1024 x 1536` PNGs. The crop hair is a conservative starter variant that reuses the existing matched front hair and removes the back hair layer, so it is alignment-safe but not yet a fully redrawn hairstyle.

Important live-preview note: Avatar Studio now uses the newer contact-sheet-derived `sheet-base.png` bodies, plus clean masks/accessories on top. This is a visible quality improvement over the rough code-drawn avatars, but it is still not a full wardrobe/hair swap system. Extra hair styles, hair colours, glasses, and wardrobe swaps are visible as dimmed planned upgrades until clean isolated art/masks exist.

## Current Asset Search

The current repository has the right starting points for the ECC Avatar Studio, but it does not yet have the full swappable art pack.

Found:

- Two ECC model sheets:
  - `Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v1.png`
  - `Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v2-female.png`
- Two first-pass ECC builder rigs:
  - `Assets/Images and Animations/Avatar Studio/layers/ecc-boy-base-neutral/`
  - `Assets/Images and Animations/Avatar Studio/layers/ecc-girl-base-neutral/`
- Per-base expression plates: neutral, smile, thinking, surprised, excited, wink.
- Per-base animation and pose sprites for Remotion/gameplay tests.
- One current hair front/back pair per base.
- One starter crop hair layer set per base.
- One current uniform stack per base.
- Contact-sheet source copies:
  - `Assets/Images and Animations/Avatar Studio/contact-sheets/girl-modular-sheet-v1.png`
  - `Assets/Images and Animations/Avatar Studio/contact-sheets/boy-modular-sheet-v1.png`
- Sheet-derived full-character bases: `sheet-base.png` for each rig.
- Starter full-canvas accessory layers for glasses, small earrings, and name badge. Only the earrings are currently active; the glasses and name badge crops are parked because they do not yet look good enough.
- Image-derived full-canvas skin mask per base.

Active in Avatar Studio now:

- Two ECC character bases.
- Skin tone masks.
- Eye colour overlays.
- Face overlays, including freckles.
- Small earrings.
- Current ECC uniform as the baked outfit on each character base.

Visible but dimmed as planned upgrades:

- Glasses, because the contact-sheet crop does not sit naturally enough on the face.
- Name badge, because the contact-sheet crop reads as a second crest rather than a clean badge.
- Extra hair styles and hair colours.
- Wardrobe swaps such as sports kit, summer dress, scrubs, hi-vis, apron, and interview blazer.

Not found:

- Fully redrawn short hair, curls, bun, wrap, or other hairstyle PNG parts.
- Hair colour variant packs or clean hair masks for every current/future style.
- Production-polished skin masks split by face, neck, arms, and hands.
- Modular scarves, headphones, backpack, or other accessory PNGs.
- Swappable wardrobe PNG packs such as summer dress, sports kit, scrubs, hi-vis, apron, interview blazer.

## Direction

Avatar Studio should now build around only the two ECC student rigs:

- `ecc-boy-base-neutral`
- `ecc-girl-base-neutral`

The old code-drawn SVG avatars are retained only as an internal fallback for old saved data. They should not be treated as the production look.

## Required Layer Contract

Every swappable art part must be exported on the same transparent canvas:

- Canvas: `1024 x 1536`
- Transparent background.
- Same camera angle, lighting, scale, and baseline.
- Feet on the same baseline as the current rigs.
- Full-canvas PNG or WebP, not cropped tightly to the part.
- No sheet background, text, watermark, or crop edge.

Every layer must use the current folder pattern:

```text
Assets/Images and Animations/Avatar Studio/layers/
  ecc-boy-base-neutral/
    hair/
    face/
    uniform/
    accessories/
  ecc-girl-base-neutral/
    hair/
    face/
    uniform/
    accessories/
```

## No-Gap Rules

To avoid spaces between the head, neck, body, hair, and clothes:

- Hair front/back layers must slightly tuck behind the face/head layer.
- Neck and collar layers must overlap by a few pixels; do not leave a hard seam between chin, neck, shirt, and blazer.
- Sleeves must overlap forearms/hands enough that arm animation cannot expose transparent gaps.
- Skirts, shorts, trousers, tights, socks, and shoes must overlap vertically by a few pixels.
- Accessories should sit on top of the final character, but use the same full-canvas alignment so they do not drift between boy/girl bases.
- Any part that changes shape must include hidden pixels behind adjacent layers, not stop exactly at the visible edge.

## Minimum Next Art Pack

Build this first, before adding shop extras:

- Hair styles for both bases:
  - current/default
  - short/crop
  - curls
  - long
  - bun
  - wrap or protective style
- Hair colour support:
  - either clean mask layers for tinting, or separate colour variants for black, brown, auburn, blonde, silver, teal
- Skin support:
  - face/head skin mask
  - neck skin mask
  - left/right hand masks
  - exposed leg masks where needed
- Face/detail layers:
  - freckles
  - eyes
  - brows
  - mouth/expression
  - expression plates split enough that skin colour is not baked into the expression
- Uniform and wardrobe:
  - winter blazer with trousers
  - winter blazer/jumper with skirt
  - summer dress
  - summer shirt and shorts
  - sports kit
  - interview blazer
  - scrubs
  - hi-vis
  - apron
- Accessories:
  - glasses
  - earrings
  - name badge
  - scarf
  - headphones
  - backpack

## QA Checklist

Each new part should be tested in Avatar Studio against:

- both ECC bases
- all skin tones
- black, brown, blonde, and teal hair colour
- at least one accessory
- dashboard-card scale
- full studio-preview scale
- idle animation

Reject any art pack that creates:

- visible transparent gaps
- neck/body disconnection
- hair floating away from the head
- accessories drifting off the face
- obvious lighting mismatch
- lower-quality style than the ECC source characters
