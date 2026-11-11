/** Read-only shared content; host owns persistence, rewards and navigation. */
export function validateLibrary(library) {
  if (library?.schemaVersion !== '1.0.0') throw new Error('Unsupported learning schema');
  const all = [...library.terms, ...library.checks, ...library.lessons, ...library.sources];
  const ids = new Set();
  for (const item of all) { if (!item.id || ids.has(item.id)) throw new Error('Missing or duplicate ID'); ids.add(item.id); }
  const requireIds = values => { for (const id of values || []) if (!ids.has(id)) throw new Error(`Unknown content ID: ${id}`); };
  for (const item of [...library.terms, ...library.checks, ...library.lessons]) { requireIds(item.termIds); requireIds(item.sourceIds); }
  for (const check of library.checks) {
    if (new Set(check.options.map(x => x.id)).size !== check.options.length || !check.options.some(x => x.id === check.answerId)) throw new Error('Invalid check options');
  }
  for (const lesson of library.lessons) { requireIds(lesson.guidedCheckIds); requireIds(lesson.independentCheckIds); }
  return library;
}
export function gradeCheck(library, checkId, answerId) {
  const q = library.checks.find(x => x.id === checkId);
  if (!q || !q.options.some(x => x.id === answerId)) throw new Error('Unknown check or option');
  const correct = q.answerId === answerId;
  return { checkId, answerId, correct, feedback: correct ? q.feedback : `${q.retryHint} ${q.feedback}` };
}
export function mountLesson(root, library, { lessonId = 'ce.lesson.initiative.foundation', onEvidence = () => {}, onExit = () => {} } = {}) {
  validateLibrary(library);
  const lesson = library.lessons.find(x => x.id === lessonId);
  if (!lesson) throw new Error('Unknown lesson');
  const doc = root.ownerDocument;
  let disposed = false;
  function el(tag, text, className) { const node = doc.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
  function button(text, fn) { const b = el('button', text); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function emit(detail) { if (!disposed) onEvidence({ schemaVersion: library.schemaVersion, libraryRevision: library.revision, lessonId, ...detail }); }
  const article = el('article', null, 'ce-lesson');
  const header = el('header'); header.append(el('p', 'FIELD GUIDE / INITIATIVE', 'ce-eyebrow'), el('h1', lesson.title), el('p', lesson.subtitle, 'ce-lead'), el('p', lesson.objective));
  header.append(button('Return to game', () => onExit())); article.append(header);
  const goals = el('section'); goals.append(el('h2', 'Your mission')); for (const c of lesson.successCriteria) goals.append(el('p', c)); goals.append(el('p', lesson.priorKnowledge)); article.append(goals);
  const vocab = el('section'); vocab.append(el('h2', 'Learn the signals'));
  const grid = el('div', null, 'ce-card-grid');
  for (const id of lesson.termIds) { const term = library.terms.find(t => t.id === id); const card = el('details', null, 'ce-card'); card.append(el('summary', term.label), el('p', term.definition)); if (term.example) card.append(el('p', `Useful action: ${term.example}`), el('p', `Compare: ${term.nonExample}`)); grid.append(card); } vocab.append(grid); article.append(vocab);
  const model = el('section'); model.append(el('h2', 'Watch the thinking'), el('p', lesson.model.context)); const steps = el('ol'); const next = button('Reveal next thought', () => { if (step < lesson.model.steps.length) { steps.append(el('li', lesson.model.steps[step++], 'ce-reveal')); if (step === lesson.model.steps.length) next.disabled = true; } }); let step = 0; model.append(steps, next, el('p', `Non-example: ${lesson.model.nonExample}`)); article.append(model);
  const answers = new Map();
  function checkSection(title, checkIds) {
    const section = el('section'); section.append(el('h2', title));
    for (const id of checkIds) {
      const q = library.checks.find(x => x.id === id); const field = el('fieldset'); field.append(el('legend', q.prompt));
      const feedback = el('p'); feedback.setAttribute('role', 'status'); const options = el('div', null, 'ce-options');
      for (const option of q.options) options.append(button(option.text, () => {
        const result = gradeCheck(library, id, option.id); answers.set(id, result); feedback.textContent = result.feedback;
        emit({ type: 'practice-attempt', ...result });
      }));
      field.append(options, feedback); section.append(field);
    } article.append(section);
  }
  checkSection('Try it together', lesson.guidedCheckIds); checkSection('Try a new situation', lesson.independentCheckIds);
  const transfer = el('section'); transfer.append(el('h2', 'Make it your own'), el('p', lesson.transfer.prompt));
  const label = el('label', 'Your explanation'); const text = el('textarea'); text.rows = 6; text.maxLength = 4000; label.append(text); transfer.append(label);
  const hint = el('details'); hint.append(el('summary', 'Show a writing scaffold'), el('p', lesson.transfer.scaffold)); transfer.append(hint);
  const status = el('p'); status.setAttribute('role', 'status');
  transfer.append(button('Send explanation to game', () => { if (!text.value.trim()) { status.textContent = 'Add an explanation first.'; text.focus(); return; } emit({ type: 'transfer-draft', evidenceId: lesson.transfer.id, text: text.value.trim(), teacherReviewRequired: true }); status.textContent = 'Explanation passed to the game. The game must confirm saving; this guide does not save progress.'; }), status);
  const rubric = el('details'); rubric.append(el('summary', 'What makes a strong explanation?')); for (const row of lesson.transfer.rubric) rubric.append(el('p', row.criterion)); transfer.append(rubric); article.append(transfer);
  const retrieval = el('section'); retrieval.append(el('h2', 'Recall before you return'), el('p', lesson.retrieval.prompt), el('p', lesson.retrieval.mastery)); article.append(retrieval);
  const sources = el('details'); sources.append(el('summary', 'Sources and review status')); for (const s of library.sources) sources.append(el('p', `${s.title}. ${s.edition}. ${s.pages}. ${s.verification}`)); sources.append(el('p', 'Original teaching examples. Local review candidate; school teaching-year alignment and classroom acceptance remain pending.')); article.append(sources);
  root.replaceChildren(article);
  return { destroy() { disposed = true; root.replaceChildren(); }, getPractice() { return [...answers.values()]; } };
}
