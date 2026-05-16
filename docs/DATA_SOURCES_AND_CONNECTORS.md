# Data Sources and Connectors

## Summary Recommendation

Use Neon Postgres as the primary application database for the current MVP. Add connectors in this order:

1. Manual CSV/JSON import.
2. GivingTuesday AI Readiness dataset.
3. NTEN Tech Accelerate public data.
4. IRS 990 bulk data for U.S. nonprofit context.
5. OpenAlex for research/literature evidence.
6. Candid Grants API if licensing and budget allow.
7. Airtable/Baserow/NocoDB connector for community-maintained tool catalogs.

## Application Database Options

| Option | Fit | How to connect | Notes |
| --- | --- | --- | --- |
| Neon Postgres | Current MVP default | Standard Postgres `DATABASE_URL`, pooled or direct | Good for plain serverless Postgres, branching, relational evidence, and future pgvector semantic search. |
| Supabase Postgres | Strong product-platform option | Supabase JS client or Postgres connection string | Includes Postgres, pgvector, storage, auth later, edge functions. Good if bundled auth/storage become priorities. |
| Turso/libSQL | Good edge/local-first option | Turso/libSQL client and database URL/token | SQLite-compatible and supports vector search. Better for embedded/edge replicas than complex relational analytics. |
| Airtable | Good contributor/admin catalog | Web API with PAT/OAuth, base/table IDs | Easy for nontechnical contributors, but API limits and closed platform matter. |
| Baserow | Open-source Airtable-like catalog | REST API, database token, OpenAPI schema | Good if you want self-hosted no-code contributor workflows. |
| NocoDB | Open-source UI on existing DB | Auto-generated REST API over Postgres/MySQL/SQLite | Good if you want a spreadsheet UI over your own database. |

## Sector Data Sources

### GivingTuesday AI Readiness Survey

Use for nonprofit AI readiness, capacity, staff size, geography, and AI adoption patterns.

Connection:

- Download dataset from the GivingTuesday report/resource page.
- Store raw files in `raw_records`.
- Normalize into `survey_responses`, `ai_readiness_segments`, and `evidence_items`.

Source:

- https://ai.givingtuesday.org/ai-readiness-report-2024/
- https://ai.givingtuesday.org/givingtuesdays-ai-readiness-survey-2024-results/

### NTEN Tech Accelerate Public Data

Use for nonprofit technology maturity, practices, investment gaps, and sector trends.

Connection:

- Use downloadable public data/dashboard exports if available.
- If only dashboard access is exposed, start with manual export and document refresh steps.
- Normalize into `technology_assessments`, `gap_evidence`, and benchmark tables.

Source:

- https://www.nten.org/posts/ta_welcome_page/public-data-dashboard/

### TechSoup Public Data

Use for civil society data discovery and nonprofit technology ecosystem context.

Connection:

- Start as curated source registry.
- Add connectors only for datasets with downloadable files or stable endpoints.

Source:

- https://publicdata.techsoup.org/

### Candid APIs

Use for grants, funders, recipients, and funding context.

Connection:

- Use Candid API access if available.
- Store only data permitted by Candid terms.
- Good endpoints are grants search/filter and nonprofit/funder metadata depending on subscription.

Source:

- https://developer.candid.org/reference
- https://developer.candid.org/docs/get-started-with-grants-api

### IRS Tax Exempt Organization Search Bulk Data

Use for U.S. nonprofit baseline records, tax-exempt status, and 990 filings.

Connection:

- Download monthly bulk ZIP files.
- Parse pipe-delimited files and XML 990 filings.
- Normalize into `organizations`, `filings`, and `financial_context`.

Source:

- https://www.irs.gov/charities-non-profits/tax-exempt-organization-search-bulk-data-downloads

### OpenAlex

Use for research evidence, academic literature, nonprofit technology studies, and AI/social-sector research.

Connection:

- Use REST API for search and filtering.
- Store work metadata and abstracts where available.
- Use embeddings for semantic retrieval over titles/abstracts.

Source:

- https://developers.openalex.org/

## Contributor Catalog Sources

### Airtable

Best for quick, nontechnical tool catalog editing.

Connection:

- Create base with tables matching `tools`, `workflows`, `evidence_items`.
- Use Personal Access Token or OAuth.
- API returns records in pages up to 100 records and has 5 requests/sec/base rate limit.

Source:

- https://support.airtable.com/docs/getting-started-with-airtables-web-api

### Baserow

Best open-source no-code database option.

Connection:

- Create database token.
- Use generated REST API endpoints.
- Optionally self-host for full control.

Source:

- https://baserow.io/user-docs/database-api
- https://baserow.io/docs/apis/rest-api

### NocoDB

Best when you want spreadsheet UI over an existing database.

Connection:

- Connect NocoDB to Postgres.
- Use NocoDB UI for contributors.
- Use generated REST API for app integration if needed.

Source:

- https://github.com/nocodb/nocodb

## Connector Design

Every connector should implement:

```ts
type ConnectorResult = {
  sourceId: string;
  fetchedAt: string;
  license: string;
  records: Array<{
    externalId: string;
    raw: unknown;
    normalized?: unknown;
    sourceUrl?: string;
  }>;
};
```

Connector lifecycle:

1. Register source.
2. Fetch raw data.
3. Store raw immutable record.
4. Normalize to internal schema.
5. Generate evidence chunks.
6. Embed chunks.
7. Queue human review if scoring impact is high.

## MVP Database Choice

Default:

- Neon Postgres.
- Enable pgvector.
- Use full-text search plus semantic search.
- Keep auth disabled publicly until contributor/admin workflows are needed.

Fallback:

- Supabase Postgres if bundled auth/storage becomes more useful than pure database branching.
- Local Postgres Docker for fully self-hosted development.
