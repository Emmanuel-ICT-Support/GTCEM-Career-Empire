/* Shared presentation only. Inputs are normalized and authorized by the caller. */
(function (global) {
"use strict";
const defaults = {
  escapeHtml: value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])),
  getStudentDisplayName: student => student?.display_name || student?.username || "Student",
  formatExperienceDate: value => value ? new Date(String(value).slice(0,10)+"T00:00:00").toLocaleDateString() : "Experience date not set",
  formatDateTime: value => new Date(value).toLocaleString(),
  getCapabilityProgressionLabel(entries = []) {
    const sorted = [...entries].sort((a,b) => (Date.parse(a.createdAt)||0)-(Date.parse(b.createdAt)||0));
    if(sorted.length < 2) return "Collect more journal evidence";
    const midpoint = Math.ceil(sorted.length/2), average = rows => rows.reduce((sum,row)=>sum+row.quality,0)/rows.length;
    const early=average(sorted.slice(0,midpoint)),recent=average(sorted.slice(midpoint));
    if(recent >= early+2) return "Articulation is improving";
    if(recent >= early) return "Articulation is steady";
    return "Needs a fuller recent explanation";
  }
};
function studentMatchesCapabilityEntry(student, entry, getStudentDisplayName = defaults.getStudentDisplayName) {
  return entry.studentId
    ? entry.studentId === student.id
    : entry.studentName === getStudentDisplayName(student);
}

