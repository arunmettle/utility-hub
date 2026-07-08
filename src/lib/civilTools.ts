function clampPositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

type CivilHandoverBucket = {
  title: string;
  keywords: string[];
};

const civilHandoverBuckets: CivilHandoverBucket[] = [
  {
    title: 'Safety and access',
    keywords: ['safety', 'access', 'permit', 'traffic', 'gate', 'fence', 'hazard', 'risk', 'loto', 'exclude'],
  },
  {
    title: 'Drawings and revisions',
    keywords: ['drawing', 'revision', 'plan', 'mark-up', 'markup', 'iss', 'issue', 'detail', 'schedule'],
  },
  {
    title: 'Quantities and levels',
    keywords: ['quantity', 'takeoff', 'earthwork', 'earthworks', 'level', 'chainage', 'invert', 'offset', 'grade'],
  },
  {
    title: 'Plant and materials',
    keywords: ['concrete', 'rebar', 'aggregate', 'pipe', 'culvert', 'barrier', 'formwork', 'fill', 'cut'],
  },
  {
    title: 'Actions and follow-up',
    keywords: ['action', 'follow up', 'follow-up', 'handover', 'rfi', 'rfa', 'resolve', 'next step', 'due'],
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
  return civilHandoverBuckets.find((bucket) => bucket.keywords.some((keyword) => lowered.includes(keyword))) ?? {
    title: 'General notes',
    keywords: [],
  };
}

export interface CivilHandoverSection {
  title: string;
  items: string[];
}

export interface CivilHandoverOutput {
  sections: CivilHandoverSection[];
  urgentItems: string[];
  dueTimes: string[];
  markdown: string;
}

export function buildCivilHandover(rawNotes: string): CivilHandoverOutput {
  const grouped = new Map<string, string[]>();
  const urgentItems: string[] = [];
  const dueTimes: string[] = [];

  for (const line of normalizeLines(rawNotes)) {
    const bucket = findBucket(line);
    const current = grouped.get(bucket.title) ?? [];
    current.push(line);
    grouped.set(bucket.title, current);

    if (/\b(urgent|critical|asap|immediate|hold|unsafe|stat)\b/i.test(line)) {
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
  const markdown = `# Civil handover\n\n${markdownSections}`.trim();

  return {
    sections,
    urgentItems,
    dueTimes,
    markdown,
  };
}

export interface EarthworksBalanceInput {
  cutVolumeM3: number;
  fillVolumeM3: number;
  swellPercent: number;
  shrinkPercent: number;
}

export interface EarthworksBalanceOutput {
  cutVolumeM3: number;
  fillVolumeM3: number;
  looseCutVolumeM3: number;
  compactedFillRequirementM3: number;
  netLooseBalanceM3: number;
  balanceType: 'Borrow' | 'Waste' | 'Balanced';
  report: string;
}

export function calculateEarthworksBalance(input: EarthworksBalanceInput): EarthworksBalanceOutput {
  const cutVolumeM3 = clampPositive(input.cutVolumeM3, 0);
  const fillVolumeM3 = clampPositive(input.fillVolumeM3, 0);
  const swell = Math.max(input.swellPercent, 0) / 100;
  const shrink = Math.min(Math.max(input.shrinkPercent, 0), 95) / 100;
  const looseCutVolumeM3 = cutVolumeM3 * (1 + swell);
  const shrinkDenominator = Math.max(1 - shrink, 0.05);
  const compactedFillRequirementM3 = fillVolumeM3 / shrinkDenominator;
  const netLooseBalanceM3 = looseCutVolumeM3 - compactedFillRequirementM3;
  let balanceType: EarthworksBalanceOutput['balanceType'] = 'Balanced';
  if (netLooseBalanceM3 > 0.001) {
    balanceType = 'Waste';
  } else if (netLooseBalanceM3 < -0.001) {
    balanceType = 'Borrow';
  }

  const report = [
    'Earthworks Balance Summary',
    `Cut volume: ${cutVolumeM3.toFixed(2)} m3`,
    `Fill volume: ${fillVolumeM3.toFixed(2)} m3`,
    `Loose cut: ${looseCutVolumeM3.toFixed(2)} m3`,
    `Compacted fill need: ${compactedFillRequirementM3.toFixed(2)} m3`,
    `Net loose balance: ${netLooseBalanceM3.toFixed(2)} m3`,
    `Balance type: ${balanceType}`,
  ].join('\n');

  return {
    cutVolumeM3,
    fillVolumeM3,
    looseCutVolumeM3,
    compactedFillRequirementM3,
    netLooseBalanceM3,
    balanceType,
    report,
  };
}

export interface InvertSlopeInput {
  upstreamInvertMm: number;
  downstreamInvertMm: number;
  lengthMeters: number;
}

export interface InvertSlopeOutput {
  fallMm: number;
  slopePercent: number;
  slope1InN: number | null;
  midpointInvertMm: number;
  report: string;
}

export function calculateInvertSlope(input: InvertSlopeInput): InvertSlopeOutput {
  const upstreamInvertMm = clampPositive(input.upstreamInvertMm, 0);
  const downstreamInvertMm = clampPositive(input.downstreamInvertMm, 0);
  const lengthMeters = clampPositive(input.lengthMeters, 1);
  const fallMm = upstreamInvertMm - downstreamInvertMm;
  const slopePercent = (fallMm / (lengthMeters * 1000)) * 100;
  const slope1InN = fallMm !== 0 ? Math.abs((lengthMeters * 1000) / fallMm) : null;
  const midpointInvertMm = (upstreamInvertMm + downstreamInvertMm) / 2;
  const report = [
    'Invert and Slope Summary',
    `Upstream invert: ${upstreamInvertMm.toFixed(1)} mm`,
    `Downstream invert: ${downstreamInvertMm.toFixed(1)} mm`,
    `Fall: ${fallMm.toFixed(1)} mm`,
    `Slope: ${slopePercent.toFixed(3)}%`,
    `Approx 1 in N: ${slope1InN ? slope1InN.toFixed(1) : 'flat'}`,
  ].join('\n');

  return {
    fallMm,
    slopePercent,
    slope1InN,
    midpointInvertMm,
    report,
  };
}
