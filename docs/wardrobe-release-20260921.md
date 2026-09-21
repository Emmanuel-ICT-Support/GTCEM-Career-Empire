# Approved occupational wardrobe

The approved Avatar Studio wardrobe replaces the earlier single-pants experiment with four pants and four tops, recognisable thumbnail cards and individual remembered hex colours. The exact canonical avatar, existing saved characters and original source assets remain intact. Hair and shoes are future work.

Use `playable-3d/?outfit=wardrobe` for direct Studio entry. This defers campus scenery until Town is selected. Only the selected top, pants and neckline insert download; visited garments are cached and a failed garment download can retry by selecting its card again. Saving stays disabled until the selected outfit is available. The normal campus route and existing browser-local profile storage key are retained.

Approved clothes: hospital scrub pants/top, chef pants/jacket, tradie work pants/work shirt, suit pants/jacket. The latest long-sleeve refinement includes the reviewed arm joins, raised back collars and stronger lapels. The neckline insert is cosmetic; the complete canonical body is retained. Source geometry/rig review covered rest and 46 native walk poses before user acceptance.

Release verification: 38 unit tests pass; three focused Chromium browser scenarios pass, covering all styles, per-style colours, save/reload, Town return, failed-download retry, rapid choices, undo and portrait/landscape phone controls. Additional Safari, full-suite, deployment and public-byte checks are recorded in the canonical Blueprint under CE-CHANGE-20260921-77. A physical phone is unavailable to the automated task; Tania explicitly owns that final check. Browser emulation does not establish physical-phone or classroom acceptance.
