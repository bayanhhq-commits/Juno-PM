const PATHS = {
  "Fast Validation": {
    color: "#0e9f91",
    use: "Low-risk, reversible ideas with strong evidence",
    stages: ["Evidence", "Prototype", "MVP", "Launch", "Measure"]
  },
  "Standard Product": {
    color: "#315bf3",
    use: "New capabilities with moderate uncertainty",
    stages: ["Discovery", "Prototype", "POC", "MVP", "Beta", "GA", "Measure"]
  },
  "High-Risk": {
    color: "#a15d08",
    use: "AI, compliance, privacy, or one-way-door decisions",
    stages: ["Discovery", "Risk review", "POC", "Alpha", "Closed beta", "Gradual rollout", "GA", "Measure"]
  },
  "Reliability Fix": {
    color: "#b33a45",
    use: "Confirmed defects and workflow blockers",
    stages: ["Diagnose", "Fix", "Regression & UAT", "Gradual rollout", "GA", "Monitor"]
  }
};

const ARTIFACTS = [
  ["opportunityBrief", "Opportunity brief"],
  ["onePager", "One-page PRD"],
  ["fullPrd", "Full PRD"],
  ["prototype", "Prototype brief"],
  ["epic", "Epic"],
  ["stories", "User stories"],
  ["analytics", "Analytics plan"],
  ["uat", "UAT plan"],
  ["gtm", "GTM plan"],
  ["rollout", "Rollout checklist"],
  ["releaseNotes", "Release notes"],
  ["manual", "User manual"],
  ["postLaunch", "Post-launch review"]
];

const LABS = [
  ["M1", "Prompt & prototype"],
  ["M2", "Strategy & decision"],
  ["M3", "RAG & AI PRD"],
  ["M4", "Flow & trust"],
  ["M5", "Agent & control"]
];

const VIEW_META = {
  command: ["Autonomous workspace", "Juno Agent", "Start Juno Agent"],
  knowledge: ["Evidence layer", "Knowledge & Usage", "Index approved sources"],
  opportunities: ["Decision layer", "Opportunities", "Recalculate priorities"],
  roadmap: ["Planning layer", "Roadmap Studio", "Save roadmap version"],
  pack: ["Definition layer", "Product Pack", "Generate full product pack"],
  launch: ["Release layer", "Launch Center", "Approve release gate"],
  audit: ["Governance layer", "Control & Audit", "Export snapshot"]
};

const DEFAULT_CHECKS = {
  "Product & UAT": [
    "Acceptance criteria passed",
    "Critical user journeys tested",
    "No open severity-one defect"
  ],
  "Analytics": [
    "Success metrics confirmed",
    "Events and dashboards validated",
    "Baseline captured"
  ],
  "GTM & Enablement": [
    "Audience and message approved",
    "Support team enabled",
    "User guide reviewed"
  ],
  "Rollout & Recovery": [
    "Rollout segments defined",
    "Rollback trigger tested",
    "Owner and escalation channel assigned"
  ],
  "Post-launch": [
    "Monitoring window scheduled",
    "Feedback collection ready",
    "Decision review date booked"
  ]
};

const SAMPLE = {
  currentView: "command",
  mode: "Quality Mode",
  killed: false,
  indexed: false,
  sources: [
    {id: "M1-01", type: "System prompt", title: "Juno system prompt", detail: "Role, grounding rules, refusal conditions", date: "2026-08-18", approved: true},
    {id: "M2-01", type: "Strategy", title: "AI strategy one-pager", detail: "Copilot autonomy, Buy + Ground, pilot metrics", date: "2026-08-25", approved: true},
    {id: "M3-01", type: "PRD", title: "Juno AI PRD", detail: "RAG, citations, evidence gate, permissions", date: "2026-08-27", approved: true},
    {id: "M4-01", type: "User flow", title: "AI-native user flow", detail: "Review, challenge, approve, safe failure", date: "2026-08-29", approved: true},
    {id: "M5-01", type: "AWSpec", title: "Agent workflow specification", detail: "Boundaries, approval gates, rollback controls", date: "2026-09-01", approved: true},
    {id: "E-201", type: "Support ticket", title: "CSV export failure", detail: "Export freezes and users resort to screenshots", date: "2026-09-01", approved: true},
    {id: "E-202", type: "Interview", title: "Manual export workaround", detail: "Failure costs PMs around two hours each week", date: "2026-09-01", approved: true}
  ],
  usage: [
    {module: "Course Player", users: 920, active: 801, completion: 84},
    {module: "Assignments", users: 740, active: 542, completion: 73},
    {module: "Reports & Export", users: 510, active: 386, completion: 48},
    {module: "Discussion", users: 430, active: 161, completion: 37},
    {module: "AI Recommendations", users: 190, active: 92, completion: 61}
  ],
  opportunities: [
    {
      id: "OPP-001",
      title: "Fix CSV export reliability",
      problem: "PMs cannot reliably export reports and use screenshots as a manual workaround.",
      evidence: 5, impact: 5, strategy: 4, urgency: 5, effort: 2, risk: 2,
      sourceIds: ["E-201", "E-202"], lane: "Now", path: "Reliability Fix", stage: 1,
      owner: "Product + Platform", status: "Ready for approval"
    },
    {
      id: "OPP-002",
      title: "Reduce new-user onboarding drop-off",
      problem: "Learners reach course assignment but do not complete the first learning action.",
      evidence: 4, impact: 5, strategy: 4, urgency: 4, effort: 3, risk: 2,
      sourceIds: ["M3-01", "M4-01"], lane: "Now", path: "Standard Product", stage: 1,
      owner: "Learning Experience", status: "Discovery"
    },
    {
      id: "OPP-003",
      title: "AI course recommendation engine",
      problem: "Learners struggle to identify the most relevant next course.",
      evidence: 3, impact: 4, strategy: 5, urgency: 3, effort: 4, risk: 4,
      sourceIds: ["M2-01", "M3-01"], lane: "Next", path: "High-Risk", stage: 2,
      owner: "AI Product", status: "POC"
    },
    {
      id: "OPP-004",
      title: "Dark mode refresh",
      problem: "A stakeholder requested a visual refresh without direct user evidence.",
      evidence: 1, impact: 2, strategy: 2, urgency: 1, effort: 3, risk: 2,
      sourceIds: [], lane: "Later", path: "Fast Validation", stage: 0,
      owner: "Experience", status: "Insufficient evidence"
    }
  ],
  artifacts: {},
  launchChecks: {},
  launchApproved: {},
  selectedArtifact: "opportunityBrief",
  selectedPackItem: "OPP-001",
  selectedLaunchItem: "OPP-001",
  versions: [],
  events: []
};