function renderCapabilityPortfolioCell(entries = [], category, helpers = defaults) {
  const {escapeHtml, getCapabilityProgressionLabel, formatExperienceDate} = helpers;
  const categoryEntries = entries.filter(entry => entry.capabilityIds.includes(category.id));
  if (!categoryEntries.length) {
    return `
      <div class="portfolio-evidence-cell portfolio-evidence-cell--empty">
        <strong>No entries yet</strong>
        <span>No STAR reflections tagged to this capability yet.</span>
      </div>
    `;
  }

  return `
    <div class="portfolio-evidence-cell">
      <div class="portfolio-evidence-cell-summary">
        <strong>${categoryEntries.length} entr${categoryEntries.length === 1 ? "y" : "ies"}</strong>
        <span>${escapeHtml(getCapabilityProgressionLabel(categoryEntries))}</span>
      </div>
      <div class="portfolio-evidence-entry-list" tabindex="0" role="region" aria-label="Evidence entries for ${escapeHtml(category.title)}">
        ${categoryEntries.map(entry => `
          <article class="portfolio-evidence-entry">
            <div>
              <strong>${escapeHtml(entry.taskLabel || "Journal evidence")}</strong>
              <small>${escapeHtml(entry.moduleLabel)} - ${escapeHtml(formatExperienceDate(entry.experienceDate || entry.createdAt))}${typeof entry.score === "number" ? ` - ${entry.score}%` : ""}</small>
            </div>
            <p>${escapeHtml(entry.response)}</p>
            <div class="portfolio-evidence-tags">
              <span>${entry.wordCount} words</span>
              <span>quality ${entry.quality}/12</span>
              ${(entry.markerLabels || []).slice(0, 2).map(label => `<span>${escapeHtml(label)}</span>`).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function matrixHTML({ skillCategories = [], students = [], selectedStudent = null, evidenceEntries = [] }, helpers = {}) {
  const {escapeHtml, getStudentDisplayName, getCapabilityProgressionLabel, formatExperienceDate, formatDateTime} = Object.assign({}, defaults, helpers);
  const portfolioEvidenceEntries = evidenceEntries;
  const studentScope = selectedStudent ? [selectedStudent] : students;
  const scopedStudentIds = new Set(studentScope.map(student => student.id).filter(Boolean));
  const scopedEntries = selectedStudent
    ? portfolioEvidenceEntries.filter(entry => entry.studentId === selectedStudent.id)
    : portfolioEvidenceEntries.filter(entry => !scopedStudentIds.size || scopedStudentIds.has(entry.studentId));

  if (!studentScope.length) {
    return `
      <div class="timeline-item">
        <strong>No students in this focus yet</strong>
        <p>Change the class or student status filters to choose which students appear in this portfolio matrix.</p>
      </div>
    `;
  }

  const portfolioStudents = studentScope.map(student => ({
    student,
    entries: scopedEntries.filter(entry => studentMatchesCapabilityEntry(student, entry, getStudentDisplayName))
  }));

  return `
    <section class="capability-breakdown-panel capability-matrix-panel">
      <div class="capability-matrix-tools"><button type="button" data-reset-columns>Reset to default</button><span class="capability-reorder-status" role="status" aria-live="polite"></span></div>
      <div class="section-title">
        <h3>Students x Capabilities</h3>
        <p>${scopedEntries.length} STAR reflection${scopedEntries.length === 1 ? "" : "s"} in this focus. Scroll inside a cell to review every entry for that student and capability.</p>
      </div>
      <div class="teacher-matrix-scroll capability-matrix-scroll" role="region" aria-label="Capability portfolio matrix" tabindex="0">
        <table class="teacher-matrix capability-evidence-matrix">
          <thead>
            <tr>
              <th scope="col" class="teacher-matrix-student-col">Student</th>
              ${skillCategories.map(category => `
                <th scope="col" data-capability="${escapeHtml(category.id)}" draggable="true">
                  <span>${category.logoPath ? `<img loading="lazy" decoding="async" class="capability-matrix-logo" src="${escapeHtml(category.logoPath)}" alt="">` : ""}${escapeHtml(category.title)}</span>
                  <small>Drag to reorder · scroll evidence entries</small>
                  <div class="capability-column-actions"><button type="button" data-move="left" aria-label="Move ${escapeHtml(category.title)} left">←</button><button type="button" data-move="right" aria-label="Move ${escapeHtml(category.title)} right">→</button></div>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${portfolioStudents.map(row => `
              <tr>
                <th scope="row" class="teacher-matrix-student-col">
                  <strong>${escapeHtml(getStudentDisplayName(row.student))}</strong>
                  <small>${row.entries.length} STAR reflection${row.entries.length === 1 ? "" : "s"}${row.student.last_login_at ? ` - last login ${escapeHtml(formatDateTime(row.student.last_login_at))}` : ""}</small>
                </th>
                ${skillCategories.map(category => `<td data-capability="${escapeHtml(category.id)}">${renderCapabilityPortfolioCell(row.entries, category, Object.assign({}, defaults, helpers))}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

const states = new WeakMap();
function normalizeOrder(order, categories) {
  const ids=categories.map(category=>category.id);
  return [...new Set((Array.isArray(order)?order:[]).filter(id=>typeof id==="string" && ids.includes(id))), ...ids.filter(id=>!Array.isArray(order)||!order.includes(id))];
}
function mount(container, input, options = {}) {
  if (!container) return;
  const previous=states.get(container);
  if(previous?.cleanup) previous.cleanup();
  const state={order:normalizeOrder(previous?.order || options.order,input.skillCategories), cleanup:null};
  states.set(container,state);
  function draw(focusId, direction, announcement="") {
    let dragId="", targetId="", after=false, speed=0, timer=0;
    const categories=state.order.map(id=>input.skillCategories.find(category=>category.id===id));
    container.innerHTML=matrixHTML(Object.assign({},input,{skillCategories:categories}),options.helpers);
    const scroll=container.querySelector('.capability-matrix-scroll');
    if(!scroll) return;
    container.querySelector('.capability-reorder-status').textContent=announcement;
    function clear() {dragId="";targetId="";speed=0;clearInterval(timer);timer=0;container.querySelectorAll('[data-drop]').forEach(el=>el.removeAttribute('data-drop'));}
    function commit(order,id,dir) {
      const left=scroll.scrollLeft,top=scroll.scrollTop;
      state.order=normalizeOrder(order,input.skillCategories);clear();
      if(options.onOrderChange) options.onOrderChange([...state.order]);
      draw(id,dir,`${input.skillCategories.find(c=>c.id===id)?.title || "Columns"} moved. Column order updated.`);
      const next=container.querySelector('.capability-matrix-scroll');next.scrollLeft=left;next.scrollTop=top;
    }
    container.querySelectorAll('thead [data-capability]').forEach((header,index)=>{
      header.querySelector('[data-move="left"]').disabled=index===0;
      header.querySelector('[data-move="right"]').disabled=index===state.order.length-1;
      header.addEventListener('dragstart',event=>{
        if(event.target.closest('button')){event.preventDefault();return;}
        dragId=header.dataset.capability;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',dragId);
      });
      header.addEventListener('dragover',event=>{
        if(!dragId) return;
        if(dragId===header.dataset.capability){targetId='';container.querySelectorAll('[data-drop]').forEach(el=>el.removeAttribute('data-drop'));return;}
        event.preventDefault();event.dataTransfer.dropEffect='move';targetId=header.dataset.capability;
        after=event.clientX>header.getBoundingClientRect().left+header.offsetWidth/2;
        container.querySelectorAll('[data-drop]').forEach(el=>el.removeAttribute('data-drop'));
        header.dataset.drop=after?'after':'before';
      });
      header.addEventListener('drop',event=>{
        if(!dragId||!targetId) return;event.preventDefault();
        const moving=dragId,order=state.order.filter(id=>id!==moving),at=order.indexOf(targetId)+(after?1:0);order.splice(at,0,moving);commit(order,moving,'right');
      });
    });
    scroll.addEventListener('dragover',event=>{
      if(!dragId) return;event.preventDefault();const box=scroll.getBoundingClientRect();
      speed=event.clientX>box.right-48?18:event.clientX<box.left+48?-18:0;
      if(!timer)timer=setInterval(()=>{scroll.scrollLeft+=speed},30);
    });
    scroll.addEventListener('dragend',clear,{once:true});
    container.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.closest('[data-capability]').dataset.capability,order=[...state.order],at=order.indexOf(id),to=at+(button.dataset.move==='left'?-1:1);
      if(to<0||to>=order.length)return;[order[at],order[to]]=[order[to],order[at]];commit(order,id,button.dataset.move);
    }));
    container.querySelector('[data-reset-columns]').addEventListener('click',()=>{
      state.order=input.skillCategories.map(category=>category.id);clear();if(options.onOrderChange)options.onOrderChange([...state.order]);draw(null,null,'Default capability order restored.');container.querySelector('[data-reset-columns]').focus();
    });
    if(focusId){const header=Array.from(container.querySelectorAll('thead [data-capability]')).find(el=>el.dataset.capability===focusId);const button=header?.querySelector(`[data-move="${direction}"]:not(:disabled)`) || header?.querySelector('[data-move]:not(:disabled)');button?.focus({preventScroll:true});}
    state.cleanup=clear;
  }
  draw();
}
global.TeacherCapabilityMatrix=Object.freeze({render:matrixHTML,mount,normalizeOrder,studentMatchesCapabilityEntry,renderCapabilityPortfolioCell});
})(window);
