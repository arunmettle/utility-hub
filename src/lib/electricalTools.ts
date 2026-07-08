export type ElectricalPhase = 'Single-phase' | 'Three-phase';
export type ConductorMaterial = 'Copper' | 'Aluminum';
export type InstallMethod = 'Conduit' | 'Cable tray' | 'Free air';
export type InsulationType = 'PVC 75C' | 'XLPE 90C';
export type FillRule = 'Single cable (53%)' | 'Two conductors (31%)' | 'Multiple conductors (40%)';
export type PanelPhase = 'A' | 'B' | 'C' | '3Φ';

function clampPositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function closestEntry<T extends { sizeMm2: number }>(entries: T[], sizeMm2: number) {
  return entries.reduce((best, current) => {
    if (!best) return current;
    return Math.abs(current.sizeMm2 - sizeMm2) < Math.abs(best.sizeMm2 - sizeMm2) ? current : best;
  }, entries[0]);
}

const cableResistanceTable = [
  { sizeMm2: 1.5, copper: 12.1, aluminum: 20.1 },
  { sizeMm2: 2.5, copper: 7.41, aluminum: 12.2 },
  { sizeMm2: 4, copper: 4.61, aluminum: 7.65 },
  { sizeMm2: 6, copper: 3.08, aluminum: 5.07 },
  { sizeMm2: 10, copper: 1.83, aluminum: 3.02 },
  { sizeMm2: 16, copper: 1.15, aluminum: 1.9 },
  { sizeMm2: 25, copper: 0.727, aluminum: 1.2 },
  { sizeMm2: 35, copper: 0.524, aluminum: 0.865 },
  { sizeMm2: 50, copper: 0.387, aluminum: 0.639 },
  { sizeMm2: 70, copper: 0.268, aluminum: 0.443 },
  { sizeMm2: 95, copper: 0.193, aluminum: 0.318 },
  { sizeMm2: 120, copper: 0.153, aluminum: 0.252 },
  { sizeMm2: 150, copper: 0.124, aluminum: 0.205 },
  { sizeMm2: 185, copper: 0.0991, aluminum: 0.164 },
  { sizeMm2: 240, copper: 0.0754, aluminum: 0.125 },
];

const cableAmpacityTable = [
  { sizeMm2: 1.5, copper: 15, aluminum: 12 },
  { sizeMm2: 2.5, copper: 20, aluminum: 16 },
  { sizeMm2: 4, copper: 26, aluminum: 21 },
  { sizeMm2: 6, copper: 34, aluminum: 27 },
  { sizeMm2: 10, copper: 46, aluminum: 37 },
  { sizeMm2: 16, copper: 61, aluminum: 49 },
  { sizeMm2: 25, copper: 80, aluminum: 64 },
  { sizeMm2: 35, copper: 99, aluminum: 79 },
  { sizeMm2: 50, copper: 119, aluminum: 95 },
  { sizeMm2: 70, copper: 151, aluminum: 121 },
  { sizeMm2: 95, copper: 186, aluminum: 149 },
  { sizeMm2: 120, copper: 214, aluminum: 171 },
  { sizeMm2: 150, copper: 245, aluminum: 196 },
  { sizeMm2: 185, copper: 282, aluminum: 226 },
  { sizeMm2: 240, copper: 327, aluminum: 262 },
];

const cableAreaTable = [
  { sizeMm2: 1.5, areaMm2: 8 },
  { sizeMm2: 2.5, areaMm2: 11 },
  { sizeMm2: 4, areaMm2: 15 },
  { sizeMm2: 6, areaMm2: 20 },
  { sizeMm2: 10, areaMm2: 31 },
  { sizeMm2: 16, areaMm2: 42 },
  { sizeMm2: 25, areaMm2: 58 },
  { sizeMm2: 35, areaMm2: 76 },
  { sizeMm2: 50, areaMm2: 98 },
  { sizeMm2: 70, areaMm2: 130 },
  { sizeMm2: 95, areaMm2: 165 },
  { sizeMm2: 120, areaMm2: 205 },
  { sizeMm2: 150, areaMm2: 252 },
  { sizeMm2: 185, areaMm2: 305 },
  { sizeMm2: 240, areaMm2: 375 },
];

