import { chromium } from "playwright";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const WORKSPACE_SHEET_DIR = "Assets/Images and Animations/Avatar Studio/contact-sheets";
const LAYER_ROOT = "Assets/Images and Animations/Avatar Studio/layers";
const CANVAS = { width: 1024, height: 1536 };

const sourceSheets = [
  {
    from: "/Users/tania.byrnes/Downloads/ElevenLabs_image_gpt-image-2_I want to us..._2026-06-02T12_19_46.png",
    to: "girl-modular-sheet-v1.png"
  },
  {
    from: "/Users/tania.byrnes/Downloads/ElevenLabs_image_gpt-image-2_I want to us..._2026-06-02T12_26_10.png",
    to: "boy-modular-sheet-v1.png"
  }
];

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function copySources() {
  mkdirSync(WORKSPACE_SHEET_DIR, { recursive: true });
  for (const sheet of sourceSheets) {
    copyFileSync(sheet.from, join(WORKSPACE_SHEET_DIR, sheet.to));
  }
}

function dataUrl(path) {
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

const operations = [
  {
    source: "boy-modular-sheet-v1.png",
    output: "ecc-boy-base-neutral/sheet-base.png",
    crop: { x: 30, y: 36, width: 168, height: 560 },
    dest: { x: 330, y: 160, width: 364, height: 1213 }
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-girl-base-neutral/sheet-base.png",
    crop: { x: 20, y: 64, width: 166, height: 630 },
    dest: { x: 330, y: 168, width: 332, height: 1260 }
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-boy-base-neutral/accessories/glasses.png",
    crop: { x: 829, y: 623, width: 76, height: 46 },
    dest: { x: 447, y: 270, width: 128, height: 77 },
    clearInteriorBackground: true
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-girl-base-neutral/accessories/glasses.png",
    crop: { x: 829, y: 623, width: 76, height: 46 },
    dest: { x: 445, y: 246, width: 122, height: 73 },
    clearInteriorBackground: true
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-girl-base-neutral/accessories/small-earrings.png",
    crop: { x: 385, y: 639, width: 48, height: 24 },
    dest: { x: 380, y: 431, width: 104, height: 52 },
    splitPair: {
      left: { sourceX: 0, sourceY: 0, sourceWidth: 20, sourceHeight: 24, destX: 385, destY: 439, destWidth: 24, destHeight: 24 },
      right: { sourceX: 0, sourceY: 0, sourceWidth: 20, sourceHeight: 24, destX: 613, destY: 439, destWidth: 24, destHeight: 24 }
    }
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-boy-base-neutral/accessories/name-badge.png",
    crop: { x: 1051, y: 626, width: 34, height: 50 },
    dest: { x: 603, y: 629, width: 78, height: 73 }
  },
  {
    source: "girl-modular-sheet-v1.png",
    output: "ecc-girl-base-neutral/accessories/name-badge.png",
    crop: { x: 1051, y: 626, width: 34, height: 50 },
    dest: { x: 599, y: 613, width: 76, height: 71 }
  }
];

const skinMaskOperations = [
  {
    source: "ecc-boy-base-neutral/sheet-base.png",
    output: "ecc-boy-base-neutral/skin/mask.png"
  },
  {
    source: "ecc-girl-base-neutral/sheet-base.png",
    output: "ecc-girl-base-neutral/skin/mask.png"
  }
];

function writeDataUrl(outputPath, url) {
  const base64 = url.replace(/^data:image\/png;base64,/, "");
  ensureDir(outputPath);
  writeFileSync(outputPath, Buffer.from(base64, "base64"));
}

copySources();

const browser = await chromium.launch();
const page = await browser.newPage();

for (const op of operations) {
  const sourcePath = join(WORKSPACE_SHEET_DIR, op.source);
  const result = await page.evaluate(async ({ sourceUrl, op, canvasSize }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    }

    function isBackgroundPixel(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min <= 8 && max >= 218) || (r >= 242 && g >= 242 && b >= 242);
    }

    function removeConnectedBackground(imageData) {
      const { data, width, height } = imageData;
      const visited = new Uint8Array(width * height);
      const queue = [];
      function maybePush(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        const index = y * width + x;
        if (visited[index]) return;
        const offset = index * 4;
        if (!isBackgroundPixel(data[offset], data[offset + 1], data[offset + 2])) return;
        visited[index] = 1;
        queue.push(index);
      }
      for (let x = 0; x < width; x += 1) {
        maybePush(x, 0);
        maybePush(x, height - 1);
      }
      for (let y = 0; y < height; y += 1) {
        maybePush(0, y);
        maybePush(width - 1, y);
      }
      while (queue.length) {
        const index = queue.pop();
        const x = index % width;
        const y = Math.floor(index / width);
        maybePush(x + 1, y);
        maybePush(x - 1, y);
        maybePush(x, y + 1);
        maybePush(x, y - 1);
      }
      for (let index = 0; index < visited.length; index += 1) {
        if (!visited[index]) continue;
        const offset = index * 4;
        data[offset + 3] = 0;
      }
      return imageData;
    }

    function removeAllBackgroundPixels(imageData) {
      const { data } = imageData;
      for (let offset = 0; offset < data.length; offset += 4) {
        if (!isBackgroundPixel(data[offset], data[offset + 1], data[offset + 2])) continue;
        data[offset + 3] = 0;
      }
      return imageData;
    }

    const image = await loadImage(sourceUrl);
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = op.crop.width;
    cropCanvas.height = op.crop.height;
    const cropContext = cropCanvas.getContext("2d");
    cropContext.drawImage(
      image,
      op.crop.x,
      op.crop.y,
      op.crop.width,
      op.crop.height,
      0,
      0,
      op.crop.width,
      op.crop.height
    );
    let cleaned = removeConnectedBackground(cropContext.getImageData(0, 0, op.crop.width, op.crop.height));
    if (op.clearInteriorBackground) {
      cleaned = removeAllBackgroundPixels(cleaned);
    }
    cropContext.putImageData(cleaned, 0, 0);

    const outCanvas = document.createElement("canvas");
    outCanvas.width = canvasSize.width;
    outCanvas.height = canvasSize.height;
    const outContext = outCanvas.getContext("2d");
    if (op.splitPair) {
      for (const part of Object.values(op.splitPair)) {
        outContext.drawImage(
          cropCanvas,
          part.sourceX,
          part.sourceY,
          part.sourceWidth,
          part.sourceHeight,
          part.destX,
          part.destY,
          part.destWidth,
          part.destHeight
        );
      }
    } else {
      outContext.drawImage(cropCanvas, op.dest.x, op.dest.y, op.dest.width, op.dest.height);
    }
    return outCanvas.toDataURL("image/png");
  }, { sourceUrl: dataUrl(sourcePath), op, canvasSize: CANVAS });

  writeDataUrl(join(LAYER_ROOT, op.output), result);
}

