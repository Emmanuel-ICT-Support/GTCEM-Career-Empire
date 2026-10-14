# Startup performance release — 14 September 2026

The town previously downloaded three alternate avatar bodies automatically five seconds after entry, plus the unused EST poster and Chapel lighting tables at startup. Alternatives now load on selection; the poster loads alongside EST hall entry, and Chapel lighting tables load on Chapel entry. Existing appearance, asset files, saved profiles and activities are preserved.

Estimated cold response-body transfer before interaction falls from 46.33 MB to 38.64 MB (16.6%). Requests issued through first playable fall from 39.72 MB to 38.64 MB. Most savings are background traffic after entry, not loading-screen time. Estimates use a complete clean-browser local trace of the verified release and live GitHub compressed response sizes; they are not a physical-device speed guarantee.

Verification: 18 existing unit tests, JavaScript syntax checks, 83 manifest hashes/29 runtime modules, and browser avatar selection/walking/save/return, Chapel entry and EST poster/video playback. No captured runtime errors. No model or texture bytes changed. Previous complete hosted browser suites have a recorded arrival-screen timeout; no full hosted-suite pass is claimed by the local audit.

Base: 7388cfa3bca6b58a06a88bf18f65e6d49dc17501. User explicitly approved publication on 14 September. Release owner: load-performance task. Separate local garden corrections are excluded from this release. Remaining largest bottleneck is the full-campus startup gate and large model/texture payloads.
