const els = {
  region: document.querySelector("#region-filter"),
  size: document.querySelector("#size-filter"),
  workflow: document.querySelector("#workflow-filter"),
  search: document.querySelector("#search-input"),
  reset: document.querySelector("#reset-filters"),
  exportBrief: document.querySelector("#export-brief"),
  costWeight: document.querySelector("#cost-weight"),
  fieldWeight: document.querySelector("#field-weight"),
  aiWeight: document.querySelector("#ai-weight"),
  toolCount: document.querySelector("#tool-count"),
  medianGap: document.querySelector("#median-gap"),
  aiCount: document.querySelector("#ai-count"),
  pressureLabel: document.querySelector("#pressure-label"),
  matrix: document.querySelector("#matrix"),
  toolList: document.querySelector("#tool-list"),
  sourceList: document.querySelector("#source-list"),
  searchResults: document.querySelector("#search-results"),
  gapList: document.querySelector("#gap-list"),
  queueList: document.querySelector("#queue-list"),
  detailTitle: document.querySelector("#detail-title"),
  detailSummary: document.querySelector("#detail-summary"),
  detailBody: document.querySelector("#detail-body"),
  resultsCopy: document.querySelector("#results-copy"),
  sortButtons: [...document.querySelectorAll("[data-sort]")],
  navItems: [...document.querySelectorAll(".nav-item")],
};

let selectedId = "whatsapp-outreach";
let sortMode = "gap";
let dashboardState = null;
let requestId = 0;
let searchTimer = null;

function params() {
  const value = new URLSearchParams({
    region: els.region.value,
    size: els.size.value,
    workflow: els.workflow.value,
    search: els.search.value.trim(),
    costWeight: els.costWeight.value,
    fieldWeight: els.fieldWeight.value,
    aiWeight: els.aiWeight.value,
  });

  return value;
}

function numberClass(value) {
  if (value >= 75) return "high";
  if (value >= 55) return "medium";
  return "good";
}

function sortTools(list) {
  return [...list].sort((a, b) => {
    if (sortMode === "ai") return b.ai - a.ai;
    if (sortMode === "cost") return a.cost - b.cost;
    return b.gap - a.gap;
  });
}

function setLoading() {
  els.resultsCopy.textContent = "Loading Neon data";
  els.toolList.innerHTML = '<div class="table-row"><span class="tool-note">Fetching landscape rows from Neon...</span></div>';
}

function setError(error) {
  els.resultsCopy.textContent = "Database request failed";
  els.toolList.innerHTML = `<div class="table-row"><span class="tool-note">${error.message}</span></div>`;
}

function renderSnapshot(summary) {
  els.toolCount.textContent = String(summary.toolCount);
  els.medianGap.textContent = String(summary.medianGap);
  els.aiCount.textContent = String(summary.strongAiFit);
  els.pressureLabel.textContent = summary.pressureLabel;
}

function renderMatrix(matrix) {
  const regions = ["Global", "East Africa", "South Asia", "Latin America"];
  const cells = [
    '<div class="matrix-cell matrix-head">Workflow / region</div>',
    ...regions.map((region) => `<div class="matrix-cell matrix-head">${region}</div>`),
  ];

  matrix.forEach((row) => {
    cells.push(`<div class="matrix-cell matrix-label">${row.workflow}</div>`);
    regions.forEach((region) => {
      const match = row.regions.find((item) => item.region === region);
      const score = match?.score ?? 0;
      cells.push(`
        <div class="matrix-cell matrix-score">
          <span>${score || "-"}</span>
          <span class="score-mark" aria-hidden="true"><i style="--w:${score}%"></i></span>
        </div>
      `);
    });
  });

  els.matrix.innerHTML = cells.join("");
}

