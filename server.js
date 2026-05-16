import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "./lib/db.js";
import { connectorRegistry } from "./data/connectors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 1234);

app.use(express.json());
app.use(express.static(__dirname));

function buildWeightedGap(tool, weights) {
  return Math.round(
    tool.gap_score * 0.56 +
      tool.cost_burden * weights.cost * 0.16 +
      tool.field_readiness * weights.field * 0.16 +
      tool.ai_fit_score * weights.ai * 0.12
  );
}

function parseWeights(query) {
  return {
    cost: Number(query.costWeight ?? 78) / 100,
    field: Number(query.fieldWeight ?? 84) / 100,
    ai: Number(query.aiWeight ?? 63) / 100,
  };
}

function serializeTool(row, weights) {
  const weightedGap = buildWeightedGap(row, weights);
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    workflow: row.workflow_name,
    category: row.workflow_category,
    region: row.region,
    size: row.org_size,
    fit: row.fit,
    summary: row.summary,
    gap: weightedGap,
    baseGap: row.gap_score,
    ai: row.ai_fit_score,
    cost: row.cost_burden,
    field: row.field_readiness,
    implementationDifficulty: row.implementation_difficulty,
    drivers: row.drivers ?? [],
    intervention: row.intervention,
    keywords: row.keywords ?? [],
  };
}

async function fetchTools(query) {
  const region = query.region || "all";
  const size = query.size || "all";
  const workflow = query.workflow || "all";
  const search = query.search?.trim() || "";

  const rows = await sql`
    select
      tp.slug,
      tp.name,
      tp.region,
      tp.org_size,
      tp.fit,
      tp.summary,
      tp.gap_score,
      tp.ai_fit_score,
      tp.cost_burden,
      tp.field_readiness,
      tp.implementation_difficulty,
      tp.drivers,
      tp.intervention,
      tp.keywords,
      w.name as workflow_name,
      w.category as workflow_category
    from tool_profiles tp
    join workflows w on w.id = tp.workflow_id
    where (${region} = 'all' or tp.region = ${region})
      and (${size} = 'all' or tp.org_size = ${size})
      and (${workflow} = 'all' or w.name = ${workflow})
      and (
        ${search} = ''
        or tp.name ilike ${`%${search}%`}
        or tp.summary ilike ${`%${search}%`}
        or tp.region ilike ${`%${search}%`}
        or tp.fit ilike ${`%${search}%`}
        or w.name ilike ${`%${search}%`}
        or exists (
          select 1 from unnest(tp.keywords) keyword
          where keyword ilike ${`%${search}%`}
        )
      )
    order by tp.name asc
  `;

  const weights = parseWeights(query);
  return rows.map((row) => serializeTool(row, weights));
}

async function fetchDashboard(query) {
  const tools = await fetchTools(query);
  const workflows = [...new Set(tools.map((tool) => tool.workflow))];
  const regions = ["Global", "East Africa", "South Asia", "Latin America"];
  const scores = tools.map((tool) => tool.gap).sort((a, b) => a - b);
  const medianGap = scores.length ? scores[Math.floor(scores.length / 2)] : 0;
  const strongest = [...tools].sort((a, b) => b.gap - a.gap)[0];

  const matrix = workflows.map((workflow) => ({
    workflow,
    regions: regions.map((region) => {
      const scoped = tools.filter((tool) => tool.workflow === workflow && tool.region === region);
      const score = scoped.length
        ? Math.round(scoped.reduce((sum, tool) => sum + tool.gap, 0) / scoped.length)
        : 0;
      return { region, score };
    }),
  }));

  const [sourceCount] = await sql`select count(*)::int as count from sources`;

  return {
    tools,
    matrix,
    summary: {
      toolCount: tools.length,
      medianGap,
      strongAiFit: tools.filter((tool) => tool.ai >= 70).length,
      pressureLabel: strongest?.workflow ?? "No matching data",
      sourceCount: sourceCount.count,
    },
    gapDrivers: [
      {
        title: "Mobile intake",
        note: "Small teams need field-first capture that does not start with a desktop CRM.",
      },
      {
        title: "Source reuse",
        note: "Grant and reporting workflows lose time because evidence is scattered.",
      },
      {
        title: "Admin overhead",
        note: "Tools become expensive when setup requires a technical operator.",
      },
    ],
    queue: [
      {
        title: "Low-bandwidth proof",
        note: "Test which tools function under intermittent mobile connectivity.",
      },
      {
        title: "Real cost model",
        note: "Estimate annual cost after implementation, messaging, seats, and support.",
      },
      {
        title: "Localization depth",
        note: "Separate translated marketing from in-product workflow localization.",
      },
      {
        title: "Data export quality",
        note: "Check whether small teams can leave without losing useful records.",
      },
    ],
  };
}

