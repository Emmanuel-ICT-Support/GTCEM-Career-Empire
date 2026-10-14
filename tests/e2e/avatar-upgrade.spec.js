import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });
const choice = (page, key, value) => page.locator(`[data-avatar-key="${key}"][data-avatar-value="${value}"]`);
const layer = (page, file) => page.locator(`#avatar-render img[data-rig-layer="${file}"]`);
const decode = page => page.locator("#avatar-render img").evaluateAll(images => Promise.all(images.map(img => img.decode())));
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem("career-empire-avatar-v1")).latest);

test("Complete shirt, jumper and blazer can each be removed independently", async ({ page }) => {
  await page.goto("/modules/avatar/");
  await page.getByRole("tab", { name: "Outfit" }).click();
  await choice(page, "blazer", "none").click();
  await expect(layer(page, "Boy Full Jumper Teal.png")).toBeVisible();
  await choice(page, "jumper", "none").click();
  expect(await layer(page, "Boy Full Shirt Teal Tie.png").evaluate(img => getComputedStyle(img).clipPath)).toBe("none");
  await expect(layer(page, "Boy Full Shirt Teal Tie.png")).toBeVisible();
  await expect(layer(page, "Boy Full Jumper Teal.png")).toHaveCount(0);
  const alpha = await layer(page, "Boy Full Shirt Teal Tie.png").evaluate(async img => {
    await img.decode();
    const c = document.createElement("canvas"); c.width = 1280; c.height = 720;
    const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
    return [[610, 300], [640, 360], [560, 350], [720, 350]].map(([x,y]) => ctx.getImageData(x,y,1,1).data[3]);
  });
  expect(alpha.every(a => a > 200)).toBe(true);
  await choice(page, "jumper", "ecc-jumper-teal").click();
  expect(await layer(page, "Boy Full Shirt Teal Tie.png").evaluate(img => getComputedStyle(img).clipPath)).toContain("polygon");
  await choice(page, "shirt", "none").click();
  await expect(layer(page, "Boy Full Jumper Teal.png")).toBeVisible();
  await expect(layer(page, "Boy Full Shirt Teal Tie.png")).toHaveCount(0);
  await choice(page, "shirt", "chef-jacket-white").click();
  await expect(layer(page, "Boy Full Jumper Teal.png")).toHaveCount(0);
  await expect(choice(page, "jumper", "ecc-jumper-teal")).toBeDisabled();
});

test("Girl uses her own neutral, fitted wardrobe and saved layer recipe", async ({ page }) => {
  await page.goto("/modules/avatar/");
  await choice(page, "characterBase", "ecc-girl-rig-source").click();
  await expect(layer(page, "Neutral Girl Take 2.png")).toBeVisible();
  await expect(choice(page, "eyeColour", "brown")).toBeEnabled();
  await expect(choice(page, "eyeColour", "blue")).toBeDisabled();
  await page.getByRole("tab", { name: "Hair" }).click();
  await choice(page, "hairStyle", "ponytail").click();
  await expect(choice(page, "hairColour", "teal")).toBeDisabled();
  await expect(layer(page, "Girl Hair Ponytail Brown.png")).toBeVisible();
  await page.getByRole("tab", { name: "Outfit" }).click();
  await choice(page, "accessory", "safety-goggles-clear").click();
  await decode(page);
  const rendered = await page.locator("#avatar-render img[data-rig-layer]").evaluateAll(images => images.map(img => img.dataset.rigLayer));
  expect(rendered.every(file => file.startsWith("Girl ") || file === "Neutral Girl Take 2.png")).toBe(true);
  await page.getByRole("button", { name: "Save Avatar" }).click();
  const profile = await saved(page);
  expect(profile.avatarSpec.slots.assetRig).toBe("ecc-girl-take-2-layered");
  expect(profile.avatarSpec.slots.jumper).toBe("ecc-jumper-teal");
  expect(profile.avatarSpec.sources.skinBaseVariant).toContain("Neutral Girl Take 2.png");
  expect(profile.avatarSpec.technicalSpec.layerOrder).toEqual(rendered);
  expect(profile.avatarSpec.technicalSpec.layerClips.body).toContain("polygon");
  expect(profile.avatarSpec.technicalSpec.layerClips.shirt).toContain("polygon");
  await page.reload();
  await expect(layer(page, "Girl Hair Ponytail Brown.png")).toBeVisible();
  await expect(layer(page, "Girl Skirt Tartan.png")).toBeVisible();
  await choice(page, "characterBase", "ecc-boy-rig-source").click();
  await expect(layer(page, "Neutral Girl Take 2.png")).toHaveCount(0);
  await expect(layer(page, "Boy Hair.png")).toBeVisible();
  await expect(choice(page, "eyeColour", "blue")).toHaveClass(/is-selected/);
  await page.getByRole("tab", { name: "Outfit" }).click();
  await expect(choice(page, "pants", "tartan-skirt")).toHaveCount(0);
});

