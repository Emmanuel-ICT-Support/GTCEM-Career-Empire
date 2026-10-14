// EST Prep glossary bundle. Loaded as a classic browser script.
let glossaryTimerInterval = null;

let glossaryRecallAdvanceTimeout = null;

let glossaryInvaderShotTimeout = null;

let glossaryInvadersRuntime = null;

let glossaryCommunityAssetTimeout = null;

let glossaryMemoryResetTimeout = null;

let glossaryBridgeMotionTimeout = null;

const GLOSSARY_TERMS_PER_ROUND = 6;
const GLOSSARY_BRIDGE_TERMS_PER_LEVEL = 5;
const GLOSSARY_MASTERY_TARGET = FULL_GLOSSARY_TERMS.length;
const GLOSSARY_MASTERY_ACCURACY = 1;
const GLOSSARY_MASTERY_REPS = 1;
const GLOSSARY_INVADER_WIDTH = 960;
const GLOSSARY_INVADER_HEIGHT = 520;
const GLOSSARY_INVADER_PLAYER_Y = 462;
const GLOSSARY_INVADER_COLORS = ["#72f7b8", "#61f0ff", "#ffd86c", "#ff7dc0"];
const GLOSSARY_VISUAL_ASSETS = {
  "memory-match": "../../Assets/Images and Animations/Glossary Check/glossary-recall-forge.svg",
  "term-catch": "../../Assets/Images and Animations/Glossary Check/glossary-signal-scan.svg",
  "colour-shape": "../../Assets/Images and Animations/Glossary Check/glossary-signal-scan.svg",
  "signal-slice": "../../Assets/Images and Animations/Glossary Check/glossary-blank-repair.svg",
  "keyword-cloze": "../../Assets/Images and Animations/Glossary Check/glossary-blank-repair.svg",
  "plain-match": "../../Assets/Images and Animations/Glossary Check/glossary-corruption-sweep.svg",
  recall: "../../Assets/Images and Animations/Glossary Check/glossary-space-runner.svg",
  reward: "../../Assets/Images and Animations/Glossary Check/glossary-reward-vault.svg"
};

const GLOSSARY_GUIDE_ASSETS = {
  "memory-match": "../../Assets/EST Preparation/guide-character/guide-pointing.png",
  "term-catch": "../../Assets/EST Preparation/guide-character/guide-pointing.png",
  "colour-shape": "../../Assets/EST Preparation/guide-character/guide-pointing.png",
  "signal-slice": "../../Assets/EST Preparation/guide-character/guide-thinking-top.png",
  "keyword-cloze": "../../Assets/EST Preparation/guide-character/guide-thinking-top.png",
  "plain-match": "../../Assets/EST Preparation/guide-character/guide-thinking-bottom.png",
  recall: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Encouraging.png",
  study: "../../Assets/EST Preparation/guide-character/guide-thinking-top.png",
  reward: "../../Assets/EST Preparation/guide-character/guide-celebration.png"
};

const GLOSSARY_BRIDGE_ASSETS = {
  backdrop: "../../Assets/Images and Animations/Glossary Check/Vault Bridge/vault-bridge-backdrop.png",
  characterReady: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
  characterWelcome: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png",
  characterAction: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png",
  characterSuccess: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Celebrating.png",
  characterReset: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Encouraging.png"
};

const GLOSSARY_BRIDGE_LEVEL_NAMES = [
  "Foundation Lock",
  "Workplace Signal",
  "Future Industries",
  "Learning Loop",
  "Risk Chamber",
  "Career Mastery"
];

const GLOSSARY_BRIDGE_ROWS = [
  [{ x: 24, y: 72 }, { x: 50, y: 72 }, { x: 73, y: 72 }],
  [{ x: 30, y: 64 }, { x: 50, y: 64 }, { x: 70, y: 64 }],
  [{ x: 24, y: 56 }, { x: 50, y: 56 }, { x: 73, y: 56 }],
  [{ x: 32, y: 48 }, { x: 54, y: 48 }, { x: 72, y: 48 }],
  [{ x: 42, y: 40 }, { x: 60, y: 40 }, { x: 73, y: 40 }]
];

const GLOSSARY_BRIDGE_HOME_POSITION = { x: 50, y: 91 };
const GLOSSARY_BRIDGE_PORTAL_POSITION = { x: 83, y: 42 };
const GLOSSARY_BRIDGE_PATH_SCALE_Y = 0.5625;
const GLOSSARY_BRIDGE_RESULT_MOTION_MS = 1350;

const GLOSSARY_MEMORY_THEMES = {
  aqua: {
    label: "Aqua Vault",
    cardBack: "../../Assets/Images and Animations/Glossary Check/glossary-memory-card-back.png",
    arena: "../../Assets/Images and Animations/Glossary Check/glossary-memory-arena-bg.png",
    accent: "#61f0ff",
    accent2: "#ffd86c",
    tint: "rgba(97, 240, 255, 0.18)",
    cardFilter: "none",
    arenaFilter: "none"
  },
  violet: {
    label: "Violet Nebula",
    cardBack: "../../Assets/Images and Animations/Glossary Check/glossary-memory-card-violet.png",
    arena: "../../Assets/Images and Animations/Glossary Check/glossary-memory-arena-violet.png",
    accent: "#c084fc",
    accent2: "#f0abfc",
    tint: "rgba(192, 132, 252, 0.2)",
    cardFilter: "none",
    arenaFilter: "none"
  },
  emerald: {
    label: "Emerald Circuit",
    cardBack: "../../Assets/Images and Animations/Glossary Check/glossary-memory-card-emerald.png",
    arena: "../../Assets/Images and Animations/Glossary Check/glossary-memory-arena-emerald.png",
    accent: "#72f7b8",
    accent2: "#bbf7d0",
    tint: "rgba(114, 247, 184, 0.18)",
    cardFilter: "none",
    arenaFilter: "none"
  },
  solar: {
    label: "Solar Forge",
    cardBack: "../../Assets/Images and Animations/Glossary Check/glossary-memory-card-solar.png",
    arena: "../../Assets/Images and Animations/Glossary Check/glossary-memory-arena-solar.png",
    accent: "#f97316",
    accent2: "#fde68a",
    tint: "rgba(249, 115, 22, 0.2)",
    cardFilter: "none",
    arenaFilter: "none"
  },
  crimson: {
    label: "Crimson Core",
    cardBack: "../../Assets/Images and Animations/Glossary Check/glossary-memory-card-crimson.png",
    arena: "../../Assets/Images and Animations/Glossary Check/glossary-memory-arena-crimson.png",
    accent: "#fb7185",
    accent2: "#fbbf24",
    tint: "rgba(251, 113, 133, 0.18)",
    cardFilter: "none",
    arenaFilter: "none"
  }
};

const GLOSSARY_STORY_ASSETS = {
  vault: "../../Assets/Images and Animations/EST backgrounds/Background Neutral.png",
  romeroPointing: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Pointing.png",
  romeroThinking: "../../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png",
  mackillopThinking: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png",
  mackillopEncouraging: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Encouraging.png",
  mackillopCelebrating: "../../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Celebrating.png",
  francis: "../../Assets/Images and Animations/Emmanuel Student Characters/Francis.png",
  lisieux: "../../Assets/Images and Animations/Emmanuel Student Characters/Lisieux.png"
};

const GLOSSARY_COMMUNITY_ASSETS = {
  climate: {
    image: "../../Assets/Images and Animations/Community Page/community-path-green-futures.png",
    title: "Green Futures Hub",
    detail: "The class contribution grows a shared climate and sustainability asset."
  },
  tech: {
    image: "../../Assets/Images and Animations/Community Page/community-path-digital-access.png",
    title: "Digital Access Lab",
    detail: "The class contribution grows a shared tech education and inclusion asset."
  },
  diversity: {
    image: "../../Assets/Images and Animations/Community Page/community-path-fairer-starts.png",
    title: "Fairer Starts Fund",
    detail: "The class contribution grows a shared diversity and economic equity asset."
  },
  global: {
    image: "../../Assets/Images and Animations/Community Page/community-path-wider-horizons.png",
    title: "Wider Horizons Bridge",
    detail: "The class contribution grows a shared global opportunity access asset."
  }
};

const GLOSSARY_SCENE_VISUALS = {
  Arbitration: {
    variant: "story",
    motif: "arbitration",
    badge: "BINDING",
    title: "Fair decision chamber",
    caption: "A neutral decision-maker weighs both sides, checks the evidence, then locks a fair outcome for everyone.",
    tags: ["neutral", "evidence", "binding"],
    character: GLOSSARY_STORY_ASSETS.romeroPointing,
    chips: ["Party A", "Party B", "Evidence", "Outcome locked"]
  },
  Career: {
    variant: "story",
    motif: "career-map",
    badge: "LIFE MAP",
    title: "Many roles, one lifetime path",
    caption: "Paid work, unpaid roles, learning, leisure, community and family responsibilities all connect across a life.",
    tags: ["roles", "life", "work"],
    character: GLOSSARY_STORY_ASSETS.mackillopEncouraging,
    chips: ["Paid work", "Learning", "Leisure", "Family", "Community"]
  },
  "Career adaptability": {
    variant: "story",
    motif: "career-pivot",
    badge: "ADAPT",
    title: "ATAR gate blocked, new pathway found",
    caption: "The planned university route is blocked by entry criteria, so the learner redirects toward training, work and more job opportunities.",
    tags: ["adjust", "opportunity", "transition"],
    character: GLOSSARY_STORY_ASSETS.romeroThinking,
    chips: ["ATAR gate", "Reroute", "TAFE / work", "More jobs"]
  },
  "Career competencies": {
    variant: "story",
    motif: "competency-kit",
    badge: "TOOLKIT",
    title: "Skills packed for future decisions",
    caption: "Knowledge, skills and attitudes become a toolkit for intentional choices, lifelong learning and work life balance.",
    tags: ["skills", "attitudes", "balance"],
    character: GLOSSARY_STORY_ASSETS.mackillopThinking,
    chips: ["Knowledge", "Skills", "Attitudes", "Balance"]
  },
  "Career development": {
    variant: "story",
    motif: "future-growth",
    badge: "FUTURE",
    title: "The preferred future keeps evolving",
    caption: "A person builds knowledge, skills, attributes and behaviours across life, learning, leisure and work.",
    tags: ["lifelong", "future", "manage"],
    character: GLOSSARY_STORY_ASSETS.mackillopCelebrating,
    chips: ["Life", "Learning", "Work", "Future"]
  },
  "Cover letter": { motif: "document", badge: "NOTE", title: "Applicant message", caption: "A targeted note travels with the resume and highlights suitability.", tags: ["interest", "skills", "job"] },
  "Demographic shift": { motif: "population", badge: "POP", title: "Population pattern changes", caption: "Groups grow, shrink or move as migration, births and deaths change.", tags: ["migration", "births", "rates"] },
  "Dispute resolution": { motif: "dispute", badge: "SOLVE", title: "Fair solution table", caption: "People work through conflict toward a solution all sides can accept.", tags: ["conflict", "fair", "solution"] },
  Diversity: { motif: "community", badge: "MIX", title: "Different people included", caption: "Different ages, cultures, genders, beliefs and abilities belong together.", tags: ["variety", "inclusion", "people"] },
  "Economic power shift": { motif: "global-shift", badge: "SHIFT", title: "Markets change weight", caption: "Influence moves from established economies toward emerging markets.", tags: ["global", "markets", "change"] },
  "Emerging industries": { motif: "invention", badge: "NEW", title: "New industry launch", caption: "New products, services and technologies start taking shape.", tags: ["early", "innovation", "technology"] },
  Enterprise: { motif: "spark", badge: "TRY", title: "Tries the new idea", caption: "Someone is willing to innovate, show initiative and promote new activity.", tags: ["initiative", "innovation", "try"] },
  "Enterprise culture": { motif: "workplace", badge: "CODE", title: "Shared workplace code", caption: "Values, beliefs, standards and behaviours shape how the workplace feels.", tags: ["values", "beliefs", "behaviour"] },
  "Impactful technology": { motif: "technology", badge: "TECH", title: "Tech changes the system", caption: "A powerful tool improves processes while also disrupting routines.", tags: ["improve", "disrupt", "uncertainty"] },
  "Green industries": { motif: "green", badge: "ECO", title: "Cleaner production", caption: "Industry protects the environment by reducing waste and pollution.", tags: ["sustainable", "waste", "materials"] },
  Grievance: { motif: "concern", badge: "ISSUE", title: "Workplace concern raised", caption: "An employee names a real or perceived problem at work.", tags: ["problem", "workplace", "employee"] },
  "Growth industry": { motif: "growth-chart", badge: "RISE", title: "Fast-rising sector", caption: "The sector climbs faster than the average industry around it.", tags: ["growth", "rate", "industry"] },
  Initiative: { motif: "initiative", badge: "ACT", title: "Steps in before trouble", caption: "Someone helps before the problem drops or the workload piles up.", tags: ["proactive", "challenge", "unexpected"] },
  "Learning opportunity": { motif: "learning", badge: "LEARN", title: "Chance to build skill", caption: "A situation becomes a place to develop knowledge and understanding.", tags: ["develop", "knowledge", "skills"] },
  "Lifelong learning": { motif: "lifelong", badge: "ALWAYS", title: "Learning keeps moving", caption: "Knowledge and skills keep developing across personal and professional life.", tags: ["ongoing", "voluntary", "skills"] },
  Mediation: { motif: "mediator", badge: "GUIDE", title: "Neutral guide between sides", caption: "A third party helps people communicate and negotiate a compromise.", tags: ["third party", "negotiate", "compromise"] },
  Megatrend: { motif: "wave", badge: "WAVE", title: "Large long-term wave", caption: "A lasting force changes how people live, work and do business.", tags: ["long-lasting", "transform", "work"] },
  "Performance management": { motif: "feedback", badge: "LOOP", title: "Feedback loop", caption: "Employer and employee keep communicating so performance can improve.", tags: ["feedback", "support", "role"] },
  "Personal risk": { motif: "home-risk", badge: "HOME", title: "Family impact risk", caption: "A choice directly affects the individual or family around them.", tags: ["individual", "family", "impact"] },
  "Professional development": { motif: "training", badge: "UPSKILL", title: "Skills upgrade", caption: "Training refines skills, knowledge and understanding for work.", tags: ["training", "refine", "enhance"] },
  "Professional risk": { motif: "career-risk", badge: "LEAP", title: "Career leap", caption: "A work risk is taken because it could improve career outcomes.", tags: ["career", "risk", "outcome"] },
  Resilience: { motif: "bounce", badge: "BACK", title: "Bounces back", caption: "A person endures a challenge and recovers after adversity.", tags: ["endure", "recover", "challenge"] },
  "Selection criteria": { motif: "checklist", badge: "FIT", title: "Role requirements", caption: "A checklist names the qualities and skills needed for the job.", tags: ["qualities", "skills", "job"] },
  "Skills shortage": { motif: "vacancy", badge: "GAP", title: "Vacancy gap", caption: "Employers have roles open but cannot find enough people with the skill.", tags: ["employers", "vacancies", "occupation"] },
  "Work environment": { motif: "workplace", badge: "PLACE", title: "Inside the workplace", caption: "Physical conditions, processes and social dynamics shape daily work.", tags: ["conditions", "procedures", "social"] }
};

function clearGlossaryRecallAdvanceTimeout() {
  if (glossaryRecallAdvanceTimeout) {
    clearTimeout(glossaryRecallAdvanceTimeout);
    glossaryRecallAdvanceTimeout = null;
  }
}

function clearGlossaryInvaderShotTimeout() {
  if (glossaryInvaderShotTimeout) {
    clearTimeout(glossaryInvaderShotTimeout);
    glossaryInvaderShotTimeout = null;
  }
  stopGlossaryInvadersRuntime();
  if (state?.answers) {
    delete state.answers.glossaryInvaderTarget;
    delete state.answers.glossaryInvaderFiring;
  }
}

function clearGlossaryCommunityAssetTimeout() {
  if (glossaryCommunityAssetTimeout) {
    clearTimeout(glossaryCommunityAssetTimeout);
    glossaryCommunityAssetTimeout = null;
  }
}

function clearGlossaryMemoryResetTimeout() {
  if (glossaryMemoryResetTimeout) {
    clearTimeout(glossaryMemoryResetTimeout);
    glossaryMemoryResetTimeout = null;
  }
}

function setGlossaryCommunityAssetReady(roundNumber, ready) {
  state.glossaryCommunityAssetReady = state.glossaryCommunityAssetReady || {};
  state.glossaryCommunityAssetReady[roundNumber] = ready;
}

function isGlossaryCommunityAssetReady(roundNumber) {
  return state.glossaryCommunityAssetReady?.[roundNumber] !== false;
}

function getGlossaryCommunityAssetDelay() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? 0 : 1450;
}

function formatSecondsAsClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearGlossaryTimer() {
  if (glossaryTimerInterval) {
    window.clearInterval(glossaryTimerInterval);
    glossaryTimerInterval = null;
  }
}

function getGlossaryRoundElapsedSeconds() {
  if (!state.glossaryRoundStartedAt) return 0;
  return Math.max(0, getGlossaryRoundActiveSeconds());
}

function startGlossaryRoundTimer(reset = false) {
  if (reset || !state.glossaryRoundStartedAt) {
    resetGlossaryRoundActiveTimer();
  }
  clearGlossaryTimer();
  glossaryTimerInterval = window.setInterval(() => {
    const timer = document.getElementById("glossary-round-timer");
    if (timer) timer.textContent = formatSecondsAsClock(getGlossaryRoundElapsedSeconds());
  }, 1000);
}

function getGlossarySpeedBand(elapsedSeconds) {
  if (elapsedSeconds <= 95) return { label: "Gold speed bonus", bonus: 650 };
  if (elapsedSeconds <= 150) return { label: "Silver speed bonus", bonus: 360 };
  return { label: "Bronze speed bonus", bonus: 180 };
}

