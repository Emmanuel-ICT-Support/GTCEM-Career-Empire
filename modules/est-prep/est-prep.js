// EST Prep est-prep bundle. Loaded as a classic browser script.
function openStage(stageId) {
  const previousStageId = state.selectedStageId;
  const openingFromTrack = !document.body.classList.contains("est-lab-mode");
  setLabMode(true);
  setGameplayViewportMode(false);
  setStagePulseVisible(stageId !== "content");
  if (stageId !== "glossary") {
    state.glossaryMissionMode = false;
    clearGlossaryTimer();
    syncMissionMode();
  }
  state.selectedStageId = stageId;
  state.lastBossReview = null;
  resetStageTaskTimer();
  if (stageId === "content") {
    if (previousStageId === "content" && ["lesson", "response"].includes(state.contentView) && state.contentGroupIndex >= 0) {
      persistCurrentContentNote();
      bankCurrentContentDuration();
    }
    state.contentGroupIndex = -1;
    state.contentView = "menu";
    state.lastContentTopicReview = null;
    if (previousStageId !== "content") {
      state.contentGroupStartedAt = Date.now();
      state.contentGroupDurations = {};
    }
  }
  if (stageId === "glossary") {
    state.glossaryMissionMode = true;
    if (typeof refreshGlossaryPracticeDeck === "function") {
      refreshGlossaryPracticeDeck();
    }
    syncMissionMode();
    if (!state.glossaryHasStarted && state.completed.glossary) {
      restoreGlossaryReplayBoard();
    } else if (!state.glossaryHasStarted) {
      initialiseGlossaryBoard();
    } else if (!state.glossaryRoundCelebration) {
      startGlossaryRoundTimer();
    }
    if (openingFromTrack && !state.glossaryRoundCelebration) {
      state.glossaryRoundIndex = 0;
      state.glossaryPulse = typeof GLOSSARY_ROUND_CONFIGS !== "undefined"
        ? GLOSSARY_ROUND_CONFIGS[0]?.cue || state.glossaryPulse
        : state.glossaryPulse;
      state.glossaryPulseType = "neutral";
    }
  }
  renderMap();
  if (stageId === "content") renderContentStage();
  if (stageId === "glossary") renderGlossaryStage();
  if (stageId === "decoder") renderDecoderStage();
  if (stageId === "boss") renderBossStage();
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function returnToTrack() {
  bankESTActiveTimers();
  setLabMode(false);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  setStageScene("neutral");
  state.glossaryMissionMode = false;
  state.glossaryRoundStartedAt = 0;
  state.glossaryRoundActiveSeconds = 0;
  state.glossaryRoundLastAt = 0;
  clearGlossaryTimer();
  syncMissionMode();
  state.selectedStageId = null;
  state.stageActiveSeconds = 0;
  state.stageActiveLastAt = 0;
  state.lastBossReview = null;
  state.contentGroupIndex = -1;
  state.contentView = "menu";
  renderFocusNav();
  renderMap();
  setText("stage-title", "Choose your next challenge");
  setText("stage-subtitle", "Move through the EST Lab to build readiness, confidence, and mark-winning habits.");
  renderStageRoot('<div class="empty-state"><p>Select another stage from the EST Lab Track above.</p></div>');
  persistESTProgressSnapshot();
  scrollToTopSmooth();
}

function handleESTPrepDeepLink() {
  const params = new URLSearchParams(window.location.search || "");
  if (params.get("stage") !== "content") return false;

  const topicId = params.get("topic") || "";
  const groups = state.stageDeck?.contentGroups || [];
  const topicIndex = groups.findIndex(group => group.id === topicId);
  if (topicIndex < 0) return false;

  setLabMode(true);
  setStageMenuMode(false);
  setGameplayViewportMode(false);
  setStagePulseVisible(false);
  state.glossaryMissionMode = false;
  clearGlossaryTimer();
  syncMissionMode();
  state.selectedStageId = "content";
  state.lastBossReview = null;
  state.lastContentTopicReview = null;
  state.contentGroupIndex = topicIndex;
  state.contentView = params.get("view") === "response" ? "response" : "intro";
  state.contentGroupStartedAt = Date.now();
  persistESTProgressSnapshot();
  renderFocusNav();
  renderMap();
  renderContentStage();
  scrollToTopSmooth();

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, document.title, cleanUrl);
  return true;
}