test("Every active girl part decodes on the registered canvas", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/modules/avatar/");
  await choice(page, "characterBase", "ecc-girl-rig-source").click();
  for (const [tab, key] of [["Hair", "hairStyle"], ["Hair", "hairColour"], ["Outfit", "shirt"], ["Outfit", "jumper"], ["Outfit", "pants"], ["Outfit", "shoes"], ["Outfit", "blazer"], ["Outfit", "accessory"]]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    if (key === "hairColour") await choice(page, "hairStyle", "waves").click();
    if (key === "jumper") await choice(page, "shirt", "ecc-shirt-tie").click();
    const ids = await page.locator(`[data-avatar-key="${key}"]:not(:disabled)`).evaluateAll(buttons => buttons.map(button => button.dataset.avatarValue));
    for (const id of ids) {
      await choice(page, key, id).click();
      await decode(page);
      const sizes = await page.locator("#avatar-render img[data-rig-layer]").evaluateAll(images => images.map(img => [img.naturalWidth, img.naturalHeight]));
      expect(sizes.every(([w,h]) => w === 1280 && h === 720)).toBe(true);
    }
  }
});

for (const blazer of ["none", "ecc-navy-blazer", "chef-apron-black"]) {
  test(`Old saved ${blazer} outfit migrates without an unwanted jumper`, async ({ page }) => {
    await page.addInitScript(outer => {
      localStorage.setItem("career-empire-avatar-v1", JSON.stringify({latest: {
        characterBase: "ecc-boy-rig-source", blazer: outer,
        shirt: outer === "chef-apron-black" ? "chef-jacket-white" : "ecc-shirt-tie"
      }}));
    }, blazer);
    await page.goto("/modules/avatar/");
    await expect(layer(page, "Boy Full Jumper Teal.png")).toHaveCount(blazer === "ecc-navy-blazer" ? 1 : 0);
  });
}

test("Random outfits only select parts available for their rig", async ({ page }) => {
  await page.goto("/modules/avatar/");
  for (let i = 0; i < 8; i++) {
    await page.locator("#avatar-randomise").click();
    await decode(page);
    expect(await page.locator(".is-selected:disabled").count()).toBe(0);
    await page.getByRole("button", { name: "Save Avatar" }).click();
    const profile = await saved(page);
    const files = profile.avatarSpec.technicalSpec.layerOrder;
    if (profile.characterBase === "ecc-girl-rig-source") {
      expect(files.every(file => file.startsWith("Girl ") || file === "Neutral Girl Take 2.png")).toBe(true);
      expect(profile.eyeColour).toBe("brown");
    } else expect(files.some(file => file.includes("Girl"))).toBe(false);
  }
});

for (const viewport of [{width:1440,height:1000},{width:749,height:747},{width:390,height:844}]) {
  test(`Girl wardrobe remains visible at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/modules/avatar/");
    await choice(page, "characterBase", "ecc-girl-rig-source").click();
    await page.getByRole("tab", {name:"Hair"}).click();
    await choice(page, "hairStyle", "ponytail").click();
    await page.getByRole("tab", {name:"Outfit"}).click();
    await decode(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    expect(await page.locator("#avatar-panel-outfit button").evaluateAll(buttons => buttons.filter(b => b.scrollWidth > b.clientWidth + 1).length)).toBe(0);
    await page.locator("#avatar-render").scrollIntoViewIfNeeded();
    await page.screenshot({path:testInfo.outputPath(`girl-uniform-${viewport.width}.png`)});
    await choice(page, "shirt", "chef-jacket-white").click();
    await choice(page, "pants", "scrubs-pants-teal").click();
    await choice(page, "blazer", "chef-apron-black").click();
    await decode(page);
    await page.locator("#avatar-render").scrollIntoViewIfNeeded();
    await page.screenshot({path:testInfo.outputPath(`girl-chef-${viewport.width}.png`)});
  });
}
