const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const PLAYER_SESSION_KEY = "career-empire-session";
const MODULE_ID = "archon-careers";
const MODULE_STORAGE_KEY = "career-empire-archon-careers-progress-v1";
const COMMUNITY_TAX_RATE = 0.1;

const QUESTION_BANK = [
  {
    id: "megatrends-career-planning",
    title: "Megatrends and Career Planning",
    prompt: "Describe the concept of megatrends in the context of career planning.",
    criteria: ["define megatrends", "long-term change", "career planning", "jobs or industries", "example"],
    keywords: ["megatrends", "long-term", "future", "work", "jobs", "industries", "planning", "technology", "climate", "demographic", "economic", "opportunities"],
    opponentResponse: "Megatrends are large, long-term changes that shape society, workplaces, and the labour market. In career planning, they matter because they help people think beyond one job and notice which industries may grow, change, or decline. For example, technology and climate change can create new work while also changing the skills employers expect."
  },
  {
    id: "labour-market-information",
    title: "Labour Market Evidence",
    prompt: "Explain how labour market information can support better career decisions.",
    criteria: ["define LMI", "uses evidence", "training decisions", "job demand", "career choice"],
    keywords: ["labour", "market", "information", "evidence", "demand", "skills", "training", "jobs", "wages", "industries", "decisions", "pathway"],
    opponentResponse: "Labour market information is evidence about jobs, industries, wages, demand, and skills. It supports career decisions because a person can compare pathways using facts rather than guesses. If an industry is growing and needs particular skills, a student can choose training, subjects, or experience that better matches future opportunities."
  },
  {
    id: "transferable-skills",
    title: "Transferable Skills",
    prompt: "Why are transferable skills important when workplaces and career pathways change?",
    criteria: ["define transferable skills", "changing work", "examples", "adaptability", "employer value"],
    keywords: ["transferable", "skills", "communication", "teamwork", "problem-solving", "adapt", "change", "employers", "pathways", "workplaces", "career"],
    opponentResponse: "Transferable skills are skills that can be used across different jobs and workplaces. They are important because career pathways can change when technology, industries, or personal goals change. Skills such as communication, teamwork, problem-solving, and time management help a person adapt and still show value to employers."
  },
  {
    id: "career-resilience",
    title: "Career Resilience",
    prompt: "Explain the role of resilience in managing career setbacks.",
    criteria: ["define resilience", "setback response", "learning", "plan B", "future action"],
    keywords: ["resilience", "setback", "adapt", "recover", "learn", "plan", "support", "pathway", "goal", "training", "feedback"],
    opponentResponse: "Resilience helps a person recover and keep moving when a career plan does not work straight away. A setback, such as missing out on a job or course, can become a reason to seek feedback, build skills, try a Plan B, and apply again with stronger evidence. This keeps the long-term goal alive."
  },
  {
    id: "initiative-workplace",
    title: "Initiative at Work",
    prompt: "Describe how initiative can improve employability in a workplace.",
    criteria: ["define initiative", "proactive action", "workplace benefit", "team effect", "example"],
    keywords: ["initiative", "proactive", "workplace", "employability", "responsibility", "team", "improve", "help", "opportunity", "skills", "employer"],
    opponentResponse: "Initiative means taking useful action without always waiting to be told. It improves employability because employers value people who notice problems, help others, suggest improvements, and take responsibility. For example, a worker who safely restocks supplies or helps a team member shows reliability and contributes to the workplace."
  }
];

const OCCUPATION_PIECES = [
  { key: "electrician", type: "leader", name: "Electrician", icon: "EL", image: "assets/occupations/electrician.png" },
  { key: "carpenter", type: "diagonal", name: "Carpenter", icon: "CP", image: "assets/occupations/carpenter.png" },
  { key: "nurse", type: "orthogonal", name: "Nurse", icon: "NS", image: "assets/occupations/nurse.png" },
  { key: "software-developer", type: "forward", name: "Software Developer", icon: "SD", image: "assets/occupations/software-developer.png" },
  { key: "renewable-energy-technician", type: "leader", name: "Renewable Energy Technician", icon: "RE", image: "assets/occupations/renewable-energy-technician.png" },
  { key: "early-childhood-educator", type: "forward", name: "Early Childhood Educator", icon: "EC", image: "assets/occupations/early-childhood-educator.png" }
];

const PIECE_LIBRARY = {
  player: OCCUPATION_PIECES.map(piece => ({ ...piece, id: `p-${piece.key}` })),
  ai: OCCUPATION_PIECES.map(piece => ({ ...piece, id: `a-${piece.key}` }))
};

const LEGACY_PIECE_INDEX = {
  "p-architect": 0,
  "p-analyst": 1,
  "p-networker": 2,
  "p-navigator": 3,
  "p-coach": 4,
  "p-apprentice": 5,
  "a-gate": 0,
  "a-drift": 1,
  "a-noise": 2,
  "a-short": 3,
  "a-gap": 4,
  "a-automation": 5
};

