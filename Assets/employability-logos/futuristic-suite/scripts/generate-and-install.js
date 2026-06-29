const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "../../../..");
const suiteRoot = path.resolve(__dirname, "..");
const svgDir = path.join(suiteRoot, "svg");
const pngDir = path.join(suiteRoot, "png");
const mainDir = path.join(suiteRoot, "main");
const previewDir = path.join(suiteRoot, "preview");

const colors = {
  teal: "#00718D",
  navy: "#1F2A55",
  gold: "#FFCF01",
  sky: "#5DC6EC",
  charcoal: "#414042",
  white: "#FFFFFF",
};

const categories = {
  communication: { title: "Communication", main: "1.0 Communication.png", slug: "communication", glyph: "chat" },
  "digital-literacy": { title: "Digital Literacy", main: "2.0 Digital Literacy.png", slug: "digital-literacy", glyph: "laptop" },
  teamwork: { title: "Teamwork", main: "3.0 Teamwork.png", slug: "teamwork", glyph: "team" },
  "time-management": { title: "Time Management", main: "4.0 Time Management.png", slug: "time-management", glyph: "clock" },
  "critical-thinking": { title: "Critical Thinking", main: "5.0 Critical Thinking.png", slug: "critical-thinking", glyph: "light" },
  "problem-solving": { title: "Problem-Solving", main: "6.0 Problem Solving.png", slug: "problem-solving", glyph: "puzzle" },
};

const logos = [
  ["1.0", "Communication", "communication", null, null],
  ["1.1", "Purpose, Audience and Format", "communication", "audience", "purpose-audience-format"],
  ["1.2", "Active Listening", "communication", "listen", "active-listening"],
  ["1.3", "Terminology, Spelling and Grammar", "communication", "abc", "terminology-spelling-grammar"],
  ["1.4", "Non-verbal Communication", "communication", "hand", "non-verbal-communication"],
  ["2.0", "Digital Literacy", "digital-literacy", null, null],
  ["2.1", "Online Safety", "digital-literacy", "lock", "online-safety"],
  ["2.3", "Reliable Online Research", "digital-literacy", "research", "reliable-online-research"],
  ["2.4", "Electronic Communication", "digital-literacy", "mail", "electronic-communication"],
  ["2.5", "Work-related Software", "digital-literacy", "apps", "work-related-software"],
  ["3.0", "Teamwork", "teamwork", null, null],
  ["3.1", "Team Roles and Responsibilities", "teamwork", "roles", "team-roles-and-responsibilities"],
  ["3.2", "Build Rapport", "teamwork", "rapport", "build-rapport"],
  ["3.3", "Reliability and Task Completion", "teamwork", "checklist", "reliability-and-task-completion"],
  ["3.4", "Consensus Building", "teamwork", "consensus", "consensus-building"],
  ["4.0", "Time Management", "time-management", null, null],
  ["4.1", "Plan and Prioritise", "time-management", "plan", "plan-and-prioritise"],
  ["4.2", "Productivity Tools", "time-management", "calendar", "productivity-tools"],
  ["4.3", "Track and Reassess", "time-management", "cycle", "track-and-reassess"],
  ["5.0", "Critical Thinking", "critical-thinking", null, null],
  ["5.1", "Research and Information Gathering", "critical-thinking", "document", "research-and-information-gathering"],
  ["5.2", "Analysis and Evaluation", "critical-thinking", "scales", "analysis-and-evaluation"],
  ["5.3", "Bias Reflection", "critical-thinking", "eye", "bias-reflection"],
  ["6.0", "Problem Solving", "problem-solving", null, null],
  ["6.1", "Questioning Techniques", "problem-solving", "question", "questioning-techniques"],
  ["6.2", "Generate Solutions", "problem-solving", "nodes", "generate-solutions"],
  ["6.3", "Decision-making Models", "problem-solving", "model", "decision-making-models"],
].map(([number, title, categoryId, badge, subskillId]) => ({ number, title, categoryId, badge, subskillId }));

