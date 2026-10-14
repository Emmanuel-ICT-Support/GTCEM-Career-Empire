const YEAR10_TRENDS = [
  {
    id: "technology",
    name: "Impactful Technology",
    emoji: "🤖",
    simpleExplanation: "New technology, AI, and machines can change how work gets done.",
    businessImpact: "Businesses need more digital skills and faster systems.",
    workImpact: "Some routine jobs shrink while new tech jobs grow.",
    summary: "Technology can help businesses work faster, but workers need to learn new tools and solve new problems.",
    implications: [
      "Businesses can use machines or software to do repetitive tasks faster.",
      "Workers need digital skills, problem-solving, and people skills.",
      "Productivity can rise when workers and technology work together."
    ],
    scenario: "A sports store is starting to use self-checkout and stock-tracking software. The manager wants workers to stay useful and keep the business productive.",
    question: "Which business response is the strongest?",
    choices: [
      {
        title: "Train staff to use the new system",
        detail: "Workers learn the software and help customers with harder problems.",
        points: 140,
        readiness: 10,
        balance: -2,
        mastery: 22
      },
      {
        title: "Ignore the change for now",
        detail: "Keep working the old way and hope it still works.",
        points: 55,
        readiness: -6,
        balance: 4,
        mastery: 8
      },
      {
        title: "Replace everyone straight away",
        detail: "Cut staff without training or planning.",
        points: 35,
        readiness: -12,
        balance: -8,
        mastery: 5
      }
    ],
    targetSentence: "Impactful technology can change jobs because machines can do some tasks and people need new skills.",
    ownWordsStarter: "This megatrend matters because ",
    pdfImplication: "Businesses can predict which tasks may be automated, which new skills workers will need, and where productivity could improve."
  },
  {
    id: "climate",
    name: "Climate Change",
    emoji: "🌍",
    simpleExplanation: "Weather, energy use, and environmental rules can change the kinds of jobs businesses need.",
    businessImpact: "Businesses must work in cleaner and safer ways.",
    workImpact: "More green jobs and changing workplace rules appear.",
    summary: "Climate change pushes businesses to save energy, reduce waste, and create jobs linked to sustainability.",
    implications: [
      "Businesses may hire workers who know about energy, waste, or sustainable design.",
      "Some jobs change because companies must meet environmental rules.",
      "Productivity can improve when businesses waste less and use resources better."
    ],
    scenario: "A building company wants to win more work, but clients are asking for greener building methods and less waste.",
    question: "Which choice best prepares the business for the future?",
    choices: [
      {
        title: "Train workers in green building methods",
        detail: "The company learns cleaner ways to work and wins new clients.",
        points: 140,
        readiness: 9,
        balance: -3,
        mastery: 22
      },
      {
        title: "Wait until rules force a change",
        detail: "The company delays planning and hopes demand stays the same.",
        points: 60,
        readiness: -5,
        balance: 4,
        mastery: 8
      },
      {
        title: "Keep old methods and ignore waste",
        detail: "The company spends more on wasted materials and misses future jobs.",
        points: 30,
        readiness: -10,
        balance: -4,
        mastery: 4
      }
    ],
    targetSentence: "Climate change can change jobs because businesses need cleaner ways to work and use energy.",
    ownWordsStarter: "Businesses should care about this because ",
    pdfImplication: "Businesses can predict demand for green jobs, new rules, and changes to how work is organised and measured."
  },
  {
    id: "demographic",
    name: "Demographic Shifts",
    emoji: "🌈",
    simpleExplanation: "Populations change over time, including age, culture, family size, and where people live.",
    businessImpact: "Businesses need products and services for different groups of people.",
    workImpact: "Workplaces need flexibility, inclusion, and strong communication.",
    summary: "When populations change, businesses need workers who can understand different customers and different life stages.",
    implications: [
      "Older populations can increase demand for health and support services.",
      "Different communities can change what customers want and how businesses communicate.",
      "Flexible work can help businesses attract and keep more workers."
    ],
    scenario: "A local health service is growing. More older clients and more culturally diverse families are using the service each year.",
    question: "Which response makes the most sense?",
    choices: [
      {
        title: "Hire flexibly and train staff to work with different communities",
        detail: "The service grows its team and improves support for more people.",
        points: 145,
        readiness: 10,
        balance: -2,
        mastery: 22
      },
      {
        title: "Keep the same service for everyone",
        detail: "The business changes very little and hopes people adapt.",
        points: 65,
        readiness: -4,
        balance: 2,
        mastery: 8
      },
      {
        title: "Reduce staff and offer fewer support options",
        detail: "The service becomes less helpful as community needs change.",
        points: 25,
        readiness: -11,
        balance: -5,
        mastery: 4
      }
    ],
    targetSentence: "Demographic shifts can change jobs because different groups of people need different services and support.",
    ownWordsStarter: "A business could respond by ",
    pdfImplication: "Businesses can predict changes in customer needs, service demand, and the kinds of workers and workplace supports they will need."
  },
  {
    id: "economic",
    name: "Economic Power Shifts",
    emoji: "💼",
    simpleExplanation: "Money, trade, and jobs can move between countries as some regions grow faster than others.",
    businessImpact: "Businesses need to watch global markets and supply chains.",
    workImpact: "Workers may need teamwork, communication, and global awareness.",
    summary: "Economic power shifts can change where products are made, where businesses sell, and which skills workers need.",
    implications: [
      "Businesses may work with customers, suppliers, or workers in other countries.",
      "Jobs can grow in places linked to trade, logistics, and international communication.",
      "Productivity can change when businesses find faster or cheaper global options."
    ],
    scenario: "A clothing company wants to sell online to more countries and buy materials from overseas suppliers.",
    question: "What is the smartest response?",
    choices: [
      {
        title: "Build global skills and plan for overseas trade",
        detail: "The business prepares workers for new markets and new supply chains.",
        points: 145,
        readiness: 10,
        balance: -2,
        mastery: 22
      },
      {
        title: "Only focus on the local market forever",
        detail: "The business avoids change and misses bigger opportunities.",
        points: 60,
        readiness: -5,
        balance: 3,
        mastery: 8
      },
      {
        title: "Rush into global trade without training",
        detail: "The business takes risks without preparing its workers.",
        points: 40,
        readiness: -8,
        balance: -6,
        mastery: 5
      }
    ],
    targetSentence: "Economic power shifts can change jobs because trade and business opportunities can move between countries.",
    ownWordsStarter: "This helps predict future work because ",
    pdfImplication: "Businesses can predict changing markets, global competition, and the need for workers with communication and international awareness."
  }
];

