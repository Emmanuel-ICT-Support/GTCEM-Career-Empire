const ALLOWED_TEACHER_DOMAINS = ["cewa.edu.au"];
const ALLOWED_TEACHER_DOMAIN_SUFFIXES = [".wa.edu.au"];
const TEACHER_EMAIL_REQUIREMENT = "Use a staff email ending in `@cewa.edu.au` or any school domain ending in `.wa.edu.au`.";
const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const DEMO_STUDENT_PROFILE = {
  id: null,
  username: "DemoStudent",
  displayName: "Demo Student",
  schoolName: "Career Empire Demo",
  classId: null,
  classCode: "DEMO",
  className: "Demo Class",
  preview: true,
  demo: true
};
const TEACHER_TEST_STUDENT = {
  username: "TeacherPreview",
  displayName: "Teacher Test Student",
  preview: true
};

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

function readState() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_DEMO_STATE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function writeState(patch) {
  const next = { ...readState(), ...patch };
  localStorage.setItem(AUTH_DEMO_STATE_KEY, JSON.stringify(next));
  window.CareerEmpireSessionBanner?.render?.();
  return next;
}

function readPlayerSession() {
  try {
    return JSON.parse(localStorage.getItem(PLAYER_SESSION_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function writePlayerSession(patch) {
  const next = { ...readPlayerSession(), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function getOwnedAssetListFromSession(session = {}, ownerKey = "") {
  const groupedAssets = ownerKey && session.ownedAssetsByStudent && typeof session.ownedAssetsByStudent === "object"
    ? session.ownedAssetsByStudent[ownerKey]
    : null;
  if (Array.isArray(groupedAssets)) return groupedAssets;
  return Array.isArray(session.ownedAssets) ? session.ownedAssets : [];
}

function normalisePlayerAsset(row = {}) {
  return {
    id: row.id || row.asset_code || row.code || `asset-${Date.now()}`,
    asset_code: row.asset_code || row.code || "",
    asset_name: row.asset_name || row.name || "Shop item",
    asset_category: row.asset_category || row.category || "other",
    purchase_cost: Number(row.purchase_cost || row.cost || 0),
    purchased_at: row.purchased_at || new Date().toISOString()
  };
}

function getClassroomDisplayName(classroom = null, fallback = "No class created yet") {
  if (!classroom) return fallback;
  // Accept legacy/local Supabase shapes, but keep app state on className.
  return classroom.className || classroom.name || (classroom.classCode ? `Class ${classroom.classCode}` : fallback);
}

function getClassroomCode(classroom = null, fallback = "Pending") {
  return classroom?.classCode || classroom?.class_code || fallback;
}

function normaliseClassroomRecord(classroom = null) {
  if (!classroom) return null;
  const className = classroom.className || classroom.name || "";
  const classCode = classroom.classCode || classroom.class_code || "";
  return {
    id: classroom.id || null,
    className,
    yearLevel: classroom.yearLevel || classroom.year_level || "",
    classCode,
    createdAt: classroom.createdAt || classroom.created_at || ""
  };
}

function buildTeacherNavConfig() {
  const isDashboardPage = window.location.pathname.includes("/dashboards/");
  return isDashboardPage ? {
    teacherSignup: "../auth/teacher-signup.html",
    teacherLogin: "../auth/teacher-login.html",
    createClass: "../auth/create-class.html",
    addStudents: "../auth/add-students.html",
    manageStudents: "../auth/manage-students.html",
    teacherDashboard: "./teacher.html"
  } : {
    teacherSignup: "./teacher-signup.html",
    teacherLogin: "./teacher-login.html",
    createClass: "./create-class.html",
    addStudents: "./add-students.html",
    manageStudents: "./manage-students.html",
    teacherDashboard: "../dashboards/teacher.html"
  };
}

function buildTeacherNavMarkup(activeKey) {
  const paths = buildTeacherNavConfig();
  const items = [
    { key: "teacher-dashboard", label: "Teacher Dashboard", href: paths.teacherDashboard },
    { key: "teacher-login", label: "Teacher Login", href: paths.teacherLogin },
    { key: "teacher-signup", label: "Teacher Sign Up", href: paths.teacherSignup },
    { key: "create-class", label: "Create Class", href: paths.createClass },
    { key: "add-students", label: "Add Students", href: paths.addStudents },
    { key: "manage-students", label: "Manage Students", href: paths.manageStudents },
    { key: "test-student", label: "Play as Test Student", href: "#", testLaunch: true }
  ];

  return items.map(item => {
    const activeClass = item.key === activeKey ? "active" : "";
    if (item.testLaunch) {
      return `<a class="teacher-nav-item ${activeClass}" href="#" data-teacher-test-student="true">${item.label}</a>`;
    }
    return `<a class="teacher-nav-item ${activeClass}" href="${item.href}">${item.label}</a>`;
  }).join("");
}

function seedDemoStudentSession() {
  const existing = readPlayerSession();
  const ownedAssets = getOwnedAssetListFromSession(existing, DEMO_STUDENT_PROFILE.username);
  const ownedAssetsByStudent = {
    ...(existing.ownedAssetsByStudent && typeof existing.ownedAssetsByStudent === "object" ? existing.ownedAssetsByStudent : {}),
    [DEMO_STUDENT_PROFILE.username]: ownedAssets
  };

  writeState({
    studentLogin: {
      ...DEMO_STUDENT_PROFILE,
      loggedInAt: new Date().toISOString()
    },
    classroom: {
      id: null,
      classCode: DEMO_STUDENT_PROFILE.classCode,
      className: DEMO_STUDENT_PROFILE.className
    }
  });

  writePlayerSession({
    studentId: null,
    username: DEMO_STUDENT_PROFILE.username,
    playerName: DEMO_STUDENT_PROFILE.displayName,
    schoolName: DEMO_STUDENT_PROFILE.schoolName,
    classId: DEMO_STUDENT_PROFILE.classId,
    classCode: DEMO_STUDENT_PROFILE.classCode,
    className: DEMO_STUDENT_PROFILE.className,
    careerTitle: existing.careerTitle || "Demo Explorer",
    annualSalary: Number(existing.annualSalary ?? existing.salary ?? 32000),
    salary: Number(existing.salary ?? existing.annualSalary ?? 32000),
    cumulativeNetWorth: Number(existing.cumulativeNetWorth ?? 12000),
    savings: Number(existing.savings ?? 3200),
    taxPaid: Number(existing.taxPaid ?? 0),
    yearsPlayed: Number(existing.yearsPlayed ?? 0),
    careerLevel: Number(existing.careerLevel ?? 1),
    jobSecurity: Number(existing.jobSecurity ?? 68),
    workLifeBalance: Number(existing.workLifeBalance ?? 72),
    wellbeing: Number(existing.wellbeing ?? 72),
    socialStatus: Number(existing.socialStatus ?? 48),
    resilience: Number(existing.resilience ?? 61),
    techMastery: Number(existing.techMastery ?? 12),
    climateMastery: Number(existing.climateMastery ?? 8),
    demoMastery: Number(existing.demoMastery ?? 10),
    economicMastery: Number(existing.economicMastery ?? 9),
    communityVote: "none",
    lastCommunityVote: "none",
    ownedAssets,
    ownedAssetsByStudent,
    economyLog: Array.isArray(existing.economyLog) ? existing.economyLog : [],
    checkpoint: "demo-student-preview",
    demoMode: true,
    updatedAt: new Date().toISOString()
  });
}

function launchDemoStudentPreview(targetPath = "../dashboards/student.html") {
  seedDemoStudentSession();
  window.location.href = targetPath;
}

function launchTeacherTestStudentPreview() {
  const state = readState();
  const classroom = state.classroom || {};
  const teacher = state.teacher || {};
  const studentLogin = {
    id: null,
    username: TEACHER_TEST_STUDENT.username,
    displayName: TEACHER_TEST_STUDENT.displayName,
    schoolId: teacher.schoolId || null,
    schoolName: teacher.schoolName || "Teacher Preview School",
    classId: classroom.id || null,
    classCode: getClassroomCode(classroom, "PREVIEW"),
    className: getClassroomDisplayName(classroom, "Teacher Preview Class"),
    preview: true
  };

  writeState({ studentLogin });

  const existing = readPlayerSession();
  const previewAssets = getOwnedAssetListFromSession(existing, studentLogin.username);
  const ownedAssetsByStudent = {
    ...(existing.ownedAssetsByStudent && typeof existing.ownedAssetsByStudent === "object" ? existing.ownedAssetsByStudent : {}),
    [studentLogin.username]: previewAssets
  };

  writePlayerSession({
    studentId: null,
    username: studentLogin.username,
    playerName: studentLogin.displayName,
    schoolId: studentLogin.schoolId,
    schoolName: studentLogin.schoolName,
    classId: studentLogin.classId,
    classCode: studentLogin.classCode,
    className: studentLogin.className,
    careerTitle: existing.careerTitle || "Preview Explorer",
    annualSalary: Number(existing.annualSalary || 25000),
    cumulativeNetWorth: Number(existing.cumulativeNetWorth || 0),
    jobSecurity: Number(existing.jobSecurity || 70),
    workLifeBalance: Number(existing.workLifeBalance || 68),
    ownedAssets: previewAssets,
    ownedAssetsByStudent,
    checkpoint: "teacher-test-student-preview",
    demoMode: true,
    updatedAt: new Date().toISOString()
  });

  window.location.href = "../dashboards/student.html";
}

function applyTeacherNavigation() {
  const activeKey = document.body?.dataset?.teacherNavActive;
  if (!activeKey) return;

  document.querySelectorAll(".workflow-links").forEach(container => {
    container.innerHTML = buildTeacherNavMarkup(activeKey).replaceAll("teacher-nav-item", "workflow-link");
  });

  document.querySelectorAll(".dashboard-nav").forEach(container => {
    container.innerHTML = buildTeacherNavMarkup(activeKey).replaceAll("teacher-nav-item", "dashboard-nav-link");
  });

  document.querySelectorAll("[data-teacher-test-student='true']").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      launchTeacherTestStudentPreview();
    });
  });
}

function syncStudentPlayerSession(student, profile = null, assets = null) {
  if (!student?.id) return;
  const existing = readPlayerSession();
  const sameStudent = existing.studentId === student.id;
  const next = sameStudent
    ? { ...existing }
    : {
      ownedAssetsByStudent: existing.ownedAssetsByStudent && typeof existing.ownedAssetsByStudent === "object"
        ? existing.ownedAssetsByStudent
        : {}
    };
  next.studentId = student.id;
  next.username = student.username || "";
  next.playerName = student.display_name || student.username || "Student";
  next.schoolId = student.school_id || null;
  next.schoolName = student.schools?.name || "";
  next.classId = student.class_id || null;
  next.classCode = student.classes?.class_code || "";
  next.className = student.classes?.name || "";
  next.demoMode = false;
  if (profile) {
    next.careerTitle = profile.career_title || next.careerTitle || "Intern";
    next.annualSalary = Number(profile.annual_salary ?? next.annualSalary ?? 25000);
    next.salary = Number(profile.annual_salary ?? next.salary ?? next.annualSalary ?? 25000);
    next.cumulativeNetWorth = Number(profile.cumulative_net_worth ?? next.cumulativeNetWorth ?? 0);
    next.savings = Number(profile.savings ?? next.savings ?? 0);
    next.taxPaid = Number(profile.tax_paid ?? next.taxPaid ?? 0);
    next.careerLevel = Number(profile.career_level ?? next.careerLevel ?? 1);
    next.jobSecurity = Number(profile.job_security ?? next.jobSecurity ?? 75);
    next.workLifeBalance = Number(profile.work_life_balance ?? next.workLifeBalance ?? 60);
    next.wellbeing = Number(profile.wellbeing ?? next.wellbeing ?? 60);
    next.socialStatus = Number(profile.social_status ?? next.socialStatus ?? 50);
    next.resilience = Number(profile.resilience ?? next.resilience ?? 50);
    next.yearsPlayed = Number(profile.years_played ?? next.yearsPlayed ?? 0);
    next.techMastery = Number(profile.tech_mastery ?? next.techMastery ?? 0);
    next.climateMastery = Number(profile.climate_mastery ?? next.climateMastery ?? 0);
    next.demoMastery = Number(profile.demo_mastery ?? next.demoMastery ?? 0);
    next.economicMastery = Number(profile.economic_mastery ?? next.economicMastery ?? 0);
  }
  if (Array.isArray(assets)) {
    const normalisedAssets = assets.map(normalisePlayerAsset);
    next.ownedAssets = normalisedAssets;
    next.ownedAssetsByStudent = {
      ...(next.ownedAssetsByStudent && typeof next.ownedAssetsByStudent === "object" ? next.ownedAssetsByStudent : {}),
      [student.id]: normalisedAssets
    };
  }
  next.updatedAt = new Date().toISOString();
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
}

function redirectAfterDelay(path, delayMs = 900) {
  window.setTimeout(() => {
    window.location.href = path;
  }, delayMs);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setHtml(id, value) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = value;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function formatDateTime(value) {
  if (!value) return "";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "";
  return timestamp.toLocaleString();
}

function getTimestamp(value) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getDaysSince(value) {
  const timestamp = getTimestamp(value);
  if (!timestamp) return null;
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86400000));
}

function isAllowedTeacherEmail(email) {
  const domain = extractEmailDomain(email);
  return ALLOWED_TEACHER_DOMAINS.includes(domain)
    || ALLOWED_TEACHER_DOMAIN_SUFFIXES.some(suffix => domain.endsWith(suffix));
}

function isValidStudentUsername(username) {
  return /^[A-Za-z][A-Za-z0-9]{1,23}$/.test(String(username || "").trim());
}

function extractEmailDomain(email) {
  return String(email || "").trim().toLowerCase().split("@")[1] || "";
}

function generateClassCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateStudentPassword() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateStudentUsernameSuggestions(displayName) {
  const cleaned = String(displayName || "").replace(/[^A-Za-z\s]/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = (parts[0] || "").slice(0, 12);
  const second = (parts[1] || "").slice(0, 4);
  const suggestions = new Set();
  if (!first) return [];

  suggestions.add(first);
  if (second) {
    suggestions.add(`${first}${second.slice(0, 1)}`);
    suggestions.add(`${first}${second.slice(0, 2)}`);
    suggestions.add(`${first}${second.slice(0, 2)}1`);
    suggestions.add(`${first}${second.slice(0, 3)}`);
  } else {
    suggestions.add(`${first}1`);
    suggestions.add(`${first}2`);
  }

  return [...suggestions]
    .map(item => item.replace(/[^A-Za-z0-9]/g, "").slice(0, 24))
    .filter(item => item.length >= 2)
    .filter(isValidStudentUsername)
    .slice(0, 4);
}

function buildTeacherResetUrl() {
  const current = new URL(window.location.href);
  current.pathname = current.pathname.replace(/\/[^/]*$/, "/teacher-reset-password.html");
  current.search = "";
  current.hash = "";
  return current.toString();
}

function buildTeacherLoginUrl() {
  const current = new URL(window.location.href);
  current.pathname = current.pathname.replace(/\/[^/]*$/, "/teacher-login.html");
  current.search = "";
  current.hash = "";
  return current.toString();
}

function hasRecoveryTokensInUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return searchParams.get("type") === "recovery"
    || hashParams.get("type") === "recovery"
    || hashParams.has("access_token")
    || searchParams.has("access_token");
}

async function hashValue(value) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureSchoolRecord(supabase, schoolName) {
  const normalizedName = schoolName.trim();
  const { data: existingSchool, error: existingError } = await supabase
    .from("schools")
    .select("id, name")
    .eq("name", normalizedName)
    .maybeSingle();

  if (existingError) throw existingError;
  if (!existingSchool) {
    throw new Error("Selected school was not found in the approved schools table. Please choose a school from the search results.");
  }
  return existingSchool;
}

async function loadSchoolOptions() {
  const targets = [
    {
      input: document.getElementById("teacher-school"),
      results: document.getElementById("teacher-school-results"),
      feedback: document.getElementById("teacher-school-feedback"),
      datalist: document.getElementById("teacher-school-list")
    },
    {
      input: document.getElementById("teacher-login-school"),
      results: document.getElementById("teacher-login-school-results"),
      feedback: document.getElementById("teacher-login-school-feedback"),
      datalist: document.getElementById("teacher-login-school-list")
    }
  ].filter(target => target.input && target.results);
  if (!targets.length) return;
  let schoolNames = Array.isArray(window.CAREER_EMPIRE_SCHOOLS) ? [...window.CAREER_EMPIRE_SCHOOLS] : [];

  try {
    if (!schoolNames.length) {
      throw new Error("No school list is available.");
    }

    function closeResults(results) {
      results.classList.remove("open");
      results.innerHTML = "";
    }

    function renderResults(results, input, feedback, matches) {
      if (!matches.length) {
        closeResults(results);
        return;
      }

      results.innerHTML = matches
        .slice(0, 12)
        .map(name => `<button type="button" class="search-option" data-school="${name}">${name}</button>`)
        .join("");
      results.classList.add("open");

      results.querySelectorAll(".search-option").forEach(button => {
        button.addEventListener("click", () => {
          input.value = button.dataset.school || "";
          closeResults(results);
          if (feedback) {
            feedback.className = "feedback good";
            feedback.textContent = "Approved school selected.";
          }
        });
      });
    }

    targets.forEach(({ input, results, feedback, datalist }) => {
      const syncSchoolDataset = (names) => {
        input.dataset.validSchools = JSON.stringify(names);
        if (datalist) {
          datalist.innerHTML = names
            .slice(0, 330)
            .map(name => `<option value="${name}"></option>`)
            .join("");
        }
        if (feedback) {
          feedback.className = "feedback good";
          feedback.textContent = `${names.length} approved schools loaded.`;
        }
      };

      syncSchoolDataset(schoolNames);
      if (feedback) {
        feedback.className = "feedback good";
        feedback.textContent = `${schoolNames.length} approved schools loaded.`;
      }

      input.addEventListener("input", () => {
        const validSchools = JSON.parse(input.dataset.validSchools || "[]");
        const query = input.value.trim().toLowerCase();
        if (!input.value.trim()) {
          if (feedback) {
            feedback.className = "feedback";
            feedback.textContent = `${validSchools.length} approved schools loaded.`;
          }
          closeResults(results);
          return;
        }

        const exactMatch = validSchools.includes(input.value.trim());
        const matches = validSchools.filter(name => name.toLowerCase().includes(query));
        renderResults(results, input, feedback, matches);

        if (feedback) {
          if (exactMatch) {
            feedback.className = "feedback good";
            feedback.textContent = "Approved school selected.";
          } else {
            feedback.className = "feedback warn";
            feedback.textContent = matches.length
              ? "Choose a school from the matching results below."
              : "No approved school matched that search yet.";
          }
        }
      });

      input.addEventListener("focus", () => {
        const validSchools = JSON.parse(input.dataset.validSchools || "[]");
        const query = input.value.trim().toLowerCase();
        const matches = query
          ? validSchools.filter(name => name.toLowerCase().includes(query))
          : validSchools.slice(0, 12);
        renderResults(results, input, feedback, matches);
      });

      input.addEventListener("change", () => {
        const validSchools = JSON.parse(input.dataset.validSchools || "[]");
        const exactMatch = validSchools.includes(input.value.trim());
        if (!feedback) return;
        if (exactMatch) {
          feedback.className = "feedback good";
          feedback.textContent = "Approved school selected.";
        } else if (input.value.trim()) {
          feedback.className = "feedback warn";
          feedback.textContent = "Choose an approved school from the list.";
        } else {
          feedback.className = "feedback";
          feedback.textContent = `${validSchools.length} approved schools loaded.`;
        }
      });

      document.addEventListener("click", (event) => {
        if (!results.contains(event.target) && event.target !== input) {
          closeResults(results);
        }
      });
    });

    const supabase = await getSupabaseClientOrNull();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw error;

      const remoteSchoolNames = (data || []).map(school => school.name).filter(Boolean);
      if (!remoteSchoolNames.length) return;

      schoolNames = remoteSchoolNames;
      targets.forEach(({ input, feedback, datalist }) => {
        input.dataset.validSchools = JSON.stringify(schoolNames);
        if (datalist) {
          datalist.innerHTML = schoolNames
            .slice(0, 330)
            .map(name => `<option value="${name}"></option>`)
            .join("");
        }
        if (!feedback) return;
        feedback.className = "feedback good";
        feedback.textContent = `${schoolNames.length} approved schools loaded.`;
      });
    } catch (error) {
      console.error("Failed to refresh schools from Supabase:", error);
    }
  } catch (error) {
    console.error("Failed to initialize school picker:", error);
    targets.forEach(({ feedback }) => {
      if (!feedback) return;
      feedback.className = "feedback bad";
      feedback.textContent = "The approved school list could not be loaded.";
    });
  }
}