const STORAGE_KEY = "juno-product-os-v3";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let state = loadState();
let toastTimer;

function clone(value) {
  return structuredClone(value);
}

function freshState() {
  const next = clone(SAMPLE);
  for (const opportunity of next.opportunities) {
    next.launchChecks[opportunity.id] = buildChecks();
    next.launchApproved[opportunity.id] = false;
  }
  return next;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return freshState();
    const parsed = JSON.parse(stored);
    return {...freshState(), ...parsed};
  } catch {
    return freshState();
  }
}

function buildChecks() {
  return Object.fromEntries(
    Object.entries(DEFAULT_CHECKS).map(([category, items]) => [
      category,
      items.map((label) => ({label, done: false}))
    ])
  );
}

function snapshot() {
  return {
    mode: state.mode,
    indexed: state.indexed,
    sources: clone(state.sources),
    usage: clone(state.usage),
    opportunities: clone(state.opportunities),
    artifacts: clone(state.artifacts),
    launchChecks: clone(state.launchChecks),
    launchApproved: clone(state.launchApproved),
    selectedPackItem: state.selectedPackItem,
    selectedLaunchItem: state.selectedLaunchItem
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const label = $("#saveState");
  label.textContent = "Saved locally";
  label.classList.add("flash");
  setTimeout(() => label.classList.remove("flash"), 450);
}

function now() {
  return new Date().toLocaleString([], {
    month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit"
  });
}

function logEvent(action, object, outcome) {
  state.events.push({id: crypto.randomUUID(), time: now(), action, object, outcome});
  saveState();
  renderAudit();
}

function captureVersion(label, approval = "draft") {
  const version = {
    id: `v${state.versions.length + 1}`,
    label,
    approval,
    time: now(),
    snapshot: snapshot()
  };
  state.versions.push(version);
  saveState();
  return version;
}

function restoreVersion(version, label = `Restore ${version.id}`) {
  const history = state.versions;
  const events = state.events;
  const view = state.currentView;
  Object.assign(state, clone(version.snapshot));
  state.versions = history;
  state.events = events;
  state.currentView = view;
  state.killed = false;
  const restored = captureVersion(label, "restored");
  logEvent("Restore", version.id, `${restored.id} created; history preserved`);
  renderAll();
  toast(`Restored ${version.id} through a new version.`);
}

function guard(actionName) {
  if (!state.killed) return true;
  toast(`${actionName} is blocked while the kill switch is active.`);
  return false;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2600);
}

function priorityColor(priority) {
  return {P0: "#b33a45", P1: "#315bf3", P2: "#0e9f91", P3: "#7b8794"}[priority];
}

function calculateScore(item) {
  const weighted =
    item.impact * 0.30 +
    item.evidence * 0.25 +
    item.strategy * 0.20 +
    item.urgency * 0.15 -
    item.effort * 0.05 -
    item.risk * 0.05;
  return Math.max(0, Math.min(100, Math.round((weighted / 4.25) * 100)));
}

function calculatePriority(item) {
  if (item.evidence <= 1 || item.sourceIds.length === 0) return "P3";
  const score = calculateScore(item);
  if (score >= 85) return "P0";
  if (score >= 70) return "P1";
  if (score >= 50) return "P2";
  return "P3";
}

function getOpportunity(id) {
  return state.opportunities.find((item) => item.id === id);
}

function setView(view) {
  state.currentView = view;
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  const [eyebrow, title, action] = VIEW_META[view];
  $("#viewEyebrow").textContent = eyebrow;
  $("#viewTitle").textContent = title;
  $("#primaryAction").textContent = action;
  saveState();
}

function renderMetrics() {
  const approvedSources = state.sources.filter((source) => source.approved).length;
  const recommended = state.opportunities.filter((item) => ["P0", "P1", "P2"].includes(calculatePriority(item))).length;
  const generated = Object.values(state.artifacts).reduce((total, pack) => total + Object.keys(pack).length, 0);
  const metrics = [
    ["Approved sources", approvedSources, `${state.indexed ? "Indexed" : "Awaiting indexing"}`],
    ["Roadmap candidates", state.opportunities.length, `${recommended} evidence-backed`],
    ["Artifacts generated", generated, "Across the product lifecycle"],
    ["Release readiness", `${releaseReadiness(state.selectedLaunchItem)}%`, state.launchApproved[state.selectedLaunchItem] ? "Release approved" : "Approval required"]
  ];
  $("#portfolioMetrics").innerHTML = metrics.map(([label, value, note]) => `
    <article class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>
  `).join("");
}

function renderLifecycle() {
  const steps = [
    ["01", "Knowledge", "Modules, usage, feedback"],
    ["02", "Prioritize", "Evidence and scoring"],
    ["03", "Roadmap", "Path and sequencing"],
    ["04", "Define", "PRD and delivery pack"],
    ["05", "Launch", "UAT, GTM, rollout"],
    ["06", "Learn", "Usage and outcomes"]
  ];
  $("#lifecycleOverview").innerHTML = steps.map(([number, title, note]) => `
    <article class="life-step"><span>${number}</span><strong>${title}</strong><small>${note}</small></article>
  `).join("");
}

function renderInvestments() {
  $("#investmentList").innerHTML = state.opportunities
    .filter((item) => item.lane !== "Later")
    .map((item) => {
      const path = PATHS[item.path];
      const progress = Math.round(((item.stage + 1) / path.stages.length) * 100);
      return `
        <div class="investment">
          <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.status)}</small></span>
          <span><small>${escapeHtml(item.path)}</small><div class="mini-progress"><i style="width:${progress}%"></i></div></span>
          <span class="badge">${calculatePriority(item)} · ${calculateScore(item)}</span>
        </div>
      `;
    }).join("");
}

function renderLabMap() {
  $("#labMap").innerHTML = LABS.map(([module, label]) => `
    <div class="lab-item"><strong>${module}</strong><small>${escapeHtml(label)}</small></div>
  `).join("");
}

