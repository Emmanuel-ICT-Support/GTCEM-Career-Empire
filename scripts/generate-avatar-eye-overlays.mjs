import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";

const WIDTH = 1024;
const HEIGHT = 1536;
const ROOT = "Assets/Images and Animations/Avatar Studio/layers";

const eyeColours = [
  { id: "brown", color: "#6f3f1f", highlight: "#c9823c" },
  { id: "amber", color: "#9a7622", highlight: "#dfb453" },
  { id: "green", color: "#5f7d32", highlight: "#9fc45c" },
  { id: "blue", color: "#2f789c", highlight: "#8bd8ff" },
  { id: "grey", color: "#5d6871", highlight: "#b8c5ce" }
];

const rigs = {
  "ecc-boy-base-neutral": {
    leftEye: { x: 454, y: 309 },
    rightEye: { x: 544, y: 309 }
  },
  "ecc-girl-base-neutral": {
    leftEye: { x: 454, y: 282 },
    rightEye: { x: 544, y: 282 }
  }
};

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function pngFromRgba(rgba) {
  const raw = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    const rowStart = y * (WIDTH * 4 + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * WIDTH * 4, (y + 1) * WIDTH * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(WIDTH, 0);
  header.writeUInt32BE(HEIGHT, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND")
  ]);
}

function parseHex(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16)
  ];
}

function blendPixel(canvas, x, y, color, alpha = 255) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT || alpha <= 0) return;
  const index = (Math.round(y) * WIDTH + Math.round(x)) * 4;
  const srcA = alpha / 255;
  const dstA = canvas[index + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA === 0) return;
  canvas[index] = Math.round((color[0] * srcA + canvas[index] * dstA * (1 - srcA)) / outA);
  canvas[index + 1] = Math.round((color[1] * srcA + canvas[index + 1] * dstA * (1 - srcA)) / outA);
  canvas[index + 2] = Math.round((color[2] * srcA + canvas[index + 2] * dstA * (1 - srcA)) / outA);
  canvas[index + 3] = Math.round(outA * 255);
}

function fillEllipse(canvas, cx, cy, rx, ry, color, alpha = 255) {
  const minX = Math.floor(cx - rx - 2);
  const maxX = Math.ceil(cx + rx + 2);
  const minY = Math.floor(cy - ry - 2);
  const maxY = Math.ceil(cy + ry + 2);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1.08) continue;
      const coverage = distance <= 0.94 ? 1 : Math.max(0, (1.08 - distance) / 0.14);
      blendPixel(canvas, x, y, color, Math.round(alpha * coverage));
    }
  }
}

function renderEyePair(rig, colour) {
  const canvas = Buffer.alloc(WIDTH * HEIGHT * 4);
  const iris = parseHex(colour.color);
  const highlight = parseHex(colour.highlight);
  const pupil = parseHex("#111318");
  const white = parseHex("#ffffff");
  for (const eye of [rig.leftEye, rig.rightEye]) {
    fillEllipse(canvas, eye.x, eye.y, 10, 12, iris, 235);
    fillEllipse(canvas, eye.x, eye.y + 1, 4.5, 4.5, pupil, 220);
    fillEllipse(canvas, eye.x - 4, eye.y - 5, 2.5, 2.5, highlight, 230);
    fillEllipse(canvas, eye.x - 1, eye.y - 8, 1.6, 1.6, white, 210);
  }
  return canvas;
}

for (const [rigId, rig] of Object.entries(rigs)) {
  for (const colour of eyeColours) {
    const outputPath = join(ROOT, rigId, "face", `eye-colour-${colour.id}.png`);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, pngFromRgba(renderEyePair(rig, colour)));
  }
}

console.log(`Generated ${eyeColours.length} eye-colour overlays for ${Object.keys(rigs).length} ECC rigs.`);