async function ensureTeacherProfile(supabase, teacherPayload) {
  const { data: existingTeacher, error: existingError } = await supabase
    .from("teachers")
    .select("id, full_name, email, school_id")
    .eq("email", teacherPayload.email)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingTeacher) return existingTeacher;

  const { data: insertedTeacher, error: insertError } = await supabase
    .from("teachers")
    .insert(teacherPayload)
    .select("id, full_name, email, school_id")
    .single();

  if (insertError) throw insertError;
  return insertedTeacher;
}

async function ensureTeacherProfileFromState(supabase, email, fallback = {}) {
  const state = readState();
  const storedTeacher = state.teacher || {};
  const schoolName = storedTeacher.schoolName || fallback.schoolName || "";
  if (!schoolName) {
    throw new Error("Teacher profile not found and no stored school name is available to recreate it.");
  }

  const school = await ensureSchoolRecord(supabase, schoolName);
  return ensureTeacherProfile(supabase, {
    full_name: storedTeacher.fullName || fallback.fullName || email,
    email,
    email_domain: extractEmailDomain(email),
    password_hash: "__supabase_auth__",
    school_id: school.id
  });
}

async function getTeacherProfileByEmail(supabase, email) {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, full_name, email, school_id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function findStudentProfilesByUsername(supabase, username) {
  const normalized = String(username || "").trim();
  const { data, error } = await supabase
    .from("students")
    .select("id, display_name, username, password_hash, school_id, class_id, created_by_teacher_id, is_active, classes(class_code, name), schools(name)")
    .ilike("username", normalized)
    .limit(2);

  if (error) throw error;
  return data || [];
}

async function getStudentProfileByUsername(supabase, username) {
  const matches = await findStudentProfilesByUsername(supabase, username);
  if (matches.length > 1) {
    throw new Error("Duplicate username detected. Please ask your teacher to assign a unique username.");
  }
  return matches[0] || null;
}

async function requireLoggedInTeacher(supabase) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data?.user;
  if (!user?.email) {
    throw new Error("No logged-in teacher session found. Log in as a teacher first.");
  }
  let teacher = await getTeacherProfileByEmail(supabase, user.email);
  if (!teacher) {
    teacher = await ensureTeacherProfileFromState(supabase, user.email);
  }
  if (!teacher) {
    throw new Error("Teacher profile not found in the database.");
  }
  return { user, teacher };
}

