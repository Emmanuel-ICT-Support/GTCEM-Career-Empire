# Career Empire Town Rebuild Brief

**Purpose:** Give Codex one authoritative design and implementation brief for rebuilding the Phaser world without losing the existing game vision, curriculum coverage or working systems.

**Status:** Planning specification. Do not edit Phaser files until Tania approves the town blueprint and the Stage 1 implementation boundary.

## 1. Executive direction

Career Empire is a walkable career-life RPG for Year 12 Careers and Employability. It is not a flat board, a building-shaped menu or a sequence of disconnected lessons. The player lives through a compressed early-career journey: establishing an identity, learning, applying for work, earning, spending, saving, responding to change and contributing to a shared class town.

The current prototype proves that Phaser can load the assets, move a character, change poses, follow with a camera, detect proximity, open destinations and display a changing class world. Preserve those working foundations.

The current map works as an aerial diagram but not yet as a lived-in town at character level. Its principal problems are scale, density, sightlines, route legibility and the relationship between buildings. The rebuild must solve those problems before more destinations or systems are added.

## 2. Non-negotiable design rules

1. **Curriculum is experienced, not merely visited.** Every required outcome must be introduced, experienced in a meaningful situation, applied by the player and reinforced later.
2. **Buildings are places, not one-building-per-outcome.** Adaptability, initiative, communication, teamwork, problem-solving, risk-taking and lifelong learning operate across the whole game.
3. **The world expresses a life.** The recurring geography is Home → Learning/Career Preparation → Work → Commerce/Money → Community → Home.
4. **Every 5–10 seconds of movement reveals something:** a destination, decision, landmark, character, environmental change or sign of life.
5. **The town must work from character level.** Aerial appearance is secondary to what the player sees and understands while walking.
6. **Player choices create trade-offs.** Salary, career level, skills, job security, work environment, employment type, work-life balance, spending and investment choices affect later options.
7. **The town changes visibly.** Learning, tax contributions, class votes and community progress upgrade shared spaces.
8. **Failure produces recovery gameplay, not a dead end.** A poor decision should create cost, delay or a new challenge while preserving a route forward.
9. **No real-time multiplayer dependency for the first build.** Shared class state and visible classmates may be added asynchronously without making the core game technically dependent on live networking.
10. **Use existing approved art.** Do not regenerate assets as part of the map rebuild. Scale and place them correctly.

## 3. Recommended player progression model

Use **story chapters with an event clock**, not dice rolls and not continuous real-time simulation.

Why:

- Dice would make curriculum coverage and classroom pacing unreliable.
- Continuous time would create waiting, missed events and inconsistent lesson progress.
- Chapters allow every student to reach required content while still making different choices.
- An event clock preserves the feeling that life is progressing.

### Chapter structure

1. **Arrival and identity** — create/choose the character, identify strengths, values, interests and an initial occupational direction.
2. **Career preparation** — explore labour-market information, pathways, capabilities, job advertisements, applications and interviews.
3. **First work** — enter employment, earn income, encounter workplace expectations, safety, rights, communication and teamwork.
4. **Independent life** — budget, pay tax, choose purchases, save or invest, and manage work-life balance.
5. **Change event** — experience a megatrend, redundancy, automation, industry change or unexpected personal event.
6. **Adapt and grow** — retrain, transfer capabilities, take initiative, manage risk and pursue lifelong learning.
7. **Contribution and legacy** — contribute to town projects, mentor others and review the evolving career story.

Within a chapter, students can choose the order of several activities. Completing the required experiences advances the chapter clock. Optional opportunities provide advantages, money, capability evidence or richer outcomes.

## 4. Core gameplay loop

1. Receive a goal, problem or opportunity.
2. Travel to a relevant place or speak with a character.
3. Learn or gather evidence.
4. Make a choice or perform an applied task.
5. See an immediate consequence in money, time, capability, wellbeing, reputation or access.
6. See a later consequence during another chapter or life event.
7. Reflect briefly and record evidence toward curriculum completion.

The loop must avoid long blocks of text followed by a quiz. Short instruction can occur, but the decisive learning evidence should come from applying it.

## 5. Curriculum coverage architecture