const SQUARE_EFFECTS = [
  {
    id: "technological-megatrend",
    label: "Technological Megatrend",
    short: "AI",
    summary: "AI reshaped the job. The side that created this tile can enter it later; the opposing side cannot.",
    rule: "side-lock",
    image: "assets/tiles/technological-megatrend.png"
  },
  {
    id: "adaptability",
    label: "Adaptability",
    short: "AD",
    summary: "Landing here restores one destroyed allied occupation to its starting square if that square is open.",
    rule: "restore",
    image: "assets/tiles/adaptability.png"
  },
  {
    id: "career-network",
    label: "Career Network",
    short: "CN",
    summary: "A piece starting here can move to any other changed career tile on its next move.",
    rule: "network",
    image: "assets/tiles/career-network.png"
  }
];

let state = loadState();
let pendingResolution = null;
let aiTimer = null;

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getAuthState() {
  return readJsonStorage(AUTH_DEMO_STATE_KEY, {});
}

function getSession() {
  return readJsonStorage(PLAYER_SESSION_KEY, {});
}

function getStudentLabel() {
  const auth = getAuthState();
  const session = getSession();
  return auth?.studentLogin?.displayName
    || auth?.studentLogin?.username
    || session?.playerName
    || session?.username
    || "Local learner";
}

function createPiece(side, index, row, col) {
  return {
    ...PIECE_LIBRARY[side][index],
    side,
    hasMoved: false,
    originRow: row,
    originCol: col
  };
}

function createInitialBoard() {
  const board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
  const playerCols = [1, 2, 3, 4, 5, 6];
  const aiCols = [1, 2, 3, 4, 5, 6];
  playerCols.forEach((col, index) => {
    const row = index === 0 ? 7 : 6;
    board[row][col] = createPiece("player", index, row, col);
  });
  aiCols.forEach((col, index) => {
    const row = index === 0 ? 0 : 1;
    board[row][col] = createPiece("ai", index, row, col);
  });
  return board;
}

function getOriginLookup() {
  const lookup = {};
  createInitialBoard().forEach(row => {
    row.forEach(piece => {
      if (piece?.id) {
        lookup[piece.id] = {
          row: piece.originRow,
          col: piece.originCol
        };
      }
    });
  });
  return lookup;
}

function ensureBoardPieceOrigins(board) {
  const originLookup = getOriginLookup();
  if (!Array.isArray(board)) return board;
  board.forEach(row => {
    if (!Array.isArray(row)) return;
    row.forEach(piece => {
      const origin = piece?.id ? originLookup[piece.id] : null;
      if (piece && origin && (typeof piece.originRow !== "number" || typeof piece.originCol !== "number")) {
        piece.originRow = origin.row;
        piece.originCol = origin.col;
      }
    });
  });
  return board;
}

function modernisePiece(piece) {
  if (!piece || typeof piece !== "object" || !piece.side) return piece;
  const index = Object.prototype.hasOwnProperty.call(LEGACY_PIECE_INDEX, piece.id)
    ? LEGACY_PIECE_INDEX[piece.id]
    : PIECE_LIBRARY[piece.side]?.findIndex(item => item.id === piece.id);
  const definition = PIECE_LIBRARY[piece.side]?.[index];
  if (!definition) return piece;
  return {
    ...piece,
    ...definition,
    side: piece.side,
    hasMoved: Boolean(piece.hasMoved),
    originRow: typeof piece.originRow === "number" ? piece.originRow : undefined,
    originCol: typeof piece.originCol === "number" ? piece.originCol : undefined
  };
}

function moderniseStoredPieces(gameState) {
  if (Array.isArray(gameState.board)) {
    gameState.board = gameState.board.map(row => (
      Array.isArray(row) ? row.map(piece => modernisePiece(piece)) : row
    ));
  }
  ["player", "ai"].forEach(side => {
    if (!Array.isArray(gameState.captures?.[side])) return;
    gameState.captures[side] = gameState.captures[side].map(piece => modernisePiece(piece));
  });
  return gameState;
}

