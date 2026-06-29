import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SOURCE = "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Boy P4.png";
const OUT_DIR = "Assets/Images and Animations/Avatar Studio/methodology-proof/ecc-boy-contact-rig";
const CANVAS = { width: 1024, height: 1536 };

const assets = [
  {
    id: "base-body",
    source: { x: 593, y: 64, width: 154, height: 600 },
    dest: { x: 352, y: 120, width: 320, height: 1247 },
    softenBackground: false
  },
  {
    id: "hair-brown-front",
    source: { x: 24, y: 38, width: 126, height: 112 },
    dest: { x: 366, y: 124, width: 292, height: 260 },
    softenBackground: true
  },
  {
    id: "shirt-white",
    source: { x: 761, y: 332, width: 86, height: 92 },
    dest: { x: 408, y: 510, width: 210, height: 225 },
    softenBackground: true
  },
  {
    id: "blazer-navy",
    source: { x: 756, y: 42, width: 76, height: 128 },
    dest: { x: 374, y: 452, width: 276, height: 465 },
    softenBackground: true
  },
  {
    id: "tie-teal",
    source: { x: 996, y: 333, width: 28, height: 78 },
    dest: { x: 486, y: 520, width: 55, height: 150 },
    softenBackground: true
  },
  {
    id: "pants-navy",
    source: { x: 783, y: 479, width: 70, height: 122 },
    dest: { x: 413, y: 858, width: 198, height: 407 },
    softenBackground: true
  },
  {
    id: "shoes-black",
    source: { x: 747, y: 650, width: 61, height: 44 },
    dest: { x: 380, y: 1230, width: 264, height: 190 },
    softenBackground: true
  },
  {
    id: "eye-colour-green",
    source: { x: 496, y: 276, width: 26, height: 23 },
    dest: { x: 448, y: 394, width: 128, height: 113 },
    softenBackground: true,
    tintEyeOnly: true
  }
];

const composites = [
  {
    id: "composite-uniform-proof",
    stack: [
      "base-body",
      "shirt-white",
      "tie-teal",
      "pants-navy",
      "shoes-black",
      "blazer-navy",
      "hair-brown-front"
    ]
  },
  {
    id: "composite-eye-proof",
    stack: ["base-body", "eye-colour-green", "hair-brown-front"]
  }
];

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
const sourceUrl = dataUrl(SOURCE);

const result = await page.evaluate(async ({ sourceUrl, assets, composites, canvasSize }) => {
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function isSheetBackground(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max - min <= 12 && max >= 214) || (r >= 236 && g >= 236 && b >= 236);
  }

  function removeConnectedBackground(imageData, removeInterior = false) {
    const { data, width, height } = imageData;
    if (removeInterior) {
      for (let offset = 0; offset < data.length; offset += 4) {
        if (isSheetBackground(data[offset], data[offset + 1], data[offset + 2])) {
          data[offset + 3] = 0;
        }
      }
      return imageData;
    }

    const visited = new Uint8Array(width * height);
    const queue = [];
    function maybePush(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const index = y * width + x;
      if (visited[index]) return;
      const offset = index * 4;
      if (!isSheetBackground(data[offset], data[offset + 1], data[offset + 2])) return;
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

  function makeAsset(sourceImage, asset) {
    const crop = document.createElement("canvas");
    crop.width = asset.source.width;
    crop.height = asset.source.height;
    const cropContext = crop.getContext("2d");
    cropContext.drawImage(
      sourceImage,
      asset.source.x,
      asset.source.y,
      asset.source.width,
      asset.source.height,
      0,
      0,
      asset.source.width,
      asset.source.height
    );

    const cropData = cropContext.getImageData(0, 0, crop.width, crop.height);
    removeConnectedBackground(cropData, asset.softenBackground);
    cropContext.putImageData(cropData, 0, 0);

    const output = document.createElement("canvas");
    output.width = canvasSize.width;
    output.height = canvasSize.height;
    const outputContext = output.getContext("2d");
    outputContext.drawImage(
      crop,
      asset.dest.x,
      asset.dest.y,
      asset.dest.width,
      asset.dest.height
    );
    return output;
  }

  const sourceImage = await loadImage(sourceUrl);
  const canvases = {};
  const outputs = {};

  for (const asset of assets) {
    const canvas = makeAsset(sourceImage, asset);
    canvases[asset.id] = canvas;
    outputs[asset.id] = canvas.toDataURL("image/png");
  }

  for (const composite of composites) {
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#125b63";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (const layerId of composite.stack) {
      context.drawImage(canvases[layerId], 0, 0);
    }
    outputs[composite.id] = canvas.toDataURL("image/png");
  }

  const contact = document.createElement("canvas");
  contact.width = 1400;
  contact.height = 900;
  const ctx = contact.getContext("2d");
  ctx.fillStyle = "#0d1726";
  ctx.fillRect(0, 0, contact.width, contact.height);
  ctx.fillStyle = "#eff6ff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("Contact-sheet methodology proof", 28, 42);
  const tileW = 210;
  const tileH = 315;
  const order = [
    "base-body",
    "hair-brown-front",
    "shirt-white",
    "blazer-navy",
    "pants-navy",
    "shoes-black",
    "tie-teal",
    "eye-colour-green",
    "composite-uniform-proof",
    "composite-eye-proof"
  ];
  order.forEach((id, index) => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    const x = 28 + col * 270;
    const y = 70 + row * 400;
    ctx.fillStyle = "#165a62";
    ctx.fillRect(x, y, tileW, tileH);
    ctx.drawImage(canvases[id] || (() => {
      const img = document.createElement("canvas");
      img.width = canvasSize.width;
      img.height = canvasSize.height;
      return img;
    })(), x, y, tileW, tileH);
    if (id.startsWith("composite")) {
      const image = new Image();
    }
    ctx.fillStyle = "#dbeafe";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(id, x, y + tileH + 24);
  });
  outputs["contact-proof"] = contact.toDataURL("image/png");
  return outputs;
}, { sourceUrl, assets, composites, canvasSize: CANVAS });

for (const [id, url] of Object.entries(result)) {
  writeDataUrl(join(OUT_DIR, `${id}.png`), url);
}

await browser.close();
console.log(`Wrote ${Object.keys(result).length} proof images to ${OUT_DIR}`);
