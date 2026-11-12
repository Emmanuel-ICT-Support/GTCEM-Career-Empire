// Attributed adaptation; the school-licensed original page stays private.
const prefix = 'ce-notes-worksheet-v1:';
const limit = 4000;
export function decodeWorksheetDraft(value) {
  if (typeof value !== 'string') return {};
  if (!value.startsWith(prefix)) return {transfer: value};
  try {
    const fields = JSON.parse(value.slice(prefix.length));
    return fields && !Array.isArray(fields) && typeof fields === 'object'
      ? Object.fromEntries(Object.entries(fields).filter(([k,v]) => ['definition','ella','transfer','check:ce.check.initiative.act','check:ce.check.initiative.benefit'].includes(k) && typeof v === 'string')) : {transfer: value};
  } catch { return {transfer: value}; }
}
export function encodeWorksheetDraft(fields) { return prefix + JSON.stringify(fields); }
export function worksheetDraftFits(value) { return typeof value === 'string' && value.length <= limit; }

export function mountNotesWorksheet(article, library, {emit, el, button}) {
  const doc = article.ownerDocument;
  const fields = new Map();
  const grid = el('div', null, 'ce-notes-grid');
  const reading = el('section', null, 'ce-notes-reading');
  reading.append(el('p', '01 / READ', 'ce-notes-kicker'), el('h2', 'Take action with purpose'));
  reading.append(el('p', 'Initiative means noticing what needs doing and taking a useful first step without waiting to be told. It involves thinking for yourself, finding information and solving problems within your role.', 'ce-notes-intro'));
  reading.append(el('p', 'Employers value people who act early and contribute ideas. Useful initiative can improve how work gets done and show that a worker is ready to learn. It does not mean ignoring safety, training or agreed responsibilities.'));
  const story = el('div', null, 'ce-notes-story');
  story.append(el('h3', 'Ella notices before the rush'), el('p', 'At a small coffee stall, Ella notices that milk is running low. She arranges more before the busy period, rather than waiting for the stall to run out. Her foresight helps the stall keep serving customers and builds her employer\'s trust.'));
  reading.append(story, el('h3', 'Five ways to show initiative'));
  const list = el('ol', null, 'ce-notes-five');
  const ids = ['act','improve','speak','support','step-up'];
  const sourceLabels = ['Being proactive','Identifying ways to improve current work practices','Vocalising your opinions','Helping fellow workers','Seeking more responsibilities'];
  ids.forEach((id,i) => {
    const term = library.terms.find(t => t.legacyBehaviourId === id);
    if (!term) throw Error('Missing shared behaviour');
    const item = el('li'); item.append(el('strong', sourceLabels[i]), el('span', term.definition)); list.append(item);
  });
  reading.append(list);
  const attribution = el('p', 'Reading adapted from Michael Carolan, CEM G12: Careers and Employability (2025), section 2.05, printed p. 24. Original: DELIVER Educational Consulting and its licensors; licensed for use by Emmanuel Catholic College. The example is retold; explanations and response tasks are adapted for Career Empire.', 'ce-notes-source');
  reading.append(attribution);
  const worksheet = el('section', null, 'ce-notes-responses');
  worksheet.append(el('p', '02 / THINK & RESPOND', 'ce-notes-kicker'), el('h2', 'Make the idea stick'), el('p', 'Read, answer, then compare. You can revise your responses. Use fictional situations; leave out names and personal details.'));
  function written(id, title, prompt, rows, maxLength) {
    const block = el('div', null, 'ce-written-block');
    const label = el('label', title); const input = el('textarea');
    input.rows = rows; input.maxLength = maxLength; input.dataset.notesDraft = id;
    const hint = el('p', prompt, 'ce-notes-hint'); hint.id = 'ce-notes-hint-'+id;
    input.setAttribute('aria-describedby', hint.id); label.append(input); block.append(label, hint); fields.set(id,input); worksheet.append(block);
  }
  written('definition', '1. Define initiative in your own words', 'Explain the meaning. Give more than a list of key terms.', 3, 500);
  function check(id, title) {
    const q = library.checks.find(q => q.id === id); if (!q) throw Error('Missing shared practice check');
    const block = el('fieldset', null, 'ce-notes-check'); block.append(el('legend', title),el('p',q.prompt));
    const options = el('div', null, 'ce-options'); const feedback = el('p', null, 'ce-notes-feedback'); feedback.setAttribute('role','status');
    const field = {value:'', set(value) { this.value = q.options.some(o=>o.id===value) ? value : ''; for (const b of options.children) b.setAttribute('aria-pressed',String(b.dataset.answer === this.value)); feedback.textContent = this.value ? (this.value === q.answerId ? q.feedback : q.retryHint+' '+q.feedback) : ''; }};
    fields.set('check:'+id,field);
    for (const option of q.options) { const b = button(option.text, () => { field.set(option.id); emit({type:'practice-attempt',checkId:id,answerId:option.id,correct:option.id===q.answerId,feedback:feedback.textContent}); b.dispatchEvent(new doc.defaultView.Event('input',{bubbles:true})); }); b.dataset.answer=option.id; b.setAttribute('aria-pressed','false'); options.append(b); }
    block.append(options,feedback);worksheet.append(block);
  }
  check('ce.check.initiative.act','2. Match an action to a behaviour');
  written('ella','3. Explain Ella\'s initiative','What did she notice? What did she do? Explain one effect for the stall or for Ella.',3,700);
  const compare = el('details'); compare.append(el('summary','Compare with a worked response'),el('p','Ella noticed a shortage before it interrupted service and arranged more milk. Acting early shows initiative. Customers could still be served, and her employer had a reason to trust her with suitable further tasks. Your wording can differ; link the action to an effect.')); worksheet.append(compare);
  check('ce.check.initiative.benefit','4. Check a workplace benefit');
  grid.append(reading,worksheet);article.append(grid);
  return {
    attachTransfer(input) { fields.set('transfer',input);input.dataset.notesDraft='transfer'; },
    serializeDraft() { return encodeWorksheetDraft(Object.fromEntries([...fields].map(([key,input])=>[key,input.value]))); },
    restoreDraft(raw) { const saved=decodeWorksheetDraft(raw);for (const [key,input] of fields) { if (input.set) input.set(saved[key]); else input.value=saved[key]||''; } }
  };
}
