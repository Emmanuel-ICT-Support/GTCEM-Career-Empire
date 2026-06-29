// EST Prep boss bundle. Loaded as a classic browser script.
function getBossShowdownPair(round) {
  if (!round?.sampleResponses?.length) return [];
  const strong = round.sampleResponses.find(sample => /strong/i.test(sample.band || ""));
  const developing = round.sampleResponses.find(sample => /developing/i.test(sample.band || ""));
  if (strong && developing) return [strong, developing];
  return round.sampleResponses.slice(0, 2);
}

function getBossScaffoldLines(round) {
  return String(round?.scaffold || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

const DECODER_PARTS = [
  {
    id: "verb",
    label: "Verb",
    placeholder: "Select the command word",
    optionsKey: "verbOptions",
    correctKey: "correctVerb",
    toolTitle: "Forensics Tool 1: Command verb"
  },
  {
    id: "topic",
    label: "Topic",
    placeholder: "Select the concept",
    optionsKey: "topicOptions",
    correctKey: "correctTopic",
    toolTitle: "Forensics Tool 2: Topic"
  },
  {
    id: "context",
    label: "Context",
    placeholder: "Select the context",
    optionsKey: "contextOptions",
    correctKey: "correctContext",
    toolTitle: "Forensics Tool 3: Context"
  },
  {
    id: "structure",
    label: "Structure",
    placeholder: "Select the structure",
    optionsKey: "structureOptions",
    correctKey: "correctStructure",
    toolTitle: "Forensics Tool 4: Structure"
  }
];

function getDecoderRounds() {
  const rounds = state.stageDeck?.decoderRounds;
  if (Array.isArray(rounds) && rounds.length) return rounds;
  return state.stageDeck?.decoderRound ? [state.stageDeck.decoderRound] : [];
}

function getDecoderRoundIndex() {
  const rounds = getDecoderRounds();
  if (!rounds.length) return 0;
  if (!Number.isInteger(state.decoderRoundIndex)) state.decoderRoundIndex = 0;
  state.decoderRoundIndex = Math.max(0, Math.min(state.decoderRoundIndex, rounds.length - 1));
  return state.decoderRoundIndex;
}

function getDecoderAnswerKey(partId, roundIndex = getDecoderRoundIndex()) {
  return `decoder-${roundIndex}-${partId}`;
}

function getDecoderAnswer(partId, roundIndex = getDecoderRoundIndex()) {
  return state.answers[getDecoderAnswerKey(partId, roundIndex)] || (roundIndex === 0 ? state.answers[`decoder-${partId}`] || "" : "");
}

function getDecoderAnswers(roundIndex = getDecoderRoundIndex()) {
  return DECODER_PARTS.reduce((answers, part) => ({
    ...answers,
    [part.id]: getDecoderAnswer(part.id, roundIndex)
  }), {});
}

function getDecoderPartFromAnswerKey(groupKey) {
  const roundIndex = getDecoderRoundIndex();
  return DECODER_PARTS.find(part => groupKey === getDecoderAnswerKey(part.id, roundIndex) || groupKey === `decoder-${part.id}`) || null;
}

function setDecoderChoice(groupKey, option) {
  state.answers[groupKey] = option;
  const round = getDecoderRounds()[getDecoderRoundIndex()];
  const part = getDecoderPartFromAnswerKey(groupKey);
  const isCorrect = Boolean(part && round && option === round[part.correctKey]);
  state.recentReward = {
    type: isCorrect ? "positive" : "warning",
    title: isCorrect ? `${part.label} locked in` : "Keep decoding",
    detail: isCorrect
      ? `${option} is now glowing on the forensics board.`
      : "That choice is selected, but the board only lights up for the correct VTCS part."
  };
  persistESTProgressSnapshot();
  renderDecoderStage();
  renderRewardPulse();
}

function getDecoderProgress() {
  const rounds = getDecoderRounds();
  const results = state.decoderResults || {};
  const completed = rounds.reduce((count, _, index) => count + (results[index] ? 1 : 0), 0);
  const correct = rounds.reduce((sum, _, index) => sum + Number(results[index]?.correctCount || 0), 0);
  return {
    completed,
    correct,
    total: rounds.length,
    totalParts: rounds.length * DECODER_PARTS.length
  };
}

function renderDecoderTransitionFeedback(feedback) {
  if (!feedback) return "";
  return `
    <div class="feedback-box ${escapeHtml(feedback.type)} decoder-transition-feedback">
      <p><strong>Question ${feedback.questionNumber} banked:</strong> ${feedback.correctCount}/${DECODER_PARTS.length} VTCS parts correct. Continue with Question ${feedback.nextQuestionNumber} below.</p>
      <p>Best reading: <strong>${escapeHtml(feedback.correctVerb)}</strong> the issue of <strong>${escapeHtml(feedback.correctTopic)}</strong> in the context of <strong>${escapeHtml(feedback.correctContext)}</strong> using <strong>${escapeHtml(feedback.correctStructure)}</strong>.</p>
    </div>
  `;
}

function renderBossResponseBuilder(round) {
  const lines = getBossScaffoldLines(round);
  return `
    <div class="panel">
      <div class="section-title">
        <h2>Response Forge</h2>
        <p>Build before you write</p>
      </div>
      <p class="small-copy">Use the scaffold blocks to build a stronger answer before drafting the final response.</p>
      ${renderFreeTextPrivacyNotice()}
      <div class="builder-grid">
        ${lines.map((line, index) => `
          <div class="written-stage">
            <strong>${escapeHtml(line.replace("...", "").trim() || `Scaffold ${index + 1}`)}</strong>
            <textarea
              id="boss-scaffold-${index}"
              placeholder="Write the key idea for this part..."
              oninput="window.ESTPrep.setBossScaffold(${index}, this.value)"
            >${escapeHtml(state.answers[`boss-scaffold-${index}`] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildBossDraft()">Build Draft from Scaffold</button>
      </div>
    </div>
  `;
}

function renderDecoderStage() {
  setGameplayViewportMode(true);
  setStageMenuMode(false);
  setStageScene("challenge");
  renderFocusNav();
  const rounds = getDecoderRounds();
  const roundIndex = getDecoderRoundIndex();
  const round = rounds[roundIndex];
  if (!round) return;
  const progress = getDecoderProgress();
  const transitionFeedback = state.decoderTransitionFeedback;
  state.decoderTransitionFeedback = null;
  const progressBadges = rounds.map((_, index) => {
    const result = state.decoderResults?.[index];
    const stateClass = index === roundIndex ? "active" : result ? "complete" : "";
    const score = result ? ` ${result.correctCount}/${DECODER_PARTS.length}` : "";
    return `<span class="badge decoder-progress-badge ${stateClass}">Question ${index + 1}${score}</span>`;
  }).join("");
  const forensicsBoard = `
    <div class="panel training-bay">
      <div class="section-title">
        <h2>Question Forensics Board</h2>
        <p>Build the brief</p>
      </div>
      <p class="small-copy">Treat the EST question like evidence. Correct VTCS choices lock into the brief below.</p>
      <div class="forensics-grid">
        ${DECODER_PARTS.map(part => {
          const answer = getDecoderAnswer(part.id, roundIndex);
          const isCorrect = answer === round[part.correctKey];
          return `
            <div class="prompt-card forensics-slot ${isCorrect ? "filled" : "pending"}">
              <strong>${escapeHtml(part.label)}</strong>
              <p>${isCorrect ? escapeHtml(answer) : ""}</p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
  setText("stage-title", "VTCS");
  setText("stage-subtitle", `What the question wants: run question forensics before you write. Question ${roundIndex + 1} of ${rounds.length}.`);
  renderStageRoot(`
    ${renderDecoderTransitionFeedback(transitionFeedback)}
    <div class="badge-row decoder-progress-strip">${progressBadges}</div>
    <div class="question-card">
      <div class="kicker">VTCS ${roundIndex + 1}/${rounds.length}</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.feedback)}</p>
    </div>
    ${DECODER_PARTS.map(part => renderOptionGroup(getDecoderAnswerKey(part.id, roundIndex), part.toolTitle, round[part.optionsKey] || [])).join("")}
    ${forensicsBoard}
    <div class="written-stage">
      <strong>Case summary</strong>
      <p class="small-copy">${progress.completed}/${progress.total} questions banked. Students lose marks when they misread what the question is actually asking. Strong decoding protects marks before writing starts.</p>
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()">${roundIndex === rounds.length - 1 ? "Bank Decoder Results" : "Bank Question And Continue"}</button>
    </div>
  `);
}

function renderBossStage() {
  setGameplayViewportMode(true);
  setStageMenuMode(false);
  setStageScene("challenge");
  renderFocusNav();
  setText("stage-title", "BOSS");
  setText("stage-subtitle", "The final response: build, test, and justify a mark-worthy EST answer.");
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const showdownPair = getBossShowdownPair(round);
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Direct 10% of this round's income to this class/community focus.</small>
    </button>
  `).join("");
  renderStageRoot(`
    <div class="question-card">
      <div class="kicker">BOSS</div>
      <h3>${escapeHtml(round.question)}</h3>
      <p>${escapeHtml(round.help)}</p>
    </div>
    ${showdownPair.length === 2 ? `
      <div class="panel training-bay">
        <div class="section-title">
          <h2>Worked Example Showdown</h2>
          <p>Judge before you draft</p>
        </div>
        <p class="small-copy">Choose the stronger response first. This helps students notice what quality looks like before they write their own answer.</p>
        <div class="sample-grid">
          ${showdownPair.map((sample, index) => `
            <article class="sample-card">
              <div class="sample-meta">
                <strong>Sample ${index + 1}</strong>
                <span>${escapeHtml(sample.label)}</span>
              </div>
              <p>${escapeHtml(sample.response)}</p>
              <button
                type="button"
                class="choice-button ${state.answers.bossShowdown === sample.label ? "selected live-selected" : ""}"
                style="margin-top:12px;"
                onclick="window.ESTPrep.setChoiceEncoded('bossShowdown', '${encodeForInlineHandler(sample.label)}')"
              >
                <strong>This is stronger</strong>
              </button>
            </article>
          `).join("")}
        </div>
        <div class="written-stage">
          <strong>Why?</strong>
          <p class="small-copy">Explain what makes the stronger sample better.</p>
          ${renderFreeTextPrivacyNotice()}
          <textarea id="boss-showdown-reason" placeholder="Explain what the stronger sample includes or does better..." oninput="window.ESTPrep.setBossShowdownReason(this.value)">${escapeHtml(state.answers.bossShowdownReason || "")}</textarea>
        </div>
      </div>
    ` : ""}
    <div class="prompt-grid">
      ${round.conceptTags.map(tag => `<div class="prompt-card"><strong>Revision tag</strong><p>${escapeHtml(tag)}</p></div>`).join("")}
      <div class="prompt-card"><strong>Structure hint</strong><p>${escapeHtml(round.scaffold.split("\n").join(" "))}</p></div>
    </div>
    ${renderOptionGroup("boss-command", "Command word", round.commandOptions)}
    ${renderOptionGroup("boss-content", "Best content point", round.contentOptions)}
    ${renderOptionGroup("boss-glossary", "Glossary context term", round.glossaryOptions)}
    ${renderBossResponseBuilder(round)}
    <div class="written-stage">
      <strong>Final simulation response</strong>
      <p class="small-copy">${escapeHtml(round.scaffold)}</p>
      ${renderFreeTextPrivacyNotice()}
      <textarea id="boss-response" placeholder="Write your EST-style answer here...">${escapeHtml(state.answers.bossText || "")}</textarea>
    </div>
    <div class="panel">
      <div class="section-title">
        <h2>Community Contribution</h2>
        <p class="status-watch">Class impact</p>
      </div>
      <p class="small-copy">Ten percent of this round’s reward feeds the wider class/community economy. Choose where this answer will direct its contribution.</p>
      <div class="choice-grid">${communityOptions}</div>
    </div>
    <div class="written-stage">
      <button class="submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Submit BOSS response</button>
    </div>
  `);
}

function setChoice(groupKey, option) {
  if (getDecoderPartFromAnswerKey(groupKey)) {
    setDecoderChoice(groupKey, option);
    return;
  }
  state.answers[groupKey] = option;
  updateSelectionButtons(groupKey, option);
  setSelectionPulse(groupKey, option);
  persistESTProgressSnapshot();
}

function setChoiceEncoded(groupKey, encodedOption) {
  setChoice(groupKey, decodeURIComponent(encodedOption));
}

function setBossScaffold(index, value) {
  state.answers[`boss-scaffold-${index}`] = value;
  persistESTProgressSnapshot();
}

function setBossShowdownReason(value) {
  state.answers.bossShowdownReason = value;
  persistESTProgressSnapshot();
}

function buildBossDraft() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const draft = getBossScaffoldLines(round)
    .map((line, index) => {
      const label = line.replace("...", "").trim();
      const value = state.answers[`boss-scaffold-${index}`] || "";
      return value ? `${label} ${value}`.trim() : "";
    })
    .filter(Boolean)
    .join("\n");
  state.answers.bossText = draft;
  const textarea = document.getElementById("boss-response");
  if (textarea) textarea.value = draft;
  state.recentReward = {
    type: "positive",
    title: "Draft built",
    detail: "Your scaffold blocks have been assembled into a first EST response draft."
  };
  persistESTProgressSnapshot();
  renderRewardPulse();
}

function setBossVote(optionId) {
  state.answers.bossVote = optionId;
  updateSelectionButtons("boss-vote", optionId);
  const option = (state.stageDeck?.communityOptions || []).find(item => item.id === optionId);
  setSelectionPulse("boss-vote", option?.label || optionId);
  persistESTProgressSnapshot();
}

function getBossWritingCriteria(round) {
  if (Array.isArray(round?.writingChecks) && round.writingChecks.length) {
    return round.writingChecks;
  }

  return [
    { id: "point", label: "Clear answer point", keywords: round.requiredKeywords?.point || [], detail: "Your response should directly answer the question." },
    { id: "because", label: "Cause or explanation included", keywords: round.requiredKeywords?.because || [], detail: "Use because/how reasoning, not a bare statement." },
    { id: "result", label: "Consequence or outcome included", keywords: round.requiredKeywords?.result || [], detail: "Show the effect, outcome, or implication." }
  ];
}

function showDecoderQuestionFeedback(round, roundIndex, correctCount, scoreRatio) {
  const type = scoreRatio >= 0.75 ? "good" : scoreRatio >= 0.5 ? "warn" : "bad";
  const scene = type === "good" ? "restored" : "challenge";
  setStageScene(scene);
  renderStageRoot(`
    <section class="est-scene-shell est-scene-shell--${scene}" ${buildESTSceneStyle(scene)}>
      <div class="feedback-box ${type}">
        <p><strong>Question ${roundIndex + 1} banked:</strong> ${correctCount}/${DECODER_PARTS.length} VTCS parts correct.</p>
        <p>Best reading: <strong>${escapeHtml(round.correctVerb)}</strong> the issue of <strong>${escapeHtml(round.correctTopic)}</strong> in the context of <strong>${escapeHtml(round.correctContext)}</strong> using <strong>${escapeHtml(round.correctStructure)}</strong>.</p>
        <p><button class="submit-button" type="button" onclick="window.ESTPrep.nextDecoderQuestion()">Continue to Question ${roundIndex + 2}</button></p>
      </div>
    </section>
  `);
}

function nextDecoderQuestion() {
  renderDecoderStage();
  scrollToTopSmooth();
}

function bossCriterionReview(round, response) {
  const normalized = String(response || "").trim();
  const lower = normalized.toLowerCase();
  const wordCount = normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
  const writingChecks = getBossWritingCriteria(round).map(criteria => {
    const keywords = Array.isArray(criteria.keywords) ? criteria.keywords : [];
    const minimumMatches = Math.max(1, Number(criteria.minimumMatches) || 1);
    const matchedCount = keywords.filter(keyword => lower.includes(String(keyword).toLowerCase())).length;
    return {
      id: criteria.id,
      label: criteria.label,
      passed: matchedCount >= minimumMatches,
      detail: criteria.detail
    };
  });
  const minimumWordCount = Number.isFinite(round.minimumWordCount) ? round.minimumWordCount : 24;
  const checks = [
    { id: "command", label: "Command word decoded", passed: state.answers["boss-command"] === round.correctCommand, detail: `Expected ${round.correctCommand}.` },
    { id: "content", label: "Best content point chosen", passed: state.answers["boss-content"] === round.correctContent, detail: "Content option aligns to the revision topic." },
    { id: "glossary", label: "Correct glossary term selected", passed: state.answers["boss-glossary"] === round.correctGlossary, detail: `Expected ${round.correctGlossary}.` },
    ...writingChecks,
    { id: "glossary-language", label: "Glossary language used in writing", passed: round.requiredKeywords.glossary.some(keyword => lower.includes(keyword.toLowerCase())), detail: "Bring the glossary term into the actual response." },
    { id: "control", label: round.controlLabel || "Enough detail for marks", passed: wordCount >= minimumWordCount, detail: round.controlDetail || "Very short answers usually miss the explanation needed for marks." }
  ];

  const passedCount = checks.filter(check => check.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);
  const strengths = checks.filter(check => check.passed).slice(0, 4).map(check => check.label);
  const nextSteps = checks.filter(check => !check.passed).slice(0, 4).map(check => check.detail);
  let band = "Needs work";
  if (scorePercent >= 85) band = "Strong";
  else if (scorePercent >= 60) band = "Developing";

  return { checks, scorePercent, band, strengths, nextSteps, wordCount };
}

function renderBossSamples(round) {
  if (!round?.sampleResponses?.length) return "";
  return `
    <div class="sample-review">
      <h3>Student sample comparison</h3>
      <p class="small-copy">Compare your answer with different quality samples. Look for what each sample includes or leaves out.</p>
      <div class="sample-grid">
        ${round.sampleResponses.map(sample => `
          <article class="sample-card ${sample.band.toLowerCase().replace(/\s+/g, "-")}">
            <div class="sample-meta">
              <strong>${escapeHtml(sample.label)}</strong>
              <span>${escapeHtml(sample.band)}</span>
            </div>
            <p>${escapeHtml(sample.response)}</p>
            <p class="sample-commentary">${escapeHtml(sample.commentary)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function getBossScaffoldReviewParts(round) {
  return getBossScaffoldLines(round)
    .map((line, index) => ({
      label: line.replace(/\.\.\.$/, "").trim() || `Scaffold ${index + 1}`,
      response: String(state.answers[`boss-scaffold-${index}`] || "").trim()
    }))
    .filter(part => part.response);
}

async function submitDecoder() {
  const rounds = getDecoderRounds();
  const roundIndex = getDecoderRoundIndex();
  const round = rounds[roundIndex];
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const answersByPart = getDecoderAnswers(roundIndex);
  const correctCount = DECODER_PARTS.filter(part => answersByPart[part.id] === round[part.correctKey]).length;
  const questionScoreRatio = correctCount / DECODER_PARTS.length;
  state.decoderResults[roundIndex] = {
    question: round.question,
    correctCount,
    totalParts: DECODER_PARTS.length,
    scoreRatio: questionScoreRatio,
    answers: answersByPart
  };
  addEvidence(`Decoded EST question ${roundIndex + 1}/${rounds.length}`, `${round.question} • Verb: ${answersByPart.verb || "not chosen"} • Topic: ${answersByPart.topic || "not chosen"} • Context: ${answersByPart.context || "not chosen"} • Structure: ${answersByPart.structure || "not chosen"}`);
  await saveProgress("decoder-drill", "decoder-breakdown", `Question ${roundIndex + 1}/${rounds.length}: ${round.question}\nVerb: ${answersByPart.verb || "not chosen"}\nTopic: ${answersByPart.topic || "not chosen"}\nContext: ${answersByPart.context || "not chosen"}\nStructure: ${answersByPart.structure || "not chosen"}`, Math.round(questionScoreRatio * 100), {
    taskName: `VTCS Question ${roundIndex + 1}`,
    durationSeconds,
    promptText: round.question,
    extraPayload: {
      question_number: roundIndex + 1,
      total_questions: rounds.length,
      forensic_brief: {
        verb: answersByPart.verb || "",
        topic: answersByPart.topic || "",
        context: answersByPart.context || "",
        structure: answersByPart.structure || ""
      }
    }
  });

  if (roundIndex < rounds.length - 1) {
    const type = questionScoreRatio >= 0.75 ? "good" : questionScoreRatio >= 0.5 ? "warn" : "bad";
    state.decoderRoundIndex = roundIndex + 1;
    state.decoderTransitionFeedback = {
      type,
      questionNumber: roundIndex + 1,
      nextQuestionNumber: roundIndex + 2,
      correctCount,
      correctVerb: round.correctVerb,
      correctTopic: round.correctTopic,
      correctContext: round.correctContext,
      correctStructure: round.correctStructure
    };
    persistESTProgressSnapshot();
    renderDecoderStage();
    scrollToTopSmooth();
    return;
  }

  const progress = getDecoderProgress();
  const finalScoreRatio = progress.totalParts ? progress.correct / progress.totalParts : 0;
  const scorePercent = Math.round(finalScoreRatio * 100);
  const previousBestRatio = Math.max(0, Number(state.stageBestScores.decoder || 0));
  const firstDecoderClear = !state.completed.decoder && previousBestRatio === 0;
  const improvedBest = finalScoreRatio > previousBestRatio;

  if (firstDecoderClear) {
    awardStage("decoder", { scoreRatio: finalScoreRatio });
  } else if (improvedBest) {
    awardStageImprovement("decoder", previousBestRatio, finalScoreRatio);
  } else {
    state.recentReward = {
      type: "warning",
      title: "Decoder replay saved",
      detail: `This attempt scored ${scorePercent}%. Your best decoder result remains ${Math.round(previousBestRatio * 100)}%, so no extra salary or tax was added.`
    };
    renderRewardPulse();
  }

  state.stageBestScores.decoder = Math.max(previousBestRatio, finalScoreRatio);
  await saveProgress("decoder-drill", "decoder-breakdown", `Final VTCS score: ${progress.correct}/${progress.totalParts} parts correct across ${progress.total} questions.`, scorePercent, {
    taskName: "VTCS",
    durationSeconds,
    promptText: "Decode multiple EST questions using verb, topic, context, and structure.",
    extraPayload: {
      decoder_results: rounds.map((item, index) => ({
        question_number: index + 1,
        question: item.question,
        correct_count: Number(state.decoderResults[index]?.correctCount || 0),
        total_parts: DECODER_PARTS.length,
        answers: state.decoderResults[index]?.answers || {}
      }))
    }
  });
  persistESTProgressSnapshot();
  showFeedbackBox(finalScoreRatio >= 0.75 ? "good" : finalScoreRatio >= 0.5 ? "warn" : "bad", [
    `<strong>Decoder results:</strong> ${progress.correct}/${progress.totalParts} VTCS parts correct across ${progress.total} questions.`,
    `${improvedBest || firstDecoderClear
      ? `Best decoder result is now ${Math.round(state.stageBestScores.decoder * 100)}%.`
      : `Best decoder result remains ${Math.round(previousBestRatio * 100)}%. This replay was saved but did not overwrite your best run.`}`,
    "You banked marks and readiness by reading each question properly before writing."
  ]);
}

async function submitBoss() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  const durationSeconds = getCurrentStageDurationSeconds();
  const textarea = document.getElementById("boss-response");
  const existingResponse = textarea ? textarea.value.trim() : "";
  if (!existingResponse) buildBossDraft();
  const response = textarea ? textarea.value.trim() : (state.answers.bossText || "");
  state.answers.bossText = response;
  const review = bossCriterionReview(round, response);
  state.lastBossReview = review;
  const scoreRatio = review.scorePercent / 100;
  const showdownReason = String(state.answers.bossShowdownReason || "").trim();
  const scaffoldParts = getBossScaffoldReviewParts(round);
  const scaffoldReviewText = scaffoldParts.map(part => `${part.label}: ${part.response}`).join("\n");
  awardStage("boss", { scoreRatio });
  addEvidence("BOSS EST answer", `${round.question} • ${response || "No BOSS answer entered"}`);
  await saveProgress(
    "boss-round",
    "est-response",
    `Prompt: ${round.question}\nScore: ${review.scorePercent}%\nBand: ${review.band}\nResponse: ${response || "No response entered"}`,
    review.scorePercent,
    {
      taskName: "BOSS",
      durationSeconds,
      promptText: round.question,
      reviewResponseText: response || "No response entered",
      extraPayload: {
        showdown_choice: state.answers.bossShowdown || "",
        showdown_reason: showdownReason,
        scaffold_parts: scaffoldParts,
        sample_responses: (round.sampleResponses || []).map(sample => sample.response).filter(Boolean),
        strong_answer: round.strongAnswer || ""
      },
      additionalEvidenceRows: [
        showdownReason ? {
          checkpoint: "boss-round-comparison",
          evidenceType: "est-response",
          taskName: "BOSS Sample Comparison",
          durationSeconds,
          autoScore: review.scorePercent,
          prompt: "boss-round-comparison",
          promptText: "Explain what makes the stronger sample better.",
          responseText: `Selected sample: ${state.answers.bossShowdown || "Not selected"}\nReason: ${showdownReason}`,
          reviewResponseText: showdownReason,
          extraPayload: {
            response_kind: "boss-sample-comparison",
            showdown_choice: state.answers.bossShowdown || "",
            sample_responses: (round.sampleResponses || []).map(sample => sample.response).filter(Boolean),
            response_text: showdownReason
          }
        } : null,
        scaffoldReviewText ? {
          checkpoint: "boss-round-scaffold",
          evidenceType: "est-response",
          taskName: "BOSS Response Scaffold",
          durationSeconds,
          autoScore: review.scorePercent,
          prompt: "boss-round-scaffold",
          promptText: "Use the scaffold blocks to build a stronger answer before drafting the final response.",
          responseText: scaffoldReviewText,
          reviewResponseText: scaffoldReviewText,
          extraPayload: {
            response_kind: "boss-response-scaffold",
            scaffold_parts: scaffoldParts
          }
        } : null
      ].filter(Boolean)
    }
  );

  const strengths = review.strengths.length
    ? `<ul class="feedback-list">${review.strengths.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No strong elements were detected yet.</p>";
  const nextSteps = review.nextSteps.length
    ? `<ul class="feedback-list">${review.nextSteps.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>No immediate fixes needed. Push for even tighter wording.</p>";
  const rubric = `
    <div class="rubric-grid">
      ${review.checks.map(check => `
        <div class="rubric-chip ${check.passed ? "pass" : "fail"}">
          <strong>${escapeHtml(check.label)}</strong>
          <span>${check.passed ? "Met" : "Missing"}</span>
        </div>
      `).join("")}
    </div>
  `;

  showFeedbackBox(review.scorePercent >= 85 ? "good" : review.scorePercent >= 60 ? "warn" : "bad", [
    `<strong>BOSS complete:</strong> ${review.scorePercent}% • ${review.band} band.`,
    `Word count: ${review.wordCount}. ${escapeHtml(round.reviewSummary || "BOSS checked decoding, glossary control, answer structure, explanation, and result language.")}`,
    `Marker model: ${escapeHtml(round.strongAnswer)}`
  ], `
    <div class="sample-review">
      <h3>Your strengths</h3>
      ${strengths}
      <h3>Next steps</h3>
      ${nextSteps}
      <h3>Rubric snapshot</h3>
      ${rubric}
    </div>
    ${renderBossSamples(round)}
  `);
}