const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const copy = (from, to) => {
  ensure(path.dirname(to));
  fs.copyFileSync(from, to);
};
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]));
const fileName = (item) => `${item.number} ${item.categoryId === "problem-solving" ? "Problem Solving" : categories[item.categoryId].title}.png`;
const svgName = (item) => fileName(item).replace(/\.png$/, ".svg");

function parentGlyph(kind) {
  const white = `fill="none" stroke="${colors.white}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"`;
  const sky = `fill="none" stroke="${colors.sky}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"`;
  const gold = `fill="none" stroke="${colors.gold}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"`;
  if (kind === "chat") return `<path d="M284 368Q284 284 376 284H638Q730 284 730 368V512Q730 596 638 596H468L344 700V596H376Q284 596 284 512Z" fill="#102044" fill-opacity=".66" stroke="${colors.white}" stroke-width="34" stroke-linejoin="round"/><path d="M410 428H612M410 500H548" ${sky}/><circle cx="374" cy="428" r="11" fill="${colors.gold}"/><circle cx="374" cy="500" r="11" fill="${colors.gold}"/>`;
  if (kind === "laptop") return `<path d="M292 318Q292 284 326 284H698Q732 284 732 318V570H292Z" fill="#102044" fill-opacity=".66" stroke="${colors.white}" stroke-width="32" stroke-linejoin="round"/><path d="M240 642H784L718 724H306Z" fill="#102044" fill-opacity=".76" stroke="${colors.white}" stroke-width="32" stroke-linejoin="round"/><path d="M360 380H664M360 448H560" ${sky}/><path d="M648 360L704 416L648 472" ${gold}/>`;
  if (kind === "team") return `<path d="M328 660Q344 552 452 552H572Q680 552 696 660" ${white}/><circle cx="512" cy="418" r="96" fill="#102044" fill-opacity=".62" stroke="${colors.white}" stroke-width="34"/><path d="M190 682Q204 590 292 590H382" ${sky}/><circle cx="312" cy="480" r="70" fill="#102044" fill-opacity=".52" stroke="${colors.sky}" stroke-width="28"/><path d="M642 590H732Q820 590 834 682" ${gold}/><circle cx="712" cy="480" r="70" fill="#102044" fill-opacity=".52" stroke="${colors.gold}" stroke-width="28"/>`;
  if (kind === "clock") return `<circle cx="512" cy="500" r="226" fill="#102044" fill-opacity=".58" stroke="${colors.white}" stroke-width="34"/><path d="M512 500L512 338M512 500L392 612" ${white}/><path d="M512 278V322M512 678V722M290 500H334M690 500H734" ${sky}/><path d="M690 300Q784 392 784 512" ${gold}/><path d="M765 504L790 536L816 498" ${gold}/>`;
  if (kind === "light") return `<path d="M512 238Q380 238 352 360Q330 456 412 540Q456 584 456 654H568Q568 584 612 540Q694 456 672 360Q644 238 512 238Z" fill="#102044" fill-opacity=".62" stroke="${colors.white}" stroke-width="32" stroke-linejoin="round"/><path d="M448 724H576M464 786H560" ${sky}/><path d="M430 420L492 482L606 360" ${gold}/><circle cx="512" cy="446" r="104" fill="none" stroke="${colors.sky}" stroke-opacity=".55" stroke-width="18"/>`;
  return `<path d="M314 292H530V464H704V704H488V546H314Z" fill="#102044" fill-opacity=".6" stroke="${colors.white}" stroke-width="32" stroke-linejoin="round"/><path d="M530 292H704V464H530ZM314 546H488V704H314Z" fill="none" stroke="${colors.sky}" stroke-width="28" stroke-linejoin="round"/><path d="M488 546H704V704H488Z" fill="none" stroke="${colors.gold}" stroke-width="28" stroke-linejoin="round"/><path d="M400 546Q438 506 488 546M488 628Q530 584 574 628" fill="none" stroke="${colors.white}" stroke-width="18" stroke-linecap="round"/>`;
}

