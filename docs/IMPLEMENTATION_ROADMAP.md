# Implementation Roadmap

## Phase 0 - Product Backbone

Status: current documentation pass.

Deliverables:

- PRD.
- TRD.
- App flow.
- Data source and connector plan.
- Data model.
- Working Neon-backed prototype.

## Phase 1 - Real Data MVP

Goal: replace demo data with real normalized records.

Tasks:

- Keep current Express prototype stable or convert to Next.js/Vite only when component complexity requires it.
- Maintain Neon schema setup and seed scripts.
- Implement `sources`, `tools`, `workflows`, `gap_scores`, `evidence_items`.
- Add CSV/JSON import.
- Seed 50-100 software/tool records.
- Add evidence source links.
- Keep auth off for public read.

Acceptance:

- Dashboard reads from database.
- Filters and sorting work from API-backed data.
- Each score shows source/evidence link. `Partially shipped through tool evidence inspector`

## Phase 2 - Public Dataset Connectors

Goal: ingest sector evidence.

Tasks:

- Add GivingTuesday AI Readiness import.
- Add NTEN Tech Accelerate import.
- Add IRS 990 bulk-data parser for U.S. nonprofit context.
- Add OpenAlex research connector.
- Store raw payloads and normalized evidence.
- Add source refresh timestamps.

Acceptance:

- Connector runs are repeatable.
- Raw data is stored immutably.
- Normalized records can be reviewed before publication.

Current status:

- Connector readiness registry is implemented.
- Actual ingestion jobs remain future work because source licensing/export formats need review.

## Phase 3 - Search and AI Layer

Goal: evidence-backed semantic search and report drafting.

Tasks:

- Enable pgvector.
- Chunk approved evidence.
- Generate embeddings.
- Implement hybrid search.
- Add report generator.
- Add AI classification for workflow and constraints.
- Add human review queue for AI-generated claims.

Acceptance:

- User can search by natural-language nonprofit need.
- Report draft cites internal evidence IDs.
- AI-generated data is marked as draft until reviewed.

Current status:

- Basic keyword search and markdown brief generation are implemented.
- Semantic search, embeddings, and AI generation remain future work.

## Phase 4 - Contributor Workflow

Goal: allow trusted people to maintain the catalog.

Tasks:

- Add Supabase Auth.
- Add roles: viewer, contributor, reviewer, admin.
- Add admin import screen.
- Add moderation workflow.
- Add audit log.

Acceptance:

- Public users only see approved records.
- Contributors can submit records.
- Reviewers can approve/reject evidence.

## Phase 5 - Public Beta

Goal: make the project useful to nonprofits and builders.

Tasks:

- Publish open-source repo.
- Add documentation for contributors.
- Add seed dataset.
- Add exportable nonprofit profile report.
- Add deployment guide.
- Add issue templates for new tools and new sources.

Acceptance:

- Public demo is live.
- New contributor can add a tool through documented flow.
- At least 100 mapped tools and 25 workflows.

## Immediate Next Engineering Tasks

1. Expand seed data to 100 source-backed records.
2. Add SQL migration versioning.
3. Add `/api/imports`.
4. Add first CSV import path.
5. Add full source/evidence inspector to dashboard.
6. Add Playwright smoke workflow for public CI.
7. Deploy public demo.
