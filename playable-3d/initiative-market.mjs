import {worksheetDraftFits} from '../modules/initiative/parallel/learning/notes-worksheet.mjs?v=notes-worksheet-20261112';
const revision = 'initiative-learning-r1';
const schemaVersion = '1.0.0';
const hash = 'ae97e51da217aca0cd8d4b7f438afea53a19e3fb0ff63cbf6009d7f56df36265';
const lessonId = 'ce.lesson.initiative.foundation';
const evidenceId = 'ce.evidence.initiative.transfer';

export function initiativeMarketChoices({ notes, archon, mara, welcome, notesReturnLabel }) {
  return [
    ['Initiative lecture and notes', () => notes(welcome, notesReturnLabel)],
    ['Careers Archon', () => archon(welcome)],
    ['Mara’s Market experience', mara]
  ];
}

// The host supplies its existing opaque learner context and scoped persistence.
export function createInitiativeNotes({
  dialog, show, libraryUrl, validateLibrary, mountLesson,
  currentLearner, readDraft, saveDraft, recordEvidence
}) {
  const doc = dialog.ownerDocument;
  const base = new URL(doc.baseURI);
  const url = new URL(libraryUrl, base);
  if (!libraryUrl || url.origin !== base.origin || url.search || url.hash ||
      url.username || url.password) throw new TypeError('A same-origin shared library URL is required.');

  const unsaved = new Map();
  let active;
  function dispose() {
    active?.controller.abort();
    active?.lesson?.destroy();
    active?.root.remove();
    active = undefined;
  }
  dialog.addEventListener('cancel', dispose);
  dialog.addEventListener('close', () => { if (!dialog.open) dispose(); });

  return async function openNotes(welcome, returnLabel = 'Back to Market choices') {
    dispose();
    const learner = currentLearner();
    const context = { learner, libraryRevision: revision, schemaVersion, lessonId, evidenceId };
    const back = () => { dispose(); welcome(); };
    show('Initiative lecture and notes', 'Read the source-informed guide, complete your responses and return to the Market.', [
      [returnLabel, back]
    ]);
    const root = doc.createElement('div');
    const status = doc.createElement('p');
    status.setAttribute('role', 'status');
    status.textContent = 'Loading the Initiative notes…';
    dialog.append(status, root);
    const visit = { root, controller: new AbortController() };
    active = visit;
    const isCurrent = () => active === visit && dialog.open && root.isConnected &&
      currentLearner() === learner;
    try {
      if (!learner) throw new Error('Missing learner context');
      const response = await fetch(url, { signal: visit.controller.signal, mode: 'same-origin' });
      if (!response.ok) throw new Error('Library unavailable');
      const bytes = await response.arrayBuffer();
      const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
      const actual = Array.from(digest, value => value.toString(16).padStart(2, '0')).join('');
      if (actual !== hash) throw new Error('Unexpected library version');
      const library = JSON.parse(new TextDecoder().decode(bytes));
      validateLibrary(library);
      if (!isCurrent()) return;
      function persist(callback, value) {
        try {
          return callback(value) === true;
        } catch {
          return false;
        }
      }
      visit.lesson = mountLesson(root, library, {
        lessonId, onExit: back,
        onEvidence(event) {
          if (!isCurrent()) return;
          if (event.type === 'transfer-draft' && !worksheetDraftFits(visit.lesson.serializeDraft?.() ?? event.text)) { status.textContent = 'These notes exceed the 4,000-character device limit. Edits remain available for this visit; shorten a response to save.'; return; }
          status.textContent = persist(recordEvidence, { ...event, ...(event.type === 'transfer-draft' ? {text:visit.lesson.serializeDraft?.() ?? event.text} : {}), learner })
            ? 'Practice recorded for this learner.'
            : 'Practice was not recorded. You can try again.';
        }
      });
      const input = root.querySelector('textarea');
      if (!input) throw new Error('Draft field unavailable');
      const restored = unsaved.get(learner) ?? readDraft(context) ?? '';
      if (visit.lesson.restoreDraft) visit.lesson.restoreDraft(restored);
      else input.value = restored;
      root.addEventListener('input', () => {
        if (!isCurrent()) return;
        const text = visit.lesson.serializeDraft?.() ?? input.value;
        unsaved.set(learner, text);
        if (worksheetDraftFits(text) && persist(saveDraft, { ...context, text })) {
          unsaved.delete(learner);
          status.textContent = 'Draft kept for this game run. Guest drafts last only while this tab stays open; teacher sync is not confirmed.';
        } else {
          status.textContent = worksheetDraftFits(text)
            ? 'Draft is kept for this visit only. Saving failed.'
            : 'These notes exceed the 4,000-character device limit. Your edits are kept for this visit; shorten a response to save.';
        }
      });
      status.textContent = unsaved.has(learner) ? 'Unsaved draft restored for this visit.' : '';
    } catch {
      if (!isCurrent()) return;
      visit.lesson?.destroy();
      status.textContent = 'Initiative notes could not open. Return to Market choices and try again.';
    }
  };
}
