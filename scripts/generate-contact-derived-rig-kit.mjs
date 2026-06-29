import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const CANVAS = { width: 1024, height: 1536 };
const SOURCE_DIR = "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets";
const OUT_DIR = "Assets/Images and Animations/Avatar Studio/Contact Derived Rig Kit";

const rigs = [
  {
    id: "ecc-boy-contact-rig-v1",
    label: "ECC boy contact-derived rig v1",
    notes: [
      "Uses the actual contact-sheet boy artwork as the visual source.",
      "Includes both the full uniform reference and the supplied neutral body guide.",
      "Use the uniform reference for clothing alignment; use the body guide only as a base-body placeholder."
    ],
    outputs: [
      {
        id: "01-character-reference",
        label: "uniform reference",
        sourceFile: "Boy P2.png",
        crop: { x: 542, y: 57, width: 171, height: 559 },
        targetHeight: 1230,
        targetY: 140,
        underlays: [
          {
            type: "ellipse",
            fill: "#d9955f",
            x: 494,
            y: 348,
            width: 48,
            height: 120
          },
          {
            type: "polygon",
            fill: "#f8f6ef",
            points: [
              [510, 410],
              [552, 418],
              [528, 520],
              [500, 512]
            ]
          }
        ]
      },
      {
        id: "02-base-body-guide",
        label: "base body guide",
        sourceFile: "Boy P4.png",
        crop: { x: 570, y: 67, width: 177, height: 591 },
        targetHeight: 1230,
        targetY: 140,
        showInPreview: false
      }
    ],
    anchors: {
      head_centre: [0.5, 0.145],
      left_eye_centre: [0.425, 0.172],
      right_eye_centre: [0.575, 0.172],
      nose_bridge: [0.5, 0.195],
      mouth_centre: [0.5, 0.235],
      neck_centre: [0.5, 0.315],
      left_shoulder: [0.27, 0.365],
      right_shoulder: [0.73, 0.365],
      left_wrist: [0.225, 0.575],
      right_wrist: [0.775, 0.575],
      waist_centre: [0.5, 0.565],
      left_hip: [0.39, 0.61],
      right_hip: [0.61, 0.61],
      left_knee: [0.43, 0.78],
      right_knee: [0.57, 0.78],
      left_foot: [0.39, 0.965],
      right_foot: [0.61, 0.965]
    },
    neckGuide: {
      top_left: [466, 410],
      top_right: [566, 410],
      bottom_left: [454, 522],
      bottom_right: [570, 522],
      centre: [512, 466],
      note: "Estimated from the neutral boy body guide; use this as the target opening when scaling replacement heads."
    }
  },
  {
    id: "ecc-girl-contact-rig-v1",
    label: "ECC girl contact-derived rig v1",
    notes: [
      "Uses the actual contact-sheet girl artwork as the visual source.",
      "The supplied sheets do not include a clean neutral full-body girl base; this is a full uniform reference rig.",
      "A neutral girl body/base layer is still required before true clothing swaps will be clean."
    ],
    outputs: [
      {
        id: "01-character-reference",
        label: "uniform reference",
        sourceFile: "Girl P1.png",
        crop: { x: 30, y: 43, width: 182, height: 578 },
        targetHeight: 1230,
        targetY: 140
      }
    ],
    anchors: {
      head_centre: [0.5, 0.145],
      left_eye_centre: [0.42, 0.158],
      right_eye_centre: [0.58, 0.158],
      nose_bridge: [0.5, 0.182],
      mouth_centre: [0.5, 0.225],
      neck_centre: [0.5, 0.305],
      left_shoulder: [0.265, 0.355],
      right_shoulder: [0.735, 0.355],
      left_wrist: [0.19, 0.595],
      right_wrist: [0.81, 0.595],
      waist_centre: [0.5, 0.535],
      left_hip: [0.38, 0.61],
      right_hip: [0.62, 0.61],
      left_knee: [0.43, 0.785],
      right_knee: [0.57, 0.785],
      left_foot: [0.39, 0.96],
      right_foot: [0.61, 0.96]
    },
    neckGuide: {
      top_left: [467, 398],
      top_right: [557, 398],
      bottom_left: [452, 515],
      bottom_right: [572, 515],
      centre: [512, 456],
      note: "Estimated from the uniform girl reference; replace with a neutral girl body measurement once that base exists."
    }
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

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function anchorMap(placement, relativeAnchors) {
  const anchors = {};
  for (const [name, [rx, ry]] of Object.entries(relativeAnchors)) {
    anchors[name] = [
      Math.round(placement.x + placement.width * rx),
      Math.round(placement.y + placement.height * ry)
    ];
  }
  return anchors;
}

function normalizeNeckGuide(neckGuide) {
  if (!neckGuide) return null;
  const topY = Math.round((neckGuide.top_left[1] + neckGuide.top_right[1]) / 2);
  const bottomY = Math.round((neckGuide.bottom_left[1] + neckGuide.bottom_right[1]) / 2);
  return {
    ...neckGuide,
    top_width: Math.round(Math.abs(neckGuide.top_right[0] - neckGuide.top_left[0])),
    bottom_width: Math.round(Math.abs(neckGuide.bottom_right[0] - neckGuide.bottom_left[0])),
    height: Math.round(Math.abs(bottomY - topY))
  };
}

function writeRigSvg(rig, rigDir, primary, anchors) {
  const neckGuide = normalizeNeckGuide(rig.neckGuide);
  const dots = Object.entries(anchors)
    .map(([name, [x, y]]) => {
      const isEye = name.includes("eye");
      const fill = isEye ? "#36c5f0" : "#f5c542";
      return [
        `<circle cx="${x}" cy="${y}" r="${isEye ? 7 : 5}" fill="${fill}" stroke="#102033" stroke-width="3"/>`,
        `<text x="${x + 10}" y="${y - 8}" font-family="Arial, sans-serif" font-size="18" fill="#102033">${xmlEscape(name)}</text>`
      ].join("\n");
    })
    .join("\n");

  const guideLines = [
    ["left_eye_centre", "right_eye_centre"],
    ["left_shoulder", "right_shoulder"],
    ["left_hip", "right_hip"],
    ["left_foot", "right_foot"]
  ]
    .filter(([a, b]) => anchors[a] && anchors[b])
    .map(([a, b]) => {
      const [x1, y1] = anchors[a];
      const [x2, y2] = anchors[b];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#00a7b5" stroke-width="2" stroke-dasharray="8 8"/>`;
    })
    .join("\n");

  const neckGuideMarkup = neckGuide
    ? (() => {
        const topY = Math.round((neckGuide.top_left[1] + neckGuide.top_right[1]) / 2);
        const bottomY = Math.round((neckGuide.bottom_left[1] + neckGuide.bottom_right[1]) / 2);
        const centreX = neckGuide.centre[0];
        const points = [
          neckGuide.top_left,
          neckGuide.top_right,
          neckGuide.bottom_right,
          neckGuide.bottom_left
        ]
          .map(([x, y]) => `${x},${y}`)
          .join(" ");
        return `
    <g id="neck-width-height-guide">
      <polygon points="${points}" fill="#ff4d6d" fill-opacity="0.15" stroke="#ff2d55" stroke-width="4"/>
      <line x1="${neckGuide.top_left[0]}" y1="${topY}" x2="${neckGuide.top_right[0]}" y2="${topY}" stroke="#ff2d55" stroke-width="5"/>
      <line x1="${neckGuide.bottom_left[0]}" y1="${bottomY}" x2="${neckGuide.bottom_right[0]}" y2="${bottomY}" stroke="#ff2d55" stroke-width="5"/>
      <line x1="${centreX}" y1="${topY}" x2="${centreX}" y2="${bottomY}" stroke="#ff2d55" stroke-width="3" stroke-dasharray="8 8"/>
      <circle cx="${neckGuide.centre[0]}" cy="${neckGuide.centre[1]}" r="7" fill="#ff2d55" stroke="#ffffff" stroke-width="3"/>
      <text x="${neckGuide.top_right[0] + 12}" y="${topY + 6}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ff2d55">neck top ${neckGuide.top_width}px</text>
      <text x="${neckGuide.bottom_right[0] + 12}" y="${bottomY + 6}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ff2d55">neck bottom ${neckGuide.bottom_width}px</text>
      <text x="${centreX + 12}" y="${Math.round((topY + bottomY) / 2)}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ff2d55">height ${neckGuide.height}px</text>
    </g>`;
      })()
    : "";

  const notes = rig.notes
    .map((note, index) => `<text x="40" y="${CANVAS.height - 120 + index * 24}" font-family="Arial, sans-serif" font-size="18" fill="#102033">${xmlEscape(note)}</text>`)
    .join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}">
  <rect width="${CANVAS.width}" height="${CANVAS.height}" fill="#ffffff"/>
  <g id="character-reference">
    <image href="${primary.id}.png" x="0" y="0" width="${CANVAS.width}" height="${CANVAS.height}"/>
  </g>
  <g id="rig-guides">
    <rect x="${primary.placement.x.toFixed(1)}" y="${primary.placement.y.toFixed(1)}" width="${primary.placement.width.toFixed(1)}" height="${primary.placement.height.toFixed(1)}" fill="none" stroke="#00a7b5" stroke-width="3" stroke-dasharray="10 8"/>
    ${neckGuideMarkup}
    ${guideLines}
    ${dots}
  </g>
  <g id="notes">
    <text x="40" y="56" font-family="Arial, sans-serif" font-weight="700" font-size="28" fill="#102033">${xmlEscape(rig.label)}</text>
    <text x="40" y="88" font-family="Arial, sans-serif" font-size="18" fill="#526174">Full canvas: ${CANVAS.width} x ${CANVAS.height}. Open this SVG in Illustrator; keep exported layers on the same canvas.</text>
    ${notes}
  </g>
</svg>
`;
  const svgPath = join(rigDir, `${rig.id}-master-with-guides.svg`);
  writeFileSync(svgPath, svg);
}

const browser = await chromium.launch();
const page = await browser.newPage();

const generation = await page.evaluate(
  async ({ rigs, sourceDir, canvasSize }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
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
          const offset = start * 4;
          if (data[offset + 3] === 0) {
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
              const nextOffset = next * 4;
              if (data[nextOffset + 3] === 0) {
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

    function drawChecker(ctx, left, top, width, height, size = 32) {
      for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
          ctx.fillStyle = (x / size + y / size) % 2 ? "#dce4ea" : "#f7fafc";
          ctx.fillRect(left + x, top + y, size, size);
        }
      }
    }

    function drawNeckGuide(ctx, neckGuide, scaleX, scaleY, offsetX, offsetY) {
      if (!neckGuide) return;
      const point = ([x, y]) => [offsetX + x * scaleX, offsetY + y * scaleY];
      const topLeft = point(neckGuide.top_left);
      const topRight = point(neckGuide.top_right);
      const bottomRight = point(neckGuide.bottom_right);
      const bottomLeft = point(neckGuide.bottom_left);
      const centre = point(neckGuide.centre);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(topLeft[0], topLeft[1]);
      ctx.lineTo(topRight[0], topRight[1]);
      ctx.lineTo(bottomRight[0], bottomRight[1]);
      ctx.lineTo(bottomLeft[0], bottomLeft[1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 77, 109, 0.18)";
      ctx.strokeStyle = "#ff2d55";
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(centre[0], topLeft[1]);
      ctx.lineTo(centre[0], bottomLeft[1]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.fillStyle = "#ff2d55";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.arc(centre[0], centre[1], 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function drawGuidePreview(ctx, placement, anchors, neckGuide, scaleX, scaleY, offsetX, offsetY) {
      ctx.strokeStyle = "#1ab7c6";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.strokeRect(
        offsetX + placement.x * scaleX,
        offsetY + placement.y * scaleY,
        placement.width * scaleX,
        placement.height * scaleY
      );
      ctx.setLineDash([]);
      drawNeckGuide(ctx, neckGuide, scaleX, scaleY, offsetX, offsetY);
      for (const [name, [x, y]] of Object.entries(anchors)) {
        const dx = offsetX + x * scaleX;
        const dy = offsetY + y * scaleY;
        ctx.beginPath();
        ctx.fillStyle = name.includes("eye") ? "#36c5f0" : "#f5c542";
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2;
        ctx.arc(dx, dy, name.includes("eye") ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    function drawUnderlayRepairs(ctx, repairs = []) {
      for (const repair of repairs) {
        ctx.fillStyle = repair.fill;
        if (repair.type === "ellipse") {
          ctx.beginPath();
          ctx.ellipse(
            repair.x + repair.width / 2,
            repair.y + repair.height / 2,
            repair.width / 2,
            repair.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        if (repair.type === "polygon") {
          ctx.beginPath();
          repair.points.forEach(([x, y], index) => {
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    const fileCache = new Map();
    const result = {};

    for (const rig of rigs) {
      const rigOutputs = [];
      for (const output of rig.outputs) {
        if (!fileCache.has(output.sourceFile)) {
          fileCache.set(output.sourceFile, await loadImage(sourceDir[output.sourceFile]));
        }
        const sourceImage = fileCache.get(output.sourceFile);
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = output.crop.width;
        cropCanvas.height = output.crop.height;
        const cropCtx = cropCanvas.getContext("2d");
        cropCtx.drawImage(
          sourceImage,
          output.crop.x,
          output.crop.y,
          output.crop.width,
          output.crop.height,
          0,
          0,
          output.crop.width,
          output.crop.height
        );
        const cropData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
        cropCtx.putImageData(keepLargestAlphaComponent(removeConnectedBackground(cropData)), 0, 0);

        const scale = output.targetHeight / output.crop.height;
        const placement = {
          x: Math.round((canvasSize.width - output.crop.width * scale) / 2),
          y: output.targetY,
          width: Math.round(output.crop.width * scale),
          height: output.targetHeight
        };

        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = canvasSize.width;
        outputCanvas.height = canvasSize.height;
        const outputCtx = outputCanvas.getContext("2d");
        outputCtx.imageSmoothingEnabled = true;
        outputCtx.imageSmoothingQuality = "high";
        drawUnderlayRepairs(outputCtx, output.underlays);
        outputCtx.drawImage(
          cropCanvas,
          placement.x,
          placement.y,
          placement.width,
          placement.height
        );

        rigOutputs.push({
          ...output,
          placement,
          png: outputCanvas.toDataURL("image/png")
        });
      }
      result[rig.id] = rigOutputs;
    }

    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = 1500;
    previewCanvas.height = 900;
    const previewCtx = previewCanvas.getContext("2d");
    previewCtx.fillStyle = "#0b1524";
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.fillStyle = "#f8fafc";
    previewCtx.font = "bold 30px Arial, sans-serif";
    previewCtx.fillText("Contact-derived ECC rig kit", 38, 54);
    previewCtx.font = "18px Arial, sans-serif";
    previewCtx.fillStyle = "#bac8d8";
    previewCtx.fillText("Transparent PNG rigs generated from the original contact-sheet character art. Guides are anchor estimates for Illustrator cleanup.", 38, 84);

    let tileIndex = 0;
    for (const rig of rigs) {
      const outputs = result[rig.id];
      for (const output of outputs) {
        if (output.showInPreview === false) continue;
        const img = await loadImage(output.png);
        const x = 38 + tileIndex * 360;
        const y = 130;
        const w = 300;
        const h = 450;
        previewCtx.fillStyle = "#122236";
        previewCtx.fillRect(x - 10, y - 10, w + 20, h + 80);
        previewCtx.save();
        previewCtx.beginPath();
        previewCtx.rect(x, y, w, h);
        previewCtx.clip();
        drawChecker(previewCtx, x, y, w, h, 18);
        previewCtx.drawImage(img, x, y, w, h);
        previewCtx.restore();
        previewCtx.fillStyle = "#f8fafc";
        previewCtx.font = "bold 17px Arial, sans-serif";
        previewCtx.fillText(rig.id, x, y + h + 28);
        previewCtx.font = "15px Arial, sans-serif";
        previewCtx.fillStyle = "#cbd5e1";
        previewCtx.fillText(output.label, x, y + h + 52);
        tileIndex += 1;
      }
    }

    const guidePreviewCanvas = document.createElement("canvas");
    guidePreviewCanvas.width = 1500;
    guidePreviewCanvas.height = 760;
    const guideCtx = guidePreviewCanvas.getContext("2d");
    guideCtx.fillStyle = "#edf4f7";
    guideCtx.fillRect(0, 0, guidePreviewCanvas.width, guidePreviewCanvas.height);
    guideCtx.fillStyle = "#102033";
    guideCtx.font = "bold 26px Arial, sans-serif";
    guideCtx.fillText("Master rig guide previews", 38, 48);

    let guideIndex = 0;
    for (const rig of rigs) {
      const primary = result[rig.id][0];
      const img = await loadImage(primary.png);
      const x = 60 + guideIndex * 700;
      const y = 82;
      const w = 420;
      const h = 630;
      const anchors = {};
      for (const [name, [rx, ry]] of Object.entries(rig.anchors)) {
        anchors[name] = [
          Math.round(primary.placement.x + primary.placement.width * rx),
          Math.round(primary.placement.y + primary.placement.height * ry)
        ];
      }
      guideCtx.fillStyle = "#ffffff";
      guideCtx.fillRect(x - 18, y - 18, w + 36, h + 36);
      guideCtx.drawImage(img, x, y, w, h);
      drawGuidePreview(guideCtx, primary.placement, anchors, rig.neckGuide, w / canvasSize.width, h / canvasSize.height, x, y);
      guideCtx.fillStyle = "#102033";
      guideCtx.font = "bold 20px Arial, sans-serif";
      guideCtx.fillText(rig.id, x, y + h + 32);
      guideIndex += 1;
    }

    return {
      rigs: result,
      preview: previewCanvas.toDataURL("image/png"),
      guidePreview: guidePreviewCanvas.toDataURL("image/png")
    };
  },
  {
    rigs,
    sourceDir: Object.fromEntries(
      ["Boy P1.png", "Boy P2.png", "Boy P3.png", "Boy P4.png", "Girl P1.png", "Girl P2.png", "Girl P3.png", "Girl P4.png"].map((file) => [
        file,
        dataUrl(join(SOURCE_DIR, file))
      ])
    ),
    canvasSize: CANVAS
  }
);

for (const rig of rigs) {
  const rigDir = join(OUT_DIR, rig.id);
  mkdirSync(rigDir, { recursive: true });
  const outputs = generation.rigs[rig.id];
  const primary = outputs[0];
  const anchors = anchorMap(primary.placement, rig.anchors);
  const neckGuide = normalizeNeckGuide(rig.neckGuide);

  for (const output of outputs) {
    writeDataUrl(join(rigDir, `${output.id}.png`), output.png);
  }

  writeFileSync(
    join(rigDir, "anchors.json"),
    `${JSON.stringify(
      {
        id: rig.id,
        canvas: [CANVAS.width, CANVAS.height],
        source: "Contact-derived from the supplied Avatar Studio contact sheets.",
        primary_layer: `${primary.id}.png`,
        primary_placement: primary.placement,
        anchors,
        neck_guide: neckGuide,
        notes: rig.notes
      },
      null,
      2
    )}\n`
  );
  writeRigSvg(rig, rigDir, primary, anchors);
}

writeDataUrl(join(OUT_DIR, "contact-derived-rig-preview.png"), generation.preview);
writeDataUrl(join(OUT_DIR, "contact-derived-rig-guide-preview.png"), generation.guidePreview);

writeFileSync(
  join(OUT_DIR, "README.md"),
  `# Contact Derived Rig Kit

This is a proof kit generated directly from the supplied ECC avatar contact sheets. It preserves the original raster character style rather than redrawing the avatars as simplified vectors.

Files:

- \`ecc-boy-contact-rig-v1/01-character-reference.png\`: full uniform boy reference on a 1024 x 1536 transparent canvas.
- \`ecc-boy-contact-rig-v1/02-base-body-guide.png\`: supplied boy body guide on the same canvas.
- \`ecc-girl-contact-rig-v1/01-character-reference.png\`: full uniform girl reference on a 1024 x 1536 transparent canvas.
- \`*/anchors.json\`: estimated rig anchor coordinates.
- \`*-master-with-guides.svg\`: Illustrator-openable master file with the PNG rig and guide points.
- Red neck guide: measured/estimated top neck width, bottom neck width, and neck height for head-swap alignment.

Important limitation: the girl contact sheets do not include a clean neutral full-body base layer. To build a true modular clothing system, create or commission a neutral girl body/base layer that matches \`ecc-girl-contact-rig-v1/01-character-reference.png\`.

The next production step is to draw or extract each clothing/hair/accessory layer against these master canvases, not to move pieces by eye inside the app.
`
);

await browser.close();

console.log(`Wrote ${OUT_DIR}`);