async function ensurePlayerProfile(supabase, studentId) {
  const { data: existingProfile, error: existingError } = await supabase
    .from("player_profiles")
    .select("*")
    .eq("student_id", studentId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingProfile) return existingProfile;

  const { data: insertedProfile, error: insertError } = await supabase
    .from("player_profiles")
    .insert({
      student_id: studentId,
      career_title: "Intern",
      annual_salary: 25000,
      cumulative_net_worth: 0,
      savings: 0,
      tax_paid: 0,
      career_level: 1,
      career_success: 0,
      job_security: 75,
      work_life_balance: 60,
      wellbeing: 60,
      social_status: 50,
      resilience: 50
    })
    .select("*")
    .single();

  if (insertError) throw insertError;
  return insertedProfile;
}

async function getStudentEconomySession(supabase, studentId) {
  const [{ data: profile, error: profileError }, { data: assets, error: assetsError }] = await Promise.all([
    supabase
      .from("player_profiles")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("player_assets")
      .select("id, asset_code, asset_name, asset_category, purchase_cost, purchased_at")
      .eq("student_id", studentId)
      .order("purchased_at", { ascending: false })
  ]);

  if (profileError) console.error(profileError);
  if (assetsError) console.error(assetsError);

  return {
    profile: profileError ? null : (profile || null),
    assets: assetsError ? null : (assets || [])
  };
}

