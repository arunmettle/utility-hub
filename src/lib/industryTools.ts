import { diffText } from './privacyTools';

export interface HandoverSection {
  title: string;
  items: string[];
}

export interface HandoverOutput {
  sections: HandoverSection[];
  urgentItems: string[];
  dueTimes: string[];
  markdown: string;
}

const handoverBuckets = [
  {
    title: 'Safety and clinical risk',
    keywords: ['risk', 'critical', 'urgent', 'unsafe', 'fall', 'bleed', 'infection', 'isolation', 'hazard', 'permit', 'loto', 'gas', 'alarm'],
  },
  {
    title: 'Operations and status',
    keywords: ['running', 'stable', 'operating', 'monitor', 'production', 'ward', 'patient', 'bed', 'flow', 'pressure', 'line'],
  },
  {
    title: 'Equipment and maintenance',
    keywords: ['pump', 'motor', 'bearing', 'panel', 'breaker', 'generator', 'fan', 'compressor', 'hvac', 'repair', 'service'],
  },
  {
    title: 'Pending actions',
    keywords: ['follow up', 'pending', 'todo', 'action', 'review', 'call', 'await', 'order', 'sample', 'repeat'],
  },
];

function normalizeLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function findBucket(line: string) {
  const lowered = line.toLowerCase();
  return (
    handoverBuckets.find((bucket) => bucket.keywords.some((keyword) => lowered.includes(keyword))) ?? {
      title: 'General notes',
      keywords: [],
    }
  );
}

export function buildShiftHandover(rawNotes: string): HandoverOutput {
  const grouped = new Map<string, string[]>();
  const urgentItems: string[] = [];
  const dueTimes: string[] = [];

  for (const line of normalizeLines(rawNotes)) {
    const bucket = findBucket(line);
    const current = grouped.get(bucket.title) ?? [];
    current.push(line);
    grouped.set(bucket.title, current);

    if (/\b(urgent|critical|asap|immediate|stat)\b/i.test(line)) {
      urgentItems.push(line);
    }

    const matches = line.match(/\b\d{1,2}:\d{2}\b|\b\d{1,2}(?:am|pm)\b/gi);
    if (matches) {
      dueTimes.push(...matches.map((match) => `${match} - ${line}`));
    }
  }

  const sections = Array.from(grouped.entries()).map(([title, items]) => ({ title, items }));
  const markdownSections = sections
    .map((section) => [`## ${section.title}`, ...section.items.map((item) => `- ${item}`)].join('\n'))
    .join('\n\n');
  const markdown = `# Shift handover\n\n${markdownSections}`.trim();

  return {
    sections,
    urgentItems,
    dueTimes,
    markdown,
  };
}

export interface PressureDropInputs {
  flowLitersPerSecond: number;
  diameterMillimeters: number;
  lengthMeters: number;
  roughnessMillimeters: number;
  fluidDensity: number;
  dynamicViscosity: number;
  fittingsK: number;
  elevationChangeMeters: number;
}

export interface PressureDropResult {
  velocity: number;
  reynoldsNumber: number;
  frictionFactor: number;
  frictionHeadLoss: number;
  minorHeadLoss: number;
  staticHead: number;
  totalHeadLoss: number;
  totalPressureDropKPa: number;
}

function clampPositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function calculatePressureDrop(inputs: PressureDropInputs): PressureDropResult {
  const g = 9.80665;
  const flow = clampPositive(inputs.flowLitersPerSecond, 0.1) / 1000;
  const diameter = clampPositive(inputs.diameterMillimeters, 10) / 1000;
  const area = (Math.PI * diameter * diameter) / 4;
  const velocity = flow / area;
  const density = clampPositive(inputs.fluidDensity, 998);
  const viscosity = clampPositive(inputs.dynamicViscosity, 0.001);
  const roughness = Math.max(inputs.roughnessMillimeters, 0) / 1000;
  const length = clampPositive(inputs.lengthMeters, 1);
  const reynoldsNumber = (density * velocity * diameter) / viscosity;

  const frictionFactor =
    reynoldsNumber < 2300
      ? 64 / reynoldsNumber
      : 0.25 /
        Math.pow(
          Math.log10(roughness / (3.7 * diameter) + 5.74 / Math.pow(reynoldsNumber, 0.9)),
          2,
        );

  const velocityHead = (velocity * velocity) / (2 * g);
  const frictionHeadLoss = frictionFactor * (length / diameter) * velocityHead;
  const minorHeadLoss = Math.max(inputs.fittingsK, 0) * velocityHead;
  const staticHead = inputs.elevationChangeMeters;
  const totalHeadLoss = frictionHeadLoss + minorHeadLoss + staticHead;
  const totalPressureDropKPa = (density * g * totalHeadLoss) / 1000;

  return {
    velocity,
    reynoldsNumber,
    frictionFactor,
    frictionHeadLoss,
    minorHeadLoss,
    staticHead,
    totalHeadLoss,
    totalPressureDropKPa,
  };
}

export interface RevisionDiffRow {
  kind: 'unchanged' | 'added' | 'removed' | 'changed';
  leftValue: string;
  rightValue: string;
  leftLineNumber: number | null;
  rightLineNumber: number | null;
}

