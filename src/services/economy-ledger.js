(function attachCareerEmpireEconomy(windowObj) {
  const PLAYER_SESSION_KEY = "career-empire-session";
  const ECONOMY_LOG_LIMIT = 60;

  function readJsonStorage(key, fallback) {
    try {
      return JSON.parse(windowObj.localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function getSession() {
    return readJsonStorage(PLAYER_SESSION_KEY, {});
  }

  function writeSession(patch) {
    const next = { ...getSession(), ...patch };
    windowObj.localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
    return next;
  }

  function buildEvent(entry = {}) {
    return {
      id: entry.id || `eco-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      moduleId: entry.moduleId || "platform",
      eventType: entry.eventType || "progress-saved",
      checkpoint: entry.checkpoint || "",
      label: entry.label || "",
      detail: entry.detail || "",
      earnedDelta: Number(entry.earnedDelta || 0),
      taxDelta: Number(entry.taxDelta || 0),
      spendDelta: Number(entry.spendDelta || 0),
      savingsDelta: Number(entry.savingsDelta || 0),
      annualSalaryAfter: typeof entry.annualSalaryAfter === "number" ? entry.annualSalaryAfter : undefined,
      netWorthAfter: typeof entry.netWorthAfter === "number" ? entry.netWorthAfter : undefined,
      savingsAfter: typeof entry.savingsAfter === "number" ? entry.savingsAfter : undefined,
      taxPaidAfter: typeof entry.taxPaidAfter === "number" ? entry.taxPaidAfter : undefined,
      salaryBoostTotal: typeof entry.salaryBoostTotal === "number" ? entry.salaryBoostTotal : undefined,
      taxContributionTotal: typeof entry.taxContributionTotal === "number" ? entry.taxContributionTotal : undefined
    };
  }

  function appendEvent(entry = {}) {
    const session = getSession();
    const currentLog = Array.isArray(session.economyLog) ? session.economyLog : [];
    const nextLog = [buildEvent(entry), ...currentLog].slice(0, ECONOMY_LOG_LIMIT);
    writeSession({ economyLog: nextLog });
    return nextLog;
  }

  windowObj.CareerEmpireEconomy = {
    PLAYER_SESSION_KEY,
    ECONOMY_LOG_LIMIT,
    getSession,
    writeSession,
    buildEvent,
    appendEvent
  };
})(window);
