import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const sheets = [
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Boy P1.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Boy P2.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Boy P3.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Boy P4.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Girl P1.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Girl P2.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Girl P3.png",
  "Assets/Images and Animations/Avatar Studio/Avatar Contact sheets/Girl P4.png"
];

function dataUrl(path) {
  return `data:image/png;base64,${readFileSync(path).toString("base64")}`;
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const sheet of sheets) {
  const components = await page.evaluate(async ({ sourceUrl }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    }

    function isBackground(r, g, b) {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return (max - min <= 12 && max >= 212) || (r >= 236 && g >= 236 && b >= 236);
    }

    const image = await loadImage(sourceUrl);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
    const visited = new Uint8Array(width * height);
    const output = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const start = y * width + x;
        if (visited[start]) continue;
        const offset = start * 4;
        if (isBackground(data[offset], data[offset + 1], data[offset + 2])) {
          visited[start] = 1;
          continue;
        }
        const queue = [start];
        visited[start] = 1;
        const bounds = { minX: x, minY: y, maxX: x, maxY: y };
        let pixels = 0;
        let skinPixels = 0;
        let darkPixels = 0;
        while (queue.length) {
          const index = queue.pop();
          const px = index % width;
          const py = Math.floor(index / width);
          const idx = index * 4;
          pixels += 1;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          if (r > 140 && g > 80 && b > 45 && r > g && g > b) skinPixels += 1;
          if (r < 90 && g < 90 && b < 100) darkPixels += 1;
          bounds.minX = Math.min(bounds.minX, px);
          bounds.minY = Math.min(bounds.minY, py);
          bounds.maxX = Math.max(bounds.maxX, px);
          bounds.maxY = Math.max(bounds.maxY, py);
          for (const [nx, ny] of [[px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]]) {
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            const next = ny * width + nx;
            if (visited[next]) continue;
            const nextOffset = next * 4;
            if (isBackground(data[nextOffset], data[nextOffset + 1], data[nextOffset + 2])) {
              visited[next] = 1;
              continue;
            }
            visited[next] = 1;
            queue.push(next);
          }
        }
        if (pixels < 120) continue;
        output.push({
          x: bounds.minX,
          y: bounds.minY,
          width: bounds.maxX - bounds.minX + 1,
          height: bounds.maxY - bounds.minY + 1,
          pixels,
          skinRatio: Number((skinPixels / pixels).toFixed(2)),
          darkRatio: Number((darkPixels / pixels).toFixed(2))
        });
      }
    }
    return output.sort((a, b) => b.pixels - a.pixels).slice(0, 80);
  }, { sourceUrl: dataUrl(sheet) });

  console.log(`\n${sheet}`);
  for (const component of components) {
    console.log(JSON.stringify(component));
  }
}

await browser.close();
