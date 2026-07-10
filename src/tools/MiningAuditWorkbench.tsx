import CompareAuditTool from '../components/CompareAuditTool';
import SingleAuditTool from '../components/SingleAuditTool';
import {
  analyzeDewateringShiftLog,
  analyzeIsolationMatrixChange,
  analyzeProductionShiftReconciliation,
} from '../lib/workspaceWedgeTools';

const dewateringLog = `pumpId,runtimeHr,flowLs,startLevelM,endLevelM,pondAreaM2
P-01,8,22,4.2,3.6,220
P-02,6,18,3.6,3.55,180
P-03,0,15,3.55,3.20,180`;

export function DewateringShiftLogReconciler() {
  return (
    <SingleAuditTool
      eyebrow="Tester"
      title="Dewatering Shift Log Reconciler"
      description="Compare pumped volume against observed level movement and catch impossible or suspicious shift-log entries before they distort dewatering decisions."
      note={{
        title: 'Mining wedge',
        body: 'This is designed for the daily operational gap between pump logs and real pond behavior, not for hydraulic modeling.',
      }}
      inputLabel="Dewatering log"
      inputHint="CSV with runtime, flow, and level data"
      sample={dewateringLog}
      analyze={analyzeDewateringShiftLog}
    />
  );
}

const oldIsolation = `isolationId,equipment,energyType,lockPoint,verifyStep,owner
ISO-01,Pump P-101,Electrical,DB-4 MCC isolator,Try start test,Ops
ISO-02,Conveyor CV-2,Mechanical,Head pulley pin,Visual pin and tag check,Maint`;

const newIsolation = `isolationId,equipment,energyType,lockPoint,verifyStep,owner
ISO-01,Pump P-101,Electrical,DB-7 MCC isolator,Try start test,Ops
ISO-02,Conveyor CV-2,Mechanical,Head pulley pin,Visual pin and tag check,Shift Supervisor
ISO-03,Screen SC-1,Hydraulic,Hydraulic skid lockout,Pressure bleed verify,Maint`;

export function IsolationMatrixChangeChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Isolation Matrix Change Checker"
      description="Compare old and new isolation matrices so lock-point, verify-step, and ownership drift is visible before field execution."
      note={{
        title: 'Field control',
        body: 'This helps crews and reviewers spot changed isolation expectations quickly without scanning the entire matrix manually.',
      }}
      leftLabel="Previous matrix"
      rightLabel="Current matrix"
      leftHint="Old isolation table"
      rightHint="New isolation table"
      leftSample={oldIsolation}
      rightSample={newIsolation}
      analyze={analyzeIsolationMatrixChange}
    />
  );
}

const haulSheet = `source,tonnes
Pit North,820
Pit South,760
Stockpile Reclaim,140`;

const plantTally = `source,tonnes
Pit North,790
Pit South,760
Crusher Feed,915`;

export function ProductionShiftReconciliationChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Production Shift Reconciliation Checker"
      description="Reconcile haul and plant tally tables to highlight missing sources and tonnage drift before shift totals are accepted."
      note={{
        title: 'What it solves',
        body: 'It is common to have multiple tally surfaces in one shift. This tool gives a lightweight reconciliation pass before the numbers harden into reports.',
      }}
      leftLabel="Haul tally"
      rightLabel="Plant tally"
      leftHint="Source A"
      rightHint="Source B"
      leftSample={haulSheet}
      rightSample={plantTally}
      analyze={analyzeProductionShiftReconciliation}
    />
  );
}