function normaliseGlossaryTermText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function deriveGlossaryKeywords(definition) {
  const stopWords = new Set(["the", "and", "that", "with", "from", "their", "this", "into", "which", "when", "whereby", "while", "between", "they", "them", "such", "have", "has", "been", "will", "just", "more", "than", "over", "under", "work", "role", "roles", "process", "processes", "using", "used", "throughout", "within", "towards", "about", "your", "their", "these", "those", "what", "because", "allows", "allow", "being"]);
  return [...new Set(
    String(definition || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
  )].slice(0, 4);
}

function buildGlossarySource() {
  return FULL_GLOSSARY_TERMS.map((item, index) => ({
    id: `full-glossary-${index + 1}`,
    term: item.term,
    definition: item.definition,
    keywords: deriveGlossaryKeywords(item.definition)
  }));
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getGlossaryTermAccuracy(stat) {
  const tested = Number(stat?.tested || 0);
  if (!tested) return 0;
  return Number(stat?.correct || 0) / tested;
}

function hasGlossaryPerfectRecentRecall(stat) {
  const recentAnswers = (Array.isArray(stat?.answers) ? stat.answers : []).slice(-GLOSSARY_MASTERY_REPS);
  return Number(stat?.tested || 0) >= GLOSSARY_MASTERY_REPS
    && recentAnswers.length >= GLOSSARY_MASTERY_REPS
    && recentAnswers.every(entry => entry.correct);
}

function getGlossaryMasterySummary() {
  const source = buildGlossarySource();
  const stats = state.glossaryTermStats || {};
  const rows = source.map((item, index) => {
    const stat = stats[item.id] || {};
    const tested = Number(stat.tested || 0);
    const correct = Number(stat.correct || 0);
    const accuracy = tested ? correct / tested : 0;
    const isMastered = hasGlossaryPerfectRecentRecall(stat);
    return { index, item, stat, tested, correct, accuracy, isMastered };
  });
  const testedRows = rows.filter(row => row.tested > 0);
  const attempts = rows.reduce((sum, row) => sum + row.tested, 0);
  const correct = rows.reduce((sum, row) => sum + row.correct, 0);
  const mastered = rows.filter(row => row.isMastered).length;
  const masteryTarget = Math.min(GLOSSARY_MASTERY_TARGET, source.length);
  return {
    total: source.length,
    tested: testedRows.length,
    untested: source.length - testedRows.length,
    attempts,
    correct,
    accuracyPercent: attempts ? Math.round((correct / attempts) * 100) : 0,
    coveragePercent: source.length ? Math.round((testedRows.length / source.length) * 100) : 0,
    mastered,
    masteryTarget,
    masteryTargetPercent: masteryTarget ? Math.min(100, Math.round((mastered / masteryTarget) * 100)) : 0,
    masteryAccuracyPercent: Math.round(GLOSSARY_MASTERY_ACCURACY * 100),
    rows
  };
}

function buildGlossaryPracticeBatches(source = buildGlossarySource()) {
  const terms = Array.isArray(source) && source.length ? source : buildGlossarySource();
  return chunkArray(terms, GLOSSARY_TERMS_PER_ROUND).filter(batch => batch.length);
}

function sortGlossaryRowsForPractice(rows) {
  return [...rows].sort((a, b) => {
    if (a.tested !== b.tested) return a.tested - b.tested;
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return a.index - b.index;
  });
}

function rotateGlossaryRows(rows, offset = 0) {
  if (!rows.length) return [];
  const start = Math.max(0, Number(offset || 0)) % rows.length;
  return [...rows.slice(start), ...rows.slice(0, start)];
}

function chooseGlossaryPracticeItems(count = GLOSSARY_TERMS_PER_ROUND, options = {}) {
  const summary = getGlossaryMasterySummary();
  const untestedRows = summary.rows.filter(row => row.tested === 0);
  const reviewRows = summary.rows.filter(row => row.tested > 0 && !row.isMastered);
  const secureRows = summary.rows.filter(row => row.isMastered);
  const sortedSecureRows = sortGlossaryRowsForPractice(secureRows);
  const replaySecureRows = untestedRows.length || reviewRows.length
    ? sortedSecureRows
    : rotateGlossaryRows(sortedSecureRows, Number(options.offset || 0));
  const orderedRows = [
    ...sortGlossaryRowsForPractice(untestedRows),
    ...sortGlossaryRowsForPractice(reviewRows),
    ...replaySecureRows
  ];
  return orderedRows.slice(0, Math.min(count, orderedRows.length)).map(row => row.item);
}

function refreshGlossaryPracticeDeck() {
  if (!state.stageDeck) return;
  const glossaryTerms = buildGlossarySource();
  state.stageDeck.glossaryTerms = glossaryTerms;
  state.stageDeck.glossaryBatches = buildGlossaryPracticeBatches(glossaryTerms);
  state.glossaryRoundIndex = Math.max(0, Math.min(state.glossaryRoundIndex || 0, Math.max(0, GLOSSARY_ROUND_CONFIGS.length - 1)));
  state.glossaryBatchIndex = Math.max(0, Math.min(state.glossaryBatchIndex || 0, Math.max(0, state.stageDeck.glossaryBatches.length - 1)));
}

function getGlossaryCloze(item) {
  const definition = String(item?.definition || "");
  const keyword = (item?.keywords || []).find(candidate => {
    return new RegExp(`\\b${escapeRegExp(candidate)}\\b`, "i").test(definition);
  }) || item?.keywords?.[0] || item?.term || "";
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return {
    keyword,
    text: pattern.test(definition) ? definition.replace(pattern, "_____") : `${definition} _____`
  };
}

function renderGlossaryClozeText(item) {
  return escapeHtml(getGlossaryCloze(item).text).replace("_____", '<span class="glossary-cloze-blank">_____</span>');
}

function renderGlossaryTermSilhouette(value) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.map(word => `
    <span>
      ${Array.from(word).map(() => "<i></i>").join("")}
    </span>
  `).join("");
}

function recordGlossaryAttempt(item, answer, correct, mode) {
  if (!item) return;
  const stats = { ...(state.glossaryTermStats || {}) };
  const current = stats[item.id] || {
    term: item.term,
    definition: item.definition,
    tested: 0,
    correct: 0,
    misses: 0,
    answers: []
  };
  const entry = {
    answer: String(answer || ""),
    correct: Boolean(correct),
    mode: String(mode || "practice"),
    at: new Date().toISOString()
  };
  stats[item.id] = {
    ...current,
    term: item.term,
    definition: item.definition,
    tested: Number(current.tested || 0) + 1,
    correct: Number(current.correct || 0) + (correct ? 1 : 0),
    misses: Number(current.misses || 0) + (correct ? 0 : 1),
    lastAnswer: entry.answer,
    lastCorrect: entry.correct,
    lastMode: entry.mode,
    lastTestedAt: entry.at,
    answers: [...(Array.isArray(current.answers) ? current.answers : []), entry].slice(-6)
  };
  state.glossaryTermStats = stats;
}

function getGlossaryKeywordHint(termName, definition) {
  const hintMap = {
    "Initiative": "proactive action",
    "Proactive": "act early",
    "Time management": "plan + prioritise",
    "Budget": "income vs expenses",
    "Seeking assistance": "trusted advice",
    "Labour market information": "jobs + wages",
    "Growth industry": "high growth",
    "Emerging industry": "new industry",
    "Green industry": "sustainable work",
    "Cover letter": "first impression",
    "Selection criteria": "job requirements",
    "STAR": "situation task action result",
    "Megatrend": "long-term change",
    "Demographic shift": "population change",
    "Economic power shift": "global market shift",
    "Impactful technologies": "innovation + disruption",
    "Career planning": "goals + pathways",
    "Communication skills": "message for audience",
    "Non-verbal communication": "body language",
    "Active listening": "check understanding",
    "Unexpected life event": "unplanned disruption"
  };
  if (hintMap[termName]) return hintMap[termName];
  const words = String(definition || "").replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(" ");
}

function getGlossaryScenarioHint(scenario) {
  const text = String(scenario || "").trim();
  if (text.length <= 72) return text;
  return `${text.slice(0, 72).trim()}...`;
}

function buildGlossaryBoard(rounds) {
  return shuffle(rounds.flatMap((round, index) => ([
    {
      id: `glossary-${index}-keyword`,
      matchId: index,
      kind: "Keyword",
      text: getGlossaryKeywordHint(round.term.term, round.term.definition),
      style: {
        x: `${8 + ((index * 17) % 62)}%`,
        y: `${8 + ((index * 13) % 52)}%`,
        delay: `${(index % 5) * 0.4}s`,
        duration: `${5 + (index % 4)}s`
      }
    },
    {
      id: `glossary-${index}-scenario`,
      matchId: index,
      kind: "Scenario",
      text: getGlossaryScenarioHint(round.term.scenario),
      style: {
        x: `${16 + ((index * 19) % 58)}%`,
        y: `${18 + ((index * 11) % 48)}%`,
        delay: `${((index + 2) % 5) * 0.35}s`,
        duration: `${6 + (index % 3)}s`
      }
    },
    {
      id: `glossary-${index}-definition`,
      matchId: index,
      kind: "Definition",
      text: round.term.definition,
      style: {
        x: `${12 + ((index * 23) % 60)}%`,
        y: `${12 + ((index * 7) % 54)}%`,
        delay: `${((index + 1) % 5) * 0.45}s`,
        duration: `${7 + (index % 4)}s`
      }
    }
  ])));
}

function getGlossaryBatches() {
  return state.stageDeck?.glossaryBatches?.length
    ? state.stageDeck.glossaryBatches
    : buildGlossaryPracticeBatches();
}

function getGlossaryBatchCount() {
  return getGlossaryBatches().length || 1;
}

function getSafeGlossaryBatchIndex(index = state.glossaryBatchIndex) {
  const count = getGlossaryBatchCount();
  const safeIndex = Number.isFinite(Number(index)) ? Math.round(Number(index)) : 0;
  return Math.max(0, Math.min(count - 1, safeIndex));
}

function getGlossaryBatchKeyFor(roundIndex = state.glossaryRoundIndex, batchIndex = state.glossaryBatchIndex) {
  return `glossary-r${roundIndex}-b${batchIndex}`;
}

function getGlossaryBatchTermIdsKey(roundIndex = state.glossaryRoundIndex, batchIndex = state.glossaryBatchIndex) {
  return `${getGlossaryBatchKeyFor(roundIndex, batchIndex)}-term-ids`;
}

function getGlossaryItemsById(ids) {
  const source = buildGlossarySource();
  const byId = new Map(source.map(item => [item.id, item]));
  return (Array.isArray(ids) ? ids : [])
    .map(id => byId.get(id))
    .filter(Boolean);
}

function clearGlossarySetState(roundIndex = state.glossaryRoundIndex, batchIndex = state.glossaryBatchIndex) {
  clearGlossaryRecallAdvanceTimeout();
  clearGlossaryInvaderShotTimeout();
  clearGlossaryCommunityAssetTimeout();
  clearGlossaryMemoryResetTimeout();
  const setKey = getGlossaryBatchKeyFor(roundIndex, batchIndex);
  const termIds = state.answers[getGlossaryBatchTermIdsKey(roundIndex, batchIndex)] || [];
  delete state.glossaryAssignments[setKey];
  delete state.answers[`${setKey}-memory-open`];
  delete state.answers[`${setKey}-memory-mismatch`];
  delete state.answers[`${setKey}-memory-match`];

  getGlossaryItemsById(termIds).forEach(item => {
    delete state.glossaryRecallAnswers[`term-${item.id}`];
    delete state.glossaryRecallAnswers[`keyword-${item.id}`];
    delete state.glossaryRecallResults[item.id];
  });

  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
}

function ensureGlossaryAdaptiveBatch(options = {}) {
  const roundIndex = Number.isFinite(Number(options.roundIndex)) ? Math.round(Number(options.roundIndex)) : state.glossaryRoundIndex;
  const batchIndex = getSafeGlossaryBatchIndex(options.batchIndex ?? state.glossaryBatchIndex);
  const termIdsKey = getGlossaryBatchTermIdsKey(roundIndex, batchIndex);
  const storedItems = getGlossaryItemsById(state.answers[termIdsKey]);
  if (!options.force && storedItems.length) return storedItems;

  clearGlossarySetState(roundIndex, batchIndex);
  const selectedItems = chooseGlossaryPracticeItems(GLOSSARY_TERMS_PER_ROUND, {
    offset: batchIndex * GLOSSARY_TERMS_PER_ROUND
  });
  state.answers[termIdsKey] = selectedItems.map(item => item.id);
  return selectedItems;
}

function getCurrentGlossaryBatch(options = {}) {
  return ensureGlossaryAdaptiveBatch(options);
}

function getGlossaryBatchLabel(batchIndex = state.glossaryBatchIndex) {
  return `Set ${getSafeGlossaryBatchIndex(batchIndex) + 1}/${getGlossaryBatchCount()}`;
}

function getCurrentGlossaryRound() {
  return GLOSSARY_ROUND_CONFIGS[state.glossaryRoundIndex] || GLOSSARY_ROUND_CONFIGS[0];
}

function getCurrentGlossaryMemoryTheme(round = getCurrentGlossaryRound()) {
  return GLOSSARY_MEMORY_THEMES[round?.theme] || GLOSSARY_MEMORY_THEMES.aqua;
}

function getGlossaryMemoryThemeStyle(theme = getCurrentGlossaryMemoryTheme()) {
  return [
    `--memory-accent:${theme.accent};`,
    `--memory-accent-2:${theme.accent2};`,
    `--memory-tint:${theme.tint};`,
    `--memory-card-filter:${theme.cardFilter};`,
    `--memory-arena-filter:${theme.arenaFilter};`,
    `--memory-card-back:url('${theme.cardBack}');`,
    `--memory-arena:url('${theme.arena}');`
  ].join("");
}

function getGlossaryVisual(index) {
  const visuals = [
    { shape: "circle", color: "#ff8a5b" },
    { shape: "diamond", color: "#5dd6ff" },
    { shape: "pill", color: "#ffd86c" },
    { shape: "hex", color: "#72f7b8" },
    { shape: "arch", color: "#c48bff" },
    { shape: "ticket", color: "#ff7dc0" }
  ];
  const offset = (state.glossaryRoundIndex * 2) + state.glossaryBatchIndex;
  return visuals[(index + offset) % visuals.length];
}

function syncMissionMode() {
  document.body.classList.toggle("glossary-mission-active", !!state.glossaryMissionMode);
}

function resetGlossaryRewardLoop() {
  clearGlossaryCommunityAssetTimeout();
  state.glossaryRoundCelebration = null;
  state.glossaryRoundRewards = {};
  state.glossaryRoundVotes = {};
  state.glossaryCommunityAssetReady = {};
  state.glossaryRoundStartedAt = 0;
  state.glossaryRoundActiveSeconds = 0;
  state.glossaryRoundLastAt = 0;
  state.glossaryRunStartedAt = 0;
}

function initialiseGlossaryBoard() {
  clearGlossaryRecallAdvanceTimeout();
  clearGlossaryInvaderShotTimeout();
  clearGlossaryMemoryResetTimeout();
  refreshGlossaryPracticeDeck();
  state.glossaryRoundIndex = 0;
  state.glossaryBatchIndex = 0;
  state.glossaryAssignments = {};
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
  state.glossaryRecallAnswers = {};
  state.glossaryRecallResults = {};
  state.glossaryRecallIndex = 0;
  state.glossaryRecallTransition = null;
  state.glossaryStreak = 0;
  state.glossaryBestStreak = 0;
  state.glossaryMisses = 0;
  state.glossaryPulse = "Memory vault loaded. Flip two cards at a time and match each term with its definition.";
  state.glossaryPulseType = "neutral";
  state.glossaryMissionMode = true;
  state.glossaryHasStarted = true;
  state.glossaryMode = "play";
  state.glossaryStudyIndex = 0;
  clearGlossaryBridgeState();
  resetGlossaryRewardLoop();
  state.glossaryRunStartedAt = Date.now();
  syncMissionMode();
  startGlossaryRoundTimer(true);
}

function startNewGlossaryPracticeRun() {
  const bestStreak = Number(state.glossaryBestStreak || 0);
  initialiseGlossaryBoard();
  state.glossaryBestStreak = bestStreak;
  ensureGlossaryAdaptiveBatch({ force: true });
  state.glossaryPulse = "New timed set loaded. Untested terms are dealt before repeats, then weaker terms come back for another rep.";
  state.glossaryPulseType = "neutral";
  renderGlossaryStage();
  persistESTProgressSnapshot();
}

function clearGlossaryRoundState(roundIndex) {
  clearGlossarySetState(roundIndex, state.glossaryBatchIndex);
  state.glossaryStreak = 0;
  state.glossaryMisses = 0;
  if (GLOSSARY_ROUND_CONFIGS[roundIndex]?.id === "recall") clearGlossaryBridgeState();
}

function getGlossaryBatchKey() {
  return getGlossaryBatchKeyFor(state.glossaryRoundIndex, state.glossaryBatchIndex);
}

function getGlossaryMemoryOpenKey() {
  return `${getGlossaryBatchKey()}-memory-open`;
}

function getGlossaryMemoryMismatchKey() {
  return `${getGlossaryBatchKey()}-memory-mismatch`;
}

function getGlossaryMemoryMatchKey() {
  return `${getGlossaryBatchKey()}-memory-match`;
}

function getGlossaryAssignmentsForBatch() {
  return state.glossaryAssignments[getGlossaryBatchKey()] || {};
}

function getGlossaryAllRoundItems() {
  return buildGlossarySource();
}

function getGlossaryMatchedTermIds() {
  return new Set(getGlossaryMasterySummary().rows.filter(row => row.isMastered).map(row => row.item.id));
}

function getGlossaryMemoryDeck(batch = getCurrentGlossaryBatch()) {
  const seed = state.glossaryRunStartedAt || 0;
  return batch.flatMap(item => ([
    {
      id: `${item.id}::term`,
      itemId: item.id,
      kind: "term",
      label: "Term",
      text: item.term
    },
    {
      id: `${item.id}::definition`,
      itemId: item.id,
      kind: "definition",
      label: "Definition",
      text: item.definition
    }
  ])).sort((a, b) => {
    return getGlossaryStableNumber(`${seed}-${getGlossaryBatchKey()}-${a.id}`) - getGlossaryStableNumber(`${seed}-${getGlossaryBatchKey()}-${b.id}`);
  });
}

function getGlossaryPendingItems(batch = getCurrentGlossaryBatch()) {
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.filter(item => assignments[item.id] !== item.id);
}

function getCurrentGlossaryPromptItem(batch = getCurrentGlossaryBatch()) {
  return getGlossaryPendingItems(batch)[0] || null;
}

function buildGlossaryChallengeOptions(roundId, item, batch = getCurrentGlossaryBatch()) {
  const glossarySource = buildGlossarySource();
  if (!item) return [];

  if (roundId === "term-catch" || roundId === "colour-shape") {
    const distractors = pickRandom(
      glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
      3
    );
    return shuffle([item.term, ...distractors]).map(option => ({
      value: option,
      title: option,
      detail: roundId === "term-catch" ? "Catch this term" : "Glossary term option"
    }));
  }

  if (roundId === "signal-slice") {
    const cloze = getGlossaryCloze(item);
    const keywordPool = glossarySource
      .filter(candidate => candidate.id !== item.id)
      .flatMap(candidate => candidate.keywords || []);
    const distractors = pickRandom([...new Set(keywordPool.filter(keyword => {
      return normaliseGlossaryTermText(keyword) !== normaliseGlossaryTermText(cloze.keyword);
    }))], 5);
    return shuffle([cloze.keyword, ...distractors]).map(option => ({
      value: option,
      title: option,
      detail: "Blank tile"
    }));
  }

  if (roundId === "keyword-cloze") {
    const cloze = getGlossaryCloze(item);
    const keywordPool = glossarySource
      .filter(candidate => candidate.id !== item.id)
      .flatMap(candidate => candidate.keywords || []);
    const distractors = pickRandom([...new Set(keywordPool.filter(keyword => {
      return normaliseGlossaryTermText(keyword) !== normaliseGlossaryTermText(cloze.keyword);
    }))], 3);
    return shuffle([cloze.keyword, ...distractors]).map(option => ({
      value: option,
      title: option,
      detail: "Missing keyword"
    }));
  }

  if (roundId === "plain-match") {
    return [item, ...getGlossaryStableDistractors(item, 3)].map(candidate => ({
      value: candidate.term,
      title: candidate.term,
      detail: "Shoot this term ship"
    })).sort((a, b) => {
      return (getGlossaryStableNumber(`${item.id}-${a.value}`) % 97) - (getGlossaryStableNumber(`${item.id}-${b.value}`) % 97);
    });
  }

  const distractors = pickRandom(
    glossarySource.filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]).map(option => ({
    value: option,
    title: option,
    detail: "Restore the correct term from the definition file"
  }));
}

function getGlossarySceneVisual(term) {
  const scene = GLOSSARY_SCENE_VISUALS[term];
  if (scene) return scene;
  return {
    motif: "toolkit",
    badge: "TERM",
    title: term || "Glossary scene",
    caption: "A visual anchor for this glossary term.",
    tags: deriveGlossaryKeywords(term || "").slice(0, 3)
  };
}

function getGlossaryStableDistractors(item, count = 3) {
  const glossarySource = buildGlossarySource();
  if (!item || !glossarySource.length) return [];
  const sourceIndex = Math.max(0, glossarySource.findIndex(candidate => candidate.id === item.id));
  const offsets = [5, 11, 17, 23, 29, 7, 13, 19];
  const picked = [];
  offsets.forEach(offset => {
    if (picked.length >= count) return;
    const candidate = glossarySource[(sourceIndex + offset) % glossarySource.length];
    if (candidate && candidate.id !== item.id && !picked.some(entry => entry.id === candidate.id)) {
      picked.push(candidate);
    }
  });
  glossarySource.forEach(candidate => {
    if (picked.length >= count) return;
    if (candidate.id !== item.id && !picked.some(entry => entry.id === candidate.id)) {
      picked.push(candidate);
    }
  });
  return picked;
}

function buildGlossarySceneMatchOptions(item) {
  if (!item) return [];
  return [item, ...getGlossaryStableDistractors(item, 3)].map(candidate => ({
    value: candidate.term,
    term: candidate.term,
    correct: candidate.id === item.id
  })).sort((a, b) => {
    return (getGlossaryStableNumber(`${item.id}-${a.term}`) % 97) - (getGlossaryStableNumber(`${item.id}-${b.term}`) % 97);
  });
}

function getGlossaryStableNumber(value) {
  return String(value || "").split("").reduce((sum, char, index) => {
    return sum + (char.charCodeAt(0) * (index + 1));
  }, 0);
}

function buildGlossaryFlightOptions(item) {
  const glossarySource = buildGlossarySource();
  if (!item) return [];
  const sourceIndex = Math.max(0, glossarySource.findIndex(candidate => candidate.id === item.id));
  const options = [item.term];
  const offsets = [7, 13, 19, 23, 29, 5, 11];

  offsets.forEach(offset => {
    const candidate = glossarySource[(sourceIndex + offset) % glossarySource.length];
    if (candidate && candidate.id !== item.id && !options.includes(candidate.term)) {
      options.push(candidate.term);
    }
  });

  glossarySource.forEach(candidate => {
    if (options.length >= 4) return;
    if (candidate.id !== item.id && !options.includes(candidate.term)) {
      options.push(candidate.term);
    }
  });

  const laneTerms = options.slice(1, 4);
  const correctLane = getGlossaryStableNumber(item.id) % 4;
  laneTerms.splice(correctLane, 0, item.term);
  return laneTerms.slice(0, 4).map((term, index) => ({
    value: term,
    title: term,
    lane: index,
    correct: normaliseGlossaryTermText(term) === normaliseGlossaryTermText(item.term)
  }));
}

function getGlossaryFlightLane() {
  const lane = Number(state.answers.glossaryFlightLane ?? 1);
  if (!Number.isFinite(lane)) return 1;
  return Math.max(0, Math.min(3, Math.round(lane)));
}

