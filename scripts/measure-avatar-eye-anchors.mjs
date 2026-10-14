import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";

const ROOT = "Assets/Images and Animations/Avatar Studio/layers";

const rigs = {
  "ecc-boy-base-neutral": {
    image: "skin-variants/sheet-base-skin-sand.png",
    windows: {
      leftEye: { minX: 455, minY: 315, maxX: 520, maxY: 370 },
      rightEye: { minX: 545, minY: 315, maxX: 610, maxY: 370 }
    }
  },
  "ecc-girl-base-neutral": {
    image: "skin-variants/sheet-base-skin-sand.png",
    windows: {
      leftEye: { minX: 425, minY: 300, maxX: 500, maxY: 350 },
      rightEye: { minX: 525, minY: 300, maxX: 600, maxY: 350 }
    }
  }
};

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

function pixelAt(image, x, y) {
  const index = (y * image.width + x) * 4;
  return {
    r: image.pixels[index],
    g: image.pixels[index + 1],
    b: image.pixels[index + 2],
    a: image.pixels[index + 3]
  };
}

function isIrisPixel(pixel) {
  if (pixel.a < 180) return false;
  const brightness = (pixel.r + pixel.g + pixel.b) / 3;
  return brightness < 46;
}

function measureEye(image, window) {
  let weightTotal = 0;
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  let minX = window.maxX;
  let minY = window.maxY;
  let maxX = window.minX;
  let maxY = window.minY;
  for (let y = window.minY; y <= window.maxY; y += 1) {
    for (let x = window.minX; x <= window.maxX; x += 1) {
      const pixel = pixelAt(image, x, y);
      if (!isIrisPixel(pixel)) continue;
      const brightness = (pixel.r + pixel.g + pixel.b) / 3;
      const weight = Math.max(1, 160 - brightness);
      weightTotal += weight;
      sumX += x * weight;
      sumY += y * weight;
      count += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (!count) throw new Error(`No iris pixels found inside ${JSON.stringify(window)}`);
  return {
    x: Math.round(sumX / weightTotal),
    y: Math.round(sumY / weightTotal),
    pixelCount: count,
    box: { minX, minY, maxX, maxY }
  };
}

const results = {};
for (const [rigId, config] of Object.entries(rigs)) {
  const image = decodePng(`${ROOT}/${rigId}/${config.image}`);
  results[rigId] = Object.fromEntries(
    Object.entries(config.windows).map(([key, window]) => [key, measureEye(image, window)])
  );
}

console.log(JSON.stringify(results, null, 2));
