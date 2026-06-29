const AUTH_DEMO_STATE_KEY = "career-empire-auth-demo";
const FEEDBACK_FALLBACK_KEY = "career-empire-feedback-fallback";
const PLAYER_SESSION_KEY = "career-empire-session";
const SHOP_ASSET_IMAGE_BASE = "../Assets/Images and Animations/Global Shop/items";

const GLOBAL_ASSET_CATALOG = [
  { code: "study-desk", name: "Focused Study Desk", category: "study", cost: 900, icon: "🪑", benefit: "Supports planning-heavy tasks and a more stable learning setup." },
  { code: "laptop-upgrade", name: "Laptop Upgrade", category: "technology", cost: 1600, icon: "💻", benefit: "Improves research, online learning, and digital task readiness." },
  { code: "transport-pass", name: "Transport Pass", category: "mobility", cost: 700, icon: "🚌", benefit: "Helps placements, TAFE access, and work experience feel realistic and reachable." },
  { code: "wellbeing-pack", name: "Wellbeing Pack", category: "wellbeing", cost: 500, icon: "🌿", benefit: "Protects energy and balance while your pathway gets busier." },
  { code: "rental-upgrade", name: "Rental Upgrade", category: "housing", cost: 2200, icon: "🏠", benefit: "A more stable base that strengthens long-term pathway confidence." },
  { code: "iphone-upgrade", name: "iPhone Upgrade", category: "mobile-phones", cost: 1500, icon: "📱", benefit: "Boosts confidence, social status, and everyday organisation." },
  { code: "ps5-bundle", name: "PS5 Bundle", category: "fun", cost: 1300, icon: "🎮", benefit: "A fun flex purchase that makes the life sim feel more like real teen downtime." },
  { code: "festival-pass", name: "Summer Festival Pass", category: "experiences", cost: 580, icon: "🎟️", benefit: "Adds fun, memories, and social energy to the year you're building." },
  { code: "gym-membership", name: "Gym Membership", category: "wellbeing", cost: 720, icon: "🏋️", benefit: "Builds routine, energy, and confidence alongside your career goals." },
  { code: "sneaker-drop", name: "Limited Sneaker Drop", category: "clothes", cost: 460, icon: "👟", benefit: "A hype purchase that makes rewards feel personal and expressive." },
  { code: "tesla-fund", name: "Tesla Model 3 Fund", category: "cars", cost: 8500, icon: "🚗", benefit: "A dream-car savings target that feels aspirational and status-building." },
  { code: "ac-milan-membership", name: "AC Milan Membership", category: "fun", cost: 420, icon: "⚽", benefit: "A fun flex purchase that makes the life-build feel more personal." },
  { code: "pet-dog", name: "Rescue Puppy", category: "wellbeing", cost: 650, icon: "🐶", benefit: "Adds companionship and makes the life sim feel warmer and more human." },
  { code: "cat-companion", name: "Cat Companion", category: "wellbeing", cost: 520, icon: "🐱", benefit: "A calm little life upgrade that makes the world feel more lived in." },
  { code: "life-insurance", name: "Starter Life Insurance", category: "investments", cost: 1100, icon: "🛡️", benefit: "A grown-up security move that fits long-term planning and stability." },
  { code: "home-deposit", name: "First Home Deposit", category: "investments", cost: 5000, icon: "🏡", benefit: "A serious investment step toward future housing security and wealth building." }
].map(asset => ({ ...asset, imagePath: `${SHOP_ASSET_IMAGE_BASE}/${asset.code}.png` }));

const CATEGORY_META = {
  all: { label: "All", icon: "🛍️" },
  cars: { label: "Cars", icon: "🚗" },
  "mobile-phones": { label: "Mobile Phones", icon: "📱" },
  clothes: { label: "Clothes", icon: "👟" },
  investments: { label: "Investments", icon: "📈" },
  wellbeing: { label: "Wellbeing", icon: "🌿" },
  technology: { label: "Technology", icon: "💻" },
  study: { label: "Study", icon: "🪑" },
  mobility: { label: "Mobility", icon: "🚌" },
  housing: { label: "Housing", icon: "🏠" },
  fun: { label: "Fun", icon: "🎉" },
  experiences: { label: "Experiences", icon: "🎟️" }
};

