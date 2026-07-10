# Operations & Field Utility Goals

Last updated: 2026-07-09

## Objective

Build an operations and field-teams wedge for UtilityHub around shift handoffs, revision comparison, and cleaner work-pack notes that people can use without exposing internal context.

## Scope rule

Operations tools should stay focused on the narrow browser-local wedges that clearly save time in:

- shift handovers
- procedure and work-pack revision review
- action and timeline cleanup
- field-friendly note formatting
- sensitive detail redaction before sharing

They should not try to become:

- a work-management platform
- a helpdesk system
- an incident command tool
- a document repository
- a compliance authority

## Ranked operations pain points

| Rank | Pain point | Why it matters | Client-side fit | Wedge |
| --- | --- | --- | --- | --- |
| 1 | Handover notes are rushed, inconsistent, and easy to misread | The next shift needs a clearer view fast | Excellent | Strong |
| 2 | Procedure and work-pack revisions are compared by hand | Small changes can be missed when documents are noisy | Excellent | Strong |
| 3 | Sensitive identifiers and internal references often need a cleanup pass before sharing | Privacy and operational safety matter | Excellent | Strong |
| 4 | Field notes need to become cleaner checklists or tables quickly | The workflow is text-first and repetitive | Good | Strong |
| 5 | Timelines and action items are buried in unstructured notes | Teams need a quick way to package the sequence of events | Good | Medium-strong |

## Ranked operations tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Shift Handover Builder | Strong daily workflow fit across operations and field teams | Already built |
| 2 | Drawing Revision Diff Checker | Clear revision-review wedge for permits, procedures, and work packs | Already built |
| 3 | Secret Redactor | Strong privacy-first cleanup step before sharing notes or tickets | Already built |
| 4 | Incident Timeline Reconstructor | Good next-step utility for event and escalation reviews | Plan next |
| 5 | Work Pack Diff Checker | Helps compare two versions of instructions or field packs | Plan next |
| 6 | Checklist Builder | Turns rough field bullets into a cleaner task list | Plan next |
| 7 | Action Register Cleaner | Helps separate pending actions from general notes | Later |
| 8 | Shift Summary Formatter | Packages notes into a consistent handoff summary | Later |
| 9 | Timestamp Extractor | Pulls times and deadlines out of messy operational notes | Later |
| 10 | Change Log Compiler | Creates a cleaner change summary from freeform notes | Later |

## First 3 tools to ship

1. `Shift Handover Builder`
2. `Drawing Revision Diff Checker`
3. `Secret Redactor`

## Why these 3

- They fit the most common field and operations workflows without needing extra systems.
- They keep sensitive detail local while still improving readability.
- They are easy to explain and easy to adopt in a small-first utility collection.
- They give the workspace a practical balance of communication, revision review, and cleanup.

## Validation rule

Operations tools should meet all of these:

- Solve a real handover, revision, or cleanup workflow operations teams already do
- Be immediately useful without project-management or ticketing integration
- Keep sensitive data local in the browser
- Feel like a practical workflow aid, not a platform replacement

## MVP guardrails

### Shift Handover Builder

- Should: structure rough notes into grouped actions and urgent items
- Should not: become a full operations or incident system

### Drawing Revision Diff Checker

- Should: compare text-heavy revisions and highlight what changed
- Should not: pretend to interpret a full document set or CAD file

### Secret Redactor

- Should: remove obvious secrets and sensitive identifiers before sharing
- Should not: promise full organizational classification or legal de-identification

## Execution checklist

- [x] Reuse the industry ideation prompt format
- [x] Rank the main operations pain points
- [x] Rank the strongest operations tool opportunities
- [x] Define the first 3-tool operations wedge
- [ ] Validate the operations list against current UtilityHub tools and collections
- [ ] Build `Incident Timeline Reconstructor`
- [ ] Build `Work Pack Diff Checker`
- [ ] Build `Checklist Builder`
