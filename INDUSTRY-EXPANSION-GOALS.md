# UtilityHub Industry Expansion Goal Sheet

Last updated: 2026-07-07

## Objective

Expand UtilityHub beyond IT-first workflows into privacy-first browser tools for high-friction technical industries, while keeping every first-wave tool fully client-side.

## Evaluation model

Each candidate was ranked using:

- Traction: how often the workflow shows up in day-to-day work
- Privacy fit: how strongly local-only browser processing matters
- Build feasibility: how realistic a solid MVP is without a backend
- Cross-industry reuse: whether the tool helps more than one collection

Scoring guide: `5 = strongest`

## Validation rule for collection fit

A tool should appear in an industry collection only when at least one of these is true:

- The user in that industry would naturally describe the job using that tool concept
- The workflow is high-frequency in that industry
- The privacy-first browser-local value is obvious in that workflow

If a tool only fits because it is generically useful, it should stay out of the industry collection.

## Collection priorities

### Civil & Construction

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Pressure Drop & Head Loss Calculator | 5 | 4 | 5 | 5 | 19 | Shipping in phase 1 |
| 2 | Drawing Revision Diff Checker | 5 | 5 | 4 | 5 | 19 | Shipping in phase 1 |
| 3 | Material Takeoff + Carbon Estimator | 4 | 4 | 4 | 4 | 16 | Planned |

### Mechanical & Manufacturing

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Pressure Drop & Head Loss Calculator | 5 | 4 | 5 | 5 | 19 | Shipping in phase 1 |
| 2 | Tolerance Stack-Up Analyzer | 5 | 4 | 4 | 3 | 16 | Planned |
| 3 | Drawing Revision Diff Checker | 4 | 5 | 4 | 5 | 18 | Shipping in phase 1 |

### Electrical & Power

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Drawing Revision Diff Checker | 5 | 5 | 4 | 5 | 19 | Shipping in phase 1 |
| 2 | Panel Schedule / Single-Line Consistency Checker | 5 | 5 | 3 | 3 | 16 | Planned |
| 3 | Shift Handover Builder | 4 | 5 | 5 | 5 | 19 | Shipping in phase 1 |

### Medical & Clinical

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Shift Handover Builder | 5 | 5 | 5 | 5 | 20 | Shipping in phase 1 |
| 2 | Clinical Report Diff Checker | 5 | 5 | 4 | 3 | 17 | Planned |
| 3 | DICOM / PDF / Image De-Identifier | 5 | 5 | 3 | 2 | 15 | Planned |

### Mining & Resources

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Shift Handover Builder | 5 | 5 | 5 | 5 | 20 | Shipping in phase 1 |
| 2 | Pressure Drop & Head Loss Calculator | 4 | 4 | 5 | 5 | 18 | Shipping in phase 1 |
| 3 | Drawing Revision Diff Checker | 4 | 5 | 4 | 5 | 18 | Shipping in phase 1 |

### Operations & Field Teams

| Rank | Tool | Traction | Privacy fit | Feasibility | Reuse | Total | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Shift Handover Builder | 5 | 5 | 5 | 5 | 20 | Shipping in phase 1 |
| 2 | Drawing Revision Diff Checker | 4 | 5 | 4 | 5 | 18 | Shipping in phase 1 |
| 3 | Incident Timeline Reconstructor | 4 | 5 | 4 | 4 | 17 | Planned |

## Ranked top 10 overall

| Rank | Tool | Primary industries | Why it ranks highly |
| --- | --- | --- | --- |
| 1 | Shift Handover Builder | Medical, mining, electrical, field ops | Daily workflow, high repeat use, strong privacy story, easiest MVP |
| 2 | Pressure Drop & Head Loss Calculator | Civil, mechanical, mining | High-frequency engineering math with clean client-side execution |
| 3 | Drawing Revision Diff Checker | Civil, mechanical, electrical, mining, facilities | Expensive workflow friction with clear browser-local value |
| 4 | Clinical Report Diff Checker | Medical | High trust, high review value, strong specialist appeal |
| 5 | Material Takeoff + Carbon Estimator | Civil, mechanical, sustainability | Valuable at tender stage and concept design |
| 6 | Tolerance Stack-Up Analyzer | Mechanical, manufacturing | Strong repeat utility for design and QA teams |
| 7 | Panel Schedule / Single-Line Consistency Checker | Electrical | Very sticky niche workflow with clear job-to-be-done |
| 8 | DICOM / PDF / Image De-Identifier | Medical | Excellent privacy fit and differentiation |
| 9 | Incident Timeline Reconstructor | Mining, ops, safety | Useful for investigations and shift reviews |
| 10 | Pump / Fan Curve Intersection Visualizer | Mechanical, process | Valuable but better as a phase 2 engineering visualizer |

## Sub-goal: phase 1 execution

Ship the first 3 non-IT tools with the best mix of traction, privacy fit, and implementation speed:

1. Shift Handover Builder
2. Pressure Drop & Head Loss Calculator
3. Drawing Revision Diff Checker

### Delivery checklist

- [x] Prioritize 3 tools per non-IT industry
- [x] Rank the top 10 overall
- [x] Create non-IT collections for discovery
- [x] Implement `Shift Handover Builder`
- [x] Implement `Pressure Drop & Head Loss Calculator`
- [x] Implement `Drawing Revision Diff Checker`
- [x] Wire routes, guides, and collections into the live app
- [ ] Expand with phase 2 specialist tools