const GAME_TYPES = ["catch", "dodge"];
const JOBS_DATA_PATH = "../../data/automation-risk-jobs.json";

const state = {
  currentTrendIndex: -1,
  selectedChoiceIndex: null,
  points: 0,
  readiness: 50,
  balance: 50,
  masteryByTrend: {},
  trendResponses: [],
  arcadeScores: [],
  automationJobs: [],
  currentJobResult: null,
  jobsDataset: [],
  lastArcadeCleanup: null
};

const elements = {
  startBtn: document.getElementById("start-btn"),
  pointsStat: document.getElementById("points-stat"),
  readinessStat: document.getElementById("readiness-stat"),
  balanceStat: document.getElementById("balance-stat"),
  masteryStat: document.getElementById("mastery-stat"),
  scenarioScreen: document.getElementById("screen-scenario"),
  introScreen: document.getElementById("screen-intro"),
  writingScreen: document.getElementById("screen-writing"),
  arcadeScreen: document.getElementById("screen-arcade"),
  automationScreen: document.getElementById("screen-automation"),
  finishScreen: document.getElementById("screen-finish"),
  scenarioTitle: document.getElementById("scenario-title"),
  scenarioStep: document.getElementById("scenario-step"),
  scenarioTag: document.getElementById("scenario-tag"),
  scenarioSimple: document.getElementById("scenario-simple"),
  scenarioBusinessPill: document.getElementById("scenario-business-pill"),
  scenarioWorkPill: document.getElementById("scenario-work-pill"),
  scenarioSummary: document.getElementById("scenario-summary"),
  scenarioImplications: document.getElementById("scenario-implications"),
  scenarioPrompt: document.getElementById("scenario-prompt"),
  scenarioChoices: document.getElementById("scenario-choices"),
  scenarioSubmit: document.getElementById("scenario-submit"),
  targetSentence: document.getElementById("target-sentence"),
  typedSentence: document.getElementById("typed-sentence"),
  typedFeedback: document.getElementById("typed-feedback"),
  writingStarter: document.getElementById("writing-starter"),
  ownWords: document.getElementById("own-words"),
  arcadeBtn: document.getElementById("arcade-btn"),
  skipFromWritingBtn: document.getElementById("skip-from-writing-btn"),
  arcadeTitle: document.getElementById("arcade-title"),
  arcadeCopy: document.getElementById("arcade-copy"),
  arcadeControls: document.getElementById("arcade-controls"),
  arcadeGoal: document.getElementById("arcade-goal"),
  arcadeCanvas: document.getElementById("arcade-canvas"),
  skipArcadeBtn: document.getElementById("skip-arcade-btn"),
  randomJobBtn: document.getElementById("random-job-btn"),
  searchJobBtn: document.getElementById("search-job-btn"),
  jobSearch: document.getElementById("job-search"),
  jobOptions: document.getElementById("job-options"),
  jobResult: document.getElementById("job-result"),
  selectedJobs: document.getElementById("selected-jobs"),
  finishBtn: document.getElementById("finish-btn"),
  summaryCards: document.getElementById("summary-cards"),
  downloadPdfBtn: document.getElementById("download-pdf-btn"),
  restartBtn: document.getElementById("restart-btn")
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function showOnly(screenElement) {
  [
    elements.introScreen,
    elements.scenarioScreen,
    elements.writingScreen,
    elements.arcadeScreen,
    elements.automationScreen,
    elements.finishScreen
  ].forEach((element) => element.classList.add("hidden"));
  screenElement.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getCurrentTrend() {
  return YEAR10_TRENDS[state.currentTrendIndex] || null;
}

function getAverageMastery() {
  const values = Object.values(state.masteryByTrend);
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function updateStats() {
  elements.pointsStat.textContent = String(state.points);
  elements.readinessStat.textContent = `${state.readiness}%`;
  elements.balanceStat.textContent = `${state.balance}%`;
  elements.masteryStat.textContent = `${getAverageMastery()}%`;
}

function normaliseSentence(value) {
  return String(value || "")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function startGame() {
  state.currentTrendIndex = 0;
  state.selectedChoiceIndex = null;
  showScenario();
}

function renderChoices(trend) {
  elements.scenarioChoices.innerHTML = trend.choices.map((choice, index) => `
    <button class="choice-btn" type="button" data-choice-index="${index}">
      <strong>${choice.title}</strong>
      <span>${choice.detail}</span>
    </button>
  `).join("");

  elements.scenarioChoices.querySelectorAll(".choice-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedChoiceIndex = Number(button.getAttribute("data-choice-index"));
      elements.scenarioChoices.querySelectorAll(".choice-btn").forEach((item, index) => {
        item.classList.toggle("active", index === state.selectedChoiceIndex);
      });
      elements.scenarioSubmit.disabled = false;
    });
  });
}

function showScenario() {
  const trend = getCurrentTrend();
  if (!trend) {
    showAutomationScreen();
    return;
  }

  elements.scenarioTitle.textContent = `${trend.emoji} ${trend.name}`;
  elements.scenarioStep.textContent = `Round ${state.currentTrendIndex + 1} of ${YEAR10_TRENDS.length}`;
  elements.scenarioTag.textContent = "Simple idea";
  elements.scenarioSimple.textContent = trend.simpleExplanation;
  elements.scenarioBusinessPill.textContent = trend.businessImpact;
  elements.scenarioWorkPill.textContent = trend.workImpact;
  elements.scenarioSummary.textContent = trend.summary;
  elements.scenarioPrompt.textContent = `${trend.scenario} ${trend.question}`;
  elements.scenarioImplications.innerHTML = trend.implications.map((item) => `<li>${item}</li>`).join("");
  state.selectedChoiceIndex = null;
  elements.scenarioSubmit.disabled = true;
  renderChoices(trend);
  showOnly(elements.scenarioScreen);
}

function lockScenarioChoice() {
  const trend = getCurrentTrend();
  const choice = trend?.choices[state.selectedChoiceIndex];
  if (!trend || !choice) return;

  state.points += choice.points;
  state.readiness = clamp(state.readiness + choice.readiness, 0, 100);
  state.balance = clamp(state.balance + choice.balance, 0, 100);
  state.masteryByTrend[trend.id] = clamp((state.masteryByTrend[trend.id] || 0) + choice.mastery, 0, 100);

  const existing = state.trendResponses.find((entry) => entry.id === trend.id);
  if (existing) {
    existing.choiceTitle = choice.title;
    existing.choiceDetail = choice.detail;
  } else {
    state.trendResponses.push({
      id: trend.id,
      name: trend.name,
      emoji: trend.emoji,
      summary: trend.summary,
      businessImpact: trend.businessImpact,
      workImpact: trend.workImpact,
      implications: trend.implications,
      pdfImplication: trend.pdfImplication,
      choiceTitle: choice.title,
      choiceDetail: choice.detail,
      typedSentence: "",
      ownWords: "",
      pointsAwarded: choice.points
    });
  }

  updateStats();
  showWritingScreen();
}

function showWritingScreen() {
  const trend = getCurrentTrend();
  if (!trend) return;
  elements.targetSentence.textContent = trend.targetSentence;
  elements.writingStarter.textContent = trend.ownWordsStarter;
  elements.typedSentence.value = "";
  elements.ownWords.value = "";
  elements.typedFeedback.textContent = "Match the sentence exactly to unlock the arcade challenge.";
  elements.arcadeBtn.disabled = true;
  showOnly(elements.writingScreen);
}

function updateWritingState() {
  const trend = getCurrentTrend();
  if (!trend) return;
  const typedMatches = normaliseSentence(elements.typedSentence.value) === normaliseSentence(trend.targetSentence);
  const ownWordsLength = elements.ownWords.value.trim().length;
  const ownWordsReady = ownWordsLength >= 15;
  if (typedMatches && ownWordsReady) {
    elements.typedFeedback.textContent = "Nice work. You can play the arcade challenge now.";
  } else if (typedMatches) {
    elements.typedFeedback.textContent = "Sentence copied. Add a short explanation in your own words to continue.";
  } else {
    elements.typedFeedback.textContent = "The copied sentence is close, but it still needs to match the target sentence wording.";
  }
  elements.arcadeBtn.disabled = !(typedMatches && ownWordsReady);
}

function saveWritingResponses() {
  const trend = getCurrentTrend();
  const entry = state.trendResponses.find((item) => item.id === trend.id);
  if (!entry) return;
  entry.typedSentence = elements.typedSentence.value.trim();
  entry.ownWords = elements.ownWords.value.trim();
}

function finishTrendAfterArcade(score) {
  const trend = getCurrentTrend();
  if (!trend) return;
  const scoreBonus = Math.max(0, Math.round(score));
  state.points += scoreBonus;
  state.balance = clamp(state.balance + 4, 0, 100);
  state.readiness = clamp(state.readiness + 3, 0, 100);
  state.masteryByTrend[trend.id] = clamp((state.masteryByTrend[trend.id] || 0) + Math.min(18, Math.round(scoreBonus / 8)), 0, 100);
  const entry = state.trendResponses.find((item) => item.id === trend.id);
  if (entry) {
    entry.arcadeScore = scoreBonus;
  }
  state.arcadeScores.push({ trendId: trend.id, score: scoreBonus });
  updateStats();
  state.currentTrendIndex += 1;
  showScenario();
}

function clearArcadeLoop() {
  if (typeof state.lastArcadeCleanup === "function") {
    state.lastArcadeCleanup();
    state.lastArcadeCleanup = null;
  }
}

function startArcadeGame() {
  const trend = getCurrentTrend();
  if (!trend) return;

  saveWritingResponses();
  showOnly(elements.arcadeScreen);
  clearArcadeLoop();

  const gameType = GAME_TYPES[state.currentTrendIndex % GAME_TYPES.length];
  if (gameType === "catch") {
    runCatchGame(trend);
  } else {
    runDodgeGame(trend);
  }
}

function runCatchGame(trend) {
  const canvas = elements.arcadeCanvas;
  const ctx = canvas.getContext("2d");
  let score = 0;
  let timeLeft = 18;
  let running = true;
  const words = trend.name.split(" ");
  const player = { x: canvas.width / 2 - 45, y: canvas.height - 40, width: 90, height: 18 };
  const drops = [];
  const keys = { left: false, right: false };

  elements.arcadeTitle.textContent = `${trend.emoji} Word Catcher`;
  elements.arcadeCopy.textContent = "Catch the useful words and bank extra points.";
  elements.arcadeControls.textContent = "Controls: Arrow left and right";
  elements.arcadeGoal.textContent = `Catch the falling words connected to ${trend.name}.`;

  function spawnDrop() {
    drops.push({
      x: Math.random() * (canvas.width - 110),
      y: -20,
      width: 110,
      height: 30,
      speed: 2 + Math.random() * 2.5,
      label: words[Math.floor(Math.random() * words.length)]
    });
  }

  function keydownHandler(event) {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
  }

  function keyupHandler(event) {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
  }

  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);

  const timer = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  let animationFrame = null;
  let spawnTick = 0;

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#03111f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    spawnTick += 1;
    if (spawnTick % 24 === 0) {
      spawnDrop();
    }

    if (keys.left) player.x = Math.max(0, player.x - 7);
    if (keys.right) player.x = Math.min(canvas.width - player.width, player.x + 7);

    ctx.fillStyle = "#7dd3fc";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 22px Outfit";
    ctx.fillText(`Score: ${score}`, 18, 32);
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 120, 32);

    for (let index = drops.length - 1; index >= 0; index -= 1) {
      const drop = drops[index];
      drop.y += drop.speed;
      ctx.fillStyle = "rgba(134, 239, 172, 0.9)";
      ctx.fillRect(drop.x, drop.y, drop.width, drop.height);
      ctx.fillStyle = "#052e16";
      ctx.font = "bold 15px Outfit";
      ctx.fillText(drop.label, drop.x + 12, drop.y + 20);

      const caught =
        drop.y + drop.height >= player.y &&
        drop.x < player.x + player.width &&
        drop.x + drop.width > player.x;

      if (caught) {
        score += 12;
        drops.splice(index, 1);
      } else if (drop.y > canvas.height) {
        drops.splice(index, 1);
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  }

  function endGame() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);
    ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 32px Outfit";
    ctx.fillText("Challenge complete", 270, 210);
    ctx.font = "bold 24px Outfit";
    ctx.fillText(`Arcade score: ${score}`, 330, 250);
    setTimeout(() => finishTrendAfterArcade(score), 900);
  }

  state.lastArcadeCleanup = () => {
    running = false;
    clearInterval(timer);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);
  };

  draw();
}

