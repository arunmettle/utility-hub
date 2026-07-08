import { describe, expect, it } from 'vitest';
import { buildCivilHandover, calculateEarthworksBalance, calculateInvertSlope } from './civilTools';
import {
  calculateBearingLife,
  calculateBeltDrive,
  calculateGearRatio,
} from './mechanicalTools';
import {
  calculateLightingLoad,
  calculateMotorStarting,
  checkBreakerProtection,
} from './electricalTools';

describe('mechanical tools', () => {
  it('calculates bearing life', () => {
    const result = calculateBearingLife({
      bearingType: 'ball',
      dynamicLoadRatingKn: 45,
      equivalentLoadKn: 15,
      serviceFactor: 1.2,
      speedRpm: 1500,
    });

    expect(result.lifeMillionRevs).toBeCloseTo(15.625, 3);
    expect(result.lifeHours).toBeCloseTo(173.61, 1);
  });

  it('calculates gear ratio and output torque', () => {
    const result = calculateGearRatio({
      driverTeeth: 20,
      drivenTeeth: 60,
      inputRpm: 1500,
      inputTorqueNm: 80,
      efficiencyPercent: 92,
    });

    expect(result.ratio).toBeCloseTo(3, 3);
    expect(result.outputRpm).toBeCloseTo(500, 3);
    expect(result.outputTorqueNm).toBeCloseTo(220.8, 1);
  });

  it('calculates belt drive geometry', () => {
    const result = calculateBeltDrive({
      driverDiameterMm: 160,
      drivenDiameterMm: 320,
      driverRpm: 1500,
      centerDistanceMm: 900,
    });

    expect(result.speedRatio).toBeCloseTo(0.5, 3);
    expect(result.drivenRpm).toBeCloseTo(750, 3);
    expect(result.beltLengthMm).toBeCloseTo(2561.09, 2);
  });
});

describe('civil tools', () => {
  it('groups site handover notes into useful sections', () => {
    const result = buildCivilHandover('urgent access issue\ninvert check at 08:30\nconcrete pour at 9am');

    expect(result.urgentItems).toHaveLength(1);
    expect(result.sections.some((section) => section.title === 'Safety and access')).toBe(true);
    expect(result.dueTimes).toContain('08:30 - invert check at 08:30');
  });

  it('balances cut and fill volumes', () => {
    const result = calculateEarthworksBalance({
      cutVolumeM3: 100,
      fillVolumeM3: 80,
      swellPercent: 10,
      shrinkPercent: 5,
    });

    expect(result.looseCutVolumeM3).toBeCloseTo(110, 2);
    expect(result.compactedFillRequirementM3).toBeCloseTo(84.21, 2);
    expect(result.balanceType).toBe('Waste');
  });

  it('calculates invert slope', () => {
    const result = calculateInvertSlope({
      upstreamInvertMm: 10250,
      downstreamInvertMm: 10050,
      lengthMeters: 20,
    });

    expect(result.fallMm).toBeCloseTo(200, 2);
    expect(result.slopePercent).toBeCloseTo(1, 3);
    expect(result.slope1InN).toBeCloseTo(100, 1);
  });
});

describe('electrical tools', () => {
  it('checks breaker protection', () => {
    const result = checkBreakerProtection({
      loadCurrentA: 38,
      continuousFactor: 1.25,
      deratingFactor: 0.9,
      selectedBreakerA: 63,
    });

    expect(result.requiredCurrentA).toBeCloseTo(52.78, 2);
    expect(result.recommendedStandardBreakerA).toBe(63);
    expect(result.passes).toBe(true);
  });

  it('calculates lighting load', () => {
    const result = calculateLightingLoad({
      areaM2: 120,
      densityWPerM2: 9,
      voltageV: 230,
      powerFactor: 0.9,
      fixtureWatts: 45,
    });

    expect(result.totalPowerW).toBe(1080);
    expect(result.currentA).toBeCloseTo(5.22, 2);
    expect(result.estimatedFixtureCount).toBe(24);
  });

  it('calculates motor starting current', () => {
    const result = calculateMotorStarting({
      fullLoadAmps: 22,
      startMultiplier: 6,
      voltageV: 415,
      phase: 'three',
      sourceFaultCurrentA: 500,
    });

    expect(result.startingCurrentA).toBe(132);
    expect(result.apparentPowerKVA).toBeCloseTo(94.88, 2);
    expect(result.voltageDipPercent).toBeCloseTo(26.4, 1);
  });
});
