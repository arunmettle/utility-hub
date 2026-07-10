import CompareAuditTool from '../components/CompareAuditTool';
import SingleAuditTool from '../components/SingleAuditTool';
import {
  analyzeClinicalHandoverCompleteness,
  analyzeDischargeInstructionDelta,
  buildReferralPacketChecklist,
} from '../lib/workspaceWedgeTools';

const handoverSample = `Patient in Bed 12 reviewed overnight.
Issue: oxygen requirement increased.
Follow up chest x-ray.
Plan: repeat obs and contact respiratory team.`;

export function ClinicalHandoverCompletenessLinter() {
  return (
    <SingleAuditTool
      eyebrow="Developer"
      title="Clinical Handover Completeness Linter"
      description="Check a pasted handover note for missing ownership, timing, and core handoff structure before it moves to the next team."
      note={{
        title: 'Safety boundary',
        body: 'This tool checks documentation structure only. It does not provide any clinical advice or prioritization.',
      }}
      inputLabel="Handover note"
      inputHint="Paste the note or draft handoff text"
      sample={handoverSample}
      analyze={analyzeClinicalHandoverCompleteness}
    />
  );
}

const dischargeDraft = `Take amoxicillin 500 mg twice daily for 5 days.
Follow up with GP in 3 days.
Return if fever or shortness of breath develops.`;

const dischargeFinal = `Take amoxicillin 875 mg twice daily for 7 days.
Follow up with GP in 1 week.
Return if fever, shortness of breath, or chest pain develops.`;

export function DischargeInstructionDeltaAudit() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Discharge Instruction Delta Audit"
      description="Compare draft and final discharge instructions so medication, follow-up, and warning-sign wording changes are easier to review locally."
      note={{
        title: 'Review focus',
        body: 'This tool highlights changed wording only. A clinician still owns the correctness of the final instructions.',
      }}
      leftLabel="Draft instructions"
      rightLabel="Final instructions"
      leftHint="Earlier discharge wording"
      rightHint="Current discharge wording"
      leftSample={dischargeDraft}
      rightSample={dischargeFinal}
      analyze={analyzeDischargeInstructionDelta}
    />
  );
}

const referralDraft = `Referral for respiratory review.
Background: recurrent wheeze and recent admission.
Current meds listed in attached summary.
Recent chest imaging completed yesterday.`;

export function ReferralPacketChecklistBuilder() {
  return (
    <SingleAuditTool
      eyebrow="Generator"
      title="Referral Packet Checklist Builder"
      description="Turn a referral draft into a quick completeness checklist so missing packet elements are visible before it is sent onward."
      note={{
        title: 'Workflow fit',
        body: 'This is best used as a pre-send packet check for structure, not as a clinical quality or referral appropriateness judge.',
      }}
      inputLabel="Referral draft"
      inputHint="Paste the referral note or packet summary"
      sample={referralDraft}
      analyze={buildReferralPacketChecklist}
    />
  );
}