const HERO_VIDEO_CHAPTERS = [
  {
    label: "Intro",
    kicker: "EST Lab briefing",
    title: "Four systems offline",
    detail: "Your EST prep is a training sequence. Watch each system, pause, then move on when you are ready.",
    transcript: "Welcome to the EST Lab. This is not four random revision jobs. It is a training run for the moment you open the paper and need a plan.",
    slidePoints: [
      "The EST Lab is a training sequence, not a worksheet stack.",
      "Each system solves one part of the exam problem.",
      "Students can watch the briefing first, then review the deck at their own pace."
    ],
    start: 0,
    end: 7
  },
  {
    label: "CORE",
    kicker: "System 01 of 04",
    title: "CORE shows what to say",
    detail: "This is the content layer: topics, examples, facts, and syllabus points.",
    transcript: "System one: CORE. This is what to say. CORE starts with the curriculum authority, then loads the assessed content: Initiative, Time Management, Finance, Applications, Communication, and Megatrends.",
    slidePoints: [
      "Start from the curriculum authority source.",
      "Load the six assessed content strands.",
      "Use examples, facts, syllabus points, and class resources.",
      "Practise turning content into stronger answer sentences."
    ],
    start: 7,
    end: 17
  },
  {
    label: "TERM",
    kicker: "System 02 of 04",
    title: "TERM gives the right language",
    detail: "This is the vocabulary layer: precise terms, definitions, and marker-friendly wording.",
    transcript: "System two: TERM. This is the right language. The glossary document turns loose wording into Careers vocabulary, so the marker hears the terms they are listening for.",
    slidePoints: [
      "Use the glossary document as the source.",
      "Replace vague wording with precise Careers language.",
      "Match terms to definitions until recall feels quick.",
      "Bank stronger wording before exam pressure hits."
    ],
    start: 17,
    end: 27
  },
  {
    label: "VTCS",
    kicker: "System 03 of 04",
    title: "VTCS shows what the question wants",
    detail: "This is the decoding layer: verb, topic, context, and structure before answering.",
    transcript: "System three: VTCS. Start with SCSA key words. Find the verb, topic, context, and structure before you write. Decode first. Answer second.",
    slidePoints: [
      "Use the SCSA key-words document as the source.",
      "V is the command verb.",
      "T is the topic being tested.",
      "C is the context, and S is the response structure."
    ],
    start: 27,
    end: 37
  },
  {
    label: "BOSS",
    kicker: "System 04 of 04",
    title: "BOSS proves the final response",
    detail: "This is the exam layer: combine CORE, TERM, and VTCS into one stronger response.",
    transcript: "System four: BOSS. Now the systems combine. Use content, precise terms, and the question decode to build an answer that can earn marks.",
    slidePoints: [
      "Build one exam-style response from the three earlier systems.",
      "Use the scaffold to strengthen the answer before submitting.",
      "Save teacher-visible evidence from the final response."
    ],
    start: 37,
    end: 47
  },
  {
    label: "Beat the Paper",
    kicker: "Assessment portal restored",
    title: "Put the systems together",
    detail: "CORE gives what to say, TERM gives exact language, VTCS shows what the question wants, and BOSS pulls it together.",
    transcript: "That is the loop: CORE, TERM, VTCS, BOSS. Train the systems, bank the evidence, lift your readiness, then beat the paper.",
    slidePoints: [
      "CORE gives the content.",
      "TERM sharpens the language.",
      "VTCS decodes the task, and BOSS proves the response."
    ],
    start: 47,
    end: 59.6
  }
];

function getHeroVideoDeck() {
  return document.querySelector("[data-hero-video-chapters]");
}

function getHeroVideoPlayer() {
  return document.querySelector("[data-hero-video]");
}

function getHeroFinalChapter() {
  return HERO_VIDEO_CHAPTERS[HERO_VIDEO_CHAPTERS.length - 1];
}

function getHeroChapterIndexForTime(time) {
  const currentTime = Math.max(0, Number(time) || 0);
  const foundIndex = HERO_VIDEO_CHAPTERS.findIndex(chapter => currentTime >= chapter.start && currentTime < chapter.end);
  if (foundIndex >= 0) return foundIndex;
  const finalChapter = getHeroFinalChapter();
  return currentTime >= finalChapter.start ? HERO_VIDEO_CHAPTERS.length - 1 : 0;
}

