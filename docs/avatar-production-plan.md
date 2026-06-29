# Avatar Production Plan

This plan turns the two ECC avatar model sheets into the production path for Avatar Studio. The goal is to keep the quality of the generated sheets, but stop treating the sheets as flattened final art. They are the look source for modular, swappable, animated avatar parts.

## Source Sheets

- `Assets/Images and Animations/Emmanuel Student Characters/Boy avatar.png`
  - Copied to `Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v1.png`
  - Size: `1536 x 1024`
  - Best first use: base avatar A, neutral full-body pose, blazer/trousers uniform, shoes, hair style, expression strip.
- `Assets/Images and Animations/Emmanuel Student Characters/Girl Avatar 1.png`
  - Copied to `Assets/Images and Animations/Avatar Studio/model-sheets/ecc-avatar-model-sheet-v2-female.png`
  - Size: `1536 x 1024`
  - Best first use: base avatar B, neutral full-body pose, blazer/jumper/skirt uniform, tights, shoes, hair style, expression strip.

Do not use the wider sheet as a direct in-game avatar. Production assets should be cut, cleaned, layered, and exported onto a shared transparent canvas.

## First Two Base Avatars

- `ecc-boy-base-neutral`
  - Source: boy sheet, top-left neutral full-body pose.
  - Role: first trousers/blazer rig and first expression swap test.
  - Starter uniform: winter blazer with trousers.
- `ecc-girl-base-neutral`
  - Source: girl sheet, top-left neutral full-body pose.
  - Role: first skirt/blazer rig and second body-proportion test.
  - Starter uniform: winter blazer with plaid skirt.

These two bases should prove the whole system before we add more body types, hair styles, or shop unlocks.

## Canvas And Anchors

Production master canvas:

- `1024 x 1536`
- Transparent PNG or WebP.
- Full body, centered.
- Feet sit on the same baseline.
- Lighting and camera angle stay consistent across every part.

Runtime preview canvas:

- `280 x 520`
- Used by `modules/avatar/avatar-parts.js` and Avatar Studio.
- Can be SVG/HTML for the prototype, but should map to the same production anchors.

Shared normalized anchor points:

| Anchor | X | Y | Purpose |
| --- | ---: | ---: | --- |
| `root` | 0.50 | 0.94 | Whole rig transform origin |
| `feetBaseline` | 0.50 | 0.93 | Shoe and floor alignment |
| `hips` | 0.50 | 0.61 | Lower body and skirt/trouser hinge |
| `torso` | 0.50 | 0.46 | Blazer, jumper, shirt alignment |
| `neck` | 0.50 | 0.34 | Head and collar alignment |
| `headCenter` | 0.50 | 0.22 | Expression and hair alignment |
| `leftShoulder` | 0.35 | 0.39 | Arm rig |
| `rightShoulder` | 0.65 | 0.39 | Arm rig |
| `leftHandRest` | 0.29 | 0.67 | Rest pose hand target |
| `rightHandRest` | 0.71 | 0.67 | Rest pose hand target |

The first cutout pass should refine these anchors with pixel-perfect values after transparent base exports exist.

## Required Layer Slots

Every production avatar should export these slots with the same canvas and anchor points:

- `body/base`
- `body/skin-neck`
- `head/base`
- `hair/back`
- `hair/front`
- `face/eyes`
- `face/brows`
- `face/mouth-expression`
- `uniform/blazer`
- `uniform/jumper`
- `uniform/shirt`
- `uniform/tie`
- `uniform/lower`
- `arms/upper`
- `arms/forearms-hands`
- `legs/upper`
- `legs/lower`
- `shoes`
- `accessories`

Layer rule: if a part needs to swap independently in Avatar Studio or animate independently in Remotion, it gets its own layer.

## Expression Swaps

Start with the expression strip already present in the sheets:

- `neutral`
- `smile`
- `thinking`
- `surprised`
- `excited`
- `wink`

The first production export should separate eyes, brows, and mouth where possible. If that is too slow for the first pass, export whole-face expression plates, then split later.

## Uniform Swaps

The first wardrobe set should cover the core school identity before career/shop gear:

- winter blazer with trousers
- winter blazer with plaid skirt
- summer dress
- summer shirt and shorts
- sports kit

Career and shop clothing should come after the rig proves itself:

- interview blazer
- health scrubs
- hi-vis gear
- hospitality apron
- creative studio apron
- work boots, bags, watches, lanyards, headphones, glasses

## Asset Folder Structure

Use this structure for production exports:

```text
Assets/Images and Animations/Avatar Studio/
  model-sheets/
  layers/
    ecc-boy-base-neutral/
      body/
      head/
      hair/
      face/
      uniform/
      arms/
      legs/
      shoes/
      accessories/
    ecc-girl-base-neutral/
      body/
      head/
      hair/
      face/
      uniform/
      arms/
      legs/
      shoes/
      accessories/
  rigs/
    remotion/
```

## Remotion Prototype

Build one working rig before producing a large art pack.

Target:

- Composition: `ECCAvatarRigPrototype`
- File: `remotion-est-scenes/src/scenes/ECCAvatarRigPrototype.tsx`
- Input: one base avatar, one uniform, and three expressions.
- Animations: `idle`, `blink`, `wave`, `think`, `celebrate`.

The Remotion rig should use the same layer slot names and anchors stored in `modules/avatar/avatar-parts.js`.

## Avatar Studio Integration

`modules/avatar/avatar-parts.js` is the shared schema bridge. It already holds:

- source sheet metadata
- selected base avatars
- master/runtime canvas definitions
- normalized anchor points
- slot names
- expression swap names
- uniform swap names
- current prototype defaults

Avatar Studio should continue using this schema so the UI can move from SVG prototype parts to real transparent PNG/WebP parts without changing saved profile data.

Until the first real transparent layer exports exist, the rough SVG modular rig should stay a schema test only. The student-facing default should remain an ECC-quality character reference pose so the module does not drift back to lower-quality generated avatar art.

## Production Stages

1. Confirm the two selected base avatars.
2. Cut clean transparent full-body exports from both sheets.
3. Refine pixel-perfect anchors on the transparent base exports.
4. Split the first base into hair, head, face, body, uniform, limbs, shoes, and accessories.
5. Export expression swaps.
6. Export the first two uniform swaps.
7. Build `ECCAvatarRigPrototype` in Remotion.
8. Swap Avatar Studio preview from SVG prototype to real layered PNG/WebP assets.
9. Add shop unlock metadata and teacher-visible evidence fields.

## Quality Bar

Production avatar parts should pass these checks:

- same soft 3D ECC guide style as the source sheets
- transparent background
- no visible sheet background or crop edges
- no flattened text or watermark
- consistent scale, lighting, and baseline
- usable at dashboard-card size and full studio-preview size
- inclusive without ranking physical features
- school-safe and aligned to Career Empire gameplay
