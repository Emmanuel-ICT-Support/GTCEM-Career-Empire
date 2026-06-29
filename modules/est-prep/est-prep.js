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
    start: 0,
    end: 5.6
  },
  {
    label: "CORE",
    kicker: "System 01 of 04",
    title: "CORE shows what to say",
    detail: "This is the content layer: topics, examples, facts, and syllabus points.",
    start: 5.6,
    end: 14.3
  },
  {
    label: "TERM",
    kicker: "System 02 of 04",
    title: "TERM gives the right language",
    detail: "This is the vocabulary layer: precise terms, definitions, and marker-friendly wording.",
    start: 14.3,
    end: 21.5
  },
  {
    label: "VTCS",
    kicker: "System 03 of 04",
    title: "VTCS shows what the question wants",
    detail: "This is the decoding layer: verb, topic, context, and structure before answering.",
    start: 21.5,
    end: 30.2
  },
  {
    label: "BOSS",
    kicker: "System 04 of 04",
    title: "BOSS proves the final response",
    detail: "This is the exam layer: combine CORE, TERM, and VTCS into one stronger response.",
    start: 30.2,
    end: 36.2
  },
  {
    label: "Beat the Paper",
    kicker: "Assessment portal restored",
    title: "Put the systems together",
    detail: "CORE gives what to say, TERM gives exact language, VTCS shows what the question wants, and BOSS pulls it together.",
    start: 36.2,
    end: 44.7
  }
];

function getHeroVideoDeck() {
  return document.querySelector("[data-hero-video-chapters]");
}

function getHeroVideoPlayer() {
  return document.querySelector("[data-hero-video]");
}

function playHeroVideo(video) {
  const playback = video.play?.();
  if (playback && typeof playback.catch === "function") playback.catch(() => {});
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

  if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(HERO_VIDEO_CHAPTERS.length).padStart(2, "0")}`;
  if (label) label.textContent = chapter.label;
  if (kicker) kicker.textContent = chapter.kicker;
  if (title) title.textContent = chapter.title;
  if (detail) detail.textContent = chapter.detail;
  if (previous) previous.disabled = index === 0;
  if (next) next.textContent = index === HERO_VIDEO_CHAPTERS.length - 1 ? "Restart" : "Next";
  if (play) play.textContent = deck.dataset.chapterComplete === "true" ? "Replay section" : "Play section";

  deck.querySelectorAll("[data-hero-chapter-jump]").forEach(button => {
    const isActive = Number(button.dataset.heroChapterJump) === index;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
}

function setHeroChapter(index = 0, options = {}) {
  const deck = getHeroVideoDeck();
  const video = getHeroVideoPlayer();
  if (!deck || !video) return;

  const nextIndex = ((Number(index) || 0) % HERO_VIDEO_CHAPTERS.length + HERO_VIDEO_CHAPTERS.length) % HERO_VIDEO_CHAPTERS.length;
  const chapter = HERO_VIDEO_CHAPTERS[nextIndex];
  deck.dataset.currentChapter = String(nextIndex);
  deck.dataset.chapterComplete = "false";
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

  if (video.currentTime < chapter.start || video.currentTime >= chapter.end - 0.15) {
    seekHeroVideo(video, chapter.start + 0.02, true);
    return;
  }
  deck.dataset.chapterComplete = "false";
  updateHeroChapterUI(index);
  playHeroVideo(video);
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
    if (video.currentTime >= chapter.end) {
      video.pause();
      deck.dataset.chapterComplete = "true";
      updateHeroChapterUI(index);
    }
  });

  video.addEventListener("ended", () => {
    deck.dataset.chapterComplete = "true";
    updateHeroChapterUI(Number(deck.dataset.currentChapter || 0));
  });

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
  setHeroChapter,
  playHeroChapter,
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