const CATEGORY_IMAGE_FALLBACKS = {
  cars: "tesla-fund",
  "mobile-phones": "iphone-upgrade",
  clothes: "sneaker-drop",
  investments: "life-insurance",
  wellbeing: "wellbeing-pack",
  technology: "laptop-upgrade",
  study: "study-desk",
  mobility: "transport-pass",
  housing: "rental-upgrade",
  fun: "ps5-bundle",
  experiences: "festival-pass"
};

function getCategoryArtworkSrc(category) {
  if (category === "all") return "../Assets/Images and Animations/Global Shop/global-shop-student-hub.png";
  const fallbackCode = CATEGORY_IMAGE_FALLBACKS[category];
  return fallbackCode ? `${SHOP_ASSET_IMAGE_BASE}/${fallbackCode}.png` : "";
}

let activeCategory = "all";
let currentShopContext = null;
let pendingStoreImage = null;
let approvedStoreItems = [];

function readState() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_DEMO_STATE_KEY) || "{}");
  } catch (_) {
    return {};
  }
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_) {
    return fallback;
  }
}

function writePlayerSession(patch) {
  const next = { ...readJsonStorage(PLAYER_SESSION_KEY, {}), ...patch };
  localStorage.setItem(PLAYER_SESSION_KEY, JSON.stringify(next));
  return next;
}

function getStudentStorageKey(studentLogin = {}, session = {}) {
  return String(
    studentLogin.id ||
    studentLogin.username ||
    session.studentId ||
    session.username ||
    session.playerName ||
    "demo"
  );
}

function isUntrackedDemoStudent(studentLogin = {}, session = {}) {
  return Boolean(studentLogin.demo || session.demoMode || (studentLogin.preview && !studentLogin.id));
}

function sessionBelongsToStudent(studentLogin = {}, session = {}) {
  if (studentLogin.id && session.studentId) return String(studentLogin.id) === String(session.studentId);
  if (studentLogin.username && session.username) return String(studentLogin.username) === String(session.username);
  return true;
}

function getLocalOwnedAssets(studentLogin = {}, session = {}) {
  const ownerKey = getStudentStorageKey(studentLogin, session);
  const groupedAssets = session.ownedAssetsByStudent && typeof session.ownedAssetsByStudent === "object"
    ? session.ownedAssetsByStudent[ownerKey]
    : null;
  if (Array.isArray(groupedAssets)) return groupedAssets;
  if (sessionBelongsToStudent(studentLogin, session) && Array.isArray(session.ownedAssets)) return session.ownedAssets;
  return [];
}

function getAssetDedupeKey(asset = {}) {
  const purchasedAt = asset.purchased_at ? Date.parse(asset.purchased_at) : NaN;
  const timeBucket = Number.isNaN(purchasedAt) ? asset.id || "" : Math.floor(purchasedAt / 60000);
  return `${asset.asset_code || asset.code || ""}|${asset.purchase_cost || asset.cost || 0}|${timeBucket}`;
}

