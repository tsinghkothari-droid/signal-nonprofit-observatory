# Data Model

## Core Tables

### sources

Tracks where evidence came from.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Source name |
| source_type | text | `api`, `bulk_download`, `manual`, `csv`, `airtable`, `baserow` |
| url | text | Source URL |
| license | text | Redistribution/license notes |
| refresh_policy | text | `manual`, `monthly`, `weekly`, `daily` |
| last_fetched_at | timestamptz | Last connector run |

### raw_records

Immutable source payloads.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| source_id | uuid | FK to `sources` |
| external_id | text | Source-side identifier |
| raw_json | jsonb | Original payload |
| content_hash | text | Deduplication |
| fetched_at | timestamptz | Fetch timestamp |

### tools

Software products, open-source projects, and informal stacks.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Tool name |
| website_url | text | Official URL |
| license_type | text | `open_source`, `commercial`, `mixed`, `informal_stack` |
| pricing_model | text | Free, per-seat, usage-based, etc. |
| implementation_difficulty | int | 0-100 |
| small_org_fit | int | 0-100 |
| notes | text | Human-reviewed summary |

### workflows

Nonprofit jobs-to-be-done.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Example: `Grant writing` |
| category | text | Fundraising, operations, reporting, etc. |
| description | text | Workflow definition |

### tool_workflow_fit

Maps tools to workflows.

| Field | Type | Notes |
| --- | --- | --- |
| tool_id | uuid | FK to `tools` |
| workflow_id | uuid | FK to `workflows` |
| fit_score | int | 0-100 |
| fit_label | text | Human-readable fit |
| evidence_status | text | `draft`, `reviewed`, `approved` |

### nonprofit_profiles

Reusable evaluation profiles.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| region | text | Global, South Asia, East Africa, etc. |
| org_size | text | Micro, small, medium |
| connectivity | text | Low, mixed, reliable |
| language_needs | text[] | Required languages |
| technical_capacity | text | Low, medium, high |

### gap_scores

Computed gap records.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| tool_id | uuid | FK to `tools` |
| workflow_id | uuid | FK to `workflows` |
| profile_id | uuid | FK to `nonprofit_profiles` |
| gap_score | int | 0-100 |
| ai_fit_score | int | 0-100 |
| cost_burden | int | 0-100 |
| field_readiness | int | 0-100 |
| multilingual_readiness | int | 0-100 |
| computed_at | timestamptz | Score timestamp |
| scoring_version | text | Scoring formula version |

### evidence_items

Reviewed claims used in scoring.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| source_id | uuid | FK to `sources` |
| tool_id | uuid | Nullable |
| workflow_id | uuid | Nullable |
| claim | text | Evidence claim |
| quote | text | Short source excerpt if allowed |
| source_url | text | URL |
| confidence | int | 0-100 |
| review_status | text | `draft`, `reviewed`, `approved`, `rejected` |

### evidence_chunks

Searchable source chunks.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| evidence_item_id | uuid | FK to `evidence_items` |
| chunk_text | text | Chunk content |
| embedding | vector | pgvector column |
| token_count | int | Optional |

### ai_use_cases

AI interventions by workflow.

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| workflow_id | uuid | FK to `workflows` |
| name | text | Use case name |
| value_type | text | Time saving, translation, summarization, etc. |
| risk_level | text | Low, medium, high |
| human_review_required | boolean | Should be true for most outputs |
| description | text | Use case notes |

## Initial Score Formula

`gap_score = weighted average of cost burden, field readiness gap, multilingual gap, implementation difficulty, evidence strength`

`ai_fit_score = weighted average of repetition, text intensity, reviewability, data availability, risk`

Scores should always be explainable and versioned.
