const STUDENT_REWARD_ICONS = {
  chamber: "../Assets/Images and Animations/Celebration Reward Icons/Chamber complete.png",
  salary: "../Assets/Images and Animations/Celebration Reward Icons/Salary Banked.png",
  signal: "../Assets/Images and Animations/Celebration Reward Icons/Signal restored.png",
  tax: "../Assets/Images and Animations/Celebration Reward Icons/Tax contributed.png",
  topic: "../Assets/Images and Animations/Celebration Reward Icons/Topic Complete.png"
};

const STUDENT_STATUS_ICONS = {
  assets: "../Assets/Images and Animations/Student Hub/empire-status-assets-owned.png",
  communityTax: "../Assets/Images and Animations/Student Hub/empire-status-community-tax.png",
  jobSecurity: "../Assets/Images and Animations/Student Hub/empire-status-job-security.png",
  netWorth: "../Assets/Images and Animations/Student Hub/empire-status-net-worth.png",
  salary: "../Assets/Images and Animations/Student Hub/empire-status-salary.png",
  workLife: "../Assets/Images and Animations/Student Hub/empire-status-work-life-balance.png"
};

const TEACHER_STATS_FILTER_KEY = "career-empire-teacher-stats-dashboard-filter";
const LEGACY_TEACHER_FILTER_KEY = "career-empire-teacher-dashboard-filter";
const MODULE_AVAILABILITY_STORAGE_KEY = "career-empire-module-availability-v1";
const AVATAR_PROFILE_STORAGE_KEY = "career-empire-avatar-v1";
const AVATAR_BADGE_SKIN_COLOURS = {
  porcelain: { color: "#f4d6c5", shadow: "#d79f82" },
  sand: { color: "#dba77c", shadow: "#b57952" },
  warm: { color: "#b8734f", shadow: "#8d4e36" },
  copper: { color: "#935a3c", shadow: "#6f3d29" },
  mahogany: { color: "#66402f", shadow: "#43271c" },
  deep: { color: "#38251f", shadow: "#211514" }
};
const AVATAR_BADGE_HAIR_COLOURS = {
  black: "#161412",
  brown: "#5a3524",
  auburn: "#9b3f24",
  blonde: "#d9b85d",
  silver: "#c8ced4",
  teal: "#0f8f8c"
};
const AVATAR_BADGE_CHARACTER_BASES = {
  mackillop: {
    label: "MacKillop welcome",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Welcome.png"
  },
  "mackillop-thinking": {
    label: "MacKillop thinking",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Thinking.png"
  },
  "mackillop-pointing": {
    label: "MacKillop pointing",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/MacKillop/MacKillop Pointing.png"
  },
  romero: {
    label: "Romero welcome",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Welcoming.png"
  },
  "romero-thinking": {
    label: "Romero thinking",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Thinking.png"
  },
  "romero-celebrating": {
    label: "Romero celebrating",
    imagePath: "../Assets/Images and Animations/Emmanuel Student Characters/Romero/Romero Celebrating.png"
  }
};
const TEACHER_REVIEW_FILTER_OPTIONS = [
  { id: "new", label: "New" },
  { id: "actioned", label: "Actioned" },
  { id: "all", label: "All" }
];
const teacherReviewFilterState = {
  responseReviews: "new",
  feedbackReviews: "new",
  storeRequests: "new"
};
const SHAREABLE_REVIEW_EVIDENCE_TYPES = new Set([
  "employability-star",
  "est-response",
  "revision-topic-check",
  "justification"
]);
const TEACHER_CHECK_ONLY_EVIDENCE_TYPES = new Set([
  "decoder-breakdown"
]);
const STUDENT_FREE_TEXT_PRIVACY_NOTICE = {
  title: "Note: your teacher can check anything you enter here.",
  body: 'Do not include surnames, student emails, phone numbers, social handles, exact workplace names, suburbs, addresses, or anything that identifies you or someone else. Use general wording such as "a fast-food workplace" or "a local retail store".'
};
const QUIET_REJECTION_NOTE_PREFIX = "[quiet-reject]";
const RESPONSE_REJECTION_REASONS = [
  "Contains personal or identifying information",
  "Contains profanity or inappropriate language",
  "Contains workplace or location details",
  "Not suitable for the shared response pool",
  "Other teacher concern"
];

const DASHBOARD_MODULES = [
  {
    id: "avatar-studio",
    title: "Avatar Studio",
    shortTitle: "Avatar",
    defaultStatus: "active",
    currentLabel: "Future-self identity",
    inactiveLabel: "Avatar creator unavailable",
    archivedLabel: "Avatar history",
    launchPath: "../modules/avatar/index.html"
  },
  {
    id: "est-prep",
    title: "EST Prep",
    shortTitle: "EST",
    defaultStatus: "active",
    currentLabel: "Current teaching focus",
    inactiveLabel: "Unavailable from student hub",
    archivedLabel: "Historical EST data",
    launchPath: "../modules/est-prep/index.html"
  },
  {
    id: "initiative",
    title: "Initiative",
    shortTitle: "Initiative",
    defaultStatus: "active",
    currentLabel: "Applied learning focus",
    inactiveLabel: "Unavailable from student hub",
    archivedLabel: "Initiative history",
    launchPath: "../modules/initiative/index.html"
  },
  {
    id: "employability-skills",
    title: "Employability Skills Portfolio",
    shortTitle: "Employability",
    defaultStatus: "active",
    currentLabel: "STAR portfolio",
    inactiveLabel: "Portfolio logging unavailable",
    archivedLabel: "Portfolio archive",
    launchPath: ""
  },
  {
    id: "megatrends",
    title: "Megatrends",
    shortTitle: "Megatrends",
    defaultStatus: "archived",
    currentLabel: "Term 1 / historical",
    inactiveLabel: "Unavailable from student hub",
    archivedLabel: "Term 1 archive",
    launchPath: "../index.html?screen=megatrends"
  },
  {
    id: "lifelong-learning",
    title: "Lifelong Learning",
    shortTitle: "Lifelong",
    defaultStatus: "archived",
    currentLabel: "Trial prototype",
    inactiveLabel: "Unavailable from student hub",
    archivedLabel: "Prototype archive",
    launchPath: "../modules/lifelong-learning/index.html"
  }
];

const MODULE_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived"
};

const MODULE_STATUS_COPY = {
  active: "Included in active analytics and available to students.",
  inactive: "Hidden from active analytics and greyed out for students.",
  archived: "Preserved for cumulative/history views only."
};

const STUDENT_RECORD_STATUS_OPTIONS = [
  { id: "active", label: "Active students", note: "Current class data only" },
  { id: "inactive", label: "Inactive/deleted", note: "Hidden from default view" },
  { id: "deleted", label: "Deleted logins", note: "Credentials removed" },
  { id: "all", label: "All records", note: "Active plus historical" }
];

const STUDENT_RECORD_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  deleted: "Deleted login"
};

const CAPABILITY_LANGUAGE_MARKERS = [
  { key: "explains", label: "Explains why", pattern: /\b(because|this means|therefore|as a result|so that|which means)\b/i },
  { key: "evidence", label: "Uses evidence/example", pattern: /\b(for example|evidence|data|shows|according to|in my|during|when I)\b/i },
  { key: "reflects", label: "Reflects on improvement", pattern: /\b(improved|learned|next time|feedback|changed|better|stronger|revised)\b/i },
  { key: "specific", label: "Specific action", pattern: /\b(I used|I chose|I asked|I planned|I checked|I compared|I decided|I prioritised|I organized|I organised)\b/i }
];

async function loadEmployabilitySkills() {
  const response = await fetch("../data/employability-skills.json");
  if (!response.ok) throw new Error("Could not load employability skills.");
  return response.json();
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") {
    return null;
  }
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function normaliseWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normaliseComparableReviewText(value) {
  return normaliseWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isShareableReviewEvidence(rowOrType) {
  const evidenceType = typeof rowOrType === "string" ? rowOrType : rowOrType?.evidence_type;
  return SHAREABLE_REVIEW_EVIDENCE_TYPES.has(String(evidenceType || ""));
}

function isTeacherCheckOnlyReview(rowOrType) {
  const evidenceType = typeof rowOrType === "string" ? rowOrType : rowOrType?.evidence_type;
  return TEACHER_CHECK_ONLY_EVIDENCE_TYPES.has(String(evidenceType || ""));
}

function isNonStudentReviewText(value) {
  const text = normaliseWhitespace(value);
  if (!text) return true;
  const lower = text.toLowerCase();
  const blockedExact = new Set([
    "no response entered",
    "no response entered.",
    "no written response entered",
    "no written response entered.",
    "not chosen",
    "not chosen."
  ]);
  if (blockedExact.has(lower)) return true;
  if (/^(?:question\s+\d+\s*\/\s*\d+|final vtcs score|core check accuracy|term memory game)\b/i.test(text)) return true;
  if (/\bverb:\s*.+\btopic:\s*.+\bcontext:\s*.+\bstructure:/i.test(text)) return true;
  if (/\bselected:\s*.+\bcorrect answer:/i.test(text)) return true;
  return false;
}

function matchesReviewExcludedText(responseText, excludedTexts = []) {
  const response = normaliseComparableReviewText(responseText);
  if (!response) return false;
  return excludedTexts
    .flatMap(item => Array.isArray(item) ? item : [item])
    .map(normaliseComparableReviewText)
    .filter(Boolean)
    .some(item => item === response);
}

function isTeacherReviewableStudentResponse(row) {
  if (!isShareableReviewEvidence(row)) return false;
  const responseText = row?.raw_response_text || row?.approved_response_text || "";
  if (isNonStudentReviewText(responseText)) return false;
  const wordCount = normaliseWhitespace(responseText).split(/\s+/).filter(Boolean).length;
  return row?.evidence_type === "employability-star" ? wordCount >= 3 : wordCount >= 8;
}

function isTeacherLongAnswerCandidate(entry, responseText) {
  if (isTeacherCheckOnlyReview(entry?.row?.evidence_type)) return false;
  if (isNonStudentReviewText(responseText)) return false;
  if (matchesReviewExcludedText(responseText, [
    entry?.payload?.sample_response,
    entry?.payload?.sample_responses,
    entry?.payload?.model_response,
    entry?.payload?.strong_answer
  ])) return false;
  return true;
}

function getTeacherReviewDedupeKey(row) {
  return [
    row?.student_id || "",
    row?.class_id || "",
    row?.module_id || "",
    row?.evidence_type || "",
    row?.task_key || "",
    normaliseComparableReviewText(row?.raw_response_text || row?.approved_response_text || "")
  ].join("::");
}

function getTeacherReviewDedupeWeight(row) {
  const status = normaliseReviewStatus(row?.status);
  if (status === "approved") return 3;
  if (status === "rejected") return 2;
  return 1;
}

function choosePreferredTeacherReviewRow(current, candidate) {
  if (!current) return candidate;
  const currentWeight = getTeacherReviewDedupeWeight(current);
  const candidateWeight = getTeacherReviewDedupeWeight(candidate);
  if (candidateWeight !== currentWeight) {
    return candidateWeight > currentWeight ? candidate : current;
  }
  const currentTime = parseTime(current.reviewed_at || current.updated_at || current.created_at);
  const candidateTime = parseTime(candidate.reviewed_at || candidate.updated_at || candidate.created_at);
  return candidateTime > currentTime ? candidate : current;
}

function dedupeTeacherReviewRows(rows = []) {
  const deduped = new Map();
  rows.forEach(row => {
    const key = getTeacherReviewDedupeKey(row);
    if (!key.endsWith("::")) {
      deduped.set(key, choosePreferredTeacherReviewRow(deduped.get(key), row));
    }
  });
  return [...deduped.values()];
}

function getPlayers() {
  return readJsonStorage("career-empire-players", []);
}

function mapRemotePlayerProfile(row) {
  const student = row.students || {};
  const classRecord = student.classes || {};
  const schoolRecord = student.schools || {};
  return {
    id: row.student_id,
    player_name: student.display_name || student.username || "Unknown",
    school_id: student.school_id || "",
    school_name: schoolRecord.name || "",
    class_id: student.class_id || "",
    class_code: classRecord.class_code || "",
    career_title: row.career_title || "Intern",
    annual_salary: row.annual_salary || 0,
    cumulative_net_worth: row.cumulative_net_worth || 0,
    savings: row.savings || 0,
    tax_paid: row.tax_paid || 0,
    career_level: row.career_level || 1,
    job_security: row.job_security || 0,
    work_life_balance: row.work_life_balance || 0,
    community_vote: row.last_community_vote || "none",
    years_played: row.years_played || 0,
    tech_mastery: row.tech_mastery || 0,
    climate_mastery: row.climate_mastery || 0,
    demo_mastery: row.demo_mastery || 0,
    economic_mastery: row.economic_mastery || 0,
    timestamp: row.updated_at || new Date().toISOString()
  };
}

async function getPlayers() {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return readJsonStorage("career-empire-players", []);

  const { data, error } = await supabase
    .from("player_profiles")
    .select(`
      student_id,
      career_title,
      annual_salary,
      cumulative_net_worth,
      savings,
      tax_paid,
      career_level,
      job_security,
      work_life_balance,
      years_played,
      tech_mastery,
      climate_mastery,
      demo_mastery,
      economic_mastery,
      last_community_vote,
      updated_at,
      students!inner(
        school_id,
        class_id,
        display_name,
        username,
        classes(class_code, name),
        schools(name)
      )
    `);

  if (error) {
    console.error(error);
    return readJsonStorage("career-empire-players", []);
  }

  return (data || []).map(mapRemotePlayerProfile);
}

async function getCurrentStudentAssetCount() {
  const authState = getAuthPrototypeState();
  const studentId = authState?.studentLogin?.id;
  if (!studentId) {
    const session = getCurrentPlayerSession();
    return Array.isArray(session?.ownedAssets) ? session.ownedAssets.length : null;
  }

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return null;

  const { count, error } = await supabase
    .from("player_assets")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId);

  if (error) {
    console.error(error);
    return null;
  }
  return typeof count === "number" ? count : null;
}

async function getCurrentStudentModuleProgress() {
  const authState = getAuthPrototypeState();
  const studentId = authState?.studentLogin?.id;
  const localInitiativeProgress = getLocalInitiativeProgressRow();
  if (!studentId) return localInitiativeProgress ? { initiative: localInitiativeProgress } : {};

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return localInitiativeProgress ? { initiative: localInitiativeProgress } : {};

  const { data, error } = await supabase
    .from("student_module_progress")
    .select("module_id, completion_percent, mastery_percent, attempts, completed")
    .eq("student_id", studentId);

  if (error) {
    console.error(error);
    return {};
  }

  const rows = (data || []).reduce((acc, row) => {
    acc[row.module_id] = row;
    return acc;
  }, {});
  if (localInitiativeProgress && !rows.initiative) rows.initiative = localInitiativeProgress;
  return rows;
}

function getLocalInitiativeProgressRow() {
  const progress = readJsonStorage("career-empire-initiative-progress-v1", null);
  if (!progress || typeof progress !== "object") return null;
  if (!Number(progress.completionPercent || progress.masteryPercent || progress.activeSeconds)) return null;
  return {
    module_id: "initiative",
    completion_percent: Number(progress.completionPercent || 0),
    mastery_percent: Number(progress.masteryPercent || 0),
    attempts: Number(progress.coreAttempts || 0),
    completed: Number(progress.completionPercent || 0) >= 100,
    local_only: true
  };
}

function getCurrentPlayerSession() {
  return readJsonStorage("career-empire-session", null);
}

function getTeacherSession() {
  return readJsonStorage("career-empire-teacher-session", null);
}

function hasActiveTeacherLogin(authState = getAuthPrototypeState()) {
  return Boolean(
    authState?.teacherLogin?.email
    || authState?.teacher?.email
    || authState?.teacher?.id
  );
}

function revealTeacherDiagnosticBetaLink(authState = getAuthPrototypeState()) {
  const linkPanel = document.getElementById("teacher-diagnostic-beta-link");
  if (!linkPanel) return;
  linkPanel.hidden = !hasActiveTeacherLogin(authState);
}

let hasTeacherDashboardFilterInteraction = false;

function getTeacherDashboardFilter() {
  const defaultFilter = { scope: "all", classId: "all", studentId: "all", moduleFocus: "active", studentRecordFocus: "active" };
  const filter = readJsonStorage(TEACHER_STATS_FILTER_KEY, null)
    || readJsonStorage(LEGACY_TEACHER_FILTER_KEY, defaultFilter);
  if (!hasTeacherDashboardFilterInteraction && document.getElementById("teacher-class-selector")) {
    return { ...defaultFilter, ...filter, scope: "all", classId: "all", studentId: "all" };
  }
  return { ...defaultFilter, ...filter };
}

function requireStudentHubAccess() {
  if (!document.getElementById("student-hero-title")) return true;
  const authState = getAuthPrototypeState();
  if (authState?.studentLogin?.id || authState?.studentLogin?.preview) return true;
  sessionStorage.setItem("student-login-error", "Please log in before opening the Student Hub.");
  window.location.href = "../auth/student-login.html";
  return false;
}

function setTeacherDashboardFilter(nextFilter) {
  hasTeacherDashboardFilterInteraction = true;
  localStorage.setItem(TEACHER_STATS_FILTER_KEY, JSON.stringify({ ...getTeacherDashboardFilter(), ...nextFilter }));
  localStorage.removeItem(LEGACY_TEACHER_FILTER_KEY);
}

function getDefaultModuleStatusMap() {
  return DASHBOARD_MODULES.reduce((acc, module) => {
    acc[module.id] = module.defaultStatus;
    return acc;
  }, {});
}

function getModuleAvailabilitySettings() {
  const fallback = {
    classDefaults: {
      global: getDefaultModuleStatusMap()
    },
    studentOverrides: {}
  };
  const settings = readJsonStorage(MODULE_AVAILABILITY_STORAGE_KEY, fallback);
  return {
    classDefaults: {
      global: getDefaultModuleStatusMap(),
      ...(settings?.classDefaults || {})
    },
    studentOverrides: settings?.studentOverrides || {}
  };
}

function saveModuleAvailabilitySettings(settings) {
  localStorage.setItem(MODULE_AVAILABILITY_STORAGE_KEY, JSON.stringify(settings));
}

function getModuleById(moduleId) {
  return DASHBOARD_MODULES.find(module => module.id === moduleId) || null;
}

function normaliseModuleStatus(value, fallback = "inactive") {
  return ["active", "inactive", "archived"].includes(value) ? value : fallback;
}

function getClassModuleStatuses(classId = "global") {
  const settings = getModuleAvailabilitySettings();
  const globalDefaults = settings.classDefaults.global || getDefaultModuleStatusMap();
  const classDefaults = settings.classDefaults[classId] || {};
  return DASHBOARD_MODULES.reduce((acc, module) => {
    acc[module.id] = normaliseModuleStatus(classDefaults[module.id], normaliseModuleStatus(globalDefaults[module.id], module.defaultStatus));
    return acc;
  }, {});
}

function setClassModuleStatus(classId, moduleId, status) {
  const settings = getModuleAvailabilitySettings();
  const scopeId = classId || "global";
  settings.classDefaults[scopeId] = {
    ...getClassModuleStatuses(scopeId),
    [moduleId]: normaliseModuleStatus(status)
  };
  saveModuleAvailabilitySettings(settings);
}

function getStudentModuleOverrides(studentId = "") {
  const settings = getModuleAvailabilitySettings();
  return studentId ? (settings.studentOverrides[studentId] || {}) : {};
}

function setStudentModuleOverride(studentId, moduleId, status) {
  if (!studentId) return;
  const settings = getModuleAvailabilitySettings();
  const current = settings.studentOverrides[studentId] || {};
  const next = { ...current };
  if (!status || status === "inherit") delete next[moduleId];
  else next[moduleId] = normaliseModuleStatus(status);
  if (Object.keys(next).length) settings.studentOverrides[studentId] = next;
  else delete settings.studentOverrides[studentId];
  saveModuleAvailabilitySettings(settings);
}

function getEffectiveModuleStatuses({ classId = "global", studentId = "" } = {}) {
  const classStatuses = getClassModuleStatuses(classId || "global");
  const studentOverrides = getStudentModuleOverrides(studentId);
  return DASHBOARD_MODULES.reduce((acc, module) => {
    acc[module.id] = normaliseModuleStatus(studentOverrides[module.id], classStatuses[module.id] || module.defaultStatus);
    return acc;
  }, {});
}

function getTeacherVisibleModuleIds(moduleStatuses, moduleFocus = "active") {
  if (moduleFocus === "cumulative") return DASHBOARD_MODULES.map(module => module.id);
  if (moduleFocus === "archived") {
    return DASHBOARD_MODULES.filter(module => moduleStatuses[module.id] === "archived").map(module => module.id);
  }
  if (DASHBOARD_MODULES.some(module => module.id === moduleFocus)) return [moduleFocus];
  return DASHBOARD_MODULES.filter(module => moduleStatuses[module.id] === "active").map(module => module.id);
}

function getModuleStatusLabel(status) {
  return MODULE_STATUS_LABELS[normaliseModuleStatus(status)] || "Inactive";
}

function getModuleStatusDescription(status) {
  return MODULE_STATUS_COPY[normaliseModuleStatus(status)] || MODULE_STATUS_COPY.inactive;
}

function getStudentRecordState(student = {}) {
  const inactive = student?.is_active === false;
  const deleted = inactive && /^Deleted/i.test(String(student?.username || ""));
  const status = deleted ? "deleted" : inactive ? "inactive" : "active";
  return {
    status,
    label: STUDENT_RECORD_STATUS_LABELS[status] || "Active"
  };
}

function studentMatchesRecordFocus(student, focus = "active") {
  const state = getStudentRecordState(student);
  if (focus === "all") return true;
  if (focus === "inactive") return state.status === "inactive" || state.status === "deleted";
  if (focus === "deleted") return state.status === "deleted";
  return state.status === "active";
}

function getStudentRecordCounts(students = []) {
  return students.reduce((acc, student) => {
    const status = getStudentRecordState(student).status;
    acc.total += 1;
    acc[status] = (acc[status] || 0) + 1;
    if (status !== "active") acc.hidden += 1;
    return acc;
  }, { total: 0, active: 0, inactive: 0, deleted: 0, hidden: 0 });
}

function getStudentRecordScopeBase(focus = "active") {
  return focus === "inactive"
    ? "inactive/deleted student"
    : focus === "deleted"
      ? "deleted-login student"
      : focus === "all"
        ? "student"
        : "active student";
}

function getStudentRecordScopeLabel(focus = "active", count = 2) {
  const base = getStudentRecordScopeBase(focus);
  return `${base}${count === 1 ? "" : "s"}`;
}

function getAuthPrototypeState() {
  return readJsonStorage("career-empire-auth-demo", {});
}

function getStudentIdentityStorageKey(authState = getAuthPrototypeState(), session = getCurrentPlayerSession() || {}) {
  const studentLogin = authState?.studentLogin || {};
  return String(
    studentLogin.id ||
    studentLogin.username ||
    session?.studentId ||
    session?.username ||
    session?.playerName ||
    "demo"
  );
}

function getCurrentStudentAvatarProfile(authState = getAuthPrototypeState(), session = getCurrentPlayerSession() || {}) {
  const stored = readJsonStorage(AVATAR_PROFILE_STORAGE_KEY, {});
  const ownerKey = getStudentIdentityStorageKey(authState, session);
  if (stored?.profiles && stored.profiles[ownerKey]) return stored.profiles[ownerKey];
  if (session?.avatar) return session.avatar;
  return stored?.latest || null;
}

function calculateAvatarProfileCompletion(profile) {
  if (!profile) return 0;
  if (Number.isFinite(Number(profile.completion))) return Math.max(0, Math.min(100, Number(profile.completion)));
  let score = 45;
  if (String(profile.occupation || "").trim()) score += 20;
  if (String(profile.training || "").trim()) score += 20;
  if (String(profile.strength || "").trim()) score += 15;
  return Math.min(100, score);
}

function buildMegatrendsLaunchPath() {
  const authState = getAuthPrototypeState();
  const session = getCurrentPlayerSession();
  const studentLogin = authState?.studentLogin || {};
  const params = new URLSearchParams({ screen: "megatrends" });

  const studentName = studentLogin.displayName || studentLogin.username || session?.playerName || "";
  const studentUsername = studentLogin.username || "";
  const schoolName = studentLogin.schoolName || session?.schoolName || "";
  const classCode = studentLogin.classCode || session?.classCode || "";

  if (studentName) params.set("student_name", studentName);
  if (studentUsername) params.set("student_username", studentUsername);
  if (schoolName) params.set("school_name", schoolName);
  if (classCode) params.set("class_code", classCode);

  return `../index.html?${params.toString()}`;
}

function syncMegatrendsLaunchLinks() {
  const launchPath = buildMegatrendsLaunchPath();
  document.querySelectorAll('a[href="../index.html?screen=megatrends"]').forEach(link => {
    link.href = launchPath;
  });
  const hubLink = document.getElementById("student-hub-megatrends-link");
  if (hubLink) hubLink.href = launchPath;
}

function getActiveTeacherContext() {
  const authState = getAuthPrototypeState();
  const teacherSession = getTeacherSession();
  return {
    teacher: authState.teacher || null,
    teacherLogin: authState.teacherLogin || null,
    classroom: authState.classroom || null,
    teacherSession
  };
}

async function resolveTeacherDashboardContext(supabase, context) {
  const contextTeacher = context?.teacher || {};
  const existingSchoolId = contextTeacher.schoolId
    || contextTeacher.school_id
    || context?.teacherLogin?.schoolId
    || context?.teacherLogin?.school_id
    || context?.teacherSession?.schoolId
    || context?.teacherSession?.school_id
    || null;
  const teacherSchoolName = contextTeacher.schoolName || "";
  const existingSchoolName = teacherSchoolName
    || context?.teacherLogin?.schoolName
    || context?.teacherLogin?.school_name
    || context?.teacherSession?.schoolName
    || context?.teacherSession?.school_name
    || "";
  if (contextTeacher.id && existingSchoolId && existingSchoolName) {
    return {
      ...context,
      teacher: {
        ...contextTeacher,
        schoolId: existingSchoolId,
        schoolName: existingSchoolName
      }
    };
  }

  let email = context?.teacherLogin?.email || context?.teacher?.email || "";
  if (!email && supabase?.auth?.getUser) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.email) {
        email = data.user.email;
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (!supabase) return context;

  let data = null;
  let error = null;
  if (email) {
    const result = await supabase
      .from("teachers")
      .select("id, full_name, email, school_id, schools(name)")
      .eq("email", email)
      .maybeSingle();
    data = result.data;
    error = result.error;
  } else if (contextTeacher.id) {
    const result = await supabase
      .from("teachers")
      .select("id, full_name, email, school_id, schools(name)")
      .eq("id", contextTeacher.id)
      .maybeSingle();
    data = result.data;
    error = result.error;
  }

  if (error || !data) {
    if (error) console.error(error);
    if (existingSchoolId && !teacherSchoolName) {
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("name")
        .eq("id", existingSchoolId)
        .maybeSingle();
      if (schoolError) console.error(schoolError);
      if (schoolData?.name) {
        return {
          ...context,
          teacher: {
            ...contextTeacher,
            schoolId: existingSchoolId,
            schoolName: schoolData.name
          }
        };
      }
    }
    return context;
  }

  const nextTeacher = {
    id: data.id,
    fullName: data.full_name || context?.teacher?.fullName || "",
    email: data.email,
    schoolId: data.school_id,
    schoolName: data.schools?.name || context?.teacher?.schoolName || ""
  };

  const authState = getAuthPrototypeState();
  localStorage.setItem("career-empire-auth-demo", JSON.stringify({
    ...authState,
    teacher: {
      ...(authState.teacher || {}),
      ...nextTeacher
    },
    teacherLogin: {
      ...(authState.teacherLogin || {}),
      email: data.email,
      schoolName: data.schools?.name || authState.teacherLogin?.schoolName || ""
    }
  }));

  return {
    ...context,
    teacher: nextTeacher
  };
}

function parseTime(value) {
  const timestamp = Date.parse(value || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function dedupeLatestPlayers(players) {
  const latest = new Map();
  players.forEach(player => {
    const key = player.id || `${player.player_name || "unknown"}::${player.class_code || ""}`;
    const current = latest.get(key);
    if (!current || parseTime(player.timestamp) > parseTime(current.timestamp)) {
      latest.set(key, player);
    }
  });
  return [...latest.values()];
}

function normalizeSchoolName(value) {
  return String(value || "").trim().toLowerCase();
}

function getCurrentSchoolScope() {
  const authState = getAuthPrototypeState();
  const session = getCurrentPlayerSession() || {};
  const teacherSession = getTeacherSession() || {};
  const studentLogin = authState?.studentLogin || {};
  const teacher = authState?.teacher || {};
  const teacherLogin = authState?.teacherLogin || {};

  return {
    schoolId: String(
      studentLogin.schoolId ||
      studentLogin.school_id ||
      teacher.schoolId ||
      teacher.school_id ||
      teacherLogin.schoolId ||
      teacherLogin.school_id ||
      session.schoolId ||
      session.school_id ||
      teacherSession.schoolId ||
      teacherSession.school_id ||
      ""
    ),
    schoolName:
      studentLogin.schoolName ||
      studentLogin.school_name ||
      teacher.schoolName ||
      teacher.school_name ||
      teacherLogin.schoolName ||
      teacherLogin.school_name ||
      session.schoolName ||
      session.school_name ||
      teacherSession.schoolName ||
      teacherSession.school_name ||
      ""
  };
}

function playerMatchesCurrentSchool(player, scope) {
  if (!scope.schoolId && !scope.schoolName) return false;
  if (scope.schoolId && player.school_id && String(player.school_id) === scope.schoolId) return true;
  return Boolean(scope.schoolName && normalizeSchoolName(player.school_name) === normalizeSchoolName(scope.schoolName));
}

function filterPlayersToCurrentSchool(players) {
  const scope = getCurrentSchoolScope();
  return {
    scope,
    hasScope: Boolean(scope.schoolId || scope.schoolName),
    players: players.filter(player => playerMatchesCurrentSchool(player, scope))
  };
}

function getPlayerHistory(players, session) {
  if (!session || (!session.studentId && !session.playerName)) return [];
  if (session.studentId) {
    return players
      .filter(player => player.id === session.studentId)
      .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp));
  }
  return players
    .filter(player => player.player_name === session.playerName && (!session.classCode || player.class_code === session.classCode))
    .sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp));
}

function getCurrentPlayerRecord(players, session) {
  const history = getPlayerHistory(players, session);
  if (history.length) return history[0];
  if (session?.studentId || session?.playerName || session?.username) return null;
  return [...players].sort((a, b) => parseTime(b.timestamp) - parseTime(a.timestamp))[0] || null;
}

function hasMeaningfulPlayerProgress(record) {
  if (!record) return false;
  return [
    record.years_played,
    record.tech_mastery,
    record.climate_mastery,
    record.demo_mastery,
    record.economic_mastery,
    record.cumulative_net_worth,
    record.tax_paid
  ].some(value => Number(value || 0) > 0)
    || Number(record.annual_salary || 0) > 25000
    || Boolean(record.community_vote && record.community_vote !== "none");
}

function hasMeaningfulModuleProgress(progress) {
  if (!progress) return false;
  return Number(progress.completion_percent || 0) > 0
    || Number(progress.mastery_percent || 0) > 0
    || Number(progress.attempts || 0) > 0
    || Boolean(progress.completed);
}