export interface RevisionDiffOutput {
  rows: RevisionDiffRow[];
  summary: {
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
  };
  numberChanges: string[];
}

export function buildRevisionDiff(left: string, right: string): RevisionDiffOutput {
  const lines = diffText(left, right);
  const rows: RevisionDiffRow[] = [];
  let leftLineNumber = 1;
  let rightLineNumber = 1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const nextLine = lines[index + 1];

    if (line.kind === 'removed' && nextLine?.kind === 'added') {
      rows.push({
        kind: 'changed',
        leftValue: line.value,
        rightValue: nextLine.value,
        leftLineNumber,
        rightLineNumber,
      });
      leftLineNumber += 1;
      rightLineNumber += 1;
      index += 1;
      continue;
    }

    if (line.kind === 'removed') {
      rows.push({
        kind: 'removed',
        leftValue: line.value,
        rightValue: '',
        leftLineNumber,
        rightLineNumber: null,
      });
      leftLineNumber += 1;
      continue;
    }

    if (line.kind === 'added') {
      rows.push({
        kind: 'added',
        leftValue: '',
        rightValue: line.value,
        leftLineNumber: null,
        rightLineNumber,
      });
      rightLineNumber += 1;
      continue;
    }

    rows.push({
      kind: 'unchanged',
      leftValue: line.value,
      rightValue: line.value,
      leftLineNumber,
      rightLineNumber,
    });
    leftLineNumber += 1;
    rightLineNumber += 1;
  }

  const summary = rows.reduce(
    (accumulator, row) => {
      accumulator[row.kind] += 1;
      return accumulator;
    },
    { added: 0, removed: 0, changed: 0, unchanged: 0 },
  );

  const numberChanges = rows
    .filter((row) => row.kind === 'changed')
    .flatMap((row) => {
      const leftNumbers = row.leftValue.match(/-?\d+(?:\.\d+)?/g) ?? [];
      const rightNumbers = row.rightValue.match(/-?\d+(?:\.\d+)?/g) ?? [];
      if (leftNumbers.join('|') !== rightNumbers.join('|')) {
        return [`L${row.leftLineNumber} -> R${row.rightLineNumber}: ${row.leftValue} => ${row.rightValue}`];
      }
      return [];
    });

  return { rows, summary, numberChanges };
}

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

export interface ToleranceStackRow {
  label: string;
  nominal: number;
  plusTol: number;
  minusTol: number;
  direction: '+' | '-';
  contributionMin: number;
  contributionMax: number;
}

export interface ToleranceStackOutput {
  rows: ToleranceStackRow[];
  totalNominal: number;
  totalMin: number;
  totalMax: number;
  totalRange: number;
  rssMin: number;
  rssMax: number;
  report: string;
}

export function analyzeToleranceStack(source: string): { output: ToleranceStackOutput | null; error: string } {
  const rows = parseLooseCsv(source);
  if (rows.length < 2) {
    return { output: null, error: 'Add a header row plus at least one stack row.' };
  }

  const dataRows = rows.slice(1);
  const parsed: ToleranceStackRow[] = [];

  for (const row of dataRows) {
    const [label, nominalRaw, plusRaw, minusRaw, directionRaw] = row;
    const nominal = Number(nominalRaw);
    const plusTol = Number(plusRaw);
    const minusTol = Number(minusRaw);
    const direction = directionRaw === '-' ? '-' : '+';

    if (!label || !Number.isFinite(nominal) || !Number.isFinite(plusTol) || !Number.isFinite(minusTol)) {
      return { output: null, error: 'Each row needs label, nominal, plusTol, minusTol, and direction.' };
    }

    const dimensionMin = nominal - minusTol;
    const dimensionMax = nominal + plusTol;
    const contributionMin = direction === '+' ? dimensionMin : -dimensionMax;
    const contributionMax = direction === '+' ? dimensionMax : -dimensionMin;

    parsed.push({
      label,
      nominal,
      plusTol,
      minusTol,
      direction,
      contributionMin,
      contributionMax,
    });
  }

  const totalNominal = parsed.reduce((sum, row) => sum + (row.direction === '+' ? row.nominal : -row.nominal), 0);
  const totalMin = parsed.reduce((sum, row) => sum + row.contributionMin, 0);
  const totalMax = parsed.reduce((sum, row) => sum + row.contributionMax, 0);
  const rssMinus = Math.sqrt(parsed.reduce((sum, row) => sum + row.minusTol ** 2, 0));
  const rssPlus = Math.sqrt(parsed.reduce((sum, row) => sum + row.plusTol ** 2, 0));
  const rssMin = totalNominal - rssMinus;
  const rssMax = totalNominal + rssPlus;
  const totalRange = totalMax - totalMin;
  const report = [
    'Tolerance Stack-Up Summary',
    `Nominal: ${totalNominal.toFixed(3)}`,
    `Worst-case min: ${totalMin.toFixed(3)}`,
    `Worst-case max: ${totalMax.toFixed(3)}`,
    `Worst-case range: ${totalRange.toFixed(3)}`,
    `RSS min: ${rssMin.toFixed(3)}`,
    `RSS max: ${rssMax.toFixed(3)}`,
  ].join('\n');

  return {
    output: {
      rows: parsed,
      totalNominal,
      totalMin,
      totalMax,
      totalRange,
      rssMin,
      rssMax,
      report,
    },
    error: '',
  };
}

