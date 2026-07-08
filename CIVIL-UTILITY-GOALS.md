# Civil Utility Goals

Last updated: 2026-07-08

## Objective

Build a civil-engineering-specific wedge for UtilityHub around revision-heavy, spreadsheet-heavy, and quick-check workflows that civil, site, and construction engineers repeat outside of BIM, GIS, and full project suites.

## Scope rule

Civil tools should stay focused on the narrow browser-local wedges that clearly save time in:

- design review
- quantity and schedule comparison
- hydraulic and pipe-run checks
- tender-stage calculation support
- field-to-office document handoff

They should not try to become:

- a CAD or BIM modeler
- a full quantity surveying platform
- a scheduling suite
- a GIS replacement
- a project-management system

## Ranked civil pain points

| Rank | Pain point | Why it matters | Client-side fit | Wedge |
| --- | --- | --- | --- | --- |
| 1 | Drawing and revision comparison is manual, slow, and error-prone | Civil teams constantly review revised plans, notes, schedules, and issued-for-construction changes | Excellent | Strong |
| 2 | Quick hydraulic and pipe-run checks still live in spreadsheets | Drainage, water, utilities, and pump-related checks are frequent and repetitive | Excellent | Strong |
| 3 | Material takeoff and early embodied-carbon comparison are awkward in tender/design stages | Teams repeatedly compare simple quantity scenarios before using heavier estimating workflows | Good | Strong |
| 4 | Quantity, BOQ, or schedule export comparison is clunky | Small changes across exported spreadsheets can create costly misses | Excellent | Strong |
| 5 | Site/design assumptions are scattered across rough notes and markups | Teams need compact browser-local utilities that structure recurring review work without uploading files | Good | Medium-strong |

## Ranked civil tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Drawing Revision Diff Checker | Fits the daily revision-review job directly and already works across civil plan notes, schedules, and issue comparisons | Build now |
| 2 | Pressure Drop & Head Loss Calculator | Strong fit for water, drainage, and utility pipe-run checks; easy to trust and use repeatedly | Build now |
| 3 | Material Takeoff + Carbon Estimator | Strong tender-stage wedge for concept comparison without needing a full estimating suite | Plan next |
| 4 | BOQ / Quantity Diff Checker | Clear spreadsheet-export wedge for comparing quantity changes between revisions or bidders | Plan next |
| 5 | Civil Formula Finder | Good recurring lookup utility for common hydraulic, earthwork, slope, and concrete formulas | Plan next |
| 6 | Site RFI / Handover Builder | Useful for structuring rough site notes into grouped actions, but less universal than revision and quantity tools | Later |

## First 5 tools to prioritize

1. `Drawing Revision Diff Checker`
2. `Pressure Drop & Head Loss Calculator`
3. `Material Takeoff + Carbon Estimator`
4. `BOQ / Quantity Diff Checker`
5. `Civil Formula Finder`

## Why these 5

- They map to work civil engineers already do in exported spreadsheets, marked-up PDFs, tender comparisons, and quick hydraulic calculations.
- They stay meaningfully client-side without needing BIM/GIS integrations.
- They are easier to trust than AI-heavy assistants because the assumptions and calculations can stay visible.
- They have a clear path to discovery because engineers already search for revision compare, head loss, quantity compare, and takeoff support utilities.

## Validation rule

Civil tools should meet all of these:

- Solve a real revision, spreadsheet, quantity, or quick-check workflow civil teams already do
- Be immediately useful without BIM, CAD, GIS, or ERP integration
- Keep sensitive project data local in the browser
- Feel better than a fragile workbook or PDF compare routine

## MVP guardrails

### Drawing Revision Diff Checker

- Should: compare extracted text, schedules, notes, and revision language between two plan exports
- Should not: pretend to fully interpret vector drawings or replace a plan viewer

### Pressure Drop & Head Loss Calculator

- Should: support recurring water-like flow checks with transparent assumptions and fast iteration
- Should not: overreach into full network modelling

### Material Takeoff + Carbon Estimator

- Should: accept simple quantity tables or pasted rows and estimate totals plus embodied-carbon comparisons
- Should not: try to replace full estimating software, live pricing, or contractor procurement workflows

### BOQ / Quantity Diff Checker

- Should: compare two quantity/BOQ exports and show added, removed, and changed rows clearly
- Should not: become a full cost-management system

### Civil Formula Finder

- Should: provide trusted lookup for recurring equations and variables with category filters
- Should not: become a generic AI chatbot or a textbook clone

## Execution checklist

- [x] Reuse the industry ideation prompt format
- [x] Rank the main civil pain points
- [x] Rank the strongest civil tool opportunities
- [x] Define the first 5-tool civil wedge
- [ ] Validate the civil list against current UtilityHub tools and collections
- [ ] Build `Material Takeoff + Carbon Estimator`
- [ ] Build `BOQ / Quantity Diff Checker`
- [ ] Build `Civil Formula Finder`
