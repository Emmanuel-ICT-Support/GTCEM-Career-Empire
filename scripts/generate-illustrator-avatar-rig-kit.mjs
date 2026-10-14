import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = "Assets/Images and Animations/Avatar Studio/Illustrator Rig Kit";
const W = 1024;
const H = 1536;

const palette = {
  skin: "#e7b98e",
  skinShadow: "#cc966f",
  line: "#2d3340",
  navy: "#142947",
  navyDark: "#0d1a2f",
  teal: "#006b7d",
  tealDark: "#004b5c",
  gold: "#efb72f",
  white: "#f8fafc",
  grey: "#d9dee5",
  greyDark: "#aeb7c2",
  shoe: "#10141d",
  shoeHighlight: "#343b47",
  brownHair: "#3b2317",
  auburnHair: "#9b4326",
  blackHair: "#111316",
  blondeHair: "#d7a84e"
};

const rigs = {
  boy: {
    id: "ecc-boy-illustrator-v1",
    label: "ECC Boy Illustrator Rig v1",
    anchors: {
      headCenter: [512, 275],
      leftEye: [458, 285],
      rightEye: [566, 285],
      browLine: [512, 238],
      noseBridge: [512, 312],
      mouthCenter: [512, 370],
      leftEar: [403, 295],
      rightEar: [621, 295],
      neckCenter: [512, 442],
      neckOpening: [512, 505],
      leftShoulder: [365, 520],
      rightShoulder: [659, 520],
      waistLine: [512, 790],
      hips: [512, 860],
      leftHandRest: [352, 755],
      rightHandRest: [672, 755],
      leftFoot: [438, 1265],
      rightFoot: [586, 1265],
      feetBaseline: [512, 1304]
    },
    body: {
      headRx: 103,
      headRy: 125,
      shoulderY: 512,
      torsoTop: 462,
      torsoBottom: 812,
      hipY: 838,
      legBottom: 1238
    }
  },
  girl: {
    id: "ecc-girl-illustrator-v1",
    label: "ECC Girl Illustrator Rig v1",
    anchors: {
      headCenter: [512, 270],
      leftEye: [456, 282],
      rightEye: [568, 282],
      browLine: [512, 236],
      noseBridge: [512, 310],
      mouthCenter: [512, 368],
      leftEar: [400, 292],
      rightEar: [624, 292],
      neckCenter: [512, 438],
      neckOpening: [512, 503],
      leftShoulder: [354, 520],
      rightShoulder: [670, 520],
      waistLine: [512, 792],
      hips: [512, 858],
      leftHandRest: [344, 752],
      rightHandRest: [680, 752],
      leftFoot: [442, 1262],
      rightFoot: [582, 1262],
      feetBaseline: [512, 1302]
    },
    body: {
      headRx: 108,
      headRy: 126,
      shoulderY: 510,
      torsoTop: 458,
      torsoBottom: 812,
      hipY: 838,
      legBottom: 1232
    }
  }
};

function ensureFile(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function tag(name, attrs = {}, content = "") {
  const attr = Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => ` ${key}="${String(value).replaceAll('"', "&quot;")}"`)
    .join("");
  if (content === null) return `<${name}${attr}/>`;
  return `<${name}${attr}>${content}</${name}>`;
}