export interface BomDiffOutput {
  totalParts: number;
  added: string[];
  removed: string[];
  quantityChanged: string[];
  descriptionChanged: string[];
  highlights: string[];
  report: string;
}

export function diffBomCsv(left: string, right: string): { output: BomDiffOutput | null; error: string } {
  const leftRows = parseLooseCsv(left);
  const rightRows = parseLooseCsv(right);
  if (leftRows.length < 2 || rightRows.length < 2) {
    return { output: null, error: 'Provide a header row and at least one BOM row on each side.' };
  }

  const toMap = (rows: string[][]) => {
    const map = new Map<string, { qty: number; description: string }>();
    for (const [part, qtyRaw, description = ''] of rows.slice(1)) {
      if (!part) continue;
      map.set(part, { qty: Number(qtyRaw) || 0, description });
    }
    return map;
  };

  const oldMap = toMap(leftRows);
  const newMap = toMap(rightRows);
  const allParts = new Set([...oldMap.keys(), ...newMap.keys()]);
  const added: string[] = [];
  const removed: string[] = [];
  const quantityChanged: string[] = [];
  const descriptionChanged: string[] = [];
  const highlights: string[] = [];

  for (const part of allParts) {
    const oldPart = oldMap.get(part);
    const newPart = newMap.get(part);
    if (!oldPart && newPart) {
      const line = `Added ${part} x${newPart.qty} ${newPart.description}`.trim();
      added.push(line);
      highlights.push(line);
      continue;
    }
    if (oldPart && !newPart) {
      const line = `Removed ${part} x${oldPart.qty} ${oldPart.description}`.trim();
      removed.push(line);
      highlights.push(line);
      continue;
    }
    if (!oldPart || !newPart) continue;
    if (oldPart.qty !== newPart.qty) {
      const line = `Qty changed ${part}: ${oldPart.qty} -> ${newPart.qty}`;
      quantityChanged.push(line);
      highlights.push(line);
    }
    if (oldPart.description !== newPart.description) {
      const line = `Description changed ${part}: ${oldPart.description} -> ${newPart.description}`;
      descriptionChanged.push(line);
      highlights.push(line);
    }
  }

  const report = [
    'BOM Diff Summary',
    ...highlights,
  ].join('\n');

  return {
    output: {
      totalParts: allParts.size,
      added,
      removed,
      quantityChanged,
      descriptionChanged,
      highlights,
      report,
    },
    error: '',
  };
}

export interface HoleShaftFitInputs {
  holeNominal: number;
  holePlusTol: number;
  holeMinusTol: number;
  shaftNominal: number;
  shaftPlusTol: number;
  shaftMinusTol: number;
}

export interface HoleShaftFitOutput {
  holeMin: number;
  holeMax: number;
  shaftMin: number;
  shaftMax: number;
  minClearance: number;
  maxClearance: number;
  fitType: 'Clearance fit' | 'Interference fit' | 'Transition fit';
  interpretation: string;
  windowMicrons: number;
}

export function calculateHoleShaftFit(inputs: HoleShaftFitInputs): HoleShaftFitOutput {
  const holeMin = inputs.holeNominal - inputs.holeMinusTol;
  const holeMax = inputs.holeNominal + inputs.holePlusTol;
  const shaftMin = inputs.shaftNominal - inputs.shaftMinusTol;
  const shaftMax = inputs.shaftNominal + inputs.shaftPlusTol;
  const minClearance = holeMin - shaftMax;
  const maxClearance = holeMax - shaftMin;

  let fitType: HoleShaftFitOutput['fitType'] = 'Transition fit';
  let interpretation = 'Some assemblies may clear while others may interfere.';

  if (minClearance > 0) {
    fitType = 'Clearance fit';
    interpretation = 'The pair always assembles with positive clearance.';
  } else if (maxClearance < 0) {
    fitType = 'Interference fit';
    interpretation = 'The pair always assembles with interference.';
  }

  return {
    holeMin,
    holeMax,
    shaftMin,
    shaftMax,
    minClearance,
    maxClearance,
    fitType,
    interpretation,
    windowMicrons: (maxClearance - minClearance) * 1000,
  };
}

export interface MechanicalFormula {
  id: string;
  title: string;
  category: 'Statics' | 'Strength' | 'Dynamics' | 'Fluids' | 'Heat Transfer' | 'Machine Design';
  formula: string;
  variables: string[];
  notes: string;
}