function renderSources() {
  $("#sourceCount").textContent = `${state.sources.length} sources`;
  $("#sourceLibrary").innerHTML = state.sources.map((source) => `
    <article class="source-card">
      <span class="source-icon">${escapeHtml(source.id.split("-")[0])}</span>
      <span><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.type)} · ${escapeHtml(source.date)}<br>${escapeHtml(source.detail)}</small></span>
      <span class="source-status">${source.approved ? "Approved" : "Needs review"}</span>
    </article>
  `).join("");
  const checks = [
    ["Source identity", state.sources.every((source) => source.id), "Every item has a source ID"],
    ["Permissions", state.sources.every((source) => typeof source.approved === "boolean"), "Approval state is explicit"],
    ["Freshness", state.sources.every((source) => source.date), "Dates are available"],
    ["Traceability", state.sources.length > 0, "Evidence can be cited"]
  ];
  $("#sourceChecks").innerHTML = checks.map(([title, pass, detail]) => `
    <div class="check-item"><i>${pass ? "✓" : "!"}</i><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></span></div>
  `).join("");
  $("#readinessBadge").textContent = checks.every((check) => check[1]) ? "Ready" : "Needs review";
  $("#readinessBadge").className = `badge ${checks.every((check) => check[1]) ? "green" : "amber"}`;
}

function usageSignal(item) {
  if (item.completion >= 75) return ["Healthy", "good"];
  if (item.completion >= 50) return ["Watch", "watch"];
  return ["Drop-off risk", "risk"];
}

function renderUsage() {
  const totalUsers = Math.max(...state.usage.map((item) => item.users), 0);
  const active = state.usage.reduce((sum, item) => sum + item.active, 0);
  const average = state.usage.length
    ? Math.round(state.usage.reduce((sum, item) => sum + item.completion, 0) / state.usage.length)
    : 0;
  $("#usageSummary").innerHTML = [
    ["Unique reach", totalUsers.toLocaleString()],
    ["Module sessions", active.toLocaleString()],
    ["Avg completion", `${average}%`]
  ].map(([label, value]) => `<div class="usage-stat"><small>${label}</small><strong>${value}</strong></div>`).join("");
  $("#usageTable").innerHTML = state.usage.map((item) => {
    const [label, css] = usageSignal(item);
    return `<tr><td><strong>${escapeHtml(item.module)}</strong></td><td>${item.users}</td><td>${item.active}</td><td>${item.completion}%</td><td><span class="signal ${css}">${label}</span></td></tr>`;
  }).join("");
}

function renderOpportunities() {
  $("#opportunityGrid").innerHTML = state.opportunities.map((item) => {
    const priority = calculatePriority(item);
    const score = calculateScore(item);
    const evidenceStatus = item.sourceIds.length ? `${item.sourceIds.length} cited sources` : "No direct evidence";
    return `
      <article class="opportunity-card" style="--priority:${priorityColor(priority)}">
        <div class="opp-top"><span class="priority-tag" style="--priority:${priorityColor(priority)}">${priority}</span><span class="opp-status">${escapeHtml(item.status)}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.problem)}</p>
        <div class="score-grid">
          <div class="score-cell"><strong>${score}</strong><small>Total score</small></div>
          <div class="score-cell"><strong>${item.impact}/5</strong><small>Impact</small></div>
          <div class="score-cell"><strong>${item.evidence}/5</strong><small>Evidence</small></div>
        </div>
        <div class="evidence-line"><span>${escapeHtml(evidenceStatus)}</span><span>${escapeHtml(item.owner)}</span></div>
        <select data-item-path="${item.id}" aria-label="Lifecycle path for ${escapeHtml(item.title)}">
          ${Object.keys(PATHS).map((path) => `<option ${path === item.path ? "selected" : ""}>${escapeHtml(path)}</option>`).join("")}
        </select>
      </article>
    `;
  }).join("");
}

function renderPathLegend() {
  $("#pathLegend").innerHTML = Object.entries(PATHS).map(([name, path]) => `
    <div class="path-key" style="--path:${path.color}"><i></i><strong>${escapeHtml(name)}</strong><small>${escapeHtml(path.use)}</small></div>
  `).join("");
}

function renderRoadmap() {
  const lanes = ["Now", "Next", "Later"];
  $("#roadmapBoard").innerHTML = lanes.map((lane) => {
    const items = state.opportunities.filter((item) => item.lane === lane);
    return `
      <section class="roadmap-column">
        <div class="column-head"><strong>${lane}</strong><span>${items.length} item${items.length === 1 ? "" : "s"}</span></div>
        <div class="roadmap-items">
          ${items.map((item) => {
            const path = PATHS[item.path];
            const current = path.stages[Math.min(item.stage, path.stages.length - 1)];
            const progress = Math.round(((item.stage + 1) / path.stages.length) * 100);
            return `
              <article class="roadmap-card" data-roadmap-id="${item.id}">
                <h4>${escapeHtml(item.title)}</h4>
                <small>${calculatePriority(item)} · Score ${calculateScore(item)} · ${escapeHtml(item.owner)}</small>
                <span class="path-pill" style="--path:${path.color}">${escapeHtml(item.path)}</span>
                <div class="stage-line"><small>Current: <strong>${escapeHtml(current)}</strong></small><div class="mini-progress"><i style="width:${progress}%;background:${path.color}"></i></div></div>
                <div class="roadmap-actions"><button data-advance="${item.id}">Approve next gate</button><button data-park="${item.id}">${lane === "Later" ? "Move to Next" : "Park"}</button></div>
              </article>
            `;
          }).join("") || `<p class="helper">No items in ${lane}.</p>`}
        </div>
      </section>
    `;
  }).join("");
}

