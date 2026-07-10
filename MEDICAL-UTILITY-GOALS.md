# Medical Utility Goals

Last updated: 2026-07-09

## Objective

Build a medical and clinical wedge for UtilityHub around structured handovers, note cleanup, and privacy-first review workflows that clinicians can use without leaking data into generic tech tools.

## Scope rule

Medical tools should stay focused on the narrow browser-local wedges that clearly save time in:

- shift and ward handovers
- clinical note and report comparison
- de-identification and safe sharing
- quick review of text extracted from reports or PDFs

They should not try to become:

- a medical record system
- a diagnostic assistant
- a prescribing engine
- a billing workflow
- a compliance authority

## Ranked medical pain points

| Rank | Pain point | Why it matters | Client-side fit | Wedge |
| --- | --- | --- | --- | --- |
| 1 | Shift handover notes are rushed, inconsistent, and hard to read under time pressure | Clinical teams need the right context fast at changeover | Excellent | Strong |
| 2 | Report and note revisions are compared manually across ward, imaging, and follow-up workflows | Small text changes can affect care and escalation | Excellent | Strong |
| 3 | Patient identifiers still show up in notes that need to be shared or pasted elsewhere | Privacy risk is high and local-only cleanup matters | Excellent | Strong |
| 4 | Extracted report text is hard to scan when it comes from PDFs or OCR | Clinicians often need a quick review surface before a deeper chart check | Good | Strong |
| 5 | Follow-up actions and due dates get buried inside long notes | Pending work can be missed when the handover is not structured | Good | Medium-strong |

## Ranked medical tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Shift Handover Builder | Direct daily-use fit for wards, on-call teams, and clinical transitions | Already built |
| 2 | Clinical Report Diff Checker | Strong review wedge for comparing report text, summaries, and extracted notes | Build now |
| 3 | Clinical De-Identifier | High privacy value for note cleanup before broader sharing | Build now |
| 4 | Ward Task Builder | Turns rough ward notes into action-oriented follow-up items | Plan next |
| 5 | Radiology Note Comparator | Useful for comparing short report extracts before escalation | Plan next |
| 6 | Discharge Summary Checker | Helps spot changes between draft and final discharge text | Plan next |
| 7 | Patient List Formatter | Helps turn messy census notes into a cleaner working list | Later |
| 8 | Observation Trend Snapshot | Useful for quick text-based trend review from pasted vitals notes | Later |
| 9 | Consent Note Cleaner | Helps structure short consent or discussion notes for review | Later |
| 10 | Clinical Checklist Builder | Useful for recurring rounds and sign-off steps | Later |

## First 3 tools to ship

1. `Shift Handover Builder`
2. `Clinical Report Diff Checker`
3. `Clinical De-Identifier`

## Why these 3

- They map to the fastest, most common browser-local work clinicians already do in text-heavy handover flows.
- They stay clear of deep medical decision-making while still giving practical value.
- They give the collection a strong privacy story without forcing users into generic tech utilities.
- They are easy to explain, easy to try, and easy to keep local.

## Validation rule

Medical tools should meet all of these:

- Solve a real handover, review, or cleanup workflow clinicians already do
- Be immediately useful without EHR, PACS, or hospital-system integration
- Keep sensitive text local in the browser
- Feel like a workflow aid, not a diagnostic engine

## MVP guardrails

### Shift Handover Builder

- Should: structure rough shift or ward notes into grouped actions, urgent items, and a markdown summary
- Should not: act like a clinical decision system or rewrite the underlying content

### Clinical Report Diff Checker

- Should: compare pasted report text or OCR extracts and isolate changed lines
- Should not: pretend to interpret medical meaning or replace specialist review

### Clinical De-Identifier

- Should: remove obvious identifiers and sensitive contact details before broader sharing
- Should not: promise legal de-identification without human review

## Execution checklist

- [x] Reuse the industry ideation prompt format
- [x] Rank the main medical pain points
- [x] Rank the strongest medical tool opportunities
- [x] Define the first 3-tool medical wedge
- [ ] Validate the medical list against current UtilityHub tools and collections
- [ ] Build `Clinical Report Diff Checker`
- [ ] Build `Clinical De-Identifier`
