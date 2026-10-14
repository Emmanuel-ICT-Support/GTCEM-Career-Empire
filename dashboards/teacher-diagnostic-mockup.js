(function () {
  const AUTH_STATE_KEY = "career-empire-auth-demo";

  function readAuthState() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STATE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function hasTeacherAccess() {
    const state = readAuthState();
    return Boolean(
      state?.teacherLogin?.email
      || state?.teacher?.email
      || state?.teacher?.id
    );
  }

  function enforceTeacherAccess() {
    if (hasTeacherAccess()) return true;
    const target = new URL("../auth/teacher-login.html", window.location.href);
    target.searchParams.set("next", "../dashboards/teacher-diagnostic-mockup.html");
    window.location.replace(target.toString());
    return false;
  }

  const needs = [
    {
      id: "challenge",
      title: "Challenge",
      short: "CH",
      question: "Am I ready for my next step?",
      color: "#38d7c7",
      description: "Appropriate stretch: not too easy, not overwhelming."
    },
    {
      id: "confidence",
      title: "Confidence",
      short: "CF",
      question: "Do I believe I can grow?",
      color: "#78a8ff",
      description: "Persistence, feedback use, and recovery after difficulty."
    },
    {
      id: "purpose",
      title: "Purpose",
      short: "PU",
      question: "Why does this matter?",
      color: "#ffb648",
      description: "Relevance, meaning, and connection to future pathways."
    },
    {
      id: "ownership",
      title: "Ownership",
      short: "OW",
      question: "Can I influence my learning?",
      color: "#a78bfa",
      description: "Voice, choice, retry behaviour, and responsibility."
    },
    {
      id: "connection",
      title: "Connection",
      short: "CO",
      question: "Do I belong?",
      color: "#5bd6ff",
      description: "Participation, visibility, shared progress, and support."
    }
  ];

  const students = [
    {
      id: "mia",
      name: "Mia C.",
      classCode: "Y12A",
      likelyNeed: "purpose",
      confidence: "Medium",
      summary: "Completes tasks and scores well, but written responses rarely explain why the learning matters to her future pathway.",
      caution: "This could also be a writing-confidence issue rather than low purpose.",
      nextMove: "Ask for one career-linked reason before the next response, then approve or annotate the evidence.",
      stats: { completion: 82, mastery: 78, attempts: 3, taskTime: "28m", evidence: 7, score: 74 },
      signals: {
        challenge: { score: 54, note: "High completion with steady mastery suggests the work is mostly within reach." },
        confidence: { score: 42, note: "Few retries and no recent teacher feedback loop yet." },
        purpose: { score: 86, note: "Written proof is accurate but light on career relevance." },
        ownership: { score: 58, note: "Has banked STAR evidence and made profile choices." },
        connection: { score: 46, note: "Some class contribution, but limited shared response visibility." }
      },
      evidence: [
        "EST mastery 78% with seven evidence items.",
        "Latest long answer used a correct example but did not name a future pathway.",
        "Community vote submitted once this cycle."
      ]
    },
    {
      id: "zara",
      name: "Zara P.",
      classCode: "Y12A",
      likelyNeed: "challenge",
      confidence: "High",
      summary: "Moves quickly through current tasks with strong scores, so she may need more stretch or leadership responsibility.",
      caution: "Fast completion can also mean she is skipping detail, so check written quality first.",
      nextMove: "Offer an extension response or peer-coaching role tied to evidence quality.",
      stats: { completion: 96, mastery: 91, attempts: 2, taskTime: "19m", evidence: 9, score: 88 },
      signals: {
        challenge: { score: 90, note: "Very high completion and mastery with efficient task time." },
        confidence: { score: 34, note: "No strong confidence concern in current evidence." },
        purpose: { score: 40, note: "Purpose is visible in most reflections." },
        ownership: { score: 70, note: "Uses retries selectively and submits polished STAR evidence." },
        connection: { score: 55, note: "Approved responses can support class comparison." }
      },
      evidence: [
        "Average evidence score 88%.",
        "Two approved long answers are ready for comparison.",
        "Task time is lower than class average while quality remains high."
      ]
    },
    {
      id: "leo",
      name: "Leo M.",
      classCode: "Y12A",
      likelyNeed: "confidence",
      confidence: "Medium",
      summary: "Has started and is trying, but repeated attempts and low glossary accuracy suggest he may need success feedback.",
      caution: "Could be vocabulary load rather than general confidence.",
      nextMove: "Use a short retrieval win, then ask him to revise one response using teacher feedback.",
      stats: { completion: 45, mastery: 38, attempts: 6, taskTime: "42m", evidence: 4, score: 52 },
      signals: {
        challenge: { score: 66, note: "Current tasks may be near the upper edge of readiness." },
        confidence: { score: 84, note: "Repeated attempts plus lower scores point to a need for recovery moments." },
        purpose: { score: 48, note: "Purpose is not the clearest signal yet." },
        ownership: { score: 52, note: "Retries show persistence, but evidence revision is limited." },
        connection: { score: 40, note: "No recent shared or reviewed response." }
      },
      evidence: [
        "Six attempts recorded across active modules.",
        "Glossary final round flagged three term gaps.",
        "Latest response was pending review with a scaffold suggestion."
      ]
    },
    {
      id: "ava",
      name: "Ava N.",
      classCode: "Y12A",
      likelyNeed: "ownership",
      confidence: "Low",
      summary: "Engages when prompted but has few self-directed choices, retries, or evidence tags.",
      caution: "May need clearer instructions before this is treated as low ownership.",
      nextMove: "Give two controlled pathway choices and ask her to tag the evidence she wants reviewed.",
      stats: { completion: 58, mastery: 61, attempts: 1, taskTime: "24m", evidence: 3, score: 65 },
      signals: {
        challenge: { score: 44, note: "Achievement is stable enough for guided choice." },
        confidence: { score: 40, note: "No strong struggle pattern yet." },
        purpose: { score: 52, note: "Some relevance appears in reflection." },
        ownership: { score: 82, note: "Low retry and evidence-tag activity suggests limited agency." },
        connection: { score: 48, note: "Participation is visible but not strongly collaborative." }
      },
      evidence: [
        "Only one recorded attempt despite available retry loops.",
        "Three evidence items saved, none tagged for capability review.",
        "Profile choices are still mostly default."
      ]
    },
    {
      id: "noah",
      name: "Noah R.",
      classCode: "Y12A",
      likelyNeed: "connection",
      confidence: "Medium",
      summary: "Login and task activity are present, but few class-visible contributions or reviewed responses are showing.",
      caution: "Connection cannot be inferred from platform data alone; check learner voice.",
      nextMove: "Use a paired comparison task and make one piece of evidence visible through teacher review.",
      stats: { completion: 62, mastery: 57, attempts: 3, taskTime: "31m", evidence: 5, score: 63 },
      signals: {
        challenge: { score: 46, note: "Work appears accessible but not effortless." },
        confidence: { score: 50, note: "Retries show normal learning friction." },
        purpose: { score: 45, note: "Purpose is not the dominant concern." },
        ownership: { score: 48, note: "Some independent progress, limited evidence tagging." },
        connection: { score: 86, note: "Low shared response and community contribution signals." }
      },
      evidence: [
        "Five evidence items, none approved into the comparison pool yet.",
        "No community vote recorded in the latest cycle.",
        "Recent work is individual, with limited portfolio visibility."
      ]
    },
    {
      id: "sam",
      name: "Sam K.",
      classCode: "Y12A",
      likelyNeed: "confidence",
      confidence: "Low",
      summary: "No recent progress after an early low-scoring submission, so the next step should reduce risk and create a quick win.",
      caution: "Could be access or attendance rather than learning confidence.",
      nextMove: "Check login/access first, then sit beside a guided first module task.",
      stats: { completion: 16, mastery: 22, attempts: 2, taskTime: "9m", evidence: 1, score: 34 },
      signals: {
        challenge: { score: 78, note: "The task may currently feel too hard or too broad." },
        confidence: { score: 88, note: "Early low score followed by inactivity is a confidence warning." },
        purpose: { score: 58, note: "Purpose cannot be read clearly with only one response." },
        ownership: { score: 62, note: "No self-correction or retry after the first submission." },
        connection: { score: 68, note: "No recent visible class contribution." }
      },
      evidence: [
        "Only one evidence item saved.",
        "No activity in the last review window.",
        "First auto-score was below class average."
      ]
    },
    {
      id: "ella",
      name: "Ella T.",
      classCode: "Y12A",
      likelyNeed: "purpose",
      confidence: "Medium",
      summary: "Participation is consistent, but responses are procedural and rarely connect to interests or goals.",
      caution: "Could be that the prompt has not asked for enough personal relevance yet.",
      nextMove: "Add a one-sentence aspiration link before the next EST or STAR response.",
      stats: { completion: 71, mastery: 69, attempts: 3, taskTime: "33m", evidence: 6, score: 67 },
      signals: {
        challenge: { score: 42, note: "The challenge level appears appropriate." },
        confidence: { score: 38, note: "Attempts and scores do not show a major confidence concern." },
        purpose: { score: 80, note: "Evidence is complete but thin on personal or career relevance." },
        ownership: { score: 50, note: "Some choices, but limited evidence selection." },
        connection: { score: 44, note: "Normal participation signal." }
      },
      evidence: [
        "Six saved responses across active modules.",
        "Long answer explains content accurately but not why it matters.",
        "No future-self link in latest reflection."
      ]
    },
    {
      id: "jay",
      name: "Jay B.",
      classCode: "Y12A",
      likelyNeed: "ownership",
      confidence: "Medium",
      summary: "Strong participation, but teacher review queues show several incomplete or unedited submissions.",
      caution: "This may reflect time pressure rather than low ownership.",
      nextMove: "Ask Jay to choose one pending response to revise and submit as his strongest evidence.",
      stats: { completion: 77, mastery: 64, attempts: 5, taskTime: "39m", evidence: 8, score: 61 },
      signals: {
        challenge: { score: 50, note: "Current challenge seems workable." },
        confidence: { score: 48, note: "Retries show persistence, not avoidance." },
        purpose: { score: 46, note: "Purpose is present in some mission choices." },
        ownership: { score: 84, note: "Many submissions are pending, but few are revised or selected as best evidence." },
        connection: { score: 52, note: "Participates in class progress but needs more visible evidence." }
      },
      evidence: [
        "Eight evidence items saved, three still pending teacher review.",
        "Five attempts across active modules.",
        "Store request shows engagement, but portfolio evidence needs curation."
      ]
    }
  ];

  const viewCopy = {
    "class-overview": {
      title: "Class Overview Diagnostic",
      summary: "Where the class appears to sit across Challenge, Confidence, Purpose, Ownership, and Connection."
    },
    "learner-needs": {
      title: "Learner Needs Diagnostic",
      summary: "A student-by-student lens showing likely need, evidence confidence, and what to check next."
    },
    "current-data": {
      title: "Current Data View",
      summary: "The existing dashboard flow preserved for platform activity, progress, evidence review, and operational follow-up."
    }
  };

  const currentDataPanels = [
    {
      title: "Module progress",
      detail: "Completion, mastery, attempts, active modules, and current class focus.",
      items: ["Average completion 63%", "Average mastery 60%", "EST Prep is the active teaching focus"]
    },
    {
      title: "Evidence review",
      detail: "Teacher-checkable responses, STAR reflections, and approved comparison pool.",
      items: ["7 responses waiting for review", "5 approved responses in comparison pool", "38 evidence items captured"]
    },
    {
      title: "Glossary and long answers",
      detail: "Term recall, keyword gaps, answer bands, and suggested feedback.",
      items: ["Top glossary gap: transferable skills", "Class long-answer average 66%", "4 responses need clearer examples"]
    },
    {
      title: "Capability portfolio",
      detail: "Employability skill evidence by student and capability category.",
      items: ["Communication has the most evidence", "Ownership signals need more student-selected proof", "STAR reflections remain teacher-visible"]
    },
    {
      title: "Engagement and time",
      detail: "Login recency, captured task time, and no-interaction signals.",
      items: ["3h 45m captured task time", "1 student has no recent activity", "Average task time 28m"]
    },
    {
      title: "Feedback and store requests",
      detail: "Feedback reports, student item requests, and teacher moderation workflow.",
      items: ["2 feedback reports pending", "3 store requests pending", "Review status stays in the current dashboard"]
    }
  ];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function getNeed(id) {
    return needs.find(need => need.id === id) || needs[0];
  }

  function getClassNeedCounts() {
    return needs.map(need => ({
      ...need,
      count: students.filter(student => student.likelyNeed === need.id).length,
      averageSignal: Math.round(students.reduce((sum, student) => sum + Number(student.signals[need.id]?.score || 0), 0) / students.length)
    }));
  }

  function setView(nextView) {
    document.querySelectorAll("[data-view-panel]").forEach(panel => {
      const isActive = panel.dataset.viewPanel === nextView;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    document.querySelectorAll(".diagnostic-view-tab").forEach(tab => {
      const isActive = tab.dataset.view === nextView;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const copy = viewCopy[nextView] || viewCopy["class-overview"];
    const title = document.getElementById("diagnostic-view-title");
    const summary = document.getElementById("diagnostic-view-summary");
    if (title) title.textContent = copy.title;
    if (summary) summary.textContent = copy.summary;
  }

  function renderNeedBars() {
    const container = document.getElementById("class-need-bars");
    if (!container) return;

    const maxCount = Math.max(1, ...getClassNeedCounts().map(row => row.count));
    container.innerHTML = getClassNeedCounts().map(row => `
      <div class="need-bar-row" style="--need-color: ${row.color}; --bar-width: ${Math.max(8, Math.round((row.count / maxCount) * 100))}%">
        <div>
          <strong>${escapeHtml(row.title)}</strong><br>
          <small>${escapeHtml(row.question)}</small>
        </div>
        <div class="need-bar-track" aria-hidden="true"><div class="need-bar-fill"></div></div>
        <span>${row.count} learner${row.count === 1 ? "" : "s"}</span>
      </div>
    `).join("");
  }

  function renderNeedCards() {
    const container = document.getElementById("need-card-grid");
    if (!container) return;

    container.innerHTML = getClassNeedCounts().map(row => `
      <article class="need-card" style="--need-color: ${row.color}">
        <div class="need-card-top">
          <div class="need-card-icon">${escapeHtml(row.short)}</div>
          <h3>${escapeHtml(row.title)}</h3>
        </div>
        <p class="need-card-question">${escapeHtml(row.question)}</p>
        <p>${escapeHtml(row.description)}</p>
        <div class="need-card-stat">
          <span>Class signal</span>
          <strong>${row.averageSignal}%</strong>
        </div>
      </article>
    `).join("");
  }

  function renderPriorityLearners() {
    const container = document.getElementById("priority-learner-list");
    if (!container) return;

    const priorityStudents = [...students]
      .sort((a, b) => (b.signals[b.likelyNeed]?.score || 0) - (a.signals[a.likelyNeed]?.score || 0))
      .slice(0, 4);

    container.innerHTML = priorityStudents.map(student => {
      const need = getNeed(student.likelyNeed);
      const signal = student.signals[need.id]?.score || 0;
      return `
        <article class="priority-learner-card" style="--need-color: ${need.color}">
          <span class="student-need-chip">${escapeHtml(need.title)} likely need</span>
          <h3>${escapeHtml(student.name)}</h3>
          <p>${escapeHtml(student.summary)}</p>
          <span class="need-score-chip">${signal}% signal strength</span>
        </article>
      `;
    }).join("");
  }

  function renderEvidenceStreams(targetId = "class-evidence-streams") {
    const container = document.getElementById(targetId);
    if (!container) return;

    const streamCards = [
      {
        title: "Existing Data",
        status: "Populated now",
        live: true,
        items: [
          "Progress, mastery, completion, attempts, and task time",
          "Written responses, STAR reflections, glossary gaps, and review status",
          "Votes, feedback, store requests, and profile signals"
        ]
      },
      {
        title: "Learner Voice",
        status: "Not yet captured",
        live: false,
        items: ["Interests", "Motivation and confidence", "Aspirations, goals, and reflections"]
      },
      {
        title: "Teacher Insight",
        status: "Not yet captured",
        live: false,
        items: ["Observations", "Effort and persistence", "Participation and learning behaviours"]
      },
      {
        title: "Wellbeing Information",
        status: "Not yet captured",
        live: false,
        items: ["Belonging", "Connection", "Pastoral insight and wellbeing context"]
      }
    ];

    container.innerHTML = streamCards.map(card => `
      <article class="evidence-stream-card ${card.live ? "is-populated" : ""}">
        <span class="evidence-stream-status ${card.live ? "is-live" : ""}">${escapeHtml(card.status)}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <ul>
          ${card.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>
    `).join("");
  }

  function renderStudentSelect() {
    const select = document.getElementById("learner-select");
    if (!select) return;

    select.innerHTML = students.map(student => {
      const need = getNeed(student.likelyNeed);
      return `<option value="${escapeHtml(student.id)}">${escapeHtml(student.name)} - ${escapeHtml(need.title)}</option>`;
    }).join("");
  }

  function renderLearnerProfile(studentId = students[0].id) {
    const container = document.getElementById("learner-profile-panel");
    if (!container) return;
    const student = students.find(row => row.id === studentId) || students[0];
    const need = getNeed(student.likelyNeed);
    const signal = student.signals[student.likelyNeed]?.score || 0;

    container.innerHTML = `
      <article class="learner-profile-card" style="--need-color: ${need.color}">
        <span class="student-need-chip">${escapeHtml(need.title)} likely current need</span>
        <div>
          <h2>${escapeHtml(student.name)}</h2>
          <p>${escapeHtml(student.classCode)} - evidence confidence ${escapeHtml(student.confidence)}</p>
        </div>
        <p>${escapeHtml(student.summary)}</p>
        <div class="learner-stat-grid">
          <div class="learner-stat"><strong>${student.stats.completion}%</strong><span>completion</span></div>
          <div class="learner-stat"><strong>${student.stats.mastery}%</strong><span>mastery</span></div>
          <div class="learner-stat"><strong>${escapeHtml(student.stats.taskTime)}</strong><span>captured task time</span></div>
          <div class="learner-stat"><strong>${student.stats.evidence}</strong><span>evidence items</span></div>
        </div>
        <div>
          <span class="kicker">What else could explain this?</span>
          <p>${escapeHtml(student.caution)}</p>
        </div>
        <div>
          <span class="kicker">Next teacher move</span>
          <p>${escapeHtml(student.nextMove)}</p>
        </div>
      </article>
      <article class="learner-evidence-card">
        <div class="section-title">
          <div>
            <h2>How We Know</h2>
            <p>Current platform signals only</p>
          </div>
          <span class="need-score-chip">${signal}% ${escapeHtml(need.title)} signal</span>
        </div>
        <div class="learner-evidence-grid">
          ${needs.map(needRow => {
            const signalRow = student.signals[needRow.id] || { score: 0, note: "No signal yet." };
            return `
              <div class="learner-need-cell ${needRow.id === student.likelyNeed ? "is-primary" : ""}" style="--need-color: ${needRow.color}; --need-width: ${signalRow.score}%">
                <strong>${escapeHtml(needRow.title)}</strong>
                <div class="learner-need-meter" aria-hidden="true"><span></span></div>
                <span class="need-score-chip">${signalRow.score}%</span>
                <p>${escapeHtml(signalRow.note)}</p>
              </div>
            `;
          }).join("")}
        </div>
        <ul class="evidence-bullet-list">
          ${student.evidence.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>
    `;
  }

  function renderLearnerMatrix() {
    const container = document.getElementById("learner-matrix");
    if (!container) return;

    container.innerHTML = `
      <div class="teacher-matrix-scroll" role="region" aria-label="Learner needs diagnostic matrix" tabindex="0">
        <table class="teacher-matrix teacher-needs-matrix">
          <thead>
            <tr>
              <th scope="col" class="teacher-matrix-student-col">Student</th>
              ${needs.map(need => `
                <th scope="col">
                  <span>${escapeHtml(need.title)}</span>
                  <small>${escapeHtml(need.question)}</small>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <th scope="row" class="teacher-matrix-student-col">
                  <strong>${escapeHtml(student.name)}</strong>
                  <small>${escapeHtml(student.classCode)} - likely need: ${escapeHtml(getNeed(student.likelyNeed).title)}</small>
                  <span class="teacher-matrix-code ${student.confidence === "High" ? "teacher-matrix-code--high" : student.confidence === "Medium" ? "teacher-matrix-code--mid" : "teacher-matrix-code--nys"}">${escapeHtml(student.confidence)} confidence</span>
                </th>
                ${needs.map(need => {
                  const signal = student.signals[need.id] || { score: 0, note: "No signal yet." };
                  return `
                    <td>
                      <div class="diagnostic-matrix-cell ${need.id === student.likelyNeed ? "is-primary" : ""}" style="--need-color: ${need.color}">
                        <div class="diagnostic-matrix-score">
                          <strong>${signal.score}%</strong>
                          <span class="diagnostic-status-chip">${need.id === student.likelyNeed ? "Likely" : "Signal"}</span>
                        </div>
                        <p>${escapeHtml(signal.note)}</p>
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

  function renderCurrentDataView() {
    const metricsContainer = document.getElementById("current-data-metrics");
    const panelContainer = document.getElementById("current-data-panels");
    if (metricsContainer) {
      const totalEvidence = students.reduce((sum, student) => sum + student.stats.evidence, 0);
      const avgCompletion = Math.round(students.reduce((sum, student) => sum + student.stats.completion, 0) / students.length);
      const avgScore = Math.round(students.reduce((sum, student) => sum + student.stats.score, 0) / students.length);
      const pendingReview = 7;
      const metricRows = [
        { label: "Average Completion", value: `${avgCompletion}%`, note: "Across active module progress rows" },
        { label: "Evidence Captured", value: String(totalEvidence), note: "Typed responses, lock-ins, and reflections" },
        { label: "Avg Evidence Score", value: `${avgScore}%`, note: "Auto-scored teacher-visible tasks" },
        { label: "Teacher Checks", value: String(pendingReview), note: "Responses, feedback, and requests waiting" }
      ];
      metricsContainer.innerHTML = metricRows.map(row => `
        <article class="metric">
          <div class="metric-label">${escapeHtml(row.label)}</div>
          <div class="metric-value">${escapeHtml(row.value)}</div>
          <div class="metric-note">${escapeHtml(row.note)}</div>
        </article>
      `).join("");
    }

    if (panelContainer) {
      panelContainer.innerHTML = currentDataPanels.map(panel => `
        <article class="current-data-card">
          <h3>${escapeHtml(panel.title)}</h3>
          <p>${escapeHtml(panel.detail)}</p>
          <ul class="current-data-card-list">
            ${panel.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
      `).join("");
    }
  }

  function init() {
    if (!enforceTeacherAccess()) return;

    document.querySelectorAll(".diagnostic-view-tab").forEach(button => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });

    renderNeedBars();
    renderNeedCards();
    renderPriorityLearners();
    renderEvidenceStreams();
    renderStudentSelect();
    renderLearnerProfile();
    renderLearnerMatrix();
    renderCurrentDataView();

    const select = document.getElementById("learner-select");
    if (select) {
      select.addEventListener("change", () => renderLearnerProfile(select.value));
    }

    setView("class-overview");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
