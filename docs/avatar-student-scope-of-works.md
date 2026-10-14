# Avatar Studio Student Scope Of Works

Last updated: 2026-06-17

## Project Snapshot

**Project title:** Career Empire Avatar Studio: Student Art Parts Challenge

**Client:** Career Empire / Emmanuel College Careers and Employability Game

**Student team members:** [Add names and roles]

**Supervisor:** [Add teacher/supervisor name]

**Target completion date:** [Add date]

**Live preview page:** [Avatar Studio non-login page](https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/modules/avatar/index.html)

This project is a student creative contribution to the Career Empire learning game. Students will design avatar "spare parts" that can plug into the Avatar Studio, where players build a future-self profile for use across careers modules, dashboards, shop unlocks, interview practice, and teacher-visible evidence.

The important idea: this is not a set of random character drawings. The studio needs modular avatar parts that sit perfectly on top of the existing character base, like transparent layers in Photoshop. If the parts are the right size, style, and position, they can be plugged into the live studio as selectable options.

## Project Goal

Create polished, school-safe, inclusive avatar parts that match the existing Career Empire / ECC character style and can be added to Avatar Studio without rebuilding the whole character system.

The project solves a real production problem: the Avatar Studio framework exists, but it needs a wider library of clean, matching art parts before students can properly personalise their future-self avatar.

## What Has Already Been Created

Avatar Studio already has:

- A working browser page where students can choose avatar options and save a future-self profile.
- A live non-login preview page for students to view: [Avatar Studio non-login page](https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/modules/avatar/index.html).
- A working Take 2 boy avatar layer stack on a `1280 x 720 px` transparent canvas.
- A smooth neutral boy base.
- Current ECC uniform layers: pants, shirt and tie, blazer.
- Shoe options: black school shoes and brown shoes.
- Hair options: no hair, brown Take 2 hair, and black Take 2 hair.
- Planned buttons in the studio for future skin tones, eye colours, hair styles, hair colours, outfits, and accessories.
- Earlier source/reference rig material for boy and girl avatars on a `1024 x 1536 px` canvas. This is useful as reference, but the live student-facing Avatar Studio is currently using the newer Take 2 `1280 x 720 px` stack.

## What Still Needs To Be Created

### Priority 1: Hair Library

Create new hair parts that match the existing avatar style and sit perfectly on the current head.

Needed styles:

- Crop or short hair
- Curls
- Long hair
- Bun
- Head wrap or protective style
- Additional natural styles suggested by students, if they match the avatar style

Needed colours:

- Brown
- Black
- Auburn
- Blonde
- Silver
- Teal or house/accent colour

Best student task: choose one hairstyle and make 3-6 colour versions.

### Priority 2: Girl / Skirt-Presentation Avatar Parts

The studio needs a matching girl/skirt-presentation version that works with the same quality level as the Take 2 boy stack.

Needed parts:

- Neutral full-canvas base
- Hair front and, where needed, hair back
- Shirt, tie, jumper, blazer, skirt, tights, shoes
- Matching skin, eye, and face-detail options

Best student task: produce one clean, complete starter layer pack before adding lots of variations.

### Priority 3: Face And Identity Details

Needed parts:

- Eye colour variants: brown, amber, green, grey, and any corrected blue overlay if needed
- Freckles
- Clean expression plates, only if they do not duplicate the whole face or head
- Glasses that sit naturally on the nose and eyes
- Small earrings
- Name badge

Best student task: create one accessory or face-detail part and test it on the base at both large and small size.

### Priority 4: Uniform And Career Wardrobe

Needed clothing options:

- Winter blazer with trousers
- Winter blazer/jumper with skirt
- Summer dress
- Summer shirt and shorts
- Sports kit
- Interview blazer
- Health scrubs
- Hi-vis gear
- Hospitality or creative apron
- Work boots or career-specific shoes

Best student task: create one complete outfit set, not one isolated item that leaves gaps at the neck, waist, cuffs, or shoes.

### Priority 5: Accessories And Shop Unlocks

Needed accessories:

- Glasses
- Earrings
- Name badge
- Scarf
- Headphones
- Backpack
- Laptop bag
- Tool belt
- Watch or lanyard
- Career gear that connects to jobs, training, or shop rewards

Best student task: design accessories that say something about career identity, not just decoration.

## Student Deliverables

Each student or team should submit a small, complete asset pack.

### Required Deliverable 1: Final Transparent PNG Layers

Submit each avatar part as a separate transparent PNG.

For the current live Take 2 studio, use:

- Canvas size: `1280 x 720 px`
- Transparent background
- Full-canvas export, not cropped tightly around the item
- The item already positioned on the avatar
- No labels, borders, sheet background, shadows, checkerboards, or neighbouring items

Example file names:

- `hair-front-crop-black-v1.png`
- `hair-front-crop-blonde-v1.png`
- `hair-back-long-brown-v1.png`
- `accessory-glasses-round-black-v1.png`
- `uniform-sports-kit-top-v1.png`
- `uniform-sports-kit-shorts-v1.png`

### Required Deliverable 2: Preview Composite

Submit one preview image showing the part stacked on the existing avatar base.

This can be:

- A PNG screenshot from your design file
- A simple contact sheet with the base plus each option
- A before/after image showing the current avatar and your added part

### Required Deliverable 3: Source File

Submit the editable source file if available.

Accepted examples:

- Photoshop `.psd`
- Illustrator `.ai` or `.svg`
- Procreate file
- Canva export link or editable file
- Krita, Clip Studio, or other layered art file

The source file helps the teacher or developer adjust alignment later if the PNG is close but not perfect.