function renderTable(tools) {
  if (!tools.length) {
    els.toolList.innerHTML = '<div class="table-row"><span class="tool-note">No tools match this lens. Treat the absence as a research lead.</span></div>';
    return;
  }

  if (!tools.some((tool) => tool.id === selectedId)) {
    selectedId = sortTools(tools)[0].id;
  }

  els.toolList.innerHTML = sortTools(tools)
    .map(
      (tool) => `
        <button class="table-row tool-row ${tool.id === selectedId ? "is-selected" : ""}" type="button" data-id="${tool.id}">
          <span>
            <span class="tool-name">${tool.name}</span>
            <span class="tool-note">${tool.summary}</span>
          </span>
          <span>${tool.workflow}</span>
          <span>${tool.region}</span>
          <span>${tool.fit}</span>
          <span class="num ${numberClass(tool.gap)}">${tool.gap}</span>
          <span class="num ${numberClass(tool.ai)}">${tool.ai}</span>
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".tool-row").forEach((row) => {
    row.addEventListener("click", () => {
      selectedId = row.dataset.id;
      renderFromState();
      void fetchDetail(selectedId);
    });
  });
}

function renderStacks(state) {
  els.gapList.innerHTML = state.gapDrivers
    .map((item) => `<article class="stack-item"><strong>${item.title}</strong><p>${item.note}</p></article>`)
    .join("");
  els.queueList.innerHTML = state.queue
    .map((item) => `<article class="stack-item"><span>Evidence task</span><strong>${item.title}</strong><p>${item.note}</p></article>`)
    .join("");
}

function renderDetail(tool, evidence = []) {
  if (!tool) {
    els.detailTitle.textContent = "No matching tool";
    els.detailSummary.textContent = "Adjust the current lens to inspect a software option.";
    els.detailBody.innerHTML = "";
    return;
  }

  els.detailTitle.textContent = tool.name;
  els.detailSummary.textContent = tool.summary;
  els.detailBody.innerHTML = `
    <div class="detail-grid">
      <div><span>Weighted gap</span><strong>${tool.gap}</strong></div>
      <div><span>AI fit</span><strong>${tool.ai}</strong></div>
      <div><span>Field readiness</span><strong>${tool.field}</strong></div>
    </div>
    <div class="driver-list">
      ${tool.drivers.map((driver) => `<div><span>${driver}</span><strong>${tool.workflow}</strong></div>`).join("")}
      <div><span>${tool.intervention}</span><strong>AI intervention</strong></div>
      ${evidence
        .map(
          (item) => `
            <div class="evidence-row">
              <span>${item.claim}</span>
              <strong>
                ${
                  item.source_url
                    ? `<a href="${item.source_url}" target="_blank" rel="noreferrer">${item.source_name || "Evidence"}</a>`
                    : item.source_name || "Evidence"
                }
                <em>${item.confidence}%</em>
              </strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
  els.detailBody.classList.remove("is-entering");
  requestAnimationFrame(() => els.detailBody.classList.add("is-entering"));
}

function renderSources(payload) {
  const connectors = payload.connectors || [];
  const sources = payload.sources || [];
  const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));

  els.sourceList.innerHTML = connectors
    .map((connector) => {
      const source = sourceBySlug.get(connector.slug);
      return `
        <article class="stack-item source-card">
          <span>${connector.status} · ${connector.method}</span>
          <strong>${connector.name}</strong>
          <p>${connector.use}</p>
          <a href="${connector.endpoint}" target="_blank" rel="noreferrer">Inspect source</a>
          <small>${source ? `Catalog source: ${source.source_type}` : connector.nextStep}</small>
        </article>
      `;
    })
    .join("");
}

function renderSearchResults(results) {
  if (!els.search.value.trim()) {
    els.searchResults.innerHTML = '<article class="stack-item"><p>Type a need such as "WhatsApp", "grant", "reporting", or "AI".</p></article>';
    return;
  }

  if (!results.length) {
    els.searchResults.innerHTML = '<article class="stack-item"><p>No evidence or tool records match yet. Add this as a research gap.</p></article>';
    return;
  }

  els.searchResults.innerHTML = results
    .slice(0, 5)
    .map(
      (item) => `
        <article class="stack-item search-hit">
          <span>${item.kind} · ${item.workflow || "unmapped"} · ${item.region || "global"}</span>
          <strong>${item.title}</strong>
          <p>${item.excerpt}</p>
        </article>
      `
    )
    .join("");
}

function renderFromState() {
  if (!dashboardState) return;

  renderSnapshot(dashboardState.summary);
  renderMatrix(dashboardState.matrix);
  renderTable(dashboardState.tools);
  renderStacks(dashboardState);
  els.resultsCopy.textContent = `${dashboardState.tools.length} matching tools from Neon`;

  const selected = dashboardState.tools.find((tool) => tool.id === selectedId) || dashboardState.tools[0];
  renderDetail(selected);
}

async function fetchDashboard() {
  const current = ++requestId;
  setLoading();

  try {
    const response = await fetch(`/api/dashboard?${params().toString()}`);
    if (!response.ok) throw new Error(`Dashboard API returned ${response.status}`);
    const data = await response.json();
    if (current !== requestId) return;
    dashboardState = data;
    renderFromState();
    if (data.tools.length) {
      await fetchDetail(selectedId);
    }
  } catch (error) {
    if (current !== requestId) return;
    setError(error);
  }
}

async function fetchDetail(slug) {
  const response = await fetch(`/api/tools/${encodeURIComponent(slug)}?${params().toString()}`);
  if (!response.ok) return;
  const data = await response.json();
  renderDetail(data.tool, data.evidence);
}

async function fetchSources() {
  const response = await fetch("/api/sources");
  if (!response.ok) return;
  renderSources(await response.json());
}

async function fetchSearch() {
  const query = els.search.value.trim();
  if (!query) {
    renderSearchResults([]);
    return;
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) return;
  const data = await response.json();
  renderSearchResults(data.results);
}

async function exportBrief() {
  els.exportBrief.disabled = true;
  els.exportBrief.textContent = "Preparing brief";
  try {
    const response = await fetch(`/api/reports/brief?${params().toString()}`);
    if (!response.ok) throw new Error(`Report API returned ${response.status}`);
    const data = await response.json();
    const blob = new Blob([data.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "signal-research-brief.md";
    link.click();
    URL.revokeObjectURL(url);
  } finally {
    els.exportBrief.disabled = false;
    els.exportBrief.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10M6 9l4 4 4-4M4 17h12" /></svg>Export brief';
  }
}

[els.region, els.size, els.workflow, els.costWeight, els.fieldWeight, els.aiWeight].forEach((input) => {
  input.addEventListener("input", () => void fetchDashboard());
  input.addEventListener("change", () => void fetchDashboard());
});

els.search.addEventListener("input", () => {
  void fetchDashboard();
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void fetchSearch(), 180);
});

els.reset.addEventListener("click", () => {
  els.region.value = "all";
  els.size.value = "all";
  els.workflow.value = "all";
  els.search.value = "";
  els.costWeight.value = "78";
  els.fieldWeight.value = "84";
  els.aiWeight.value = "63";
  sortMode = "gap";
  els.sortButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.sort === sortMode));
  void fetchDashboard();
  renderSearchResults([]);
});

els.sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sortMode = button.dataset.sort;
    els.sortButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderFromState();
  });
});

els.navItems.forEach((item) => {
  item.addEventListener("click", () => {
    els.navItems.forEach((nav) => nav.classList.toggle("is-active", nav === item));
  });
});

els.exportBrief.addEventListener("click", () => void exportBrief());

void fetchSources();
renderSearchResults([]);
void fetchDashboard();
