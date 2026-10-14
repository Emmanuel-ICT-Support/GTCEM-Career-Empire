(function () {
  const DATA_PATH = "../../data/student-jobs-market.json";
  const DRAFT_KEY = "career-empire-student-job-drafts-v1";
  const marketList = document.getElementById("market-list");
  const draftsSection = document.getElementById("local-drafts-section");
  const draftsList = document.getElementById("local-drafts-list");
  const searchInput = document.getElementById("job-search");
  const typeFilter = document.getElementById("type-filter");
  const template = document.getElementById("job-card-template");

  let publishedJobs = [];

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function readDrafts() {
    try {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
      return Array.isArray(drafts) ? drafts : [];
    } catch (_) {
      return [];
    }
  }

  function list(items) {
    if (!items || !items.length) return "<p>Teacher to confirm.</p>";
    return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function externalLinkAttrs(url) {
    return /^https?:\/\//i.test(String(url || "")) ? ' target="_blank" rel="noopener"' : "";
  }

  function renderExistingAssets(assets, title = "Download Existing Pieces") {
    if (!assets || !assets.length) return "";
    return `
      <div class="existing-assets">
        <h5>${escapeHtml(title)}</h5>
        <div class="asset-download-grid">
          ${assets.map(asset => `
            <a class="asset-download-card" href="${escapeHtml(asset.url || asset.thumbnail || "#")}" download>
              <span class="asset-thumb">
                <img src="${escapeHtml(asset.thumbnail || asset.url || "")}" alt="${escapeHtml(asset.label || "Existing asset")}">
              </span>
              <span class="asset-copy">
                <strong>${escapeHtml(asset.label || "Existing asset")}</strong>
                ${asset.note ? `<small>${escapeHtml(asset.note)}</small>` : ""}
              </span>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderDetailBlock(title, items) {
    return `
      <section class="detail-block">
        <h4>${escapeHtml(title)}</h4>
        ${list(items)}
      </section>
    `;
  }

  function renderPack(pack, job) {
    const submitUrl = pack.submissionUrl || job.submission?.url;
    const submitLabel = pack.submissionLabel || (submitUrl ? `Submit ${pack.name || "this section"}` : (job.submission?.label || "Submit work"));
    return `
      <section class="pack-detail">
        <h4>${escapeHtml(pack.name)}</h4>
        <div>
          <strong>What is needed</strong>
          ${list(pack.need)}
        </div>
        <div>
          <strong>What already exists</strong>
          ${list(pack.alreadyHave)}
          ${renderExistingAssets(pack.existingAssets, "Download or morph these")}
        </div>
        ${submitUrl ? `<a class="submit-link" href="${escapeHtml(submitUrl)}"${externalLinkAttrs(submitUrl)}>${escapeHtml(submitLabel)}</a>` : ""}
      </section>
    `;
  }

  function renderResources(resources) {
    if (!resources || !resources.length) return "";
    return `
      <section class="detail-block">
        <h4>Resources</h4>
        <div class="resource-links">
          ${resources.map(item => `
            <a class="resource-link" href="${escapeHtml(item.url || "#")}"${externalLinkAttrs(item.url)}>
              ${escapeHtml(item.label || "Resource")}
              ${item.type ? `<span>&nbsp;(${escapeHtml(item.type)})</span>` : ""}
            </a>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderScope(scope) {
    if (!scope) return "";
    return `
      <section class="detail-block">
        <h4>Scope Boundaries</h4>
        <div class="pack-detail-grid">
          <div>
            <strong>In scope</strong>
            ${list(scope.inScope)}
          </div>
          <div>
            <strong>Out of scope</strong>
            ${list(scope.outOfScope)}
          </div>
        </div>
      </section>
    `;
  }

  function renderSubmission(job) {
    const submission = job.submission || {};
    const url = submission.url || "#teacher-setup-needed";
    return `
      <section class="detail-block">
        <h4>Submit Work</h4>
        <p>${escapeHtml(submission.details || "Use the teacher's class submission link when it is available.")}</p>
        <div class="job-actions">
          <a class="submit-link" href="${escapeHtml(url)}"${externalLinkAttrs(url)}>${escapeHtml(submission.label || "Submit work")}</a>
        </div>
      </section>
    `;
  }

  function renderJobCard(job) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.jobType = job.jobType || "";
    node.dataset.search = [
      job.title,
      job.summary,
      job.jobType,
      job.subjectArea,
      job.audience,
      ...(job.skills || []),
      ...(job.needed || [])
    ].join(" ").toLowerCase();
    node.querySelector(".status-pill").textContent = job.status || "Open";
    node.querySelector(".type-pill").textContent = job.jobType || "Student job";
    node.querySelector("h3").textContent = job.title || "Untitled student job";
    node.querySelector(".job-summary").textContent = job.summary || job.studentMission || "Teacher to confirm.";
    node.querySelector(".job-meta").innerHTML = `
      <dt>Teacher</dt><dd>${escapeHtml(job.teacher || "Teacher to confirm")}</dd>
      <dt>Subject</dt><dd>${escapeHtml(job.subjectArea || "Open")}</dd>
      <dt>Due</dt><dd>${escapeHtml(job.dueDateLabel || "Teacher to confirm")}</dd>
      <dt>Audience</dt><dd>${escapeHtml(job.audience || "Open to interested students")}</dd>
    `;
    const skills = (job.skills || []).map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("");
    const packs = job.packs && job.packs.length
      ? `<section class="detail-block"><h4>Job Sections</h4><div class="pack-detail-grid">${job.packs.map(pack => renderPack(pack, job)).join("")}</div></section>`
      : "";
    node.querySelector(".job-detail").innerHTML = `
      <section class="detail-block">
        <h4>Student Mission</h4>
        <p>${escapeHtml(job.studentMission || "Teacher to confirm.")}</p>
      </section>
      <section class="detail-block">
        <h4>Why It Matters</h4>
        <p>${escapeHtml(job.whyItMatters || "Teacher to confirm.")}</p>
      </section>
      ${skills ? `<section class="detail-block"><h4>Skills</h4><div>${skills}</div></section>` : ""}
      <section class="detail-block">
        <h4>What Already Exists</h4>
        ${list(job.alreadyHave)}
        ${renderExistingAssets(job.existingAssets)}
      </section>
      ${renderDetailBlock("What Still Needs Doing", job.needed)}
      ${packs}
      ${renderDetailBlock("Deliverables", job.deliverables)}
      ${renderDetailBlock("Acceptance Criteria", job.acceptanceCriteria)}
      ${renderScope(job.scopeBoundaries)}
      ${renderResources(job.resources)}
      ${renderSubmission(job)}
    `;
    return node;
  }

  function matchesFilters(job) {
    const query = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const searchText = [
      job.title,
      job.summary,
      job.studentMission,
      job.jobType,
      job.subjectArea,
      job.audience,
      ...(job.skills || []),
      ...(job.needed || [])
    ].join(" ").toLowerCase();
    return (!query || searchText.includes(query)) && (!type || job.jobType === type);
  }

  function renderJobs(target, jobs) {
    target.innerHTML = "";
    const filtered = jobs.filter(matchesFilters);
    if (!filtered.length) {
      target.innerHTML = `<p class="empty-state">No jobs match the current filters.</p>`;
      return;
    }
    const fragment = document.createDocumentFragment();
    filtered.forEach(job => fragment.appendChild(renderJobCard(job)));
    target.appendChild(fragment);
  }

  function populateTypeFilter(jobs) {
    const current = typeFilter.value;
    const types = [...new Set(jobs.map(job => job.jobType).filter(Boolean))].sort();
    typeFilter.innerHTML = `<option value="">All job types</option>${types.map(type => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}`;
    if (types.includes(current)) typeFilter.value = current;
  }

  function renderAll() {
    const drafts = readDrafts();
    populateTypeFilter([...publishedJobs, ...drafts]);
    renderJobs(marketList, publishedJobs);
    if (drafts.length) {
      draftsSection.hidden = false;
      renderJobs(draftsList, drafts);
    } else {
      draftsSection.hidden = true;
      draftsList.innerHTML = "";
    }
  }

  async function loadMarket() {
    try {
      const response = await fetch(DATA_PATH, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load jobs data");
      const data = await response.json();
      publishedJobs = Array.isArray(data.jobs) ? data.jobs : [];
    } catch (error) {
      publishedJobs = [];
      marketList.innerHTML = `<p class="empty-state">Could not load the published jobs data. Try refreshing the page.</p>`;
    }
    renderAll();
  }

  searchInput.addEventListener("input", renderAll);
  typeFilter.addEventListener("change", renderAll);
  loadMarket();
})();
