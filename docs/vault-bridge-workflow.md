# Vault Bridge Workflow

Last updated: 2026-05-08

## Purpose

Vault Bridge is the approved gameplay direction for the EST Prep Glossary Check. It should make rote glossary learning feel like a fast visual crossing challenge rather than a worksheet or static quiz.

The player fantasy is:

- start at the vault entrance on the arrow runway
- read one definition target
- choose the correct term from three visible bridge pieces
- build a safe path across the vault bridge
- enter the salary portal after a short set of secured words
- bank salary, tax, glossary progress, and then choose whether to keep playing or exit

## Live Prototype

Current live playtest:

`modules/est-prep/vault-bridge-playtest.html`

Live URL:

`https://emmanuel-ict-support.github.io/GTCEM-Career-Empire/modules/est-prep/vault-bridge-playtest.html`

Current backdrop asset:

`Assets/Images and Animations/Glossary Check/Vault Bridge/vault-bridge-backdrop.png`

Current prototype state:

- uses the generated Vault Bridge vault-room backdrop
- uses ECC/Emmanuel character PNGs, not a generic vector runner
- lets the user switch between MacKillop, Romero, and the EST guide
- tests a five-word round
- moves the character to selected options
- has correct/wrong feedback and a portal completion overlay

This page is a playtest surface. It is not yet the final integrated Glossary Check game.

## Approved Visual Direction

Use the EST visual-system rules:

- one screen should usually equal one action
- strong character art should carry real weight
- motion must signal success, warning, unlock, progress, or transition
- reward feedback should connect to salary, tax, community, shop, global list, and glossary mastery
- avoid returning to long-scrolling worksheet layouts

Use ECC/Emmanuel character assets:

- MacKillop and Romero should be available as player characters
- the EST guide can be a coach or optional player skin
- do not use the rough custom SVG runner

The bridge environment should feel:

- mature enough for Year 12 students
- futuristic, vault-like, high stakes
- readable under question cards and answer tiles
- visually exciting without hiding the gameplay

## Next Gameplay Shape

Rework the current prototype into a true bridge path with 15 game pieces:

- five sets of three pieces
- each set represents one glossary question
- each set has three possible term answers
- the player starts on the arrow runway at the entrance
- the exit portal is at the far side of the vault

The path should read left-to-right / entrance-to-exit, even if perspective makes it slightly diagonal.

## Correct Answer Flow

For each question:

1. Show the definition target.
2. Populate the next set of three pieces with answer terms.
3. User clicks one piece.
4. Character walks, hops, or glides to that piece.
5. If correct:
   - selected piece locks green or becomes a clean safe bridge tile
   - the word can fade away or become visually redundant because the next question is loaded
   - the two wrong pieces drop away, dissolve, or sink into the data river
   - progress advances to the next set of three pieces
   - a short success pulse plays
6. Load the next definition and next three options.

## Wrong Answer Flow

Latest approved direction:

If the user chooses the wrong piece:

- show a quick wrong-state flash on the chosen piece
- drop, dissolve, or glitch all current option pieces
- repopulate the pieces for the run
- reposition the character back to the start arrow runway
- restart the current bridge run from the entrance

This creates a clearer arcade-risk loop than a soft quiz correction.

## Completion Flow

After five correct glossary terms in one run:

1. The character moves from the final safe piece toward the exit door / salary portal.
2. The character enters or passes through the portal.
3. Play a stronger celebration overlay.
4. Show a reward card:
   - five words secured
   - glossary mastery gained
   - salary banked
   - tax paid
   - community/shop/global contribution queued
5. Give two choices:
   - Keep playing
   - Exit to EST Prep

## Interaction Requirements

The final version should feel tactile and game-like:

- answer pieces should be large clickable game objects
- movement should be obvious after every click
- correct and wrong states should be immediate
- the player should always know where they are on the bridge
- the current question should be short and prominent
- the progress display should show current run progress, not just a generic score

## Branch And Publishing Notes

Keep Vault Bridge work scoped to a Vault Bridge branch/worktree where possible.

Suggested branch names:

- `codex/vault-bridge`
- `codex/vault-bridge-live`

Do not mix Vault Bridge changes with unrelated dashboard, landing page, auth, or student hub edits. Push to `main` only after the staged files are confirmed to be Vault Bridge-specific.

## Open Implementation Tasks

- Replace the current three-platform prototype with five sets of three path pieces.
- Animate wrong pieces dropping away.
- Animate correct pieces locking into the path.
- Reset the character to the entrance after a wrong answer.
- Pull real glossary terms from the glossary bank instead of using hard-coded sample terms.
- Track per-term attempts and accuracy once integrated into Glossary Check.
- Add a final reward bank state that connects to the platform economy.