function buildBrief(dashboard) {
  const topTools = [...dashboard.tools].sort((a, b) => b.gap - a.gap).slice(0, 5);
  const aiCandidates = [...dashboard.tools].filter((tool) => tool.ai >= 70).sort((a, b) => b.ai - a.ai).slice(0, 5);

  return [
    "# Signal Research Brief",
    "",
    `Tools in lens: ${dashboard.summary.toolCount}`,
    `Median gap score: ${dashboard.summary.medianGap}`,
    `Highest-pressure workflow: ${dashboard.summary.pressureLabel}`,
    `Strong AI-fit candidates: ${dashboard.summary.strongAiFit}`,
    "",
    "## Highest Gap Tools",
    "",
    ...topTools.map((tool) => `- ${tool.name} (${tool.workflow}, ${tool.region}): gap ${tool.gap}, AI fit ${tool.ai}. ${tool.summary}`),
    "",
    "## AI-Enabled Intervention Candidates",
    "",
    ...(aiCandidates.length
      ? aiCandidates.map((tool) => `- ${tool.name}: ${tool.intervention}`)
      : ["- No strong AI-fit candidates in the current lens."]),
    "",
    "## Evidence Still Needed",
    "",
    ...dashboard.queue.map((item) => `- ${item.title}: ${item.note}`),
    "",
    "## Caveat",
    "",
    "This brief is generated from reviewed catalog records and should be treated as decision support, not an automated procurement recommendation.",
  ].join("\n");
}

app.get("/api/health", async (_req, res, next) => {
  try {
    const [result] = await sql`select now() as now`;
    res.json({ ok: true, database: "neon", now: result.now });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tools", async (req, res, next) => {
  try {
    const tools = await fetchTools(req.query);
    res.json({ tools });
  } catch (error) {
    next(error);
  }
});

app.get("/api/workflows", async (_req, res, next) => {
  try {
    const workflows = await sql`
      select w.slug, w.name, w.category, count(tp.id)::int as tool_count
      from workflows w
      left join tool_profiles tp on tp.workflow_id = w.id
      group by w.id
      order by w.category asc, w.name asc
    `;
    res.json({ workflows });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sources", async (_req, res, next) => {
  try {
    const sources = await sql`
      select slug, name, source_type, url, license, last_fetched_at
      from sources
      order by name asc
    `;
    res.json({ sources, connectors: connectorRegistry });
  } catch (error) {
    next(error);
  }
});

app.get("/api/dashboard", async (req, res, next) => {
  try {
    res.json(await fetchDashboard(req.query));
  } catch (error) {
    next(error);
  }
});

app.get("/api/search", async (req, res, next) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) {
      res.json({ results: [] });
      return;
    }

    const results = await sql`
      select
        'tool' as kind,
        tp.slug,
        tp.name as title,
        tp.summary as excerpt,
        w.name as workflow,
        tp.region,
        tp.gap_score,
        tp.ai_fit_score
      from tool_profiles tp
      join workflows w on w.id = tp.workflow_id
      where tp.name ilike ${`%${query}%`}
        or tp.summary ilike ${`%${query}%`}
        or tp.intervention ilike ${`%${query}%`}
        or w.name ilike ${`%${query}%`}
        or exists (
          select 1 from unnest(tp.keywords) keyword
          where keyword ilike ${`%${query}%`}
        )
      union all
      select
        'evidence' as kind,
        tp.slug,
        s.name as title,
        ei.claim as excerpt,
        w.name as workflow,
        tp.region,
        tp.gap_score,
        tp.ai_fit_score
      from evidence_items ei
      left join sources s on s.id = ei.source_id
      left join tool_profiles tp on tp.id = ei.tool_id
      left join workflows w on w.id = ei.workflow_id
      where ei.claim ilike ${`%${query}%`}
        or s.name ilike ${`%${query}%`}
      order by gap_score desc nulls last
      limit 20
    `;

    res.json({ results });
  } catch (error) {
    next(error);
  }
});

app.get("/api/reports/brief", async (req, res, next) => {
  try {
    const dashboard = await fetchDashboard(req.query);
    res.json({ markdown: buildBrief(dashboard), summary: dashboard.summary });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tools/:slug", async (req, res, next) => {
  try {
    const tools = await fetchTools({ ...req.query, search: "" });
    const tool = tools.find((item) => item.slug === req.params.slug);

    if (!tool) {
      res.status(404).json({ error: "Tool not found" });
      return;
    }

    const evidence = await sql`
      select ei.claim, ei.source_url, ei.confidence, s.name as source_name
      from evidence_items ei
      left join sources s on s.id = ei.source_id
      join tool_profiles tp on tp.id = ei.tool_id
      where tp.slug = ${req.params.slug}
      order by ei.created_at desc
      limit 10
    `;

    res.json({ tool, evidence });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || "Internal server error" });
});

app.listen(port, () => {
  console.log(`Signal Observatory running at http://127.0.0.1:${port}`);
});
