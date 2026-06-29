import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { inflateSync } from "node:zlib";

const ROOT = "Assets/Images and Animations/Avatar Studio/layers";
const EXPECTED = { width: 1024, height: 1536 };

const slotBounds = [
  { pattern: /\/face\/eye-colour-/, label: "eye-colour", max: { x: 610, y: 340 }, min: { x: 390, y: 240 } },
  { pattern: /\/accessories\/small-earrings\.png$/, label: "earrings", max: { x: 660, y: 510 }, min: { x: 350, y: 400 } },
  { pattern: /\/face\/expression-/, label: "expression", max: { x: 700, y: 590 }, min: { x: 300, y: 120 } },
  { pattern: /\/head\/base\.png$/, label: "head-base", max: { x: 700, y: 580 }, min: { x: 300, y: 120 } },
  { pattern: /\/hair\//, label: "hair", max: { x: 740, y: 660 }, min: { x: 250, y: 70 } },
  { pattern: /\/uniform\/shirt\.png$/, label: "shirt", max: { x: 720, y: 870 }, min: { x: 280, y: 430 } },
  { pattern: /\/uniform\/tie\.png$/, label: "tie", max: { x: 590, y: 820 }, min: { x: 430, y: 430 } },
  { pattern: /\/uniform\/jumper\.png$/, label: "jumper", max: { x: 760, y: 990 }, min: { x: 240, y: 430 } },
  { pattern: /\/uniform\/blazer\.png$/, label: "blazer", max: { x: 820, y: 1040 }, min: { x: 200, y: 430 } },
  { pattern: /\/uniform\/lower\.png$/, label: "bottoms", max: { x: 760, y: 1240 }, min: { x: 240, y: 730 } },
  { pattern: /\/shoes\//, label: "shoes", max: { x: 720, y: 1530 }, min: { x: 260, y: 1260 } }
];

const crcBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
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
  if (!png.subarray(0, 4).equals(crcBytes)) throw new Error(`${path} is not a PNG`);
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
  if (bitDepth !== 8 || colorType !== 6) {
    return { width, height, unsupported: `Only RGBA PNGs are audited. Found bitDepth=${bitDepth}, colorType=${colorType}.` };
  }
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

function alphaBox(decoded) {
  if (!decoded.pixels) return null;
  let minX = decoded.width;
  let minY = decoded.height;
  let maxX = -1;
  let maxY = -1;
  let pixels = 0;
  for (let y = 0; y < decoded.height; y += 1) {
    for (let x = 0; x < decoded.width; x += 1) {
      const alpha = decoded.pixels[(y * decoded.width + x) * 4 + 3];
      if (alpha < 12) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      pixels += 1;
    }
  }
  return pixels ? { minX, minY, maxX, maxY, pixels } : null;
}

function classify(relPath, box) {
  const normalized = relPath.replaceAll("\\", "/");
  const slot = slotBounds.find(item => item.pattern.test(normalized));
  if (!slot || !box) return { label: slot?.label || "unclassified", status: "info", reason: "No slot bounds configured." };
  const outside = box.minX < slot.min.x || box.minY < slot.min.y || box.maxX > slot.max.x || box.maxY > slot.max.y;
  return {
    label: slot.label,
    status: outside ? "fail" : "pass",
    reason: outside ? `Alpha bounds exceed ${slot.label} expected region.` : "Alpha bounds fit expected region."
  };
}

const files = walk(ROOT).filter(path => path.endsWith(".png") && !path.includes("preview-contact-sheet"));
const results = files.map(path => {
  const rel = relative(ROOT, path);
  const decoded = decodePng(path);
  const box = alphaBox(decoded);
  const sizeOk = decoded.width === EXPECTED.width && decoded.height === EXPECTED.height;
  const classification = classify(rel, box);
  return {
    file: rel,
    size: `${decoded.width}x${decoded.height}`,
    sizeOk,
    unsupported: decoded.unsupported || null,
    alphaBox: box,
    slot: classification.label,
    status: !sizeOk || decoded.unsupported ? "fail" : classification.status,
    reason: !sizeOk ? "Wrong canvas size." : decoded.unsupported || classification.reason
  };
});

const failures = results.filter(result => result.status === "fail");
for (const result of results) {
  if (result.status !== "fail") continue;
  console.log(`${result.status.toUpperCase()} ${result.file}: ${result.reason} ${JSON.stringify(result.alphaBox)}`);
}
console.log(JSON.stringify({
  checked: results.length,
  failures: failures.length,
  acceptedEyeLayers: results.filter(result => /face[\/\\]eye-colour-/.test(result.file) && result.status === "pass").length
}, null, 2));

if (failures.length) process.exitCode = 1;