### Required Deliverable 4: Asset Notes

Include a short notes file with:

- Student/team name
- Part name
- Which base it was designed for
- Canvas size used
- Colour versions included
- Any known issues
- Suggested studio button label
- Whether the part is free starter content or a future shop unlock

Example:

```text
Student/team: Alex and Mia
Asset pack: Crop hair colour pack
Designed for: Take 2 boy 1280 x 720 rig
Files: hair-front-crop-black-v1.png, hair-front-crop-brown-v1.png, hair-front-crop-blonde-v1.png
Studio label: Crop
Shop status: Free starter option
Known issues: Blonde version may need slightly stronger shadow at the hairline.
```

## Scope Boundaries

### In Scope

Students may:

- Create new hair styles and hair colours.
- Recolour or redraw clean layers, as long as they match the original style.
- Create accessories, wardrobe items, and career gear.
- Use the supplied base as an alignment guide.
- Submit source files and preview composites.
- Suggest button labels, unlock names, and shop categories.
- Test their work visually against the live non-login Avatar Studio page.

### Out Of Scope

Students should not:

- Redesign the whole avatar system.
- Change the code.
- Create unrelated character styles that do not match Career Empire.
- Submit flattened full-character drawings when only one part is requested.
- Crop the canvas tightly around the item.
- Add watermarks, names, logos, backgrounds, or text directly onto avatar parts.
- Use copyrighted characters, celebrity likenesses, brand logos, or unsafe content.
- Rank physical features as better or worse.

## Technical Rules For Plug-In Artwork

The live Take 2 studio currently needs full-canvas transparent PNGs.

Core rules:

- Use `1280 x 720 px` unless the teacher specifically assigns the older `1024 x 1536 px` rig task.
- Keep the character in the same position.
- Do not move, resize, or recrop the base avatar.
- Export the new part on the full canvas.
- The part should contain only the named item.
- Leave hidden overlap pixels where parts meet the body.
- Match the soft 3D ECC student-guide style.
- Keep lighting, shadows, perspective, and line softness consistent.

Overlap rules:

- Hair should cover the forehead cleanly and tuck behind ears, collar, or shoulders where needed.
- Shirts and jumpers should tuck under blazers.
- Trousers, skirts, and shorts should tuck under tops.
- Shoes should slightly cover trouser hems, socks, or tights.
- Glasses should align to the eyes and nose bridge, not just float over the face.
- Accessories should still look good at dashboard-card size.

## What The Teacher Can Hand Over To Students

Suggested handover pack:

- The live preview link: [Avatar Studio non-login page](https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/modules/avatar/index.html)
- Current neutral base image
- Existing approved layer examples: pants, shirt and tie, shoes, blazer, brown hair, black hair
- A blank `1280 x 720 px` transparent canvas template
- A dark background test image, so students can see stray pixels and rough edges
- A naming convention sheet
- This scope of works
- A simple submission folder template:

```text
avatar-submission/
  final-png-layers/
  preview-composites/
  source-files/
  asset-notes.txt
```

## Suggested Milestones

### Milestone 1: Choose A Part

Due: [Add date]

Student chooses one focused pack, such as:

- One hairstyle in six colours
- One glasses design in two colours
- One outfit set
- One accessory pack
- One girl/skirt-presentation starter pack

### Milestone 2: First Draft

Due: [Add date]

Student submits:

- Rough PNG layer
- Preview composite on the base avatar
- Short note explaining what still needs polishing

### Milestone 3: Alignment Check

Due: [Add date]

Teacher/developer checks:

- Canvas size
- Transparent background
- Position on the avatar
- Whether the item creates gaps or overlaps badly
- Whether it still looks good at small size

### Milestone 4: Final Submission

Due: [Add date]

Student submits the full pack:

- Final PNG files
- Preview composite
- Source file
- Asset notes

## Constraints And Assumptions

Constraints:

- The artwork must be school-safe and inclusive.
- There may be no budget for paid design tools or paid assets.
- The existing Avatar Studio code expects clean, aligned layers.
- Some older `1024 x 1536 px` rig assets exist, but the current live plug-in target is the `1280 x 720 px` Take 2 rig.
- Final code integration will be done by the teacher/developer, not by students.

Assumptions:

- Students can use whatever art tool they are comfortable with, as long as final exports are correct.
- Students will have access to the base/template images.
- The teacher/developer will review and accept only the assets that match the style and technical rules.
- A strong small pack is more useful than a large messy pack.

## Acceptance Criteria

A submitted part is ready to plug into Avatar Studio when:

- It is a transparent PNG on the correct full canvas.
- It stacks correctly with the current avatar base.
- It contains only the intended part.
- It has no background, label, watermark, crop edge, or stray pixels.
- It matches the existing ECC / Career Empire soft 3D character style.
- It does not create visible gaps at the head, neck, shoulders, cuffs, waist, legs, or shoes.
- It is inclusive, school-safe, and suitable for a careers learning game.
- It looks clear at both full studio size and small dashboard-card size.
- It has a clear file name and asset note.
- It can be added to the studio as a selectable option without redrawing the whole avatar.

## Challenge Brief For Students

Avatar Studio is nearly ready to become the identity layer of Career Empire, but it needs a student-made library of spare parts. Your job is to create one small, polished pack of avatar parts that can be plugged into the live studio.

Think of yourself as part of a real game production team. The best submission is not the biggest one. The best submission is the one that fits the character perfectly, looks like it belongs in the same world, and gives future students more ways to represent themselves.

Start by opening the live preview: [Avatar Studio non-login page](https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/modules/avatar/index.html)

Then choose one useful missing piece and make it production-ready.
