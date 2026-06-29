const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "initiative";
const MODULE_STORAGE_KEY = "career-empire-initiative-progress-v1";
const ACTIVE_IDLE_LIMIT_MS = 45_000;
const COMMUNITY_TAX_RATE = 0.1;

const REWARD_ASSETS = {
  celebration: "../../Assets/EST Preparation/guide-character/guide-celebration.png",
  commiseration: "../../Assets/EST Preparation/guide-character/guide-thinking-top.png",
  salary: "../../Assets/Images and Animations/Celebration Reward Icons/Salary Banked.png",
  tax: "../../Assets/Images and Animations/Celebration Reward Icons/Tax contributed.png",
  signal: "../../Assets/Images and Animations/Celebration Reward Icons/Signal restored.png",
  complete: "../../Assets/Images and Animations/Celebration Reward Icons/Topic Complete.png"
};

const REWARD_MILESTONES = {
  "unlock-gate": {
    title: "Unlock Gate salary banked",
    detail: "Core initiative knowledge is secure enough to open mission choice.",
    earnedDelta: 500,
    icon: "signal"
  },
  "mission-proof": {
    title: "Mission proof salary banked",
    detail: "Your chosen activity produced accurate initiative evidence.",
    earnedDelta: 700,
    icon: "salary"
  },
  "proof-drop": {
    title: "Proof Drop salary banked",
    detail: "You proved the common curriculum evidence, not just the activity.",
    earnedDelta: 900,
    icon: "tax"
  },
  "memory-vault": {
    title: "Memory Vault salary banked",
    detail: "The initiative learning held after the applied task.",
    earnedDelta: 1200,
    icon: "complete"
  }
};

const IMPROVEMENT_REWARDS = {
  core: { label: "Unlock Gate best score improved", salaryPerPoint: 4 },
  pathway: { label: "Mission proof best score improved", salaryPerPoint: 5 },
  evidence: { label: "Proof Drop best score improved", salaryPerPoint: 6 },
  retention: { label: "Memory Vault best score improved", salaryPerPoint: 6 }
};

const BEHAVIOURS = [
  {
    id: "act",
    hook: "Act",
    label: "Being proactive",
    short: "Do something useful before being told.",
    teacherLanguage: "Anticipating problems or opportunities and acting early."
  },
  {
    id: "improve",
    hook: "Improve",
    label: "Improving work practices",
    short: "Make work safer, easier, clearer, or more efficient.",
    teacherLanguage: "Identifying ways to improve current work practices."
  },
  {
    id: "speak",
    hook: "Speak",
    label: "Vocalising opinions",
    short: "Share useful ideas, feedback, or concerns respectfully.",
    teacherLanguage: "Vocalising opinions, ideas, feedback, or safety concerns."
  },
  {
    id: "support",
    hook: "Support",
    label: "Helping fellow workers",
    short: "Step in to help colleagues and support teamwork.",
    teacherLanguage: "Helping fellow workers to support productivity and teamwork."
  },
  {
    id: "step-up",
    hook: "Step Up",
    label: "Seeking more responsibilities",
    short: "Volunteer to learn or take on extra duties.",
    teacherLanguage: "Seeking more responsibilities and developing new skills."
  }
];

const CORE_QUESTIONS = [
  {
    id: "definition",
    prompt: "Which statement best defines initiative?",
    options: [
      { value: "initiative", label: "Taking proactive action and contributing positively without always waiting to be told." },
      { value: "obedience", label: "Only doing exactly what a supervisor has already instructed." },
      { value: "solo", label: "Working alone and avoiding team input." },
      { value: "speed", label: "Finishing quickly, even if safety or quality is reduced." }
    ],
    correct: "initiative"
  },
  {
    id: "low-stock",
    prompt: "A worker notices stock is nearly empty and restocks before customers complain.",
    correct: "act"
  },
  {
    id: "shelf-labels",
    prompt: "A worker suggests clearer shelf labels because customers keep asking where items are.",
    correct: "improve"
  },
  {
    id: "hazard-report",
    prompt: "A worker tells a supervisor about a damaged item and a safety hazard.",
    correct: "speak"
  },
  {
    id: "busy-rush",
    prompt: "A worker helps a colleague serve customers during a busy period.",
    correct: "support"
  },
  {
    id: "new-register",
    prompt: "A worker volunteers to learn the new register system and help with stocktake.",
    correct: "step-up"
  }
];

const RETENTION_QUESTIONS = [
  {
    id: "retention-definition",
    prompt: "Initiative is more than acting alone. Which phrase best completes the idea?",
    options: [
      { value: "team", label: "It should improve work, support others, or add value to the workplace." },
      { value: "ignore", label: "It means ignoring procedures to prove independence." },
      { value: "wait", label: "It means waiting until a manager gives exact instructions." },
      { value: "compete", label: "It means competing with co-workers for attention." }
    ],
    correct: "team"
  },
  {
    id: "retention-improve",
    prompt: "A cleaner suggests moving supplies closer to the work area to reduce wasted time.",
    correct: "improve"
  },
  {
    id: "retention-speak",
    prompt: "A junior worker respectfully raises a concern about a rushed process that could cause mistakes.",
    correct: "speak"
  },
  {
    id: "retention-step-up",
    prompt: "A student on work placement asks to learn a new task after finishing assigned duties safely.",
    correct: "step-up"
  },
  {
    id: "retention-support",
    prompt: "A team member helps a new worker complete a task safely during a peak period.",
    correct: "support"
  }
];

const DIAGNOSTICS = [
  {
    id: "mastery",
    label: "I want challenge",
    supportTitle: "Mastery-oriented",
    supportCopy: "Provide challenge, visible progress, and room to improve the work further."
  },
  {
    id: "performance",
    label: "I panicked about getting it wrong",
    supportTitle: "Performance-driven",
    supportCopy: "Reframe mistakes as information and give a low-threat retry with clear success criteria."
  },
  {
    id: "self-efficacy",
    label: "I am not sure I can do it",
    supportTitle: "Low self-efficacy",
    supportCopy: "Use modelling, guided practice, and small visible wins before asking for independent evidence."
  },
  {
    id: "overwhelmed",
    label: "Too much at once",
    supportTitle: "Overwhelmed",
    supportCopy: "Simplify starting points, break tasks into achievable steps, and maintain calm expectations."
  },
  {
    id: "hopeless",
    label: "It feels pointless",
    supportTitle: "Experiencing hopelessness",
    supportCopy: "Rebuild belief through small wins, encouragement, relationships, and clear pathways to improvement."
  }
];

const PATHWAYS = [
  {
    id: "scenario",
    title: "Scenario Judge",
    mode: "Quiz engine",
    signal: "Decode",
    summary: "Classify workplace examples and explain why they show initiative.",
    evidenceType: "classification"
  },
  {
    id: "song",
    title: "Song Remix",
    mode: "Creative remix",
    signal: "Remix",
    summary: "Repair and remix the Initiative hook without losing the curriculum meaning.",
    evidenceType: "creative-retrieval"
  },
  {
    id: "interview",
    title: "Interview Mission",
    mode: "People evidence",
    signal: "Ask",
    summary: "Capture a safe, non-identifying interview example of initiative in action.",
    evidenceType: "justification"
  },
  {
    id: "journal",
    title: "Initiative Journal",
    mode: "Portfolio proof",
    signal: "Track",
    summary: "Log examples against the five behaviours as employability evidence.",
    evidenceType: "reflection"
  },
  {
    id: "occupation",
    title: "Occupation Lens",
    mode: "Career relevance",
    signal: "Lens",
    summary: "Explore what initiative looks like in your chosen or avatar occupation.",
    evidenceType: "occupation-transfer"
  }
];

const STAGE_FLOW = [
  { key: "core", sectionId: "core-section", phase: "core", complete: "Intel captured", active: "Scanning", ready: "Open" },
  { key: "checkpoint", sectionId: "core-check-section", phase: "core-check", complete: "Gate cleared", active: "Clear gate", ready: "Ready" },
  { key: "pathway", sectionId: "pathway-section", phase: "pathway", complete: "Mission proofed", active: "Choose mission", ready: "Unlocked", locked: "Clear gate first" },
  { key: "evidence", sectionId: "evidence-section", phase: "evidence", complete: "Proof banked", active: "Bank proof", ready: "Unlocked", locked: "Finish mission first" },
  { key: "retention", sectionId: "retention-section", phase: "retention", complete: "Vault sealed", active: "Seal vault", ready: "Unlocked", locked: "Bank proof first" }
];

