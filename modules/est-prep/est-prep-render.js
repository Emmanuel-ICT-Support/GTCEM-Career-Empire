// EST Prep render bundle. Loaded as a classic browser script.
function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function encodeForInlineHandler(value) {
  return encodeURIComponent(value).replaceAll("'", "%27");
}

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function getStageMeta(stageId) {
  return STAGES.find(stage => stage.id === stageId) || null;
}

function getStageActivityLabel(stageOrId) {
  const stage = typeof stageOrId === "string" ? getStageMeta(stageOrId) : stageOrId;
  if (!stage) return "Focused EST lab";
  return stage.activity || {
    content: "Assessed content modules",
    glossary: "Glossary terms",
    decoder: "Question decode",
    boss: "Exam simulation"
  }[stage.id] || stage.title;
}

function renderStageLockup(stage, options = {}) {
  const extraClass = options.extraClass || "";
  const activeClass = options.active ? "is-active" : "";
  const currentBadge = options.current ? '<span class="stage-lockup-current">You are here</span>' : "";
  const activity = options.includeActivity === false ? "" : `<small>${escapeHtml(getStageActivityLabel(stage))}</small>`;
  return `
    <span class="stage-lockup stage-lockup--${escapeHtml(stage.id)} ${escapeHtml(extraClass)} ${activeClass}">
      <span class="stage-lockup-orb"><span>${escapeHtml(stage.title)}</span></span>
      <span class="stage-lockup-copy">
        ${currentBadge}
        <strong>${escapeHtml(stage.state)}</strong>
        ${activity}
      </span>
    </span>
  `;
}

function renderStageMapButtons() {
  return STAGES.map(stage => {
    const active = state.selectedStageId === stage.id;
    return `
      <button
        type="button"
        class="focus-track-button stage-map-button stage-map-button--${escapeHtml(stage.id)} ${active ? "active" : ""}"
        onclick="window.ESTPrep.openStage('${stage.id}')"
      >
        ${renderStageLockup(stage, { active, current: active })}
      </button>
    `;
  }).join("");
}

function getFocusSubtitle() {
  const stage = getStageMeta(state.selectedStageId);
  if (!stage) return "Focused EST lab";
  if (state.selectedStageId !== "content") return `${stage.title} focused mode`;
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  return currentGroup ? `${stage.title} • ${currentGroup.title}` : `${stage.title} topic menu`;
}

function setLabMode(active) {
  document.body.classList.toggle("est-lab-mode", active);
  HUB_SECTION_IDS.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.classList.toggle("is-hidden", active);
  });
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("is-hidden", !active);
}

function setStageMenuMode(active) {
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("menu-mode", active);
}

function setGameplayViewportMode(active) {
  document.body.classList.toggle("est-gameplay-viewport", active);
  const stageSection = document.getElementById("stage-section");
  if (stageSection) stageSection.classList.toggle("gameplay-viewport", active);
}

function getESTSceneBackground(scene) {
  if (scene === "challenge" || scene === "warning") return EST_SCENE_BACKGROUNDS.challenge;
  if (scene === "restored" || scene === "success") return EST_SCENE_BACKGROUNDS.restored;
  return EST_SCENE_BACKGROUNDS.neutral;
}

function buildESTSceneStyle(scene) {
  return `style="--est-scene-image:url('${escapeHtml(getESTSceneBackground(scene))}')"`;
}

function setStageScene(scene = "neutral") {
  const stageSection = document.getElementById("stage-section");
  if (!stageSection) return;
  stageSection.dataset.scene = scene;
  stageSection.style.setProperty("--est-stage-background", `url("${getESTSceneBackground(scene)}")`);
}

function renderFocusNav() {
  const container = document.getElementById("focus-nav");
  if (!container) return;
  if (!state.selectedStageId) {
    container.innerHTML = "";
    return;
  }

  const selectedStage = getStageMeta(state.selectedStageId);
  if (!selectedStage) {
    container.innerHTML = "";
    return;
  }
  const groups = state.stageDeck?.contentGroups || [];
  const currentGroup = groups[state.contentGroupIndex];
  const lessonActive = isContentLessonActive() && currentGroup;
  const contentMenuPrompt = "Choose a CORE curriculum content area below";
  const completedTopicCount = getCompletedContentTopicCount();
  const contentTrackButtons = groups.map((group, index) => {
    const status = getContentGroupStatus(group, index);
    const statusLabel = status === "active" ? "Current" : status === "complete" ? "Done" : "Not started";
    return `
      <button
        type="button"
        class="content-track-button compact ${status} ${index === state.contentGroupIndex ? "active" : ""}"
        onclick="window.ESTPrep.openContentGroupIntro(${index})"
      >
        <span class="content-track-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="content-track-copy">
          <strong>${escapeHtml(getContentGroupShortLabel(group.id))}</strong>
          <small>${escapeHtml(statusLabel)}</small>
        </span>
      </button>
    `;
  }).join("");

  const activityLabel = getStageActivityLabel(selectedStage);
  const topicLabel = currentGroup ? getContentGroupShortLabel(currentGroup.id) : "";
  const herePath = state.selectedStageId === "content" && topicLabel
    ? `${selectedStage.title} > ${activityLabel} > ${topicLabel}`
    : `${selectedStage.title} > ${activityLabel}`;
  const topicSelector = state.selectedStageId === "content" && groups.length
    ? lessonActive
      ? `
        <details class="content-topic-panel content-topic-panel--dropdown">
          <summary>
            <span>CORE topic menu</span>
            <strong>${escapeHtml(topicLabel || "Choose topic")}</strong>
          </summary>
          <div class="content-track content-track-menu ${currentGroup ? "has-selection" : ""}">
            ${contentTrackButtons}
          </div>
        </details>
      `
      : `
        <div class="content-topic-panel content-topic-panel--open">
          <div class="content-track-title-row">
            <div class="content-track-title">CORE topic menu</div>
            <div class="content-track-subtitle">${escapeHtml(currentGroup ? currentGroup.title : `${completedTopicCount}/${groups.length || 0} topics banked. Choose one to enter its reactor.`)}</div>
          </div>
          <div class="content-track content-track-menu ${currentGroup ? "has-selection" : ""}">
            ${contentTrackButtons}
          </div>
        </div>
      `
    : "";

  container.innerHTML = `
    <div class="focus-toolbar">
      <button type="button" class="focus-back" onclick="window.ESTPrep.returnToTrack()">← Back to EST Hub</button>
      <div class="focus-label">${state.selectedStageId === "content" && !currentGroup ? escapeHtml(contentMenuPrompt) : escapeHtml(getFocusSubtitle())}</div>
    </div>
    <div class="focus-intro">
      <span>You're in the EST Preparation module.</span>
      <strong>You are here: ${escapeHtml(herePath)}</strong>
    </div>
    <div class="focus-track stage-map-banner">
      ${renderStageMapButtons()}
    </div>
    ${topicSelector}
  `;
}