const conduitAreaTable = [
  { sizeMm: 20, innerDiameterMm: 16.5 },
  { sizeMm: 25, innerDiameterMm: 21.2 },
  { sizeMm: 32, innerDiameterMm: 27.0 },
  { sizeMm: 40, innerDiameterMm: 35.0 },
  { sizeMm: 50, innerDiameterMm: 43.0 },
  { sizeMm: 63, innerDiameterMm: 54.0 },
  { sizeMm: 80, innerDiameterMm: 67.0 },
];

const ambientDeratingTable = [
  { min: 0, max: 30, factor: 1 },
  { min: 31, max: 35, factor: 0.94 },
  { min: 36, max: 40, factor: 0.87 },
  { min: 41, max: 45, factor: 0.79 },
  { min: 46, max: 50, factor: 0.71 },
];

const groupingDeratingTable = [
  { min: 1, max: 1, factor: 1 },
  { min: 2, max: 2, factor: 0.8 },
  { min: 3, max: 3, factor: 0.7 },
  { min: 4, max: 4, factor: 0.65 },
  { min: 5, max: 99, factor: 0.6 },
];

const methodFactors: Record<InstallMethod, number> = {
  Conduit: 1,
  'Cable tray': 1.12,
  'Free air': 1.2,
};

const insulationFactors: Record<InsulationType, number> = {
  'PVC 75C': 1,
  'XLPE 90C': 1.08,
};

const fillRuleLimit: Record<FillRule, number> = {
  'Single cable (53%)': 53,
  'Two conductors (31%)': 31,
  'Multiple conductors (40%)': 40,
};

function parseLooseCsv(source: string) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(',')
        .map((cell) => cell.trim().replace(/^"(.*)"$/, '$1')),
    );
}

function getResistance(sizeMm2: number, material: ConductorMaterial) {
  const entry = closestEntry(cableResistanceTable, sizeMm2);
  return entry[material.toLowerCase() as 'copper' | 'aluminum'];
}

function getCableArea(sizeMm2: number) {
  return closestEntry(cableAreaTable, sizeMm2).areaMm2;
}

function getConduitArea(sizeMm: number) {
  const entry = conduitAreaTable.reduce((best, current) => {
    if (!best) return current;
    return Math.abs(current.sizeMm - sizeMm) < Math.abs(best.sizeMm - sizeMm) ? current : best;
  }, conduitAreaTable[0]);
  const radius = entry.innerDiameterMm / 2;
  return Math.PI * radius * radius;
}

function getAmbientFactor(ambientC: number) {
  return ambientDeratingTable.find((entry) => ambientC >= entry.min && ambientC <= entry.max)?.factor ?? 0.68;
}

function getGroupingFactor(groupingCount: number) {
  const normalized = Math.max(1, Math.round(groupingCount));
  return groupingDeratingTable.find((entry) => normalized >= entry.min && normalized <= entry.max)?.factor ?? 0.6;
}

export interface VoltageDropInputs {
  currentAmps: number;
  lengthMeters: number;
  systemVoltage: number;
  phase: ElectricalPhase;
  conductorSizeMm2: number;
  conductorMaterial: ConductorMaterial;
  targetDropPercent: number;
}

export interface VoltageDropOutput {
  resistanceOhmPerKm: number;
  dropVolts: number;
  dropPercent: number;
  targetDropPercent: number;
  maxRecommendedLengthMeters: number;
  status: 'Within limit' | 'Near limit' | 'Exceeds limit';
}