function mergeAssetLists(...assetLists) {
  const seen = new Set();
  return assetLists.flat().filter(Boolean).filter(asset => {
    const key = getAssetDedupeKey(asset);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createPurchasedAsset(asset) {
  const purchasedAt = new Date().toISOString();
  return {
    id: `local-${asset.code}-${Date.now()}`,
    asset_code: asset.code,
    asset_name: asset.name,
    asset_category: asset.category,
    purchase_cost: asset.cost,
    purchased_at: purchasedAt
  };
}

function persistLocalPurchase(context, nextAssets, nextNetWorth, nextSavings) {
  const authState = readState();
  const studentLogin = authState?.studentLogin || {};
  const session = readJsonStorage(PLAYER_SESSION_KEY, {});
  const ownerKey = getStudentStorageKey(studentLogin, session);
  const ownedAssetsByStudent = {
    ...(session.ownedAssetsByStudent && typeof session.ownedAssetsByStudent === "object" ? session.ownedAssetsByStudent : {}),
    [ownerKey]: nextAssets
  };

  return writePlayerSession({
    studentId: context.studentId || studentLogin.id || session.studentId || null,
    username: studentLogin.username || session.username || "",
    playerName: context.studentName || studentLogin.displayName || session.playerName || studentLogin.username || "Student",
    schoolName: context.schoolName || studentLogin.schoolName || session.schoolName || "",
    classCode: context.classCode || studentLogin.classCode || session.classCode || "",
    annualSalary: Number(context.profile?.annual_salary || 0),
    cumulativeNetWorth: nextNetWorth,
    savings: nextSavings,
    workLifeBalance: Number(context.profile?.work_life_balance || 0),
    jobSecurity: Number(context.profile?.job_security || 0),
    ownedAssets: nextAssets,
    ownedAssetsByStudent,
    checkpoint: "shop-purchase",
    demoMode: Boolean(context.isDemo),
    updatedAt: new Date().toISOString()
  });
}

function pushEconomyLog(entry = {}) {
  if (!window.CareerEmpireEconomy?.appendEvent) return [];
  return window.CareerEmpireEconomy.appendEvent(entry);
}

async function getSupabaseClientOrNull() {
  if (!window.CareerEmpireSupabase || typeof window.CareerEmpireSupabase.getClient !== "function") return null;
  try {
    return await window.CareerEmpireSupabase.getClient();
  } catch (_) {
    return null;
  }
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

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function getAssetCounts(assets) {
  return (assets || []).reduce((acc, asset) => {
    acc[asset.asset_code] = (acc[asset.asset_code] || 0) + 1;
    return acc;
  }, {});
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    label: String(category || "Other").replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase()),
    icon: "🧩"
  };
}

function getAssetImageSrc(asset) {
  if (asset?.image?.dataUrl) return asset.image.dataUrl;
  if (asset?.imagePath) return asset.imagePath;
  return getCategoryArtworkSrc(asset?.category);
}

function getAssetDisplay(asset) {
  const catalogAsset = getFullAssetCatalog().find(item => item.code === asset?.asset_code || item.code === asset?.code) || {};
  return {
    ...catalogAsset,
    code: asset?.asset_code || asset?.code || catalogAsset.code,
    name: asset?.asset_name || asset?.name || catalogAsset.name || "Shop item",
    category: asset?.asset_category || asset?.category || catalogAsset.category || "other",
    cost: Number(asset?.purchase_cost || asset?.cost || catalogAsset.cost || 0),
    image: asset?.image || catalogAsset.image,
    imagePath: asset?.imagePath || catalogAsset.imagePath,
    icon: catalogAsset.icon || asset?.icon || getCategoryMeta(asset?.asset_category || asset?.category).icon
  };
}

function renderAssetArtwork(asset, className = "shop-item-art") {
  const display = getAssetDisplay(asset);
  const imageSrc = getAssetImageSrc(display);
  const categoryMeta = getCategoryMeta(display.category);

  if (!imageSrc) {
    return `
      <div class="${className} shop-item-art--fallback">
        <span>${escapeHtml(display.icon || categoryMeta.icon)}</span>
      </div>
    `;
  }

  return `
    <div class="${className}">
      <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(display.name)} artwork">
      <span class="shop-art-chip">${escapeHtml(categoryMeta.label)}</span>
    </div>
  `;
}

function formatDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function getCatalogCategories() {
  const categories = [...new Set(getFullAssetCatalog().map(asset => asset.category))];
  const preferredOrder = ["all", "cars", "mobile-phones", "clothes", "investments", "wellbeing", "technology", "study", "mobility", "housing", "fun", "experiences"];
  const ordered = preferredOrder.filter(category => category === "all" || categories.includes(category));
  const extras = categories.filter(category => !ordered.includes(category)).sort();
  return [...ordered, ...extras];
}

function getFullAssetCatalog() {
  return [...GLOBAL_ASSET_CATALOG, ...approvedStoreItems];
}

function parseApprovedStoreRequest(row) {
  if (!row?.message || typeof row.message !== "string") return null;
  try {
    const payload = JSON.parse(row.message);
    if (payload.kind !== "store-item-request" || payload.status !== "approved" || !payload.approved_item) return null;
    return payload.approved_item;
  } catch (_) {
    return null;
  }
}

async function loadApprovedStoreItems() {
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    approvedStoreItems = [];
    return;
  }

  const { data, error } = await supabase
    .from("feedback_reports")
    .select("id, message")
    .eq("feedback_type", "store-item-request")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    approvedStoreItems = [];
    return;
  }

  const seenCodes = new Set();
  approvedStoreItems = (data || [])
    .map(parseApprovedStoreRequest)
    .filter(Boolean)
    .filter(item => {
      if (seenCodes.has(item.code)) return false;
      seenCodes.add(item.code);
      return true;
    });
}