function moveGlossaryFlightLane(delta) {
  state.answers.glossaryFlightLane = Math.max(0, Math.min(3, getGlossaryFlightLane() + Number(delta || 0)));
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function setGlossaryFlightLane(lane) {
  state.answers.glossaryFlightLane = Math.max(0, Math.min(3, Number(lane || 0)));
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function captureGlossaryFlightSignal() {
  const batch = getCurrentGlossaryBatch();
  const item = getCurrentGlossaryPromptItem(batch);
  if (!item) return;
  const options = buildGlossaryFlightOptions(item);
  const selected = options[getGlossaryFlightLane()] || options[0];
  if (!selected) return;
  submitGlossaryChallengeChoiceEncoded(item.id, encodeURIComponent(selected.value));
}

function getGlossaryBridgeTermIdsKey() {
  return `${getGlossaryBatchKey()}-bridge-term-ids`;
}

function resetGlossaryBridgeSource() {
  delete state.answers[getGlossaryBridgeTermIdsKey()];
}

function getGlossaryBridgeSource(options = {}) {
  const key = getGlossaryBridgeTermIdsKey();
  const storedItems = getGlossaryItemsById(state.answers[key]);
  if (!options.force && storedItems.length) return storedItems;
  const source = chooseGlossaryPracticeItems(buildGlossarySource().length);
  state.answers[key] = source.map(item => item.id);
  return source;
}

function getGlossaryBridgeLevels() {
  const source = getGlossaryBridgeSource();
  return Array.from({ length: Math.ceil(source.length / GLOSSARY_BRIDGE_TERMS_PER_LEVEL) }, (_, index) => {
    return source.slice(index * GLOSSARY_BRIDGE_TERMS_PER_LEVEL, (index + 1) * GLOSSARY_BRIDGE_TERMS_PER_LEVEL);
  }).filter(level => level.length);
}

function getGlossaryBridgeLocks() {
  const locks = state.answers?.glossaryBridgeLocks;
  return locks && typeof locks === "object" && !Array.isArray(locks) ? locks : {};
}

function getGlossaryBridgeState() {
  const levels = getGlossaryBridgeLevels();
  const rawLevel = Number(state.answers.glossaryBridgeLevel || 0);
  const level = Math.max(0, Math.min(levels.length - 1, Number.isFinite(rawLevel) ? Math.round(rawLevel) : 0));
  const levelTerms = levels[level] || [];
  const rawStep = Number(state.answers.glossaryBridgeStep || 0);
  const step = Math.max(0, Math.min(levelTerms.length, Number.isFinite(rawStep) ? Math.round(rawStep) : 0));
  const locks = getGlossaryBridgeLocks();
  return {
    levels,
    level,
    step,
    levelTerms,
    locks,
    levelLocks: Array.isArray(locks[String(level)]) ? locks[String(level)] : [],
    levelClear: Boolean(state.answers.glossaryBridgeLevelClear) || (levelTerms.length > 0 && step >= levelTerms.length),
    completed: Boolean(state.answers.glossaryBridgeCompleted)
  };
}

function getGlossaryBridgeLevelName(levelIndex) {
  return GLOSSARY_BRIDGE_LEVEL_NAMES[levelIndex] || `Bridge Level ${levelIndex + 1}`;
}

function getGlossaryBridgeTotalSecured(bridge = getGlossaryBridgeState()) {
  const total = buildGlossarySource().length;
  return Math.min(total, (bridge.level * GLOSSARY_BRIDGE_TERMS_PER_LEVEL) + Math.min(bridge.step, bridge.levelTerms.length));
}

function getGlossaryBridgeActiveItem() {
  const bridge = getGlossaryBridgeState();
  if (!bridge.levelTerms.length) return null;
  return bridge.levelTerms[Math.min(bridge.step, bridge.levelTerms.length - 1)] || bridge.levelTerms[0];
}

function getGlossaryBridgeActivePosition(bridge = getGlossaryBridgeState()) {
  if (bridge.levelClear) return GLOSSARY_BRIDGE_PORTAL_POSITION;
  if (bridge.step <= 0) return GLOSSARY_BRIDGE_HOME_POSITION;
  const optionIndex = bridge.levelLocks[bridge.step - 1];
  return getGlossaryBridgePlayerLandingPosition(bridge.step - 1, optionIndex);
}

function getGlossaryBridgeTilePosition(rowIndex, optionIndex) {
  const row = GLOSSARY_BRIDGE_ROWS[rowIndex] || [];
  return row[Math.max(0, Math.min(row.length - 1, Number(optionIndex || 0)))] || row[0] || null;
}

function getGlossaryBridgePlayerLandingPosition(rowIndex, optionIndex) {
  const tile = getGlossaryBridgeTilePosition(rowIndex, optionIndex);
  if (!tile) return GLOSSARY_BRIDGE_HOME_POSITION;
  return {
    x: tile.x,
    y: Math.min(90, tile.y + 13)
  };
}

function getGlossaryBridgeMotionAge(motion) {
  const startedAt = Number(motion?.at || 0);
  return startedAt > 0 ? Date.now() - startedAt : Number.POSITIVE_INFINITY;
}

function isGlossaryBridgeMotionFresh(motion) {
  return Boolean(motion?.kind) && getGlossaryBridgeMotionAge(motion) <= GLOSSARY_BRIDGE_RESULT_MOTION_MS + 180;
}

function clearGlossaryBridgeMotionTimer() {
  if (!glossaryBridgeMotionTimeout) return;
  clearTimeout(glossaryBridgeMotionTimeout);
  glossaryBridgeMotionTimeout = null;
}

function queueGlossaryBridgeMotionClear() {
  clearGlossaryBridgeMotionTimer();
  glossaryBridgeMotionTimeout = setTimeout(() => {
    glossaryBridgeMotionTimeout = null;
    if (!state.answers?.glossaryBridgeMotion) return;
    delete state.answers.glossaryBridgeMotion;
    persistESTProgressSnapshot();
    renderGlossaryStage();
  }, GLOSSARY_BRIDGE_RESULT_MOTION_MS);
}

function getGlossaryBridgePathPoints(bridge = getGlossaryBridgeState()) {
  const points = [{ x: GLOSSARY_BRIDGE_HOME_POSITION.x, y: 87 }];
  const lockedCount = Math.min(bridge.step, bridge.levelTerms.length);
  for (let rowIndex = 0; rowIndex < lockedCount; rowIndex += 1) {
    const tile = getGlossaryBridgeTilePosition(rowIndex, bridge.levelLocks[rowIndex]);
    if (tile) points.push({ x: tile.x, y: tile.y });
  }
  if (bridge.levelClear && points.length > 1) {
    points.push({ x: GLOSSARY_BRIDGE_PORTAL_POSITION.x, y: GLOSSARY_BRIDGE_PORTAL_POSITION.y });
  }
  return points;
}

function renderGlossaryBridgePathSegments(bridge) {
  const points = getGlossaryBridgePathPoints(bridge);
  if (points.length < 2) return "";
  return points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    const dx = next.x - point.x;
    const scaledDy = (next.y - point.y) * GLOSSARY_BRIDGE_PATH_SCALE_Y;
    const length = Math.max(1, Math.sqrt((dx * dx) + (scaledDy * scaledDy)));
    const angle = Math.atan2(scaledDy, dx) * (180 / Math.PI);
    const finalSegment = index === points.length - 2 && bridge.levelClear;
    return `
      <span
        class="glossary-bridge-path-segment ${finalSegment ? "is-portal" : ""}"
        style="--path-x:${point.x}%; --path-y:${point.y}%; --path-length:${length.toFixed(2)}%; --path-angle:${angle.toFixed(2)}deg;"
      ></span>
    `;
  }).join("");
}

function getGlossaryBridgeMotionVector(fromX, fromY, toX, toY) {
  const dx = Number(toX) - Number(fromX);
  const scaledDy = (Number(toY) - Number(fromY)) * GLOSSARY_BRIDGE_PATH_SCALE_Y;
  return {
    angle: Math.atan2(scaledDy, dx) * (180 / Math.PI),
    length: Math.max(6, Math.sqrt((dx * dx) + (scaledDy * scaledDy)))
  };
}

function getGlossaryBridgeCharacterFrames(motionKind, isLevelClear) {
  if (motionKind === "wrong") {
    return [
      GLOSSARY_BRIDGE_ASSETS.characterReady,
      GLOSSARY_BRIDGE_ASSETS.characterReset,
      GLOSSARY_BRIDGE_ASSETS.characterReady
    ];
  }

  if (isLevelClear || motionKind === "clear" || motionKind === "correct") {
    return [
      GLOSSARY_BRIDGE_ASSETS.characterAction,
      GLOSSARY_BRIDGE_ASSETS.characterSuccess,
      GLOSSARY_BRIDGE_ASSETS.characterWelcome
    ];
  }

  if (motionKind) {
    return [
      GLOSSARY_BRIDGE_ASSETS.characterWelcome,
      GLOSSARY_BRIDGE_ASSETS.characterAction
    ];
  }

  return [
    GLOSSARY_BRIDGE_ASSETS.characterReady,
    GLOSSARY_BRIDGE_ASSETS.characterWelcome
  ];
}

function getGlossaryBridgeTileFontSize(title) {
  const length = String(title || "").trim().length;
  if (length >= 26) return "0.56rem";
  if (length >= 21) return "0.61rem";
  if (length >= 16) return "0.68rem";
  if (length >= 12) return "0.76rem";
  return "0.86rem";
}

function buildGlossaryBridgeOptions(item, levelIndex = 0, stepIndex = 0) {
  const source = buildGlossarySource();
  if (!item) return [];
  const sourceIndex = Math.max(0, source.findIndex(candidate => candidate.id === item.id));
  const correctIndex = (sourceIndex + levelIndex + stepIndex) % 3;
  const offsets = [7, 13, 19, 5, 11, 17, 23];
  const distractors = [];

  offsets.forEach(offset => {
    const candidate = source[(sourceIndex + offset) % source.length];
    if (candidate && candidate.id !== item.id && !distractors.some(entry => entry.id === candidate.id)) {
      distractors.push(candidate);
    }
  });
  source.forEach(candidate => {
    if (distractors.length >= 2) return;
    if (candidate.id !== item.id && !distractors.some(entry => entry.id === candidate.id)) {
      distractors.push(candidate);
    }
  });

  const terms = Array(3).fill("");
  terms[correctIndex] = item.term;
  let distractorIndex = 0;
  terms.forEach((term, index) => {
    if (term) return;
    terms[index] = distractors[distractorIndex]?.term || source[(sourceIndex + index + 1) % source.length]?.term || "Review term";
    distractorIndex += 1;
  });

  return terms.map((term, optionIndex) => ({
    value: term,
    title: term,
    optionIndex,
    correct: normaliseGlossaryTermText(term) === normaliseGlossaryTermText(item.term)
  }));
}

function resetGlossaryBridgeLevel() {
  const bridge = getGlossaryBridgeState();
  clearGlossaryBridgeMotionTimer();
  const locks = { ...bridge.locks, [String(bridge.level)]: [] };
  state.answers.glossaryBridgeLocks = locks;
  state.answers.glossaryBridgeStep = 0;
  state.answers.glossaryBridgeLevelClear = false;
  state.answers.glossaryBridgeCompleted = false;
  delete state.answers.glossaryBridgeMotion;
  state.glossaryPulse = `${getGlossaryBridgeLevelName(bridge.level)} rebuilt. Start from the entrance and lock a clean path.`;
  state.glossaryPulseType = "neutral";
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function submitGlossaryBridgeChoiceEncoded(targetId, encodedValue, optionIndexRaw) {
  const bridge = getGlossaryBridgeState();
  if (bridge.levelClear || !bridge.levelTerms.length) return;
  const item = bridge.levelTerms[bridge.step];
  if (!item || item.id !== targetId) return;

  const answer = decodeURIComponent(encodedValue || "");
  const selectedOptionIndex = Math.max(0, Math.min(2, Number(optionIndexRaw || 0)));
  const startPosition = getGlossaryBridgeActivePosition(bridge);
  const selectedPosition = getGlossaryBridgePlayerLandingPosition(bridge.step, selectedOptionIndex);
  const correct = normaliseGlossaryTermText(answer) === normaliseGlossaryTermText(item.term);
  recordGlossaryAttempt(item, answer, correct, "vault-bridge");

  if (correct) {
    const nextStep = Math.min(bridge.levelTerms.length, bridge.step + 1);
    const levelLocks = [...bridge.levelLocks];
    levelLocks[bridge.step] = selectedOptionIndex;
    state.answers.glossaryBridgeLocks = { ...bridge.locks, [String(bridge.level)]: levelLocks };
    state.answers.glossaryBridgeStep = nextStep;
    state.answers.glossaryBridgeLevelClear = nextStep >= bridge.levelTerms.length;
    state.answers.glossaryBridgeCompleted = false;
    state.answers.glossaryBridgeMotion = {
      kind: nextStep >= bridge.levelTerms.length ? "clear" : "correct",
      fromX: startPosition.x,
      fromY: startPosition.y,
      toX: nextStep >= bridge.levelTerms.length ? GLOSSARY_BRIDGE_PORTAL_POSITION.x : selectedPosition.x,
      toY: nextStep >= bridge.levelTerms.length ? GLOSSARY_BRIDGE_PORTAL_POSITION.y : selectedPosition.y,
      step: bridge.step,
      optionIndex: selectedOptionIndex,
      at: Date.now()
    };
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = nextStep >= bridge.levelTerms.length
      ? `${getGlossaryBridgeLevelName(bridge.level)} cleared. The salary portal is opening.`
      : `${item.term} locked. Wrong pieces dropped away; cross to the next row.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Bridge piece locked",
      detail: `${item.term} is secured in the glossary vault path.`
    };
  } else {
    state.answers.glossaryBridgeLocks = { ...bridge.locks, [String(bridge.level)]: [] };
    state.answers.glossaryBridgeStep = 0;
    state.answers.glossaryBridgeLevelClear = false;
    state.answers.glossaryBridgeCompleted = false;
    state.answers.glossaryBridgeMotion = {
      kind: "wrong",
      fromX: selectedPosition.x,
      fromY: selectedPosition.y,
      toX: GLOSSARY_BRIDGE_HOME_POSITION.x,
      toY: GLOSSARY_BRIDGE_HOME_POSITION.y,
      step: bridge.step,
      optionIndex: selectedOptionIndex,
      at: Date.now()
    };
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = `${answer || "That tile"} collapses the bridge. The current level rebuilt from row one.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Bridge rebuilt",
      detail: `${answer || "That answer"} did not match ${item.term}. Start this level again.`
    };
  }

  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
  queueGlossaryBridgeMotionClear();
}

function continueGlossaryBridgeLevel() {
  const bridge = getGlossaryBridgeState();
  if (!bridge.levelClear) return;

  if (bridge.level >= bridge.levels.length - 1) {
    state.answers.glossaryBridgeCompleted = true;
    buildGlossaryCelebration(4, `All ${buildGlossarySource().length} Vault Bridge terms secured.`);
    renderGlossaryStage();
    persistESTProgressSnapshot();
    return;
  }

  const nextLevel = bridge.level + 1;
  clearGlossaryBridgeMotionTimer();
  state.answers.glossaryBridgeLevel = nextLevel;
  state.answers.glossaryBridgeStep = 0;
  state.answers.glossaryBridgeLevelClear = false;
  state.answers.glossaryBridgeCompleted = false;
  delete state.answers.glossaryBridgeMotion;
  state.glossaryPulse = `Level ${nextLevel + 1}: ${getGlossaryBridgeLevelName(nextLevel)} loaded. Five new glossary rows are live.`;
  state.glossaryPulseType = "neutral";
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function clearGlossaryBridgeState() {
  clearGlossaryBridgeMotionTimer();
  delete state.answers.glossaryBridgeLevel;
  delete state.answers.glossaryBridgeStep;
  delete state.answers.glossaryBridgeLocks;
  delete state.answers.glossaryBridgeLevelClear;
  delete state.answers.glossaryBridgeCompleted;
  delete state.answers.glossaryBridgeMotion;
}

function clampGlossaryInvaderNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number(value || 0)));
}

function stopGlossaryInvadersRuntime() {
  if (!glossaryInvadersRuntime) return;
  glossaryInvadersRuntime.stopped = true;
  if (glossaryInvadersRuntime.frameId) {
    cancelAnimationFrame(glossaryInvadersRuntime.frameId);
  }
  glossaryInvadersRuntime = null;
}

function getGlossaryInvaderColor(index) {
  return GLOSSARY_INVADER_COLORS[index % GLOSSARY_INVADER_COLORS.length];
}

function getGlossaryInvaderWaveKey(item, optionSet) {
  return [
    getGlossaryBatchKey(),
    item?.id || "none",
    optionSet.map(option => option.value).join("|")
  ].join("::");
}

function buildGlossaryInvaderStars(item) {
  const seed = getGlossaryStableNumber(item?.id || "invaders");
  return Array.from({ length: 72 }, (_, index) => {
    const xSeed = getGlossaryStableNumber(`${seed}-x-${index}`);
    const ySeed = getGlossaryStableNumber(`${seed}-y-${index}`);
    return {
      x: xSeed % GLOSSARY_INVADER_WIDTH,
      y: ySeed % Math.max(220, GLOSSARY_INVADER_HEIGHT - 90),
      r: 0.7 + ((xSeed + ySeed) % 24) / 18,
      pulse: ((xSeed + index) % 100) / 100
    };
  });
}

function getGlossaryInvaderPressure() {
  const batch = getCurrentGlossaryBatch();
  const assignments = getGlossaryAssignmentsForBatch();
  const clearedInBatch = batch.filter(item => assignments[item.id] === item.id).length;
  const level = Math.min(6, Math.max(1, clearedInBatch + 1));
  const streakLift = Math.min(2, Math.floor(Number(state.glossaryStreak || 0) / 3));
  return {
    level,
    label: `Lv ${level}`,
    speed: 30 + (level * 6) + (streakLift * 3),
    maxSpeed: 72 + (level * 8) + (streakLift * 5),
    edgeGain: 3.5 + (level * 0.7),
    drop: 16 + (level * 2),
    fireDelay: Math.max(0.72, 1.55 - (level * 0.12) - (streakLift * 0.06)),
    fireJitter: Math.max(0.4, 0.95 - (level * 0.06)),
    bulletSpeed: 132 + (level * 18),
    dangerLineY: GLOSSARY_INVADER_PLAYER_Y - 54
  };
}

function createGlossaryInvadersRuntime(canvas, item, optionSet) {
  const pressure = getGlossaryInvaderPressure();
  const alienWidth = optionSet.length > 4 ? 112 : 132;
  const alienGap = optionSet.length > 4 ? 18 : 30;
  const formationWidth = (optionSet.length * alienWidth) + ((optionSet.length - 1) * alienGap);
  const formationLeft = Math.max(72, (GLOSSARY_INVADER_WIDTH - formationWidth) / 2);
  const waveKey = getGlossaryInvaderWaveKey(item, optionSet);
  const aliens = optionSet.map((option, index) => ({
    option,
    index,
    alive: true,
    homeX: formationLeft + (index * (alienWidth + alienGap)),
    homeY: 150,
    w: alienWidth,
    h: 88,
    color: getGlossaryInvaderColor(index),
    type: index % 3
  }));

  return {
    canvas,
    ctx: canvas.getContext("2d"),
    item,
    optionSet,
    waveKey,
    pressure,
    stopped: false,
    locked: false,
    frameId: 0,
    lastTime: 0,
    time: 0,
    keys: { left: false, right: false },
    player: {
      x: GLOSSARY_INVADER_WIDTH / 2,
      y: GLOSSARY_INVADER_PLAYER_Y,
      w: 82,
      h: 44,
      hull: 3,
      hitPulse: 0
    },
    formation: {
      x: 0,
      y: 0,
      direction: 1,
      speed: pressure.speed,
      drop: pressure.drop
    },
    aliens,
    playerBullets: [],
    enemyBullets: [],
    explosions: [],
    shieldActive: false,
    shieldCharge: 100,
    shieldDelay: 0,
    fireCooldown: 0,
    enemyFireTimer: pressure.fireDelay,
    status: `${pressure.label} pressure. Move, shoot, and shield before the row reaches the ship.`,
    stars: buildGlossaryInvaderStars(item)
  };
}

function mountGlossaryInvadersIfNeeded() {
  const canvas = document.getElementById("glossary-invaders-canvas");
  const round = getCurrentGlossaryRound();
  const batch = getCurrentGlossaryBatch();
  const item = getCurrentGlossaryPromptItem(batch);

  if (!canvas || round?.id !== "plain-match" || !item || state.glossaryMode !== "play" || state.glossaryRoundCelebration) {
    stopGlossaryInvadersRuntime();
    return;
  }

  const optionSet = buildGlossaryChallengeOptions(round.id, item, batch);
  const waveKey = getGlossaryInvaderWaveKey(item, optionSet);
  if (glossaryInvadersRuntime?.waveKey === waveKey && glossaryInvadersRuntime.canvas === canvas) return;

  stopGlossaryInvadersRuntime();
  glossaryInvadersRuntime = createGlossaryInvadersRuntime(canvas, item, optionSet);
  updateGlossaryInvaderHud(glossaryInvadersRuntime);
  glossaryInvadersRuntime.frameId = requestAnimationFrame(runGlossaryInvadersFrame);
}

function updateGlossaryInvaderHud(runtime = glossaryInvadersRuntime) {
  if (!runtime) return;
  const hull = document.getElementById("glossary-invader-hull");
  const pace = document.getElementById("glossary-invader-pace");
  const meter = document.getElementById("glossary-invader-forcefield-meter");
  const status = document.getElementById("glossary-invader-status");
  if (hull) hull.textContent = `${runtime.player.hull}/3`;
  if (pace) pace.textContent = runtime.pressure?.label || "Lv 1";
  if (meter) meter.style.width = `${Math.round(runtime.shieldCharge)}%`;
  if (status) status.textContent = runtime.status;
}

function setGlossaryInvaderMove(direction) {
  const runtime = glossaryInvadersRuntime;
  if (!runtime || runtime.locked) return;
  const move = Number(direction || 0);
  runtime.keys.left = move < 0;
  runtime.keys.right = move > 0;
}

function stopGlossaryInvaderMove(direction = 0) {
  const runtime = glossaryInvadersRuntime;
  if (!runtime) return;
  const move = Number(direction || 0);
  if (move < 0) runtime.keys.left = false;
  if (move > 0) runtime.keys.right = false;
  if (!move) {
    runtime.keys.left = false;
    runtime.keys.right = false;
  }
}

function setGlossaryInvaderShield(active) {
  const runtime = glossaryInvadersRuntime;
  if (!runtime || runtime.locked) return;
  runtime.shieldActive = Boolean(active) && runtime.shieldCharge > 2;
  runtime.status = runtime.shieldActive
    ? "Forcefield online. It absorbs shots while the charge lasts."
    : "Forcefield released. Let it recharge before the next volley.";
  updateGlossaryInvaderHud(runtime);
}

function fireGlossaryInvaderPlayerShot() {
  const runtime = glossaryInvadersRuntime;
  if (!runtime || runtime.locked || runtime.fireCooldown > 0) return;
  if (runtime.playerBullets.length >= 2) {
    runtime.status = "Two shots are already in the lane. Track the row and fire again.";
    updateGlossaryInvaderHud(runtime);
    return;
  }
  runtime.playerBullets.push({
    x: runtime.player.x,
    y: runtime.player.y - 34,
    r: 5,
    speed: 560
  });
  runtime.fireCooldown = 0.22;
  runtime.status = "Shot fired. Hit the term creature that matches the definition lock.";
  updateGlossaryInvaderHud(runtime);
}

function fireGlossaryInvaderShipEncoded() {
  fireGlossaryInvaderPlayerShot();
}

