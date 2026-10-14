# Market money and collection consolidation

Candidate follows restored Markets Administration commit 5b965f09. No independent publication.

Removed the physical Save & Contribute station and Market Shelf sign/body/collider. Existing reversible $5 savings/withdrawal and optional one-time $2 contribution now appear in Stats → Market money. The existing Market ledger remains separate from campus initiative money; records are neither migrated nor reset. My collection now includes existing lantern/plant purchases, legacy lantern ownership, the crew pass and celebration ticket stub. The pass remains usable in the original crew activity.

Little Finds adds optional Paper plane ($1), Pocket compass ($2) and Novelty duck ($3). Original Amber lantern ($6) and Little green plant ($4) prices remain unchanged. Native geometry props and inline SVG collection cards add no raster download. No earnings, tax, research fee or curriculum decisions changed. The catalogue accepts affordable once-only purchases in legacy saves as well as current saves. Savings/contribution eligibility follows the existing ledger rules.

Market collection code loads only when Stats opens. Stats is available in normal and classic/direct activity entry. Unchanged Stats contents no longer repaint every update, preserving focused controls and expanded history. Review mode uses its isolated store; guest/signed-in storage is passed through the existing game session.

Validation: 148 unit tests in 31 files pass; coverage run passes (coverage configuration targets the existing economy modules). Six new unit scenarios cover old ownership/tickets, exact once-only purchases and replay, version-1 extension, reversible savings/one-time giving, review isolation and failed/unreadable storage. Runtime syntax checks pass. Prepared four actual-entry browser scenarios for 1280px/390px, normal/full routes, deferred loading, legacy collection, savings/withdrawal/giving, overflow and reopen persistence. Browser execution and final visual evidence remain pending explicit publisher grant of the sole heavy slot; no browser or user-tab mutation performed for this candidate.