function getLocalShopContext() {
  const authState = readState();
  const studentLogin = authState?.studentLogin || {};
  const session = readJsonStorage(PLAYER_SESSION_KEY, {});
  const isUntrackedDemo = isUntrackedDemoStudent(studentLogin, session);
  const studentName = studentLogin?.displayName || studentLogin?.username || session.playerName || session.studentName || "Demo Student";
  const schoolName = studentLogin?.schoolName || session.schoolName || "Career Empire Demo";
  const classCode = studentLogin?.classCode || session.classCode || "DEMO";
  const assets = getLocalOwnedAssets(studentLogin, session);

  return {
    studentId: isUntrackedDemo ? null : (studentLogin?.id || null),
    isDemo: true,
    studentName,
    schoolName,
    classCode,
    profile: {
      annual_salary: Number(session.annualSalary || 32000),
      cumulative_net_worth: Number(session.cumulativeNetWorth || session.savings || 0),
      savings: Number(session.savings || session.cumulativeNetWorth || 0),
      work_life_balance: Number(session.workLifeBalance || 70),
      job_security: Number(session.jobSecurity || 70)
    },
    assets
  };
}

async function loadStudentShopContext() {
  const authState = readState();
  const studentLogin = authState?.studentLogin || {};
  const studentId = studentLogin?.id;
  const session = readJsonStorage(PLAYER_SESSION_KEY, {});
  const localContext = getLocalShopContext();

  if (isUntrackedDemoStudent(studentLogin, session)) {
    return localContext;
  }

  if (!studentId && Object.keys(session).length) {
    return localContext;
  }

  if (!studentId) return null;

  const supabase = await getSupabaseClientOrNull();
  if (!supabase) return localContext;

  const [{ data: profile, error: profileError }, { data: assets, error: assetError }] = await Promise.all([
    supabase
      .from("player_profiles")
      .select("student_id, annual_salary, cumulative_net_worth, savings, work_life_balance, job_security")
      .eq("student_id", studentId)
      .maybeSingle(),
    supabase
      .from("player_assets")
      .select("id, asset_code, asset_name, asset_category, purchase_cost, purchased_at")
      .eq("student_id", studentId)
      .order("purchased_at", { ascending: false })
  ]);

  if (profileError) console.error(profileError);
  if (assetError) console.error(assetError);

  const localProfile = localContext.profile || {};
  const sessionIsCurrentStudent = sessionBelongsToStudent(studentLogin, session);
  const mergedProfile = {
    ...localProfile,
    ...(profile || {}),
    annual_salary: Number((profile?.annual_salary ?? localProfile.annual_salary) || 0),
    cumulative_net_worth: Number(
      sessionIsCurrentStudent && session.cumulativeNetWorth !== undefined
        ? session.cumulativeNetWorth
        : (profile?.cumulative_net_worth ?? localProfile.cumulative_net_worth) || 0
    ),
    savings: Number(
      sessionIsCurrentStudent && session.savings !== undefined
        ? session.savings
        : (profile?.savings ?? localProfile.savings) || 0
    ),
    work_life_balance: Number((profile?.work_life_balance ?? localProfile.work_life_balance) || 0),
    job_security: Number((profile?.job_security ?? localProfile.job_security) || 0)
  };

  return {
    studentId,
    isDemo: false,
    studentName: localContext.studentName,
    schoolName: localContext.schoolName,
    classCode: localContext.classCode,
    profile: mergedProfile,
    assets: mergeAssetLists(assets || [], localContext.assets || [])
  };
}

function renderShopHero(context) {
  const badges = document.getElementById("shop-badge-stack");
  if (!badges) return;
  if (!context) {
    badges.innerHTML = '<span class="badge">Log in as a student to use the global shop.</span>';
    return;
  }

  badges.innerHTML = [
    `<span class="badge">Student: ${escapeHtml(context.studentName)}</span>`,
    `<span class="badge">School: ${escapeHtml(context.schoolName || "School not set")}</span>`,
    `<span class="badge">Class: ${escapeHtml(context.classCode || "Class not set")}</span>`,
    context.isDemo ? '<span class="badge">Demo Mode: local only</span>' : ""
  ].join("");
}

