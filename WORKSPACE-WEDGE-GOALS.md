# Workspace Wedge Goals

This sheet ranks the next UtilityHub tools using the updated wedge-first rubric.

Scoring:
- `Pain` = market pain /5
- `Gap` = market gap /5
- `Fit` = client-side feasibility /5
- `Retention` = repeat-use /5
- `Differentiation` = workspace-specific moat /5
- `Total` = /25

## Technology

1. API Contract Drift Checker
   - Artifact: endpoint and contract export tables
   - Replaces: release-day diffing across docs, PRs, and spreadsheets
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `23`
2. ENV Schema Drift Checker
   - Artifact: env variable spec tables
   - Replaces: manual parity review between environments and docs
   - Pain `4` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `22`
3. CSV Schema Drift Checker
   - Artifact: CSV exports from upstream/downstream systems
   - Replaces: fragile manual header and row-width checks
   - Pain `4` | Gap `4` | Fit `5` | Retention `4` | Differentiation `4` | Total `21`

## Mechanical

1. Tolerance Change Impact Checker
   - Artifact: old/new stack tables
   - Replaces: spreadsheet diff plus mental stack propagation
   - Pain `5` | Gap `5` | Fit `5` | Retention `5` | Differentiation `5` | Total `25`
2. Drawing Inspection Reconciler
   - Artifact: drawing characteristic list vs inspection plan
   - Replaces: manual balloon-to-FAI reconciliation
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `5` | Total `24`
3. Fastener Clamp Load Checker
   - Artifact: fastener design inputs
   - Replaces: pocket spreadsheets and handbook lookups
   - Pain `4` | Gap `4` | Fit `5` | Retention `4` | Differentiation `4` | Total `21`

## Civil

1. Drainage Schedule QA Checker
   - Artifact: drainage or pipe schedule CSV
   - Replaces: manual invert and slope auditing
   - Pain `5` | Gap `5` | Fit `5` | Retention `5` | Differentiation `5` | Total `25`
2. BOQ Spec Cross Checker
   - Artifact: BOQ table plus spec register
   - Replaces: line-by-line tender cross-checking
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `5` | Total `24`
3. Tender Addendum Impact Checker
   - Artifact: old/new addendum notes
   - Replaces: manual redline review for scope and numeric change
   - Pain `4` | Gap `4` | Fit `5` | Retention `4` | Differentiation `4` | Total `21`

## Electrical

1. Cable Schedule QA Checker
   - Artifact: cable schedule export
   - Replaces: spreadsheet QA for tags, endpoints, and sizes
   - Pain `5` | Gap `5` | Fit `5` | Retention `5` | Differentiation `5` | Total `25`
2. Panel Revision QA Checker
   - Artifact: old/new panel schedule exports
   - Replaces: circuit-by-circuit revision review
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `5` | Total `24`
3. Load List Reconciler
   - Artifact: load list vs single-line-derived export
   - Replaces: tag and panel mismatch checking
   - Pain `4` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `22`

## Medical

1. Clinical Handover Completeness Linter
   - Artifact: handover note text
   - Replaces: inconsistent note structure review
   - Pain `4` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `22`
2. Discharge Instruction Delta Audit
   - Artifact: draft/final discharge instructions
   - Replaces: manual spotting of medication, follow-up, and warning changes
   - Pain `4` | Gap `4` | Fit `5` | Retention `4` | Differentiation `4` | Total `21`
3. Referral Packet Checklist Builder
   - Artifact: referral draft text
   - Replaces: memory-based packet completeness review
   - Pain `4` | Gap `3` | Fit `5` | Retention `4` | Differentiation `4` | Total `20`

## Mining

1. Dewatering Shift Log Reconciler
   - Artifact: pump and pond shift logs
   - Replaces: manual water balance sanity checks
   - Pain `5` | Gap `5` | Fit `5` | Retention `5` | Differentiation `5` | Total `25`
2. Isolation Matrix Change Checker
   - Artifact: old/new isolation tables
   - Replaces: permit-side revision comparison
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `5` | Total `24`
3. Production Shift Reconciliation Checker
   - Artifact: haul vs plant tally sheets
   - Replaces: manual production tally comparison
   - Pain `4` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `22`

## Operations

1. Shift Commitment Reconciler
   - Artifact: previous commitments vs current handover
   - Replaces: dropped-action checking between shifts
   - Pain `5` | Gap `5` | Fit `5` | Retention `5` | Differentiation `5` | Total `25`
2. Work Instruction Change Checker
   - Artifact: old/new controlled instruction text
   - Replaces: manual review of changed steps, warnings, and settings
   - Pain `5` | Gap `4` | Fit `5` | Retention `5` | Differentiation `5` | Total `24`
3. Permit Scope Change Checker
   - Artifact: old/new permit tables
   - Replaces: permit drift review for isolation, owner, and expiry changes
   - Pain `4` | Gap `4` | Fit `5` | Retention `5` | Differentiation `4` | Total `22`

## Execution Scope

This goal executes all top three tools in each workspace:

- Technology: `api-contract-drift-checker`, `env-schema-drift-checker`, `csv-schema-drift-checker`
- Mechanical: `tolerance-change-impact-checker`, `drawing-inspection-reconciler`, `fastener-clamp-load-checker`
- Civil: `drainage-schedule-qa-checker`, `boq-spec-cross-checker`, `tender-addendum-impact-checker`
- Electrical: `cable-schedule-qa-checker`, `panel-revision-qa-checker`, `load-list-reconciler`
- Medical: `clinical-handover-completeness-linter`, `discharge-instruction-delta-audit`, `referral-packet-checklist-builder`
- Mining: `dewatering-shift-log-reconciler`, `isolation-matrix-change-checker`, `production-shift-reconciliation-checker`
- Operations: `shift-commitment-reconciler`, `work-instruction-change-checker`, `permit-scope-change-checker`