function getGlossaryInvaderBounds(runtime, alien) {
  return {
    x: alien.homeX + runtime.formation.x,
    y: alien.homeY + runtime.formation.y,
    w: alien.w,
    h: alien.h
  };
}

function getGlossaryInvaderFormationBounds(runtime) {
  const alive = runtime.aliens.filter(alien => alien.alive);
  if (!alive.length) return { minX: 0, maxX: 0, maxY: 0 };
  return alive.reduce((bounds, alien) => {
    const box = getGlossaryInvaderBounds(runtime, alien);
    return {
      minX: Math.min(bounds.minX, box.x),
      maxX: Math.max(bounds.maxX, box.x + box.w),
      maxY: Math.max(bounds.maxY, box.y + box.h)
    };
  }, { minX: Infinity, maxX: -Infinity, maxY: -Infinity });
}

function triggerGlossaryInvaderEnemyFire(runtime) {
  const alive = runtime.aliens.filter(alien => alien.alive);
  if (!alive.length) return;
  const index = Math.floor(Math.random() * alive.length);
  const alien = alive[index];
  const box = getGlossaryInvaderBounds(runtime, alien);
  runtime.enemyBullets.push({
    x: box.x + (box.w / 2),
    y: box.y + box.h - 12,
    speed: runtime.pressure.bulletSpeed + (runtime.formation.y * 0.16),
    color: alien.color,
    r: 4
  });
  runtime.status = "Incoming term fire. Move or hold Shield to absorb it.";
}

function resolveGlossaryInvaderHit(runtime, alien) {
  if (runtime.locked) return;
  runtime.locked = true;
  runtime.explosions.push({
    x: getGlossaryInvaderBounds(runtime, alien).x + (alien.w / 2),
    y: getGlossaryInvaderBounds(runtime, alien).y + 42,
    color: alien.color,
    age: 0
  });
  alien.alive = false;
  runtime.status = `${alien.option.title} hit. Checking the definition lock...`;
  updateGlossaryInvaderHud(runtime);
  glossaryInvaderShotTimeout = setTimeout(() => {
    glossaryInvaderShotTimeout = null;
    stopGlossaryInvadersRuntime();
    submitGlossaryChallengeChoiceEncoded(runtime.item.id, encodeURIComponent(alien.option.value));
  }, 280);
}

function resetGlossaryInvaderAfterShipHit(reason, options = {}) {
  const runtime = glossaryInvadersRuntime;
  if (!runtime || runtime.locked) return;
  runtime.locked = true;
  const crashType = options.crashType || "ship";
  const crashAnswer = crashType === "base"
    ? "Term row reached the ship"
    : "Ship hit by enemy fire";
  recordGlossaryAttempt(runtime.item, crashAnswer, false, "plain-match");
  state.glossaryMisses += 1;
  state.glossaryStreak = 0;
  state.glossaryPulse = reason || "The ship was hit. Use the forcefield and keep the term row away from the base line.";
  state.glossaryPulseType = "warn";
  runtime.player.hull = crashType === "base" ? 0 : Math.max(0, runtime.player.hull);
  runtime.player.hitPulse = 0.75;
  runtime.status = crashType === "base"
    ? "Crash. The row reached the ship, so this term resets as a miss."
    : "Ship reset. This term stays live, but the miss is recorded.";
  runtime.explosions.push({
    x: runtime.player.x,
    y: runtime.player.y - 32,
    color: "#ff7d7d",
    age: 0
  });
  updateGlossaryInvaderHud(runtime);
  state.recentReward = {
    type: "warning",
    title: crashType === "base" ? "Wave crash" : "Ship reset",
    detail: crashType === "base"
      ? "The row reached the ship. That term is marked as a miss and the wave restarts."
      : "The invader wave restarted. Read the definition, move under the correct term, and fire again."
  };
  renderRewardPulse();
  persistESTProgressSnapshot();
  glossaryInvaderShotTimeout = setTimeout(() => {
    glossaryInvaderShotTimeout = null;
    stopGlossaryInvadersRuntime();
    renderGlossaryStage();
  }, options.delay || 720);
}

function updateGlossaryInvaders(runtime, dt) {
  if (runtime.locked) {
    runtime.explosions.forEach(explosion => {
      explosion.age += dt;
    });
    return;
  }

  runtime.time += dt;
  runtime.fireCooldown = Math.max(0, runtime.fireCooldown - dt);
  runtime.player.hitPulse = Math.max(0, runtime.player.hitPulse - dt);

  const move = (runtime.keys.right ? 1 : 0) - (runtime.keys.left ? 1 : 0);
  runtime.player.x = clampGlossaryInvaderNumber(runtime.player.x + (move * 380 * dt), 52, GLOSSARY_INVADER_WIDTH - 52);

  if (runtime.shieldActive && runtime.shieldCharge > 0) {
    runtime.shieldCharge = Math.max(0, runtime.shieldCharge - (26 * dt));
    runtime.shieldDelay = 0.7;
    if (runtime.shieldCharge <= 0) {
      runtime.shieldActive = false;
      runtime.status = "Forcefield depleted. Dodge while it recharges.";
    }
  } else {
    runtime.shieldDelay = Math.max(0, runtime.shieldDelay - dt);
    if (runtime.shieldDelay <= 0) {
      runtime.shieldCharge = Math.min(100, runtime.shieldCharge + (18 * dt));
    }
  }

  runtime.formation.x += runtime.formation.direction * runtime.formation.speed * dt;
  const bounds = getGlossaryInvaderFormationBounds(runtime);
  if (bounds.minX < 30 || bounds.maxX > GLOSSARY_INVADER_WIDTH - 30) {
    runtime.formation.x += bounds.minX < 30 ? 30 - bounds.minX : (GLOSSARY_INVADER_WIDTH - 30) - bounds.maxX;
    runtime.formation.y += runtime.formation.drop;
    runtime.formation.direction *= -1;
    runtime.formation.speed = Math.min(runtime.pressure.maxSpeed, runtime.formation.speed + runtime.pressure.edgeGain);
    runtime.status = `${runtime.pressure.label}: the row dropped closer. Clear it before it crosses the crash line.`;
  }
  const nextBounds = getGlossaryInvaderFormationBounds(runtime);
  if (nextBounds.maxY > runtime.pressure.dangerLineY) {
    resetGlossaryInvaderAfterShipHit(
      "Crash. The term row reached the ship zone, so that term is marked as a miss and the wave resets.",
      { crashType: "base", delay: 820 }
    );
    return;
  }

  runtime.enemyFireTimer -= dt;
  if (runtime.enemyFireTimer <= 0) {
    triggerGlossaryInvaderEnemyFire(runtime);
    runtime.enemyFireTimer = runtime.pressure.fireDelay + (Math.random() * runtime.pressure.fireJitter);
  }

  runtime.playerBullets.forEach(bullet => {
    bullet.y -= bullet.speed * dt;
  });
  runtime.enemyBullets.forEach(bullet => {
    bullet.y += bullet.speed * dt;
  });

  runtime.playerBullets = runtime.playerBullets.filter(bullet => bullet.y > -20);
  runtime.enemyBullets = runtime.enemyBullets.filter(bullet => bullet.y < GLOSSARY_INVADER_HEIGHT + 30);
  runtime.explosions = runtime.explosions.filter(explosion => explosion.age < 0.5);

  for (const bullet of runtime.playerBullets) {
    const target = runtime.aliens.find(alien => {
      if (!alien.alive) return false;
      const box = getGlossaryInvaderBounds(runtime, alien);
      return bullet.x >= box.x && bullet.x <= box.x + box.w && bullet.y >= box.y && bullet.y <= box.y + box.h;
    });
    if (target) {
      resolveGlossaryInvaderHit(runtime, target);
      return;
    }
  }

  const player = runtime.player;
  runtime.enemyBullets = runtime.enemyBullets.filter(bullet => {
    const dx = bullet.x - player.x;
    const dy = bullet.y - (player.y - 10);
    const shieldHit = runtime.shieldActive && runtime.shieldCharge > 0 && Math.hypot(dx, dy) < 76;
    if (shieldHit) {
      runtime.shieldCharge = Math.max(0, runtime.shieldCharge - 16);
      runtime.status = "Forcefield absorbed the shot.";
      runtime.explosions.push({ x: bullet.x, y: bullet.y, color: "#72f7b8", age: 0 });
      return false;
    }

    const shipHit = bullet.x > player.x - (player.w / 2)
      && bullet.x < player.x + (player.w / 2)
      && bullet.y > player.y - player.h
      && bullet.y < player.y + 12;
    if (!shipHit) return true;

    player.hull -= 1;
    player.hitPulse = 0.42;
    runtime.status = player.hull > 0
      ? "Ship hit. Hold Shield before the next enemy shot."
      : "Ship integrity lost. Restarting this wave.";
    runtime.explosions.push({ x: bullet.x, y: bullet.y, color: "#ff7d7d", age: 0 });
    if (player.hull <= 0) {
      resetGlossaryInvaderAfterShipHit(
        "The ship was hit three times. This term is marked as a miss; shield enemy fire and shoot sooner on the reset.",
        { crashType: "ship", delay: 820 }
      );
    }
    return false;
  });

  updateGlossaryInvaderHud(runtime);
}

function drawGlossaryRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawGlossaryInvaderBackdrop(ctx, runtime) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GLOSSARY_INVADER_HEIGHT);
  gradient.addColorStop(0, "#050916");
  gradient.addColorStop(0.5, "#0a1837");
  gradient.addColorStop(1, "#030713");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GLOSSARY_INVADER_WIDTH, GLOSSARY_INVADER_HEIGHT);

  runtime.stars.forEach(star => {
    const alpha = 0.35 + (Math.sin((runtime.time * 2.4) + (star.pulse * 6.28)) * 0.18);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
    ctx.fillRect(star.x, star.y, star.r, star.r);
  });

  ctx.save();
  ctx.strokeStyle = "rgba(97, 240, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= GLOSSARY_INVADER_WIDTH; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 80, GLOSSARY_INVADER_HEIGHT);
    ctx.stroke();
  }
  for (let y = 44; y < GLOSSARY_INVADER_HEIGHT; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GLOSSARY_INVADER_WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(255, 216, 108, 0.2)";
  ctx.fillRect(0, runtime.pressure.dangerLineY, GLOSSARY_INVADER_WIDTH, 2);
  ctx.fillStyle = "rgba(255, 216, 108, 0.72)";
  ctx.font = "900 11px Outfit, Arial, sans-serif";
  ctx.fillText("CRASH LINE", 30, runtime.pressure.dangerLineY - 8);
  ctx.fillStyle = "rgba(114, 247, 184, 0.12)";
  ctx.fillRect(0, GLOSSARY_INVADER_PLAYER_Y + 22, GLOSSARY_INVADER_WIDTH, 5);
}

function drawGlossaryPixelCreature(ctx, x, y, scale, color, type) {
  const sprites = [
    ["00111100", "01111110", "11011011", "11111111", "00100100", "01000010"],
    ["01000010", "10100101", "11111111", "11011011", "01111110", "00100100"],
    ["00100100", "01111110", "11111111", "10111101", "00111100", "01011010"]
  ];
  const sprite = sprites[type % sprites.length];
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  sprite.forEach((row, rowIndex) => {
    Array.from(row).forEach((cell, colIndex) => {
      if (cell !== "1") return;
      ctx.fillStyle = color;
      ctx.fillRect(x + (colIndex * scale), y + (rowIndex * scale), scale - 1, scale - 1);
    });
  });
  ctx.restore();
}

