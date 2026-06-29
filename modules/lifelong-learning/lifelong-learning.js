const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "lifelong-learning";
const FREE_TEXT_PRIVACY_NOTICE = {
  title: "Note: your teacher can check anything you enter here.",
  body: 'Do not include surnames, student emails, phone numbers, social handles, exact workplace names, suburbs, addresses, or anything that identifies you or someone else. Use general wording such as "a fast-food workplace" or "a local retail store".'
};

const SKILL_LOGOS = {
  communication: "../../Assets/employability-logos/main/communication.png",
  "digital-literacy": "../../Assets/employability-logos/main/digital-literacy.png",
  teamwork: "../../Assets/employability-logos/main/teamwork.png",
  "time-management": "../../Assets/employability-logos/main/time-management.png",
  "critical-thinking": "../../Assets/employability-logos/main/critical-thinking.png",
  "problem-solving": "../../Assets/employability-logos/main/problem-solving.png"
};

const INITIAL_RESOURCES = {
  money: 4200,
  time: 6,
  energy: 5,
  momentum: 2,
  salaryPotential: 28000,
  jobSecurity: 52,
  workLifeBalance: 60,
  resilience: 0,
  careerSuccess: 0,
  unlockedRoutes: ["Direct pathway"],
  purchasedUpgrades: []
};

const ASSET_CATALOG = [
  {
    code: "study-desk",
    name: "Focused Study Desk",
    category: "study",
    emoji: "🪑",
    cost: 900,
    benefit: "Improves planning and gives your pathway a more stable base.",
    effect: "Reduces time cost by 1 on planning-heavy rounds."
  },
  {
    code: "laptop-upgrade",
    name: "Laptop Upgrade",
    category: "tools",
    emoji: "💻",
    cost: 1600,
    benefit: "Makes online learning, research, and micro-credentials easier to manage.",
    effect: "Adds +$800 salary potential on training-focused rounds."
  },
  {
    code: "transport-pass",
    name: "Transport Pass",
    category: "mobility",
    emoji: "🚌",
    cost: 700,
    benefit: "Supports placements, TAFE access, and work experience without extra transport stress.",
    effect: "Adds +1 momentum on pathway and placement rounds."
  },
  {
    code: "wellbeing-pack",
    name: "Wellbeing Pack",
    category: "wellbeing",
    emoji: "🌿",
    cost: 500,
    benefit: "Protects energy and work-life balance while you keep learning.",
    effect: "Reduces energy loss by 1 and protects work-life balance."
  },
  {
    code: "rental-upgrade",
    name: "Rental Upgrade",
    category: "housing",
    emoji: "🏠",
    cost: 2200,
    benefit: "A more stable home base that supports long-term career growth.",
    effect: "Adds +2 job security and +2 work-life balance after strong rounds."
  }
];

const ROUNDS = [
  {
    id: "round-1",
    title: "Your Career Is Not One Straight Line",
    subtitle: "Choose a destination and build a stronger route before the first setback hits.",
    skillId: "communication",
    stateLabel: "Route Builder",
    prompt: "Why does lifelong learning matter when a career pathway changes?",
    goal: "You want to become an electrician within the next few years.",
    barrier: "You can apply straight for apprenticeships, but there is no guarantee you will get one on the first try.",
    challengeLabel: "Pick your opening pathway strategy",
    challengeNote: "Each choice changes your money, time, momentum, and future salary potential.",
    choices: [
      {
        id: "resilient-route",
        title: "Build a resilient route",
        detail: "Apply for apprenticeships, line up a pre-apprenticeship as backup, and look for related work experience.",
        best: true,
        costs: { money: -600, time: -2, energy: -1 },
        rewards: { momentum: 2, salaryPotential: 3500, resilience: 1, careerSuccess: 1, jobSecurity: 4 },
        unlocks: ["Pre-apprenticeship route", "Employer confidence"],
        resultSummary: "You invested early in flexibility, so one blocked route will not end the whole goal.",
        misconception: "A single pathway is risky. Lifelong learning is stronger when you plan backup routes before you need them."
      },
      {
        id: "single-bet",
        title: "Go all-in on one direct route",
        detail: "Only apply for apprenticeships and assume the direct path will work quickly.",
        best: false,
        costs: { money: -100, time: -1, energy: 0 },
        rewards: { momentum: 0, salaryPotential: 500, resilience: 0, careerSuccess: 0, jobSecurity: -2 },
        unlocks: [],
        resultSummary: "You saved resources, but your pathway is fragile if the first option fails.",
        misconception: "This treats careers as linear and fixed. The stronger move is to keep multiple routes alive."
      },
      {
        id: "wait-and-see",
        title: "Wait until after school to decide",
        detail: "Keep your options open, but do not take any learning or pathway steps yet.",
        best: false,
        costs: { money: 0, time: 0, energy: 1 },
        rewards: { momentum: -1, salaryPotential: 0, resilience: 0, careerSuccess: -1, jobSecurity: -1 },
        unlocks: [],
        resultSummary: "You preserved energy now, but lost momentum and pathway strength.",
        misconception: "Doing nothing is not neutral. Lifelong learning usually rewards active preparation."
      }
    ],
    reflectionLabel: "Explain why your pathway choice is stronger than relying on one fixed route.",
    reflectionPlaceholder: "My pathway is stronger because...",
    evidenceType: "justification",
    completionPercent: 34,
    masteryPercent: 45
  },
  {
    id: "round-2",
    title: "Invest In Training",
    subtitle: "Use your limited budget wisely to close a skill gap before an opportunity expires.",
    skillId: "critical-thinking",
    stateLabel: "Training Market",
    prompt: "Which learning option is the best fit for this skill gap, and why?",
    goal: "A school-based traineeship wants applicants who can use spreadsheets confidently within one month.",
    barrier: "You only have limited money, limited time, and several different training options competing for attention.",
    challengeLabel: "Buy one learning response from the training market",
    challengeNote: "Think about speed, fit, structure, and what it unlocks later.",
    choices: [
      {
        id: "micro-credential",
        title: "Targeted micro-credential",
        detail: "A short, focused course with practice tasks and a completion badge you can show an employer.",
        best: true,
        costs: { money: -1200, time: -2, energy: -1 },
        rewards: { momentum: 2, salaryPotential: 4200, resilience: 0, careerSuccess: 1, jobSecurity: 3 },
        unlocks: ["Spreadsheet credential", "Traineeship shortlist"],
        resultSummary: "You spent more upfront, but bought speed, evidence, and employer-ready skill growth.",
        misconception: "Good training is not always the biggest course. It is the one that best fits the immediate need."
      },
      {
        id: "random-videos",
        title: "Unstructured video binge",
        detail: "Watch lots of free online videos without a plan, schedule, or practice goal.",
        best: false,
        costs: { money: -100, time: -2, energy: -1 },
        rewards: { momentum: 0, salaryPotential: 800, resilience: 0, careerSuccess: 0, jobSecurity: 0 },
        unlocks: [],
        resultSummary: "You learned something, but not in a way that strongly proves readiness.",
        misconception: "Free learning can help, but random learning is weaker than targeted, structured development."
      },
      {
        id: "ignore-gap",
        title: "Ignore the skill gap",
        detail: "Hope it will not matter and keep your money for later.",
        best: false,
        costs: { money: 0, time: 1, energy: 0 },
        rewards: { momentum: -2, salaryPotential: -500, resilience: 0, careerSuccess: -1, jobSecurity: -3 },
        unlocks: [],
        resultSummary: "You kept your cash, but damaged your short-term opportunity and future growth.",
        misconception: "Saving resources now can cost much more later if it blocks an opportunity window."
      }
    ],
    reflectionLabel: "Explain why your chosen training option is the strongest fit for the opportunity.",
    reflectionPlaceholder: "This training option is the best fit because...",
    evidenceType: "justification",
    completionPercent: 67,
    masteryPercent: 70
  },
  {
    id: "round-3",
    title: "Survive A Roadblock",
    subtitle: "A setback hits. Recover without losing the whole future you have been building.",
    skillId: "problem-solving",
    stateLabel: "Roadblock Event",
    prompt: "How does your Plan B keep the pathway alive after the setback?",
    goal: "You have been working toward an electrical pathway and building your employability profile.",
    barrier: "No apprenticeship offer arrives this year. Money is tighter, confidence drops, and family responsibilities increase.",
    challengeLabel: "Choose your roadblock recovery plan",
    challengeNote: "The best answer is not the easiest one. It is the one that keeps the pathway moving.",
    choices: [
      {
        id: "plan-b",
        title: "Activate Plan B",
        detail: "Take a pre-apprenticeship, build related work experience, seek advice, and reapply with stronger evidence next round.",
        best: true,
        costs: { money: -900, time: -2, energy: -2 },
        rewards: { momentum: 3, salaryPotential: 5000, resilience: 2, careerSuccess: 2, jobSecurity: 4, workLifeBalance: -2 },
        unlocks: ["Stronger re-entry route", "Industry referee"],
        resultSummary: "You absorbed the setback and turned it into a stronger alternative route instead of treating it as the end.",
        misconception: "A blocked pathway is not the same as a dead pathway. Lifelong learning means building the next route quickly."
      },
      {
        id: "pause-everything",
        title: "Pause everything for a year",
        detail: "Stop planning and hope the same opportunity appears later without any extra preparation.",
        best: false,
        costs: { money: 400, time: 1, energy: 1 },
        rewards: { momentum: -3, salaryPotential: -1500, resilience: -1, careerSuccess: -1, jobSecurity: -4 },
        unlocks: [],
        resultSummary: "You gained breathing room, but your pathway stalled and became less competitive.",
        misconception: "Waiting without a growth plan usually weakens the pathway instead of protecting it."
      },
      {
        id: "quit-goal",
        title: "Abandon the goal entirely",
        detail: "Give up on the career because the first route failed.",
        best: false,
        costs: { money: 0, time: 0, energy: -1 },
        rewards: { momentum: -4, salaryPotential: -2500, resilience: -2, careerSuccess: -2, jobSecurity: -3, workLifeBalance: 1 },
        unlocks: [],
        resultSummary: "You reduced pressure now, but closed a pathway that still had valid alternatives.",
        misconception: "This confuses setback with failure. The stronger lifelong-learning response is to revise the plan, not collapse it."
      }
    ],
    reflectionLabel: "Write your Plan B and explain how it keeps the career goal alive.",
    reflectionPlaceholder: "Plan B: ...\nWhy it still works: ...",
    evidenceType: "justification",
    completionPercent: 100,
    masteryPercent: 92
  }
];

