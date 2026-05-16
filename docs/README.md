# Signal Nonprofit Software Observatory Docs

This folder defines the product and technical plan for turning the prototype into an end-to-end open-source application.

## Documents

- [PRD](./PRD.md) - product purpose, users, scope, success metrics, MVP.
- [TRD](./TRD.md) - architecture, stack, services, data flow, AI flow, security.
- [App Flow](./APP_FLOW.md) - screens, states, user journeys, interaction model.
- [Data Sources and Connectors](./DATA_SOURCES_AND_CONNECTORS.md) - available datasets, APIs, database options, and integration plan.
- [Data Model](./DATA_MODEL.md) - core schema for tools, sources, gaps, AI use cases, and evidence.
- [Roadmap](./ROADMAP.md) - public phased build plan from prototype to public beta.
- [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md) - earlier engineering breakdown retained for planning history.

## Recommended Build Direction

Use a Postgres-first architecture with Neon as the current implemented backend. It gives the project serverless Postgres, standard connection strings, database branching, and a clear path to pgvector-backed semantic search without tying the prototype to a larger platform too early.

Keep authentication out of the first public prototype. Add it only for contributor workflows, saved research boards, private datasets, or admin moderation.
