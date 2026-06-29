import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const WIDTH = 1024;
const HEIGHT = 1536;
const ROOT = "Assets/Images and Animations/Avatar Studio/layers";

const eyeColours = [
  { id: "brown", color: "#6f3b18", highlight: "#c77b33" },
  { id: "amber", color: "#bd841f", highlight: "#f0c45f" },
  { id: "green", color: "#3f9b4a", highlight: "#8de26f" },
  { id: "blue", color: "#238fcc", highlight: "#8bd8ff" },
  { id: "grey", color: "#788995", highlight: "#d4dde4" }
];

const rigs = {
  "ecc-boy-base-neutral": {
    sourceImage: "skin-variants/sheet-base-skin-sand.png",
    sourceIris: "blue",
    leftEye: { x: 483, y: 322, rx: 24, ry: 23 },
    rightEye: { x: 567, y: 322, rx: 24, ry: 23 }
  },
  "ecc-girl-base-neutral": {
    sourceImage: "skin-variants/sheet-base-skin-sand.png",
    sourceIris: "brown",
    leftEye: { x: 458, y: 310, rx: 25, ry: 24 },
    rightEye: { x: 547, y: 309, rx: 25, ry: 24 }
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

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function decodePng(path) {
  const png = readFileSync(path);
  if (!png.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) throw new Error(`${path} is not a PNG`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.subarray(offset + 4, offset + 8).toString("ascii");
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
    offset += length + 12;
  }
  if (bitDepth !== 8 || colorType !== 6) throw new Error(`${path} must be an 8-bit RGBA PNG`);
  const inflated = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const sourceRow = y * (stride + 1);
    const filter = inflated[sourceRow];
    const targetRow = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[sourceRow + 1 + x];
      const left = x >= 4 ? pixels[targetRow + x - 4] : 0;
      const up = y > 0 ? pixels[targetRow + x - stride] : 0;
      const upLeft = y > 0 && x >= 4 ? pixels[targetRow + x - stride - 4] : 0;
      const value = filter === 0
        ? raw
        : filter === 1
          ? raw + left
          : filter === 2
            ? raw + up
            : filter === 3
              ? raw + Math.floor((left + up) / 2)
              : raw + paeth(left, up, upLeft);
      pixels[targetRow + x] = value & 0xff;
    }
  }
  return { width, height, pixels };
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

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function isInsideEye(point, x, y) {
  const dx = (x + 0.5 - point.x) / point.rx;
  const dy = (y + 0.5 - point.y) / point.ry;
  return dx * dx + dy * dy <= 1;
}

function isSourceIrisColourPixel(source, index, eye, sourceIris, x, y) {
  if (!isInsideEye(eye, x, y)) return false;
  const r = source[index];
  const g = source[index + 1];
  const b = source[index + 2];
  const a = source[index + 3];
  if (a < 180) return false;

  const brightness = (r + g + b) / 3;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  if (brightness < 44) return false;
  if (brightness > 222 && saturation < 48) return false;

  if (sourceIris === "blue") {
    return b > 56 && b > r + 16 && g > r + 4 && saturation > 18 && brightness < 175;
  }
  return r > 62 && g > 32 && b < 102 && r > g + 5 && g > b + 3 && r - b > 24 && saturation > 20 && brightness < 158;
}

function renderEyeOverlay(sourceImage, rig, colour) {
  const canvas = Buffer.alloc(WIDTH * HEIGHT * 4);
  const target = parseHex(colour.color);
  const highlight = parseHex(colour.highlight || colour.color);

  for (const eye of [rig.leftEye, rig.rightEye]) {
    const minX = Math.floor(eye.x - eye.rx);
    const maxX = Math.ceil(eye.x + eye.rx);
    const minY = Math.floor(eye.y - eye.ry);
    const maxY = Math.ceil(eye.y + eye.ry);
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) continue;
        const index = (y * WIDTH + x) * 4;
        if (!isSourceIrisColourPixel(sourceImage.pixels, index, eye, rig.sourceIris, x, y)) continue;

        const sourceBrightness = (sourceImage.pixels[index] + sourceImage.pixels[index + 1] + sourceImage.pixels[index + 2]) / 3;
        const sourceLum = luminance(sourceImage.pixels[index], sourceImage.pixels[index + 1], sourceImage.pixels[index + 2]);
        const shade = clamp(sourceLum / (rig.sourceIris === "blue" ? 92 : 104), 0.55, 1.2);
        const shineMix = clamp((sourceBrightness - 70) / 86, 0, 0.35);
        const mix = Math.min(0.35, shineMix);
        const alpha = Math.round(rig.sourceIris === "blue" ? 248 : 238);

        canvas[index] = clamp(Math.round((target[0] * (1 - mix) + highlight[0] * mix) * shade));
        canvas[index + 1] = clamp(Math.round((target[1] * (1 - mix) + highlight[1] * mix) * shade));
        canvas[index + 2] = clamp(Math.round((target[2] * (1 - mix) + highlight[2] * mix) * shade));
        canvas[index + 3] = alpha;
      }
    }
  }
  return canvas;
}

for (const [rigId, rig] of Object.entries(rigs)) {
  const sourceImage = decodePng(join(ROOT, rigId, rig.sourceImage));
  for (const colour of eyeColours) {
    const outputPath = join(ROOT, rigId, "face", `eye-colour-${colour.id}.png`);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, pngFromRgba(renderEyeOverlay(sourceImage, rig, colour)));
  }
}

console.log(`Generated ${eyeColours.length} iris-mask overlays for ${Object.keys(rigs).length} ECC rigs.`);
