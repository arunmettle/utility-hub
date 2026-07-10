# Mining Utility Goals

Last updated: 2026-07-09

## Objective

Build a mining and resources wedge for UtilityHub around shift control, quick hydraulic checks, revision review, and field-note cleanup that teams can use without exposing site data.

## Scope rule

Mining tools should stay focused on the narrow browser-local wedges that clearly save time in:

- shift handovers
- dewatering and transfer-line checks
- drawing and procedure revision comparison
- incident-ready field notes
- quick review of site documents

They should not try to become:

- a fleet dispatch system
- a mine planning platform
- a full process simulator
- an ERP replacement
- a safety management authority

## Ranked mining pain points

| Rank | Pain point | Why it matters | Client-side fit | Wedge |
| --- | --- | --- | --- | --- |
| 1 | Shift handovers across crews, control rooms, and maintenance are messy and time-sensitive | Missing context causes delays and repeat work | Excellent | Strong |
| 2 | Dewatering and water-transfer checks still happen in lightweight spreadsheets or memory | Quick hydraulic sanity checks are common and repetitive | Excellent | Strong |
| 3 | Drawing and procedure revisions are hard to compare before field execution | Small document changes can affect safety and productivity | Excellent | Strong |
| 4 | Incident notes and action lists are difficult to package cleanly for the next shift | Field detail gets buried unless it is structured early | Good | Strong |
| 5 | Site notes often need a fast cleanup pass before they are shared broadly | Private operational context should stay local | Good | Medium-strong |

## Ranked mining tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Shift Handover Builder | Daily operational use with a strong local-first privacy story | Already built |
| 2 | Pressure Drop & Head Loss Calculator | High-frequency quick check for dewatering and transfer-line workflows | Already built |
| 3 | Drawing Revision Diff Checker | Strong field-change review wedge for procedures and site documents | Already built |
| 4 | Incident Timeline Reconstructor | Useful for turning messy events into a cleaner sequence | Plan next |
| 5 | Dewatering Log Checker | Helpful for comparing pump, level, and flow notes over time | Plan next |
| 6 | Shift Risk Register Builder | Converts rough notes into a cleaner risk/action register | Plan next |
| 7 | Permit Note Comparator | Helps field teams spot what changed between permit revisions | Later |
| 8 | Equipment Downtime Summary | Turns maintenance interruptions into a cleaner handover artifact | Later |
| 9 | Work Pack Cleanup Tool | Makes rough field instructions easier to share and review | Later |
| 10 | Site Observation Tracker | Helps summarize short site observations without a heavier system | Later |

## First 3 tools to ship

1. `Shift Handover Builder`
2. `Pressure Drop & Head Loss Calculator`
3. `Drawing Revision Diff Checker`

## Why these 3

- They match the highest-frequency daily workflows in mining and resources.
- They stay browser-local and avoid exposing operational detail to extra systems.
- They make the mining collection useful immediately without waiting for specialist integrations.
- They give the workspace a practical mix of communication, calculation, and revision review.

## Validation rule

Mining tools should meet all of these:

- Solve a real shift, hydraulic, or revision workflow mining teams already do
- Be immediately useful without mine-planning or fleet-system integration
- Keep sensitive site data local in the browser
- Feel like a practical field aid, not a heavy operations suite

## MVP guardrails

### Shift Handover Builder

- Should: structure rough shift notes into grouped actions and urgent items
- Should not: become a full incident-management system

### Pressure Drop & Head Loss Calculator

- Should: give a quick sanity check for water-transfer and dewatering lines
- Should not: pretend to replace a hydraulic network model

### Drawing Revision Diff Checker

- Should: compare extracted revision text and highlight changes clearly
- Should not: act like a CAD viewer or full PDF renderer

## Execution checklist

- [x] Reuse the industry ideation prompt format
- [x] Rank the main mining pain points
- [x] Rank the strongest mining tool opportunities
- [x] Define the first 3-tool mining wedge
- [ ] Validate the mining list against current UtilityHub tools and collections
- [ ] Build `Incident Timeline Reconstructor`
- [ ] Build `Dewatering Log Checker`
- [ ] Build `Shift Risk Register Builder`
