# Mechanical Validation Audit

Last updated: 2026-07-07

## Confidence summary

- Overall workflow relevance: `High`
- Current implementation correctness: `Medium-high`
- Current UX fit for working mechanical engineers: `Medium`
- Confidence these tools are ready to become a mechanical landing-page wedge: `Medium`

The mechanical section is now pointed at legitimate engineering friction. The remaining risk is not industry mismatch. The remaining risk is depth, workflow polish, and whether the tools feel faster than the spreadsheets and handbook habits they are trying to replace.

## Overall assessment

### What is working

- The mechanical collection is now narrow enough to feel intentional instead of generic.
- The tools map to real recurring work: tolerance stacks, fits, BOM diffs, drawing revision review, pressure-drop checks, and formula lookup.
- The tools are local-first, which is a real advantage for sensitive design artifacts and exports.
- The collection story is coherent: review, compare, calculate, and look up.

### What is not working yet

- The UI still feels like a general utility site with a mechanical layer added on top, not a mechanical-native workspace.
- Several tools still expect raw CSV or manual text preparation that many engineers will tolerate once, but not happily every day.
- Some tools are still MVP-simple in ways that may block real adoption even if the core idea is good.
- The global navigation does not reinforce the mechanical workflow. Users still see a generic category-driven sidebar first.

## Tool-by-tool validation

## 1. Tolerance Stack-Up Analyzer

- Fit: `Strong`
- Workflow relevance: `Very high`
- Current UX: `Medium`
- Adoption confidence: `Medium-high`

### Why it belongs

- Tolerance stackups are a real spreadsheet-heavy pain.
- The tool directly attacks a workflow mechanical engineers already do outside expensive CAD suites.
- Worst-case and RSS output are the right first-level outputs.

### What is strong

- The value proposition is clear.
- The output is immediately interpretable.
- The tool is local and fast.

### What is weak

- Input format is too raw for broader adoption.
- Engineers often think in rows, nominals, bilateral/unilateral tolerances, and stack direction visually, not as pasted CSV first.
- It does not yet help with common shorthand habits like copied spreadsheet rows, tab-delimited input, or quick add/remove row interactions.
- It does not show target gap/pass-fail framing, only calculated stack range.

### Verdict

- Keep and invest.
- This is one of the best mechanical wedge tools in the product.

## 2. Hole/Shaft Fit Calculator

- Fit: `Strong`
- Workflow relevance: `High`
- Current UX: `Medium`
- Adoption confidence: `Medium`

### Why it belongs

- Fits and tolerance windows are mechanically native.
- It pairs naturally with tolerance stack work and manufacturability review.

### What is strong

- The core clearance/interference logic is useful.
- The interpretation text helps non-specialists.
- The scope is honest.

### What is weak

- It does not yet support fit shorthand such as `H7/h6`, which is a major real-world entry mode.
- Engineers may want both metric defaults and common fit references, not only raw limit entry.
- It lacks copy/export and quick comparison of candidate fits.

### Verdict

- Keep and improve.
- Strong concept, but it needs a more real-world input model to become habitual.

## 3. BOM Diff Checker

- Fit: `Strong`
- Workflow relevance: `High`
- Current UX: `Medium`
- Adoption confidence: `Medium`

### Why it belongs

- Export-to-export BOM review is a real gap between spreadsheets and PLM.
- The workflow is painful enough that even a lightweight browser tool can help.

### What is strong

- The purpose is obvious.
- Added, removed, quantity-changed, and description-changed are exactly the right first-pass categories.
- This is useful even for teams not ready for PLM.

### What is weak

- The assumed CSV structure is narrow.
- Real BOM exports often contain extra columns, alternate headers, revisions, units, vendor data, or assembly levels.
- There is no column mapping or hierarchy support yet.
- Highlights are useful, but the review surface is still closer to a text summary than a true change table.

### Verdict

- Keep and deepen.
- Good wedge tool, but it needs more flexible import handling to win repeated use.

## 4. Pressure Drop & Head Loss Calculator