function badgeGlyph(kind) {
  const w = `fill="none" stroke="${colors.white}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"`;
  const s = `fill="none" stroke="${colors.sky}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;
  const g = `fill="none" stroke="${colors.gold}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;
  const map = {
    audience: `<circle cx="-28" cy="-16" r="50" ${w}/><circle cx="-28" cy="-16" r="17" fill="${colors.gold}"/><path d="M20 30L76 0L20-30Z" fill="${colors.sky}" stroke="${colors.white}" stroke-width="10" stroke-linejoin="round"/><path d="M-92 72H6M-68 96H28" ${s}/>`,
    listen: `<path d="M-52 28Q-82-8-60-48Q-42-82 2-74Q42-66 44-24Q46 10 16 26Q-6 38 4 66Q14 92-18 94Q-42 96-52 70" ${w}/><path d="M66-54Q96-22 66 12M92-80Q142-22 92 40" ${g}/>`,
    abc: `<text x="-82" y="7" font-family="Arial,Helvetica,sans-serif" font-size="58" font-weight="900" fill="${colors.white}">ABC</text><path d="M-56 52H8" ${s}/><path d="M32 54L54 76L96 22" ${g}/>`,
    hand: `<path d="M-46 68V-12Q-46-34-24-34Q-4-34-4-12V-50Q-4-72 18-72Q40-72 40-50V-18Q40-40 62-40Q84-40 84-18V24Q84 72 34 90H-2Q-46 90-46 68Z" ${w}/><path d="M-86-42Q-114-10-88 22M-104-72Q-152-10-104 50" ${g}/>`,
    lock: `<path d="M0-86L82-52V8Q82 66 0 96Q-82 66-82 8V-52Z" ${w}/><rect x="-38" y="-2" width="76" height="58" rx="12" ${g}/><path d="M-24-2V-26Q-24-52 0-52Q24-52 24-26V-2" ${s}/>`,
    research: `<circle cx="-18" cy="-22" r="58" ${w}/><path d="M-76-22H40M-18-80Q-52-22-18 36M-18-80Q16-22-18 36" ${s}/><path d="M36 46L78 88" ${w}/><path d="M26 58L48 80L92 20" ${g}/>`,
    mail: `<rect x="-86" y="-52" width="142" height="98" rx="16" ${w}/><path d="M-82-42L-12 8L54-42" ${g}/><path d="M72-36Q102-4 72 28M96-62Q152-4 96 56" ${s}/>`,
    apps: `<rect x="-86" y="-64" width="74" height="58" rx="10" ${w}/><rect x="6" y="-64" width="74" height="58" rx="10" ${s}/><rect x="-40" y="16" width="118" height="74" rx="12" ${g}/><path d="M-18 68V42M18 68V28M54 68V50" ${w}/>`,
    roles: `<rect x="-86" y="-70" width="72" height="100" rx="12" ${w}/><rect x="14" y="-70" width="72" height="100" rx="12" ${s}/><path d="M-66-34H-36M34-34H66M-66-4H-34M34-4H66" ${g}/><circle cx="0" cy="62" r="32" ${w}/><path d="M0 36V88M-26 62H26" ${s}/>`,
    rapport: `<path d="M-84 8L-34-42Q-14-60 10-38L22-26" ${w}/><path d="M82-2L34-50Q14-68-10-42L-58 6" ${s}/><path d="M-44 22L-4 62Q18 84 44 58L86 16" ${g}/>`,
    checklist: `<rect x="-74" y="-74" width="118" height="144" rx="16" ${w}/><path d="M-42 8L-16 34L34-28" ${g}/><path d="M60 26A50 50 0 1 1 38 78" ${s}/><path d="M34 76H76V34" ${s}/>`,
    consensus: `<circle cx="-72" cy="-42" r="22" fill="${colors.gold}"/><circle cx="0" cy="-72" r="22" fill="${colors.sky}"/><circle cx="72" cy="-42" r="22" fill="${colors.white}"/><path d="M-72-20L-18 36M0-50V24M72-20L18 36" ${s}/><path d="M-44 46L-8 82L66 6" ${g}/>`,
    plan: `<path d="M-78-62H66M-78 0H30M-78 62H8" ${w}/><path d="M-98-62L-86-48L-62-78M-98 0L-86 14L-62-16M-98 62L-86 76L-62 46" ${g}/><path d="M56-42L96-20L56 2Z" fill="${colors.sky}" stroke="${colors.white}" stroke-width="10" stroke-linejoin="round"/>`,
    calendar: `<rect x="-78" y="-78" width="132" height="132" rx="18" ${w}/><path d="M-34-78V54M10-78V54M-78-34H54M-78 10H54" ${s}/><circle cx="66" cy="62" r="34" ${g}/><path d="M66 38V86M42 62H90" ${g}/>`,
    cycle: `<path d="M-70 50A88 88 0 0 1 60-58" ${w}/><path d="M58-58H10M58-58V-10" ${w}/><path d="M70-50A88 88 0 0 1-60 58" ${g}/><path d="M-58 58H-10M-58 58V10" ${g}/><path d="M-32 16L0-18L34 20" ${s}/>`,
    document: `<path d="M-66-80H28L70-38V64H-66Z" ${w}/><path d="M28-80V-38H70M-34-22H28M-34 18H42" ${s}/><circle cx="20" cy="48" r="34" fill="#102044" stroke="${colors.gold}" stroke-width="12"/><path d="M44 72L86 104" ${g}/>`,
    scales: `<path d="M0-82V80M-70-40H70" ${w}/><path d="M-70-40L-104 24H-36ZM70-40L36 24H104Z" ${s}/><path d="M-96 52H-44M44 52H96" ${s}/><path d="M-22 78L0 100L46 42" ${g}/>`,
    eye: `<path d="M-92-2Q0-82 92-2Q0 78-92-2Z" ${w}/><circle cx="0" cy="-2" r="34" ${s}/><path d="M50 50L88 88" ${s}/><path d="M-42-52L44 50" stroke="${colors.gold}" stroke-width="12" stroke-linecap="round"/>`,
    question: `<path d="M-78-34Q-78-78-24-78H32Q86-78 86-34V16Q86 60 32 60H-2L-54 96V60H-24Q-78 60-78 16Z" ${w}/><path d="M-12-20Q-4-48 28-42Q56-36 50-8Q46 12 16 20V38" ${g}/><circle cx="16" cy="66" r="8" fill="${colors.gold}"/>`,
    nodes: `<path d="M-74 64C-48 18-24 4 0-10C24-24 48-38 74-84" ${w}/><circle cx="-76" cy="66" r="22" fill="${colors.gold}"/><circle cx="0" cy="-10" r="22" fill="${colors.sky}"/><circle cx="74" cy="-84" r="22" fill="${colors.white}"/><path d="M-2 48Q-2 14 34 14Q70 14 70 48Q70 66 52 80V96H16V80Q-2 66-2 48Z" ${g}/>`,
    model: `<rect x="-34" y="-92" width="68" height="48" rx="10" ${w}/><rect x="-98" y="20" width="68" height="48" rx="10" ${s}/><rect x="30" y="20" width="68" height="48" rx="10" ${g}/><path d="M0-44V-4M0-4H-64V20M0-4H64V20" ${w}/><path d="M42 42L60 60L94 20" ${w}/>`,
  };
  return map[kind] || "";
}