function runDodgeGame(trend) {
  const canvas = elements.arcadeCanvas;
  const ctx = canvas.getContext("2d");
  let score = 0;
  let timeLeft = 18;
  let running = true;
  const player = { x: canvas.width / 2, y: canvas.height - 54, radius: 18 };
  const hazards = [];
  const keys = { left: false, right: false };

  elements.arcadeTitle.textContent = `${trend.emoji} Rocket Dodge`;
  elements.arcadeCopy.textContent = "Stay alive and collect points each second.";
  elements.arcadeControls.textContent = "Controls: Arrow left and right";
  elements.arcadeGoal.textContent = `Dodge the falling blocks while thinking about ${trend.name}.`;

  function keydownHandler(event) {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
  }

  function keyupHandler(event) {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
  }

  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);

  const timer = setInterval(() => {
    timeLeft -= 1;
    score += 8;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  let animationFrame = null;
  let spawnTick = 0;

  function drawPlayer() {
    ctx.fillStyle = "#7dd3fc";
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - 20);
    ctx.lineTo(player.x - 18, player.y + 18);
    ctx.lineTo(player.x + 18, player.y + 18);
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020817";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    spawnTick += 1;
    if (spawnTick % 18 === 0) {
      hazards.push({
        x: Math.random() * (canvas.width - 38),
        y: -30,
        size: 28 + Math.random() * 18,
        speed: 3 + Math.random() * 3
      });
    }

    if (keys.left) player.x = Math.max(20, player.x - 8);
    if (keys.right) player.x = Math.min(canvas.width - 20, player.x + 8);

    drawPlayer();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 22px Outfit";
    ctx.fillText(`Score: ${score}`, 18, 32);
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 120, 32);

    for (let index = hazards.length - 1; index >= 0; index -= 1) {
      const hazard = hazards[index];
      hazard.y += hazard.speed;
      ctx.fillStyle = "#f97316";
      ctx.fillRect(hazard.x, hazard.y, hazard.size, hazard.size);
      if (
        hazard.x < player.x + player.radius &&
        hazard.x + hazard.size > player.x - player.radius &&
        hazard.y < player.y + player.radius &&
        hazard.y + hazard.size > player.y - player.radius
      ) {
        score = Math.max(0, score - 20);
        hazards.splice(index, 1);
        continue;
      }
      if (hazard.y > canvas.height) {
        hazards.splice(index, 1);
      }
    }

    animationFrame = window.requestAnimationFrame(draw);
  }

  function endGame() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);
    ctx.fillStyle = "rgba(2, 6, 23, 0.78)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 32px Outfit";
    ctx.fillText("Challenge complete", 270, 210);
    ctx.font = "bold 24px Outfit";
    ctx.fillText(`Arcade score: ${score}`, 330, 250);
    setTimeout(() => finishTrendAfterArcade(score), 900);
  }

  state.lastArcadeCleanup = () => {
    running = false;
    clearInterval(timer);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("keydown", keydownHandler);
    window.removeEventListener("keyup", keyupHandler);
  };

  draw();
}

