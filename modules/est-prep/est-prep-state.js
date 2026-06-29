// EST Prep state bundle. Loaded as a classic browser script.
const state = {
  student: null,
  bank: null,
  stageDeck: null,
  selectedStageId: null,
  stageStartedAt: 0,
  stageActiveSeconds: 0,
  stageActiveLastAt: 0,
  activeTimerLastUserAt: 0,
  completed: {},
  evidenceLog: [],
  debriefLog: [],
  recentReward: null,
  contentStageConfig: null,
  marksBanked: 0,
  readiness: 0,
  confidence: 40,
  streak: 1,
  salaryBoost: 0,
  creditedSalaryBoost: 0,
  taxContribution: 0,
  creditedTaxContribution: 0,
  answers: {},
  lastBossReview: null,
  decoderRoundIndex: 0,
  decoderTransitionFeedback: null,
  decoderResults: {},
  contentGroupIndex: -1,
  contentView: "menu",
  contentGroupStartedAt: 0,
  contentGroupDurations: {},
  contentTopicBestScores: {},
  contentTopicVotes: {},
  contentTopicVoteSaves: {},
  contentTopicResetAt: {},
  contentReminderDismissed: {},
  lastContentTopicReview: null,
  glossaryBoard: [],
  glossarySelection: [],
  matchedGlossaryCards: [],
  matchedGlossaryTerms: [],
  glossaryTarget: null,
  glossaryRoundIndex: 0,
  glossaryBatchIndex: 0,
  glossaryAssignments: {},
  glossarySelectedTermId: "",
  glossarySelectedSocketId: "",
  glossaryDraggedTermId: "",
  glossaryRecallAnswers: {},
  glossaryRecallResults: {},
  glossaryRecallIndex: 0,
  glossaryRecallTransition: null,
  glossaryStreak: 0,
  glossaryBestStreak: 0,
  glossaryMisses: 0,
  glossaryPulse: "",
  glossaryPulseType: "neutral",
  glossaryRoundCelebration: null,
  glossaryRoundRewards: {},
  glossaryRoundVotes: {},
  glossaryCommunityAssetReady: {},
  glossaryMissionMode: false,
  glossaryRoundStartedAt: 0,
  glossaryRoundActiveSeconds: 0,
  glossaryRoundLastAt: 0,
  glossaryRunStartedAt: 0,
  glossaryHasStarted: false,
  glossaryMode: "play",
  glossaryStudyIndex: 0,
  glossaryTermStats: {},
  stageBestScores: {},
  arcFlows: {}
};

const EST_PROGRESS_ARCHIVE_KEY = "career-empire-est-prep-progress-v1";
const ACTIVE_TASK_IDLE_GRACE_MS = 45000;
const ACTIVE_TASK_MAX_GAP_MS = 15000;

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

function getPlayerSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function writePlayerSession(patch) {
  const next = { ...getPlayerSession(), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function getESTProgressArchiveIdentity(student = state.student, session = getPlayerSession()) {
  const studentId = student?.id || session.studentId || "";
  if (studentId) return `id:${studentId}`;

  const username = String(student?.username || session.username || session.playerName || "").trim().toLowerCase();
  if (!username) return "";

  const classKey = String(student?.classId || student?.classCode || session.classId || session.classCode || "no-class").trim().toLowerCase();
  return `user:${classKey}:${username}`;
}

function buildESTProgressSnapshot() {
  return {
    estPrepDeck: state.stageDeck,
    estPrepProgress: {
      selectedStageId: state.selectedStageId,
      marksBanked: state.marksBanked,
      readiness: state.readiness,
      confidence: state.confidence,
      salaryBoost: state.salaryBoost,
      creditedSalaryBoost: state.creditedSalaryBoost,
      taxContribution: state.taxContribution,
      creditedTaxContribution: state.creditedTaxContribution,
      answers: state.answers,
      decoderRoundIndex: state.decoderRoundIndex,
      decoderResults: state.decoderResults,
      contentGroupIndex: state.contentGroupIndex,
      contentView: state.contentView,
      arcFlows: state.arcFlows,
      contentTopicBestScores: state.contentTopicBestScores,
      contentTopicVotes: state.contentTopicVotes,
      contentTopicVoteSaves: state.contentTopicVoteSaves,
      contentTopicResetAt: state.contentTopicResetAt,
      lastContentTopicReview: state.lastContentTopicReview,
      completed: state.completed,
      stageBestScores: state.stageBestScores,
      glossaryAssignments: state.glossaryAssignments,
      glossaryBatchIndex: state.glossaryBatchIndex,
      glossaryRoundIndex: state.glossaryRoundIndex,
      glossaryHasStarted: state.glossaryHasStarted,
      glossaryStreak: state.glossaryStreak,
      glossaryBestStreak: state.glossaryBestStreak,
      glossaryMisses: state.glossaryMisses,
      glossaryRoundRewards: state.glossaryRoundRewards,
      glossaryRoundVotes: state.glossaryRoundVotes,
      glossaryRoundStartedAt: state.glossaryRoundStartedAt,
      glossaryRunStartedAt: state.glossaryRunStartedAt,
      glossaryRecallAnswers: state.glossaryRecallAnswers,
      glossaryRecallResults: state.glossaryRecallResults,
      glossaryRecallIndex: state.glossaryRecallIndex,
      glossaryTermStats: state.glossaryTermStats
    },
    estPrepUpdatedAt: new Date().toISOString()
  };
}

function hasESTProgressSnapshotData(snapshot) {
  const progress = snapshot?.estPrepProgress || {};
  const hasCompletedStage = Object.values(progress.completed || {}).some(Boolean);
  const hasContentScore = Object.values(progress.contentTopicBestScores || {}).some(value => Number(value || 0) > 0);
  const hasDecoderResult = Object.keys(progress.decoderResults || {}).length > 0;
  const hasContentWork = Number(progress.contentGroupIndex) >= 0
    || Object.keys(progress.arcFlows || {}).length > 0
    || Object.keys(progress.answers || {}).some(key => key.startsWith("content-") || key.startsWith("training-"));
  const hasGlossaryWork = Boolean(progress.glossaryHasStarted)
    || Object.keys(progress.glossaryRecallAnswers || {}).length > 0
    || Object.keys(progress.glossaryRecallResults || {}).length > 0
    || Object.keys(progress.glossaryRoundRewards || {}).length > 0;
  const hasBossWork = Object.keys(progress.answers || {}).some(key => key.startsWith("boss"));

  return Number(progress.marksBanked || 0) > 0
    || Number(progress.readiness || 0) > 0
    || hasCompletedStage
    || hasContentScore
    || hasDecoderResult
    || hasContentWork
    || hasGlossaryWork
    || hasBossWork;
}

function writeESTProgressArchive(snapshot, session) {
  if (!hasESTProgressSnapshotData(snapshot)) return;

  const archiveKey = getESTProgressArchiveIdentity(state.student, session);
  if (!archiveKey) return;

  const archive = readJsonStorage(EST_PROGRESS_ARCHIVE_KEY, {});
  archive[archiveKey] = {
    ...snapshot,
    studentId: state.student?.id || session.studentId || null,
    username: state.student?.username || session.username || "",
    classId: state.student?.classId || session.classId || null,
    classCode: state.student?.classCode || session.classCode || "",
    playerProfile: {
      annualSalary: Number(session.annualSalary || 25000),
      cumulativeNetWorth: Number(session.cumulativeNetWorth || 0),
      savings: Number(session.savings || 0),
      taxPaid: Number(session.taxPaid || 0),
      jobSecurity: Number(session.jobSecurity || 75),
      workLifeBalance: Number(session.workLifeBalance || 60),
      checkpoint: session.checkpoint || "",
      economyLog: Array.isArray(session.economyLog) ? session.economyLog : []
    },
    updatedAt: snapshot.estPrepUpdatedAt
  };
  localStorage.setItem(EST_PROGRESS_ARCHIVE_KEY, JSON.stringify(archive));
}

function readESTProgressArchiveRecord() {
  const archiveKey = getESTProgressArchiveIdentity();
  if (!archiveKey) return null;
  const archive = readJsonStorage(EST_PROGRESS_ARCHIVE_KEY, {});
  return archive[archiveKey] || null;
}

function persistESTProgressSnapshot() {
  const snapshot = buildESTProgressSnapshot();
  const session = writePlayerSession(snapshot);
  writeESTProgressArchive(snapshot, session);
}

function hydrateESTProgressSnapshot() {
  const session = getPlayerSession();
  const archived = readESTProgressArchiveRecord();
  const source = session.estPrepProgress || session.estPrepDeck ? session : (archived || {});
  const progress = source.estPrepProgress || {};
  if (source.estPrepDeck) {
    state.stageDeck = source.estPrepDeck;
  }
  state.selectedStageId = progress.selectedStageId || null;
  state.marksBanked = Number(progress.marksBanked || state.marksBanked || 0);
  state.readiness = Number(progress.readiness || state.readiness || 0);
  state.confidence = Number(progress.confidence || state.confidence || 40);
  state.salaryBoost = Number(progress.salaryBoost || state.salaryBoost || 0);
  state.creditedSalaryBoost = Number(progress.creditedSalaryBoost || state.creditedSalaryBoost || 0);
  state.taxContribution = Number(progress.taxContribution || state.taxContribution || 0);
  state.creditedTaxContribution = Number(progress.creditedTaxContribution || state.creditedTaxContribution || 0);
  state.answers = progress.answers || {};
  state.decoderRoundIndex = Number.isInteger(progress.decoderRoundIndex) ? progress.decoderRoundIndex : 0;
  state.decoderResults = progress.decoderResults || {};
  state.contentGroupIndex = Number.isInteger(progress.contentGroupIndex) ? progress.contentGroupIndex : -1;
  state.contentView = progress.contentView || "menu";
  state.arcFlows = progress.arcFlows || {};
  state.contentTopicBestScores = progress.contentTopicBestScores || {};
  state.contentTopicVotes = progress.contentTopicVotes || {};
  state.contentTopicVoteSaves = progress.contentTopicVoteSaves || {};
  state.contentTopicResetAt = progress.contentTopicResetAt || {};
  state.lastContentTopicReview = progress.lastContentTopicReview || null;
  state.completed = progress.completed || {};
  state.stageBestScores = progress.stageBestScores || {};
  state.glossaryAssignments = progress.glossaryAssignments || {};
  state.glossaryBatchIndex = progress.glossaryBatchIndex || 0;
  state.glossaryRoundIndex = progress.glossaryRoundIndex || 0;
  state.glossaryHasStarted = Boolean(progress.glossaryHasStarted || state.glossaryHasStarted);
  state.glossaryStreak = Number(progress.glossaryStreak || state.glossaryStreak || 0);
  state.glossaryBestStreak = Number(progress.glossaryBestStreak || state.glossaryBestStreak || 0);
  state.glossaryMisses = Number(progress.glossaryMisses || state.glossaryMisses || 0);
  state.glossaryRoundRewards = progress.glossaryRoundRewards || state.glossaryRoundRewards || {};
  state.glossaryRoundVotes = progress.glossaryRoundVotes || state.glossaryRoundVotes || {};
  state.glossaryRoundStartedAt = 0;
  state.glossaryRoundActiveSeconds = 0;
  state.glossaryRoundLastAt = 0;
  state.glossaryRunStartedAt = Number(progress.glossaryRunStartedAt || state.glossaryRunStartedAt || 0);
  state.glossaryRecallAnswers = progress.glossaryRecallAnswers || {};
  state.glossaryRecallResults = progress.glossaryRecallResults || {};
  state.glossaryRecallIndex = Number(progress.glossaryRecallIndex || state.glossaryRecallIndex || 0);
  state.glossaryTermStats = progress.glossaryTermStats || state.glossaryTermStats || {};
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent({
    moduleId: MODULE_ID,
    ...entry
  });
}

function shouldWarnBeforeLeaving() {
  return Boolean(state.selectedStageId || Object.keys(state.completed).length || state.evidenceLog.length);
}

function registerLeaveWarning() {
  window.addEventListener("beforeunload", event => {
    if (!shouldWarnBeforeLeaving()) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function clampText(text, maxLength = 120) {
  const value = String(text || "").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function getLoggedInStudent() {
  const auth = getAuthState();
  const session = getPlayerSession();
  const login = auth.studentLogin || {};
  if (!login.id && !login.username && !session.studentId && !session.playerName) return null;
  return {
    id: login.id || session.studentId || null,
    username: login.username || session.username || "",
    displayName: login.displayName || session.playerName || login.username || "Student",
    classId: login.classId || session.classId || null,
    classCode: login.classCode || session.classCode || "",
    className: login.className || session.className || "",
    schoolName: login.schoolName || session.schoolName || ""
  };
}

async function loadBank() {
  const response = await fetch(BANK_PATH);
  if (!response.ok) throw new Error("Could not load the EST Prep content bank.");
  return response.json();
}

async function loadContentStageConfig() {
  try {
    const response = await fetch(CONTENT_STAGE_CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load EST content stage config.");
    return response.json();
  } catch (error) {
    console.warn("Using fallback EST content stage config.", error);
    return {
      topicGroups: DEFAULT_CONTENT_TOPIC_GROUPS,
      trainingBays: DEFAULT_CONTENT_TRAINING_BAYS
    };
  }
}

function isDocumentVisibleForActiveTiming() {
  return typeof document === "undefined" || !document.hidden;
}

function hasRecentTaskActivity(now = Date.now()) {
  return !state.activeTimerLastUserAt || now - Number(state.activeTimerLastUserAt || 0) <= ACTIVE_TASK_IDLE_GRACE_MS;
}

function resetActiveTaskTimer(totalKey, lastKey) {
  const now = Date.now();
  state[totalKey] = 0;
  state[lastKey] = now;
  state.activeTimerLastUserAt = now;
}

function bankActiveTaskTimer(totalKey, lastKey) {
  const now = Date.now();
  const last = Number(state[lastKey] || 0);
  if (!last) {
    state[lastKey] = now;
    return 0;
  }
  if (!isDocumentVisibleForActiveTiming() || !hasRecentTaskActivity(now)) {
    state[lastKey] = now;
    return 0;
  }
  const elapsedMs = Math.max(0, Math.min(now - last, ACTIVE_TASK_MAX_GAP_MS));
  const elapsedSeconds = elapsedMs / 1000;
  state[totalKey] = Number(state[totalKey] || 0) + elapsedSeconds;
  state[lastKey] = now;
  return elapsedSeconds;
}

function getActiveTaskTimerSeconds(totalKey, lastKey) {
  bankActiveTaskTimer(totalKey, lastKey);
  return Math.round(Number(state[totalKey] || 0));
}

function getCappedActiveElapsedSeconds(startedAt) {
  const now = Date.now();
  const last = Number(startedAt || 0);
  if (!last) return 0;
  if (!isDocumentVisibleForActiveTiming() || !hasRecentTaskActivity(now)) return 0;
  return Math.max(0, Math.round(Math.min(now - last, ACTIVE_TASK_MAX_GAP_MS) / 1000));
}

function resetStageTaskTimer() {
  state.stageStartedAt = Date.now();
  resetActiveTaskTimer("stageActiveSeconds", "stageActiveLastAt");
}

function bankStageTaskTimer() {
  return bankActiveTaskTimer("stageActiveSeconds", "stageActiveLastAt");
}

function resetGlossaryRoundActiveTimer() {
  state.glossaryRoundStartedAt = Date.now();
  resetActiveTaskTimer("glossaryRoundActiveSeconds", "glossaryRoundLastAt");
}

function bankGlossaryRoundActiveTimer() {
  return bankActiveTaskTimer("glossaryRoundActiveSeconds", "glossaryRoundLastAt");
}

function getGlossaryRoundActiveSeconds() {
  return getActiveTaskTimerSeconds("glossaryRoundActiveSeconds", "glossaryRoundLastAt");
}

function bankESTActiveTimers() {
  if (state.selectedStageId) bankStageTaskTimer();
  if (state.glossaryRoundStartedAt) bankGlossaryRoundActiveTimer();
  if (typeof bankCurrentContentDuration === "function") bankCurrentContentDuration();
}

function noteESTUserActivity() {
  bankESTActiveTimers();
  state.activeTimerLastUserAt = Date.now();
}

function installESTActiveTimerGuards() {
  if (window.__careerEmpireESTActiveTimerGuardsInstalled) return;
  window.__careerEmpireESTActiveTimerGuardsInstalled = true;
  ["pointerdown", "keydown", "input", "change"].forEach(eventName => {
    window.addEventListener(eventName, noteESTUserActivity, { capture: true, passive: true });
  });
  window.addEventListener("visibilitychange", () => {
    bankESTActiveTimers();
    state.activeTimerLastUserAt = document.hidden ? 0 : Date.now();
    state.stageActiveLastAt = state.selectedStageId ? Date.now() : 0;
    state.glossaryRoundLastAt = state.glossaryRoundStartedAt ? Date.now() : 0;
    if (!document.hidden && state.contentGroupStartedAt) state.contentGroupStartedAt = Date.now();
  });
  window.addEventListener("pagehide", bankESTActiveTimers);
  window.addEventListener("blur", bankESTActiveTimers);
  window.addEventListener("focus", () => {
    state.activeTimerLastUserAt = Date.now();
    if (state.selectedStageId) state.stageActiveLastAt = Date.now();
    if (state.glossaryRoundStartedAt) state.glossaryRoundLastAt = Date.now();
    if (state.contentGroupStartedAt) state.contentGroupStartedAt = Date.now();
  });
}

function getCurrentStageDurationSeconds() {
  const seconds = getActiveTaskTimerSeconds("stageActiveSeconds", "stageActiveLastAt");
  return seconds ? Math.max(1, seconds) : null;
}

function addEvidence(title, detail) {
  state.evidenceLog.push({ title, detail });
  renderEvidence();
}