Create a data-driven **Curriculum Coverage Matrix** outside the scene code. Each outcome should include:

- outcome ID and exact wording;
- chapter(s);
- introduction encounter;
- applied gameplay encounter;
- later reinforcement;
- evidence captured;
- completion condition;
- remediation/retry route;
- teacher-visible status.

Use four coverage states:

1. `introduced`
2. `experienced`
3. `applied`
4. `reinforced`

An outcome is not considered covered merely because a student entered a building or opened a page.

### Capabilities as reusable tools

Capabilities should be earned as usable tools and checked during later events.

Examples:

- **Initiative:** recognise an opportunity, propose an improvement, begin without being prompted, seek missing information, help solve a problem, follow through.
- **Adaptability:** recognise change, regulate the initial response, identify transferable skills, seek information, revise the plan, learn or retrain.
- **Communication:** choose an appropriate channel, audience and tone; listen; clarify; present evidence.
- **Teamwork:** understand roles, contribute, coordinate, resolve disagreement and evaluate team performance.
- **Lifelong learning:** identify a gap, choose credible learning, invest time/money, apply new learning and update the career plan.
- **Risk-taking:** distinguish reckless risk from calculated risk; assess probability, impact, safeguards and opportunity cost.

## 6. Town structure

Use a compact town of approximately **10 columns × 9 rows of 256 px planning cells** (2560 × 2304 px). The cells are a planning system, not visible square lawns. Organic roads, landscaping and overlapping precinct edges should prevent a rigid board appearance.

### Precincts

#### A. Home and Identity Quarter — south-west

- Home Base
- Avatar Studio
- Personal decision point
- Entry/arrival plaza

Purpose: identity, goals, personal management, wellbeing and the visible effects of purchases or career events on the character's life.

#### B. Careers and Learning Quarter — west/north-west

- Skills Centre (may reuse/reframe Initiative Workshop)
- Jobs and Skills Centre / Career Studio
- Lifelong Learning Hub
- EST Prep Lab as an academic support destination rather than the organising centre of the town

Purpose: capability learning, labour-market investigation, pathways, job advertisements, applications, interviews, retraining and formal assessment preparation.

#### C. Civic Heart — centre

- Town Square
- Town Hall
- community notice/event space
- visible class upgrade project

Purpose: orientation, class votes, taxes, shared progress, celebrations and chapter events. All major routes should pass through or clearly relate to it.

#### D. Commerce and Money Quarter — south-east

- Global Shop or general shopfront
- bank/budget interaction point (may initially be UI/NPC rather than a new building)
- transport/purchase display area
- small market street

Purpose: income, tax, needs versus wants, spending, saving, investing, consumer decisions and opportunity cost.

#### E. Work and Enterprise Quarter — east/north-east

- initial workplace destination(s)
- First Job District
- Rights and Safety point
- employer/interview entrance

Purpose: earning, workplace expectations, rights, safety, teamwork, communication and workplace events. Start with one flexible workplace shell; do not build an entire employment simulator in Stage 1.

#### F. Futures and Transformation Edge — north

- Megatrends Centre
- Global Portal
- transformation project gateways
- later links to Green Futures, Digital Access, Fairer Starts and Wider Horizons

Purpose: horizon scanning, global influences, megatrends, redundancy/change events and later town transformations.

## 7. Street and movement design

- Build one **main loop street** connecting Home, Civic Heart, Careers/Learning, Work and Commerce.
- Add two short cross streets through Town Square.
- Use narrow secondary footpaths to transformation areas and optional opportunities.
- Avoid long dead-end routes unless the destination itself is visible and meaningful.
- Main paths must occupy enough visual width to remain legible at character camera zoom.
- Buildings should face and open onto paths; entrances must be visually obvious.
- Keep neighbouring major entrances roughly 250–500 world pixels apart, adjusted after play testing.
- Place a landmark or prop cluster between major buildings.
- Clicking a destination should follow a route graph, not move in a straight line through lawns and obstacles.
- Grass may remain walkable for exploration, but navigation, props and landscaping should make paths feel like the natural choice.

## 8. Scale bible