function getRiskBand(risk) {
  if (risk <= 20) return { key: "minimal", label: "Minimal Risk", reason: "This job depends a lot on human judgement, communication, or complex people-focused work." };
  if (risk <= 40) return { key: "low", label: "Low Risk", reason: "Parts of the job could change, but many important tasks still need a person." };
  if (risk <= 60) return { key: "medium", label: "Medium Risk", reason: "This job has a mix of human tasks and repeatable tasks that technology may handle." };
  if (risk <= 80) return { key: "high", label: "High Risk", reason: "A large part of this job includes routine or rules-based work that can be automated." };
  return { key: "very-high", label: "Very High Risk", reason: "Most of the tasks are predictable enough that software or machines could do much of the job." };
}

function renderJobResult(job) {
  const riskBand = getRiskBand(job.calculatedRisk);
  state.currentJobResult = {
    ...job,
    riskBand
  };

  elements.jobResult.className = `job-result risk-${riskBand.key}`;
  elements.jobResult.innerHTML = `
    <h3>${job.name}</h3>
    <div class="job-meta">
      <span class="job-chip">Automation risk: ${Math.round(job.calculatedRisk)}%</span>
      <span class="job-chip">${riskBand.label}</span>
      <span class="job-chip">${job.isGroup ? "Job group" : "Specific occupation"}</span>
    </div>
    <p>${riskBand.reason}</p>
    <p class="helper-copy">Source: <a href="${job.url}" target="_blank" rel="noreferrer">${job.url}</a></p>
    <button id="save-job-btn" class="primary-btn" type="button" ${state.automationJobs.length >= 3 ? "disabled" : ""}>Add this job to my PDF</button>
  `;

  document.getElementById("save-job-btn").addEventListener("click", () => {
    saveAutomationJob();
  });
}

