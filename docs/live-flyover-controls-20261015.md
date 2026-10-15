# Published Flyover and Land controls

Verified 15 October2026 against main423d2ab and the actual public app.js,
flyover.js and flyover.css; all three match that commit byte-for-byte. The
verification receipt is in the GL caller evidence directory.

1. Outside on campus, open **Options → Flyover**. Full-activities mode shows
   **Flyover** directly in the header.
2. **WASD** flies horizontally; **E** rises, **Q** lowers; drag to look.
3. Click **Land · L** near the upper right or press **L** to place the character
   on nearby safe outdoor ground.
4. **F**, **Esc**, or **Return to player** exits to the previous player position.

Flyover is visible only outdoors after the full campus is ready. If missing,
**Options → View → Aerial view** explicitly requests the full campus; wait for
loading, then reopen Options. Intro, picture-trail, Echo and other dialogs block
entry. For **F**, close Options and focus the game view first.

Land exists in this live version and appears only during active Flyover. It stays
visible when **H / Hide controls** hides the other controls. If there is no safe
ground, the game asks the player to fly to a clear outdoor path and try again.

Source: `423d2ab:playable-3d/flyover.js`, `flyover.css`, and `app.js`
(`setupExplorationMenus`, `canFlyover`, `landFromFlyover`). No unpublished opening
code was used and no live change was made.

At the Chapel doorway picture-trail dialog, **F is intentionally blocked** while
the dialog is open (`discovery.open()` is true). Choose **Continue from doorway**,
then use **Back to exploring** or **× / Close clue**; outdoors with full campus ready, focus the view
and press **F**. Finishing the whole photo trail is not an entry requirement.