function renderShopMetrics(context) {
  const profile = context?.profile || {};
  setText("shop-spendable", formatCurrency(profile.cumulative_net_worth || 0));
  setText("shop-assets-owned", String((context?.assets || []).length));
  setText("shop-salary", formatCurrency(profile.annual_salary || 0));
  setText("shop-net-worth", formatCurrency(profile.cumulative_net_worth || 0));
}

function renderOwnedInventory(context) {
  const container = document.getElementById("owned-shop-items");
  if (!container) return;
  const assets = context?.assets || [];
  if (!assets.length) {
    container.className = "owned-inventory-grid";
    container.innerHTML = `
      <div class="inventory-empty-state">
        <img src="../Assets/Images and Animations/Global Shop/global-shop-student-hub.png" alt="">
        <strong>No items owned yet</strong>
        <p>Use Megatrends or Lifelong Learning to build money, then buy your first upgrade here.</p>
      </div>
    `;
    return;
  }

  const assetCounts = getAssetCounts(assets);
  const totalSpendByCode = assets.reduce((acc, asset) => {
    acc[asset.asset_code] = (acc[asset.asset_code] || 0) + Number(asset.purchase_cost || 0);
    return acc;
  }, {});
  const latestByCode = new Map();
  assets.forEach(asset => {
    if (!latestByCode.has(asset.asset_code)) {
      latestByCode.set(asset.asset_code, asset);
    }
  });

  container.className = "owned-inventory-grid";
  container.innerHTML = [...latestByCode.values()].map(asset => {
    const display = getAssetDisplay(asset);
    const categoryMeta = getCategoryMeta(display.category);
    const count = assetCounts[display.code] || 1;
    const totalSpend = totalSpendByCode[display.code] || display.cost;
    const purchasedDate = formatDate(asset.purchased_at);

    return `
      <article class="inventory-card">
        ${renderAssetArtwork(display, "inventory-art")}
        <div class="inventory-card-body">
          <div class="kicker">${escapeHtml(categoryMeta.label)}</div>
          <h3>${escapeHtml(display.name)}</h3>
          <div class="inventory-stat-grid">
            <span><strong>${count}</strong> owned</span>
            <span><strong>${formatCurrency(totalSpend)}</strong> spent</span>
          </div>
          <p>${count > 1 ? `${formatCurrency(display.cost)} each` : `${formatCurrency(display.cost)} purchase`}${purchasedDate ? ` • Latest ${purchasedDate}` : ""}</p>
        </div>
      </article>
    `;
  }).join("");
}

async function buyGlobalAsset(asset, context) {
  if (!context?.profile) return;

  const currentWorth = Number(context.profile.cumulative_net_worth || 0);
  if (currentWorth < asset.cost) {
    alert(`You need ${formatCurrency(asset.cost - currentWorth)} more to buy ${asset.name}.`);
    return;
  }

  const purchasedAsset = createPurchasedAsset(asset);
  const nextAssets = mergeAssetLists([purchasedAsset], context.assets || []);
  const nextNetWorth = Math.max(0, currentWorth - asset.cost);
  const nextSavings = Math.max(0, Number(context.profile.savings || 0) - asset.cost);
  const nextContext = {
    ...context,
    profile: {
      ...context.profile,
      cumulative_net_worth: nextNetWorth,
      savings: nextSavings
    },
    assets: nextAssets
  };
  persistLocalPurchase(context, nextAssets, nextNetWorth, nextSavings);
  pushEconomyLog({
    eventType: "purchase",
    moduleId: "global-shop",
    checkpoint: "shop-purchase",
    label: asset.name,
    detail: `Purchased from the global shop for ${formatCurrency(asset.cost)}`,
    earnedDelta: 0,
    taxDelta: 0,
    spendDelta: asset.cost,
    annualSalaryAfter: Number(context.profile.annual_salary || 0),
    netWorthAfter: nextNetWorth,
    savingsAfter: nextSavings
  });
  renderShopPage(nextContext);

  const supabase = await getSupabaseClientOrNull();
  if (!supabase || context.isDemo || !context.studentId) return;

  const { error: assetError } = await supabase
    .from("player_assets")
    .insert({
      student_id: context.studentId,
      asset_code: asset.code,
      asset_name: asset.name,
      asset_category: asset.category,
      purchase_cost: asset.cost
    });

  if (assetError) {
    console.error(assetError);
    alert("Saved on this device. Live sync could not complete yet, so this purchase may need checking later.");
    return;
  }

  const { error: profileError } = await supabase
    .from("player_profiles")
    .upsert({
      student_id: context.studentId,
      updated_at: new Date().toISOString(),
      cumulative_net_worth: Math.max(0, currentWorth - asset.cost),
      savings: Math.max(0, Number(context.profile.savings || 0) - asset.cost)
    }, { onConflict: "student_id" });

  if (profileError) {
    console.error(profileError);
    alert("Your purchase is saved, but the live balance update needs checking.");
  }
}