function scrollToTopSmooth() {
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (_) {
    window.scrollTo(0, 0);
  }
}

function renderHero() {
  const badgeRow = document.getElementById("hero-badges");
  const student = state.student;
  if (badgeRow) {
    badgeRow.innerHTML = [
      `<span class="badge">Student: ${escapeHtml(student?.displayName || "Guest")}</span>`,
      `<span class="badge">School: ${escapeHtml(student?.schoolName || "Not linked")}</span>`,
      `<span class="badge">Class: ${escapeHtml(student?.classCode || "No class code")}</span>`,
      `<span class="badge">Salary Boost: ${formatCurrency(state.salaryBoost)}</span>`
    ].join("");
  }
}

function renderRewardPulse() {
  const chipRow = document.getElementById("reward-chips");
  if (chipRow) {
    chipRow.innerHTML = [
      `Marks: ${state.marksBanked}`,
      `Readiness: ${state.readiness}%`,
      `Salary: ${formatCurrency(state.salaryBoost)}`,
      `Community Tax: ${formatCurrency(state.taxContribution)}`,
      `Streak: x${state.streak}`
    ].map(chip => `<span class="reward-chip">${escapeHtml(chip)}</span>`).join("");
  }

  const pulse = document.getElementById("stage-pulse");
  if (!pulse) return;
  if (!state.recentReward) {
    pulse.innerHTML = `
      <div class="pulse-card">
        <strong>Mission pulse</strong>
        <p>Your choices should trigger visible marks, readiness, salary, and community gains here.</p>
      </div>
    `;
    return;
  }

  pulse.innerHTML = `
    <div class="pulse-card ${state.recentReward.type}">
      <strong>${escapeHtml(state.recentReward.title)}</strong>
      <p>${escapeHtml(state.recentReward.detail)}</p>
    </div>
  `;
}

function setStagePulseVisible(visible) {
  const pulse = document.getElementById("stage-pulse");
  if (!pulse) return;
  pulse.style.display = visible ? "" : "none";
}

function renderMetrics() {
  setText("metric-progress", `${Object.keys(state.completed).length}/4`);
  setText("metric-marks", String(state.marksBanked));
  setText("metric-readiness", `${state.readiness}%`);
  setText("metric-streak", `x${state.streak}`);
}

