(function () {
  const AUTH_STATE_KEY = "career-empire-auth-demo";
  const PLAYER_SESSION_KEY = "career-empire-session";
  const TEACHER_SESSION_KEY = "career-empire-teacher-session";
  const TEACHER_FILTER_KEY = "career-empire-teacher-stats-dashboard-filter";
  const LEGACY_TEACHER_FILTER_KEY = "career-empire-teacher-dashboard-filter";

  function readJsonStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function persistAuthState(nextState) {
    const cleaned = Object.fromEntries(
      Object.entries(nextState || {}).filter(([, value]) => value !== undefined && value !== null)
    );
    if (Object.keys(cleaned).length) {
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(cleaned));
    } else {
      localStorage.removeItem(AUTH_STATE_KEY);
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getAppRootPrefix() {
    const path = window.location.pathname;
    if (path.includes("/modules/")) return "../../";
    if (path.includes("/auth/") || path.includes("/dashboards/") || path.includes("/shop/")) return "../";
    return "./";
  }

  function getAppPath(pathFromRoot) {
    return `${getAppRootPrefix()}${pathFromRoot}`;
  }

  function getStudentIdentity(state, session) {
    const login = state?.studentLogin || {};
    const hasStudent = login.id || login.username || login.displayName || session?.studentId || session?.username || session?.playerName;
    if (!hasStudent) return null;

    const isDemo = Boolean(login.demo || session?.demoMode);
    const isPreview = Boolean(login.preview && !login.id && !isDemo);
    return {
      role: "student",
      stamp: isDemo
        ? "Demo Student"
        : login.username || session?.username || login.displayName || session?.playerName || "Student",
      title: isDemo
        ? "Demo student preview"
        : isPreview
          ? "Teacher test-student preview"
          : login.displayName && login.username && login.displayName !== login.username
            ? login.displayName
            : "Student login",
      mode: isDemo ? "Demo" : isPreview ? "Preview" : "Student"
    };
  }

  function getTeacherIdentity(state, teacherSession = {}) {
    const teacher = state?.teacher || {};
    const teacherLogin = state?.teacherLogin || {};
    const email = teacherLogin.email || teacher.email || "";
    const display = email || teacher.fullName || teacherLogin.fullName || teacherSession.classCode || "";
    if (!display) return null;

    return {
      role: "teacher",
      stamp: email || display,
      title: teacher.fullName && email
        ? teacher.fullName
        : teacherSession.classCode
          ? `Teacher session - Class ${teacherSession.classCode}`
          : "Teacher login",
      mode: "Teacher"
    };
  }

  function getContainerButtonClass(container) {
    if (container.classList.contains("workflow-links")) return "workflow-link";
    if (container.classList.contains("module-nav")) return "module-nav-link";
    if (container.classList.contains("top-links")) return "ghost-link";
    return "dashboard-nav-link";
  }

  function getPageSessionScope() {
    const path = window.location.pathname;
    if (
      document.body?.dataset?.teacherNavActive ||
      path.includes("/dashboards/teacher.html") ||
      path.includes("/auth/teacher-") ||
      path.includes("/auth/create-class") ||
      path.includes("/auth/add-students") ||
      path.includes("/auth/manage-students")
    ) {
      return "teacher";
    }
    if (path.includes("/auth/index.html")) return "mixed";
    return "student";
  }

  function installStyles() {
    if (document.getElementById("career-empire-session-banner-style")) return;
    const style = document.createElement("style");
    style.id = "career-empire-session-banner-style";
    style.textContent = `
      .session-banner-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        margin-left: auto;
        min-width: min(100%, 250px);
      }

      .session-stamp {
        min-width: 0;
        max-width: 100%;
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 11px;
        border-radius: 8px;
        border: 1px solid rgba(128, 237, 153, 0.32);
        color: inherit;
        background: rgba(128, 237, 153, 0.1);
        line-height: 1;
      }

      .session-stamp-label {
        color: rgba(199, 216, 247, 0.82);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .session-stamp strong {
        display: block;
        max-width: 220px;
        overflow: hidden;
        color: inherit;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.15;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .session-stamp small {
        display: block;
        margin-top: 3px;
        color: rgba(199, 216, 247, 0.76);
        font-size: 11px;
        font-weight: 600;
        line-height: 1.15;
      }

      .session-logout-button {
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        border-radius: 8px;
        border: 1px solid rgba(126, 168, 255, 0.28);
        color: #e9f1ff;
        background: rgba(12, 22, 39, 0.58);
        box-shadow: none;
        text-decoration: none;
      }

      .session-logout-button[disabled] {
        cursor: wait;
        color: rgba(233, 241, 255, 0.72);
        background: rgba(12, 22, 39, 0.48);
        opacity: 0.68;
      }

      .auth-topbar .top-links {
        align-items: center;
        justify-content: flex-end;
      }

      .auth-topbar .session-banner-actions {
        flex: 0 1 auto;
        min-width: 0;
      }

      @media (max-width: 680px) {
        .auth-topbar {
          flex-wrap: wrap;
        }

        .auth-topbar .top-links {
          justify-content: flex-start;
        }

        .session-banner-actions {
          width: 100%;
          justify-content: flex-start;
          margin-left: 0;
        }

        .session-stamp strong {
          max-width: 170px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createStamp(identity) {
    const stamp = document.createElement("span");
    stamp.className = "session-stamp";
    stamp.title = `${identity.mode}: ${identity.title}`;
    stamp.innerHTML = `
      <span class="session-stamp-label">${escapeHtml(identity.mode)}</span>
      <span>
        <strong>${escapeHtml(identity.stamp)}</strong>
        <small>${escapeHtml(identity.title)}</small>
      </span>
    `;
    return stamp;
  }

  function createLogoutButton(identity, buttonClass) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${buttonClass} session-logout-button`;
    button.dataset.sessionLogoutRole = identity.role;
    button.textContent = identity.role === "teacher" ? "Teacher Logout" : "Student Logout";
    return button;
  }

  function getSessionBannerContainers(scope) {
    const path = window.location.pathname;
    const authTopbarContainers = Array.from(document.querySelectorAll(".auth-topbar .top-links"));
    if (path.includes("/auth/") && authTopbarContainers.length) {
      return authTopbarContainers;
    }

    const primaryContainers = Array.from(document.querySelectorAll(".dashboard-nav, .workflow-links, .module-nav"));
    if (primaryContainers.length) return primaryContainers;

    return Array.from(document.querySelectorAll(".top-links"));
  }

  function render() {
    installStyles();
    document.querySelectorAll("[data-session-banner-actions='true']").forEach(element => element.remove());

    const state = readJsonStorage(AUTH_STATE_KEY, {});
    const session = readJsonStorage(PLAYER_SESSION_KEY, {});
    const teacherSession = readJsonStorage(TEACHER_SESSION_KEY, {});
    const studentIdentity = getStudentIdentity(state, session);
    const teacherIdentity = getTeacherIdentity(state, teacherSession);
    const scope = getPageSessionScope();
    const identities = scope === "teacher"
      ? [teacherIdentity].filter(Boolean)
      : scope === "student"
        ? [studentIdentity || teacherIdentity].filter(Boolean)
        : [studentIdentity, teacherIdentity].filter(Boolean);

    if (!identities.length) return;

    getSessionBannerContainers(scope).forEach(container => {
      const buttonClass = getContainerButtonClass(container);
      const group = document.createElement("div");
      group.className = "session-banner-actions";
      group.dataset.sessionBannerActions = "true";
      identities.forEach(identity => {
        group.appendChild(createStamp(identity));
        group.appendChild(createLogoutButton(identity, buttonClass));
      });
      container.appendChild(group);
    });
  }

  async function signOutTeacherIfPossible() {
    if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") return;
    try {
      const supabase = await window.CareerEmpireSupabase.getClient();
      if (supabase?.auth?.signOut) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Teacher Supabase sign-out failed:", error);
    }
  }

  function clearStudentSession() {
    const state = readJsonStorage(AUTH_STATE_KEY, {});
    delete state.studentLogin;
    persistAuthState(state);
    localStorage.removeItem(PLAYER_SESSION_KEY);
    sessionStorage.removeItem("student-login-error");
  }

  async function clearTeacherSession() {
    await signOutTeacherIfPossible();
    const state = readJsonStorage(AUTH_STATE_KEY, {});
    delete state.teacherLogin;
    delete state.teacher;
    delete state.classroom;
    if (state.studentLogin?.preview && !state.studentLogin?.id) {
      delete state.studentLogin;
      localStorage.removeItem(PLAYER_SESSION_KEY);
    }
    persistAuthState(state);
    localStorage.removeItem(TEACHER_SESSION_KEY);
    localStorage.removeItem(TEACHER_FILTER_KEY);
    localStorage.removeItem(LEGACY_TEACHER_FILTER_KEY);
  }

  async function handleLogout(role, button) {
    if (button) {
      button.disabled = true;
      button.textContent = "Logging out...";
    }

    if (role === "teacher") {
      await clearTeacherSession();
      window.location.href = getAppPath("auth/teacher-login.html");
      return;
    }

    clearStudentSession();
    window.location.href = getAppPath("auth/student-login.html");
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-session-logout-role]");
    if (!button) return;
    event.preventDefault();
    handleLogout(button.dataset.sessionLogoutRole, button).catch(error => {
      console.error("Logout failed:", error);
      button.disabled = false;
      button.textContent = button.dataset.sessionLogoutRole === "teacher" ? "Teacher Logout" : "Student Logout";
    });
  });

  function init() {
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.CareerEmpireSessionBanner = {
    render,
    clearStudentSession,
    clearTeacherSession
  };
})();
