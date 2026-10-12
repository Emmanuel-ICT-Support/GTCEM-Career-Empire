# Entry environment dependency repair

Follow-up to the frozen combined photo/clue candidate `0fdb64a`. PR53's original `a4007ad` hosted trace reached path-assets-ready at 38.7 seconds but did not emit entry-ready; environment dependencies were requested afterward. That observation identifies the remaining boundary, without proving the relative cost of imports, integration, phase application or rendering.

Entry now starts the environment module import alongside `worlds.loadEntry`, preserving the existing avatar-priority gate. It still waits for both, integrates the entry environment, applies the original phase, then opens the campus. Import rejection remains handled and reaches the existing retry notice.

Full surroundings are imported only inside full-campus integration. The original Market exterior function is moved byte-for-byte into a slim module, so early landmarks no longer statically import paving/gardens or full surroundings. Its compatibility export is retained. Original oval/grass/Market geometry, materials and collider remain; full-campus gardens, Media/SPACE, trees, interiors and activities remain available when requested. Cache tags and manifest are reconciled.

The existing recovery browser test now records environment import start/ready, integration start/ready and phase-applied in addition to its prior milestones. These are response-only test observations; shipped runtime has no added telemetry. The 45-second readiness predicate, 60-second test budget, actual grass failure/retry assertions and failfast-zero full suite remain unchanged.

Acceptance pending: no browser, local listener, rendered-pixel, phone or hosted improvement claim. Preserve the original PR53 run until its full evidence completes, then test the consolidated follow-up through the permitted publishing route.
