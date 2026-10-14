(function () {
  const DRAFT_KEY = "career-empire-student-job-drafts-v1";
  const form = document.getElementById("teacher-job-form");
  const preview = document.getElementById("job-preview");
  const statusLine = document.getElementById("builder-status");

  const avatarExample = {
    title: "Avatar Studio Art Parts Challenge",
    jobType: "Design and asset production",
    teacher: "Career Empire / Emmanuel College Careers",
    subjectArea: "Careers, digital media, design, visual communication",
    audience: "Students interested in digital design, illustration, games, media, or production work",
    dueDateLabel: "Open now",
    studentMission: "Choose one focused design pack, use the starter pieces, and submit clean artwork that matches the live avatar style.",
    whyItMatters: "Avatar Studio already works, but it needs a wider library of clean, inclusive, matching art layers before students can properly personalise their future-self avatar.",
    summary: "Create polished avatar spare parts that can plug into the Career Empire Avatar Studio.",
    alreadyHave: [
      "Working live Avatar Studio page",
      "Take 2 boy avatar layer stack on a 1280 x 720 px transparent canvas",
      "Smooth neutral base",
      "Current ECC pants, shirt and tie, blazer",
      "Black school shoes and brown shoes",
      "No-hair, brown hair, and black hair options",
      "Printable PDF brief and starter pieces ZIP"
    ],
    needed: [
      "More hair styles and colour packs",
      "Face details such as freckles, glasses, earrings, name badge, and eye colour overlays",
      "Uniform and career wardrobe options",
      "Girl or skirt-presentation starter pack",
      "Accessories and shop unlocks such as scarf, headphones, backpack, laptop bag, tool belt, watch, lanyard, and career gear"
    ],
    packs: [
      {
        name: "Hair Pack",
        need: ["Crop or short hair", "Curls", "Long hair", "Bun", "Head wrap or protective style", "Colour versions: black, brown, auburn, blonde, silver, teal"],
        alreadyHave: ["No-hair option", "Brown Take 2 hair", "Black Take 2 hair", "Starter buttons for planned styles"]
      },
      {
        name: "Face Pack",
        need: ["Eye colour overlays: brown, amber, green, grey, corrected blue if needed", "Freckles", "Glasses aligned to eyes and nose", "Small earrings", "Name badge"],
        alreadyHave: ["Neutral face baked into the current base", "Blue eyes baked into the current live base", "Planned buttons for extra face and eye options"]
      },
      {
        name: "Uniform And Career Wardrobe Pack",
        need: ["Summer dress", "Summer shirt and shorts", "Sports kit", "Interview blazer", "Health scrubs", "Hi-vis gear", "Hospitality or creative apron"],
        alreadyHave: ["Neutral smooth base", "Navy pants", "Shirt and tie", "ECC blazer", "Black and brown shoes"]
      },
      {
        name: "Accessories And Shop Unlocks Pack",
        need: ["Scarf", "Headphones", "Backpack", "Laptop bag", "Tool belt", "Watch or lanyard", "Career gear connected to jobs or training"],
        alreadyHave: ["Accessory buttons planned in the studio", "No active polished Take 2 accessory layer yet", "Shop unlock ideas ready for future economy use"]
      }
    ],
    deliverables: [
      "Final transparent PNG layers on the full 1280 x 720 px canvas",
      "One preview composite showing the part stacked on the avatar base",
      "Editable source file if available",
      "Asset notes with team name, pack type, file list, known issues, and suggested studio button label"
    ],
    acceptanceCriteria: [
      "Correct full canvas and transparent background",
      "Stacks cleanly on the current base",
      "No stray pixels, labels, background, or unwanted duplicate body parts",
      "Matches the Career Empire / ECC soft 3D student style",
      "Clear at full studio size and small dashboard-card size",
      "Inclusive, school-safe, and suitable for a careers learning game"
    ],
    resources: [
      { label: "Live Avatar Studio", url: "../avatar/index.html", type: "Live page" },
      { label: "Starter Pieces ZIP", url: "../../Assets/Images%20and%20Animations/Avatar%20Studio/student-handoff/avatar-studio-starter-pieces.zip", type: "Download" },
      { label: "PDF Design Brief", url: "../../output/pdf/avatar-studio-student-scope-of-works.pdf", type: "PDF" }
    ],
    skills: ["Visual design", "Digital illustration", "Attention to detail", "Production handover", "Inclusive design"],
    inScope: ["New hair, clothing, accessory, face-detail, or career-gear layers", "Clean recolours or redraws that match the original style", "Button labels, unlock names, and shop category suggestions", "Visual testing against the live non-login Avatar Studio page"],
    outOfScope: ["Changing the code", "Redesigning the whole avatar system", "Flattened full-character drawings when only one part is requested", "Copyrighted characters, celebrity likenesses, brand logos, watermarks, unsafe content, or ranking physical features"],
    submissionUrl: "https://forms.office.com/r/hn9grqUCjg",
    submissionLabel: "Submit through Microsoft Form",
    submissionDetails: "Use the Microsoft Form to submit your chosen pack. Name your files clearly and include any source files or share links requested in the form."
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function slugify(value) {
    return String(value || "student-job")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "student-job";
  }

  function linesToText(lines) {
    return Array.isArray(lines) ? lines.join("\n") : String(lines || "");
  }

  function listFromText(value) {
    return String(value || "")
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  function resourcesFromText(value) {
    return listFromText(value).map(line => {
      const [label, url, type] = line.split("|").map(part => part.trim());
      return {
        label: label || url || "Resource",
        url: url || label || "#",
        type: type || "Link"
      };
    });
  }

  function resourcesToText(resources) {
    return (resources || []).map(item => `${item.label || "Resource"} | ${item.url || "#"} | ${item.type || "Link"}`).join("\n");
  }

  function setField(name, value) {
    const field = form.elements[name];
    if (!field) return;
    field.value = Array.isArray(value) ? linesToText(value) : String(value || "");
  }

  function setPackFields(index, pack = {}) {
    setField(`pack${index}Name`, pack.name || "");
    setField(`pack${index}Need`, pack.need || []);
    setField(`pack${index}Have`, pack.alreadyHave || []);
    setField(`pack${index}SubmitUrl`, pack.submissionUrl || "");
  }

  function loadExample() {
    setField("title", avatarExample.title);
    setField("jobType", avatarExample.jobType);
    setField("teacher", avatarExample.teacher);
    setField("subjectArea", avatarExample.subjectArea);
    setField("audience", avatarExample.audience);
    setField("dueDateLabel", avatarExample.dueDateLabel);
    setField("studentMission", avatarExample.studentMission);
    setField("whyItMatters", avatarExample.whyItMatters);
    setField("summary", avatarExample.summary);
    setField("alreadyHave", avatarExample.alreadyHave);
    setField("needed", avatarExample.needed);
    setField("deliverables", avatarExample.deliverables);
    setField("acceptanceCriteria", avatarExample.acceptanceCriteria);
    setField("resources", resourcesToText(avatarExample.resources));
    setField("skills", avatarExample.skills);
    setField("inScope", avatarExample.inScope);
    setField("outOfScope", avatarExample.outOfScope);
    setField("submissionUrl", avatarExample.submissionUrl);
    setField("submissionLabel", avatarExample.submissionLabel);
    setField("submissionDetails", avatarExample.submissionDetails);
    [1, 2, 3, 4].forEach(index => setPackFields(index, avatarExample.packs[index - 1]));
    setStatus("Avatar example loaded. Adjust any fields, then save or copy the brief.");
    updatePreview();
  }

  function clearBuilder() {
    form.reset();
    [1, 2, 3, 4].forEach(index => setPackFields(index));
    setField("title", "");
    setField("jobType", "Design and asset production");
    setStatus("Form cleared. Start a fresh job brief or load the Avatar example.");
    updatePreview();
  }

  function collectPacks(data) {
    return [1, 2, 3, 4].map(index => {
      const name = data.get(`pack${index}Name`);
      const need = listFromText(data.get(`pack${index}Need`));
      const alreadyHave = listFromText(data.get(`pack${index}Have`));
      const submissionUrl = String(data.get(`pack${index}SubmitUrl`) || "").trim();
      if (!name && !need.length && !alreadyHave.length && !submissionUrl) return null;
      return {
        name: String(name || `Section ${index}`).trim(),
        need,
        alreadyHave,
        ...(submissionUrl ? { submissionUrl } : {})
      };
    }).filter(Boolean);
  }

  function buildJob() {
    const data = new FormData(form);
    const title = String(data.get("title") || "Untitled student job").trim();
    const submissionUrl = String(data.get("submissionUrl") || "").trim();
    const submissionLabel = String(data.get("submissionLabel") || "").trim();
    return {
      id: slugify(title),
      title,
      status: "Draft",
      priority: "Teacher to confirm",
      jobType: String(data.get("jobType") || "Student job").trim(),
      subjectArea: String(data.get("subjectArea") || "").trim(),
      audience: String(data.get("audience") || "").trim(),
      teacher: String(data.get("teacher") || "").trim(),
      dueDateLabel: String(data.get("dueDateLabel") || "").trim(),
      summary: String(data.get("summary") || "").trim(),
      whyItMatters: String(data.get("whyItMatters") || "").trim(),
      studentMission: String(data.get("studentMission") || "").trim(),
      skills: listFromText(data.get("skills")),
      alreadyHave: listFromText(data.get("alreadyHave")),
      needed: listFromText(data.get("needed")),
      packs: collectPacks(data),
      deliverables: listFromText(data.get("deliverables")),
      acceptanceCriteria: listFromText(data.get("acceptanceCriteria")),
      resources: resourcesFromText(data.get("resources")),
      scopeBoundaries: {
        inScope: listFromText(data.get("inScope")),
        outOfScope: listFromText(data.get("outOfScope"))
      },
      submission: {
        label: submissionLabel || (submissionUrl ? "Submit work" : "Teacher setup needed"),
        url: submissionUrl || "#teacher-setup-needed",
        details: String(data.get("submissionDetails") || "").trim()
      },
      draftSavedAt: new Date().toISOString()
    };
  }

  function readDrafts() {
    try {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
      return Array.isArray(drafts) ? drafts : [];
    } catch (_) {
      return [];
    }
  }

  function writeDrafts(drafts) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  }

  function saveDraft() {
    const job = buildJob();
    const drafts = readDrafts();
    const next = drafts.filter(item => item.id !== job.id);
    next.unshift(job);
    writeDrafts(next.slice(0, 20));
    setStatus("Draft saved to this browser. Open the Jobs Market to preview it on this device.");
  }

  function jobToMarkdown(job) {
    const list = items => (items || []).map(item => `- ${item}`).join("\n") || "- ";
    const packText = (job.packs || []).map(pack => [
      `### ${pack.name}`,
      "",
      "What is needed:",
      list(pack.need),
      "",
      "What already exists:",
      list(pack.alreadyHave),
      pack.submissionUrl ? `\nSubmit this section: ${pack.submissionUrl}` : ""
    ].join("\n")).join("\n\n");
    const resources = (job.resources || []).map(item => `- ${item.label}: ${item.url}`).join("\n") || "- ";
    return [
      `# ${job.title}`,
      "",
      `Job type: ${job.jobType || ""}`,
      `Teacher/client: ${job.teacher || ""}`,
      `Subject/course: ${job.subjectArea || ""}`,
      `Audience: ${job.audience || ""}`,
      `Due date: ${job.dueDateLabel || ""}`,
      "",
      "## Student Mission",
      job.studentMission || "",
      "",
      "## Why It Matters",
      job.whyItMatters || "",
      "",
      "## What Already Exists",
      list(job.alreadyHave),
      "",
      "## What Still Needs Doing",
      list(job.needed),
      "",
      "## Work Sections",
      packText || "- ",
      "",
      "## Deliverables",
      list(job.deliverables),
      "",
      "## Acceptance Criteria",
      list(job.acceptanceCriteria),
      "",
      "## Resources",
      resources,
      "",
      "## Submission",
      `${job.submission.label}: ${job.submission.url}`,
      job.submission.details || ""
    ].join("\n");
  }

  async function copyBrief() {
    const text = jobToMarkdown(buildJob());
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Brief copied to clipboard.");
    } catch (_) {
      setStatus("Could not access clipboard. Select the downloaded JSON option instead.");
    }
  }

  function downloadJson() {
    const job = buildJob();
    const blob = new Blob([JSON.stringify(job, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${job.id || "student-job"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus("JSON job brief downloaded.");
  }

  function emailBrief() {
    const job = buildJob();
    const subject = encodeURIComponent(`Student Jobs Market brief: ${job.title}`);
    const body = encodeURIComponent(jobToMarkdown(job));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function renderList(title, items) {
    if (!items || !items.length) return "";
    return `
      <div class="detail-block">
        <h4>${escapeHtml(title)}</h4>
        <ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    `;
  }

  function renderPreview(job) {
    const skills = (job.skills || []).slice(0, 5).map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join("");
    preview.innerHTML = `
      <header>
        <div>
          <span class="status-pill">${escapeHtml(job.status || "Draft")}</span>
          <span class="type-pill">${escapeHtml(job.jobType || "Student job")}</span>
        </div>
        <h3>${escapeHtml(job.title || "Untitled student job")}</h3>
        <p class="job-summary">${escapeHtml(job.summary || "Your market summary will appear here.")}</p>
      </header>
      <dl class="job-meta">
        <dt>Teacher</dt><dd>${escapeHtml(job.teacher || "Teacher to confirm")}</dd>
        <dt>Due</dt><dd>${escapeHtml(job.dueDateLabel || "Teacher to confirm")}</dd>
      </dl>
      <div>${skills}</div>
      ${renderList("What is needed", job.needed)}
    `;
  }

  function updatePreview() {
    renderPreview(buildJob());
  }

  function setStatus(message) {
    statusLine.textContent = message;
  }

  document.getElementById("load-avatar-example").addEventListener("click", loadExample);
  document.getElementById("clear-builder").addEventListener("click", clearBuilder);
  document.getElementById("save-draft").addEventListener("click", saveDraft);
  document.getElementById("copy-brief").addEventListener("click", copyBrief);
  document.getElementById("download-json").addEventListener("click", downloadJson);
  document.getElementById("email-brief").addEventListener("click", emailBrief);
  form.addEventListener("input", updatePreview);

  clearBuilder();
})();
