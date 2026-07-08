const standardBearingLifeExponent = {
  ball: 3,
  roller: 10 / 3,
} as const;

function clampPositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export type BearingType = 'ball' | 'roller';

export interface BearingLifeInput {
  bearingType: BearingType;
  dynamicLoadRatingKn: number;
  equivalentLoadKn: number;
  serviceFactor: number;
  speedRpm: number;
}

export interface BearingLifeOutput {
  bearingType: BearingType;
  exponent: number;
  equivalentLoadKn: number;
  loadRatio: number;
  lifeMillionRevs: number;
  lifeHours: number;
  report: string;
}

export function calculateBearingLife(input: BearingLifeInput): BearingLifeOutput {
  const exponent = standardBearingLifeExponent[input.bearingType];
  const dynamicLoadRatingKn = clampPositive(input.dynamicLoadRatingKn, 1);
  const equivalentLoadKn = clampPositive(input.equivalentLoadKn, 0.1) * clampPositive(input.serviceFactor, 1);
  const speedRpm = clampPositive(input.speedRpm, 1);
  const loadRatio = dynamicLoadRatingKn / equivalentLoadKn;
  const lifeMillionRevs = Math.pow(loadRatio, exponent);
  const lifeHours = (lifeMillionRevs * 1_000_000) / (60 * speedRpm);
  const report = [
    'Bearing Life Summary',
    `Bearing type: ${input.bearingType}`,
    `Equivalent load: ${equivalentLoadKn.toFixed(2)} kN`,
    `Load ratio C/P: ${loadRatio.toFixed(2)}`,
    `Life: ${lifeMillionRevs.toFixed(2)} million revs`,
    `Life hours: ${lifeHours.toFixed(1)} h`,
  ].join('\n');

  return {
    bearingType: input.bearingType,
    exponent,
    equivalentLoadKn,
    loadRatio,
    lifeMillionRevs,
    lifeHours,
    report,
  };
}

export interface GearRatioInput {
  driverTeeth: number;
  drivenTeeth: number;
  inputRpm: number;
  inputTorqueNm: number;
  efficiencyPercent: number;
}

export interface GearRatioOutput {
  ratio: number;
  outputRpm: number;
  inputPowerW: number;
  outputPowerW: number;
  outputTorqueNm: number;
  powerLossW: number;
  report: string;
}

export function calculateGearRatio(input: GearRatioInput): GearRatioOutput {
  const driverTeeth = clampPositive(input.driverTeeth, 1);
  const drivenTeeth = clampPositive(input.drivenTeeth, 1);
  const inputRpm = clampPositive(input.inputRpm, 1);
  const inputTorqueNm = clampPositive(input.inputTorqueNm, 0.1);
  const efficiency = Math.min(Math.max(input.efficiencyPercent, 0), 100) / 100;
  const ratio = drivenTeeth / driverTeeth;
  const outputRpm = inputRpm / ratio;
  const inputPowerW = (2 * Math.PI * inputRpm * inputTorqueNm) / 60;
  const outputPowerW = inputPowerW * efficiency;
  const outputTorqueNm = (outputPowerW * 60) / (2 * Math.PI * outputRpm);
  const powerLossW = inputPowerW - outputPowerW;
  const report = [
    'Gear Ratio Summary',
    `Ratio: ${ratio.toFixed(3)}:1`,
    `Output speed: ${outputRpm.toFixed(1)} rpm`,
    `Output torque: ${outputTorqueNm.toFixed(2)} Nm`,
    `Power loss: ${powerLossW.toFixed(1)} W`,
  ].join('\n');

  return {
    ratio,
    outputRpm,
    inputPowerW,
    outputPowerW,
    outputTorqueNm,
    powerLossW,
    report,
  };
}

export interface BeltDriveInput {
  driverDiameterMm: number;
  drivenDiameterMm: number;
  driverRpm: number;
  centerDistanceMm: number;
}

export interface BeltDriveOutput {
  speedRatio: number;
  drivenRpm: number;
  beltSpeedMs: number;
  beltLengthMm: number;
  report: string;
}

export function calculateBeltDrive(input: BeltDriveInput): BeltDriveOutput {
  const driverDiameterMm = clampPositive(input.driverDiameterMm, 1);
  const drivenDiameterMm = clampPositive(input.drivenDiameterMm, 1);
  const driverRpm = clampPositive(input.driverRpm, 1);
  const centerDistanceMm = clampPositive(input.centerDistanceMm, 10);
  const speedRatio = driverDiameterMm / drivenDiameterMm;
  const drivenRpm = driverRpm * speedRatio;
  const beltSpeedMs = (Math.PI * (driverDiameterMm / 1000) * driverRpm) / 60;
  const beltLengthMm =
    2 * centerDistanceMm +
    (Math.PI / 2) * (driverDiameterMm + drivenDiameterMm) +
    Math.pow(driverDiameterMm - drivenDiameterMm, 2) / (4 * centerDistanceMm);
  const report = [
    'Belt Drive Summary',
    `Speed ratio: ${speedRatio.toFixed(3)}:1`,
    `Driven speed: ${drivenRpm.toFixed(1)} rpm`,
    `Belt speed: ${beltSpeedMs.toFixed(2)} m/s`,
    `Approx belt length: ${beltLengthMm.toFixed(1)} mm`,
  ].join('\n');

  return {
    speedRatio,
    drivenRpm,
    beltSpeedMs,
    beltLengthMm,
    report,
  };
}
