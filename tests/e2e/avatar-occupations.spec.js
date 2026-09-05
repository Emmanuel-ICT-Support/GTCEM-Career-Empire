import { expect, test } from "@playwright/test";

const assets = [
  ["shirt", "scrubs-top-teal", "Boy Scrubs Top Teal.png", [545, 191, 735, 379]],
  ["pants", "scrubs-pants-teal", "Boy Scrubs Pants Teal.png", [573, 347, 703, 633]],
  ["shirt", "chef-jacket-white", "Boy Chef Jacket White.png", [545, 180, 735, 398]],
  ["blazer", "chef-apron-black", "Boy Chef Apron Black.png", [575, 202, 705, 494]],
  ["accessory", "tool-belt-brown", "Boy Tool Belt Brown.png", [568, 343, 712, 416]],
  ["accessory", "safety-goggles-clear", "Boy Safety Goggles Clear.png", [587, 110, 697, 147]]
];

test.use({ reducedMotion: "reduce" });

test("Occupation pieces load as registered transparent layers and survive saving", async ({ page }) => {
  await page.goto("/modules/avatar/");
  await page.getByRole("tab", { name: "Outfit" }).click();
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="none"]').click();

  for (const [slot, id, file, bounds] of assets) {
    await page.locator(`[data-avatar-key="${slot}"][data-avatar-value="${id}"]`).click();
    const layer = page.locator(`#avatar-render img[data-rig-layer="${file}"]`);
    await expect(layer).toBeVisible();
    const pixels = await layer.evaluate(async (img, [left, top, right, bottom]) => {
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let visible = 0, outside = 0;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (!data[(y * canvas.width + x) * 4 + 3]) continue;
          visible++;
          if (x < left || x >= right || y < top || y >= bottom) outside++;
        }
      }
      return { width: canvas.width, height: canvas.height, visible, outside,
        eyes: [616, 665].map(x => ctx.getImageData(x, 128, 1, 1).data[3]) };
    }, bounds);
    expect(pixels.width).toBe(1280);
    expect(pixels.height).toBe(720);
    expect(pixels.visible).toBeGreaterThan(300);
    expect(pixels.outside).toBe(0);
    if (id === "safety-goggles-clear") expect(pixels.eyes.every(alpha => alpha < 30)).toBe(true);
  }

  await page.getByRole("button", { name: "Save Avatar" }).click();
  await page.reload();
  await page.getByRole("tab", { name: "Outfit" }).click();
  for (const [slot, id] of [["shirt", "chef-jacket-white"], ["pants", "scrubs-pants-teal"], ["blazer", "chef-apron-black"], ["accessory", "safety-goggles-clear"]]) {
    await expect(page.locator(`[data-avatar-key="${slot}"][data-avatar-value="${id}"]`)).toHaveClass(/is-selected/);
  }
  await expect(page.locator('#avatar-render img[data-rig-layer="Boy Tool Belt Brown.png"]')).toHaveCount(0);
  await page.locator('[data-avatar-key="accessory"][data-avatar-value="none"]').click();
  await expect(page.locator('#avatar-render img[data-rig-layer="Boy Safety Goggles Clear.png"]')).toHaveCount(0);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`Occupation wardrobe fits at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/modules/avatar/");
    await page.getByRole("tab", { name: "Outfit" }).click();
    for (const [slot, id] of [["shirt", "chef-jacket-white"], ["blazer", "chef-apron-black"], ["accessory", "safety-goggles-clear"]]) {
      await page.locator(`[data-avatar-key="${slot}"][data-avatar-value="${id}"]`).click();
    }
    await page.locator("#avatar-render img").evaluateAll(images => Promise.all(images.map(img => img.decode())));
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      clippedLabels: [...document.querySelectorAll('#avatar-panel-outfit button')].filter(el => el.scrollWidth > el.clientWidth + 1).length
    }));
    expect(layout.overflow).toBe(false);
    expect(layout.clippedLabels).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`occupation-${viewport.width}.png`), fullPage: true });
  });
}