- Fit: `Medium`
- Workflow relevance: `Medium-high`
- Current UX: `Good`
- Adoption confidence: `Medium`

### Why it belongs

- Mechanical engineers do recurring flow and pressure-drop sanity checks.
- It also overlaps well with civil, HVAC, and mining.

### What is strong

- Input/output structure is clear.
- Head-loss breakdown is useful.
- The assumptions are stated honestly.

### What is weak

- It is not uniquely mechanical, so it is less differentiating than tolerance or fit tools.
- It currently targets water-like fluids only.
- It does not yet help with scenario comparison, which is often how engineers actually use quick hydraulic calcs.

### Verdict

- Keep, but do not treat it as the main mechanical flagship.
- Useful supporting tool, not the core moat.

## 5. Drawing Revision Diff Checker

- Fit: `Strong`
- Workflow relevance: `High`
- Current UX: `Medium-high`
- Adoption confidence: `Medium-high`

### Why it belongs

- Revision comparison is painful and risky.
- The tool addresses a real review layer around engineering documentation.

### What is strong

- The workflow is simple and understandable.
- Numeric change detection is valuable.
- This tool can work across mechanical, civil, electrical, mining, and operations.

### What is weak

- It still depends on pasted or extracted text rather than direct document support.
- Real revision workflows often need a stronger tabular or side-by-side review surface.
- The current wording and UI are credible, but not yet “must use every release.”

### Verdict

- Keep and prioritize.
- This has strong cross-industry potential and is one of the best traction candidates.

## 6. Mechanical Formula Finder

- Fit: `Medium-high`
- Workflow relevance: `High`
- Current UX: `Good`
- Adoption confidence: `Medium`

### Why it belongs

- Formula hunting is real pain.
- Engineers do want fast lookup without relying on hallucination-prone AI or old notes.

### What is strong

- Search plus category filter is the right foundation.
- The formula library is now broad enough to be practically useful.
- The honesty about scope is good.

### What is weak

- It still is not a standards-grade or handbook-grade reference.
- There are no subtopics, assumptions, units guidance, or worked examples.
- Some users will still ask “which one do I use for my case?” and the tool does not yet guide that choice.

### Verdict

- Keep and expand carefully.
- Strong SEO and repeat-use potential, but it needs more structure and guidance to become trusted.

## Ranked strength

| Rank | Tool | Validation status | Why |
| --- | --- | --- | --- |
| 1 | Tolerance Stack-Up Analyzer | Strong | Best wedge against spreadsheet pain |
| 2 | Drawing Revision Diff Checker | Strong | Real frustration, broad applicability, simple value |
| 3 | BOM Diff Checker | Good | Strong export-review use case, needs more flexible import |
| 4 | Hole/Shaft Fit Calculator | Good | Mechanically native, but needs shorthand and standards-aware input |
| 5 | Mechanical Formula Finder | Good | Broadly useful, but still needs stronger guidance layers |
| 6 | Pressure Drop & Head Loss Calculator | Good support tool | Useful but less uniquely mechanical |

## Ranked improvement priorities

1. `Tolerance Stack-Up Analyzer`
   Add row-based entry, target gap checks, and easier paste handling.
2. `Hole/Shaft Fit Calculator`
   Add ISO fit shorthand input and fit-table assisted workflows.
3. `BOM Diff Checker`
   Add flexible header mapping, richer review table, and optional assembly-level grouping.
4. `Drawing Revision Diff Checker`
   Improve review surface and eventually support direct document extraction flow.
5. `Mechanical Formula Finder`
   Add subtopics, assumptions, and “when to use” guidance.
6. `Pressure Drop & Head Loss Calculator`
   Add scenario comparison and broader fluid presets.

## Mechanical collection verdict

The mechanical section is good enough to keep building on. It is not yet good enough to assume product-market fit without more workflow polish and user feedback.

### Practical confidence rating

- As a relevant mechanical wedge: `8/10`
- As a polished mechanical product experience: `5.5/10`
- As a foundation worth doubling down on: `8.5/10`

