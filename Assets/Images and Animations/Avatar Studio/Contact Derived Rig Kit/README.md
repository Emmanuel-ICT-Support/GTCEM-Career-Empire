# Contact Derived Rig Kit

This is a proof kit generated directly from the supplied ECC avatar contact sheets. It preserves the original raster character style rather than redrawing the avatars as simplified vectors.

Files:

- `ecc-boy-contact-rig-v1/01-character-reference.png`: full uniform boy reference on a 1024 x 1536 transparent canvas.
- `ecc-boy-contact-rig-v1/02-base-body-guide.png`: supplied boy body guide on the same canvas.
- `ecc-girl-contact-rig-v1/01-character-reference.png`: full uniform girl reference on a 1024 x 1536 transparent canvas.
- `*/anchors.json`: estimated rig anchor coordinates.
- `*-master-with-guides.svg`: Illustrator-openable master file with the PNG rig and guide points.
- Red neck guide: measured/estimated top neck width, bottom neck width, and neck height for head-swap alignment.

Important limitation: the girl contact sheets do not include a clean neutral full-body base layer. To build a true modular clothing system, create or commission a neutral girl body/base layer that matches `ecc-girl-contact-rig-v1/01-character-reference.png`.

The next production step is to draw or extract each clothing/hair/accessory layer against these master canvases, not to move pieces by eye inside the app.