export function calculateVoltageDrop(inputs: VoltageDropInputs): VoltageDropOutput {
  const current = clampPositive(inputs.currentAmps, 1);
  const length = clampPositive(inputs.lengthMeters, 1);
  const voltage = clampPositive(inputs.systemVoltage, 230);
  const targetDropPercent = clampPositive(inputs.targetDropPercent, 3);
  const phaseFactor = inputs.phase === 'Three-phase' ? Math.sqrt(3) : 2;
  const resistanceOhmPerKm = getResistance(inputs.conductorSizeMm2, inputs.conductorMaterial);
  const dropVolts = (phaseFactor * current * resistanceOhmPerKm * length) / 1000;
  const dropPercent = (dropVolts / voltage) * 100;
  const maxRecommendedLengthMeters = ((targetDropPercent / 100) * voltage * 1000) / (phaseFactor * current * resistanceOhmPerKm);

  return {
    resistanceOhmPerKm,
    dropVolts,
    dropPercent,
    targetDropPercent,
    maxRecommendedLengthMeters,
    status: dropPercent <= targetDropPercent ? 'Within limit' : dropPercent <= targetDropPercent * 1.15 ? 'Near limit' : 'Exceeds limit',
  };
}

export interface CableSizingInputs {
  loadAmps: number;
  systemVoltage: number;
  lengthMeters: number;
  phase: ElectricalPhase;
  conductorMaterial: ConductorMaterial;
  insulation: InsulationType;
  installMethod: InstallMethod;
  ambientC: number;
  groupingCount: number;
  continuousLoad: boolean;
  targetDropPercent: number;
}

export interface CableSizingCandidate {
  sizeMm2: number;
  baseAmpacity: number;
  adjustedAmpacity: number;
  dropPercent: number;
  marginAmps: number;
  passes: boolean;
}

export interface CableSizingOutput {
  requiredCurrent: number;
  ambientFactor: number;
  groupingFactor: number;
  methodFactor: number;
  insulationFactor: number;
  candidates: CableSizingCandidate[];
  recommended: CableSizingCandidate | null;
  warning: string;
}

export function estimateCableSize(inputs: CableSizingInputs): CableSizingOutput {
  const requiredCurrent = clampPositive(inputs.loadAmps, 0) * (inputs.continuousLoad ? 1.25 : 1);
  const ambientFactor = getAmbientFactor(inputs.ambientC);
  const groupingFactor = getGroupingFactor(inputs.groupingCount);
  const methodFactor = methodFactors[inputs.installMethod];
  const insulationFactor = insulationFactors[inputs.insulation];
  const targetDropPercent = clampPositive(inputs.targetDropPercent, 3);

  const candidates = cableAmpacityTable.map((entry) => {
    const baseAmpacity = entry[inputs.conductorMaterial.toLowerCase() as 'copper' | 'aluminum'];
    const adjustedAmpacity = baseAmpacity * ambientFactor * groupingFactor * methodFactor * insulationFactor;
    const drop = calculateVoltageDrop({
      currentAmps: requiredCurrent,
      lengthMeters: inputs.lengthMeters,
      systemVoltage: inputs.systemVoltage,
      phase: inputs.phase,
      conductorSizeMm2: entry.sizeMm2,
      conductorMaterial: inputs.conductorMaterial,
      targetDropPercent,
    });

    return {
      sizeMm2: entry.sizeMm2,
      baseAmpacity,
      adjustedAmpacity,
      dropPercent: drop.dropPercent,
      marginAmps: adjustedAmpacity - requiredCurrent,
      passes: adjustedAmpacity >= requiredCurrent && drop.dropPercent <= targetDropPercent,
    };
  });

  const recommended = candidates.find((candidate) => candidate.passes) ?? null;

  return {
    requiredCurrent,
    ambientFactor,
    groupingFactor,
    methodFactor,
    insulationFactor,
    candidates,
    recommended,
    warning: recommended
      ? ''
      : 'No candidate met both the current and voltage-drop limits. Increase conductor size or relax one of the assumptions.',
  };
}

export interface ConduitFillRow {
  cableSizeMm2: number;
  quantity: number;
  description: string;
  effectiveAreaMm2: number;
  lineAreaMm2: number;
}

export interface ConduitFillOutput {
  conduitSizeMm: number;
  conduitAreaMm2: number;
  limitPercent: number;
  allowedAreaMm2: number;
  totalAreaMm2: number;
  fillPercent: number;
  status: 'Within limit' | 'Near limit' | 'Exceeds limit';
  rows: ConduitFillRow[];
  report: string;
}

