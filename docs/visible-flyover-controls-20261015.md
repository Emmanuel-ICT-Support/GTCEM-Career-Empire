# Visible Flyover controls — review candidate

Flyover was easy to miss in Options, and F gave no explanation while a picture
clue was open. The new **Flyover · F** button sits above the existing bottom-left
arrows/phone joystick after actual entry readiness. While flying, **Land · L**
occupies that location; **Return to player** remains separate. Options and the
existing F/Esc/H shortcuts remain available. Land stays visible in clean view.

The reminder is disabled with a reason while campus preparation, a clue, a
companion/picker, tour step or other blocking panel prevents it. An open game
dialog also shows the explanation directly below its heading. Closing a clue
preserves trail progress. The control does not appear over the intro/loading
screen or permit premature entry. The entry gate, keyboard handler and safe
landing callback/controller are byte-identical to the completed native baseline.
The phone panel was widened slightly so its touch-control labels fit.

This is a separate UI change following baseline4be9050. That baseline completes
33/33 scoped native cases, with the original interrupted scenery attempt retained.
No 3D models, artwork, trees, shadows, camera movement/landing rules, Market
curriculum, pay/save gates, authentication or opening/password logic changed.
The shell and stylesheet changes only refresh the relevant cache tags. No new
model or library is loaded by this control.

## Focused verification

Six distinct native UI scenarios now pass across the recorded focused runs:

- New1280 desktop and390 mobile-layout scenarios: visible placement, pointer
  entry/Return, exact frozen actor/physics and camera restoration, F/L/Esc/H,
  actual low-ground landing, walking after landing, blocked clue explanation,
  clean-view Land visibility and a phone landscape viewport check.
- Existing exact camera/player restoration and movement scenario.
- Existing focus-safe shortcuts, repeated entry and indoor exclusion scenario.
- Existing mobile touch altitude/release and show-controls scenario; every panel
  button is in view and fits horizontally.
- Existing safe roof landing and ordinary map/menu arrival scenario.

Successful keyboard/roof landings use real world collision. Only the no-ground
UI error branch intentionally substitutes an unavailable landing finder; it
checks that the actor stays put and flying remains active when landing fails.
All browser runs use one worker, zero automatic retries, no traces/video output
and native Metal. Mobile layouts are emulation, not physical-phone acceptance.

There were16 UI development executions:11passes and5failed/timed-out attempts,
all retained. The first run exposed a stale canvas-tap coordinate now occupied by
Land and a pre-click pose sample. A capture-phase microtask observer then sampled
before Return; the final bubble-phase observer records after the actual handler
without any tolerance relaxation. Visual review additionally caught phone label
clipping and a below-fold explanation. The affected three-case visual-polish run
passes. These corrections do not alter game physics or readiness thresholds.

Twelve scoped landing/render-quality unit checks pass. Final collection has245
unique IDs: all original243 retained plus2 new UI cases. Staged release verification
passes284 exact hashes and89 reachable modules. Changed modules pass syntax and
whitespace checks. The filesystem source check passes in the previous isolated
verified-Assets tree after confirming all its input directories/script are
unchanged; new playable modules are checked separately. The sparse checkout and
all original Assets stay intact; no large asset rebuild/copy was performed.

All619 protected older evidence files rehash identically. Disk guards checked
headroom before each resumed batch, and about2.2GiB remains. No evidence was
deleted. Original native/UI failed attempts and the earlier disk/transport pauses
remain documented. No full245-case browser suite, live merge or deployment.
Software startup/movement remain failed and school hardware remains unqualified.

Screenshots (all from the final passing visual-polish run) and exact source/report
hashes are listed in visible-flyover-controls-20261015.json. Preview copies are
under ../ecc-safe-runs/flyover-ui-2026-10-15T06-14-07-784Z-WOhYhj/previews/ :
desktop-ready.png, desktop-flying.png, desktop-landed.png, desktop-blocked.png,
and corresponding mobile images. Source raw screenshots are retained separately.
