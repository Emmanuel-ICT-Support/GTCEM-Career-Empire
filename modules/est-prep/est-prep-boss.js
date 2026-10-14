// EST Prep boss bundle. Loaded as a classic browser script.
function getBossShowdownPair(round) {
  if (!round?.sampleResponses?.length) return [];
  const strong = round.sampleResponses.find(sample => /strong/i.test(sample.band || ""));
  const developing = round.sampleResponses.find(sample => /developing/i.test(sample.band || ""));
  if (strong && developing) return [strong, developing];
  return round.sampleResponses.slice(0, 2);
}

function isBossStrongSample(sample) {
  return /strong/i.test(`${sample?.band || ""} ${sample?.label || ""}`);
}

function getBossShowdownResult(showdownPair) {
  const selectedLabel = state.answers.bossShowdown || "";
  const selectedSample = showdownPair.find(sample => sample.label === selectedLabel);
  const correctSample = showdownPair.find(isBossStrongSample);
  return {
    selectedLabel,
    selectedSample,
    correctSample,
    isCorrect: Boolean(selectedSample && isBossStrongSample(selectedSample))
  };
}

function getBossScaffoldLines(round) {
  return String(round?.scaffold || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function escapeBossRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueBossTerms(terms) {
  const seen = new Set();
  return (terms || []).map(term => String(term || "").trim()).filter(term => {
    const key = term.toLowerCase();
    if (!term || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getBossAnswerPartsSignal(round) {
  const question = String(round?.question || "");
  const lower = question.toLowerCase();
  const patterns = [
    { test: /three workplace situations/, value: "three workplace situations", terms: ["three workplace situations", "three", "situations"] },
    { test: /three key pieces of advice/, value: "three pieces of advice", terms: ["three key pieces of advice", "three", "advice"] },
    { test: /two different sources of advice/, value: "two advice sources", terms: ["two different sources of advice", "two", "sources of advice"] },
    { test: /two responses.*selection criteria/, value: "two STAR responses", terms: ["two responses", "selection criteria", "STAR method"] },
    { test: /three time-management tools|three time management tools/, value: "three time-management tools", terms: ["three", "tools"] },
    { test: /one megatrend/, value: "one megatrend impact", terms: ["one megatrend", "one", "megatrend"] }
  ];
  const match = patterns.find(pattern => pattern.test.test(lower));
  if (match) return match;
  const numberMatch = question.match(/\b(one|two|three|four)\b/i);
  return {
    value: numberMatch ? `${numberMatch[1].toLowerCase()} answer parts` : "answer parts",
    terms: numberMatch ? [numberMatch[1]] : []
  };
}

function getBossContextSignal(round) {
  const question = String(round?.question || "");
  const lower = question.toLowerCase();
  const candidates = [
    "school, work, and personal responsibilities",
    "life and work responsibilities",
    "workplace situations",
    "work environment",
    "workplace",
    "young person",
    "young people",
    "financial management",
    "career development",
    "selection criteria",
    "budgeting"
  ];
  const matches = candidates.filter(candidate => lower.includes(candidate.toLowerCase()));
  if (!matches.length) return null;
  const value = matches.includes("school, work, and personal responsibilities")
    ? "young person: school, work, and personal responsibilities"
    : matches.slice(0, 2).join(" / ");
  return { value, terms: matches };
}

function getBossQuestionSignals(round) {
  const tags = Array.isArray(round?.conceptTags) ? round.conceptTags : [];
  const command = String(round?.correctCommand || tags[tags.length - 1] || "").trim();
  const topic = String(round?.correctGlossary || tags.find(tag => tag !== command) || "").trim();
  const topicTerms = topic ? [topic, topic.replace(/\s+/g, "-")] : [];
  const parts = getBossAnswerPartsSignal(round);
  const context = getBossContextSignal(round);
  return [
    {
      id: "command",
      label: "Command word",
      value: command,
      terms: [command],
      detail: `${command || "The verb"} tells you how to answer.`
    },
    {
      id: "topic",
      label: "Topic language",
      value: topic,
      terms: topicTerms,
      detail: "Use this course language in the answer."
    },
    {
      id: "parts",
      label: "Answer parts",
      value: parts.value,
      terms: parts.terms,
      detail: "These are the pieces your answer must include."
    },
    {
      id: "context",
      label: "Context",
      value: context?.value || "",
      terms: context?.terms || [],
      detail: "Keep the answer aimed at this situation."
    }
  ].filter(signal => signal.value);
}

function renderBossHighlightedQuestion(round) {
  const question = String(round?.question || "Question loading...");
  const matches = [];
  getBossQuestionSignals(round).forEach(signal => {
    uniqueBossTerms(signal.terms).forEach(term => {
      const pattern = new RegExp(escapeBossRegExp(term), "gi");
      let match = pattern.exec(question);
      while (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          signalId: signal.id,
          label: signal.label
        });
        match = pattern.exec(question);
      }
    });
  });

  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  let html = "";
  let cursor = 0;
  matches.forEach(match => {
    if (match.start < cursor) return;
    html += escapeHtml(question.slice(cursor, match.start));
    html += `<mark class="boss-question-word boss-question-word--${escapeHtml(match.signalId)}" title="${escapeHtml(match.label)}">${escapeHtml(match.text)}</mark>`;
    cursor = match.end;
  });
  html += escapeHtml(question.slice(cursor));
  return html;
}

function renderBossQuestionMap(round, activePageId) {
  const activeSignalsByPage = {
    loadout: ["command", "topic", "parts"],
    calibration: ["command", "parts"],
    forge: ["command", "topic", "parts", "context"],
    scanner: ["command", "topic", "parts", "context"]
  };
  const activeSignals = new Set(activeSignalsByPage[activePageId] || []);
  return `
    <section class="boss-question-map" aria-label="Question map">
      <div>
        <span class="kicker">Question map</span>
        <p>${escapeHtml(round.help || "Use the coloured clues to keep every answer page connected to the question.")}</p>
      </div>
      <div class="boss-question-signal-grid">
        ${getBossQuestionSignals(round).map(signal => `
          <span class="boss-question-signal boss-question-signal--${escapeHtml(signal.id)} ${activeSignals.has(signal.id) ? "active" : ""}">
            <small>${escapeHtml(signal.label)}</small>
            <strong>${escapeHtml(signal.value)}</strong>
            <em>${escapeHtml(signal.detail)}</em>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function getBossScaffoldParts(round) {
  const command = String(round?.correctCommand || "").toLowerCase();
  return getBossScaffoldLines(round).map((line, index) => {
    const labelSource = line.replace(/\.\.\.$/, "").trim();
    const rawLabel = (labelSource.split(":")[0] || "").trim();
    const lowerLabel = rawLabel.toLowerCase();
    let label = rawLabel || `Answer part ${index + 1}`;
    let signalId = "parts";
    let instruction = "Build one answer piece that matches the coloured question clues.";

    if (command === "list" && /^tool\s+\d+/i.test(rawLabel)) {
      label = `Item ${index + 1}`;
      instruction = "Name one relevant item from the answer-parts clue in the question.";
    } else if (/^advice\s+\d+/i.test(rawLabel)) {
      signalId = "parts";
      instruction = "Give one practical piece of advice that answers the question.";
    } else if (/^situation\s+\d+/i.test(rawLabel)) {
      signalId = "context";
      instruction = "Describe one workplace situation, not just the skill name.";
    } else if (/^source\s+\d+/i.test(rawLabel)) {
      signalId = "parts";
      instruction = "Name one advice source and explain how it helps.";
    } else if (/^criterion\s+\d+/i.test(rawLabel)) {
      signalId = "parts";
      instruction = "Build one STAR response for this criterion.";
    } else if (/link/.test(lowerLabel)) {
      signalId = "topic";
      instruction = "Connect your answer back to the topic language.";
    } else if (/how|why|because/.test(lowerLabel)) {
      signalId = "command";
      instruction = "Explain the cause, reason, or process.";
    } else if (/result|outcome/.test(lowerLabel)) {
      signalId = "context";
      instruction = "State the outcome for the person or workplace in the question.";
    }

    const signal = getBossQuestionSignals(round).find(item => item.id === signalId) || getBossQuestionSignals(round)[0];
    return {
      label,
      signalId,
      signalLabel: signal?.label || "Question clue",
      signalValue: signal?.value || "",
      instruction
    };
  });
}

function cleanBossDraftSegment(value) {
  return String(value || "")
    .trim()
    .replace(/^(tool|item|advice|situation|source|criterion)\s*\d+\s*:\s*/i, "")
    .replace(/^(link|tools\/techniques|megatrend or impact|how\/why it affects careers|result for young people)\s*:\s*/i, "")
    .replace(/\s+/g, " ");
}

const EST_LAB_ASSET_ROOT = "../../Assets/EST Preparation/est-lab-asset-packs/";

const EST_LAB_ASSETS = {
  decoderBackground: `${EST_LAB_ASSET_ROOT}est-question-forensics-lab-bg.png`,
  evidenceScanFrame: `${EST_LAB_ASSET_ROOT}est-evidence-scan-frame.png`,
  correctLockGlow: `${EST_LAB_ASSET_ROOT}est-correct-lock-in-glow.png`,
  misreadWarning: `${EST_LAB_ASSET_ROOT}est-misread-warning-glitch.png`,
  caseBriefComplete: `${EST_LAB_ASSET_ROOT}est-case-brief-complete-badge.png`,
  bossBackground: `${EST_LAB_ASSET_ROOT}est-final-exam-simulation-chamber-bg.png`,
  answerLoadoutTray: `${EST_LAB_ASSET_ROOT}est-answer-loadout-tray.png`,
  chipContent: `${EST_LAB_ASSET_ROOT}est-chip-content.png`,
  chipTerm: `${EST_LAB_ASSET_ROOT}est-chip-term.png`,
  chipVtcs: `${EST_LAB_ASSET_ROOT}est-chip-vtcs.png`,
  markerScanner: `${EST_LAB_ASSET_ROOT}est-marker-scanner-frame.png`,
  finalResponseUplink: `${EST_LAB_ASSET_ROOT}est-final-response-uplink.png`,
  completionRewardBurst: `${EST_LAB_ASSET_ROOT}est-completion-reward-burst.png`,
  feedbackMarkSecured: `${EST_LAB_ASSET_ROOT}est-feedback-mark-secured.png`,
  feedbackMissingEvidence: `${EST_LAB_ASSET_ROOT}est-feedback-missing-evidence.png`,
  feedbackUpgradeAnswer: `${EST_LAB_ASSET_ROOT}est-feedback-upgrade-answer.png`,
  guide: {
    pointing: "../../Assets/EST Preparation/guide-character/guide-pointing.png",
    thinking: "../../Assets/EST Preparation/guide-character/guide-thinking-top.png",
    thinkingBottom: "../../Assets/EST Preparation/guide-character/guide-thinking-bottom.png",
    thumbsUp: "../../Assets/EST Preparation/guide-character/guide-thumbs-up.png",
    celebration: "../../Assets/EST Preparation/guide-character/guide-celebration.png"
  },
  lockSlots: {
    verb: `${EST_LAB_ASSET_ROOT}est-lock-slot-verb.png`,
    topic: `${EST_LAB_ASSET_ROOT}est-lock-slot-topic.png`,
    context: `${EST_LAB_ASSET_ROOT}est-lock-slot-context.png`,
    structure: `${EST_LAB_ASSET_ROOT}est-lock-slot-structure.png`
  }
};

const DECODER_PARTS = [
  {
    id: "verb",
    label: "Verb",
    shortLabel: "Verb scan",
    placeholder: "Select the command word",
    optionsKey: "verbOptions",
    correctKey: "correctVerb",
    toolTitle: "Forensics Tool 1: Command verb",
    mission: "Find the action word that controls how much detail the answer needs."
  },
  {
    id: "topic",
    label: "Topic",
    shortLabel: "Topic lock",
    placeholder: "Select the concept",
    optionsKey: "topicOptions",
    correctKey: "correctTopic",
    toolTitle: "Forensics Tool 2: Topic",
    mission: "Lock the course content being tested before choosing evidence."
  },
  {
    id: "context",
    label: "Context",
    shortLabel: "Context key",
    placeholder: "Select the context",
    optionsKey: "contextOptions",
    correctKey: "correctContext",
    toolTitle: "Forensics Tool 3: Context",
    mission: "Spot the clue that narrows where the answer should aim."
  },
  {
    id: "structure",
    label: "Structure",
    shortLabel: "Structure circuit",
    placeholder: "Select the structure",
    optionsKey: "structureOptions",
    correctKey: "correctStructure",
    toolTitle: "Forensics Tool 4: Structure",
    mission: "Choose the response shape that protects marks."
  }
];

const BOSS_LOADOUT_KEYS = {
  "boss-command": "vtcs",
  "boss-content": "content",
  "boss-glossary": "term"
};

const BOSS_PAGE_SEQUENCE = [
  { id: "loadout", label: "Loadout" },
  { id: "calibration", label: "Samples" },
  { id: "forge", label: "Forge" },
  { id: "scanner", label: "Scan" }
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
  const partLabel = part?.label || "Clue";
  let nextPart = null;
  if (part && round) {
    nextPart = DECODER_PARTS.find(item => getDecoderPartState(item, round).isCorrect === false);
    state.decoderActivePart = isCorrect && nextPart ? nextPart.id : part.id;
  }
  const remainingLocks = part && round
    ? DECODER_PARTS.filter(item => !getDecoderPartState(item, round).isCorrect).length
    : DECODER_PARTS.length;
  state.decoderPulse = {
    type: isCorrect ? (remainingLocks === 0 ? "complete" : "good") : "warn",
    title: isCorrect ? `${partLabel} repaired` : "Try again",
    detail: isCorrect
      ? remainingLocks === 0
        ? "All four clues are restored. Bank this brief to load the next EST question."
        : `${option} locked. Next scan: ${nextPart?.shortLabel || "next clue"}.`
      : getDecoderHint(part, round)
  };
  state.recentReward = {
    type: isCorrect ? "positive" : "warning",
    title: isCorrect ? `${partLabel} locked in` : "Keep decoding",
    detail: isCorrect
      ? `${option} is now glowing on the forensics board.`
      : getDecoderHint(part, round)
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

function getDecoderPartState(part, round, roundIndex = getDecoderRoundIndex()) {
  const answer = getDecoderAnswer(part.id, roundIndex);
  const isCorrect = Boolean(answer && round && answer === round[part.correctKey]);
  return {
    answer,
    isAnswered: Boolean(answer),
    isCorrect,
    isMisread: Boolean(answer && !isCorrect)
  };
}

function getDecoderActivePart(round, roundIndex = getDecoderRoundIndex()) {
  const requested = DECODER_PARTS.find(part => part.id === state.decoderActivePart);
  if (requested) return requested;
  return DECODER_PARTS.find(part => !getDecoderPartState(part, round, roundIndex).isCorrect) || DECODER_PARTS[0];
}

function setDecoderActivePart(partId) {
  const nextPart = DECODER_PARTS.find(part => part.id === partId);
  if (!nextPart) return;
  state.decoderActivePart = nextPart.id;
  renderDecoderStage();
}

function getDecoderBriefState(round, roundIndex = getDecoderRoundIndex()) {
  const parts = DECODER_PARTS.map(part => ({
    part,
    ...getDecoderPartState(part, round, roundIndex)
  }));
  const locked = parts.filter(item => item.isCorrect).length;
  const attempted = parts.filter(item => item.isAnswered).length;
  return {
    parts,
    locked,
    attempted,
    total: DECODER_PARTS.length,
    isComplete: locked === DECODER_PARTS.length
  };
}

function getDecoderActiveFeedback(part, round, roundIndex = getDecoderRoundIndex()) {
  const partState = getDecoderPartState(part, round, roundIndex);
  if (!partState.isAnswered) {
    return {
      type: "pending",
      title: `${part.shortLabel} armed`,
      detail: part.mission
    };
  }
  if (partState.isCorrect) {
    return {
      type: "good",
      title: `${part.label} locked`,
      detail: `${partState.answer} is now secured in the case brief.`
    };
  }
  return {
    type: "warn",
    title: "Misread risk",
    detail: getDecoderHint(part, round)
  };
}

function getDecoderHint(part, round) {
  if (!part || !round) return "Re-scan the question clue, then try another option.";
  if (part.id === "verb") {
    return `Hint: the command word is usually the first instruction in the question. It tells you whether to list, describe, explain, compare, or analyse.`;
  }
  if (part.id === "topic") {
    return "Hint: look for the main course idea being tested, not just any familiar word in the sentence.";
  }
  if (part.id === "context") {
    return "Hint: the context is the situation or boundary that narrows the answer, such as workplace, budgeting, career development, or job application.";
  }
  if (part.id === "structure") {
    return `Hint: match the answer shape to the command word. ${round.correctVerb || "This command"} needs ${round.correctStructure || "the structure that earns marks"}.`;
  }
  return "Re-scan the clue and try again.";
}

function getDecoderStructureBlueprint(structure) {
  const blueprints = {
    "Name the correct item": {
      title: "Identify / list shape",
      parts: [
        { type: "answer", label: "Direct answer", text: "Name the item clearly." }
      ],
      sentence: [
        { type: "answer", text: "The item is ..." }
      ]
    },
    "Name one item only": {
      title: "One-item shape",
      parts: [
        { type: "answer", label: "One valid point", text: "Give the item. Stop there unless asked for detail." }
      ],
      sentence: [
        { type: "answer", text: "One example is ..." }
      ]
    },
    "What it is + one key feature": {
      title: "Outline shape",
      parts: [
        { type: "answer", label: "What it is", text: "Briefly define the idea." },
        { type: "detail", label: "Key feature", text: "Add one important feature." }
      ],
      sentence: [
        { type: "answer", text: "A megatrend is ..." },
        { type: "detail", text: "One key feature is ..." }
      ]
    },
    "Feature + detail": {
      title: "Describe shape",
      parts: [
        { type: "answer", label: "Feature", text: "Name the skill, behaviour, or feature." },
        { type: "detail", label: "Detail", text: "Add what it looks like in the situation." }
      ],
      sentence: [
        { type: "answer", text: "One way is ..." },
        { type: "detail", text: "This involves ..." }
      ]
    },
    "Point + because/how + result": {
      title: "Explain shape",
      parts: [
        { type: "answer", label: "Point", text: "State the impact or idea." },
        { type: "reason", label: "Because/how", text: "Show the cause or process." },
        { type: "result", label: "Result", text: "State what follows." }
      ],
      sentence: [
        { type: "answer", text: "The impact is ..." },
        { type: "reason", text: "because/how ..." },
        { type: "result", text: "As a result ..." }
      ]
    },
    "Point + explanation + example + result": {
      title: "Discuss shape",
      parts: [
        { type: "answer", label: "Point", text: "Make a claim." },
        { type: "reason", label: "Explanation", text: "Develop the idea." },
        { type: "example", label: "Example", text: "Use a relevant example." },
        { type: "result", label: "Result", text: "Show why it matters." }
      ],
      sentence: [
        { type: "answer", text: "One influence is ..." },
        { type: "reason", text: "This matters because ..." },
        { type: "example", text: "For example ..." },
        { type: "result", text: "This can lead to ..." }
      ]
    },
    "Both... however...": {
      title: "Compare shape",
      parts: [
        { type: "compare", label: "Similarity", text: "Show what both have in common." },
        { type: "contrast", label: "Difference", text: "Show how they are different." }
      ],
      sentence: [
        { type: "compare", text: "Both ... and ... are ..." },
        { type: "contrast", text: "However, ... while ..." }
      ]
    },
    "Similarity + difference": {
      title: "Compare shape",
      parts: [
        { type: "compare", label: "Similarity", text: "Name what is shared." },
        { type: "contrast", label: "Difference", text: "Name what changes." }
      ],
      sentence: [
        { type: "compare", text: "Both are ..." },
        { type: "contrast", text: "The difference is ..." }
      ]
    },
    "Evidence + meaning + conclusion": {
      title: "Analyse shape",
      parts: [
        { type: "evidence", label: "Evidence", text: "Use the data or clue." },
        { type: "reason", label: "Meaning", text: "Explain what it shows." },
        { type: "result", label: "Conclusion", text: "Make a judgement." }
      ],
      sentence: [
        { type: "evidence", text: "The evidence shows ..." },
        { type: "reason", text: "This means ..." },
        { type: "result", text: "Therefore ..." }
      ]
    },
    "Evidence + conclusion": {
      title: "Evidence shape",
      parts: [
        { type: "evidence", label: "Evidence", text: "Use the clue." },
        { type: "result", label: "Conclusion", text: "State the judgement." }
      ],
      sentence: [
        { type: "evidence", text: "The evidence suggests ..." },
        { type: "result", text: "Therefore ..." }
      ]
    },
    "Definition only": {
      title: "Definition shape",
      parts: [
        { type: "answer", label: "Definition", text: "Give the meaning only." }
      ],
      sentence: [
        { type: "answer", text: "This means ..." }
      ]
    }
  };
  return blueprints[structure] || {
    title: "Answer shape",
    parts: [
      { type: "answer", label: "Answer", text: "Use the structure that matches the command word." }
    ],
    sentence: [
      { type: "answer", text: structure || "Build a clear answer shape." }
    ]
  };
}

function setBossSelectionPulse(groupKey, option) {
  const round = state.stageDeck?.bossRound;
  const correctAnswer = {
    "boss-command": round?.correctCommand,
    "boss-content": round?.correctContent,
    "boss-glossary": round?.correctGlossary
  }[groupKey];
  const isCorrect = Boolean(correctAnswer && option === correctAnswer);
  state.recentReward = {
    type: isCorrect ? "positive" : "warning",
    title: isCorrect ? "Loadout chip armed" : "Try again",
    detail: isCorrect
      ? `${option} is ready for the final response simulation.`
      : "That chip will cost marks. Recheck what this answer system is looking for."
  };
  renderRewardPulse();
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
  const parts = getBossScaffoldParts(round);
  return `
    <div class="panel boss-forge-panel">
      <div class="section-title">
        <h2>Response Forge</h2>
        <p>Answer parts feed the paragraph</p>
      </div>
      <p class="small-copy">Each box matches a coloured clue from the question above, then joins into the final paragraph below.</p>
      ${renderFreeTextPrivacyNotice()}
      <div class="builder-grid">
        ${parts.map((part, index) => `
          <div class="written-stage boss-builder-card boss-builder-card--${escapeHtml(part.signalId)}">
            <div class="boss-builder-card-head">
              <strong>${escapeHtml(part.label)}</strong>
              <span>${escapeHtml(part.signalLabel)}: ${escapeHtml(part.signalValue)}</span>
            </div>
            <p class="small-copy">${escapeHtml(part.instruction)}</p>
            <textarea
              id="boss-scaffold-${index}"
              placeholder="Write this answer part..."
              oninput="window.ESTPrep.setBossScaffold(${index}, this.value)"
            >${escapeHtml(state.answers[`boss-scaffold-${index}`] || "")}</textarea>
          </div>
        `).join("")}
      </div>
      <div class="builder-actions">
        <button class="submit-button" type="button" onclick="window.ESTPrep.buildBossDraft()">Refresh final paragraph</button>
      </div>
    </div>
  `;
}

function renderDecoderLockSlot(item, activePartId) {
  const statusClass = item.isCorrect ? "filled" : item.isMisread ? "misread" : "pending";
  const statusText = item.isCorrect ? "Locked" : item.isMisread ? "Misread" : "Scanning";
  const displayAnswer = item.isCorrect ? item.answer : item.isMisread ? "Re-scan" : item.part.placeholder;
  return `
    <button
      type="button"
      class="decoder-lock-slot ${statusClass} ${activePartId === item.part.id ? "active" : ""}"
      onclick="window.ESTPrep.setDecoderActivePart('${item.part.id}')"
      aria-pressed="${activePartId === item.part.id ? "true" : "false"}"
    >
      <span class="decoder-lock-icon">
        <img class="decoder-lock-art" src="${escapeHtml(EST_LAB_ASSETS.lockSlots[item.part.id])}" alt="" aria-hidden="true">
      </span>
      ${item.isCorrect ? `<img class="decoder-lock-glow" src="${escapeHtml(EST_LAB_ASSETS.correctLockGlow)}" alt="" aria-hidden="true">` : ""}
      ${item.isMisread ? `<img class="decoder-lock-glitch" src="${escapeHtml(EST_LAB_ASSETS.misreadWarning)}" alt="" aria-hidden="true">` : ""}
      <span class="decoder-lock-status">${escapeHtml(statusText)}</span>
      <strong>${escapeHtml(item.part.label)}</strong>
      <small>${escapeHtml(displayAnswer)}</small>
    </button>
  `;
}

function renderDecoderPulse(briefState) {
  const pulse = state.decoderPulse || {
    type: "pending",
    title: "Scanner online",
    detail: "Choose one clue at a time. Correct choices repair the question signal."
  };
  const tone = pulse.type === "complete" ? "good" : pulse.type;
  return `
    <aside class="decoder-motivation-pulse ${escapeHtml(tone)}">
      <div class="decoder-pulse-node" aria-hidden="true"></div>
      <div>
        <strong>${escapeHtml(pulse.title)}</strong>
        <p>${escapeHtml(pulse.detail)}</p>
      </div>
      <span>${briefState.locked}/${briefState.total}</span>
    </aside>
  `;
}

function renderDecoderRepairRail(briefState) {
  const repairPercent = Math.round((briefState.locked / Math.max(1, briefState.total)) * 100);
  return `
    <div class="decoder-repair-rail" style="--decoder-repair:${repairPercent}%">
      <div class="decoder-repair-track">
        <span></span>
      </div>
      <div class="decoder-repair-nodes" aria-label="${repairPercent}% question signal restored">
        ${briefState.parts.map(item => `
          <button
            type="button"
            class="decoder-repair-node ${item.isCorrect ? "filled" : item.isMisread ? "misread" : ""}"
            onclick="window.ESTPrep.setDecoderActivePart('${item.part.id}')"
            aria-label="${escapeHtml(item.part.label)} ${item.isCorrect ? "locked" : item.isMisread ? "needs retry" : "pending"}"
          >
            ${escapeHtml(item.part.label.charAt(0))}
          </button>
        `).join("")}
      </div>
      <strong>${repairPercent}% signal restored</strong>
    </div>
  `;
}

function renderDecoderBlueprintPreview(round, briefState, roundIndex) {
  const selectedStructure = getDecoderAnswer("structure", roundIndex);
  const structureReady = selectedStructure === round.correctStructure;
  const blueprint = getDecoderStructureBlueprint(structureReady ? selectedStructure : round.correctStructure);
  return `
    <section class="decoder-blueprint-preview ${structureReady || briefState.isComplete ? "revealed" : "locked"}">
      <div class="decoder-blueprint-head">
        <span class="kicker">Answer shape preview</span>
        <strong>${structureReady || briefState.isComplete ? escapeHtml(blueprint.title) : "Restore Structure to reveal the sentence map"}</strong>
      </div>
      ${structureReady || briefState.isComplete ? `
        <div class="decoder-blueprint-parts">
          ${blueprint.parts.map(part => `
            <span class="decoder-blueprint-chip ${escapeHtml(part.type)}">
              <strong>${escapeHtml(part.label)}</strong>
              <small>${escapeHtml(part.text)}</small>
            </span>
          `).join("")}
        </div>
        <p class="decoder-blueprint-sentence">
          ${blueprint.sentence.map(part => `<span class="${escapeHtml(part.type)}">${escapeHtml(part.text)}</span>`).join(" ")}
        </p>
      ` : `
        <p>VTCS previews the sentence structure. BOSS uses it later to build the full response.</p>
      `}
    </section>
  `;
}

function getDecoderVisualState(briefState) {
  const pulse = state.decoderPulse || {};
  if (pulse.type === "warn") {
    return {
      tone: "warn",
      title: "Think again",
      label: "Misread detected",
      detail: "Re-scan the clue and choose the option that matches the question wording.",
      character: EST_LAB_ASSETS.guide.thinking,
      effect: EST_LAB_ASSETS.misreadWarning
    };
  }
  if (briefState.isComplete || pulse.type === "complete") {
    return {
      tone: "complete",
      title: "Question restored",
      label: "All locks repaired",
      detail: "The question is ready to bank. Send the brief to load the next one.",
      character: EST_LAB_ASSETS.guide.celebration,
      effect: EST_LAB_ASSETS.completionRewardBurst,
      badge: EST_LAB_ASSETS.caseBriefComplete
    };
  }
  if (pulse.type === "good" || briefState.locked > 0) {
    return {
      tone: "good",
      title: "Clue repaired",
      label: `${briefState.locked}/${briefState.total} locks restored`,
      detail: "The signal is improving. Keep repairing until the bank gate opens.",
      character: EST_LAB_ASSETS.guide.thumbsUp,
      effect: EST_LAB_ASSETS.correctLockGlow
    };
  }
  return {
    tone: "pending",
    title: "Scanner online",
    label: "Question needs repair",
    detail: "Start with the command word, then restore Topic, Context, and Structure.",
    character: EST_LAB_ASSETS.guide.pointing,
    effect: EST_LAB_ASSETS.evidenceScanFrame
  };
}

function renderDecoderRepairVisual(briefState) {
  const visual = getDecoderVisualState(briefState);
  return `
    <figure class="decoder-repair-visual ${escapeHtml(visual.tone)}" aria-hidden="true">
      <img class="decoder-repair-effect" src="${escapeHtml(visual.effect)}" alt="">
      ${visual.badge ? `<img class="decoder-repair-badge" src="${escapeHtml(visual.badge)}" alt="">` : ""}
      <img class="decoder-repair-character" src="${escapeHtml(visual.character)}" alt="">
      <figcaption>
        <strong>${escapeHtml(visual.label)}</strong>
        <span>${escapeHtml(visual.detail)}</span>
      </figcaption>
    </figure>
  `;
}

function renderDecoderStageReaction(briefState) {
  const pulse = state.decoderPulse;
  if (!pulse || pulse.type === "pending") return "";
  const visual = getDecoderVisualState(briefState);
  const title = pulse.type === "warn" ? "Think again" : visual.title;
  return `
    <aside class="decoder-stage-reaction ${escapeHtml(visual.tone)}" aria-live="polite">
      <img class="decoder-stage-reaction-effect" src="${escapeHtml(visual.effect)}" alt="" aria-hidden="true">
      <img class="decoder-stage-reaction-character" src="${escapeHtml(visual.character)}" alt="" aria-hidden="true">
      <div>
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(pulse.title)}</strong>
        <p>${escapeHtml(pulse.detail)}</p>
      </div>
    </aside>
  `;
}

function renderDecoderActiveConsole(part, round, roundIndex) {
  const answer = getDecoderAnswer(part.id, roundIndex);
  const correctAnswer = round[part.correctKey];
  const feedback = getDecoderActiveFeedback(part, round, roundIndex);
  const feedbackAsset = feedback.type === "good"
    ? EST_LAB_ASSETS.correctLockGlow
    : feedback.type === "warn"
      ? EST_LAB_ASSETS.misreadWarning
      : EST_LAB_ASSETS.evidenceScanFrame;
  return `
    <section class="decoder-tool-console ${escapeHtml(feedback.type)}">
      <div class="decoder-tool-header">
        <div>
          <span class="kicker">${escapeHtml(part.toolTitle)}</span>
          <h3>${escapeHtml(part.shortLabel)}</h3>
          <p>${escapeHtml(part.mission)}</p>
        </div>
        <div class="decoder-scan-screen" aria-hidden="true">
          <img src="${escapeHtml(feedbackAsset)}" alt="">
        </div>
      </div>
      <div class="decoder-option-grid">
        ${(round[part.optionsKey] || []).map(option => {
          const selected = answer === option;
          const selectedState = selected && option === correctAnswer ? "correct" : selected ? "incorrect" : "";
          return `
            <button
              type="button"
              class="choice-button decoder-option ${selected ? "selected live-selected" : ""} ${selectedState}"
              data-group="${escapeHtml(getDecoderAnswerKey(part.id, roundIndex))}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('${getDecoderAnswerKey(part.id, roundIndex)}', '${encodeForInlineHandler(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `;
        }).join("")}
      </div>
      <div class="decoder-scan-feedback">
        <strong>${escapeHtml(feedback.title)}</strong>
        <p>${escapeHtml(feedback.detail)}</p>
        ${feedback.type === "warn" ? `<button class="choice-button decoder-retry-button" type="button" onclick="window.ESTPrep.setDecoderActivePart('${part.id}')"><strong>Try this clue again</strong></button>` : ""}
      </div>
    </section>
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
  const briefState = getDecoderBriefState(round, roundIndex);
  const activePart = getDecoderActivePart(round, roundIndex);
  const bankDisabled = briefState.isComplete ? "" : "disabled";
  const submitDockClass = briefState.isComplete ? "ready" : "pending";
  const nextQuestionText = roundIndex === rounds.length - 1 ? "finish VTCS" : `load Question ${roundIndex + 2}`;
  setText("stage-title", "VTCS");
  setText("stage-subtitle", `What the question wants: run question forensics before you write. Question ${roundIndex + 1} of ${rounds.length}.`);
  renderStageRoot(`
    <section class="decoder-lab-shell">
      <img class="decoder-lab-bg" src="${escapeHtml(EST_LAB_ASSETS.decoderBackground)}" alt="">
      ${renderDecoderStageReaction(briefState)}
      <div class="decoder-lab-overlay">
        <header class="decoder-lab-hud">
          <div>
            <span class="kicker">VTCS / Question Forensics</span>
            <h2>Crack what the question wants.</h2>
          </div>
          <div class="decoder-hud-stat">
            <strong>${briefState.locked}/${briefState.total}</strong>
            <span>case locks</span>
          </div>
          <div class="decoder-hud-stat">
            <strong>${progress.completed}/${progress.total}</strong>
            <span>questions banked</span>
          </div>
        </header>
        ${renderDecoderTransitionFeedback(transitionFeedback)}
        <div class="badge-row decoder-progress-strip">${progressBadges}</div>
        <div class="decoder-forensics-layout">
          <article class="decoder-evidence-panel ${briefState.isComplete ? "restored" : briefState.locked ? "repairing" : "damaged"}" style="--decoder-lock-ratio:${briefState.locked / Math.max(1, briefState.total)}">
            <div class="decoder-scan-beam" aria-hidden="true"></div>
            <div class="decoder-evidence-copy">
              <div class="decoder-question-copy">
                <span class="kicker">Question signal ${briefState.locked}/${briefState.total}</span>
                <h3>${escapeHtml(round.question)}</h3>
                <p>${escapeHtml(round.feedback)}</p>
                ${renderDecoderRepairRail(briefState)}
              </div>
              ${renderDecoderRepairVisual(briefState)}
            </div>
          </article>
          <aside class="decoder-brief-panel">
            <div>
              <span class="kicker">Case brief</span>
              <strong>Lock the four clues.</strong>
            </div>
            <div class="decoder-lock-grid">
              ${briefState.parts.map(item => renderDecoderLockSlot(item, activePart.id)).join("")}
            </div>
          </aside>
        </div>
        ${renderDecoderPulse(briefState)}
        ${renderDecoderActiveConsole(activePart, round, roundIndex)}
        ${renderDecoderBlueprintPreview(round, briefState, roundIndex)}
        <footer class="decoder-submit-dock ${submitDockClass}">
          <div>
            <strong>${briefState.isComplete ? "All four clues restored" : "Repair the clue locks"}</strong>
            <p>${briefState.isComplete ? `Bank this brief to ${nextQuestionText}.` : `${briefState.locked}/${briefState.total} locks restored. Wrong choices show hints; keep scanning until the signal is clear.`}</p>
          </div>
          <button class="submit-button" type="button" onclick="window.ESTPrep.submitDecoder()" ${bankDisabled}>${briefState.isComplete ? (roundIndex === rounds.length - 1 ? "Bank VTCS Results" : `Bank Brief And Load Question ${roundIndex + 2}`) : "Restore All Four Clues"}</button>
        </footer>
      </div>
    </section>
  `);
}

function getBossLoadoutItems(round) {
  return [
    {
      key: "boss-content",
      type: "content",
      title: "CORE content",
      kicker: "What to say",
      asset: EST_LAB_ASSETS.chipContent,
      options: round.contentOptions || [],
      correct: round.correctContent,
      empty: "Choose the strongest content point"
    },
    {
      key: "boss-glossary",
      type: "term",
      title: "TERM language",
      kicker: "Precise wording",
      asset: EST_LAB_ASSETS.chipTerm,
      options: round.glossaryOptions || [],
      correct: round.correctGlossary,
      empty: "Choose the glossary context"
    },
    {
      key: "boss-command",
      type: "vtcs",
      title: "VTCS blueprint",
      kicker: "Question strategy",
      asset: EST_LAB_ASSETS.chipVtcs,
      options: round.commandOptions || [],
      correct: round.correctCommand,
      empty: "Choose the command word"
    }
  ];
}

function getBossLoadoutReview(round) {
  const items = getBossLoadoutItems(round).map(item => {
    const selected = state.answers[item.key] || "";
    return {
      ...item,
      selected,
      isLoaded: Boolean(selected),
      isCorrect: Boolean(selected && selected === item.correct)
    };
  });
  return {
    items,
    loaded: items.filter(item => item.isLoaded).length,
    locked: items.filter(item => item.isCorrect).length,
    total: items.length
  };
}

function renderBossLoadoutTray(round) {
  const review = getBossLoadoutReview(round);
  return `
    <aside class="boss-loadout-panel">
      <div class="boss-loadout-head">
        <span class="kicker">Answer loadout</span>
        <strong>${review.locked}/${review.total} systems armed</strong>
      </div>
      <div class="boss-loadout-tray">
        <img class="boss-loadout-tray-art" src="${escapeHtml(EST_LAB_ASSETS.answerLoadoutTray)}" alt="" aria-hidden="true">
        <div class="boss-loadout-chips">
          ${review.items.map(item => `
            <button
              type="button"
              class="boss-loadout-chip ${item.isCorrect ? "locked" : item.isLoaded ? "warn" : "empty"}"
              onclick="window.ESTPrep.focusBossLoadout('${item.key}')"
            >
              <img src="${escapeHtml(item.asset)}" alt="" aria-hidden="true">
              <span>${escapeHtml(item.kicker)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.selected || item.empty)}</small>
            </button>
          `).join("")}
        </div>
      </div>
    </aside>
  `;
}

function renderBossLoadoutFeedback(round) {
  const review = getBossLoadoutReview(round);
  const firstWrong = review.items.find(item => item.isLoaded && !item.isCorrect);
  const allSecure = review.locked === review.total;
  const tone = firstWrong ? "warn" : allSecure || review.locked ? "good" : "neutral";
  const title = firstWrong
    ? `Try again: ${firstWrong.title}`
    : allSecure
      ? "Loadout secured."
      : review.locked
        ? "Chip secured."
        : "Choose the three answer systems.";
  const detail = firstWrong
    ? `The scanner rejected "${firstWrong.selected}". Pick the chip that best matches ${firstWrong.kicker.toLowerCase()}.`
    : allSecure
      ? "CORE, TERM, and VTCS are ready for the sample check."
      : review.locked
        ? `${review.locked}/${review.total} chips are secured. Keep loading the remaining systems.`
        : "Each correct chip arms part of the final answer.";
  const character = firstWrong
    ? EST_LAB_ASSETS.guide.thinking
    : allSecure || review.locked
      ? EST_LAB_ASSETS.guide.thumbsUp
      : EST_LAB_ASSETS.guide.pointing;
  return `
    <aside class="boss-loadout-feedback boss-loadout-feedback--${escapeHtml(tone)}" aria-live="polite">
      <img src="${escapeHtml(character)}" alt="" aria-hidden="true">
      <div>
        <span class="kicker">Loadout feedback</span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(detail)}</p>
        ${firstWrong ? `<button class="submit-button ghost" type="button" onclick="window.ESTPrep.focusBossLoadout('${firstWrong.key}')">Try ${escapeHtml(firstWrong.title)} again</button>` : ""}
      </div>
      <div class="boss-loadout-feedback-grid">
        ${review.items.map(item => `
          <span class="${item.isCorrect ? "secure" : item.isLoaded ? "retry" : "pending"}">
            <small>${item.isCorrect ? "Reward" : item.isLoaded ? "Try again" : "Pending"}</small>
            <strong>${escapeHtml(item.kicker)}</strong>
          </span>
        `).join("")}
      </div>
    </aside>
  `;
}

function renderBossChoiceRack(item) {
  const selected = state.answers[item.key] || "";
  const selectedIsCorrect = Boolean(selected && selected === item.correct);
  const reaction = selectedIsCorrect
    ? {
        tone: "good",
        title: "Secured!",
        detail: `${item.kicker} is glowing in the answer loadout.`,
        effect: EST_LAB_ASSETS.completionRewardBurst,
        character: EST_LAB_ASSETS.guide.celebration,
        badge: EST_LAB_ASSETS.feedbackMarkSecured
      }
    : {
        tone: "warn",
        title: `Try again: ${item.title}`,
        detail: `The scanner rejected "${selected}". Pick the option that best matches ${item.kicker.toLowerCase()}.`,
        effect: EST_LAB_ASSETS.misreadWarning,
        character: EST_LAB_ASSETS.guide.thinking,
        badge: EST_LAB_ASSETS.feedbackMissingEvidence
      };
  return `
    <section class="boss-choice-rack boss-choice-rack--${escapeHtml(item.type)}" id="boss-rack-${escapeHtml(item.key)}">
      <div class="boss-choice-rack-head">
        <img src="${escapeHtml(item.asset)}" alt="" aria-hidden="true">
        <div>
          <span class="kicker">${escapeHtml(item.kicker)}</span>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
      </div>
      <div class="boss-choice-options">
        ${item.options.map(option => {
          const isSelected = selected === option;
          const selectedState = isSelected && option === item.correct ? "correct" : isSelected ? "incorrect" : "";
          return `
            <button
              type="button"
              class="choice-button boss-choice-option ${isSelected ? "selected live-selected" : ""} ${selectedState}"
              data-group="${escapeHtml(item.key)}"
              data-value="${escapeHtml(option)}"
              onclick="window.ESTPrep.setChoiceEncoded('${item.key}', '${encodeForInlineHandler(option)}')"
            >
              <strong>${escapeHtml(option)}</strong>
            </button>
          `;
        }).join("")}
      </div>
      ${selected ? `
        <div class="boss-choice-feedback ${escapeHtml(reaction.tone)}" aria-live="polite">
          <figure class="boss-choice-reaction-art" aria-hidden="true">
            <img class="boss-choice-reaction-effect" src="${escapeHtml(reaction.effect)}" alt="">
            <img class="boss-choice-reaction-character" src="${escapeHtml(reaction.character)}" alt="">
            <img class="boss-choice-reaction-badge" src="${escapeHtml(reaction.badge)}" alt="">
          </figure>
          <div class="boss-choice-reaction-copy">
            <span class="kicker">${selectedIsCorrect ? "Loadout charged" : "Scanner rejected"}</span>
            <strong>${escapeHtml(reaction.title)}</strong>
            <p>${escapeHtml(reaction.detail)}</p>
            ${selectedIsCorrect ? "" : `<button class="submit-button ghost" type="button" onclick="window.ESTPrep.focusBossLoadout('${item.key}')">Try ${escapeHtml(item.title)} again</button>`}
          </div>
        </div>
      ` : ""}
    </section>
  `;
}

function getBossScannerState(round) {
  const loadout = getBossLoadoutReview(round);
  const scaffoldLines = getBossScaffoldLines(round);
  const scaffoldCount = scaffoldLines.filter((_, index) => String(state.answers[`boss-scaffold-${index}`] || "").trim()).length;
  const response = String(state.answers.bossText || "").trim();
  const wordCount = response ? response.split(/\s+/).filter(Boolean).length : 0;
  const minimumWordCount = Number.isFinite(round.minimumWordCount) ? round.minimumWordCount : 24;
  const loadoutRatio = loadout.locked / Math.max(1, loadout.total);
  const scaffoldRatio = scaffoldCount / Math.max(1, scaffoldLines.length);
  const writingRatio = Math.min(1, wordCount / Math.max(1, minimumWordCount));
  const fill = Math.round((loadoutRatio * 0.5 + scaffoldRatio * 0.25 + writingRatio * 0.25) * 100);
  return { loadout, scaffoldCount, scaffoldTotal: scaffoldLines.length, wordCount, minimumWordCount, fill };
}

function renderBossMarkerScanner(round) {
  const scanner = getBossScannerState(round);
  const checkRows = [
    { label: "CORE content", passed: scanner.loadout.items.find(item => item.type === "content")?.isCorrect },
    { label: "TERM precision", passed: scanner.loadout.items.find(item => item.type === "term")?.isCorrect },
    { label: "VTCS command", passed: scanner.loadout.items.find(item => item.type === "vtcs")?.isCorrect },
    { label: "Scaffold built", passed: scanner.scaffoldCount >= Math.max(1, scanner.scaffoldTotal) },
    { label: "Response drafted", passed: scanner.wordCount >= Math.min(scanner.minimumWordCount, 12) }
  ];
  return `
    <aside class="boss-scanner-panel" style="--boss-scanner-fill:${scanner.fill}%">
      <div class="boss-scanner-art">
        <img src="${escapeHtml(EST_LAB_ASSETS.markerScanner)}" alt="" aria-hidden="true">
        <div class="boss-scanner-fill"></div>
      </div>
      <div class="boss-scanner-status">
        <span class="kicker">Answer scanner</span>
        <strong>${scanner.fill}% ready</strong>
        <p>${scanner.wordCount}/${scanner.minimumWordCount} target words. Final marks are checked after submission.</p>
      </div>
      <div class="boss-scanner-checks">
        ${checkRows.map(row => `
          <div class="boss-scanner-check ${row.passed ? "pass" : "pending"}">
            <span>${row.passed ? "Secured" : "Pending"}</span>
            <strong>${escapeHtml(row.label)}</strong>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function renderBossShowdownGate(round, showdownPair) {
  if (showdownPair.length !== 2) {
    return `
      <section class="boss-showdown-gate boss-showdown-empty">
        <div class="boss-showdown-head">
          <div>
            <span class="kicker">Calibration gate</span>
            <h3>Samples unavailable.</h3>
          </div>
          <img src="${escapeHtml(EST_LAB_ASSETS.feedbackUpgradeAnswer)}" alt="" aria-hidden="true">
        </div>
        <p class="small-copy">Move to the forge and build your own response from the scaffold.</p>
      </section>
    `;
  }
  const showdown = getBossShowdownResult(showdownPair);
  const noteDisabled = showdown.isCorrect ? "" : "disabled";
  const notePlaceholder = showdown.isCorrect
    ? "Name the feature that makes this sample stronger..."
    : "Choose the stronger sample first, then explain why it earns more marks.";
  return `
    <section class="boss-showdown-gate">
      <div class="boss-showdown-head">
        <div>
          <span class="kicker">Sample check</span>
          <h3>Judge quality before drafting.</h3>
          <p>Choose the response that would earn more marks, then say what makes it stronger.</p>
        </div>
        <img src="${escapeHtml(showdown.isCorrect ? EST_LAB_ASSETS.feedbackMarkSecured : EST_LAB_ASSETS.feedbackUpgradeAnswer)}" alt="" aria-hidden="true">
      </div>
      <div class="sample-grid boss-sample-grid">
        ${showdownPair.map((sample, index) => `
          <article class="sample-card boss-sample-card ${state.answers.bossShowdown === sample.label ? isBossStrongSample(sample) ? "correct" : "incorrect" : ""}">
            <div class="sample-meta">
              <strong>Sample ${index + 1}</strong>
              <span>Answer option</span>
            </div>
            <p>${escapeHtml(sample.response)}</p>
            <button
              type="button"
              class="choice-button ${state.answers.bossShowdown === sample.label ? "selected live-selected" : ""} ${state.answers.bossShowdown === sample.label ? isBossStrongSample(sample) ? "correct" : "incorrect" : ""}"
              onclick="window.ESTPrep.setChoiceEncoded('bossShowdown', '${encodeForInlineHandler(sample.label)}')"
            >
              <strong>This earns more marks</strong>
            </button>
          </article>
        `).join("")}
      </div>
      ${renderBossShowdownFeedback(showdown)}
      <div class="boss-showdown-reason">
        <strong>Why this earns more</strong>
        <textarea id="boss-showdown-reason" placeholder="${escapeHtml(notePlaceholder)}" oninput="window.ESTPrep.setBossShowdownReason(this.value)" ${noteDisabled}>${escapeHtml(state.answers.bossShowdownReason || "")}</textarea>
      </div>
    </section>
  `;
}

function renderBossShowdownFeedback(showdown) {
  if (!showdown.selectedSample) {
    return `
      <div class="boss-showdown-feedback neutral" aria-live="polite">
        <img src="${escapeHtml(EST_LAB_ASSETS.guide.thinking)}" alt="" aria-hidden="true">
        <div>
          <strong>Pick the stronger sample.</strong>
          <p>Look for specific details, clear structure, and a direct answer to the question.</p>
        </div>
      </div>
    `;
  }
  if (showdown.isCorrect) {
    return `
      <div class="boss-showdown-feedback good" aria-live="polite">
        <img src="${escapeHtml(EST_LAB_ASSETS.guide.celebration)}" alt="" aria-hidden="true">
        <div>
          <strong>Correct sample spotted.</strong>
          <p>${escapeHtml(showdown.selectedSample.commentary || "This response gives enough detail and links back to the question.")}</p>
        </div>
      </div>
    `;
  }
  return `
    <div class="boss-showdown-feedback warn" aria-live="polite">
      <img src="${escapeHtml(EST_LAB_ASSETS.guide.thinking)}" alt="" aria-hidden="true">
      <div>
        <strong>Try again.</strong>
        <p>${escapeHtml(showdown.selectedSample.commentary || "That sample is too thin for the marks.")} Choose the sample with more specific evidence.</p>
      </div>
    </div>
  `;
}

function setBossText(value) {
  state.answers.bossText = value;
  state.answers.bossTextMode = value === state.answers.bossDraftSource ? "auto" : "manual";
  persistESTProgressSnapshot();
}

function getBossDraftFromScaffold(round) {
  return getBossScaffoldLines(round)
    .map((_, index) => cleanBossDraftSegment(state.answers[`boss-scaffold-${index}`]))
    .filter(Boolean)
    .join(" ");
}

function syncBossDraftFromScaffold(round, { force = false } = {}) {
  const draft = getBossDraftFromScaffold(round);
  const current = String(state.answers.bossText || "");
  const previousAutoDraft = String(state.answers.bossDraftSource || "");
  const hasManualFinalEdit = (state.answers.bossTextMode === "manual" || (!state.answers.bossTextMode && current.trim())) && current !== previousAutoDraft;

  if (!force && hasManualFinalEdit) return false;

  state.answers.bossText = draft;
  state.answers.bossDraftSource = draft;
  state.answers.bossTextMode = "auto";

  const textarea = document.getElementById("boss-response");
  if (textarea && textarea.value !== draft) textarea.value = draft;

  return true;
}

function focusBossLoadout(groupKey) {
  if (state.bossPageIndex !== 0) {
    state.bossPageIndex = 0;
    renderBossStage();
  }
  const rack = document.getElementById(`boss-rack-${groupKey}`);
  if (rack) rack.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getBossPageIndex(totalPages = BOSS_PAGE_SEQUENCE.length) {
  if (!Number.isInteger(state.bossPageIndex)) state.bossPageIndex = 0;
  state.bossPageIndex = Math.max(0, Math.min(state.bossPageIndex, Math.max(0, totalPages - 1)));
  return state.bossPageIndex;
}

function scrollBossStageTop() {
  const shell = document.querySelector(".boss-sim-shell");
  if (shell) {
    shell.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setBossPage(pageIndex) {
  const numericIndex = Number(pageIndex);
  if (!Number.isFinite(numericIndex)) return;
  state.bossPageIndex = Math.max(0, Math.min(Math.trunc(numericIndex), BOSS_PAGE_SEQUENCE.length - 1));
  persistESTProgressSnapshot();
  renderBossStage();
  scrollBossStageTop();
}

function moveBossPage(delta) {
  setBossPage(getBossPageIndex() + Number(delta || 0));
}

function getBossScaffoldStatus(round) {
  const lines = getBossScaffoldLines(round);
  const completed = lines.filter((_, index) => String(state.answers[`boss-scaffold-${index}`] || "").trim()).length;
  return { completed, total: lines.length };
}

function renderBossPageVisual({ tone = "neutral", title, detail, character, effect, badge }) {
  return `
    <figure class="boss-page-visual boss-page-visual--${escapeHtml(tone)}" aria-hidden="true">
      <img class="boss-page-visual-effect" src="${escapeHtml(effect)}" alt="">
      ${badge ? `<img class="boss-page-visual-badge" src="${escapeHtml(badge)}" alt="">` : ""}
      <img class="boss-page-visual-character" src="${escapeHtml(character)}" alt="">
      <figcaption>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(detail)}</span>
      </figcaption>
    </figure>
  `;
}

function renderBossDraftPreview(round) {
  const response = String(state.answers.bossText || "").trim();
  const scaffold = getBossScaffoldReviewParts(round);
  return `
    <article class="boss-draft-preview">
      <span class="kicker">Response preview</span>
      <strong>${response ? "Draft loaded into scanner" : scaffold.length ? "Scaffold ready to assemble" : "No draft loaded yet"}</strong>
      <p>${escapeHtml(response || scaffold.map(part => `${part.label}: ${part.response}`).join(" ") || "Use the Forge page to build a response before the final scan.")}</p>
    </article>
  `;
}

function getBossPageDefinitions(round, loadoutItems, showdownPair, communityOptions) {
  const loadoutReview = getBossLoadoutReview(round);
  const scanner = getBossScannerState(round);
  const scaffold = getBossScaffoldStatus(round);
  const response = String(state.answers.bossText || "").trim();
  const showdown = getBossShowdownResult(showdownPair);

  return [
    {
      id: "loadout",
      label: "Loadout",
      eyebrow: "Page 1 / Answer systems",
      title: "Arm CORE, TERM, and VTCS.",
      detail: "Choose the three chips that should feed the final answer.",
      status: `${loadoutReview.locked}/${loadoutReview.total} systems secured`,
      isComplete: loadoutReview.locked === loadoutReview.total,
      blockedNextLabel: "Secure all 3 systems first",
      visual: {
        tone: loadoutReview.locked === loadoutReview.total ? "good" : "neutral",
        title: loadoutReview.locked === loadoutReview.total ? "Loadout armed" : "Build the loadout",
        detail: "The final answer needs content, language, and question strategy.",
        character: loadoutReview.locked === loadoutReview.total ? EST_LAB_ASSETS.guide.thumbsUp : EST_LAB_ASSETS.guide.pointing,
        effect: EST_LAB_ASSETS.answerLoadoutTray,
        badge: loadoutReview.locked === loadoutReview.total ? EST_LAB_ASSETS.feedbackMarkSecured : ""
      },
      html: `
        <div class="boss-page-split boss-page-loadout">
          <article class="boss-question-terminal boss-question-terminal--paged">
            <span class="kicker">Final prompt</span>
            <h3>${escapeHtml(round.question)}</h3>
            <p>${escapeHtml(round.help)}</p>
          </article>
          ${renderBossLoadoutTray(round)}
        </div>
        <section class="boss-armory-grid boss-armory-grid--paged">
          ${loadoutItems.map(renderBossChoiceRack).join("")}
        </section>
        ${renderBossLoadoutFeedback(round)}
      `
    },
    {
      id: "calibration",
      label: "Samples",
      eyebrow: "Page 2 / Sample check",
      title: "Spot which answer earns more.",
      detail: "Compare two responses before writing so quality is visible.",
      status: showdown.selectedSample ? showdown.isCorrect ? "strong sample spotted" : "try again" : "choose a sample",
      isComplete: showdown.isCorrect,
      blockedNextLabel: showdown.selectedSample ? "Choose the stronger sample first" : "Choose a sample first",
      visual: {
        tone: showdown.selectedSample ? showdown.isCorrect ? "good" : "warn" : "neutral",
        title: showdown.selectedSample ? showdown.isCorrect ? "Strong sample spotted" : "Try that choice again" : "Compare like an examiner",
        detail: "Look for specific examples, structure, glossary control, and a clear link back to the question.",
        character: showdown.selectedSample ? showdown.isCorrect ? EST_LAB_ASSETS.guide.thumbsUp : EST_LAB_ASSETS.guide.thinking : EST_LAB_ASSETS.guide.thinking,
        effect: showdown.selectedSample ? showdown.isCorrect ? EST_LAB_ASSETS.feedbackMarkSecured : EST_LAB_ASSETS.misreadWarning : EST_LAB_ASSETS.feedbackUpgradeAnswer
      },
      html: renderBossShowdownGate(round, showdownPair)
    },
    {
      id: "forge",
      label: "Forge",
      eyebrow: "Page 3 / Build response",
      title: "Assemble the answer.",
      detail: "Use the scaffold, then turn it into one final response.",
      status: response ? `${response.split(/\s+/).filter(Boolean).length} words drafted` : `${scaffold.completed}/${Math.max(1, scaffold.total)} scaffold blocks`,
      isComplete: Boolean(response) || scaffold.completed >= Math.max(1, scaffold.total),
      blockedNextLabel: "Add an answer part first",
      visual: {
        tone: response ? "good" : scaffold.completed ? "neutral" : "neutral",
        title: response ? "Draft forged" : "Response forge",
        detail: "The strongest answer should prove the loadout, not just mention it.",
        character: response ? EST_LAB_ASSETS.guide.thumbsUp : EST_LAB_ASSETS.guide.pointing,
        effect: EST_LAB_ASSETS.finalResponseUplink
      },
      html: `
        <section class="boss-response-zone boss-response-zone--paged">
          <div class="boss-response-main">
            ${renderBossResponseBuilder(round)}
            <div class="written-stage boss-final-response">
              <strong>Final paragraph</strong>
              <p class="small-copy">Your answer parts join here. Polish the wording before you bank the response.</p>
              ${renderFreeTextPrivacyNotice()}
              <textarea id="boss-response" placeholder="The scaffold will build here. Polish the paragraph before banking it." oninput="window.ESTPrep.setBossText(this.value)">${escapeHtml(state.answers.bossText || "")}</textarea>
            </div>
          </div>
          <aside class="boss-forge-sidecar">
            <img src="${escapeHtml(EST_LAB_ASSETS.finalResponseUplink)}" alt="" aria-hidden="true">
            <strong>Forge target</strong>
            <p>Turn the scaffold into a response that names the point, explains it, and links back to the question.</p>
          </aside>
        </section>
      `
    },
    {
      id: "scanner",
      label: "Scan",
      eyebrow: "Page 4 / Final scan",
      title: "Scan, route impact, submit.",
      detail: "Check the answer systems, choose the community route, then bank the BOSS response.",
      status: `${scanner.fill}% ready`,
      isComplete: scanner.fill >= 70,
      visual: {
        tone: scanner.fill >= 70 ? "good" : "neutral",
        title: scanner.fill >= 70 ? "Scanner ready" : "Final systems check",
        detail: "The scanner looks for the loadout, scaffold, and enough written evidence.",
        character: scanner.fill >= 70 ? EST_LAB_ASSETS.guide.celebration : EST_LAB_ASSETS.guide.thinkingBottom,
        effect: scanner.fill >= 70 ? EST_LAB_ASSETS.completionRewardBurst : EST_LAB_ASSETS.markerScanner,
        badge: scanner.fill >= 70 ? EST_LAB_ASSETS.feedbackMarkSecured : ""
      },
      html: `
        <section class="boss-final-page-grid boss-final-page-grid--scan">
          ${renderBossMarkerScanner(round)}
          ${renderBossDraftPreview(round)}
        </section>
        <section class="boss-community-uplink boss-community-uplink--paged">
          <div class="boss-uplink-art" aria-hidden="true">
            <img src="${escapeHtml(EST_LAB_ASSETS.finalResponseUplink)}" alt="">
          </div>
          <div class="boss-community-panel">
            <span class="kicker">Class impact route</span>
            <strong>Community contribution</strong>
            <p>Choose where a share of this round's reward should go.</p>
            <div class="choice-grid">${communityOptions}</div>
          </div>
          <button class="submit-button boss-submit-button" type="button" onclick="window.ESTPrep.submitBoss()">Bank BOSS response</button>
        </section>
      `
    }
  ];
}

function renderBossPageRail(pages, pageIndex) {
  return `
    <nav class="boss-page-rail" aria-label="BOSS round pages">
      ${pages.map((page, index) => `
        <button
          type="button"
          class="boss-page-tab ${index === pageIndex ? "active" : ""} ${page.isComplete ? "complete" : ""}"
          onclick="window.ESTPrep.setBossPage(${index})"
          aria-current="${index === pageIndex ? "step" : "false"}"
        >
          <span>${index + 1}</span>
          <strong>${escapeHtml(page.label)}</strong>
          <small>${escapeHtml(page.status)}</small>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderBossPageNav(pages, pageIndex) {
  const prevDisabled = pageIndex <= 0 ? "disabled" : "";
  const page = pages[pageIndex];
  const nextBlocked = pageIndex < pages.length - 1 && !page.isComplete;
  const nextDisabled = pageIndex >= pages.length - 1 || nextBlocked ? "disabled" : "";
  const prevLabel = pageIndex > 0 ? `Previous: ${pages[pageIndex - 1].label}` : "Previous page";
  const nextLabel = pageIndex < pages.length - 1
    ? nextBlocked
      ? page.blockedNextLabel || "Finish this page first"
      : `Next page: ${pages[pageIndex + 1].label}`
    : "Use Bank BOSS response below";
  return `
    <footer class="boss-page-nav">
      <button class="submit-button ghost boss-page-back-button" type="button" onclick="window.ESTPrep.moveBossPage(-1)" ${prevDisabled}>${escapeHtml(prevLabel)}</button>
      <span>Page ${pageIndex + 1} of ${pages.length}</span>
      <button class="submit-button boss-page-next-button" type="button" onclick="window.ESTPrep.moveBossPage(1)" ${nextDisabled}>${escapeHtml(nextLabel)}</button>
    </footer>
  `;
}

function renderBossPageShell(pages, pageIndex) {
  const page = pages[pageIndex];
  return `
    <section class="boss-page-shell boss-page-shell--${escapeHtml(page.id)}" aria-live="polite">
      <div class="boss-page-head">
        <div>
          <span class="kicker">${escapeHtml(page.eyebrow)}</span>
          <h3>${escapeHtml(page.title)}</h3>
          <p>${escapeHtml(page.detail)}</p>
        </div>
        ${renderBossPageVisual(page.visual)}
      </div>
      <div class="boss-page-body">
        ${page.html}
      </div>
    </section>
  `;
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
  const loadoutItems = getBossLoadoutItems(round);
  const communityOptions = (state.stageDeck?.communityOptions || []).map(option => `
    <button type="button" class="choice-button ${state.answers.bossVote === option.id ? "selected live-selected" : ""}" data-group="boss-vote" data-value="${option.id}" onclick="window.ESTPrep.setBossVote('${option.id}')">
      <strong>${escapeHtml(option.label)}</strong>
      <small>Bank 10% reward here.</small>
    </button>
  `).join("");
  const bossPages = getBossPageDefinitions(round, loadoutItems, showdownPair, communityOptions);
  const bossPageIndex = getBossPageIndex(bossPages.length);
  const activeBossPage = bossPages[bossPageIndex];
  renderStageRoot(`
    <section class="boss-sim-shell">
      <img class="boss-sim-bg" src="${escapeHtml(EST_LAB_ASSETS.bossBackground)}" alt="">
      <div class="boss-sim-overlay">
        <header class="boss-sim-hud">
          <div class="boss-hud-question">
            <span class="kicker">BOSS / Final Exam Simulation</span>
            <h2>${renderBossHighlightedQuestion(round)}</h2>
            <p>${escapeHtml(round.help || "Use the coloured question clues to build the final answer.")}</p>
          </div>
          <div class="boss-tag-row">
            ${round.conceptTags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </header>
        ${renderBossQuestionMap(round, activeBossPage.id)}
        ${renderBossPageRail(bossPages, bossPageIndex)}
        ${renderBossPageShell(bossPages, bossPageIndex)}
        ${renderBossPageNav(bossPages, bossPageIndex)}
      </div>
    </section>
  `);
}

function setChoice(groupKey, option) {
  if (getDecoderPartFromAnswerKey(groupKey)) {
    setDecoderChoice(groupKey, option);
    return;
  }
  state.answers[groupKey] = option;
  updateSelectionButtons(groupKey, option);
  if (BOSS_LOADOUT_KEYS[groupKey]) {
    setBossSelectionPulse(groupKey, option);
    persistESTProgressSnapshot();
    renderBossStage();
    setTimeout(() => {
      const rack = document.getElementById(`boss-rack-${groupKey}`);
      if (rack) rack.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
    return;
  } else if (groupKey === "bossShowdown") {
    const showdown = getBossShowdownResult(getBossShowdownPair(state.stageDeck?.bossRound));
    state.recentReward = {
      type: showdown.isCorrect ? "positive" : "warning",
      title: showdown.isCorrect ? "Strong sample spotted" : "Try that sample again",
      detail: showdown.isCorrect
        ? "That sample has enough detail for the question. Move into the response forge."
        : "Look for the response with more specific evidence and a clearer link to the question."
    };
    persistESTProgressSnapshot();
    renderBossStage();
    renderRewardPulse();
    return;
  } else {
    setSelectionPulse(groupKey, option);
  }
  persistESTProgressSnapshot();
}

function setChoiceEncoded(groupKey, encodedOption) {
  setChoice(groupKey, decodeURIComponent(encodedOption));
}

function setBossScaffold(index, value) {
  state.answers[`boss-scaffold-${index}`] = value;
  syncBossDraftFromScaffold(state.stageDeck?.bossRound);
  persistESTProgressSnapshot();
}

function setBossShowdownReason(value) {
  state.answers.bossShowdownReason = value;
  persistESTProgressSnapshot();
}

function buildBossDraft() {
  const round = state.stageDeck?.bossRound;
  if (!round) return;
  syncBossDraftFromScaffold(round, { force: true });
  state.recentReward = {
    type: "positive",
    title: "Paragraph refreshed",
    detail: "Your scaffold blocks are now joined in the final response box."
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

function showDecoderFinalFeedback(progress, finalScoreRatio, previousBestRatio, bestUpdated) {
  const scorePercent = Math.round(finalScoreRatio * 100);
  const resultType = finalScoreRatio >= 0.75 ? "good" : finalScoreRatio >= 0.5 ? "warn" : "bad";
  const bestLine = bestUpdated
    ? `Best decoder result is now ${Math.round(state.stageBestScores.decoder * 100)}%.`
    : `Best decoder result remains ${Math.round(previousBestRatio * 100)}%. This replay was saved but did not overwrite your best run.`;
  setStageScene(finalScoreRatio >= 0.75 ? "restored" : "challenge");
  renderStageRoot(`
    <section class="decoder-lab-shell decoder-lab-shell--complete">
      <img class="decoder-lab-bg" src="${escapeHtml(EST_LAB_ASSETS.decoderBackground)}" alt="">
      <div class="decoder-lab-overlay decoder-complete-overlay">
        <article class="decoder-complete-panel ${resultType}">
          <img class="decoder-complete-badge" src="${escapeHtml(EST_LAB_ASSETS.caseBriefComplete)}" alt="" aria-hidden="true">
          <div>
            <span class="kicker">VTCS case banked</span>
            <h2>Question forensics complete.</h2>
            <p><strong>${progress.correct}/${progress.totalParts}</strong> VTCS clues secured across ${progress.total} questions.</p>
            <p>${bestLine}</p>
            <p>You banked marks and readiness by reading each question properly before writing.</p>
          </div>
          <button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button>
        </article>
      </div>
    </section>
  `);
}

function getBossScaffoldReviewParts(round) {
  return getBossScaffoldParts(round)
    .map((part, index) => ({
      label: part.label,
      response: cleanBossDraftSegment(state.answers[`boss-scaffold-${index}`])
    }))
    .filter(part => part.response);
}

function showBossCompletionFeedback(round, review, strengths, nextSteps, rubric) {
  const resultType = review.scorePercent >= 85 ? "good" : review.scorePercent >= 60 ? "warn" : "bad";
  const stampAsset = resultType === "good"
    ? EST_LAB_ASSETS.feedbackMarkSecured
    : resultType === "warn"
      ? EST_LAB_ASSETS.feedbackUpgradeAnswer
      : EST_LAB_ASSETS.feedbackMissingEvidence;
  setStageScene(resultType === "good" ? "success" : "challenge");
  renderStageRoot(`
    <section class="boss-sim-shell boss-sim-shell--complete">
      <img class="boss-sim-bg" src="${escapeHtml(EST_LAB_ASSETS.bossBackground)}" alt="">
      <div class="boss-sim-overlay boss-complete-overlay">
        <img class="boss-complete-burst" src="${escapeHtml(EST_LAB_ASSETS.completionRewardBurst)}" alt="" aria-hidden="true">
        <article class="boss-completion-panel ${resultType}">
          <div class="boss-completion-head">
            <div>
              <span class="kicker">BOSS submitted</span>
              <h2>${review.scorePercent}% • ${escapeHtml(review.band)} band</h2>
              <p>Word count: ${review.wordCount}. ${escapeHtml(round.reviewSummary || "BOSS checked decoding, glossary control, answer structure, explanation, and result language.")}</p>
            </div>
            <img src="${escapeHtml(stampAsset)}" alt="" aria-hidden="true">
          </div>
          <div class="boss-completion-grid">
            <section>
              <h3>Your strengths</h3>
              ${strengths}
            </section>
            <section>
              <h3>Next steps</h3>
              ${nextSteps}
            </section>
          </div>
          <section class="boss-completion-model">
            <h3>Strong sample answer</h3>
            <p>${escapeHtml(round.strongAnswer)}</p>
          </section>
          <section>
            <h3>Scanner snapshot</h3>
            ${rubric}
          </section>
          ${renderBossSamples(round)}
          <button class="submit-button" type="button" onclick="window.ESTPrep.returnToTrack()">Back to EST Lab Track</button>
        </article>
      </div>
    </section>
  `);
}

async function submitDecoder() {
  const rounds = getDecoderRounds();
  const roundIndex = getDecoderRoundIndex();
  const round = rounds[roundIndex];
  if (!round) return;
  const briefState = getDecoderBriefState(round, roundIndex);
  if (!briefState.isComplete) {
    const targetItem = briefState.parts.find(item => item.isMisread) || briefState.parts.find(item => !item.isCorrect);
    if (targetItem) state.decoderActivePart = targetItem.part.id;
    state.decoderPulse = {
      type: "warn",
      title: "Not ready to bank",
      detail: targetItem
        ? targetItem.isMisread
          ? getDecoderHint(targetItem.part, round)
          : `Restore the ${targetItem.part.label} clue first. ${targetItem.part.mission}`
        : "Restore all four VTCS clues before banking this question."
    };
    state.recentReward = {
      type: "warning",
      title: "Finish the repair",
      detail: "The bank button unlocks after Verb, Topic, Context, and Structure are all correct."
    };
    persistESTProgressSnapshot();
    renderDecoderStage();
    renderRewardPulse();
    return;
  }
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
    state.decoderActivePart = DECODER_PARTS[0].id;
    state.decoderPulse = {
      type: "good",
      title: "Brief banked",
      detail: `Question ${roundIndex + 2} is online. Start with the command verb, then repair each clue lock.`
    };
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
  showDecoderFinalFeedback(progress, finalScoreRatio, previousBestRatio, improvedBest || firstDecoderClear);
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

  showBossCompletionFeedback(round, review, strengths, nextSteps, rubric);
}
