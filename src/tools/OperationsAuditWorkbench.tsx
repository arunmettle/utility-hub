import CompareAuditTool from '../components/CompareAuditTool';
import {
  analyzePermitScopeChange,
  analyzeShiftCommitmentReconciliation,
  analyzeWorkInstructionChange,
} from '../lib/workspaceWedgeTools';

const previousCommitments = `Confirm scaffold release before 10:00.
Review valve leak on Line 4 with maintenance.
Close out temporary lighting request for Bay 2.`;

const currentHandover = `Maintenance to inspect Line 4 valve leak this shift.
Temporary lighting still pending in Bay 2.
New task: verify barricade removal permit for west access.`;

export function ShiftCommitmentReconciler() {
  return (
    <CompareAuditTool
      eyebrow="Developer"
      title="Shift Commitment Reconciler"
      description="Compare previous commitments against the current handover and flag likely dropped actions before they disappear between shifts."
      note={{
        title: 'Operational wedge',
        body: 'This tool is intentionally simple: it helps teams preserve action continuity, which is one of the easiest ways field work goes sideways.',
      }}
      leftLabel="Previous commitments"
      rightLabel="Current handover"
      leftHint="What the prior shift promised"
      rightHint="What the next shift received"
      leftSample={previousCommitments}
      rightSample={currentHandover}
      analyze={analyzeShiftCommitmentReconciliation}
    />
  );
}

const oldInstruction = `Step 1: Isolate Pump 3.
Step 2: Remove guard with 13 mm socket.
Warning: Wear arc-rated PPE.
Set torque to 45 N.m on reassembly.`;

const newInstruction = `Step 1: Isolate Pump 3 and confirm zero energy.
Step 2: Remove guard with 10 mm socket.
Warning: Wear arc-rated PPE and face shield.
Set torque to 60 N.m on reassembly.`;

export function WorkInstructionChangeChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Work Instruction Change Checker"
      description="Compare controlled instruction text and spotlight changed safety language, tools, and numeric settings that deserve review before release."
      note={{
        title: 'Controlled review',
        body: 'This turns a generic text diff into a release-oriented instruction review surface for field teams and supervisors.',
      }}
      leftLabel="Previous instruction"
      rightLabel="Current instruction"
      leftHint="Older controlled text"
      rightHint="Updated controlled text"
      leftSample={oldInstruction}
      rightSample={newInstruction}
      analyze={analyzeWorkInstructionChange}
    />
  );
}

const oldPermit = `permit,area,task,isolations,expires,owner
PTW-21,West Tank,Confined space inspection,TK-1 gas isolate,2026-07-10 18:00,Ops
PTW-22,Bay 4,Hot work on bracket,DB-2 feeder isolate,2026-07-10 20:00,Maintenance`;

const newPermit = `permit,area,task,isolations,expires,owner
PTW-21,West Tank,Confined space inspection,TK-1 gas isolate + blind,2026-07-10 22:00,Shift Supervisor
PTW-23,Bay 4,Hot work on bracket,DB-2 feeder isolate,2026-07-10 20:00,Maintenance`;

export function PermitScopeChangeChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Permit Scope Change Checker"
      description="Compare permit tables and surface changed area, task, isolation, expiry, or ownership details before the revised permit is issued."
      note={{
        title: 'Best use',
        body: 'Use this in permit review and handover conversations where a changed table can hide a meaningful scope shift.',
      }}
      leftLabel="Previous permit table"
      rightLabel="Current permit table"
      leftHint="Earlier permit register"
      rightHint="Updated permit register"
      leftSample={oldPermit}
      rightSample={newPermit}
      analyze={analyzePermitScopeChange}
    />
  );
}