function saveAutomationJob() {
  if (!state.currentJobResult) return;
  const alreadySelected = state.automationJobs.some((job) => job.socCode === state.currentJobResult.socCode);
  if (alreadySelected || state.automationJobs.length >= 3) return;
  state.automationJobs.push(state.currentJobResult);
  renderSelectedJobs();
}

function renderSelectedJobs() {
  if (!state.automationJobs.length) {
    elements.selectedJobs.innerHTML = '<div class="empty-state"><p>No jobs added yet.</p></div>';
  } else {
    elements.selectedJobs.innerHTML = state.automationJobs.map((job, index) => `
      <article class="saved-job risk-${job.riskBand.key}">
        <h4>${index + 1}. ${job.name}</h4>
        <p>${Math.round(job.calculatedRisk)}% automation risk • ${job.riskBand.label}</p>
        <p>${job.riskBand.reason}</p>
      </article>
    `).join("");
  }
  elements.finishBtn.disabled = state.automationJobs.length !== 3;
  if (state.automationJobs.length >= 3 && state.currentJobResult) {
    const saveButton = document.getElementById("save-job-btn");
    if (saveButton) saveButton.disabled = true;
  }
}

function pickRandomJob() {
  if (!state.jobsDataset.length) return;
  const availableJobs = state.jobsDataset.filter((job) => !state.automationJobs.some((selected) => selected.socCode === job.socCode));
  const pool = availableJobs.length ? availableJobs : state.jobsDataset;
  const job = pool[Math.floor(Math.random() * pool.length)];
  renderJobResult(job);
}