function hasLocalESTProgress(session) {
  const progress = session?.estPrepProgress;
  if (!progress) return false;

  const hasCompletedStage = Object.values(progress.completed || {}).some(Boolean);
  const hasContentScore = Object.values(progress.contentTopicBestScores || {}).some(value => Number(value || 0) > 0);
  const hasDecoderResult = Object.keys(progress.decoderResults || {}).length > 0;
  const hasContentWork = Number(progress.contentGroupIndex) >= 0
    || Object.keys(progress.arcFlows || {}).length > 0
    || Object.keys(progress.answers || {}).some(key => key.startsWith("content-") || key.startsWith("training-"));
  const hasGlossaryWork = Boolean(progress.glossaryHasStarted)
    || Number(progress.glossaryRoundIndex || 0) > 0
    || Number(progress.glossaryBatchIndex || 0) > 0
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

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

const EMPLOYABILITY_SKILL_META = {
  "communication": {
    accent: "#68d2ff",
    accentSoft: "rgba(104, 210, 255, 0.16)",
    accentStrong: "rgba(104, 210, 255, 0.34)",
    logoFile: "1.0 Communication.png",
    subskillLogoFiles: ["1.1 Communication.png", "1.2 Communication.png", "1.3 Communication.png", "1.4 Communication.png"],
    starExample: {
      title: "Year 12 STAR application",
      rows: [
        {
          label: "S",
          term: "Situation",
          text: "During workplace learning at my retail job, I use communication skills with customers from many different backgrounds."
        },
        {
          label: "T",
          term: "Task",
          text: "I need to serve customers clearly, understand what they need, and work respectfully with other staff."
        },
        {
          label: "A",
          term: "Actions",
          text: "I use good eye contact, a friendly smile, and active listening. I repeat key details back to customers and adjust how I speak for different people, such as an elderly person or a young child."
        },
        {
          label: "R",
          term: "Results",
          text: "In June, my supervisor gave me a commendation for being friendly, polite, and courteous to customers."
        }
      ]
    }
  },
  "digital-literacy": {
    accent: "#7c9cff",
    accentSoft: "rgba(124, 156, 255, 0.16)",
    accentStrong: "rgba(124, 156, 255, 0.34)",
    logoFile: "2.0 Digital Literacy.png",
    subskillLogoFiles: ["2.1 Digital Literacy.png", "2.3 Digital Literacy.png", "2.4 Digital LIteracy.png", "2.5 Digital Literacy.png"]
  },
  "teamwork": {
    accent: "#80ed99",
    accentSoft: "rgba(128, 237, 153, 0.16)",
    accentStrong: "rgba(128, 237, 153, 0.34)",
    logoFile: "3.0 Teamwork.png",
    subskillLogoFiles: ["3.1 Teamwork.png", "3.2 Teamwork.png", "3.3 Teamwork.png", "3.4 Teamwork.png"]
  },
  "time-management": {
    accent: "#ffd166",
    accentSoft: "rgba(255, 209, 102, 0.16)",
    accentStrong: "rgba(255, 209, 102, 0.34)",
    logoFile: "4.0 Time Management.png",
    subskillLogoFiles: ["4.1 Time Management.png", "4.2 Time Management.png", "4.3 Time Management.png"]
  },
  "critical-thinking": {
    accent: "#b48cff",
    accentSoft: "rgba(180, 140, 255, 0.16)",
    accentStrong: "rgba(180, 140, 255, 0.34)",
    logoFile: "5.0 Critical Thinking.png",
    subskillLogoFiles: ["5.1 Critical Thinking.png", "5.2 Critical Thinking.png", "5.3 Critical Thinking.png"]
  },
  "problem-solving": {
    accent: "#ff8f70",
    accentSoft: "rgba(255, 143, 112, 0.16)",
    accentStrong: "rgba(255, 143, 112, 0.34)",
    logoFile: "6.0 Problem Solving.png",
    subskillLogoFiles: ["6.1 Problem Solving.png", "6.2 Problem Solving.png", "6.3 Problem Solving.png"]
  }
};

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function getEmployabilityLogoPath(fileName) {
  if (!fileName) return "";
  const normalizedFileName = fileName.replace("LIteracy", "Literacy");
  return `../Assets/employability-logos/futuristic-suite/png/${normalizedFileName}?v=20260507-ecc-future`;
}

const STAR_EVIDENCE_STORAGE_KEY = "career-empire-star-evidence";
const STAR_EVIDENCE_SKILL_POINTS = 15;
const STAR_EVIDENCE_SALARY_REWARD = 500;
const EMPLOYABILITY_PORTFOLIO_MODULE_ID = "employability-skills";
const LEGACY_STAR_MODULE_ID = "lifelong-learning";
const STAR_REVIEW_QUEUE_MODULE_ID = LEGACY_STAR_MODULE_ID;

let employabilitySkillCategoriesCache = [];
let studentPortfolioState = {
  open: false,
  view: "timeline"
};

const STAR_CONTEXTS = [
  { id: "school", label: "School" },
  { id: "workplace", label: "Workplace" },
  { id: "community", label: "Community" },
  { id: "gameplay", label: "Gameplay" }
];

const STAR_BUILDER_STEPS = [
  {
    key: "situation",
    label: "S",
    term: "Situation",
    lead: "Awesome, tell me about it. What was the situation?",
    prompt: "Set the scene only: when and where it happened, who was involved, and what your role was. Save what you had to do for Task.",
    examples: ["During Year 11 at ECC, I was part of a group presentation and my role was...", "At my part-time job, I was working a shift in the customer service area...", "In a club meeting, I was one of the senior students helping younger members..."]
  },
  {
    key: "task",
    label: "T",
    term: "Task",
    lead: "Great. Now what was the task?",
    prompt: "What were you required to do as part of that role, and how did you know?",
    examples: ["Part of this role meant I had to explain the instructions clearly.", "I was required to check what the person needed before responding.", "My task was to keep the group on the same page."]
  },
  {
    key: "actions",
    label: "A",
    term: "Actions",
    lead: "Interesting. What actions did you specifically take?",
    prompt: "What did you say, write, ask, listen for, or show? Dot points are fine.",
    examples: ["I asked clarifying questions.", "I repeated the main point back.", "I changed my tone and wording for the audience."]
  },
  {
    key: "results",
    label: "R",
    term: "Results",
    lead: "Now finish it off. What was the outcome or result?",
    prompt: "What changed, what feedback did you receive, or what evidence shows it worked?",
    examples: ["The group completed the task on time.", "The customer understood the options and thanked me.", "My teacher said the explanation was clear."]
  },
  {
    key: "nextSteps",
    label: "Review",
    term: "Goal + Review",
    lead: "Last piece. What will you do differently next time?",
    prompt: "Set one goal for the next time you use this skill, and explain what you would improve or do differently.",
    examples: ["Next time, I would ask a clarifying question earlier so I understand the task before starting.", "My goal is to use the same sub-skill more deliberately and check whether it helped.", "I would plan my role sooner so the group has more time to complete the task well."]
  }
];

const STAR_CONTEXT_EXAMPLES = {
  school: {
    situation: ["During Year 11 at ECC, I was part of the school play and my role was backstage support...", "In my Phys Ed class, I was part of a small team activity with students I do not usually work with...", "As a peer mentor, my role was to support a younger student during orientation..."],
    task: ["Part of this role meant I had to explain the next step clearly so everyone knew where to go.", "I was required to listen to the student and check what they understood.", "My task was to help the group share information without talking over each other."],
    actions: ["I used eye contact and a calm tone.", "I asked a clarifying question before giving advice.", "I repeated the key instruction and checked that the group understood."],
    results: ["The group completed the task smoothly.", "The younger student felt more confident and joined in.", "My teacher said I communicated clearly and helped the group stay organised."]
  },
  workplace: {
    situation: ["At my retail job, I was working on the shop floor during a busy afternoon shift...", "During workplace learning, I was assigned to help my supervisor with a stock display...", "At work, I was serving customers near the front counter..."],
    task: ["Part of this role meant I had to understand what the customer wanted before suggesting an option.", "I was required to check the instructions and confirm what standard was expected.", "My task was to serve the customer politely and keep the interaction clear."],
    actions: ["I greeted the customer, listened carefully, and repeated the request back.", "I asked my supervisor one clear question before starting.", "I adjusted my language so it was easy for the customer to understand."],
    results: ["The customer found what they needed and thanked me.", "The task was completed correctly the first time.", "My supervisor gave me positive feedback for being polite and clear."]
  },
  community: {
    situation: ["At a community event, I was volunteering at the information table...", "During a volunteer activity, I was part of a team helping organise participants...", "At my sports club, I was one of the older players helping younger team members..."],
    task: ["Part of this role meant I had to give clear information so people knew what to do next.", "I was required to listen to questions and respond respectfully.", "My task was to make sure everyone received the same message."],
    actions: ["I spoke clearly and used simple instructions.", "I checked whether people had questions before moving on.", "I used friendly body language so people felt comfortable asking for help."],
    results: ["The event ran more smoothly.", "People knew where to go and what to do.", "A coordinator thanked me for helping the group stay organised."]
  },
  gameplay: {
    situation: ["In an EST Prep activity, I was working through a short-answer response about employability skills...", "During a module task, I was completing a question that asked me to explain my reasoning...", "In the glossary check, I was practising terminology for the EST Prep module..."],
    task: ["Part of this role meant I had to write a clear answer that matched the question.", "I was required to use the right term and explain it in my own words.", "My task was to turn the game feedback into a stronger response."],
    actions: ["I reread the question before answering.", "I used the glossary term accurately in a sentence.", "I changed my response after checking the feedback."],
    results: ["My answer became clearer and more accurate.", "I completed the check and showed better use of terminology.", "The module saved evidence that I could communicate the idea properly."]
  }
};

let starBuilderState = null;

function getSkillStarEvidenceEntries() {
  const entries = readJsonStorage(STAR_EVIDENCE_STORAGE_KEY, []);
  return Array.isArray(entries) ? entries : [];
}

function getSkillStarEvidenceMap(entries = getSkillStarEvidenceEntries()) {
  const map = (Array.isArray(entries) ? entries : []).reduce((acc, entry) => {
    getStarEntrySkillIds(entry).forEach(skillId => {
      acc[skillId] = acc[skillId] || [];
      acc[skillId].push(entry);
    });
    return acc;
  }, {});
  Object.values(map).forEach(skillEntries => skillEntries.sort(compareStarEntriesByExperienceDate));
  return map;
}

function getSkillCategory(skillId) {
  return employabilitySkillCategoriesCache.find(category => category.id === skillId) || null;
}

function getSkillCategoryTitle(skillId) {
  return getSkillCategory(skillId)?.title || skillId.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());
}

function getStarEntrySkillIds(entry = {}) {
  const ids = Array.isArray(entry.skillIds) && entry.skillIds.length
    ? entry.skillIds
    : Array.isArray(entry.selectedSkillIds) && entry.selectedSkillIds.length
      ? entry.selectedSkillIds
      : [entry.skillId];
  return [...new Set(ids.filter(Boolean))];
}

function getStarEntrySkillTitles(entry = {}) {
  const storedTitles = Array.isArray(entry.skillTitles) ? entry.skillTitles : [];
  return getStarEntrySkillIds(entry).map((skillId, index) => storedTitles[index] || getSkillCategoryTitle(skillId));
}