export function calculateConduitFill(
  source: string,
  conduitSizeMm: number,
  fillRule: FillRule,
): { output: ConduitFillOutput | null; error: string } {
  const rows = parseLooseCsv(source);
  if (rows.length < 2) {
    return { output: null, error: 'Add a header row plus at least one conductor row.' };
  }

  const dataRows = rows.slice(1);
  const parsed: ConduitFillRow[] = [];

  for (const row of dataRows) {
    const [cableSizeRaw, quantityRaw, description = ''] = row;
    const cableSizeMm2 = Number(cableSizeRaw);
    const quantity = Number(quantityRaw);

    if (!Number.isFinite(cableSizeMm2) || !Number.isFinite(quantity) || cableSizeMm2 <= 0 || quantity <= 0) {
      return { output: null, error: 'Each row needs cableSizeMm2, quantity, and an optional description.' };
    }

    const effectiveAreaMm2 = getCableArea(cableSizeMm2);
    const lineAreaMm2 = effectiveAreaMm2 * quantity;
    parsed.push({ cableSizeMm2, quantity, description, effectiveAreaMm2, lineAreaMm2 });
  }

  const conduitAreaMm2 = getConduitArea(conduitSizeMm);
  const limitPercent = fillRuleLimit[fillRule];
  const allowedAreaMm2 = conduitAreaMm2 * (limitPercent / 100);
  const totalAreaMm2 = parsed.reduce((sum, row) => sum + row.lineAreaMm2, 0);
  const fillPercent = (totalAreaMm2 / conduitAreaMm2) * 100;

  return {
    output: {
      conduitSizeMm,
      conduitAreaMm2,
      limitPercent,
      allowedAreaMm2,
      totalAreaMm2,
      fillPercent,
      status: fillPercent <= limitPercent ? 'Within limit' : fillPercent <= limitPercent * 1.1 ? 'Near limit' : 'Exceeds limit',
      rows: parsed,
      report: [
        'Conduit Fill Summary',
        `Conduit size: ${conduitSizeMm} mm`,
        `Fill rule: ${fillRule}`,
        `Rows: ${parsed.length}`,
        `Total effective area: ${totalAreaMm2.toFixed(1)} mm2`,
        `Allowed area: ${allowedAreaMm2.toFixed(1)} mm2`,
        `Fill percent: ${fillPercent.toFixed(1)}%`,
      ].join('\n'),
    },
    error: '',
  };
}

export interface PanelScheduleRowInput {
  circuit: string;
  description: string;
  loadWatts: number;
  breakerAmps: number;
  phase: PanelPhase;
}

export interface PanelScheduleRow extends PanelScheduleRowInput {
  estimatedCurrentAmps: number;
  phaseLoadWatts: { A: number; B: number; C: number };
}

export interface PanelScheduleOutput {
  rows: PanelScheduleRow[];
  totalWatts: number;
  phaseWatts: { A: number; B: number; C: number };
  phaseLoadsAmps: { A: number; B: number; C: number };
  imbalancePercent: number;
  spareWays: number;
  occupiedWays: number;
  estimatedDemandAmps: number;
  report: string;
}

