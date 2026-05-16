# Contributing

Signal needs three kinds of contributions:

- Tool records: software products, open-source projects, and common nonprofit stacks.
- Evidence records: source URLs, reports, datasets, pricing notes, implementation notes, and regional constraints.
- Product work: data connectors, scoring improvements, search, accessibility, and deployment.

## Evidence Standard

Every claim should include:

- Source name and URL.
- License or redistribution note when known.
- What the source supports.
- Confidence level if the claim is inferred.

Avoid unsupported vendor claims, affiliate-style recommendations, and private nonprofit data unless there is explicit permission to use it.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run db:setup
npm run db:seed
npm run dev
```

Before opening a pull request:

```bash
npm run check
```

## Contribution Priorities

- Add real source-backed tool records.
- Add connector scripts for public datasets.
- Improve evidence review and scoring explainability.
- Keep the public dashboard usable without login.
