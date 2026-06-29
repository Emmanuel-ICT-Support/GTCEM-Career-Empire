import { deflateSync } from "node:zlib";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const WIDTH = 1024;
const HEIGHT = 1536;
const ROOT = "Assets/Images and Animations/Avatar Studio/layers";

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
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

function createCanvas() {
  return Buffer.alloc(WIDTH * HEIGHT * 4);
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
      if (distance <= 1) blendPixel(canvas, x, y, color, alpha);
    }
  }
}

function strokeEllipse(canvas, cx, cy, rx, ry, width, color, alpha = 255) {
  const minX = Math.floor(cx - rx - width);
  const maxX = Math.ceil(cx + rx + width);
  const minY = Math.floor(cy - ry - width);
  const maxY = Math.ceil(cy + ry + width);
  const outerRx = rx + width / 2;
  const outerRy = ry + width / 2;
  const innerRx = Math.max(1, rx - width / 2);
  const innerRy = Math.max(1, ry - width / 2);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const outer = ((x + 0.5 - cx) / outerRx) ** 2 + ((y + 0.5 - cy) / outerRy) ** 2;
      const inner = ((x + 0.5 - cx) / innerRx) ** 2 + ((y + 0.5 - cy) / innerRy) ** 2;
      if (outer <= 1 && inner >= 1) blendPixel(canvas, x, y, color, alpha);
    }
  }
}

function strokeLine(canvas, x1, y1, x2, y2, width, color, alpha = 255) {
  const radius = width / 2;
  const minX = Math.floor(Math.min(x1, x2) - radius);
  const maxX = Math.ceil(Math.max(x1, x2) + radius);
  const minY = Math.floor(Math.min(y1, y2) - radius);
  const maxY = Math.ceil(Math.max(y1, y2) + radius);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy || 1;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
      const px = x1 + t * dx;
      const py = y1 + t * dy;
      const distance = Math.hypot(x - px, y - py);
      if (distance <= radius) blendPixel(canvas, x, y, color, alpha);
    }
  }
}

function fillRoundRect(canvas, x, y, width, height, radius, color, alpha = 255) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      const dx = Math.max(x + radius - px, 0, px - (x + width - radius));
      const dy = Math.max(y + radius - py, 0, py - (y + height - radius));
      if (dx * dx + dy * dy <= radius * radius) blendPixel(canvas, px, py, color, alpha);
    }
  }
}

function savePng(path, canvas) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, pngFromRgba(canvas));
}

function copyHairFront(rigRoot) {
  const hairDir = join(ROOT, rigRoot, "hair");
  copyFileSync(join(hairDir, "front.png"), join(hairDir, "crop-front.png"));
  savePng(join(hairDir, "crop-back.png"), createCanvas());
}

function makeSkinMask(rigRoot, anchors) {
  const canvas = createCanvas();
  const white = [255, 255, 255];
  fillEllipse(canvas, 512, anchors.faceY, anchors.faceRx, anchors.faceRy, white);
  fillRoundRect(canvas, 478, anchors.neckY - 10, 68, 46, 18, white);
  savePng(join(ROOT, rigRoot, "skin", "mask.png"), canvas);
}

function makeHairMask(rigRoot, anchors) {
  const canvas = createCanvas();
  const white = [255, 255, 255];
  if (rigRoot.includes("girl")) {
    fillEllipse(canvas, 512, anchors.faceY - 132, 132, 74, white);
    fillEllipse(canvas, 430, anchors.faceY - 92, 44, 58, white);
    fillEllipse(canvas, 592, anchors.faceY - 92, 44, 58, white);
  } else {
    fillEllipse(canvas, 512, anchors.faceY - 154, 146, 72, white);
    fillEllipse(canvas, 438, anchors.faceY - 124, 56, 54, white);
    fillEllipse(canvas, 592, anchors.faceY - 126, 64, 54, white);
  }
  savePng(join(ROOT, rigRoot, "hair", "mask-current.png"), canvas);
}