function normaliseStarSubskillTags(rawTags = []) {
  const seen = new Set();
  return (Array.isArray(rawTags) ? rawTags : []).map(tag => {
    const skillId = tag.skillId || tag.categoryId || "";
    const subskillId = tag.subskillId || tag.id || "";
    const category = getSkillCategory(skillId);
    const subskill = category?.subskills?.find(item => item.id === subskillId);
    return {
      skillId,
      skillTitle: tag.skillTitle || category?.title || getSkillCategoryTitle(skillId),
      subskillId,
      subskillTitle: tag.subskillTitle || subskill?.title || tag.title || subskillId.replaceAll("-", " ")
    };
  }).filter(tag => {
    const key = `${tag.skillId}:${tag.subskillId}`;
    if (!tag.skillId || !tag.subskillId || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getStarEntrySubskillTags(entry = {}) {
  return normaliseStarSubskillTags(entry.subskillTags || []);
}

function getStarReviewFamilyKey(studentId = "", skillId = "", contextId = "") {
  return [studentId, skillId, contextId].map(value => String(value || "").trim()).join("::");
}

function getStarReviewFamilyKeyForEntry(entry = {}, studentId = "") {
  return getStarReviewFamilyKey(studentId, getStarEntrySkillIds(entry)[0] || entry.skillId, entry.contextId);
}

function getStarReviewFamilyKeyForRow(row = {}) {
  if (row.evidence_type !== "employability-star") return "";
  const taskKey = String(row.task_key || "");
  const colonMatch = taskKey.match(/^employability-star:([^:]+):([^:]+):/);
  if (colonMatch) return getStarReviewFamilyKey(row.student_id, colonMatch[1], colonMatch[2]);
  const legacyMatch = taskKey.match(/^employability-star-(.+)-(school|workplace|community|gameplay)-star-/);
  if (legacyMatch) return getStarReviewFamilyKey(row.student_id, legacyMatch[1], legacyMatch[2]);
  return "";
}

function getTodayDateInputValue() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDateInputValue(value) {
  const raw = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function extractStarExperienceDateFromText(text) {
  const match = String(text || "").match(/(?:^|\n)(?:experience date|date of experience):\s*(\d{4}-\d{2}-\d{2})/i);
  return match?.[1] || "";
}

function stripStarEvidenceMetadata(text) {
  return String(text || "")
    .split("\n")
    .filter(line => !/^\s*(?:experience date|date of experience|tagged skills|sub-skills):/i.test(line))
    .join("\n")
    .trim();
}

function getStarEntryExperienceDate(entry = {}) {
  return entry.experienceDate
    || entry.dateOfExperience
    || extractStarExperienceDateFromText(entry.reviewText || entry.response || "")
    || entry.createdAt;
}

function formatExperienceDate(value) {
  const dateValue = formatDateInputValue(value);
  if (!dateValue) return "Experience date not set";
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
}

function compareStarEntriesByExperienceDate(a, b) {
  return parseTime(getStarEntryExperienceDate(b)) - parseTime(getStarEntryExperienceDate(a))
    || parseTime(b?.createdAt) - parseTime(a?.createdAt);
}

function saveSkillStarEvidence(entry) {
  const entries = getSkillStarEvidenceEntries();
  localStorage.setItem(STAR_EVIDENCE_STORAGE_KEY, JSON.stringify([entry, ...entries]));
}

function replaceSkillStarEvidence(previousEntryId, nextEntry) {
  const entries = getSkillStarEvidenceEntries();
  localStorage.setItem(STAR_EVIDENCE_STORAGE_KEY, JSON.stringify([nextEntry, ...entries.filter(entry => entry.id !== previousEntryId)]));
}

function saveSkillStarEvidenceEntries(entries = []) {
  localStorage.setItem(STAR_EVIDENCE_STORAGE_KEY, JSON.stringify(Array.isArray(entries) ? entries : []));
}

function isSkillStarEvidenceActive(entry) {
  return String(entry?.reviewStatus || "pending_review") !== "rejected";
}

function calculateSkillEvidenceProgress(entries) {
  return clampPercent((entries || []).filter(isSkillStarEvidenceActive).length * STAR_EVIDENCE_SKILL_POINTS);
}

function calculateStarReflectionCompletion(entries) {
  return clampPercent((entries || []).length * STAR_EVIDENCE_SKILL_POINTS);
}

function applySkillEvidenceProgress(progressMap, evidenceMap) {
  return Object.entries(evidenceMap || {}).reduce((acc, [skillId, entries]) => {
    acc[skillId] = Math.max(Number(acc[skillId] || 0), calculateSkillEvidenceProgress(entries));
    return acc;
  }, { ...progressMap });
}

function getStarContextLabel(contextId) {
  return STAR_CONTEXTS.find(context => context.id === contextId)?.label || "School";
}

function getStarBuilderExamples(contextId, stepKey, fallback = []) {
  return STAR_CONTEXT_EXAMPLES[contextId]?.[stepKey] || fallback;
}

function makeSnippet(value) {
  const cleanValue = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/^[\-•\s]+/, "")
    .trim();
  if (!cleanValue) return "";
  const firstSentence = cleanValue.split(/[.!?]/)[0].trim();
  const source = firstSentence || cleanValue;
  return source.length > 78 ? `${source.slice(0, 75).trim()}...` : source;
}

function createStarEvidenceSummary(entry) {
  const { contextId, skillTitle, responses } = entry;
  const contextLabel = getStarContextLabel(contextId);
  const skillTitles = getStarEntrySkillTitles(entry);
  const skillLabel = getStarEntrySkillIds(entry).length > 1
    ? skillTitles.join(" + ")
    : (skillTitle || skillTitles[0] || "Employability");
  const situation = makeSnippet(responses?.situation);
  const task = makeSnippet(responses?.task);
  const action = makeSnippet(responses?.actions);
  const core = situation || task || action || "STAR evidence";
  return `${contextLabel} ${skillLabel}: ${core}`;
}

function createStarEvidenceReviewText(entry) {
  const { contextId, skillTitle, responses } = entry;
  const clean = value => String(value || "").replace(/\s+/g, " ").trim();
  const contextLabel = getStarContextLabel(contextId);
  const skillTitles = getStarEntrySkillTitles(entry);
  const subskillTags = getStarEntrySubskillTags(entry);
  return [
    `${contextLabel} example for ${skillTitles.length ? skillTitles.join(", ") : skillTitle}.`,
    entry.experienceDate ? `Experience date: ${entry.experienceDate}` : "",
    skillTitles.length ? `Tagged skills: ${skillTitles.join("; ")}` : "",
    subskillTags.length ? `Sub-skills: ${subskillTags.map(tag => `${tag.skillTitle} - ${tag.subskillTitle}`).join("; ")}` : "",
    `Situation: ${clean(responses?.situation)}`,
    `Task: ${clean(responses?.task)}`,
    `Actions: ${clean(responses?.actions)}`,
    `Result: ${clean(responses?.results)}`,
    responses?.nextSteps ? `Goal and review: ${clean(responses.nextSteps)}` : ""
  ].filter(line => line && !line.endsWith(": ")).join("\n");
}

function getStarEvidenceReviewContext() {
  const authState = getAuthPrototypeState();
  const studentLogin = authState?.studentLogin || {};
  const session = getCurrentPlayerSession() || {};
  const untrackedDemo = Boolean(studentLogin.demo || session.demoMode || (studentLogin.preview && !studentLogin.id));
  return {
    studentId: untrackedDemo ? null : (studentLogin.id || session.studentId || null),
    classId: untrackedDemo ? null : (studentLogin.classId || session.classId || null),
    schoolId: untrackedDemo ? null : (studentLogin.schoolId || session.schoolId || null),
    student: {
      displayName: studentLogin.displayName || session.playerName || studentLogin.username || "",
      username: studentLogin.username || session.username || ""
    }
  };
}

async function queueSkillStarEvidenceForReview(entry) {
  const moderation = window.CareerEmpireResponseModeration;
  if (!moderation || typeof moderation.queuePendingReview !== "function") return null;

  const supabase = await getSupabaseClientOrNull();
  const context = getStarEvidenceReviewContext();
  if (!supabase || !context.studentId || !context.classId || !context.schoolId) return null;

  return moderation.queuePendingReview(supabase, {
    studentId: context.studentId,
    classId: context.classId,
    schoolId: context.schoolId,
    moduleId: STAR_REVIEW_QUEUE_MODULE_ID,
    evidenceType: "employability-star",
    taskKey: `employability-star:${entry.skillId}:${entry.contextId}:${entry.id}`,
    taskLabel: `${getStarEntrySkillTitles(entry).join(" + ") || entry.skillTitle || "Employability"} STAR evidence`,
    promptText: "Final STAR employability portfolio entry. Teacher checks this before it can be shared.",
    responseText: entry.reviewText || createStarEvidenceReviewText(entry),
    student: context.student
  });
}

async function retireSkillStarReviewForResubmission(previousEntryId, previousReviewId = "", replacementReviewId = "") {
  const supabase = await getSupabaseClientOrNull();
  const context = getStarEvidenceReviewContext();
  if (!supabase || !context.studentId || (!previousEntryId && !previousReviewId)) return;

  const replacementText = replacementReviewId ? ` Replacement review: ${replacementReviewId}` : "";
  const payload = {
    reviewer_note: buildQuietRejectionNote(`Superseded by a resubmitted STAR reflection.${replacementText}`),
    updated_at: new Date().toISOString()
  };
  let query = supabase
    .from("student_response_reviews")
    .update(payload)
    .eq("student_id", context.studentId)
    .eq("evidence_type", "employability-star");

  if (previousReviewId) {
    query = query.eq("id", previousReviewId);
  } else {
    query = query.ilike("task_key", `%${previousEntryId}%`);
  }

  const { error } = await query;
  if (error) console.warn("Previous STAR review could not be retired:", error.message || error);
}

async function retireSupersededStarReviewRows(entry, reviewRows = [], replacementReviewId = "") {
  const context = getStarEvidenceReviewContext();
  if (!context.studentId) return;
  const familyKey = getStarReviewFamilyKeyForEntry(entry, context.studentId);
  const rejectedRows = (Array.isArray(reviewRows) ? reviewRows : [])
    .filter(row => row.status === "rejected")
    .filter(row => !isQuietReviewRejection(row))
    .filter(row => getStarReviewFamilyKeyForRow(row) === familyKey);

  await Promise.all(rejectedRows.map(row => retireSkillStarReviewForResubmission("", row.id, replacementReviewId)));
}

async function ensurePendingSkillStarEvidenceReviews(entries = [], reviewRows = []) {
  const context = getStarEvidenceReviewContext();
  if (!context.studentId) return { entries, changed: false };
  let changed = false;
  const nextEntries = [];

  for (const entry of Array.isArray(entries) ? entries : []) {
    if (entry?.reviewId || String(entry?.reviewStatus || "pending_review") !== "pending_review") {
      nextEntries.push(entry);
      continue;
    }

    const review = await queueSkillStarEvidenceForReview(entry).catch(error => {
      console.warn("Pending STAR evidence review could not be queued:", error.message || error);
      return null;
    });

    if (review?.id) {
      const queuedEntry = { ...entry, reviewId: review.id };
      await retireSupersededStarReviewRows(queuedEntry, reviewRows, review.id);
      nextEntries.push(queuedEntry);
      changed = true;
    } else {
      nextEntries.push(entry);
    }
  }

  if (changed) saveSkillStarEvidenceEntries(nextEntries);
  return { entries: nextEntries, changed };
}

async function getCurrentStudentResponseReviews() {
  const authState = getAuthPrototypeState();
  const session = getCurrentPlayerSession();
  const studentLogin = authState?.studentLogin || {};
  const studentId = studentLogin.id;
  if (!studentId || studentLogin.demo || session?.demoMode || (studentLogin.preview && !studentId)) return [];

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("student_response_reviews")
    .select("id, source_evidence_id, student_id, class_id, module_id, evidence_type, task_key, task_label, prompt_text, raw_response_text, approved_response_text, status, reviewer_note, reviewed_at, created_at, flags, flag_notes")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    console.error("Student response review status could not be loaded", error);
    return [];
  }
  return dedupeTeacherReviewRows((data || []).filter(row => !isQuietReviewRejection(row) && isTeacherReviewableStudentResponse(row)));
}

async function getCurrentStudentApprovedPeerResponses() {
  const authState = getAuthPrototypeState();
  const session = getCurrentPlayerSession() || {};
  const studentLogin = authState?.studentLogin || {};
  const studentId = studentLogin.id || session.studentId || "";
  const classId = studentLogin.classId || session.classId || "";
  if (!classId) return [];

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return [];

  let query = supabase
    .from("student_response_reviews")
    .select("id, student_id, module_id, evidence_type, task_key, task_label, prompt_text, approved_response_text, reviewed_at, created_at")
    .eq("class_id", classId)
    .eq("status", "approved")
    .not("approved_response_text", "is", null)
    .order("reviewed_at", { ascending: false, nullsFirst: false })
    .limit(12);

  if (studentId) query = query.neq("student_id", studentId);

  const { data, error } = await query;
  if (error) {
    console.error("Approved peer responses could not be loaded", error);
    return [];
  }
  return dedupeTeacherReviewRows((data || []).filter(row => isTeacherReviewableStudentResponse(row) && normaliseWhitespace(row.approved_response_text)));
}

function findReviewForStarEntry(entry, reviewRows = []) {
  return reviewRows.find(row => row.id === entry.reviewId)
    || reviewRows.find(row => row.evidence_type === "employability-star" && String(row.task_key || "").includes(entry.id))
    || reviewRows.find(row => row.evidence_type === "employability-star"
      && row.status !== "rejected"
      && normaliseWhitespace(row.raw_response_text) === normaliseWhitespace(entry.reviewText || createStarEvidenceReviewText(entry)));
}

function syncSkillStarEvidenceWithReviews(entries = [], reviewRows = []) {
  let changed = false;
  const syncedEntries = entries.map(entry => {
    const review = findReviewForStarEntry(entry, reviewRows);
    if (!review) return entry;
    const next = {
      ...entry,
      reviewId: review.id,
      reviewStatus: review.status || entry.reviewStatus || "pending_review",
      reviewerNote: review.reviewer_note || "",
      reviewedAt: review.reviewed_at || null
    };
    changed = changed
      || next.reviewId !== entry.reviewId
      || next.reviewStatus !== entry.reviewStatus
      || next.reviewerNote !== entry.reviewerNote
      || next.reviewedAt !== entry.reviewedAt;
    return next;
  });

  if (changed) {
    localStorage.setItem(STAR_EVIDENCE_STORAGE_KEY, JSON.stringify(syncedEntries));
  }
  return syncedEntries;
}

function getStudentReviewNoticeText(row) {
  const reason = getRejectionReasonFromNote(row.reviewer_note || "");
  const flags = getResponseReviewFlags(row);
  const isPersonalInfo = reason.toLowerCase().includes("personal")
    || reason.toLowerCase().includes("workplace")
    || reason.toLowerCase().includes("location")
    || flags.some(flag => ["possible_email", "possible_phone", "possible_student_name", "possible_workplace_identifier", "possible_location", "possible_context_identifier"].includes(flag));
  const hasLanguageConcern = reason.toLowerCase().includes("profanity")
    || reason.toLowerCase().includes("inappropriate")
    || flags.includes("possible_profanity");
  const reasonText = isPersonalInfo
    ? "because it may include personal or identifying information"
    : hasLanguageConcern
      ? "because it may include inappropriate language"
    : reason
      ? `because: ${reason.toLowerCase()}`
      : "because it was not suitable for sharing";
  return `This response was saved for your teacher, but it was not added to the shared response pool ${reasonText}.`;
}

function getStudentReviewTopicId(row) {
  const taskKey = String(row?.task_key || "");
  const keyMatch = taskKey.match(/revision-topic-([a-z0-9-]+)/i);
  if (keyMatch?.[1]) return keyMatch[1];
  return "";
}

function getStudentReviewActionUrl(row) {
  if ((row?.module_id || "") !== "est-prep") return "";
  const topicId = getStudentReviewTopicId(row);
  if (!topicId) return "../modules/est-prep/index.html";
  const params = new URLSearchParams({
    stage: "content",
    topic: topicId,
    view: "response"
  });
  return `../modules/est-prep/index.html?${params.toString()}`;
}

function getStudentReviewStatusText(row) {
  if (isTeacherCheckOnlyReview(row)) {
    if (row.status === "approved") {
      return "Your saved check has been checked by your teacher.";
    }
    return row.reviewer_note
      ? `Your saved check was returned with teacher feedback: ${row.reviewer_note}`
      : "Your saved check was returned with teacher feedback.";
  }
  if (row.status === "approved") {
    return "Your teacher approved this response. Your portfolio evidence stays saved under the skills it was tagged to.";
  }
  return getStudentReviewNoticeText(row);
}

function renderStudentResponseReviewNotices(reviewRows = []) {
  const panel = document.getElementById("student-review-notices-panel");
  const container = document.getElementById("student-review-notices");
  if (!panel || !container) return;

  const actionedRows = reviewRows
    .filter(row => ["approved", "rejected"].includes(row.status) && !isQuietReviewRejection(row))
    .slice(0, 6);

  if (!actionedRows.length) {
    panel.hidden = true;
    container.innerHTML = "";
    return;
  }

  panel.hidden = false;
  container.innerHTML = actionedRows.map(row => {
    const actionUrl = row.status === "rejected" ? getStudentReviewActionUrl(row) : "";
    const showApprovedText = row.status === "approved" && row.approved_response_text && isShareableReviewEvidence(row);
    return `
    <div class="student-review-notice student-review-notice--${escapeHtml(row.status)}">
      <strong>${escapeHtml(row.task_label || "Written response")}</strong>
      <p>${escapeHtml(getStudentReviewStatusText(row))}</p>
      ${showApprovedText ? `<blockquote>${escapeHtml(row.approved_response_text)}</blockquote>` : ""}
      ${actionUrl ? `<div class="student-review-notice-actions"><a class="module-link" href="${escapeHtml(actionUrl)}">Revise and resubmit</a></div>` : ""}
      <small>${escapeHtml(formatDateTime(row.reviewed_at || row.created_at))}</small>
    </div>
  `;
  }).join("");
}

function bankStarEvidenceSalary(entry) {
  const session = getCurrentPlayerSession() || {};
  const currentSalary = Number(session.annualSalary || session.salary || 25000);
  const nextSalary = currentSalary + STAR_EVIDENCE_SALARY_REWARD;
  const economyLog = Array.isArray(session.economyLog) ? session.economyLog : [];
  const nextSession = {
    ...session,
    annualSalary: nextSalary,
    salary: nextSalary,
    economyLog: [
      {
        id: entry.id,
        timestamp: entry.createdAt,
        moduleId: "employability-skills",
        eventType: "star-evidence",
        label: `${entry.skillTitle} STAR evidence`,
        detail: `${getStarContextLabel(entry.contextId)} example banked for ${entry.skillTitle}.`,
        earnedDelta: STAR_EVIDENCE_SALARY_REWARD,
        annualSalaryAfter: nextSalary
      },
      ...economyLog
    ].slice(0, 20)
  };
  localStorage.setItem("career-empire-session", JSON.stringify(nextSession));
}

function deriveEmployabilityProgress(record) {
  if (!record) {
    return {
      "communication": 0,
      "digital-literacy": 0,
      "teamwork": 0,
      "time-management": 0,
      "critical-thinking": 0,
      "problem-solving": 0
    };
  }

  const tech = Number(record.tech_mastery || 0);
  const climate = Number(record.climate_mastery || 0);
  const demo = Number(record.demo_mastery || 0);
  const economic = Number(record.economic_mastery || 0);
  const balance = Number(record.work_life_balance || 0);

  return {
    "communication": Math.round((demo + economic) / 2),
    "digital-literacy": tech,
    "teamwork": demo,
    "time-management": Math.round((balance + climate) / 2),
    "critical-thinking": Math.round((tech + climate + demo + economic) / 4),
    "problem-solving": Math.round((tech + climate + economic) / 3)
  };
}

function getWeakestSkill(progressMap) {
  const entries = Object.entries(progressMap);
  if (!entries.length) return ["communication", 0];
  return entries.reduce((lowest, entry) => entry[1] < lowest[1] ? entry : lowest, entries[0]);
}

function getStrongestSkill(progressMap) {
  const entries = Object.entries(progressMap);
  if (!entries.length) return ["communication", 0];
  return entries.reduce((highest, entry) => entry[1] > highest[1] ? entry : highest, entries[0]);
}

function createProgressBar(value, variant = "") {
  return `
    <div class="progress-track">
      <div class="progress-fill ${variant}" style="width: ${value}%"></div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderBadge(label, logoPath = "", logoLabel = "") {
  return `<span class="badge ${logoPath ? "with-logo" : ""}">${logoPath ? `<img class="badge-logo" src="${logoPath}" alt="${escapeHtml(logoLabel || label)} logo">` : ""}${escapeHtml(label)}</span>`;
}

function getModuleImageStyle(imagePath = "") {
  return imagePath ? ` style="--module-image: url('${escapeHtml(imagePath)}')"` : "";
}

function renderAvatarModuleLogo(profile = {}) {
  const characterBase = AVATAR_BADGE_CHARACTER_BASES[profile?.characterBase];
  if (characterBase?.imagePath) {
    return `
      <span class="module-avatar-logo" role="img" aria-label="${escapeHtml(characterBase.label)} avatar preview">
        <img src="${escapeHtml(characterBase.imagePath)}" alt="">
      </span>
    `;
  }

  const skin = AVATAR_BADGE_SKIN_COLOURS[profile?.skinTone] || AVATAR_BADGE_SKIN_COLOURS.sand;
  const hair = AVATAR_BADGE_HAIR_COLOURS[profile?.hairColour] || AVATAR_BADGE_HAIR_COLOURS.brown;
  return `
    <span class="module-avatar-logo" role="img" aria-label="Avatar preview">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="avatarBadgeBg" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0f8f8c"/>
            <stop offset="0.58" stop-color="#123a5d"/>
            <stop offset="1" stop-color="#ffd13f"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#avatarBadgeBg)"/>
        <path d="M16 56 C19 43 26 38 32 38 C38 38 45 43 48 56 Z" fill="#123a5d"/>
        <path d="M23 43 L32 58 L41 43" fill="#f7fbff"/>
        <path d="M31 42 L33 42 L36 56 L32 60 L28 56 Z" fill="#0f8f8c"/>
        <circle cx="32" cy="29" r="17" fill="${skin.color}"/>
        <path d="M17 30 C18 15 27 10 34 10 C44 10 50 18 49 30 C43 23 34 21 22 24 Z" fill="${hair}"/>
        <path d="M20 31 C21 22 27 17 35 17 C42 17 46 22 48 29 C41 24 30 23 20 31 Z" fill="${hair}" opacity="0.72"/>
        <circle cx="26" cy="31" r="4.4" fill="#ffffff"/>
        <circle cx="38" cy="31" r="4.4" fill="#ffffff"/>
        <circle cx="26" cy="31" r="2" fill="#0c3f6f"/>
        <circle cx="38" cy="31" r="2" fill="#0c3f6f"/>
        <path d="M25 41 C29 44 35 44 39 41" fill="none" stroke="#241915" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M32 33 C30 37 30 38 34 38" fill="none" stroke="${skin.shadow}" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
      </svg>
    </span>
  `;
}

function renderStudentModules(modules) {
  const container = document.getElementById("student-module-grid");
  if (!container) return;

  const orderedModules = [...modules].sort((a, b) => (b.startHere ? 1 : 0) - (a.startHere ? 1 : 0));

  container.innerHTML = orderedModules.map(module => `
    <article class="module-card ${module.imagePath ? "module-card--image-bg" : ""} ${module.action === "portfolio" ? "module-card--portfolio" : ""} ${module.spotlight ? "spotlight" : ""} ${module.startHere ? "module-card--start-here" : ""} ${module.available === false ? "module-card--unavailable" : ""}"${getModuleImageStyle(module.imagePath)}>
      <div class="module-visual-badge">
        ${module.logoHtml || (module.logoPath ? `<img class="module-logo" src="${module.logoPath}" alt="${escapeHtml(module.logoLabel || module.title)} logo">` : "")}
        <span>${escapeHtml(module.badgeLabel || module.title)}</span>
      </div>
      <div class="module-card-body">
        <div class="kicker">${module.state}</div>
        <h3>${module.title}</h3>
        <p>${module.summary}</p>
        ${createProgressBar(module.progress, module.variant)}
        <div class="section-title">
          <p>${module.progress}% complete</p>
          <p>${module.mastery}% mastery</p>
        </div>
        <div class="pill-row">
          ${module.tags.map(tag => `<span class="pill">${tag}</span>`).join("")}
        </div>
        ${module.available === false
          ? `<div class="module-actions"><span class="module-link module-link-disabled" aria-disabled="true">${escapeHtml(module.unavailableLabel || "Unavailable")}</span></div>`
          : module.action === "portfolio"
            ? `<div class="module-actions"><button class="module-link" type="button" data-open-student-portfolio data-portfolio-label="${escapeHtml(module.launchLabel || "Open Portfolio")}">${escapeHtml(module.launchLabel || "Open Portfolio")}</button></div>`
          : module.launchPath
            ? `<div class="module-actions"><a class="module-link ${module.startHere ? "start-here-link" : ""}" href="${module.launchPath}">${module.launchLabel || "Open Module"}</a></div>`
            : ""}
      </div>
    </article>
  `).join("");
}

function getCurrentStudentModuleStatuses() {
  const authState = getAuthPrototypeState();
  const studentLogin = authState?.studentLogin || {};
  const session = getCurrentPlayerSession() || {};
  const classId = studentLogin.classId || session.classId || "global";
  const studentId = studentLogin.id || session.studentId || "";
  return getEffectiveModuleStatuses({ classId, studentId });
}

function syncStudentPrimaryModuleActions(moduleStatuses) {
  const actionMap = {
    "student-hub-avatar-link": "avatar-studio",
    "student-hub-est-link": "est-prep",
    "student-hub-initiative-link": "initiative",
    "student-hub-megatrends-link": "megatrends",
    "student-hub-lifelong-link": "lifelong-learning"
  };
  Object.entries(actionMap).forEach(([elementId, moduleId]) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const module = getModuleById(moduleId);
    const active = moduleStatuses[moduleId] === "active";
    element.classList.toggle("module-link-disabled", !active);
    element.setAttribute("aria-disabled", active ? "false" : "true");
    element.tabIndex = active ? 0 : -1;
    if (active) {
      element.href = moduleId === "megatrends" ? buildMegatrendsLaunchPath() : module?.launchPath || element.href;
    } else {
      element.removeAttribute("href");
      element.textContent = `${module?.shortTitle || moduleId} ${getModuleStatusLabel(moduleStatuses[moduleId])}`;
    }
  });
}

function renderStudentTimeline(items) {
  const container = document.getElementById("student-timeline");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="timeline-empty-state" style="--empty-state-image: url('../Assets/Images and Animations/Student Hub/activity-empty-state.png')">
        <div>
          <div class="timeline-kicker">Ready to earn</div>
          <strong>No activity yet</strong>
          <p>Complete a mission, bank salary, or buy an upgrade and your latest Career Empire moves will appear here.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item ${item.variant || ""} ${item.iconPath ? "with-icon" : ""}">
      ${item.iconPath ? `<img class="timeline-reward-icon" src="${item.iconPath}" alt="">` : ""}
      <div>
        ${item.kicker ? `<div class="timeline-kicker">${item.kicker}</div>` : ""}
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
      </div>
    </div>
  `).join("");
}

function buildEconomyTimelineItems(session) {
  const entries = Array.isArray(session?.economyLog) ? session.economyLog : [];
  return entries.slice(0, 6).map(entry => {
    const incomeParts = [];
    if (Number(entry.earnedDelta || 0) > 0) incomeParts.push(`Income +${formatCurrency(entry.earnedDelta)}`);
    if (Number(entry.taxDelta || 0) > 0) incomeParts.push(`Tax +${formatCurrency(entry.taxDelta)}`);
    if (Number(entry.spendDelta || 0) > 0) incomeParts.push(`Spend -${formatCurrency(entry.spendDelta)}`);

    const totals = [];
    if (typeof entry.annualSalaryAfter === "number") totals.push(`Salary ${formatCurrency(entry.annualSalaryAfter)}`);
    if (typeof entry.netWorthAfter === "number") totals.push(`Net worth ${formatCurrency(entry.netWorthAfter)}`);
    if (typeof entry.taxPaidAfter === "number") totals.push(`Tax paid ${formatCurrency(entry.taxPaidAfter)}`);

    const moduleLabel =
      entry.moduleId === "est-prep" ? "EST" :
      entry.moduleId === "lifelong-learning" ? "Lifelong Learning" :
      entry.moduleId === "megatrends" ? "Megatrends" :
      entry.moduleId === "global-shop" ? "Shop" :
      entry.moduleId === "employability-skills" ? "Employability" :
      "Platform";

    const eventLabel =
      entry.eventType === "purchase" ? "Spend event" :
      entry.eventType === "reward-awarded" ? "Reward awarded" :
      entry.eventType === "star-evidence" ? "STAR evidence banked" :
      entry.eventType === "scenario-choice" ? "Scenario reward" :
      "Profile saved";
    const iconPath =
      entry.eventType === "purchase" ? STUDENT_REWARD_ICONS.salary :
      entry.eventType === "reward-awarded" ? STUDENT_REWARD_ICONS.chamber :
      Number(entry.taxDelta || 0) > 0 ? STUDENT_REWARD_ICONS.tax :
      Number(entry.earnedDelta || 0) > 0 ? STUDENT_REWARD_ICONS.salary :
      STUDENT_REWARD_ICONS.signal;

    return {
      title: `${entry.label || entry.checkpoint || "Economy update"} • ${new Date(entry.timestamp).toLocaleString()}`,
      kicker: `${moduleLabel} • ${eventLabel}`,
      variant: entry.eventType === "purchase" ? "timeline-spend" : "timeline-income",
      iconPath,
      detail: [
        entry.detail || `${entry.moduleId || "module"} updated your shared profile.`,
        incomeParts.join(" • "),
        totals.join(" • ")
      ].filter(Boolean).join(" • ")
    };
  });
}

function renderStudentShopPreview(items) {
  const container = document.getElementById("student-shop-preview");
  if (!container) return;
  container.innerHTML = items.map(item => `
    <article class="module-card ${item.imagePath ? "module-card--image-bg" : ""} ${item.spotlight ? "spotlight" : ""}"${getModuleImageStyle(item.imagePath)}>
      <div class="module-visual-badge">
        <span>${item.title}</span>
      </div>
      <div class="module-card-body">
        <div class="kicker">${item.state}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <div class="pill-row">
          ${item.tags.map(tag => `<span class="pill">${tag}</span>`).join("")}
        </div>
        <div class="module-actions">
          <a class="module-link" href="${item.launchPath}">${item.launchLabel}</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCommunityBoard(targetId, data) {
  const container = document.getElementById(targetId);
  if (!container) return;

  const voteEntries = data.voteRows.map(row => {
    const variant =
      row.id === "climate" ? "green" :
      row.id === "global" ? "gold" :
      row.id === "diversity" ? "red" : "";
    return `
      <div class="vote-row">
        <div class="vote-label">${row.label}</div>
        <div class="mini-track"><div class="mini-fill ${variant}" style="width:${row.percent}%"></div></div>
        <div class="vote-label">${row.percent}%</div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    ${data.visualPath ? `
      <article class="community-card community-visual-card" style="--community-visual: url('${escapeHtml(data.visualPath)}')">
        <div class="kicker">Class Impact</div>
        <h3>Every module feeds the shared build</h3>
        <p>Salary, tax, votes, and progress connect your individual play to the class economy.</p>
      </article>
    ` : ""}
    <article class="community-card">
      <div class="kicker">Your Impact</div>
      <h3>${data.currentVoteLabel}</h3>
      <div class="community-stat">${data.taxPaid}</div>
      <p>${data.summary}</p>
      <div class="pill-row">
        <span class="pill">Current vote: ${data.currentVoteLabel}</span>
        <span class="pill">Class fund leader: ${data.leadingCause}</span>
      </div>
    </article>
    <article class="community-card">
      <div class="kicker">Class Standings</div>
      <h3>Community Vote Split</h3>
      <p>${data.voteIntro}</p>
      <div class="vote-stack">${voteEntries}</div>
    </article>
  `;
}

function renderStudentCommunityBoard(data) {
  renderCommunityBoard("student-community-board", {
    visualPath: "../Assets/Images and Animations/Student Hub/community-impact-banner.png",
    ...data
  });
}

function getCommunityVoteLabels() {
  return {
    climate: "Climate and Sustainability",
    tech: "Tech Education and Inclusion",
    diversity: "Diversity and Economic Equity",
    global: "Global Opportunity Access",
    none: "No community vote yet"
  };
}

function getStrongestSkillCategory(skillsData, player) {
  const progressMap = deriveEmployabilityProgress(player);
  const strongestSkillId = getStrongestSkill(progressMap)[0];
  return skillsData.categories.find(category => category.id === strongestSkillId) || skillsData.categories[0];
}

function renderSharedLeaderboard(players, skillsData) {
  const container = document.getElementById("leaderboard-page-list");
  if (!container) return;

  const latestPlayers = dedupeLatestPlayers(players);
  const schoolLeaderboard = filterPlayersToCurrentSchool(latestPlayers);
  const schoolLabel = schoolLeaderboard.scope.schoolName || "your school";
  const rankedPlayers = schoolLeaderboard.players
    .sort((a, b) => Number(b.cumulative_net_worth || 0) - Number(a.cumulative_net_worth || 0));

  if (!schoolLeaderboard.hasScope) {
    container.innerHTML = '<div class="timeline-item"><strong>School leaderboard locked</strong><p>Log in as a student or teacher to see standings for your school.</p></div>';
    return;
  }

  if (!rankedPlayers.length) {
    container.innerHTML = `<div class="timeline-item"><strong>No leaderboard data yet</strong><p>Once students from ${escapeHtml(schoolLabel)} start playing, this school leaderboard will begin filling automatically.</p></div>`;
    return;
  }

  container.innerHTML = rankedPlayers.map((player, index) => {
    const strongestSkill = getStrongestSkillCategory(skillsData, player);
    return `
      <article class="module-card ${index === 0 ? "spotlight" : ""}">
        <div class="module-header">
          ${strongestSkill?.logoPath ? `<img class="module-logo" src="${strongestSkill.logoPath}" alt="${escapeHtml(strongestSkill.title)} logo">` : ""}
          <div>
            <div class="kicker">Rank #${index + 1}</div>
            <h3>${escapeHtml(player.player_name)}</h3>
          </div>
        </div>
        <p>${escapeHtml(player.career_title || "Career Builder")} • ${escapeHtml(player.school_name || "School not set")} • Class ${escapeHtml(player.class_code || "Not set")}</p>
        <div class="pill-row">
          <span class="pill">Net worth: ${formatCurrency(player.cumulative_net_worth)}</span>
          <span class="pill">Salary: ${formatCurrency(player.annual_salary)}</span>
          <span class="pill">Years: ${player.years_played || 0}</span>
          <span class="pill">Strongest skill: ${escapeHtml(strongestSkill?.title || "Not yet clear")}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderSharedCommunityPage(players) {
  const board = document.getElementById("community-page-board");
  if (!board) return;

  const schoolCommunity = filterPlayersToCurrentSchool(dedupeLatestPlayers(players));
  if (!schoolCommunity.hasScope) {
    board.innerHTML = '<div class="timeline-item"><strong>Community board locked</strong><p>Log in as a student or teacher to see the community vote for your school.</p></div>';
    return;
  }
  const latestPlayers = schoolCommunity.players;
  const voteLabels = getCommunityVoteLabels();
  const voteKeys = ["climate", "tech", "diversity", "global"];
  const voteCounts = voteKeys.reduce((acc, key) => {
    acc[key] = latestPlayers.filter(player => player.community_vote === key).length;
    return acc;
  }, {});
  const totalVotes = voteKeys.reduce((sum, key) => sum + voteCounts[key], 0);
  const totalTax = latestPlayers.reduce((sum, player) => sum + Math.floor(Number(player.cumulative_net_worth || 0) * 0.1), 0);
  const topVote = voteKeys
    .map(key => ({ key, count: voteCounts[key] }))
    .sort((a, b) => b.count - a.count)[0];
  const authState = getAuthPrototypeState();
  const currentVote = authState?.studentLogin?.id
    ? latestPlayers.find(player => player.id === authState.studentLogin.id)?.community_vote || "none"
    : "none";

  renderCommunityBoard("community-page-board", {
    visualPath: "../Assets/Images and Animations/Student Hub/community-impact-banner.png",
    currentVoteLabel: voteLabels[currentVote] || voteLabels.none,
    taxPaid: formatCurrency(totalTax),
    summary: totalVotes
      ? `Students are directing their class fund through ${totalVotes} recorded community vote${totalVotes === 1 ? "" : "s"}.`
      : "No community votes yet. As students complete modules and vote, the class fund direction will appear here.",
    leadingCause: topVote?.count ? voteLabels[topVote.key] : "No votes yet",
    voteIntro: totalVotes
      ? `${totalVotes} vote${totalVotes === 1 ? "" : "s"} recorded across the class community board.`
      : "No votes recorded yet.",
    voteRows: voteKeys.map(key => ({
      id: key,
      label: voteLabels[key],
      percent: totalVotes ? Math.round((voteCounts[key] / totalVotes) * 100) : 0
    }))
  });
}

function renderSharedGlobalPage(players) {
  const metrics = document.getElementById("global-page-metrics");
  const schoolRankings = document.getElementById("global-school-rankings");
  const classRankings = document.getElementById("global-class-rankings");
  const spotlights = document.getElementById("global-spotlights");
  if (!metrics || !schoolRankings || !classRankings || !spotlights) return;

  const latestPlayers = dedupeLatestPlayers(players);
  if (!latestPlayers.length) {
    metrics.innerHTML = `
      <article class="metric global-metric">
        <div class="metric-label">Global Status</div>
        <div class="metric-value">0</div>
        <div class="metric-note">No school competition data yet</div>
      </article>
    `;
    schoolRankings.innerHTML = '<div class="global-empty-state"><strong>No schools ranked yet</strong><p>Once schools begin playing, this page becomes the aggregate interschool ladder.</p></div>';
    classRankings.innerHTML = '<article class="module-card global-class-card"><div class="kicker">Awaiting data</div><h3>No classes yet</h3><p>The rivalry board will populate once classes begin banking earnings and progress.</p></article>';
    spotlights.innerHTML = '<div class="global-empty-state"><strong>No spotlight stats yet</strong><p>Aggregate highlights will appear once schools start generating results.</p></div>';
    return;
  }

  const averageForPlayers = (items, key) => items.length
    ? Math.round(items.reduce((sum, player) => sum + Number(player[key] || 0), 0) / items.length)
    : 0;

  const schoolMap = new Map();
  const classMap = new Map();

  latestPlayers.forEach(player => {
    const schoolKey = player.school_name || "Unlinked School";
    const classKey = `${schoolKey}::${player.class_code || "No Class Code"}`;

    if (!schoolMap.has(schoolKey)) {
      schoolMap.set(schoolKey, []);
    }
    schoolMap.get(schoolKey).push(player);

    if (!classMap.has(classKey)) {
      classMap.set(classKey, []);
    }
    classMap.get(classKey).push(player);
  });

  const schoolRows = [...schoolMap.entries()].map(([schoolName, members]) => {
    const earnings = members.reduce((sum, player) => sum + Number(player.annual_salary || 0), 0);
    const netWorth = members.reduce((sum, player) => sum + Number(player.cumulative_net_worth || 0), 0);
    const tax = members.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
    const readiness = Math.round((
      averageForPlayers(members, "tech_mastery") +
      averageForPlayers(members, "climate_mastery") +
      averageForPlayers(members, "demo_mastery") +
      averageForPlayers(members, "economic_mastery")
    ) / 4);
    const yearsPlayed = members.reduce((sum, player) => sum + Number(player.years_played || 0), 0);
    const jobSecurity = averageForPlayers(members, "job_security");
    const workLifeBalance = averageForPlayers(members, "work_life_balance");
    const competitiveScore = Math.round(
      (earnings / Math.max(1, members.length * 1000)) +
      readiness * 1.8 +
      yearsPlayed * 3 +
      (jobSecurity * 0.4)
    );

    return {
      schoolName,
      members,
      studentCount: members.length,
      earnings,
      netWorth,
      tax,
      readiness,
      yearsPlayed,
      jobSecurity,
      workLifeBalance,
      competitiveScore
    };
  }).sort((a, b) => b.competitiveScore - a.competitiveScore);

  const classRows = [...classMap.entries()].map(([key, members]) => {
    const [schoolName, classCode] = key.split("::");
    const earnings = members.reduce((sum, player) => sum + Number(player.annual_salary || 0), 0);
    const tax = members.reduce((sum, player) => sum + Math.floor(Number(player.annual_salary || 0) * 0.1), 0);
    const readiness = Math.round((
      averageForPlayers(members, "tech_mastery") +
      averageForPlayers(members, "climate_mastery") +
      averageForPlayers(members, "demo_mastery") +
      averageForPlayers(members, "economic_mastery")
    ) / 4);
    const yearsPlayed = members.reduce((sum, player) => sum + Number(player.years_played || 0), 0);
    const score = Math.round((earnings / Math.max(1, members.length * 1000)) + readiness * 1.7 + yearsPlayed * 4);

    return {
      schoolName,
      classCode,
      studentCount: members.length,
      earnings,
      tax,
      readiness,
      yearsPlayed,
      score
    };
  }).sort((a, b) => b.score - a.score);

  const topSchool = schoolRows[0];
  const highestReadiness = [...schoolRows].sort((a, b) => b.readiness - a.readiness)[0];
  const biggestTaxBase = [...schoolRows].sort((a, b) => b.tax - a.tax)[0];
  const bestAttendanceProxy = [...schoolRows].sort((a, b) => b.yearsPlayed - a.yearsPlayed)[0];
  const safestSchool = [...schoolRows].sort((a, b) => b.jobSecurity - a.jobSecurity)[0];
  const totalSchools = schoolRows.length;
  const totalStudents = latestPlayers.length;
  const totalRounds = schoolRows.reduce((sum, row) => sum + row.yearsPlayed, 0);
  const averageReadiness = Math.round(schoolRows.reduce((sum, row) => sum + row.readiness, 0) / Math.max(1, schoolRows.length));
  const maxSchoolScore = Math.max(...schoolRows.map(row => row.competitiveScore), 1);
  const maxClassScore = Math.max(...classRows.map(row => row.score), 1);

  metrics.innerHTML = `
    <article class="metric global-metric global-metric--leader">
      <div class="metric-label">League Leader</div>
      <div class="metric-value global-metric-title">${escapeHtml(topSchool.schoolName)}</div>
      <div class="metric-note">${topSchool.competitiveScore} rivalry points &middot; ${totalSchools} schools</div>
    </article>
    <article class="metric global-metric global-metric--readiness">
      <div class="metric-label">Readiness Peak</div>
      <div class="metric-value">${highestReadiness.readiness}%</div>
      <div class="metric-note">${escapeHtml(highestReadiness.schoolName)} &middot; ${averageReadiness}% average</div>
    </article>
    <article class="metric global-metric global-metric--momentum">
      <div class="metric-label">Participation Heat</div>
      <div class="metric-value">${totalRounds}</div>
      <div class="metric-note">${totalStudents} students &middot; ${bestAttendanceProxy.yearsPlayed} rounds from ${escapeHtml(bestAttendanceProxy.schoolName)}</div>
    </article>
    <article class="metric global-metric global-metric--fund">
      <div class="metric-label">Community Fund</div>
      <div class="metric-value">${formatCurrency(biggestTaxBase.tax)}</div>
      <div class="metric-note">${escapeHtml(biggestTaxBase.schoolName)}</div>
    </article>
  `;

  schoolRankings.innerHTML = schoolRows.slice(0, 8).map((row, index) => `
    <div class="global-league-row ${index === 0 ? "is-leading" : ""}" style="--score-width: ${Math.max(8, Math.round((row.competitiveScore / maxSchoolScore) * 100))}%">
      <div class="global-league-rank">${String(index + 1).padStart(2, "0")}</div>
      <div class="global-league-main">
        <strong>${escapeHtml(row.schoolName)}</strong>
        <div class="global-score-track" aria-hidden="true"><span></span></div>
        <div class="global-league-details">
          <span>${row.studentCount} students</span>
          <span>${formatCurrency(row.earnings)} earnings</span>
          <span>${row.readiness}% readiness</span>
          <span>${formatCurrency(row.tax)} fund</span>
        </div>
      </div>
      <div class="global-league-score">
        <strong>${row.competitiveScore}</strong>
        <span>pts</span>
      </div>
    </div>
  `).join("");

  classRankings.innerHTML = classRows.slice(0, 6).map((row, index) => `
    <article class="module-card global-class-card ${index === 0 ? "spotlight" : ""}" style="--score-width: ${Math.max(8, Math.round((row.score / maxClassScore) * 100))}%">
      <div class="global-class-topline">
        <div class="kicker">#${index + 1} Class Rival</div>
        <span>${row.score} pts</span>
      </div>
      <h3>${escapeHtml(row.classCode || "No class code")}</h3>
      <p>${escapeHtml(row.schoolName)}</p>
      <div class="global-score-track" aria-hidden="true"><span></span></div>
      ${createProgressBar(row.readiness, index === 0 ? "green" : "")}
      <div class="section-title">
        <p>${row.readiness}% readiness</p>
        <p>${row.studentCount} students</p>
      </div>
      <div class="pill-row">
        <span class="pill">Earnings: ${formatCurrency(row.earnings)}</span>
        <span class="pill">Class fund: ${formatCurrency(row.tax)}</span>
        <span class="pill">Rounds: ${row.yearsPlayed}</span>
      </div>
    </article>
  `).join("");

  spotlights.innerHTML = [
    {
      title: "Readiness Cup",
      detail: `${highestReadiness.schoolName} has the strongest future-readiness average at ${highestReadiness.readiness}%.`
    },
    {
      title: "Momentum Cup",
      detail: `${bestAttendanceProxy.schoolName} has banked ${bestAttendanceProxy.yearsPlayed} total played rounds.`
    },
    {
      title: "Safety Net",
      detail: `${safestSchool.schoolName} leads average job security with ${safestSchool.jobSecurity}%.`
    },
    {
      title: "Economy Engine",
      detail: `${topSchool.schoolName} leads total salary earnings with ${formatCurrency(topSchool.earnings)} and net worth of ${formatCurrency(topSchool.netWorth)}.`
    }
  ].map(item => `
    <div class="global-spotlight-item">
      <span>${escapeHtml(item.title)}</span>
      <strong>${escapeHtml(item.detail)}</strong>
    </div>
  `).join("");
}

function renderTeacherInterventions(items) {
  const container = document.getElementById("teacher-interventions");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="timeline-item teacher-signal-item">
      <div class="timeline-header">
        ${item.logoPath ? `<img class="timeline-logo" src="${item.logoPath}" alt="${escapeHtml(item.logoLabel || item.title)} logo">` : ""}
        <strong>${escapeHtml(item.title)}</strong>
      </div>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderTeacherRosterActivity(items) {
  const container = document.getElementById("teacher-roster-activity");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No roster activity yet</strong><p>Once students log in and play, their activity will appear here.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item teacher-signal-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderTeacherEvidenceList(items) {
  const container = document.getElementById("teacher-evidence-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No evidence submitted yet</strong><p>Typed reflections and lock-in tasks will appear here after students complete them.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderTeacherESTResponseList(items) {
  const container = document.getElementById("teacher-est-response-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No EST responses yet</strong><p>Boss-round EST answers and other EST artifacts will appear here once students start submitting the EST module.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderTeacherTaskTimeList(items) {
  const container = document.getElementById("teacher-task-time-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No task timing yet</strong><p>Once students complete timed module stages, captured time-on-task will appear here by module and strand.</p></div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
}

function renderTeacherGlossaryGapList(data) {
  const container = document.getElementById("teacher-glossary-gap-list");
  if (!container) return;

  if (!data?.studentRows?.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No glossary results yet</strong><p>Glossary recall scores and term gaps will appear after students bank a Glossary Check run.</p></div>';
    return;
  }

  const gapCopy = data.gapRows.length
    ? data.gapRows.map(row => `${row.term} (${row.misses} gap${row.misses === 1 ? "" : "s"})`).join(" • ")
    : "No common term gaps yet.";

  container.innerHTML = [
    `<div class="timeline-item teacher-glossary-summary">
      <strong>Class glossary snapshot</strong>
      <p>${data.averageScore}% average recall score • ${data.totalTermsCorrect}/${data.totalTermsAttempted} terms correct • ${data.totalKeywordCorrect}/${data.totalTermsAttempted} keyword checks correct.</p>
      <div class="pill-row">
        ${data.gapRows.slice(0, 4).map(row => `<span class="pill">${escapeHtml(row.term)}: ${row.misses} gap${row.misses === 1 ? "" : "s"}</span>`).join("")}
      </div>
      <p class="footer-note">Reteach focus: ${escapeHtml(gapCopy)}</p>
    </div>`,
    ...data.studentRows.slice(0, 6).map(row => `
      <div class="timeline-item teacher-signal-item">
        <strong>${escapeHtml(row.studentName)} • ${row.scoreLabel}</strong>
        <p>${row.termCorrect}/${row.termTotal} terms correct • ${row.keywordCorrect}/${row.termTotal} keyword checks correct • ${row.durationLabel} • ${escapeHtml(row.gapText)}</p>
      </div>
    `)
  ].join("");
}

function getMatrixState(value) {
  const numeric = Number(value || 0);
  if (!numeric) return "nys";
  if (numeric < 40) return "low";
  if (numeric < 75) return "mid";
  return "high";
}

function renderMatrixProgress(value, caption = "complete") {
  const numeric = Math.round(Number(value || 0));
  const state = getMatrixState(numeric);
  return `
    <div class="teacher-matrix-result teacher-matrix-result--${state}">
      <strong>${numeric ? `${numeric}%` : "NYS"}</strong>
      <span>${escapeHtml(caption)}</span>
    </div>
  `;
}

function renderMatrixText(primary, caption = "", state = "neutral") {
  return `
    <div class="teacher-matrix-result teacher-matrix-result--${state}">
      <strong>${escapeHtml(primary || "NYS")}</strong>
      ${caption ? `<span>${escapeHtml(caption)}</span>` : ""}
    </div>
  `;
}

function getTeacherResponseMatrixReviewStatus(status) {
  const normalised = normaliseReviewStatus(status || "pending_review");
  if (normalised === "approved") {
    return {
      label: "Approved",
      className: "teacher-matrix-code--high",
      note: "In anonymous pool"
    };
  }
  if (normalised === "rejected") {
    return {
      label: "Rejected",
      className: "teacher-matrix-code--nys",
      note: "Not in pool"
    };
  }
  return {
    label: "Pending approval",
    className: "teacher-matrix-code--mid",
    note: "Teacher action needed"
  };
}

function getTeacherMatrixStudentKey(student) {
  return String(student?.id || student?.studentId || student?.display_name || student?.username || student?.name || "").toLowerCase();
}

function renderTeacherLongAnswerComparison(rows, students = []) {
  const container = document.getElementById("teacher-long-answer-compare-list");
  if (!container) return;

  const fallbackStudents = rows.map(row => ({
    id: row.studentId,
    display_name: row.studentName,
    username: row.studentName
  }));
  const matrixStudents = (students.length ? students : fallbackStudents)
    .map(student => ({
      key: getTeacherMatrixStudentKey(student),
      name: student.display_name || student.username || student.name || "Student",
      meta: student.username && student.username !== student.display_name ? student.username : ""
    }))
    .filter(student => student.key);

  if (!matrixStudents.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No students to compare yet</strong><p>Once students are attached to this class, written-response tracking will appear here.</p></div>';
    return;
  }

  const columnMap = new Map();
  rows.forEach(row => {
    const key = row.columnKey || row.prompt || row.meta || "written-response";
    const existing = columnMap.get(key);
    const createdAt = parseTime(row.createdAt);
    if (!existing) {
      columnMap.set(key, {
        key,
        label: row.taskLabel || "Written response",
        sublabel: row.moduleLabel || "Evidence",
        prompt: row.prompt || "Written response task",
        latest: createdAt,
        count: 1
      });
      return;
    }
    existing.count += 1;
    existing.latest = Math.max(existing.latest, createdAt);
  });

  const skeletonColumns = [
    { key: "est-written-response", label: "EST response", sublabel: "Approval skeleton", prompt: "EST-style extended response" },
    { key: "megatrends-reflection", label: "Megatrends reflection", sublabel: "Approval skeleton", prompt: "Megatrends written reflection" },
    { key: "lifelong-reflection", label: "Lifelong reflection", sublabel: "Approval skeleton", prompt: "Lifelong Learning written reflection" }
  ];
  const columns = (columnMap.size ? [...columnMap.values()].sort((a, b) => b.latest - a.latest).slice(0, 5) : skeletonColumns);
  const responseMap = new Map();
  rows.forEach(row => {
    const studentKeys = [row.studentId, row.studentName].filter(Boolean).map(value => String(value).toLowerCase());
    const columnKey = row.columnKey || row.prompt || row.meta || "written-response";
    studentKeys.forEach(studentKey => {
      const mapKey = `${studentKey}::${columnKey}`;
      const existing = responseMap.get(mapKey);
      if (!existing || parseTime(row.createdAt) > parseTime(existing.createdAt)) responseMap.set(mapKey, row);
    });
  });

  container.innerHTML = `
    <div class="teacher-matrix-scroll" role="region" aria-label="Long answer comparison table" tabindex="0">
      <table class="teacher-matrix teacher-response-matrix">
        <thead>
          <tr>
            <th scope="col" class="teacher-matrix-student-col">Student</th>
            ${columns.map(column => `
              <th scope="col">
                <span>${escapeHtml(column.label)}</span>
                <small>${escapeHtml(column.sublabel)}${column.count ? ` • ${column.count} submitted` : ""}</small>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${matrixStudents.map(student => `
            <tr>
              <th scope="row" class="teacher-matrix-student-col">
                <strong>${escapeHtml(student.name)}</strong>
                ${student.meta ? `<small>${escapeHtml(student.meta)}</small>` : ""}
              </th>
              ${columns.map(column => {
                const response = responseMap.get(`${student.key}::${column.key}`);
                if (!response) {
                  return `
                    <td>
                      <div class="teacher-response-cell teacher-response-cell--empty">
                        <div class="teacher-response-status">
                          <span class="teacher-matrix-code teacher-matrix-code--nys">NYS</span>
                          <span>Awaiting submission</span>
                        </div>
                        <p>Approval workflow, model answer, and peer comparison controls will attach here.</p>
                      </div>
                    </td>
                  `;
                }
                const reviewStatus = getTeacherResponseMatrixReviewStatus(response.reviewStatus);
                return `
                  <td>
                    <div class="teacher-response-cell">
                      <div class="teacher-response-status">
                        <span class="teacher-matrix-code ${reviewStatus.className}">${escapeHtml(reviewStatus.label)}</span>
                        <span>${escapeHtml(response.scoreLabel)} • ${response.wordCount} words • ${escapeHtml(reviewStatus.note)}</span>
                      </div>
                      <p class="teacher-response-prompt">${escapeHtml(response.prompt || column.prompt)}</p>
                      <div class="answer-response">${escapeHtml(response.response)}</div>
                      <p class="teacher-response-feedback">${escapeHtml(response.feedback || "Suggested feedback will appear here.")}</p>
                    </div>
                  </td>
                `;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function getResponseReviewFlags(row) {
  if (Array.isArray(row?.flags)) return row.flags.filter(Boolean);
  if (typeof row?.flags === "string") {
    return row.flags.replace(/[{}"]/g, "").split(",").map(flag => flag.trim()).filter(Boolean);
  }
  return [];
}

function getResponseReviewFlagLabel(flag) {
  const labels = {
    possible_email: "Possible email",
    possible_phone: "Possible phone",
    possible_url: "Possible URL",
    possible_handle: "Possible handle",
    possible_profanity: "Language check",
    possible_student_name: "Possible name",
    possible_context_identifier: "Context clue",
    possible_workplace_identifier: "Workplace clue",
    possible_location: "Location clue",
    too_short: "Very short"
  };
  return labels[flag] || flag.replaceAll("_", " ");
}

function getRejectionReasonFromNote(note = "") {
  const value = String(note || "");
  if (isQuietReviewRejection(value)) return "";
  return RESPONSE_REJECTION_REASONS.find(reason => value === reason || value.startsWith(`${reason}:`)) || "";
}

function getRejectionDetailsFromNote(note = "") {
  const value = String(note || "");
  if (isQuietReviewRejection(value)) {
    return value.replace(QUIET_REJECTION_NOTE_PREFIX, "").replace(/^:\s*/, "").trim();
  }
  const reason = getRejectionReasonFromNote(value);
  return reason ? value.replace(reason, "").replace(/^:\s*/, "").trim() : value;
}

function isQuietReviewRejection(rowOrNote) {
  const note = typeof rowOrNote === "string" ? rowOrNote : rowOrNote?.reviewer_note;
  return String(note || "").trim().startsWith(QUIET_REJECTION_NOTE_PREFIX);
}

function buildQuietRejectionNote(details = "") {
  const cleanDetails = String(details || "").trim();
  return cleanDetails ? `${QUIET_REJECTION_NOTE_PREFIX}: ${cleanDetails}` : QUIET_REJECTION_NOTE_PREFIX;
}

function buildReviewerNote(reviewStatus, reason = "", details = "") {
  const cleanReason = String(reason || "").trim();
  const cleanDetails = String(details || "").trim();
  if (reviewStatus === "rejected" && cleanReason) {
    return cleanDetails ? `${cleanReason}: ${cleanDetails}` : cleanReason;
  }
  return cleanDetails;
}

function stripCapabilityTagMetadata(value = "") {
  return String(value || "")
    .split(/\n+/)
    .filter(line => !/^\s*(?:Tagged skills|Capability tags|Teacher tags|Teacher flagged skills):/i.test(line))
    .join("\n")
    .trim();
}

function buildCapabilityReviewerNote(note = "", capabilityIds = []) {
  const cleanNote = stripCapabilityTagMetadata(note);
  const tagText = capabilityIds.length
    ? capabilityIds.map(skillId => getSkillCategoryTitle(skillId)).join(", ")
    : "None";
  return [cleanNote, `Teacher tags: ${tagText}`].filter(Boolean).join("\n");
}

function renderTeacherResponseReviewInbox(rows = []) {
  const container = document.getElementById("teacher-response-review-list");
  if (!container) return;

  const sortedRows = [...rows].sort((a, b) => {
    const statusWeight = status => status === "pending_review" ? 0 : status === "approved" ? 1 : 2;
    return statusWeight(a.status) - statusWeight(b.status) || parseTime(b.created_at) - parseTime(a.created_at);
  });
  const activeFilter = getTeacherReviewFilter("responseReviews");
  const visibleRows = filterTeacherReviewItems(sortedRows, "responseReviews", row => row.status);

  if (!sortedRows.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No written responses waiting for review</strong><p>Student-written CORE topic responses, BOSS comparison notes, scaffold drafts, and final answers will appear here for teacher action.</p></div>';
    return;
  }

  const responseCards = visibleRows.slice(0, 30).map(row => {
    const flags = getResponseReviewFlags(row);
    const studentName = row.students?.display_name || row.students?.username || "Student";
    const classLabel = row.classes?.class_code || row.classes?.name || "Class";
    const approvedText = row.approved_response_text || row.raw_response_text || "";
    const checkOnly = isTeacherCheckOnlyReview(row);
    const isStarReview = row.evidence_type === "employability-star";
    const selectedCapabilityIds = isStarReview
      ? inferCapabilityIdsFromEvidence(row, employabilitySkillCategoriesCache)
      : [];
    const quietlyRejected = row.status === "rejected" && isQuietReviewRejection(row);
    const selectedRejectionReason = getRejectionReasonFromNote(row.reviewer_note || "");
    const reviewerNoteDetails = stripCapabilityTagMetadata(getRejectionDetailsFromNote(row.reviewer_note || ""));
    const statusLabel = row.status === "pending_review"
      ? checkOnly ? "Pending check" : "Pending review"
      : row.status === "approved"
        ? checkOnly ? "Checked" : "Approved for pool"
        : quietlyRejected ? "Rejected quietly" : checkOnly ? "Feedback sent" : "Rejected";

    return `
      <article class="response-review-card" data-response-review-id="${row.id}" data-response-review-type="${escapeHtml(row.evidence_type || "")}">
        <div class="response-review-header">
          <div>
            <span class="eyebrow">${escapeHtml(getModuleLabel(getReviewModuleId(row)))} • ${escapeHtml(classLabel)}</span>
            <h3>${escapeHtml(row.task_label || "Written response")}</h3>
            <p>${escapeHtml(studentName)} • ${escapeHtml(formatDateTime(row.created_at))}</p>
          </div>
          <span class="teacher-matrix-code ${row.status === "approved" ? "teacher-matrix-code--high" : row.status === "rejected" ? "teacher-matrix-code--nys" : "teacher-matrix-code--mid"}">${escapeHtml(statusLabel)}</span>
        </div>
        <div class="response-review-flags">
          ${flags.length
            ? flags.map(flag => `<span class="pill">${escapeHtml(getResponseReviewFlagLabel(flag))}</span>`).join("")
            : '<span class="pill">No automatic flags</span>'}
        </div>
        ${row.flag_notes ? `<p class="footer-note">${escapeHtml(row.flag_notes)}</p>` : ""}
        <div class="response-review-prompt">
          <strong>Prompt</strong>
          <p>${escapeHtml(row.prompt_text || "Saved written response")}</p>
        </div>
        <div class="response-review-source">
          <strong>${checkOnly ? "Saved student check" : "Original student response"}</strong>
          <p>${escapeHtml(row.raw_response_text || "")}</p>
        </div>
        <div class="response-review-form">
          <label>${checkOnly ? "Teacher-readable checked record" : "Approved anonymous version"}</label>
          <textarea data-review-field="approvedText">${escapeHtml(approvedText)}</textarea>
          ${isStarReview ? `
            <div class="response-review-tags">
              <strong>Teacher capability tags</strong>
              <p>Confirm or adjust the student-selected tags before approving.</p>
              <div class="skill-star-builder-chip-row">
                ${employabilitySkillCategoriesCache.map(category => `
                  <label class="response-review-tag-chip">
                    <input type="checkbox" data-review-capability-tag="${escapeHtml(category.id)}" ${selectedCapabilityIds.includes(category.id) ? "checked" : ""}>
                    <span>${escapeHtml(category.title)}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          ` : ""}
          <label>Rejection reason</label>
          <select data-review-field="rejectionReason">
            <option value="">Choose only when rejecting...</option>
            ${RESPONSE_REJECTION_REASONS.map(reason => `<option value="${escapeHtml(reason)}" ${reason === selectedRejectionReason ? "selected" : ""}>${escapeHtml(reason)}</option>`).join("")}
          </select>
          <label>Teacher note</label>
          <input type="text" data-review-field="reviewerNote" value="${escapeHtml(reviewerNoteDetails)}" placeholder="Optional internal note">
        </div>
        <div class="module-actions">
          <button class="module-link" type="button" data-review-action="approve">${checkOnly ? "Mark Checked" : "Approve Edited Version"}</button>
          <button class="module-link button-danger" type="button" data-review-action="reject">${checkOnly ? "Return With Feedback" : "Reject From Pool"}</button>
          <button class="module-link button-danger" type="button" data-review-action="rejectQuiet">Reject - don't notify student</button>
        </div>
        <p class="store-request-status" data-review-status>
          <strong>Current status:</strong> ${escapeHtml(statusLabel)}${row.reviewed_at ? ` • Reviewed ${escapeHtml(formatDateTime(row.reviewed_at))}` : ""}
        </p>
      </article>
    `;
  }).join("");

  container.innerHTML = `
    ${renderTeacherReviewFilterControls("responseReviews", sortedRows, row => row.status, "Student submission status filter")}
    ${responseCards || renderTeacherReviewEmptyState(activeFilter, {
      new: {
        title: "No new responses waiting for review",
        body: "Approved and rejected responses are still available under Actioned or All."
      },
      actioned: {
        title: "No actioned responses yet",
        body: "Approved and rejected responses will appear here after review."
      },
      all: {
        title: "No written responses waiting for review",
        body: "Student-written CORE topic responses, BOSS comparison notes, scaffold drafts, and final answers will appear here for teacher action."
      }
    })}
  `;

  bindTeacherReviewFilterControls(container, "responseReviews", () => renderTeacherResponseReviewInbox(rows));

  container.querySelectorAll("[data-review-action]").forEach(button => {
    button.addEventListener("click", async event => {
      const action = event.currentTarget.dataset.reviewAction;
      const isQuietReject = action === "rejectQuiet";
      const card = event.currentTarget.closest("[data-response-review-id]");
      if (!card) return;

      const statusEl = card.querySelector("[data-review-status]");
      const approvedText = card.querySelector('[data-review-field="approvedText"]')?.value.trim() || "";
      const rejectionReason = card.querySelector('[data-review-field="rejectionReason"]')?.value.trim() || "";
      const reviewerNote = card.querySelector('[data-review-field="reviewerNote"]')?.value.trim() || "";
      const isStarReview = card.dataset.responseReviewType === "employability-star";
      const selectedCapabilityIds = [...card.querySelectorAll("[data-review-capability-tag]:checked")]
        .map(input => input.dataset.reviewCapabilityTag)
        .filter(Boolean);
      if (action === "approve" && !approvedText) {
        if (statusEl) statusEl.innerHTML = "<strong>Error:</strong> Add an approved version before approving.";
        return;
      }
      if (action === "approve" && isStarReview && !selectedCapabilityIds.length) {
        if (statusEl) statusEl.innerHTML = "<strong>Error:</strong> Select at least one capability tag before approving this STAR reflection.";
        return;
      }
      if (action === "reject" && !rejectionReason) {
        if (statusEl) statusEl.innerHTML = "<strong>Error:</strong> Choose a rejection reason before rejecting.";
        return;
      }

      if (statusEl) statusEl.innerHTML = "<strong>Updating...</strong>";
      try {
        const nextStatus = action === "approve" ? "approved" : "rejected";
        const nextReviewerNote = isStarReview
          ? buildCapabilityReviewerNote(
            isQuietReject ? buildQuietRejectionNote(reviewerNote) : buildReviewerNote(nextStatus, rejectionReason, reviewerNote),
            selectedCapabilityIds
          )
          : isQuietReject ? buildQuietRejectionNote(reviewerNote) : buildReviewerNote(nextStatus, rejectionReason, reviewerNote);
        const updatedReview = await updateStudentResponseReview(card.dataset.responseReviewId, {
          status: nextStatus,
          approvedText,
          reviewerNote: nextReviewerNote,
          notifyStudent: !isQuietReject
        });
        const updatedRows = rows.map(row => row.id === card.dataset.responseReviewId ? { ...row, ...updatedReview } : row);
        renderTeacherResponseReviewInbox(updatedRows);
        initDashboards().catch(error => {
          console.error("Teacher dashboard refresh failed after review update", error);
        });
      } catch (error) {
        if (statusEl) statusEl.innerHTML = `<strong>Error:</strong> ${escapeHtml(error.message || "Could not update response review.")}`;
      }
    });
  });
}

async function updateStudentResponseReview(reviewId, options = {}) {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) throw new Error("Supabase is not available.");
  const context = getActiveTeacherContext();
  const isApproved = options.status === "approved";
  const payload = {
    status: options.status,
    approved_response_text: isApproved ? options.approvedText : null,
    reviewer_note: options.reviewerNote || null,
    reviewed_by_teacher_id: context.teacher?.id || null,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("student_response_reviews")
    .update(payload)
    .eq("id", reviewId)
    .select("id, source_evidence_id, status, approved_response_text, reviewer_note, reviewed_at, updated_at")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No review row was updated. Refresh the dashboard and try again.");

  if (data?.source_evidence_id && options.notifyStudent === false) {
    const evidenceResult = await supabase
      .from("assessment_evidence")
      .update({ teacher_feedback: null })
      .eq("id", data.source_evidence_id);

    if (evidenceResult.error) {
      console.warn("Assessment evidence feedback mirror could not be cleared:", evidenceResult.error);
    }
    return data;
  }

  if (data?.source_evidence_id) {
    const feedbackLines = [
      `Teacher review: ${isApproved ? "checked/approved" : "returned for revision"}`,
      options.reviewerNote ? `Teacher note: ${options.reviewerNote}` : "",
      isApproved && options.approvedText ? `Checked version: ${options.approvedText}` : ""
    ].filter(Boolean).join("\n");

    const evidenceResult = await supabase
      .from("assessment_evidence")
      .update({ teacher_feedback: feedbackLines })
      .eq("id", data.source_evidence_id);

    if (evidenceResult.error) {
      console.warn("Assessment evidence feedback mirror could not be updated:", evidenceResult.error);
    }
  }
  return data;
}

function renderTeacherFeedbackReviewInbox(items = []) {
  const container = document.getElementById("teacher-feedback-review-list");
  if (!container) return;

  const sortedItems = [...items].sort((a, b) => {
    const statusWeight = status => normaliseReviewStatus(status) === "pending_review" ? 0 : 1;
    return statusWeight(a.status) - statusWeight(b.status) || parseTime(b.createdAt) - parseTime(a.createdAt);
  });
  const activeFilter = getTeacherReviewFilter("feedbackReviews");
  const visibleItems = filterTeacherReviewItems(sortedItems, "feedbackReviews", item => item.status);

  if (!sortedItems.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No feedback waiting for review</strong><p>Feedback button reports and other site feedback will appear here for teacher checking.</p></div>';
    return;
  }

  const feedbackCards = visibleItems.slice(0, 40).map(item => {
    const flags = normaliseFlagList(item.flags);
    const status = normaliseReviewStatus(item.status);
    const statusLabel = getReviewStatusLabel(status, "Checked");
    const statusClass = status === "checked"
      ? "teacher-matrix-code--high"
      : status === "dismissed" || status === "rejected"
        ? "teacher-matrix-code--nys"
        : "teacher-matrix-code--mid";

    return `
      <article class="response-review-card feedback-review-card" data-feedback-review-id="${item.id}">
        <div class="response-review-header">
          <div>
            <span class="eyebrow">${escapeHtml(getTeacherFeedbackTypeLabel(item.feedbackType))} • ${escapeHtml(item.actorRole || "unknown")}</span>
            <h3>${escapeHtml(item.displayName || item.loginName || "Unknown sender")}</h3>
            <p>${escapeHtml(item.pagePath || "Page not recorded")} • ${escapeHtml(formatDateTime(item.createdAt))}</p>
          </div>
          <span class="teacher-matrix-code ${statusClass}">${escapeHtml(statusLabel)}</span>
        </div>
        <div class="response-review-flags">
          ${flags.length
            ? flags.map(flag => `<span class="pill">${escapeHtml(getResponseReviewFlagLabel(flag))}</span>`).join("")
            : '<span class="pill">No automatic flags</span>'}
          ${item.schoolName ? `<span class="pill">School: ${escapeHtml(item.schoolName)}</span>` : ""}
          ${item.classCode ? `<span class="pill">Class: ${escapeHtml(item.classCode)}</span>` : ""}
        </div>
        ${item.flagNotes ? `<p class="footer-note">${escapeHtml(item.flagNotes)}</p>` : ""}
        <div class="response-review-source">
          <strong>Feedback text</strong>
          <p>${escapeHtml(item.text || "No message provided.")}</p>
        </div>
        <div class="response-review-form">
          <label>Teacher note</label>
          <input type="text" data-feedback-field="reviewerNote" value="${escapeHtml(item.reviewerNote || "")}" placeholder="Optional internal note">
        </div>
        <div class="module-actions">
          <button class="module-link" type="button" data-feedback-action="checked">Mark Checked</button>
          <button class="module-link button-danger" type="button" data-feedback-action="dismissed">Dismiss</button>
        </div>
        <p class="store-request-status" data-feedback-status>
          <strong>Current status:</strong> ${escapeHtml(statusLabel)}${item.reviewedAt ? ` • Reviewed ${escapeHtml(formatDateTime(item.reviewedAt))}` : ""}
        </p>
      </article>
    `;
  }).join("");

  container.innerHTML = `
    ${renderTeacherReviewFilterControls("feedbackReviews", sortedItems, item => item.status, "Feedback review status filter")}
    ${feedbackCards || renderTeacherReviewEmptyState(activeFilter, {
      new: {
        title: "No new feedback waiting for review",
        body: "Checked and dismissed feedback is still available under Actioned or All."
      },
      actioned: {
        title: "No actioned feedback yet",
        body: "Checked and dismissed feedback will appear here after review."
      },
      all: {
        title: "No feedback waiting for review",
        body: "Feedback button reports and other site feedback will appear here for teacher checking."
      }
    })}
  `;

  bindTeacherReviewFilterControls(container, "feedbackReviews", () => renderTeacherFeedbackReviewInbox(items));

  container.querySelectorAll("[data-feedback-action]").forEach(button => {
    button.addEventListener("click", async event => {
      const status = event.currentTarget.dataset.feedbackAction;
      const card = event.currentTarget.closest("[data-feedback-review-id]");
      if (!card) return;
      const item = items.find(entry => entry.id === card.dataset.feedbackReviewId);
      if (!item) return;

      const statusEl = card.querySelector("[data-feedback-status]");
      const reviewerNote = card.querySelector('[data-feedback-field="reviewerNote"]')?.value.trim() || "";
      if (statusEl) statusEl.innerHTML = "<strong>Updating...</strong>";

      try {
        await updateTeacherFeedbackReview(item, {
          status,
          reviewerNote
        });
        await initDashboards();
      } catch (error) {
        if (statusEl) statusEl.innerHTML = `<strong>Error:</strong> ${escapeHtml(error.message || "Could not update feedback review.")}`;
      }
    });
  });
}

async function updateTeacherFeedbackReview(item, options = {}) {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) throw new Error("Supabase is not available.");
  const context = getActiveTeacherContext();
  const nextPayload = {
    ...(item.payload || {}),
    kind: "teacher-feedback",
    status: normaliseReviewStatus(options.status),
    feedback_type: item.feedbackType || item.payload?.feedback_type || "feedback",
    feedback_text: item.text || item.payload?.feedback_text || "",
    page_path: item.pagePath || item.payload?.page_path || "",
    actor_role: item.actorRole || item.payload?.actor_role || "anonymous",
    login_name: item.loginName || item.payload?.login_name || "unknown",
    school_id: item.schoolId || item.payload?.school_id || null,
    school_name: item.schoolName || item.payload?.school_name || "",
    class_id: item.classId || item.payload?.class_id || null,
    class_code: item.classCode || item.payload?.class_code || "",
    reviewer_note: options.reviewerNote || null,
    reviewed_by_teacher_id: context.teacher?.id || null,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("feedback_reports")
    .update({
      message: JSON.stringify(nextPayload)
    })
    .eq("id", item.id);

  if (error) throw error;
}

function getStudentCompareModuleValue(item, moduleId, metric) {
  const keyMap = {
    "megatrends": { completion: "megatrendsCompletion", mastery: "megatrendsMastery" },
    "lifelong-learning": { completion: "lifelongCompletion", mastery: "lifelongMastery" },
    "est-prep": { completion: "estCompletion", mastery: "estMastery" },
    "initiative": { completion: "initiativeCompletion", mastery: "initiativeMastery" },
    "employability-skills": { completion: "employabilityCompletion", mastery: "employabilityMastery" }
  };
  return item?.[keyMap[moduleId]?.[metric]] || 0;
}

function renderTeacherStudentCompareList(items, visibleModuleIds = DASHBOARD_MODULES.map(module => module.id)) {
  const container = document.getElementById("teacher-student-compare-list");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No student comparison data yet</strong><p>Once students have progress or evidence in the selected module focus, this area will compare them.</p></div>';
    return;
  }

  const moduleColumns = visibleModuleIds
    .map(moduleId => getModuleById(moduleId))
    .filter(Boolean);

  container.innerHTML = `
    <div class="teacher-matrix-scroll" role="region" aria-label="Student progress comparison table" tabindex="0">
      <table class="teacher-matrix teacher-progress-matrix">
        <thead>
          <tr>
            <th scope="col" class="teacher-matrix-student-col">Student</th>
            <th scope="col">Engagement signal</th>
            ${moduleColumns.map(module => `
              <th scope="col">${escapeHtml(module.shortTitle)} complete</th>
              <th scope="col">${escapeHtml(module.shortTitle)} mastery</th>
            `).join("")}
            <th scope="col">Task time</th>
            <th scope="col">Progress score</th>
            <th scope="col">Strongest skill</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
    const progressScore = Number(item.progressScore ?? average(moduleColumns.flatMap(module => [
      Number(getStudentCompareModuleValue(item, module.id, "completion") || 0),
      Number(getStudentCompareModuleValue(item, module.id, "mastery") || 0)
    ])));
            const engagementState = item.status === "On track" ? "high" : item.status === "Building" ? "mid" : "nys";
            return `
              <tr>
                <th scope="row" class="teacher-matrix-student-col">
                  <strong>${escapeHtml(item.name)}</strong>
                  <small>${escapeHtml(item.meta)}</small>
	                </th>
	                <td>${renderMatrixText(item.status, item.engagementCaption || "Login + progress signal", engagementState)}</td>
	                ${moduleColumns.map(module => `
	                  <td>${renderMatrixProgress(getStudentCompareModuleValue(item, module.id, "completion"), "complete")}</td>
	                  <td>${renderMatrixProgress(getStudentCompareModuleValue(item, module.id, "mastery"), "mastery")}</td>
	                `).join("")}
	                <td>${renderMatrixText(item.averageTaskTimeLabel || "NYS", "captured time", item.averageTaskTimeSeconds ? "mid" : "nys")}</td>
	                <td>${renderMatrixProgress(progressScore, "progress score")}</td>
	                <td>${renderMatrixText(item.strongestSkillTitle || "NYS", "current signal", item.strongestSkillTitle ? "neutral" : "nys")}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function buildDonutGradient(segments) {
  const total = segments.reduce((sum, item) => sum + Number(item.value || 0), 0);
  if (!total) return "conic-gradient(rgba(136, 173, 255, 0.18) 0 100%)";
  let cursor = 0;
  const stops = segments.map(item => {
    const start = cursor;
    const end = cursor + (Number(item.value || 0) / total) * 100;
    cursor = end;
    return `${item.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function renderTeacherChartBars(rows) {
  const maxValue = Math.max(1, ...rows.map(row => Number(row.value || 0)));
  return rows.map(row => {
    const width = Math.max(4, Math.round((Number(row.value || 0) / maxValue) * 100));
    return `
      <div class="teacher-chart-row">
        <span>${escapeHtml(row.label)}</span>
        <div class="teacher-chart-track">
          <div class="teacher-chart-fill ${row.variant || ""}" style="width: ${width}%"></div>
        </div>
        <strong>${escapeHtml(row.valueLabel)}</strong>
      </div>
    `;
  }).join("");
}

function extractAnswerStatsFromEvidence(entry) {
  const payload = entry?.payload || {};
  const stats = { correct: 0, total: 0 };
  const addCorrectRows = rows => {
    if (!Array.isArray(rows)) return;
    rows.forEach(item => {
      if (!item || typeof item !== "object") return;
      if (typeof item.correct === "boolean") {
        stats.total += 1;
        if (item.correct) stats.correct += 1;
        return;
      }
      if (typeof item.termCorrect === "boolean") {
        stats.total += 1;
        if (item.termCorrect) stats.correct += 1;
      }
      if (typeof item.keywordCorrect === "boolean") {
        stats.total += 1;
        if (item.keywordCorrect) stats.correct += 1;
      }
    });
  };

  addCorrectRows(payload.items);
  addCorrectRows(payload.selected_options);
  addCorrectRows(payload.final_round_results);
  if (Array.isArray(payload.topic_groups)) {
    payload.topic_groups.forEach(group => {
      addCorrectRows(group.items);
      if (typeof group.training?.correct === "number" && typeof group.training?.total === "number") {
        stats.correct += Number(group.training.correct || 0);
        stats.total += Number(group.training.total || 0);
      }
    });
  }
  if (Array.isArray(payload.decoder_results)) {
    payload.decoder_results.forEach(result => {
      stats.correct += Number(result.correct_count || 0);
      stats.total += Number(result.total_parts || 0);
    });
  }
  if (typeof payload.training?.correct === "number" && typeof payload.training?.total === "number") {
    stats.correct += Number(payload.training.correct || 0);
    stats.total += Number(payload.training.total || 0);
  }

  return stats;
}

function getEvidenceWrittenResponse(entry) {
  const payload = entry?.payload || {};
  const row = entry?.row || {};
  return stripStarEvidenceMetadata(extractLongResponseText(
    payload.written_response
    || payload.built_response
    || payload.response_text
    || row.raw_response_text
    || row.approved_response_text
    || row.response_text
    || ""
  ));
}

function getReviewModuleId(row) {
  if (row?.evidence_type === "employability-star") return EMPLOYABILITY_PORTFOLIO_MODULE_ID;
  return row?.module_id
    || row?.module_slug
    || "lifelong-learning";
}

function buildLearningProfileModuleCell(student, module, data) {
  const moduleId = module.id;
  const progressRows = data.moduleProgressRows || [];
  const evidenceRows = data.parsedEvidenceRows || [];
  const reviewRows = data.reviewRows || [];
  const progress = progressRows.find(row => row.student_id === student.id && (row.module_id || row.module_slug) === moduleId) || null;
  const moduleEvidence = evidenceRows
    .filter(entry => entry.row?.student_id === student.id && getEvidenceModuleId(entry.row, entry.payload) === moduleId)
    .sort((a, b) => parseTime(b.row?.created_at) - parseTime(a.row?.created_at));
  const moduleReviews = reviewRows
    .filter(row => row.student_id === student.id && getReviewModuleId(row) === moduleId)
    .sort((a, b) => parseTime(b.created_at) - parseTime(a.created_at));
  const totalSeconds = moduleEvidence.reduce((sum, entry) => sum + Number(entry.payload?.duration_seconds || 0), 0);
  const answerStats = moduleEvidence.reduce((acc, entry) => {
    const next = extractAnswerStatsFromEvidence(entry);
    acc.correct += next.correct;
    acc.total += next.total;
    return acc;
  }, { correct: 0, total: 0 });
  const attempts = Number(progress?.attempts || 0);
  const resetReplaySignals = moduleEvidence.filter(entry => {
    const payload = entry.payload || {};
    return /\b(reset|replay|restart)\b/i.test([
      payload.task_name,
      payload.checkpoint,
      payload.evidence_type,
      entry.row?.evidence_type,
      entry.row?.prompt
    ].filter(Boolean).join(" "));
  }).length;
  const responses = [
    ...moduleEvidence.map(entry => ({
      id: entry.row?.id || `${entry.row?.student_id}-${entry.row?.created_at}`,
      label: getEvidenceTaskLabel(entry.row, entry.payload),
      prompt: getEvidencePromptText(entry.row, entry.payload),
      response: getEvidenceWrittenResponse(entry),
      score: getEvidenceScorePercent(entry.row, entry.payload),
      createdAt: entry.row?.created_at
    })),
    ...moduleReviews.map(row => ({
      id: row.id,
      label: row.task_label || row.evidence_type || "Teacher review",
      prompt: row.prompt_text || "Teacher-reviewed response",
      response: stripStarEvidenceMetadata(row.status === "approved" && row.approved_response_text ? row.approved_response_text : row.raw_response_text),
      score: null,
      createdAt: row.created_at
    }))
  ]
    .filter(item => String(item.response || "").trim().length >= 8)
    .sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));
  const completion = Number(progress?.completion_percent || 0);
  const mastery = Number(progress?.mastery_percent || 0);

  return `
    <div class="learning-profile-cell ${moduleEvidence.length || moduleReviews.length || progress ? "" : "learning-profile-cell--empty"}">
      <div class="learning-profile-cell-grid">
        <div>
          <span>Progress</span>
          <strong>${completion || mastery ? `${completion}% complete` : "NYS"}</strong>
          <small>${mastery ? `${mastery}% mastery` : "No mastery yet"}</small>
        </div>
        <div>
          <span>Logged time</span>
          <strong>${escapeHtml(formatDurationSeconds(totalSeconds, "NYS"))}</strong>
          <small>captured task time</small>
        </div>
        <div>
          <span>Stats</span>
          <strong>${answerStats.total ? `${answerStats.correct}/${answerStats.total}` : "NYS"}</strong>
          <small>answers correct</small>
        </div>
        <div>
          <span>Attempts</span>
          <strong>${attempts || resetReplaySignals || "NYS"}</strong>
          <small>attempts/replays</small>
        </div>
      </div>
      <div class="learning-profile-responses">
        <span>Written responses</span>
        ${responses.length ? responses.map(item => `
          <article class="learning-response-entry">
            <strong>${escapeHtml(item.label)}</strong>
            <small>${escapeHtml(formatDateTime(item.createdAt))}${typeof item.score === "number" ? ` - ${item.score}%` : ""}</small>
            ${item.prompt ? `<p class="learning-response-prompt">${escapeHtml(makeSnippet(item.prompt, 96))}</p>` : ""}
            <p>${escapeHtml(item.response)}</p>
          </article>
        `).join("") : '<p class="learning-empty-note">No written responses in this module yet.</p>'}
      </div>
    </div>
  `;
}

function renderTeacherStudentProfile(data) {
  const container = document.getElementById("teacher-student-profile");
  if (!container) return;
  const students = data.selectedStudent ? [data.selectedStudent] : (data.students || []);

  if (!students.length) {
    container.innerHTML = `
      <div class="timeline-item">
        <strong>No student profiles yet</strong>
        <p>Create or sync student records first, then this panel will show the student-by-module profile matrix.</p>
      </div>
    `;
    return;
  }

  const moduleColumns = (data.visibleModuleIds || DASHBOARD_MODULES.map(module => module.id))
    .map(moduleId => getModuleById(moduleId))
    .filter(Boolean);
  if (!moduleColumns.length) {
    container.innerHTML = `
      <div class="timeline-item">
        <strong>No modules in the current filter</strong>
        <p>Change the module focus filter to Active, Cumulative, or a specific module to see learning profile columns.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="teacher-matrix-scroll learning-profile-matrix-scroll" role="region" aria-label="Student learning profile matrix" tabindex="0">
      <table class="teacher-matrix learning-profile-matrix">
        <thead>
          <tr>
            <th scope="col" class="teacher-matrix-student-col">Student</th>
            ${moduleColumns.map(module => `
              <th scope="col">
                <span>${escapeHtml(module.title)}</span>
                <small>time, stats, attempts, responses</small>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${students.map(student => {
            const compare = data.studentCompareRows?.find(row => row.studentId === student.id);
            const engagement = data.engagementRows?.find(row => row.studentId === student.id);
            const status = compare?.status || engagement?.status || "Profile";
            return `
              <tr>
                <th scope="row" class="teacher-matrix-student-col">
                  <strong>${escapeHtml(getStudentDisplayName(student))}</strong>
                  <small>${escapeHtml(compare?.meta || engagement?.detail || (student.last_login_at ? `Last login ${formatDateTime(student.last_login_at)}` : "No login recorded"))}</small>
                  <span class="teacher-matrix-code ${status === "On track" || status === "Active" ? "teacher-matrix-code--high" : status === "Not started" || status === "No interaction" ? "teacher-matrix-code--nys" : "teacher-matrix-code--mid"}">${escapeHtml(status)}</span>
                </th>
                ${moduleColumns.map(module => `<td>${buildLearningProfileModuleCell(student, module, data)}</td>`).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTeacherClassCharts(data) {
  const container = document.getElementById("teacher-class-chart-grid");
  if (!container) return;

  const statusCounts = data.engagementRows.reduce((acc, row) => {
    if (row.status === "No interaction") acc.noInteraction += 1;
    else if (row.status === "Needs support" || row.status === "Review evidence") acc.needsSupport += 1;
    else if (row.status === "Just started") acc.started += 1;
    else acc.active += 1;
    return acc;
  }, { active: 0, started: 0, needsSupport: 0, noInteraction: 0 });
  const engagementTotal = Object.values(statusCounts).reduce((sum, value) => sum + value, 0);
  const activeTotal = statusCounts.active + statusCounts.started;
  const engagementGradient = buildDonutGradient([
    { value: statusCounts.active, color: "#80ed99" },
    { value: statusCounts.started, color: "#ffd166" },
    { value: statusCounts.needsSupport, color: "#ff9770" },
    { value: statusCounts.noInteraction, color: "#ff7b72" }
  ]);
  const moduleBars = renderTeacherChartBars(data.moduleRows.map(row => ({
    label: row.label,
    value: row.completion,
    valueLabel: `${row.completion}%`,
    variant: row.variant
  })));
  const timeBars = data.timeRows.length
    ? renderTeacherChartBars(data.timeRows.map(row => ({
      label: row.label,
      value: row.seconds,
      valueLabel: formatDurationSeconds(row.seconds, "0m"),
      variant: row.variant
    })))
    : `<div class="teacher-chart-empty">No saved task time yet</div>`;
  const glossaryAttempted = data.glossary.totalTermsAttempted || 0;
  const glossaryCorrect = data.glossary.totalTermsCorrect || 0;
  const glossaryGap = Math.max(0, glossaryAttempted - glossaryCorrect);
  const glossaryGradient = buildDonutGradient([
    { value: glossaryCorrect, color: "#80ed99" },
    { value: glossaryGap, color: "#ff7b72" }
  ]);

  container.innerHTML = `
    <article class="teacher-chart-card">
      <div class="teacher-donut" style="--donut-bg: ${engagementGradient}">
        <span>${engagementTotal ? Math.round((activeTotal / engagementTotal) * 100) : 0}%</span>
      </div>
      <div>
        <div class="kicker">Engagement</div>
        <h3>Interaction split</h3>
        <p>${activeTotal} active or started • ${statusCounts.needsSupport} need support • ${statusCounts.noInteraction} no interaction.</p>
      </div>
    </article>
    <article class="teacher-chart-card teacher-chart-card-wide">
      <div>
        <div class="kicker">Modules</div>
        <h3>Completion by module</h3>
      </div>
      <div class="teacher-chart-bars">${moduleBars}</div>
    </article>
    <article class="teacher-chart-card teacher-chart-card-wide">
      <div>
        <div class="kicker">Captured Task Time</div>
        <h3>Saved time by section</h3>
      </div>
      <div class="teacher-chart-bars">${timeBars}</div>
    </article>
    <article class="teacher-chart-card">
      <div class="teacher-donut" style="--donut-bg: ${glossaryGradient}">
        <span>${glossaryAttempted ? Math.round((glossaryCorrect / glossaryAttempted) * 100) : 0}%</span>
      </div>
      <div>
        <div class="kicker">Glossary</div>
        <h3>Terms correct</h3>
        <p>${glossaryCorrect}/${glossaryAttempted || 0} final-round terms correct across captured glossary runs.</p>
      </div>
    </article>
  `;
}

function inferCapabilityIdsFromEvidence(entry, skillCategories = []) {
  const row = entry?.row || entry || {};
  const payload = entry?.payload || parseStructuredEvidence(row) || {};
  const resolveCapabilityIds = value => {
    const values = Array.isArray(value) ? value : [value];
    const matchedIds = [];
    values.filter(Boolean).forEach(item => {
      const text = String(item).toLowerCase();
      skillCategories.forEach(category => {
        if (
          text === category.id.toLowerCase()
          || text.includes(category.id.toLowerCase())
          || text.includes(category.title.toLowerCase())
        ) {
          matchedIds.push(category.id);
        }
      });
    });
    return [...new Set(matchedIds)];
  };
  const rawText = [
    payload.skill_id,
    payload.skillId,
    Array.isArray(payload.skillIds) ? payload.skillIds.join(" ") : "",
    payload.skill_title,
    payload.skillTitle,
    Array.isArray(payload.skillTitles) ? payload.skillTitles.join(" ") : "",
    payload.topic_group,
    payload.task_name,
    payload.prompt_text,
    payload.response_text,
    row.evidence_type,
    row.task_label,
    row.prompt_text,
    row.raw_response_text,
    row.approved_response_text,
    Array.isArray(row.flags) ? row.flags.join(" ") : row.flags,
    row.flag_notes,
    row.reviewer_note,
    row.prompt,
    row.response_text
  ].filter(Boolean).join("\n");
  const payloadSkillIds = resolveCapabilityIds([
    payload.skill_id,
    payload.skillId,
    payload.skillIds,
    payload.skill_title,
    payload.skillTitle,
    payload.skillTitles,
    payload.tagged_skills,
    payload.taggedSkills,
    payload.capability_tags,
    payload.capabilityTags,
    payload.teacher_tags,
    payload.teacherTags
  ].flat());
  const teacherTagText = [row.reviewer_note, row.flag_notes, row.approved_response_text]
    .filter(Boolean)
    .join("\n");
  const teacherTagLineMatches = [...teacherTagText.matchAll(/(?:^|\n)\s*(?:Teacher tags|Teacher flagged skills):\s*([^\n]+)/gi)];
  if (teacherTagLineMatches.length) {
    const teacherTagValues = teacherTagLineMatches.map(match => match[1]);
    if (teacherTagValues.some(value => /^\s*(?:none|no tags?)\s*$/i.test(String(value || "")))) return [];
    return resolveCapabilityIds(teacherTagValues);
  }
  if (payloadSkillIds.length) return payloadSkillIds;
  const tagLineMatches = [...rawText.matchAll(/(?:^|\n)\s*(?:Tagged skills|Capability tags|Teacher tags|Teacher flagged skills):\s*([^\n]+)/gi)];
  const tagLineIds = resolveCapabilityIds(tagLineMatches.map(match => match[1]));
  if (tagLineIds.length) return tagLineIds;
  const key = String(row.task_key || "");
  const colonStarSkillMatch = key.match(/^employability-star:([^:]+):/);
  if (colonStarSkillMatch?.[1] && skillCategories.some(category => category.id === colonStarSkillMatch[1])) {
    return [colonStarSkillMatch[1]];
  }
  const legacyStarSkill = skillCategories.find(category => key.includes(`employability-star-${category.id}-`));
  if (legacyStarSkill) return [legacyStarSkill.id];
  return [];
}

function getCapabilityEvidenceQuality(text, score = null) {
  const wordCount = String(text || "").split(/\s+/).filter(Boolean).length;
  const markerCount = CAPABILITY_LANGUAGE_MARKERS.filter(marker => marker.pattern.test(text)).length;
  const scoreBoost = typeof score === "number" ? Math.round(score / 20) : 0;
  return Math.min(12, markerCount * 2 + Math.min(5, Math.floor(wordCount / 18)) + scoreBoost);
}

function getCapabilityProgressionLabel(entries = []) {
  const sorted = [...entries].sort((a, b) => parseTime(a.createdAt) - parseTime(b.createdAt));
  if (sorted.length < 2) return "Collect more journal evidence";
  const midpoint = Math.ceil(sorted.length / 2);
  const early = average(sorted.slice(0, midpoint).map(entry => entry.quality));
  const recent = average(sorted.slice(midpoint).map(entry => entry.quality));
  if (recent >= early + 2) return "Articulation is improving";
  if (recent >= early) return "Articulation is steady";
  return "Needs a fuller recent explanation";
}

function getCapabilityMarkerLabels(text) {
  return CAPABILITY_LANGUAGE_MARKERS
    .filter(marker => marker.pattern.test(text))
    .map(marker => marker.label);
}

function buildCapabilityEvidenceEntries(parsedEvidenceRows = [], reviewRows = [], skillCategories = []) {
  const assessmentEntries = parsedEvidenceRows
    .filter(entry => {
      const moduleId = getEvidenceModuleId(entry.row, entry.payload);
      return [EMPLOYABILITY_PORTFOLIO_MODULE_ID, LEGACY_STAR_MODULE_ID].includes(moduleId)
        && entry.row.evidence_type === "employability-star";
    })
    .map(entry => {
    const response = getEvidenceResponseText(entry.row, entry.payload);
    const experienceDate = formatDateInputValue(
      entry.payload?.experience_date
      || entry.payload?.experienceDate
      || extractStarExperienceDateFromText(response)
    );
    const score = getEvidenceScorePercent(entry.row, entry.payload);
    return {
      id: entry.row.id || `${entry.row.student_id}-${entry.row.created_at}`,
      studentId: entry.row.student_id || "",
      studentName: getEvidenceStudentName(entry.row),
      moduleId: getEvidenceModuleId(entry.row, entry.payload),
      moduleLabel: getModuleLabel(getEvidenceModuleId(entry.row, entry.payload)),
      taskLabel: getEvidenceTaskLabel(entry.row, entry.payload),
      prompt: getEvidencePromptText(entry.row, entry.payload),
      response,
      score,
      createdAt: experienceDate || entry.row.created_at,
      submittedAt: entry.row.created_at,
      experienceDate,
      capabilityIds: inferCapabilityIdsFromEvidence(entry, skillCategories)
    };
  });
  const reviewEntries = reviewRows
    .filter(row => row.evidence_type === "employability-star")
    .map(row => {
    const response = row.status === "approved" && row.approved_response_text
      ? row.approved_response_text
      : row.raw_response_text || "";
    const experienceDate = formatDateInputValue(extractStarExperienceDateFromText(row.raw_response_text || response));
    const moduleId = row.module_id || EMPLOYABILITY_PORTFOLIO_MODULE_ID;
    return {
      id: row.id,
      studentId: row.student_id || "",
      studentName: row.students?.display_name || row.students?.username || "Student",
      moduleId,
      moduleLabel: getModuleLabel(moduleId),
      taskLabel: row.task_label || row.evidence_type || "Journal evidence",
      prompt: row.prompt_text || "Teacher-reviewed journal evidence",
      response,
      score: null,
      createdAt: experienceDate || row.created_at,
      submittedAt: row.created_at,
      experienceDate,
      reviewStatus: row.status,
      capabilityIds: inferCapabilityIdsFromEvidence(row, skillCategories)
    };
  });

  return [...assessmentEntries, ...reviewEntries]
    .map(entry => {
      const cleanResponse = stripStarEvidenceMetadata(extractLongResponseText(entry.response));
      return {
        ...entry,
        response: cleanResponse,
        wordCount: cleanResponse.split(/\s+/).filter(Boolean).length,
        quality: getCapabilityEvidenceQuality(cleanResponse, entry.score),
        markerLabels: getCapabilityMarkerLabels(cleanResponse)
      };
    })
    .filter(entry => entry.wordCount >= 8)
    .sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));
}

function renderTeacherCapabilityBoardEntry(entry) {
  const markerText = entry.markerLabels?.length
    ? entry.markerLabels.join(" | ")
    : "Reflection language still developing";
  return `
    <article class="capability-board-entry">
      <div class="capability-board-entry-top">
        <strong>${escapeHtml(entry.studentName)}</strong>
        <time>${escapeHtml(formatExperienceDate(entry.experienceDate || entry.createdAt))}</time>
      </div>
      <span>${escapeHtml(entry.taskLabel)} • ${escapeHtml(entry.moduleLabel)}</span>
      <p>${escapeHtml(makeSnippet(entry.response))}</p>
      <small>${escapeHtml(markerText)}</small>
    </article>
  `;
}

function studentMatchesCapabilityEntry(student, entry) {
  return entry.studentId
    ? entry.studentId === student.id
    : entry.studentName === getStudentDisplayName(student);
}

function renderCapabilityPortfolioCell(entries = [], category) {
  const categoryEntries = entries.filter(entry => entry.capabilityIds.includes(category.id));
  if (!categoryEntries.length) {
    return `
      <div class="portfolio-evidence-cell portfolio-evidence-cell--empty">
        <strong>No entries yet</strong>
        <span>No STAR reflections tagged to this capability yet.</span>
      </div>
    `;
  }

  return `
    <div class="portfolio-evidence-cell">
      <div class="portfolio-evidence-cell-summary">
        <strong>${categoryEntries.length} entr${categoryEntries.length === 1 ? "y" : "ies"}</strong>
        <span>${escapeHtml(getCapabilityProgressionLabel(categoryEntries))}</span>
      </div>
      <div class="portfolio-evidence-entry-list">
        ${categoryEntries.map(entry => `
          <article class="portfolio-evidence-entry">
            <div>
              <strong>${escapeHtml(entry.taskLabel || "Journal evidence")}</strong>
              <small>${escapeHtml(entry.moduleLabel)} - ${escapeHtml(formatExperienceDate(entry.experienceDate || entry.createdAt))}${typeof entry.score === "number" ? ` - ${entry.score}%` : ""}</small>
            </div>
            <p>${escapeHtml(entry.response)}</p>
            <div class="portfolio-evidence-tags">
              <span>${entry.wordCount} words</span>
              <span>quality ${entry.quality}/12</span>
              ${(entry.markerLabels || []).slice(0, 2).map(label => `<span>${escapeHtml(label)}</span>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderTeacherCapabilityPortfolio({ skillCategories = [], parsedEvidenceRows = [], reviewRows = [], students = [], selectedStudent = null, evidenceEntries = null }) {
  const container = document.getElementById("teacher-capability-portfolio");
  if (!container) return;

  const portfolioEvidenceEntries = Array.isArray(evidenceEntries)
    ? evidenceEntries
    : buildCapabilityEvidenceEntries(parsedEvidenceRows, reviewRows, skillCategories);
  const studentScope = selectedStudent ? [selectedStudent] : students;
  const scopedStudentIds = new Set(studentScope.map(student => student.id).filter(Boolean));
  const scopedEntries = selectedStudent
    ? portfolioEvidenceEntries.filter(entry => entry.studentId === selectedStudent.id)
    : portfolioEvidenceEntries.filter(entry => !scopedStudentIds.size || scopedStudentIds.has(entry.studentId));

  if (!studentScope.length) {
    container.innerHTML = `
      <div class="timeline-item">
        <strong>No students in this focus yet</strong>
        <p>Change the class or student status filters to choose which students appear in this portfolio matrix.</p>
      </div>
    `;
    return;
  }

  const portfolioStudents = studentScope.map(student => ({
    student,
    entries: scopedEntries.filter(entry => studentMatchesCapabilityEntry(student, entry))
  }));

  container.innerHTML = `
    <section class="capability-breakdown-panel capability-matrix-panel">
      <div class="section-title">
        <h3>Students x Capabilities</h3>
        <p>${scopedEntries.length} STAR reflection${scopedEntries.length === 1 ? "" : "s"} in this focus. Scroll inside a cell to review every entry for that student and capability.</p>
      </div>
      <div class="teacher-matrix-scroll capability-matrix-scroll" role="region" aria-label="Capability portfolio matrix" tabindex="0">
        <table class="teacher-matrix capability-evidence-matrix">
          <thead>
            <tr>
              <th scope="col" class="teacher-matrix-student-col">Student</th>
              ${skillCategories.map(category => `
                <th scope="col">
                  <span>${category.logoPath ? `<img class="capability-matrix-logo" src="${escapeHtml(category.logoPath)}" alt="">` : ""}${escapeHtml(category.title)}</span>
                  <small>scroll evidence entries</small>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${portfolioStudents.map(row => `
              <tr>
                <th scope="row" class="teacher-matrix-student-col">
                  <strong>${escapeHtml(getStudentDisplayName(row.student))}</strong>
                  <small>${row.entries.length} STAR reflection${row.entries.length === 1 ? "" : "s"}${row.student.last_login_at ? ` - last login ${escapeHtml(formatDateTime(row.student.last_login_at))}` : ""}</small>
                </th>
                ${skillCategories.map(category => `<td>${renderCapabilityPortfolioCell(row.entries, category)}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getSkillCategoryById(skillsData, skillId) {
  return skillsData.categories.find(category => category.id === skillId) || null;
}

function renderTeacherModuleHealth(items) {
  const container = document.getElementById("teacher-module-health");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <article class="module-card teacher-module-card ${item.spotlight ? "spotlight" : ""}" style="${item.imagePath ? `--module-image: url('${item.imagePath}');` : ""}">
      ${item.logoPath ? `<img class="teacher-module-logo" src="${item.logoPath}" alt="${escapeHtml(item.logoLabel || item.title)} logo">` : ""}
      <div class="kicker">${escapeHtml(item.status)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      ${createProgressBar(item.completion, item.variant)}
      <div class="section-title">
        <p>${item.completion}% completion</p>
        <p>${item.mastery}% class mastery</p>
      </div>
    </article>
  `).join("");
}

function renderStarRows(rows) {
  return rows.map(row => `
    <div class="skill-star-row">
      <span class="skill-star-marker">
        <strong>${escapeHtml(row.label)}</strong>
        <small>${escapeHtml(row.term)}</small>
      </span>
      <p>${escapeHtml(row.text)}</p>
    </div>
  `).join("");
}

function getStarRowsForEntry(entry = {}) {
  const rows = [
    { label: "S", term: "Situation", text: entry.responses?.situation || "" },
    { label: "T", term: "Task", text: entry.responses?.task || "" },
    { label: "A", term: "Actions", text: entry.responses?.actions || "" },
    { label: "R", term: "Results", text: entry.responses?.results || "" }
  ];
  if (entry.responses?.nextSteps) {
    rows.push({ label: "G", term: "Goal + Review", text: entry.responses.nextSteps });
  }
  return rows;
}

function renderStarTagList(entry = {}, currentSkillId = "") {
  const skillTags = getStarEntrySkillIds(entry)
    .filter(skillId => skillId !== currentSkillId)
    .map(skillId => `<span>${escapeHtml(getSkillCategoryTitle(skillId))}</span>`);
  const subskillTags = getStarEntrySubskillTags(entry)
    .filter(tag => !currentSkillId || tag.skillId === currentSkillId || getStarEntrySkillIds(entry).length === 1)
    .map(tag => `<span>${escapeHtml(tag.subskillTitle)}</span>`);
  const tags = [...skillTags, ...subskillTags];
  return tags.length ? `<div class="skill-star-tag-list">${tags.join("")}</div>` : "";
}

function getStarPresetExample(category, meta) {
  if (meta.starExample) return meta.starExample;
  const primarySubskill = category.subskills?.[0]?.title || category.title;
  return {
    title: `${category.title} STAR application`,
    rows: [
      {
        label: "S",
        term: "Situation",
        text: `In a school, workplace, community, or gameplay situation, I had a chance to demonstrate ${category.title.toLowerCase()}.`
      },
      {
        label: "T",
        term: "Task",
        text: `My task was to apply ${primarySubskill.toLowerCase()} so the work could be completed more effectively.`
      },
      {
        label: "A",
        term: "Actions",
        text: "I chose a specific sub-skill, used it deliberately, and checked that my action matched the purpose of the task."
      },
      {
        label: "R",
        term: "Results",
        text: "The result was clearer evidence of what I can do, plus one next step I can improve next time."
      }
    ]
  };
}

function getSkillStarReviewStatusMarkup(entry) {
  const status = String(entry?.reviewStatus || "pending_review");
  if (status === "approved") {
    return '<p class="skill-star-review-status skill-star-review-status--approved">Teacher approved this for anonymous examples.</p>';
  }
  if (status === "rejected") {
    const reason = getRejectionReasonFromNote(entry.reviewerNote || "") || "Teacher requested changes";
    return `
      <div class="skill-star-review-status skill-star-review-status--rejected">
        <strong>Teacher did not approve this for sharing.</strong>
        <span>${escapeHtml(reason)}. Edit and resubmit a safer version.</span>
        <button class="skill-star-resubmit" type="button" data-star-resubmit-entry-id="${escapeHtml(entry.id)}">Edit and resubmit</button>
      </div>
    `;
  }
  return '<p class="skill-star-review-status">Teacher review pending before this can be shared as an example.</p>';
}

function getStarBuilderSelectedSubskillTags() {
  if (!starBuilderState) return [];
  return normaliseStarSubskillTags((starBuilderState.selectedSubskillIds || []).flatMap(key => {
    const [skillId, subskillId] = key.split(":");
    return { skillId, subskillId };
  }));
}

function renderStarBuilderSkillPicker() {
  const categories = employabilitySkillCategoriesCache;
  if (!categories.length || !starBuilderState) return "";
  const selectedSkillIds = starBuilderState.selectedSkillIds || [starBuilderState.skillId];
  const selectedSubskillTags = getStarBuilderSelectedSubskillTags();
  const subskillPrompt = selectedSubskillTags.length
    ? `Try naming one in your Actions or Results, for example: "I used ${selectedSubskillTags[0].subskillTitle.toLowerCase()} by..."`
    : "Choose one or more sub-skills, then weave their names into your STAR answer.";
  return `
    <div class="skill-star-builder-tags">
      <div class="skill-star-builder-tag-header">
        <strong>Portfolio tags</strong>
        <span>Tag every employability skill this example demonstrates.</span>
      </div>
      <div class="skill-star-builder-chip-row">
        ${categories.map(category => {
          const selected = selectedSkillIds.includes(category.id);
          return `
            <button class="skill-star-builder-chip ${selected ? "is-selected" : ""}" type="button" data-star-toggle-skill="${escapeHtml(category.id)}">
              ${escapeHtml(category.title)}
            </button>
          `;
        }).join("")}
      </div>
      <div class="skill-star-builder-subskills">
        ${categories.filter(category => selectedSkillIds.includes(category.id)).map(category => `
          <div class="skill-star-builder-subskill-group">
            <strong>${escapeHtml(category.title)} sub-skills</strong>
            <div class="skill-star-builder-chip-row">
              ${(category.subskills || []).map(subskill => {
                const key = `${category.id}:${subskill.id}`;
                const selected = starBuilderState.selectedSubskillIds.includes(key);
                return `
                  <button class="skill-star-builder-chip skill-star-builder-chip--subskill ${selected ? "is-selected" : ""}" type="button" data-star-toggle-subskill="${escapeHtml(key)}">
                    ${escapeHtml(subskill.title)}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <p>${escapeHtml(subskillPrompt)}</p>
    </div>
  `;
}

function toggleStarBuilderSkill(skillId) {
  if (!starBuilderState) return;
  const current = starBuilderState.selectedSkillIds || [starBuilderState.skillId];
  const next = current.includes(skillId)
    ? current.filter(id => id !== skillId)
    : [...current, skillId];
  if (!next.length) {
    starBuilderState.error = "Keep at least one employability skill tagged.";
    return;
  }
  starBuilderState.selectedSkillIds = next;
  starBuilderState.skillId = next[0];
  starBuilderState.skillTitle = getSkillCategoryTitle(next[0]);
  starBuilderState.selectedSubskillIds = (starBuilderState.selectedSubskillIds || [])
    .filter(key => next.includes(key.split(":")[0]));
  starBuilderState.error = "";
}

function toggleStarBuilderSubskill(key) {
  if (!starBuilderState) return;
  const [skillId] = key.split(":");
  if (!starBuilderState.selectedSkillIds.includes(skillId)) {
    starBuilderState.selectedSkillIds.push(skillId);
  }
  starBuilderState.selectedSubskillIds = starBuilderState.selectedSubskillIds.includes(key)
    ? starBuilderState.selectedSubskillIds.filter(item => item !== key)
    : [...starBuilderState.selectedSubskillIds, key];
  starBuilderState.error = "";
}

function openSkillStarResubmission(entryId, entries = getSkillStarEvidenceEntries(), options = {}) {
  const entry = (Array.isArray(entries) ? entries : []).find(item => item.id === entryId);
  if (!entry) return false;
  if (options.closePortfolio) closeStudentPortfolio();
  openSkillStarBuilder(entry.skillId, entry.skillTitle, entry.contextId, entry);
  return true;
}

function renderSkills(skillsData, targetId, progressMap, skillEvidenceMap = {}) {
  const container = document.getElementById(targetId);
  if (!container) return;
  if (Array.isArray(skillsData.categories) && skillsData.categories.length) {
    employabilitySkillCategoriesCache = skillsData.categories;
  }

  container.innerHTML = skillsData.categories.map(category => {
    const progress = clampPercent(progressMap[category.id] || 0);
    const meta = EMPLOYABILITY_SKILL_META[category.id] || EMPLOYABILITY_SKILL_META.communication;
    const isStudentGrid = targetId === "student-skill-grid";
    const studentPortfolioStatus = isStudentGrid
      ? getCurrentStudentModuleStatuses()[EMPLOYABILITY_PORTFOLIO_MODULE_ID]
      : "active";
    const canBuildPortfolioEvidence = studentPortfolioStatus === "active";
    const subskills = category.subskills.slice(0, 4);
    const parentLogoPath = getEmployabilityLogoPath(meta.logoFile) || category.logoPath || "";
    const studentEvidenceEntries = isStudentGrid ? (skillEvidenceMap[category.id] || []) : [];
    const starExample = getStarPresetExample(category, meta);
    const bankedEvidenceMarkup = studentEvidenceEntries.map(entry => `
      <article class="skill-star-entry skill-star-entry-banked">
        <div class="skill-star-entry-meta">
          <span>${escapeHtml(getStarContextLabel(entry.contextId))}</span>
          <time>${escapeHtml(formatExperienceDate(getStarEntryExperienceDate(entry)))}</time>
        </div>
        <strong class="skill-star-summary">${escapeHtml(entry.summary || createStarEvidenceSummary(entry))}</strong>
        ${renderStarTagList(entry, category.id)}
        ${getSkillStarReviewStatusMarkup(entry)}
        <div class="skill-star-grid">
          ${renderStarRows(getStarRowsForEntry(entry))}
        </div>
        <div class="skill-star-reward">Salary signal +${formatCurrency(entry.salaryReward || STAR_EVIDENCE_SALARY_REWARD)}</div>
      </article>
    `).join("");
    const starActionMarkup = isStudentGrid ? canBuildPortfolioEvidence ? `
      <div class="skill-star-actions">
        <span>Build STAR evidence from</span>
        <div class="skill-star-action-list">
          ${STAR_CONTEXTS.map(context => `
            <button class="skill-star-action" type="button" data-star-builder-context="${escapeHtml(context.id)}" data-star-builder-skill="${escapeHtml(category.id)}" data-star-builder-title="${escapeHtml(category.title)}">
              ${escapeHtml(context.label)}
            </button>
          `).join("")}
        </div>
      </div>
    ` : `
      <div class="skill-star-actions">
        <span>STAR portfolio logging is ${escapeHtml(getModuleStatusLabel(studentPortfolioStatus).toLowerCase())}.</span>
      </div>
    ` : "";
    const starExampleMarkup = isStudentGrid ? `
      <div class="skill-star-example">
        <div class="skill-star-header">
          <div>
            <div class="skill-star-title">${escapeHtml(starExample.title)}</div>
            <p>${studentEvidenceEntries.length ? "Newest student evidence appears first. The preset example stays underneath for reference." : "The preset example stays here until students bank their own STAR evidence."}</p>
          </div>
          <span>Evidence stream</span>
        </div>
        <div class="skill-star-scroll">
          ${bankedEvidenceMarkup}
          <article class="skill-star-entry">
            <div class="skill-star-entry-label">Predetermined example</div>
            <div class="skill-star-grid">
              ${renderStarRows(starExample.rows)}
            </div>
          </article>
        </div>
      </div>
    ` : "";
    const subskillItems = subskills.map((subskill, index) => ({
      ...subskill,
      logoPath: getEmployabilityLogoPath(meta.subskillLogoFiles?.[index] || "")
    }));
    return `
      <article class="skill-card skill-card-modern ${isStudentGrid ? "skill-card-has-star" : ""}" style="--skill-accent: ${meta.accent}; --skill-accent-soft: ${meta.accentSoft}; --skill-accent-strong: ${meta.accentStrong}; --skill-progress-angle: ${progress * 3.6}deg;">
        <div class="skill-card-top">
          <div class="skill-visual" aria-hidden="true">
            <img class="skill-hero-logo" src="${escapeHtml(parentLogoPath)}" alt="">
            <div class="skill-mini-logo-cloud">
              ${subskillItems.map((subskill, index) => `
                <span class="skill-mini-logo skill-mini-logo-${index + 1}" style="--mini-delay: ${index * 0.14}s;">
                  <img src="${escapeHtml(subskill.logoPath)}" alt="">
                </span>
              `).join("")}
            </div>
          </div>
          <div class="skill-score-block">
            <div class="kicker">${escapeHtml(category.title)}</div>
            <strong class="skill-score">${progress}%</strong>
            <span class="skill-score-label">${isStudentGrid ? "STAR evidence signal" : "evidence signal"}</span>
          </div>
        </div>
        <p class="skill-description">${escapeHtml(category.description)}</p>
        ${starExampleMarkup}
        ${createProgressBar(progress)}
        <div class="skill-subskill-grid">
          ${subskillItems.map(subskill => `
            <span class="skill-subskill-card">
              <img src="${escapeHtml(subskill.logoPath)}" alt="">
              <span>${escapeHtml(subskill.title)}</span>
            </span>
          `).join("")}
        </div>
        ${starActionMarkup}
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-star-builder-context]").forEach(button => {
    button.addEventListener("click", () => {
      openSkillStarBuilder(
        button.dataset.starBuilderSkill,
        button.dataset.starBuilderTitle,
        button.dataset.starBuilderContext
      );
    });
  });

  container.querySelectorAll("[data-star-resubmit-entry-id]").forEach(button => {
    button.addEventListener("click", () => {
      openSkillStarResubmission(button.dataset.starResubmitEntryId);
    });
  });
}

function ensureSkillStarBuilderModal() {
  let modal = document.getElementById("skill-star-builder-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "skill-star-builder-modal";
  modal.className = "skill-star-builder-modal";
  modal.hidden = true;
  document.body.appendChild(modal);
  return modal;
}

function openSkillStarBuilder(skillId, skillTitle, contextId, existingEntry = null) {
  const selectedSkillIds = getStarEntrySkillIds(existingEntry || { skillId });
  const selectedSubskillIds = getStarEntrySubskillTags(existingEntry || {})
    .map(tag => `${tag.skillId}:${tag.subskillId}`);
  starBuilderState = {
    skillId: selectedSkillIds[0] || skillId,
    skillTitle: getSkillCategoryTitle(selectedSkillIds[0] || skillId) || skillTitle,
    selectedSkillIds,
    selectedSubskillIds,
    experienceDate: formatDateInputValue(existingEntry?.experienceDate || existingEntry?.dateOfExperience || ""),
    contextId,
    stepIndex: 0,
    responses: {
      situation: existingEntry?.responses?.situation || "",
      task: existingEntry?.responses?.task || "",
      actions: existingEntry?.responses?.actions || "",
      results: existingEntry?.responses?.results || "",
      nextSteps: existingEntry?.responses?.nextSteps || ""
    },
    resubmittingEntryId: existingEntry?.id || null,
    resubmittingReviewId: existingEntry?.reviewId || null,
    error: "",
    status: "",
    isSaving: false
  };
  renderSkillStarBuilder();
}

function closeSkillStarBuilder() {
  starBuilderState = null;
  const modal = ensureSkillStarBuilderModal();
  modal.hidden = true;
  modal.innerHTML = "";
}

function updateSkillStarBuilderResponse(value) {
  if (!starBuilderState) return;
  const step = STAR_BUILDER_STEPS[starBuilderState.stepIndex];
  starBuilderState.responses[step.key] = value;
  starBuilderState.error = "";
  starBuilderState.status = "";
}

function renderSkillStarBuilder() {
  const modal = ensureSkillStarBuilderModal();
  if (!starBuilderState) {
    modal.hidden = true;
    return;
  }

  const step = STAR_BUILDER_STEPS[starBuilderState.stepIndex];
  const contextLabel = getStarContextLabel(starBuilderState.contextId).toLowerCase();
  const currentValue = starBuilderState.responses[step.key] || "";
  const isFinalStep = starBuilderState.stepIndex === STAR_BUILDER_STEPS.length - 1;
  const examples = getStarBuilderExamples(starBuilderState.contextId, step.key, step.examples);
  const summaryPreview = createStarEvidenceSummary(starBuilderState);
  const actionDisabled = starBuilderState.isSaving ? "disabled" : "";
  const finalButtonLabel = starBuilderState.resubmittingEntryId ? "Resubmit STAR evidence" : "Bank STAR evidence";
  const taggedSkillLabel = getStarEntrySkillTitles(starBuilderState).join(" + ");

  modal.hidden = false;
  modal.innerHTML = `
    <div class="skill-star-builder-dialog" role="dialog" aria-modal="true" aria-labelledby="skill-star-builder-title">
      <button class="skill-star-builder-close" type="button" data-star-builder-close aria-label="Close STAR builder">Close</button>
      <div class="skill-star-builder-topline">
        <span>${escapeHtml(taggedSkillLabel)}</span>
        <span>${escapeHtml(getStarContextLabel(starBuilderState.contextId))}</span>
      </div>
      <div class="skill-star-builder-progress" aria-label="STAR builder progress">
        ${STAR_BUILDER_STEPS.map((item, index) => `
          <span class="${index === starBuilderState.stepIndex ? "is-active" : index < starBuilderState.stepIndex ? "is-complete" : ""}">${escapeHtml(item.label)}</span>
        `).join("")}
      </div>
      <h2 id="skill-star-builder-title">So you improved ${escapeHtml(taggedSkillLabel)} in a ${escapeHtml(contextLabel)} context?</h2>
      <p class="skill-star-builder-lead">${escapeHtml(step.lead)}</p>
      <label class="skill-star-builder-date-field">
        <span>Date of experience</span>
        <input type="date" data-star-builder-experience-date max="${escapeHtml(getTodayDateInputValue())}" value="${escapeHtml(starBuilderState.experienceDate || "")}">
      </label>
      <div class="skill-star-builder-privacy-note">
        <strong>${escapeHtml(STUDENT_FREE_TEXT_PRIVACY_NOTICE.title)}</strong>
        <span>${escapeHtml(STUDENT_FREE_TEXT_PRIVACY_NOTICE.body)}</span>
      </div>
      ${renderStarBuilderSkillPicker()}
      <label class="skill-star-builder-field">
        <span>${escapeHtml(step.term)}</span>
        <small>${escapeHtml(step.prompt)}</small>
        <textarea rows="5" data-star-builder-input>${escapeHtml(currentValue)}</textarea>
      </label>
      <div class="skill-star-builder-examples">
        <span>Examples</span>
        ${examples.map(example => `<p>${escapeHtml(example)}</p>`).join("")}
      </div>
      <div class="skill-star-summary-preview">
        <span>Summary preview</span>
        <strong data-star-builder-summary>${escapeHtml(summaryPreview)}</strong>
      </div>
      ${starBuilderState.status ? `<div class="skill-star-builder-status">${escapeHtml(starBuilderState.status)}</div>` : ""}
      ${starBuilderState.error ? `<div class="skill-star-builder-error">${escapeHtml(starBuilderState.error)}</div>` : ""}
      <div class="skill-star-builder-actions">
        <button class="module-link" type="button" data-star-builder-back ${starBuilderState.stepIndex === 0 || starBuilderState.isSaving ? "disabled" : ""}>Back</button>
        <button class="module-link primary" type="button" data-star-builder-next ${actionDisabled}>${starBuilderState.isSaving ? "Saving..." : isFinalStep ? finalButtonLabel : "Next"}</button>
      </div>
    </div>
  `;

  const input = modal.querySelector("[data-star-builder-input]");
  try {
    input?.focus({ preventScroll: true });
  } catch (_) {
    input?.focus();
  }
  input?.addEventListener("input", event => {
    updateSkillStarBuilderResponse(event.target.value);
    const summaryTarget = modal.querySelector("[data-star-builder-summary]");
    if (summaryTarget) summaryTarget.textContent = createStarEvidenceSummary(starBuilderState);
  });
  modal.querySelector("[data-star-builder-close]")?.addEventListener("click", closeSkillStarBuilder);
  modal.querySelector("[data-star-builder-experience-date]")?.addEventListener("input", event => {
    starBuilderState.experienceDate = event.target.value;
    starBuilderState.error = "";
  });
  modal.querySelectorAll("[data-star-toggle-skill]").forEach(button => {
    button.addEventListener("click", () => {
      toggleStarBuilderSkill(button.dataset.starToggleSkill);
      renderSkillStarBuilder();
    });
  });
  modal.querySelectorAll("[data-star-toggle-subskill]").forEach(button => {
    button.addEventListener("click", () => {
      toggleStarBuilderSubskill(button.dataset.starToggleSubskill);
      renderSkillStarBuilder();
    });
  });
  modal.querySelector("[data-star-builder-back]")?.addEventListener("click", () => {
    if (!starBuilderState || starBuilderState.stepIndex === 0) return;
    starBuilderState.stepIndex -= 1;
    starBuilderState.error = "";
    starBuilderState.status = "";
    renderSkillStarBuilder();
  });
  modal.querySelector("[data-star-builder-next]")?.addEventListener("click", async () => {
    if (!starBuilderState) return;
    const latestValue = modal.querySelector("[data-star-builder-input]")?.value || "";
    updateSkillStarBuilderResponse(latestValue);
    if (latestValue.trim().length < 12) {
      starBuilderState.error = "Add a little more detail so this feels like usable evidence.";
      renderSkillStarBuilder();
      return;
    }
    if (!isFinalStep) {
      starBuilderState.stepIndex += 1;
      renderSkillStarBuilder();
      return;
    }
    if (!starBuilderState.experienceDate) {
      starBuilderState.error = "Choose the date this experience happened.";
      renderSkillStarBuilder();
      return;
    }
    if (parseTime(starBuilderState.experienceDate) > Date.now()) {
      starBuilderState.error = "Use the real date of the experience, not a future date.";
      renderSkillStarBuilder();
      return;
    }
    const createdAt = new Date().toISOString();
    const entry = {
      id: `star-${Date.now()}`,
      skillId: starBuilderState.skillId,
      skillTitle: starBuilderState.skillTitle,
      skillIds: [...starBuilderState.selectedSkillIds],
      skillTitles: getStarEntrySkillTitles(starBuilderState),
      subskillTags: getStarBuilderSelectedSubskillTags(),
      experienceDate: starBuilderState.experienceDate,
      contextId: starBuilderState.contextId,
      responses: { ...starBuilderState.responses },
      summary: createStarEvidenceSummary(starBuilderState),
      reviewText: createStarEvidenceReviewText(starBuilderState),
      reviewStatus: "pending_review",
      salaryReward: STAR_EVIDENCE_SALARY_REWARD,
      createdAt,
      supersedesEntryId: starBuilderState.resubmittingEntryId || null,
      supersedesReviewId: starBuilderState.resubmittingReviewId || null
    };
    starBuilderState.error = "";
    starBuilderState.status = starBuilderState.resubmittingEntryId
      ? "Resubmitting final entry for teacher review..."
      : "Saving final entry for teacher review...";
    starBuilderState.isSaving = true;
    renderSkillStarBuilder();
    const previousEntryId = starBuilderState.resubmittingEntryId;
    const previousReviewId = starBuilderState.resubmittingReviewId;
    const review = await queueSkillStarEvidenceForReview(entry).catch(error => {
      console.warn("STAR evidence review could not be queued:", error.message || error);
      return null;
    });
    const reviewContext = getStarEvidenceReviewContext();
    if (reviewContext.studentId && !review?.id) {
      starBuilderState.error = "Could not send this STAR evidence for teacher approval. Please try again.";
      starBuilderState.status = "";
      starBuilderState.isSaving = false;
      renderSkillStarBuilder();
      return;
    }
    if (review?.id) entry.reviewId = review.id;
    if (previousEntryId) {
      if (review?.id) {
        await retireSkillStarReviewForResubmission(previousEntryId, previousReviewId, review.id);
      }
      replaceSkillStarEvidence(previousEntryId, entry);
    } else {
      saveSkillStarEvidence(entry);
      bankStarEvidenceSalary(entry);
    }
    closeSkillStarBuilder();
    initDashboards().catch(console.error);
  });
}

function ensureStudentPortfolioModal() {
  let modal = document.getElementById("student-portfolio-modal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "student-portfolio-modal";
  modal.className = "student-portfolio-modal";
  modal.hidden = true;
  document.body.appendChild(modal);
  return modal;
}

function closeStudentPortfolio() {
  studentPortfolioState.open = false;
  const modal = ensureStudentPortfolioModal();
  modal.hidden = true;
  modal.innerHTML = "";
}

function renderStudentPortfolioEntry(entry, currentSkillId = "") {
  const primarySkillId = currentSkillId || getStarEntrySkillIds(entry)[0] || "communication";
  const meta = EMPLOYABILITY_SKILL_META[primarySkillId] || EMPLOYABILITY_SKILL_META.communication;
  return `
    <article class="student-portfolio-entry" style="--skill-accent: ${meta.accent}; --skill-accent-strong: ${meta.accentStrong};">
      <div class="student-portfolio-entry-header">
        <div>
          <span>${escapeHtml(getStarContextLabel(entry.contextId))}</span>
          <strong>${escapeHtml(entry.summary || createStarEvidenceSummary(entry))}</strong>
        </div>
        <time>${escapeHtml(formatExperienceDate(getStarEntryExperienceDate(entry)))}</time>
      </div>
      ${renderStarTagList(entry, currentSkillId)}
      ${getSkillStarReviewStatusMarkup(entry)}
      <div class="skill-star-grid">
        ${renderStarRows(getStarRowsForEntry(entry))}
      </div>
      <div class="student-portfolio-entry-actions">
        <button class="module-link" type="button" data-portfolio-edit-entry-id="${escapeHtml(entry.id)}">Edit STAR entry</button>
      </div>
    </article>
  `;
}

function renderStudentPortfolio() {
  const modal = ensureStudentPortfolioModal();
  if (!studentPortfolioState.open) {
    modal.hidden = true;
    return;
  }
  const entries = [...(studentPortfolioState.entries || [])]
    .sort(compareStarEntriesByExperienceDate);
  const categories = studentPortfolioState.skillsData?.categories?.length
    ? studentPortfolioState.skillsData.categories
    : employabilitySkillCategoriesCache || [];
  const view = studentPortfolioState.view || "timeline";
  const activeEntries = entries.filter(isSkillStarEvidenceActive);
  const subskillCount = new Set(entries.flatMap(entry => getStarEntrySubskillTags(entry).map(tag => `${tag.skillId}:${tag.subskillId}`))).size;
  const skillCount = new Set(entries.flatMap(getStarEntrySkillIds)).size;
  const timelineMarkup = entries.length
    ? entries.map(entry => renderStudentPortfolioEntry(entry)).join("")
    : `
      <div class="student-portfolio-empty">
        <strong>No STAR reflections banked yet</strong>
        <p>Use any employability skill card to build STAR evidence from school, workplace, community, or gameplay.</p>
      </div>
    `;
  const skillMarkup = categories.map(category => {
    const skillEntries = entries.filter(entry => getStarEntrySkillIds(entry).includes(category.id));
    return `
      <section class="student-portfolio-skill-group" style="--skill-accent: ${(EMPLOYABILITY_SKILL_META[category.id] || EMPLOYABILITY_SKILL_META.communication).accent};">
        <div class="student-portfolio-skill-header">
          <strong>${escapeHtml(category.title)}</strong>
          <span>${skillEntries.length} entr${skillEntries.length === 1 ? "y" : "ies"}</span>
        </div>
        ${skillEntries.length
          ? skillEntries.map(entry => renderStudentPortfolioEntry(entry, category.id)).join("")
          : '<p class="student-portfolio-skill-empty">No STAR reflections tagged to this skill yet.</p>'}
      </section>
    `;
  }).join("");

  modal.hidden = false;
  modal.innerHTML = `
    <div class="student-portfolio-dialog" role="dialog" aria-modal="true" aria-labelledby="student-portfolio-title">
      <button class="student-portfolio-close" type="button" data-student-portfolio-close aria-label="Close portfolio">Close</button>
      <div class="student-portfolio-heading">
        <span>Employability Portfolio</span>
        <h2 id="student-portfolio-title">Your STAR reflection log</h2>
        <p>Saved employability evidence is separate from Lifelong Learning. Multi-skill reflections appear under every skill they are tagged to.</p>
      </div>
      <div class="student-portfolio-stats">
        <span><strong>${entries.length}</strong> reflections</span>
        <span><strong>${activeEntries.length}</strong> active evidence signals</span>
        <span><strong>${skillCount}</strong> skill areas tagged</span>
        <span><strong>${subskillCount}</strong> sub-skills named</span>
      </div>
      <div class="student-portfolio-tabs" role="tablist" aria-label="Portfolio view">
        <button class="${view === "timeline" ? "is-active" : ""}" type="button" data-student-portfolio-view="timeline">Chronological</button>
        <button class="${view === "skills" ? "is-active" : ""}" type="button" data-student-portfolio-view="skills">By Skill Type</button>
      </div>
      <div class="student-portfolio-list">
        ${view === "skills" ? skillMarkup : timelineMarkup}
      </div>
    </div>
  `;
  modal.querySelector("[data-student-portfolio-close]")?.addEventListener("click", closeStudentPortfolio);
  modal.querySelectorAll("[data-student-portfolio-view]").forEach(button => {
    button.addEventListener("click", () => {
      studentPortfolioState.view = button.dataset.studentPortfolioView;
      renderStudentPortfolio();
    });
  });
  modal.querySelectorAll("[data-portfolio-edit-entry-id]").forEach(button => {
    button.addEventListener("click", () => {
      const entry = entries.find(item => item.id === button.dataset.portfolioEditEntryId);
      if (!entry) return;
      closeStudentPortfolio();
      openSkillStarBuilder(entry.skillId, entry.skillTitle, entry.contextId, entry);
    });
  });
  modal.querySelectorAll("[data-star-resubmit-entry-id]").forEach(button => {
    button.addEventListener("click", () => {
      openSkillStarResubmission(button.dataset.starResubmitEntryId, entries, { closePortfolio: true });
    });
  });
}

function setupStudentPortfolioButton(skillsData, entries = [], moduleStatus = "active") {
  const buttons = [
    document.getElementById("student-hub-portfolio-button"),
    ...document.querySelectorAll("[data-open-student-portfolio]")
  ].filter(Boolean);
  if (!buttons.length) return;
  const isAvailable = moduleStatus === "active";
  const openPortfolio = () => {
    if (!isAvailable) return;
    studentPortfolioState = {
      ...studentPortfolioState,
      open: true,
      skillsData,
      entries
    };
    renderStudentPortfolio();
  };
  buttons.forEach(button => {
    const baseLabel = button.dataset.portfolioLabel || "View Portfolio";
    button.textContent = entries.length ? `${baseLabel} (${entries.length})` : baseLabel;
    button.classList.toggle("module-link-disabled", !isAvailable);
    button.setAttribute("aria-disabled", isAvailable ? "false" : "true");
    button.disabled = !isAvailable;
    button.onclick = openPortfolio;
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function formatDateTime(value) {
  if (!value) return "Not yet";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not yet" : date.toLocaleString();
}

function parseStructuredEvidence(row) {
  if (!row?.response_text || typeof row.response_text !== "string") return null;
  const text = row.response_text.trim();
  if (!text.startsWith("{")) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function formatDurationSeconds(value, emptyLabel = "Not yet") {
  const seconds = Number(value || 0);
  if (!seconds) return emptyLabel;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

function getModuleLabel(moduleId) {
  const labels = {
    "megatrends": "Megatrends",
    "est-prep": "EST Prep",
    "initiative": "Initiative",
    "lifelong-learning": "Lifelong Learning",
    "employability-skills": "Employability Skills"
  };
  return labels[moduleId] || String(moduleId || "Module");
}

function getEvidenceModuleId(row, payload = null) {
  return payload?.module_id || row?.module_id || row?.module_slug || "";
}

function getEvidenceScorePercent(row, payload = null) {
  const raw = payload?.score_percent ?? row?.auto_score;
  if (raw === null || raw === undefined || raw === "") return null;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return null;
  return clampPercent(numeric > 0 && numeric <= 1 ? numeric * 100 : numeric);
}

function getEvidenceStudentName(row) {
  return row?.students?.display_name || row?.students?.username || "Student";
}

function extractLongResponseText(text) {
  const value = String(text || "").trim();
  const responseMatch = value.match(/(?:^|\n)Response:\s*([\s\S]*)$/i);
  return (responseMatch ? responseMatch[1] : value).trim();
}

function getEvidenceResponseText(row, payload = null) {
  const value = payload?.built_response
    || payload?.written_response
    || payload?.response_text
    || row?.response_text
    || "";
  return extractLongResponseText(value);
}

function getEvidencePromptText(row, payload = null) {
  return payload?.prompt_text || row?.prompt || "Saved task";
}

function getEvidenceTaskLabel(row, payload = null) {
  return payload?.topic_group || payload?.task_name || row?.evidence_type || "Saved task";
}

function getEvidenceTimingLabel(row, payload = null) {
  const moduleId = getEvidenceModuleId(row, payload);
  if (moduleId !== "est-prep") return getEvidenceTaskLabel(row, payload);
  if (payload?.topic_group) return `CORE - ${payload.topic_group}`;
  const taskName = String(payload?.task_name || row?.evidence_type || "").toLowerCase();
  if (taskName.includes("term") || row?.evidence_type === "glossary-check") return "TERM - Glossary";
  if (taskName.includes("vtcs") || row?.evidence_type === "decoder-breakdown") return payload?.question_number ? `VTCS - Question ${payload.question_number}` : "VTCS - Decoder";
  if (taskName.includes("boss") || row?.evidence_type === "est-response") return "BOSS - Final response";
  return getEvidenceTaskLabel(row, payload);
}

function getLastActivityTime(student, progressRows, evidenceRows) {
  const values = [
    student?.last_login_at,
    student?.created_at,
    ...progressRows.map(row => row.last_played_at || row.updated_at || row.created_at),
    ...evidenceRows.map(entry => entry.row?.created_at)
  ].map(parseTime).filter(Boolean);
  return values.length ? Math.max(...values) : 0;
}

function formatRelativeAge(timestamp) {
  if (!timestamp) return "No activity yet";
  const diff = Date.now() - timestamp;
  if (diff < 0) return "Just now";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getTeacherAnswerBand(score, wordCount) {
  if (typeof score === "number") {
    if (score >= 85) return "Strong";
    if (score >= 60) return "Developing";
    return "Needs support";
  }
  if (wordCount >= 80) return "Ready to review";
  if (wordCount >= 35) return "Developing";
  return "Needs expansion";
}

function buildTeacherFeedbackSuggestion(answer, score, classAverage) {
  const text = String(answer || "");
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const notes = [];
  if (typeof score === "number" && classAverage) {
    const gap = score - classAverage;
    notes.push(`${Math.abs(gap)} points ${gap >= 0 ? "above" : "below"} the current class average.`);
  }
  if (wordCount < 35) {
    notes.push("Ask for a fuller explanation with a second sentence that explains why the point matters.");
  }
  if (!/(because|therefore|this means|as a result|for example|evidence)/i.test(lower)) {
    notes.push("Prompt cause-and-effect language or a concrete example so the answer shows reasoning, not just recall.");
  }
  if (typeof score === "number" && score < 60) {
    notes.push("Revisit the command word, the key content point, and the glossary term before they retry.");
  } else if (typeof score === "number" && score >= 80) {
    notes.push("Extension: add a second linked reason or a more precise syllabus term.");
  }
  return notes.slice(0, 3).join(" ");
}

function parseStructuredFeedback(row) {
  if (!row?.message || typeof row.message !== "string") return null;
  const text = row.message.trim();
  if (!text.startsWith("{")) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function normaliseFlagList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.replace(/[{}"]/g, "").split(",").map(flag => flag.trim()).filter(Boolean);
  }
  return [];
}

function normaliseReviewStatus(value, fallback = "pending_review") {
  const status = String(value || fallback || "").trim();
  if (!status || status === "pending") return "pending_review";
  if (status === "checked" || status === "reviewed") return "checked";
  return status;
}

function getTeacherFeedbackTypeLabel(value) {
  const labels = {
    bug: "Bug report",
    suggestion: "Suggestion",
    question: "Question",
    "store-item-request": "Store item request"
  };
  return labels[value] || String(value || "Feedback").replaceAll("-", " ");
}

function getReviewStatusLabel(status, approvedLabel = "Approved") {
  const labels = {
    pending_review: "Pending review",
    checked: "Checked",
    dismissed: "Dismissed",
    approved: approvedLabel,
    rejected: "Rejected"
  };
  return labels[normaliseReviewStatus(status)] || String(status || "Pending review").replaceAll("_", " ");
}

function getTeacherReviewFilter(filterKey) {
  const value = teacherReviewFilterState[filterKey] || "new";
  return TEACHER_REVIEW_FILTER_OPTIONS.some(option => option.id === value) ? value : "new";
}

function setTeacherReviewFilter(filterKey, nextFilter) {
  if (!TEACHER_REVIEW_FILTER_OPTIONS.some(option => option.id === nextFilter)) return false;
  teacherReviewFilterState[filterKey] = nextFilter;
  return true;
}

function getTeacherReviewStatusBucket(status) {
  return normaliseReviewStatus(status) === "pending_review" ? "new" : "actioned";
}

function getTeacherReviewFilterCounts(items = [], getStatus = item => item?.status) {
  return items.reduce((acc, item) => {
    const bucket = getTeacherReviewStatusBucket(getStatus(item));
    acc.all += 1;
    acc[bucket] += 1;
    return acc;
  }, { all: 0, new: 0, actioned: 0 });
}

function filterTeacherReviewItems(items = [], filterKey, getStatus = item => item?.status) {
  const activeFilter = getTeacherReviewFilter(filterKey);
  if (activeFilter === "all") return items;
  return items.filter(item => getTeacherReviewStatusBucket(getStatus(item)) === activeFilter);
}

function renderTeacherReviewFilterControls(filterKey, items = [], getStatus = item => item?.status, ariaLabel = "Review status filter") {
  const activeFilter = getTeacherReviewFilter(filterKey);
  const counts = getTeacherReviewFilterCounts(items, getStatus);
  return `
    <div class="teacher-review-filter" role="group" aria-label="${escapeHtml(ariaLabel)}">
      ${TEACHER_REVIEW_FILTER_OPTIONS.map(option => `
        <button
          class="teacher-review-filter-button${option.id === activeFilter ? " is-active" : ""}"
          type="button"
          data-teacher-review-filter="${escapeHtml(filterKey)}"
          data-teacher-review-filter-value="${escapeHtml(option.id)}"
          aria-pressed="${option.id === activeFilter ? "true" : "false"}"
        >
          <span>${escapeHtml(option.label)}</span>
          <span>${counts[option.id] || 0}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function bindTeacherReviewFilterControls(container, filterKey, onChange) {
  container.querySelectorAll(`[data-teacher-review-filter="${filterKey}"]`).forEach(button => {
    button.addEventListener("click", event => {
      const nextFilter = event.currentTarget.dataset.teacherReviewFilterValue;
      if (setTeacherReviewFilter(filterKey, nextFilter)) onChange();
    });
  });
}

function renderTeacherReviewEmptyState(activeFilter, messages) {
  const message = messages[activeFilter] || messages.all || messages.new;
  return `<div class="timeline-item"><strong>${escapeHtml(message.title)}</strong><p>${escapeHtml(message.body)}</p></div>`;
}

function feedbackMatchesTeacherScope(item, dashboardContext, classCodeFilter) {
  const teacherSchool = dashboardContext.teacherLogin?.schoolName
    || dashboardContext.teacher?.schoolName
    || dashboardContext.teacherSession?.schoolName
    || "";
  const teacherSchoolId = dashboardContext.teacherLogin?.schoolId
    || dashboardContext.teacherLogin?.school_id
    || dashboardContext.teacher?.schoolId
    || dashboardContext.teacher?.school_id
    || dashboardContext.teacherSession?.schoolId
    || dashboardContext.teacherSession?.school_id
    || "";
  const matchesClass = Boolean(classCodeFilter && item.classCode && item.classCode === classCodeFilter);
  const matchesSchoolId = Boolean(teacherSchoolId && item.schoolId && String(item.schoolId) === String(teacherSchoolId));
  const matchesSchool = Boolean(teacherSchool && item.schoolName && normalizeSchoolName(item.schoolName) === normalizeSchoolName(teacherSchool));
  const unscoped = !item.schoolId && !item.schoolName && !item.classCode;
  if (classCodeFilter) return matchesClass || matchesSchoolId || matchesSchool || unscoped;
  return matchesSchoolId || matchesSchool || unscoped || (!teacherSchool && !teacherSchoolId);
}

function normaliseTeacherFeedback(row) {
  if (row.feedback_type === "store-item-request") return null;
  const payload = parseStructuredFeedback(row);
  if (payload && payload.kind === "store-item-request") return null;
  const messageText = payload?.feedback_text || payload?.message || row.message || "";
  return {
    id: row.id,
    createdAt: row.created_at,
    pagePath: payload?.page_path || row.page_path || "",
    actorRole: payload?.actor_role || row.actor_role || "anonymous",
    loginName: payload?.login_name || row.login_name || "unknown",
    displayName: payload?.display_name || "",
    studentId: payload?.student_id || null,
    teacherId: payload?.teacher_id || null,
    schoolId: payload?.school_id || "",
    schoolName: payload?.school_name || "",
    classId: payload?.class_id || "",
    classCode: payload?.class_code || "",
    feedbackType: payload?.feedback_type || row.feedback_type || "feedback",
    text: messageText,
    status: normaliseReviewStatus(payload?.status),
    flags: normaliseFlagList(payload?.flags),
    flagNotes: payload?.flag_notes || payload?.flagNotes || "",
    reviewerNote: payload?.reviewer_note || "",
    reviewedAt: payload?.reviewed_at || "",
    payload: payload || {
      kind: "teacher-feedback",
      status: "pending_review",
      feedback_type: row.feedback_type || "feedback",
      feedback_text: messageText,
      page_path: row.page_path || "",
      actor_role: row.actor_role || "anonymous",
      login_name: row.login_name || "unknown",
      flags: [],
      flag_notes: ""
    }
  };
}

function normaliseStoreRequest(row) {
  const payload = parseStructuredFeedback(row);
  if (!payload || payload.kind !== "store-item-request") return null;
  const approvedItem = payload.approved_item || null;
  return {
    id: row.id,
    createdAt: row.created_at,
    loginName: row.login_name,
    status: normaliseReviewStatus(payload.status),
    studentId: payload.student_id || null,
    schoolId: payload.school_id || "",
    classId: payload.class_id || "",
    studentName: payload.student_name || row.login_name || "Student",
    schoolName: payload.school_name || "",
    classCode: payload.class_code || "",
    itemName: approvedItem?.name || payload.item_name || "",
    category: approvedItem?.category || payload.category || "wellbeing",
    categoryLabel: approvedItem?.categoryLabel || payload.category_label || payload.category || "Category",
    reason: payload.reason || "",
    image: approvedItem?.image || payload.image || null,
    approvedItem,
    flags: normaliseFlagList(payload.flags),
    flagNotes: payload.flag_notes || payload.flagNotes || "",
    payload
  };
}

function isPromoTeacherDashboardMode() {
  if (!document.getElementById("teacher-module-health")) return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "promo" || params.get("promo") === "1";
}

function getPromoTeacherDashboardData() {
  const now = new Date();
  const minutesAgo = value => new Date(now.getTime() - value * 60 * 1000).toISOString();
  const hoursAgo = value => new Date(now.getTime() - value * 60 * 60 * 1000).toISOString();

  const classes = [
    { id: "promo-class-a", name: "Year 12 Careers A", class_code: "Y12A" },
    { id: "promo-class-b", name: "Year 12 Careers B", class_code: "Y12B" }
  ];

  const studentSeeds = [
    ["Mia", "Mia26", "promo-class-a", 82, 91, 112000, 3, 84, 78, "communication"],
    ["Jayden", "Jayden26", "promo-class-a", 77, 86, 104500, 3, 80, 75, "teamwork"],
    ["Aaliyah", "Aaliyah26", "promo-class-a", 88, 95, 128000, 4, 89, 82, "critical-thinking"],
    ["Noah", "Noah26", "promo-class-a", 73, 83, 97800, 3, 78, 74, "digital-literacy"],
    ["Sienna", "Sienna26", "promo-class-a", 84, 92, 118200, 4, 86, 81, "time-management"],
    ["Luca", "Luca26", "promo-class-a", 69, 79, 91500, 2, 76, 73, "problem-solving"],
    ["Chloe", "Chloe26", "promo-class-a", 81, 89, 109400, 3, 82, 79, "communication"],
    ["Ethan", "Ethan26", "promo-class-a", 75, 84, 99500, 3, 79, 72, "teamwork"],
    ["Grace", "Grace26", "promo-class-b", 86, 94, 123600, 4, 88, 84, "critical-thinking"],
    ["Hudson", "Hudson26", "promo-class-b", 72, 82, 96800, 2, 77, 71, "digital-literacy"],
    ["Zara", "Zara26", "promo-class-b", 90, 97, 133400, 4, 91, 86, "communication"],
    ["Cooper", "Cooper26", "promo-class-b", 78, 87, 106700, 3, 81, 76, "problem-solving"],
    ["Ruby", "Ruby26", "promo-class-b", 83, 90, 114900, 3, 85, 80, "time-management"],
    ["Leo", "Leo26", "promo-class-b", 74, 83, 98700, 2, 78, 74, "teamwork"],
    ["Evie", "Evie26", "promo-class-b", 87, 95, 126100, 4, 90, 85, "critical-thinking"],
    ["Mason", "Mason26", "promo-class-b", 71, 81, 95400, 2, 75, 70, "digital-literacy"]
  ];

  const students = studentSeeds.map((seed, index) => ({
    id: `promo-student-${index + 1}`,
    display_name: seed[0],
    username: seed[1],
    class_id: seed[2],
    created_at: hoursAgo(240 - index * 6),
    last_login_at: index < 14 ? minutesAgo(20 + index * 7) : null
  }));

  const profiles = studentSeeds.map((seed, index) => {
    const classRow = classes.find(row => row.id === seed[2]);
    const mastery = seed[3];
    return {
      id: `promo-student-${index + 1}`,
      player_name: seed[0],
      school_name: "Emmanuel Catholic College",
      class_code: classRow?.class_code || "",
      career_title: mastery >= 85 ? "Senior Strategist" : mastery >= 78 ? "Project Lead" : "Career Builder",
      annual_salary: seed[4] * 1000,
      cumulative_net_worth: seed[5],
      career_level: seed[6],
      job_security: seed[7],
      work_life_balance: seed[8],
      community_vote: index % 4 === 0 ? "tech" : index % 4 === 1 ? "climate" : index % 4 === 2 ? "global" : "diversity",
      years_played: seed[6],
      tech_mastery: mastery + (seed[9] === "digital-literacy" ? 6 : 1),
      climate_mastery: mastery + (seed[9] === "problem-solving" ? 4 : 0),
      demo_mastery: mastery + (seed[9] === "communication" || seed[9] === "teamwork" ? 5 : 1),
      economic_mastery: mastery + (seed[9] === "critical-thinking" || seed[9] === "time-management" ? 4 : 1),
      timestamp: minutesAgo(15 + index * 3)
    };
  });

  const moduleProgress = students.flatMap((student, index) => {
    const profile = profiles[index];
    const overallMastery = average([
      profile.tech_mastery,
      profile.climate_mastery,
      profile.demo_mastery,
      profile.economic_mastery
    ]);
    const estMastery = Math.max(62, overallMastery - 8 + (index % 5));
    return [
      {
        student_id: student.id,
        class_id: student.class_id,
        module_id: "megatrends",
        completion_percent: Math.min(100, 62 + (index % 5) * 8),
        mastery_percent: overallMastery,
        attempts: 3 + (index % 3)
      },
      {
        student_id: student.id,
        class_id: student.class_id,
        module_id: "est-prep",
        completion_percent: 48 + (index % 4) * 10,
        mastery_percent: estMastery,
        attempts: 2 + (index % 2)
      }
    ];
  });

  const evidenceRows = students.flatMap((student, index) => [
    {
      id: `promo-est-${index + 1}`,
      student_id: student.id,
      class_id: student.class_id,
      module_id: "est-prep",
      evidence_type: "boss-round",
      prompt: "Explain how labour market information can shape post-school decisions.",
      response_text: JSON.stringify({
        module_id: "est-prep",
        task_name: "Boss Round",
        prompt_text: "Explain how labour market information can shape post-school decisions.",
        response_text: `${student.display_name} explains that labour market information helps students compare growth industries, future demand, and training pathways before making a career decision.`,
        score_percent: 72 + (index % 6) * 4,
        duration_seconds: 230 + index * 9
      }),
      auto_score: 72 + (index % 6) * 4,
      created_at: minutesAgo(55 + index * 6),
      students: {
        display_name: student.display_name,
        username: student.username
      }
    },
    {
      id: `promo-mega-${index + 1}`,
      student_id: student.id,
      class_id: student.class_id,
      module_id: "megatrends",
      evidence_type: "concept-lock",
      prompt: "Which megatrend best explains this workplace change?",
      response_text: JSON.stringify({
        module_id: "megatrends",
        task_name: "Concept Lock-In",
        prompt_text: "Which megatrend best explains this workplace change?",
        response_text: `${student.display_name} linked the scenario to Economic Power Shifts and justified the response with a concise explanation.`,
        score_percent: 76 + (index % 5) * 4,
        duration_seconds: 88 + index * 5
      }),
      auto_score: 76 + (index % 5) * 4,
      created_at: minutesAgo(18 + index * 4),
      students: {
        display_name: student.display_name,
        username: student.username
      }
    }
  ]);

  const voteRows = students.map((student, index) => ({
    id: `promo-vote-${index + 1}`,
    class_id: student.class_id,
    vote_key: index % 3 === 0 ? "tech" : index % 3 === 1 ? "climate" : "global",
    cause: index % 3 === 0 ? "tech" : index % 3 === 1 ? "climate" : "global"
  }));

  const feedbackRows = [
    {
      id: "promo-request-1",
      created_at: hoursAgo(8),
      login_name: "Mia26",
      feedback_type: "store-item-request",
      message: JSON.stringify({
        kind: "store-item-request",
        status: "pending",
        student_name: "Mia",
        school_name: "Emmanuel Catholic College",
        class_code: "Y12A",
        item_name: "Tesla Model 3",
        category: "cars",
        category_label: "Cars",
        reason: "A realistic aspirational item that feels exciting and fits the career theme."
      })
    },
    {
      id: "promo-request-2",
      created_at: hoursAgo(20),
      login_name: "Zara26",
      feedback_type: "store-item-request",
      message: JSON.stringify({
        kind: "store-item-request",
        status: "approved",
        student_name: "Zara",
        school_name: "Emmanuel Catholic College",
        class_code: "Y12B",
        item_name: "Designer Laptop",
        category: "mobile-phones",
        category_label: "Mobile Phones & Tech",
        reason: "Students wanted a higher-tier tech item in the store.",
        approved_item: {
          code: "promo-laptop",
          name: "Designer Laptop",
          category: "mobile-phones",
          categoryLabel: "Mobile Phones & Tech",
          description: "A premium productivity upgrade for high-performing players."
        }
      })
    }
  ];

  return {
    context: {
      teacher: {
        id: "promo-teacher",
        fullName: "Tania Byrnes",
        email: "tania.byrnes@cewa.edu.au",
        schoolId: "promo-school",
        schoolName: "Emmanuel Catholic College"
      }
    },
    availableClasses: classes,
    selectedClassId: "all",
    selectedClassName: "All classes at Emmanuel Catholic College",
    students,
    moduleProgress,
    evidenceRows,
    voteRows,
    profileRows: profiles,
    feedbackRows,
    reviewRows: []
  };
}

function buildStoreRequestApprovedItem(request, formData) {
  return {
    code: request.approvedItem?.code || `store-request-${request.id}`,
    name: formData.name,
    category: formData.category,
    categoryLabel: formData.categoryLabel,
    cost: Number(formData.cost || 0),
    icon: formData.icon || "🛍️",
    benefit: formData.benefit,
    image: request.image || null
  };
}

function renderTeacherStoreRequestList(items) {
  const container = document.getElementById("teacher-store-request-list");
  if (!container) return;
  const sortedItems = [...items].sort((a, b) => {
    const statusWeight = status => normaliseReviewStatus(status) === "pending_review" ? 0 : 1;
    return statusWeight(a.status) - statusWeight(b.status) || parseTime(b.createdAt) - parseTime(a.createdAt);
  });
  const activeFilter = getTeacherReviewFilter("storeRequests");
  const visibleItems = filterTeacherReviewItems(sortedItems, "storeRequests", item => item.status);

  if (!sortedItems.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No store requests yet</strong><p>When students suggest new shop items, you will be able to review, edit, approve, and reject them here.</p></div>';
    return;
  }

  const storeRequestCards = visibleItems.map(item => {
    const defaultCost = item.approvedItem?.cost || 1000;
    const defaultIcon = item.approvedItem?.icon || "🛍️";
    const defaultBenefit = item.approvedItem?.benefit || item.reason || "Student-requested item for the Career Empire store.";
    const status = normaliseReviewStatus(item.status);
    const statusLabel = getReviewStatusLabel(status, "Approved");
    const flags = normaliseFlagList(item.flags);
    return `
      <article class="module-card store-request-card" data-store-request-id="${item.id}">
        <div class="section-title">
          <div>
            <h2>${escapeHtml(item.itemName || "Requested item")}</h2>
            <p>${escapeHtml(item.studentName)} • ${escapeHtml(item.classCode || "Class not set")} • ${formatDateTime(item.createdAt)}</p>
          </div>
          <p class="status-${status === "approved" ? "good" : status === "rejected" ? "risk" : "watch"}">${escapeHtml(statusLabel)}</p>
        </div>
        <div class="store-request-meta">
          <span class="pill">Category: ${escapeHtml(item.categoryLabel)}</span>
          <span class="pill">Login: ${escapeHtml(item.loginName || "unknown")}</span>
          ${item.schoolName ? `<span class="pill">School: ${escapeHtml(item.schoolName)}</span>` : ""}
          ${flags.length
            ? flags.map(flag => `<span class="pill">${escapeHtml(getResponseReviewFlagLabel(flag))}</span>`).join("")
            : '<span class="pill">No automatic flags</span>'}
        </div>
        ${item.flagNotes ? `<p class="footer-note">${escapeHtml(item.flagNotes)}</p>` : ""}
        ${item.image?.dataUrl ? `<img class="store-request-image" src="${item.image.dataUrl}" alt="${escapeHtml(item.itemName)} image">` : ""}
        <p>${escapeHtml(item.reason || "No reason provided.")}</p>
        <div class="store-request-form">
          <div class="store-request-grid">
            <div>
              <label>Approved item name</label>
              <input type="text" data-store-field="name" value="${escapeHtml(item.itemName)}">
            </div>
            <div>
              <label>Category</label>
              <select data-store-field="category">
                ${[
                  ["cars", "Cars"],
                  ["mobile-phones", "Mobile Phones"],
                  ["clothes", "Clothes"],
                  ["investments", "Investments"],
                  ["wellbeing", "Wellbeing"],
                  ["technology", "Technology"],
                  ["study", "Study"],
                  ["mobility", "Mobility"],
                  ["housing", "Housing"],
                  ["fun", "Fun"],
                  ["experiences", "Experiences"]
                ].map(([value, label]) => `<option value="${value}" ${value === item.category ? "selected" : ""}>${label}</option>`).join("")}
              </select>
            </div>
            <div>
              <label>Cost</label>
              <input type="number" min="0" step="10" data-store-field="cost" value="${defaultCost}">
            </div>
            <div>
              <label>Emoji icon</label>
              <input type="text" maxlength="4" data-store-field="icon" value="${escapeHtml(defaultIcon)}">
            </div>
          </div>
          <div>
            <label>Store description</label>
            <textarea data-store-field="benefit">${escapeHtml(defaultBenefit)}</textarea>
          </div>
        </div>
        <div class="module-actions">
          <button class="module-link" type="button" data-store-action="approve">Approve and Publish</button>
          <button class="module-link button-danger" type="button" data-store-action="reject">Reject</button>
        </div>
        <p class="store-request-status" data-store-status>
          <strong>Current status:</strong> ${escapeHtml(statusLabel)}${status === "approved" ? " and visible in the shop." : ""}
        </p>
      </article>
    `;
  }).join("");

  container.innerHTML = `
    ${renderTeacherReviewFilterControls("storeRequests", sortedItems, item => item.status, "Store request status filter")}
    ${storeRequestCards || renderTeacherReviewEmptyState(activeFilter, {
      new: {
        title: "No new store requests",
        body: "Approved and rejected requests are still available under Actioned or All."
      },
      actioned: {
        title: "No actioned store requests yet",
        body: "Approved and rejected requests will appear here after review."
      },
      all: {
        title: "No store requests yet",
        body: "When students suggest new shop items, you will be able to review, edit, approve, and reject them here."
      }
    })}
  `;

  bindTeacherReviewFilterControls(container, "storeRequests", () => renderTeacherStoreRequestList(items));

  container.querySelectorAll("[data-store-action]").forEach(button => {
    button.addEventListener("click", async event => {
      const action = event.currentTarget.dataset.storeAction;
      const card = event.currentTarget.closest("[data-store-request-id]");
      if (!card) return;
      const requestId = card.dataset.storeRequestId;
      const fields = Object.fromEntries([...card.querySelectorAll("[data-store-field]")].map(field => [field.dataset.storeField, field.value.trim()]));
      const request = sortedItems.find(entry => entry.id === requestId);
      if (!request) return;

      const categoryLabel = card.querySelector('[data-store-field="category"]')?.selectedOptions?.[0]?.textContent || fields.category;
      const statusEl = card.querySelector("[data-store-status]");
      if (statusEl) statusEl.innerHTML = "<strong>Updating...</strong>";

      try {
        if (action === "approve") {
          const approvedItem = buildStoreRequestApprovedItem(request, {
            ...fields,
            categoryLabel
          });
          await updateStoreRequest(request, "approved", approvedItem);
        } else {
          await updateStoreRequest(request, "rejected", null);
        }
        await initDashboards();
      } catch (error) {
        if (statusEl) statusEl.innerHTML = `<strong>Error:</strong> ${escapeHtml(error.message || "Could not update request.")}`;
      }
    });
  });
}

async function updateStoreRequest(request, status, approvedItem = null) {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) throw new Error("Supabase is not available.");
  const context = getActiveTeacherContext();
  const nextPayload = {
    ...request.payload,
    status,
    approved_item: approvedItem,
    reviewed_by_teacher_id: context.teacher?.id || null,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase
    .from("feedback_reports")
    .update({
      message: JSON.stringify(nextPayload)
    })
    .eq("id", request.id);

  if (error) throw error;
}

function createEmptyTeacherDashboardData(context, dashboardFilter, selectedClassName = "No classes found") {
  return {
    context,
    availableClasses: [],
    selectedClassId: "all",
    selectedStudentId: dashboardFilter?.studentId || "all",
    studentRecordFocus: dashboardFilter?.studentRecordFocus || "active",
    studentRecordCounts: getStudentRecordCounts([]),
    selectedClassName,
    students: [],
    moduleProgress: [],
    evidenceRows: [],
    voteRows: [],
    profileRows: [],
    feedbackRows: [],
    reviewRows: []
  };
}

async function getTeacherDashboardData() {
  const supabase = await getSupabaseClientOrNull();
  let context = getActiveTeacherContext();
  context = await resolveTeacherDashboardContext(supabase, context);
  const schoolId = context.teacher?.schoolId || null;
  const dashboardFilter = getTeacherDashboardFilter();
  if (!supabase || !schoolId) {
    return createEmptyTeacherDashboardData(context, dashboardFilter, "Teacher school not resolved");
  }

  const { data: classRows, error: classesError } = await supabase
    .from("classes")
    .select("id, name, class_code, year_level, school_id, teacher_id")
    .eq("school_id", schoolId)
    .order("name", { ascending: true });

  if (classesError) {
    console.error(classesError);
    return createEmptyTeacherDashboardData(context, dashboardFilter);
  }

  const availableClasses = classRows || [];
  if (!availableClasses.length) {
    return createEmptyTeacherDashboardData(context, dashboardFilter);
  }

  const requestedClassId = dashboardFilter.classId || context.classroom?.id || "all";
  const selectedClassId = requestedClassId === "all" || availableClasses.some(row => row.id === requestedClassId)
    ? requestedClassId
    : (context.classroom?.id && availableClasses.some(row => row.id === context.classroom.id) ? context.classroom.id : "all");
  const selectedClassRows = selectedClassId === "all"
    ? availableClasses
    : availableClasses.filter(row => row.id === selectedClassId);
  const classIds = selectedClassRows.map(row => row.id);
  const selectedClassName = selectedClassId === "all"
    ? `All classes at ${context.teacher?.schoolName || "School not resolved"}`
    : (selectedClassRows[0]?.name || "Selected class");
  const studentRecordFocus = dashboardFilter.studentRecordFocus || "active";

  const [studentsResult, votesResult, feedbackResult, reviewsResult] = await Promise.allSettled([
    supabase
      .from("students")
      .select("id, display_name, username, created_at, last_login_at, school_id, class_id, is_active")
      .eq("school_id", schoolId)
      .in("class_id", classIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("community_votes")
      .select("*")
      .in("class_id", classIds),
    supabase
      .from("feedback_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(160),
    supabase
      .from("student_response_reviews")
      .select("*")
      .eq("school_id", schoolId)
      .in("class_id", classIds)
      .order("created_at", { ascending: false })
      .limit(300)
  ]);

  const unwrapResult = (result, label) => {
    if (result.status === "rejected") {
      console.error(`${label} query failed`, result.reason);
      return [];
    }
    if (result.value?.error) {
      console.error(`${label} query failed`, result.value.error);
      return [];
    }
    return result.value?.data || [];
  };

  const allStudents = unwrapResult(studentsResult, "students");
  const studentRecordCounts = getStudentRecordCounts(allStudents);
  const students = allStudents.filter(student => studentMatchesRecordFocus(student, studentRecordFocus));
  const voteRows = unwrapResult(votesResult, "community_votes");
  const feedbackRows = unwrapResult(feedbackResult, "feedback_reports");
  const studentById = new Map(allStudents.map(student => [student.id, student]));
  const classById = new Map(availableClasses.map(classroom => [classroom.id, classroom]));
  const allReviewRows = unwrapResult(reviewsResult, "student_response_reviews").map(row => {
    const student = studentById.get(row.student_id) || {};
    const classroom = classById.get(row.class_id) || {};
    return {
      ...row,
      students: row.students || {
        display_name: student.display_name || "",
        username: student.username || "",
        class_id: student.class_id || row.class_id || ""
      },
      classes: row.classes || {
        name: classroom.name || "",
        class_code: classroom.class_code || ""
      }
    };
  });

  const studentIds = students.map(student => student.id);
  const allowedStudentIds = new Set(studentIds);
  const selectedStudentId = allowedStudentIds.has(dashboardFilter.studentId) ? dashboardFilter.studentId : "all";
  const [moduleProgressResult, evidenceResult] = studentIds.length
    ? await Promise.allSettled([
      supabase
        .from("student_module_progress")
        .select("*")
        .in("student_id", studentIds),
      supabase
        .from("assessment_evidence")
        .select("*, students(display_name, username, school_id, class_id)")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false })
        .limit(80)
    ])
    : [{ status: "fulfilled", value: { data: [] } }, { status: "fulfilled", value: { data: [] } }];
  const allowedClassIds = new Set(classIds);
  const moduleProgress = unwrapResult(moduleProgressResult, "student_module_progress")
    .filter(row => allowedStudentIds.has(row.student_id) && (!row.class_id || allowedClassIds.has(row.class_id)));
  const evidenceRows = unwrapResult(evidenceResult, "assessment_evidence")
    .filter(row => allowedStudentIds.has(row.student_id) && (!row.class_id || allowedClassIds.has(row.class_id)));
  const reviewRows = dedupeTeacherReviewRows(allReviewRows
    .filter(row => allowedStudentIds.has(row.student_id))
    .filter(isTeacherReviewableStudentResponse));
  let profileRows = [];
  if (studentIds.length) {
    const { data, error: profilesError } = await supabase
      .from("player_profiles")
      .select(`
        student_id,
        career_title,
        annual_salary,
        cumulative_net_worth,
        savings,
        tax_paid,
        career_level,
        job_security,
        work_life_balance,
        years_played,
        tech_mastery,
        climate_mastery,
        demo_mastery,
        economic_mastery,
        last_community_vote,
        updated_at,
        students!inner(
          id,
          display_name,
          username,
          class_id,
          classes(class_code, name),
          schools(name)
        )
      `)
      .in("student_id", studentIds);

    if (profilesError) {
      console.error("player_profiles query failed", profilesError);
    } else {
      profileRows = data || [];
    }
  }

  return {
    context,
    availableClasses,
    selectedClassId,
    selectedStudentId,
    studentRecordFocus,
    studentRecordCounts,
    selectedClassName,
    students: students || [],
    moduleProgress: moduleProgress || [],
    evidenceRows: evidenceRows || [],
    voteRows: voteRows || [],
    profileRows: (profileRows || []).map(mapRemotePlayerProfile),
    feedbackRows: feedbackRows || [],
    reviewRows: reviewRows || []
  };
}

function getFallbackClassId(classCode) {
  return `fallback-class-${String(classCode || "unassigned")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "unassigned"}`;
}

function buildFallbackTeacherDashboardData(players, context) {
  const dashboardFilter = getTeacherDashboardFilter();
  const latestPlayers = dedupeLatestPlayers(players || []).map((player, index) => ({
    ...player,
    id: player.id || `local-student-${index + 1}`
  }));
  const classMap = new Map();

  latestPlayers.forEach(player => {
    const classCode = player.class_code || context?.teacherSession?.classCode || "Unassigned";
    const classId = getFallbackClassId(classCode);
    if (!classMap.has(classId)) {
      classMap.set(classId, {
        id: classId,
        name: classCode === "Unassigned" ? "Unassigned class" : `Class ${classCode}`,
        class_code: classCode === "Unassigned" ? "" : classCode,
        school_id: context?.teacher?.schoolId || null,
        fallback: true
      });
    }
  });

  if (context?.teacherSession?.classCode) {
    const classId = getFallbackClassId(context.teacherSession.classCode);
    if (!classMap.has(classId)) {
      classMap.set(classId, {
        id: classId,
        name: `Class ${context.teacherSession.classCode}`,
        class_code: context.teacherSession.classCode,
        school_id: context?.teacher?.schoolId || null,
        fallback: true
      });
    }
  }

  const availableClasses = [...classMap.values()].sort((a, b) => {
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
  const requestedClassId = dashboardFilter.classId || "all";
  const selectedClassId = requestedClassId !== "all" && availableClasses.some(row => row.id === requestedClassId)
    ? requestedClassId
    : "all";
  const selectedCodes = selectedClassId === "all"
    ? null
    : new Set(availableClasses.filter(row => row.id === selectedClassId).map(row => row.class_code || ""));
  const profileRows = selectedCodes
    ? latestPlayers.filter(player => selectedCodes.has(player.class_code || ""))
    : latestPlayers;
  const students = profileRows.map(player => {
    const classCode = player.class_code || context?.teacherSession?.classCode || "";
    return {
      id: player.id,
      display_name: player.player_name || "Student",
      username: player.username || player.player_name || "Student",
      created_at: player.timestamp || new Date().toISOString(),
      last_login_at: player.timestamp || null,
      class_id: getFallbackClassId(classCode),
      is_active: true
    };
  });
  const studentRecordFocus = dashboardFilter.studentRecordFocus || "active";
  const filteredStudents = students.filter(student => studentMatchesRecordFocus(student, studentRecordFocus));
  const selectedStudentId = filteredStudents.some(student => student.id === dashboardFilter.studentId)
    ? dashboardFilter.studentId
    : "all";

  return {
    context,
    availableClasses,
    selectedClassId,
    selectedStudentId,
    studentRecordFocus,
    studentRecordCounts: getStudentRecordCounts(students),
    selectedClassName: selectedClassId === "all"
      ? `All classes at ${context?.teacher?.schoolName || "School not resolved"}`
      : availableClasses.find(row => row.id === selectedClassId)?.name || "Selected class",
    students: filteredStudents,
    moduleProgress: [],
    evidenceRows: [],
    voteRows: [],
    profileRows,
    feedbackRows: [],
    reviewRows: [],
    isFallback: true
  };
}

function getStudentDisplayName(student) {
  return student?.display_name || student?.username || "Student";
}

function renderTeacherClassSelector(teacherData, studentRows = []) {
  const selector = document.getElementById("teacher-class-selector");
  const studentSelector = document.getElementById("teacher-student-selector");
  const studentStatusSelector = document.getElementById("teacher-student-status-selector");
  const summary = document.getElementById("teacher-class-summary");
  const note = document.getElementById("teacher-class-scope-note");
  if (!selector || !summary || !note) return;

  const classes = teacherData?.availableClasses || [];
  const selectedClassId = teacherData?.selectedClassId || "all";
  const dashboardFilter = getTeacherDashboardFilter();
  const selectedStudentId = teacherData?.selectedStudentId || dashboardFilter.studentId || "all";
  const studentRecordFocus = teacherData?.studentRecordFocus || dashboardFilter.studentRecordFocus || "active";
  const recordCounts = teacherData?.studentRecordCounts || getStudentRecordCounts(studentRows);
  const selectedStudent = studentRows.find(student => student.id === selectedStudentId);
  const selectedClassName = selectedClassId === "all"
    ? "All classes"
    : teacherData?.selectedClassName || classes.find(classroom => classroom.id === selectedClassId)?.name || "Selected class";
  const currentRecordOption = STUDENT_RECORD_STATUS_OPTIONS.find(option => option.id === studentRecordFocus) || STUDENT_RECORD_STATUS_OPTIONS[0];
  const classById = new Map(classes.map(classroom => [classroom.id, classroom]));

  selector.innerHTML = [
    `<option value="all" ${selectedClassId === "all" ? "selected" : ""}>All Classes At School</option>`,
    ...classes.map(classroom => `<option value="${classroom.id}" ${classroom.id === selectedClassId ? "selected" : ""}>${escapeHtml(classroom.name)} (${escapeHtml(classroom.class_code || "No code")})</option>`)
  ].join("");

  if (studentStatusSelector) {
    studentStatusSelector.innerHTML = STUDENT_RECORD_STATUS_OPTIONS.map(option => {
      const count = option.id === "all"
        ? recordCounts.total
        : option.id === "inactive"
          ? (recordCounts.inactive || 0) + (recordCounts.deleted || 0)
          : recordCounts[option.id] || 0;
      return `<option value="${option.id}" ${option.id === studentRecordFocus ? "selected" : ""}>${escapeHtml(option.label)} (${count})</option>`;
    }).join("");
    studentStatusSelector.onchange = () => {
      setTeacherDashboardFilter({
        studentRecordFocus: studentStatusSelector.value,
        studentId: "all"
      });
      initDashboards().catch(console.error);
    };
  }

  if (studentSelector) {
    const sortedStudents = [...studentRows].sort((a, b) => getStudentDisplayName(a).localeCompare(getStudentDisplayName(b)));
    studentSelector.innerHTML = [
      `<option value="all" ${selectedStudentId === "all" || !selectedStudent ? "selected" : ""}>All Students</option>`,
      ...sortedStudents.map(student => {
        const state = getStudentRecordState(student);
        const stateLabel = state.status === "active" ? "" : ` - ${state.label}`;
        const classCodeLabel = selectedClassId === "all" && student.class_id
          ? ` - ${classById.get(student.class_id)?.class_code || "No class"}`
          : "";
        return `<option value="${student.id}" ${student.id === selectedStudentId ? "selected" : ""}>${escapeHtml(getStudentDisplayName(student))}${escapeHtml(classCodeLabel)}${escapeHtml(stateLabel)}</option>`;
      })
    ].join("");
    studentSelector.disabled = !sortedStudents.length;
    studentSelector.onchange = () => {
      setTeacherDashboardFilter({
        studentId: studentSelector.value
      });
      initDashboards().catch(console.error);
    };
  }

  summary.value = selectedStudent
    ? `${selectedClassName} - ${getStudentDisplayName(selectedStudent)}`
    : `${selectedClassName} - ${currentRecordOption.label.toLowerCase()}`;
  const hiddenNote = studentRecordFocus === "active" && recordCounts.hidden
    ? ` ${recordCounts.hidden} inactive/deleted student record${recordCounts.hidden === 1 ? "" : "s"} hidden.`
    : "";
  note.textContent = classes.length
    ? `${classes.length} class option(s) found. Showing ${studentRows.length} ${getStudentRecordScopeLabel(studentRecordFocus, studentRows.length)} in the current scope.${hiddenNote}`
    : "No live class records found yet. The dashboard will still show any saved local student profiles it can find.";

  selector.onchange = () => {
    setTeacherDashboardFilter({
      scope: selector.value === "all" ? "all" : "class",
      classId: selector.value,
      studentId: "all"
    });
    initDashboards().catch(console.error);
  };
}

async function persistClassModuleStatusToSupabase(classId, moduleId, status) {
  if (!classId || classId === "all" || classId === "global" || String(classId).startsWith("fallback-")) return;
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return;
  const { error } = await supabase
    .from("class_modules")
    .upsert({
      class_id: classId,
      module_id: moduleId,
      is_enabled: status === "active",
      assigned_at: new Date().toISOString()
    }, { onConflict: "class_id,module_id" });
  if (error) console.warn("Class module status saved locally but not to Supabase:", error.message || error);
}

function getModuleAvailabilityScope(teacherData, selectedStudent = null) {
  if (selectedStudent?.class_id) return selectedStudent.class_id;
  const selectedClassId = teacherData?.selectedClassId || "all";
  return selectedClassId === "all" ? "global" : selectedClassId;
}

function renderTeacherModuleAvailability(teacherData, students = [], selectedStudent = null) {
  const container = document.getElementById("teacher-module-availability-list");
  if (!container) return;

  const scopeClassId = getModuleAvailabilityScope(teacherData, selectedStudent);
  const classStatuses = getClassModuleStatuses(scopeClassId);
  const effectiveStatuses = getEffectiveModuleStatuses({
    classId: scopeClassId,
    studentId: selectedStudent?.id || ""
  });
  const studentOverrides = getStudentModuleOverrides(selectedStudent?.id || "");
  const classLabel = selectedStudent
    ? `${getStudentDisplayName(selectedStudent)} override`
    : scopeClassId === "global"
      ? "All classes default"
      : (teacherData?.availableClasses || []).find(row => row.id === scopeClassId)?.name || "Selected class";

  container.innerHTML = `
    <div class="module-availability-summary">
      <strong>${escapeHtml(classLabel)}</strong>
      <p>${selectedStudent ? "Set a student override only when their access should differ from the class." : "Set the default access state for the current class view."}</p>
      <div class="pill-row">
        ${DASHBOARD_MODULES.map(module => `<span class="pill">${escapeHtml(module.shortTitle)}: ${escapeHtml(getModuleStatusLabel(effectiveStatuses[module.id]))}</span>`).join("")}
      </div>
    </div>
    ${DASHBOARD_MODULES.map(module => {
      const status = classStatuses[module.id];
      const effectiveStatus = effectiveStatuses[module.id];
      const override = studentOverrides[module.id] || "inherit";
      return `
        <article class="module-availability-card module-availability-card--${escapeHtml(effectiveStatus)}">
          <div class="module-availability-card-header">
            <div>
              <span class="kicker">${escapeHtml(module.currentLabel)}</span>
              <h3>${escapeHtml(module.title)}</h3>
              <p>${escapeHtml(getModuleStatusDescription(effectiveStatus))}</p>
            </div>
            <button
              class="module-availability-switch ${status === "active" ? "is-on" : ""}"
              type="button"
              data-module-class-toggle="${escapeHtml(module.id)}"
              aria-pressed="${status === "active" ? "true" : "false"}"
            >
              <span>${status === "active" ? "On" : "Off"}</span>
            </button>
          </div>
          <label>
            <span>Class default status</span>
            <select data-module-class-status="${escapeHtml(module.id)}">
              ${["active", "inactive", "archived"].map(value => `<option value="${value}" ${value === status ? "selected" : ""}>${escapeHtml(getModuleStatusLabel(value))}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Student override</span>
            <select data-module-student-status="${escapeHtml(module.id)}" ${selectedStudent ? "" : "disabled"}>
              <option value="inherit" ${override === "inherit" ? "selected" : ""}>Inherit class default</option>
              ${["active", "inactive", "archived"].map(value => `<option value="${value}" ${value === override ? "selected" : ""}>${escapeHtml(getModuleStatusLabel(value))}</option>`).join("")}
            </select>
          </label>
        </article>
      `;
    }).join("")}
  `;

  container.querySelectorAll("[data-module-class-toggle]").forEach(button => {
    button.addEventListener("click", event => {
      const moduleId = event.currentTarget.dataset.moduleClassToggle;
      const currentStatus = classStatuses[moduleId] || "inactive";
      const nextStatus = currentStatus === "active" ? "inactive" : "active";
      setClassModuleStatus(scopeClassId, moduleId, nextStatus);
      persistClassModuleStatusToSupabase(scopeClassId, moduleId, nextStatus).catch(console.warn);
      initDashboards().catch(console.error);
    });
  });

  container.querySelectorAll("[data-module-class-status]").forEach(select => {
    select.addEventListener("change", event => {
      const moduleId = event.currentTarget.dataset.moduleClassStatus;
      const status = event.currentTarget.value;
      setClassModuleStatus(scopeClassId, moduleId, status);
      persistClassModuleStatusToSupabase(scopeClassId, moduleId, status).catch(console.warn);
      initDashboards().catch(console.error);
    });
  });

  container.querySelectorAll("[data-module-student-status]").forEach(select => {
    select.addEventListener("change", event => {
      const moduleId = event.currentTarget.dataset.moduleStudentStatus;
      setStudentModuleOverride(selectedStudent?.id || "", moduleId, event.currentTarget.value);
      initDashboards().catch(console.error);
    });
  });
}

function renderTeacherDashboardFocusStrip(moduleStatuses, activeFocus = "active") {
  const container = document.getElementById("teacher-dashboard-focus-strip");
  if (!container) return;
  const focusOptions = [
    { id: "active", label: "Active Modules", note: "Default current teaching view" },
    { id: "est-prep", label: "EST Prep", note: "Assessment prep only" },
    { id: "initiative", label: "Initiative", note: "Unlock Gate plus Proof Drop" },
    { id: "employability-skills", label: "Employability", note: "STAR portfolio only" },
    { id: "archived", label: "Archived", note: "Term 1 and prototype history" },
    { id: "cumulative", label: "Cumulative", note: "All module patterns" }
  ];
  const activeIds = getTeacherVisibleModuleIds(moduleStatuses, activeFocus);
  container.innerHTML = focusOptions.map(option => `
    <button class="dashboard-focus-chip ${option.id === activeFocus ? "is-active" : ""}" type="button" data-dashboard-focus="${escapeHtml(option.id)}">
      <strong>${escapeHtml(option.label)}</strong>
      <span>${escapeHtml(option.note)}</span>
    </button>
  `).join("") + `
    <div class="dashboard-focus-current">
      <span>Now showing</span>
      <strong>${activeIds.length ? activeIds.map(id => getModuleById(id)?.shortTitle || getModuleLabel(id)).join(", ") : "No active modules"}</strong>
    </div>
  `;
  container.querySelectorAll("[data-dashboard-focus]").forEach(button => {
    button.addEventListener("click", () => {
      setTeacherDashboardFilter({ moduleFocus: button.dataset.dashboardFocus });
      initDashboards().catch(console.error);
    });
  });
}

async function renderStudentLiveData(players, skillsData) {
  const session = getCurrentPlayerSession();
  const authState = getAuthPrototypeState();
  const avatarProfile = getCurrentStudentAvatarProfile(authState, session);
  const avatarCompletion = calculateAvatarProfileCompletion(avatarProfile);
  const record = getCurrentPlayerRecord(players, session);
  const history = getPlayerHistory(players, session);
  const latestPlayers = dedupeLatestPlayers(players);
  const moduleProgressById = await getCurrentStudentModuleProgress();
  const lifelongProgressRow = moduleProgressById["lifelong-learning"];
  const estProgressRow = moduleProgressById["est-prep"];
  const initiativeProgressRow = moduleProgressById.initiative;
  const moduleStatuses = getCurrentStudentModuleStatuses();
  const activeModuleIds = DASHBOARD_MODULES.filter(module => moduleStatuses[module.id] === "active").map(module => module.id);
  const hasPlayerProgress = hasMeaningfulPlayerProgress(record);
  const hasLifelongProgress = hasMeaningfulModuleProgress(lifelongProgressRow);
  const hasESTProgress = hasMeaningfulModuleProgress(estProgressRow) || hasLocalESTProgress(session);
  const hasInitiativeProgress = hasMeaningfulModuleProgress(initiativeProgressRow);
  const hasAvatarProgress = avatarCompletion > 0;
  const hasAnySavedProgress = hasPlayerProgress || hasLifelongProgress || hasESTProgress || hasInitiativeProgress || hasAvatarProgress;
  const progressRecord = hasPlayerProgress ? record : null;
  let reviewRows = await getCurrentStudentResponseReviews();
  let skillEvidenceEntries = syncSkillStarEvidenceWithReviews(getSkillStarEvidenceEntries(), reviewRows);
  const pendingReviewSync = await ensurePendingSkillStarEvidenceReviews(skillEvidenceEntries, reviewRows);
  if (pendingReviewSync.changed) {
    reviewRows = await getCurrentStudentResponseReviews();
    skillEvidenceEntries = syncSkillStarEvidenceWithReviews(pendingReviewSync.entries, reviewRows);
  }
  const skillEvidenceMap = getSkillStarEvidenceMap(skillEvidenceEntries);
  setupStudentPortfolioButton(skillsData, skillEvidenceEntries, moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID]);
  const progressMap = applySkillEvidenceProgress(deriveEmployabilityProgress(progressRecord), skillEvidenceMap);
  const employabilityScore = average(Object.values(progressMap));
  const weakestSkillId = getWeakestSkill(progressMap)[0];
  const strongestSkillId = getStrongestSkill(progressMap)[0];
  const weakestSkill = skillsData.categories.find(category => category.id === weakestSkillId);
  const strongestSkill = skillsData.categories.find(category => category.id === strongestSkillId);
  const overallMastery = Math.round((
    Number(progressRecord?.tech_mastery || 0) +
    Number(progressRecord?.climate_mastery || 0) +
    Number(progressRecord?.demo_mastery || 0) +
    Number(progressRecord?.economic_mastery || 0)
  ) / 4);
  const moduleCompletion = Math.min(100, Number(progressRecord?.years_played || 0) * 18);
  const taxPaid = Number(record?.tax_paid ?? session?.taxPaid ?? Math.floor(Number(record?.cumulative_net_worth || 0) * 0.1));
  const assetCount = await getCurrentStudentAssetCount();
  const assetsOwned = assetCount ?? Math.max(0, Math.floor(Number(record?.cumulative_net_worth || 0) / 25000));
  const lifelongProgress = Number(lifelongProgressRow?.completion_percent || 0);
  const lifelongMastery = Number(lifelongProgressRow?.mastery_percent || 0);
  const estProgress = Number(estProgressRow?.completion_percent || 0);
  const estMastery = Number(estProgressRow?.mastery_percent || 0);
  const initiativeProgress = Number(initiativeProgressRow?.completion_percent || 0);
  const initiativeMastery = Number(initiativeProgressRow?.mastery_percent || 0);
  const employabilityPortfolioProgress = calculateStarReflectionCompletion(skillEvidenceEntries);
  const employabilityPortfolioMastery = employabilityScore;
  const moduleCompletionMap = {
    "avatar-studio": avatarCompletion,
    "megatrends": moduleCompletion,
    "lifelong-learning": lifelongProgress,
    "est-prep": estProgress,
    "initiative": initiativeProgress,
    "employability-skills": employabilityPortfolioProgress
  };
  const overallModuleCompletion = Math.round(average((activeModuleIds.length ? activeModuleIds : DASHBOARD_MODULES.map(module => module.id)).map(moduleId => moduleCompletionMap[moduleId] || 0)));

  const signedInStudentName = authState?.studentLogin?.displayName || authState?.studentLogin?.username || session?.playerName || "";
  const dashboardStudentName = record?.player_name || signedInStudentName;
  setText("student-hero-title", dashboardStudentName ? `${dashboardStudentName}'s Career Empire` : "Build your future, not just your score.");
  setText(
    "student-hero-subtitle",
    hasPlayerProgress
      ? `${record.career_title || "Professional"} from ${record.school_name || "your class"} with ${overallMastery}% overall megatrend mastery and ${record.years_played || 0} years played.`
      : authState?.studentLogin?.username
        ? authState?.studentLogin?.demo
          ? `Demo student mode is active for ${authState.studentLogin.displayName || authState.studentLogin.username}. Explore the full student journey, spend in the shop, and test modules without saving to live student records.`
          : authState?.studentLogin?.preview
          ? `Teacher preview mode is active for ${authState.studentLogin.displayName || authState.studentLogin.username}. Explore the student experience without affecting live student records.`
          : `Signed in as ${authState.studentLogin.username}. Launch the game to begin building live module progress and shared career stats.`
        : "Launch the Megatrends game first, then come back here to see your live player profile."
  );

  const badgeStack = document.getElementById("student-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = hasPlayerProgress ? [
      renderBadge(`Salary: ${formatCurrency(record.annual_salary)}`, STUDENT_STATUS_ICONS.salary, "Salary"),
      renderBadge(`Net Worth: ${formatCurrency(record.cumulative_net_worth)}`, STUDENT_STATUS_ICONS.netWorth, "Net worth"),
      renderBadge(`Work-Life Balance: ${record.work_life_balance || 0}%`, STUDENT_STATUS_ICONS.workLife, "Work-life balance"),
      renderBadge(`Job Security: ${record.job_security || 0}%`, STUDENT_STATUS_ICONS.jobSecurity, "Job security"),
      renderBadge(`Strongest Skill: ${strongestSkill?.title || "Not yet clear"}`, strongestSkill?.logoPath, strongestSkill?.title),
      renderBadge(`Class Code: ${record.class_code || "Not joined"}`)
    ].join("") : authState?.studentLogin?.username
      ? [
        renderBadge(`Student: ${authState.studentLogin.displayName || authState.studentLogin.username}`),
        renderBadge(`Username: ${authState.studentLogin.username}`),
        renderBadge(
          authState?.studentLogin?.demo
            ? "Demo mode • local-only progress"
            : authState?.studentLogin?.preview
              ? "Teacher test-student preview"
              : "Live gameplay stats will appear after the first saved session"
        )
      ].join("")
      : '<span class="badge">No active student session yet</span>';
  }

  setText("student-current-mission-title", hasAnySavedProgress ? "Continue your next move" : "Start your first move");
  setText("student-hub-est-link", hasESTProgress ? "Start here: Continue EST" : "Start here: EST Prep");
  setText("student-hub-avatar-link", hasAvatarProgress ? "Edit Avatar" : "Create Avatar");
  setText("student-focus-text", moduleStatuses.initiative === "active"
    ? "Initiative is active. Clear the Unlock Gate, choose an applied mission, and bank proof that shows understanding rather than time spent only."
    : moduleStatuses["est-prep"] === "active"
    ? "EST Prep is the current active module. Use it to train command verbs, glossary terms, and short-answer structure before the assessment."
    : progressRecord && weakestSkill
      ? `${weakestSkill.title} is your current focus area. The next active module should target this skill more directly.`
      : "Launch an active module to begin skill tracking.");
  if (document.getElementById("student-focus-text") && !hasAnySavedProgress) {
    setText("student-focus-text", moduleStatuses.initiative === "active"
      ? "Initiative is ready next. Use the Unlock Gate and applied mission to create teacher-visible proof."
      : moduleStatuses["est-prep"] === "active"
      ? "EST Prep is ready next. Use it to train command verbs, glossary terms, and short-answer structure before the assessment."
      : "No active module has been assigned yet. Your previous module history will stay visible here.");
  }
  setText("student-overall-completion", `${overallModuleCompletion}%`);
  setText("student-overall-completion-note", activeModuleIds.length ? `Across active module${activeModuleIds.length === 1 ? "" : "s"}: ${activeModuleIds.map(id => getModuleById(id)?.shortTitle || getModuleLabel(id)).join(", ")}.` : "No active modules assigned yet");
  setText("student-employability-score", `${employabilityScore}%`);
  setText("student-tax-paid", formatCurrency(taxPaid));
  setText("student-assets-owned", String(assetsOwned));
  syncStudentPrimaryModuleActions(moduleStatuses);

  const voteLabels = getCommunityVoteLabels();
  const voteKeys = ["climate", "tech", "diversity", "global"];
  const voteCounts = voteKeys.reduce((acc, key) => {
    acc[key] = latestPlayers.filter(player => player.community_vote === key).length;
    return acc;
  }, {});
  const totalVotes = voteKeys.reduce((sum, key) => sum + voteCounts[key], 0);
  const leadingVote = voteKeys
    .map(key => ({ key, count: voteCounts[key] }))
    .sort((a, b) => b.count - a.count)[0];
  renderStudentCommunityBoard({
    currentVoteLabel: voteLabels[record?.community_vote || "none"] || "No community vote yet",
    taxPaid: formatCurrency(taxPaid),
    summary: record?.community_vote && record.community_vote !== "none"
      ? `Ten percent of your gains are helping build your class community. Your current vote is feeding ${voteLabels[record.community_vote]}.`
      : "Your gameplay can help decide where the class fund goes next. Cast a community vote inside modules to shape the outcome.",
    leadingCause: leadingVote?.count ? voteLabels[leadingVote.key] : "No votes yet",
    voteIntro: totalVotes
      ? `${totalVotes} class vote${totalVotes === 1 ? "" : "s"} recorded so far.`
      : "No class votes have been recorded yet.",
    voteRows: voteKeys.map(key => ({
      id: key,
      label: voteLabels[key],
      percent: totalVotes ? Math.round((voteCounts[key] / totalVotes) * 100) : 0
    }))
  });

  renderSkills(skillsData, "student-skill-grid", progressMap, skillEvidenceMap);
  renderStudentResponseReviewNotices(reviewRows);
  renderStudentModules([
    {
      id: "avatar-studio",
      title: "Avatar Studio",
      state: hasAvatarProgress ? `${getModuleStatusLabel(moduleStatuses["avatar-studio"])} profile saved` : getModuleStatusLabel(moduleStatuses["avatar-studio"]),
      summary: hasAvatarProgress
        ? `Your future-self avatar is ${avatarCompletion}% complete${avatarProfile?.occupation ? ` with ${avatarProfile.occupation} in mind` : ""}.`
        : "Create a future-self avatar that can carry shop unlocks, interview looks, career gear, and profile evidence across Career Empire.",
      progress: avatarCompletion,
      mastery: avatarCompletion,
      variant: "green",
      spotlight: moduleStatuses["avatar-studio"] === "active",
      logoHtml: renderAvatarModuleLogo(avatarProfile),
      badgeLabel: hasAvatarProgress ? "Profile saved" : "Future self",
      launchPath: "../modules/avatar/index.html",
      launchLabel: hasAvatarProgress ? "Edit Avatar" : "Create Avatar",
      available: moduleStatuses["avatar-studio"] === "active",
      unavailableLabel: moduleStatuses["avatar-studio"] === "archived" ? "Archived" : "Not assigned",
      tags: [getModuleStatusLabel(moduleStatuses["avatar-studio"]), "Future self", "Shop unlocks"]
    },
    {
      id: "megatrends",
      title: "Megatrends",
      state: hasPlayerProgress ? `${getModuleStatusLabel(moduleStatuses["megatrends"])} history saved` : getModuleStatusLabel(moduleStatuses["megatrends"]),
      summary: hasPlayerProgress ? "Your Term 1 Megatrends record is preserved in your portfolio history." : "This module is not part of the current active teaching focus unless your teacher switches it on.",
      progress: moduleCompletion,
      mastery: overallMastery,
      variant: "",
      spotlight: moduleStatuses["megatrends"] === "active",
      logoPath: skillsData.categories.find(category => category.id === "digital-literacy")?.logoPath,
      logoLabel: "Digital Literacy",
      imagePath: "../Assets/Images and Animations/Student Hub/module-megatrends-thumb.png",
      launchPath: buildMegatrendsLaunchPath(),
      launchLabel: "Open Megatrends",
      available: moduleStatuses["megatrends"] === "active",
      unavailableLabel: moduleStatuses["megatrends"] === "archived" ? "Archived" : "Not assigned",
      tags: [getModuleStatusLabel(moduleStatuses["megatrends"]), "Career stats", "History kept"]
    },
    {
      id: "lifelong-learning",
      title: "Lifelong Learning",
      state: hasLifelongProgress ? `${getModuleStatusLabel(moduleStatuses["lifelong-learning"])} progress saved` : getModuleStatusLabel(moduleStatuses["lifelong-learning"]),
      summary: "Prototype reflection work is preserved for portfolio evidence, but access depends on the current teacher setting.",
      progress: lifelongProgress,
      mastery: lifelongMastery,
      variant: "green",
      spotlight: moduleStatuses["lifelong-learning"] === "active",
      logoPath: skillsData.categories.find(category => category.id === "time-management")?.logoPath,
      logoLabel: "Time Management",
      imagePath: "../Assets/Images and Animations/Student Hub/module-lifelong-learning-thumb.png",
      launchPath: "../modules/lifelong-learning/index.html",
      launchLabel: hasLifelongProgress ? "Continue Lifelong Learning" : "Start Lifelong Learning",
      available: moduleStatuses["lifelong-learning"] === "active",
      unavailableLabel: moduleStatuses["lifelong-learning"] === "archived" ? "Archived" : "Not assigned",
      tags: [getModuleStatusLabel(moduleStatuses["lifelong-learning"]), "Planning", "Reflection"]
    },
    {
      id: "initiative",
      title: "Initiative",
      state: hasInitiativeProgress ? `${getModuleStatusLabel(moduleStatuses.initiative)} evidence saved` : getModuleStatusLabel(moduleStatuses.initiative),
      summary: "Scan the five initiative signals, clear the Unlock Gate, then choose an applied mission with teacher-visible time, progress, proof, and memory evidence.",
      progress: initiativeProgress,
      mastery: initiativeMastery,
      variant: "green",
      spotlight: moduleStatuses.initiative === "active",
      logoPath: skillsData.categories.find(category => category.id === "teamwork")?.logoPath || skillsData.categories.find(category => category.id === "communication")?.logoPath,
      logoLabel: "Teamwork",
      imagePath: "../Assets/Images and Animations/Initiative Scenes/Initiative topic scene neutral.png",
      launchPath: "../modules/initiative/index.html",
      launchLabel: hasInitiativeProgress ? "Continue Initiative" : "Start Initiative",
      available: moduleStatuses.initiative === "active",
      unavailableLabel: moduleStatuses.initiative === "archived" ? "Archived" : "Not assigned",
      tags: [getModuleStatusLabel(moduleStatuses.initiative), "Unlock Gate", "Proof Drop"]
    },
    {
      id: "est-prep",
      title: "EST Prep",
      state: hasESTProgress ? "Progress saved" : "Ready to start",
      summary: "Train for the upcoming EST by decoding questions, locking in glossary terms, and building mark-worthy responses.",
      progress: estProgress,
      mastery: estMastery,
      variant: "",
      spotlight: moduleStatuses["est-prep"] === "active",
      startHere: true,
      logoPath: skillsData.categories.find(category => category.id === "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking",
      imagePath: "../Assets/Images and Animations/Student Hub/module-est-prep-thumb.png",
      launchPath: "../modules/est-prep/index.html",
      launchLabel: hasESTProgress ? "Continue EST Prep" : "Start here: EST Prep",
      available: moduleStatuses["est-prep"] === "active",
      unavailableLabel: moduleStatuses["est-prep"] === "archived" ? "Archived" : "Not assigned",
      tags: ["Start here", getModuleStatusLabel(moduleStatuses["est-prep"]), "Command verbs", "Short answer"]
    },
    {
      id: EMPLOYABILITY_PORTFOLIO_MODULE_ID,
      title: "Employability Skills Portfolio",
      state: skillEvidenceEntries.length
        ? `${skillEvidenceEntries.length} STAR reflection${skillEvidenceEntries.length === 1 ? "" : "s"} saved`
        : getModuleStatusLabel(moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID]),
      summary: "Log STAR reflections against the six employability capabilities. Your examples stay chronological and also appear under every skill tag you choose.",
      progress: employabilityPortfolioProgress,
      mastery: employabilityPortfolioMastery,
      variant: "green",
      spotlight: moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID] === "active",
      logoPath: skillsData.categories.find(category => category.id === strongestSkillId)?.logoPath || skillsData.categories.find(category => category.id === "communication")?.logoPath,
      logoLabel: strongestSkill?.title || "Employability Skills",
      action: "portfolio",
      launchLabel: "View Portfolio",
      available: moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID] === "active",
      unavailableLabel: moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID] === "archived" ? "Archived" : "Not assigned",
      tags: [getModuleStatusLabel(moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID]), "STAR reflections", "Student tags"]
    }
  ]);
  setupStudentPortfolioButton(skillsData, skillEvidenceEntries, moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID]);
  renderStudentShopPreview([
    {
      title: "Global Shop",
      state: assetsOwned ? `${assetsOwned} owned` : "Ready to build",
      summary: assetsOwned
        ? "Your shared inventory is live. Open the shop to buy more upgrades that carry across the platform."
        : "Buy study, tool, transport, and lifestyle upgrades that connect to the wider Career Empire build.",
      spotlight: moduleStatuses["megatrends"] === "active",
      imagePath: "../Assets/Images and Animations/Global Shop/global-shop-student-hub.png",
      launchPath: "../shop/index.html",
      launchLabel: "Open Global Shop",
      tags: ["Shared inventory", "Cross-module", "Life build"]
    }
  ]);
  const economyTimeline = buildEconomyTimelineItems(session);
  const meaningfulHistory = history.filter(hasMeaningfulPlayerProgress);
  renderStudentTimeline(economyTimeline.length ? economyTimeline : meaningfulHistory.slice(0, 3).map(entry => ({
    title: `${entry.checkpoint || "checkpoint"} • ${new Date(entry.timestamp).toLocaleString()}`,
    detail: `Salary ${formatCurrency(entry.annual_salary)}, net worth ${formatCurrency(entry.cumulative_net_worth)}, mastery ${average([
      Number(entry.tech_mastery || 0),
      Number(entry.climate_mastery || 0),
      Number(entry.demo_mastery || 0),
      Number(entry.economic_mastery || 0)
    ])}%`
  })));
}

function renderTeacherLiveData(players, skillsData, teacherData = null) {
  const teacherContext = getActiveTeacherContext();
  const fallbackTeacherData = buildFallbackTeacherDashboardData(players, teacherContext);
  const hasTeacherScope = Boolean(
    teacherData?.context?.teacher?.schoolId
    || teacherContext?.teacher?.schoolId
    || teacherContext?.teacherLogin?.email
  );
  const shouldUseFallbackData = !hasTeacherScope && (!teacherData || (!(teacherData.availableClasses || []).length && (players || []).length));
  const safeTeacherData = shouldUseFallbackData ? fallbackTeacherData : (teacherData || {
    context: teacherContext,
    availableClasses: [],
    selectedClassId: "all",
    selectedClassName: "No classes found",
    selectedStudentId: "all",
    studentRecordFocus: dashboardFilter.studentRecordFocus || "active",
    studentRecordCounts: getStudentRecordCounts([]),
    students: [],
    moduleProgress: [],
    evidenceRows: [],
    voteRows: [],
    profileRows: [],
    feedbackRows: [],
    reviewRows: []
  });
  const dashboardContext = safeTeacherData.context || teacherContext;
  const skillCategories = Array.isArray(skillsData?.categories) ? skillsData.categories : [];
  const dashboardFilter = getTeacherDashboardFilter();

  const allStudents = safeTeacherData?.students || [];
  renderTeacherClassSelector(safeTeacherData, allStudents);

  const selectedClassId = safeTeacherData?.selectedClassId || "all";
  const selectedStudentId = safeTeacherData?.selectedStudentId || getTeacherDashboardFilter().studentId || "all";
  const selectedStudent = selectedStudentId !== "all"
    ? allStudents.find(student => student.id === selectedStudentId) || null
    : null;
  const moduleScopeClassId = getModuleAvailabilityScope(safeTeacherData, selectedStudent);
  const moduleStatuses = getEffectiveModuleStatuses({
    classId: moduleScopeClassId,
    studentId: selectedStudent?.id || ""
  });
  const moduleFocus = dashboardFilter.moduleFocus || "active";
  const visibleModuleIds = getTeacherVisibleModuleIds(moduleStatuses, moduleFocus);
  const visibleModuleIdSet = new Set(visibleModuleIds);
  const includeMegatrendsData = visibleModuleIdSet.has("megatrends");
  renderTeacherModuleAvailability(safeTeacherData, allStudents, selectedStudent);
  renderTeacherDashboardFocusStrip(moduleStatuses, moduleFocus);
  const selectedClassCode = selectedClassId !== "all"
    ? (safeTeacherData.availableClasses || []).find(row => row.id === selectedClassId)?.class_code || ""
    : "";
  const classCodeFilter = selectedClassId === "all"
    ? ""
    : selectedClassCode || dashboardContext.classroom?.classCode || dashboardContext.teacherSession?.classCode || "";
  const allLatestPlayers = safeTeacherData?.profileRows?.length
    ? dedupeLatestPlayers(safeTeacherData.profileRows)
    : dedupeLatestPlayers(players).filter(player => !classCodeFilter || player.class_code === classCodeFilter);
  const scopedLatestPlayers = selectedStudent
    ? allLatestPlayers.filter(player => player.id === selectedStudent.id)
    : allLatestPlayers;
  const latestPlayers = includeMegatrendsData ? scopedLatestPlayers : [];
  const students = selectedStudent ? [selectedStudent] : allStudents;
  const visibleStudentIds = new Set(students.map(student => student.id).filter(Boolean));
  const studentRecordFocus = safeTeacherData?.studentRecordFocus || dashboardFilter.studentRecordFocus || "active";
  const studentRecordOption = STUDENT_RECORD_STATUS_OPTIONS.find(option => option.id === studentRecordFocus) || STUDENT_RECORD_STATUS_OPTIONS[0];
  const allModuleProgressRows = safeTeacherData?.moduleProgress || [];
  const allEvidenceRows = safeTeacherData?.evidenceRows || [];
  const moduleProgressRowsBase = selectedStudent
    ? allModuleProgressRows.filter(row => row.student_id === selectedStudent.id)
    : allModuleProgressRows;
  const moduleProgressRows = moduleProgressRowsBase
    .filter(row => visibleModuleIdSet.has(row.module_id || row.module_slug));
  const evidenceRowsBase = selectedStudent
    ? allEvidenceRows.filter(row => row.student_id === selectedStudent.id)
    : allEvidenceRows;
  const voteRows = safeTeacherData?.voteRows || [];
  const feedbackRows = safeTeacherData?.feedbackRows || [];
  const allReviewRows = safeTeacherData?.reviewRows || [];
  let reviewRows = dedupeTeacherReviewRows(allReviewRows
    .filter(row => {
      return visibleModuleIdSet.has(getReviewModuleId(row));
    })
    .filter(isTeacherReviewableStudentResponse));
  const megatrendsProgressRows = moduleProgressRows.filter(row => (row.module_id || row.module_slug) === "megatrends");
  const estProgressRows = moduleProgressRows.filter(row => (row.module_id || row.module_slug) === "est-prep");
  const initiativeProgressRows = moduleProgressRows.filter(row => (row.module_id || row.module_slug) === "initiative");
  const lifelongProgressRows = moduleProgressRows.filter(row => (row.module_id || row.module_slug) === "lifelong-learning");
  const parsedEvidenceRows = evidenceRowsBase.map(row => ({
    row,
    payload: parseStructuredEvidence(row)
  }))
    .filter(entry => visibleModuleIdSet.has(getEvidenceModuleId(entry.row, entry.payload)))
    .sort((a, b) => parseTime(b.row?.created_at) - parseTime(a.row?.created_at));
  const evidencePayloadById = new Map(allEvidenceRows
    .map(row => ({
      row,
      payload: parseStructuredEvidence(row)
    }))
    .filter(entry => visibleModuleIdSet.has(getEvidenceModuleId(entry.row, entry.payload)))
    .map(entry => [entry.row.id, entry.payload]));
  reviewRows = dedupeTeacherReviewRows(reviewRows.filter(row => {
    const payload = evidencePayloadById.get(row.source_evidence_id);
    if (!payload) return true;
    return !matchesReviewExcludedText(row.raw_response_text || row.approved_response_text, [
      payload.sample_response,
      payload.sample_responses,
      payload.model_response,
      payload.strong_answer
    ]);
  }));
  const capabilityEvidenceEntries = buildCapabilityEvidenceEntries(parsedEvidenceRows, reviewRows, skillCategories);
  const evidenceRows = parsedEvidenceRows.map(entry => entry.row);
  const estEvidenceRows = evidenceRows.filter(row => (row.module_id || row.module_slug) === "est-prep");
  const skillProgressRows = latestPlayers.map(deriveEmployabilityProgress);
  const classSkillMap = {
    "communication": average(skillProgressRows.map(row => row.communication || 0)),
    "digital-literacy": average(skillProgressRows.map(row => row["digital-literacy"] || 0)),
    "teamwork": average(skillProgressRows.map(row => row.teamwork || 0)),
    "time-management": average(skillProgressRows.map(row => row["time-management"] || 0)),
    "critical-thinking": average(skillProgressRows.map(row => row["critical-thinking"] || 0)),
    "problem-solving": average(skillProgressRows.map(row => row["problem-solving"] || 0))
  };
  const weakestSkillId = getWeakestSkill(classSkillMap)[0];
  const weakestSkill = skillCategories.find(category => category.id === weakestSkillId);
  const getPlayerMastery = player => average([
    Number(player.tech_mastery || 0),
    Number(player.climate_mastery || 0),
    Number(player.demo_mastery || 0),
    Number(player.economic_mastery || 0)
  ]);
  const moduleMasteries = students.map(student => {
    const player = latestPlayers.find(entry => entry.id === student.id);
    if (player) return getPlayerMastery(player);
    const studentProgress = moduleProgressRows.filter(row => row.student_id === student.id);
    return average(studentProgress.map(row => Number(row.mastery_percent || 0)));
  }).filter(value => value > 0);
  let studentsOnTrack = moduleMasteries.filter(value => value >= 50).length;
  let studentsAtRisk = moduleMasteries.filter(value => value < 35).length;
  const evidenceCount = evidenceRows.length;
  const evidenceScores = parsedEvidenceRows
    .map(entry => getEvidenceScorePercent(entry.row, entry.payload))
    .filter(value => typeof value === "number");
  const averageEvidenceScore = average(evidenceScores);
  const classFund = latestPlayers.reduce((sum, player) => sum + Number(player.tax_paid || 0), 0);
  let classMastery = average(moduleMasteries);
  let averageSecurity = average(latestPlayers.map(player => Number(player.job_security || 0)));
  const loggedInStudents = students.filter(student => student.last_login_at).length;
  const moduleCompletion = average(moduleProgressRows.map(row => Number(row.completion_percent || 0)));
  const moduleMastery = average(moduleProgressRows.map(row => Number(row.mastery_percent || 0)));
  if (isPromoTeacherDashboardMode()) {
    studentsOnTrack = 14;
    studentsAtRisk = 2;
    classMastery = Math.max(classMastery, 78);
    averageSecurity = Math.max(averageSecurity, 84);
  }
  const totalTaskSeconds = parsedEvidenceRows.reduce((sum, entry) => sum + Number(entry.payload?.duration_seconds || 0), 0);
  const timedEvidenceRows = parsedEvidenceRows.filter(entry => Number(entry.payload?.duration_seconds || 0) > 0);
  const strandTimeMap = timedEvidenceRows.reduce((acc, entry) => {
    const moduleId = getEvidenceModuleId(entry.row, entry.payload);
    const label = getEvidenceTimingLabel(entry.row, entry.payload);
    const key = `${moduleId || "module"}::${label}`;
    if (!acc[key]) {
      acc[key] = {
        moduleLabel: getModuleLabel(moduleId),
        label,
        seconds: 0,
        count: 0,
        scores: [],
        students: new Set()
      };
    }
    acc[key].seconds += Number(entry.payload.duration_seconds || 0);
    acc[key].count += 1;
    acc[key].students.add(entry.row.student_id || getEvidenceStudentName(entry.row));
    const score = getEvidenceScorePercent(entry.row, entry.payload);
    if (typeof score === "number") acc[key].scores.push(score);
    return acc;
  }, {});
  const strandTimeRows = Object.values(strandTimeMap)
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 4)
    .map(row => ({
      label: `${row.moduleLabel}: ${row.label}`,
      seconds: row.seconds,
      variant: row.moduleLabel === "EST Prep" ? "green" : row.moduleLabel === "Lifelong Learning" ? "gold" : "",
      title: `${row.moduleLabel} • ${row.label}`,
      detail: `${formatDurationSeconds(row.seconds)} captured • ${row.count} submission${row.count === 1 ? "" : "s"} • ${row.students.size} student${row.students.size === 1 ? "" : "s"}${row.scores.length ? ` • Average score ${average(row.scores)}%` : ""}`
    }));
  const recentTaskTimeRows = timedEvidenceRows.slice(0, 6).map(({ row, payload }) => {
    const moduleLabel = getModuleLabel(getEvidenceModuleId(row, payload));
    const score = getEvidenceScorePercent(row, payload);
    const topicLabel = payload.topic_group ? ` • ${payload.topic_group}` : "";
    return {
      title: `${getEvidenceStudentName(row)} • ${moduleLabel} • ${payload.task_name || row.evidence_type || "Task"}${topicLabel}`,
      detail: `${formatDurationSeconds(payload.duration_seconds)}${typeof score === "number" ? ` • ${score}%` : ""}${typeof payload.training_score_percent === "number" ? ` • Practice Bay ${Math.round(payload.training_score_percent)}%` : ""} • ${formatDateTime(row.created_at)}`
    };
  });
  const taskTimingRows = [
    ...strandTimeRows,
    ...recentTaskTimeRows
  ];
  const glossaryGapCounts = {};
  const glossaryRowsByStudent = new Map();
  parsedEvidenceRows
    .filter(entry => entry.row.evidence_type === "glossary-check" || entry.payload?.final_round_results || entry.payload?.round_summary)
    .forEach(entry => {
      const studentKey = entry.row.student_id || getEvidenceStudentName(entry.row);
      if (!glossaryRowsByStudent.has(studentKey)) glossaryRowsByStudent.set(studentKey, entry);
    });
  const glossaryStudentRows = [...glossaryRowsByStudent.values()].map(entry => {
    const results = Array.isArray(entry.payload?.final_round_results) ? entry.payload.final_round_results : [];
    const termTotal = results.length;
    const termCorrect = results.filter(item => item.termCorrect).length;
    const keywordCorrect = results.filter(item => item.keywordCorrect).length;
    const gaps = results
      .filter(item => !item.termCorrect || !item.keywordCorrect)
      .map(item => item.term || "Glossary term");
    gaps.forEach(term => {
      glossaryGapCounts[term] = (glossaryGapCounts[term] || 0) + 1;
    });
    const score = getEvidenceScorePercent(entry.row, entry.payload);
    const summary = entry.payload?.round_summary || {};
    return {
      studentName: getEvidenceStudentName(entry.row),
      score: typeof score === "number" ? score : Number(summary.accuracy_percent || 0),
      scoreLabel: typeof score === "number" ? `${score}% recall` : `${Number(summary.accuracy_percent || 0)}% accuracy`,
      termCorrect,
      keywordCorrect,
      termTotal,
      durationLabel: formatDurationSeconds(entry.payload?.duration_seconds),
      gapText: gaps.length ? `Gaps: ${gaps.slice(0, 4).join(", ")}` : "No final-round term gaps recorded."
    };
  }).sort((a, b) => a.score - b.score);
  const glossaryTotals = glossaryStudentRows.reduce((acc, row) => {
    acc.totalTermsCorrect += row.termCorrect;
    acc.totalKeywordCorrect += row.keywordCorrect;
    acc.totalTermsAttempted += row.termTotal;
    return acc;
  }, { totalTermsCorrect: 0, totalKeywordCorrect: 0, totalTermsAttempted: 0 });
  const glossaryData = {
    studentRows: glossaryStudentRows,
    averageScore: average(glossaryStudentRows.map(row => row.score).filter(value => value > 0)),
    totalTermsCorrect: glossaryTotals.totalTermsCorrect,
    totalKeywordCorrect: glossaryTotals.totalKeywordCorrect,
    totalTermsAttempted: glossaryTotals.totalTermsAttempted,
    gapRows: Object.entries(glossaryGapCounts)
      .map(([term, misses]) => ({ term, misses }))
      .sort((a, b) => b.misses - a.misses)
  };
  const longAnswerCandidates = parsedEvidenceRows
    .map(entry => {
      const response = getEvidenceResponseText(entry.row, entry.payload);
      const wordCount = response.split(/\s+/).filter(Boolean).length;
      const score = getEvidenceScorePercent(entry.row, entry.payload);
      const taskLabel = getEvidenceTaskLabel(entry.row, entry.payload);
      return {
        entry,
        response,
        wordCount,
        score,
        taskLabel
      };
    })
    .filter(item => item.wordCount >= 25
      && !String(item.entry.row.evidence_type || "").includes("glossary")
      && isTeacherLongAnswerCandidate(item.entry, item.response));
  const longAnswerScoreAverage = average(longAnswerCandidates.map(item => item.score).filter(value => typeof value === "number"));
  const reviewByEvidenceId = new Map(
    reviewRows
      .filter(row => row.source_evidence_id)
      .map(row => [row.source_evidence_id, row])
  );
  const longAnswerRows = longAnswerCandidates.map(item => {
    const scoreGap = typeof item.score === "number" && longAnswerScoreAverage
      ? item.score - longAnswerScoreAverage
      : null;
    const reviewRow = reviewByEvidenceId.get(item.entry.row.id)
      || reviewRows.find(row => row.student_id === item.entry.row.student_id
        && normaliseWhitespace(row.raw_response_text) === normaliseWhitespace(item.response));
    const moduleLabel = getModuleLabel(getEvidenceModuleId(item.entry.row, item.entry.payload));
    const prompt = getEvidencePromptText(item.entry.row, item.entry.payload);
    const columnKey = [
      moduleLabel,
      item.taskLabel || item.entry.row.evidence_type || "Written response",
      prompt || item.entry.row.evidence_type || "Prompt"
    ].join("::");
    return {
      studentId: item.entry.row.student_id || "",
      studentName: getEvidenceStudentName(item.entry.row),
      meta: `${moduleLabel} • ${item.taskLabel} • ${formatDateTime(item.entry.row.created_at)}`,
      moduleLabel,
      taskLabel: item.taskLabel || "Written response",
      columnKey,
      createdAt: item.entry.row.created_at,
      band: getTeacherAnswerBand(item.score, item.wordCount),
      scoreLabel: typeof item.score === "number" ? `${item.score}%` : "Unscored",
      classCompare: typeof scoreGap === "number" ? `${Math.abs(scoreGap)} points ${scoreGap >= 0 ? "above" : "below"} class average` : "No class score comparison",
      wordCount: item.wordCount,
      prompt,
      response: reviewRow?.status === "approved" && reviewRow.approved_response_text ? reviewRow.approved_response_text : item.response,
      reviewStatus: reviewRow?.status || "pending_review",
      feedback: buildTeacherFeedbackSuggestion(item.response, item.score, longAnswerScoreAverage)
    };
  });
  const engagementRows = students.map(student => {
    const player = latestPlayers.find(entry => entry.id === student.id) || null;
    const studentProgress = moduleProgressRows.filter(row => row.student_id === student.id);
    const studentEvidence = parsedEvidenceRows.filter(entry => entry.row.student_id === student.id);
    const mastery = player
      ? getPlayerMastery(player)
      : average(studentProgress.map(row => Number(row.mastery_percent || 0)));
    const completion = average(studentProgress.map(row => Number(row.completion_percent || 0)));
    const capturedSeconds = studentEvidence.reduce((sum, entry) => sum + Number(entry.payload?.duration_seconds || 0), 0);
    const lastActivity = getLastActivityTime(student, studentProgress, studentEvidence);
    const latestScore = studentEvidence
      .map(entry => getEvidenceScorePercent(entry.row, entry.payload))
      .find(value => typeof value === "number");
    let status = "Active";
    let nextStep = "Continue current pathway and add extension evidence.";
    let sortWeight = 3;
    if (!student.last_login_at && !studentProgress.length && !studentEvidence.length) {
      status = "No interaction";
      nextStep = "Check login details, then start Megatrends or EST Prep in class.";
      sortWeight = 0;
    } else if (mastery && mastery < 40) {
      status = "Needs support";
      nextStep = "Use scaffolded replay on the weakest module before new content.";
      sortWeight = 1;
    } else if (studentProgress.length && completion < 25) {
      status = "Just started";
      nextStep = "Nudge them to finish the first full module stage.";
      sortWeight = 2;
    } else if (typeof latestScore === "number" && latestScore < 60) {
      status = "Review evidence";
      nextStep = "Review latest written evidence and give targeted feedback.";
      sortWeight = 1;
    }
    return {
      studentId: student.id,
      title: `${student.display_name || student.username} • ${status}`,
      detail: [
        `Last activity ${formatRelativeAge(lastActivity)}`,
        student.last_login_at ? `Last login ${formatDateTime(student.last_login_at)}` : "No login recorded",
        `Captured task time ${formatDurationSeconds(capturedSeconds)}`,
        `Progress ${completion || 0}%`,
        `Mastery ${mastery || 0}%`,
        `Next: ${nextStep}`
      ].join(" • "),
      sortWeight,
      lastActivity,
      status
    };
  }).sort((a, b) => a.sortWeight - b.sortWeight || b.lastActivity - a.lastActivity);
  studentsOnTrack = engagementRows.filter(row => ["Active", "Just started"].includes(row.status) && !row.detail.includes("Mastery 0%")).length;
  studentsAtRisk = engagementRows.filter(row => ["No interaction", "Needs support", "Review evidence"].includes(row.status)).length;
  const voteCount = voteRows.length;
  const voteLeader = (() => {
    const counts = voteRows.reduce((acc, row) => {
      const key = row.vote_key || row.cause;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]} votes)` : "No votes yet";
  })();
  const storeRequests = feedbackRows
    .map(normaliseStoreRequest)
    .filter(Boolean)
    .filter(request => feedbackMatchesTeacherScope(request, dashboardContext, classCodeFilter))
    .filter(request => !request.studentId || visibleStudentIds.has(request.studentId));
  const feedbackReviewItems = feedbackRows
    .map(normaliseTeacherFeedback)
    .filter(Boolean)
    .filter(item => feedbackMatchesTeacherScope(item, dashboardContext, classCodeFilter))
    .filter(item => !item.studentId || visibleStudentIds.has(item.studentId));
  const pendingReviewCount = reviewRows.filter(row => row.status === "pending_review").length;
  const approvedReviewCount = reviewRows.filter(row => row.status === "approved" && isShareableReviewEvidence(row)).length;
  const pendingShareableReviewCount = pendingReviewCount;
  const pendingFeedbackCount = feedbackReviewItems.filter(item => normaliseReviewStatus(item.status) === "pending_review").length;
  const pendingStoreRequestCount = storeRequests.filter(item => normaliseReviewStatus(item.status) === "pending_review").length;
  const studentCompareRows = students.map(student => {
    const player = latestPlayers.find(entry => entry.id === student.id) || null;
    const studentProgress = moduleProgressRows.filter(row => row.student_id === student.id);
    const megatrendsProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "megatrends") || null;
    const lifelongProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "lifelong-learning") || null;
    const estProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "est-prep") || null;
    const initiativeProgress = studentProgress.find(row => (row.module_id || row.module_slug) === "initiative") || null;
    const studentEvidence = parsedEvidenceRows.filter(entry => entry.row.student_id === student.id);
    const estEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "est-prep");
    const megatrendsEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "megatrends");
    const lifelongEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "lifelong-learning");
    const initiativeEvidence = studentEvidence.filter(entry => (entry.row.module_id || entry.row.module_slug || entry.payload?.module_id) === "initiative");
    const studentCapabilityEntries = capabilityEvidenceEntries.filter(entry => entry.studentId === student.id);
    const latestEST = estEvidence[0]?.payload || null;
    const latestMegatrends = megatrendsEvidence[0]?.payload || null;
    const latestLifelong = lifelongEvidence[0] || null;
    const latestAnyEvidence = studentEvidence[0] || null;
    const latestESTTopicRows = estEvidence
      .filter(entry => entry.payload?.topic_group)
      .slice(0, 3)
      .map(entry => `${entry.payload.topic_group}: ${typeof entry.payload.score_percent === "number" ? `${Math.round(entry.payload.score_percent)}%` : "unscored"} in ${formatDurationSeconds(entry.payload.duration_seconds)}`);
    const timedEvidence = studentEvidence.filter(entry => entry.payload?.duration_seconds);
    const averageTaskTime = timedEvidence.length
      ? Math.round(timedEvidence.reduce((sum, entry) => sum + Number(entry.payload.duration_seconds || 0), 0) / timedEvidence.length)
      : 0;
    const overallMastery = player ? average([
      Number(player.tech_mastery || 0),
      Number(player.climate_mastery || 0),
      Number(player.demo_mastery || 0),
      Number(player.economic_mastery || 0)
    ]) : 0;
    const strongestSkillId = getStrongestSkill(player ? deriveEmployabilityProgress(player) : {
      communication: 0,
      "digital-literacy": 0,
      teamwork: 0,
      "time-management": 0,
      "critical-thinking": 0,
      "problem-solving": 0
    })[0];
    const strongestSkill = skillCategories.find(category => category.id === strongestSkillId);
    const recentResponseText = latestAnyEvidence ? getEvidenceResponseText(latestAnyEvidence.row, latestAnyEvidence.payload) : "";
    const recentPrompt = latestAnyEvidence ? getEvidencePromptText(latestAnyEvidence.row, latestAnyEvidence.payload) : "";
    const recentModule = latestAnyEvidence
      ? getModuleLabel(getEvidenceModuleId(latestAnyEvidence.row, latestAnyEvidence.payload))
      : "No written evidence yet";
    const megatrendsCompletion = Number(megatrendsProgress?.completion_percent || Math.min(100, Number(player?.years_played || 0) * 18 || 0));
    const lifelongCompletion = Number(lifelongProgress?.completion_percent || 0);
    const estCompletion = Number(estProgress?.completion_percent || 0);
    const initiativeCompletion = Number(initiativeProgress?.completion_percent || 0);
    const employabilityCompletion = calculateSkillEvidenceProgress(studentCapabilityEntries);
    const megatrendsMastery = Number(megatrendsProgress?.mastery_percent || overallMastery || 0);
    const lifelongMastery = Number(lifelongProgress?.mastery_percent || 0);
    const estMastery = Number(estProgress?.mastery_percent || 0);
    const initiativeMastery = Number(initiativeProgress?.mastery_percent || 0);
    const employabilityMastery = studentCapabilityEntries.length
      ? Math.round(average(studentCapabilityEntries.map(entry => Math.min(100, Number(entry.quality || 0) * 8))))
      : 0;
    const moduleScoreValues = {
      "megatrends": [megatrendsCompletion, megatrendsMastery],
      "lifelong-learning": [lifelongCompletion, lifelongMastery],
      "est-prep": [estCompletion, estMastery],
      "initiative": [initiativeCompletion, initiativeMastery],
      "employability-skills": [employabilityCompletion, employabilityMastery]
    };
    const progressScore = average(visibleModuleIds.flatMap(moduleId => moduleScoreValues[moduleId] || []));
    const lastActivity = getLastActivityTime(student, studentProgress, studentEvidence);
    const engagementCaption = [
      student.last_login_at ? `Login ${formatRelativeAge(parseTime(student.last_login_at))}` : "No login",
      studentProgress.length ? `${studentProgress.length} progress row${studentProgress.length === 1 ? "" : "s"}` : "no progress",
      studentEvidence.length ? `${studentEvidence.length} evidence item${studentEvidence.length === 1 ? "" : "s"}` : "no evidence",
      lastActivity ? `activity ${formatRelativeAge(lastActivity)}` : ""
    ].filter(Boolean).join(" • ");

    return {
      studentId: student.id,
      name: student.display_name || student.username || "Student",
      meta: [
        student.username || "No username",
        student.last_login_at ? `Last login ${formatDateTime(student.last_login_at)}` : "Not logged in yet"
      ].join(" • "),
      lastLoginLabel: student.last_login_at ? formatDateTime(student.last_login_at) : "Not logged in yet",
      engagementCaption,
      status: progressScore >= 60 ? "On track" : visibleModuleIds.some(moduleId => moduleScoreValues[moduleId]?.some(value => value > 0)) ? "Building" : "Not started",
      summary: player
        ? `${player.career_title || "Career Builder"} with ${overallMastery}% overall megatrend mastery, ${formatCurrency(player.annual_salary || 0)} salary, and ${formatCurrency(player.cumulative_net_worth || 0)} net worth.`
        : "No live profile yet. This student needs first-play data to unlock deeper comparison.",
      pills: [
        `Megatrends mastery: ${Number(megatrendsProgress?.mastery_percent || overallMastery)}%`,
        `Employability STAR: ${studentCapabilityEntries.length}`,
        `Lifelong mastery: ${Number(lifelongProgress?.mastery_percent || 0)}%`,
        `Initiative mastery: ${Number(initiativeProgress?.mastery_percent || 0)}%`,
        `EST mastery: ${Number(estProgress?.mastery_percent || 0)}%`,
        `Avg task time: ${averageTaskTime ? formatDurationSeconds(averageTaskTime) : "No timings yet"}`,
        `Strongest skill: ${strongestSkill?.title || "Not clear yet"}`
      ],
      megatrendsCompletion,
      lifelongCompletion,
      estCompletion,
      initiativeCompletion,
      employabilityCompletion,
      megatrendsMastery,
      lifelongMastery,
      estMastery,
      initiativeMastery,
      employabilityMastery,
      progressScore,
      averageTaskTimeSeconds: averageTaskTime,
      averageTaskTimeLabel: averageTaskTime ? formatDurationSeconds(averageTaskTime) : "NYS",
      strongestSkillTitle: strongestSkill?.title || "",
      spotlight: Boolean((estProgress || lifelongProgress) && megatrendsProgress),
      details: [
        {
          title: "Megatrends snapshot",
          detail: player
            ? `Years played ${Number(player.years_played || 0)} • Job security ${Number(player.job_security || 0)}% • Work-life balance ${Number(player.work_life_balance || 0)}%`
            : "No Megatrends profile saved yet."
        },
        {
          title: "Lifelong Learning snapshot",
          detail: lifelongProgress
            ? `Completion ${Number(lifelongProgress.completion_percent || 0)}% • Mastery ${Number(lifelongProgress.mastery_percent || 0)}% • Attempts ${Number(lifelongProgress.attempts || 0)}${latestLifelong ? ` • Latest reflection ${formatDateTime(latestLifelong.row.created_at)}` : ""}`
            : "No Lifelong Learning progress saved yet."
        },
        {
          title: "Initiative snapshot",
          detail: initiativeProgress
            ? `Completion ${Number(initiativeProgress.completion_percent || 0)}% • Mastery ${Number(initiativeProgress.mastery_percent || 0)}% • Attempts ${Number(initiativeProgress.attempts || 0)}${initiativeEvidence[0] ? ` • Latest evidence ${formatDateTime(initiativeEvidence[0].row.created_at)}` : ""}`
            : "No Initiative progress saved yet."
        },
        {
          title: "EST snapshot",
          detail: estProgress
            ? `Completion ${Number(estProgress.completion_percent || 0)}% • Mastery ${Number(estProgress.mastery_percent || 0)}% • Attempts ${Number(estProgress.attempts || 0)}${latestESTTopicRows.length ? ` • ${latestESTTopicRows.join(" | ")}` : ""}`
            : "No EST progress saved yet."
        },
        {
          title: `Latest response • ${recentModule}`,
          detail: recentResponseText
            ? `${latestAnyEvidence?.payload?.topic_group ? `${latestAnyEvidence.payload.topic_group} • ` : ""}${recentPrompt ? `${String(recentPrompt).slice(0, 70)}${String(recentPrompt).length > 70 ? "..." : ""} • ` : ""}${String(recentResponseText).slice(0, 120)}${String(recentResponseText).length > 120 ? "..." : ""}`
            : "No written response stored yet."
        }
      ]
    };
  }).sort((a, b) => {
    const aScore = Number(a.megatrendsCompletion || 0) + Number(a.lifelongCompletion || 0) + Number(a.initiativeCompletion || 0) + Number(a.estCompletion || 0) + Number(a.employabilityCompletion || 0);
    const bScore = Number(b.megatrendsCompletion || 0) + Number(b.lifelongCompletion || 0) + Number(b.initiativeCompletion || 0) + Number(b.estCompletion || 0) + Number(b.employabilityCompletion || 0);
    return bScore - aScore;
  });

  const scopeLabel = selectedStudent
    ? `${getStudentDisplayName(selectedStudent)} learning profile`
    : selectedClassId === "all"
      ? `all classes at ${dashboardContext.teacher?.schoolName || dashboardContext.teacherLogin?.schoolName || "School not resolved"}`
      : (classCodeFilter ? `Class ${classCodeFilter}` : "selected class");
  const teacherSchoolName = dashboardContext.teacher?.schoolName
    || dashboardContext.teacherLogin?.schoolName
    || dashboardContext.teacherSession?.schoolName
    || "School not resolved";
  setText("teacher-school-name", teacherSchoolName);
  setText("teacher-hero-title", "Class command centre");
  setText(
    "teacher-hero-subtitle",
    students.length
      ? `Showing ${scopeLabel}: ${students.length} ${getStudentRecordScopeBase(studentRecordFocus)} account${students.length === 1 ? "" : "s"}, ${loggedInStudents} logged in, ${evidenceCount} evidence item(s), and module data feeding the current intervention view.`
      : "Unlock the teacher area in the game or create student progress first to populate this dashboard."
  );

  const badgeStack = document.getElementById("teacher-badge-stack");
  if (badgeStack) {
    badgeStack.innerHTML = students.length ? [
      renderBadge(`Class: ${classCodeFilter || "All classes"}`),
      renderBadge(`Focus: ${visibleModuleIds.length ? visibleModuleIds.map(id => getModuleById(id)?.shortTitle || getModuleLabel(id)).join(", ") : "No active modules"}`),
      renderBadge(`Students: ${studentRecordOption.label}`),
      renderBadge(`Scope: ${selectedStudent ? "Student drill-down" : selectedClassId === "all" ? "All classes" : "Single class"}`),
      ...(selectedStudent ? [renderBadge(`Student: ${getStudentDisplayName(selectedStudent)}`)] : []),
      renderBadge(`Students: ${students.length}`),
      renderBadge(`Logged in: ${loggedInStudents}`),
      renderBadge(`Average mastery: ${classMastery}%`),
      renderBadge(`Average security: ${averageSecurity}%`),
      renderBadge(`Weakest skill: ${weakestSkill ? weakestSkill.title : "N/A"}`, weakestSkill?.logoPath, weakestSkill?.title),
      renderBadge(`Vote leader: ${voteLeader}`)
    ].join("") : '<span class="badge">No class data yet</span>';
  }

  const topInactive = engagementRows.find(row => row.status === "No interaction");
  const topGlossaryGap = glossaryData.gapRows[0];
  setText(
    "teacher-priority-text",
    topInactive
      ? `${topInactive.title.split(" • ")[0]} has no recorded interaction yet. Start with login support or a guided first module launch.`
      : topGlossaryGap
        ? `${topGlossaryGap.term} is the biggest glossary gap across recent recall runs. Reteach this before the next EST response task.`
        : weakestSkill
          ? `${weakestSkill.title} is currently the weakest employability area. Use the next intervention to target that skill.`
          : "No class skill data is available yet."
  );
  setText("teacher-students-on-track", String(studentsOnTrack));
  setText("teacher-students-at-risk", String(studentsAtRisk));
  setText("teacher-captured-time", formatDurationSeconds(totalTaskSeconds, "0m"));
  setText("teacher-average-completion", `${moduleCompletion}%`);
  setText("teacher-average-score", evidenceScores.length ? `${averageEvidenceScore}%` : "N/A");
  setText("teacher-evidence-count", String(evidenceCount));
  setText(
    "teacher-action-summary",
    `${pendingShareableReviewCount} student-written response${pendingShareableReviewCount === 1 ? "" : "s"} waiting for approval. ${pendingFeedbackCount} feedback report${pendingFeedbackCount === 1 ? "" : "s"} and ${pendingStoreRequestCount} shop request${pendingStoreRequestCount === 1 ? "" : "s"} need teacher checking. ${approvedReviewCount} approved response${approvedReviewCount === 1 ? "" : "s"} are ready for the comparison pool.`
  );

  renderTeacherCapabilityPortfolio({
    skillCategories,
    parsedEvidenceRows,
    reviewRows,
    students,
    selectedStudent,
    evidenceEntries: capabilityEvidenceEntries
  });
  renderSkills({ categories: skillCategories }, "teacher-skill-grid", classSkillMap);
  const portfolioStudentCount = new Set(capabilityEvidenceEntries.map(entry => entry.studentId).filter(Boolean)).size;
  const portfolioCapabilityCount = new Set(capabilityEvidenceEntries.flatMap(entry => entry.capabilityIds || [])).size;
  const teacherModuleRows = [
    {
      id: "megatrends",
      label: "Megatrends",
      title: "Megatrends",
      status: getModuleStatusLabel(moduleStatuses["megatrends"]),
      summary: visibleModuleIdSet.has("megatrends")
        ? (megatrendsProgressRows.length || latestPlayers.length ? `Tracking ${megatrendsProgressRows.length || latestPlayers.length} Megatrends progress signal(s), ${voteCount} community vote(s), and ${formatCurrency(classFund)} in saved community tax contributions.` : "No Megatrends data in the current focus.")
        : "Archived history is hidden from the active teaching view.",
      completion: average(megatrendsProgressRows.map(row => Number(row.completion_percent || 0))) || average(latestPlayers.map(player => Math.min(100, Number(player.years_played || 0) * 18))),
      mastery: average(megatrendsProgressRows.map(row => Number(row.mastery_percent || 0))) || classMastery,
      variant: "",
      spotlight: true,
      imagePath: "../Assets/Images and Animations/Student Hub/module-megatrends-thumb.png",
      logoPath: getSkillCategoryById(skillsData, "digital-literacy")?.logoPath,
      logoLabel: "Digital Literacy"
    },
    {
      id: "est-prep",
      label: "EST Prep",
      title: "EST Prep",
      status: getModuleStatusLabel(moduleStatuses["est-prep"]),
      summary: visibleModuleIdSet.has("est-prep") && estProgressRows.length
        ? `Tracking ${estProgressRows.length} EST progress row(s) and ${estEvidenceRows.length} EST evidence artifact(s), including boss-round written responses.`
        : visibleModuleIdSet.has("est-prep")
          ? "Once students complete EST stages, this card will show EST-specific progress, mastery, and written responses."
          : "EST Prep is not included in the current dashboard focus.",
      completion: average(estProgressRows.map(row => Number(row.completion_percent || 0))),
      mastery: average(estProgressRows.map(row => Number(row.mastery_percent || 0))),
      variant: "green",
      spotlight: moduleStatuses["est-prep"] === "active",
      imagePath: "../Assets/Images and Animations/Student Hub/module-est-prep-thumb.png",
      logoPath: getSkillCategoryById(skillsData, "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking"
    },
    {
      id: "initiative",
      label: "Initiative",
      title: "Initiative",
      status: getModuleStatusLabel(moduleStatuses.initiative),
      summary: visibleModuleIdSet.has("initiative") && initiativeProgressRows.length
        ? `Tracking ${initiativeProgressRows.length} Initiative progress row(s) and ${parsedEvidenceRows.filter(entry => getEvidenceModuleId(entry.row, entry.payload) === "initiative").length} evidence snapshot(s), including active time, mission choice, and Memory Vault score.`
        : visibleModuleIdSet.has("initiative")
          ? "Once students clear the Unlock Gate and complete an applied mission, this card will show time-on-task, proof, memory, and support signals."
          : "Initiative is not included in the current dashboard focus.",
      completion: average(initiativeProgressRows.map(row => Number(row.completion_percent || 0))),
      mastery: average(initiativeProgressRows.map(row => Number(row.mastery_percent || 0))),
      variant: "green",
      spotlight: moduleStatuses.initiative === "active",
      imagePath: "../Assets/Images and Animations/Initiative Scenes/Initiative topic scene neutral.png",
      logoPath: getSkillCategoryById(skillsData, "teamwork")?.logoPath || getSkillCategoryById(skillsData, "communication")?.logoPath,
      logoLabel: "Teamwork"
    },
    {
      id: EMPLOYABILITY_PORTFOLIO_MODULE_ID,
      label: "Employability",
      title: "Employability Skills Portfolio",
      status: getModuleStatusLabel(moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID]),
      summary: visibleModuleIdSet.has(EMPLOYABILITY_PORTFOLIO_MODULE_ID) && capabilityEvidenceEntries.length
        ? `Tracking ${capabilityEvidenceEntries.length} STAR reflection${capabilityEvidenceEntries.length === 1 ? "" : "s"} from ${portfolioStudentCount} student${portfolioStudentCount === 1 ? "" : "s"} across ${portfolioCapabilityCount || 0} tagged capability area${portfolioCapabilityCount === 1 ? "" : "s"}.`
        : visibleModuleIdSet.has(EMPLOYABILITY_PORTFOLIO_MODULE_ID)
          ? "Once students bank STAR reflections, this module will show their tagged employability evidence portfolio."
          : "Employability Skills Portfolio is not included in the current dashboard focus.",
      completion: calculateSkillEvidenceProgress(capabilityEvidenceEntries),
      mastery: capabilityEvidenceEntries.length
        ? Math.round(average(capabilityEvidenceEntries.map(entry => Math.min(100, Number(entry.quality || 0) * 8))))
        : 0,
      variant: "green",
      spotlight: moduleStatuses[EMPLOYABILITY_PORTFOLIO_MODULE_ID] === "active",
      logoPath: getSkillCategoryById(skillsData, "communication")?.logoPath,
      logoLabel: "Employability Skills"
    },
    {
      id: "lifelong-learning",
      label: "Lifelong Learning",
      title: "Lifelong Learning",
      status: getModuleStatusLabel(moduleStatuses["lifelong-learning"]),
      summary: visibleModuleIdSet.has("lifelong-learning") && lifelongProgressRows.length
        ? `Tracking ${lifelongProgressRows.length} Lifelong Learning progress row(s) and ${parsedEvidenceRows.filter(entry => getEvidenceModuleId(entry.row, entry.payload) === "lifelong-learning").length} reflection artifact(s).`
        : visibleModuleIdSet.has("lifelong-learning")
          ? "Once students complete Lifelong Learning rounds, planning, reflection, and self-management evidence will appear here."
          : "Prototype history is hidden from the active teaching view.",
      completion: average(lifelongProgressRows.map(row => Number(row.completion_percent || 0))),
      mastery: average(lifelongProgressRows.map(row => Number(row.mastery_percent || 0))),
      variant: "gold",
      spotlight: moduleStatuses["lifelong-learning"] === "active",
      imagePath: "../Assets/Images and Animations/Student Hub/module-lifelong-learning-thumb.png",
      logoPath: getSkillCategoryById(skillsData, "time-management")?.logoPath,
      logoLabel: "Time Management"
    }
  ];
  renderTeacherModuleHealth(teacherModuleRows);
  renderTeacherInterventions([
    ...(topInactive ? [{
      title: `Re-engage ${topInactive.title.split(" • ")[0]}`,
      detail: "This student has no recorded interaction. Check login access, then sit them beside a guided first module task.",
      logoPath: getSkillCategoryById(skillsData, "communication")?.logoPath,
      logoLabel: "Communication"
    }] : []),
    ...(topGlossaryGap ? [{
      title: `Reteach glossary term: ${topGlossaryGap.term}`,
      detail: `${topGlossaryGap.misses} student gap${topGlossaryGap.misses === 1 ? "" : "s"} appeared for this term in final recall. Use a two-minute retrieval check before long-answer writing.`,
      logoPath: getSkillCategoryById(skillsData, "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking"
    }] : []),
    {
      title: weakestSkill ? `Target ${weakestSkill.title} next` : "Activate first class module",
      detail: weakestSkill ? `The class average for ${weakestSkill.title} is the lowest, so this is the best immediate teaching focus.` : "Students need live gameplay records before diagnostics can run.",
      logoPath: weakestSkill?.logoPath,
      logoLabel: weakestSkill?.title
    },
    {
      title: `${studentsAtRisk} students currently at risk`,
      detail: studentsAtRisk ? "Use this as the intervention pool for scaffolded tasks, review sessions, or module replay." : "No students are currently below the at-risk mastery threshold.",
      logoPath: getSkillCategoryById(skillsData, "teamwork")?.logoPath,
      logoLabel: "Teamwork"
    },
    {
      title: `${studentsOnTrack} students are on track`,
      detail: studentsOnTrack ? "These students are ready for extension prompts, deeper reflection, or leadership roles in class activities." : "Once mastery rises above 50%, students will appear here as ready for extension.",
      logoPath: getSkillCategoryById(skillsData, "critical-thinking")?.logoPath,
      logoLabel: "Critical Thinking"
    }
  ].slice(0, 5));
  renderTeacherRosterActivity(engagementRows.slice(0, 8));
  renderTeacherGlossaryGapList(glossaryData);
  renderTeacherLongAnswerComparison(longAnswerRows, students);
  renderTeacherResponseReviewInbox(reviewRows);
  renderTeacherFeedbackReviewInbox(feedbackReviewItems);
  renderTeacherTaskTimeList(taskTimingRows);
  renderTeacherStudentCompareList(studentCompareRows, visibleModuleIds);
  renderTeacherStudentProfile({
    students,
    selectedStudent,
    engagementRows,
    studentCompareRows,
    moduleProgressRows,
    parsedEvidenceRows,
    reviewRows,
    visibleModuleIds
  });
  renderTeacherClassCharts({
    engagementRows,
    moduleRows: teacherModuleRows.filter(row => visibleModuleIdSet.has(row.id)),
    timeRows: strandTimeRows,
    glossary: glossaryData
  });
  renderTeacherStoreRequestList(storeRequests);
}

async function initDashboards() {
  syncMegatrendsLaunchLinks();
  let skillsData = { categories: [] };
  let players = [];
  const isTeacherDashboardPage = Boolean(document.getElementById("teacher-module-health"));
  const authState = getAuthPrototypeState();
  revealTeacherDiagnosticBetaLink(authState);
  const session = getCurrentPlayerSession();
  const studentLogin = authState?.studentLogin || {};
  const isUntrackedStudentPreview = Boolean(
    document.getElementById("student-module-grid")
    && (studentLogin.demo || session?.demoMode || (studentLogin.preview && !studentLogin.id))
  );
  const needsSharedPlayerData = Boolean(
    document.getElementById("student-module-grid")
    || document.getElementById("leaderboard-page-list")
    || document.getElementById("community-page-board")
    || document.getElementById("global-page-metrics")
  );

  try {
    skillsData = await loadEmployabilitySkills();
  } catch (error) {
    console.error("Failed to load employability skills", error);
  }

  if (!isUntrackedStudentPreview && (!isTeacherDashboardPage || needsSharedPlayerData || isPromoTeacherDashboardMode())) {
    try {
      players = await getPlayers();
    } catch (error) {
      console.error("Failed to load player data", error);
    }
  }

  if (document.getElementById("student-module-grid")) {
    try {
      await renderStudentLiveData(players, skillsData);
    } catch (error) {
      console.error("Failed to render student dashboard", error);
    }
  }
  if (document.getElementById("leaderboard-page-list")) {
    try {
      renderSharedLeaderboard(players, skillsData);
    } catch (error) {
      console.error("Failed to render leaderboard page", error);
    }
  }
  if (document.getElementById("community-page-board")) {
    try {
      renderSharedCommunityPage(players);
    } catch (error) {
      console.error("Failed to render community page", error);
    }
  }
  if (document.getElementById("global-page-metrics")) {
    try {
      renderSharedGlobalPage(players);
    } catch (error) {
      console.error("Failed to render global index page", error);
    }
  }
  if (document.getElementById("teacher-module-health")) {
    let teacherData = null;
    if (isPromoTeacherDashboardMode()) {
      teacherData = getPromoTeacherDashboardData();
      players = teacherData.profileRows || players;
    } else {
      try {
        teacherData = await getTeacherDashboardData();
      } catch (error) {
        console.error("Failed to load Teacher Stats Dashboard data", error);
      }
    }

    try {
      renderTeacherLiveData(players, skillsData, teacherData);
    } catch (error) {
      console.error("Failed to render Teacher Stats Dashboard", error);
      renderTeacherLiveData([], { categories: [] }, teacherData || {
        context: getActiveTeacherContext(),
        availableClasses: [],
        selectedClassId: "all",
        selectedClassName: "No classes found",
        selectedStudentId: "all",
        studentRecordFocus: getTeacherDashboardFilter().studentRecordFocus || "active",
        studentRecordCounts: getStudentRecordCounts([]),
        students: [],
        moduleProgress: [],
        evidenceRows: [],
        voteRows: [],
        profileRows: [],
        feedbackRows: [],
        reviewRows: []
      });
    }
  }
}

if (requireStudentHubAccess()) {
  initDashboards().catch(error => {
    console.error(error);
  });
}
