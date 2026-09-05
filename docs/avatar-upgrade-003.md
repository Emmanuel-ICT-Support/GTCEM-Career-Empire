# Avatar Studio: Combined Upgrade 003

## Released Parts

All new runtime PNGs live directly in `Assets/Images and Animations/Avatar Studio/` and use a transparent 1280 x 720 canvas. Original assets remain untouched for reference.

- Boy: complete shirt and teal tie; complete teal jumper; open navy and camel blazers; corrected chef jacket and apron. Six new versioned files replace the old selectable inserts while retaining the existing choice IDs.
- Girl: a registered neutral from the existing clean girl reference, brown side-part bob, brown ponytail, tartan skirt, and girl-fitted versions of all active wardrobe and occupation pieces.
- Girl short waves: seven existing colour variants refitted to the girl canvas. Bob and ponytail currently have brown artwork only; unavailable colours are disabled.
- Brown eyes belong to the girl neutral and blue eyes to the boy neutral. No skin or eye tint is applied. Additional neutral skin colours remain a future asset task.

## Layer Contract

The neutral girl is registered at x640, with its original proportions preserved, body height 624 pixels and feet at y676. Her shoulder, neck, waist and wrist positions differ from the boy. Girl assets must never fall back to a boy clothing file.

Render order: neutral, bottoms, shirt, shoes, jumper, outerwear, hair, eye variant (when available), accessory.

The shirt and jumper are complete standalone transparent garments. Their collar/body clipping changes only when an overlying garment is selected. The old collar/tie/vest insert and baked-inner blazers are no longer selected by the active wardrobe.

Per-rig `config.occlusion` defines the covered sleeve band, preserved central torso and shirt collar box. CSS clipping hides concealed neutral arms and under-shirt sleeves while keeping the neck and hands visible. Removing the outer garment restores the full underlying part. Raw PNGs stay complete and reusable.

Chef cuffs omit their rear-facing end surfaces; the apron has two straps ending at the neckline instead of a closed floating loop.

## Saved Profiles And Map Preparation

Schema 12 adds the independent `jumper` choice. Old blazer profiles retain a jumper when appropriate; old shirt-only, scrub and chef profiles do not acquire one. Choosing a scrub top or chef jacket removes an incompatible jumper. Rig switches reset the appearance to that rig's fitted defaults while keeping future-career text.

Saved `avatarSpec` records the rig ID, exact ordered filenames, wardrobe slots, canvas, body/face compatibility, anchors, accessory and `technicalSpec.layerClips`. A later map compositor must apply both the ordered images and the clipping instructions. This release does not create walking animation frames or change the Phaser map character.

## Validation

- Registered PNG dimensions, alpha and asset loading.
- Standalone shirt and jumper selection, over-layer clipping and removal.
- Girl hair styles, supported colours, complete wardrobe and occupation accessories.
- Boy/girl switching, saved/reloaded recipes, legacy migration and randomisation.
- Desktop, review-panel and mobile browser screenshots at 1440, 749 and 390 pixels.

Creative sources, generation prompts, export manifest and fitting proofs are retained in the local `Avatar Creator/studio-upgrade-003/` pack. Runtime mappings remain authoritative in `modules/avatar/avatar-parts.js`.