function initTeacherSignup() {
  const emailInput = document.getElementById("teacher-email");
  const emailFeedback = document.getElementById("teacher-email-feedback");
  const signupFeedback = document.getElementById("teacher-signup-feedback") || emailFeedback;
  const help = document.getElementById("teacher-email-help");
  const form = document.getElementById("teacher-signup-form");
  if (!emailInput || !form) return;

  emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();
    if (!email) {
      emailFeedback.className = "feedback";
      emailFeedback.textContent = "";
      if (help) {
        help.className = "helper";
        help.innerHTML = TEACHER_EMAIL_REQUIREMENT;
      }
      return;
    }
    if (isAllowedTeacherEmail(email)) {
      emailFeedback.className = "feedback good";
      emailFeedback.textContent = "Approved school domain. This teacher account can be registered.";
      if (help) {
        help.className = "helper";
        help.innerHTML = TEACHER_EMAIL_REQUIREMENT;
      }
    } else {
      emailFeedback.className = "feedback bad";
      emailFeedback.textContent = "Only staff emails ending in cewa.edu.au or .wa.edu.au are allowed.";
      if (help) {
        help.className = "feedback warn";
        help.innerHTML = "If you're a teacher and your email address doesn't end in `@cewa.edu.au` or `.wa.edu.au`, please email <a href=\"mailto:tania.byrnes@cewa.edu.au\" style=\"color: inherit; font-weight: 700;\">tania.byrnes@cewa.edu.au</a> to add your email to the list of eligible registrations.";
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("teacher-name").value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const schoolName = document.getElementById("teacher-school").value.trim();
    const password = document.getElementById("teacher-password").value;
    const schoolConfirmed = document.getElementById("teacher-school-confirm")?.checked;
    const schoolFeedback = document.getElementById("teacher-school-feedback");
    if (!isAllowedTeacherEmail(email)) {
      signupFeedback.className = "feedback bad";
      signupFeedback.textContent = "Teacher signup blocked. Use an approved school email domain.";
      return;
    }
    const validSchools = JSON.parse(document.getElementById("teacher-school").dataset.validSchools || "[]");
    if (!validSchools.includes(schoolName)) {
      if (schoolFeedback) {
        schoolFeedback.className = "feedback bad";
        schoolFeedback.textContent = "Please choose a school from the approved list.";
      }
      return;
    }
    if (!schoolConfirmed) {
      if (schoolFeedback) {
        schoolFeedback.className = "feedback bad";
        schoolFeedback.textContent = "Confirm that the selected school is correct before registering.";
      }
      return;
    }
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      signupFeedback.className = "feedback bad";
      signupFeedback.textContent = "Supabase is not configured yet. Add your config file before using real signup.";
      return;
    }

    try {
      signupFeedback.className = "feedback warn";
      signupFeedback.textContent = "Creating teacher account and sending verification email...";

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: buildTeacherLoginUrl(),
          data: {
            full_name: fullName,
            school_name: schoolName
          }
        }
      });

      if (authError) throw authError;

      const school = await ensureSchoolRecord(supabase, schoolName);
      const teacher = await ensureTeacherProfile(supabase, {
        full_name: fullName,
        email,
        email_domain: extractEmailDomain(email),
        password_hash: "__supabase_auth__",
        school_id: school.id
      });

      writeState({
        teacher: {
          id: teacher.id,
          fullName,
          email,
          schoolName
        }
      });

      const needsEmailConfirmation = !authData?.session;
      signupFeedback.className = "feedback good";
      signupFeedback.textContent = needsEmailConfirmation
        ? `Teacher account created for ${schoolName}. Check your school email and confirm it before logging in.`
        : "Teacher account created and signed in. Next step: create a class.";
      initAuthContext();
    } catch (error) {
      signupFeedback.className = "feedback bad";
      signupFeedback.textContent = error.message || "Teacher signup failed.";
    }
  });
}