function renderCoreBriefingAnimation(groups) {
  const topicGroups = (groups || []).slice(0, 6);
  const teaserBase = "../../Assets/EST Preparation/core-briefing";
  const curriculumScrollVideo = `${teaserBase}/est-curriculum-authority-scroll.mov#t=8`;
  const topicChips = topicGroups.map((group, index) => `
    <span class="core-topic-chip" style="--topic-index: ${index}">
      <strong>${escapeHtml(String(index + 1).padStart(2, "0"))}</strong>
      <small>${escapeHtml(getContentGroupShortLabel(group.id))}</small>
    </span>
  `).join("");
  const gameplaySteps = [
    {
      label: "Watch Topic Video",
      detail: "Start with the quick explainer for the CORE topic.",
      type: "image",
      src: `${teaserBase}/core-initiative-video-teaser.png`,
      alt: "Current CORE topic explainer screen"
    },
    {
      label: "Open Graphic Organiser",
      detail: "Review the topic summary before you answer.",
      type: "image",
      src: `${teaserBase}/core-graphic-organiser-teaser.png`,
      alt: "Current CORE graphic organiser summary screen"
    },
    {
      label: "Live CORE Gameplay",
      detail: "Answer scenarios and questions for immediate feedback.",
      type: "video",
      src: `${teaserBase}/core-reactor-gameplay-teaser.webm`,
      alt: "CORE gameplay teaser showing question practice and feedback"
    },
    {
      label: "Bank Salary And Fund",
      detail: "Earn salary and send tax contributions to the class fund.",
      type: "image",
      src: `${teaserBase}/core-reward-community-teaser.png`,
      alt: "Current CORE salary and community fund reward screen"
    },
    {
      label: "Use The Shop",
      detail: "Spend earned salary on Career Empire upgrades.",
      type: "image",
      src: `${teaserBase}/core-shop-teaser.png`,
      alt: "Current Career Empire shop screen"
    },
    {
      label: "Track Class Impact",
      detail: "See how the class community fund is growing.",
      type: "image",
      src: `${teaserBase}/core-community-fund-teaser.png`,
      alt: "Current community fund dashboard screen"
    }
  ];
  const gameplaySlides = gameplaySteps.map((step, index) => `
    <figure
      class="core-gameplay-slide ${index === 0 ? "is-active" : ""}"
      data-core-gameplay-step="${index}"
      data-core-gameplay-label="Step ${escapeHtml(String(index + 1).padStart(2, "0"))} of 06"
      data-core-gameplay-title="${escapeHtml(step.label)}"
      data-core-gameplay-detail="${escapeHtml(step.detail)}"
      aria-hidden="${index === 0 ? "false" : "true"}"
    >
      ${step.type === "video"
        ? `<video src="${step.src}" muted loop playsinline preload="metadata" aria-label="${escapeHtml(step.alt)}"></video>`
        : `<img src="${step.src}" alt="${escapeHtml(step.alt)}">`
      }
    </figure>
  `).join("");
  const gameplayPips = gameplaySteps.map((step, index) => `
    <button type="button" class="${index === 0 ? "is-active" : ""}" data-core-gameplay-jump="${index}" onclick="window.ESTPrep.setCoreGameplayStep(this, ${index})" aria-label="Show gameplay instruction step ${index + 1}" aria-current="${index === 0 ? "step" : "false"}">${escapeHtml(String(index + 1))}</button>
  `).join("");
  const briefingScenes = [
    { id: "overview", label: "Overview" },
    { id: "sources", label: "Sources" },
    { id: "topics", label: "Topics" },
    { id: "gameplay", label: "Practice Loop" }
  ];
  const briefingPips = briefingScenes.map((scene, index) => `
    <button type="button" role="tab" class="${index === 0 ? "is-active" : ""}" data-core-briefing-jump="${index}" onclick="window.ESTPrep.setCoreBriefingScene(this, ${index})" aria-selected="${index === 0 ? "true" : "false"}">${escapeHtml(scene.label)}</button>
  `).join("");
  const guideCharacter = EST_GUIDE_CHARACTERS?.romero?.pointing || "../../Assets/EST Preparation/guide-character/guide-pointing.png";
  const stageRail = STAGES.map(stage => `
    <span class="${stage.id === "content" ? "online" : ""}">
      <strong>${escapeHtml(stage.title)}</strong>
      <small>${stage.id === "content" ? "Online" : "Queued"}</small>
    </span>
  `).join("");

  return `
    <div class="core-briefing-animation" data-core-briefing data-current-scene="0" data-current-step="0" aria-label="Student-controlled CORE module briefing">
      <div class="core-briefing-stage">
        <div class="core-briefing-topline">
          <span>CORE module briefing</span>
          <strong>What to say</strong>
        </div>

        <section class="core-briefing-scene core-briefing-scene--overview is-active" data-core-briefing-scene="0" aria-hidden="false">
          <div class="core-briefing-copy">
            <span class="core-briefing-kicker">Overall picture</span>
            <h3>Four EST systems. CORE unlocks the content first.</h3>
            <p>CORE is the curriculum knowledge: the information, examples, facts, and syllabus points you need before you can answer EST questions.</p>
          </div>
          <div class="core-system-console">
            <div class="core-system-rail">${stageRail}</div>
            <div class="core-system-orb">CORE</div>
          </div>
        </section>

        <section class="core-briefing-scene core-briefing-scene--sources" data-core-briefing-scene="1" aria-hidden="true">
          <div class="core-source-board">
            <div class="core-authority-video-card">
              <video src="${curriculumScrollVideo}" muted loop playsinline preload="metadata" aria-label="Scrollable curriculum authority document showing assessed EST topics"></video>
              <span>Curriculum authority document</span>
            </div>
            <div class="core-book-cover" aria-label="Careers and Employability General 12 Coursebook by Michael Carolan">
              <div class="core-book-rays"></div>
              <div class="core-book-title">Careers <span>and</span><br>Employability</div>
              <div class="core-book-label">General 12<br><strong>Coursebook</strong></div>
              <div class="core-book-footer">Michael<br>Carolan</div>
            </div>
          </div>
          <div class="core-briefing-copy">
            <span class="core-briefing-kicker">Source material</span>
            <h3>The authority document tells us what is assessed.</h3>
            <p>The six CORE topics come from that document. The Carolan text and class resources provide the curriculum content, examples, and language you revise for those topics.</p>
          </div>
        </section>

        <section class="core-briefing-scene core-briefing-scene--topics" data-core-briefing-scene="2" aria-hidden="true">
          <div class="core-briefing-copy">
            <span class="core-briefing-kicker">CORE breakdown</span>
            <h3>Six assessed topic reactors</h3>
            <p>These are the topics from the Year 12 syllabus we have been learning each week and the areas being assessed in this year's EST.</p>
          </div>
          <div class="core-topic-cloud">${topicChips}</div>
        </section>

        <section class="core-briefing-scene core-briefing-scene--gameplay" data-core-briefing-scene="3" aria-hidden="true">
          <div class="core-gameplay-layout">
            <div class="core-gameplay-carousel" data-core-gameplay-carousel>
              <div class="core-gameplay-carousel-track">${gameplaySlides}</div>
              <div class="core-gameplay-step-panel">
                <div class="core-gameplay-step-copy">
                  <small data-core-gameplay-step-label>Step 01 of 06</small>
                  <strong data-core-gameplay-step-title>${escapeHtml(gameplaySteps[0]?.label || "")}</strong>
                  <span data-core-gameplay-step-detail>${escapeHtml(gameplaySteps[0]?.detail || "")}</span>
                </div>
                <div class="core-gameplay-step-actions">
                  <div class="core-gameplay-pips" aria-label="Jump to a gameplay instruction step">${gameplayPips}</div>
                  <div class="core-gameplay-controls" aria-label="Gameplay instruction controls">
                    <button type="button" class="core-gameplay-control" data-core-gameplay-prev onclick="window.ESTPrep.moveCoreGameplayStep(this, -1)" disabled>Previous step</button>
                    <span><span data-core-gameplay-current>1</span>/06</span>
                    <button type="button" class="core-gameplay-control" data-core-gameplay-next onclick="window.ESTPrep.moveCoreGameplayStep(this, 1)">Next step</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="core-briefing-copy">
            <span class="core-briefing-kicker">Gameplay loop</span>
            <h3>One CORE move at a time.</h3>
            <p>Watch the topic video, review the organiser, play the question reactor, bank salary and fund contributions, use the shop, then track class impact.</p>
          </div>
        </section>

        <img class="core-briefing-guide" src="${escapeHtml(guideCharacter)}" alt="">
      </div>
      <div class="core-briefing-pips" role="tablist" aria-label="Jump to a CORE briefing screen">
        ${briefingPips}
      </div>
      <div class="core-briefing-controls" aria-label="CORE briefing controls">
        <button
          type="button"
          class="core-briefing-control"
          data-core-briefing-prev
          onclick="window.ESTPrep.moveCoreBriefingScene(this, -1)"
          disabled
        >Previous</button>
        <button
          type="button"
          class="core-briefing-control core-briefing-pause"
          data-core-briefing-play
          aria-pressed="false"
          onclick="window.ESTPrep.toggleCoreBriefingPause(this)"
        >Pause screen</button>
        <span class="core-briefing-status"><span data-core-briefing-current>1</span>/<span data-core-briefing-total>4</span></span>
        <button
          type="button"
          class="core-briefing-control"
          data-core-briefing-next
          onclick="window.ESTPrep.moveCoreBriefingScene(this, 1)"
        >Next screen</button>
        <button
          type="button"
          class="core-briefing-control core-briefing-max"
          aria-expanded="false"
          onclick="window.ESTPrep.toggleCoreBriefingMax(this)"
        >Max screen</button>
      </div>
    </div>
  `;
}

