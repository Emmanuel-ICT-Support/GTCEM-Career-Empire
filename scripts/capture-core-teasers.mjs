import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile, readdir } from "node:fs/promises";
import { basename, extname, join, normalize, relative, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/tania.byrnes/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = resolve(new URL("..", import.meta.url).pathname);
const outputDir = join(root, "Assets/EST Preparation/core-briefing");
const edgePath = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".mp4", "video/mp4"],
  [".webm", "video/webm"],
  [".pdf", "application/pdf"]
]);

function sendFile(req, res, filePath, fileStat) {
  const type = mimeTypes.get(extname(filePath).toLowerCase()) || "application/octet-stream";
  const range = req.headers.range;
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", type);

  if (range) {
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Number(match[2]) : fileStat.size - 1;
      if (start < fileStat.size && end < fileStat.size && start <= end) {
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
          "Content-Length": end - start + 1
        });
        createReadStream(filePath, { start, end }).pipe(res);
        return;
      }
    }
  }

  res.setHeader("Content-Length", fileStat.size);
  createReadStream(filePath).pipe(res);
}

function createStaticServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      const decoded = decodeURIComponent(url.pathname);
      const requestPath = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
      const filePath = normalize(join(root, requestPath));
      if (!relative(root, filePath) || relative(root, filePath).startsWith("..")) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      sendFile(req, res, filePath, fileStat);
    } catch (_) {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}

async function listen(server) {
  return new Promise(resolveListen => {
    server.listen(0, "127.0.0.1", () => resolveListen(server.address().port));
  });
}

async function waitForEST(page) {
  await page.goto(`${globalThis.baseUrl}/modules/est-prep/index.html`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => window.ESTPrep && document.querySelectorAll(".content-module-button").length >= 6);
}

async function captureElement(page, selector, filename) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 10000 });
  await locator.screenshot({ path: join(outputDir, filename) });
}

async function setStageTop(page) {
  await page.evaluate(() => {
    const stage = document.querySelector("#stage-section") || document.querySelector(".mission-brief-panel");
    if (stage) window.scrollTo(0, Math.max(0, stage.getBoundingClientRect().top + window.scrollY - 16));
  });
}

async function openCoreMenu(page) {
  await page.evaluate(() => window.ESTPrep.openStage("content"));
  await page.waitForSelector(".content-topic-panel--open");
  await setStageTop(page);
}

async function openInitiativeIntro(page) {
  await page.evaluate(() => window.ESTPrep.openContentGroupIntro(0));
  await page.waitForSelector(".topic-media-card");
  await page.waitForTimeout(900);
  await setStageTop(page);
}

async function openGraphicOrganiser(page) {
  await openInitiativeIntro(page);
  await page.evaluate(() => {
    const reminder = document.querySelector("details.initiative-reminder");
    if (reminder) {
      reminder.open = true;
      reminder.scrollIntoView({ block: "center" });
    }
  });
  await page.waitForTimeout(350);
}

async function openReactorQuestion(page) {
  await page.evaluate(() => window.ESTPrep.startContentGroup());
  await page.waitForSelector(".training-card");
  await page.waitForTimeout(800);
  await setStageTop(page);
}

async function openReactorFeedback(page) {
  await openReactorQuestion(page);
  await page.evaluate(() => {
    const group = state.stageDeck.contentGroups[state.contentGroupIndex];
    const config = getContentTrainingConfig(group.id);
    const flow = getArcFlow(config);
    const item = config.steps[flow.stepIndex].items[flow.itemIndex];
    window.ESTPrep.setTrainingChoice(getArcTrainingAnswerKey(config.type, item.id), item.correct);
  });
  await page.waitForSelector(".training-card.good, .training-card.bad");
  await page.waitForTimeout(900);
}

async function openRewardReview(page) {
  await page.evaluate(() => {
    const group = state.stageDeck.contentGroups[0];
    state.selectedStageId = "content";
    state.contentGroupIndex = 0;
    state.contentView = "lesson";
    setLabMode(true);
    const config = getContentTrainingConfig(group.id);
    for (const step of config.steps || []) {
      for (const item of step.items || []) {
        state.answers[getArcTrainingAnswerKey(config.type, item.id)] = item.correct;
      }
    }
    state.arcFlows[config.type] = {
      phase: "complete",
      stepIndex: Math.max(0, (config.steps || []).length - 1),
      itemIndex: Math.max(0, ((config.steps || []).at(-1)?.items || []).length - 1),
      lastOutcome: "correct"
    };
    window.ESTPrep.openContentResponse();
  });
  await page.waitForSelector(".training-campaign--focus");
  await page.evaluate(() => {
    const group = state.stageDeck.contentGroups[0];
    for (const [index, round] of group.rounds.entries()) {
      state.answers[`content-${group.id}-${index}`] = round.correct;
    }
    state.answers["content-scaffold-initiative-concept"] = "acts proactively by noticing what needs to be done and taking useful action";
    state.answers["content-scaffold-initiative-example"] = "offer to help a teammate, suggest a safer system, or take responsibility before being asked";
    state.answers["content-scaffold-initiative-impact"] = "because it improves productivity, teamwork, and workplace reliability";
    window.ESTPrep.buildContentResponse("initiative");
  });
  await page.waitForSelector("#content-note");
  await page.evaluate(async () => {
    await window.ESTPrep.submitCurrentContentTopic();
    state.contentTopicVotes.initiative = state.stageDeck.communityOptions?.[0]?.id || "";
    renderContentStage();
  });
  await page.waitForSelector(".content-community-panel, .content-reward-grid");
  await page.waitForTimeout(700);
  await setStageTop(page);
}