The source canvas size is not the world size. Most props use 512 × 512 canvases with very different occupied bounding boxes. Never apply one display size to every prop.

Use the existing 96 × 144 px player as the base unit: `1 character height = 144 world px` during the first test slice.

| Asset | Target displayed object height | Placement rule |
|---|---:|---|
| Campus bin | 70–82 px | beside paths; never building-sized |
| Bench | 62–75 px overall; seat near 50 px | align ground baseline with character feet |
| Planter | 75–95 px | use to shape plaza/path edges |
| Bike rack | 65–80 px | near Career/Work/Commerce entrances |
| Wayfinding sign | 165–190 px | intersections only |
| Hologram marker | 140–175 px | interactive destinations; do not overuse |
| Streetlamp | 300–345 px | consistent repeated world scale |
| Small tree | 300–360 px | local landmark and path enclosure |
| Large tree | 475–560 px | sparse canopy landmark; collision at trunk only |
| Shop display | 210–255 px | commerce frontage |
| Community banner | 270–320 px | Civic Heart/event approach |
| Solar canopy | 210–260 px | allow believable clearance beneath |
| Bridge | match connected path width | scale from deck width, not 512 px canvas |
| Waterfall | 320–450 px feature | treat as a landscape site, not a small prop |

Codex must create a central asset manifest containing scale, origin, collision footprint, depth offset and category for every asset. No asset-specific scale numbers should be scattered through scene-drawing functions.

## 9. Camera and framing

The camera should make destinations readable without dramatic pumping.

- Use a stable ordinary walking zoom around `0.92–1.0` during the first slice.
- Travel zoom-out should be mild: approximately `0.84–0.9`.
- Approach zoom should remain around `1.02–1.1`, not `1.32`.
- Prefer smooth positional framing over large zoom changes.
- When approaching a destination, show the entire building entrance and enough surrounding street to orient the player.
- Reduce the current upward follow offset and building lift until the character and destination share the frame naturally.
- Keep Aerial Map as a planning/testing tool and optional player aid.
- The main world—not the minimap—must communicate route and destination.

## 10. Collision, depth and navigation

- Continue foot-based collision for the character.
- Replace broad building rectangles with footprints that correspond to the visible base, allowing the character to appear in front of façades where appropriate.
- Large trees collide at trunks, not canopies.
- Props use small base/footprint collisions.
- Use Y-based depth sorting consistently for player, NPCs, props and the lower portions of buildings.
- Separate interaction zones from collision zones.
- Create a route graph with named nodes for entrances, intersections and bridges.
- Click-to-travel calculates a path through route nodes.
- If blocked, stop safely and preserve manual control.

## 11. World life and class presence

Do not build real-time multiplayer in the first rebuild.

### Stage 1

- Local player only.
- Purposeful NPCs with destinations and short behaviours.
- Shared class figures shown in UI: community fund, project stage and class vote.

### Later asynchronous class presence

- Show selected classmates as non-colliding “echo” avatars or recent visitors.
- Display class achievements and project contributions.
- Allow town state to update from shared class progress.

### Possible future real-time layer

- Opt-in room presence only after the single-player experience is stable.
- Other players should not block doors, collide physically or control curriculum progress.

## 12. Economy and consequences

Track at minimum:

- cash;
- recurring income;
- tax/community contribution;
- savings/investment;
- owned assets;
- skills/capabilities;
- wellbeing or energy pressure;
- job security;
- time/event-clock cost.

Purchases must have later consequences. Spending everything on a car, phone or clothes creates reduced resilience when a redundancy or unexpected expense occurs. Saving everything may protect the future but impose opportunity or wellbeing costs. The system should reward considered trade-offs, not one morally “correct” financial personality.

## 13. Story and event logic

Life events are not buildings. They are state-changing events that can occur in relevant places.

Examples:

- automation changes the player's administrative role;
- a workplace introduces new technology;
- a transport or unexpected expense tests the budget;
- an opportunity appears only if the player previously demonstrated initiative;
- retraining becomes faster or cheaper if the player invested in lifelong learning;
- communication or teamwork evidence changes a workplace outcome;
- a community project unlocks because the class tax fund reaches a threshold.

Events should check prior choices and capability evidence, then branch into recoverable outcomes.