function getCoreBriefingDeck(target) {
  if (target?.matches?.("[data-core-briefing]")) return target;
  return target?.closest?.("[data-core-briefing]") || document.querySelector("[data-core-briefing]");
}

function syncCoreBriefingMedia(briefing) {
  if (!briefing) return;
  const isPaused = briefing.classList.contains("is-paused");
  briefing.querySelectorAll("video").forEach(video => {
    const activeScene = video.closest("[data-core-briefing-scene]")?.classList.contains("is-active");
    const gameplaySlide = video.closest("[data-core-gameplay-step]");
    const activeGameplayStep = !gameplaySlide || gameplaySlide.classList.contains("is-active");
    if (activeScene && activeGameplayStep && !isPaused) {
      const playback = video.play?.();
      if (playback && typeof playback.catch === "function") playback.catch(() => {});
    } else {
      video.pause?.();
    }
  });
}

function setCoreGameplayStep(target, index = 0) {
  const briefing = getCoreBriefingDeck(target);
  const carousel = target?.closest?.("[data-core-gameplay-carousel]") || briefing?.querySelector("[data-core-gameplay-carousel]");
  if (!briefing || !carousel) return;
  const steps = Array.from(carousel.querySelectorAll("[data-core-gameplay-step]"));
  if (!steps.length) return;

  const nextIndex = Math.max(0, Math.min(steps.length - 1, Number(index) || 0));
  briefing.dataset.currentStep = String(nextIndex);
  steps.forEach((step, stepIndex) => {
    const isActive = stepIndex === nextIndex;
    step.classList.toggle("is-active", isActive);
    step.setAttribute("aria-hidden", String(!isActive));
  });

  carousel.querySelectorAll("[data-core-gameplay-jump]").forEach(button => {
    const isActive = Number(button.dataset.coreGameplayJump) === nextIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "step" : "false");
  });

  const current = carousel.querySelector("[data-core-gameplay-current]");
  const label = carousel.querySelector("[data-core-gameplay-step-label]");
  const title = carousel.querySelector("[data-core-gameplay-step-title]");
  const detail = carousel.querySelector("[data-core-gameplay-step-detail]");
  const previous = carousel.querySelector("[data-core-gameplay-prev]");
  const next = carousel.querySelector("[data-core-gameplay-next]");
  if (current) current.textContent = String(nextIndex + 1);
  if (label) label.textContent = steps[nextIndex].dataset.coreGameplayLabel || `Step ${String(nextIndex + 1).padStart(2, "0")} of ${String(steps.length).padStart(2, "0")}`;
  if (title) title.textContent = steps[nextIndex].dataset.coreGameplayTitle || "";
  if (detail) detail.textContent = steps[nextIndex].dataset.coreGameplayDetail || "";
  if (previous) previous.disabled = nextIndex === 0;
  if (next) next.textContent = nextIndex >= steps.length - 1 ? "Restart steps" : "Next step";
  syncCoreBriefingMedia(briefing);
}