function logoSvg(item) {
  const category = categories[item.categoryId];
  const tile = "M512 55L808 146Q855 161 872 208L962 508L872 816Q856 863 808 878L512 969L216 878Q168 863 152 816L62 508L152 208Q169 161 216 146Z";
  const badge = item.badge ? `<g transform="translate(725 725)"><circle r="170" fill="#07132E" fill-opacity=".42"/><circle r="158" fill="#102044" stroke="${colors.gold}" stroke-width="16"/><circle r="128" fill="${colors.teal}" fill-opacity=".5" stroke="${colors.sky}" stroke-width="5"/><g>${badgeGlyph(item.badge)}</g></g>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs><clipPath id="c"><path d="${tile}"/></clipPath><linearGradient id="bg" x1="100" y1="70" x2="900" y2="950" gradientUnits="userSpaceOnUse"><stop stop-color="#102044"/><stop offset=".5" stop-color="${colors.navy}"/><stop offset="1" stop-color="#053747"/></linearGradient><filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#07132E" flood-opacity=".35"/></filter></defs><g filter="url(#ds)"><path d="${tile}" fill="url(#bg)" stroke="${colors.sky}" stroke-width="14"/><g clip-path="url(#c)"><path d="M62 155H512L282 914L62 815Z" fill="${colors.gold}" opacity=".72"/><path d="M512 55L962 508L512 969Z" fill="${colors.teal}" opacity=".75"/><path d="M178 205L848 859" stroke="${colors.white}" stroke-opacity=".11" stroke-width="34"/><path d="M230 770L808 182" stroke="#102044" stroke-opacity=".36" stroke-width="24"/><path d="M136 500H306L360 446H514L570 390H822" fill="none" stroke="${colors.sky}" stroke-width="7" stroke-opacity=".58"/><path d="M204 704H394L450 760H672" fill="none" stroke="${colors.gold}" stroke-width="7" stroke-opacity=".5"/><circle cx="306" cy="500" r="12" fill="${colors.gold}"/><circle cx="514" cy="446" r="10" fill="${colors.sky}"/><circle cx="822" cy="390" r="11" fill="${colors.white}" fill-opacity=".75"/></g></g><g>${parentGlyph(category.glyph)}</g>${badge}</svg>`;
}

