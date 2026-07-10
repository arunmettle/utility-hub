import CompareAuditTool from '../components/CompareAuditTool';
import SingleAuditTool from '../components/SingleAuditTool';
import {
  analyzeCableScheduleQa,
  analyzeLoadListReconciliation,
  analyzePanelRevisionQa,
} from '../lib/workspaceWedgeTools';

const cableSchedule = `tag,from,to,cores,sizeMm2,earthMm2,lengthM,status
C-101,MSB,Panel-A,4,70,35,24,Issued
C-102,Panel-A,AHU-01,4,25,16,0,Issued
C-101,MSB,Panel-B,4,70,35,30,Issued
C-103,,Pump-01,3,16,16,18,Issued`;

export function CableScheduleQaChecker() {
  return (
    <SingleAuditTool
      eyebrow="Tester"
      title="Cable Schedule QA Checker"
      description="Run a fast QA pass over a cable schedule to catch duplicate tags, missing endpoints, and invalid conductor data before issue-for-construction."
      note={{
        title: 'Where it fits',
        body: 'This sits in the release-review gap between the drafting package and the site team that has to order, pull, and terminate the cable.',
      }}
      inputLabel="Cable schedule"
      inputHint="CSV with tag, endpoints, and conductor details"
      sample={cableSchedule}
      analyze={analyzeCableScheduleQa}
    />
  );
}

const oldPanel = `circuit,description,poles,breakerAmps,phase,loadWatts
1,Lighting east,1,10,A,1400
3,General power,1,20,B,2200
5,AHU-01,3,32,3P,7200`;

const newPanel = `circuit,description,poles,breakerAmps,phase,loadWatts
1,Lighting east,1,16,A,1900
3,General power,1,20,C,2200
7,AHU-01,3,40,3P,8200`;

export function PanelRevisionQaChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Panel Revision QA Checker"
      description="Compare two panel schedules and surface changed breakers, moved circuits, and load shifts before the revision reaches procurement or commissioning."
      note={{
        title: 'Revision focus',
        body: 'The goal is not to replace panel design software. It is to make the revision delta and its practical consequences obvious in minutes.',
      }}
      leftLabel="Old panel schedule"
      rightLabel="New panel schedule"
      leftHint="Baseline panel export"
      rightHint="Revised panel export"
      leftSample={oldPanel}
      rightSample={newPanel}
      analyze={analyzePanelRevisionQa}
    />
  );
}

const loadList = `tag,kW,phase,panel
P-01,7.5,3P,MCC-01
L-01,1.8,A,LP-01
FCU-01,2.2,B,LP-02`;

const singleLineList = `tag,kW,phase,panel
P-01,7.5,3P,MCC-01
L-01,2.0,A,LP-01
FCU-01,2.2,C,LP-03
EF-01,1.1,A,LP-02`;

export function LoadListReconciler() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Load List Reconciler"
      description="Reconcile a load list against a compared schedule or single-line export to catch missing tags, phase mismatches, and panel drift quickly."
      note={{
        title: 'Trust model',
        body: 'This tool is useful because it stays deterministic: one tag, one compared row, and a clear list of mismatches.',
      }}
      leftLabel="Load list"
      rightLabel="Compared schedule"
      leftHint="Design load source"
      rightHint="Single-line or panel-derived list"
      leftSample={loadList}
      rightSample={singleLineList}
      analyze={analyzeLoadListReconciliation}
    />
  );
}
