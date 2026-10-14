# Avatar Studio Layers

This folder will hold production-ready transparent avatar parts.

Do not export flattened model-sheet crops here. Each part should use the shared production canvas from `docs/avatar-production-plan.md`:

- master canvas: `1024 x 1536`
- transparent PNG or WebP
- consistent baseline and anchor points
- no sheet background
- no crop edges

## First Base Folders

The first-pass source rigs are generated under:

- `ecc-boy-base-neutral/`
- `ecc-girl-base-neutral/`

Each base should use these slot folders:

- `body/`
- `head/`
- `hair/`
- `face/`
- `uniform/`
- `arms/`
- `legs/`
- `shoes/`
- `accessories/`

The slot names must match `modules/avatar/avatar-parts.js` so Avatar Studio and Remotion can share the same rig definition.

These first-pass rigs were extracted from the flattened neutral model-sheet poses by:

- `remotion-est-scenes/scripts/extract-avatar-builder-layers.py`

They preserve the correct production canvas, transparent background, slot folders, manifest, and Remotion-public mirror. Treat them as the Avatar Builder and Remotion rig starting point; an illustration pass should redraw hidden elbow, knee, and side-body pixels before very wide arm or leg motion.
