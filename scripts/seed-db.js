import { sql } from "../lib/db.js";
import { sources, tools, workflows } from "../data/seed.js";

for (const workflow of workflows) {
  await sql`
    insert into workflows (slug, name, category)
    values (${workflow.slug}, ${workflow.name}, ${workflow.category})
    on conflict (slug) do update set
      name = excluded.name,
      category = excluded.category
  `;
}

for (const source of sources) {
  await sql`
    insert into sources (slug, name, source_type, url, license)
    values (${source.slug}, ${source.name}, ${source.sourceType}, ${source.url}, ${source.license})
    on conflict (slug) do update set
      name = excluded.name,
      source_type = excluded.source_type,
      url = excluded.url,
      license = excluded.license
  `;
}

for (const tool of tools) {
  const [workflow] = await sql`select id from workflows where name = ${tool.workflow}`;

  await sql`
    insert into tool_profiles (
      slug,
      name,
      workflow_id,
      region,
      org_size,
      fit,
      summary,
      gap_score,
      ai_fit_score,
      cost_burden,
      field_readiness,
      implementation_difficulty,
      drivers,
      intervention,
      keywords
    )
    values (
      ${tool.slug},
      ${tool.name},
      ${workflow.id},
      ${tool.region},
      ${tool.orgSize},
      ${tool.fit},
      ${tool.summary},
      ${tool.gapScore},
      ${tool.aiFitScore},
      ${tool.costBurden},
      ${tool.fieldReadiness},
      ${tool.implementationDifficulty},
      ${JSON.stringify(tool.drivers)}::jsonb,
      ${tool.intervention},
      ${tool.keywords}
    )
    on conflict (slug) do update set
      name = excluded.name,
      workflow_id = excluded.workflow_id,
      region = excluded.region,
      org_size = excluded.org_size,
      fit = excluded.fit,
      summary = excluded.summary,
      gap_score = excluded.gap_score,
      ai_fit_score = excluded.ai_fit_score,
      cost_burden = excluded.cost_burden,
      field_readiness = excluded.field_readiness,
      implementation_difficulty = excluded.implementation_difficulty,
      drivers = excluded.drivers,
      intervention = excluded.intervention,
      keywords = excluded.keywords,
      updated_at = now()
  `;
}

const [defaultSource] = await sql`select id from sources where slug = 'givingtuesday-ai-readiness-2024'`;

for (const tool of tools) {
  const [profile] = await sql`
    select tp.id as tool_id, w.id as workflow_id
    from tool_profiles tp
    join workflows w on w.id = tp.workflow_id
    where tp.slug = ${tool.slug}
  `;

  await sql`
    insert into evidence_items (source_id, tool_id, workflow_id, claim, source_url, confidence)
    values (
      ${defaultSource.id},
      ${profile.tool_id},
      ${profile.workflow_id},
      ${tool.summary},
      'https://ai.givingtuesday.org/ai-readiness-report-2024/',
      72
    )
  `;
}

const [toolCount] = await sql`select count(*)::int as count from tool_profiles`;
const [sourceCount] = await sql`select count(*)::int as count from sources`;

console.log(`Seeded ${toolCount.count} tools and ${sourceCount.count} sources.`);