function renderPackSelectors() {
  const options = state.opportunities.map((item) => `<option value="${item.id}" ${item.id === state.selectedPackItem ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("");
  $("#packItem").innerHTML = options;
  $("#launchItem").innerHTML = state.opportunities.map((item) => `<option value="${item.id}" ${item.id === state.selectedLaunchItem ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("");
}

function renderArtifactNav() {
  const pack = state.artifacts[state.selectedPackItem] || {};
  $("#artifactNav").innerHTML = ARTIFACTS.map(([key, label]) => `
    <button class="artifact-button ${key === state.selectedArtifact ? "active" : ""} ${pack[key] ? "generated" : ""}" data-artifact="${key}">
      <span>${escapeHtml(label)}</span><i></i>
    </button>
  `).join("");
  renderDocument();
}

function renderDocument() {
  const pack = state.artifacts[state.selectedPackItem] || {};
  const content = pack[state.selectedArtifact];
  const label = ARTIFACTS.find(([key]) => key === state.selectedArtifact)?.[1] || "Artifact";
  $("#documentTitle").textContent = label;
  $("#documentStatus").textContent = content ? "Generated draft · PM review required" : "Not generated";
  $("#documentStatus").className = `document-status ${content ? "ready" : ""}`;
  $("#regenerateArtifact").disabled = !content || state.killed;
  $("#downloadArtifact").disabled = !content || state.killed;
  const preview = $("#documentPreview");
  if (!content) {
    preview.className = "document-empty";
    preview.innerHTML = `<span>▤</span><h3>No ${escapeHtml(label)} yet</h3><p>Generate the product pack to create this draft.</p>`;
  } else {
    preview.className = "document-preview";
    preview.innerHTML = `<pre>${escapeHtml(content)}</pre>`;
  }
}

function releaseReadiness(itemId) {
  const groups = state.launchChecks[itemId] || {};
  const checks = Object.values(groups).flat();
  if (!checks.length) return 0;
  return Math.round((checks.filter((check) => check.done).length / checks.length) * 100);
}

function renderLaunch() {
  const item = getOpportunity(state.selectedLaunchItem) || state.opportunities[0];
  if (!item) return;
  const readiness = releaseReadiness(item.id);
  $("#releaseTitle").textContent = item.title;
  $("#releasePath").textContent = `${item.path} · ${PATHS[item.path].stages[item.stage]}`;
  $("#readinessScore").textContent = `${readiness}%`;
  $("#readinessProgress").style.width = `${readiness}%`;
  const groups = state.launchChecks[item.id] || buildChecks();
  $("#launchChecklist").innerHTML = Object.entries(groups).map(([category, checks]) => `
    <article class="launch-card">
      <h3>${escapeHtml(category)}<span class="badge">${checks.filter((check) => check.done).length}/${checks.length}</span></h3>
      <div class="checklist">
        ${checks.map((check, index) => `<label class="check-row"><input type="checkbox" data-check-category="${escapeHtml(category)}" data-check-index="${index}" ${check.done ? "checked" : ""}>${escapeHtml(check.label)}</label>`).join("")}
      </div>
    </article>
  `).join("");
  const gates = [
    ["Evidence", item.sourceIds.length > 0, `${item.sourceIds.length} cited source${item.sourceIds.length === 1 ? "" : "s"}`],
    ["UAT", (groups["Product & UAT"] || []).every((check) => check.done), "All acceptance checks"],
    ["Rollback", (groups["Rollout & Recovery"] || []).every((check) => check.done), "Recovery path tested"],
    ["PM release", state.launchApproved[item.id], "Explicit human approval"]
  ];
  $("#releaseGates").innerHTML = gates.map(([name, pass, detail]) => `<div class="gate ${pass ? "pass" : "hold"}"><strong>${pass ? "✓" : "!"} ${escapeHtml(name)}</strong><small>${escapeHtml(detail)}</small></div>`).join("");
  const go = gates.every((gate) => gate[1]);
  $("#releaseGateBadge").textContent = go ? "Go" : "Hold";
  $("#releaseGateBadge").className = `badge ${go ? "green" : "amber"}`;
}

function renderAudit() {
  $("#versionCount").textContent = `${state.versions.length} versions`;
  $("#versionList").innerHTML = [...state.versions].reverse().map((version) => `
    <div class="version-item"><span class="version-id">${escapeHtml(version.id)}</span><span><strong>${escapeHtml(version.label)}</strong><small>${escapeHtml(version.time)} · ${escapeHtml(version.approval)}</small></span><button class="restore-version" data-version="${version.id}">Restore</button></div>
  `).join("") || `<p class="helper">No saved versions yet.</p>`;
  $("#auditTable").innerHTML = [...state.events].reverse().map((event) => `<tr><td>${escapeHtml(event.time)}</td><td><strong>${escapeHtml(event.action)}</strong></td><td>${escapeHtml(event.object)}</td><td>${escapeHtml(event.outcome)}</td></tr>`).join("") || `<tr><td colspan="4">No events recorded yet.</td></tr>`;
}

function renderKillState() {
  $("#killBanner").classList.toggle("hidden", !state.killed);
  $("#globalKill").disabled = state.killed;
  $("#auditKill").disabled = state.killed;
  $("#primaryAction").disabled = state.killed;
  $("#approveRelease").disabled = state.killed;
  $("#generatePack").disabled = state.killed;
}

function renderAll() {
  const hasApprovedStrategy = state.sources.some((source) => source.approved && source.type === "Strategy");
  state.mode = "Agent Mode";
  $("#modeBadge").textContent = state.mode;
  $("#modeBadge").classList.toggle("strategy", hasApprovedStrategy);
  renderMetrics();
  renderLifecycle();
  renderInvestments();
  renderLabMap();
  renderSources();
  renderUsage();
  renderOpportunities();
  renderPathLegend();
  renderRoadmap();
  renderPackSelectors();
  renderArtifactNav();
  renderLaunch();
  renderAudit();
  renderKillState();
  setView(state.currentView);
}

function analyzePortfolio() {
  if (!guard("Portfolio analysis")) return;
  for (const item of state.opportunities) {
    const priority = calculatePriority(item);
    item.status = item.sourceIds.length ? `${priority} recommendation` : "Insufficient evidence";
  }
  const version = captureVersion("Portfolio analysis", "draft");
  logEvent("Analyze", "Portfolio", `${version.id} created with ${state.opportunities.length} ranked opportunities`);
  renderAll();
  toast("Portfolio analysis complete. Recommendations remain drafts.");
}

function indexSources() {
  if (!guard("Indexing")) return;
  state.indexed = true;
  const version = captureVersion("Approved corpus indexed", "draft");
  logEvent("Index", "Knowledge corpus", `${state.sources.length} approved local sources · ${version.id}`);
  renderAll();
  toast("Approved sources indexed locally.");
}

function recalculatePriorities() {
  if (!guard("Prioritization")) return;
  state.opportunities.sort((a, b) => calculateScore(b) - calculateScore(a));
  for (const item of state.opportunities) {
    const priority = calculatePriority(item);
    item.status = item.sourceIds.length ? `${priority} recommendation` : "Insufficient evidence";
  }
  const version = captureVersion("Priority model recalculated", "draft");
  logEvent("Prioritize", "Opportunity portfolio", `${version.id} created; evidence gate applied`);
  renderAll();
  toast("Priorities recalculated with visible scoring.");
}

function saveRoadmapVersion() {
  if (!guard("Roadmap save")) return;
  const version = captureVersion("Roadmap plan", "approved");
  logEvent("Approve", "Roadmap", `${version.id} saved as an approved planning version`);
  renderAll();
  toast("Roadmap version saved. Previous versions remain available.");
}

function generateArtifact(key, item) {
  const priority = calculatePriority(item);
  const score = calculateScore(item);
  const path = PATHS[item.path];
  const sources = item.sourceIds.length ? item.sourceIds.join(", ") : "No direct evidence — blocked";
  const headers = {
    opportunityBrief: `# Opportunity Brief · ${item.title}\n\n**Status:** Draft for PM review\n**Priority:** ${priority} (${score}/100)\n**Evidence:** ${sources}\n\n## User problem\n${item.problem}\n\n## Why now\nImpact ${item.impact}/5; urgency ${item.urgency}/5; evidence ${item.evidence}/5.\n\n## Decision\nUse the **${item.path}** path. Current stage: ${path.stages[item.stage]}.\n\n## Assumptions\n- Evidence remains current and permissioned.\n- The PM validates severity and affected segments.\n\n## Open questions\n- Which user segment experiences the highest cost?\n- What measurable outcome proves the problem is solved?`,
    onePager: `# One-page PRD · ${item.title}\n\n**Owner:** ${item.owner}\n**Status:** Draft\n**Priority:** ${priority}\n\n## Problem\n${item.problem}\n\n## Goal\nResolve the validated problem while preserving traceability, user control, and measurable outcomes.\n\n## Success metrics\n- Primary outcome improves from the captured baseline.\n- No critical regression passes UAT.\n- PM explicitly approves release.\n\n## In scope\n- Smallest coherent solution for the validated problem.\n- Analytics, UAT, rollout, rollback, and user enablement.\n\n## Out of scope\n- Unrelated workflow redesign.\n- Automatic external changes without approval.\n\n## Evidence\n${sources}`,
    fullPrd: `# Product Requirements Document · ${item.title}\n\n**Version:** Draft 0.1\n**Owner:** ${item.owner}\n**Lifecycle:** ${item.path}\n**Priority:** ${priority} · Score ${score}/100\n\n## 1. Executive summary\n${item.problem}\n\n## 2. Users and jobs\nPrimary users need a reliable, understandable workflow that reduces manual work and preserves control.\n\n## 3. Evidence\nCited sources: ${sources}.\n\n## 4. Goals\n1. Solve the validated user problem.\n2. Improve the agreed product outcome.\n3. Preserve auditability and reversibility.\n\n## 5. Non-goals\n- Expanding beyond the approved opportunity.\n- Autonomous roadmap, delivery, or release decisions.\n\n## 6. Functional requirements\n- FR1: User can complete the target workflow.\n- FR2: System exposes status, errors, and recovery actions.\n- FR3: Product records the required analytics events.\n- FR4: Consequential actions require explicit approval.\n\n## 7. AI requirements\n- Ground generated content in approved sources.\n- Show citations and uncertainty.\n- Fail closed when evidence or permissions are insufficient.\n\n## 8. UX and trust\n- Explain why the result was produced.\n- Let users inspect evidence, edit, undo, and restore.\n- Never present a partial result as final.\n\n## 9. Analytics\nTrack entry, completion, failure, recovery, approval, adoption, and outcome events.\n\n## 10. Risks\nEffort ${item.effort}/5; delivery or AI risk ${item.risk}/5. Rollback must be tested before release.\n\n## 11. Acceptance criteria\n- Critical flow passes UAT.\n- Metrics and dashboards are validated.\n- Rollout and rollback owners are named.\n- PM signs the release gate.`,
    prototype: `# Prototype Brief · ${item.title}\n\n## Hypothesis\nIf we address the validated problem, users will complete the workflow with less friction and higher confidence.\n\n## Prototype scope\n- Entry point and primary action\n- Progress and system status\n- Evidence or explanation drawer\n- Error, empty, success, and recovery states\n- Approval and undo controls\n\n## Test tasks\n1. Start the target workflow.\n2. Understand the recommendation or status.\n3. Correct a wrong output.\n4. Recover from a failure.\n\n## Evidence to collect\nTask success, time on task, comprehension, trust, and critical confusion.\n\n**Decision gate:** Continue only if the prototype resolves the core risk.`,
    epic: `# Epic · ${item.title}\n\n## Outcome\n${item.problem}\n\n## Scope\nBuild, instrument, validate, and safely roll out the smallest approved solution.\n\n## Included capabilities\n- Core user workflow\n- Status and failure handling\n- Analytics instrumentation\n- Permission and approval rules\n- Rollout and rollback support\n\n## Done when\nUAT passes, release gates are approved, monitoring is live, and support is ready.`,
    stories: `# User Stories · ${item.title}\n\n## Story 1 — Complete the workflow\nAs a target user, I want to complete the core task so that I can achieve the intended outcome.\n\n**Acceptance criteria**\n- Given valid inputs, when I start, then the system completes or explains why it cannot.\n- Progress, success, and failure states are visible.\n\n## Story 2 — Inspect evidence\nAs a PM, I want to inspect source evidence so that I can validate the result.\n\n**Acceptance criteria**\n- Every important claim links to an approved source.\n- Missing evidence blocks unsupported recommendations.\n\n## Story 3 — Recover safely\nAs a PM, I want to undo or restore so that a wrong change does not become permanent.\n\n**Acceptance criteria**\n- Undo creates a new event.\n- Prior versions remain available.\n\n## Story 4 — Approve a release\nAs the accountable owner, I want a release gate so that incomplete work cannot launch.`,
    analytics: `# Analytics Plan · ${item.title}\n\n## North-star outcome\nImprovement in successful completion of the target workflow.\n\n## Events\n- opportunity_viewed\n- evidence_opened\n- analysis_started\n- analysis_completed\n- recommendation_edited\n- recommendation_approved\n- workflow_completed\n- workflow_failed\n- recovery_used\n- release_approved\n\n## Properties\nitem_id, user_segment, source_count, lifecycle_path, stage, model_version, latency_ms, error_type.\n\n## Guardrail metrics\nFailure rate, unsupported recommendation rate, rollback rate, permission violations, support contacts.\n\n## Decision cadence\nReview at beta, 7 days after rollout, 30 days after GA, and quarterly.`,
    uat: `# UAT Plan · ${item.title}\n\n## Entry criteria\n- Requirements approved\n- Test environment stable\n- Analytics available\n- No open severity-one defect\n\n## Scenarios\n1. Happy path completes successfully.\n2. Invalid input returns a useful error.\n3. Permission mismatch fails closed.\n4. Evidence is inspectable and correctly matched.\n5. Cancel stops the current run.\n6. Undo and restore preserve history.\n7. Export is blocked before approval.\n8. Rollback restores the last approved state.\n\n## Exit criteria\nAll critical cases pass; known limitations are accepted; PM signs the release gate.`,
    gtm: `# GTM Plan · ${item.title}\n\n## Audience\nPrimary users affected by the validated problem, plus support, customer success, and internal product teams.\n\n## Positioning\nA focused improvement that reduces friction while keeping decisions transparent and controllable.\n\n## Enablement\n- Internal demo and FAQ\n- Support playbook\n- Admin communication\n- User guide and release note\n\n## Channels\nIn-product announcement, targeted email, help center, and account-team brief.\n\n## Success\nTarget users adopt the workflow and the primary outcome improves without guardrail regression.`,
    rollout: `# Rollout Checklist · ${item.title}\n\n- [ ] UAT exit criteria met\n- [ ] Analytics events validated\n- [ ] Monitoring dashboard live\n- [ ] Rollback trigger and owner documented\n- [ ] Internal support enabled\n- [ ] User communication approved\n- [ ] Pilot segment selected\n- [ ] Beta success threshold agreed\n- [ ] Gradual rollout schedule approved\n- [ ] Post-launch review scheduled\n\n**Path:** ${item.path}\n**Sequence:** ${path.stages.join(" → ")}`,
    releaseNotes: `# Release Notes · ${item.title}\n\n## What changed\nWe improved the workflow related to **${item.title}**.\n\n## Why\n${item.problem}\n\n## What users should expect\nA clearer, more reliable experience with visible status and recovery options.\n\n## Availability\nReleased gradually according to the approved rollout plan.\n\n## Known limitations\nAny unresolved limitation will be listed before release approval.\n\n## Help\nUse the product support channel and include the item ID: ${item.id}.`,
    manual: `# User Manual · ${item.title}\n\n## Before you start\nConfirm that you have the required permissions and inputs.\n\n## Steps\n1. Open the relevant product workspace.\n2. Start the target workflow.\n3. Review progress and any system warnings.\n4. Inspect evidence or supporting details.\n5. Correct or retry when needed.\n6. Submit for approval when the result is ready.\n\n## Troubleshooting\n- No result: check required inputs and permissions.\n- Weak evidence: add an approved source.\n- Failure: retry once or use the documented fallback.\n- Wrong change: use undo or restore.\n\n## Escalation\nContact the assigned support owner with item ${item.id} and the trace ID.`,
    postLaunch: `# Post-launch Review · ${item.title}\n\n## Decision\nContinue, iterate, expand, pause, or roll back.\n\n## Review windows\n- Day 1: reliability and severe incidents\n- Day 7: adoption, completion, and support volume\n- Day 30: outcome, guardrails, and segment differences\n\n## Evidence required\nUsage dashboard, experiment or baseline comparison, user feedback, support themes, defects, rollback events.\n\n## Questions\n- Did the primary outcome improve?\n- Which segments benefited or struggled?\n- Did any guardrail worsen?\n- What should change in the roadmap?\n\n## Next action\nRecord the decision, owner, date, and supporting evidence.`
  };
  return headers[key];
}

function generatePack() {
  if (!guard("Product pack generation")) return;
  const item = getOpportunity(state.selectedPackItem);
  if (!item) return;
  state.artifacts[item.id] = Object.fromEntries(
    ARTIFACTS.map(([key]) => [key, generateArtifact(key, item)])
  );
  const version = captureVersion(`Product pack · ${item.title}`, "draft");
  logEvent("Generate", item.id, `${ARTIFACTS.length} draft artifacts · ${version.id}`);
  renderAll();
  toast("Full product pack generated. Every artifact remains a draft.");
}

function advanceStage(itemId) {
  if (!guard("Lifecycle transition")) return;
  const item = getOpportunity(itemId);
  const stages = PATHS[item.path].stages;
  if (item.stage >= stages.length - 1) {
    toast("This item is already at the final measurement stage.");
    return;
  }
  const from = stages[item.stage];
  item.stage += 1;
  item.status = stages[item.stage];
  const version = captureVersion(`${item.title} → ${item.status}`, "approved");
  logEvent("Approve gate", item.id, `${from} → ${item.status} · ${version.id}`);
  renderAll();
  toast(`${item.title} advanced to ${item.status}.`);
}

function moveLane(itemId) {
  if (!guard("Roadmap move")) return;
  const item = getOpportunity(itemId);
  const from = item.lane;
  item.lane = item.lane === "Later" ? "Next" : "Later";
  const version = captureVersion(`Roadmap move · ${item.title}`, "draft");
  logEvent("Roadmap move", item.id, `${from} → ${item.lane} · ${version.id}`);
  renderAll();
}

function approveRelease() {
  if (!guard("Release approval")) return;
  const item = getOpportunity(state.selectedLaunchItem);
  const readiness = releaseReadiness(item.id);
  if (readiness < 100 || item.sourceIds.length === 0) {
    toast(`Release held: ${readiness}% complete and evidence is required.`);
    logEvent("Release hold", item.id, `${readiness}% complete; gate remains closed`);
    return;
  }
  state.launchApproved[item.id] = true;
  const version = captureVersion(`Release approved · ${item.title}`, "approved");
  logEvent("Release approval", item.id, `Go decision recorded · ${version.id}`);
  renderAll();
  toast("Release gate approved. Rollout may proceed.");
}

function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], {type});
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

