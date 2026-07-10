import CompareAuditTool from '../components/CompareAuditTool';
import SingleAuditTool from '../components/SingleAuditTool';
import {
  analyzeBoqSpecCrossCheck,
  analyzeDrainageScheduleQa,
  analyzeTenderAddendumImpact,
} from '../lib/workspaceWedgeTools';

const drainageSchedule = `lineId,startChainage,endChainage,startInvert,endInvert,diameterMm,minSlopePercent
DR-01,0,42,102.40,101.95,300,0.80
DR-02,42,58,101.95,101.96,225,1.00
DR-03,58,84,101.96,101.20,375,0.60`;

export function DrainageScheduleQaChecker() {
  return (
    <SingleAuditTool
      eyebrow="Tester"
      title="Drainage Schedule QA Checker"
      description="Audit drainage schedule rows for uphill runs, weak slopes, bad lengths, and invalid pipe entries before the issue becomes site rework."
      note={{
        title: 'Best use',
        body: 'This is strongest during revision review, IFC checking, and contractor response cycles where a schedule export exists but nobody wants to manually re-check every run.',
      }}
      inputLabel="Drainage schedule"
      inputHint="CSV with chainages, inverts, and minimum slope"
      sample={drainageSchedule}
      analyze={analyzeDrainageScheduleQa}
    />
  );
}

const boqTable = `item,description,unit,specRef
BQ-01,Subgrade excavation,m3,31-200
BQ-02,Stormwater pipe 300 dia,m,33-410
BQ-03,Kerb and channel,m,`;

const specRegister = `specRef,title,unit,trade
31-200,Excavation and backfill,m3,Civil
33-410,Stormwater piping,ea,Hydraulics
32-110,Pavement subbase,m2,Civil`;

export function BoqSpecCrossChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="BOQ Spec Cross Checker"
      description="Cross-check BOQ rows against the spec register and flag missing references or unit mismatches before tender clarification starts."
      note={{
        title: 'Tender wedge',
        body: 'This solves the repetitive BOQ-versus-spec review gap that usually lives across spreadsheets, PDFs, and reviewer memory.',
      }}
      leftLabel="BOQ table"
      rightLabel="Spec register"
      leftHint="Measured items and refs"
      rightHint="Specification register"
      leftSample={boqTable}
      rightSample={specRegister}
      analyze={analyzeBoqSpecCrossCheck}
    />
  );
}

const oldAddendum = `Clause 4.2 Allow 3 night closures.
Stormwater pits to remain Class D.
Tender period closes on 14 August 2026.`;

const newAddendum = `Clause 4.2 Allow 5 night closures.
Stormwater pits to remain Class B.
Tender period closes on 21 August 2026.
Traffic management exclusion removed.`;

export function TenderAddendumImpactChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Tender Addendum Impact Checker"
      description="Compare two addendum note sets locally and isolate scope, numeric, and date changes that deserve commercial or design review."
      note={{
        title: 'Narrow purpose',
        body: 'This is not a generic document diff. It is tuned for the high-stakes review pass where scope drift can quietly change cost or programme.',
      }}
      leftLabel="Previous addendum"
      rightLabel="Updated addendum"
      leftHint="Earlier tender wording"
      rightHint="Current tender wording"
      leftSample={oldAddendum}
      rightSample={newAddendum}
      analyze={analyzeTenderAddendumImpact}
    />
  );
}
