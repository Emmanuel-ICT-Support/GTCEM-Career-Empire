# Career Empire — Town Hall 3D Approach Proof of Concept

## Purpose

Test whether a short 3D building approach delivers the intended transition from the approved aerial Phaser town to an immersive behind-the-shoulder view.

This is a comparison prototype. It does not authorise replacement of the current Town Hall v2 sequence or rollout to other buildings.

## Supplied files

- `CE-BLDG-008-town-hall-textured-test.glb` — lightweight front-biased shallow-3D model with embedded façade texture.
- `CE-TOWNHALL-3D-approach-target.png` — authoritative visual composition target.
- `CE-BLDG-008-town-hall-front-facade.png` — transparent straight-on façade source, already embedded in the GLB.

## Model contract

- Front direction: negative Z.
- Units: metres.
- `PortalAnchor`: centre of the arched doorway.
- `CameraLookTarget`: upper entrance/façade target used during the approach.
- Recommended camera start: `[1.25, 2.65, -13.5]`.
- Recommended camera end: `[0.85, 2.95, -7.1]`.
- Recommended look target: `[0, 5.1, -2.65]`.

The model is designed for a primarily frontal approach. It has shallow side and roof depth for parallax, but it is not a complete building intended for free orbit or viewing from behind.

## Required composition

- Render in a 16:9 gameplay area.
- Use a perspective camera at approximately human eye height.
- Place the camera behind and slightly to the player's left shoulder.
- The player's head, left shoulder and upper torso occupy roughly 22–26% of frame height in the lower-left foreground.
- The Town Hall fills most of the upper and central frame.
- Keep the arched doorway completely visible and centred as the destination.
- Apply a gentle upward tilt so the cupola remains visible and the building feels substantial.
- Use a short paved approach with restrained grass edges.
- Preserve warm window lighting and restrained cyan illumination.

The target PNG defines the intended composition more strongly than the numeric starting values. Adjust camera values as needed to match it.

## Movement

1. Begin after the existing Phaser approach-zone trigger.
2. Transition from the aerial map into the 3D scene in approximately 0.8–1.2 seconds.
3. Allow forward/backward movement only along a short approach lane.
4. Keep the camera shoulder-relative while the character advances.
5. Aim continuously toward `CameraLookTarget`, with subtle interpolation rather than snapping.
6. Do not drive the camera through the façade.
7. Stop the character at a safe interaction position before the doorway.
8. Position the temporary portal at `PortalAnchor`.
9. Activate the existing Enter/module/Exit flow.
10. Restore the approved Phaser camera and controls on exit.

## Character treatment

For this proof of concept, a rear-facing 2D character may be composited into the 3D scene. Crop/frame it as an over-the-shoulder foreground character; do not show a small centred full-body avatar.

Do not solve 3D avatar customisation in this test.

## Must avoid

- aerial or isometric approach composition;
- distant full-body centred character;
- hollow or untextured white building;
- floating geometry or open side planes;
- blank wall as the final focal point;
- extreme low angle or fisheye distortion;
- camera entering the building mesh;
- replacement of the existing v2 prototype;
- integration into the live map before review;
- modelling any other building.

## Evidence required

Provide:

1. one still from the initial shoulder view;
2. one still from the portal interaction position;
3. one recording of the complete standalone approach;
4. model load time, approximate frame rate and any browser console errors;
5. a clear statement of whether the visual result matches `CE-TOWNHALL-3D-approach-target.png`.

Then stop for review.
