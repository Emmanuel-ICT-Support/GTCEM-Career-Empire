import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const KIT_DIR = "Assets/Images and Animations/Avatar Studio/Contact Derived Rig Kit";
const SOURCE_DIR = "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets";
const BOY_BASE = join(KIT_DIR, "ecc-boy-contact-rig-v1/02-base-body-guide.png");
const GIRL_HEAD_SOURCE = join(SOURCE_DIR, "Girl P1.png");
const OUT = join(KIT_DIR, "ecc-girl-contact-rig-v1/02-neutral-body-boy-base-girl-head.png");
const PREVIEW = join(KIT_DIR, "girl-head-on-neutral-base-preview.png");
const CANVAS = { width: 1024, height: 1536 };
const GIRL_HEAD_CROP = { x: 318, y: 34, width: 102, height: 122 };
const GIRL_HEAD_PLACEMENT = { x: 355, y: 103, width: 372, height: 445 };

function ensureDir(path) {
  mkdirSync(dirname(path), { recursive: true });
}

function dataUrl(path) {
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

function writeDataUrl(outputPath, url) {
  const base64 = url.replace(/^data:image\/png;base64,/, "");
  ensureDir(outputPath);
  writeFileSync(outputPath, Buffer.from(base64, "base64"));
}

const browser = await chromium.launch();
const page = await browser.newPage();

const output = await page.evaluate(
  async ({ boyBaseUrl, girlHeadSourceUrl, canvasSize, headCrop, headPlacement }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    }

    function drawUnderpantsRepair(ctx) {
      ctx.save();
      ctx.fillStyle = "#f4f2ec";
      ctx.beginPath();
      ctx.moveTo(386, 770);
      ctx.lineTo(505, 760);
      ctx.lineTo(512, 914);
      ctx.lineTo(400, 925);
      ctx.quadraticCurveTo(360, 890, 358, 830);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(508, 760);
      ctx.lineTo(645, 770);
      ctx.quadraticCurveTo(674, 835, 640, 925);
      ctx.lineTo(515, 914);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#d6d1c9";
      ctx.fillRect(505, 782, 16, 118);
      ctx.restore();
    }

    function clearBoyHead(ctx, girlHeadLayer) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.rect(340, 120, 344, 300);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(512, 292, 154, 210, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(414, 298, 36, 72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(610, 298, 36, 72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawGirlNeckUnderlay(ctx) {
      return ctx;
    }

    function isContactSheetBackground(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min <= 14 && max >= 214) || (r >= 238 && g >= 238 && b >= 238);
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
        if (!isContactSheetBackground(data[offset], data[offset + 1], data[offset + 2])) return;
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
        if (visited[index]) data[index * 4 + 3] = 0;
      }
      return imageData;
    }

    function keepLargestAlphaComponent(imageData) {
      const { data, width, height } = imageData;
      const visited = new Uint8Array(width * height);
      const components = [];

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const start = y * width + x;
          if (visited[start]) continue;
          if (data[start * 4 + 3] === 0) {
            visited[start] = 1;
            continue;
          }
          const queue = [start];
          const pixels = [];
          visited[start] = 1;
          while (queue.length) {
            const index = queue.pop();
            const px = index % width;
            const py = Math.floor(index / width);
            pixels.push(index);
            for (const [nx, ny] of [[px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]]) {
              if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
              const next = ny * width + nx;
              if (visited[next]) continue;
              if (data[next * 4 + 3] === 0) {
                visited[next] = 1;
                continue;
              }
              visited[next] = 1;
              queue.push(next);
            }
          }
          components.push(pixels);
        }
      }

      components.sort((a, b) => b.length - a.length);
      const keep = new Set(components[0] || []);
      for (let index = 0; index < width * height; index += 1) {
        if (!keep.has(index)) data[index * 4 + 3] = 0;
      }
      return imageData;
    }

    function makeGirlHeadLayer(girlImage) {
      const layer = document.createElement("canvas");
      layer.width = canvasSize.width;
      layer.height = canvasSize.height;
      const ctx = layer.getContext("2d");

      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = headCrop.width;
      cropCanvas.height = headCrop.height;
      const cropCtx = cropCanvas.getContext("2d");
      cropCtx.drawImage(
        girlImage,
        headCrop.x,
        headCrop.y,
        headCrop.width,
        headCrop.height,
        0,
        0,
        headCrop.width,
        headCrop.height
      );
      const cropData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
      cropCtx.putImageData(keepLargestAlphaComponent(removeConnectedBackground(cropData)), 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        cropCanvas,
        headPlacement.x,
        headPlacement.y,
        headPlacement.width,
        headPlacement.height
      );

      return layer;
    }

    function drawChecker(ctx, x, y, width, height, size = 28) {
      for (let yy = 0; yy < height; yy += size) {
        for (let xx = 0; xx < width; xx += size) {
          ctx.fillStyle = (xx / size + yy / size) % 2 ? "#dce4ea" : "#f7fafc";
          ctx.fillRect(x + xx, y + yy, size, size);
        }
      }
    }

    const boyBase = await loadImage(boyBaseUrl);
    const girlReference = await loadImage(girlHeadSourceUrl);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvasSize.width;
    finalCanvas.height = canvasSize.height;
    const ctx = finalCanvas.getContext("2d");
    drawUnderpantsRepair(ctx);
    ctx.drawImage(boyBase, 0, 0);
    const girlHeadLayer = makeGirlHeadLayer(girlReference);
    clearBoyHead(ctx, girlHeadLayer);
    drawGirlNeckUnderlay(ctx);
    ctx.drawImage(girlHeadLayer, 0, 0);

    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = 980;
    previewCanvas.height = 760;
    const previewCtx = previewCanvas.getContext("2d");
    previewCtx.fillStyle = "#0b1524";
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.fillStyle = "#f8fafc";
    previewCtx.font = "bold 30px Arial, sans-serif";
    previewCtx.fillText("Girl head on neutral body proof", 36, 54);
    previewCtx.fillStyle = "#cbd5e1";
    previewCtx.font = "18px Arial, sans-serif";
    previewCtx.fillText("Uses existing girl head artwork over the neutral boy body guide. Not live-wired.", 36, 84);
    drawChecker(previewCtx, 330, 122, 320, 480, 18);
    previewCtx.drawImage(finalCanvas, 330, 122, 320, 480);
    previewCtx.fillStyle = "#f8fafc";
    previewCtx.font = "bold 18px Arial, sans-serif";
    previewCtx.fillText("ecc-girl neutral-base proof", 330, 640);

    return {
      finalPng: finalCanvas.toDataURL("image/png"),
      previewPng: previewCanvas.toDataURL("image/png")
    };
  },
  {
    boyBaseUrl: dataUrl(BOY_BASE),
    girlHeadSourceUrl: dataUrl(GIRL_HEAD_SOURCE),
    canvasSize: CANVAS,
    headCrop: GIRL_HEAD_CROP,
    headPlacement: GIRL_HEAD_PLACEMENT
  }
);

writeDataUrl(OUT, output.finalPng);
writeDataUrl(PREVIEW, output.previewPng);

await browser.close();

console.log(`Wrote ${OUT}`);