function svgDoc(title, body, extraDefs = "") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">
  <title>${title}</title>
  <defs>
    <linearGradient id="skinSoft" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4cda6"/>
      <stop offset="0.55" stop-color="${palette.skin}"/>
      <stop offset="1" stop-color="${palette.skinShadow}"/>
    </linearGradient>
    <linearGradient id="navyCloth" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#213b63"/>
      <stop offset="0.45" stop-color="${palette.navy}"/>
      <stop offset="1" stop-color="${palette.navyDark}"/>
    </linearGradient>
    <linearGradient id="tealCloth" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0d8da0"/>
      <stop offset="1" stop-color="${palette.tealDark}"/>
    </linearGradient>
    <linearGradient id="blackShoe" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.shoeHighlight}"/>
      <stop offset="1" stop-color="${palette.shoe}"/>
    </linearGradient>
    <style>
      .outline { stroke: ${palette.line}; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }
      .thin { stroke: ${palette.line}; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
      .stitch { stroke: rgba(255,255,255,.42); stroke-width: 3; stroke-linecap: round; }
      .guide-line { stroke: #23b8d4; stroke-width: 2; stroke-dasharray: 10 8; opacity: .65; }
      .guide-dot { fill: #ffcc33; stroke: #152238; stroke-width: 3; }
      .guide-label { fill: #102033; font-family: Arial, sans-serif; font-size: 19px; font-weight: 700; }
    </style>
    ${extraDefs}
  </defs>
${body}
</svg>
`;
}

function baseBody(rig) {
  const a = rig.anchors;
  const b = rig.body;
  const [cx, cy] = a.headCenter;
  const shortBase = rig.id.includes("girl");
  return tag("g", { id: "01-base-neutral-body" }, `
    <ellipse class="outline" cx="${a.leftEar[0]}" cy="${a.leftEar[1]}" rx="28" ry="42" fill="url(#skinSoft)"/>
    <ellipse class="outline" cx="${a.rightEar[0]}" cy="${a.rightEar[1]}" rx="28" ry="42" fill="url(#skinSoft)"/>
    <ellipse class="outline" cx="${cx}" cy="${cy}" rx="${b.headRx}" ry="${b.headRy}" fill="url(#skinSoft)"/>
    <rect class="outline" x="470" y="392" width="84" height="118" rx="34" fill="url(#skinSoft)"/>
    <path class="outline" d="M360 ${b.shoulderY} C408 472, 616 472, 664 ${b.shoulderY} L634 818 C594 850, 430 850, 390 818 Z" fill="#dfe5ec"/>
    <path class="thin" d="M448 514 C474 552, 550 552, 576 514" fill="none" opacity=".45"/>
    <path class="outline" d="M363 523 C323 610, 314 704, 341 777 C351 801, 381 789, 373 760 C354 692, 369 602, 399 532 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M661 523 C701 610, 710 704, 683 777 C673 801, 643 789, 651 760 C670 692, 655 602, 625 532 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M332 772 C322 805, 332 836, 356 844 C372 849, 386 838, 378 820 C366 825, 355 818, 357 799 C358 782, 351 773, 332 772 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M692 772 C702 805, 692 836, 668 844 C652 849, 638 838, 646 820 C658 825, 669 818, 667 799 C666 782, 673 773, 692 772 Z" fill="url(#skinSoft)"/>
    ${
      shortBase
        ? `<path class="outline" d="M418 810 C456 838, 568 838, 606 810 L618 890 C574 914, 450 914, 406 890 Z" fill="#cfd6df"/>`
        : `<path class="outline" d="M414 812 C454 832, 570 832, 610 812 L610 900 C570 920, 454 920, 414 900 Z" fill="#cfd6df"/>`
    }
    <path class="outline" d="M426 878 C408 986, 405 1116, 424 1238 L486 1238 C492 1110, 495 984, 492 878 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M598 878 C616 986, 619 1116, 600 1238 L538 1238 C532 1110, 529 984, 532 878 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M416 1232 C380 1248, 374 1289, 425 1300 L492 1300 C499 1272, 471 1238, 416 1232 Z" fill="url(#skinSoft)"/>
    <path class="outline" d="M608 1232 C644 1248, 650 1289, 599 1300 L532 1300 C525 1272, 553 1238, 608 1232 Z" fill="url(#skinSoft)"/>
  `);
}

function face(rig, eyeColor = "#5b351d") {
  const a = rig.anchors;
  const iris = (x, y) => `
    <ellipse class="thin" cx="${x}" cy="${y}" rx="34" ry="27" fill="${palette.white}"/>
    <circle cx="${x}" cy="${y + 2}" r="16" fill="${eyeColor}"/>
    <circle cx="${x}" cy="${y + 2}" r="8" fill="#111827"/>
    <circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#ffffff" opacity=".92"/>
  `;
  return tag("g", { id: "02-face-neutral" }, `
    ${iris(a.leftEye[0], a.leftEye[1])}
    ${iris(a.rightEye[0], a.rightEye[1])}
    <path class="thin" d="M426 235 C448 222, 474 222, 492 236" fill="none"/>
    <path class="thin" d="M532 236 C552 222, 580 222, 602 236" fill="none"/>
    <path class="thin" d="M512 302 C522 332, 520 350, 504 358" fill="none"/>
    <path class="thin" d="M472 375 C496 394, 532 394, 556 375" fill="none"/>
    <circle cx="472" cy="338" r="12" fill="#f2a783" opacity=".26"/>
    <circle cx="552" cy="338" r="12" fill="#f2a783" opacity=".26"/>
  `);
}

function eyeOverlay(rig, color, id) {
  const a = rig.anchors;
  return tag("g", { id }, `
    <circle cx="${a.leftEye[0]}" cy="${a.leftEye[1] + 2}" r="16" fill="${color}"/>
    <circle cx="${a.rightEye[0]}" cy="${a.rightEye[1] + 2}" r="16" fill="${color}"/>
    <circle cx="${a.leftEye[0] - 6}" cy="${a.leftEye[1] - 6}" r="5" fill="#fff" opacity=".9"/>
    <circle cx="${a.rightEye[0] - 6}" cy="${a.rightEye[1] - 6}" r="5" fill="#fff" opacity=".9"/>
  `);
}

function hairBack(rig, color = palette.brownHair) {
  if (rig.id.includes("girl")) {
    return tag("g", { id: "03-hair-back-brown" }, `
      <ellipse class="outline" cx="512" cy="288" rx="122" ry="142" fill="${color}"/>
      <path class="outline" d="M414 348 C382 520, 405 704, 466 810 C456 624, 462 458, 488 354 Z" fill="${color}"/>
      <path class="outline" d="M610 348 C642 520, 619 704, 558 810 C568 624, 562 458, 536 354 Z" fill="${color}"/>
    `);
  }
  return tag("g", { id: "03-hair-back-brown" }, `
    <path class="outline" d="M395 286 C392 196, 468 142, 545 150 C623 158, 658 224, 632 302 C580 244, 475 238, 395 286 Z" fill="${color}"/>
  `);
}

function hairFront(rig, color = palette.brownHair, id = "13-hair-front-brown") {
  if (rig.id.includes("girl")) {
    return tag("g", { id }, `
      <path class="outline" d="M392 284 C400 174, 494 132, 574 157 C631 175, 656 229, 639 304 C598 252, 551 231, 498 238 C454 244, 421 261, 392 284 Z" fill="${color}"/>
      <path d="M423 258 C454 222, 506 203, 565 216 C518 236, 478 260, 448 298 Z" fill="#ffffff" opacity=".08"/>
      <path class="thin" d="M438 244 C472 222, 512 213, 562 224" fill="none" opacity=".35"/>
      <path class="thin" d="M414 295 C450 260, 486 241, 526 235" fill="none" opacity=".3"/>
    `);
  }
  return tag("g", { id }, `
    <path class="outline" d="M390 288 C386 222, 426 164, 500 150 C565 138, 632 168, 652 236 C628 218, 599 214, 572 226 C582 204, 542 188, 514 207 C500 182, 451 196, 444 230 C421 224, 397 246, 390 288 Z" fill="${color}"/>
    <path class="outline" d="M394 300 C435 238, 507 218, 591 231 C550 245, 518 275, 498 326 C472 284, 431 290, 394 300 Z" fill="${color}"/>
    <path d="M435 220 C472 192, 550 181, 608 222 C546 205, 493 214, 452 248 Z" fill="#ffffff" opacity=".09"/>
    <path class="thin" d="M429 250 C470 221, 526 210, 590 226" fill="none" opacity=".3"/>
    <path class="thin" d="M477 212 C508 199, 544 201, 584 222" fill="none" opacity=".25"/>
  `);
}

function shirt(rig) {
  return tag("g", { id: "05-shirt-white" }, `
    <path class="outline" d="M398 500 C428 475, 596 475, 626 500 L608 815 C568 838, 456 838, 416 815 Z" fill="${palette.white}"/>
    <path class="outline" d="M444 488 L512 560 L580 488 L604 520 L548 604 L512 576 L476 604 L420 520 Z" fill="${palette.white}"/>
    <path class="thin" d="M512 560 L512 818" fill="none" opacity=".25"/>
    <circle cx="512" cy="650" r="4" fill="#b7c0cc"/>
    <circle cx="512" cy="720" r="4" fill="#b7c0cc"/>
  `);
}

function tie(rig) {
  return tag("g", { id: "06-tie-teal" }, `
    <path class="outline" d="M486 526 L538 526 L548 560 L512 610 L476 560 Z" fill="url(#tealCloth)"/>
    <path class="outline" d="M512 606 L552 760 L512 812 L472 760 Z" fill="url(#tealCloth)"/>
    <path class="stitch" d="M489 552 L536 690"/>
  `);
}

function jumper(rig) {
  return tag("g", { id: "07-jumper-teal" }, `
    <path class="outline" d="M398 530 C436 504, 588 504, 626 530 L608 820 C568 848, 456 848, 416 820 Z" fill="url(#tealCloth)"/>
    <path class="outline" d="M446 520 L512 612 L578 520" fill="none" stroke="${palette.white}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="thin" d="M446 520 L512 612 L578 520" fill="none" stroke="${palette.navy}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="414" y="804" width="196" height="38" rx="10" fill="${palette.tealDark}" opacity=".55"/>
  `);
}

function blazer(rig) {
  const crest = `<g transform="translate(588 588) scale(.72)">
    <path d="M0 0 L54 0 L54 70 C40 82 28 90 27 90 C26 90 14 82 0 70 Z" fill="${palette.navy}" stroke="${palette.gold}" stroke-width="5"/>
    <path d="M27 6 L27 78 M8 36 L46 36" stroke="${palette.gold}" stroke-width="5"/>
  </g>`;
  return tag("g", { id: "08-blazer-navy" }, `
    <path class="outline" d="M360 515 C420 472, 604 472, 664 515 L638 890 C604 930, 548 922, 512 860 C476 922, 420 930, 386 890 Z" fill="url(#navyCloth)"/>
    <path class="outline" d="M390 524 C350 608, 343 725, 370 835 L436 820 C414 706, 420 596, 454 516 Z" fill="url(#navyCloth)"/>
    <path class="outline" d="M634 524 C674 608, 681 725, 654 835 L588 820 C610 706, 604 596, 570 516 Z" fill="url(#navyCloth)"/>
    <path d="M418 502 L512 860 L606 502 L548 582 L512 548 L476 582 Z" fill="#0a1528" opacity=".38"/>
    <path class="thin" d="M452 510 L512 860 L572 510" fill="none" opacity=".35"/>
    <circle cx="450" cy="680" r="11" fill="${palette.gold}" stroke="#6f4a0b" stroke-width="3"/>
    <circle cx="456" cy="770" r="11" fill="${palette.gold}" stroke="#6f4a0b" stroke-width="3"/>
    <path class="thin" d="M402 810 L462 798" fill="none" opacity=".45"/>
    <path class="thin" d="M562 798 L622 810" fill="none" opacity=".45"/>
    ${crest}
  `);
}

function trousers(rig) {
  return tag("g", { id: "09-trousers-navy" }, `
    <path class="outline" d="M420 812 L502 812 L492 1250 L428 1250 C404 1088, 402 946, 420 812 Z" fill="url(#navyCloth)"/>
    <path class="outline" d="M604 812 L522 812 L532 1250 L596 1250 C620 1088, 622 946, 604 812 Z" fill="url(#navyCloth)"/>
    <path class="thin" d="M512 830 L512 1236" fill="none" opacity=".38"/>
    <path class="thin" d="M450 860 C440 1000, 442 1142, 452 1236" fill="none" opacity=".18"/>
    <path class="thin" d="M574 860 C584 1000, 582 1142, 572 1236" fill="none" opacity=".18"/>
  `);
}

function skirtAndTights(rig) {
  return tag("g", { id: "09-skirt-tights" }, `
    <path class="outline" d="M420 812 L604 812 L650 980 C594 1010, 430 1010, 374 980 Z" fill="${palette.navy}"/>
    <path d="M394 842 L630 842 M384 890 L640 890 M392 938 L632 938" stroke="#1f8296" stroke-width="8" opacity=".72"/>
    <path d="M440 818 L420 990 M500 814 L492 1006 M560 814 L584 990" stroke="#f8fafc" stroke-width="6" opacity=".75"/>
    <path class="outline" d="M430 970 C414 1060, 414 1168, 430 1244 L486 1244 C492 1140, 494 1048, 490 970 Z" fill="${palette.navyDark}"/>
    <path class="outline" d="M594 970 C610 1060, 610 1168, 594 1244 L538 1244 C532 1140, 530 1048, 534 970 Z" fill="${palette.navyDark}"/>
  `);
}

function shoes(rig) {
  return tag("g", { id: "10-shoes-black" }, `
    <path class="outline" d="M410 1230 C370 1246, 363 1291, 420 1302 L496 1302 C506 1273, 475 1234, 410 1230 Z" fill="url(#blackShoe)"/>
    <path class="outline" d="M614 1230 C654 1246, 661 1291, 604 1302 L528 1302 C518 1273, 549 1234, 614 1230 Z" fill="url(#blackShoe)"/>
    <path class="thin" d="M406 1266 C430 1254, 466 1256, 490 1274" fill="none" stroke="#5b6573"/>
    <path class="thin" d="M618 1266 C594 1254, 558 1256, 534 1274" fill="none" stroke="#5b6573"/>
  `);
}

function guides(rig) {
  const a = rig.anchors;
  const lines = [
    ["browLine", a.browLine[1]],
    ["eyeLine", a.leftEye[1]],
    ["neckOpening", a.neckOpening[1]],
    ["shoulders", a.leftShoulder[1]],
    ["waistLine", a.waistLine[1]],
    ["feetBaseline", a.feetBaseline[1]]
  ].map(([name, y]) => `<line class="guide-line" x1="220" y1="${y}" x2="804" y2="${y}"/><text class="guide-label" x="816" y="${y + 7}">${name}</text>`).join("\n");
  const dots = Object.entries(a).map(([name, value]) => {
    const [x, y] = value;
    return `<circle class="guide-dot" cx="${x}" cy="${y}" r="8"/><text class="guide-label" x="${x + 12}" y="${y - 10}">${name}</text>`;
  }).join("\n");
  return tag("g", { id: "99-anchor-guides", opacity: ".9" }, `${lines}\n${dots}`);
}

function fullStack(rig, includeGuides = false) {
  const parts = [
    hairBack(rig),
    baseBody(rig),
    face(rig),
    shirt(rig),
    tie(rig),
    rig.id.includes("girl") ? skirtAndTights(rig) : trousers(rig),
    shoes(rig),
    jumper(rig),
    blazer(rig),
    hairFront(rig),
    includeGuides ? guides(rig) : ""
  ];
  return parts.join("\n");
}

function layerFiles(rig) {
  const eyes = {
    brown: "#5b351d",
    amber: "#a16a1c",
    green: "#3d8b45",
    blue: "#1688c7",
    grey: "#7b8794"
  };
  const files = {
    "01-base-neutral-body.svg": baseBody(rig),
    "02-face-neutral.svg": face(rig),
    "03-hair-back-brown.svg": hairBack(rig, palette.brownHair),
    "04-hair-front-brown.svg": hairFront(rig, palette.brownHair, "04-hair-front-brown"),
    "04-hair-front-black.svg": hairFront(rig, palette.blackHair, "04-hair-front-black"),
    "04-hair-front-auburn.svg": hairFront(rig, palette.auburnHair, "04-hair-front-auburn"),
    "04-hair-front-blonde.svg": hairFront(rig, palette.blondeHair, "04-hair-front-blonde"),
    "05-shirt-white.svg": shirt(rig),
    "06-tie-teal.svg": tie(rig),
    "07-jumper-teal.svg": jumper(rig),
    "08-blazer-navy.svg": blazer(rig),
    [rig.id.includes("girl") ? "09-skirt-tights.svg" : "09-trousers-navy.svg"]: rig.id.includes("girl") ? skirtAndTights(rig) : trousers(rig),
    "10-shoes-black.svg": shoes(rig)
  };
  for (const [name, color] of Object.entries(eyes)) {
    files[`11-eye-colour-${name}.svg`] = eyeOverlay(rig, color, `11-eye-colour-${name}`);
  }
  return files;
}

function write(path, contents) {
  ensureFile(path);
  writeFileSync(path, contents);
}

for (const rig of Object.values(rigs)) {
  const rigDir = join(ROOT, rig.id);
  const master = svgDoc(`${rig.label} master`, fullStack(rig, true));
  const preview = svgDoc(`${rig.label} preview`, fullStack(rig, false));
  write(join(rigDir, `${rig.id}-master-with-guides.svg`), master);
  write(join(rigDir, `${rig.id}-preview.svg`), preview);
  write(join(rigDir, "anchors.json"), `${JSON.stringify({ id: rig.id, canvas: [W, H], anchors: rig.anchors }, null, 2)}\n`);

  for (const [file, content] of Object.entries(layerFiles(rig))) {
    write(join(rigDir, "layers", file), svgDoc(`${rig.label} ${file}`, content));
  }
}

write(join(ROOT, "README.md"), `# Illustrator Avatar Rig Kit

This folder is a clean vector starter kit for the Avatar Studio methodology.

Open the master SVG files in Adobe Illustrator:

- ${rigs.boy.id}/${rigs.boy.id}-master-with-guides.svg
- ${rigs.girl.id}/${rigs.girl.id}-master-with-guides.svg

Each rig uses a 1024 x 1536 canvas. Every layer file in the \`layers\` folder is also full canvas, so it can be exported to transparent PNG and stacked without moving.

This is not final polished ECC 3D art. It is a controlled Illustrator rig template for creating production-ready avatar layers.

## Layer Order

1. hair back
2. base neutral body
3. face
4. shirt
5. tie
6. bottoms
7. shoes
8. jumper
9. blazer
10. hair front
11. eye colour overlays / accessories

## How to use in Illustrator

1. Open the master SVG.
2. Keep the artboard at 1024 x 1536.
3. Use the anchor guides to draw or align new layers.
4. Hide the guide group before exporting production art.
5. Export each layer as a full-canvas transparent PNG.

Do not crop tightly around items. A mostly empty transparent PNG is correct.
`);

console.log(`Generated Illustrator rig kit at ${ROOT}`);
