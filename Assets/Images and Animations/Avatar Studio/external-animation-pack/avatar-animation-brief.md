# ECC Avatar Animation Brief

## Goal

Create polished full-body animated student avatars for the Career Empire / Emmanuel Catholic College game and website.

The animations must look like friendly, age-appropriate school students in ECC uniforms. They should be usable for:

- avatar builder previews
- gameplay feedback
- student dashboard moments
- website explainer moments
- short video inserts

## Current Issue

The current prototype sprite videos are not production quality. They were generated from flattened character art and simple limb rotations, so the walk/run/jump motion is stiff and the joints do not behave like a proper rig.

Production animation should be made in a real animation tool or AI video workflow with stronger character motion, facial expression, body acting, and clean loops.

## Characters

Create two base student avatars:

- ECC boy student in navy blazer uniform
- ECC girl student in navy blazer uniform with tartan skirt

Keep:

- full-length body visible
- school-uniform fidelity
- friendly expressive face
- clean readable silhouette
- consistent face, hair, uniform, colours, and proportions across all motions

Avoid:

- changing age between clips
- changing uniform details between clips
- changing face/hair randomly
- overly realistic adult proportions
- dramatic/cinematic camera movement
- busy background
- horror, anime battle, superhero, or fashion-runway styling

## Visual Style

Bright polished 3D/2.5D school-avatar style.

The character should feel:

- game-ready
- warm and optimistic
- safe for school use
- similar to a modern educational game avatar
- clean enough to isolate on transparent or flat backgrounds

## Required Animations

Each character needs these motions:

- idle: gentle breathing, small blink, relaxed posture
- walk: smooth in-place walk loop, natural arm swing
- run: energetic in-place run loop, not aggressive
- jump: crouch, lift, air pose, land, recover
- wave: friendly raised-hand wave
- point: point to the side as if indicating a button or feedback panel
- think: thoughtful pose, head tilt, hand near chin
- celebrate: joyful success gesture, arms up, small bounce

## Export Requirements

Preferred game export options:

- Rive file with state machine and named animations
- Spine JSON/atlas with skins and named animations
- PNG sprite sheets with transparent background
- Transparent WebM clips for website overlays

Minimum review export:

- MP4 preview for each animation
- one combined showreel of all animations

Recommended sizes:

- source/master: 1024 x 1536 or higher
- game sprite frame: 256 x 384 or 512 x 768
- website video preview: 1080p or 1280 x 720

For sprite sheets:

- transparent background
- one horizontal row per animation
- consistent frame width and height
- no clipping at hands, feet, hair, or jump apex
- include metadata for frame count, FPS, loop/non-loop

## Motion Notes

Idle:
Gentle breathing loop. Very subtle, suitable for dashboard/avatar builder.

Walk:
Readable walk cycle. Feet should alternate clearly. Keep the character roughly in place unless exporting a travelling version.

Run:
More energetic than walk, with stronger arm swing and body bounce. Still school-friendly, not frantic.

Jump:
Show anticipation and landing. Needs crouch before takeoff and slight recovery after landing.

Wave:
Raised right arm, friendly hand movement. Face should brighten slightly.

Point:
Right arm points to the side. Keep hand fully visible. Useful for UI prompts.

Think:
Hand near chin or chest, small head tilt, curious expression.

Celebrate:
Arms up or fist-pump style, small bounce, happy face.

## Facial Expressions

Create expression variants if possible:

- neutral
- smile
- surprised
- thinking
- proud/celebrating
- concerned/trying again

These can become avatar-builder modules later, so keep the face separable if using a rigging pipeline.

## Modular Avatar Builder Future-Proofing

The long-term system should allow:

- hair swaps
- skin tone swaps
- uniform swaps
- blazer/jumper/shirt/tie combinations
- skirt/trousers options
- expression changes
- animation reuse across different avatar looks

Best technical fit:

- Rive or Spine for web/game runtime animation
- Adobe Character Animator for fast puppet/mocap-style production
- Blender/Cascadeur if moving to 3D avatars
- AI video only for non-interactive website/video moments, not modular game avatars