async function encodeWebmFromFrames(browser, frames, filename, frameDelay = 260) {
  if (!frames.length) return;
  const encoderPage = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  const webmBase64 = await encoderPage.evaluate(async ({ frames, frameDelay }) => {
    const first = await new Promise((resolveImage, rejectImage) => {
      const image = new Image();
      image.onload = () => resolveImage({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = rejectImage;
      image.src = frames[0];
    });
    const canvas = document.createElement("canvas");
    canvas.width = first.width;
    canvas.height = first.height;
    document.body.style.margin = "0";
    document.body.append(canvas);
    const context = canvas.getContext("2d");
    const stream = canvas.captureStream(Math.max(1, Math.round(1000 / frameDelay)));
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = event => {
      if (event.data?.size) chunks.push(event.data);
    };
    const stopped = new Promise(resolveStop => {
      recorder.onstop = resolveStop;
    });
    const drawFrame = src => new Promise((resolveFrame, rejectFrame) => {
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolveFrame();
      };
      image.onerror = rejectFrame;
      image.src = src;
    });
    recorder.start();
    for (const frame of frames) {
      await drawFrame(frame);
      await new Promise(resolveDelay => setTimeout(resolveDelay, frameDelay));
    }
    recorder.stop();
    await stopped;
    const blob = new Blob(chunks, { type: mimeType });
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }, { frames, frameDelay });
  await encoderPage.close();
  await writeFile(join(outputDir, filename), Buffer.from(webmBase64, "base64"));
}

async function captureFrame(page) {
  const buffer = await page.screenshot({ type: "png" });
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function captureFrameSequence(page, count = 12, delay = 260) {
  const frames = [];
  for (let index = 0; index < count; index += 1) {
    frames.push(await captureFrame(page));
    await page.waitForTimeout(delay);
  }
  return frames;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const server = createStaticServer();
  const port = await listen(server);
  globalThis.baseUrl = `http://127.0.0.1:${port}`;

  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--disable-gpu", "--autoplay-policy=no-user-gesture-required"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1360, height: 980 } });
    await waitForEST(page);

    await openCoreMenu(page);
    await captureElement(page, "#stage-section", "core-topic-menu-teaser.png");

    await openInitiativeIntro(page);
    await captureElement(page, "#stage-section", "core-initiative-video-teaser.png");

    await openGraphicOrganiser(page);
    await captureElement(page, ".initiative-reminder", "core-graphic-organiser-teaser.png");

    await openReactorQuestion(page);
    await captureElement(page, "#stage-section", "core-question-gameplay-teaser.png");

    await openReactorFeedback(page);
    await captureElement(page, "#stage-section", "core-feedback-gameplay-teaser.png");

    await openRewardReview(page);
    await captureElement(page, "#stage-section", "core-reward-community-teaser.png");

    await page.goto(`${globalThis.baseUrl}/shop/index.html`, { waitUntil: "networkidle" });
    await page.waitForSelector("#shop-grid");
    await captureElement(page, ".shop-page main", "core-shop-teaser.png");

    await page.goto(`${globalThis.baseUrl}/dashboards/community.html`, { waitUntil: "networkidle" });
    await page.waitForSelector(".community-dashboard-page");
    await captureElement(page, "main", "core-community-fund-teaser.png");
    await page.close();

    const initiativeVideoPage = await browser.newPage({ viewport: { width: 1180, height: 760 } });
    await waitForEST(initiativeVideoPage);
    await openInitiativeIntro(initiativeVideoPage);
    await encodeWebmFromFrames(browser, await captureFrameSequence(initiativeVideoPage, 14, 260), "core-initiative-video-teaser.webm");
    await initiativeVideoPage.close();

    const reactorVideoPage = await browser.newPage({ viewport: { width: 1180, height: 760 } });
    await waitForEST(reactorVideoPage);
    await openInitiativeIntro(reactorVideoPage);
    await openReactorQuestion(reactorVideoPage);
    const reactorFrames = await captureFrameSequence(reactorVideoPage, 5, 260);
    await openReactorFeedback(reactorVideoPage);
    reactorFrames.push(...await captureFrameSequence(reactorVideoPage, 10, 260));
    await encodeWebmFromFrames(browser, reactorFrames, "core-reactor-gameplay-teaser.webm");
    await reactorVideoPage.close();

    const rewardVideoPage = await browser.newPage({ viewport: { width: 1180, height: 760 } });
    await waitForEST(rewardVideoPage);
    await openRewardReview(rewardVideoPage);
    await encodeWebmFromFrames(browser, await captureFrameSequence(rewardVideoPage, 14, 260), "core-reward-community-teaser.webm");
    await rewardVideoPage.close();
  } finally {
    await browser.close();
    await new Promise(resolveClose => server.close(resolveClose));
  }

  const files = (await readdir(outputDir)).filter(file => /^core-.*\.(png|webm)$/.test(file)).sort();
  console.log(`Captured ${files.length} CORE teaser assets:`);
  for (const file of files) console.log(`- ${join(outputDir, basename(file))}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