function initTeacherLogin() {
  const form = document.getElementById("teacher-login-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("teacher-login-email").value.trim().toLowerCase();
    const password = document.getElementById("teacher-login-password").value;
    const feedback = document.getElementById("teacher-login-feedback");
    if (!isAllowedTeacherEmail(email)) {
      feedback.className = "feedback bad";
      feedback.textContent = "This prototype only allows teacher emails ending in cewa.edu.au or .wa.edu.au.";
      return;
    }

    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const storedTeacher = readState().teacher || {};
      const fallback = {
        fullName: storedTeacher.fullName || email,
        schoolName: storedTeacher.schoolName || ""
      };
      let teacher = await getTeacherProfileByEmail(supabase, email);
      if (!teacher) {
        teacher = await ensureTeacherProfileFromState(supabase, email, fallback);
      }
      writeState({
        teacherLogin: {
          email,
          loggedInAt: new Date().toISOString()
        },
        teacher: teacher ? {
          id: teacher.id,
          fullName: teacher.full_name || fallback.fullName,
          email: teacher.email,
          schoolId: teacher.school_id,
          schoolName: fallback.schoolName || readState().teacher?.schoolName
        } : readState().teacher
      });

      feedback.className = "feedback good";
      const nextPath = "../dashboards/teacher.html";
      feedback.textContent = `Teacher login accepted for ${email}. Redirecting you to the teacher dashboard.`;
      initAuthContext();
      redirectAfterDelay(nextPath);
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Teacher login failed.";
    }
  });
}

async function initTeacherPasswordReset() {
  const requestForm = document.getElementById("teacher-reset-request-form");
  const completeForm = document.getElementById("teacher-reset-complete-form");
  if (!requestForm && !completeForm) return;

  const requestFeedback = document.getElementById("teacher-reset-request-feedback");
  const completeFeedback = document.getElementById("teacher-reset-complete-feedback");
  const supabase = await getSupabaseClientOrNull();

  if (!supabase) {
    if (requestFeedback) {
      requestFeedback.className = "feedback bad";
      requestFeedback.textContent = "Supabase is not configured yet.";
    }
    if (completeFeedback) {
      completeFeedback.className = "feedback bad";
      completeFeedback.textContent = "Supabase is not configured yet.";
    }
    return;
  }

  const syncRecoveryView = async () => {
    const recoveryFromUrl = hasRecoveryTokensInUrl();
    let hasRecoverySession = false;

    try {
      const { data } = await supabase.auth.getSession();
      hasRecoverySession = Boolean(data?.session);
    } catch (error) {
      console.error("Unable to inspect reset session:", error);
    }

    const showComplete = recoveryFromUrl || hasRecoverySession;
    if (requestForm) {
      requestForm.style.display = showComplete ? "none" : "";
    }
    if (completeForm) {
      completeForm.style.display = showComplete ? "" : "none";
    }

    if (showComplete && completeFeedback) {
      completeFeedback.className = "feedback warn";
      completeFeedback.textContent = "Recovery link detected. Set your new password below.";
    }
  };

  await syncRecoveryView();

  if (requestForm) {
    requestForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("teacher-reset-email").value.trim().toLowerCase();
      if (!requestFeedback) return;
      if (!isAllowedTeacherEmail(email)) {
        requestFeedback.className = "feedback bad";
        requestFeedback.textContent = "Use your approved school email address.";
        return;
      }

      try {
        requestFeedback.className = "feedback warn";
        requestFeedback.textContent = "Sending reset email...";
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: buildTeacherResetUrl()
        });
        if (error) throw error;
        requestFeedback.className = "feedback good";
        requestFeedback.textContent = "Reset email sent. Open the link in your inbox, then return here to set a new password.";
      } catch (error) {
        requestFeedback.className = "feedback bad";
        requestFeedback.textContent = error.message || "Password reset email could not be sent.";
      }
    });
  }

  if (completeForm) {
    completeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = document.getElementById("teacher-new-password").value;
      const confirmPassword = document.getElementById("teacher-confirm-password").value;
      if (!completeFeedback) return;

      if (password.length < 8) {
        completeFeedback.className = "feedback bad";
        completeFeedback.textContent = "Use a password with at least 8 characters.";
        return;
      }
      if (password !== confirmPassword) {
        completeFeedback.className = "feedback bad";
        completeFeedback.textContent = "The two password fields do not match.";
        return;
      }

      try {
        completeFeedback.className = "feedback warn";
        completeFeedback.textContent = "Saving your new password...";
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        completeFeedback.className = "feedback good";
        completeFeedback.textContent = "Password updated successfully. You can now return to teacher login.";
        completeForm.reset();
        window.setTimeout(() => {
          window.location.href = "./teacher-login.html";
        }, 1200);
      } catch (error) {
        completeFeedback.className = "feedback bad";
        completeFeedback.textContent = error.message || "Could not update password from this reset link.";
      }
    });
  }
}

function initStudentLogin() {
  const usernameInput = document.getElementById("student-username");
  const feedback = document.getElementById("student-username-feedback");
  const form = document.getElementById("student-login-form");
  if (!usernameInput || !form) return;

  const redirectedError = sessionStorage.getItem("student-login-error");
  if (redirectedError) {
    feedback.className = "feedback bad";
    feedback.textContent = redirectedError;
    sessionStorage.removeItem("student-login-error");
  }

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      feedback.className = "feedback";
      feedback.textContent = "";
      return;
    }
    if (isValidStudentUsername(username)) {
      feedback.className = "feedback good";
      feedback.textContent = "Username format looks good for a student account.";
    } else {
      feedback.className = "feedback warn";
      feedback.textContent = "Use the exact teacher-issued username. Letters and numbers are allowed, but no spaces or email addresses.";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const username = usernameInput.value.trim();
    if (!isValidStudentUsername(username)) {
      feedback.className = "feedback bad";
      feedback.textContent = "Use the exact teacher-issued username. Letters and numbers are allowed, but no spaces or email addresses.";
      return;
    }
    const password = document.getElementById("student-password").value;
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
      }
      const student = await getStudentProfileByUsername(supabase, username);
      if (!student) {
        throw new Error("Incorrect username.");
      }
      if (!student.is_active) {
        throw new Error("This student account is inactive.");
      }

      const candidateHash = await hashValue(password);
      if (candidateHash !== student.password_hash) {
        throw new Error("Incorrect password.");
      }

      const ensuredProfile = await ensurePlayerProfile(supabase, student.id);
      let economySession = { profile: ensuredProfile, assets: null };
      try {
        economySession = await getStudentEconomySession(supabase, student.id);
      } catch (error) {
        console.error("Student economy session could not be loaded:", error);
      }

      const { error: loginStampError } = await supabase
        .from("students")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", student.id);

      if (loginStampError) throw loginStampError;

      writeState({
        studentLogin: {
          id: student.id,
          username: student.username,
          displayName: student.display_name,
          schoolId: student.school_id,
          classId: student.class_id,
          schoolName: student.schools?.name || "",
          classCode: student.classes?.class_code || "",
          className: student.classes?.name || "",
          createdByTeacherId: student.created_by_teacher_id,
          loggedInAt: new Date().toISOString()
        },
        classroom: student.class_id ? {
          id: student.class_id,
          classCode: student.classes?.class_code || "",
          className: student.classes?.name || ""
        } : null
      });

      syncStudentPlayerSession(student, economySession.profile || ensuredProfile, economySession.assets);

      feedback.className = "feedback good";
      feedback.textContent = `Welcome, ${student.display_name}. Opening your student hub.`;
      window.location.href = "../dashboards/student.html";
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Student login failed.";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Student Log In";
      }
    }
  });
}

