# Signal Nonprofit Software Observatory

Signal is an open-source research dashboard for mapping nonprofit software options, evidence gaps, and practical AI opportunities for small global nonprofits.

The project is built for teams that need to answer:

- What tools already exist for a nonprofit workflow?
- Where do those tools fail small organizations in cost, setup burden, field readiness, language support, or regional fit?
- Which AI-enabled interventions are useful because they reduce real work, not because they are trendy?
- What evidence supports each claim?

## Why This Is Useful

Small nonprofits often pick tools from vendor lists, peer anecdotes, or consultant recommendations. Those sources rarely expose the constraints that matter most to lean teams: total cost after implementation, mobile-first field use, low-bandwidth realities, multilingual workflows, and whether a tool can work without a dedicated technical operator.

Signal turns that messy research problem into a structured, inspectable map. Nonprofits can compare options before committing scarce time or money. Funders can see where capacity-building support is needed. Open-source builders can discover high-value product gaps. Researchers can connect sector evidence to software needs and AI readiness.

## Current Prototype

This repository contains a working Neon-backed prototype:

- Public dashboard UI served at `http://127.0.0.1:1234`
- Express API with Neon Postgres
- Seed database schema and sample research records
- Filters for region, organization size, workflow, and scoring weights
- Gap scores, AI-fit scores, evidence snippets, and a coverage matrix
- Product, technical, app-flow, data-source, and roadmap documentation

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- API: Node.js, Express
- Database: Neon Postgres
- Database client: `@neondatabase/serverless`
- Browser verification: Playwright CLI

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run db:setup
npm run db:seed
npm run dev
```

Then open:

```text
http://127.0.0.1:1234
```

`.env.local` must contain a Neon-compatible `DATABASE_URL`.

## Useful Commands

```bash
npm run db:reset
npm run check
npm run dev
```

## Documentation

- [Product Requirements](docs/PRD.md)
- [Technical Requirements](docs/TRD.md)
- [App Flow](docs/APP_FLOW.md)
- [Data Sources and Connectors](docs/DATA_SOURCES_AND_CONNECTORS.md)
- [Data Model](docs/DATA_MODEL.md)
- [Roadmap](docs/ROADMAP.md)

## Public Roadmap

The immediate direction is to move from a seeded prototype to a useful public knowledge base:

- Normalize at least 100 nonprofit software tools and informal stacks.
- Add reviewed source evidence for each score.
- Build CSV/JSON import for contributors.
- Add public data connectors for GivingTuesday, NTEN, TechSoup, IRS 990, and OpenAlex where licensing permits.
- Add semantic search over evidence with human-reviewed AI summaries.
- Add contributor and reviewer workflows after the public read-only catalog is useful.

## Open-Source Position

This project should stay evidence-first. AI outputs should be treated as draft analysis until reviewed. Public records should cite sources and respect dataset licenses. The goal is not to recommend vendors blindly; it is to make nonprofit software decisions more transparent and less costly for small teams.

## License

MIT
