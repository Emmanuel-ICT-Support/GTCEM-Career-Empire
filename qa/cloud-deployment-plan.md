# Personal test Pages deployment plan

Publication preparation for `taniab1975/test-career-empire` (1415756807).
The static `gh-pages` branch is now prepared and pushed. Pages activation is
blocked. No public playable test URL is verified, and no hosting,
account, connector, credential or permission setting has been changed.

## Existing access

The connected repository metadata reports `admin=true`, `maintain=true` and
`push=true`. Tania therefore has the repository role needed to enable Pages
through her existing GitHub account; no additional collaborator grant is needed.
GitHub requires an administrator, maintainer or Pages-settings manager to create
a site. Its fine-grained API additionally requires Pages write and Administration
write permissions. [GitHub Pages API](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-site).

Repository role does not establish the connector token's API scopes. The callable
tools expose no Pages create/update action; their generic fetch is read-only and
does not allow unlisted API endpoints. Token scopes cannot be verified here
without a supported capability. An agent-only activation therefore cannot be
promised under current access. The owner can use GitHub's Pages settings with
the already verified admin role; no new credential or connector grant is needed
for that owner action. No grant is being requested by this plan.

## Smallest publication approach

1. Prepare a static export in a dedicated `gh-pages` branch of this same test
   repository. Preserve the `playable-3d/`, `economy-lab/`, referenced `Assets/`
   and sibling module paths. Generate a root `index.html` linking to the game and
   an empty `.nojekyll` file. Do not publish the entire development tree.
2. The exporter builds from the verified release manifest, reachable runtime graph,
   HTML/CSS dependencies, dynamic avatar/helper catalog assets and linked course,
   My Life and Administration resources. Fail the export for missing files.
   The completed export has 623 files totaling 525,006,587 bytes (500.68 MiB),
   below 1 GB. All 620 dependency files matched their expected hashes through
   HTTP at `/test-career-empire/`; video byte ranges returned 206. GLB external
   images and phone models retain their actual loader resource bases. One
   existing optional legacy World megatrends route is absent from the seed;
   it is recorded rather than silently redirected to different curriculum.
3. Serve the export locally beneath `/test-career-empire/` and validate relative
   URLs, intro playback, campus walking, photo download, Market/Admin and My Life
   handoff. Verify dynamic imports, course documents and avatar choices, with no
   missing-request substitutions. Measure the completed export size.
4. Deployment was explicitly authorized. The reviewed export branch was pushed;
   the owner still needs to select `gh-pages` → `/` in this repository's Pages settings.
   Existing git push access can maintain the branch; the owner settings action
   supplies activation without changing connector scopes.
5. Confirm the Pages build and HTTPS site before calling any URL playable. Check
   the same student paths against the deployed site and record its commit/build.

The inspected directories contain about 318 MiB in `playable-3d/` and 731 MiB in
`Assets/` before the remaining repository files. Publishing that entire tree
would exceed Pages' 1 GB published-site limit. A selective export preserves the
requested game functionality while excluding unrelated development assets.
[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Branch publishing requires its entry file at the source root. `.nojekyll`
preserves these static files without a Jekyll build. Pages supports the static
game, but the local Python test server itself is not deployed.
[Creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

The expected game path after a verified deployment is
`/test-career-empire/playable-3d/`. This plan does not assert that path is live.

## Current branch and exact blockers

Source: `8ee2a7b6e9b162affedd4d2b57b87fcfeee4fbc4`. Export:
`11340016f6ef1e51ee0671ec93c203890777eb33` on `gh-pages`; both remote
heads were verified. Source-only status/test scripts remain on `main`.

The existing CLI Pages read returned:
`Get "https://api.github.com/repos/taniab1975/test-career-empire/pages": Forbidden`.
No credential/API-route workaround or activation was attempted. The read-only
public-URL check additionally failed at the managed network tunnel:
`Tunnel connection failed: 403 Forbidden`. This is not an origin 404 or evidence
of a successful Pages build.

Minimal owner action: [test repository Pages settings](https://github.com/taniab1975/test-career-empire/settings/pages)
→ **Deploy from a branch** → **gh-pages** → **/(root)** → **Save**.
After activation, deployed source/hash/browser verification still requires a
network path permitted to read `taniab1975.github.io`. No new connector grant,
credential, security or production-repository change is requested.

Detailed publication evidence: `qa/cloud-pages-publication.json`. Reproduction:
`python3 scripts/export-test-pages.py coverage/new-export/test-career-empire`;
HTTP verification: `python3 scripts/verify-test-pages.py <permitted-base-url/> <source-commit>`.

Initial rear-building visibility and actual parcel walking pass on the rebuilt
project-prefix export; the unchanged eight-second cold handover target now passes
with actual completed-canvas/control-release timing, recorded separately from
Node observation latency. Natural video/Chapel/mural now passes. See
`qa/cloud-visibility-chapel-checkpoint.json`. No Pages permission/public URL retry
was made in this visibility repair batch.

Morning update: teacher persistence, desktop Stats reopening and cold eight-second
real handover now pass. Natural-video preparation completes before EOF. Artifact
refreshed from the same tested runtime source; all 620 HTTP hashes and media ranges
verified. No blocked Pages/public-network request was retried. Latest evidence:
`qa/cloud-morning-checkpoint.json`.