function formatHeroTimestamp(seconds) {
  const rounded = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function playHeroVideo(video) {
  const playback = video.play?.();
  if (playback && typeof playback.catch === "function") playback.catch(() => {});
}

function renderHeroSlideDeck() {
  const root = document.querySelector("[data-hero-slide-deck]");
  if (!root || root.dataset.rendered === "true") return;

  root.innerHTML = `
    <div class="hero-slide-deck-inner">
      ${HERO_VIDEO_CHAPTERS.map((chapter, index) => `
        <article class="hero-slide-card" data-hero-slide-card="${index}">
          <div class="hero-slide-card-topline">
            <span>${escapeHtml(chapter.kicker)}</span>
            <strong>${escapeHtml(formatHeroTimestamp(chapter.start))}-${escapeHtml(formatHeroTimestamp(chapter.end))}</strong>
          </div>
          <h3>${escapeHtml(chapter.title)}</h3>
          <p>${escapeHtml(chapter.transcript)}</p>
          <ul>
            ${chapter.slidePoints.map(point => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
          <button type="button" onclick="window.ESTPrep.setHeroChapter(${index}, { play: true })">Replay this section</button>
        </article>
      `).join("")}
    </div>
  `;
  root.dataset.rendered = "true";
}

function syncHeroSlideDeckActive(index) {
  const root = document.querySelector("[data-hero-slide-deck]");
  if (!root) return;
  root.querySelectorAll("[data-hero-slide-card]").forEach(card => {
    card.classList.toggle("is-active", Number(card.dataset.heroSlideCard) === index);
  });
}

function updateHeroCompleteActions() {
  const deck = getHeroVideoDeck();
  const actions = deck?.querySelector("[data-hero-complete-actions]");
  if (!deck || !actions) return;
  const isComplete = deck.dataset.sequenceComplete === "true";
  actions.classList.toggle("is-hidden", !isComplete);
  actions.toggleAttribute("hidden", !isComplete);
}

function setHeroExplainerView(view = "video") {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck) return;

  const nextView = view === "deck" ? "deck" : "video";
  if (nextView === "deck") {
    renderHeroSlideDeck();
    video?.pause?.();
  }

  deck.dataset.heroView = nextView;
  deck.querySelectorAll("[data-hero-view-panel]").forEach(panel => {
    const isActive = panel.dataset.heroViewPanel === nextView;
    panel.classList.toggle("is-hidden", !isActive);
    panel.toggleAttribute("hidden", !isActive);
  });
  deck.querySelectorAll("[data-hero-view-button]").forEach(button => {
    const isActive = button.dataset.heroViewButton === nextView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function seekHeroVideo(video, time, playAfterSeek = false) {
  const targetTime = Math.max(0, Number(time) || 0);
  video.pause();

  const finish = () => {
    video.removeEventListener("seeked", finish);
    if (playAfterSeek && Math.abs(video.currentTime - targetTime) < 0.35) playHeroVideo(video);
  };

  if (Math.abs(video.currentTime - targetTime) < 0.05) {
    finish();
    return;
  }

  video.addEventListener("seeked", finish, { once: true });
  video.currentTime = targetTime;
  if (playAfterSeek) {
    window.setTimeout(() => {
      if (Math.abs(video.currentTime - targetTime) < 0.25) finish();
    }, 700);
  }
}

function updateHeroChapterUI(index) {
  const deck = getHeroVideoDeck();
  const chapter = HERO_VIDEO_CHAPTERS[index];
  if (!deck || !chapter) return;

  const count = deck.querySelector("[data-hero-chapter-count]");
  const label = deck.querySelector("[data-hero-chapter-label]");
  const kicker = deck.querySelector("[data-hero-chapter-kicker]");
  const title = deck.querySelector("[data-hero-chapter-title]");
  const detail = deck.querySelector("[data-hero-chapter-detail]");
  const previous = deck.querySelector("[data-hero-prev]");
  const next = deck.querySelector("[data-hero-next]");
  const play = deck.querySelector("[data-hero-play]");
  const playFull = deck.querySelector("[data-hero-full]");

  if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(HERO_VIDEO_CHAPTERS.length).padStart(2, "0")}`;
  if (label) label.textContent = chapter.label;
  if (kicker) kicker.textContent = chapter.kicker;
  if (title) title.textContent = chapter.title;
  if (detail) detail.textContent = chapter.detail;
  if (previous) previous.disabled = index === 0;
  if (next) next.textContent = index === HERO_VIDEO_CHAPTERS.length - 1 ? "Restart" : "Next";
  if (play) play.textContent = deck.dataset.chapterComplete === "true" ? "Replay section" : "Play section";
  if (playFull) playFull.textContent = deck.dataset.sequenceComplete === "true" ? "Replay video" : "Play full video";

  deck.querySelectorAll("[data-hero-chapter-jump]").forEach(button => {
    const isActive = Number(button.dataset.heroChapterJump) === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  syncHeroSlideDeckActive(index);
  updateHeroCompleteActions();
}

function setHeroChapter(index = 0, options = {}) {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck || !video) return;

  const nextIndex = ((Number(index) || 0) % HERO_VIDEO_CHAPTERS.length + HERO_VIDEO_CHAPTERS.length) % HERO_VIDEO_CHAPTERS.length;
  const chapter = HERO_VIDEO_CHAPTERS[nextIndex];
  deck.dataset.playMode = "section";
  deck.dataset.currentChapter = String(nextIndex);
  deck.dataset.chapterComplete = "false";
  deck.dataset.sequenceComplete = "false";
  setHeroExplainerView("video");
  updateHeroChapterUI(nextIndex);

  const setStart = () => seekHeroVideo(video, chapter.start + 0.02, Boolean(options.play));

  if (Number.isFinite(video.duration) && video.duration > 0) {
    setStart();
  } else {
    video.addEventListener("loadedmetadata", setStart, { once: true });
    video.load();
  }
}

function playHeroChapter() {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck || !video) return;
  const index = Number(deck.dataset.currentChapter || 0);
  const chapter = HERO_VIDEO_CHAPTERS[index];
  if (!chapter) return;

  deck.dataset.playMode = "section";
  deck.dataset.chapterComplete = "false";
  deck.dataset.sequenceComplete = "false";
  setHeroExplainerView("video");
  if (video.currentTime < chapter.start || video.currentTime >= chapter.end - 0.15) {
    updateHeroChapterUI(index);
    seekHeroVideo(video, chapter.start + 0.02, true);
    return;
  }
  updateHeroChapterUI(index);
  playHeroVideo(video);
}

function playHeroFullVideo() {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck || !video) return;

  deck.dataset.playMode = "full";
  deck.dataset.currentChapter = "0";
  deck.dataset.chapterComplete = "false";
  deck.dataset.sequenceComplete = "false";
  setHeroExplainerView("video");
  updateHeroChapterUI(0);

  const setStart = () => seekHeroVideo(video, HERO_VIDEO_CHAPTERS[0].start + 0.02, true);
  if (Number.isFinite(video.duration) && video.duration > 0) {
    setStart();
  } else {
    video.addEventListener("loadedmetadata", setStart, { once: true });
    video.load();
  }
}

function nextHeroChapter() {
  const deck = getHeroVideoDeck();
  const currentIndex = Number(deck?.dataset.currentChapter || 0);
  const nextIndex = currentIndex >= HERO_VIDEO_CHAPTERS.length - 1 ? 0 : currentIndex + 1;
  setHeroChapter(nextIndex, { play: true });
}

function prevHeroChapter() {
  const deck = getHeroVideoDeck();
  const currentIndex = Number(deck?.dataset.currentChapter || 0);
  setHeroChapter(Math.max(0, currentIndex - 1), { play: true });
}

function initialiseHeroVideoChapters() {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck || !video || deck.dataset.bound === "true") return;

  deck.dataset.bound = "true";
  deck.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextHeroChapter();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevHeroChapter();
    }
  });

  video.addEventListener("timeupdate", () => {
    const index = Number(deck.dataset.currentChapter || 0);
    const chapter = HERO_VIDEO_CHAPTERS[index];
    if (!chapter || video.paused) return;
    if (deck.dataset.playMode === "full") {
      const activeIndex = getHeroChapterIndexForTime(video.currentTime);
      if (activeIndex !== index) {
        deck.dataset.currentChapter = String(activeIndex);
        deck.dataset.chapterComplete = "false";
        updateHeroChapterUI(activeIndex);
      }
      const finalChapter = getHeroFinalChapter();
      if (video.currentTime >= finalChapter.end) {
        video.pause();
        deck.dataset.playMode = "section";
        deck.dataset.currentChapter = String(HERO_VIDEO_CHAPTERS.length - 1);
        deck.dataset.chapterComplete = "true";
        deck.dataset.sequenceComplete = "true";
        updateHeroChapterUI(HERO_VIDEO_CHAPTERS.length - 1);
      }
      return;
    }
    if (video.currentTime >= chapter.end) {
      video.pause();
      deck.dataset.chapterComplete = "true";
      updateHeroChapterUI(index);
    }
  });

  video.addEventListener("ended", () => {
    deck.dataset.chapterComplete = "true";
    deck.dataset.sequenceComplete = "true";
    updateHeroChapterUI(Number(deck.dataset.currentChapter || 0));
  });

  renderHeroSlideDeck();
  setHeroExplainerView("video");
  setHeroChapter(0);
}

async function init() {
  state.student = getLoggedInStudent();
  installESTActiveTimerGuards();
  registerLeaveWarning();
  hydrateESTProgressSnapshot();
  const [bank, contentStageConfig] = await Promise.all([
    loadBank(),
    loadContentStageConfig()
  ]);
  state.bank = bank;
  state.contentStageConfig = contentStageConfig;
  if (!state.stageDeck || !state.stageDeck?.contentGroups?.length) {
    state.stageDeck = buildStageDeck(state.bank);
  } else {
    refreshStageDeckContentGroups(state.bank);
  }
  ensureStageDeckDecoderRounds(state.bank);
  if (!state.glossaryHasStarted && typeof refreshGlossaryPracticeDeck === "function") {
    refreshGlossaryPracticeDeck();
  }
  await hydrateFromSupabase();
  refreshStageDeckContentGroups(state.bank);
  if (!state.glossaryHasStarted && typeof refreshGlossaryPracticeDeck === "function") {
    refreshGlossaryPracticeDeck();
  }
  syncContentCompletionFromTopicScores();
  if (!state.contentView) {
    state.contentView = "menu";
  }
  persistESTProgressSnapshot();
  setLabMode(false);
  setStageMenuMode(false);
  setStageScene("neutral");
  renderFocusNav();
  renderHero();
  initialiseHeroVideoChapters();
  renderMetrics();
  renderMap();
  renderResources();
  renderRewardPulse();
  renderDebrief();
  renderEvidence();
  handleESTPrepDeepLink();
}

window.ESTPrep = {
  openStage,
  setHeroExplainerView,
  setHeroChapter,
  playHeroChapter,
  playHeroFullVideo,
  nextHeroChapter,
  prevHeroChapter,
  setCoreBriefingScene,
  moveCoreBriefingScene,
  setCoreGameplayStep,
  moveCoreGameplayStep,
  toggleCoreBriefingPause,
  toggleCoreBriefingMax,
  openContentGroupIntro,
  startContentGroup,
  openContentResponse,
  submitCurrentContentTopic,
  retryCurrentContentTopic,
  resetCurrentContentTopic,
  setContentTopicVote,
  requireContentTopicVote,
  openContentTopicMenuAfterReview,
  nextContentGroupAfterReview,
  submitContentAfterReview,
  nextContentGroup: () => moveContentGroup(1),
  prevContentGroup: () => moveContentGroup(-1),
  jumpToContentGroup,
  setTrainingChoice,
  setTrainingChoiceEncoded,
  advanceArcCard,
  retryArcCard,
  jumpArcStep,
  startArcStep,
  setContentResponseSegmentEncoded,
  buildContentResponse,
  setGlossarySelectedTerm,
  setGlossarySelectedSocket,
  setGlossaryMode,
  moveGlossaryStudy,
  flipGlossaryStudyCard,
  startGlossaryDrag,
  endGlossaryDrag,
  dropGlossaryTerm,
  handleGlossarySocketClick,
  nextGlossaryPhase,
  continueGlossaryRound,
  setGlossaryRoundVote,
  startNewGlossaryPracticeRun,
  jumpToGlossaryRound,
  jumpToGlossarySet,
  toggleReveal,
  toggleTopicIntroVideo,
  toggleTopicIntroPictureInPicture,
  dismissTopicReminderPip,
  setGlossaryRecallAnswer,
  setGlossaryRecallChoiceEncoded,
  setGlossaryRecallTermChoiceEncoded,
  setGlossaryRecallKeywordChoiceEncoded,
  submitGlossaryChallengeChoiceEncoded,
  flipGlossaryMemoryCardEncoded,
  submitGlossaryBridgeChoiceEncoded,
  continueGlossaryBridgeLevel,
  resetGlossaryBridgeLevel,
  fireGlossaryInvaderShipEncoded,
  setGlossaryInvaderMove,
  stopGlossaryInvaderMove,
  setGlossaryInvaderShield,
  fireGlossaryInvaderPlayerShot,
  setBossScaffold,
  setBossShowdownReason,
  buildBossDraft,
  setChoice,
  setChoiceEncoded,
  setBossVote,
  submitContent,
  submitDecoder,
  nextDecoderQuestion,
  submitGlossary,
  submitBoss,
  returnToLab,
  returnToTrack
};

init().catch(error => {
  console.error(error);
  renderStageRoot(`
    <div class="feedback-box bad">
      <p><strong>EST Prep could not load.</strong></p>
      <p>${escapeHtml(error.message || "Unknown error")}</p>
    </div>
  `);
});
