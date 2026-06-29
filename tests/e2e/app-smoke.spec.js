import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", title: /Career Empire/, heading: /Year 12 Careers just levelled up/i },
  { path: "/student/", title: /Career Empire Student Pathway/, heading: /Your Career Empire starts here/i },
  { path: "/teacher/", title: /Career Empire Teacher Pathway/, heading: /Teacher/i },
  { path: "/modules/est-prep/", title: /EST Prep/, heading: /Enter the EST Lab/i },
  { path: "/modules/avatar/", title: /Avatar Studio/, heading: /Build your future self/i }
];

for (const pageSpec of pages) {
  test(`${pageSpec.path} loads its primary screen`, async ({ page }) => {
    await page.goto(pageSpec.path, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(pageSpec.title);
    await expect(page.getByRole("heading", { name: pageSpec.heading }).first()).toBeVisible();
  });
}

test("Avatar Studio saves a future-self profile locally", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  await page.getByRole("tab", { name: "Future" }).click();
  await page.getByLabel("Occupation I am curious about").fill("Graphic designer");
  await page.getByLabel("Training or skills I may need").fill("Portfolio practice and design software");
  await page.getByLabel("A strength I want this avatar to show").fill("Creative problem solving");
  await page.getByRole("button", { name: "Save Avatar" }).click();

  await expect(page.getByText("Saved 100% avatar profile.")).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("career-empire-avatar-v1")));
  expect(saved.latest.occupation).toBe("Graphic designer");
  expect(saved.latest.completion).toBe(100);
  expect(saved.latest.avatarSpec.slots.uniform).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.shirt).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.pants).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.shoes).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.blazer).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.hairStyle).toBeTruthy();
  expect(saved.latest.avatarSpec.slots.eyeColour).toBeTruthy();
  expect(saved.latest.avatarSpec.technicalSpec.compatibleBodyRig).toMatch(/^ecc-(boy|girl)-standard$/);
  expect(saved.latest.avatarSpec.technicalSpec.anchors.leftEye).toBeTruthy();
});

test("Avatar Studio defaults to the Take 2 ECC rig base", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#avatar-render .avatar-production-rig")).toBeVisible();
  await expect(page.locator('[data-avatar-value="custom-trousers"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="custom-skirt"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="ecc-boy-rig-source"]')).toBeVisible();
  await expect(page.locator('[data-avatar-value="ecc-girl-rig-source"]')).toBeDisabled();
});

