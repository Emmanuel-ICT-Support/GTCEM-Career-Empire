# Dress ups hair and shoes

Four authored hairstyles (short sweep, soft curls, bob, ponytail) and four shoe styles (trainers, boots, dress shoes, clogs). The four Style categories use rendered thumbnails; every style remembers its own hex colour. Bare feet and no hair remain available. Existing profiles retain their previous appearance until a style is chosen.

The canonical body and approved garments are unchanged. Accessories share the original 41-bone rest matrices. Shoes use foot/toe/calf weights from the source; hair follows the head. Body-only normalization prevents tall hair or thicker soles from changing the avatar proportions. Shoes add only 9 mm of render translation to clear the ground. Only selected GLBs download; failures remain retryable.

Authoring sources are deterministic Blender scripts under tools/wardrobe/hair-shoes. Preserved working master and diagnostic evidence live outside this temporary checkout in the project work/hair-shoes directory. CE-CHANGE-20260921-78 in the canonical Blueprint records publication, exact hashes, test boundaries and subsequent worktree retirement.

Native-walk/rest and garment interface verification is sampled, not cloth simulation or all-animation certification. Physical phone/student acceptance remains with Tania. Exact final fit, browser, public-hash and retirement receipts are maintained with CE-CHANGE-20260921-78 in the canonical Blueprint.

The local serial release suite passed all 42 unit and 63 browser tests. Final sole topology then passed 47 rest/native-walk poses, 40 body/garment comparisons per pose with zero finite-edge crossings, all eight GLB round-trip checks and four final Chrome/Safari wardrobe scenarios. These tests include phone-size touch controls. Sole undersides use local tessellation so foot/toe weights deform them cleanly. The earlier parallel suite was stopped under resource pressure; it is not a passing result. Hosted CI and public verification are recorded separately in the Blueprint.

Hosted candidate d166d1c passed 42 unit and 23 preceding browser tests, then reached the eighth accessory in the combined workflow before its 240-second total budget expired. The full eight-style test now allows 600 seconds in total, retaining 30-second individual functional waits and all assertions. This is a hosted test-duration adjustment, not a game-runtime change or a full-CI pass.