function pickSearchedJob() {
  const query = elements.jobSearch.value.trim().toLowerCase();
  if (!query) return;
  const match = state.jobsDataset.find((job) => job.name.toLowerCase() === query)
    || state.jobsDataset.find((job) => job.name.toLowerCase().includes(query));
  if (match) {
    renderJobResult(match);
  } else {
    state.currentJobResult = null;
    elements.jobResult.className = "job-result empty-state";
    elements.jobResult.innerHTML = "<p>That job was not found in the automation data list. Try another search.</p>";
  }
}

function showAutomationScreen() {
  clearArcadeLoop();
  renderSelectedJobs();
  showOnly(elements.automationScreen);
}

function renderSummaryCards() {
  const totalArcade = state.arcadeScores.reduce((sum, item) => sum + item.score, 0);
  elements.summaryCards.innerHTML = `
    <article class="summary-item">
      <h3>Total points</h3>
      <p>${state.points}</p>
    </article>
    <article class="summary-item">
      <h3>Job readiness</h3>
      <p>${state.readiness}%</p>
    </article>
    <article class="summary-item">
      <h3>Work balance</h3>
      <p>${state.balance}%</p>
    </article>
    <article class="summary-item">
      <h3>Arcade score total</h3>
      <p>${totalArcade}</p>
    </article>
    <article class="summary-item">
      <h3>Megatrend mastery</h3>
      <p>${getAverageMastery()}%</p>
    </article>
    <article class="summary-item">
      <h3>Automation jobs saved</h3>
      <p>${state.automationJobs.length}</p>
    </article>
  `;
}

