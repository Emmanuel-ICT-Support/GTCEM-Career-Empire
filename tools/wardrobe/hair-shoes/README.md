# Rebuild fitted hair and shoes

Use Blender 5.2.1. Set CE_GAME_ROOT to the repository root. Run build.py, render.py, check-crossings.py and validate.py with Blender in background mode. Sources use only the versioned canonical base and approved pants GLBs. Generated outputs belong in outputs/ next to these scripts; copy reviewed accessory GLBs into playable-3d/assets. Render writes thumbnails directly into the supplied repository.

The full body remains present in fit checks. Imported bone display meshes must be excluded from garment comparisons. Source face winding near the back of the head and foot underside makes nearest-normal signed distances unreliable there; preserve the signed-distance diagnostic but use actual finite-edge crossings and visual review for acceptance. Native walk checks cover rest plus 46 sampled poses, not a swept volume or every future animation.

Model proportions are never adjusted. Neutral named materials let the runtime apply saved hex colours. Hair uses Head weights; footwear interpolates the canonical foot/toe/calf weights.