export function buildPanelSchedule(
  rows: PanelScheduleRowInput[],
  panelWays: number,
  systemVoltage: number,
  powerFactor: number,
): PanelScheduleOutput {
  const cleanRows: PanelScheduleRow[] = rows.map((row) => {
    const watts = clampPositive(row.loadWatts, 0);
    const phaseLoadWatts = { A: 0, B: 0, C: 0 };

    if (row.phase === '3Φ') {
      phaseLoadWatts.A = watts / 3;
      phaseLoadWatts.B = watts / 3;
      phaseLoadWatts.C = watts / 3;
    } else {
      phaseLoadWatts[row.phase] = watts;
    }

    const estimatedCurrentAmps =
      row.phase === '3Φ'
        ? watts / (Math.sqrt(3) * clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95))
        : watts / (clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95));

    return {
      ...row,
      loadWatts: watts,
      estimatedCurrentAmps,
      phaseLoadWatts,
    };
  });

  const phaseWatts = cleanRows.reduce(
    (accumulator, row) => {
      accumulator.A += row.phaseLoadWatts.A;
      accumulator.B += row.phaseLoadWatts.B;
      accumulator.C += row.phaseLoadWatts.C;
      return accumulator;
    },
    { A: 0, B: 0, C: 0 },
  );

  const phaseLoadsAmps = {
    A: phaseWatts.A / (clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95)),
    B: phaseWatts.B / (clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95)),
    C: phaseWatts.C / (clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95)),
  };

  const totalWatts = phaseWatts.A + phaseWatts.B + phaseWatts.C;
  const occupiedWays = cleanRows.length;
  const spareWays = Math.max(0, Math.round(clampPositive(panelWays, occupiedWays) - occupiedWays));
  const averagePhaseWatts = totalWatts / 3;
  const imbalancePercent =
    averagePhaseWatts > 0 ? ((Math.max(phaseWatts.A, phaseWatts.B, phaseWatts.C) - averagePhaseWatts) / averagePhaseWatts) * 100 : 0;
  const estimatedDemandAmps = totalWatts / (clampPositive(systemVoltage, 230) * clampPositive(powerFactor, 0.95));

  return {
    rows: cleanRows,
    totalWatts,
    phaseWatts,
    phaseLoadsAmps,
    imbalancePercent,
    spareWays,
    occupiedWays,
    estimatedDemandAmps,
    report: [
      'Electrical panel schedule',
      `Rows: ${cleanRows.length}`,
      `Total connected load: ${(totalWatts / 1000).toFixed(2)} kW`,
      `Estimated demand: ${estimatedDemandAmps.toFixed(2)} A`,
      `Phase A load: ${phaseWatts.A.toFixed(0)} W`,
      `Phase B load: ${phaseWatts.B.toFixed(0)} W`,
      `Phase C load: ${phaseWatts.C.toFixed(0)} W`,
      `Spare ways: ${spareWays}`,
      `Imbalance: ${imbalancePercent.toFixed(1)}%`,
    ].join('\n'),
  };
}

export interface ElectricalFormula {
  id: string;
  title: string;
  category: 'Load' | 'Voltage' | 'Power' | 'Three-phase' | 'Sizing' | 'Protection' | 'Fill' | 'Lighting';
  formula: string;
  variables: string[];
  notes: string;
}