function getGlossaryCanvasTextLines(ctx, text, maxWidth, maxLines = 2) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach(word => {
    const trial = current ? `${current} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth || !current) {
      current = trial;
      return;
    }
    lines.push(current);
    current = word;
  });
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  while (ctx.measureText(`${kept[maxLines - 1]}...`).width > maxWidth && kept[maxLines - 1].length > 4) {
    kept[maxLines - 1] = kept[maxLines - 1].slice(0, -1);
  }
  kept[maxLines - 1] = `${kept[maxLines - 1]}...`;
  return kept;
}

function drawGlossaryInvaderTargetPanel(ctx, runtime) {
  const panelX = 30;
  const panelY = 62;
  const panelWidth = GLOSSARY_INVADER_WIDTH - 60;
  const panelHeight = 52;
  ctx.save();
  ctx.fillStyle = "rgba(6, 13, 30, 0.88)";
  ctx.strokeStyle = "rgba(255, 216, 108, 0.42)";
  ctx.lineWidth = 1.5;
  drawGlossaryRoundRect(ctx, panelX, panelY, panelWidth, panelHeight, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ffd86c";
  ctx.font = "900 12px Outfit, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("DEFINITION LOCK", panelX + 16, panelY + 10);
  ctx.fillStyle = "#eff8ff";
  ctx.font = "800 14px Outfit, Arial, sans-serif";
  const lines = getGlossaryCanvasTextLines(ctx, runtime.item.definition, panelWidth - 190, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, panelX + 168, panelY + 9 + (index * 17));
  });
  ctx.restore();
}

function drawGlossaryInvaderAlien(ctx, runtime, alien) {
  if (!alien.alive) return;
  const box = getGlossaryInvaderBounds(runtime, alien);
  const centerX = box.x + (box.w / 2);
  const bodyY = box.y + 10;
  const bob = Math.sin(runtime.time * 4) * 2;
  const scale = 8;
  const creatureWidth = 8 * scale;
  drawGlossaryPixelCreature(ctx, centerX - (creatureWidth / 2), bodyY + bob, scale, alien.color, alien.type);

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(5, 12, 28, 0.86)";
  ctx.strokeStyle = `${alien.color}aa`;
  ctx.lineWidth = 1.4;
  drawGlossaryRoundRect(ctx, box.x + 5, box.y + 62, box.w - 10, 34, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#eff8ff";
  ctx.font = "800 13px Outfit, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = getGlossaryCanvasTextLines(ctx, alien.option.title, box.w - 22, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, box.y + 75 + (index * 13));
  });
  ctx.restore();
}

function drawGlossaryInvaderShip(ctx, runtime) {
  const player = runtime.player;
  const x = player.x;
  const y = player.y;
  const hitAlpha = player.hitPulse > 0 ? 0.3 + (Math.sin(runtime.time * 48) * 0.18) : 0;

  ctx.save();
  if (runtime.shieldActive && runtime.shieldCharge > 0) {
    ctx.strokeStyle = "rgba(114, 247, 184, 0.88)";
    ctx.fillStyle = "rgba(114, 247, 184, 0.09)";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#72f7b8";
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.ellipse(x, y - 14, 78, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.shadowColor = "#61f0ff";
  ctx.shadowBlur = 18;
  ctx.fillStyle = hitAlpha ? "#ffb4aa" : "#61f0ff";
  ctx.beginPath();
  ctx.moveTo(x, y - 50);
  ctx.lineTo(x + 40, y + 2);
  ctx.lineTo(x + 18, y + 7);
  ctx.lineTo(x + 8, y - 8);
  ctx.lineTo(x - 8, y - 8);
  ctx.lineTo(x - 18, y + 7);
  ctx.lineTo(x - 40, y + 2);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#06111f";
  ctx.fillRect(x - 6, y - 30, 12, 14);
  ctx.fillStyle = "#ffd86c";
  ctx.fillRect(x - 24, y + 4, 12, 4);
  ctx.fillRect(x + 12, y + 4, 12, 4);
  ctx.restore();
}

function drawGlossaryInvaderProjectiles(ctx, runtime) {
  ctx.save();
  runtime.playerBullets.forEach(bullet => {
    ctx.strokeStyle = "#72f7b8";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#72f7b8";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y + 16);
    ctx.lineTo(bullet.x, bullet.y - 16);
    ctx.stroke();
  });

  runtime.enemyBullets.forEach(bullet => {
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = 4;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y - 10);
    ctx.lineTo(bullet.x, bullet.y + 14);
    ctx.stroke();
  });
  ctx.restore();
}

function drawGlossaryInvaderExplosions(ctx, runtime) {
  runtime.explosions.forEach(explosion => {
    const progress = clampGlossaryInvaderNumber(explosion.age / 0.5, 0, 1);
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.strokeStyle = explosion.color;
    ctx.fillStyle = explosion.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = explosion.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, 10 + (progress * 44), 0, Math.PI * 2);
    ctx.stroke();
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      const length = 14 + (progress * 38);
      ctx.fillRect(
        explosion.x + Math.cos(angle) * length,
        explosion.y + Math.sin(angle) * length,
        5,
        5
      );
    }
    ctx.restore();
  });
}

function drawGlossaryInvaders(runtime) {
  const ctx = runtime.ctx;
  if (!ctx) return;
  ctx.clearRect(0, 0, GLOSSARY_INVADER_WIDTH, GLOSSARY_INVADER_HEIGHT);
  drawGlossaryInvaderBackdrop(ctx, runtime);

  ctx.save();
  ctx.fillStyle = "rgba(255, 216, 108, 0.92)";
  ctx.font = "900 15px Outfit, Arial, sans-serif";
  ctx.fillText("TERM CREATURE FORMATION", 30, 32);
  ctx.fillStyle = "rgba(210, 232, 255, 0.76)";
  ctx.font = "800 12px Outfit, Arial, sans-serif";
  ctx.fillText("Destroy only the term that matches the definition lock", 30, 54);
  ctx.restore();

  drawGlossaryInvaderTargetPanel(ctx, runtime);
  runtime.aliens.forEach(alien => drawGlossaryInvaderAlien(ctx, runtime, alien));
  drawGlossaryInvaderProjectiles(ctx, runtime);
  drawGlossaryInvaderShip(ctx, runtime);
  drawGlossaryInvaderExplosions(ctx, runtime);
}

function runGlossaryInvadersFrame(now) {
  const runtime = glossaryInvadersRuntime;
  if (!runtime || runtime.stopped) return;
  const dt = runtime.lastTime ? Math.min(0.04, (now - runtime.lastTime) / 1000) : 0;
  runtime.lastTime = now;
  updateGlossaryInvaders(runtime, dt);
  drawGlossaryInvaders(runtime);
  if (!runtime.stopped) {
    runtime.frameId = requestAnimationFrame(runGlossaryInvadersFrame);
  }
}

function isGlossaryChoiceCorrect(roundId, item, value) {
  if (!item) return false;
  if (roundId === "signal-slice") {
    return normaliseGlossaryTermText(value) === normaliseGlossaryTermText(getGlossaryCloze(item).keyword);
  }
  if (roundId === "keyword-cloze") {
    return normaliseGlossaryTermText(value) === normaliseGlossaryTermText(getGlossaryCloze(item).keyword);
  }
  return normaliseGlossaryTermText(value) === normaliseGlossaryTermText(item.term);
}

function submitGlossaryChallengeChoiceEncoded(targetId, encodedValue) {
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const item = batch.find(entry => entry.id === targetId);
  if (!item) return;

  const answer = decodeURIComponent(encodedValue || "");
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetId]) return;
  const correct = isGlossaryChoiceCorrect(round.id, item, answer);
  recordGlossaryAttempt(item, answer, correct, round.id);

  if (correct) {
    const cloze = getGlossaryCloze(item);
    assignments[targetId] = targetId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = round.id === "recall"
      ? `${item.term} bridge piece locked. The vault path is stabilising.`
      : round.id === "signal-slice"
        ? `${cloze.keyword} locked into the ${item.term} definition. Nice fast recall.`
      : `${item.term} restored. Another glossary signal is back online.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: `${item.term} is back in the system. Keep the chamber stable and chain the streak.`
    };
  } else {
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = round.id === "term-catch"
      ? "Wrong catch. Track the definition at the bottom and grab the matching term next pass."
      : round.id === "signal-slice"
        ? "Wrong tile. Read the blank out loud and tap the keyword that repairs the definition."
        : round.id === "keyword-cloze"
          ? "Blank mismatch. Read the definition rhythm and try the missing keyword again."
          : round.id === "plain-match"
            ? "Wrong creature. Use the definition lock and shoot the term that matches it."
            : round.id === "recall"
              ? "Wrong bridge piece. Reread the definition and rebuild the safe path."
              : "Signal mismatch. Use the clue feed and restore the right glossary term.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Signal unstable",
      detail: `${answer || "That choice"} did not restore the correct glossary entry.`
    };
  }

  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function flipGlossaryMemoryCardEncoded(encodedCardId) {
  const batch = getCurrentGlossaryBatch();
  const deck = getGlossaryMemoryDeck(batch);
  const cardId = decodeURIComponent(encodedCardId || "");
  const card = deck.find(entry => entry.id === cardId);
  if (!card) return;

  const assignments = { ...getGlossaryAssignmentsForBatch() };
  const openKey = getGlossaryMemoryOpenKey();
  const mismatchKey = getGlossaryMemoryMismatchKey();
  const matchKey = getGlossaryMemoryMatchKey();
  const openCards = Array.isArray(state.answers[openKey]) ? state.answers[openKey] : [];
  const mismatchCards = Array.isArray(state.answers[mismatchKey]) ? state.answers[mismatchKey] : [];
  const matchCards = Array.isArray(state.answers[matchKey]) ? state.answers[matchKey] : [];
  if (assignments[card.itemId] === card.itemId || openCards.includes(card.id) || mismatchCards.length || matchCards.length) return;

  clearGlossaryMemoryResetTimeout();
  const nextOpenCards = [...openCards, card.id].slice(0, 2);
  state.answers[openKey] = nextOpenCards;
  delete state.answers[matchKey];

  if (nextOpenCards.length < 2) {
    state.glossaryPulse = "First card flipped. Choose one more card to test the match.";
    state.glossaryPulseType = "neutral";
    persistESTProgressSnapshot();
    renderGlossaryStage();
    return;
  }

  const [firstCardId, secondCardId] = nextOpenCards;
  const firstCard = deck.find(entry => entry.id === firstCardId);
  const secondCard = deck.find(entry => entry.id === secondCardId);
  if (!firstCard || !secondCard) {
    state.answers[openKey] = [];
    persistESTProgressSnapshot();
    renderGlossaryStage();
    return;
  }

  const isMatch = firstCard.itemId === secondCard.itemId && firstCard.kind !== secondCard.kind;
  const firstItem = batch.find(item => item.id === firstCard.itemId);
  const secondItem = batch.find(item => item.id === secondCard.itemId);

  if (isMatch) {
    const item = firstItem || secondItem;
    const nextAssignments = { ...assignments, [firstCard.itemId]: firstCard.itemId };
    state.answers[matchKey] = nextOpenCards;
    delete state.answers[mismatchKey];
    recordGlossaryAttempt(item, "Matched term and definition", true, "memory-match");
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    const matchedCount = batch.filter(entry => nextAssignments[entry.id] === entry.id).length;
    const boardCleared = matchedCount === batch.length;
    state.glossaryPulse = boardCleared
      ? `Final pair matched: ${item?.term || "glossary pair"}. Read the term and definition together before the reward chamber opens.`
      : `Matched: ${item?.term || "glossary pair"}. Read the term and definition together before the cards clear.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Memory match",
      detail: item ? `${item.term} term and definition matched.` : "Term and definition matched."
    };
    renderRewardPulse();
    persistESTProgressSnapshot();
    renderGlossaryStage();
    glossaryMemoryResetTimeout = setTimeout(() => {
      glossaryMemoryResetTimeout = null;
      state.glossaryAssignments[getGlossaryBatchKey()] = nextAssignments;
      state.answers[openKey] = [];
      delete state.answers[matchKey];

      if (boardCleared) {
        state.glossaryPulse = `Round ${state.glossaryRoundIndex + 1} memory board cleared. Reward chamber opening.`;
        state.glossaryPulseType = "good";
        persistESTProgressSnapshot();
        renderGlossaryStage();
        glossaryMemoryResetTimeout = setTimeout(() => {
          glossaryMemoryResetTimeout = null;
          if (state.glossaryRoundCelebration) return;
          buildGlossaryCelebration(state.glossaryRoundIndex + 1, `${matchedCount}/${batch.length} term-definition pairs matched.`);
          renderGlossaryStage();
        }, 520);
        return;
      }

      state.glossaryPulse = `${item?.term || "Matched pair"} cleared. Flip another term and definition.`;
      state.glossaryPulseType = "good";
      persistESTProgressSnapshot();
      renderGlossaryStage();
    }, 1400);
    return;
  }

  [firstItem, secondItem].filter(Boolean).forEach(item => {
    recordGlossaryAttempt(item, "Memory mismatch", false, "memory-match");
  });
  state.answers[mismatchKey] = nextOpenCards;
  state.glossaryMisses += 1;
  state.glossaryStreak = 0;
  state.glossaryPulse = "Not a match. The two cards will reset, then try another term-definition pair.";
  state.glossaryPulseType = "warn";
  state.recentReward = {
    type: "warning",
    title: "Memory reset",
    detail: "Those two cards do not form a term-definition match."
  };
  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
  glossaryMemoryResetTimeout = setTimeout(() => {
    glossaryMemoryResetTimeout = null;
    state.answers[openKey] = [];
    delete state.answers[mismatchKey];
    delete state.answers[matchKey];
    state.glossaryPulse = "Cards reset. Flip a term and its matching definition.";
    state.glossaryPulseType = "neutral";
    persistESTProgressSnapshot();
    renderGlossaryStage();
  }, 1100);
}

function setGlossarySelectedTerm(termId) {
  const assignments = getGlossaryAssignmentsForBatch();
  const usedTermIds = Object.values(assignments);
  if (usedTermIds.includes(termId)) return;
  state.glossarySelectedTermId = state.glossarySelectedTermId === termId ? "" : termId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossarySelectedSocket(socketId) {
  const assignments = getGlossaryAssignmentsForBatch();
  if (assignments[socketId]) return;
  state.glossarySelectedSocketId = state.glossarySelectedSocketId === socketId ? "" : socketId;
  if (state.glossarySelectedTermId && state.glossarySelectedSocketId) {
    attemptGlossaryMatch(state.glossarySelectedTermId, state.glossarySelectedSocketId);
    return;
  }
  renderGlossaryStage();
}

function setGlossaryMode(mode) {
  state.glossaryMode = mode === "study" ? "study" : "play";
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function moveGlossaryStudy(step) {
  const batch = getCurrentGlossaryBatch();
  if (!batch.length) return;
  const nextIndex = (state.glossaryStudyIndex + step + batch.length) % batch.length;
  state.glossaryStudyIndex = nextIndex;
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function flipGlossaryStudyCard() {
  const currentKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  state.answers[currentKey] = !state.answers[currentKey];
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function resetGlossarySelections() {
  state.glossarySelectedTermId = "";
  state.glossarySelectedSocketId = "";
  state.glossaryDraggedTermId = "";
}

function startGlossaryDrag(termId) {
  state.glossaryDraggedTermId = termId;
  state.glossarySelectedTermId = termId;
  renderGlossaryStage();
}

function endGlossaryDrag() {
  state.glossaryDraggedTermId = "";
  renderGlossaryStage();
}

function getGlossaryRoundEconomy(roundNumber) {
  const glossaryStage = STAGES.find(stage => stage.id === "glossary");
  if (!glossaryStage) return { salary: 0, taxRate: 0 };
  const salary = Math.round((glossaryStage.credits * (0.65 + (roundNumber * 0.1))) / Math.max(1, GLOSSARY_ROUND_CONFIGS.length));
  return { salary, taxRate: glossaryStage.taxRate };
}

function getGlossaryRewardKey(roundNumber, batchIndex = state.glossaryBatchIndex) {
  return `game-${roundNumber}-set-${getSafeGlossaryBatchIndex(batchIndex) + 1}`;
}

function hasGlossaryRewardForRound(roundIndex) {
  const prefix = `game-${roundIndex + 1}-set-`;
  return Object.keys(state.glossaryRoundRewards || {}).some(key => key === String(roundIndex + 1) || key.startsWith(prefix));
}

function formatGlossaryRoundTitle(roundNumber) {
  const summary = getGlossaryMasterySummary();
  return summary.mastered >= summary.masteryTarget
    ? "Every glossary word has been covered."
    : `${GLOSSARY_ROUND_CONFIGS[roundNumber - 1]?.title.replace(/^Round \d+:\s*/, "") || "Glossary game"} cleared. The next term set is ready.`;
}

function buildGlossaryCelebration(roundNumber, scoreText) {
  clearGlossaryTimer();
  const { salary, taxRate } = getGlossaryRoundEconomy(roundNumber);
  const elapsedSeconds = getGlossaryRoundElapsedSeconds();
  const speedBand = getGlossarySpeedBand(elapsedSeconds);
  const precisionBonus = state.glossaryMisses <= 1 ? 300 : state.glossaryMisses <= 4 ? 150 : 0;
  const totalSalary = salary + speedBand.bonus + precisionBonus;
  const tax = Math.round(totalSalary * taxRate);
  const rewardKey = getGlossaryRewardKey(roundNumber);
  const setLabel = getGlossaryBatchLabel();
  const masterySummary = getGlossaryMasterySummary();
  state.salaryBoost += totalSalary;
  state.taxContribution += tax;
  state.glossaryRoundRewards[rewardKey] = { salary: totalSalary, tax, scoreText, elapsedSeconds, speedBand, precisionBonus, roundNumber, batchIndex: state.glossaryBatchIndex };
  state.glossaryRoundCelebration = {
    rewardKey,
    roundNumber,
    batchIndex: state.glossaryBatchIndex,
    setLabel,
    title: formatGlossaryRoundTitle(roundNumber),
    subtitle: masterySummary.mastered >= masterySummary.masteryTarget
      ? "Choose the class tax destination, then finish TERM with all glossary entries recorded."
      : "Choose the class tax destination, then keep using this game or pick another one for the next untested terms.",
    salary: totalSalary,
    tax,
    scoreText,
    elapsedSeconds,
    speedBand,
    precisionBonus
  };
  state.glossaryPulse = `${setLabel} cleared in game ${roundNumber}. Choose where the class community tax should land, then continue the term coverage run.`;
  state.glossaryPulseType = "good";
  state.recentReward = {
    type: "positive",
    title: `Glossary game ${roundNumber} cleared`,
    detail: `${scoreText} • ${speedBand.label} • +${formatCurrency(totalSalary)} salary • +${formatCurrency(tax)} community tax`
  };
  state.debriefLog.push({
    title: `Glossary game ${roundNumber} cleared`,
    detail: `${scoreText} • ${formatSecondsAsClock(elapsedSeconds)} • ${formatCurrency(totalSalary)} salary earned • ${formatCurrency(tax)} ready for community allocation`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `glossary-game-${roundNumber}`,
    label: `EST glossary game ${roundNumber}`,
    detail: `${scoreText} • ${speedBand.label}`,
    earnedDelta: totalSalary,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function setGlossaryRoundVote(optionId) {
  if (!state.glossaryRoundCelebration) return;
  const voteKey = state.glossaryRoundCelebration.rewardKey || getGlossaryRewardKey(state.glossaryRoundCelebration.roundNumber);
  state.glossaryRoundVotes[voteKey] = optionId;
  setGlossaryCommunityAssetReady(voteKey, false);
  const option = (state.stageDeck?.communityOptions || []).find(item => item.id === optionId);
  state.glossaryPulse = `${option?.label || "Community asset"} is growing from the class tax contribution.`;
  state.glossaryPulseType = "good";
  clearGlossaryCommunityAssetTimeout();
  glossaryCommunityAssetTimeout = setTimeout(() => {
    glossaryCommunityAssetTimeout = null;
    setGlossaryCommunityAssetReady(voteKey, true);
    state.glossaryPulse = "Community asset built. Continue this game, pick another game, or return to the lab.";
    state.glossaryPulseType = "good";
    renderGlossaryStage();
  }, getGlossaryCommunityAssetDelay());
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

async function continueGlossaryRound() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return;
  const voteKey = celebration.rewardKey || getGlossaryRewardKey(celebration.roundNumber, celebration.batchIndex);
  const voteValue = state.glossaryRoundVotes[voteKey];
  if (!voteValue) {
    state.glossaryPulse = "Choose a class tax destination before you continue the memory run.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Choose a tax destination",
      detail: "Select one community option first so the game reward knows where the class tax should go."
    };
    renderRewardPulse();
    renderGlossaryStage();
    return;
  }
  state.answers[`glossaryVote-${voteKey}`] = voteValue;
  clearGlossaryCommunityAssetTimeout();
  setGlossaryCommunityAssetReady(voteKey, true);
  const masterySummary = getGlossaryMasterySummary();
  const allTermsSecure = masterySummary.mastered >= masterySummary.masteryTarget;
  state.glossaryRoundCelebration = null;
  state.glossarySelectedTermId = "";
  state.glossaryDraggedTermId = "";
  if (allTermsSecure) {
    await bankGlossaryResults();
    return;
  }
  state.glossaryBatchIndex = (getSafeGlossaryBatchIndex(celebration.batchIndex) + 1) % getGlossaryBatchCount();
  ensureGlossaryAdaptiveBatch({ force: true });
  if (getCurrentGlossaryRound()?.id === "recall") {
    clearGlossaryBridgeState();
    resetGlossaryBridgeSource();
  }
  state.glossaryPulse = `${getGlossaryBatchLabel()} loaded. Untested terms are prioritised before any repeats.`;
  state.glossaryPulseType = "neutral";
  startGlossaryRoundTimer(true);
  renderGlossaryStage();
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function returnToLab() {
  clearGlossaryCommunityAssetTimeout();
  setLabMode(false);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  state.selectedStageId = null;
  state.stageActiveSeconds = 0;
  state.stageActiveLastAt = 0;
  state.contentGroupIndex = -1;
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  state.glossaryRoundStartedAt = 0;
  state.glossaryRoundActiveSeconds = 0;
  state.glossaryRoundLastAt = 0;
  clearGlossaryTimer();
  syncMissionMode();
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Return from the glossary mission and keep building your EST run.");
  renderStageRoot(`
    <div class="empty-state">
      <p>Back in the EST Lab. Re-enter any stage when you're ready.</p>
    </div>
  `);
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function attemptGlossaryMatch(termId, targetTermId) {
  if (!termId) return;
  const batch = getCurrentGlossaryBatch();
  const assignments = { ...getGlossaryAssignmentsForBatch() };
  if (assignments[targetTermId]) return;
  const draggedTerm = batch.find(item => item.id === termId);
  const targetTerm = batch.find(item => item.id === targetTermId);
  if (!draggedTerm || !targetTerm) return;
  const correct = termId === targetTermId;
  recordGlossaryAttempt(targetTerm, draggedTerm.term, correct, "definition-match");

  if (correct) {
    assignments[targetTermId] = termId;
    state.glossaryAssignments[getGlossaryBatchKey()] = assignments;
    resetGlossarySelections();
    state.glossaryStreak += 1;
    state.glossaryBestStreak = Math.max(state.glossaryBestStreak, state.glossaryStreak);
    state.glossaryPulse = `${targetTerm.term} matched. The blueprint wall is lighting up.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct match",
      detail: `${targetTerm.term} has been locked in. Keep matching to complete the blueprint.`
    };
  } else {
    resetGlossarySelections();
    state.glossaryMisses += 1;
    state.glossaryStreak = 0;
    state.glossaryPulse = "Try again. That term piece does not fit this definition socket.";
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Try again",
      detail: `${draggedTerm.term} does not match that definition. Re-check the clue.`
    };
  }

  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function dropGlossaryTerm(event, targetTermId) {
  event.preventDefault();
  attemptGlossaryMatch(state.glossaryDraggedTermId || state.glossarySelectedTermId, targetTermId);
}

function handleGlossarySocketClick(targetTermId) {
  setGlossarySelectedSocket(targetTermId);
}

function isGlossaryBatchMatched() {
  const batch = getCurrentGlossaryBatch();
  const assignments = getGlossaryAssignmentsForBatch();
  return batch.length && batch.every(item => assignments[item.id] === item.id);
}

function moveToNextGlossaryBatchOrRound() {
  if (state.glossaryRoundCelebration) return;
  clearGlossaryMemoryResetTimeout();
  const completedRound = state.glossaryRoundIndex + 1;
  buildGlossaryCelebration(completedRound, `${getCurrentGlossaryBatch().length}/${getCurrentGlossaryBatch().length} term-definition pairs matched.`);
  renderGlossaryStage();
}

function nextGlossaryPhase() {
  if (!isGlossaryBatchMatched()) return;
  moveToNextGlossaryBatchOrRound();
}

function setGlossaryRecallAnswer(key, value) {
  state.glossaryRecallAnswers[key] = value;
  persistESTProgressSnapshot();
}

