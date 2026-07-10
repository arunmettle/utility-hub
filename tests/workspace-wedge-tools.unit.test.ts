import { describe, expect, it } from 'vitest';
import {
  analyzeApiContractDrift,
  analyzeCableScheduleQa,
  analyzeClinicalHandoverCompleteness,
  analyzeDewateringShiftLog,
  analyzeDrainageScheduleQa,
  analyzeShiftCommitmentReconciliation,
} from '../src/lib/workspaceWedgeTools';

describe('workspace wedge tools', () => {
  it('detects route and schema drift in API contracts', () => {
    const result = analyzeApiContractDrift(
      `method,path,status,requestSchema,responseSchema,auth
GET,/orders,200,OrderQuery,OrderList,bearer`,
      `method,path,status,requestSchema,responseSchema,auth
GET,/orders,200,OrderQueryV2,OrderList,bearer
POST,/orders,201,CreateOrder,OrderRecord,bearer`,
    );

    expect(result.findings.some((finding) => finding.title.includes('request schema changed'))).toBe(true);
    expect(result.findings.some((finding) => finding.title.includes('added'))).toBe(true);
  });

  it('flags invalid drainage geometry and slope issues', () => {
    const result = analyzeDrainageScheduleQa(
      `lineId,startChainage,endChainage,startInvert,endInvert,diameterMm,minSlopePercent
DR-1,0,10,100.0,100.1,300,1.0
DR-2,10,25,100.1,99.9,0,0.5`,
    );

    expect(result.findings.some((finding) => finding.title.includes('uphill or flat'))).toBe(true);
    expect(result.findings.some((finding) => finding.title.includes('invalid diameter'))).toBe(true);
  });

  it('finds duplicate cables and missing endpoints', () => {
    const result = analyzeCableScheduleQa(
      `tag,from,to,cores,sizeMm2,earthMm2,lengthM,status
C-1,MSB,P1,4,35,16,12,Issued
C-1,MSB,P2,4,35,16,15,Issued
C-2,,P3,4,16,16,20,Issued`,
    );

    expect(result.findings.some((finding) => finding.title.includes('duplicate tag'))).toBe(true);
    expect(result.findings.some((finding) => finding.title.includes('missing endpoint'))).toBe(true);
  });

  it('keeps medical linting scoped to structure gaps', () => {
    const result = analyzeClinicalHandoverCompleteness(
      `Patient in Bed 4
Issue: post-op pain
Plan: review by surgical team`,
    );

    expect(result.findings.some((finding) => finding.title.includes('Review time missing'))).toBe(true);
    expect(result.findings.some((finding) => finding.title.includes('Action line is not fully owned'))).toBe(true);
  });

  it('surfaces dewatering water-balance mismatches', () => {
    const result = analyzeDewateringShiftLog(
      `pumpId,runtimeHr,flowLs,startLevelM,endLevelM,pondAreaM2
P-1,8,20,4.0,3.95,200`,
    );

    expect(result.findings.some((finding) => finding.title.includes('water balance mismatch'))).toBe(true);
  });

  it('flags dropped shift commitments', () => {
    const result = analyzeShiftCommitmentReconciliation(
      `Confirm scaffold release before 10:00
Review valve leak on Line 4 with maintenance`,
      `Maintenance to inspect Line 4 valve leak this shift`,
    );

    expect(result.findings.some((finding) => finding.title.includes('dropped'))).toBe(true);
  });
});
