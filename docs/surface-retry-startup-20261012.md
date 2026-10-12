# Surface recovery and startup candidate

Based on 5d27364. A failed grass/decorative image previously remained invisible to Retry until all other queued images drained. The queue now notifies the application on each failed job; Retry runs one separate failed-job worker alongside the four original workers. Per-job ownership prevents duplicate active downloads and repeated clicks reuse the retry promise. The original batch waits for active retry attempts before deciding its final failure state. Texture identity, source hydration, orientation, samplers and colour space remain intact; late original responses still hydrate the original texture.

Executable queue regressions hold four decorative downloads while failing grass, observe immediate failure, restore grass via Retry before releasing decoration, and verify exactly one request per decorative image. A second test covers repeated failure/retry. Entry dependency coverage verifies stalled exterior downloads do not gate entry.

Existing Careers/EST exterior-only loads now begin alongside entry paths, after the selected-avatar priority boundary; original assets are retained, no interiors/full-campus call is added, and hydration starts after entry. This is a scheduling repair, not proof the user's rear building is visible at first frame on their network.

Explicit Low/High resolution choices are preserved (1/2), correcting the previous software-Auto policy overriding those choices. Software Auto remains 0.75/512 shadows. No geometry, player progress, storage, clue routing or physics changes.

The actual entryReady publication failure remains unproven. Hosted startup instrumentation now reports page errors immediately and measures the first post-entry simulation, camera/UI, clear, quality and render stages plus readiness publication. Assertions and deadlines are unchanged. Local browser/server execution remains unavailable because localhost binding is denied; no current-candidate rendered pass, movement pass, Library screenshot or live fix is claimed. Hosted startup gate must pass before broader critical journeys and full shards run.