function wrap(text, max = 28) {
  const lines = [""];
  for (const word of text.split(/\s+/)) {
    const next = lines.at(-1) ? `${lines.at(-1)} ${word}` : word;
    if (next.length <= max) lines[lines.length - 1] = next;
    else if (lines.length < 2) lines.push(word);
    else lines[1] += ` ${word}`;
  }
  return lines;
}

function contactSheetSvg() {
  const cols = 5, cellW = 288, cellH = 340, headerH = 150;
  const rows = Math.ceil(logos.length / cols), width = cols * cellW, height = headerH + rows * cellH + 40;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#EAF6FA"/><rect x="24" y="24" width="${width - 48}" height="98" rx="18" fill="${colors.navy}"/><text x="52" y="66" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="800" fill="${colors.white}">Employability Skills - ECC Futuristic Logo Suite</text><text x="52" y="101" font-family="Arial,Helvetica,sans-serif" font-size="16" fill="${colors.sky}">Same parent skill + subset badge methodology, rebuilt with ECC navy, teal, sky blue and gold.</text>`;
  for (const [i, item] of logos.entries()) {
    const x = (i % cols) * cellW + 18, y = headerH + Math.floor(i / cols) * cellH;
    const b64 = fs.readFileSync(path.join(pngDir, fileName(item))).toString("base64");
    const lines = wrap(item.title);
    svg += `<rect x="${x}" y="${y}" width="${cellW - 36}" height="${cellH - 22}" rx="16" fill="${colors.white}" stroke="#C5D5E4"/><image href="data:image/png;base64,${b64}" x="${x + 32}" y="${y + 18}" width="${cellW - 100}" height="${cellW - 100}" preserveAspectRatio="xMidYMid meet"/><text x="${x + 126}" y="${y + 230}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="800" fill="${colors.navy}">${item.number}</text><text x="${x + 126}" y="${y + 260}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" fill="${colors.charcoal}">${esc(lines[0] || "")}</text><text x="${x + 126}" y="${y + 281}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" fill="${colors.charcoal}">${esc(lines[1] || "")}</text>`;
  }
  return `${svg}</svg>`;
}

async function generate() {
  [svgDir, pngDir, mainDir, previewDir].forEach(ensure);
  for (const item of logos) {
    const svg = logoSvg(item);
    fs.writeFileSync(path.join(svgDir, svgName(item)), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(pngDir, fileName(item)));
    if (!item.badge) {
      const slug = categories[item.categoryId].slug;
      copy(path.join(pngDir, fileName(item)), path.join(mainDir, `${slug}.png`));
      copy(path.join(svgDir, svgName(item)), path.join(mainDir, `${slug}.svg`));
    }
  }
  const sheet = contactSheetSvg();
  fs.writeFileSync(path.join(previewDir, "ecc-futuristic-employability-contact-sheet.svg"), sheet);
  await sharp(Buffer.from(sheet)).png().toFile(path.join(previewDir, "ecc-futuristic-employability-contact-sheet.png"));
}