const SCENARIO_ITEMS = [
  {
    id: "tools",
    prompt: "A warehouse assistant notices workers waste time searching for packing tools and suggests small supply stations.",
    correct: "improve"
  },
  {
    id: "queue",
    prompt: "A supervisor moves staff to service areas before queues become too long.",
    correct: "act"
  },
  {
    id: "new-worker",
    prompt: "A retail worker helps a new colleague complete a task safely.",
    correct: "support"
  },
  {
    id: "roster",
    prompt: "A worker uses sales patterns to recommend improved rostering for busy periods.",
    correct: "speak"
  }
];

const OCCUPATION_EXAMPLES = {
  carpenter: {
    label: "Carpenter",
    hints: ["checks materials before a job stalls", "suggests a safer setup", "helps an apprentice use tools correctly"]
  },
  lawyer: {
    label: "Lawyer",
    hints: ["prepares case notes early", "raises a risk in a document", "asks to assist with a more complex matter"]
  },
  nurse: {
    label: "Nurse",
    hints: ["notices a patient concern early", "suggests clearer handover notes", "supports a colleague during a busy shift"]
  },
  retail: {
    label: "Retail worker",
    hints: ["restocks before shelves empty", "reports a hazard", "helps with a display or stocktake"]
  },
  teacher: {
    label: "Teacher",
    hints: ["adapts a task when students are confused", "shares a useful resource", "supports a colleague with planning"]
  }
};

const DEFAULT_STATE = {
  startedAt: "",
  updatedAt: "",
  currentPhase: "core",
  coreAttempts: 0,
  coreAnswers: {},
  coreBestScore: 0,
  corePassed: false,
  diagnostic: "",
  selectedPathwayId: "",
  pathwayScores: {},
  pathwayEvidence: {},
  commonEvidence: {},
  commonEvidenceScore: 0,
  retentionAnswers: {},
  retentionBestScore: 0,
  completionPercent: 0,
  masteryPercent: 0,
  activeSeconds: 0,
  idleSeconds: 0,
  activeSecondsByPhase: {},
  activeSecondsByPathway: {},
  evidenceLog: [],
  savedSnapshots: 0,
  salaryBoost: 0,
  taxContribution: 0,
  rewardedMilestones: {},
  lastProgressOutcome: null
};

let state = loadState();
let lastInteractionAt = Date.now();
let saveTimer = 0;
let lastRewardConsoleSignature = "";

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  const saved = readJsonStorage(MODULE_STORAGE_KEY, null);
  const next = {
    ...cloneDefaultState(),
    ...(saved || {}),
    startedAt: saved?.startedAt || new Date().toISOString()
  };
  next.salaryBoost = Number(next.salaryBoost || 0);
  next.taxContribution = Number(next.taxContribution || 0);
  next.rewardedMilestones = next.rewardedMilestones && typeof next.rewardedMilestones === "object"
    ? next.rewardedMilestones
    : {};
  return next;
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(state));
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function getAuthState() {
  return readJsonStorage(AUTH_DEMO_STATE_KEY, {});
}

function getSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function getAvatarProfile() {
  const authState = getAuthState();
  const session = getSession();
  const username = authState?.studentLogin?.username || session?.username || "local";
  const avatarStore = readJsonStorage("career-empire-avatar-v1", {});
  return avatarStore?.profiles?.[username] || avatarStore?.currentProfile || {};
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalise(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function wordCount(value) {
  return normalise(value).split(/\s+/).filter(Boolean).length;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0))));
}

function formatDuration(seconds) {
  const safe = Math.max(0, Math.round(Number(seconds || 0)));
  if (safe < 60) return `${safe}s`;
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function getTaxDelta(earnedDelta) {
  return Math.round(Number(earnedDelta || 0) * COMMUNITY_TAX_RATE);
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent({
    moduleId: MODULE_ID,
    ...entry
  });
}

function applySessionReward(earnedDelta, taxDelta) {
  const session = getSession();
  const baseSalary = Math.max(25000, Number(session.annualSalary ?? session.salary ?? 25000));
  const baseTaxPaid = Math.max(0, Number(session.taxPaid || 0));
  const nextSalary = baseSalary + Number(earnedDelta || 0);
  const nextTaxPaid = baseTaxPaid + Number(taxDelta || 0);
  const patch = {
    annualSalary: nextSalary,
    salary: nextSalary,
    taxPaid: nextTaxPaid
  };
  if (window.CareerEmpireEconomy?.writeSession) {
    window.CareerEmpireEconomy.writeSession(patch);
  } else {
    localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify({ ...session, ...patch }));
  }
  return {
    annualSalaryAfter: nextSalary,
    taxPaidAfter: nextTaxPaid
  };
}

function behaviourOptionsHtml(includePlaceholder = true) {
  return `${includePlaceholder ? '<option value="">Choose...</option>' : ""}${BEHAVIOURS.map(item => `
    <option value="${escapeHtml(item.id)}">${escapeHtml(item.hook)} - ${escapeHtml(item.label)}</option>
  `).join("")}`;
}

function setHtml(id, html) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = html;
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function getStageByKey(stageKey) {
  return STAGE_FLOW.find(stage => stage.key === stageKey) || null;
}

function getStageKeyFromSectionId(sectionId) {
  return STAGE_FLOW.find(stage => stage.sectionId === sectionId)?.key || "";
}

function getStageKeyFromPhase(phase = state.currentPhase) {
  const safePhase = String(phase || "");
  if (safePhase.startsWith("pathway")) return "pathway";
  if (safePhase === "core-check") return "checkpoint";
  return STAGE_FLOW.find(stage => stage.phase === safePhase)?.key || "core";
}

function getPhaseForStage(stageKey) {
  if (stageKey === "pathway" && state.selectedPathwayId) return `pathway:${state.selectedPathwayId}`;
  return getStageByKey(stageKey)?.phase || "core";
}

function isStageAccessible(stageKey) {
  const pathwayScore = getPathwayScore();
  if (stageKey === "core" || stageKey === "checkpoint") return true;
  if (stageKey === "pathway") return Boolean(state.corePassed);
  if (stageKey === "evidence") return Boolean(state.corePassed && (pathwayScore >= 70 || state.commonEvidenceScore >= 80 || state.retentionBestScore >= 80));
  if (stageKey === "retention") return Boolean(state.corePassed && (state.commonEvidenceScore >= 80 || state.retentionBestScore >= 80));
  return false;
}

function isStageComplete(stageKey) {
  if (stageKey === "core" || stageKey === "checkpoint") return Boolean(state.corePassed);
  if (stageKey === "pathway") return getPathwayScore() >= 70;
  if (stageKey === "evidence") return Number(state.commonEvidenceScore || 0) >= 80;
  if (stageKey === "retention") return Number(state.retentionBestScore || 0) >= 80;
  return false;
}

function getAutomaticOpenStageKeys() {
  const pathwayScore = getPathwayScore();
  if (!state.corePassed) return new Set(["core", "checkpoint"]);
  if (Number(state.retentionBestScore || 0) >= 80) return new Set(["retention"]);
  if (Number(state.commonEvidenceScore || 0) >= 80) return new Set(["retention"]);
  if (pathwayScore >= 70) return new Set(["evidence"]);
  if (!state.selectedPathwayId || pathwayScore < 70) return new Set(["pathway"]);
  return new Set(["retention"]);
}

function getOpenStageKeys() {
  const open = getAutomaticOpenStageKeys();
  const manualStageKey = getStageKeyFromPhase();
  const vaultIsAutoOpen = open.has("retention");
  const manualIsSafeReview = !vaultIsAutoOpen || manualStageKey === "retention" || isStageComplete(manualStageKey);
  if (isStageAccessible(manualStageKey) && manualIsSafeReview) open.add(manualStageKey);
  return open;
}

function getStageStatusText(stage) {
  if (isStageComplete(stage.key)) return stage.complete;
  if (!isStageAccessible(stage.key)) return stage.locked || "Locked";
  if (getOpenStageKeys().has(stage.key)) return stage.active;
  return stage.ready;
}

function updateStageFlow() {
  const openStages = getOpenStageKeys();
  STAGE_FLOW.forEach(stage => {
    const section = document.getElementById(stage.sectionId);
    if (!section) return;
    const accessible = isStageAccessible(stage.key);
    const complete = isStageComplete(stage.key);
    const open = openStages.has(stage.key);
    section.classList.toggle("is-locked", !accessible);
    section.classList.toggle("is-current", accessible && open);
    section.classList.toggle("is-complete", complete);
    section.classList.toggle("is-compact", complete && !open);
    const status = section.querySelector(`[data-stage-status="${stage.key}"]`);
    if (status) status.textContent = getStageStatusText(stage);
  });

  document.querySelectorAll(".rail-step").forEach(button => {
    const stageKey = button.dataset.stageKey || getStageKeyFromSectionId(button.dataset.jumpSection);
    const accessible = isStageAccessible(stageKey);
    button.classList.toggle("is-complete", isStageComplete(stageKey));
    button.classList.toggle("is-active", accessible && openStages.has(stageKey));
    button.classList.toggle("is-locked", !accessible);
  });
}

