# UtilityHub Ideation Prompts

## Core Wedge Prompt

Use this prompt before ideating any new UtilityHub tool in any workspace.

```md
You are evaluating browser-local utility tools for UtilityHub.

UtilityHub strategy:
- Privacy-first and client-side by default
- Do not clone enterprise systems, CAD, BIM, PLM, PACS, ERP, EHR, PMIS, or IDEs
- Focus on the narrow wedge between:
  - messy spreadsheets
  - copied PDFs / notes / schedules
  - manual QA review
  - repeated reconciliation work
  - repetitive deterministic calculations
- Prefer workflows that happen daily or weekly, not rare edge cases
- Prefer tools that are narrow, trusted, and operationally useful over broad “platform” ideas

Your job:
1. Start from real pain, not from an impressive-sounding tool concept.
2. Identify the exact artifact the user is already dealing with:
   - schedule export
   - checklist
   - handover note
   - quantity table
   - revision text
   - spec register
   - load list
   - inspection table
   - permit / isolation matrix
   - shift log
3. Reject ideas that:
   - are generic across every workspace without a strong domain-specific wedge
   - belong primarily inside a heavyweight authoring system
   - are one-off calculators with weak retention
   - depend on AI judgment instead of deterministic rules
   - sound exciting but do not beat Excel, PDF review, or a handbook in the real workflow
4. Prefer tools that:
   - catch review mistakes
   - reconcile two sources of truth
   - expose missing fields, drift, or contradictions
   - make assumptions visible
   - can become part of a repeatable pre-release / pre-handover / pre-share ritual
5. For every idea, score 1-5 on:
   - market pain
   - market gap
   - client-side feasibility
   - retention potential
   - differentiation from existing UtilityHub tools
6. Run these kill checks before keeping an idea:
   - Is the user already doing this every week?
   - Would the result be trusted more than a vague AI answer?
   - Is the input small enough to stay local in the browser?
   - Is the output actionable within five minutes?
   - Does it clearly belong to one workspace more than the others?

Required output:
- ranked pain points
- ranked tool concepts
- artifact being improved
- what existing workflow it replaces
- why the market gap is still open
- what the MVP must do
- what the MVP must explicitly avoid
- scores:
  - market pain /5
  - market gap /5
  - client-side feasibility /5
  - retention potential /5
  - differentiation /5
  - total /25
```

## Mechanical Workspace Prompt

```md
Apply the Core Wedge Prompt with this mechanical context:

- Target users: mechanical, manufacturing, and design engineers
- Best wedges usually sit around:
  - tolerance changes
  - drawing-to-inspection reconciliation
  - release review
  - fit / clamp / assembly sanity checks
  - spreadsheet-heavy machine design support work
- Reject ideas that mostly belong in CAD, FEA, CAM, PLM, or full metrology suites
- The artifact should usually be a dimension table, BOM, characteristic list, release note, or recurring calculation input
```

## Civil Workspace Prompt

```md
Apply the Core Wedge Prompt with this civil context:

- Target users: civil, site, hydraulic, and construction engineers
- Best wedges usually sit around:
  - drainage schedules
  - BOQ / spec consistency
  - tender addenda review
  - earthworks and quantity reconciliation
  - field-to-office schedule checking
- Reject ideas that mostly belong in BIM, GIS, PMIS, or full estimating suites
- The artifact should usually be a schedule, BOQ, addendum note, takeoff sheet, or field register
```

## Electrical Workspace Prompt

```md
Apply the Core Wedge Prompt with this electrical context:

- Target users: electrical, MEP, and power engineers
- Best wedges usually sit around:
  - cable schedules
  - load lists
  - panel revisions
  - conduit / routing QA
  - repetitive protection and coordination pre-checks
- Reject ideas that mostly belong in a full power-system study suite or CAD package
- The artifact should usually be a cable list, panel schedule, load register, or revision export
```

## Medical Workspace Prompt

```md
Apply the Core Wedge Prompt with this medical context:

- Target users: clinical teams handling handover, documentation, referral, and instruction review
- Stay away from diagnosis, treatment recommendation, prioritization, or anything that looks like clinical decision support
- Best wedges usually sit around:
  - completeness checking
  - instruction / report delta review
  - packet preparation
  - obvious privacy / structure cleanup
- Reject ideas that require legal or regulatory claims the MVP cannot support
- The artifact should usually be a handover note, discharge instruction set, referral draft, or report text
```

## Mining Workspace Prompt

```md
Apply the Core Wedge Prompt with this mining context:

- Target users: mining operations, maintenance, and resources teams
- Best wedges usually sit around:
  - dewatering logs
  - isolation matrices
  - shift reconciliation
  - permit / change review
  - field log QA before the next crew takes over
- Reject ideas that mostly belong in fleet-management, SCADA, or enterprise mine-planning systems
- The artifact should usually be a shift log, isolation table, tally sheet, or permit revision
```

## Operations Workspace Prompt

```md
Apply the Core Wedge Prompt with this operations context:

- Target users: supervisors, coordinators, and field operations teams
- Best wedges usually sit around:
  - commitment carryover
  - work-instruction changes
  - permit scope drift
  - handover cleanup
  - controlled document review
- Reject ideas that are just generic note tools with renamed labels
- The artifact should usually be a handover note, instruction revision, permit table, or action register
```

## Technology Workspace Prompt

```md
Apply the Core Wedge Prompt with this technology context:

- Target users: developers, delivery leads, QA, and platform teams
- Best wedges usually sit around:
  - API contract drift
  - environment schema drift
  - CSV / interface reconciliation
  - repeated contract QA before release
- Reject generic formatter, converter, and generator ideas unless they solve a sharp release workflow pain
- The artifact should usually be a contract table, env spec, schema export, or interface definition
```