export const mechanicalFormulas: MechanicalFormula[] = [
  {
    id: 'force-balance',
    title: 'Static force balance',
    category: 'Statics',
    formula: 'sum(F) = 0',
    variables: ['sum(F) = algebraic sum of forces in a chosen direction'],
    notes: 'The starting point for support reactions, free-body diagrams, and equilibrium checks.',
  },
  {
    id: 'moment-balance',
    title: 'Static moment balance',
    category: 'Statics',
    formula: 'sum(M) = 0',
    variables: ['sum(M) = algebraic sum of moments about a chosen point'],
    notes: 'Used constantly for reactions, tipping checks, and bracket equilibrium.',
  },
  {
    id: 'centroid-rectangle',
    title: 'Rectangle centroid',
    category: 'Statics',
    formula: 'xbar = b / 2, ybar = h / 2',
    variables: ['xbar = centroid x location', 'ybar = centroid y location', 'b = width', 'h = height'],
    notes: 'A basic geometric relation used when building section properties.',
  },
  {
    id: 'parallel-axis',
    title: 'Parallel axis theorem',
    category: 'Statics',
    formula: 'I = Ic + A * d^2',
    variables: ['I = shifted second moment of area', 'Ic = centroidal second moment of area', 'A = area', 'd = offset distance'],
    notes: 'Useful when building custom section properties from simple shapes.',
  },
  {
    id: 'factor-of-safety',
    title: 'Factor of safety',
    category: 'Statics',
    formula: 'n = Strength / Applied load effect',
    variables: ['n = factor of safety', 'Strength = allowable or failure value', 'Applied load effect = demand from load, stress, or moment'],
    notes: 'Often the final quick check after a hand calculation is complete.',
  },
  {
    id: 'pressure-force',
    title: 'Pressure force',
    category: 'Statics',
    formula: 'F = p * A',
    variables: ['F = force', 'p = pressure', 'A = loaded area'],
    notes: 'Useful for cylinder, gasket, cover, and sealing-load checks.',
  },
  {
    id: 'beam-bending-stress',
    title: 'Bending stress',
    category: 'Strength',
    formula: 'sigma = M * c / I',
    variables: ['sigma = bending stress', 'M = bending moment', 'c = distance to outer fiber', 'I = second moment of area'],
    notes: 'Useful for quick beam and bracket stress checks before moving into deeper FEA.',
  },
  {
    id: 'beam-deflection-cantilever-end-load',
    title: 'Cantilever tip deflection',
    category: 'Strength',
    formula: 'delta = F * L^3 / (3 * E * I)',
    variables: ['delta = tip deflection', 'F = applied end load', 'L = beam length', 'E = elastic modulus', 'I = second moment of area'],
    notes: 'A common spreadsheet calculation for brackets, arms, and fixture members.',
  },
  {
    id: 'beam-deflection-simply-supported-center-load',
    title: 'Simply supported beam center deflection',
    category: 'Strength',
    formula: 'delta = F * L^3 / (48 * E * I)',
    variables: ['delta = center deflection', 'F = center load', 'L = span length', 'E = elastic modulus', 'I = second moment of area'],
      notes: 'Good for fast checks on plate supports, rails, and cross-members.',
    },
  {
    id: 'axial-stress',
    title: 'Axial normal stress',
    category: 'Strength',
    formula: 'sigma = F / A',
    variables: ['sigma = normal stress', 'F = axial load', 'A = cross-sectional area'],
    notes: 'A first-pass check for rods, ties, columns, and loaded sections.',
  },
  {
    id: 'axial-strain',
    title: 'Axial strain',
    category: 'Strength',
    formula: 'epsilon = deltaL / L',
    variables: ['epsilon = strain', 'deltaL = change in length', 'L = original length'],
    notes: 'Used with Hooke’s law and elongation calculations.',
  },
  {
    id: 'hookes-law',
    title: 'Hooke’s law',
    category: 'Strength',
    formula: 'sigma = E * epsilon',
    variables: ['sigma = stress', 'E = elastic modulus', 'epsilon = strain'],
    notes: 'A core linear-elastic relation for quick material response checks.',
  },
  {
    id: 'axial-elongation',
    title: 'Axial elongation',
    category: 'Strength',
    formula: 'deltaL = F * L / (A * E)',
    variables: ['deltaL = elongation', 'F = axial load', 'L = member length', 'A = area', 'E = elastic modulus'],
    notes: 'Common for bolts, rods, tie members, and simple stiffness estimates.',
  },
  {
    id: 'average-shear-stress',
    title: 'Average shear stress',
    category: 'Strength',
    formula: 'tau = V / A',
    variables: ['tau = average shear stress', 'V = shear force', 'A = shear area'],
    notes: 'A useful screening check for pins, lugs, and shear planes.',
  },
  {
    id: 'beam-shear-stress',
    title: 'Beam shear stress',
    category: 'Strength',
    formula: 'tau = V * Q / (I * t)',
    variables: ['tau = shear stress', 'V = shear force', 'Q = first moment of area', 'I = second moment of area', 't = local thickness'],
    notes: 'Helpful when web shear matters in beams or built-up sections.',
  },
  {
    id: 'section-modulus',
    title: 'Section modulus relation',
    category: 'Strength',
    formula: 'S = I / c',
    variables: ['S = section modulus', 'I = second moment of area', 'c = distance to outer fiber'],
    notes: 'Useful when converting between section properties and bending stress checks.',
  },
  {
    id: 'column-euler-buckling',
    title: 'Euler buckling load',
    category: 'Strength',
    formula: 'Pcr = pi^2 * E * I / (K * L)^2',
    variables: ['Pcr = critical buckling load', 'E = elastic modulus', 'I = second moment of area', 'K = effective length factor', 'L = unsupported length'],
    notes: 'A standard check for slender compression members.',
  },
  {
    id: 'slenderness-ratio',
    title: 'Slenderness ratio',
    category: 'Strength',
    formula: 'lambda = K * L / r',
    variables: ['lambda = slenderness ratio', 'K = effective length factor', 'L = unsupported length', 'r = radius of gyration'],
    notes: 'Used to decide whether buckling is likely to govern.',
  },
  {
    id: 'von-mises-plane-stress',
    title: 'Von Mises stress (plane stress)',
    category: 'Strength',
    formula: 'sigma_vm = sqrt(sigma_x^2 + sigma_y^2 - sigma_x * sigma_y + 3 * tau_xy^2)',
    variables: ['sigma_vm = equivalent stress', 'sigma_x = normal stress in x', 'sigma_y = normal stress in y', 'tau_xy = in-plane shear stress'],
    notes: 'Useful when combining hand-calculated normal and shear stresses.',
  },
  {
    id: 'max-principal-stress',
    title: 'Maximum principal stress',
    category: 'Strength',
    formula: 'sigma_1,2 = (sigma_x + sigma_y)/2 +/- sqrt(((sigma_x - sigma_y)/2)^2 + tau_xy^2)',
    variables: ['sigma_1,2 = principal stresses', 'sigma_x = normal stress in x', 'sigma_y = normal stress in y', 'tau_xy = in-plane shear stress'],
    notes: 'Helpful for failure assessment and Mohr-circle style checks.',
  },
  {
    id: 'torsion-solid-shaft',
    title: 'Solid shaft torsional shear stress',
    category: 'Machine Design',
    formula: 'tau = T * r / J',
    variables: ['tau = shear stress', 'T = torque', 'r = outer radius', 'J = polar moment of inertia'],
    notes: 'Useful for coupling, shaft, and drive component screening.',
  },
  {
    id: 'torsion-angle',
    title: 'Angle of twist',
    category: 'Machine Design',
    formula: 'theta = T * L / (J * G)',
    variables: ['theta = angle of twist', 'T = torque', 'L = shaft length', 'J = polar moment of inertia', 'G = shear modulus'],
      notes: 'Helpful when stiffness matters more than ultimate strength.',
    },
  {
    id: 'power-torque-speed',
    title: 'Power, torque, and speed',
    category: 'Machine Design',
    formula: 'P = T * omega',
    variables: ['P = power', 'T = torque', 'omega = angular speed'],
    notes: 'A common motor, gearbox, and rotating-equipment relationship.',
  },
  {
    id: 'shaft-power-rpm',
    title: 'Power, torque, and rpm',
    category: 'Machine Design',
    formula: 'P = 2 * pi * N * T / 60',
    variables: ['P = power', 'N = rotational speed in rpm', 'T = torque'],
    notes: 'Useful when catalogs or machine data are expressed in rpm rather than rad/s.',
  },
  {
    id: 'bearing-pressure',
    title: 'Bearing pressure',
    category: 'Machine Design',
    formula: 'p = F / A',
    variables: ['p = bearing pressure', 'F = load', 'A = projected area'],
    notes: 'Useful for pins, bushings, and quick contact-pressure estimates.',
  },
  {
    id: 'thread-tensile-stress-area',
    title: 'Bolt tensile stress',
    category: 'Machine Design',
    formula: 'sigma = F / At',
    variables: ['sigma = tensile stress', 'F = bolt preload or axial load', 'At = tensile stress area'],
    notes: 'A first-pass relation for threaded fastener loading.',
  },
  {
    id: 'bolt-preload',
    title: 'Bolt preload from torque',
    category: 'Machine Design',
    formula: 'T = K * F * d',
    variables: ['T = tightening torque', 'K = torque coefficient', 'F = preload', 'd = nominal diameter'],
    notes: 'A practical shop-floor estimate for preload discussions.',
  },
  {
    id: 'spring-rate-helical-compression',
    title: 'Helical compression spring rate',
    category: 'Machine Design',
    formula: 'k = G * d^4 / (8 * D^3 * n)',
    variables: ['k = spring rate', 'G = shear modulus', 'd = wire diameter', 'D = mean coil diameter', 'n = active coils'],
    notes: 'Useful for quick spring selection and what-if stiffness checks.',
  },
  {
    id: 'spring-deflection',
    title: 'Spring deflection',
    category: 'Machine Design',
    formula: 'delta = F / k',
    variables: ['delta = spring deflection', 'F = spring load', 'k = spring rate'],
    notes: 'Pairs naturally with spring-rate estimates during concept work.',
  },
  {
    id: 'belt-speed',
    title: 'Belt or pulley surface speed',
    category: 'Machine Design',
    formula: 'V = pi * D * N / 60',
    variables: ['V = surface speed', 'D = pulley diameter', 'N = rotational speed in rpm'],
    notes: 'Useful for drive sizing and quick motion checks.',
  },
  {
    id: 'gear-ratio',
    title: 'Gear ratio',
    category: 'Machine Design',
    formula: 'i = N_in / N_out = z_out / z_in',
    variables: ['i = gear ratio', 'N_in = input speed', 'N_out = output speed', 'z_in = input gear teeth', 'z_out = output gear teeth'],
    notes: 'A basic but constant relation in transmission layout work.',
  },
  {
    id: 'pitch-line-velocity',
    title: 'Gear pitch-line velocity',
    category: 'Machine Design',
    formula: 'V = pi * D * N / 60',
    variables: ['V = pitch-line velocity', 'D = pitch diameter', 'N = rotational speed in rpm'],
    notes: 'Useful for gear duty and lubrication conversations.',
  },
  {
    id: 'interference-pressure-simplified',
    title: 'Interference per diameter',
    category: 'Machine Design',
    formula: 'delta = Dhole - Dshaft',
    variables: ['delta = fit clearance or interference', 'Dhole = actual hole size', 'Dshaft = actual shaft size'],
    notes: 'The simplest direct relation behind fit-window reasoning.',
  },
  {
    id: 'mass-density-volume',
    title: 'Mass from density and volume',
    category: 'Machine Design',
    formula: 'm = rho * V',
    variables: ['m = mass', 'rho = density', 'V = volume'],
    notes: 'Common for estimating component mass before full CAD properties are available.',
  },
  {
    id: 'weight-from-mass',
    title: 'Weight from mass',
    category: 'Machine Design',
    formula: 'W = m * g',
    variables: ['W = weight force', 'm = mass', 'g = gravitational acceleration'],
    notes: 'Useful when switching between mass properties and static loading.',
  },
  {
    id: 'kinetic-energy',
    title: 'Linear kinetic energy',
    category: 'Dynamics',
    formula: 'KE = 0.5 * m * v^2',
    variables: ['KE = kinetic energy', 'm = mass', 'v = velocity'],
    notes: 'Helpful for impact, motion, and safety-envelope reasoning.',
  },
  {
    id: 'rotational-kinetic-energy',
    title: 'Rotational kinetic energy',
    category: 'Dynamics',
    formula: 'KE = 0.5 * I * omega^2',
    variables: ['KE = rotational kinetic energy', 'I = mass moment of inertia', 'omega = angular speed'],
    notes: 'Useful for flywheels, spindles, and deceleration checks.',
  },
  {
    id: 'newtons-second-law',
    title: 'Newton’s second law',
    category: 'Dynamics',
    formula: 'F = m * a',
    variables: ['F = net force', 'm = mass', 'a = acceleration'],
    notes: 'The backbone relation for actuator, acceleration, and inertia sizing.',
  },
  {
    id: 'angular-acceleration',
    title: 'Rotational dynamics',
    category: 'Dynamics',
    formula: 'T = I * alpha',
    variables: ['T = net torque', 'I = mass moment of inertia', 'alpha = angular acceleration'],
    notes: 'Useful for drive-train acceleration and motor sizing checks.',
  },
  {
    id: 'linear-momentum',
    title: 'Linear momentum',
    category: 'Dynamics',
    formula: 'p = m * v',
    variables: ['p = momentum', 'm = mass', 'v = velocity'],
    notes: 'Useful for collision and impulse-style estimates.',
  },
  {
    id: 'impulse',
    title: 'Impulse',
    category: 'Dynamics',
    formula: 'J = F * deltaT = delta(m * v)',
    variables: ['J = impulse', 'F = average force', 'deltaT = impact duration', 'delta(m * v) = momentum change'],
    notes: 'Useful when peak loads depend strongly on stopping time.',
  },
  {
    id: 'work',
    title: 'Mechanical work',
    category: 'Dynamics',
    formula: 'W = F * s',
    variables: ['W = work', 'F = force in direction of motion', 's = displacement'],
    notes: 'A constant relationship in energy-balance and actuator calculations.',
  },
  {
    id: 'potential-energy',
    title: 'Gravitational potential energy',
    category: 'Dynamics',
    formula: 'PE = m * g * h',
    variables: ['PE = potential energy', 'm = mass', 'g = gravity', 'h = elevation change'],
    notes: 'Useful for lifting, drop, and stored-energy discussions.',
  },
  {
    id: 'centripetal-force',
    title: 'Centripetal force',
    category: 'Dynamics',
    formula: 'F = m * v^2 / r',
    variables: ['F = centripetal force', 'm = mass', 'v = tangential velocity', 'r = radius'],
    notes: 'Helpful for rotating systems, curved paths, and balance reasoning.',
  },
  {
    id: 'natural-frequency-spring-mass',
    title: 'Natural frequency of spring-mass system',
    category: 'Dynamics',
    formula: 'fn = (1 / (2 * pi)) * sqrt(k / m)',
    variables: ['fn = natural frequency', 'k = stiffness', 'm = mass'],
    notes: 'Useful for vibration screening and resonance avoidance.',
  },
  {
    id: 'damping-ratio',
    title: 'Damping ratio',
    category: 'Dynamics',
    formula: 'zeta = c / cc',
    variables: ['zeta = damping ratio', 'c = actual damping coefficient', 'cc = critical damping coefficient'],
    notes: 'A useful vocabulary-level formula for quick vibration interpretation.',
  },
  {
    id: 'thermal-expansion',
    title: 'Linear thermal expansion',
    category: 'Heat Transfer',
    formula: 'deltaL = alpha * L * deltaT',
    variables: ['deltaL = length change', 'alpha = thermal expansion coefficient', 'L = original length', 'deltaT = temperature change'],
    notes: 'Great for fit-up, gap, and allowance conversations during layout review.',
  },
  {
    id: 'conduction-1d',
    title: '1D conduction heat rate',
    category: 'Heat Transfer',
    formula: 'Q = k * A * deltaT / L',
    variables: ['Q = heat transfer rate', 'k = thermal conductivity', 'A = area', 'deltaT = temperature difference', 'L = thickness'],
    notes: 'Useful for quick insulation and wall-stack comparisons.',
  },
  {
    id: 'convection',
    title: 'Convection heat rate',
    category: 'Heat Transfer',
    formula: 'Q = h * A * (Ts - Tinf)',
    variables: ['Q = heat transfer rate', 'h = convection coefficient', 'A = area', 'Ts = surface temperature', 'Tinf = bulk fluid temperature'],
      notes: 'A first-pass estimate for cooling surfaces and enclosure checks.',
    },
  {
    id: 'radiation',
    title: 'Radiation heat transfer',
    category: 'Heat Transfer',
    formula: 'Q = epsilon * sigma * A * (Ts^4 - Tsur^4)',
    variables: ['Q = heat transfer rate', 'epsilon = emissivity', 'sigma = Stefan-Boltzmann constant', 'A = area', 'Ts = surface temperature', 'Tsur = surroundings temperature'],
    notes: 'Useful when hot surfaces or furnaces make radiation non-negligible.',
  },
  {
    id: 'thermal-resistance-conduction',
    title: 'Conduction thermal resistance',
    category: 'Heat Transfer',
    formula: 'Rth = L / (k * A)',
    variables: ['Rth = thermal resistance', 'L = thickness', 'k = thermal conductivity', 'A = area'],
    notes: 'A convenient building block for thermal resistance networks.',
  },
  {
    id: 'thermal-resistance-convection',
    title: 'Convection thermal resistance',
    category: 'Heat Transfer',
    formula: 'Rth = 1 / (h * A)',
    variables: ['Rth = thermal resistance', 'h = convection coefficient', 'A = area'],
    notes: 'Useful for first-pass thermal network models.',
  },
  {
    id: 'log-mean-temperature-difference',
    title: 'Log mean temperature difference',
    category: 'Heat Transfer',
    formula: 'LMTD = (deltaT1 - deltaT2) / ln(deltaT1 / deltaT2)',
    variables: ['LMTD = log mean temperature difference', 'deltaT1 = end temperature difference 1', 'deltaT2 = end temperature difference 2'],
    notes: 'A core exchanger relation for rough thermal sizing.',
  },
  {
    id: 'heat-capacity-rate',
    title: 'Sensible heat rate',
    category: 'Heat Transfer',
    formula: 'Q = m_dot * cp * deltaT',
    variables: ['Q = heat transfer rate', 'm_dot = mass flow rate', 'cp = specific heat', 'deltaT = temperature rise or drop'],
    notes: 'A very common HVAC, cooling, and process estimate.',
  },
  {
    id: 'thermal-diffusivity',
    title: 'Thermal diffusivity',
    category: 'Heat Transfer',
    formula: 'alpha = k / (rho * cp)',
    variables: ['alpha = thermal diffusivity', 'k = thermal conductivity', 'rho = density', 'cp = specific heat'],
    notes: 'Useful when thinking about response time as well as conductivity.',
  },
  {
    id: 'biot-number',
    title: 'Biot number',
    category: 'Heat Transfer',
    formula: 'Bi = h * Lc / k',
    variables: ['Bi = Biot number', 'h = convection coefficient', 'Lc = characteristic length', 'k = thermal conductivity'],
    notes: 'Helpful for deciding whether lumped-capacitance assumptions are reasonable.',
  },
  {
    id: 'fourier-number',
    title: 'Fourier number',
    category: 'Heat Transfer',
    formula: 'Fo = alpha * t / L^2',
    variables: ['Fo = Fourier number', 'alpha = thermal diffusivity', 't = time', 'L = characteristic length'],
    notes: 'Useful in transient heat transfer reasoning.',
  },
  {
    id: 'reynolds-number',
    title: 'Reynolds number',
    category: 'Fluids',
    formula: 'Re = rho * V * D / mu',
    variables: ['Re = Reynolds number', 'rho = fluid density', 'V = velocity', 'D = hydraulic diameter', 'mu = dynamic viscosity'],
    notes: 'A recurring lookup for deciding laminar versus turbulent assumptions.',
  },
  {
    id: 'continuity',
    title: 'Continuity equation',
    category: 'Fluids',
    formula: 'Q = A * V',
    variables: ['Q = volumetric flow rate', 'A = flow area', 'V = average velocity'],
    notes: 'A basic but constant day-to-day relationship in line sizing work.',
  },
  {
    id: 'pressure-head',
    title: 'Pressure-head conversion',
    category: 'Fluids',
    formula: 'h = deltaP / (rho * g)',
    variables: ['h = head', 'deltaP = pressure difference', 'rho = fluid density', 'g = gravity'],
    notes: 'Useful alongside pressure-drop conversations and pump sanity checks.',
  },
  {
    id: 'bernoulli',
    title: 'Bernoulli equation',
    category: 'Fluids',
    formula: 'p/(rho*g) + V^2/(2*g) + z = constant',
    variables: ['p = pressure', 'rho = density', 'g = gravity', 'V = velocity', 'z = elevation'],
    notes: 'The backbone energy relation behind many fluid sanity checks.',
  },
  {
    id: 'mass-flow-rate',
    title: 'Mass flow rate',
    category: 'Fluids',
    formula: 'm_dot = rho * Q',
    variables: ['m_dot = mass flow rate', 'rho = density', 'Q = volumetric flow rate'],
    notes: 'Useful whenever thermal and hydraulic calculations need to connect.',
  },
  {
    id: 'dynamic-pressure',
    title: 'Dynamic pressure',
    category: 'Fluids',
    formula: 'q = 0.5 * rho * V^2',
    variables: ['q = dynamic pressure', 'rho = density', 'V = velocity'],
    notes: 'Useful in duct, nozzle, and flow-energy estimates.',
  },
  {
    id: 'darcy-weisbach',
    title: 'Darcy-Weisbach pressure loss',
    category: 'Fluids',
    formula: 'hf = f * (L / D) * V^2 / (2 * g)',
    variables: ['hf = friction head loss', 'f = Darcy friction factor', 'L = pipe length', 'D = pipe diameter', 'V = velocity', 'g = gravity'],
    notes: 'A core pipe-flow relation for quick closed-line loss estimates.',
  },
  {
    id: 'minor-loss',
    title: 'Minor loss',
    category: 'Fluids',
    formula: 'hm = K * V^2 / (2 * g)',
    variables: ['hm = minor head loss', 'K = fitting loss coefficient', 'V = velocity', 'g = gravity'],
    notes: 'Useful when valves, bends, and fittings matter more than straight run.',
  },
  {
    id: 'laminar-friction-factor',
    title: 'Laminar friction factor',
    category: 'Fluids',
    formula: 'f = 64 / Re',
    variables: ['f = Darcy friction factor', 'Re = Reynolds number'],
    notes: 'A very common lookup shortcut for laminar internal flow.',
  },
  {
    id: 'hydraulic-diameter',
    title: 'Hydraulic diameter',
    category: 'Fluids',
    formula: 'Dh = 4 * A / Pwet',
    variables: ['Dh = hydraulic diameter', 'A = flow area', 'Pwet = wetted perimeter'],
    notes: 'Useful when ducts or non-circular flow paths are involved.',
  },
  {
    id: 'pump-hydraulic-power',
    title: 'Hydraulic power',
    category: 'Fluids',
    formula: 'P = rho * g * Q * H',
    variables: ['P = hydraulic power', 'rho = density', 'g = gravity', 'Q = volumetric flow rate', 'H = total head'],
    notes: 'Useful for a first-pass pump or system power estimate.',
  },
  {
    id: 'pump-brake-power',
    title: 'Brake power from efficiency',
    category: 'Fluids',
    formula: 'Pbrake = Phydraulic / eta',
    variables: ['Pbrake = shaft or brake power', 'Phydraulic = hydraulic power', 'eta = pump efficiency'],
    notes: 'Helps connect hydraulic duty to motor demand.',
  },
  {
    id: 'specific-speed',
    title: 'Pump specific speed',
    category: 'Fluids',
    formula: 'Ns = N * sqrt(Q) / H^(3/4)',
    variables: ['Ns = specific speed', 'N = rotational speed', 'Q = flow rate', 'H = head'],
    notes: 'Useful as a rough pump-family classification parameter.',
  },
  {
    id: 'orifice-flow',
    title: 'Orifice flow rate',
    category: 'Fluids',
    formula: 'Q = Cd * A * sqrt(2 * deltaP / rho)',
    variables: ['Q = flow rate', 'Cd = discharge coefficient', 'A = opening area', 'deltaP = pressure difference', 'rho = density'],
    notes: 'Useful for restriction, leak, and nozzle estimates.',
  },
  {
    id: 'mach-number',
    title: 'Mach number',
    category: 'Fluids',
    formula: 'M = V / a',
    variables: ['M = Mach number', 'V = fluid velocity', 'a = local speed of sound'],
    notes: 'Useful when compressibility may start to matter.',
  },
];

export function findMechanicalFormulas(query: string, category: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return mechanicalFormulas.filter((formula) => {
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