function finishModule() {
  renderSummaryCards();
  showOnly(elements.finishScreen);
}

function addPdfParagraph(doc, text, x, y, maxWidth, lineHeight = 7) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function downloadPdf() {
  const jsPdfApi = window.jspdf;
  if (!jsPdfApi?.jsPDF) return;
  const doc = new jsPdfApi.jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const left = 16;
  const right = 16;
  const maxWidth = pageWidth - left - right;
  let y = 18;

  function ensureSpace(required = 18) {
    if (y + required > pageHeight - 16) {
      doc.addPage();
      y = 18;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Year 10 Megatrends Explorer Summary", left, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = addPdfParagraph(
    doc,
    "Applying understanding of megatrends as a business concept can help predict future workforce and productivity in the following ways:",
    left,
    y,
    maxWidth
  );
  y += 4;

  ensureSpace(28);
  doc.setFont("helvetica", "bold");
  doc.text("Gameplay stats", left, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  [
    `Points earned: ${state.points}`,
    `Job readiness: ${state.readiness}%`,
    `Work balance: ${state.balance}%`,
    `Megatrend mastery: ${getAverageMastery()}%`,
    `Arcade score total: ${state.arcadeScores.reduce((sum, item) => sum + item.score, 0)}`
  ].forEach((line) => {
    ensureSpace(8);
    doc.text(line, left, y);
    y += 6;
  });

  y += 2;
  doc.setFont("helvetica", "bold");
  doc.text("Megatrends, implications, and student summaries", left, y);
  y += 7;

  state.trendResponses.forEach((trend, index) => {
    ensureSpace(42);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${trend.name}`, left, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    y = addPdfParagraph(doc, `Business and productivity link: ${trend.pdfImplication}`, left, y, maxWidth);
    y = addPdfParagraph(doc, `Simple summary: ${trend.summary}`, left, y + 1, maxWidth);
    y = addPdfParagraph(doc, `Choice made: ${trend.choiceTitle} - ${trend.choiceDetail}`, left, y + 1, maxWidth);
    y = addPdfParagraph(doc, `Copied sentence: ${trend.typedSentence}`, left, y + 1, maxWidth);
    y = addPdfParagraph(doc, `My own response: ${trend.ownWords}`, left, y + 1, maxWidth);
    y = addPdfParagraph(doc, `Arcade score: ${trend.arcadeScore || 0}`, left, y + 1, maxWidth);
    y += 4;
  });

  ensureSpace(24);
  doc.setFont("helvetica", "bold");
  doc.text("Will my job be automated?", left, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  state.automationJobs.forEach((job, index) => {
    ensureSpace(24);
    y = addPdfParagraph(
      doc,
      `${index + 1}. ${job.name}: ${Math.round(job.calculatedRisk)}% automation risk (${job.riskBand.label}). ${job.riskBand.reason}`,
      left,
      y,
      maxWidth
    );
    y = addPdfParagraph(doc, `Source: ${job.url}`, left, y + 1, maxWidth);
    y += 3;
  });

  doc.save("year10-megatrends-summary.pdf");
}

function resetState() {
  clearArcadeLoop();
  state.currentTrendIndex = -1;
  state.selectedChoiceIndex = null;
  state.points = 0;
  state.readiness = 50;
  state.balance = 50;
  state.masteryByTrend = {};
  state.trendResponses = [];
  state.arcadeScores = [];
  state.automationJobs = [];
  state.currentJobResult = null;
  elements.jobResult.className = "job-result empty-state";
  elements.jobResult.innerHTML = "<p>Pick a job to see the automation result.</p>";
  elements.jobSearch.value = "";
  renderSelectedJobs();
  updateStats();
  showOnly(elements.introScreen);
}

async function loadJobsData() {
  const response = await fetch(JOBS_DATA_PATH);
  if (!response.ok) {
    throw new Error(`Failed to load jobs data: ${response.status}`);
  }
  const jobs = await response.json();
  state.jobsDataset = jobs
    .filter((job) => typeof job.calculatedRisk === "number" && job.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  elements.jobOptions.innerHTML = state.jobsDataset
    .map((job) => `<option value="${job.name}"></option>`)
    .join("");
}

function bindEvents() {
  elements.startBtn.addEventListener("click", startGame);
  elements.scenarioSubmit.addEventListener("click", lockScenarioChoice);
  elements.typedSentence.addEventListener("input", updateWritingState);
  elements.ownWords.addEventListener("input", updateWritingState);
  elements.arcadeBtn.addEventListener("click", startArcadeGame);
  elements.skipFromWritingBtn.addEventListener("click", () => {
    saveWritingResponses();
    finishTrendAfterArcade(0);
  });
  elements.skipArcadeBtn.addEventListener("click", () => finishTrendAfterArcade(0));
  elements.randomJobBtn.addEventListener("click", pickRandomJob);
  elements.searchJobBtn.addEventListener("click", pickSearchedJob);
  elements.finishBtn.addEventListener("click", finishModule);
  elements.downloadPdfBtn.addEventListener("click", downloadPdf);
  elements.restartBtn.addEventListener("click", resetState);
}

async function init() {
  bindEvents();
  updateStats();
  renderSelectedJobs();
  await loadJobsData();
}

init().catch((error) => {
  console.error(error);
  elements.jobResult.className = "job-result empty-state";
  elements.jobResult.innerHTML = "<p>The automation job data could not be loaded.</p>";
});
