# Admin guidance and archived avatar controls — 13 October 2026

Authorized scope: ECC repository only, based on verified PR53 main
`46d63d4d55a24123d3a578e3d257f0625f462426`. The original release checkout at
`bdc6be7` retains its unrelated asset symlinks and untracked QA files. This
isolated local clone uses shared Git objects and a sparse source checkout.
No `.agents/skills` files exist in this baseline; root AGENTS.md was inspected.

## Batch 1: next paid gig

All three retained first-gig completion flows now offer Visit Reception and
identify the west entrance. After pay, the compact objective and a Reception
shortcut remain visible outside the collapsed Journal. The shortcut hides
inside Administration and before pay. Existing Reception introduces Nora and
her research fee; later curriculum disclosure remains as implemented.
`marketComplete(s)` remains exactly `s.paid === true`. No gate, wage, reward,
curriculum, model, map, startup or photo-handover logic changed. Runtime import
and entry cache tags and affected release-manifest hashes were refreshed.

Validation on this commit candidate:

- 37 focused Vitest tests pass: first-gig state, agency, research fee and
  Administration boundary/interaction logic.
- Six installed-Chrome browser scenarios pass at 1280px and 390px: newly paid
  completion, returning paid shortcut outside collapsed Journal, and existing
  Reception/source/work-plan/application scenarios.
- New browser checks verify no Administration modules before explicit visit,
  hidden shortcut before pay, exactly $18 wages, byte-identical saved practice
  data across the returning-player visit, and shortcut hiding after reset.
- Phone screenshots inspected; Reception dialog fits without horizontal
  overflow. Screenshot evidence and run log are under ignored
  `coverage/ecc-admin-avatar/` and `coverage/admin-browser.log`.
- Development source/reference check passes; staged release verification passes
  270 exact hashes and 82 reachable local modules; syntax and whitespace pass.

Execution notes: sandbox denied the first localhost bind. Approved execution
permission allowed browser QA. Default Playwright Chromium is absent; installed
Chrome was used with a local QA config. An initial new-test run had two overly
broad snapshot comparisons that included expected office runtime changes; the
assertions were corrected to compare the saved practice record. Final six checks
pass. Full CI/startup probes and physical devices were intentionally not run,
following the requested focused scope. Public deployment is not yet verified.

## Batch 2: archived character controls

The same seven Test character IDs now have concise capability labels and
consistent descriptions, including Dress ups' four existing clothing/hair/shoe
sets, fixed outfits, the incomplete jacket fit test and legacy Body A/B controls.
The archive remains collapsed and its catalog imports only after opening it.
The eight named whole-character entries, their catalog, rigs, GLBs and loading
logic are unchanged.

Named colour menus supplement existing colour pickers/hex inputs for Dress ups
and the legacy A/B colour controls. Included presets cover teal, silver and deep
auburn hair, burgundy trousers and a camel jacket. They use the existing draft,
per-style storage, preview and Undo/Redo paths. No garment, fitting, jeans model
or historical model/branch added. Legacy `auburn-deep` now maps to its existing
`#8a3a22`; an explicit stored hair hex still takes precedence. Existing legacy
hair mappings and save schema/key remain intact.

Validation on the Batch 2 candidate:

- 12 focused Vitest checks pass across archived profile compatibility, wardrobe
  profiles, pants profiles and whole-avatar metadata. Coverage includes exact
  primary names/archived IDs, deep-auburn import and explicit-hex precedence,
  invalid-value fallback, independent colour persistence and round trips.
- Four real installed-Chrome Studio scenarios pass at 1280px and 390px. Archive
  opening downloads no extra model; presets cause no further model requests;
  hair teal/silver/deep auburn, burgundy suit pants, camel suit jacket and brown
  boots apply; switching tops remembers colour; Undo/Redo and saved values pass.
  Both legacy bodies expose their stated controls. No captured page errors in
  the Dress ups cases; all tested editor panels avoid horizontal overflow.
- Desktop archive and phone hair-preset screenshots inspected. Evidence is in
  ignored `coverage/ecc-admin-avatar/`; log: `coverage/avatar-browser.log`.
- Development source/reference check, changed-module syntax, diff whitespace
  and staged release verification pass (270 hashes, 82 local modules).

Default Chromium and full CI/physical-device limits remain as described above.
The successful native GitHub read outside the network sandbox confirms main is
still PR53. Publication is attempted through the existing native credential
setup; no credentials, security settings or repository history are rewritten.