function exportSnapshot() {
  if (!guard("Export")) return;
  downloadFile("juno-product-os-snapshot.json", JSON.stringify({
    exportedAt: new Date().toISOString(),
    workspace: snapshot(),
    versions: state.versions.map(({snapshot: ignored, ...version}) => version),
    events: state.events
  }, null, 2), "application/json");
  logEvent("Export", "Workspace", "Local JSON snapshot downloaded");
}

function executePrimaryAction() {
  const actions = {
    command: () => document.dispatchEvent(new CustomEvent("juno:run-request")),
    knowledge: indexSources,
    opportunities: recalculatePriorities,
    roadmap: saveRoadmapVersion,
    pack: generatePack,
    launch: approveRelease,
    audit: exportSnapshot
  };
  actions[state.currentView]();
}

function resetWorkspace() {
  if (!confirm("Reset the local demo? Your current browser workspace will be replaced, but exported snapshots remain safe.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = freshState();
  captureVersion("Demo baseline", "approved");
  logEvent("Reset", "Workspace", "Sample workspace restored");
  renderAll();
  toast("Demo workspace reset.");
}

function activateKillSwitch() {
  state.killed = true;
  logEvent("Kill switch", "Workspace", "All consequential actions blocked");
  renderAll();
  toast("Kill switch active.");
}

function clearKillSwitch() {
  state.killed = false;
  logEvent("Control reset", "Workspace", "Kill switch cleared by user");
  renderAll();
}

function undoLast() {
  if (state.versions.length < 2) {
    toast("No earlier version is available.");
    return;
  }
  restoreVersion(state.versions[state.versions.length - 2], "Undo last change");
}

function restoreLastApproved() {
  const approved = [...state.versions].reverse().find((version) => version.approval === "approved");
  if (!approved) {
    toast("No approved version is available.");
    return;
  }
  restoreVersion(approved, `Restore approved ${approved.id}`);
}

function discardCurrentDraft() {
  const approved = [...state.versions].reverse().find((version) => version.approval === "approved");
  if (!approved) {
    toast("No approved version is available.");
    return;
  }
  restoreVersion(approved, `Discard draft; restore ${approved.id}`);
}

function parseUsageCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean).map((line) => line.split(",").map((cell) => cell.trim()));
  if (rows.length < 2) return null;
  const headers = rows[0].map((header) => header.toLowerCase());
  const required = ["module", "users", "active_users", "completion_rate"];
  if (!required.every((header) => headers.includes(header))) return null;
  return rows.slice(1).map((row) => ({
    module: row[headers.indexOf("module")],
    users: Number(row[headers.indexOf("users")]) || 0,
    active: Number(row[headers.indexOf("active_users")]) || 0,
    completion: Number(row[headers.indexOf("completion_rate")]) || 0
  }));
}

