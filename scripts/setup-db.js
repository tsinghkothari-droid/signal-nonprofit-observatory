import { sql } from "../lib/db.js";

const reset = process.argv.includes("--reset");

if (reset) {
  await sql`drop table if exists evidence_items cascade`;
  await sql`drop table if exists sources cascade`;
  await sql`drop table if exists tool_profiles cascade`;
  await sql`drop table if exists workflows cascade`;
}

await sql`
  create table if not exists workflows (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null unique,
    category text not null,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists tool_profiles (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    workflow_id uuid not null references workflows(id) on delete restrict,
    region text not null,
    org_size text not null,
    fit text not null,
    summary text not null,
    gap_score int not null check (gap_score between 0 and 100),
    ai_fit_score int not null check (ai_fit_score between 0 and 100),
    cost_burden int not null check (cost_burden between 0 and 100),
    field_readiness int not null check (field_readiness between 0 and 100),
    implementation_difficulty int not null check (implementation_difficulty between 0 and 100),
    drivers jsonb not null default '[]'::jsonb,
    intervention text not null,
    keywords text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists sources (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    source_type text not null,
    url text not null,
    license text not null,
    last_fetched_at timestamptz,
    created_at timestamptz not null default now()
  )
`;

await sql`
  create table if not exists evidence_items (
    id uuid primary key default gen_random_uuid(),
    source_id uuid references sources(id) on delete set null,
    tool_id uuid references tool_profiles(id) on delete cascade,
    workflow_id uuid references workflows(id) on delete set null,
    claim text not null,
    source_url text,
    confidence int not null default 70 check (confidence between 0 and 100),
    review_status text not null default 'approved',
    created_at timestamptz not null default now()
  )
`;

await sql`create index if not exists idx_tool_profiles_workflow_id on tool_profiles(workflow_id)`;
await sql`create index if not exists idx_tool_profiles_region on tool_profiles(region)`;
await sql`create index if not exists idx_tool_profiles_org_size on tool_profiles(org_size)`;
await sql`create index if not exists idx_tool_profiles_keywords on tool_profiles using gin(keywords)`;
await sql`create index if not exists idx_evidence_items_tool_id on evidence_items(tool_id)`;

console.log(`Database schema ${reset ? "reset and recreated" : "ready"}.`);

