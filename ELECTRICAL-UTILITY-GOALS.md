# Electrical Utility Goals

Last updated: 2026-07-08

## Objective

Build an electrical-engineering-specific wedge for UtilityHub around the quick checks, conduit decisions, panel review, and formula lookup work that engineers repeat outside larger power-design tools.

## Scope rule

Electrical tools should stay focused on the browser-local wedges that clearly save time in:

- load checks
- cable sizing and voltage drop
- conduit fill and routing sanity checks
- panel schedule review
- recurring formula lookup

They should not try to become:

- a full power-system simulator
- a protection-coordination suite
- a BIM or CAD replacement
- a utility-network planner
- a code-compliance authority

## Ranked electrical pain points

| Rank | Pain point | Why it matters | Client-side fit | Wedge |
| --- | --- | --- | --- | --- |
| 1 | Voltage drop and cable sizing are repeated constantly in spreadsheets | Electrical teams frequently sanity-check load, length, voltage, and conductor assumptions before moving forward | Excellent | Strong |
| 2 | Conduit fill is checked late and often by hand | Small routing mistakes create avoidable rework and field friction | Excellent | Strong |
| 3 | Panel schedules are hard to keep readable across revisions | Even small circuit edits can make a schedule harder to review quickly | Good | Strong |
| 4 | Formula lookup still lives in notes, books, or memory | Engineers need the right equation quickly, not another AI guess | Excellent | Strong |
| 5 | Protection and coordination questions start early but are too heavy for a first-pass tool | Teams often need a lighter browser-local step before formal study tools | Medium | Medium |

## Ranked electrical tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Voltage Drop Calculator | Direct daily-use check with a strong trust and speed story | Build now |
| 2 | Cable Sizing Assistant | High-value early design wedge that pairs with voltage drop | Build now |
| 3 | Conduit Fill Calculator | Clear browser-local sanity check for routing and install decisions | Build now |
| 4 | Panel Schedule Builder | Makes small schedule work easier to read and share | Build now |
| 5 | Electrical Formula Finder | Great lookup utility and strong SEO wedge | Build now |
| 6 | Breaker / Protection Checker | Good next step, but more dependent on assumptions and local code context | Later |

## First 5 tools to ship

1. `Voltage Drop Calculator`
2. `Cable Sizing Assistant`
3. `Conduit Fill Calculator`
4. `Panel Schedule Builder`
5. `Electrical Formula Finder`

## Why these 5

- They map to work electrical engineers already do in spreadsheets, schedules, and reference tabs.
- They stay meaningfully client-side without requiring full power-system software.
- They are easier to trust than a generic AI assistant because the assumptions and lookup data can stay visible.
- They have a clear path to discovery because engineers already search for voltage drop, cable sizing, conduit fill, and formula support.

## Validation rule

Electrical tools should meet all of these:

- Solve a real load, cable, conduit, or schedule workflow electrical teams already do
- Be immediately useful without CAD, SCADA, or power-study integration
- Keep sensitive project data local in the browser
- Feel better than a fragile workbook or handbook hunt

## MVP guardrails

### Voltage Drop Calculator

- Should: compare drop percent, resistance, and practical max length for a selected cable
- Should not: pretend to be a full power-flow study

### Cable Sizing Assistant

- Should: shortlist a practical cable size using visible assumptions and simple derating factors
- Should not: replace a code table or certified design review

### Conduit Fill Calculator

- Should: estimate fill from a simple cable list and conduit size
- Should not: become a manufacturer database or a final compliance tool

### Panel Schedule Builder

- Should: help keep small panel schedules readable, balanced, and easy to copy
- Should not: become a protection-coordination or relay study tool

### Electrical Formula Finder

- Should: provide trusted lookup for recurring equations and variables with category filters
- Should not: become a generic AI chatbot or a textbook clone

## Execution checklist

- [x] Reuse the industry ideation prompt format
- [x] Rank the main electrical pain points
- [x] Rank the strongest electrical tool opportunities
- [x] Define the first 5-tool electrical wedge
- [ ] Validate the electrical list against current UtilityHub tools and collections
- [ ] Build `Voltage Drop Calculator`
- [ ] Build `Cable Sizing Assistant`
- [ ] Build `Conduit Fill Calculator`
- [ ] Build `Panel Schedule Builder`
- [ ] Build `Electrical Formula Finder`