async function importFiles(files) {
  if (!guard("File import")) return;
  for (const file of files) {
    const text = await file.text();
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension === "csv") {
      const usage = parseUsageCsv(text);
      if (usage) {
        state.usage = usage;
        logEvent("Import", file.name, `${usage.length} module usage rows loaded locally`);
        continue;
      }
    }
    state.sources.push({
      id: `L-${String(state.sources.length + 1).padStart(3, "0")}`,
      type: extension.toUpperCase(),
      title: file.name,
      detail: text.slice(0, 180).replace(/\s+/g, " ") || "Empty local file",
      date: new Date().toISOString().slice(0, 10),
      approved: true,
      localContent: text
    });
    logEvent("Import", file.name, "Added to local approved corpus");
  }
  state.indexed = false;
  saveState();
  renderAll();
  toast(`${files.length} local file${files.length === 1 ? "" : "s"} imported.`);
}

function addEvidence() {
  if (!guard("Evidence creation")) return;
  const text = $("#evidenceText").value.trim();
  if (!text) {
    toast("Add an evidence excerpt first.");
    return;
  }
  const type = $("#evidenceType").value;
  const id = `E-${String(state.sources.length + 201).padStart(3, "0")}`;
  state.sources.push({
    id, type, title: text.slice(0, 48), detail: text,
    date: new Date().toISOString().slice(0, 10), approved: true
  });
  $("#evidenceText").value = "";
  logEvent("Add evidence", id, `${type} added locally`);
  renderAll();
}

