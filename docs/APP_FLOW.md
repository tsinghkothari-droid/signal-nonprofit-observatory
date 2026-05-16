# App Flow - Signal Nonprofit Software Observatory

## First Screen

The first screen should be the working research console, not a landing page.

Primary areas:

- Left rail: profile filters and scoring weights.
- Top bar: search and reset.
- Snapshot row: tools in lens, median gap, strong AI fit, highest pressure.
- Coverage matrix: workflow by region.
- Landscape table: sortable software options.
- Inspector: selected tool, gap drivers, and AI intervention.

## User Journey 1 - Find Tools for a Nonprofit

1. User selects region.
2. User selects organization size.
3. User selects workflow.
4. User adjusts cost, field readiness, and AI usefulness weights.
5. App updates:
   - tool count
   - median gap
   - coverage matrix
   - landscape table
6. User clicks a tool row.
7. Inspector shows:
   - weighted gap score
   - AI-fit score
   - field readiness
   - evidence-backed drivers
   - AI intervention idea

## User Journey 2 - Identify Build Opportunities

1. User opens Gap Map view.
2. App ranks workflows by gap score.
3. User filters by region and org size.
4. User reviews repeated drivers.
5. User exports a builder brief.

Builder brief sections:

- Target nonprofit profile.
- Workflow pain.
- Existing tools.
- Why existing tools miss.
- AI opportunity.
- Risks and human-review requirements.
- Source evidence.

## User Journey 3 - Add Evidence

1. Contributor opens import screen.
2. Contributor selects source type:
   - CSV upload
   - public API
   - manual URL/evidence entry
3. Contributor maps fields.
4. App previews normalized rows.
5. Contributor saves as draft.
6. Reviewer approves.
7. Approved evidence influences public scores.

## User Journey 4 - Generate a Report

1. User applies a research lens.
2. User clicks export.
3. App generates markdown report.
4. User can edit the generated report.
5. User downloads or shares the report.

## Important States

- Empty state: no matching tools.
- Loading state: connector/import running.
- Error state: API/source failed.
- Review state: imported data awaiting approval.
- Stale data state: source has not refreshed recently.
- Restricted source state: data can be used internally but not redistributed.

## Interaction Rules

- Filters update the dashboard immediately.
- Sort controls do not reset selected tool.
- Selecting a row updates the inspector without page navigation.
- Evidence links open in a separate tab.
- Report export uses the current filter state.
- Admin/import features can stay hidden until auth is added.