const state = {
  student: null,
  completed: {},
  evidenceLog: [],
  outcomeLog: [],
  lastRoundSummary: null,
  selectedRoundId: null,
  resources: { ...INITIAL_RESOURCES }
};

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") {
    return null;
  }
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function queueLifelongReflectionForReview(supabase, evidenceRow, round, reflection, studentLogin, classId) {
  const moderation = window.CareerEmpireResponseModeration;
  if (!moderation || !evidenceRow?.id || !studentLogin?.id) return;
  const session = getPlayerSession();

  await moderation.queuePendingReview(supabase, {
    sourceEvidenceId: evidenceRow.id,
    studentId: studentLogin.id,
    classId,
    schoolId: studentLogin.schoolId || session.schoolId,
    moduleId: MODULE_ID,
    evidenceType: round.evidenceType,
    taskKey: round.id,
    taskLabel: round.title,
    promptText: round.reflectionLabel || round.prompt,
    responseText: reflection,
    student: {
      displayName: studentLogin.displayName || session.playerName,
      username: studentLogin.username || session.username
    }
  });
}

function getAuthState() {
  return readJsonStorage(AUTH_DEMO_STATE_KEY, {});
}

function getPlayerSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function writePlayerSession(patch) {
  const next = { ...getPlayerSession(), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function getStudentStorageKey(studentLogin = {}, session = {}) {
  return String(
    studentLogin.id ||
    studentLogin.username ||
    session.studentId ||
    session.username ||
    session.playerName ||
    "demo"
  );
}

function getLocalOwnedAssets(studentLogin = {}, session = {}) {
  const ownerKey = getStudentStorageKey(studentLogin, session);
  const groupedAssets = session.ownedAssetsByStudent && typeof session.ownedAssetsByStudent === "object"
    ? session.ownedAssetsByStudent[ownerKey]
    : null;
  if (Array.isArray(groupedAssets)) return groupedAssets;
  return Array.isArray(session.ownedAssets) ? session.ownedAssets : [];
}

function normaliseCareerAsset(asset = {}) {
  const code = asset.asset_code || asset.code || "";
  const catalogAsset = ASSET_CATALOG.find(item => item.code === code) || {};
  return {
    id: asset.id || `local-${code || "asset"}-${Date.now()}`,
    asset_code: code,
    asset_name: asset.asset_name || asset.name || catalogAsset.name || "Career upgrade",
    asset_category: asset.asset_category || asset.category || catalogAsset.category || "career",
    purchase_cost: Number(asset.purchase_cost || asset.cost || catalogAsset.cost || 0),
    purchased_at: asset.purchased_at || "",
    benefit: asset.benefit || catalogAsset.benefit || "Saved upgrade",
    effect: asset.effect || catalogAsset.effect || ""
  };
}

function mergeCareerAssets(...assetLists) {
  const seen = new Set();
  return assetLists.flat().filter(Boolean).map(normaliseCareerAsset).filter(asset => {
    const key = `${asset.asset_code}|${asset.purchase_cost}|${asset.purchased_at || asset.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildLifelongProgressSnapshot() {
  return {
    resources: state.resources,
    completed: state.completed,
    evidenceLog: state.evidenceLog,
    outcomeLog: state.outcomeLog,
    lastRoundSummary: state.lastRoundSummary,
    updatedAt: new Date().toISOString()
  };
}

function hasLifelongProgressSnapshotData(snapshot = {}) {
  return Object.keys(snapshot.completed || {}).length > 0
    || (snapshot.evidenceLog || []).length > 0
    || (snapshot.outcomeLog || []).length > 0
    || (snapshot.resources?.purchasedUpgrades || []).length > 0
    || Number(snapshot.resources?.salaryPotential || 0) !== Number(INITIAL_RESOURCES.salaryPotential || 0);
}

function writeSharedCareerAssets(nextAssets) {
  const authState = getAuthState();
  const studentLogin = authState.studentLogin || {};
  const session = getPlayerSession();
  const ownerKey = getStudentStorageKey(studentLogin, session);
  const ownedAssetsByStudent = {
    ...(session.ownedAssetsByStudent && typeof session.ownedAssetsByStudent === "object" ? session.ownedAssetsByStudent : {}),
    [ownerKey]: nextAssets
  };
  return { ownerKey, ownedAssetsByStudent };
}

function persistLifelongLocalProgress(extraPatch = {}) {
  const snapshot = buildLifelongProgressSnapshot();
  const session = getPlayerSession();
  const authState = getAuthState();
  const studentLogin = authState.studentLogin || {};
  const currentAssets = getLocalOwnedAssets(studentLogin, session);
  const nextAssets = mergeCareerAssets(currentAssets, state.resources.purchasedUpgrades || []);
  const { ownedAssetsByStudent } = writeSharedCareerAssets(nextAssets);
  const patch = {
    annualSalary: state.resources.salaryPotential,
    salary: state.resources.salaryPotential,
    workLifeBalance: state.resources.workLifeBalance,
    jobSecurity: state.resources.jobSecurity,
    ownedAssets: nextAssets,
    ownedAssetsByStudent,
    lifelongLearningProgress: snapshot,
    updatedAt: snapshot.updatedAt,
    ...extraPatch
  };

  if (!hasLifelongProgressSnapshotData(snapshot) && !nextAssets.length && !Object.keys(extraPatch).length) return session;
  return writePlayerSession(patch);
}

function hydrateFromLocalSession() {
  const authState = getAuthState();
  const studentLogin = authState.studentLogin || {};
  const session = getPlayerSession();
  const progress = session.lifelongLearningProgress || {};

  if (progress.resources) {
    state.resources = {
      ...state.resources,
      ...progress.resources,
      purchasedUpgrades: mergeCareerAssets(progress.resources.purchasedUpgrades || [])
    };
  }
  if (progress.completed) state.completed = progress.completed;
  if (Array.isArray(progress.evidenceLog)) state.evidenceLog = progress.evidenceLog;
  if (Array.isArray(progress.outcomeLog)) state.outcomeLog = progress.outcomeLog;
  if (progress.lastRoundSummary) state.lastRoundSummary = progress.lastRoundSummary;

  const sessionAssets = getLocalOwnedAssets(studentLogin, session);
  if (sessionAssets.length) {
    state.resources.purchasedUpgrades = mergeCareerAssets(state.resources.purchasedUpgrades, sessionAssets);
  }
  state.resources.salaryPotential = Math.max(
    Number(state.resources.salaryPotential || 0),
    Number(session.annualSalary ?? session.salary ?? 0),
    Number(INITIAL_RESOURCES.salaryPotential || 0)
  );
  state.resources.jobSecurity = Math.max(Number(state.resources.jobSecurity || 0), Number(session.jobSecurity || 0));
  state.resources.workLifeBalance = Math.max(Number(state.resources.workLifeBalance || 0), Number(session.workLifeBalance || 0));
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent({
    moduleId: MODULE_ID,
    ...entry
  });
}

function shouldWarnBeforeLeaving() {
  return Boolean(Object.keys(state.completed).length || state.selectedRoundId || state.resources.purchasedUpgrades.length);
}

function registerLeaveWarning() {
  window.addEventListener("beforeunload", event => {
    if (!shouldWarnBeforeLeaving()) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

async function getLoggedInStudent() {
  const authState = getAuthState();
  const studentLogin = authState.studentLogin;
  const session = getPlayerSession();
  if (!studentLogin?.id && !studentLogin?.username && !session.studentId && !session.playerName) return null;

  const supabase = await getSupabaseClientOrNull();
  const fallback = {
    id: studentLogin?.id || session.studentId || null,
    display_name: studentLogin?.displayName || session.playerName || studentLogin?.username || "Student",
    username: studentLogin?.username || session.username || "",
    classes: (studentLogin?.classCode || session.classCode) ? { class_code: studentLogin?.classCode || session.classCode } : null,
    schools: (studentLogin?.schoolName || session.schoolName) ? { name: studentLogin?.schoolName || session.schoolName } : null
  };

  if (studentLogin?.demo || session.demoMode || (studentLogin?.preview && !studentLogin?.id)) return fallback;
  if (!supabase || !studentLogin?.id) return fallback;

  const { data, error } = await supabase
    .from("students")
    .select("id, display_name, username, class_id, school_id, classes(class_code, name), schools(name)")
    .eq("id", studentLogin.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return fallback;
  }
  return data || fallback;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderFreeTextPrivacyNotice() {
  return `
    <div class="free-text-privacy-note">
      <strong>${escapeHtml(FREE_TEXT_PRIVACY_NOTICE.title)}</strong>
      <span>${escapeHtml(FREE_TEXT_PRIVACY_NOTICE.body)}</span>
    </div>
  `;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString()}`;
}

function getRoundById(roundId) {
  return ROUNDS.find(item => item.id === roundId);
}

function hasOwnedAsset(assetCode) {
  return state.resources.purchasedUpgrades.some(item => item.asset_code === assetCode);
}

function getChoiceOutcome(round, choice) {
  const costs = { ...choice.costs };
  const rewards = { ...choice.rewards };
  const modifiers = [];

  if (hasOwnedAsset("study-desk") && (round.id === "round-1" || round.id === "round-3") && costs.time < 0) {
    costs.time = Math.min(0, costs.time + 1);
    modifiers.push("Focused Study Desk saved 1 time.");
  }

  if (hasOwnedAsset("laptop-upgrade") && round.id === "round-2") {
    rewards.salaryPotential = Number(rewards.salaryPotential || 0) + 800;
    modifiers.push("Laptop Upgrade added +$800 salary potential.");
  }

  if (hasOwnedAsset("transport-pass") && (round.id === "round-1" || round.id === "round-3")) {
    rewards.momentum = Number(rewards.momentum || 0) + 1;
    modifiers.push("Transport Pass added +1 momentum.");
  }

  if (hasOwnedAsset("wellbeing-pack") && costs.energy < 0) {
    costs.energy = Math.min(0, costs.energy + 1);
    rewards.workLifeBalance = Number(rewards.workLifeBalance || 0) + 1;
    modifiers.push("Wellbeing Pack reduced energy loss and protected balance.");
  }

  if (hasOwnedAsset("rental-upgrade") && choice.best) {
    rewards.jobSecurity = Number(rewards.jobSecurity || 0) + 2;
    rewards.workLifeBalance = Number(rewards.workLifeBalance || 0) + 2;
    modifiers.push("Rental Upgrade improved security and stability.");
  }

  return { costs, rewards, modifiers };
}

function getStrongestSkillId() {
  const skillTotals = {
    communication: 0,
    "critical-thinking": 0,
    "problem-solving": 0,
    "time-management": 0
  };

  Object.values(state.completed).forEach(entry => {
    skillTotals[entry.skillId] = (skillTotals[entry.skillId] || 0) + (entry.correct ? 2 : 1);
  });

  return Object.entries(skillTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "time-management";
}

function renderHero() {
  const badges = document.getElementById("hero-badges");
  if (!badges) return;
  const session = getPlayerSession();
  const student = state.student;
  badges.innerHTML = student ? [
    `<span class="badge">Student: ${escapeHtml(student.display_name || student.username)}</span>`,
    `<span class="badge">School: ${escapeHtml(student.schools?.name || "Not set")}</span>`,
    `<span class="badge">Class: ${escapeHtml(student.classes?.class_code || "Not joined")}</span>`,
    `<span class="badge">Current role: ${escapeHtml(session.careerTitle || "Career Builder")}</span>`
  ].join("") : '<span class="badge">Log in as a student to save live Lifelong Learning progress.</span>';
}

function renderMetrics() {
  const roundsCompleted = Object.keys(state.completed).length;
  setText("metric-rounds", `${roundsCompleted}/${ROUNDS.length}`);
  setText("metric-money", formatCurrency(state.resources.money));
  setText("metric-salary", formatCurrency(state.resources.salaryPotential));
  setText("metric-momentum", String(state.resources.momentum));
}

function buildRewardChip(label, value, tone = "good") {
  return `<span class="reward-chip ${tone}">${escapeHtml(label)} ${escapeHtml(value)}</span>`;
}

function renderRewardStrip() {
  const strip = document.getElementById("reward-strip");
  if (!strip) return;

  if (!state.lastRoundSummary) {
    strip.innerHTML = `
      <div class="reward-banner">
        <strong>Career momentum starts here</strong>
        <p>Your next round will shift salary potential, pathway access, and future job security.</p>
      </div>
    `;
    return;
  }

  const summary = state.lastRoundSummary;
  strip.innerHTML = `
    <div class="reward-banner pulse-win">
      <strong>${escapeHtml(summary.title)}</strong>
      <p>${escapeHtml(summary.bannerText)}</p>
      <div class="reward-chip-row">
        ${summary.chips.join("")}
      </div>
    </div>
  `;
}

function renderAssetShop() {
  const container = document.getElementById("asset-shop");
  if (!container) return;

  container.innerHTML = ASSET_CATALOG.map(asset => {
    const owned = state.resources.purchasedUpgrades.some(item => item.asset_code === asset.code);
    const affordable = state.resources.money >= asset.cost;
    return `
      <article class="chapter-card asset-card">
        <div class="asset-top">
          <div class="asset-icon">${asset.emoji}</div>
          <div>
            <div class="chapter-kicker">${escapeHtml(asset.category)}</div>
            <strong>${escapeHtml(asset.name)}</strong>
          </div>
        </div>
        <p>${escapeHtml(asset.benefit)}</p>
        <div class="asset-meta">
          <span class="asset-price">${formatCurrency(asset.cost)}</span>
          <span class="small-note">${owned ? "Owned" : affordable ? "Affordable now" : "Save a bit more"}</span>
        </div>
        <button
          type="button"
          class="${owned ? "secondary-button" : "primary-button"}"
          data-buy-asset="${asset.code}"
          ${owned ? "disabled" : ""}
        >
          ${owned ? "Already Owned" : "Buy Upgrade"}
        </button>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-buy-asset]").forEach(button => {
    button.addEventListener("click", async () => {
      const asset = ASSET_CATALOG.find(item => item.code === button.dataset.buyAsset);
      if (!asset) return;
      await buyAsset(asset);
    });
  });
}

function renderOwnedAssets() {
  const container = document.getElementById("owned-assets");
  if (!container) return;
  if (!state.resources.purchasedUpgrades.length) {
    container.innerHTML = `
      <div class="evidence-item">
        <strong>No upgrades bought yet</strong>
        <p class="small-note">Use round rewards to invest in your study setup, transport, and life quality.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.resources.purchasedUpgrades.slice().reverse().map(asset => `
    <div class="evidence-item">
      <strong>${escapeHtml(asset.asset_name || asset.name)}</strong>
      <p>${escapeHtml(asset.benefit || "Stored as part of your Career Empire build.")}</p>
      <p class="small-note">${escapeHtml((asset.asset_category || asset.category || "upgrade").toUpperCase())} • ${formatCurrency(asset.purchase_cost || asset.cost || 0)}</p>
    </div>
  `).join("");
}

function renderResourceBoard() {
  const board = document.getElementById("resource-board");
  if (!board) return;
  const strongestSkillId = getStrongestSkillId();
  const strongestLabel = strongestSkillId.replaceAll("-", " ");

  board.innerHTML = `
    <div class="resource-list">
      <div class="resource-item">
        <span>Time</span>
        <strong>${state.resources.time}</strong>
      </div>
      <div class="resource-item">
        <span>Energy</span>
        <strong>${state.resources.energy}</strong>
      </div>
      <div class="resource-item">
        <span>Job Security</span>
        <strong>${state.resources.jobSecurity}%</strong>
      </div>
      <div class="resource-item">
        <span>Work-Life Balance</span>
        <strong>${state.resources.workLifeBalance}%</strong>
      </div>
      <div class="resource-item">
        <span>Resilience</span>
        <strong>+${state.resources.resilience}</strong>
      </div>
      <div class="resource-item">
        <span>Career Success</span>
        <strong>+${state.resources.careerSuccess}</strong>
      </div>
    </div>
    <div class="unlock-block">
      <p class="small-note">Unlocked routes</p>
      <div class="badge-row">
        ${state.resources.unlockedRoutes.length ? state.resources.unlockedRoutes.map(item => `<span class="badge">${escapeHtml(item)}</span>`).join("") : '<span class="badge">No extra routes unlocked yet</span>'}
      </div>
    </div>
    <div class="focus-skill mini-focus">
      <img src="${SKILL_LOGOS[strongestSkillId]}" alt="${escapeHtml(strongestLabel)} logo">
      <div>
        <strong>Strongest module skill</strong>
        <p>${escapeHtml(strongestLabel.replace(/\b\w/g, c => c.toUpperCase()))}</p>
      </div>
    </div>
  `;
}

function renderUpgradeEffects() {
  const container = document.getElementById("upgrade-effects");
  if (!container) return;
  if (!state.resources.purchasedUpgrades.length) {
    container.innerHTML = '<span class="badge">No active upgrade bonuses yet</span>';
    return;
  }
  container.innerHTML = state.resources.purchasedUpgrades.map(asset => {
    const catalog = ASSET_CATALOG.find(item => item.code === asset.asset_code);
    return `<span class="badge">${escapeHtml(catalog?.name || asset.asset_name)}: ${escapeHtml(catalog?.effect || "Active")}</span>`;
  }).join("");
}

function renderEvidenceLog() {
  const list = document.getElementById("evidence-log");
  if (!list) return;
  if (!state.evidenceLog.length) {
    list.innerHTML = '<div class="evidence-item"><strong>No evidence submitted yet</strong><p class="small-note">Each round saves a short teacher-visible explanation after the consequence plays out.</p></div>';
    return;
  }
  list.innerHTML = state.evidenceLog.slice().reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.chapterTitle)}</strong>
      <p>${escapeHtml(item.prompt)}</p>
      <p class="small-note">${escapeHtml(item.responsePreview)}</p>
    </div>
  `).join("");
}

function renderOutcomeLog() {
  const list = document.getElementById("outcome-log");
  if (!list) return;
  if (!state.outcomeLog.length) {
    list.innerHTML = '<div class="evidence-item"><strong>No career outcomes yet</strong><p class="small-note">Play a round to see money, pathway, and salary consequences land here.</p></div>';
    return;
  }

  list.innerHTML = state.outcomeLog.slice().reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.summary)}</p>
      <p class="small-note">${escapeHtml(item.deltaText)}</p>
    </div>
  `).join("");
}

function renderRoundSummary() {
  const container = document.getElementById("round-summary");
  if (!container) return;
  if (!state.lastRoundSummary) {
    container.innerHTML = `
      <div class="evidence-item">
        <strong>No round summary yet</strong>
        <p class="small-note">Clear one round and your reward breakdown will appear here.</p>
      </div>
    `;
    return;
  }

  const summary = state.lastRoundSummary;
  container.innerHTML = `
    <div class="evidence-item">
      <strong>${escapeHtml(summary.title)}</strong>
      <p>${escapeHtml(summary.summary)}</p>
      <div class="reward-chip-row">
        ${summary.chips.join("")}
      </div>
      <p class="small-note">${escapeHtml(summary.lesson)}</p>
    </div>
  `;
}

function renderNextTarget() {
  const container = document.getElementById("next-target");
  if (!container) return;
  const nextRound = ROUNDS.find(round => !state.completed[round.id]) || getRoundById(state.selectedRoundId) || ROUNDS[ROUNDS.length - 1];
  if (!nextRound) return;

  const targetText = state.completed[nextRound.id]
    ? "You have already cleared this round. Replaying it can still sharpen your explanation and pathway thinking."
    : nextRound.challengeNote;

  container.innerHTML = `
    <div class="evidence-item">
      <strong>${escapeHtml(nextRound.title)}</strong>
      <p>${escapeHtml(targetText)}</p>
      <div class="badge-row">
        <span class="badge">Focus: ${escapeHtml(nextRound.stateLabel)}</span>
        <span class="badge">Skill: ${escapeHtml(nextRound.skillId.replaceAll("-", " "))}</span>
      </div>
      <p class="small-note">${escapeHtml(nextRound.barrier)}</p>
    </div>
  `;
}

async function buyAsset(asset) {
  if (state.resources.money < asset.cost) {
    state.lastRoundSummary = {
      title: "Not enough money yet",
      bannerText: "Play another round or choose a stronger pathway move before buying this upgrade.",
      summary: `You need ${formatCurrency(asset.cost - state.resources.money)} more to buy ${asset.name}.`,
      lesson: "Good purchases should feel earned. Strong learning choices build the money and momentum to afford them.",
      chips: [buildRewardChip("Needed", formatCurrency(asset.cost - state.resources.money), "warn")]
    };
    renderRewardStrip();
    renderRoundSummary();
    return;
  }

  const owned = state.resources.purchasedUpgrades.some(item => item.asset_code === asset.code);
  if (owned) return;

  state.resources.money = clamp(state.resources.money - asset.cost, -2000, 25000);
  const storedAsset = {
    id: `local-${asset.code}-${Date.now()}`,
    asset_code: asset.code,
    asset_name: asset.name,
    asset_category: asset.category,
    purchase_cost: asset.cost,
    purchased_at: new Date().toISOString(),
    benefit: asset.benefit,
    effect: asset.effect
  };
  state.resources.purchasedUpgrades.push(storedAsset);
  state.lastRoundSummary = {
    title: `${asset.name} purchased`,
    bannerText: "Your learning gains just became a life upgrade you can keep.",
    summary: asset.benefit,
    lesson: "This is the wider Career Empire loop: better choices create better resources, and better resources improve your long-term life build.",
    chips: [
      buildRewardChip("Spent", formatCurrency(asset.cost), "warn"),
      buildRewardChip("Assets", `${state.resources.purchasedUpgrades.length} owned`, "good")
    ]
  };

  const session = getPlayerSession();
  const nextNetWorth = Math.max(0, Number(session.cumulativeNetWorth || 0) - asset.cost);
  const nextSavings = Math.max(0, Number(session.savings || 0) - asset.cost);
  persistLifelongLocalProgress({
    cumulativeNetWorth: nextNetWorth,
    savings: nextSavings,
    checkpoint: `asset-${asset.code}`
  });

  const supabase = await getSupabaseClientOrNull();
  const authState = getAuthState();
  const studentLogin = authState.studentLogin;
  const isUntrackedDemo = Boolean(studentLogin?.demo || session.demoMode || (studentLogin?.preview && !studentLogin?.id));
  if (supabase && studentLogin?.id && !isUntrackedDemo) {
    const { error: assetError } = await supabase
      .from("player_assets")
      .insert({
        student_id: studentLogin.id,
        asset_code: asset.code,
        asset_name: asset.name,
        asset_category: asset.category,
        purchase_cost: asset.cost
      });
    if (assetError) console.error(assetError);

    const { data: profile } = await supabase
      .from("player_profiles")
      .select("student_id, cumulative_net_worth, savings")
      .eq("student_id", studentLogin.id)
      .maybeSingle();

    if (profile) {
      const { error: profileError } = await supabase
        .from("player_profiles")
        .upsert({
          student_id: studentLogin.id,
          updated_at: new Date().toISOString(),
          cumulative_net_worth: Math.max(0, Number(profile.cumulative_net_worth || 0) - asset.cost),
          savings: Math.max(0, Number(profile.savings || 0) - asset.cost)
        }, { onConflict: "student_id" });
      if (profileError) console.error(profileError);
    }
  }

  renderMetrics();
  renderResourceBoard();
  renderRewardStrip();
  renderRoundSummary();
  renderUpgradeEffects();
  renderAssetShop();
  renderOwnedAssets();
}

function renderRoundMap() {
  const container = document.getElementById("chapter-map");
  if (!container) return;
  container.innerHTML = ROUNDS.map(round => {
    const complete = Boolean(state.completed[round.id]);
    return `
      <button type="button" class="chapter-card ${state.selectedRoundId === round.id ? "active" : ""}" data-round-id="${round.id}">
        <div class="chapter-header">
          <img class="chapter-logo" src="${SKILL_LOGOS[round.skillId]}" alt="${round.title} logo">
          <div>
            <div class="chapter-kicker">${escapeHtml(round.stateLabel)}</div>
            <strong>${escapeHtml(round.title)}</strong>
          </div>
        </div>
        <p>${escapeHtml(round.subtitle)}</p>
        <div class="progress-track"><div class="progress-fill" style="width: ${complete ? 100 : 0}%"></div></div>
        <p class="small-note">${complete ? "Round cleared" : "Ready to play"}</p>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-round-id]").forEach(button => {
    button.addEventListener("click", () => selectRound(button.dataset.roundId));
  });
}

function getDeltaText(choice) {
  const parts = [];
  if (choice.costs.money) parts.push(`Money ${choice.costs.money > 0 ? "+" : ""}${formatCurrency(choice.costs.money)}`);
  if (choice.costs.time) parts.push(`Time ${choice.costs.time > 0 ? "+" : ""}${choice.costs.time}`);
  if (choice.costs.energy) parts.push(`Energy ${choice.costs.energy > 0 ? "+" : ""}${choice.costs.energy}`);
  if (choice.rewards.momentum) parts.push(`Momentum ${choice.rewards.momentum > 0 ? "+" : ""}${choice.rewards.momentum}`);
  if (choice.rewards.salaryPotential) parts.push(`Salary potential ${choice.rewards.salaryPotential > 0 ? "+" : ""}${formatCurrency(choice.rewards.salaryPotential)}`);
  return parts.join(" • ");
}

function renderRoundStage() {
  const stage = document.getElementById("chapter-stage");
  if (!stage) return;
  const round = getRoundById(state.selectedRoundId);
  if (!round) {
    stage.innerHTML = '<div class="empty-state"><p>Select a round from the map to start the Lifelong Learning career simulation.</p></div>';
    return;
  }

  setText("chapter-title", round.title);
  setText("chapter-subtitle", round.subtitle);

  stage.innerHTML = `
    <div class="stage-split">
      <div class="stage-block stage-emphasis">
        <span class="eyebrow">Career Goal</span>
        <h3>${escapeHtml(round.goal)}</h3>
        <p class="subtitle">${escapeHtml(round.barrier)}</p>
      </div>
      <div class="stage-block">
        <span class="eyebrow">Round Tension</span>
        <h3>${escapeHtml(round.challengeLabel)}</h3>
        <p class="subtitle">${escapeHtml(round.challengeNote)}</p>
        <div class="badge-row">
          <span class="badge">Money: ${formatCurrency(state.resources.money)}</span>
          <span class="badge">Time: ${state.resources.time}</span>
          <span class="badge">Energy: ${state.resources.energy}</span>
          <span class="badge">Momentum: ${state.resources.momentum}</span>
        </div>
        ${state.resources.purchasedUpgrades.length ? `<p class="small-note">Active upgrade bonuses can improve some round outcomes below.</p>` : ""}
      </div>
    </div>
    <div class="stage-block">
      <span class="eyebrow">Choose Your Move</span>
      <h3>${escapeHtml(round.prompt)}</h3>
      <div class="choice-grid simulation-grid">
        ${round.choices.map(choice => {
          const outcome = getChoiceOutcome(round, choice);
          return `
          <button type="button" class="choice-card simulation-card" data-choice-id="${choice.id}">
            <div class="simulation-card-top">
              <img class="choice-logo" src="${SKILL_LOGOS[round.skillId]}" alt="${choice.title} logo">
              <div class="choice-copy">
                <strong>${escapeHtml(choice.title)}</strong>
                <span class="small-note">${escapeHtml(choice.detail)}</span>
              </div>
            </div>
            <div class="cost-row">
              <span class="cost-pill">Money ${outcome.costs.money > 0 ? "+" : ""}${formatCurrency(outcome.costs.money)}</span>
              <span class="cost-pill">Time ${outcome.costs.time > 0 ? "+" : ""}${outcome.costs.time}</span>
              <span class="cost-pill">Energy ${outcome.costs.energy > 0 ? "+" : ""}${outcome.costs.energy}</span>
            </div>
            ${outcome.modifiers.length ? `<p class="small-note">${escapeHtml(outcome.modifiers.join(" "))}</p>` : ""}
            <p class="small-note">Potential outcome: ${escapeHtml(choice.resultSummary)}</p>
          </button>
        `;
        }).join("")}
      </div>
    </div>
    <div class="stage-block">
      <span class="eyebrow">Teacher-Visible Evidence</span>
      <h3>${escapeHtml(round.reflectionLabel)}</h3>
      ${renderFreeTextPrivacyNotice()}
      <textarea id="chapter-reflection" placeholder="${escapeHtml(round.reflectionPlaceholder)}"></textarea>
      <div class="button-row">
        <button id="submit-chapter" class="primary-button" type="button">Lock In This Round</button>
        <button id="clear-chapter" class="secondary-button" type="button">Clear</button>
      </div>
    </div>
    <div id="chapter-result"></div>
  `;

  let selectedChoiceId = null;
  stage.querySelectorAll("[data-choice-id]").forEach(button => {
    button.addEventListener("click", () => {
      selectedChoiceId = button.dataset.choiceId;
      stage.querySelectorAll("[data-choice-id]").forEach(card => card.classList.remove("selected"));
      button.classList.add("selected");
    });
  });

  stage.querySelector("#clear-chapter").addEventListener("click", () => {
    selectedChoiceId = null;
    stage.querySelectorAll("[data-choice-id]").forEach(card => card.classList.remove("selected"));
    stage.querySelector("#chapter-reflection").value = "";
    const result = stage.querySelector("#chapter-result");
    if (result) result.innerHTML = "";
  });

  stage.querySelector("#submit-chapter").addEventListener("click", async () => {
    const reflection = stage.querySelector("#chapter-reflection").value.trim();
    if (!selectedChoiceId || !reflection) {
      renderRoundResult("Choose one move and complete the reflection before locking in the round.", false);
      return;
    }

    const choice = round.choices.find(item => item.id === selectedChoiceId);
    if (!choice) return;

    const outcome = getChoiceOutcome(round, choice);
    applyChoiceConsequences(round, choice, outcome, reflection);
    await saveRoundProgress(round, choice, outcome, reflection, choice.best);
    renderRoundResult(
      choice.best ? "Round cleared with a strong lifelong-learning strategy." : "Round cleared, but your pathway took a weaker turn.",
      choice.best,
      round,
      choice,
      outcome
    );
    renderMetrics();
    renderResourceBoard();
    renderRewardStrip();
    renderEvidenceLog();
    renderOutcomeLog();
    renderRoundSummary();
    renderNextTarget();
    renderUpgradeEffects();
    renderAssetShop();
    renderOwnedAssets();
    renderRoundMap();
  });
}

function applyChoiceConsequences(round, choice, outcome, reflection) {
  state.completed[round.id] = {
    roundId: round.id,
    completedAt: new Date().toISOString(),
    correct: choice.best,
    rewards: outcome.rewards,
    skillId: round.skillId,
    choiceId: choice.id
  };

  state.resources.money = clamp(state.resources.money + outcome.costs.money, -2000, 25000);
  state.resources.time = clamp(state.resources.time + outcome.costs.time, 0, 12);
  state.resources.energy = clamp(state.resources.energy + outcome.costs.energy, 0, 10);
  state.resources.momentum = clamp(state.resources.momentum + outcome.rewards.momentum, 0, 10);
  state.resources.salaryPotential = clamp(state.resources.salaryPotential + outcome.rewards.salaryPotential, 12000, 120000);
  state.resources.jobSecurity = clamp(state.resources.jobSecurity + (outcome.rewards.jobSecurity || 0), 0, 100);
  state.resources.workLifeBalance = clamp(state.resources.workLifeBalance + (outcome.rewards.workLifeBalance || 0), 0, 100);
  state.resources.resilience = clamp(state.resources.resilience + (outcome.rewards.resilience || 0), 0, 20);
  state.resources.careerSuccess = clamp(state.resources.careerSuccess + (outcome.rewards.careerSuccess || 0), -10, 25);

  choice.unlocks.forEach(item => {
    if (!state.resources.unlockedRoutes.includes(item)) state.resources.unlockedRoutes.push(item);
  });

  state.evidenceLog.push({
    chapterId: round.id,
    chapterTitle: round.title,
    prompt: round.prompt,
    responsePreview: reflection.slice(0, 140) + (reflection.length > 140 ? "..." : "")
  });

  state.outcomeLog.push({
    title: round.title,
    summary: outcome.modifiers.length ? `${choice.resultSummary} ${outcome.modifiers.join(" ")}` : choice.resultSummary,
    deltaText: getDeltaText({ costs: outcome.costs, rewards: outcome.rewards })
  });

  state.lastRoundSummary = {
    title: `${round.title} ${choice.best ? "rewarded" : "completed"}`,
    bannerText: choice.best
      ? "Strong pathway thinking improved your future options."
      : "You moved forward, but the weaker choice cost you some momentum.",
    summary: outcome.modifiers.length ? `${choice.resultSummary} ${outcome.modifiers.join(" ")}` : choice.resultSummary,
    lesson: choice.best
      ? "Best move: this round rewarded planning, flexibility, and targeted learning."
      : `Misconception to watch: ${choice.misconception}`,
    chips: [
      buildRewardChip("Money", `${outcome.costs.money > 0 ? "+" : ""}${formatCurrency(outcome.costs.money)}`, outcome.costs.money >= 0 ? "good" : "warn"),
      buildRewardChip("Time", `${outcome.costs.time > 0 ? "+" : ""}${outcome.costs.time}`, outcome.costs.time <= 0 ? "good" : "warn"),
      buildRewardChip("Energy", `${outcome.costs.energy > 0 ? "+" : ""}${outcome.costs.energy}`, outcome.costs.energy <= 0 ? "good" : "warn"),
      buildRewardChip("Momentum", `${outcome.rewards.momentum > 0 ? "+" : ""}${outcome.rewards.momentum || 0}`, (outcome.rewards.momentum || 0) >= 0 ? "good" : "warn"),
      buildRewardChip("Salary", `${outcome.rewards.salaryPotential > 0 ? "+" : ""}${formatCurrency(outcome.rewards.salaryPotential || 0)}`, (outcome.rewards.salaryPotential || 0) >= 0 ? "good" : "warn"),
      buildRewardChip("Security", `${outcome.rewards.jobSecurity > 0 ? "+" : ""}${outcome.rewards.jobSecurity || 0}%`, (outcome.rewards.jobSecurity || 0) >= 0 ? "good" : "warn")
    ].concat(outcome.modifiers.map(text => buildRewardChip("Bonus", text, "good")))
  };

  persistLifelongLocalProgress({
    careerTitle: "Lifelong Learner",
    checkpoint: round.id
  });
}

function renderRoundResult(message, correct, round = null, choice = null, outcome = null) {
  const container = document.getElementById("chapter-result");
  if (!container) return;
  container.innerHTML = `
    <div class="result-card ${correct ? "good-result" : "warn-result"}">
      <strong>${correct ? "Round cleared" : "Round cleared with a warning"}</strong>
      <p>${escapeHtml(message)}</p>
      ${choice ? `<p>${escapeHtml(choice.resultSummary)}</p>` : ""}
      ${outcome?.modifiers?.length ? `<p class="small-note">${escapeHtml(outcome.modifiers.join(" "))}</p>` : ""}
      ${choice ? `<p class="small-note">${escapeHtml(choice.best ? "Why this worked: it kept your pathway alive and improved your future earning power." : `Misconception to watch: ${choice.misconception}`)}</p>` : ""}
      ${round && choice ? `<p class="small-note">New career state: ${formatCurrency(state.resources.salaryPotential)} salary potential • ${state.resources.momentum} momentum • ${state.resources.jobSecurity}% job security.</p>` : ""}
    </div>
  `;
}

function selectRound(roundId) {
  state.selectedRoundId = roundId;
  renderRoundMap();
  renderRoundStage();
}

async function saveRoundProgress(round, choice, outcome, reflection, correct) {
  const supabase = await getSupabaseClientOrNull();
  const authState = getAuthState();
  const studentLogin = authState.studentLogin;
  const classroom = authState.classroom;
  const classId = classroom?.id || studentLogin?.classId || null;
  const session = getPlayerSession();
  const isUntrackedDemo = Boolean(studentLogin?.demo || session.demoMode || (studentLogin?.preview && !studentLogin?.id));
  const earnedDelta = Math.max(0, Number(outcome?.rewards?.salaryPotential || 0));
  const taxDelta = Math.max(0, Math.round(earnedDelta * 0.1));
  const savingsDelta = Math.max(0, Math.round(earnedDelta * 0.25));
  let existingProfile = null;

  if (supabase && studentLogin?.id && !isUntrackedDemo) {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("student_id, annual_salary, cumulative_net_worth, savings, tax_paid, career_success, job_security, work_life_balance, resilience")
      .eq("student_id", studentLogin.id)
      .maybeSingle();

    if (error) console.error(error);
    existingProfile = data || null;
  }

  const current = existingProfile || {
    annual_salary: 0,
    cumulative_net_worth: 0,
    savings: 0,
    tax_paid: 0,
    career_success: 0,
    job_security: 0,
    work_life_balance: 0,
    resilience: 0
  };
  const baseNetWorth = Math.max(Number(session.cumulativeNetWorth ?? 0), Number(current.cumulative_net_worth ?? 0), 0);
  const baseSavings = Math.max(Number(session.savings ?? 0), Number(current.savings ?? 0), 0);
  const baseTaxPaid = Math.max(Number(session.taxPaid ?? 0), Number(current.tax_paid ?? 0), 0);
  const nextNetWorth = Math.max(0, baseNetWorth + earnedDelta);
  const nextSavings = Math.max(0, baseSavings + savingsDelta);
  const nextTaxPaid = Math.max(0, baseTaxPaid + taxDelta);

  persistLifelongLocalProgress({
    studentId: studentLogin?.id || session.studentId || null,
    username: studentLogin?.username || session.username || "",
    playerName: studentLogin?.displayName || session.playerName || studentLogin?.username || "Student",
    schoolName: studentLogin?.schoolName || session.schoolName || "",
    classId,
    classCode: studentLogin?.classCode || session.classCode || "",
    className: studentLogin?.className || session.className || "",
    careerTitle: "Lifelong Learner",
    cumulativeNetWorth: nextNetWorth,
    savings: nextSavings,
    taxPaid: nextTaxPaid,
    checkpoint: round.id
  });
  pushEconomyLog({
    eventType: "progress-saved",
    checkpoint: round.id,
    label: round.title,
    detail: choice.title,
    earnedDelta,
    taxDelta,
    savingsDelta,
    annualSalaryAfter: state.resources.salaryPotential,
    netWorthAfter: nextNetWorth,
    savingsAfter: nextSavings,
    taxPaidAfter: nextTaxPaid
  });

  if (!supabase || !studentLogin?.id || isUntrackedDemo) return;

  const roundsCompleted = Object.keys(state.completed).length;
  const completionPercent = Math.round((roundsCompleted / ROUNDS.length) * 100);
  const masteryPercent = Math.round(
    Object.entries(state.completed).reduce((sum, [, entry]) => {
      const roundMeta = getRoundById(entry.roundId || round.id) || round;
      return sum + (entry.correct ? roundMeta.masteryPercent : Math.max(25, roundMeta.masteryPercent - 30));
    }, 0) / roundsCompleted
  );

  const { error: progressError } = await supabase
    .from("student_module_progress")
    .upsert({
      student_id: studentLogin.id,
      class_id: classId,
      module_id: MODULE_ID,
      completion_percent: completionPercent,
      mastery_percent: masteryPercent,
      attempts: roundsCompleted,
      unlocked: true,
      completed: roundsCompleted === ROUNDS.length,
      last_played_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: "student_id,module_id" });

  if (progressError) console.error(progressError);

  const evidenceText = [
    `Choice: ${choice.title}`,
    `Outcome: ${choice.resultSummary}`,
    outcome.modifiers?.length ? `Upgrade effects: ${outcome.modifiers.join(" ")}` : "",
    "",
    reflection
  ].join("\n");

  const { data: evidenceRow, error: evidenceError } = await supabase
    .from("assessment_evidence")
    .insert({
      student_id: studentLogin.id,
      class_id: classId,
      module_id: MODULE_ID,
      evidence_type: round.evidenceType,
      prompt: round.prompt,
      response_text: evidenceText,
      auto_score: correct ? 1 : 0.5
    })
    .select("id")
    .maybeSingle();

  if (evidenceError) console.error(evidenceError);
  else await queueLifelongReflectionForReview(supabase, evidenceRow, round, reflection, studentLogin, classId);

  const updatePayload = {
    student_id: studentLogin.id,
    updated_at: new Date().toISOString(),
    annual_salary: state.resources.salaryPotential,
    cumulative_net_worth: nextNetWorth,
    savings: nextSavings,
    tax_paid: nextTaxPaid,
    career_success: Number(current.career_success || 0) + Number(outcome.rewards.careerSuccess || 0),
    job_security: clamp(Number(current.job_security || 0) + Number(outcome.rewards.jobSecurity || 0), 0, 100),
    work_life_balance: clamp(Number(current.work_life_balance || 0) + Number(outcome.rewards.workLifeBalance || 0), 0, 100),
    resilience: clamp(Number(current.resilience || 0) + Number(outcome.rewards.resilience || 0), 0, 100),
    career_title: "Lifelong Learner"
  };

  const { error: profileError } = await supabase
    .from("player_profiles")
    .upsert(updatePayload, { onConflict: "student_id" });
  if (profileError) console.error(profileError);
}

async function hydrateFromSupabase() {
  const supabase = await getSupabaseClientOrNull();
  const authState = getAuthState();
  const studentLogin = authState.studentLogin;
  const session = getPlayerSession();
  if (!supabase || !studentLogin?.id || studentLogin.demo || session.demoMode || (studentLogin.preview && !studentLogin.id)) return;

  const { data: progressRows, error: progressError } = await supabase
    .from("assessment_evidence")
    .select("prompt, response_text, created_at")
    .eq("student_id", studentLogin.id)
    .eq("module_id", MODULE_ID)
    .order("created_at", { ascending: true });

  if (progressError) {
    console.error(progressError);
    return;
  }

  if (Array.isArray(progressRows) && progressRows.length) {
    state.evidenceLog = progressRows.map(row => {
      const matchedRound = ROUNDS.find(item => item.prompt === row.prompt);
      if (matchedRound && !state.completed[matchedRound.id]) {
        state.completed[matchedRound.id] = {
          roundId: matchedRound.id,
          completedAt: row.created_at,
          correct: true,
          rewards: {},
          skillId: matchedRound.skillId,
          choiceId: null
        };
      }
      return {
        chapterId: matchedRound?.id || "saved-round",
        chapterTitle: matchedRound?.title || "Saved round",
        prompt: row.prompt,
        responsePreview: String(row.response_text || "").slice(0, 140)
      };
    });
  }

  const { data: profile, error: profileError } = await supabase
    .from("player_profiles")
    .select("annual_salary, job_security, work_life_balance, resilience, career_success")
    .eq("student_id", studentLogin.id)
    .maybeSingle();

  if (!profileError && profile) {
    state.resources.salaryPotential = Math.max(state.resources.salaryPotential, Number(profile.annual_salary || 0));
    state.resources.jobSecurity = Math.max(state.resources.jobSecurity, Number(profile.job_security || 0));
    state.resources.workLifeBalance = Math.max(state.resources.workLifeBalance, Number(profile.work_life_balance || 0));
    state.resources.resilience = Math.max(state.resources.resilience, Number(profile.resilience || 0));
    state.resources.careerSuccess = Math.max(state.resources.careerSuccess, Number(profile.career_success || 0));
  }

  const { data: assetRows, error: assetError } = await supabase
    .from("player_assets")
    .select("asset_code, asset_name, asset_category, purchase_cost, purchased_at")
    .eq("student_id", studentLogin.id)
    .order("purchased_at", { ascending: true });

  if (!assetError && Array.isArray(assetRows)) {
    state.resources.purchasedUpgrades = mergeCareerAssets(
      state.resources.purchasedUpgrades,
      assetRows.map(row => ({
        ...row,
        benefit: ASSET_CATALOG.find(asset => asset.code === row.asset_code)?.benefit || "Saved upgrade"
      }))
    );
  }
}

async function init() {
  state.student = await getLoggedInStudent();
  hydrateFromLocalSession();
  await hydrateFromSupabase();
  persistLifelongLocalProgress();
  registerLeaveWarning();
  renderHero();
  renderMetrics();
  renderResourceBoard();
  renderRewardStrip();
  renderEvidenceLog();
  renderOutcomeLog();
  renderRoundSummary();
  renderNextTarget();
  renderUpgradeEffects();
  renderAssetShop();
  renderOwnedAssets();
  renderRoundMap();
  selectRound(ROUNDS[0].id);
}

init();