test("Avatar Studio ECC rig uses the approved Take 2 layer stack", async ({ page }) => {
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  const getPreviewHtml = () => page.locator("#avatar-render").evaluate(element => element.innerHTML);

  await page.locator('[data-avatar-value="ecc-boy-rig-source"]').click();
  await expect(page.locator("#avatar-render .avatar-production-rig")).toBeVisible();
  const starterPreview = await getPreviewHtml();
  expect(starterPreview).toContain('data-rig-layer="Neutral Boy Smooth Transparent background.png"');
  expect(starterPreview).toContain('data-rig-layer="Boy Pants.png"');
  expect(starterPreview).toContain('data-rig-layer="Boy Shirt and tie.png"');
  expect(starterPreview).toContain('data-rig-layer="Shoes Corrected.png"');
  expect(starterPreview).toContain('data-rig-layer="Boy Blazer.png"');
  expect(starterPreview).toContain('data-rig-layer="Boy Hair.png"');
  expect(starterPreview).toContain('--avatar-rig-aspect-ratio: 1280 / 720');
  expect(starterPreview).not.toContain('data-rig-feature="earrings"');
  expect(starterPreview).not.toContain('data-rig-feature="freckles"');

  await expect(page.locator('[data-avatar-key="skinTone"][data-avatar-value="deep"]')).toBeDisabled();

  await expect(page.locator('[data-avatar-key="eyeColour"][data-avatar-value="blue"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="eyeColour"][data-avatar-value="green"]')).toBeDisabled();
  expect(await getPreviewHtml()).not.toContain('data-rig-feature="eye-colour"');

  await page.getByRole("tab", { name: "Hair" }).click();
  await expect(page.locator('[data-avatar-key="hairStyle"][data-avatar-value="none"]')).toBeEnabled();
  await expect(page.locator('[data-avatar-value="crop"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-value="curls"]')).toBeDisabled();
  await page.locator('[data-avatar-key="hairStyle"][data-avatar-value="none"]').click();
  const noHairPreview = await getPreviewHtml();
  expect(noHairPreview).not.toContain('data-rig-layer="Boy Hair.png"');
  expect(noHairPreview).not.toContain('data-rig-layer="Black hair.png"');
  await page.locator('[data-avatar-key="hairStyle"][data-avatar-value="waves"]').click();
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="brown"]')).toBeVisible();
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="black"]')).toBeEnabled();
  await page.locator('[data-avatar-key="hairColour"][data-avatar-value="black"]').click();
  const blackHairPreview = await getPreviewHtml();
  expect(blackHairPreview).toContain('data-rig-layer="Black hair.png"');
  expect(blackHairPreview).not.toContain('data-rig-layer="Boy Hair.png"');
  await page.locator('[data-avatar-key="hairColour"][data-avatar-value="brown"]').click();
  expect(await getPreviewHtml()).toContain('data-rig-layer="Boy Hair.png"');
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="auburn"]')).toBeEnabled();
  await page.locator('[data-avatar-key="hairColour"][data-avatar-value="auburn"]').click();
  expect(await getPreviewHtml()).toContain('data-rig-layer="Boy Hair Auburn.png"');
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="blonde"]')).toBeEnabled();
  await page.locator('[data-avatar-key="hairColour"][data-avatar-value="blonde"]').click();
  expect(await getPreviewHtml()).toContain('data-rig-layer="Boy Hair Blonde.png"');
  await expect(page.locator('[data-avatar-key="hairColour"][data-avatar-value="silver"]')).toBeDisabled();
  await page.locator('[data-avatar-key="hairColour"][data-avatar-value="brown"]').click();

  await page.getByRole("tab", { name: "Outfit" }).click();
  await expect(page.locator('[data-avatar-key="shirt"][data-avatar-value="ecc-shirt-tie"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="pants"][data-avatar-value="ecc-navy-pants"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="shoes"][data-avatar-value="black-school-shoes"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="blazer"][data-avatar-value="ecc-navy-blazer"]')).toHaveClass(/is-selected/);
  await page.locator('[data-avatar-key="shoes"][data-avatar-value="brown-school-shoes"]').click();
  const brownShoesPreview = await getPreviewHtml();
  expect(brownShoesPreview).toContain('data-rig-layer="Brown Shoes.png"');
  expect(brownShoesPreview).not.toContain('data-rig-layer="Shoes Corrected.png"');
  await page.locator('[data-avatar-key="shoes"][data-avatar-value="black-school-shoes"]').click();
  expect(await getPreviewHtml()).toContain('data-rig-layer="Shoes Corrected.png"');
  await expect(page.locator('[data-avatar-key="blazer"][data-avatar-value="hivis-vest"]')).toBeEnabled();
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="hivis-vest"]').click();
  const hivisPreview = await getPreviewHtml();
  expect(hivisPreview).toContain('data-rig-layer="Boy Hi Vis Vest.png"');
  expect(hivisPreview).not.toContain('data-rig-layer="Boy Blazer.png"');
  await expect(page.locator('[data-avatar-key="blazer"][data-avatar-value="lab-coat"]')).toBeEnabled();
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="lab-coat"]').click();
  const labCoatPreview = await getPreviewHtml();
  expect(labCoatPreview).toContain('data-rig-layer="Boy Lab Coat.png"');
  expect(labCoatPreview).not.toContain('data-rig-layer="Boy Hi Vis Vest.png"');
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="ecc-navy-blazer"]').click();
  await page.locator('[data-avatar-key="shirt"][data-avatar-value="none"]').click();
  await page.locator('[data-avatar-key="pants"][data-avatar-value="none"]').click();
  await page.locator('[data-avatar-key="shoes"][data-avatar-value="none"]').click();
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="none"]').click();
  const neutralPreview = await getPreviewHtml();
  expect(neutralPreview).toContain('data-rig-layer="Neutral Boy Smooth Transparent background.png"');
  expect(neutralPreview).toContain('data-rig-layer="Boy Hair.png"');
  expect(neutralPreview).not.toContain('data-rig-layer="Boy Pants.png"');
  expect(neutralPreview).not.toContain('data-rig-layer="Boy Shirt and tie.png"');
  expect(neutralPreview).not.toContain('data-rig-layer="Shoes Corrected.png"');
  expect(neutralPreview).not.toContain('data-rig-layer="Brown Shoes.png"');
  expect(neutralPreview).not.toContain('data-rig-layer="Boy Blazer.png"');
  await page.locator('[data-avatar-key="shirt"][data-avatar-value="ecc-shirt-tie"]').click();
  await page.locator('[data-avatar-key="pants"][data-avatar-value="ecc-navy-pants"]').click();
  await page.locator('[data-avatar-key="shoes"][data-avatar-value="black-school-shoes"]').click();
  await page.locator('[data-avatar-key="blazer"][data-avatar-value="ecc-navy-blazer"]').click();
  await expect(page.locator('[data-avatar-value="ecc-boy-photoshop-blazer-poc"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="ecc-sports"]')).toHaveCount(0);
  await expect(page.locator('[data-avatar-value="earrings"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-value="badge"]')).toBeDisabled();
  await expect(page.locator('[data-avatar-value="glasses"]')).toBeDisabled();

  await page.getByRole("tab", { name: "Looks" }).click();
  await expect(page.locator('[data-avatar-value="freckled"]')).toBeDisabled();
});