## 14. Technical refactor direction

Keep Phaser 3 and the working page shell. Refactor `world.js` so content data and systems are separated.

Recommended modules/data:

- `world-config.js` — bounds, cell size, camera constants and feature flags.
- `asset-manifest.js` — paths, display scales, origins, collision footprints and depth offsets.
- `town-layout.json` — precincts, buildings, props, water, routes, entrances and landmarks.
- `curriculum-coverage.json` — outcome coverage architecture.
- `story-events.json` — triggers, prerequisites, consequences and recovery paths.
- `economy-config.js` — financial variables and balancing values.
- `WorldScene.js` — Phaser scene coordination only.
- `WorldRenderer.js` — terrain, buildings, props and layers.
- `NavigationSystem.js` — keyboard, pointer targets and route graph.
- `InteractionSystem.js` — proximity, prompts and entrances.
- `CameraDirector.js` — stable context-aware framing.
- `ProgressionSystem.js` — chapters, event clock and unlocks.

Do not perform this entire refactor in one unreviewed edit. Preserve the existing working world and implement behind a feature flag or on a rebuild branch/page.

## 15. Implementation stages

### Stage 0 — preserve and measure

- Create a branch or safe copy of the current world.
- Inventory all existing assets and calculate occupied alpha bounds.
- Build the asset manifest.
- Add a developer scale overlay: character silhouette, world ruler, footprint and origin markers.
- Confirm the blueprint coordinates before map construction.

### Stage 1 — one polished playable slice

Build only:

- Home Base and arrival;
- one compact route to Town Square;
- Career/Skills destination;
- one first-work destination or placeholder entrance;
- the core path loop segment;
- representative props at canonical scale;
- stable camera;
- improved collisions and depth;
- route-based click movement.

Success criteria:

- no empty walk longer than approximately 8 seconds;
- destination is understandable without relying on the minimap;
- the whole approaching entrance is framed;
- props look credible beside the player;
- character cannot walk through visible bases;
- movement remains responsive;
- the slice feels like part of a living town rather than a menu.

Stop and obtain Tania's visual approval before expanding.

### Stage 2 — complete compact town geography

- Add remaining precincts and main loop.
- Add purposeful NPC routes.
- Add environmental landmarks and transformation gateways.
- Validate every route at walking and running speed.

### Stage 3 — progression and curriculum data

- Implement chapters/event clock.
- Connect the curriculum coverage matrix.
- Add capability evidence and required experience checks.

### Stage 4 — economy, life events and class town

- Implement money trade-offs and later consequences.
- Implement megatrend/change branches.
- Connect class contributions, votes and upgrades.

### Stage 5 — asynchronous class presence

- Add non-blocking class echoes/recent visitors if still valuable.
- Consider real-time presence only after evaluation.

## 16. Immediate Codex instruction

Codex must begin with **Stage 0 only**. Do not reposition buildings, rewrite the scene or add gameplay yet.

Required Stage 0 output:

1. Read the current repository instructions and existing world files.
2. Confirm the current working state and create a safe rebuild branch/page.
3. Inventory all world assets, including their pixel dimensions and non-transparent occupied bounds.
4. Draft the central asset manifest with proposed character-relative scales.
5. Translate the approved town blueprint into `town-layout.json` coordinates without rendering it yet.
6. Identify which current functions can be preserved and which should later be separated.
7. Return a concise proposed file-change plan, risks and questions.
8. Wait for approval before changing the rendered map.

## 17. Items requiring Tania's approval

- Final names for the six precincts.
- Whether EST Prep remains a visible town building or becomes part of the Careers/Learning interior.
- The first flexible workplace used in the playable slice.
- Exact curriculum source document and outcome wording for the coverage matrix.
- How much freedom students have within each story chapter.
- Whether wellbeing/energy is visible to students or operates in the background.
- Whether class echo avatars are desirable after the single-player town works.

## 18. Definition of success

Career Empire succeeds when students do not experience it as “walking to the next worksheet.” They should experience a coherent early-career life in which what they learn changes what they can notice, choose, survive, earn, build and become—and the teacher can still prove that every required curriculum outcome has been covered.
