# Avatar Studio Roadmap

Avatar Studio should become the persistent identity layer for Career Empire. The first version is deliberately small: students create a personalised avatar, name a future occupation interest, and save a profile that can later feed career-plan, interview, training, and shop systems.

## Asset Strategy

The avatar house style should follow the existing ECC animated guide characters rather than a flat generic cartoon. The strongest references are:

- `Assets/ECC Branding/ECC_priority_style_reference_sheet.jpg`
- `Assets/ECC Branding/ECC_style_source_contact_sheet.jpg`
- `Assets/Images and Animations/Student Hub/student-hub-guide.gif`
- `Assets/Images and Animations/Emmanuel Student Characters/MacKillop/`
- `Assets/Images and Animations/Emmanuel Student Characters/Romero/`

Visual traits to preserve:

- soft 3D student-guide rendering
- expressive oversized eyes and warm faces
- navy uniform, teal tie, gold crest/button accents
- clean transparent character cutouts for UI scenes
- holographic cyan/purple/gold UI frames around the character
- dark ECC "future studio" framing around the preview, with lighter picker panels only where students need to compare options
- friendly guide poses such as welcome, thinking, pointing, encouraging, and celebrating

The current code-native SVG avatar should be treated as a wireframe only. It is useful for testing storage, UI controls, and profile flow, but it is not production art and should not be shown as the quality target beside the ECC characters.

The production direction is ECC-quality character bases first, then modular parts only after the asset pipeline can match that look. The first studio upgrade should use the existing MacKillop and Romero pose PNGs as selectable bases so the visible module feels consistent with the rest of the game while the modular wardrobe is planned properly. Wider scene-style character images should not be used as avatar bases until they have been cropped or exported as character-first assets.

The Emmanuel College uniform lookbook is now part of the avatar reference direction. Use it to model modular school-uniform slots such as summer dress, summer shirt and shorts, winter blazer with trousers, winter jumper with skirt, and sports kit. Treat the lookbook as wardrobe and proportion reference, not as a flattened character output: the long-term avatar system still needs swappable body, hair, expression, uniform, accessory, and animation layers.

The first production plan for the boy and girl avatar model sheets is captured in `docs/avatar-production-plan.md`. It defines the first two base avatars, shared canvas, anchor points, layer slots, expression swaps, uniform swaps, and Remotion prototype target.

Use generated transparent PNG/WebP asset packs later for polish once the slots are stable and style QA can reject anything that does not match the ECC guide quality:

- hair packs: short, waves, curls, long, bun, wraps, protective styles, colour variants
- face packs: face shapes, eyes, expressions, freckles, glasses
- outfit packs: interview, school, workwear, scrubs, hi-vis, hospitality, creative, business
- accessory packs: earrings, headphones, lanyards, name badges, watches, bags
- shop packs: jewellery, shoes, phones, laptops, cars, rooms, tools, career gear

Generation can happen in Codex using image generation, but final project assets should only be copied into `Assets/Images and Animations/Avatar Studio/` after visual QA against the ECC references. For modular avatars, every generated piece should use the same transparent canvas size, camera angle, lighting, and anchor points. If a generated part looks flatter, cheaper, or stylistically detached from MacKillop/Romero/Francis/Frassati/Lisieux, discard it rather than lowering the module standard.

Suggested generation prompt base:

```text
Create a friendly soft-3D animated student guide character asset for Career Empire, matching the existing ECC guide style: expressive oversized eyes, warm rounded face, polished navy school blazer, teal tie, gold crest/button accents, clean classroom-game lighting, transparent-background-ready full-body/half-body pose, no text, no watermark. Keep the pose, camera angle, canvas size, and lighting consistent across all variants.
```

## Stage 1: MVP Creator

- Create `modules/avatar/` as a playable avatar creator.
- Save selections locally under `career-empire-avatar-v1`.
- Store the latest avatar on the shared `career-empire-session` object.
- Render existing ECC-quality Emmanuel character bases in the preview and dashboard card.
- Save face, skin tone, hair, hair colour, outfit, accessory, selected character base, and a future-self card.
- Add Avatar Studio to the Student Hub and dashboard module controls.
- Add a smoke test for page load.

## Stage 2: Profile And Evidence

- Store avatar profile in Supabase for logged-in students.
- Create teacher-visible evidence for occupation interest, training idea, and employability strength.
- Show avatar preview on the student dashboard.
- Add teacher dashboard drill-down fields for future-self profile and avatar completion.

## Animation Upgrade Path

- Reuse existing ECC pose packs for welcome, thinking, pointing, encouraging, and celebrating states.
- Add subtle idle motion to the studio preview: breathing, hover, glow pulse, and stage-light shimmer.
- Add module response animations: celebrate on save, think while choosing future pathway, point to career-plan prompts.
- Move to rigged 2D or sprite-sheet character packs only when the artwork matches the ECC character references.
- Keep animations purposeful: identity, feedback, achievement, and evidence moments should animate more than decorative idle surfaces.

## Stage 3: Shop Integration

- Add avatar categories to the Global Shop.
- Separate free starter wardrobe from earned unlocks.
- Connect purchases to avatar slots such as accessory, outfit, room, vehicle, and career gear.
- Add teacher-reviewed student item requests for avatar items.

## Stage 4: Career Plan Module Link

- Expand the future-self card into occupation, pathway, training, barriers, interview outfit, and preparation goals.
- Add decision points with trade-offs around money, training time, transport, wellbeing, and opportunity.
- Save career-plan evidence for teacher review.

## Stage 5: Identity Across The Ecosystem

- Render the avatar on dashboard profile surfaces, module intros, leaderboards, shop inventory, and certificates.
- Let students earn badges and visual upgrades from EST Prep, Lifelong Learning, Megatrends, and later modules.
- Keep the avatar tied to evidence and decisions so it remains gameplay, not decoration.

## Design Guardrails

- Keep the asset set inclusive and school-safe.
- Avoid ranking physical features or implying one look is better.
- Make unlocks include career gear and life goals, not only luxury items.
- Keep spending choices connected to trade-offs, savings, and long-term goals.
- Treat the avatar as a future-self identity, not a vanity-only wardrobe.