test("Avatar Studio cleans up previously saved unapproved avatar choices", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("career-empire-avatar-v1", JSON.stringify({
      latest: {
        characterBase: "ecc-boy-rig-source",
        skinTone: "deep",
        faceStyle: "freckled",
        eyeColour: "green",
        hairStyle: "crop",
        hairColour: "silver",
        outfit: "ecc-sports",
        shirt: "custom-shirt",
        pants: "custom-pants",
        shoes: "custom-shoes",
        blazer: "custom-blazer",
        accessory: "earrings",
        occupation: "",
        training: "",
        strength: ""
      }
    }));
  });
  await page.goto("/modules/avatar/", { waitUntil: "domcontentloaded" });

  const previewHtml = await page.locator("#avatar-render").evaluate(element => element.innerHTML);
  expect(previewHtml).toContain('data-rig-layer="Neutral Boy Smooth Transparent background.png"');
  expect(previewHtml).toContain('data-rig-layer="Boy Pants.png"');
  expect(previewHtml).toContain('data-rig-layer="Boy Shirt and tie.png"');
  expect(previewHtml).toContain('data-rig-layer="Shoes Corrected.png"');
  expect(previewHtml).toContain('data-rig-layer="Boy Blazer.png"');
  expect(previewHtml).toContain('data-rig-layer="Boy Hair.png"');
  expect(previewHtml).not.toContain('data-rig-feature="eye-colour"');
  expect(previewHtml).not.toContain('data-rig-feature="earrings"');
  expect(previewHtml).not.toContain('data-rig-feature="freckles"');
  await expect(page.locator('[data-avatar-key="skinTone"][data-avatar-value="sand"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="eyeColour"][data-avatar-value="blue"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="hairStyle"][data-avatar-value="waves"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="shirt"][data-avatar-value="ecc-shirt-tie"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="pants"][data-avatar-value="ecc-navy-pants"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="shoes"][data-avatar-value="black-school-shoes"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="blazer"][data-avatar-value="ecc-navy-blazer"]')).toHaveClass(/is-selected/);
  await expect(page.locator('[data-avatar-key="accessory"][data-avatar-value="none"]')).toHaveClass(/is-selected/);
});

test("Initiative rewards salary only when learning progress is proven", async ({ page }) => {
  await page.goto("/modules/initiative/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("career-empire-initiative-progress-v1");
    localStorage.setItem("career-empire-session", JSON.stringify({
      playerName: "Playwright Learner",
      annualSalary: 25000,
      salary: 25000,
      taxPaid: 0
    }));
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Test the gate" }).click();
  await expect(page.locator("#reward-console")).toContainText("Gate still locked");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$0");

  const gateAnswers = {
    definition: "initiative",
    "low-stock": "act",
    "shelf-labels": "improve",
    "hazard-report": "speak",
    "busy-rush": "support",
    "new-register": "step-up"
  };
  for (const [id, value] of Object.entries(gateAnswers)) {
    await page.locator(`[data-core-answer="${id}"]`).selectOption(value);
  }
  await page.getByRole("button", { name: "Test the gate" }).click();

  await expect(page.locator("#reward-console")).toContainText("Unlock Gate salary banked");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$500");
  await expect(page.locator("#metric-tax-contribution")).toHaveText("$50");

  const afterGate = await page.evaluate(() => ({
    moduleState: JSON.parse(localStorage.getItem("career-empire-initiative-progress-v1")),
    session: JSON.parse(localStorage.getItem("career-empire-session"))
  }));
  expect(afterGate.moduleState.salaryBoost).toBe(500);
  expect(afterGate.moduleState.taxContribution).toBe(50);
  expect(afterGate.moduleState.rewardedMilestones["unlock-gate"].earnedDelta).toBe(500);
  expect(afterGate.session.annualSalary).toBe(25500);
  expect(afterGate.session.taxPaid).toBe(50);
  expect(afterGate.session.economyLog[0].moduleId).toBe("initiative");
  expect(afterGate.session.economyLog[0].earnedDelta).toBe(500);

  await page.locator('[data-pathway="scenario"]').click();
  await page.getByRole("button", { name: "Submit scenario proof" }).click();
  await expect(page.locator("#reward-console")).toContainText("Mission proof not banked yet");
  await expect(page.locator("#pathway-feedback")).toContainText("Mission proof needs one more pass");
  await expect(page.locator("#metric-salary-boost")).toHaveText("$500");

  const afterScenario = await page.evaluate(() => JSON.parse(localStorage.getItem("career-empire-initiative-progress-v1")));
  expect(afterScenario.salaryBoost).toBe(500);
  expect(afterScenario.taxContribution).toBe(50);
});