function install() {
  for (const category of Object.values(categories)) {
    copy(path.join(mainDir, `${category.slug}.png`), path.join(root, "Assets/employability-logos/main", `${category.slug}.png`));
    copy(path.join(mainDir, `${category.slug}.png`), path.join(root, "remotion-est-scenes/public/est-assets/employability-logos", `${category.slug}.png`));
  }

  const numberedTargets = Object.fromEntries(logos.map((item) => [fileName(item), fileName(item)]));
  numberedTargets["2.4 Digital Literacy.png"] = "2.4 Digital LIteracy.png";
  for (const [src, dest] of Object.entries(numberedTargets)) {
    copy(path.join(pngDir, src), path.join(root, "Assets/Images and Animations/Employability Skill Logos", dest));
  }

  const remotionSubskills = {
    "communication-purpose-audience-format.png": "1.1 Communication.png",
    "communication-active-listening.png": "1.2 Communication.png",
    "communication-terminology-spelling-grammar.png": "1.3 Communication.png",
    "communication-non-verbal-communication.png": "1.4 Communication.png",
    "digital-literacy-online-safety.png": "2.1 Digital Literacy.png",
    "digital-literacy-reliable-online-research.png": "2.3 Digital Literacy.png",
    "digital-literacy-electronic-communication.png": "2.4 Digital Literacy.png",
    "digital-literacy-work-related-software.png": "2.5 Digital Literacy.png",
    "teamwork-team-roles-and-responsibilities.png": "3.1 Teamwork.png",
    "teamwork-build-rapport.png": "3.2 Teamwork.png",
    "teamwork-reliability-and-task-completion.png": "3.3 Teamwork.png",
    "teamwork-consensus-building.png": "3.4 Teamwork.png",
    "time-management-plan-and-prioritise.png": "4.1 Time Management.png",
    "time-management-productivity-tools.png": "4.2 Time Management.png",
    "time-management-track-and-reassess.png": "4.3 Time Management.png",
    "critical-thinking-research-and-information-gathering.png": "5.1 Critical Thinking.png",
    "critical-thinking-analysis-and-evaluation.png": "5.2 Critical Thinking.png",
    "critical-thinking-bias-reflection.png": "5.3 Critical Thinking.png",
    "problem-solving-questioning-techniques.png": "6.1 Problem Solving.png",
    "problem-solving-generate-solutions.png": "6.2 Problem Solving.png",
    "problem-solving-decision-making-models.png": "6.3 Problem Solving.png",
  };
  for (const [dest, src] of Object.entries(remotionSubskills)) {
    copy(path.join(pngDir, src), path.join(root, "remotion-est-scenes/public/est-assets/employability-subskills", dest));
  }
}

function writeMetadata() {
  fs.writeFileSync(path.join(suiteRoot, "README.md"), `# ECC Futuristic Employability Skill Logos

New ECC-style employability skill logos generated from the same parent skill + subset badge structure as the original suite.

- \`png/\`: all ${logos.length} transparent PNG logos
- \`svg/\`: editable SVG source files
- \`main/\`: six parent skill logos
- \`preview/ecc-futuristic-employability-contact-sheet.png\`: visual overview

The live app and Remotion asset folders have been updated with matching filenames.
`);
  fs.writeFileSync(path.join(suiteRoot, "manifest.json"), JSON.stringify({
    generatedAt: "2026-05-07",
    title: "SCSA Careers and Employability Skills",
    style: "ECC futuristic brand suite",
    methodology: "Each subset keeps the parent skill mark and adds a lower-right badge.",
    palette: colors,
    logos: logos.map((item) => ({
      number: item.number,
      title: item.title,
      categoryId: item.categoryId,
      subskillId: item.subskillId,
      badge: item.badge,
      png: `./png/${fileName(item)}`,
      svg: `./svg/${svgName(item)}`,
    })),
  }, null, 2));
}

generate()
  .then(() => {
    install();
    writeMetadata();
    console.log(`Generated and installed ${logos.length} ECC futuristic employability logos.`);
    console.log(path.join(previewDir, "ecc-futuristic-employability-contact-sheet.png"));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