function renderCategoryBar() {
  const container = document.getElementById("shop-category-bar");
  if (!container) return;
  const categories = getCatalogCategories();
  container.innerHTML = categories.map(category => {
    const meta = getCategoryMeta(category);
    const artworkSrc = getCategoryArtworkSrc(category);
    return `
      <button class="shop-category-pill ${category === activeCategory ? "active" : ""}" type="button" data-shop-category="${category}" aria-pressed="${category === activeCategory}">
        <span class="shop-category-icon">
          ${artworkSrc ? `<img src="${escapeHtml(artworkSrc)}" alt="">` : `<span>${escapeHtml(meta.icon)}</span>`}
        </span>
        <span class="shop-category-label">${escapeHtml(meta.label)}</span>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-shop-category]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.shopCategory;
      renderCategoryBar();
      renderShopGrid(currentShopContext);
    });
  });
}

function renderShopGrid(context) {
  const container = document.getElementById("shop-grid");
  if (!container) return;
  const ownedCounts = getAssetCounts(context?.assets || []);
  const currentWorth = Number(context?.profile?.cumulative_net_worth || 0);
  const catalog = getFullAssetCatalog();
  const filteredAssets = activeCategory === "all"
    ? catalog
    : catalog.filter(asset => asset.category === activeCategory);

  if (!filteredAssets.length) {
    container.innerHTML = '<div class="timeline-item"><strong>No items in this category yet</strong><p>Use the store request button to suggest what should be added next.</p></div>';
    return;
  }

  container.innerHTML = filteredAssets.map(asset => {
    const categoryMeta = getCategoryMeta(asset.category);
    const ownedCount = ownedCounts[asset.code] || 0;
    const canAfford = currentWorth >= asset.cost;
    return `
      <article class="module-card shop-item-card">
        ${renderAssetArtwork(asset)}
        <div class="shop-item-body">
          <div class="shop-item-topline">
            <div>
              <div class="kicker">${escapeHtml(categoryMeta.label)}</div>
              <h3>${escapeHtml(asset.name)}</h3>
            </div>
            <span class="shop-item-price">${formatCurrency(asset.cost)}</span>
          </div>
          <p>${escapeHtml(asset.benefit)}</p>
          <div class="pill-row">
            <span class="pill">Owned: ${ownedCount}</span>
            <span class="pill">${canAfford ? "Affordable" : `Need ${formatCurrency(asset.cost - currentWorth)}`}</span>
          </div>
          <div class="module-actions">
            <button class="module-link" type="button" data-buy-asset="${asset.code}" ${!canAfford ? "disabled" : ""}>
              ${ownedCount > 0 ? "Buy Another" : "Buy Item"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-buy-asset]").forEach(button => {
    button.addEventListener("click", async () => {
      const asset = getFullAssetCatalog().find(item => item.code === button.dataset.buyAsset);
      if (!asset) return;
      await buyGlobalAsset(asset, context);
    });
  });
}

async function submitFeedback(payload) {
  const supabase = await getSupabaseClientOrNull();
  if (supabase) {
    const { error } = await supabase.from("feedback_reports").insert(payload);
    if (error) throw error;
    return;
  }

  const existing = readJsonStorage(FEEDBACK_FALLBACK_KEY, []);
  existing.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...payload });
  localStorage.setItem(FEEDBACK_FALLBACK_KEY, JSON.stringify(existing));
}

