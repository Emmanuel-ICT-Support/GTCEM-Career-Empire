# Published failure comparison - 18 October 2026

Published run38667011027 at423d2ab:175passed/67failed of242. Local broad run:245passed/7failed of252, with zero skipped/interrupted/unrun and exact accounting. All242baseline cases map. This is the pre-follow-up broad result, not a fresh full run of the final source. Later focused receipts are in repair-resume-20261018.md.

Each row retains a freshly retrieved published error and its local outcome. A pass under a changed runtime/browser does not uniquely establish which repair caused the difference; saved investigations are in the JSON ledger. These are67failed cases, not67distinct bugs.

| Case | Published error | Local broad |
|---|---|---|
| admin-preview.spec.js - public shortcut opens isolated fresh Admin and preserves normal gates 1280 | Error: Test timeout of 120000ms exceeded | passed |
| admin-preview.spec.js - public shortcut opens isolated fresh Admin and preserves normal gates 390 | Error: expect(received).toMatchObject(expected) | passed |
| chapel-approach.spec.js - live keyboard route reaches the actual Chapel door without changing position or progress directly | Error: locator.click: Test timeout of 90000ms exceeded. | passed |
| entry-visibility-probe.spec.js - initial complete campus, unobstructed rear buildings and parcel walking 1280 | Error: expect(received).toBeGreaterThanOrEqual(expected) | passed |
| entry-visibility-probe.spec.js - initial complete campus, unobstructed rear buildings and parcel walking 390 | Error: expect(received).toBeGreaterThanOrEqual(expected) | passed |
| market-gate.spec.js - physical market gate exits and re-enters without clicks 1280 | Error: page.evaluate: Error: Market keyboard waypoint timeout {"sample":{"mode":"town","position":[42.988956451416016,0.0000994659165735047,36],"scene | passed |
| market-gate.spec.js - physical market gate exits and re-enters without clicks 390 | Error: page.evaluate: Error: Market keyboard waypoint timeout {"sample":{"mode":"town","position":[42.98894979053201,0.00011703377350941735,36],"scene | passed |
| market-stats.spec.js - Market money and collection stay available 1280 &mode=full | Error: expect(locator).toBeVisible() failed | passed |
| navigation-map.spec.js - live default map and Stats 1280 | Error: expect(received).not.toBe(expected) // Object.is equality | passed |
| navigation-map.spec.js - live default map and Stats 390 | Error: expect(received).not.toBe(expected) // Object.is equality | passed |
| navigation-map.spec.js - returning photo handover and once-only rewards 1280 | Error: expect(locator).toContainText(expected) failed | passed |
| navigation-map.spec.js - returning photo handover and once-only rewards 390 | Error: expect(locator).toContainText(expected) failed | passed |
| render-budget.spec.js - Auto keeps controls available, manual quality works, and hidden views stop rendering | Error: expect(received).toBe(expected) // Object.is equality | passed |
| runtime-recovery.spec.js - pending Market travel yields to visible Character Studio and late completion stays cancelled | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | passed |
| runtime-recovery.spec.js - stalled Market travel releases the campus and normal retry remains visible and walkable | TimeoutError: locator.waitFor: Timeout 30000ms exceeded. | passed |
| staged-entry.spec.js - sharp entry prepares the next task without loading distant campus or recording completion | Error: expect(received).toBe(expected) // Object.is equality | passed |
| staged-entry.spec.js - skipping avatar prepares market kits without a market visit | Error: expect(received).toBe(expected) // Object.is equality | passed |
| arrival-gardens.spec.js - arrival walk reaches Studio and retains avatar save after reload | Error: Walking did not reach the Studio approach | passed |
| avatar-recovery.spec.js - failed startup avatar can retry without reloading or changing the saved profile | Error: expect(received).toBe(expected) // Object.is equality | passed |
| avatar-studio-entry.spec.js - Home Base returns to ECC welcome; Studio remains separate | Error: Timeout 5000ms exceeded while waiting on the predicate | passed |
| chapel.spec.js - Chapel reflection and campus return at 1440px | Error: expect(received).toBeLessThan(expected) | passed |
| chapel.spec.js - Chapel reflection and campus return at 390px | Error: expect(received).toBeCloseTo(expected, precision) | passed |
| curriculum-loading.spec.js - curriculum rooms remain accessible when campus decoration and Studio fail | Error: expect(locator).toBeVisible() failed | passed |
| curriculum-loading.spec.js - slow saved avatar, Studio and poster never gate EST at 1280px | Error: expect(received).toBeLessThan(expected) | passed |
| curriculum-loading.spec.js - slow saved avatar, Studio and poster never gate EST at 390px | Error: expect(received).toBeLessThan(expected) | passed |
| curriculum-loading.spec.js - failed avatar keeps fallback playable, retry restores saved avatar without rewriting it | Error: expect(received).toBe(expected) // Object.is equality | passed |
| curriculum-loading.spec.js - unavailable saved clothing uses fallback and never fetches other outfits | Error: expect(received).toBe(expected) // Object.is equality | passed |
| est-wall-video.spec.js - EST requires wall play, seeks and restarts at 1440px | Error: expect(locator).toBeVisible() failed | passed |
| est-wall-video.spec.js - EST requires wall play, seeks and restarts at 390px | Error: expect(locator).toBeVisible() failed | passed |
| first-play.spec.js - Arrival is playable while distant models and textures wait, then opens the whole campus | Error: expect(received).toBeLessThan(expected) | passed |
| first-play.spec.js - background failure keeps Arrival and Studio usable; retry does not duplicate scenery or replace the avatar | Error: expect(received).toBe(expected) // Object.is equality | passed |
| first-play.spec.js - a failed entry texture retries before optional landscape loads | Error: Timeout 5000ms exceeded while waiting on the predicate | passed |
| game-entry-loading.spec.js - game entry loads only the active avatar and worn clothes | Error: expect(received).toBe(expected) // Object.is equality | passed |
| game-entry-loading.spec.js - game entry loads only the active avatar and worn clothes | Error: expect(received).toBe(expected) // Object.is equality | passed |
| startup-campus-entry.spec.js - video to complete exterior, walking and automatic parcel at 1280 | Error: expect(received).toMatchObject(expected) | passed |
| startup-campus-entry.spec.js - video to complete exterior, walking and automatic parcel at 390 | Error: expect(received).toMatchObject(expected) | passed |
| startup-costs.spec.js - measure complete campus handover costs cold-skip | Error: expect(received).toBeLessThan(expected) | passed |
| startup-performance.spec.js - normal play avoids GPU pixel probes and uses shared building textures | Error: expect(received).toBeGreaterThan(expected) | failed |
| startup-surface-gate.spec.js - complete intro reaches natural end and hands over to usable movement | Error: expect(received).toBe(expected) // Object.is equality | passed |
| startup-surface-gate.spec.js - mocked owned-account parcel, map and shared wallet persist without a duplicate reward | Error: expect(received).toBe(expected) // Object.is equality | passed |
| suit-flicker.spec.js - playable suit shadows follow every walking frame at 1280 | Error: locator.click: Test timeout of 30000ms exceeded. | failed |
| suit-flicker.spec.js - playable suit shadows follow every walking frame at 390 | Error: locator.click: Test timeout of 30000ms exceeded. | failed |
| whole-characters.spec.js - named characters: selected-only startup, lazy tests, rig measurements, switching and persistence | Error: page.evaluate: TypeError: Cannot read properties of undefined (reading 'scene') | passed |
| header-controls.spec.js - banner controls are clear and destinations work at 854 | Error: expect(received).toBe(expected) // Object.is equality | passed |
| movement.spec.js - player travel, gait, turn and stop at 1280 | Error: expect(received).toBeGreaterThan(expected) | passed |
| movement.spec.js - player travel, gait, turn and stop at 390 | Error: expect(received).toBeGreaterThan(expected) | passed |
| movement.spec.js - player travel, gait, turn and stop at 1280 at 8 FPS | Error: expect(received).toBeGreaterThan(expected) | passed |
| night-market-agency.spec.js - Home Economics entrance and return use real navigation | Error: expect(locator).toHaveText(expected) failed | passed |
| night-market-agency.spec.js - complete keyboard shift, learning, review transfer and return 390 | TimeoutError: page.waitForFunction: Timeout 15000ms exceeded. | passed |
| night-market-research.spec.js - research mission and pass 1280 | Error: locator.click: Test timeout of 30000ms exceeded. | passed |
| night-market-research.spec.js - research mission and pass 390 | Error: locator.click: Test timeout of 30000ms exceeded. | passed |
| night-market-research.spec.js - fresh review uses the actual game and leaves existing saves untouched | Error: expect(locator).toContainText(expected) failed | passed |
| night-market.spec.js - legacy night market complete loop and saved rewards at 1280px | Error: expect(locator).toHaveText(expected) failed | passed |
| night-market.spec.js - legacy night market complete loop and saved rewards at 390px | Error: locator.click: Test timeout of 120000ms exceeded. | passed |
| night-market.spec.js - market failure leaves campus and curriculum reachable | Error: expect(locator).toContainText(expected) failed | passed |
| phone-startup.spec.js - phone opening uses smaller phone assets once and releases startup cache | Error: expect(received).toBe(expected) // Object.is equality | passed |
| phone-startup.spec.js - failed phone tree load clears temporary cache and supports retry without reloading the character | Error: expect(locator).toBeVisible() failed | passed |
| playable-scenery.spec.js - campus waits for both buildings and keeps destinations and movement | Error: expect(locator).toBeVisible() failed | passed |
| playable-scenery.spec.js - failed campus loading explains retry instead of revealing missing buildings | Error: expect(locator).toBeVisible() failed | passed |
| playable-startup.spec.js - startup loads only the active avatar and keeps the studio and hall usable | Error: expect(locator).toHaveAttribute(expected) failed | passed |
| stall-refine.spec.js - Juniper food and staff clear the shallow counter in packing and collection roles | Error: locator.selectOption: Test timeout of 90000ms exceeded. | passed |
| startup-exterior.spec.js - delayed courtyard must not hold game entry | Error: expect(received).toBeLessThan(expected) | passed |
| startup-exterior.spec.js - failed courtyard keeps curriculum usable and retry opens campus once | Error: locator.click: Test timeout of 90000ms exceeded. | passed |
| teachers.spec.js - teachers: reactions, bounded collision, lazy loading, mobile and recovery | Error: locator.click: Test timeout of 240000ms exceeded. | passed |
| test-character-controls.spec.js - Dress ups named colours, lazy archive and saved per-style choices 1280 | Error: expect(received).toBe(expected) // Object.is equality | passed |
| trial-launch.spec.js - plan to visible trial has a clear next step at 1280 | Error: locator.click: Test timeout of 90000ms exceeded. | passed |
| trial-launch.spec.js - plan to visible trial has a clear next step at 390 | Error: locator.click: Test timeout of 90000ms exceeded. | passed |
