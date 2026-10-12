# Teacher reveal visibility source fix

Source-only candidate atopc0dbd84. Release owner retains browser slot; no browser/GPU work or preview8910 change.

Teacher loading is intentionally gated by discovery.revealed and proximity within28units of-4,-54. Normal reveal starts after a mural shot (trailstep3), approaching within3units of-4,-57; startScene sets sequence before reveal callback, which explicitly calls updateTeacherLoading. Thus normal entryOnly does not inherently deadlock teacher spawning. Correct supplied names remain Mr Middleton and Mr Psandodakis.

Definite mismatch: cancelling the photo-finish scene withEscape/Back toexploring clears sequence but leaves step3. Old revealed() returned step4||sequence, so loaded teachers become hidden again. Greeting and tap candidates only checked distance, allowing Sayhello controls for invisible roots. This fits the reported activeSayhello/absentteacher screenshot, although exact screenshot runtime state was not inspected here.

Set existing revealStarted latch when the surprise starts and use it for revealed(). Cancel keeps revealed teachers visible without advancing progress/reward; explicitReplaytrail clears latch, and freshguest/reload initialization stays hidden until actualreveal. Restoredcompletedphoto remains revealed. Greeting, interaction and tap candidate paths now require root.visible. No NPC model, spawn, clip, material, photo capture or movement changes.

133units/source checks pass;3new state regressions cover hidden-before-surprise, cancel-preservesvisibility/progress and completed/replay behavior. Runtime camera/occlusion/visibility combined acceptance remains with releaseowner; no public publication claim. Separate partialload retry risk remains: teacherAttempted suppresses another failed model request until leaving/reapproaching; screenshot'sSayhello confirms at leastoneinstance, not both model successes. This patch does not invent a network-load diagnosis.