for (const op of skinMaskOperations) {
  const sourcePath = join(LAYER_ROOT, op.source);
  const result = await page.evaluate(async ({ sourceUrl, canvasSize }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    }

    function isSkinPixel(r, g, b, a) {
      if (a < 32) return false;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max - min < 26) return false;
      if (r < 118 || g < 74 || b < 52 || b > 182) return false;
      if (r < g + 10 || g < b + 4) return false;
      if (r - g > 110 || g - b > 92) return false;
      return true;
    }

    function dilateAlpha(mask, width, height) {
      const source = new Uint8ClampedArray(mask);
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const offset = (y * width + x) * 4;
          if (source[offset + 3]) continue;
          let neighbourAlpha = 0;
          for (let yy = -1; yy <= 1; yy += 1) {
            for (let xx = -1; xx <= 1; xx += 1) {
              neighbourAlpha = Math.max(neighbourAlpha, source[((y + yy) * width + x + xx) * 4 + 3]);
            }
          }
          if (!neighbourAlpha) continue;
          mask[offset] = 255;
          mask[offset + 1] = 255;
          mask[offset + 2] = 255;
          mask[offset + 3] = Math.min(210, neighbourAlpha);
        }
      }
    }

    function filterSkinComponents(mask, width, height) {
      const visited = new Uint8Array(width * height);
      const queue = [];
      const components = [];
      function clearPixel(index) {
        const offset = index * 4;
        mask[offset] = 0;
        mask[offset + 1] = 0;
        mask[offset + 2] = 0;
        mask[offset + 3] = 0;
      }
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const startIndex = y * width + x;
          if (visited[startIndex] || !mask[startIndex * 4 + 3]) continue;
          visited[startIndex] = 1;
          queue.push(startIndex);
          const pixels = [];
          const bounds = { minX: x, minY: y, maxX: x, maxY: y };
          while (queue.length) {
            const index = queue.pop();
            const px = index % width;
            const py = Math.floor(index / width);
            pixels.push(index);
            bounds.minX = Math.min(bounds.minX, px);
            bounds.minY = Math.min(bounds.minY, py);
            bounds.maxX = Math.max(bounds.maxX, px);
            bounds.maxY = Math.max(bounds.maxY, py);
            for (const [nx, ny] of [[px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]]) {
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
              const neighbour = ny * width + nx;
              if (visited[neighbour] || !mask[neighbour * 4 + 3]) continue;
              visited[neighbour] = 1;
              queue.push(neighbour);
            }
          }
          components.push({ pixels, bounds });
        }
      }
      for (const component of components) {
        const { pixels, bounds } = component;
        const isFaceZone = bounds.maxY < 620;
        const isSideHand = bounds.maxX < 440 || bounds.minX > 580;
        const isHandZone = isSideHand && bounds.minY > 670 && bounds.maxY < 1160;
        const keep = pixels.length >= 500 && (isFaceZone || isHandZone);
        if (keep) continue;
        for (const index of pixels) clearPixel(index);
      }
    }

    const image = await loadImage(sourceUrl);
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = canvasSize.width;
    sourceCanvas.height = canvasSize.height;
    const sourceContext = sourceCanvas.getContext("2d");
    sourceContext.drawImage(image, 0, 0);
    const sourceData = sourceContext.getImageData(0, 0, canvasSize.width, canvasSize.height);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvasSize.width;
    maskCanvas.height = canvasSize.height;
    const maskContext = maskCanvas.getContext("2d");
    const maskData = maskContext.createImageData(canvasSize.width, canvasSize.height);

    for (let offset = 0; offset < sourceData.data.length; offset += 4) {
      const r = sourceData.data[offset];
      const g = sourceData.data[offset + 1];
      const b = sourceData.data[offset + 2];
      const a = sourceData.data[offset + 3];
      if (!isSkinPixel(r, g, b, a)) continue;
      maskData.data[offset] = 255;
      maskData.data[offset + 1] = 255;
      maskData.data[offset + 2] = 255;
      maskData.data[offset + 3] = 255;
    }
    filterSkinComponents(maskData.data, canvasSize.width, canvasSize.height);
    dilateAlpha(maskData.data, canvasSize.width, canvasSize.height);
    maskContext.putImageData(maskData, 0, 0);
    return maskCanvas.toDataURL("image/png");
  }, { sourceUrl: dataUrl(sourcePath), canvasSize: CANVAS });

  writeDataUrl(join(LAYER_ROOT, op.output), result);
}

await browser.close();
console.log(`Sliced ${operations.length} contact-sheet avatar layers and ${skinMaskOperations.length} skin masks.`);