function addOpportunity(event) {
  event.preventDefault();
  if (!guard("Opportunity creation")) return;
  const title = $("#newOppTitle").value.trim();
  const problem = $("#newOppEvidence").value.trim();
  if (!title || !problem) return;
  const id = `OPP-${String(state.opportunities.length + 1).padStart(3, "0")}`;
  const evidence = Number($("#newOppEvidenceScore").value);
  state.opportunities.push({
    id, title, problem,
    evidence, impact: Number($("#newOppImpact").value), strategy: 3, urgency: 3,
    effort: Number($("#newOppEffort").value), risk: 2,
    sourceIds: evidence > 1 ? state.sources.slice(-1).map((source) => source.id) : [],
    lane: "Later", path: "Standard Product", stage: 0,
    owner: "Unassigned", status: "New"
  });
  state.launchChecks[id] = buildChecks();
  state.launchApproved[id] = false;
  logEvent("Create", id, "Opportunity added to Later");
  $("#opportunityForm").reset();
  $("#opportunityDialog").close();
  renderAll();
}

function openPathDialog() {
  $("#pathComparison").innerHTML = Object.entries(PATHS).map(([name, path]) => `
    <article class="path-option" style="border-top:4px solid ${path.color}">
      <strong>${escapeHtml(name)}</strong><small>${escapeHtml(path.use)}</small>
      <ol>${path.stages.map((stage) => `<li>${escapeHtml(stage)}</li>`).join("")}</ol>
    </article>
  `).join("");
  $("#pathDialog").showModal();
}

function applyAgentRun(result) {
  const output = result?.output;
  if (!output?.evidence?.opportunities?.length || !output?.roadmap?.roadmap_items?.length) {
    throw new Error("Juno returned an incomplete portfolio.");
  }
  const roadmapById = new Map(output.roadmap.roadmap_items.map((item) => [item.opportunity_id, item]));
  state.opportunities = output.evidence.opportunities.map((opportunity, index) => {
    const roadmap = roadmapById.get(opportunity.id) || output.roadmap.roadmap_items[index] || {};
    const path = PATHS[roadmap.path] ? roadmap.path : "Standard Product";
    const stages = PATHS[path].stages;
    const stage = Math.max(0, stages.indexOf(roadmap.current_stage));
    return {
      id: opportunity.id || `OPP-${String(index + 1).padStart(3, "0")}`,
      title: opportunity.title,
      problem: opportunity.user_problem,
      evidence: opportunity.evidence_strength,
      impact: opportunity.impact,
      strategy: opportunity.strategy_alignment,
      urgency: opportunity.urgency,
      effort: opportunity.effort,
      risk: opportunity.risk,
      sourceIds: opportunity.evidence_source_ids || [],
      lane: roadmap.lane || "Later",
      path,
      stage,
      owner: roadmap.owner || "PM review required",
      status: `${roadmap.priority || "P3"} recommendation`
    };
  });
  state.launchChecks = {};
  state.launchApproved = {};
  for (const opportunity of state.opportunities) {
    state.launchChecks[opportunity.id] = buildChecks();
    state.launchApproved[opportunity.id] = false;
  }
  const selected = output.productPack.selected_opportunity_id || state.opportunities[0].id;
  const selectedId = getOpportunity(selected) ? selected : state.opportunities[0].id;
  const artifacts = output.productPack.artifacts;
  state.artifacts[selectedId] = {
    opportunityBrief: artifacts.opportunity_brief,
    onePager: artifacts.one_page_prd,
    fullPrd: artifacts.full_prd,
    prototype: artifacts.prototype_brief,
    epic: artifacts.epic,
    stories: artifacts.user_stories,
    analytics: artifacts.analytics_plan,
    uat: artifacts.uat_plan,
    gtm: artifacts.gtm_plan,
    rollout: artifacts.rollout_checklist,
    releaseNotes: artifacts.release_notes,
    manual: artifacts.user_manual,
    postLaunch: artifacts.post_launch_review
  };
  state.selectedPackItem = selectedId;
  state.selectedLaunchItem = selectedId;
  state.agentRunId = result.run.id;
  state.agentApproval = "pending";
  const version = captureVersion(`Juno Agent run · ${result.run.projectName}`, "draft");
  logEvent("Agent run", result.run.id, `${state.opportunities.length} opportunities and ${ARTIFACTS.length} artifacts · ${version.id}`);
  renderAll();
}

