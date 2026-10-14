import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SOURCE_SVG = "Assets/Images and Animations/Avatar Studio/Photoshop/Base Boy.svg";
const DOWNLOAD_SOURCE_SVG = "/Users/tania.byrnes/Downloads/Screenshot 2026-06-04 at 11.46.03 pm.svg";
const OUT_DIR = "Assets/Images and Animations/Avatar Studio/Photoshop";
const OUT_SVG = join(OUT_DIR, "Base Boy - neutral rig guides.svg");
const OUT_PNG = join(OUT_DIR, "Base Boy - neutral rig guides.png");
const OUT_JSON = join(OUT_DIR, "Base Boy - neutral rig guides.json");
const OUT_FULL_SOURCE_SVG = join(OUT_DIR, "Neutral Base Boy - full source rig guides.svg");
const OUT_FULL_SOURCE_PNG = join(OUT_DIR, "Neutral Base Boy - full source rig guides.png");
const OUT_FULL_SOURCE_JSON = join(OUT_DIR, "Neutral Base Boy - full source rig guides.json");

const VIEWBOX = { width: 364, height: 1232 };
const FULL_SOURCE_VIEWBOX = { width: 472, height: 1600 };

// Coordinates are in the native Base Boy.svg viewBox.
const baseGuides = {
  canvas: [VIEWBOX.width, VIEWBOX.height],
  centre_line_x: 182,
  face: {
    left_eye_centre: [151, 158],
    right_eye_centre: [229, 158],
    nose_bridge: [182, 187],
    mouth_centre: [182, 232]
  },
  neck_guide: {
    top_left: [137, 270],
    top_right: [235, 270],
    bottom_left: [125, 382],
    bottom_right: [239, 382],
    centre: [182, 326],
    top_width: 98,
    bottom_width: 114,
    height: 112,
    note: "Neutral base neck opening. Scale replacement heads so their neck width and lower neck height match this guide."
  },
  body: {
    shoulder_line: [[84, 356], [280, 356]],
    waist_line: [[128, 585], [236, 585]],
    hip_line: [[130, 650], [234, 650]],
    foot_line: [[84, 1186], [280, 1186]]
  }
};

function scalePoint([x, y], scaleX, scaleY) {
  return [Math.round(x * scaleX), Math.round(y * scaleY)];
}

function scaleGuides(guides, targetViewBox) {
  const scaleX = targetViewBox.width / VIEWBOX.width;
  const scaleY = targetViewBox.height / VIEWBOX.height;
  const neck = guides.neck_guide;
  const scaled = {
    canvas: [targetViewBox.width, targetViewBox.height],
    centre_line_x: Math.round(guides.centre_line_x * scaleX),
    face: Object.fromEntries(
      Object.entries(guides.face).map(([key, value]) => [key, scalePoint(value, scaleX, scaleY)])
    ),
    neck_guide: {
      ...neck,
      top_left: scalePoint(neck.top_left, scaleX, scaleY),
      top_right: scalePoint(neck.top_right, scaleX, scaleY),
      bottom_left: scalePoint(neck.bottom_left, scaleX, scaleY),
      bottom_right: scalePoint(neck.bottom_right, scaleX, scaleY),
      centre: scalePoint(neck.centre, scaleX, scaleY)
    },
    body: Object.fromEntries(
      Object.entries(guides.body).map(([key, [start, end]]) => [
        key,
        [scalePoint(start, scaleX, scaleY), scalePoint(end, scaleX, scaleY)]
      ])
    )
  };
  scaled.neck_guide.top_width = Math.abs(scaled.neck_guide.top_right[0] - scaled.neck_guide.top_left[0]);
  scaled.neck_guide.bottom_width = Math.abs(scaled.neck_guide.bottom_right[0] - scaled.neck_guide.bottom_left[0]);
  scaled.neck_guide.height = Math.abs(scaled.neck_guide.bottom_left[1] - scaled.neck_guide.top_left[1]);
  return scaled;
}

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function point([x, y]) {
  return `${x},${y}`;
}

function line(id, [start, end], color, width = 2, dash = "7 6") {
  return `<line id="${xmlEscape(id)}" x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" vector-effect="non-scaling-stroke"/>`;
}

function dot(id, [x, y], color, radius = 5) {
  return [
    `<circle id="${xmlEscape(id)}" cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="#ffffff" stroke-width="2" vector-effect="non-scaling-stroke"/>`,
    `<text x="${x + 8}" y="${y - 7}" font-size="13" font-family="Arial, sans-serif" font-weight="700" fill="${color}">${xmlEscape(id)}</text>`
  ].join("\n");
}

