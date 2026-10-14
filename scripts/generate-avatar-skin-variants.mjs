import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const WIDTH = 1024;
const HEIGHT = 1536;
const ROOT = "Assets/Images and Animations/Avatar Studio/layers";
const DEFAULT_OUTPUT_ROOT = "/private/tmp/avatar-skin-variants";

const skinTones = [
  { id: "sand", label: "Sand", color: "#dba77c", isBase: true },
  { id: "porcelain", label: "Porcelain", color: "#f4d6c5" },
  { id: "warm", label: "Warm", color: "#b8734f" },
  { id: "copper", label: "Copper", color: "#935a3c" },
  { id: "mahogany", label: "Mahogany", color: "#66402f" },
  { id: "deep", label: "Deep", color: "#38251f" }
];

const rigs = ["ecc-boy-base-neutral", "ecc-girl-base-neutral"];

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

function encodePng(image) {
  const raw = Buffer.alloc((image.width * 4 + 1) * image.height);
  for (let y = 0; y < image.height; y += 1) {
    const rowStart = y * (image.width * 4 + 1);
    raw[rowStart] = 0;
    image.pixels.copy(raw, rowStart + 1, y * image.width * 4, (y + 1) * image.width * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(image.width, 0);
  header.writeUInt32BE(image.height, 4);
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

function averageSkinLuminance(base, mask) {
  let total = 0;
  let count = 0;
  for (let i = 0; i < base.pixels.length; i += 4) {
    if (mask.pixels[i + 3] < 128) continue;
    total += luminance(base.pixels[i], base.pixels[i + 1], base.pixels[i + 2]);
    count += 1;
  }
  return count ? total / count : 150;
}

function recolourBase(base, mask, tone) {
  if (tone.isBase) return Buffer.from(base.pixels);
  const target = parseHex(tone.color);
  const targetLum = Math.max(1, luminance(target[0], target[1], target[2]));
  const sourceMean = averageSkinLuminance(base, mask);
  const output = Buffer.from(base.pixels);

  for (let i = 0; i < output.length; i += 4) {
    const maskAlpha = mask.pixels[i + 3] / 255;
    if (maskAlpha < 0.08) continue;

    const sourceLum = luminance(base.pixels[i], base.pixels[i + 1], base.pixels[i + 2]);
    const shade = clamp(sourceLum / sourceMean, 0.5, 1.55);
    const detail = clamp(sourceLum / 255, 0.18, 1);
    const strength = Math.min(0.94, maskAlpha * 0.88);
    const highlightLift = tone.id === "porcelain" ? 14 : tone.id === "deep" || tone.id === "mahogany" ? -6 : 0;

    const recoloured = target.map(channel => {
      const shaded = channel * shade;
      const detailAdjusted = shaded * 0.82 + targetLum * detail * 0.18 + highlightLift;
      return clamp(Math.round(detailAdjusted));
    });

    output[i] = Math.round(base.pixels[i] * (1 - strength) + recoloured[0] * strength);
    output[i + 1] = Math.round(base.pixels[i + 1] * (1 - strength) + recoloured[1] * strength);
    output[i + 2] = Math.round(base.pixels[i + 2] * (1 - strength) + recoloured[2] * strength);
  }
  return output;
}

function scaledCopy(source, target, sourceWidth, sourceHeight, targetWidth, xOffset, yOffset, cellWidth, cellHeight) {
  const scale = Math.min(cellWidth / sourceWidth, cellHeight / sourceHeight);
  const drawnWidth = Math.round(sourceWidth * scale);
  const drawnHeight = Math.round(sourceHeight * scale);
  const left = xOffset + Math.floor((cellWidth - drawnWidth) / 2);
  const top = yOffset + Math.floor((cellHeight - drawnHeight) / 2);
  for (let y = 0; y < drawnHeight; y += 1) {
    const sy = Math.min(sourceHeight - 1, Math.floor(y / scale));
    for (let x = 0; x < drawnWidth; x += 1) {
      const sx = Math.min(sourceWidth - 1, Math.floor(x / scale));
      const sourceIndex = (sy * sourceWidth + sx) * 4;
      const targetIndex = ((top + y) * targetWidth + left + x) * 4;
      const alpha = source[sourceIndex + 3] / 255;
      if (alpha <= 0) continue;
      target[targetIndex] = Math.round(source[sourceIndex] * alpha + target[targetIndex] * (1 - alpha));
      target[targetIndex + 1] = Math.round(source[sourceIndex + 1] * alpha + target[targetIndex + 1] * (1 - alpha));
      target[targetIndex + 2] = Math.round(source[sourceIndex + 2] * alpha + target[targetIndex + 2] * (1 - alpha));
      target[targetIndex + 3] = 255;
    }
  }
}

function createContactSheet(images) {
  const cellWidth = 190;
  const cellHeight = 285;
  const gap = 14;
  const cols = skinTones.length;
  const rows = rigs.length;
  const width = cols * cellWidth + (cols + 1) * gap;
  const height = rows * cellHeight + (rows + 1) * gap;
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 16;
    pixels[i + 1] = 24;
    pixels[i + 2] = 38;
    pixels[i + 3] = 255;
  }
  images.forEach((image, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const left = gap + col * (cellWidth + gap);
    const top = gap + row * (cellHeight + gap);
    for (let y = top; y < top + cellHeight; y += 1) {
      for (let x = left; x < left + cellWidth; x += 1) {
        const pixel = (y * width + x) * 4;
        pixels[pixel] = 22;
        pixels[pixel + 1] = 72;
        pixels[pixel + 2] = 82;
      }
    }
    scaledCopy(image.pixels, pixels, WIDTH, HEIGHT, width, left, top, cellWidth, cellHeight);
  });
  return { width, height, pixels };
}

function getOutputRoot() {
  const index = process.argv.indexOf("--output-root");
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : DEFAULT_OUTPUT_ROOT;
}

const outputRoot = getOutputRoot();
const sheetImages = [];
for (const rig of rigs) {
  const base = decodePng(join(ROOT, rig, "sheet-base.png"));
  const mask = decodePng(join(ROOT, rig, "skin", "mask.png"));
  if (base.width !== WIDTH || base.height !== HEIGHT || mask.width !== WIDTH || mask.height !== HEIGHT) {
    throw new Error(`${rig} base and mask must both be ${WIDTH}x${HEIGHT}`);
  }
  for (const tone of skinTones) {
    const pixels = recolourBase(base, mask, tone);
    const image = { width: WIDTH, height: HEIGHT, pixels };
    sheetImages.push(image);
    const outputPath = join(outputRoot, rig, "skin-variants", `sheet-base-skin-${tone.id}.png`);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, encodePng(image));
  }
}

if (outputRoot === DEFAULT_OUTPUT_ROOT) {
  const contactSheet = createContactSheet(sheetImages);
  mkdirSync(outputRoot, { recursive: true });
  writeFileSync(join(outputRoot, "skin-variant-contact-sheet.png"), encodePng(contactSheet));
}
console.log(`Generated skin variants in ${outputRoot}`);
