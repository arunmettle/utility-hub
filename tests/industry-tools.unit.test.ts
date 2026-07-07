import { describe, expect, it } from 'vitest';
import { buildRevisionDiff, buildShiftHandover, calculatePressureDrop } from '../src/lib/industryTools';

describe('industry tools', () => {
  it('groups handover notes into practical sections and exposes urgent items', () => {
    const output = buildShiftHandover(`urgent - panel trip on feeder B
follow up with contractor at 09:30
pump vibration still elevated`);

    expect(output.sections.length).toBeGreaterThanOrEqual(2);
    expect(output.urgentItems[0]).toContain('urgent');
    expect(output.dueTimes[0]).toContain('09:30');
    expect(output.markdown).toContain('# Shift handover');
  });

  it('calculates a positive pressure-drop result for a valid pipe scenario', () => {
    const result = calculatePressureDrop({
      flowLitersPerSecond: 18,
      diameterMillimeters: 150,
      lengthMeters: 120,
      roughnessMillimeters: 0.15,
      fluidDensity: 998,
      dynamicViscosity: 0.001,
      fittingsK: 8,
      elevationChangeMeters: 4,
    });

    expect(result.velocity).toBeGreaterThan(0);
    expect(result.reynoldsNumber).toBeGreaterThan(0);
    expect(result.totalHeadLoss).toBeGreaterThan(result.staticHead);
    expect(result.totalPressureDropKPa).toBeGreaterThan(0);
  });

  it('detects changed and added lines in a revision diff', () => {
    const diff = buildRevisionDiff(
      'A101 | Door width 900 mm\nE110 | Feeder 125 A',
      'A101 | Door width 1000 mm\nE110 | Feeder 160 A\nE111 | Spare breaker',
    );

    expect(diff.summary.changed + diff.summary.added + diff.summary.removed).toBeGreaterThanOrEqual(2);
    expect(diff.summary.added).toBeGreaterThanOrEqual(1);
    expect(diff.numberChanges.some((entry) => entry.includes('1000'))).toBe(true);
  });
});