function createInitialState() {
  return {
    board: createInitialBoard(),
    selected: null,
    validMoves: [],
    currentTurn: "player",
    mode: "board",
    turnNumber: 1,
    lastMessage: "Your career team has the first move.",
    pendingClash: null,
    clashes: [],
    evidenceLog: [],
    squareStates: {},
    captures: { player: [], ai: [] },
    scores: { player: 0, ai: 0 },
    bestScore: 0,
    salaryEarned: 0,
    savedSnapshots: 0,
    winner: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function loadState() {
  const stored = readJsonStorage(MODULE_STORAGE_KEY, null);
  if (!stored || !Array.isArray(stored.board)) return createInitialState();
  const nextState = {
    ...createInitialState(),
    ...stored,
    squareStates: stored.squareStates || {},
    captures: {
      player: Array.isArray(stored.captures?.player) ? stored.captures.player : [],
      ai: Array.isArray(stored.captures?.ai) ? stored.captures.ai : []
    },
    selected: null,
    validMoves: [],
    pendingClash: null,
    mode: stored.winner ? "complete" : "board"
  };
  moderniseStoredPieces(nextState);
  ensureBoardPieceOrigins(nextState.board);
  return nextState;
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  writeJsonStorage(MODULE_STORAGE_KEY, state);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coord(row, col) {
  return `${String.fromCharCode(65 + col)}${8 - row}`;
}

function squareKey(row, col) {
  return `${row}-${col}`;
}

function getSquareState(row, col) {
  return state.squareStates?.[squareKey(row, col)] || null;
}

function getSquareEffect(effectId) {
  const legacyMap = {
    "evidence-grid": "career-network",
    "labour-market-info": "career-network",
    "pathway-plan": "adaptability",
    "future-signal": "career-network",
    "pressure-zone": "technological-megatrend"
  };
  const id = legacyMap[effectId] || effectId;
  return SQUARE_EFFECTS.find(effect => effect.id === id) || null;
}

function clampScore(value) {
  return Math.max(5, Math.min(100, Math.round(Number(value || 0))));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function chooseRandomQuestion() {
  const recentIds = state.clashes.slice(-2).map(clash => clash.promptId);
  const candidates = QUESTION_BANK.filter(question => !recentIds.includes(question.id));
  const deck = candidates.length ? candidates : QUESTION_BANK;
  return deck[Math.floor(Math.random() * deck.length)];
}

function chooseRandomSquareEffect() {
  return SQUARE_EFFECTS[Math.floor(Math.random() * SQUARE_EFFECTS.length)];
}

function isSquareEnterable(row, col, side) {
  const squareState = getSquareState(row, col);
  const effect = squareState ? getSquareEffect(squareState.effectId) : null;
  if (effect?.rule !== "side-lock") return true;
  return squareState.side === side;
}

function getSquareRuleSummary(row, col) {
  const squareState = getSquareState(row, col);
  const effect = squareState ? getSquareEffect(squareState.effectId) : null;
  if (!squareState || !effect) return "";
  return `${coord(row, col)} is ${effect.label}: ${effect.summary}`;
}

function getCapturePool(side) {
  if (!state.captures) state.captures = { player: [], ai: [] };
  if (!Array.isArray(state.captures[side])) state.captures[side] = [];
  return state.captures[side];
}

function recordCapturedPiece(piece) {
  if (!piece?.side) return;
  getCapturePool(piece.side).push({
    ...piece,
    hasMoved: false
  });
}

function reviveCapturedPiece(side) {
  const pool = getCapturePool(side);
  for (let index = pool.length - 1; index >= 0; index -= 1) {
    const piece = pool[index];
    if (!piece || typeof piece !== "object") continue;
    if (!isInside(piece.originRow, piece.originCol)) continue;
    if (getPiece(piece.originRow, piece.originCol)) continue;
    if (!isSquareEnterable(piece.originRow, piece.originCol, side)) continue;
    pool.splice(index, 1);
    state.board[piece.originRow][piece.originCol] = {
      ...piece,
      hasMoved: true
    };
    return {
      piece: state.board[piece.originRow][piece.originCol],
      row: piece.originRow,
      col: piece.originCol
    };
  }
  return null;
}

function applyLandingEffect(piece, row, col) {
  const squareState = getSquareState(row, col);
  const effect = squareState ? getSquareEffect(squareState.effectId) : null;
  if (!piece || !effect) return "";
  if (effect.rule !== "restore") return "";

  const restored = reviveCapturedPiece(piece.side);
  if (!restored) {
    return `${effect.label} finds no destroyed ${getSideLabel(piece.side).toLowerCase()} piece that can be restored right now.`;
  }

  return `${effect.label} restores ${restored.piece.name} at ${coord(restored.row, restored.col)}.`;
}

function isInside(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getPiece(row, col) {
  return isInside(row, col) ? state.board[row][col] : null;
}

function getVectors(piece) {
  const forward = piece.side === "player" ? -1 : 1;
  if (piece.type === "diagonal") return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  if (piece.type === "orthogonal") return [[-1, 0], [1, 0], [0, -1], [0, 1]];
  if (piece.type === "forward") return [[forward, 0], [forward, -1], [forward, 1]];
  return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
}

function buildMove(piece, fromRow, fromCol, toRow, toCol, options = {}) {
  const target = getPiece(toRow, toCol);
  const dc = toCol - fromCol;
  if (!piece || !isInside(toRow, toCol)) return null;
  if (!isSquareEnterable(toRow, toCol, piece.side)) return null;
  if (target?.side === piece.side) return null;
  if (!options.ignoreForwardRules && piece.type === "forward" && dc === 0 && target) return null;
  if (!options.ignoreForwardRules && piece.type === "forward" && dc !== 0 && !target) return null;
  return {
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece,
    target,
    isCapture: Boolean(target)
  };
}

function dedupeMoves(moves) {
  const seen = new Set();
  return moves.filter(move => {
    if (!move) return false;
    const key = `${move.toRow}-${move.toCol}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getCareerNetworkMoves(piece, row, col) {
  const squareState = getSquareState(row, col);
  const effect = squareState ? getSquareEffect(squareState.effectId) : null;
  if (effect?.rule !== "network") return [];

  return Object.keys(state.squareStates || {}).map(key => {
    const [toRow, toCol] = key.split("-").map(Number);
    if (toRow === row && toCol === col) return null;
    return buildMove(piece, row, col, toRow, toCol, { ignoreForwardRules: true });
  }).filter(Boolean);
}

function getValidMoves(row, col) {
  const piece = getPiece(row, col);
  if (!piece) return [];
  const baseMoves = getVectors(piece).map(([dr, dc]) => buildMove(piece, row, col, row + dr, col + dc));
  return dedupeMoves([...baseMoves, ...getCareerNetworkMoves(piece, row, col)]);
}

function getAllMoves(side) {
  const moves = [];
  state.board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      if (piece?.side === side) moves.push(...getValidMoves(rowIndex, colIndex));
    });
  });
  return moves;
}

function isSelected(row, col) {
  return state.selected?.row === row && state.selected?.col === col;
}

function getMoveForCell(row, col) {
  return state.validMoves.find(move => move.toRow === row && move.toCol === col) || null;
}

function renderBoard() {
  const board = document.getElementById("game-board");
  if (!board) return;
  board.innerHTML = state.board.map((row, rowIndex) => row.map((piece, colIndex) => {
    const move = getMoveForCell(rowIndex, colIndex);
    const squareState = getSquareState(rowIndex, colIndex);
    const squareEffect = squareState ? getSquareEffect(squareState.effectId) : null;
    const squareStyle = squareEffect?.image ? ` style="--square-art: url('${escapeHtml(squareEffect.image)}')"` : "";
    const classes = [
      "board-cell",
      squareState ? "board-cell--claimed" : "",
      squareState?.side === "player" ? "board-cell--claimed-player" : "",
      squareState?.side === "ai" ? "board-cell--claimed-ai" : "",
      squareEffect ? `board-cell--effect-${squareEffect.id}` : "",
      squareEffect?.rule === "side-lock" ? "board-cell--blocked" : "",
      isSelected(rowIndex, colIndex) ? "is-selected" : "",
      move ? "is-valid" : "",
      move?.isCapture ? "is-capture" : "",
      state.mode !== "board" || state.currentTurn !== "player" ? "is-locked" : ""
    ].filter(Boolean).join(" ");
    return `
      <button class="${classes}" type="button" data-row="${rowIndex}" data-col="${colIndex}" aria-label="${coord(rowIndex, colIndex)}${piece ? ` ${piece.name}` : ""}"${squareStyle}>
        ${piece ? `
          <span class="piece piece--${piece.side}">
            <span class="piece__portrait">
              ${piece.image ? `<img class="piece__art" src="${escapeHtml(piece.image)}" alt="" loading="eager">` : ""}
              <span class="piece__icon">${escapeHtml(piece.icon)}</span>
            </span>
            <span class="piece__name">${escapeHtml(piece.name)}</span>
          </span>
        ` : ""}
        ${squareEffect ? `<span class="square-status">${escapeHtml(squareEffect.short)}</span>` : ""}
        <span class="coord-label">${coord(rowIndex, colIndex)}</span>
      </button>
    `;
  }).join("")).join("");

  board.querySelectorAll(".board-cell").forEach(cell => {
    cell.addEventListener("click", () => handleCellClick(Number(cell.dataset.row), Number(cell.dataset.col)));
  });
}

function renderSquareRules() {
  const container = document.getElementById("square-rule-list");
  if (!container) return;
  container.innerHTML = SQUARE_EFFECTS.map(effect => `
    <article class="tile-rule tile-rule--${escapeHtml(effect.id)}" style="--tile-art: url('${escapeHtml(effect.image)}')">
      <span class="tile-rule__icon">${escapeHtml(effect.short)}</span>
      <div>
        <strong>${escapeHtml(effect.label)}</strong>
        <p>${escapeHtml(effect.summary)}</p>
      </div>
    </article>
  `).join("") + '<p class="tile-rule-note">The written Careers question is still random each battle. These tiles only change board movement and recovery.</p>';
}

function renderEvidenceLog() {
  const container = document.getElementById("evidence-log");
  if (!container) return;
  if (!state.evidenceLog.length) {
    container.innerHTML = '<article class="evidence-item"><strong>No written clashes yet</strong><p>Responses will appear here after a contested square is resolved.</p></article>';
    return;
  }
  container.innerHTML = state.evidenceLog.slice(-6).reverse().map(item => `
    <article class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
    </article>
  `).join("");
}

function calculateProgress() {
  if (state.winner) return 100;
  return Math.min(95, Math.round((state.clashes.length / 5) * 100));
}

function calculateMastery() {
  if (!state.clashes.length) return 0;
  return Math.round(state.clashes.reduce((sum, clash) => sum + Number(clash.studentScore || 0), 0) / state.clashes.length);
}

function renderStatus() {
  const progress = calculateProgress();
  setText("student-context", `${getStudentLabel()} - written response battles are saved as Careers evidence.`);
  setText("turn-pill", state.winner ? `${getSideLabel(state.winner)} wins` : state.currentTurn === "player" ? "Your move" : "Opposition move");
  setText("game-state-label", state.lastMessage);
  setText("metric-clashes", String(state.clashes.length));
  setText("metric-player-wins", String(state.scores.player || 0));
  setText("metric-best-score", `${state.bestScore || 0}%`);
  setText("metric-salary-earned", formatCurrency(state.salaryEarned || 0));
  setText("metric-progress", `${progress}%`);
}

function renderAll() {
  renderBoard();
  renderSquareRules();
  renderEvidenceLog();
  renderStatus();
}

function handleCellClick(row, col) {
  if (state.mode !== "board" || state.currentTurn !== "player" || state.winner) return;
  const piece = getPiece(row, col);
  const squareRule = getSquareRuleSummary(row, col);
  if (piece?.side === "player") {
    state.selected = { row, col };
    state.validMoves = getValidMoves(row, col);
    state.lastMessage = state.validMoves.length ? `${piece.name} is ready to move.` : `${piece.name} has no legal move.`;
    renderAll();
    saveState();
    return;
  }

  if (!state.selected && squareRule) {
    state.lastMessage = squareRule;
    renderAll();
    saveState();
    return;
  }

  const move = getMoveForCell(row, col);
  if (!move) {
    state.selected = null;
    state.validMoves = [];
    state.lastMessage = squareRule || (piece ? "That square is held by the opposition." : "No move is selected.");
    renderAll();
    saveState();
    return;
  }
  executeMove(move);
}

function executeMove(move) {
  const livePiece = state.board[move.fromRow]?.[move.fromCol] || null;
  const liveTarget = state.board[move.toRow]?.[move.toCol] || null;

  if (!livePiece) {
    state.lastMessage = "That move is no longer available. Choose another occupation.";
    renderAll();
    saveState();
    return;
  }

  state.selected = null;
  state.validMoves = [];
  if (liveTarget && liveTarget.side !== livePiece.side) {
    beginClash({
      ...move,
      piece: livePiece,
      target: liveTarget,
      isCapture: true
    });
    return;
  }

  const quietMove = {
    ...move,
    piece: livePiece,
    target: null,
    isCapture: false
  };
  const consequence = commitQuietMove(quietMove);
  const message = `${livePiece.name} moves to ${coord(move.toRow, move.toCol)}.${consequence ? ` ${consequence}` : ""}`;
  if (livePiece.side === "player") finishPlayerTurn(message);
  else finishAiTurn(message);
}

function commitQuietMove(move) {
  const piece = state.board[move.fromRow][move.fromCol];
  state.board[move.toRow][move.toCol] = piece;
  state.board[move.fromRow][move.fromCol] = null;
  if (piece) piece.hasMoved = true;
  return applyLandingEffect(piece, move.toRow, move.toCol);
}

function beginClash(move) {
  const attacker = state.board[move.fromRow][move.fromCol];
  const defender = state.board[move.toRow][move.toCol];
  if (!attacker || !defender || attacker.side === defender.side) {
    state.mode = "board";
    state.lastMessage = "No contested square there. Choose a move that lands on an opposing occupation to trigger a written battle.";
    renderAll();
    saveState();
    return;
  }

  const question = chooseRandomQuestion();
  state.mode = "clash";
  state.pendingClash = {
    id: `clash-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    move,
    question,
    attackerName: attacker?.name || "Attacker",
    defenderName: defender?.name || "Defender",
    attackerSide: attacker?.side || "player",
    squareLabel: coord(move.toRow, move.toCol),
    opponentResponse: question.opponentResponse
  };
  state.lastMessage = `${state.pendingClash.squareLabel} is contested. A written response will decide the square.`;
  renderAll();
  openClashModal();
  saveState();
}

function openClashModal() {
  const pending = state.pendingClash;
  if (!pending) return;
  const modal = document.getElementById("clash-modal");
  const body = document.getElementById("clash-body");
  const comparison = document.getElementById("comparison-panel");
  const textarea = document.getElementById("student-response");
  setText("clash-kicker", pending.attackerSide === "player" ? "You landed on their square" : "They landed on your square");
  setText("clash-title", `${pending.attackerName} vs ${pending.defenderName}`);
  setText("clash-square", pending.squareLabel);
  setText("clash-prompt", pending.question.prompt);
  setText("clash-feedback", "");
  document.getElementById("clash-criteria").innerHTML = pending.question.criteria.map(item => `<span>${escapeHtml(item)}</span>`).join("");
  if (textarea) textarea.value = "";
  body?.classList.remove("is-hidden");
  comparison?.classList.add("is-hidden");
  document.getElementById("square-choice-panel")?.classList.add("is-hidden");
  modal?.classList.remove("is-hidden");
  setTimeout(() => textarea?.focus(), 50);
}

function closeClashModal() {
  document.getElementById("clash-modal")?.classList.add("is-hidden");
}

function normalise(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(value) {
  return normalise(value).split(/\s+/).filter(Boolean).length;
}

function countKeywordHits(text, keywords) {
  const lower = normalise(text);
  return keywords.filter(keyword => lower.includes(normalise(keyword))).length;
}

function scoreResponse(response, question) {
  const words = wordCount(response);
  const keywordHits = countKeywordHits(response, question.keywords);
  const lower = normalise(response);
  const hasExplanation = /\b(because|this means|therefore|as a result|so that|which means)\b/i.test(response);
  const hasExample = /\b(for example|such as|e\.g\.|including|in a workplace|an industry|a student|a worker)\b/i.test(response);
  const hasCareerLink = /\b(career|pathway|planning|job|work|employer|industry|training|skills)\b/i.test(response);
  const hasDefinition = question.keywords.slice(0, 3).some(keyword => lower.includes(normalise(keyword)));
  let score = 18;
  score += Math.min(22, words * 0.75);
  score += Math.min(24, keywordHits * 4);
  score += hasDefinition ? 10 : 0;
  score += hasExplanation ? 10 : 0;
  score += hasExample ? 8 : 0;
  score += hasCareerLink ? 8 : 0;
  if (words < 24) score -= 12;
  if (words > 110) score -= 4;
  return {
    score: Math.max(5, Math.min(100, Math.round(score))),
    words,
    keywordHits,
    notes: [
      hasDefinition ? "defines the concept" : "needs a clearer definition",
      hasExplanation ? "explains why it matters" : "needs a stronger because/impact link",
      hasExample ? "uses an example" : "could add an example",
      hasCareerLink ? "connects to careers" : "needs a clearer career planning link"
    ]
  };
}

function submitResponse() {
  const pending = state.pendingClash;
  const textarea = document.getElementById("student-response");
  const response = textarea?.value || "";
  if (!pending) return;
  if (wordCount(response) < 22) {
    setText("clash-feedback", "Add more detail before submitting. Aim for a definition, an explanation, and a careers example.");
    return;
  }
  const student = scoreResponse(response, pending.question);
  const opponent = scoreResponse(pending.opponentResponse, pending.question);
  const studentScore = clampScore(student.score);
  const opponentScore = clampScore(Math.max(55, Math.min(82, opponent.score - 8)));
  const playerWins = studentScore >= opponentScore;
  pendingResolution = {
    pending,
    response,
    studentScore,
    opponentScore,
    notes: student.notes,
    squareEffect: playerWins ? null : chooseRandomSquareEffect(),
    winnerSide: playerWins ? "player" : "ai"
  };
  showComparison(pendingResolution);
}

function showComparison(result) {
  const continueButton = document.getElementById("continue-after-clash");
  document.getElementById("clash-body")?.classList.add("is-hidden");
  document.getElementById("comparison-panel")?.classList.remove("is-hidden");
  setText("student-score-label", `${result.studentScore}%`);
  setText("opponent-score-label", `${result.opponentScore}%`);
  setText("student-response-preview", result.response);
  setText("opponent-response-preview", result.pending.opponentResponse);
  const winner = result.winnerSide === "player" ? "Your response wins the square." : "The opposition response wins the square.";
  const aiClaimText = result.winnerSide === "ai" && result.squareEffect
    ? ` The opposition changes ${result.pending.squareLabel} to ${result.squareEffect.label}.`
    : "";
  setText("comparison-result", `${winner}${aiClaimText} ${result.notes.join(". ")}.`);
  if (result.winnerSide === "player") {
    renderSquareChoiceOptions(result.squareEffect?.id || "");
    document.getElementById("square-choice-panel")?.classList.remove("is-hidden");
    if (continueButton) continueButton.disabled = !result.squareEffect;
  } else {
    document.getElementById("square-choice-panel")?.classList.add("is-hidden");
    if (continueButton) continueButton.disabled = false;
  }
}

function renderSquareChoiceOptions(selectedId) {
  const container = document.getElementById("square-choice-options");
  if (!container) return;
  container.innerHTML = SQUARE_EFFECTS.map(effect => `
    <button class="square-choice-option square-choice-option--${escapeHtml(effect.id)} ${effect.id === selectedId ? "is-selected" : ""}" type="button" data-square-effect="${escapeHtml(effect.id)}" style="--choice-art: url('${escapeHtml(effect.image)}')">
      <strong>${escapeHtml(effect.label)}</strong>
      <span>${escapeHtml(effect.summary)}</span>
    </button>
  `).join("");
  container.querySelectorAll("[data-square-effect]").forEach(button => {
    button.addEventListener("click", () => chooseSquareEffect(button.dataset.squareEffect));
  });
}

function chooseSquareEffect(effectId) {
  if (!pendingResolution || pendingResolution.winnerSide !== "player") return;
  const effect = getSquareEffect(effectId);
  if (!effect) return;
  pendingResolution.squareEffect = effect;
  renderSquareChoiceOptions(effect.id);
  const continueButton = document.getElementById("continue-after-clash");
  if (continueButton) continueButton.disabled = false;
  setText("comparison-result", `Your response wins the square. ${effect.label} will change ${pendingResolution.pending.squareLabel}. ${pendingResolution.notes.join(". ")}.`);
}

function continueAfterClash() {
  if (!pendingResolution) return;
  if (pendingResolution.winnerSide === "player" && !pendingResolution.squareEffect) {
    setText("comparison-result", "Choose how the square changes before continuing.");
    return;
  }
  resolveClash(pendingResolution);
  pendingResolution = null;
  closeClashModal();
  renderAll();
  saveState();
}

function resolveClash(result) {
  const move = result.pending.move;
  const attacker = state.board[move.fromRow][move.fromCol];
  const defender = state.board[move.toRow][move.toCol];
  const attackerWins = result.winnerSide === result.pending.attackerSide;
  const loser = attackerWins ? defender : attacker;
  const winner = attackerWins ? attacker : defender;
  const reward = result.winnerSide === "player"
    ? applyCareerReward(result.studentScore, true)
    : { earnedDelta: 0, taxDelta: 0, savingsDelta: 0 };

  if (attackerWins) {
    state.board[move.toRow][move.toCol] = attacker;
    state.board[move.fromRow][move.fromCol] = null;
    if (attacker) attacker.hasMoved = true;
  } else {
    state.board[move.fromRow][move.fromCol] = null;
  }

  recordCapturedPiece(loser);
  const squareMessage = claimSquare(move.toRow, move.toCol, result, winner);
  state.scores[result.winnerSide] += 1;
  state.bestScore = Math.max(state.bestScore || 0, result.studentScore);
  state.salaryEarned = Number(state.salaryEarned || 0) + Number(reward.earnedDelta || 0);
  state.clashes.push({
    id: result.pending.id,
    promptId: result.pending.question.id,
    prompt: result.pending.question.prompt,
    square: result.pending.squareLabel,
    attackerSide: result.pending.attackerSide,
    studentResponse: result.response,
    opponentResponse: result.pending.opponentResponse,
    studentScore: result.studentScore,
    opponentScore: result.opponentScore,
    squareEffectId: result.squareEffect?.id || "",
    squareEffectLabel: result.squareEffect?.label || "",
    winnerSide: result.winnerSide,
    createdAt: new Date().toISOString()
  });
  state.evidenceLog.push({
    title: `${result.pending.squareLabel} - ${result.pending.question.title}`,
    detail: `${result.studentScore}% vs ${result.opponentScore}% - ${getSideLabel(result.winnerSide)} won. ${getSquareEffect(state.squareStates[squareKey(move.toRow, move.toCol)]?.effectId)?.label || "Square claimed"}.${reward.earnedDelta ? ` Salary +${formatCurrency(reward.earnedDelta)}.` : ""}`
  });
  state.pendingClash = null;
  state.mode = "board";
  state.lastMessage = `${winner?.name || getSideLabel(result.winnerSide)} holds ${result.pending.squareLabel}. ${squareMessage}${reward.earnedDelta ? ` Salary +${formatCurrency(reward.earnedDelta)} banked into Career Empire.` : ""}`;
  saveClashEvidence(result, reward).catch(console.warn);
  checkGameOver();

  if (state.winner) return;
  if (result.pending.attackerSide === "player") finishPlayerTurn(state.lastMessage);
  else finishAiTurn(state.lastMessage);
}

function claimSquare(row, col, result, winnerPiece) {
  const effect = result.squareEffect || chooseRandomSquareEffect();
  state.squareStates[squareKey(row, col)] = {
    side: result.winnerSide,
    effectId: effect.id,
    label: effect.label,
    promptId: result.pending.question.id,
    promptTitle: result.pending.question.title,
    updatedAt: new Date().toISOString()
  };
  const landingMessage = applyLandingEffect(winnerPiece, row, col);
  return `${coord(row, col)} becomes ${effect.label}.${landingMessage ? ` ${landingMessage}` : ""}`;
}

function getSideLabel(side) {
  return side === "player" ? "Career team" : "Opposition";
}

function getRemainingPieces(side) {
  return state.board.flat().filter(piece => piece?.side === side);
}

function checkGameOver() {
  const playerPieces = getRemainingPieces("player");
  const aiPieces = getRemainingPieces("ai");
  if (!aiPieces.length || !aiPieces.some(piece => piece.type === "leader")) {
    state.winner = "player";
    state.mode = "complete";
    state.lastMessage = "Career team wins the board.";
  } else if (!playerPieces.length || !playerPieces.some(piece => piece.type === "leader")) {
    state.winner = "ai";
    state.mode = "complete";
    state.lastMessage = "Opposition wins the board.";
  }
}

function finishPlayerTurn(message) {
  state.currentTurn = "ai";
  state.turnNumber += 1;
  state.lastMessage = message || "Opposition is reading the board.";
  renderAll();
  saveState();
  aiTimer = setTimeout(runAiTurn, 650);
}

function finishAiTurn(message) {
  state.currentTurn = "player";
  state.lastMessage = message || "Your career team can move.";
  renderAll();
  saveState();
}

function runAiTurn() {
  if (state.currentTurn !== "ai" || state.mode !== "board" || state.winner) return;
  const moves = getAllMoves("ai");
  if (!moves.length) {
    state.winner = "player";
    state.mode = "complete";
    state.lastMessage = "Opposition has no legal move. Career team wins.";
    renderAll();
    saveState();
    return;
  }
  const captures = moves.filter(move => move.isCapture);
  const chosen = captures.length ? chooseBestAiCapture(captures) : chooseAiAdvance(moves);
  executeMove(chosen);
}

function getPieceValue(piece) {
  if (!piece) return 0;
  if (piece.type === "leader") return 5;
  if (piece.type === "orthogonal" || piece.type === "diagonal") return 3;
  return 2;
}

function chooseBestAiCapture(moves) {
  return moves.slice().sort((a, b) => getPieceValue(b.target) - getPieceValue(a.target))[0];
}

function chooseAiAdvance(moves) {
  return moves.slice().sort((a, b) => {
    const aDistance = 7 - a.toRow;
    const bDistance = 7 - b.toRow;
    if (aDistance !== bDistance) return aDistance - bDistance;
    return Math.abs(3.5 - a.toCol) - Math.abs(3.5 - b.toCol);
  })[0];
}

function buildSnapshot(taskName) {
  const mastery = calculateMastery();
  return {
    module_id: MODULE_ID,
    task_name: taskName,
    prompt_text: "Careers Archon written response clash log",
    completion_percent: calculateProgress(),
    score_percent: mastery,
    clashes_resolved: state.clashes.length,
    player_wins: state.scores.player,
    opposition_wins: state.scores.ai,
    best_score: state.bestScore,
    duration_seconds: 0,
    evidence_log: state.evidenceLog.slice(-8),
    completed: calculateProgress() >= 100,
    updated_at: new Date().toISOString()
  };
}

function applyCareerReward(score, won) {
  if (!won) return { earnedDelta: 0, taxDelta: 0, savingsDelta: 0 };
  const earnedDelta = 350 + Math.round(score * 7);
  const taxDelta = Math.round(earnedDelta * COMMUNITY_TAX_RATE);
  const savingsDelta = Math.round(earnedDelta * 0.25);
  const session = getSession();
  const baseSalary = Math.max(25000, Number(session.annualSalary ?? session.salary ?? 25000));
  const baseNetWorth = Math.max(0, Number(session.cumulativeNetWorth || 0));
  const baseSavings = Math.max(0, Number(session.savings || 0));
  const baseTaxPaid = Math.max(0, Number(session.taxPaid || 0));
  const patch = {
    annualSalary: baseSalary + earnedDelta,
    salary: baseSalary + earnedDelta,
    cumulativeNetWorth: baseNetWorth + earnedDelta,
    savings: baseSavings + savingsDelta,
    taxPaid: baseTaxPaid + taxDelta
  };
  if (window.CareerEmpireEconomy?.writeSession) {
    window.CareerEmpireEconomy.writeSession(patch);
  } else {
    writeJsonStorage(PLAYER_SESSION_KEY, { ...session, ...patch });
  }
  if (window.CareerEmpireEconomy?.appendEvent) {
    window.CareerEmpireEconomy.appendEvent({
      moduleId: MODULE_ID,
      eventType: "writing-clash-won",
      checkpoint: "written-clash",
      label: "Careers Archon response win",
      detail: `${score}% written response won a contested square.`,
      earnedDelta,
      taxDelta,
      savingsDelta,
      annualSalaryAfter: patch.annualSalary,
      netWorthAfter: patch.cumulativeNetWorth,
      savingsAfter: patch.savings,
      taxPaidAfter: patch.taxPaid
    });
  }
  return { earnedDelta, taxDelta, savingsDelta };
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") return null;
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
}

async function saveClashEvidence(result, reward = null) {
  const won = result.winnerSide === "player";
  const resolvedReward = reward || applyCareerReward(result.studentScore, won);
  await saveTeacherSnapshot("written-clash", result, resolvedReward);
}

async function saveTeacherSnapshot(taskName = "manual-snapshot", clashResult = null, reward = null) {
  state.savedSnapshots += 1;
  saveState();
  const snapshot = buildSnapshot(taskName);
  const auth = getAuthState();
  const student = auth?.studentLogin || {};
  const session = getSession();
  const classId = student.classId || session.classId || "";
  const isDemo = Boolean(student.demo || student.preview || session.demoMode);
  const supabase = await getSupabaseClientOrNull();
  if (!supabase || !student.id || isDemo) {
    renderStatus();
    return;
  }

  const progressPayload = {
    student_id: student.id,
    class_id: classId,
    module_id: MODULE_ID,
    completion_percent: snapshot.completion_percent,
    mastery_percent: snapshot.score_percent,
    attempts: Math.max(1, state.clashes.length),
    unlocked: true,
    completed: snapshot.completed,
    last_played_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error: progressError } = await supabase
    .from("student_module_progress")
    .upsert(progressPayload, { onConflict: "student_id,module_id" });
  if (progressError) console.error(progressError);

  if (!clashResult) return;

  const { data: evidenceRow, error: evidenceError } = await supabase
    .from("assessment_evidence")
    .insert({
      student_id: student.id,
      class_id: classId,
      module_id: MODULE_ID,
      evidence_type: "justification",
      prompt: clashResult.pending.question.prompt,
      response_text: clashResult.response,
      auto_score: clashResult.studentScore
    })
    .select("id")
    .maybeSingle();
  if (evidenceError) console.error(evidenceError);

  const moderation = window.CareerEmpireResponseModeration;
  if (moderation?.queuePendingReview && evidenceRow?.id) {
    await moderation.queuePendingReview(supabase, {
      sourceEvidenceId: evidenceRow.id,
      studentId: student.id,
      classId,
      schoolId: student.schoolId || session.schoolId,
      moduleId: MODULE_ID,
      evidenceType: "justification",
      taskKey: clashResult.pending.question.id,
      taskLabel: "Careers Archon written clash",
      promptText: clashResult.pending.question.prompt,
      responseText: clashResult.response,
      student: {
        displayName: student.displayName || session.playerName,
        username: student.username || session.username
      }
    });
  }
}

function wireEvents() {
  document.getElementById("submit-response")?.addEventListener("click", submitResponse);
  document.getElementById("continue-after-clash")?.addEventListener("click", continueAfterClash);
  document.getElementById("save-progress")?.addEventListener("click", () => {
    saveTeacherSnapshot("manual-snapshot").catch(console.warn);
    state.lastMessage = "Progress snapshot saved.";
    renderAll();
  });
  document.getElementById("reset-game")?.addEventListener("click", () => {
    clearTimeout(aiTimer);
    localStorage.removeItem(MODULE_STORAGE_KEY);
    state = createInitialState();
    pendingResolution = null;
    closeClashModal();
    renderAll();
    saveState();
  });
}

wireEvents();
renderAll();
saveState();