function buildGuideMarkup(guides, viewBox) {
  const neck = guides.neck_guide;
  const neckPoints = [
    neck.top_left,
    neck.top_right,
    neck.bottom_right,
    neck.bottom_left
  ]
    .map(point)
    .join(" ");

  return `
  <g id="neutral-rig-guides" font-family="Arial, sans-serif">
    <rect x="0" y="0" width="${viewBox.width}" height="${viewBox.height}" fill="none" stroke="#00a7b5" stroke-width="1.5" stroke-dasharray="8 6" vector-effect="non-scaling-stroke"/>
    <line id="centre-line" x1="${guides.centre_line_x}" y1="0" x2="${guides.centre_line_x}" y2="${viewBox.height}" stroke="#00a7b5" stroke-width="1.5" stroke-dasharray="8 8" vector-effect="non-scaling-stroke"/>

    <g id="neck-width-height-guide">
      <polygon points="${neckPoints}" fill="#ff4d6d" fill-opacity="0.16" stroke="#ff2d55" stroke-width="3" vector-effect="non-scaling-stroke"/>
      <line id="neck-top-width" x1="${neck.top_left[0]}" y1="${neck.top_left[1]}" x2="${neck.top_right[0]}" y2="${neck.top_right[1]}" stroke="#ff2d55" stroke-width="4" vector-effect="non-scaling-stroke"/>
      <line id="neck-bottom-width" x1="${neck.bottom_left[0]}" y1="${neck.bottom_left[1]}" x2="${neck.bottom_right[0]}" y2="${neck.bottom_right[1]}" stroke="#ff2d55" stroke-width="4" vector-effect="non-scaling-stroke"/>
      <line id="neck-height" x1="${neck.centre[0]}" y1="${neck.top_left[1]}" x2="${neck.centre[0]}" y2="${neck.bottom_left[1]}" stroke="#ff2d55" stroke-width="2" stroke-dasharray="6 5" vector-effect="non-scaling-stroke"/>
      <circle id="neck-centre" cx="${neck.centre[0]}" cy="${neck.centre[1]}" r="5" fill="#ff2d55" stroke="#ffffff" stroke-width="2" vector-effect="non-scaling-stroke"/>
      <text x="${neck.top_right[0] + 8}" y="${neck.top_right[1] + 5}" font-size="14" font-weight="700" fill="#ff2d55">neck top ${neck.top_width}px</text>
      <text x="${neck.bottom_right[0] + 8}" y="${neck.bottom_right[1] + 5}" font-size="14" font-weight="700" fill="#ff2d55">neck bottom ${neck.bottom_width}px</text>
      <text x="${neck.centre[0] + 8}" y="${Math.round((neck.top_left[1] + neck.bottom_left[1]) / 2)}" font-size="14" font-weight="700" fill="#ff2d55">height ${neck.height}px</text>
    </g>

    <g id="body-alignment-guides">
      ${line("shoulder-line", guides.body.shoulder_line, "#f5a524")}
      ${line("waist-line", guides.body.waist_line, "#f5a524")}
      ${line("hip-line", guides.body.hip_line, "#f5a524")}
      ${line("foot-line", guides.body.foot_line, "#f5a524")}
    </g>

    <g id="face-anchor-guides">
      ${dot("left-eye", guides.face.left_eye_centre, "#36c5f0")}
      ${dot("right-eye", guides.face.right_eye_centre, "#36c5f0")}
      ${dot("nose", guides.face.nose_bridge, "#f5c542", 4)}
      ${dot("mouth", guides.face.mouth_centre, "#f5c542", 4)}
    </g>
  </g>
`;
}

function insertGuides(svg, guides, viewBox) {
  const markup = buildGuideMarkup(guides, viewBox);
  if (!svg.includes("</svg>")) {
    throw new Error("Source SVG is missing closing </svg>.");
  }
  return svg.replace("</svg>", `${markup}</svg>`);
}

function writePngFromSvg(svgPath, pngPath, viewBox) {
  return (async () => {
    const svg = readFileSync(svgPath, "utf8");
    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: viewBox.width, height: viewBox.height },
      deviceScaleFactor: 2
    });
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    await page.setContent(`
      <style>body { margin: 0; background: white; }</style>
      <img src="${dataUrl}" width="${viewBox.width}" height="${viewBox.height}" />
    `);
    await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: viewBox.width, height: viewBox.height } });
    await browser.close();
  })();
}

async function writeGuideSet({ sourceSvg, outSvg, outPng, outJson, viewBox, guides }) {
  ensureDir(outSvg);
  const source = readFileSync(sourceSvg, "utf8");
  writeFileSync(outSvg, insertGuides(source, guides, viewBox));
  writeFileSync(outJson, `${JSON.stringify(guides, null, 2)}\n`);
  await writePngFromSvg(outSvg, outPng, viewBox);

  console.log(`Wrote ${outSvg}`);
  console.log(`Wrote ${outPng}`);
  console.log(`Wrote ${outJson}`);
}

await writeGuideSet({
  sourceSvg: SOURCE_SVG,
  outSvg: OUT_SVG,
  outPng: OUT_PNG,
  outJson: OUT_JSON,
  viewBox: VIEWBOX,
  guides: baseGuides
});

await writeGuideSet({
  sourceSvg: DOWNLOAD_SOURCE_SVG,
  outSvg: OUT_FULL_SOURCE_SVG,
  outPng: OUT_FULL_SOURCE_PNG,
  outJson: OUT_FULL_SOURCE_JSON,
  viewBox: FULL_SOURCE_VIEWBOX,
  guides: scaleGuides(baseGuides, FULL_SOURCE_VIEWBOX)
});