function recordAgentDecision(runId, decision) {
  state.agentApproval = decision;
  const version = captureVersion(`Agent run ${decision} · ${runId}`, decision === "approved" ? "approved" : "draft");
  logEvent("Human decision", runId, `${decision} · ${version.id}`);
  renderAll();
}

window.JunoProductOS = {
  getSources: () => clone(state.sources),
  getUsage: () => clone(state.usage),
  getCurrentRunId: () => state.agentRunId || null,
  getCurrentApproval: () => state.agentApproval || "pending",
  isKilled: () => state.killed,
  setView,
  applyAgentRun,
  recordAgentDecision,
  logEvent,
  renderAll,
  toast
};

function bindEvents() {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$("[data-go]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.go)));
  $("#primaryAction").addEventListener("click", executePrimaryAction);
  $("#globalKill").addEventListener("click", activateKillSwitch);
  $("#auditKill").addEventListener("click", activateKillSwitch);
  $("#clearKill").addEventListener("click", clearKillSwitch);
  $("#resetWorkspace").addEventListener("click", resetWorkspace);
  $("#indexSources").addEventListener("click", indexSources);
  $("#fileInput").addEventListener("change", (event) => importFiles([...event.target.files]));
  $("#addEvidence").addEventListener("click", addEvidence);
  $("#runPrioritization").addEventListener("click", recalculatePriorities);
  $("#toggleCriteria").addEventListener("click", () => $("#criteriaDetails").classList.toggle("hidden"));
  $("#addOpportunity").addEventListener("click", () => $("#opportunityDialog").showModal());
  $("#opportunityForm").addEventListener("submit", addOpportunity);
  $$('[data-close-opportunity]').forEach((button) => button.addEventListener("click", () => $("#opportunityDialog").close()));
  $("#opportunityGrid").addEventListener("change", (event) => {
    if (!event.target.matches("[data-item-path]") || !guard("Path change")) return;
    const item = getOpportunity(event.target.dataset.itemPath);
    item.path = event.target.value;
    item.stage = 0;
    logEvent("Route", item.id, `Lifecycle changed to ${item.path}`);
    renderAll();
  });
  $("#roadmapBoard").addEventListener("click", (event) => {
    if (event.target.dataset.advance) advanceStage(event.target.dataset.advance);
    if (event.target.dataset.park) moveLane(event.target.dataset.park);
  });
  $("#comparePaths").addEventListener("click", openPathDialog);
  $("#saveRoadmap").addEventListener("click", saveRoadmapVersion);
  $("#pathDialog").querySelector("[data-close]").addEventListener("click", () => $("#pathDialog").close());
  $("#packItem").addEventListener("change", (event) => {
    state.selectedPackItem = event.target.value;
    saveState();
    renderArtifactNav();
  });
  $("#generatePack").addEventListener("click", generatePack);
  $("#artifactNav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-artifact]");
    if (!button) return;
    state.selectedArtifact = button.dataset.artifact;
    saveState();
    renderArtifactNav();
  });
  $("#regenerateArtifact").addEventListener("click", () => {
    if (!guard("Artifact regeneration")) return;
    const item = getOpportunity(state.selectedPackItem);
    state.artifacts[item.id][state.selectedArtifact] = generateArtifact(state.selectedArtifact, item);
    logEvent("Regenerate", `${item.id}/${state.selectedArtifact}`, "Draft replaced; previous workspace version retained");
    renderArtifactNav();
  });
  $("#downloadArtifact").addEventListener("click", () => {
    if (!guard("Artifact download")) return;
    const content = state.artifacts[state.selectedPackItem]?.[state.selectedArtifact];
    if (!content) return;
    downloadFile(`${state.selectedPackItem}-${state.selectedArtifact}.md`, content, "text/markdown");
    logEvent("Download", state.selectedArtifact, "Local Markdown file created");
  });
  $("#launchItem").addEventListener("change", (event) => {
    state.selectedLaunchItem = event.target.value;
    saveState();
    renderLaunch();
    renderMetrics();
  });
  $("#launchChecklist").addEventListener("change", (event) => {
    if (!event.target.matches("[data-check-category]") || !guard("Checklist update")) return;
    const category = event.target.dataset.checkCategory;
    const index = Number(event.target.dataset.checkIndex);
    state.launchChecks[state.selectedLaunchItem][category][index].done = event.target.checked;
    saveState();
    renderLaunch();
    renderMetrics();
  });
  $("#approveRelease").addEventListener("click", approveRelease);
  $("#cancelActive").addEventListener("click", () => {
    logEvent("Cancel", "Active work", "No active external calls; local operation stopped");
    toast("No active external run. Local state preserved.");
  });
  $("#undoLast").addEventListener("click", undoLast);
  $("#discardDraft").addEventListener("click", discardCurrentDraft);
  $("#restoreApproved").addEventListener("click", restoreLastApproved);
  $("#exportSnapshot").addEventListener("click", exportSnapshot);
  $("#downloadAudit").addEventListener("click", () => downloadFile("juno-audit-log.json", JSON.stringify(state.events, null, 2), "application/json"));
  $("#versionList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-version]");
    if (!button) return;
    const version = state.versions.find((item) => item.id === button.dataset.version);
    if (version) restoreVersion(version);
  });
}

if (!state.versions.length) {
  captureVersion("Demo baseline", "approved");
  logEvent("Initialize", "Juno Product OS", "Local demo workspace created");
}
bindEvents();
renderAll();