export const electricalFormulas: ElectricalFormula[] = [
  {
    id: 'ohms-law',
    title: "Ohm's law",
    category: 'Voltage',
    formula: 'V = I * R',
    variables: ['V = voltage', 'I = current', 'R = resistance'],
    notes: 'The basic starting point for quick voltage and resistance checks.',
  },
  {
    id: 'power-single-phase',
    title: 'Single-phase power',
    category: 'Power',
    formula: 'P = V * I * pf',
    variables: ['P = real power', 'V = voltage', 'I = current', 'pf = power factor'],
    notes: 'Useful for current and load conversions in single-phase circuits.',
  },
  {
    id: 'power-three-phase',
    title: 'Three-phase power',
    category: 'Three-phase',
    formula: 'P = sqrt(3) * V * I * pf',
    variables: ['P = real power', 'V = line voltage', 'I = line current', 'pf = power factor'],
    notes: 'A common relation for balanced three-phase loads and supply sizing.',
  },
  {
    id: 'current-power',
    title: 'Current from power',
    category: 'Load',
    formula: 'I = P / (V * pf)',
    variables: ['I = current', 'P = power', 'V = voltage', 'pf = power factor'],
    notes: 'Helpful when a load is known in watts or kilowatts but current is needed.',
  },
  {
    id: 'voltage-drop-single',
    title: 'Single-phase voltage drop',
    category: 'Voltage',
    formula: 'Vd = 2 * I * R * L / 1000',
    variables: ['Vd = voltage drop', 'I = current', 'R = resistance in ohm/km', 'L = one-way length in meters'],
    notes: 'A quick estimate for single-phase or DC style line runs.',
  },
  {
    id: 'voltage-drop-three',
    title: 'Three-phase voltage drop',
    category: 'Voltage',
    formula: 'Vd = sqrt(3) * I * R * L / 1000',
    variables: ['Vd = voltage drop', 'I = current', 'R = resistance in ohm/km', 'L = one-way length in meters'],
    notes: 'A quick estimate for balanced three-phase line runs.',
  },
  {
    id: 'voltage-drop-percent',
    title: 'Voltage drop percent',
    category: 'Voltage',
    formula: '%Vd = (Vd / V) * 100',
    variables: ['Vd = voltage drop', 'V = nominal system voltage'],
    notes: 'Useful when comparing a line drop against a project limit.',
  },
  {
    id: 'conduit-fill',
    title: 'Conduit fill percent',
    category: 'Fill',
    formula: 'fill % = total cable area / conduit area * 100',
    variables: ['total cable area = sum of cable effective areas', 'conduit area = available conduit area'],
    notes: 'A practical browser-local shortcut for quick routing checks.',
  },
  {
    id: 'breaker-current-margin',
    title: 'Breaker margin',
    category: 'Protection',
    formula: 'margin = breaker rating - design current',
    variables: ['margin = available current margin', 'breaker rating = protective device rating', 'design current = calculated load current'],
    notes: 'A fast way to see whether the chosen breaker is comfortably above the expected current.',
  },
  {
    id: 'kva-single-phase',
    title: 'Single-phase apparent power',
    category: 'Load',
    formula: 'kVA = V * I / 1000',
    variables: ['kVA = apparent power', 'V = voltage', 'I = current'],
    notes: 'Useful for quick transformer and feeder checks.',
  },
  {
    id: 'kva-three-phase',
    title: 'Three-phase apparent power',
    category: 'Three-phase',
    formula: 'kVA = sqrt(3) * V * I / 1000',
    variables: ['kVA = apparent power', 'V = line voltage', 'I = line current'],
    notes: 'A common feeder and transformer lookup relation.',
  },
  {
    id: 'lighting-load-density',
    title: 'Lighting load from density',
    category: 'Lighting',
    formula: 'P = area * load density',
    variables: ['P = lighting load', 'area = floor area', 'load density = watts per square meter'],
    notes: 'Useful for quick planning and early layout checks.',
  },
  {
    id: 'cable-sizing-current',
    title: 'Design current with continuous load',
    category: 'Sizing',
    formula: 'Idesign = Iload * 1.25',
    variables: ['Idesign = design current', 'Iload = connected load current'],
    notes: 'A practical planning factor for continuously loaded circuits.',
  },
];

