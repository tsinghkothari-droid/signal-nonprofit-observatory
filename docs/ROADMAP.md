# Public Roadmap

## Mission

Build an open, evidence-backed map of nonprofit software coverage and gaps so small organizations, funders, researchers, and builders can make better technology decisions.

## Phase 0 - Public Prototype

Status: current repository.

Delivered:

- Neon-backed Express API.
- Public dashboard prototype.
- Seed schema and sample records.
- PRD, TRD, app-flow, data-source, and data-model docs.
- Playwright browser verification.

## Phase 1 - Evidence-Backed Catalog

Goal: make the dashboard useful with real records.

Tasks:

- Expand seed data to 100 tools and informal nonprofit stacks.
- Add workflow taxonomy for at least 25 nonprofit jobs-to-be-done.
- Add evidence links for each visible score.
- Add CSV/JSON import for contributor-maintained records.
- Add an evidence inspector to every tool profile.

## Phase 2 - Public Data Connectors

Goal: make research refreshable.

Priority connectors:

- GivingTuesday AI Readiness resources.
- NTEN Tech Accelerate public data.
- TechSoup public datasets and reports.
- IRS 990 bulk data for U.S. nonprofit context.
- OpenAlex for research literature.
- Airtable, Baserow, or NocoDB for community-maintained catalogs.

## Phase 3 - Search and AI Assistance

Goal: help users ask natural-language questions while preserving evidence review.

Tasks:

- Add Postgres full-text search.
- Add pgvector embeddings for reviewed evidence.
- Add hybrid search across tools, workflows, and claims.
- Generate draft research briefs with citations.
- Mark all AI-generated claims as draft until reviewed.

## Phase 4 - Contributor Workflow

Goal: let trusted contributors maintain the catalog safely.

Tasks:

- Add authentication only when contribution workflows need it.
- Add roles: viewer, contributor, reviewer, admin.
- Add moderation queue for imported records and AI-generated claims.
- Add audit log for scoring changes.

## Phase 5 - Public Beta

Goal: make Signal useful outside the development team.

Acceptance criteria:

- At least 100 mapped tools.
- At least 25 mapped workflows.
- At least 5 repeatable connectors.
- Source-backed score explanations.
- Exportable nonprofit and builder briefs.
- Public demo deployment.