function setGlossaryRecallChoiceEncoded(key, encodedValue) {
  state.glossaryRecallAnswers[key] = decodeURIComponent(encodedValue || "");
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function triggerGlossaryRecallAdvance(item, selectedKeyword, batch) {
  clearGlossaryRecallAdvanceTimeout();
  state.glossaryRecallTransition = {
    itemId: item.id,
    title: item.term,
    keyword: selectedKeyword,
    nextIndex: Math.min(batch.length - 1, state.glossaryRecallIndex + 1),
    finished: batch.every(entry => entry.id === item.id || state.glossaryRecallResults[entry.id]?.overallCorrect)
  };
  renderGlossaryStage();
  glossaryRecallAdvanceTimeout = setTimeout(() => {
    state.glossaryRecallIndex = state.glossaryRecallTransition?.nextIndex ?? state.glossaryRecallIndex;
    state.glossaryRecallTransition = null;
    renderGlossaryStage();
  }, 950);
}

function setGlossaryRecallTermChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const selectedTerm = decodeURIComponent(encodedValue || "");
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const correct = normaliseGlossaryTermText(selectedTerm) === normaliseGlossaryTermText(item.term);
  recordGlossaryAttempt(item, selectedTerm, correct, "recall-term");

  state.glossaryRecallAnswers[termKey] = selectedTerm;
  delete state.glossaryRecallAnswers[keywordKey];

  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: correct,
    keywordCorrect: false,
    overallCorrect: false
  };

  if (correct) {
    state.glossaryPulse = `${item.term} restored. Now recover one keyword that belongs with it.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Correct term restored",
      detail: "Good catch. Finish the signal by choosing one keyword that genuinely belongs to this term."
    };
  } else {
    state.glossaryPulse = `${selectedTerm} is not the right term for this signal. Try another term before moving on.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong term",
      detail: "That term does not match the keyword trail. Step 2 will stay locked until the correct term is chosen."
    };
  }

  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function setGlossaryRecallKeywordChoiceEncoded(itemId, encodedValue) {
  clearGlossaryRecallAdvanceTimeout();
  const batch = getCurrentGlossaryBatch();
  const item = batch.find(entry => entry.id === itemId);
  if (!item) return;

  const termResult = state.glossaryRecallResults[item.id];
  if (!termResult?.termCorrect) {
    state.glossaryPulse = "Choose the correct term first. The repair token only unlocks after Step 1 is right.";
    state.glossaryPulseType = "warn";
    renderGlossaryStage();
    return;
  }

  const selectedKeyword = decodeURIComponent(encodedValue || "");
  const keywordKey = `keyword-${item.id}`;
  const keywordCorrect = item.keywords.some(keyword => normaliseGlossaryTermText(selectedKeyword).includes(normaliseGlossaryTermText(keyword)));
  recordGlossaryAttempt(item, selectedKeyword, keywordCorrect, "recall-keyword");

  state.glossaryRecallAnswers[keywordKey] = selectedKeyword;
  state.glossaryRecallResults[item.id] = {
    ...(state.glossaryRecallResults[item.id] || {}),
    term: item.term,
    keywords: item.keywords,
    termCorrect: true,
    keywordCorrect,
    overallCorrect: keywordCorrect
  };

  if (keywordCorrect) {
    state.glossaryPulse = `${selectedKeyword} locked in. Signal ${state.glossaryRecallIndex + 1} is restored.`;
    state.glossaryPulseType = "good";
    state.recentReward = {
      type: "positive",
      title: "Signal restored",
      detail: "Both steps are correct. Move to the next signal core."
    };
    triggerGlossaryRecallAdvance(item, selectedKeyword, batch);
  } else {
    state.glossaryPulse = `${selectedKeyword} does not belong with ${item.term}. Try a different repair token.`;
    state.glossaryPulseType = "warn";
    state.recentReward = {
      type: "warning",
      title: "Wrong repair token",
      detail: "The term is right, but the keyword is not. Try another token for this same signal."
    };
  }

  renderRewardPulse();
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function getGlossaryStabilityPercent() {
  return getGlossaryMasterySummary().masteryTargetPercent;
}

function getGlossaryRoundName(roundIndex) {
  return GLOSSARY_ROUND_CONFIGS[roundIndex]?.title.replace(/^Round \d+:\s*/, "") || "Glossary game";
}

function getGlossaryRoundTheme(roundIndex) {
  const round = GLOSSARY_ROUND_CONFIGS[roundIndex] || GLOSSARY_ROUND_CONFIGS[0];
  const fallbackThemes = ["aqua", "violet", "emerald", "solar"];
  return GLOSSARY_MEMORY_THEMES[round?.theme || fallbackThemes[roundIndex % fallbackThemes.length]] || GLOSSARY_MEMORY_THEMES.aqua;
}

function buildGlossaryRoundThemeStyle(roundIndex) {
  const theme = getGlossaryRoundTheme(roundIndex);
  return [
    `--game-accent:${theme.accent};`,
    `--game-accent-2:${theme.accent2};`,
    `--game-tint:${theme.tint};`
  ].join("");
}

function getGlossarySetRewardKey(roundIndex, batchIndex) {
  return `game-${roundIndex + 1}-set-${getSafeGlossaryBatchIndex(batchIndex) + 1}`;
}

function hasGlossaryRewardForSet(roundIndex, batchIndex) {
  return Boolean(state.glossaryRoundRewards?.[getGlossarySetRewardKey(roundIndex, batchIndex)]);
}

function getGlossaryRoundSetProgress(roundIndex) {
  const total = getGlossaryBatchCount();
  const completed = Array.from({ length: total }, (_, index) => index)
    .filter(index => hasGlossaryRewardForSet(roundIndex, index))
    .length;
  return {
    completed,
    total,
    allComplete: total > 0 && completed >= total,
    hasProgress: completed > 0
  };
}

function getGlossaryRoundBadge(roundIndex) {
  const progress = getGlossaryRoundSetProgress(roundIndex);
  if (progress.allComplete) return "Complete";
  if (state.glossaryRoundIndex === roundIndex && !state.glossaryRoundCelebration) return "Playing";
  if (progress.hasProgress) return `${progress.completed}/${progress.total} sets`;
  if (state.completed.glossary) return "Replay";
  return "Choose";
}

function isGlossaryRoundUnlocked(roundIndex) {
  return roundIndex >= 0 && roundIndex < GLOSSARY_ROUND_CONFIGS.length;
}

function renderGlossaryMasterySnapshot() {
  const summary = getGlossaryMasterySummary();
  return `
    <div class="glossary-mastery-strip">
      <article>
        <span>Secure terms</span>
        <strong>${summary.mastered}/${summary.total}</strong>
      </article>
      <article>
        <span>Untested</span>
        <strong>${summary.untested}</strong>
      </article>
      <article>
        <span>Overall accuracy</span>
        <strong>${summary.accuracyPercent}%</strong>
      </article>
      <article>
        <span>Total reps</span>
        <strong>${summary.attempts}</strong>
      </article>
    </div>
  `;
}

function renderGlossaryMemoryLedger() {
  const summary = getGlossaryMasterySummary();
  const recentRows = summary.rows
    .filter(row => row.tested > 0)
    .sort((a, b) => {
      const bTime = Date.parse(b.stat.lastTestedAt || "");
      const aTime = Date.parse(a.stat.lastTestedAt || "");
      return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
    })
    .slice(0, 5);
  if (!recentRows.length) {
    return `
      <div class="glossary-signal-feed glossary-memory-ledger">
        <div class="kicker">Memory ledger</div>
        <p>No glossary reps logged yet. Every answer will be counted against the term, the answer chosen, and whether it stuck.</p>
      </div>
    `;
  }
  return `
    <div class="glossary-signal-feed glossary-memory-ledger">
      <div class="kicker">Memory ledger</div>
      ${recentRows.map(row => {
        const percent = Math.round(row.accuracy * 100);
        return `
          <div class="glossary-ledger-row">
            <strong>${escapeHtml(row.item.term)}</strong>
            <span>${row.correct}/${row.tested} correct • ${percent}%</span>
            <small>Last: ${escapeHtml(row.stat.lastAnswer || "No answer")} ${row.stat.lastCorrect ? "correct" : "needs another rep"}</small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function getGlossaryMemoryStatus(row) {
  if (!row.tested) return { label: "New", className: "new" };
  if (row.isMastered) return { label: "Secure", className: "strong" };
  if (row.accuracy >= 0.6) return { label: "Building", className: "building" };
  return { label: "Needs rep", className: "needs-rep" };
}

function renderGlossaryMemoryBankPanel(activeItem = null) {
  const summary = getGlossaryMasterySummary();
  const batchIds = new Set(getCurrentGlossaryBatch().map(item => item.id));
  const alphabeticalRows = [...summary.rows].sort((a, b) => {
    return a.item.term.localeCompare(b.item.term, undefined, { sensitivity: "base" });
  });
  return `
    <aside class="glossary-memory-bank" aria-label="Glossary memory bank">
      <div class="glossary-memory-bank-head">
        <div>
          <div class="kicker">Memory bank</div>
          <h3>${summary.mastered}/${summary.total} secure</h3>
        </div>
        <strong>${summary.masteryTargetPercent}%</strong>
      </div>
      <div class="glossary-memory-bank-meters">
        <span style="--meter:${summary.masteryTargetPercent}%;">All terms ${summary.mastered}/${summary.masteryTarget}</span>
        <span style="--meter:${summary.accuracyPercent}%;">Accuracy</span>
      </div>
      <div class="glossary-memory-bank-stats">
        <span>${summary.tested}/${summary.total} tested</span>
        <span>${summary.attempts} reps</span>
        <span>A-Z: ${summary.total} terms</span>
      </div>
      <div class="glossary-memory-bank-list">
        ${alphabeticalRows.map((row, index) => {
          const status = getGlossaryMemoryStatus(row);
          const percent = row.tested ? Math.round(row.accuracy * 100) : 0;
          const active = activeItem?.id === row.item.id;
          const inBatch = batchIds.has(row.item.id);
          return `
            <article class="glossary-bank-row ${active ? "active" : ""} ${inBatch ? "in-batch" : ""}">
              <div class="glossary-bank-row-top">
                <span class="glossary-bank-number">${String(index + 1).padStart(2, "0")}</span>
                <strong>${escapeHtml(row.item.term)}</strong>
                <em class="glossary-bank-status glossary-bank-status--${status.className}">${escapeHtml(status.label)}</em>
              </div>
              <p>${escapeHtml(clampText(row.item.definition, 72))}</p>
              <div class="glossary-bank-row-foot">
                <span>${row.correct}/${row.tested} correct</span>
                <span>${percent}%</span>
              </div>
              <div class="glossary-bank-mini-track" aria-hidden="true">
                <span style="width:${percent}%;"></span>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </aside>
  `;
}

function renderGlossaryMissionFrame(mainHtml, activeItem = null) {
  return `
    <div class="glossary-game-layout">
      ${renderGlossaryMemoryBankPanel(activeItem)}
      <main class="glossary-game-main">
        ${mainHtml}
      </main>
    </div>
  `;
}

function renderGlossaryRoundVisual(roundId, item) {
  const image = GLOSSARY_VISUAL_ASSETS[roundId] || GLOSSARY_VISUAL_ASSETS["colour-shape"];
  const keywords = (item?.keywords || []).slice(0, 4);
  return `
    <div class="glossary-visual-stage glossary-visual-stage--${escapeHtml(roundId)}" aria-hidden="true">
      <img src="${escapeHtml(image)}" alt="">
      <span class="glossary-scan-line"></span>
      <span class="glossary-orbit glossary-orbit--one"></span>
      <span class="glossary-orbit glossary-orbit--two"></span>
      <div class="glossary-visual-tokens">
        ${keywords.map(keyword => `<span>${escapeHtml(keyword)}</span>`).join("")}
      </div>
    </div>
  `;
}

function getGlossaryGuideCopy(roundId, item) {
  const term = item?.term || "this term";
  const copy = {
    "memory-match": {
      title: "Match term to meaning",
      body: `Flip two cards and find the definition that belongs with ${term}. Matched pairs disappear; misses reset.`
    },
    "term-catch": {
      title: "Catch the right term",
      body: `Watch the falling options. The definition points toward ${term}; catch it before the memory road resets.`
    },
    "signal-slice": {
      title: "Fill the blank fast",
      body: `The vault hides one keyword from ${term}. Tap the moving tile that repairs the definition before the rhythm resets.`
    },
    "colour-shape": {
      title: "Scan the clue trail",
      body: `Start with cues. The keywords point toward ${term}, and the same term will come back with less support.`
    },
    "keyword-cloze": {
      title: "Fill the blank fast",
      body: `Cloze practice is the memory workout. Read the definition rhythm, predict the keyword, then choose it.`
    },
    "plain-match": {
      title: "Shoot the right term",
      body: `Now the definition is the target lock. Fire at the moving term ship that matches the meaning.`
    },
    recall: {
      title: "Cross the vault bridge",
      body: `Choose the bridge piece holding ${term}. Correct answers lock the path; a wrong answer rebuilds only the current level.`
    },
    study: {
      title: "Look, cover, retrieve",
      body: "Flip the card, look away, say the meaning, then check. Small reps beat one giant read-through."
    },
    reward: {
      title: "Precision banked",
      body: "That round added precision income and class tax. The next set will bring back weaker terms for another memory pass."
    }
  };
  return copy[roundId] || copy["colour-shape"];
}

function renderGlossarySceneGuide(roundId, item, tags = []) {
  const guide = getGlossaryGuideCopy(roundId, item);
  const image = GLOSSARY_GUIDE_ASSETS[roundId] || GLOSSARY_GUIDE_ASSETS["colour-shape"];
  const sceneTags = tags.length ? tags : ["Cue", "Choice", "Feedback", "Repeat"];
  return `
    <aside class="glossary-guide-panel glossary-guide-panel--${escapeHtml(roundId)}">
      <div class="glossary-guide-art">
        <img src="${escapeHtml(image)}" alt="Glossary guide character">
        <span class="glossary-guide-signal"></span>
      </div>
      <div class="glossary-guide-copy">
        <div class="kicker">Lexicon coach</div>
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(guide.body)}</p>
        <div class="glossary-scene-tags">
          ${sceneTags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderGlossaryChamberRail() {
  return `
    <div class="glossary-chamber-rail">
      ${GLOSSARY_ROUND_CONFIGS.map((round, index) => {
        const status = getGlossaryRoundBadge(index);
        const active = state.glossaryRoundIndex === index && !state.glossaryRoundCelebration;
        const progress = getGlossaryRoundSetProgress(index);
        const complete = progress.allComplete;
        const unlocked = isGlossaryRoundUnlocked(index);
        const roundName = getGlossaryRoundName(index);
        return `
          <button
            type="button"
            class="glossary-chamber-card ${active ? "active" : ""} ${progress.hasProgress ? "has-progress" : ""} ${complete ? "complete" : ""} ${unlocked ? "" : "locked"}"
            style="${buildGlossaryRoundThemeStyle(index)}"
            ${unlocked ? `onclick="window.ESTPrep.jumpToGlossaryRound(${index})"` : "disabled"}
          >
            <div class="glossary-chamber-index">0${index + 1}</div>
            <strong>${escapeHtml(roundName)}</strong>
            <p>${escapeHtml(round.cue)}</p>
            <span class="glossary-chamber-status">${escapeHtml(status)}</span>
            <span class="glossary-chamber-progress">${progress.completed}/${progress.total} sets</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderGlossarySetRail() {
  const count = getGlossaryBatchCount();
  const roundIndex = state.glossaryRoundIndex;
  const roundName = getGlossaryRoundName(roundIndex);
  const progress = getGlossaryRoundSetProgress(roundIndex);
  return `
    <section
      class="glossary-game-set-panel ${progress.allComplete ? "complete" : ""}"
      style="${buildGlossaryRoundThemeStyle(roundIndex)}"
      aria-label="${escapeHtml(`${roundName} set selector`)}"
    >
      <div class="glossary-set-heading">
        <div>
          <span>Sets for this game</span>
          <strong>${escapeHtml(roundName)}</strong>
        </div>
        <em>${progress.completed}/${progress.total} complete</em>
      </div>
      <div class="glossary-set-rail">
        ${Array.from({ length: count }, (_, index) => {
          const active = getSafeGlossaryBatchIndex() === index;
          const complete = hasGlossaryRewardForSet(roundIndex, index);
          return `
            <button
              type="button"
              class="glossary-set-chip ${active ? "active" : ""} ${complete ? "complete" : ""}"
              onclick="window.ESTPrep.jumpToGlossarySet(${index})"
            >
              <strong>Set ${index + 1}</strong>
              <span>${active ? "Current" : complete ? "Complete" : "Choose"}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function jumpToGlossaryRound(roundIndex) {
  if (!isGlossaryRoundUnlocked(roundIndex)) return;
  if (state.glossaryRoundIndex === roundIndex && !state.glossaryRoundCelebration) return;
  state.glossaryRoundIndex = roundIndex;
  state.glossaryRoundCelebration = null;
  clearGlossaryRoundState(roundIndex);
  ensureGlossaryAdaptiveBatch({ force: true });
  if (GLOSSARY_ROUND_CONFIGS[roundIndex]?.id === "recall") resetGlossaryBridgeSource();
  state.glossaryPulse = GLOSSARY_ROUND_CONFIGS[roundIndex]?.cue || "";
  state.glossaryPulseType = "neutral";
  state.glossaryMode = "play";
  startGlossaryRoundTimer(true);
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function jumpToGlossarySet(batchIndex) {
  const nextIndex = getSafeGlossaryBatchIndex(batchIndex);
  if (state.glossaryBatchIndex === nextIndex && !state.glossaryRoundCelebration) return;
  state.glossaryBatchIndex = nextIndex;
  state.glossaryRoundCelebration = null;
  ensureGlossaryAdaptiveBatch({ force: true });
  clearGlossaryBridgeState();
  resetGlossaryBridgeSource();
  state.glossaryPulse = `${getGlossaryBatchLabel()} loaded. Untested terms are dealt first; secure terms wait until the untouched words are gone.`;
  state.glossaryPulseType = "neutral";
  state.glossaryMode = "play";
  startGlossaryRoundTimer(true);
  persistESTProgressSnapshot();
  renderGlossaryStage();
}

function buildRecallTermOptions(item) {
  const distractors = pickRandom(
    buildGlossarySource().filter(candidate => candidate.id !== item.id).map(candidate => candidate.term),
    3
  );
  return shuffle([item.term, ...distractors]);
}

function buildRecallKeywordOptions(item) {
  const keywordPool = buildGlossarySource()
    .filter(candidate => candidate.id !== item.id)
    .flatMap(candidate => candidate.keywords);
  const distractors = pickRandom([...new Set(keywordPool.filter(keyword => !item.keywords.includes(keyword)))], 3);
  return shuffle([item.keywords[0], ...distractors]);
}

function renderGlossaryRecallForge(batch, batchNumber, totalBatches) {
  const readyCores = batch.filter(item => {
    return Boolean(state.glossaryRecallResults[item.id]?.overallCorrect);
  }).length;
  const firstIncompleteIndex = batch.findIndex(item => !state.glossaryRecallResults[item.id]?.overallCorrect);
  const activeIndex = firstIncompleteIndex >= 0
    ? firstIncompleteIndex
    : Math.max(0, Math.min(state.glossaryRecallIndex, batch.length - 1));
  const item = batch[activeIndex];
  if (!item) return "";
  const termKey = `term-${item.id}`;
  const keywordKey = `keyword-${item.id}`;
  const selectedTerm = state.glossaryRecallAnswers[termKey] || "";
  const selectedKeyword = state.glossaryRecallAnswers[keywordKey] || "";
  const recallResult = state.glossaryRecallResults[item.id] || {};
  const termSelected = Boolean(selectedTerm);
  const termCorrect = Boolean(recallResult.termCorrect);
  const keywordSelected = Boolean(selectedKeyword);
  const keywordCorrect = Boolean(recallResult.keywordCorrect);
  const termOptions = buildRecallTermOptions(item);
  const keywordOptions = buildRecallKeywordOptions(item);
  const transition = state.glossaryRecallTransition;
  const showingTransition = Boolean(transition && transition.itemId === item.id);
  return `
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>Vault Bridge</h3>
          <p class="small-copy">This game turns recognition into retrieval. Restore each term signal, then restore one key concept from memory.</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Bridge recall</span>
          <span class="badge">Target all terms secure</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.startNewGlossaryPracticeRun()">New timed set</button>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Save and return</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      <div class="glossary-game-layout">
        ${renderGlossaryMemoryBankPanel(item)}
        <main class="glossary-game-main">
      ${renderGlossarySceneGuide("recall", item, ["Retrieve", "Confirm", "Keyword", "Lock"])}
      <div class="glossary-escape-console">
        <div class="glossary-stability-card">
          ${renderGlossaryRoundVisual("recall", item)}
          <div class="kicker">Lab stability</div>
          <strong>${getGlossaryStabilityPercent()}% restored</strong>
          <div class="glossary-progress-track" aria-hidden="true">
            <div class="glossary-progress-bar" style="width:${getGlossaryStabilityPercent()}%;"></div>
          </div>
          <p>Every restored signal banks more salary, more tax contribution, and clearer EST vocabulary under pressure.</p>
        </div>
        <div class="glossary-signal-feed">
          <div class="kicker">Forge rules</div>
          <p><strong>Step 1:</strong> Read the keyword trail and choose the correct term.</p>
          <p><strong>Step 2:</strong> Only if Step 1 is correct, choose one keyword that genuinely belongs to that term.</p>
          <p><strong>Step 3:</strong> Once both are right, the forge moves you to the next signal core.</p>
        </div>
      </div>
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>How to clear Vault Bridge</h2>
          <p>${readyCores}/${batch.length} signal cores fully locked</p>
        </div>
        <p class="small-copy">Work one signal at a time. A wrong term stops the sequence. A correct term unlocks the repair token step.</p>
      </div>
      ${showingTransition ? `
        <div class="feedback-box good glossary-recall-celebration">
          <p><strong>Signal restored:</strong> ${escapeHtml(transition.title)}</p>
          <p>${escapeHtml(transition.keyword)} locked in. ${transition.finished ? "All signal cores are online. Restore the system when you're ready." : "Advancing to the next signal core..."}</p>
        </div>
      ` : ""}
      <div class="glossary-recall-grid">
        <article class="panel glossary-recall-card">
          <div class="sample-meta">
            <strong>Signal core ${activeIndex + 1}</strong>
            <span>${readyCores === batch.length ? "All signals restored" : readyCores > activeIndex ? "Signal already restored" : "Active signal"}</span>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 1: keyword trail</div>
            <p>${escapeHtml(item.keywords.join(" • "))}</p>
            <div class="choice-grid">
              ${termOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedTerm === option ? `selected live-selected ${termCorrect ? "correct" : "incorrect"}` : ""}"
                  onclick="window.ESTPrep.setGlossaryRecallTermChoiceEncoded('${item.id}', '${encodeForInlineHandler(option)}')"
                  ${showingTransition ? "disabled" : ""}
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="glossary-recall-block">
            <div class="kicker">Step 2: repair token</div>
            <p>${termCorrect
              ? `Good. Now choose one keyword that genuinely belongs with <strong>${escapeHtml(item.term)}</strong>.`
              : termSelected
                ? `That term is wrong. Fix Step 1 before trying the repair token.`
                : "Choose the correct term first. Then the repair token step unlocks."}</p>
            <div class="choice-grid">
              ${keywordOptions.map(option => `
                <button
                  type="button"
                  class="choice-button ${selectedKeyword === option ? `selected live-selected ${keywordCorrect ? "correct" : "incorrect"}` : ""}"
                  ${(termCorrect && !showingTransition) ? "" : "disabled"}
                  onclick="window.ESTPrep.setGlossaryRecallKeywordChoiceEncoded('${item.id}', '${encodeForInlineHandler(option)}')"
                >
                  <strong>${escapeHtml(option)}</strong>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="badge-row">
            <span class="badge">${termCorrect ? "Step 1 correct" : termSelected ? "Step 1 incorrect" : "Choose a term"}</span>
            <span class="badge">${keywordCorrect ? "Step 2 correct" : keywordSelected ? "Step 2 incorrect" : "Choose a keyword"}</span>
          </div>
        </article>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Forge exit</strong>
        <p class="small-copy">Restore one signal core at a time. When all 4 are correct, restore the system to bank the final salary, tax contribution, and mastery save.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.submitGlossary()" ${readyCores === batch.length ? "" : "disabled"}>${batchNumber === totalBatches ? "Restore System" : "Lock Next Recall Batch"}</button>
      </div>
        </main>
      </div>
    </div>
  `;
}

function renderGlossaryCatchGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent) {
  const guideImage = GLOSSARY_GUIDE_ASSETS["term-catch"];
  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-catch-shell">
      <div class="section-title">
        <h2>Termfall Dash</h2>
        <p>${matchedCount}/${batch.length} terms caught in this set</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-catch-game">
        <div class="glossary-catch-road" aria-label="Catch the correct falling glossary term">
          <span class="glossary-road-lane glossary-road-lane--one"></span>
          <span class="glossary-road-lane glossary-road-lane--two"></span>
          <span class="glossary-road-lane glossary-road-lane--three"></span>
          <span class="glossary-road-glow"></span>
          <img class="glossary-catch-guide" src="${escapeHtml(guideImage)}" alt="">
          ${optionSet.map((option, index) => `
            <button
              type="button"
              class="glossary-fall-term glossary-fall-term--lane-${index + 1}"
              style="--drop-delay:${(index * 0.55).toFixed(2)}s; --drop-duration:${(6.3 + (index * 0.35)).toFixed(2)}s;"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeForInlineHandler(option.value)}')"
            >
              <span>${escapeHtml(option.detail)}</span>
              <strong>${escapeHtml(option.title)}</strong>
            </button>
          `).join("")}
        </div>
        <div class="glossary-catch-definition">
          <span class="kicker">Definition target</span>
          <strong>Catch the term that means:</strong>
          <p>${escapeHtml(promptItem.definition)}</p>
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Termfall exit</strong>
      <p class="small-copy">Catch all ${batch.length} correct terms to unlock the next memory round.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossarySignalSliceGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent) {
  const guideImage = GLOSSARY_GUIDE_ASSETS["signal-slice"];
  const cloze = getGlossaryCloze(promptItem);
  const isCelebrating = state.glossaryPulseType === "good";
  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-slice-shell glossary-cloze-shell">
      <div class="section-title">
        <h2>Keyword Repair</h2>
        <p>${matchedCount}/${batch.length} blanks repaired</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-slice-game">
        ${isCelebrating ? `
          <span class="glossary-cloze-burst glossary-cloze-burst--one"></span>
          <span class="glossary-cloze-burst glossary-cloze-burst--two"></span>
          <span class="glossary-cloze-burst glossary-cloze-burst--three"></span>
        ` : ""}
        <div class="glossary-slice-vault">
          <img src="${escapeHtml(guideImage)}" alt="">
          <span class="glossary-slice-vault-ring"></span>
          <div>
            <span class="kicker">Term file</span>
            <strong>${escapeHtml(promptItem.term)}</strong>
            <div class="glossary-cloze-slots" aria-hidden="true">${renderGlossaryTermSilhouette(cloze.keyword)}</div>
          </div>
        </div>
        <div class="glossary-slice-field" aria-label="Tap the moving keyword that fills the definition blank">
          <span class="glossary-slice-beam glossary-slice-beam--one"></span>
          <span class="glossary-slice-beam glossary-slice-beam--two"></span>
          <span class="glossary-cloze-target-ring"></span>
          ${optionSet.map((option, index) => `
            <button
              type="button"
              class="glossary-slice-token glossary-slice-token--${(index % 4) + 1}"
              style="--slice-top:${15 + ((index * 11) % 58)}%; --slice-delay:${(index * 0.22).toFixed(2)}s; --slice-duration:${(3.55 + ((index % 3) * 0.32)).toFixed(2)}s;"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeForInlineHandler(option.value)}')"
            >
              <span>${escapeHtml(option.detail)}</span>
              <strong>${escapeHtml(option.title)}</strong>
            </button>
          `).join("")}
        </div>
        <div class="glossary-slice-definition">
          <span class="kicker">Definition target</span>
          <strong>Fill the blank:</strong>
          <p>${renderGlossaryClozeText(promptItem)}</p>
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Cloze exit</strong>
      <p class="small-copy">Repair every moving blank tile in this set to unlock the next vault layer.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossaryStoryScene(scene) {
  const chips = Array.isArray(scene.chips) ? scene.chips : [];
  return `
    <div class="glossary-scene-art glossary-story-scene glossary-story-scene--${escapeHtml(scene.motif)}" aria-hidden="true">
      <img class="glossary-story-bg" src="${escapeHtml(GLOSSARY_STORY_ASSETS.vault)}" alt="">
      <span class="glossary-story-grid"></span>
      <span class="glossary-story-holo glossary-story-holo--one"></span>
      <span class="glossary-story-holo glossary-story-holo--two"></span>
      <div class="glossary-story-display">
        <span class="glossary-story-object glossary-story-object--one"></span>
        <span class="glossary-story-object glossary-story-object--two"></span>
        <span class="glossary-story-object glossary-story-object--three"></span>
        <span class="glossary-story-object glossary-story-object--four"></span>
        <span class="glossary-story-object glossary-story-object--five"></span>
      </div>
      <img class="glossary-story-character" src="${escapeHtml(scene.character || GLOSSARY_STORY_ASSETS.mackillopThinking)}" alt="">
      <span class="glossary-story-signal">${escapeHtml(scene.title || "Visual meaning")}</span>
      <div class="glossary-story-chip-row">
        ${chips.map((chip, index) => `<span class="glossary-story-chip glossary-story-chip--${index + 1}">${escapeHtml(chip)}</span>`).join("")}
      </div>
      <strong class="glossary-story-badge">${escapeHtml(scene.badge)}</strong>
    </div>
  `;
}

function renderGlossarySceneArt(scene) {
  if (scene.variant === "story") {
    return renderGlossaryStoryScene(scene);
  }
  return `
    <div class="glossary-scene-art glossary-scene-art--${escapeHtml(scene.motif)}" aria-hidden="true">
      <span class="glossary-scene-shape glossary-scene-shape--one"></span>
      <span class="glossary-scene-shape glossary-scene-shape--two"></span>
      <span class="glossary-scene-shape glossary-scene-shape--three"></span>
      <span class="glossary-scene-motion glossary-scene-motion--one"></span>
      <span class="glossary-scene-motion glossary-scene-motion--two"></span>
      <strong>${escapeHtml(scene.badge)}</strong>
    </div>
  `;
}

function renderGlossarySceneMatchGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent) {
  const scene = getGlossarySceneVisual(promptItem.term);
  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-scene-shell">
      <div class="section-title">
        <h2>Scene Match</h2>
        <p>${matchedCount}/${batch.length} animated meanings decoded</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-scene-match-game">
        <article class="glossary-scene-prompt">
          ${renderGlossarySceneArt(scene)}
          <div class="glossary-scene-prompt-copy">
            <div class="kicker">Animated meaning</div>
            <h3>Which key term does this visual show?</h3>
            <p>${escapeHtml(scene.caption)}</p>
          </div>
        </article>
        <div class="glossary-scene-term-grid" aria-label="Choose the glossary term that matches the animated meaning">
          ${optionSet.map(option => `
            <button
              type="button"
              class="choice-button glossary-scene-term-option"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeForInlineHandler(option.value)}')"
            >
              <span class="kicker">Key term</span>
              <strong>${escapeHtml(option.term)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Scene exit</strong>
      <p class="small-copy">Decode each animated concept scene, then choose the key term it represents.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossaryInvadersGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent) {
  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-invaders-shell">
      <div class="section-title">
        <h2>Definition Invaders</h2>
        <p>${matchedCount}/${batch.length} term waves cleared</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-invaders-game">
        <div class="glossary-invader-instructions" aria-live="polite">
          <span><strong>Move</strong> arrow keys or buttons</span>
          <span><strong>Shoot</strong> Space or Shoot</span>
          <span><strong>Forcefield</strong> hold Shield to block enemy fire</span>
          <span><strong>Pressure</strong> rises after each cleared term</span>
        </div>
        <div class="glossary-invader-hud" aria-hidden="true">
          <span>Hull <strong id="glossary-invader-hull">3/3</strong></span>
          <span>Pressure <strong id="glossary-invader-pace">Lv 1</strong></span>
          <span class="glossary-invader-meter"><i id="glossary-invader-forcefield-meter"></i></span>
          <span id="glossary-invader-status">Formation entering the chamber.</span>
        </div>
        <canvas
          id="glossary-invaders-canvas"
          class="glossary-invaders-canvas"
          width="${GLOSSARY_INVADER_WIDTH}"
          height="${GLOSSARY_INVADER_HEIGHT}"
          data-target-id="${escapeHtml(promptItem.id)}"
          aria-label="Definition Invaders arcade game. Move the ship left and right, fire upward, and hold the forcefield to block enemy shots. Target definition: ${escapeHtml(promptItem.definition)}"
        ></canvas>
        <div class="glossary-invader-controls" aria-label="Definition Invaders controls">
          <button
            type="button"
            class="glossary-invader-control"
            aria-label="Move left"
            onpointerdown="window.ESTPrep.setGlossaryInvaderMove(-1)"
            onpointerup="window.ESTPrep.stopGlossaryInvaderMove(-1)"
            onpointerleave="window.ESTPrep.stopGlossaryInvaderMove(-1)"
            onpointercancel="window.ESTPrep.stopGlossaryInvaderMove(-1)"
          >←</button>
          <button
            type="button"
            class="glossary-invader-control"
            aria-label="Move right"
            onpointerdown="window.ESTPrep.setGlossaryInvaderMove(1)"
            onpointerup="window.ESTPrep.stopGlossaryInvaderMove(1)"
            onpointerleave="window.ESTPrep.stopGlossaryInvaderMove(1)"
            onpointercancel="window.ESTPrep.stopGlossaryInvaderMove(1)"
          >→</button>
          <button
            type="button"
            class="glossary-invader-control glossary-invader-control--shield"
            aria-label="Hold forcefield"
            onpointerdown="window.ESTPrep.setGlossaryInvaderShield(true)"
            onpointerup="window.ESTPrep.setGlossaryInvaderShield(false)"
            onpointerleave="window.ESTPrep.setGlossaryInvaderShield(false)"
            onpointercancel="window.ESTPrep.setGlossaryInvaderShield(false)"
          >Shield</button>
          <button
            type="button"
            class="glossary-invader-control glossary-invader-control--fire"
            aria-label="Shoot with Space"
            onclick="window.ESTPrep.fireGlossaryInvaderPlayerShot()"
          >Shoot <span>Space</span></button>
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Invader exit</strong>
      <p class="small-copy">Clear the correct term creature in each descending row. The forcefield blocks shots, but pressure climbs after every secured term and a row crash counts as a miss.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossaryVaultBridgeGame(round) {
  const bridge = getGlossaryBridgeState();
  const sourceTotal = buildGlossarySource().length;
  const item = getGlossaryBridgeActiveItem();
  const totalSecured = getGlossaryBridgeTotalSecured(bridge);
  const totalPercent = sourceTotal ? Math.round((totalSecured / sourceTotal) * 100) : 0;
  const levelPercent = bridge.levelTerms.length ? Math.round((Math.min(bridge.step, bridge.levelTerms.length) / bridge.levelTerms.length) * 100) : 0;
  const levelName = getGlossaryBridgeLevelName(bridge.level);
  const bridgeSalary = 2400 + (totalSecured * 350);
  const storedMotion = state.answers.glossaryBridgeMotion || {};
  const motionIsFresh = isGlossaryBridgeMotionFresh(storedMotion);
  if (storedMotion.kind && !motionIsFresh && !bridge.levelClear) {
    delete state.answers.glossaryBridgeMotion;
  }
  const motion = motionIsFresh || bridge.levelClear ? storedMotion : {};
  const playerPosition = getGlossaryBridgeActivePosition(bridge);
  const motionKind = String(motion.kind || "");
  const isAnsweringMotion = Boolean(motionKind && !bridge.levelClear);
  const playerClass = bridge.levelClear
    ? "is-exiting"
    : motionKind === "wrong"
      ? "is-resetting is-sad"
      : motionKind === "correct"
        ? "is-celebrating"
        : "is-idle";
  const motionFromX = Number(motion.fromX ?? playerPosition.x);
  const motionFromY = Number(motion.fromY ?? playerPosition.y);
  const emoteKind = motionKind === "wrong" ? "is-sad" : motionKind === "correct" ? "is-celebration" : "";
  const emoteX = motionKind === "wrong" ? motionFromX : playerPosition.x;
  const emoteY = motionKind === "wrong" ? motionFromY : playerPosition.y;
  const motionVector = getGlossaryBridgeMotionVector(motionFromX, motionFromY, playerPosition.x, playerPosition.y);
  const characterFrames = getGlossaryBridgeCharacterFrames(motionKind, bridge.levelClear);
  const characterImage = characterFrames[0] || GLOSSARY_BRIDGE_ASSETS.characterReady;
  const playerStyle = [
    `--bridge-player-x:${playerPosition.x}%`,
    `--bridge-player-y:${playerPosition.y}%`,
    `--bridge-from-x:${motionFromX}%`,
    `--bridge-from-y:${motionFromY}%`,
    `--bridge-motion-angle:${motionVector.angle.toFixed(2)}deg`,
    `--bridge-motion-length:${motionVector.length.toFixed(2)}%`
  ].join(";");

  if (!item) {
    return `
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>Vault Bridge</h2>
          <p>The bridge could not find a glossary term set.</p>
        </div>
        <p class="small-copy glossary-pulse warn">Reload the glossary run to rebuild the bridge terms.</p>
      </div>
    `;
  }

  const options = buildGlossaryBridgeOptions(item, bridge.level, bridge.step);
  const pathMarkup = renderGlossaryBridgePathSegments(bridge);
  const rowMarkup = GLOSSARY_BRIDGE_ROWS.map((row, rowIndex) => {
    return row.map((position, optionIndex) => {
      const lockedOption = bridge.levelLocks[rowIndex];
      const isLocked = rowIndex < bridge.step && lockedOption === optionIndex;
      const isDropped = rowIndex < bridge.step && lockedOption !== optionIndex;
      const isActive = rowIndex === bridge.step && !bridge.levelClear && !isAnsweringMotion;
      const isWaiting = rowIndex > bridge.step || bridge.levelClear || (isAnsweringMotion && rowIndex === bridge.step);
      const option = options[optionIndex] || { value: "", title: "", optionIndex };
      const motionMatches = Number(motion.step) === rowIndex && Number(motion.optionIndex) === optionIndex;
      const stateClass = isLocked
        ? "is-locked"
        : isDropped
          ? "is-dropped"
          : isActive
            ? "is-active"
            : "is-waiting";
      const feedbackClass = motionMatches && motionKind === "wrong"
        ? "is-wrong"
        : motionMatches && (motionKind === "correct" || motionKind === "clear")
          ? "is-correct"
          : "";
      const tileFontSize = getGlossaryBridgeTileFontSize(option.title);
      return `
        <button
          type="button"
          class="glossary-bridge-tile ${stateClass} ${feedbackClass}"
          style="--bridge-tile-x:${position.x}%; --bridge-tile-y:${position.y}%; --bridge-tile-font-size:${tileFontSize};"
          ${isActive ? `onclick="window.ESTPrep.submitGlossaryBridgeChoiceEncoded('${item.id}', '${encodeForInlineHandler(option.value)}', ${optionIndex})"` : "disabled"}
          data-correct="${option.correct ? "true" : "false"}"
          aria-label="${escapeHtml(isActive ? option.title : isLocked ? `Row ${rowIndex + 1} secured` : isDropped ? `Row ${rowIndex + 1} dropped` : `Row ${rowIndex + 1} waiting`)}"
        >
          <strong>${isActive ? escapeHtml(option.title) : ""}</strong>
        </button>
      `;
    }).join("");
  }).join("");

  const stepDots = bridge.levelTerms.map((_, index) => `
    <span class="${index < bridge.step ? "is-secured" : ""}"></span>
  `).join("");
  const finalLevel = bridge.level >= bridge.levels.length - 1;
  const shotStep = Math.max(1, Math.min(bridge.levelTerms.length + 1, Number(motion.step ?? bridge.step) + 1));
  const shotLabel = bridge.levelClear
    ? finalLevel ? "Final scene" : `Scene ${bridge.level + 1}.6`
    : `Scene ${bridge.level + 1}.${shotStep}`;
  const shotTitle = bridge.levelClear
    ? "Salary portal opens"
    : motionKind === "wrong"
      ? "Bridge collapses"
      : motionKind === "correct" || motionKind === "clear"
        ? "Bridge piece locked"
        : bridge.step
          ? "Next row live"
          : "Bridge loaded";
  const characterFrameMarkup = characterFrames.map((src, index) => `
    <img
      class="glossary-bridge-player-frame glossary-bridge-player-frame--${index + 1}"
      src="${escapeHtml(src)}"
      alt=""
      aria-hidden="true"
    >
  `).join("");
  const characterEmoteMarkup = emoteKind ? `
    <div
      class="glossary-bridge-emote ${emoteKind}"
      style="--bridge-emote-x:${emoteX}%; --bridge-emote-y:${emoteY}%;"
      aria-hidden="true"
    >
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  ` : "";
  const clearTitle = finalLevel ? "Glossary vault mastered" : "Portal clear";
  const clearCopy = finalLevel
    ? `All ${sourceTotal} terms are secure. Bank the salary reward, pay the community tax, and choose what to practise next.`
    : `${levelName} cleared. Five terms are locked, the salary portal is open, and the next bridge level is ready.`;
  const statusTitle = bridge.levelClear
    ? clearTitle
    : motionKind === "wrong"
      ? "Bridge rebuilt"
      : motionKind === "correct" || motionKind === "clear"
        ? "Bridge piece locked"
      : bridge.step
        ? "Next row"
        : "Ready";
  const statusCopy = bridge.levelClear
    ? clearCopy
    : motionKind === "wrong"
      ? "A wrong tile sends you back to the entrance for this level. Previous cleared levels stay banked."
      : motionKind === "correct" || motionKind === "clear"
        ? "MacKillop is crossing to the locked piece. The next row will light up in a moment."
      : bridge.step
        ? "The locked bridge piece stays lit. The new row has fresh options."
        : "Start from the arrow runway and choose the term that matches the definition.";
  const definitionCopy = bridge.levelClear
    ? "The level route is secure. Move through the portal to unlock the next glossary set."
    : item.definition;

  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-bridge-shell">
      <div class="section-title">
        <h2>Vault Bridge</h2>
        <p>Level ${bridge.level + 1}/${bridge.levels.length}: ${escapeHtml(levelName)}</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">${bridge.step}/${bridge.levelTerms.length} rows secured</span>
        <span class="badge">${totalSecured}/${sourceTotal} total terms</span>
        <span class="badge">${formatCurrency(bridgeSalary)} salary signal</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${totalPercent}%;"></div>
      </div>
      <article class="glossary-bridge-prompt-bar">
        <span class="kicker">${bridge.levelClear ? "Portal target" : "Definition target"}</span>
        <p>${escapeHtml(definitionCopy)}</p>
      </article>
      <div class="glossary-bridge-game ${bridge.levelClear ? "is-level-clear" : ""} ${isAnsweringMotion ? "is-answering" : ""} ${motionKind ? `motion-${escapeHtml(motionKind)}` : ""}" style="${playerStyle}">
        <img class="glossary-bridge-bg" src="${escapeHtml(GLOSSARY_BRIDGE_ASSETS.backdrop)}" alt="">
        <span class="glossary-bridge-vignette" aria-hidden="true"></span>
        <div class="glossary-bridge-shot-label" aria-live="polite">
          <span>${escapeHtml(shotLabel)}</span>
          <strong>${escapeHtml(shotTitle)}</strong>
        </div>
        <span class="glossary-bridge-runway" aria-hidden="true"></span>
        <div class="glossary-bridge-path" aria-hidden="true">${pathMarkup}</div>
        <span class="glossary-bridge-motion-ribbon ${motionKind ? "is-active" : ""}" aria-hidden="true"></span>
        <div class="glossary-bridge-pieces" aria-label="Select the bridge piece that matches the definition">
          ${rowMarkup}
        </div>
        <div class="glossary-bridge-portal ${bridge.levelClear ? "is-active" : ""} ${finalLevel ? "is-final" : ""}" aria-hidden="true">
          <span class="glossary-bridge-portal-ring"></span>
          <span class="glossary-bridge-portal-core"></span>
          <span class="glossary-bridge-portal-door"></span>
          <span class="glossary-bridge-portal-sparks"></span>
        </div>
        ${motionKind ? `<img class="glossary-bridge-player-ghost" src="${escapeHtml(characterImage)}" alt="" aria-hidden="true">` : ""}
        <div class="glossary-bridge-player ${playerClass}" role="img" aria-label="MacKillop student character crossing the bridge">
          ${characterFrameMarkup}
        </div>
        ${characterEmoteMarkup}
        <span class="glossary-bridge-burst ${motionKind === "correct" || motionKind === "clear" ? "is-active" : ""}" aria-hidden="true"></span>
        <span class="glossary-bridge-splash ${motionKind === "wrong" ? "is-active" : ""}" aria-hidden="true"></span>
        ${bridge.levelClear ? `
          <section class="glossary-bridge-clear" aria-live="polite">
            <article>
              <div class="kicker">${finalLevel ? "Final portal" : "Level portal"}</div>
              <h3>${escapeHtml(clearTitle)}</h3>
              <p>${escapeHtml(clearCopy)}</p>
              <div class="glossary-bridge-reward-count">
                <span><strong>${bridge.level + 1}/${bridge.levels.length}</strong>Level</span>
                <span><strong>${totalSecured}/${sourceTotal}</strong>Terms</span>
                <span><strong>${formatCurrency(bridgeSalary)}</strong>Salary</span>
              </div>
              <button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryBridgeLevel()">${finalLevel ? "Bank reward" : "Next level"}</button>
            </article>
          </section>
        ` : ""}
      </div>
      <div class="glossary-bridge-statusbar">
        <article class="glossary-bridge-feedback" aria-live="polite">
          <strong>${escapeHtml(statusTitle)}</strong>
          <p>${escapeHtml(statusCopy)}</p>
        </article>
        <article class="glossary-bridge-progress">
          <strong>Bridge charge</strong>
          <p>Level ${bridge.level + 1}: ${bridge.step}/${bridge.levelTerms.length} rows. Total glossary bank: ${totalSecured}/${sourceTotal}.</p>
          <div class="glossary-bridge-track" aria-hidden="true"><span style="width:${totalPercent}%;"></span></div>
          <div class="glossary-bridge-dots" aria-hidden="true">${stepDots}</div>
        </article>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Vault Bridge exit</strong>
      <p class="small-copy">Secure five rows to open each portal. Wrong answers rebuild only the current level from the entrance.</p>
      ${bridge.levelClear ? `<button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryBridgeLevel()">${finalLevel ? "Bank reward" : "Next level"}</button>` : ""}
      <button class="choice-button" type="button" onclick="window.ESTPrep.resetGlossaryBridgeLevel()">Reset current level</button>
    </div>
  `;
}

function renderGlossaryMemoryMatchGame(round, batch, matchedCount, roundScore, progressPercent) {
  const deck = getGlossaryMemoryDeck(batch);
  const assignments = getGlossaryAssignmentsForBatch();
  const openCards = Array.isArray(state.answers[getGlossaryMemoryOpenKey()]) ? state.answers[getGlossaryMemoryOpenKey()] : [];
  const mismatchCards = Array.isArray(state.answers[getGlossaryMemoryMismatchKey()]) ? state.answers[getGlossaryMemoryMismatchKey()] : [];
  const matchCards = Array.isArray(state.answers[getGlossaryMemoryMatchKey()]) ? state.answers[getGlossaryMemoryMatchKey()] : [];
  const theme = getCurrentGlossaryMemoryTheme(round);
  const matchedCardCount = matchedCount * 2;
  const totalCards = batch.length * 2;

  return `
    <div class="panel glossary-command-panel glossary-arcade-shell glossary-memory-shell" style="${getGlossaryMemoryThemeStyle(theme)}">
      <div class="section-title">
        <h2>Memory Game</h2>
        <p>${matchedCount}/${batch.length} term-definition pairs cleared</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">${escapeHtml(getGlossaryBatchLabel())}</span>
        <span class="badge">${escapeHtml(theme.label)}</span>
        <span class="badge">${matchedCardCount}/${totalCards} cards cleared</span>
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-memory-arena">
        <div class="glossary-memory-arena-bg" aria-hidden="true"></div>
        <div class="glossary-memory-board" aria-label="Memory game cards">
          ${deck.map((card, index) => {
            const matched = assignments[card.itemId] === card.itemId;
            const matchPreview = matchCards.includes(card.id);
            const open = openCards.includes(card.id) || mismatchCards.includes(card.id) || matchPreview;
            const mismatched = mismatchCards.includes(card.id);
            return `
              <button
                type="button"
                class="glossary-memory-card ${open ? "is-flipped" : ""} ${matched ? "is-matched" : ""} ${mismatched ? "is-mismatch" : ""} ${matchPreview ? "is-match-preview" : ""} glossary-memory-card--${escapeHtml(card.kind)}"
                style="--card-index:${index};"
                onclick="window.ESTPrep.flipGlossaryMemoryCardEncoded('${encodeForInlineHandler(card.id)}')"
                ${matched || mismatchCards.length || matchCards.length ? "disabled" : ""}
                aria-label="${matched ? "Matched" : open ? "Open" : "Hidden"} ${escapeHtml(card.label)} card"
              >
                <span class="glossary-memory-card-inner">
                  <span class="glossary-memory-card-face glossary-memory-card-back" aria-hidden="true"></span>
                  <span class="glossary-memory-card-face glossary-memory-card-front">
                    <span class="kicker">${escapeHtml(card.label)}</span>
                    <strong>${escapeHtml(card.text)}</strong>
                  </span>
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Memory exit</strong>
      <p class="small-copy">Clear all ${batch.length} term-definition pairs. Matching cards disappear, and wrong pairs flip back after a short reset.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore) {
  const promptItem = getCurrentGlossaryPromptItem(batch);
  const progressPercent = Math.round((matchedCount / Math.max(1, batch.length)) * 100);

  if (round.id === "memory-match") {
    return renderGlossaryMemoryMatchGame(round, batch, matchedCount, roundScore, progressPercent);
  }

  if (round.id === "recall") {
    return renderGlossaryVaultBridgeGame(round);
  }

  if (!promptItem) {
    return `
      <div class="panel glossary-command-panel">
        <div class="section-title">
          <h2>Chamber cleared</h2>
          <p>All ${batch.length} glossary signals restored in this batch.</p>
        </div>
        <p class="small-copy glossary-pulse good">The game is stable. Bank the reward, then choose any practice mode next.</p>
      </div>
      <div class="written-stage glossary-finale-stage">
        <strong>Chamber exit</strong>
        <p class="small-copy">You restored every glossary signal in this batch. Advance to keep the run going.</p>
        <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()">Finish Game</button>
      </div>
    `;
  }

  if (round.id === "signal-slice") {
    return renderGlossarySignalSliceGame(round, promptItem, buildGlossaryChallengeOptions(round.id, promptItem, batch), batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent);
  }

  const optionSet = buildGlossaryChallengeOptions(round.id, promptItem, batch);
  if (round.id === "term-catch") {
    return renderGlossaryCatchGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent);
  }

  if (round.id === "plain-match") {
    return renderGlossaryInvadersGame(round, promptItem, optionSet, batch, batchNumber, totalBatches, matchedCount, roundScore, progressPercent);
  }

  const challengeCopy = round.id === "colour-shape"
    ? {
        kicker: "Signal scan",
        title: "Recover the correct term from the clue trail",
        prompt: `Keyword trail: ${promptItem.keywords.join(" • ")}`,
        promptHtml: escapeHtml(`Keyword trail: ${promptItem.keywords.join(" • ")}`),
        support: "Choose the glossary term that best matches the signal feed."
      }
    : round.id === "keyword-cloze"
      ? {
          kicker: "Keyword repair",
          title: "Fill the missing keyword from the definition",
          prompt: getGlossaryCloze(promptItem).text,
          promptHtml: renderGlossaryClozeText(promptItem),
          support: `The term is ${promptItem.term}. Pick the missing word that makes the definition work.`
        }
      : {
          kicker: "Definition Invaders",
          title: "Match the definition back to the correct term",
          prompt: clampText(promptItem.definition, 180),
          promptHtml: escapeHtml(clampText(promptItem.definition, 180)),
          support: "The visual scaffolds are gone. Recover the right term from meaning alone."
        };

  return `
    <div class="panel glossary-command-panel glossary-arcade-shell">
      <div class="section-title">
        <h2>${escapeHtml(round.title.replace(/^Round \d+:\s*/, ""))}</h2>
        <p>${matchedCount}/${batch.length} signal locks restored</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Current streak: x${state.glossaryStreak}</span>
        <span class="badge">Best streak: x${state.glossaryBestStreak}</span>
        <span class="badge">Misses: ${state.glossaryMisses}</span>
        <span class="badge">Score: ${roundScore}</span>
      </div>
      <p class="small-copy glossary-pulse ${state.glossaryPulseType}">${escapeHtml(state.glossaryPulse || round.cue)}</p>
      <div class="glossary-progress-track" aria-hidden="true">
        <div class="glossary-progress-bar" style="width:${progressPercent}%;"></div>
      </div>
      <div class="glossary-arcade-grid">
        <article class="glossary-arcade-prompt">
          ${renderGlossaryRoundVisual(round.id, promptItem)}
          <div class="kicker">${escapeHtml(challengeCopy.kicker)}</div>
          <h3>${escapeHtml(challengeCopy.title)}</h3>
          <div class="glossary-arcade-signal">${challengeCopy.promptHtml}</div>
          <p>${escapeHtml(challengeCopy.support)}</p>
        </article>
        <div class="glossary-arcade-options">
          ${optionSet.map(option => `
            <button
              type="button"
              class="choice-button glossary-arcade-option"
              onclick="window.ESTPrep.submitGlossaryChallengeChoiceEncoded('${promptItem.id}', '${encodeForInlineHandler(option.value)}')"
            >
              <span class="kicker">${escapeHtml(option.detail)}</span>
              <strong>${escapeHtml(option.title)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
    <div class="written-stage glossary-finale-stage">
      <strong>Chamber exit</strong>
      <p class="small-copy">Restore all ${batch.length} signals in this game to bank the reward, then choose what to practise next.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.nextGlossaryPhase()" ${isGlossaryBatchMatched() ? "" : "disabled"}>Finish Game</button>
    </div>
  `;
}

function renderGlossaryCelebration() {
  const celebration = state.glossaryRoundCelebration;
  if (!celebration) return "";
  const masterySummary = getGlossaryMasterySummary();
  const isFinalRound = masterySummary.mastered >= masterySummary.masteryTarget;
  const rewardKey = celebration.rewardKey || getGlossaryRewardKey(celebration.roundNumber, celebration.batchIndex);
  const voteKey = state.glossaryRoundVotes[rewardKey] || "";
  const selectedOption = (state.stageDeck?.communityOptions || []).find(option => option.id === voteKey) || null;
  const selectedAsset = selectedOption ? GLOSSARY_COMMUNITY_ASSETS[selectedOption.id] : null;
  const assetReady = voteKey ? isGlossaryCommunityAssetReady(rewardKey) : false;
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button
      type="button"
      class="choice-button ${voteKey === option.id ? "selected live-selected" : ""}"
      onclick="window.ESTPrep.setGlossaryRoundVote('${option.id}')"
    >
      <strong>${escapeHtml(option.label || option.id)}</strong>
      <span>${escapeHtml(option.description || "Class community focus")}</span>
    </button>
  `).join("");
  return `
    <section class="glossary-celebration">
      <div class="glossary-celebration-card">
        <div class="glossary-celebration-visual" aria-hidden="true">
          <img src="${escapeHtml(GLOSSARY_VISUAL_ASSETS.reward)}" alt="">
          <span class="glossary-reward-beam glossary-reward-beam--one"></span>
          <span class="glossary-reward-beam glossary-reward-beam--two"></span>
          <span class="glossary-reward-spark glossary-reward-spark--one"></span>
          <span class="glossary-reward-spark glossary-reward-spark--two"></span>
        </div>
        <div class="kicker">Game ${celebration.roundNumber} cleared • ${escapeHtml(celebration.setLabel || getGlossaryBatchLabel(celebration.batchIndex))}</div>
        <h3>${escapeHtml(celebration.title)}</h3>
        <p>${escapeHtml(celebration.subtitle)}</p>
        ${renderGlossarySceneGuide("reward", null, ["Salary", "Tax", "Community", "Next set"])}
        <div class="badge-row">
          <span class="badge">${escapeHtml(celebration.scoreText)}</span>
          <span class="badge">Time: ${formatSecondsAsClock(celebration.elapsedSeconds)}</span>
          <span class="badge">${escapeHtml(celebration.speedBand.label)}</span>
        </div>
        <div class="glossary-reward-grid">
          <article class="glossary-reward-chip">
            <strong>Total salary</strong>
            <p>${formatCurrency(celebration.salary)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Speed bonus</strong>
            <p>${formatCurrency(celebration.speedBand.bonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Precision bonus</strong>
            <p>${formatCurrency(celebration.precisionBonus)}</p>
          </article>
          <article class="glossary-reward-chip">
            <strong>Community tax</strong>
            <p>${formatCurrency(celebration.tax)}</p>
          </article>
        </div>
        <div class="panel glossary-vote-panel">
          <div class="section-title">
            <h2>Choose how your class tax helps the community</h2>
            <p>All pooled taxes go toward building something bigger than one student run.</p>
          </div>
          <p class="small-copy">You earned ${formatCurrency(celebration.salary)} salary. ${formatCurrency(celebration.tax)} is class tax. Choose one destination for this round's contribution.</p>
          <div class="choice-grid">${communityOptions}</div>
          ${voteKey ? `<p class="small-copy content-vote-confirmed">Selected: <strong>${escapeHtml(selectedOption?.label || voteKey)}</strong></p>` : ""}
          ${voteKey && selectedOption ? `
            <article class="glossary-community-growth ${assetReady ? "is-complete" : "is-growing"}">
              <div class="glossary-community-growth-art">
                <img src="${escapeHtml(selectedAsset?.image || GLOSSARY_VISUAL_ASSETS.reward)}" alt="">
                <span class="glossary-community-growth-ring glossary-community-growth-ring--one"></span>
                <span class="glossary-community-growth-ring glossary-community-growth-ring--two"></span>
              </div>
              <div class="glossary-community-growth-copy">
                <div class="kicker">${assetReady ? "Community asset ready" : "Community asset growing"}</div>
                <h3>${escapeHtml(selectedAsset?.title || selectedOption.label || selectedOption.id)}</h3>
                <p>${escapeHtml(selectedAsset?.detail || "The class contribution grows a shared community asset.")} ${formatCurrency(celebration.tax)} has been allocated here.</p>
              </div>
            </article>
          ` : ""}
        </div>
        ${voteKey ? "" : `
          <div class="feedback-box warn">
            <p><strong>Select one tax destination before continuing.</strong></p>
            <p>Your game reward is ready, but the class tax allocation has to be chosen first.</p>
          </div>
        `}
        ${voteKey && assetReady ? `
          <div class="builder-actions glossary-community-next-actions">
            <button class="submit-button" type="button" onclick="window.ESTPrep.continueGlossaryRound()">${isFinalRound ? "Finish TERM" : "Next Term Set"}</button>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Save and return to EST Lab</button>
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function renderGlossaryStudyDeck(batch) {
  const card = batch[state.glossaryStudyIndex] || batch[0];
  if (!card) return "";
  const flipKey = `${getGlossaryBatchKey()}-flip-${state.glossaryStudyIndex}`;
  const flipped = !!state.answers[flipKey];
  const stat = state.glossaryTermStats?.[card.id] || {};
  const tested = Number(stat.tested || 0);
  const accuracy = tested ? Math.round((Number(stat.correct || 0) / tested) * 100) : 0;
  return `
    <div class="panel glossary-study-panel">
      <div class="section-title">
        <h2>Memory Deck</h2>
        <p>Look, cover, retrieve, then check. The chamber will repeat weaker terms in later timed sets.</p>
      </div>
      <div class="badge-row" style="margin-bottom:14px;">
        <span class="badge">Card ${state.glossaryStudyIndex + 1} / ${batch.length}</span>
        <span class="badge">${escapeHtml(card.term)}</span>
        <span class="badge">${tested ? `${tested} reps • ${accuracy}%` : "Not tested yet"}</span>
      </div>
      <button type="button" class="glossary-study-card ${flipped ? "flipped" : ""}" onclick="window.ESTPrep.flipGlossaryStudyCard()">
        <div class="glossary-study-inner">
          <div class="glossary-study-face">
            <span class="kicker">Term</span>
            <strong>${escapeHtml(card.term)}</strong>
            <p>Click to reveal the meaning.</p>
          </div>
          <div class="glossary-study-face glossary-study-back">
            <span class="kicker">Definition</span>
            <strong>${escapeHtml(card.definition)}</strong>
            <p>Keywords: ${escapeHtml(card.keywords.join(", "))}</p>
          </div>
        </div>
      </button>
      <div class="builder-actions glossary-study-actions">
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(-1)">Previous</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.flipGlossaryStudyCard()">Flip Card</button>
        <button class="choice-button" type="button" onclick="window.ESTPrep.moveGlossaryStudy(1)">Next</button>
      </div>
    </div>
  `;
}

function renderGlossaryStage() {
  setGameplayViewportMode(!state.glossaryRoundCelebration);
  setStageMenuMode(false);
  renderFocusNav();
  syncMissionMode();
  setStageScene(state.glossaryRoundCelebration ? "restored" : "challenge");
  const batch = getCurrentGlossaryBatch();
  const round = getCurrentGlossaryRound();
  const assignments = getGlossaryAssignmentsForBatch();
  const totalBatches = getGlossaryBatchCount();
  const roundNumber = state.glossaryRoundIndex + 1;
  const totalRounds = GLOSSARY_ROUND_CONFIGS.length;
  const batchNumber = getSafeGlossaryBatchIndex() + 1;
  const matchedCount = Object.keys(assignments).length;
  const masterySummary = getGlossaryMasterySummary();
  const roundScopeLabel = round.id === "recall"
    ? `${masterySummary.mastered}/${masterySummary.total} secure • ${masterySummary.untested} untested`
    : round.id === "memory-match"
      ? `${getGlossaryBatchLabel()} • ${batch.length * 2} cards`
      : `${getGlossaryBatchLabel()} • ${batch.length} terms`;
  setText("stage-title", "TERM");
  setText("stage-subtitle", "The right language: short timed memory reps build coverage across the full glossary without forcing one giant sitting.");

  if (state.glossaryRoundCelebration) {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar">
          <div>
            <div class="kicker">TERM access</div>
            <h3>Reward chamber</h3>
          </div>
        </div>
        ${renderGlossaryCelebration()}
      </div>
    `);
    stopGlossaryInvadersRuntime();
    return;
  }

  const roundScore = Math.max(0, (matchedCount * 100) - (state.glossaryMisses * 25));
  const modeSwitch = `
    <div class="glossary-mode-switch">
      <button type="button" class="choice-button ${state.glossaryMode === "play" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('play')">Play Game</button>
      <button type="button" class="choice-button ${state.glossaryMode === "study" ? "selected live-selected" : ""}" onclick="window.ESTPrep.setGlossaryMode('study')">Memory Deck</button>
    </div>
  `;

  if (state.glossaryMode === "study") {
    renderStageRoot(`
      <div class="glossary-mission-shell">
        <div class="glossary-mission-topbar glossary-escape-topbar">
          <div>
            <div class="kicker">System Recovery Protocol</div>
            <h3>Memory Deck</h3>
            <p class="small-copy">Use quick look-cover-retrieve-check reps, then jump back into the timed chamber.</p>
          </div>
          <div class="glossary-mission-actions">
            <span class="badge">Mode ${roundNumber} / ${totalRounds}</span>
            <span class="badge">${getGlossaryBatchLabel()} • ${batch.length} terms</span>
            <span class="badge">${masterySummary.untested} untested</span>
            <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
            <button class="choice-button" type="button" onclick="window.ESTPrep.startNewGlossaryPracticeRun()">New timed set</button>
            <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Save and return</button>
          </div>
        </div>
        ${renderGlossaryChamberRail()}
        ${renderGlossarySetRail()}
        ${renderGlossaryMasterySnapshot()}
        ${renderGlossaryMissionFrame(`
          ${renderGlossarySceneGuide("study", batch[state.glossaryStudyIndex] || batch[0], ["Look", "Cover", "Retrieve", "Check"])}
          ${modeSwitch}
          ${renderGlossaryStudyDeck(batch)}
        `, batch[state.glossaryStudyIndex] || batch[0])}
      </div>
    `);
    startGlossaryRoundTimer();
    stopGlossaryInvadersRuntime();
    return;
  }

  renderStageRoot(`
    <div class="glossary-mission-shell glossary-escape-shell">
      <div class="glossary-mission-topbar glossary-escape-topbar">
        <div>
          <div class="kicker">System Recovery Protocol</div>
          <h3>TERM Arcade</h3>
          <p class="small-copy">${escapeHtml(round.cue)}</p>
        </div>
        <div class="glossary-mission-actions">
          <span class="badge">Mode ${roundNumber} / ${totalRounds}</span>
          <span class="badge">${escapeHtml(roundScopeLabel)}</span>
          <span class="badge">${masterySummary.untested} untested</span>
          <span class="badge">Timer <strong id="glossary-round-timer">${formatSecondsAsClock(getGlossaryRoundElapsedSeconds())}</strong></span>
          <button class="choice-button" type="button" onclick="window.ESTPrep.startNewGlossaryPracticeRun()">New timed set</button>
          <button class="choice-button" type="button" onclick="window.ESTPrep.returnToLab()">Save and return</button>
        </div>
      </div>
      ${renderGlossaryChamberRail()}
      ${renderGlossarySetRail()}
      ${renderGlossaryMasterySnapshot()}
      ${renderGlossaryMissionFrame(`
        ${modeSwitch}
        ${renderGlossaryChallengeArena(round, batch, batchNumber, totalBatches, matchedCount, roundScore)}
      `, getCurrentGlossaryPromptItem(batch))}
    </div>
  `);
  startGlossaryRoundTimer();
  mountGlossaryInvadersIfNeeded();
}

if (!window.__glossaryBridgeControlsBound) {
  window.__glossaryBridgeControlsBound = true;
  window.addEventListener("keydown", event => {
    if (!document.body.classList.contains("glossary-mission-active")) return;
    if (state.glossaryRoundCelebration || getCurrentGlossaryRound()?.id !== "recall") return;
    const bridge = getGlossaryBridgeState();
    if (bridge.levelClear && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      continueGlossaryBridgeLevel();
      return;
    }
    if (!bridge.levelClear && ["1", "2", "3"].includes(event.key)) {
      const optionIndex = Number(event.key) - 1;
      const item = getGlossaryBridgeActiveItem();
      const option = buildGlossaryBridgeOptions(item, bridge.level, bridge.step)[optionIndex];
      if (!item || !option) return;
      event.preventDefault();
      submitGlossaryBridgeChoiceEncoded(item.id, encodeURIComponent(option.value), optionIndex);
    }
  });
}

if (!window.__glossaryInvaderControlsBound) {
  window.__glossaryInvaderControlsBound = true;
  window.addEventListener("keydown", event => {
    const typingTag = String(event.target?.tagName || "").toLowerCase();
    if (["input", "textarea", "select"].includes(typingTag) || event.target?.isContentEditable) return;
    if (!document.body.classList.contains("glossary-mission-active")) return;
    if (state.glossaryRoundCelebration || getCurrentGlossaryRound()?.id !== "plain-match" || state.glossaryMode !== "play") return;

    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      setGlossaryInvaderMove(-1);
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      setGlossaryInvaderMove(1);
    }
    if (event.key === " " || event.code === "Space" || event.key === "ArrowUp") {
      event.preventDefault();
      fireGlossaryInvaderPlayerShot();
    }
    if (event.key === "Shift") {
      event.preventDefault();
      setGlossaryInvaderShield(true);
    }
  });

  window.addEventListener("keyup", event => {
    if (getCurrentGlossaryRound()?.id !== "plain-match") return;
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      stopGlossaryInvaderMove(-1);
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      stopGlossaryInvaderMove(1);
    }
    if (event.key === "Shift") {
      setGlossaryInvaderShield(false);
    }
  });
}

async function submitGlossary() {
  const batch = getCurrentGlossaryBatch();
  if (!isGlossaryBatchMatched()) return;
  buildGlossaryCelebration(GLOSSARY_ROUND_CONFIGS.length, `${batch.length}/${batch.length} term-definition pairs matched.`);
  renderGlossaryStage();
}

async function bankGlossaryResults() {
  bankGlossaryRoundActiveTimer();
  const allTerms = getGlossaryAllRoundItems();
  const matchedTermIds = getGlossaryMatchedTermIds();
  const durationSeconds = getCurrentStageDurationSeconds();
  const overallCorrect = matchedTermIds.size;
  const total = allTerms.length;
  const masterySummary = getGlossaryMasterySummary();
  const scoreRatio = total ? overallCorrect / total : 0;
  const scorePercent = Math.round(scoreRatio * 100);
  const previousBestRatio = Math.max(0, Number(state.stageBestScores.glossary || 0));
  const firstGlossaryClear = !state.completed.glossary && previousBestRatio === 0;
  const improvedBest = scoreRatio > previousBestRatio;

  if (firstGlossaryClear) {
    awardStage("glossary", { scoreRatio });
  } else if (improvedBest) {
    awardStageImprovement("glossary", previousBestRatio, scoreRatio);
  } else {
    state.recentReward = {
      type: "warning",
      title: "TERM replay saved",
      detail: `This attempt scored ${scorePercent}%. Your best TERM result remains ${Math.round(previousBestRatio * 100)}%, so no extra salary or tax was added.`
    };
    renderRewardPulse();
  }

  state.stageBestScores.glossary = Math.max(previousBestRatio, scoreRatio);
  addEvidence("TERM mastery run", `${overallCorrect}/${total} term-definition pairs matched • Best streak x${state.glossaryBestStreak} • Misses ${state.glossaryMisses}`);
  await saveProgress("glossary-lock-in", "glossary-check", `TERM memory game: ${overallCorrect}/${total}`, scorePercent, {
    taskName: "TERM",
    durationSeconds,
    promptText: "Practise TERM games until all glossary terms have a secure correct rep.",
    extraPayload: {
      round_summary: {
        rounds: GLOSSARY_ROUND_CONFIGS.map(item => item.title),
        total_terms: FULL_GLOSSARY_TERMS.length,
        terms_tested: masterySummary.tested,
        coverage_percent: masterySummary.coveragePercent,
        accuracy_percent: masterySummary.accuracyPercent,
        total_attempts: masterySummary.attempts,
        best_streak: state.glossaryBestStreak,
        misses: state.glossaryMisses,
        round_rewards: state.glossaryRoundRewards,
        round_votes: state.glossaryRoundVotes,
        term_stats: state.glossaryTermStats
      },
      final_round_results: masterySummary.rows.map(row => ({
        term: row.item.term,
        definition: row.item.definition,
        matched: matchedTermIds.has(row.item.id),
        termCorrect: row.isMastered,
        keywordCorrect: row.isMastered,
        tested: row.tested,
        correct: row.correct,
        misses: Number(row.stat.misses || 0),
        accuracyPercent: row.tested ? Math.round(row.accuracy * 100) : 0
      }))
    }
  });
  state.glossaryMissionMode = false;
  state.glossaryRoundCelebration = null;
  clearGlossaryTimer();
  syncMissionMode();
  showFeedbackBox(scoreRatio >= 0.8 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>TERM score:</strong> ${overallCorrect}/${total} term-definition pairs matched.`,
    `${improvedBest || firstGlossaryClear
      ? `Best TERM result is now ${Math.round(state.stageBestScores.glossary * 100)}%.`
      : `Best TERM result remains ${Math.round(previousBestRatio * 100)}%. This replay was saved but did not overwrite your best run.`}`,
    `Best streak: x${state.glossaryBestStreak}. Misses: ${state.glossaryMisses}.`,
    "Teachers can now inspect which terms were matched or missed in the memory run."
  ]);
  persistESTProgressSnapshot();
}