function initDemoStudentLaunchers() {
  document.querySelectorAll("[data-demo-student-launch='true']").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const target = button.dataset.demoStudentTarget || "../dashboards/student.html";
      launchDemoStudentPreview(target);
    });
  });
}

function initCreateClass() {
  const form = document.getElementById("create-class-form");
  if (!form) return;
  const codeOutput = document.getElementById("generated-class-code");
  const feedback = document.getElementById("create-class-feedback");
  const existing = readState();
  if (existing.classroom?.classCode) {
    codeOutput.textContent = existing.classroom.classCode;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const className = document.getElementById("class-name").value.trim();
    const yearLevel = document.getElementById("year-level").value.trim();
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { teacher } = await requireLoggedInTeacher(supabase);
      const classCode = generateClassCode();
      const { data, error } = await supabase
        .from("classes")
        .insert({
          teacher_id: teacher.id,
          school_id: teacher.school_id,
          name: className,
          year_level: yearLevel,
          class_code: classCode
        })
        .select("id, name, year_level, class_code")
        .single();

      if (error) throw error;

      writeState({
        classroom: {
          id: data.id,
          className: data.name,
          yearLevel: data.year_level,
          classCode: data.class_code,
          createdAt: new Date().toISOString()
        }
      });
      codeOutput.textContent = classCode;
      feedback.className = "feedback good";
      feedback.textContent = `Class "${className}" created for Year ${yearLevel}. Share code ${classCode} with students only if needed.`;
      initAuthContext();
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Class creation failed.";
    }
  });
}

function initAddStudents() {
  const form = document.getElementById("add-student-form");
  const displayNameInput = document.getElementById("new-student-display-name");
  const usernameInput = document.getElementById("new-student-username");
  const feedback = document.getElementById("new-student-feedback");
  const suggestionBox = document.getElementById("new-student-username-suggestions");
  const list = document.getElementById("generated-students");
  const generatedCredentials = document.getElementById("generated-student-credentials");
  if (!form || !displayNameInput || !usernameInput || !list) return;

  const render = async () => {
    const supabase = await getSupabaseClientOrNull();
    const state = readState();
    const currentClassName = getClassroomDisplayName(state.classroom, "Current class");
    if (!supabase || !state.classroom?.id) {
      list.innerHTML = '<div class="small-note">Create a class first, then student accounts will appear here.</div>';
      return;
    }
    const { data: students, error } = await supabase
      .from("students")
      .select("display_name, username, created_at")
      .eq("class_id", state.classroom.id)
      .order("created_at", { ascending: false });

    if (error) {
      list.innerHTML = `<div class="small-note">${error.message}</div>`;
      return;
    }

    if (!students.length) {
      list.innerHTML = '<div class="small-note">No student accounts created in this prototype yet.</div>';
      return;
    }
    list.innerHTML = students.map(student => `
      <div class="generated-item">
        <div>
          <strong>${student.display_name}</strong>
          <div class="small-note">Username: ${student.username} • Class: ${currentClassName || "Unassigned"}</div>
        </div>
        <div class="small-note">Created: ${new Date(student.created_at).toLocaleDateString()}</div>
      </div>
    `).join("");
  };

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      feedback.className = "feedback";
      feedback.textContent = "";
      return;
    }
    if (isValidStudentUsername(username)) {
      feedback.className = "feedback good";
      feedback.textContent = "Username format is valid.";
    } else {
      feedback.className = "feedback warn";
      feedback.textContent = "Use a teacher-issued username with letters and optional numbers. No spaces or email addresses.";
    }
  });

  const renderUsernameSuggestions = () => {
    if (!suggestionBox) return;
    const suggestions = generateStudentUsernameSuggestions(displayNameInput.value.trim());
    if (!suggestions.length) {
      suggestionBox.textContent = "Suggested pattern: Firstname + surname initial or extra surname letters, for example MarkT or MarkTh1.";
      return;
    }
    suggestionBox.innerHTML = `Suggestions: ${suggestions.map(item => `<strong>${item}</strong>`).join(" · ")}`;
  };

  displayNameInput.addEventListener("input", renderUsernameSuggestions);
  renderUsernameSuggestions();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const displayName = document.getElementById("new-student-display-name").value.trim();
    const username = usernameInput.value.trim();
    const state = readState();
    const className = getClassroomDisplayName(state.classroom, "Current class");
    if (!isValidStudentUsername(username)) {
      feedback.className = "feedback bad";
      feedback.textContent = "Student usernames must start with a letter and use only letters or numbers. No spaces or email addresses.";
      return;
    }
    const password = document.getElementById("new-student-password").value.trim() || generateStudentPassword();
    const supabase = await getSupabaseClientOrNull();
    if (!supabase) {
      feedback.className = "feedback bad";
      feedback.textContent = "Supabase is not configured yet.";
      return;
    }

    try {
      const { teacher } = await requireLoggedInTeacher(supabase);
      if (!state.classroom?.id) {
        throw new Error("Create a class before adding students.");
      }

      const existingMatches = await findStudentProfilesByUsername(supabase, username);
      if (existingMatches.length) {
        throw new Error(`Username "${username}" is already in use. Please choose a different student username.`);
      }

      const passwordHash = await hashValue(password);
      const { error } = await supabase
        .from("students")
        .insert({
          display_name: displayName,
          username,
          password_hash: passwordHash,
          school_id: teacher.school_id,
          class_id: state.classroom.id,
          created_by_teacher_id: teacher.id
        });

      if (error) throw error;

      const insertedStudent = await getStudentProfileByUsername(supabase, username);
      if (insertedStudent) {
        await ensurePlayerProfile(supabase, insertedStudent.id);
      }

      form.reset();
      feedback.className = "feedback good";
      feedback.textContent = `Student account created for ${displayName}. Temporary password: ${password}`;
      if (generatedCredentials) {
        generatedCredentials.style.display = "block";
        generatedCredentials.innerHTML = `
          <p><strong>Student account created</strong></p>
          <p><strong>Name:</strong> ${displayName}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Temporary password:</strong> ${password}</p>
          <p class="small-note">Please copy these details now and share them securely with the student.</p>
        `;
      }
      render();
    } catch (error) {
      feedback.className = "feedback bad";
      feedback.textContent = error.message || "Student creation failed.";
    }
  });

  render().catch(error => {
    console.error(error);
  });
}

function initAuthContext() {
  const state = readState();
  setText("teacher-name-preview", state.teacher?.fullName || "No teacher saved yet");
  setText("teacher-school-preview", state.teacher?.schoolName || "School not set yet");
  setText("class-preview", getClassroomDisplayName(state.classroom));
  setText("class-code-preview", getClassroomCode(state.classroom));
}

