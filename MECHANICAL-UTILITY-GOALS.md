# Mechanical Utility Goals

Last updated: 2026-07-07

## Objective

Build a mechanical-engineering-specific wedge for UtilityHub around the Excel-heavy, revision-heavy, quick-calculation work that engineers repeatedly do outside of expensive CAD/CAE suites.

## Market evidence

### Pain point 1: tolerance stack-up work is common, slow, and often spreadsheet-driven

- A mechanical engineer said tolerance stacks for product gaps "`takes super long`" and asked how people keep them organized across Excel and PowerPoint: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1aczdlh/tolerance_stacks/)
- Another engineer said they spend time in Excel doing "`yield calculations, tolerance stackups`": [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1qdml4v/anyone_else_spending_more_time_in_excel_than_cad/)
- Another thread described spending a day in Excel on tolerancing and "`leaving pissed off cause it doesn't actually do what I needed it to`": [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1asc1du/how_often_do_you_guys_actually_use_equations_in/)
- Engineers discussing tolerance tools said Excel is still the "`bar to beat`" because it is flexible, but that messy sheets get passed around and become hard to understand: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1td3qb9/please_help_tried_to_make_a_tolerance_stack_up/)
- Existing premium CAD pricing shows tolerance stack-up analysis is often bundled into expensive software tiers. SOLIDWORKS lists "`Automated tolerance stack-up analysis`" in the Professional plan at `$3,456 USD/year`: [SOLIDWORKS pricing](https://www.solidworks.com/how-to-buy/solidworks-design-plans-pricing)

### Pain point 2: revision comparison for drawings and prints is still painful

- A user explicitly asked for a diff tool for engineering drawings and said comparing revised vs released prints "`would save so much time`": [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1jsm5o9/diff_tool_for_engineering_drawings/)
- A real field issue was caused because a contractor bid from an old drawing revision: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1950xsq/what_did_you_do_at_work_today/)

### Pain point 3: engineers rely on spreadsheets for recurring calculations

- A mechanical engineer said Excel is used "`Almost every day`" and that worksheets automate daily calculations and track tolerance stackups: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/fwxg85/as_a_mechanical_engineer_how_is_ms_excel_used_in/)
- Another thread shows daily work involving "`Used CAD and excel to size pipes, pick out valves and make estimate drawings`": [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1950xsq/what_did_you_do_at_work_today/)

### Pain point 4: formula lookup is cumbersome and AI is not trusted enough

- A mechanical engineer said textbooks are "`too cumbersome`" for finding formulas quickly and "`ChatGPT is ok, but makes a ton of mistakes`", so they built a personal formula repo: [reddit](https://www.reddit.com/r/AskEngineers/comments/1mpcavb/what_is_your_goto_tool_for_find_engineering/)

### Pain point 5: BOM/version workflows fall back to Excel or clunky systems

- Engineers described CAD/BOM processes based on Excel exports and macros: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/18z0oqi/how_are_folks_doing_bom_management_for_new/)
- One engineer said they were building BOMs in Excel and trying to convince management that Excel is "`NOT the way to go`": [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1c5pf42/openbom_with_solidworks/)
- Another thread says teams drift back to spreadsheets if PLM/PDM tools slow engineers down: [reddit](https://www.reddit.com/r/MechanicalEngineering/comments/1rj0gel/looking_for_firsthand-duro-plm-reviews-for-plm/)

### Pricing and adoption wedge

- Onshape commercial pricing starts at `$1,500/user/year` for Standard and `$2,500/user/year` for Professional: [Onshape pricing](https://www.onshape.com/en/pricing)
- SOLIDWORKS online single-user pricing ranges from `$2,820` to `$4,716 USD/year`: [SOLIDWORKS pricing](https://www.solidworks.com/how-to-buy/solidworks-design-plans-pricing)
- A verified review on Capterra says the premium version is "`expensive for an individual or even for academics and small companies`": [Capterra review](https://www.capterra.com/p/93121/SolidWorks-Premium/reviews/)

## Ranked pain points

| Rank | Pain point | Evidence strength | Frequency | Client-side fit | Wedge |
| --- | --- | --- | --- | --- | --- |
| 1 | Tolerance stack-up and fit-up analysis lives in messy spreadsheets | Very high | Very high | Excellent | Strong |
| 2 | Drawing/print revision comparison is manual and risky | High | High | Excellent | Strong |
| 3 | Quick recurring hand calculations still happen in Excel | High | High | Excellent | Strong |
| 4 | BOM comparison and change review are clunky without expensive systems | High | Medium-high | Good | Strong |
| 5 | Formula lookup is slow and AI is not trusted for exact equations | Medium-high | High | Excellent | Medium-strong |

## Ranked mechanical tool opportunities

| Rank | Tool | Why it wins | Status |
| --- | --- | --- | --- |
| 1 | Tolerance Stack-Up Analyzer | Directly addresses the spreadsheet pain and expensive-tool gap; likely to become daily-use | Build now |
| 2 | Drawing Revision Diff Checker | Clear time saver with proven frustration and review risk | Already built |
| 3 | Pressure Drop & Head Loss Calculator | Repeated practical engineering math that already happens in Excel | Already built |
| 4 | BOM Diff Checker | Useful for Excel-export workflows and change review without needing PLM first | Build now |
| 5 | Hole/Shaft Fit Calculator | Strong mechanical-native fit tied to fits, tolerances, and quick manufacturability checks | Build now |
| 6 | Mechanical Formula Finder | Good traffic/SEO potential and daily lookup value, but lower wedge than calculators | Shipped |

## First 5 tools to ship

1. `Tolerance Stack-Up Analyzer`
2. `Drawing Revision Diff Checker`
3. `Pressure Drop & Head Loss Calculator`
4. `BOM Diff Checker`
5. `Hole/Shaft Fit Calculator`

## Validation rule

Mechanical tools should meet all of these:

- Solve a real spreadsheet or revision workflow mechanical engineers already do
- Be immediately useful without CAD/PLM integration
- Keep sensitive design data local in the browser
- Feel better than a fragile workbook, not like a mini-CAD clone

## Execution checklist

- [x] Gather evidence-backed pain points
- [x] Rank pain points
- [x] Rank tool opportunities
- [x] Define the first 5-tool wedge
- [x] Ship `Tolerance Stack-Up Analyzer`
- [x] Ship `Drawing Revision Diff Checker`
- [x] Ship `Pressure Drop & Head Loss Calculator`
- [x] Ship `BOM Diff Checker`
- [x] Ship `Hole/Shaft Fit Calculator`