function makeGlasses(rigRoot, anchors) {
  const canvas = createCanvas();
  const frame = parseHex("#17202a");
  const shine = parseHex("#f7fbff");
  const eyeY = anchors.eyeY - 76;
  strokeEllipse(canvas, anchors.leftEyeX, eyeY + 2, 27, 25, 5, frame, 222);
  strokeEllipse(canvas, anchors.rightEyeX, eyeY + 2, 27, 25, 5, frame, 222);
  strokeLine(canvas, anchors.leftEyeX + 27, eyeY + 1, anchors.rightEyeX - 27, eyeY + 1, 5, frame, 222);
  strokeLine(canvas, anchors.leftEyeX - 27, eyeY + 1, anchors.leftEarX + 8, anchors.earY - 52, 4, frame, 176);
  strokeLine(canvas, anchors.rightEyeX + 27, eyeY + 1, anchors.rightEarX - 8, anchors.earY - 52, 4, frame, 176);
  strokeLine(canvas, anchors.leftEyeX - 14, eyeY - 11, anchors.leftEyeX - 4, eyeY - 17, 2, shine, 104);
  strokeLine(canvas, anchors.rightEyeX - 14, eyeY - 11, anchors.rightEyeX - 4, eyeY - 17, 2, shine, 104);
  savePng(join(ROOT, rigRoot, "accessories", "glasses.png"), canvas);
}

function makeEarrings(rigRoot, anchors) {
  const canvas = createCanvas();
  const gold = parseHex("#f6b73c");
  const shadow = parseHex("#9a6a16");
  fillEllipse(canvas, anchors.leftEarX, anchors.earY + 36, 13, 13, shadow, 220);
  fillEllipse(canvas, anchors.rightEarX, anchors.earY + 36, 13, 13, shadow, 220);
  fillEllipse(canvas, anchors.leftEarX - 2, anchors.earY + 33, 9, 9, gold, 250);
  fillEllipse(canvas, anchors.rightEarX - 2, anchors.earY + 33, 9, 9, gold, 250);
  savePng(join(ROOT, rigRoot, "accessories", "small-earrings.png"), canvas);
}

function makeNameBadge(rigRoot, anchors) {
  const canvas = createCanvas();
  const white = parseHex("#ffffff");
  const navy = parseHex("#17202a");
  const teal = parseHex("#0f8f8c");
  const gold = parseHex("#f6b73c");
  fillRoundRect(canvas, 612, anchors.chestY, 118, 54, 13, navy, 92);
  fillRoundRect(canvas, 608, anchors.chestY - 4, 118, 54, 13, white, 238);
  strokeLine(canvas, 626, anchors.chestY + 16, 704, anchors.chestY + 16, 6, teal, 236);
  strokeLine(canvas, 626, anchors.chestY + 32, 684, anchors.chestY + 32, 5, gold, 236);
  savePng(join(ROOT, rigRoot, "accessories", "name-badge.png"), canvas);
}

const rigs = {
  "ecc-boy-base-neutral": {
    eyeY: 436,
    leftEyeX: 454,
    rightEyeX: 544,
    earY: 458,
    leftEarX: 390,
    rightEarX: 626,
    neckY: 566,
    chestY: 742,
    faceY: 435,
    faceRx: 104,
    faceRy: 132,
    leftHandX: 360,
    rightHandX: 678,
    handY: 1030
  },
  "ecc-girl-base-neutral": {
    eyeY: 415,
    leftEyeX: 454,
    rightEyeX: 544,
    earY: 440,
    leftEarX: 392,
    rightEarX: 624,
    neckY: 548,
    chestY: 716,
    faceY: 410,
    faceRx: 102,
    faceRy: 128,
    leftHandX: 356,
    rightHandX: 666,
    handY: 944
  }
};

for (const [rigRoot, anchors] of Object.entries(rigs)) {
  copyHairFront(rigRoot);
  makeSkinMask(rigRoot, anchors);
  makeHairMask(rigRoot, anchors);
  makeGlasses(rigRoot, anchors);
  makeEarrings(rigRoot, anchors);
  makeNameBadge(rigRoot, anchors);
}

console.log(`Generated starter avatar art for ${Object.keys(rigs).length} ECC rigs.`);