function moveCoreGameplayStep(target, delta = 1) {
  const briefing = getCoreBriefingDeck(target);
  const currentIndex = Number(briefing?.dataset.currentStep || 0);
  const steps = briefing ? briefing.querySelectorAll("[data-core-gameplay-step]") : [];
  const nextIndex = currentIndex >= steps.length - 1 && Number(delta) > 0 ? 0 : currentIndex + Number(delta || 0);
  setCoreGameplayStep(target, nextIndex);
}

function setCoreBriefingScene(target, index = 0) {
  const briefing = typeof target === "number" ? getCoreBriefingDeck() : getCoreBriefingDeck(target);
  const rawIndex = typeof target === "number" ? target : index;
  if (!briefing) return;
  const scenes = Array.from(briefing.querySelectorAll("[data-core-briefing-scene]"));
  if (!scenes.length) return;

  const nextIndex = Math.max(0, Math.min(scenes.length - 1, Number(rawIndex) || 0));
  briefing.dataset.currentScene = String(nextIndex);
  scenes.forEach((scene, sceneIndex) => {
    const isActive = sceneIndex === nextIndex;
    scene.classList.toggle("is-active", isActive);
    scene.setAttribute("aria-hidden", String(!isActive));
  });

  briefing.querySelectorAll("[data-core-briefing-jump]").forEach(button => {
    const isActive = Number(button.dataset.coreBriefingJump) === nextIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  const current = briefing.querySelector("[data-core-briefing-current]");
  const total = briefing.querySelector("[data-core-briefing-total]");
  const previous = briefing.querySelector("[data-core-briefing-prev]");
  const next = briefing.querySelector("[data-core-briefing-next]");
  if (current) current.textContent = String(nextIndex + 1);
  if (total) total.textContent = String(scenes.length);
  if (previous) previous.disabled = nextIndex === 0;
  if (next) next.textContent = nextIndex >= scenes.length - 1 ? "Restart" : "Next screen";
  syncCoreBriefingMedia(briefing);
}

function moveCoreBriefingScene(target, delta = 1) {
  const briefing = getCoreBriefingDeck(target);
  const currentIndex = Number(briefing?.dataset.currentScene || 0);
  const scenes = briefing ? briefing.querySelectorAll("[data-core-briefing-scene]") : [];
  const nextIndex = currentIndex >= scenes.length - 1 && Number(delta) > 0 ? 0 : currentIndex + Number(delta || 0);
  setCoreBriefingScene(target, nextIndex);
}

function initialiseCoreBriefingControls(root = document) {
  const briefings = root?.matches?.("[data-core-briefing]")
    ? [root]
    : Array.from(root?.querySelectorAll?.("[data-core-briefing]") || []);
  briefings.forEach(briefing => {
    if (briefing.dataset.bound === "true") return;
    briefing.dataset.bound = "true";
    briefing.addEventListener("keydown", event => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveCoreBriefingScene(briefing, 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveCoreBriefingScene(briefing, -1);
      }
    });
    setCoreGameplayStep(briefing, Number(briefing.dataset.currentStep || 0));
    setCoreBriefingScene(briefing, Number(briefing.dataset.currentScene || 0));
  });
}

function toggleCoreBriefingPause(button) {
  const briefing = getCoreBriefingDeck(button);
  if (!briefing) return;
  const isPaused = briefing.classList.toggle("is-paused");
  button.setAttribute("aria-pressed", String(isPaused));
  button.textContent = isPaused ? "Play screen" : "Pause screen";
  syncCoreBriefingMedia(briefing);
}

function toggleCoreBriefingMax(button) {
  const briefing = getCoreBriefingDeck(button);
  if (!briefing) return;
  const isMaximized = briefing.classList.toggle("is-maximized");
  document.body.classList.toggle("core-briefing-max-active", isMaximized);
  button.setAttribute("aria-expanded", String(isMaximized));
  button.textContent = isMaximized ? "Close max screen" : "Max screen";
  if (isMaximized) briefing.scrollIntoView({ block: "center", behavior: "smooth" });
}

function renderCoreAuthorityEvidenceCard(groups) {
  const teaserBase = "../../Assets/EST Preparation/core-briefing";
  const curriculumScrollVideo = `${teaserBase}/est-curriculum-authority-scroll.mov#t=8`;
  const topicItems = (groups || []).slice(0, 6).map((group, index) => `
    <span>
      <strong>${escapeHtml(String(index + 1).padStart(2, "0"))}</strong>
      ${escapeHtml(getContentGroupShortLabel(group.id))}
    </span>
  `).join("");

  return `
    <article class="core-authority-card" aria-label="Curriculum authority source for CORE assessed topics">
      <div class="core-authority-media">
        <video src="${curriculumScrollVideo}" autoplay muted loop playsinline preload="metadata" aria-label="Scrollable curriculum authority document beginning at the assessed EST topics"></video>
        <span>Authority document preview</span>
      </div>
      <div class="core-authority-copy">
        <span class="core-briefing-kicker">Assessment source</span>
        <h3>The six CORE topics come from the curriculum authority document.</h3>
        <p>This document tells us what will be assessed in this year's EST. The Carolan Coursebook and class resources are the curriculum content you use to revise those assessed areas.</p>
        <div class="core-authority-topics">${topicItems}</div>
      </div>
    </article>
  `;
}

function renderContentModuleList() {
  const container = document.getElementById("content-module-list");
  if (!container) return;
  const groups = state.stageDeck?.contentGroups || [];
  const coreStage = getStageMeta("content");
  if (!groups.length) {
    container.innerHTML = `
      <div class="content-module-empty">
        <strong>Assessed content modules are loading.</strong>
        <p>If this stays empty, the EST content bank needs checking.</p>
      </div>
    `;
    return;
  }

  const completedTopicCount = getCompletedContentTopicCount();
  container.innerHTML = `
    <div class="content-module-heading">
      ${coreStage ? renderStageLockup(coreStage, { extraClass: "content-module-lockup" }) : "<strong>CORE: Assessed content modules</strong>"}
      <span>${completedTopicCount}/${groups.length} banked</span>
    </div>
    <div class="content-module-grid">
      ${groups.map((group, index) => {
        const status = getContentGroupStatus(group, index);
        const statusLabel = status === "complete" ? "Banked" : status === "active" ? "In progress" : "Ready";
        return `
          <button
            type="button"
            class="content-module-button ${status}"
            onclick="window.ESTPrep.openContentGroupIntro(${index})"
          >
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(getContentGroupShortLabel(group.id))}</strong>
            <small>${escapeHtml(statusLabel)}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function getStageProgressState(stageId) {
  if (state.completed[stageId]) return "complete";

  if (stageId === "content") {
    const hasContentWork = getCompletedContentTopicCount() > 0
      || (Number(state.contentGroupIndex) >= 0 && state.contentView !== "menu")
      || Object.keys(state.arcFlows || {}).length > 0
      || Object.keys(state.answers || {}).some(key => key.startsWith("content-") || key.startsWith("training-"));
    return hasContentWork ? "in-progress" : "not-started";
  }

  if (stageId === "glossary") {
    const glossaryProgress = typeof getGlossaryStabilityPercent === "function" ? getGlossaryStabilityPercent() : 0;
    const glossaryMastery = typeof getGlossaryMasterySummary === "function" ? getGlossaryMasterySummary() : null;
    const hasGlossaryWork = Boolean(state.glossaryHasStarted)
      || glossaryProgress > 0
      || Number(glossaryMastery?.attempts || 0) > 0
      || Object.keys(state.glossaryRoundRewards || {}).length > 0
      || Object.keys(state.glossaryRecallAnswers || {}).length > 0
      || Object.keys(state.glossaryRecallResults || {}).length > 0;
    return hasGlossaryWork ? "in-progress" : "not-started";
  }

  if (stageId === "decoder") {
    const decoderProgress = typeof getDecoderProgress === "function" ? getDecoderProgress() : null;
    return decoderProgress?.completed > 0 ? "in-progress" : "not-started";
  }

  if (stageId === "boss") {
    const hasBossWork = Object.keys(state.answers || {}).some(key => key.startsWith("boss"));
    return hasBossWork ? "in-progress" : "not-started";
  }

  return "not-started";
}

function getStageCardMeta(stage, context = {}) {
  const contentTopics = Math.max(1, Number(context.totalContentTopics || 1));
  const completedTopics = Number(context.completedContentTopics || 0);
  const decoderProgress = context.decoderProgress || null;
  const glossaryMastery = context.glossaryMastery || null;
  const glossaryProgress = typeof getGlossaryStabilityPercent === "function" ? getGlossaryStabilityPercent() : 0;
  const bestScore = Math.round(Number(state.stageBestScores?.[stage.id] || 0) * 100);

  if (stage.id === "content") {
    return {
      summary: completedTopics > 0
        ? `${completedTopics}/${contentTopics} topics banked in CORE.`
        : stage.summary,
      primary: `${completedTopics}/${contentTopics} topics`,
      secondary: completedTopics > 0 ? `${bestScore}% CORE signal` : "What to say"
    };
  }

  if (stage.id === "glossary") {
    const testedTerms = Number(glossaryMastery?.tested || 0);
    const totalTerms = Number(glossaryMastery?.total || 0);
    return {
      summary: testedTerms > 0
        ? `${testedTerms}/${totalTerms} glossary terms tested across ${glossaryMastery.attempts} memory reps.`
        : stage.summary,
      primary: totalTerms ? `${testedTerms}/${totalTerms} terms` : `${glossaryProgress}% restored`,
      secondary: testedTerms > 0 ? `${glossaryMastery.accuracyPercent}% accuracy` : "The right language"
    };
  }

  if (stage.id === "decoder" && decoderProgress) {
    return {
      summary: decoderProgress.completed > 0
        ? `${decoderProgress.completed}/${decoderProgress.total} decoder questions banked.`
        : stage.summary,
      primary: `${decoderProgress.completed}/${decoderProgress.total} questions`,
      secondary: decoderProgress.completed > 0 ? `${decoderProgress.correct}/${decoderProgress.totalParts} VTCS parts` : "What the question wants"
    };
  }

  if (stage.id === "boss") {
    return {
      summary: bestScore > 0
        ? `BOSS response best result: ${bestScore}%.`
        : stage.summary,
      primary: bestScore > 0 ? `${bestScore}% best` : `${stage.marks} marks`,
      secondary: bestScore > 0 ? "Teacher evidence saved" : "The final response"
    };
  }

  return {
    summary: stage.summary,
    primary: `${stage.marks} marks`,
    secondary: `${stage.readiness}% readiness`
  };
}

function renderMap() {
  const container = document.getElementById("challenge-map");
  if (!container) {
    renderContentModuleList();
    return;
  }
  const totalContentTopics = Math.max(1, (state.stageDeck?.contentGroups || []).length);
  const completedContentTopics = getCompletedContentTopicCount();
  const decoderProgress = typeof getDecoderProgress === "function" ? getDecoderProgress() : null;
  const glossaryMastery = typeof getGlossaryMasterySummary === "function" ? getGlossaryMasterySummary() : null;
  container.innerHTML = STAGES.map(stage => {
    const progressState = getStageProgressState(stage.id);
    const inProgress = progressState === "in-progress";
    const complete = progressState === "complete";
    const stageMeta = getStageCardMeta(stage, {
      totalContentTopics,
      completedContentTopics,
      decoderProgress,
      glossaryMastery
    });
    const statusLabel = complete ? "Complete" : inProgress ? "In progress" : "Not started";
    const buttonLabel = complete ? "Review lab" : inProgress ? "Continue lab" : "Open lab";

    return `
      <article class="challenge-tile challenge-tile--${stage.id} ${complete ? "completed" : ""} ${inProgress ? "in-progress" : ""} ${state.selectedStageId === stage.id ? "active" : ""}">
        <div class="challenge-status">${escapeHtml(statusLabel)}</div>
        ${renderStageLockup(stage, { extraClass: "challenge-lockup", current: state.selectedStageId === stage.id })}
        <p>${escapeHtml(stageMeta.summary)}</p>
        <div class="challenge-meta">
          <span>${escapeHtml(stageMeta.primary)}</span>
          <span>${escapeHtml(stageMeta.secondary)}</span>
        </div>
        <button type="button" onclick="window.ESTPrep.openStage('${stage.id}')">${escapeHtml(buttonLabel)}</button>
      </article>
    `;
  }).join("");
  renderContentModuleList();
  renderHero();
}

function renderResources() {
  const container = document.getElementById("resource-board");
  if (!container) return;
  const bossPrompt = state.stageDeck?.bossRound?.question || "BOSS loading...";
  container.innerHTML = [
    { title: "Exam Readiness", detail: `${state.readiness}% and rising as you decode and respond accurately.` },
    { title: "Confidence", detail: `${state.confidence}% - clean decoding and strong answers keep your streak alive.` },
    { title: "Salary Reward", detail: `${formatCurrency(state.salaryBoost)} added to your wider Career Empire profile.` },
    { title: "Community Tax", detail: `${formatCurrency(state.taxContribution)} heading into the class/community economy.` },
    { title: "Current BOSS Focus", detail: bossPrompt }
  ].map(item => `<div class="resource-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div>`).join("");
}

function updateLogsVisibility() {
  const logsSection = document.getElementById("logs-section");
  if (!logsSection) return;
  logsSection.classList.toggle("is-hidden", !state.debriefLog.length && !state.evidenceLog.length);
}

function renderDebrief() {
  const container = document.getElementById("debrief-log");
  if (!container) return;
  if (!state.debriefLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No debrief yet</strong><p>Clear your first stage and the EST lab will start banking rewards and feedback.</p></div>';
    updateLogsVisibility();
    return;
  }
  container.innerHTML = state.debriefLog.slice(-5).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
  updateLogsVisibility();
}

function renderEvidence() {
  const container = document.getElementById("evidence-log");
  if (!container) return;
  if (!state.evidenceLog.length) {
    container.innerHTML = '<div class="evidence-item"><strong>No evidence saved yet</strong><p>Written responses and decoded question artifacts will appear here.</p></div>';
    updateLogsVisibility();
    return;
  }
  container.innerHTML = state.evidenceLog.slice(-6).reverse().map(item => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </div>
  `).join("");
  updateLogsVisibility();
}

function renderStageRoot(html) {
  const root = document.getElementById("stage-root");
  if (root) root.innerHTML = html;
}

function renderFreeTextPrivacyNotice() {
  return `
    <div class="skill-star-builder-privacy-note est-free-text-privacy-note">
      <strong>Note: your teacher can check anything you enter here.</strong>
      <span>Do not include surnames, student emails, phone numbers, social handles, exact workplace names, suburbs, addresses, or anything that identifies you or someone else. Use general wording such as "a fast-food workplace" or "a local retail store".</span>
    </div>
  `;
}

function renderOptionGroup(groupKey, title, options) {
  return `
    <div class="panel">
      <div class="section-title">
        <h2>${escapeHtml(title)}</h2>
        <p>Choose one</p>
      </div>
      <div class="mcq-grid">
        ${options.map(option => `
          <button
            type="button"
            class="choice-button ${state.answers[groupKey] === option ? "selected live-selected" : ""}"
            data-group="${escapeHtml(groupKey)}"
            data-value="${escapeHtml(option)}"
            onclick="window.ESTPrep.setChoiceEncoded('${groupKey}', '${encodeForInlineHandler(option)}')"
          >
            <strong>${escapeHtml(option)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderESTGuidePanel(groupId, context) {
  const character = getESTGuideCharacter(groupId);
  const pose = context === "intro"
    ? character.welcome
    : context === "forge"
      ? character.thinking
      : character.pointing;
  const label = groupId === "job-application"
    ? "Mission guide"
    : "EST guide";
  return `
    <div class="est-guide-panel est-guide-${escapeHtml(context)}">
      <img class="est-guide-image" src="${escapeHtml(pose)}" alt="EST guide character">
      <div class="est-guide-copy">
        <div class="kicker">${label}</div>
        <p>${escapeHtml(getESTGuideCopy(groupId, context))}</p>
      </div>
    </div>
  `;
}

function updateSelectionButtons(groupKey, option) {
  const selector = `[data-group="${CSS.escape(groupKey)}"]`;
  document.querySelectorAll(selector).forEach(button => {
    const selected = button.dataset.value === String(option);
    button.classList.toggle("selected", selected);
    button.classList.toggle("live-selected", selected);
  });
}

function setSelectionPulse(groupKey, option) {
  state.recentReward = {
    type: "positive",
    title: "Choice locked in",
    detail: `${option} is banked. Finish the stage to convert this into marks, readiness, salary, and class impact.`
  };
  renderRewardPulse();
}

function awardStage(stageId, outcome) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const earnedMarks = Math.max(0, Math.round(stage.marks * outcome.scoreRatio));
  const credits = Math.round(stage.credits * outcome.scoreRatio * state.streak);
  const tax = Math.round(credits * stage.taxRate);
  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + Math.round(stage.readiness * outcome.scoreRatio));
  state.confidence = Math.max(0, Math.min(100, state.confidence + (outcome.scoreRatio >= 0.75 ? 8 : outcome.scoreRatio >= 0.5 ? 3 : -2)));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.stageBestScores[stageId] = Math.max(Number(state.stageBestScores[stageId] || 0), Number(outcome.scoreRatio || 0));
  state.streak = outcome.scoreRatio >= 0.75 ? Math.min(5, state.streak + 1) : 1;
  state.recentReward = {
    type: outcome.scoreRatio >= 0.75 ? "positive" : outcome.scoreRatio >= 0.5 ? "warning" : "bad",
    title: `${stage.title} reward pulse`,
    detail: `+${earnedMarks} marks • +${Math.round(stage.readiness * outcome.scoreRatio)}% readiness • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} cleared`,
    detail: `${earnedMarks}/${stage.marks} marks banked • ${formatCurrency(credits)} salary reward • ${formatCurrency(tax)} class contribution`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: stageId,
    label: stage.title,
    detail: `${earnedMarks}/${stage.marks} marks • ${Math.round(stage.readiness * outcome.scoreRatio)} readiness`,
    earnedDelta: credits,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderMap();
  renderDebrief();
}

function awardStageImprovement(stageId, previousRatio, nextRatio) {
  const stage = STAGES.find(item => item.id === stageId);
  if (!stage) return;
  const prior = Math.max(0, Number(previousRatio || 0));
  const next = Math.max(prior, Number(nextRatio || 0));
  const deltaRatio = Math.max(0, next - prior);
  if (!deltaRatio) return;

  const earnedMarks = Math.max(0, Math.round(stage.marks * next) - Math.round(stage.marks * prior));
  const readinessGain = Math.max(0, Math.round(stage.readiness * next) - Math.round(stage.readiness * prior));
  const credits = Math.max(0, Math.round(stage.credits * deltaRatio));
  const tax = Math.max(0, Math.round(credits * stage.taxRate));

  state.marksBanked += earnedMarks;
  state.readiness = Math.min(100, state.readiness + readinessGain);
  state.confidence = Math.max(0, Math.min(100, state.confidence + 2));
  state.salaryBoost += credits;
  state.taxContribution += tax;
  state.completed[stageId] = true;
  state.stageBestScores[stageId] = next;
  state.recentReward = {
    type: "positive",
    title: `${stage.title} best result improved`,
    detail: `Best score lifted from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • +${earnedMarks} marks • +${formatCurrency(credits)} salary • +${formatCurrency(tax)} class contribution`
  };
  state.debriefLog.push({
    title: `${stage.title} improved`,
    detail: `Best score raised from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}% • ${formatCurrency(credits)} salary added`
  });
  pushEconomyLog({
    eventType: "reward-awarded",
    checkpoint: `${stageId}-improvement`,
    label: `${stage.title} improvement`,
    detail: `Best score improved from ${Math.round(prior * 100)}% to ${Math.round(next * 100)}%`,
    earnedDelta: credits,
    taxDelta: tax,
    salaryBoostTotal: Number(state.salaryBoost || 0),
    taxContributionTotal: Number(state.taxContribution || 0)
  });
  renderMetrics();
  renderResources();
  renderRewardPulse();
  renderMap();
  renderDebrief();
}

function showFeedbackBox(type, lines, extraHtml = "") {
  const scene = type === "good" ? "restored" : "challenge";
  setStageScene(scene);
  renderStageRoot(`
    <section class="est-scene-shell est-scene-shell--${scene}" ${buildESTSceneStyle(scene)}>
      <div class="feedback-box ${type}">
        ${lines.map(line => `<p>${line}</p>`).join("")}
        ${extraHtml}
        <p><button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button></p>
      </div>
    </section>
  `);
}
