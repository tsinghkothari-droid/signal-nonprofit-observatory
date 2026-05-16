# PRD - Signal Nonprofit Software Observatory

## Product Summary

Signal is an open-source research workspace that helps small and global nonprofits understand what software already exists, where available tools fail their constraints, and where AI-enabled software can reduce real operational work.

The product is not a generic software directory. It is a decision-support and evidence-mapping tool for nonprofit technology gaps.

## Problem

Small nonprofits often choose software from vendor directories, consultant recommendations, or peer anecdotes. Existing directories list features, but they rarely expose practical constraints that matter to small organizations:

- Total cost after implementation, seats, support, and messaging.
- Mobile and low-bandwidth viability.
- Multilingual and regional readiness.
- Implementation difficulty for teams without technical staff.
- Fit for field workflows such as WhatsApp, spreadsheets, grants, and reporting.
- AI usefulness tied to real workflows rather than hype.

## Target Users

1. Small nonprofit operators
   - Staff count: 1-25.
   - Need: pick affordable tools and avoid implementation traps.

2. Foundation and capacity-building advisors
   - Need: identify recurring gaps and recommend funding or support.

3. Open-source builders
   - Need: find software gaps worth building for nonprofits.

4. Researchers
   - Need: analyze nonprofit technology adoption and AI readiness using public evidence.

## Core Jobs

- Compare software options by workflow and nonprofit profile.
- Identify underserved workflows for a region, size, or operating model.
- Link every gap claim to source evidence.
- Recommend AI interventions only when they reduce manual work and preserve human review.
- Export a research brief for a nonprofit, funder, or builder.

## MVP Scope

### In Scope

- Searchable software landscape table.
- Filters for region, organization size, workflow, cost sensitivity, field readiness, and AI usefulness.
- Gap score and AI-fit score.
- Evidence-backed tool profiles.
- Public dataset ingestion for at least 3 sources.
- Admin/import workflow through CSV or JSON.
- Basic semantic search over source excerpts and tool notes.
- Exportable markdown report.

### Out of Scope

- User accounts for initial prototype.
- Paid marketplace or affiliate model.
- Automated vendor scoring without human review.
- Private nonprofit data ingestion.
- Production recommendation engine that makes legal, financial, or procurement decisions.

## Success Metrics

- Users can complete a software landscape query in under 2 minutes.
- Every visible score has at least one source or analyst note.
- At least 100 tools and 25 workflows are mapped for public beta.
- At least 5 reusable evidence connectors are implemented.
- At least 10 AI use cases are classified by workflow, value, and risk.

## Primary Workflows

1. Research a nonprofit profile.
   - Select region, size, workflow, constraints.
   - View matching tools and gap scores.
   - Inspect gap drivers and source evidence.

2. Discover what to build next.
   - Sort workflows by unmet need.
   - Review repeated constraints.
   - Open AI-fit recommendations.
   - Export a builder brief.

3. Add evidence.
   - Import CSV/API data.
   - Map fields to internal schema.
   - Review source reliability.
   - Approve evidence for scoring.

## Product Principles

- Evidence before recommendation.
- Small-team fit beats feature count.
- AI is an intervention class, not the product category.
- Human review stays in the loop.
- Open data where possible; source restrictions respected where required.