async function initManageStudents() {
  const list = document.getElementById("manage-students-list");
  const feedback = document.getElementById("manage-students-feedback");
  const classNameEl = document.getElementById("manage-class-name");
  const classCodeEl = document.getElementById("manage-class-code");
  const resetResult = document.getElementById("reset-password-result");
  const rosterFilter = document.getElementById("manage-student-filter");
  const classSelector = document.getElementById("manage-class-selector");
  if (!list || !feedback || !classNameEl || !classCodeEl || !resetResult) return;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    feedback.className = "feedback bad";
    feedback.textContent = "Supabase is not configured yet.";
    return;
  }

  try {
    const { teacher } = await requireLoggedInTeacher(supabase);
    const state = readState();
    const { data: classRows, error: classError } = await supabase
      .from("classes")
      .select("id, name, year_level, class_code, created_at")
      .eq("school_id", teacher.school_id)
      .order("created_at", { ascending: false });

    if (classError) throw classError;
    if (!classRows?.length) {
      feedback.className = "feedback warn";
      feedback.textContent = "No class found yet. Create a class first.";
      classNameEl.textContent = "No class created yet";
      classCodeEl.textContent = "Pending";
      if (classSelector) classSelector.innerHTML = '<option value="">No classes found</option>';
      return;
    }

    const normalisedClasses = classRows.map(normaliseClassroomRecord);
    let classroom = normalisedClasses.find(row => row.id && row.id === state.classroom?.id)
      || normalisedClasses.find(row => row.classCode && row.classCode === getClassroomCode(state.classroom, ""))
      || normalisedClasses[0];

    const syncClassHeader = () => {
      classNameEl.textContent = getClassroomDisplayName(classroom, "Current class");
      classCodeEl.textContent = getClassroomCode(classroom);
      initAuthContext();
    };

    if (!state.classroom?.id || state.classroom.id !== classroom.id || !state.classroom?.className || Object.prototype.hasOwnProperty.call(state.classroom, "name") || getClassroomDisplayName(state.classroom, "") !== getClassroomDisplayName(classroom, "")) {
      writeState({ classroom });
    }

    if (classSelector) {
      classSelector.innerHTML = normalisedClasses.map(row => `
        <option value="${escapeHtml(row.id)}" ${row.id === classroom.id ? "selected" : ""}>${escapeHtml(getClassroomDisplayName(row, "Current class"))} (${escapeHtml(getClassroomCode(row, "No code"))})</option>
      `).join("");
      classSelector.onchange = async () => {
        const nextClassroom = normalisedClasses.find(row => row.id === classSelector.value);
        if (!nextClassroom) return;
        classroom = nextClassroom;
        writeState({ classroom });
        syncClassHeader();
        resetResult.innerHTML = '<p class="small-note">Reset a student password to see the new temporary credential here.</p>';
        await renderStudents();
      };
    }

    syncClassHeader();

    const oldLoginDays = 90;
    const neverUsedCleanupDays = 14;

    const getStudentLoginState = student => {
      const daysSinceLogin = getDaysSince(student.last_login_at);
      const daysSinceCreated = getDaysSince(student.created_at);
      const neverUsed = !student.last_login_at;
      const staleNeverUsed = neverUsed && daysSinceCreated !== null && daysSinceCreated >= neverUsedCleanupDays;
      const oldLogin = Boolean(student.last_login_at && daysSinceLogin !== null && daysSinceLogin >= oldLoginDays);
      const deletedLogin = !student.is_active && /^Deleted/i.test(String(student.username || ""));

      if (deletedLogin) {
        return {
          label: "Login deleted",
          tone: "bad",
          detail: "Old credentials have been removed.",
          neverUsed,
          oldLogin,
          needsCleanup: false,
          deletedLogin
        };
      }

      if (!student.is_active) {
        return {
          label: "Inactive login",
          tone: "bad",
          detail: "Student cannot log in unless reactivated.",
          neverUsed,
          oldLogin,
          needsCleanup: false,
          deletedLogin
        };
      }

      if (neverUsed) {
        return {
          label: staleNeverUsed ? "Never used" : "Not used yet",
          tone: staleNeverUsed ? "warn" : "",
          detail: daysSinceCreated === null
            ? "No login recorded."
            : `Created ${daysSinceCreated} day${daysSinceCreated === 1 ? "" : "s"} ago with no login.`,
          neverUsed,
          oldLogin,
          needsCleanup: true,
          deletedLogin
        };
      }

      if (oldLogin) {
        return {
          label: "Old login",
          tone: "warn",
          detail: `Last used ${daysSinceLogin} day${daysSinceLogin === 1 ? "" : "s"} ago.`,
          neverUsed,
          oldLogin,
          needsCleanup: true,
          deletedLogin
        };
      }

      return {
        label: "Active",
        tone: "good",
        detail: daysSinceLogin === null ? "Ready for student login." : `Last used ${daysSinceLogin} day${daysSinceLogin === 1 ? "" : "s"} ago.`,
        neverUsed,
        oldLogin,
        needsCleanup: false,
        deletedLogin
      };
    };

    const matchesRosterFilter = (student, state) => {
      const filterValue = rosterFilter?.value || "active";
      if (filterValue === "all") return true;
      if (filterValue === "inactive") return !student.is_active;
      if (filterValue === "never-used") return student.is_active && state.neverUsed;
      if (filterValue === "needs-cleanup") return student.is_active && (state.neverUsed || state.oldLogin);
      return student.is_active;
    };

    const buildDeletedUsername = student => {
      const compactId = String(student.id || Date.now()).replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
      const timeSuffix = Date.now().toString(36).slice(-5);
      return `Deleted${compactId}${timeSuffix}`.slice(0, 24);
    };

    const setActionStatus = (studentId, message, tone = "") => {
      const status = list.querySelector(`[data-student-action-status="${studentId}"]`);
      if (status) {
        status.className = `small-note ${tone ? `feedback ${tone}` : ""}`.trim();
        status.textContent = message;
      }
    };

    const renderStudents = async () => {
      const { data: students, error: studentError } = await supabase
        .from("students")
        .select("id, display_name, username, created_at, last_login_at, is_active")
        .eq("class_id", classroom.id)
        .order("created_at", { ascending: true });

      if (studentError) throw studentError;

      if (!students.length) {
        feedback.className = "feedback warn";
        feedback.textContent = "No students found in this class yet.";
        list.innerHTML = "";
        return;
      }

      const rows = students
        .map(student => ({ student, state: getStudentLoginState(student) }))
        .filter(({ student, state }) => matchesRosterFilter(student, state));

      if (!rows.length) {
        feedback.className = "feedback warn";
        feedback.textContent = `${students.length} student account(s) loaded, but none match this roster view.`;
        list.innerHTML = '<div class="small-note">Try another roster view to see more accounts.</div>';
        return;
      }

      const cleanupCount = students
        .map(student => getStudentLoginState(student))
        .filter(state => state.needsCleanup).length;

      feedback.className = cleanupCount ? "feedback warn" : "feedback good";
      feedback.textContent = `${rows.length} of ${students.length} student account(s) shown. ${cleanupCount} active login${cleanupCount === 1 ? "" : "s"} may need cleanup.`;
      list.innerHTML = rows.map(({ student, state }) => {
        const actionLabel = student.is_active ? "Deactivate login" : "Reactivate login";
        const actionType = student.is_active ? "deactivate" : "activate";
        const canDeleteLogin = student.is_active || !state.deletedLogin;
        return `
        <div class="generated-item student-manager-item ${student.is_active ? "" : "is-inactive"}">
          <div class="student-manager-main">
            <strong>${escapeHtml(student.display_name)}</strong>
            <div class="small-note">Username: ${escapeHtml(student.username)}</div>
            <div class="small-note">Created: ${escapeHtml(formatDateTime(student.created_at) || "Date unavailable")}</div>
            <div class="small-note">Last login: ${student.last_login_at ? escapeHtml(formatDateTime(student.last_login_at)) : "Not yet logged in"}</div>
            <div class="student-manager-meta">
              <span class="student-manager-status ${state.tone}">${escapeHtml(state.label)}</span>
              <span class="student-manager-status">${escapeHtml(state.detail)}</span>
            </div>
          </div>
          <div class="student-manager-actions">
            <label for="reset-password-${escapeHtml(student.id)}">Optional new password</label>
            <input id="reset-password-${escapeHtml(student.id)}" class="manage-password-input" type="text" placeholder="Blank = auto-generate" autocomplete="off" data-student-id="${escapeHtml(student.id)}">
            <div class="button-row">
              <button type="button" class="button-secondary manage-reset-password" data-student-id="${escapeHtml(student.id)}">Reset password</button>
              <button type="button" class="button-secondary ${student.is_active ? "button-warning" : ""} manage-toggle-login" data-student-id="${escapeHtml(student.id)}" data-login-action="${actionType}">${actionLabel}</button>
              ${canDeleteLogin ? `<button type="button" class="button-secondary button-danger manage-delete-login" data-student-id="${escapeHtml(student.id)}">Delete login</button>` : ""}
            </div>
            <div class="small-note" data-student-action-status="${escapeHtml(student.id)}"></div>
          </div>
        </div>
      `;
      }).join("");

      list.querySelectorAll(".manage-reset-password").forEach(button => {
        button.addEventListener("click", async () => {
          const student = students.find(item => item.id === button.dataset.studentId);
          if (!student) return;
          const passwordInput = list.querySelector(`.manage-password-input[data-student-id="${student.id}"]`);
          const enteredPassword = passwordInput?.value.trim() || "";
          const usedGeneratedPassword = !enteredPassword;
          const newPassword = enteredPassword || generateStudentPassword();

          try {
            button.disabled = true;
            setActionStatus(student.id, usedGeneratedPassword ? "No password entered. Generating a temporary password..." : "Resetting password...");
            const passwordHash = await hashValue(newPassword);
            const { error: updateError } = await supabase
              .from("students")
              .update({ password_hash: passwordHash, is_active: true })
              .eq("id", student.id);

            if (updateError) throw updateError;

            if (passwordInput) passwordInput.value = "";
            resetResult.innerHTML = `
            <p><strong>Password reset successful</strong></p>
            <p><strong>Name:</strong> ${escapeHtml(student.display_name)}</p>
            <p><strong>Username:</strong> ${escapeHtml(student.username)}</p>
            <p><strong>New ${usedGeneratedPassword ? "temporary" : "teacher-set"} password:</strong> ${escapeHtml(newPassword)}</p>
            <p class="small-note">${usedGeneratedPassword ? "No password was entered, so a temporary password was generated and applied." : "The teacher-entered password was applied."} The previous password is no longer valid.</p>
          `;
            feedback.className = usedGeneratedPassword ? "feedback warn" : "feedback good";
            feedback.textContent = usedGeneratedPassword
              ? `Password reset for ${student.display_name}. No password was entered, so a temporary one was generated.`
              : `Password reset for ${student.display_name}.`;
            setActionStatus(student.id, "Password reset complete.", usedGeneratedPassword ? "warn" : "good");
            await renderStudents();
          } catch (error) {
            feedback.className = "feedback bad";
            feedback.textContent = error.message || "Password reset failed.";
            setActionStatus(student.id, error.message || "Password reset failed.", "bad");
          } finally {
            button.disabled = false;
          }
        });
      });

      list.querySelectorAll(".manage-toggle-login").forEach(button => {
        button.addEventListener("click", async () => {
          const student = students.find(item => item.id === button.dataset.studentId);
          if (!student) return;
          const shouldActivate = button.dataset.loginAction === "activate";
          try {
            button.disabled = true;
            setActionStatus(student.id, shouldActivate ? "Reactivating login..." : "Deactivating login...");
            const { error: updateError } = await supabase
              .from("students")
              .update({ is_active: shouldActivate })
              .eq("id", student.id);

            if (updateError) throw updateError;

            feedback.className = "feedback good";
            feedback.textContent = shouldActivate
              ? `Login reactivated for ${student.display_name}.`
              : `Login deactivated for ${student.display_name}.`;
            await renderStudents();
          } catch (error) {
            feedback.className = "feedback bad";
            feedback.textContent = error.message || "Could not update login status.";
            setActionStatus(student.id, error.message || "Could not update login status.", "bad");
          } finally {
            button.disabled = false;
          }
        });
      });

      list.querySelectorAll(".manage-delete-login").forEach(button => {
        button.addEventListener("click", async () => {
          const student = students.find(item => item.id === button.dataset.studentId);
          if (!student) return;
          const confirmed = window.confirm(`Delete login credentials for ${student.display_name}? This blocks old username/password access but keeps class evidence attached to the student record.`);
          if (!confirmed) return;

          try {
            button.disabled = true;
            setActionStatus(student.id, "Deleting login credentials...");
            const deletedUsername = buildDeletedUsername(student);
            const deletedPasswordHash = await hashValue(`${deletedUsername}:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`);
            const { error: updateError } = await supabase
              .from("students")
              .update({
                username: deletedUsername,
                password_hash: deletedPasswordHash,
                is_active: false
              })
              .eq("id", student.id);

            if (updateError) throw updateError;

            resetResult.innerHTML = `
              <p><strong>Login deleted</strong></p>
              <p><strong>Name:</strong> ${escapeHtml(student.display_name)}</p>
              <p class="small-note">The old username and password no longer work. Any saved class evidence remains attached to this student record.</p>
            `;
            feedback.className = "feedback good";
            feedback.textContent = `Login credentials deleted for ${student.display_name}.`;
            await renderStudents();
          } catch (error) {
            feedback.className = "feedback bad";
            feedback.textContent = error.message || "Could not delete login credentials.";
            setActionStatus(student.id, error.message || "Could not delete login credentials.", "bad");
          } finally {
            button.disabled = false;
          }
        });
      });
    };

    if (rosterFilter) {
      rosterFilter.addEventListener("change", renderStudents);
    }

    await renderStudents();
  } catch (error) {
    feedback.className = "feedback bad";
    feedback.textContent = error.message || "Student manager could not be loaded.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTeacherNavigation();
  initAuthContext();
  loadSchoolOptions();
  initDemoStudentLaunchers();
  initTeacherSignup();
  initTeacherLogin();
  initTeacherPasswordReset().catch(error => {
    console.error("Teacher password reset could not initialize:", error);
  });
  initStudentLogin();
  initCreateClass();
  initAddStudents();
  initManageStudents();
});