export function findElectricalFormulas(query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return electricalFormulas.filter((formula) => {
    if (category !== 'All' && formula.category !== category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [formula.title, formula.formula, formula.notes, ...formula.variables].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export interface BreakerProtectionInput {
  loadCurrentA: number;
  continuousFactor: number;
  deratingFactor: number;
  selectedBreakerA: number;
}

export interface BreakerProtectionOutput {
  requiredCurrentA: number;
  recommendedStandardBreakerA: number;
  selectedBreakerA: number;
  loadingPercent: number;
  headroomA: number;
  passes: boolean;
  report: string;
}

const standardBreakerRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500];

export function checkBreakerProtection(input: BreakerProtectionInput): BreakerProtectionOutput {
  const loadCurrentA = clampPositive(input.loadCurrentA, 0);
  const continuousFactor = clampPositive(input.continuousFactor, 1);
  const deratingFactor = clampPositive(input.deratingFactor, 1);
  const selectedBreakerA = clampPositive(input.selectedBreakerA, 1);
  const requiredCurrentA = (loadCurrentA * continuousFactor) / deratingFactor;
  const recommendedStandardBreakerA =
    standardBreakerRatings.find((rating) => rating >= requiredCurrentA) ?? standardBreakerRatings[standardBreakerRatings.length - 1];
  const loadingPercent = (loadCurrentA / selectedBreakerA) * 100;
  const headroomA = selectedBreakerA - requiredCurrentA;
  const passes = selectedBreakerA >= requiredCurrentA;
  const report = [
    'Breaker Check Summary',
    `Required current: ${requiredCurrentA.toFixed(1)} A`,
    `Recommended breaker: ${recommendedStandardBreakerA} A`,
    `Selected breaker: ${selectedBreakerA.toFixed(0)} A`,
    `Loading: ${loadingPercent.toFixed(1)}%`,
    `Headroom: ${headroomA.toFixed(1)} A`,
  ].join('\n');

  return {
    requiredCurrentA,
    recommendedStandardBreakerA,
    selectedBreakerA,
    loadingPercent,
    headroomA,
    passes,
    report,
  };
}

export interface LightingLoadInput {
  areaM2: number;
  densityWPerM2: number;
  voltageV: number;
  powerFactor: number;
  fixtureWatts: number;
}

export interface LightingLoadOutput {
  totalPowerW: number;
  currentA: number;
  estimatedFixtureCount: number;
  wattsPerFixture: number;
  report: string;
}

export function calculateLightingLoad(input: LightingLoadInput): LightingLoadOutput {
  const areaM2 = clampPositive(input.areaM2, 1);
  const densityWPerM2 = clampPositive(input.densityWPerM2, 1);
  const voltageV = clampPositive(input.voltageV, 1);
  const powerFactor = Math.min(Math.max(input.powerFactor, 0.1), 1);
  const fixtureWatts = clampPositive(input.fixtureWatts, 1);
  const totalPowerW = areaM2 * densityWPerM2;
  const currentA = totalPowerW / (voltageV * powerFactor);
  const estimatedFixtureCount = Math.max(1, Math.ceil(totalPowerW / fixtureWatts));
  const report = [
    'Lighting Load Summary',
    `Area: ${areaM2.toFixed(1)} m2`,
    `Total load: ${totalPowerW.toFixed(1)} W`,
    `Current: ${currentA.toFixed(2)} A`,
    `Fixture count: ${estimatedFixtureCount}`,
  ].join('\n');

  return {
    totalPowerW,
    currentA,
    estimatedFixtureCount,
    wattsPerFixture: fixtureWatts,
    report,
  };
}

export type MotorPhase = 'single' | 'three';

export interface MotorStartingInput {
  fullLoadAmps: number;
  startMultiplier: number;
  voltageV: number;
  phase: MotorPhase;
  sourceFaultCurrentA: number;
}

export interface MotorStartingOutput {
  startingCurrentA: number;
  apparentPowerKVA: number;
  voltageDipPercent: number | null;
  report: string;
}

export function calculateMotorStarting(input: MotorStartingInput): MotorStartingOutput {
  const fullLoadAmps = clampPositive(input.fullLoadAmps, 0.1);
  const startMultiplier = clampPositive(input.startMultiplier, 1);
  const voltageV = clampPositive(input.voltageV, 1);
  const sourceFaultCurrentA = clampPositive(input.sourceFaultCurrentA, 0);
  const startingCurrentA = fullLoadAmps * startMultiplier;
  const apparentPowerKVA =
    input.phase === 'three'
      ? (Math.sqrt(3) * voltageV * startingCurrentA) / 1000
      : (voltageV * startingCurrentA) / 1000;
  const voltageDipPercent = sourceFaultCurrentA > 0 ? (startingCurrentA / sourceFaultCurrentA) * 100 : null;
  const report = [
    'Motor Starting Summary',
    `Starting current: ${startingCurrentA.toFixed(1)} A`,
    `Starting kVA: ${apparentPowerKVA.toFixed(2)} kVA`,
    `Voltage dip: ${voltageDipPercent === null ? 'n/a' : `${voltageDipPercent.toFixed(1)}%`}`,
  ].join('\n');

  return {
    startingCurrentA,
    apparentPowerKVA,
    voltageDipPercent,
    report,
  };
}
