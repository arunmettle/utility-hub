import { describe, expect, it } from 'vitest';
import {
  buildPanelSchedule,
  calculateConduitFill,
  calculateVoltageDrop,
  estimateCableSize,
  findElectricalFormulas,
} from '../src/lib/electricalTools';

describe('electrical tools', () => {
  it('calculates a voltage-drop estimate for a three-phase cable run', () => {
    const result = calculateVoltageDrop({
      currentAmps: 42,
      lengthMeters: 85,
      systemVoltage: 400,
      phase: 'Three-phase',
      conductorSizeMm2: 25,
      conductorMaterial: 'Copper',
      targetDropPercent: 3,
    });

    expect(result.dropVolts).toBeGreaterThan(0);
    expect(result.dropPercent).toBeGreaterThan(0);
    expect(result.dropPercent).toBeLessThan(3);
    expect(result.status).toBe('Within limit');
  });

  it('shortlists a workable cable size after derating and drop checks', () => {
    const result = estimateCableSize({
      loadAmps: 58,
      systemVoltage: 400,
      lengthMeters: 72,
      phase: 'Three-phase',
      conductorMaterial: 'Copper',
      insulation: 'XLPE 90C',
      installMethod: 'Conduit',
      ambientC: 34,
      groupingCount: 3,
      continuousLoad: true,
      targetDropPercent: 3,
    });

    expect(result.recommended?.sizeMm2).toBe(50);
    expect(result.recommended?.passes).toBe(true);
    expect(result.candidates[0].sizeMm2).toBe(1.5);
  });

  it('calculates conduit fill from a simple CSV list', () => {
    const result = calculateConduitFill(
      `cableSizeMm2,quantity,description
2.5,6,Lighting radial
4,3,Power radial
6,1,Control feeder
10,1,Spare`,
      32,
      'Multiple conductors (40%)',
    );

    expect(result.error).toBe('');
    expect(result.output?.fillPercent).toBeGreaterThan(0);
    expect(result.output?.fillPercent).toBeLessThan(40);
    expect(result.output?.status).toBe('Within limit');
  });

  it('summarizes a panel schedule with phase balance and spare ways', () => {
    const result = buildPanelSchedule(
      [
        { circuit: '1', description: 'Lighting north wing', loadWatts: 1800, breakerAmps: 10, phase: 'A' },
        { circuit: '2', description: 'Socket circuit office', loadWatts: 2400, breakerAmps: 16, phase: 'B' },
        { circuit: '3', description: 'Air handler', loadWatts: 5200, breakerAmps: 20, phase: '3Φ' },
        { circuit: '4', description: 'Server room UPS', loadWatts: 3000, breakerAmps: 16, phase: 'C' },
      ],
      12,
      400,
      0.95,
    );

    expect(result.totalWatts).toBeGreaterThan(0);
    expect(result.spareWays).toBe(8);
    expect(result.phaseWatts.A).toBeGreaterThan(0);
    expect(result.imbalancePercent).toBeGreaterThanOrEqual(0);
  });

  it('finds electrical formulas by topic and category', () => {
    const formulas = findElectricalFormulas('voltage drop', 'Voltage');

    expect(formulas.length).toBeGreaterThan(0);
    expect(formulas.some((formula) => formula.title.toLowerCase().includes('voltage drop'))).toBe(true);
    expect(formulas.every((formula) => formula.category === 'Voltage')).toBe(true);
  });
});