function setPhaseFromElement(element) {
  const section = element?.closest?.("section[id]");
  if (!section) return;
  const stageKey = section.dataset.stageKey || getStageKeyFromSectionId(section.id);
  if (stageKey && isStageAccessible(stageKey)) {
    state.currentPhase = getPhaseForStage(stageKey);
    return;
  }
  const phaseMap = {
    "core-section": "core",
    "core-check-section": "core-check",
    "pathway-section": state.selectedPathwayId ? `pathway:${state.selectedPathwayId}` : "pathway",
    "evidence-section": "evidence",
    "retention-section": "retention"
  };
  state.currentPhase = phaseMap[section.id] || state.currentPhase;
}

function markActive(event) {
  lastInteractionAt = Date.now();
  setPhaseFromElement(event?.target);
}

function startTelemetry() {
  ["click", "keydown", "input", "change", "pointerdown", "play", "timeupdate"].forEach(eventName => {
    document.addEventListener(eventName, markActive, true);
  });

  window.setInterval(() => {
    const isVisible = document.visibilityState !== "hidden";
    const isActive = isVisible && Date.now() - lastInteractionAt <= ACTIVE_IDLE_LIMIT_MS;
    if (isActive) {
      state.activeSeconds += 1;
      const phaseKey = state.currentPhase || "core";
      state.activeSecondsByPhase[phaseKey] = Number(state.activeSecondsByPhase[phaseKey] || 0) + 1;
      if (state.selectedPathwayId && String(phaseKey).startsWith("pathway")) {
        state.activeSecondsByPathway[state.selectedPathwayId] = Number(state.activeSecondsByPathway[state.selectedPathwayId] || 0) + 1;
      }
    } else {
      state.idleSeconds += 1;
    }
    updateProgress();
    updateMetrics();
    scheduleSave();
  }, 1000);
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveState, 300);
}

function renderStudentContext() {
  const auth = getAuthState();
  const avatar = getAvatarProfile();
  const name = auth?.studentLogin?.displayName || auth?.studentLogin?.username || getSession()?.playerName || "Local learner";
  const occupation = avatar?.occupation || "occupation lens ready";
  setHtml("student-context", [
    `<span class="badge">Student: ${escapeHtml(name)}</span>`,
    `<span class="badge">Avatar: ${escapeHtml(occupation)}</span>`,
    `<span class="badge">Rule: unlock before missions</span>`
  ].join(""));
}

function renderCoreBehaviours() {
  setHtml("behaviour-grid", BEHAVIOURS.map(item => `
    <article class="behaviour-card">
      <span class="verb">${escapeHtml(item.hook)}</span>
      <h3>${escapeHtml(item.label)}</h3>
      <p>${escapeHtml(item.short)}</p>
    </article>
  `).join(""));

  const evidenceSelect = document.getElementById("evidence-behaviour");
  if (evidenceSelect) evidenceSelect.innerHTML = behaviourOptionsHtml();
}