function getStoreRequestStudentId(identity = {}) {
  const session = readJsonStorage(PLAYER_SESSION_KEY, {});
  return currentShopContext?.studentId || identity.id || identity.studentId || session.studentId || null;
}

function flagStoreRequestText(itemName, reason, identity = {}) {
  const moderation = window.CareerEmpireResponseModeration;
  if (!moderation || typeof moderation.flagResponseText !== "function") {
    return { flags: [], flagNotes: "" };
  }
  return moderation.flagResponseText(`${itemName}\n${reason}`, {
    student: {
      displayName: currentShopContext?.studentName || identity.displayName,
      username: identity.username
    }
  });
}

function createStoreRequestModal() {
  if (document.getElementById("shop-request-backdrop")) return;
  const backdrop = document.createElement("div");
  backdrop.className = "shop-request-backdrop";
  backdrop.id = "shop-request-backdrop";
  backdrop.innerHTML = `
    <div class="shop-request-card" role="dialog" aria-modal="true" aria-labelledby="shop-request-title">
      <h3 id="shop-request-title">Add an Item to the Store</h3>
      <p>Suggest a new shop item so Career Empire keeps growing with student ideas. Your request will be saved for teacher review before anything is added.</p>
      <div class="shop-request-grid">
        <div>
          <label for="shop-request-student">Student login</label>
          <input id="shop-request-student" type="text" readonly>
        </div>
        <div>
          <label for="shop-request-name">Item name</label>
          <input id="shop-request-name" type="text" placeholder="Example: Vintage Mustang Fund">
        </div>
        <div>
          <label for="shop-request-category">Category</label>
          <select id="shop-request-category">
            ${getCatalogCategories().filter(category => category !== "all").map(category => {
              const meta = getCategoryMeta(category);
              return `<option value="${category}">${escapeHtml(meta.label)}</option>`;
            }).join("")}
          </select>
        </div>
        <div>
          <label for="shop-request-message">Why should this be added?</label>
          <div class="shop-request-privacy-note">
            <strong>Note: your teacher can check anything you enter here.</strong>
            <span>Do not include surnames, student emails, phone numbers, social handles, exact workplace names, suburbs, addresses, or anything that identifies you or someone else. Use general wording such as "a fast-food workplace" or "a local retail store".</span>
          </div>
          <textarea id="shop-request-message" placeholder="Describe the item, why students would want it, and how it fits the shop."></textarea>
        </div>
        <div>
          <label for="shop-request-image">Optional photo</label>
          <input id="shop-request-image" type="file" accept="image/*">
          <p class="shop-request-note">Optional: upload a photo that represents the item. Keep it under 1 MB for now.</p>
        </div>
      </div>
      <div class="shop-request-actions">
        <button type="button" class="shop-request-primary" id="shop-request-submit">Send request</button>
        <button type="button" class="shop-request-secondary" id="shop-request-cancel">Cancel</button>
      </div>
      <div class="shop-request-status" id="shop-request-status"></div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) {
      closeStoreRequestModal();
    }
  });
}

function openStoreRequestModal() {
  const modal = document.getElementById("shop-request-backdrop");
  if (!modal) return;
  const studentInput = document.getElementById("shop-request-student");
  const nameInput = document.getElementById("shop-request-name");
  const categoryInput = document.getElementById("shop-request-category");
  const messageInput = document.getElementById("shop-request-message");
  const imageInput = document.getElementById("shop-request-image");
  const statusEl = document.getElementById("shop-request-status");

  if (studentInput) {
    studentInput.value = currentShopContext?.studentName || readState()?.studentLogin?.username || "Student";
  }
  if (nameInput) nameInput.value = "";
  if (categoryInput) categoryInput.value = "cars";
  if (messageInput) messageInput.value = "";
  if (imageInput) imageInput.value = "";
  if (statusEl) statusEl.textContent = "";
  pendingStoreImage = null;
  modal.classList.add("open");
}

function closeStoreRequestModal() {
  const modal = document.getElementById("shop-request-backdrop");
  if (modal) modal.classList.remove("open");
}

function bindStoreRequestActions() {
  const cancelButton = document.getElementById("shop-request-cancel");
  const submitButton = document.getElementById("shop-request-submit");
  const imageInput = document.getElementById("shop-request-image");

  document.querySelectorAll("[data-open-store-request]").forEach(button => {
    button.addEventListener("click", openStoreRequestModal);
  });
  if (cancelButton) {
    cancelButton.addEventListener("click", closeStoreRequestModal);
  }
  if (imageInput) {
    imageInput.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      const statusEl = document.getElementById("shop-request-status");
      pendingStoreImage = null;
      if (!file) return;
      if (file.size > 1024 * 1024) {
        if (statusEl) statusEl.textContent = "Please choose an image under 1 MB.";
        event.target.value = "";
        return;
      }
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      pendingStoreImage = {
        name: file.name,
        type: file.type,
        dataUrl
      };
      if (statusEl) statusEl.textContent = `Attached image: ${file.name}`;
    });
  }
  if (submitButton) {
    submitButton.addEventListener("click", submitStoreRequest);
  }
}

async function submitStoreRequest() {
  const identity = readState()?.studentLogin || {};
  const nameInput = document.getElementById("shop-request-name");
  const categoryInput = document.getElementById("shop-request-category");
  const messageInput = document.getElementById("shop-request-message");
  const statusEl = document.getElementById("shop-request-status");

  const studentId = getStoreRequestStudentId(identity);
  if (!studentId) {
    if (statusEl) statusEl.textContent = "Please log in as a student before suggesting store items.";
    return;
  }

  const itemName = nameInput?.value.trim() || "";
  const category = categoryInput?.value || "";
  const reason = messageInput?.value.trim() || "";

  if (!itemName || !reason) {
    if (statusEl) statusEl.textContent = "Please add an item name and tell us why it should be in the store.";
    return;
  }

  const flagged = flagStoreRequestText(itemName, reason, identity);
  const payload = {
    kind: "store-item-request",
    status: "pending_review",
    student_id: studentId,
    student_name: currentShopContext?.studentName || identity.displayName || identity.username || "Student",
    login_name: identity.username || currentShopContext?.studentName || "unknown",
    school_id: currentShopContext?.schoolId || identity.schoolId || identity.school_id || "",
    school_name: currentShopContext?.schoolName || identity.schoolName || "",
    class_id: currentShopContext?.classId || identity.classId || identity.class_id || "",
    class_code: currentShopContext?.classCode || identity.classCode || "",
    item_name: itemName,
    category,
    category_label: getCategoryMeta(category).label,
    reason,
    image: pendingStoreImage,
    flags: flagged.flags || [],
    flag_notes: flagged.flagNotes || "",
    submitted_at: new Date().toISOString()
  };

  if (statusEl) statusEl.textContent = "Sending request...";
  try {
    await submitFeedback({
      page_path: window.location.pathname,
      actor_role: "student",
      login_name: payload.login_name,
      feedback_type: "store-item-request",
      message: JSON.stringify(payload)
    });
    if (statusEl) statusEl.textContent = "Thanks. Your store item request has been saved for review.";
    setTimeout(closeStoreRequestModal, 800);
  } catch (error) {
    if (statusEl) statusEl.textContent = error.message || "The request could not be saved.";
  }
}

function renderBuildNote() {
  const note = document.getElementById("shop-build-note");
  if (!note) return;
  note.textContent = "Browse categories like cars, mobile phones, clothes, investments, wellbeing, and more. Students can now also suggest new items for teacher approval.";
}

function renderShopPage(context) {
  currentShopContext = context;
  renderShopHero(context);
  renderShopMetrics(currentShopContext);
  renderOwnedInventory(currentShopContext);
  renderBuildNote();
  renderCategoryBar();
  renderShopGrid(currentShopContext);
}

async function initShop() {
  renderShopPage(getLocalShopContext());
  createStoreRequestModal();
  bindStoreRequestActions();

  try {
    await loadApprovedStoreItems();
    renderCategoryBar();
    renderShopGrid(currentShopContext);
  } catch (error) {
    console.error(error);
    approvedStoreItems = [];
  }

  try {
    const studentContext = await loadStudentShopContext();
    renderShopPage(studentContext || currentShopContext);
  } catch (error) {
    console.error(error);
    renderShopPage(currentShopContext || getLocalShopContext());
  }
}

initShop().catch(console.error);
