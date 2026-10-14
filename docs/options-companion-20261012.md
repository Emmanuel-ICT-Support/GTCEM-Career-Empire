# Options and companion follow-up — 12 October 2026

Separate branch `fix/options-sprite-20261012`, reconciled onto actual PR49 main `9c5d7c70b73474d566d83fd94601cc28b554a2a7`. No publication or changes to the release owner's checkout. PR49's initial EST/Careers access guards remain intact. Guest session/authentication modules and economy code are unchanged.

## Reproduction

Both supplied Library screenshots were materialized using the supported resolved-reference helper onto this Mac and inspected internally. They show the market and the Options dropdown. Live and the prior guest-first candidate reproduced: Options remained open after confirming the companion, blocking movement; the Sprout GLB was requested but its root remained at Arrival Gardens `[-5.85,0,22.7]`, and the update explicitly hid it outside town mode. The candidate model reached ready while the player was at market `[0,0,7.5]`. Screenshots are private QA, not published or uploaded.

The existing character's exact name/ID/assets are **Sprout**, `sprout`, `assets/helpers/sprout.png` and `assets/helpers/sprout.glb`. No Sprite asset or ID exists in the supplied catalog. The user called this character Sprite; this patch preserves the established Sprout spelling and all seven existing companion IDs, rather than inventing a new identity or breaking old saved choices.

## Change

Options now explicitly says movement is paused and provides **Close options / Resume**. Escape works from anywhere while it is open; outside pointer dismissal restores canvas focus when returning to the world. The dismissal gesture is consumed on the canvas/movement controls so it cannot also talk to an NPC, drag the camera or move. A later deliberate gesture works normally. Nested menus close with Options; keyboard access to controls remains. Phone popover stays within the viewport. The existing safe menu pause is retained.

Opening the companion picker closes Options; confirming/cancelling restores focus and resets stale input. Picker portraits remain an optional preview: changing the radio selection does not fetch a model until Continue, and cancelling leaves the saved choice unchanged. The confirmed choice starts one guarded lazy guide import. An accessible live status reports loading, readiness, or the existing Echo fallback and retry. Only selected GLBs fetch, and the existing replacement/late-load GPU disposal remains intact.

The companion root moves into the currently visible world, stays beside the player during navigation, and faces the camera. The static Course Documents pedestal remains in town. Only the chosen companion is present in market/Chapel/interior, not town-only resources. The projected companion label is clamped within the screen on phones. None/journal remove the mesh; failure activates the existing procedural Echo fallback; reselecting retries the selected model. A choice after photo completion counts as the optional offer, avoiding another chooser at market handover. Same-run My Life continuation restores the selected companion; ordinary fresh guest reload still removes guest progress and choice.

## Verification

- Source checks and 123 unit checks pass.
- Four focused Chrome scenarios pass together (3.1 minutes): repeated Resume/outside/Escape/keyboard, actual selected Sprout beside the market player with screenshots, Moss switching/None removal, same-run My Life return/fresh reset, delayed/failing GLB fallback/retry, and phone 390x844 with actual CDP touch-event joystick drag and outside-tap consumption.
- Sprout keyboard preview/cancel requests no helper GLB. Initial entry requests none. Confirmed/switching flow requests only `sprout.glb` and `moss.glb`, with no other helper models.
- Three guest regressions pass (1.2 minutes): fresh guest reset/old-save preservation, mocked verified-account namespace retention, and actual photo completion → optional skip → actual market.
- Desktop Sprout-market and phone companion/Options screenshots inspected: selected mesh visibly present, popover and label fit viewport. No page errors in the normal market/switch/module/fresh flow.

The rebased PR49 tree passes 123 units and source checks; 243 exact asset hashes and 65 app-reachable modules verify. Seven final rebased scenarios passed together; the repeated-resume test initially walked into the real automatic parcel reminder, so its corrected sideways-walk run passed separately (21.8 seconds). All eight final scoped scenarios pass across these runs. Menu movement assertions allow under 2 cm of Rapier settling and require over 15 cm for actual resumed movement. No production relaxation or reminder suppression was made. No physical-phone, real student-login, complete hosted-CI or public-release acceptance claim. Previous PR49 student auth-contract limitation remains unchanged; this patch does not treat local identity as authentication. Market Admin/curriculum work is outside scope.