function renderQuestion(question, answerMap, prefix) {
  const options = question.options || BEHAVIOURS.map(item => ({
    value: item.id,
    label: `${item.hook} - ${item.label}`
  }));
  const saved = answerMap[question.id] || "";
  return `
    <article class="question-card">
      <h3>${escapeHtml(question.prompt)}</h3>
      <select data-${prefix}-answer="${escapeHtml(question.id)}">
        <option value="">Choose...</option>
        ${options.map(option => `<option value="${escapeHtml(option.value)}" ${saved === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
      </select>
    </article>
  `;
}

function renderCoreDrill() {
  setHtml("core-drill", CORE_QUESTIONS.map(question => renderQuestion(question, state.coreAnswers, "core")).join(""));
  document.querySelectorAll("[data-core-answer]").forEach(select => {
    select.addEventListener("change", event => {
      state.coreAnswers[event.currentTarget.dataset.coreAnswer] = event.currentTarget.value;
      scheduleSave();
    });
  });
  renderCoreResult();
}

function scoreQuestions(questions, answers) {
  const correct = questions.filter(question => answers[question.id] === question.correct).length;
  return {
    correct,
    total: questions.length,
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0
  };
}

function submitCoreDrill() {
  state.coreAttempts += 1;
  const previousBest = Number(state.coreBestScore || 0);
  const score = scoreQuestions(CORE_QUESTIONS, state.coreAnswers);
  state.coreBestScore = Math.max(Number(state.coreBestScore || 0), score.percent);
  state.corePassed = state.coreBestScore >= 80;
  state.currentPhase = state.corePassed ? "pathway" : "core-check";
  addEvidenceLog("core-check", `Unlock Gate ${score.correct}/${score.total}`, score.percent);
  handleRewardCheck({
    surface: "core",
    milestoneKey: "unlock-gate",
    previousBest,
    nextBest: state.coreBestScore,
    latestScore: score.percent,
    passed: score.percent >= 80,
    nudgeTitle: score.percent >= 80 ? "Gate saved, salary already banked" : "Gate still locked",
    nudgeDetail: score.percent >= 80
      ? "Your gate pass is saved. No extra salary was added because this milestone was already banked."
      : "Use the feedback below and retry. Salary banks when your best result improves or the gate clears."
  });
  renderCoreResult(score);
  renderPathways();
  updateProgress();
  updateMetrics();
  saveState();
  saveTeacherSnapshot("core-check").catch(console.warn);
}

function renderCoreResult(latestScore = null) {
  const score = latestScore || scoreQuestions(CORE_QUESTIONS, state.coreAnswers);
  const panel = document.getElementById("core-result");
  if (!panel) return;
  const passed = state.corePassed;
  panel.classList.toggle("is-visible", Boolean(state.coreAttempts));
  panel.innerHTML = state.coreAttempts ? `
    <strong>${passed ? "Mission board unlocked" : "Unlock Gate not cleared yet"}</strong>
    <p>Latest visible score: ${score.correct}/${score.total}. Best score: ${state.coreBestScore}%.
    ${passed ? "Choose an applied mission next." : "You need at least 5 out of 6. Use the support prompt below before retrying."}</p>
  ` : "";
  renderDiagnosticPanel(!passed && state.coreAttempts > 0);
}

function renderDiagnosticPanel(show) {
  const panel = document.getElementById("diagnostic-panel");
  if (!panel) return;
  panel.classList.toggle("is-hidden", !show);
  setHtml("diagnostic-options", DIAGNOSTICS.map(item => `
    <button class="diagnostic-option ${state.diagnostic === item.id ? "is-selected" : ""}" type="button" data-diagnostic="${escapeHtml(item.id)}">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${escapeHtml(item.supportTitle)}</span>
    </button>
  `).join(""));
  panel.querySelectorAll("[data-diagnostic]").forEach(button => {
    button.addEventListener("click", event => {
      state.diagnostic = event.currentTarget.dataset.diagnostic;
      addEvidenceLog("diagnostic", `Selected support driver: ${getDiagnostic()?.supportTitle || state.diagnostic}`, null);
      renderDiagnosticPanel(true);
      updateMetrics();
      saveState();
    });
  });
}

function resetCoreDrill() {
  state.coreAnswers = {};
  state.currentPhase = "core-check";
  renderCoreDrill();
  updateMetrics();
  saveState();
}

function renderPathways() {
  const locked = !state.corePassed;
  setText("pathway-lock-note", locked ? "Locked until the Unlock Gate is cleared" : "Choose one mission, then bank the Proof Drop");
  setHtml("pathway-grid", PATHWAYS.map(pathway => {
    const score = state.pathwayScores[pathway.id]?.score || 0;
    return `
      <button class="pathway-card ${state.selectedPathwayId === pathway.id ? "is-active" : ""} ${locked ? "is-locked" : ""}" type="button" data-pathway="${escapeHtml(pathway.id)}" ${locked ? "disabled" : ""}>
        <span class="pathway-signal">${escapeHtml(pathway.signal)}</span>
        <h3>${escapeHtml(pathway.title)}</h3>
        <p>${escapeHtml(pathway.summary)}</p>
        <div class="pathway-meta">
          <span>${escapeHtml(pathway.mode)}</span>
          <span>${score ? `${score}% proof` : "not submitted"}</span>
        </div>
      </button>
    `;
  }).join(""));

  document.querySelectorAll("[data-pathway]").forEach(button => {
    button.addEventListener("click", event => selectPathway(event.currentTarget.dataset.pathway));
  });

  if (locked) {
    setHtml("pathway-stage", '<div class="empty-state"><p>Clear the Unlock Gate to open the Mission Board.</p></div>');
  } else if (state.selectedPathwayId) {
    renderPathwayStage();
  } else {
    setHtml("pathway-stage", '<div class="empty-state"><p>Choose a mission. Active time is tracked, but progress only moves when proof and recall are visible.</p></div>');
  }
}

function selectPathway(pathwayId) {
  if (!state.corePassed) return;
  const pathway = getPathway(pathwayId);
  state.selectedPathwayId = pathwayId;
  state.currentPhase = `pathway:${pathwayId}`;
  addEvidenceLog("pathway-start", `Started pathway: ${pathway?.title || pathwayId}`, null);
  renderPathways();
  updateProgress();
  saveState();
}

function getPathway(pathwayId = state.selectedPathwayId) {
  return PATHWAYS.find(item => item.id === pathwayId) || null;
}

function renderPathwayStage() {
  const pathway = getPathway();
  if (!pathway) return;
  const renderers = {
    scenario: renderScenarioPathway,
    song: renderSongPathway,
    interview: renderInterviewPathway,
    journal: renderJournalPathway,
    occupation: renderOccupationPathway
  };
  setHtml("pathway-stage", `
    <div class="section-title">
      <h2>${escapeHtml(pathway.title)}</h2>
      <p>${escapeHtml(pathway.mode)}</p>
    </div>
    ${renderers[pathway.id]?.() || ""}
    ${renderPathwayFeedback(pathway.id)}
  `);
  wirePathwaySubmit(pathway.id);
}

function renderPathwayFeedback(pathwayId) {
  const result = state.pathwayScores?.[pathwayId];
  if (!result) return "";
  const passed = Number(result.score || 0) >= 70;
  const feedback = Array.isArray(result.feedback) && result.feedback.length
    ? result.feedback
    : [result.detail || "Proof submitted."];
  return `
    <div id="pathway-feedback" class="result-panel pathway-feedback is-visible ${passed ? "success" : "warning"}">
      <strong>${passed ? "Mission proof accepted" : "Mission proof needs one more pass"}: ${Number(result.score || 0)}%</strong>
      <p>${escapeHtml(passed ? "You have enough proof to unlock the Proof Drop." : "The button worked, but the proof is not strong enough yet. Use the notes below, fix the task, and submit again.")}</p>
      <ul>
        ${feedback.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function getPathwayEvidence(pathwayId = state.selectedPathwayId) {
  if (!state.pathwayEvidence[pathwayId]) state.pathwayEvidence[pathwayId] = {};
  return state.pathwayEvidence[pathwayId];
}

function renderScenarioPathway() {
  const evidence = getPathwayEvidence("scenario");
  return `
    <div class="pathway-form" data-pathway-form="scenario">
      <div class="drill-grid">
        ${SCENARIO_ITEMS.map(item => `
          <article class="question-card">
            <h3>${escapeHtml(item.prompt)}</h3>
            <select data-scenario-answer="${escapeHtml(item.id)}">
              ${behaviourOptionsHtml()}
            </select>
          </article>
        `).join("")}
      </div>
      <label class="full">
        <span>Choose one scenario and explain why it shows initiative.</span>
        <textarea data-pathway-field="explanation" rows="4" placeholder="This shows initiative because...">${escapeHtml(evidence.explanation || "")}</textarea>
      </label>
      <button class="primary-button" type="button" data-submit-pathway="scenario">Submit scenario proof</button>
    </div>
  `;
}

function renderSongPathway() {
  const evidence = getPathwayEvidence("song");
  return `
    <div class="pathway-form" data-pathway-form="song">
      <div class="audio-strip">
        <div>
          <audio controls preload="metadata" src="../../Assets/EST Preparation/EST - Knowledge reactor/Initiative Song/Step In First - full guide mix.mp3"></audio>
          <p class="small-note">The fixed hook must stay accurate. You can improve the lines around it.</p>
        </div>
        <div class="fixed-hook">
          Act, Improve, Speak, Support, Step Up<br>
          That is initiative, clear to see<br>
          Making work better for the team
        </div>
      </div>
      <div class="form-grid">
        ${BEHAVIOURS.map(item => `
          <label>
            <span>${escapeHtml(item.hook)} line: ${escapeHtml(item.label)}</span>
            <textarea data-song-line="${escapeHtml(item.id)}" rows="3" placeholder="Write a lyric that keeps this meaning...">${escapeHtml(evidence.lines?.[item.id] || "")}</textarea>
          </label>
        `).join("")}
      </div>
      <label class="full">
        <span>Explain how your remix protects the Initiative content.</span>
        <textarea data-pathway-field="explanation" rows="4" placeholder="My remix still teaches initiative because...">${escapeHtml(evidence.explanation || "")}</textarea>
      </label>
      <button class="primary-button" type="button" data-submit-pathway="song">Submit remix proof</button>
    </div>
  `;
}

function renderInterviewPathway() {
  const evidence = getPathwayEvidence("interview");
  return `
    <div class="pathway-form" data-pathway-form="interview">
      <div class="result-panel is-visible">
        <strong>Privacy check</strong>
        <p>Do not use surnames, exact workplaces, phone numbers, socials, addresses, or identifying details. Use general labels like "a retail worker" or "a family member in construction".</p>
      </div>
      <div class="form-grid">
        <label>
          <span>Who did you interview or research?</span>
          <input data-pathway-field="person" type="text" value="${escapeHtml(evidence.person || "")}" placeholder="For example, family member in retail">
        </label>
        <label>
          <span>Which behaviour did they show?</span>
          <select data-pathway-field="behaviour">${behaviourOptionsHtml()}</select>
        </label>
        <label class="full">
          <span>What happened?</span>
          <textarea data-pathway-field="situation" rows="3" placeholder="Describe the non-identifying workplace situation...">${escapeHtml(evidence.situation || "")}</textarea>
        </label>
        <label class="full">
          <span>What action showed initiative?</span>
          <textarea data-pathway-field="action" rows="3" placeholder="They showed initiative by...">${escapeHtml(evidence.action || "")}</textarea>
        </label>
        <label class="full">
          <span>What changed because of it?</span>
          <textarea data-pathway-field="impact" rows="3" placeholder="The result was...">${escapeHtml(evidence.impact || "")}</textarea>
        </label>
      </div>
      <button class="primary-button" type="button" data-submit-pathway="interview">Submit interview proof</button>
    </div>
  `;
}

function renderJournalPathway() {
  const evidence = getPathwayEvidence("journal");
  const entries = evidence.entries || {};
  return `
    <div class="pathway-form" data-pathway-form="journal">
      <p class="lead-copy">Log a short example for at least three of the five initiative behaviours. They can be school, work placement, volunteering, sport, or family responsibility examples.</p>
      <div class="form-grid">
        ${BEHAVIOURS.map(item => `
          <label>
            <span>${escapeHtml(item.hook)} - ${escapeHtml(item.label)}</span>
            <textarea data-journal-entry="${escapeHtml(item.id)}" rows="3" placeholder="One specific example...">${escapeHtml(entries[item.id] || "")}</textarea>
          </label>
        `).join("")}
      </div>
      <button class="primary-button" type="button" data-submit-pathway="journal">Submit journal proof</button>
    </div>
  `;
}

function renderOccupationPathway() {
  const evidence = getPathwayEvidence("occupation");
  const avatar = getAvatarProfile();
  const avatarOccupation = String(avatar?.occupation || "").trim();
  const options = Object.entries(OCCUPATION_EXAMPLES);
  return `
    <div class="pathway-form" data-pathway-form="occupation">
      <div class="form-grid">
        <label>
          <span>Choose an occupation lens.</span>
          <select data-pathway-field="occupation">
            <option value="">Choose...</option>
            ${avatarOccupation ? `<option value="${escapeHtml(avatarOccupation)}">${escapeHtml(avatarOccupation)} from my avatar</option>` : ""}
            ${options.map(([key, item]) => `<option value="${escapeHtml(key)}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Main initiative behaviour</span>
          <select data-pathway-field="behaviour">${behaviourOptionsHtml()}</select>
        </label>
        <label class="full">
          <span>What does initiative look like in this occupation?</span>
          <textarea data-pathway-field="example" rows="4" placeholder="In this occupation, initiative could look like...">${escapeHtml(evidence.example || "")}</textarea>
        </label>
        <label class="full">
          <span>Why would an employer value it?</span>
          <textarea data-pathway-field="value" rows="4" placeholder="An employer would value this because...">${escapeHtml(evidence.value || "")}</textarea>
        </label>
      </div>
      <div id="occupation-hints" class="mini-evidence-card"></div>
      <button class="primary-button" type="button" data-submit-pathway="occupation">Submit occupation proof</button>
    </div>
  `;
}

function wirePathwaySubmit(pathwayId) {
  const evidence = getPathwayEvidence(pathwayId);
  const form = document.querySelector(`[data-pathway-form="${pathwayId}"]`);
  if (!form) return;

  form.querySelectorAll("[data-pathway-field]").forEach(input => {
    if (evidence[input.dataset.pathwayField]) input.value = evidence[input.dataset.pathwayField];
    input.addEventListener("input", event => {
      evidence[event.currentTarget.dataset.pathwayField] = event.currentTarget.value;
      scheduleSave();
      if (pathwayId === "occupation") renderOccupationHints();
    });
    input.addEventListener("change", event => {
      evidence[event.currentTarget.dataset.pathwayField] = event.currentTarget.value;
      scheduleSave();
      if (pathwayId === "occupation") renderOccupationHints();
    });
  });

  if (pathwayId === "scenario") {
    form.querySelectorAll("[data-scenario-answer]").forEach(select => {
      select.value = evidence.answers?.[select.dataset.scenarioAnswer] || "";
      select.addEventListener("change", event => {
        evidence.answers = evidence.answers || {};
        evidence.answers[event.currentTarget.dataset.scenarioAnswer] = event.currentTarget.value;
        scheduleSave();
      });
    });
  }

  if (pathwayId === "song") {
    form.querySelectorAll("[data-song-line]").forEach(textarea => {
      textarea.addEventListener("input", event => {
        evidence.lines = evidence.lines || {};
        evidence.lines[event.currentTarget.dataset.songLine] = event.currentTarget.value;
        scheduleSave();
      });
    });
  }

  if (pathwayId === "journal") {
    form.querySelectorAll("[data-journal-entry]").forEach(textarea => {
      textarea.addEventListener("input", event => {
        evidence.entries = evidence.entries || {};
        evidence.entries[event.currentTarget.dataset.journalEntry] = event.currentTarget.value;
        scheduleSave();
      });
    });
  }

  const submit = form.querySelector(`[data-submit-pathway="${pathwayId}"]`);
  if (submit) submit.addEventListener("click", () => submitPathway(pathwayId));
  if (pathwayId === "occupation") renderOccupationHints();
}

function renderOccupationHints() {
  const evidence = getPathwayEvidence("occupation");
  const key = String(evidence.occupation || "").toLowerCase();
  const match = OCCUPATION_EXAMPLES[key] || null;
  const hints = match?.hints || ["acting early", "improving a work process", "supporting the team"];
  setHtml("occupation-hints", `
    <strong>Possible evidence angles</strong>
    <p>${hints.map(escapeHtml).join(" | ")}</p>
  `);
}

function submitPathway(pathwayId) {
  const previousBest = getBestPathwayScore();
  const score = scorePathway(pathwayId);
  state.pathwayScores[pathwayId] = {
    score: score.percent,
    detail: score.detail,
    feedback: score.feedback || [],
    submittedAt: new Date().toISOString()
  };
  if (score.percent >= 70) state.currentPhase = "evidence";
  addEvidenceLog("pathway-evidence", `${getPathway(pathwayId)?.title || "Mission"} proof submitted`, score.percent);
  handleRewardCheck({
    surface: "pathway",
    milestoneKey: "mission-proof",
    previousBest,
    nextBest: getBestPathwayScore(),
    latestScore: score.percent,
    passed: score.percent >= 70,
    nudgeTitle: score.percent >= 70 ? "Mission proof saved, salary already banked" : "Mission proof not banked yet",
    nudgeDetail: score.percent >= 70
      ? "Your mission proof is strong enough. No extra salary was added because the mission milestone was already banked."
      : "The button worked, but salary needs stronger evidence. Fix the notes below, then resubmit for an improvement pulse."
  });
  renderPathways();
  updateProgress();
  updateMetrics();
  saveState();
  saveTeacherSnapshot(`pathway-${pathwayId}`).catch(console.warn);
  window.setTimeout(() => {
    document.getElementById("pathway-feedback")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 0);
}

function scorePathway(pathwayId) {
  const evidence = getPathwayEvidence(pathwayId);
  if (pathwayId === "scenario") {
    const answers = evidence.answers || {};
    const correct = SCENARIO_ITEMS.filter(item => answers[item.id] === item.correct).length;
    const explanation = wordCount(evidence.explanation) >= 12 ? 1 : 0;
    const total = SCENARIO_ITEMS.length + 1;
    const feedback = SCENARIO_ITEMS.map(item => {
      const expected = BEHAVIOURS.find(behaviour => behaviour.id === item.correct);
      const selected = BEHAVIOURS.find(behaviour => behaviour.id === answers[item.id]);
      if (answers[item.id] === item.correct) {
        return `Correct: ${item.prompt} maps to ${expected?.hook || item.correct}.`;
      }
      return `Check this one: ${item.prompt} should map to ${expected?.hook || item.correct}${selected ? `, not ${selected.hook}` : ""}.`;
    });
    feedback.push(explanation
      ? "Explanation length is strong enough."
      : "Add a fuller explanation: name the behaviour and explain the workplace effect in at least 12 words.");
    return {
      percent: Math.round(((correct + explanation) / total) * 100),
      detail: `${correct}/${SCENARIO_ITEMS.length} classifications plus explanation`,
      feedback
    };
  }
  if (pathwayId === "song") {
    const lines = evidence.lines || {};
    const strongLines = BEHAVIOURS.filter(item => wordCount(lines[item.id]) >= 5).length;
    const explanation = wordCount(evidence.explanation) >= 15 ? 1 : 0;
    const feedback = BEHAVIOURS.map(item => wordCount(lines[item.id]) >= 5
      ? `${item.hook} line is long enough to carry meaning.`
      : `Build the ${item.hook} line: write at least five words that keep the meaning of ${item.label}.`);
    feedback.push(explanation
      ? "Explanation protects the curriculum meaning."
      : "Add a 15+ word explanation of how the remix still teaches initiative accurately.");
    return { percent: Math.round(((strongLines + explanation) / 6) * 100), detail: `${strongLines}/5 behaviour lyric lines plus explanation`, feedback };
  }
  if (pathwayId === "interview") {
    const fields = ["person", "behaviour", "situation", "action", "impact"];
    const complete = fields.filter(field => field === "behaviour" ? evidence[field] : wordCount(evidence[field]) >= 5).length;
    const labels = {
      person: "who you interviewed or researched",
      behaviour: "which initiative behaviour they showed",
      situation: "what happened",
      action: "what action showed initiative",
      impact: "what changed because of it"
    };
    const feedback = fields.map(field => {
      const completeField = field === "behaviour" ? Boolean(evidence[field]) : wordCount(evidence[field]) >= 5;
      return completeField ? `${labels[field]} is complete.` : `Add more detail for ${labels[field]}.`;
    });
    return { percent: Math.round((complete / fields.length) * 100), detail: `${complete}/${fields.length} interview evidence fields`, feedback };
  }
  if (pathwayId === "journal") {
    const entries = evidence.entries || {};
    const complete = BEHAVIOURS.filter(item => wordCount(entries[item.id]) >= 6).length;
    const feedback = BEHAVIOURS.map(item => wordCount(entries[item.id]) >= 6
      ? `${item.hook} has a usable journal example.`
      : `Add a specific ${item.hook} example with at least six words.`);
    return { percent: Math.round((complete / 5) * 100), detail: `${complete}/5 journal behaviours logged`, feedback };
  }
  if (pathwayId === "occupation") {
    const fields = ["occupation", "behaviour", "example", "value"];
    const complete = fields.filter(field => field === "occupation" || field === "behaviour" ? evidence[field] : wordCount(evidence[field]) >= 8).length;
    const labels = {
      occupation: "occupation lens",
      behaviour: "main initiative behaviour",
      example: "what initiative looks like in the occupation",
      value: "why an employer would value it"
    };
    const feedback = fields.map(field => {
      const completeField = field === "occupation" || field === "behaviour" ? Boolean(evidence[field]) : wordCount(evidence[field]) >= 8;
      return completeField ? `${labels[field]} is complete.` : `Add more detail for ${labels[field]}.`;
    });
    return { percent: Math.round((complete / fields.length) * 100), detail: `${complete}/${fields.length} occupation transfer fields`, feedback };
  }
  return { percent: 0, detail: "No mission submitted", feedback: ["Choose a mission and submit proof."] };
}

function submitCommonEvidence() {
  const previousBest = Number(state.commonEvidenceScore || 0);
  const evidence = {
    definition: document.getElementById("evidence-definition")?.value || "",
    behaviour: document.getElementById("evidence-behaviour")?.value || "",
    why: document.getElementById("evidence-why")?.value || "",
    impact: document.getElementById("evidence-impact")?.value || "",
    occupation: document.getElementById("evidence-occupation")?.value || ""
  };
  state.commonEvidence = evidence;
  state.commonEvidenceScore = scoreCommonEvidence(evidence);
  if (state.commonEvidenceScore >= 80) state.currentPhase = "retention";
  addEvidenceLog("common-evidence", "Initiative proof drop submitted", state.commonEvidenceScore);
  handleRewardCheck({
    surface: "evidence",
    milestoneKey: "proof-drop",
    previousBest,
    nextBest: state.commonEvidenceScore,
    latestScore: state.commonEvidenceScore,
    passed: state.commonEvidenceScore >= 80,
    nudgeTitle: state.commonEvidenceScore >= 80 ? "Proof Drop saved, salary already banked" : "Proof Drop needs more evidence",
    nudgeDetail: state.commonEvidenceScore >= 80
      ? "Your common evidence is strong. No extra salary was added because the Proof Drop milestone was already banked."
      : "Add more curriculum language and workplace impact. Salary banks when this proof improves or reaches 80%."
  });
  renderCommonEvidenceFeedback();
  updateProgress();
  updateMetrics();
  saveState();
  saveTeacherSnapshot("common-evidence").catch(console.warn);
}

function scoreCommonEvidence(evidence) {
  const definitionWords = ["proactive", "action", "told", "improve", "workplace"];
  let score = 0;
  if (wordCount(evidence.definition) >= 8) score += 18;
  if (definitionWords.some(word => String(evidence.definition).toLowerCase().includes(word))) score += 12;
  if (evidence.behaviour) score += 15;
  if (wordCount(evidence.why) >= 12) score += 20;
  if (/\b(because|shows|without being told|proactive|responsibility|team)\b/i.test(evidence.why)) score += 10;
  if (wordCount(evidence.impact) >= 10) score += 15;
  if (wordCount(evidence.occupation) >= 1) score += 10;
  return clampPercent(score);
}

function restoreCommonEvidence() {
  const fields = {
    "evidence-definition": "definition",
    "evidence-behaviour": "behaviour",
    "evidence-why": "why",
    "evidence-impact": "impact",
    "evidence-occupation": "occupation"
  };
  Object.entries(fields).forEach(([elementId, key]) => {
    const element = document.getElementById(elementId);
    if (element) element.value = state.commonEvidence?.[key] || "";
  });
  renderCommonEvidenceFeedback();
}

function renderCommonEvidenceFeedback() {
  const panel = document.getElementById("evidence-feedback");
  if (!panel) return;
  panel.classList.toggle("is-visible", Number(state.commonEvidenceScore || 0) > 0);
  panel.innerHTML = Number(state.commonEvidenceScore || 0) ? `
    <strong>Proof Drop score: ${state.commonEvidenceScore}%</strong>
    <p>${state.commonEvidenceScore >= 80 ? "Strong proof. Open the Memory Vault to finish the module." : "Proof submitted, but it needs more curriculum detail before it is strong."}</p>
  ` : "";
}

function renderRetentionDrill() {
  setHtml("retention-drill", RETENTION_QUESTIONS.map(question => renderQuestion(question, state.retentionAnswers, "retention")).join(""));
  document.querySelectorAll("[data-retention-answer]").forEach(select => {
    select.addEventListener("change", event => {
      state.retentionAnswers[event.currentTarget.dataset.retentionAnswer] = event.currentTarget.value;
      scheduleSave();
    });
  });
  renderRetentionResult();
}

function submitRetention() {
  const previousBest = Number(state.retentionBestScore || 0);
  const score = scoreQuestions(RETENTION_QUESTIONS, state.retentionAnswers);
  state.retentionBestScore = Math.max(Number(state.retentionBestScore || 0), score.percent);
  addEvidenceLog("retention-check", `Retention check ${score.correct}/${score.total}`, score.percent);
  handleRewardCheck({
    surface: "retention",
    milestoneKey: "memory-vault",
    previousBest,
    nextBest: state.retentionBestScore,
    latestScore: score.percent,
    passed: score.percent >= 80,
    nudgeTitle: score.percent >= 80 ? "Memory saved, salary already banked" : "Memory Vault not sealed yet",
    nudgeDetail: score.percent >= 80
      ? "Your retention score is strong. No extra salary was added because the Memory Vault milestone was already banked."
      : "Review the five hook words, then retry. Salary banks when recall improves or reaches the vault threshold."
  });
  updateProgress();
  renderRetentionResult(score);
  updateMetrics();
  saveState();
  saveTeacherSnapshot("retention-check").catch(console.warn);
}

function renderRetentionResult(latestScore = null) {
  const score = latestScore || scoreQuestions(RETENTION_QUESTIONS, state.retentionAnswers);
  const panel = document.getElementById("retention-result");
  if (!panel) return;
  panel.classList.toggle("is-visible", Number(state.retentionBestScore || 0) > 0 || Object.keys(state.retentionAnswers || {}).length > 0);
  const complete = state.retentionBestScore >= 80 && state.completionPercent >= 100;
  panel.innerHTML = panel.classList.contains("is-visible") ? `
    <strong>${complete ? "Initiative Applied badge unlocked" : "Memory signal recorded"}</strong>
    <p>Latest visible score: ${score.correct}/${score.total}. Best retention score: ${state.retentionBestScore}%.
    ${state.retentionBestScore >= 80 ? "Your Memory Vault score is strong enough for completion if the mission and proof drop are also complete." : "Retake after reviewing the five behaviours."}</p>
  ` : "";
}

function addEvidenceLog(type, label, score) {
  state.evidenceLog.unshift({
    type,
    label,
    score,
    phase: state.currentPhase,
    activeSeconds: state.activeSeconds,
    at: new Date().toISOString()
  });
  state.evidenceLog = state.evidenceLog.slice(0, 20);
}

function setProgressOutcome(outcome = {}) {
  state.lastProgressOutcome = {
    type: outcome.type || "commiseration",
    title: outcome.title || "Learning signal recorded",
    detail: outcome.detail || "Your work was saved. Improve the evidence to bank the next salary reward.",
    earnedDelta: Number(outcome.earnedDelta || 0),
    taxDelta: Number(outcome.taxDelta || 0),
    scoreLabel: outcome.scoreLabel || "",
    icon: outcome.icon || "signal",
    at: new Date().toISOString()
  };
  lastRewardConsoleSignature = "";
}

function awardMilestone(milestoneKey, scorePercent) {
  const milestone = REWARD_MILESTONES[milestoneKey];
  if (!milestone || state.rewardedMilestones?.[milestoneKey]) return false;
  const earnedDelta = Number(milestone.earnedDelta || 0);
  const taxDelta = getTaxDelta(earnedDelta);
  state.rewardedMilestones[milestoneKey] = {
    at: new Date().toISOString(),
    earnedDelta,
    taxDelta,
    scorePercent: Number(scorePercent || 0)
  };
  state.salaryBoost = Number(state.salaryBoost || 0) + earnedDelta;
  state.taxContribution = Number(state.taxContribution || 0) + taxDelta;
  const sessionReward = applySessionReward(earnedDelta, taxDelta);
  addEvidenceLog("salary-reward", `${milestone.title}: ${formatCurrency(earnedDelta)}`, scorePercent);
  setProgressOutcome({
    type: "celebration",
    title: milestone.title,
    detail: `${milestone.detail} ${formatCurrency(earnedDelta)} salary and ${formatCurrency(taxDelta)} class tax were banked.`,
    earnedDelta,
    taxDelta,
    scoreLabel: `${Math.round(Number(scorePercent || 0))}%`,
    icon: milestone.icon || "salary"
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: milestoneKey,
    label: milestone.title,
    detail: milestone.detail,
    earnedDelta,
    taxDelta,
    ...sessionReward,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  return true;
}

function awardScoreImprovement(surface, previousPercent, nextPercent) {
  const rule = IMPROVEMENT_REWARDS[surface];
  const previous = Math.max(0, Number(previousPercent || 0));
  const next = Math.max(previous, Number(nextPercent || 0));
  const delta = next - previous;
  if (!rule || delta <= 0) return false;
  const earnedDelta = Math.max(0, Math.round(delta * rule.salaryPerPoint));
  if (!earnedDelta) return false;
  const taxDelta = getTaxDelta(earnedDelta);
  state.salaryBoost = Number(state.salaryBoost || 0) + earnedDelta;
  state.taxContribution = Number(state.taxContribution || 0) + taxDelta;
  const sessionReward = applySessionReward(earnedDelta, taxDelta);
  addEvidenceLog("salary-improvement", `${rule.label}: ${previous}% to ${next}%`, next);
  setProgressOutcome({
    type: "celebration",
    title: rule.label,
    detail: `Best result lifted from ${previous}% to ${next}%. ${formatCurrency(earnedDelta)} salary and ${formatCurrency(taxDelta)} class tax were banked for real progress.`,
    earnedDelta,
    taxDelta,
    scoreLabel: `${previous}% -> ${next}%`,
    icon: "salary"
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `${surface}-improvement`,
    label: rule.label,
    detail: `Best score improved from ${previous}% to ${next}%`,
    earnedDelta,
    taxDelta,
    ...sessionReward,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  return true;
}

function setProgressNudge(title, detail, scorePercent) {
  setProgressOutcome({
    type: "commiseration",
    title,
    detail,
    earnedDelta: 0,
    taxDelta: 0,
    scoreLabel: `${Math.round(Number(scorePercent || 0))}%`,
    icon: "signal"
  });
}

function handleRewardCheck(options = {}) {
  const latestScore = Math.round(Number(options.latestScore || 0));
  const nextBest = Math.round(Number(options.nextBest || latestScore || 0));
  const previousBest = Math.round(Number(options.previousBest || 0));
  if (options.passed && awardMilestone(options.milestoneKey, latestScore)) return;
  if (awardScoreImprovement(options.surface, previousBest, nextBest)) return;
  setProgressNudge(
    options.nudgeTitle || "Saved, but no new salary yet",
    options.nudgeDetail || "Your attempt was saved. To bank salary, improve the evidence or clear the next learning threshold.",
    latestScore
  );
}

function getDiagnostic() {
  return DIAGNOSTICS.find(item => item.id === state.diagnostic) || null;
}

function getPathwayScore() {
  const selected = state.selectedPathwayId;
  return selected ? Number(state.pathwayScores[selected]?.score || 0) : 0;
}

function getBestPathwayScore() {
  return Math.max(0, ...Object.values(state.pathwayScores || {}).map(result => Number(result?.score || 0)));
}

function updateProgress() {
  const corePart = state.corePassed ? 25 : Math.round(Math.min(25, (Number(state.coreBestScore || 0) / 80) * 25));
  const pathwayScore = getPathwayScore();
  const pathwayPart = pathwayScore >= 70 ? 25 : Math.round((pathwayScore / 70) * 25);
  const evidencePart = Number(state.commonEvidenceScore || 0) >= 80 ? 25 : Math.round((Number(state.commonEvidenceScore || 0) / 80) * 25);
  const retentionPart = Number(state.retentionBestScore || 0) >= 80 ? 25 : Math.round((Number(state.retentionBestScore || 0) / 80) * 25);
  state.completionPercent = clampPercent(corePart + pathwayPart + evidencePart + retentionPart);
  state.masteryPercent = clampPercent(
    Number(state.coreBestScore || 0) * 0.35
    + pathwayScore * 0.2
    + Number(state.commonEvidenceScore || 0) * 0.2
    + Number(state.retentionBestScore || 0) * 0.25
  );
}

function getSupportSignal() {
  const diagnostic = getDiagnostic();
  if (diagnostic) {
    return {
      level: diagnostic.id === "mastery" ? "good" : diagnostic.id === "hopeless" ? "concern" : "warning",
      title: diagnostic.supportTitle,
      copy: diagnostic.supportCopy
    };
  }
  if (state.corePassed && state.retentionBestScore >= 80 && state.commonEvidenceScore >= 80) {
    return {
      level: "good",
      title: "Mastery evidence visible",
      copy: "Student has cleared the gate, banked proof, and retained the key Initiative behaviours."
    };
  }
  if (state.activeSeconds > 1200 && state.completionPercent < 60) {
    return {
      level: "concern",
      title: "High time, low evidence",
      copy: "The student has spent significant active time without enough progress. Drill down into overwhelm, avoidance, or confidence."
    };
  }
  if (state.coreAttempts >= 2 && state.coreBestScore < 60) {
    return {
      level: "warning",
      title: "Core understanding needs modelling",
      copy: "Multiple checkpoint attempts are below the pass gate. Use examples, non-examples, and guided practice."
    };
  }
  if (state.corePassed && getPathwayScore() < 70 && state.activeSeconds > 600) {
    return {
      level: "warning",
      title: "Application not yet secure",
      copy: "The student knows the basics but has not turned the mission into clear curriculum proof yet."
    };
  }
  return {
    level: "neutral",
    title: "Learning signal building",
    copy: "The module is collecting active time, checkpoint results, pathway evidence, and retention data."
  };
}

function getInterventionPlan() {
  const pathwayScore = getPathwayScore();
  if (state.completionPercent >= 100 && state.retentionBestScore >= 80) {
    return {
      level: "extension",
      title: "Extension move",
      items: [
        "Create one strong example and one non-example of initiative for a chosen occupation.",
        "Explain how the example supports teamwork, safety, or efficiency.",
        "Peer-check another student's example by naming the exact initiative behaviour."
      ]
    };
  }

  if (state.corePassed && state.coreBestScore >= 90 && pathwayScore >= 70 && state.commonEvidenceScore < 80) {
    return {
      level: "support",
      title: "Proof precision move",
      items: [
        "Add the exact behaviour name from the five-part hook.",
        "Use because/how language to explain why the action is initiative.",
        "Add a workplace effect: safer, faster, clearer, more efficient, or stronger teamwork."
      ]
    };
  }

  if (state.corePassed && state.coreBestScore >= 90 && pathwayScore < 70) {
    return {
      level: "extension",
      title: "Mission board ready",
      items: [
        "Choose the mission that best matches your interest.",
        "Keep the five behaviours visible while building the product.",
        "Aim for evidence that could be understood by someone who has not seen the module."
      ]
    };
  }

  if (state.activeSeconds > 1200 && state.completionPercent < 60) {
    return {
      level: "concern",
      title: "High time, low evidence",
      items: [
        "Pause the open-ended pathway.",
        "Return to one worked example and one non-example.",
        "Use a teacher or peer conference to identify whether the blocker is confidence, overwhelm, avoidance, or misunderstanding."
      ]
    };
  }

  if (state.coreAttempts >= 2 && state.coreBestScore < 80) {
    const diagnostic = getDiagnostic();
    return {
      level: diagnostic?.id === "hopeless" ? "concern" : "support",
      title: diagnostic ? diagnostic.supportTitle : "Guided core practice",
      items: [
        "Match one workplace scenario to one hook word at a time.",
        "Say the full behaviour name after the hook word.",
        "Retry the checkpoint only after three correct examples in a row."
      ]
    };
  }

  if (state.coreAttempts === 1 && state.coreBestScore < 80) {
    return {
      level: "support",
      title: "First retry support",
      items: [
        "Review Act, Improve, Speak, Support, Step Up.",
        "Use the one-page summary to compare examples and non-examples.",
        "Select the support driver before the next attempt."
      ]
    };
  }

  if (state.corePassed) {
    return {
      level: "extension",
      title: "Mission board open",
      items: [
        "Choose a mission that helps the idea stick.",
        "Submit a product or example that names the behaviour and explains the workplace effect.",
        "Finish with the Memory Vault to prove the learning held."
      ]
    };
  }

  return {
    level: "support",
    title: "Intel scan first",
    items: [
      "Learn the five hook words.",
      "Connect each hook word to the full initiative behaviour.",
      "Clear the Unlock Gate before choosing an applied mission."
    ]
  };
}

function renderInterventionPlan() {
  const plan = getInterventionPlan();
  const panel = document.getElementById("intervention-plan");
  if (!panel) return;
  panel.className = `intervention-plan ${plan.level || ""}`;
  panel.innerHTML = `
    <strong>${escapeHtml(plan.title)}</strong>
    <ul>
      ${plan.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderRewardConsole() {
  const panel = document.getElementById("reward-console");
  if (!panel) return;
  const outcome = state.lastProgressOutcome || {
    type: "neutral",
    title: "Salary bank waiting",
    detail: "Bank salary and class tax by proving learning progress, not just spending time on the page.",
    earnedDelta: 0,
    taxDelta: 0,
    scoreLabel: "No attempt yet",
    icon: "signal",
    at: "initial"
  };
  const signature = [
    outcome.at,
    outcome.type,
    outcome.title,
    outcome.detail,
    state.salaryBoost,
    state.taxContribution
  ].join("|");
  if (signature === lastRewardConsoleSignature) return;
  lastRewardConsoleSignature = signature;

  const type = outcome.type || "neutral";
  const guideSrc = type === "celebration" ? REWARD_ASSETS.celebration : REWARD_ASSETS.commiseration;
  const iconSrc = REWARD_ASSETS[outcome.icon] || REWARD_ASSETS.signal;
  const earnedText = Number(outcome.earnedDelta || 0) > 0
    ? `+${formatCurrency(outcome.earnedDelta)} salary`
    : "No new salary";
  const taxText = Number(outcome.taxDelta || 0) > 0
    ? `+${formatCurrency(outcome.taxDelta)} tax`
    : "No new tax";

  panel.className = `reward-console is-${type}`;
  panel.innerHTML = `
    <div class="reward-visual" aria-hidden="true">
      <img class="reward-guide" src="${escapeHtml(guideSrc)}" alt="">
      <img class="reward-icon" src="${escapeHtml(iconSrc)}" alt="">
      <span class="reward-spark reward-spark--one"></span>
      <span class="reward-spark reward-spark--two"></span>
      <span class="reward-spark reward-spark--three"></span>
    </div>
    <div class="reward-copy">
      <strong>${escapeHtml(outcome.title)}</strong>
      <p>${escapeHtml(outcome.detail)}</p>
      <div class="reward-chip-row">
        <span>${escapeHtml(outcome.scoreLabel || "Signal recorded")}</span>
        <span>${escapeHtml(earnedText)}</span>
        <span>${escapeHtml(taxText)}</span>
      </div>
      <div class="reward-totals">
        <span>Total salary ${escapeHtml(formatCurrency(state.salaryBoost))}</span>
        <span>Class tax ${escapeHtml(formatCurrency(state.taxContribution))}</span>
      </div>
    </div>
  `;

}

function updateMetrics() {
  updateProgress();
  setText("metric-active-time", formatDuration(state.activeSeconds));
  setText("metric-core-score", `${state.coreBestScore || 0}%`);
  setText("metric-retention-score", `${state.retentionBestScore || 0}%`);
  setText("metric-progress", `${state.completionPercent || 0}%`);
  setText("metric-salary-boost", formatCurrency(state.salaryBoost));
  setText("metric-tax-contribution", formatCurrency(state.taxContribution));
  setText("evidence-state", state.completionPercent >= 100 ? "Complete" : state.corePassed ? "Mission active" : "Gate pending");

  const signal = getSupportSignal();
  const signalPanel = document.getElementById("support-signal");
  if (signalPanel) {
    signalPanel.className = `support-signal ${signal.level === "neutral" ? "" : signal.level}`;
    signalPanel.innerHTML = `<strong>${escapeHtml(signal.title)}</strong><p>${escapeHtml(signal.copy)}</p>`;
  }

  renderInterventionPlan();
  renderRewardConsole();
  updateStageFlow();
}

function buildSnapshot(taskName = "snapshot") {
  const pathway = getPathway();
  const signal = getSupportSignal();
  return {
    module_id: MODULE_ID,
    task_name: taskName,
    topic_group: "Initiative Applied Learning",
    prompt_text: "Core learning plus applied pathway evidence for initiative.",
    response_text: buildEvidenceResponseText(),
    score_percent: state.masteryPercent,
    completion_percent: state.completionPercent,
    core_score_percent: Number(state.coreBestScore || 0),
    retention_score_percent: Number(state.retentionBestScore || 0),
    common_evidence_score_percent: Number(state.commonEvidenceScore || 0),
    pathway_id: state.selectedPathwayId,
    pathway_title: pathway?.title || "",
    pathway_score_percent: getPathwayScore(),
    salary_boost: Number(state.salaryBoost || 0),
    tax_contribution: Number(state.taxContribution || 0),
    rewarded_milestones: state.rewardedMilestones,
    last_progress_outcome: state.lastProgressOutcome,
    support_signal: signal.title,
    support_signal_detail: signal.copy,
    diagnostic: state.diagnostic,
    duration_seconds: Number(state.activeSeconds || 0),
    idle_seconds: Number(state.idleSeconds || 0),
    active_seconds_by_phase: state.activeSecondsByPhase,
    active_seconds_by_pathway: state.activeSecondsByPathway,
    evidence_log: state.evidenceLog.slice(0, 8),
    completed: state.completionPercent >= 100,
    updated_at: new Date().toISOString()
  };
}

function buildEvidenceResponseText() {
  const selectedBehaviour = BEHAVIOURS.find(item => item.id === state.commonEvidence?.behaviour);
  return [
    state.commonEvidence?.definition ? `Definition: ${state.commonEvidence.definition}` : "",
    selectedBehaviour ? `Behaviour: ${selectedBehaviour.label}` : "",
    state.commonEvidence?.why ? `Why: ${state.commonEvidence.why}` : "",
    state.commonEvidence?.impact ? `Impact: ${state.commonEvidence.impact}` : "",
    state.commonEvidence?.occupation ? `Occupation: ${state.commonEvidence.occupation}` : ""
  ].filter(Boolean).join("\n");
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") return null;
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
}

async function saveTeacherSnapshot(taskName = "snapshot") {
  updateProgress();
  state.savedSnapshots += 1;
  saveState();
  const snapshot = buildSnapshot(taskName);
  addEvidenceLog("teacher-snapshot", `Saved teacher snapshot: ${taskName}`, snapshot.score_percent);
  setText("evidence-state", "Saving...");

  const auth = getAuthState();
  const student = auth?.studentLogin || {};
  const session = getSession();
  const isDemo = Boolean(student.demo || student.preview);
  const classId = student.classId || session.classId || "";
  const supabase = await getSupabaseClientOrNull();
  if (!supabase || !student.id || isDemo) {
    setText("evidence-state", snapshot.completed ? "Complete locally" : "Saved locally");
    saveState();
    return;
  }

  const progressPayload = {
    student_id: student.id,
    class_id: classId,
    module_id: MODULE_ID,
    completion_percent: snapshot.completion_percent,
    mastery_percent: snapshot.score_percent,
    attempts: Math.max(1, state.coreAttempts + state.savedSnapshots),
    unlocked: true,
    completed: snapshot.completed,
    last_played_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: progressError } = await supabase
    .from("student_module_progress")
    .upsert(progressPayload, { onConflict: "student_id,module_id" });
  if (progressError) console.error(progressError);

  const { error: evidenceError } = await supabase
    .from("assessment_evidence")
    .insert({
      student_id: student.id,
      class_id: classId,
      module_id: MODULE_ID,
      evidence_type: "justification",
      prompt: snapshot.prompt_text,
      response_text: JSON.stringify(snapshot),
      auto_score: snapshot.score_percent
    });
  if (evidenceError) console.error(evidenceError);

  setText("evidence-state", snapshot.completed ? "Complete and saved" : "Saved for teacher");
  saveState();
}

function wireEvents() {
  document.getElementById("submit-core-drill")?.addEventListener("click", submitCoreDrill);
  document.getElementById("retry-core-drill")?.addEventListener("click", resetCoreDrill);
  document.getElementById("submit-common-evidence")?.addEventListener("click", submitCommonEvidence);
  document.getElementById("submit-retention")?.addEventListener("click", submitRetention);
  document.getElementById("save-teacher-snapshot")?.addEventListener("click", () => saveTeacherSnapshot("manual-snapshot").catch(console.warn));
  document.getElementById("reset-module")?.addEventListener("click", () => {
    localStorage.removeItem(MODULE_STORAGE_KEY);
    state = loadState();
    lastRewardConsoleSignature = "";
    renderAll();
    saveState();
  });
  document.querySelectorAll("[data-jump-section]").forEach(button => {
    button.addEventListener("click", event => {
      const stageKey = event.currentTarget.dataset.stageKey || getStageKeyFromSectionId(event.currentTarget.dataset.jumpSection);
      if (isStageAccessible(stageKey)) {
        state.currentPhase = getPhaseForStage(stageKey);
        updateMetrics();
        scheduleSave();
      }
      const target = document.getElementById(event.currentTarget.dataset.jumpSection);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderAll() {
  clearTransientAttemptAnswers();
  renderStudentContext();
  renderCoreBehaviours();
  renderCoreDrill();
  renderPathways();
  restoreCommonEvidence();
  updateProgress();
  renderRetentionDrill();
  updateMetrics();
}

function init() {
  renderAll();
  wireEvents();
  startTelemetry();
  saveState();
}

init();

function clearTransientAttemptAnswers() {
  state.coreAnswers = {};
  state.retentionAnswers = {};
  if (state.commonEvidence?.behaviour) {
    state.commonEvidence.behaviour = "";
  }
  Object.values(state.pathwayEvidence || {}).forEach(evidence => {
    if (evidence && typeof evidence === "object" && evidence.behaviour) {
      evidence.behaviour = "";
    }
  });
  if (state.pathwayEvidence?.scenario?.answers) {
    state.pathwayEvidence.scenario.answers = {};
  }
}
