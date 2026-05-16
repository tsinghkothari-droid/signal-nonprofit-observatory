# TRD - Signal Nonprofit Software Observatory

## Recommended Architecture

Use a Postgres-first web application:

- Frontend: current prototype uses HTML, CSS, and vanilla JavaScript; future app can move to Vite/React or Next.js when component complexity justifies it.
- Backend API: current prototype uses Express; future API can move to route handlers, Hono, or Fastify if deployment needs change.
- Primary database: Neon Postgres.
- Search: Postgres full-text search plus pgvector semantic search.
- Queue/ingestion: simple scheduled worker first; upgrade to BullMQ/Inngest later.
- File storage: object storage compatible layer when source files need to be retained.
- AI: OpenAI-compatible embedding and summarization adapter with cached outputs.

## Why Neon First

Neon is the implemented MVP default because it provides:

- Postgres relational modeling.
- Standard `DATABASE_URL` integration.
- Serverless Postgres for a low-maintenance public prototype.
- Database branching for experimentation.
- pgvector support for future embeddings and semantic search.
- Clean migration path to managed or self-hosted Postgres.

Supabase remains a valid alternative if the project later wants bundled auth, storage, and edge functions. Turso is attractive for edge/local-first use, but Postgres is a better fit for relational evidence, scoring, and future analytics.

## System Components

### Web App

- Dashboard for landscape search.
- Tool detail inspector.
- Workflow gap map.
- Evidence/source browser.
- Admin/import screen.

### API Layer

Endpoints:

- `GET /api/tools`
- `GET /api/tools/:id`
- `GET /api/workflows`
- `GET /api/gaps`
- `GET /api/sources`
- `POST /api/imports`
- `POST /api/reports`
- `POST /api/search`

### Ingestion Layer

Connector types:

- Static file import: CSV, JSON, XLSX.
- Public API connector: Candid, OpenAlex, Airtable/Baserow, future provider APIs.
- Public bulk download connector: IRS 990, TechSoup/NTEN datasets where downloadable.
- Manual evidence entry: analyst notes with URLs and confidence.

### AI Layer

Use AI for:

- Classifying software tools into workflows.
- Summarizing source excerpts.
- Extracting constraints such as pricing, language support, integrations, and implementation burden.
- Generating draft gap explanations.
- Producing report drafts.

Do not use AI for:

- Final scoring without source data.
- Unverified claims about vendors.
- Procurement recommendations without caveats.

## Data Flow

1. Source registered in `sources`.
2. Connector fetches raw data into `raw_records`.
3. Parser normalizes records into `tools`, `organizations`, `workflows`, `evidence_items`.
4. Embedding worker chunks and embeds source text into `evidence_chunks`.
5. Scoring worker computes `gap_scores` from structured fields plus reviewed evidence.
6. Frontend queries tools, gaps, evidence, and report data.

## Auth Plan

Phase 1:

- No auth.
- Local/admin import can be protected by environment variable or disabled in public builds.

Phase 2:

- Add authentication for contributors and admins only when write workflows need it.
- Roles: `viewer`, `contributor`, `reviewer`, `admin`.
- Public can read approved records only.

Phase 3:

- Private workspaces for funders or nonprofit cohorts if needed.
- Row-level security by workspace.

## Security

- Store API keys in environment variables.
- Keep raw source downloads separate from approved public records.
- Log source URL, fetch timestamp, and parser version.
- Mark license and redistribution rights per source.
- Never expose paid/API-restricted data if terms disallow redistribution.
- Human approval required before public scoring.

## Deployment

MVP:

- Render, Fly.io, Railway, or a small VPS for the Express API/static app.
- Neon Postgres for database.
- Vercel or Netlify are also viable after splitting frontend and API.

Alternative:

- Cloudflare Pages + Hono API + Neon Postgres.

Self-hosted:

- Docker Compose with Postgres, pgvector, API, worker, and static frontend.
