import { analyzeToleranceStack, buildRevisionDiff } from './industryTools';

export interface AuditStat {
  label: string;
  value: string;
}

export interface AuditFinding {
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

export interface AuditSection {
  title: string;
  lines: string[];
}

export interface AuditResult {
  stats: AuditStat[];
  findings: AuditFinding[];
  sections?: AuditSection[];
  report: string;
}

interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function parseLooseCsv(source: string): ParsedCsv | null {
  const rows = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(',')
        .map((cell) => cell.trim().replace(/^"(.*)"$/, '$1')),
    );

  if (rows.length < 2) {
    return null;
  }

  return {
    headers: rows[0],
    rows: rows.slice(1),
  };
}

function toRecordList(parsed: ParsedCsv) {
  const normalizedHeaders = parsed.headers.map(normalizeHeader);
  return parsed.rows.map((row) =>
    normalizedHeaders.reduce<Record<string, string>>((record, header, index) => {
      record[header] = row[index] ?? '';
      return record;
    }, {}),
  );
}

function formatFindingLine(finding: AuditFinding) {
  return `[${finding.severity.toUpperCase()}] ${finding.title}: ${finding.detail}`;
}

function buildAuditReport(title: string, stats: AuditStat[], findings: AuditFinding[], sections?: AuditSection[]) {
  return [
    title,
    ...stats.map((stat) => `${stat.label}: ${stat.value}`),
    '',
    'Findings',
    ...(findings.length > 0 ? findings.map(formatFindingLine) : ['No findings detected.']),
    ...(sections
      ? sections.flatMap((section) => ['', section.title, ...section.lines.map((line) => `- ${line}`)])
      : []),
  ].join('\n');
}

function compareKeyedRecords(
  left: Record<string, string>[],
  right: Record<string, string>[],
  keyField: string,
  compareFields: Array<{ field: string; label: string }>,
  title: string,
) {
  const leftMap = new Map(left.map((row) => [row[keyField], row]));
  const rightMap = new Map(right.map((row) => [row[keyField], row]));
  const keys = new Set([...leftMap.keys(), ...rightMap.keys()].filter(Boolean));
  const findings: AuditFinding[] = [];
  let changedCount = 0;

  for (const key of keys) {
    const leftRow = leftMap.get(key);
    const rightRow = rightMap.get(key);

    if (!leftRow && rightRow) {
      findings.push({
        severity: 'medium',
        title: `${key} added`,
        detail: `${title} exists only in the newer source.`,
      });
      continue;
    }

    if (leftRow && !rightRow) {
      findings.push({
        severity: 'high',
        title: `${key} removed`,
        detail: `${title} exists only in the older source.`,
      });
      continue;
    }

    if (!leftRow || !rightRow) {
      continue;
    }

    for (const item of compareFields) {
      if ((leftRow[item.field] ?? '') !== (rightRow[item.field] ?? '')) {
        changedCount += 1;
        findings.push({
          severity: 'medium',
          title: `${key} ${item.label} changed`,
          detail: `${leftRow[item.field] || '(blank)'} -> ${rightRow[item.field] || '(blank)'}`,
        });
      }
    }
  }

  return {
    findings,
    changedCount,
    totalKeys: keys.size,
    addedCount: findings.filter((finding) => finding.title.endsWith('added')).length,
    removedCount: findings.filter((finding) => finding.title.endsWith('removed')).length,
  };
}

function keywordFlag(lines: string[], severity: AuditFinding['severity'], title: string, detailBuilder: (line: string) => string) {
  return lines.map((line) => ({
    severity,
    title,
    detail: detailBuilder(line),
  }));
}

function tokenize(line: string) {
  return line
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4);
}

function sharesTokens(left: string, right: string) {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = tokenize(right);
  let matches = 0;
  for (const token of rightTokens) {
    if (leftTokens.has(token)) {
      matches += 1;
    }
  }
  return matches >= 2;
}

export function analyzeApiContractDrift(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two CSV tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new contract tables with a header row.' }],
      report: 'API Contract Drift Checker\nStatus: Need two CSV tables',
    };
  }

  const left = toRecordList(leftParsed).map((row) => ({ ...row, routekey: `${row.method} ${row.path} ${row.status}`.trim() }));
  const right = toRecordList(rightParsed).map((row) => ({ ...row, routekey: `${row.method} ${row.path} ${row.status}`.trim() }));
  const comparison = compareKeyedRecords(left, right, 'routekey', [
    { field: 'requestschema', label: 'request schema' },
    { field: 'responseschema', label: 'response schema' },
    { field: 'auth', label: 'auth' },
  ], 'Route');

  const stats = [
    { label: 'Routes reviewed', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Added routes', value: String(comparison.addedCount) },
    { label: 'Removed routes', value: String(comparison.removedCount) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('API Contract Drift Checker', stats, comparison.findings),
  };
}

export function analyzeCsvSchemaDrift(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two CSV tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new CSV files with headers.' }],
      report: 'CSV Schema Drift Checker\nStatus: Need two CSV tables',
    };
  }

  const leftHeaders = leftParsed.headers.map((header) => header.trim());
  const rightHeaders = rightParsed.headers.map((header) => header.trim());
  const leftSet = new Set(leftHeaders.map(normalizeHeader));
  const rightSet = new Set(rightHeaders.map(normalizeHeader));
  const findings: AuditFinding[] = [];

  for (const header of rightHeaders) {
    if (!leftSet.has(normalizeHeader(header))) {
      findings.push({ severity: 'medium', title: 'Added column', detail: header });
    }
  }

  for (const header of leftHeaders) {
    if (!rightSet.has(normalizeHeader(header))) {
      findings.push({ severity: 'high', title: 'Removed column', detail: header });
    }
  }

  const oldWidthIssues = leftParsed.rows.filter((row) => row.length !== leftHeaders.length).length;
  const newWidthIssues = rightParsed.rows.filter((row) => row.length !== rightHeaders.length).length;

  if (oldWidthIssues > 0 || newWidthIssues > 0) {
    findings.push({
      severity: 'medium',
      title: 'Row width drift detected',
      detail: `Old rows with width issues: ${oldWidthIssues}. New rows with width issues: ${newWidthIssues}.`,
    });
  }

  const stats = [
    { label: 'Old columns', value: String(leftHeaders.length) },
    { label: 'New columns', value: String(rightHeaders.length) },
    { label: 'Added columns', value: String(findings.filter((finding) => finding.title === 'Added column').length) },
    { label: 'Removed columns', value: String(findings.filter((finding) => finding.title === 'Removed column').length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('CSV Schema Drift Checker', stats, findings),
  };
}

export function analyzeEnvSchemaDrift(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two env schema tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new env spec tables.' }],
      report: 'ENV Schema Drift Checker\nStatus: Need two env schema tables',
    };
  }

  const comparison = compareKeyedRecords(
    toRecordList(leftParsed),
    toRecordList(rightParsed),
    'key',
    [
      { field: 'required', label: 'required flag' },
      { field: 'scope', label: 'scope' },
      { field: 'defaultvalue', label: 'default value' },
    ],
    'Variable',
  );

  const stats = [
    { label: 'Variables reviewed', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Added vars', value: String(comparison.addedCount) },
    { label: 'Removed vars', value: String(comparison.removedCount) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('ENV Schema Drift Checker', stats, comparison.findings),
  };
}

export function analyzeToleranceChangeImpact(leftSource: string, rightSource: string): AuditResult {
  const oldResult = analyzeToleranceStack(leftSource);
  const newResult = analyzeToleranceStack(rightSource);

  if (!oldResult.output || !newResult.output) {
    return {
      stats: [{ label: 'Status', value: 'Need two valid stack tables' }],
      findings: [{ severity: 'high', title: 'Stack input issue', detail: oldResult.error || newResult.error || 'Provide valid old and new stack tables.' }],
      report: 'Tolerance Change Impact Checker\nStatus: Need two valid stack tables',
    };
  }

  const oldRows = new Map(oldResult.output.rows.map((row) => [row.label, row]));
  const newRows = new Map(newResult.output.rows.map((row) => [row.label, row]));
  const findings: AuditFinding[] = [];

  for (const [label, newRow] of newRows.entries()) {
    const oldRow = oldRows.get(label);
    if (!oldRow) {
      findings.push({ severity: 'medium', title: `${label} added`, detail: 'New stack contributor added in the current revision.' });
      continue;
    }

    const nominalDelta = newRow.nominal - oldRow.nominal;
    const rangeDelta = (newRow.contributionMax - newRow.contributionMin) - (oldRow.contributionMax - oldRow.contributionMin);
    if (Math.abs(nominalDelta) > 0.0001) {
      findings.push({
        severity: Math.abs(nominalDelta) >= 0.1 ? 'high' : 'medium',
        title: `${label} nominal shifted`,
        detail: `${oldRow.nominal.toFixed(3)} -> ${newRow.nominal.toFixed(3)}`,
      });
    }
    if (Math.abs(rangeDelta) > 0.0001) {
      findings.push({
        severity: Math.abs(rangeDelta) >= 0.1 ? 'high' : 'medium',
        title: `${label} tolerance window changed`,
        detail: `${(oldRow.contributionMax - oldRow.contributionMin).toFixed(3)} -> ${(newRow.contributionMax - newRow.contributionMin).toFixed(3)}`,
      });
    }
  }

  for (const label of oldRows.keys()) {
    if (!newRows.has(label)) {
      findings.push({ severity: 'high', title: `${label} removed`, detail: 'Existing stack contributor no longer appears in the new revision.' });
    }
  }

  const rangeDelta = newResult.output.totalRange - oldResult.output.totalRange;
  const stats = [
    { label: 'Old range', value: oldResult.output.totalRange.toFixed(3) },
    { label: 'New range', value: newResult.output.totalRange.toFixed(3) },
    { label: 'Range delta', value: rangeDelta.toFixed(3) },
    { label: 'Changed contributors', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Tolerance Change Impact Checker', stats, findings),
  };
}

export function analyzeDrawingInspectionReconciliation(leftSource: string, rightSource: string): AuditResult {
  const drawingParsed = parseLooseCsv(leftSource);
  const inspectionParsed = parseLooseCsv(rightSource);

  if (!drawingParsed || !inspectionParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need drawing and inspection tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide a drawing characteristic table and an inspection plan table.' }],
      report: 'Drawing Inspection Reconciler\nStatus: Need drawing and inspection tables',
    };
  }

  const drawing = toRecordList(drawingParsed);
  const inspection = new Map(toRecordList(inspectionParsed).map((row) => [row.id, row]));
  const findings: AuditFinding[] = [];

  for (const row of drawing) {
    if (!row.id) {
      continue;
    }

    const plan = inspection.get(row.id);
    if (!plan) {
      findings.push({ severity: 'high', title: `${row.id} missing from inspection plan`, detail: row.dimension || 'Characteristic is not covered.' });
      continue;
    }

    if (!plan.lower || !plan.upper) {
      findings.push({ severity: 'medium', title: `${row.id} has incomplete limits`, detail: 'Inspection row is missing lower or upper limits.' });
    }

    if (row.unit && plan.unit && row.unit !== plan.unit) {
      findings.push({ severity: 'medium', title: `${row.id} unit mismatch`, detail: `${row.unit} on drawing vs ${plan.unit} in inspection.` });
    }

    if ((row.criticality || '').toLowerCase().includes('critical') && !plan.samplesize) {
      findings.push({ severity: 'high', title: `${row.id} missing sample size`, detail: 'Critical characteristic has no sample-size entry.' });
    }
  }

  for (const [id] of inspection.entries()) {
    if (!drawing.some((row) => row.id === id)) {
      findings.push({ severity: 'low', title: `${id} orphan inspection row`, detail: 'Inspection plan includes a characteristic not found in the drawing list.' });
    }
  }

  const stats = [
    { label: 'Drawing chars', value: String(drawing.length) },
    { label: 'Inspection rows', value: String(inspection.size) },
    { label: 'Coverage gaps', value: String(findings.filter((finding) => finding.title.includes('missing from inspection')).length) },
    { label: 'Other findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Drawing Inspection Reconciler', stats, findings),
  };
}

export function calculateFastenerClampLoad(inputs: {
  nominalDiameterMm: number;
  pitchMm: number;
  proofStrengthMpa: number;
  preloadFactor: number;
  nutFactor: number;
  separationLoadN: number;
}) {
  const area = (Math.PI / 4) * (inputs.nominalDiameterMm - 0.9382 * inputs.pitchMm) ** 2;
  const proofLoadN = area * inputs.proofStrengthMpa;
  const targetPreloadN = proofLoadN * inputs.preloadFactor;
  const targetTorqueNm = inputs.nutFactor * (inputs.nominalDiameterMm / 1000) * targetPreloadN;
  const separationMargin = targetPreloadN - inputs.separationLoadN;
  const marginRatio = inputs.separationLoadN > 0 ? targetPreloadN / inputs.separationLoadN : 0;
  const findings: AuditFinding[] = [];

  if (marginRatio < 1.2) {
    findings.push({ severity: 'high', title: 'Low separation margin', detail: 'Target preload is too close to the working separation load.' });
  } else if (marginRatio < 1.5) {
    findings.push({ severity: 'medium', title: 'Tight separation margin', detail: 'Clamp reserve exists but is slimmer than a comfortable review target.' });
  }

  if (inputs.preloadFactor > 0.8) {
    findings.push({ severity: 'medium', title: 'Aggressive preload factor', detail: 'Preload factor is above the common quick-check range for a first-pass review.' });
  }

  const stats = [
    { label: 'Tensile area', value: `${area.toFixed(1)} mm2` },
    { label: 'Proof load', value: `${proofLoadN.toFixed(0)} N` },
    { label: 'Target preload', value: `${targetPreloadN.toFixed(0)} N` },
    { label: 'Target torque', value: `${targetTorqueNm.toFixed(1)} N.m` },
  ];

  const sections = [
    {
      title: 'Clamp summary',
      lines: [
        `Preload / separation ratio: ${marginRatio.toFixed(2)}`,
        `Separation margin: ${separationMargin.toFixed(0)} N`,
      ],
    },
  ];

  return {
    stats,
    findings,
    sections,
    report: buildAuditReport('Fastener Clamp Load Checker', stats, findings, sections),
  };
}

export function analyzeDrainageScheduleQa(source: string): AuditResult {
  const parsed = parseLooseCsv(source);

  if (!parsed) {
    return {
      stats: [{ label: 'Status', value: 'Need a drainage schedule CSV' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide a drainage schedule with chainages and inverts.' }],
      report: 'Drainage Schedule QA Checker\nStatus: Need a drainage schedule CSV',
    };
  }

  const findings: AuditFinding[] = [];
  const rows = toRecordList(parsed);
  let totalSlope = 0;

  for (const row of rows) {
    const start = Number(row.startchainage);
    const end = Number(row.endchainage);
    const startInvert = Number(row.startinvert);
    const endInvert = Number(row.endinvert);
    const minSlope = Number(row.minslopepercent || 0);
    const length = end - start;
    const fall = startInvert - endInvert;
    const slopePercent = length > 0 ? (fall / length) * 100 : 0;
    totalSlope += slopePercent;

    if (!(length > 0)) {
      findings.push({ severity: 'high', title: `${row.lineid || 'Run'} invalid length`, detail: 'End chainage must be greater than start chainage.' });
      continue;
    }

    if (fall <= 0) {
      findings.push({ severity: 'high', title: `${row.lineid || 'Run'} uphill or flat`, detail: 'End invert is not lower than the start invert.' });
    }

    if (minSlope > 0 && slopePercent < minSlope) {
      findings.push({
        severity: 'medium',
        title: `${row.lineid || 'Run'} below minimum slope`,
        detail: `${slopePercent.toFixed(2)}% vs minimum ${minSlope.toFixed(2)}%`,
      });
    }

    if (Number(row.diametermm) <= 0) {
      findings.push({ severity: 'high', title: `${row.lineid || 'Run'} invalid diameter`, detail: 'Diameter must be positive.' });
    }
  }

  const stats = [
    { label: 'Runs reviewed', value: String(rows.length) },
    { label: 'Flagged runs', value: String(new Set(findings.map((finding) => finding.title.split(' ')[0])).size) },
    { label: 'Average slope', value: `${(rows.length > 0 ? totalSlope / rows.length : 0).toFixed(2)}%` },
    { label: 'Findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Drainage Schedule QA Checker', stats, findings),
  };
}

export function analyzeBoqSpecCrossCheck(leftSource: string, rightSource: string): AuditResult {
  const boqParsed = parseLooseCsv(leftSource);
  const specParsed = parseLooseCsv(rightSource);

  if (!boqParsed || !specParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need BOQ and spec tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide both the BOQ table and the spec register table.' }],
      report: 'BOQ Spec Cross Checker\nStatus: Need BOQ and spec tables',
    };
  }

  const boqRows = toRecordList(boqParsed);
  const specRows = new Map(toRecordList(specParsed).map((row) => [row.specref, row]));
  const findings: AuditFinding[] = [];

  for (const row of boqRows) {
    const ref = row.specref;
    if (!ref) {
      findings.push({ severity: 'high', title: `${row.item || 'BOQ row'} missing spec ref`, detail: 'Spec reference is blank.' });
      continue;
    }

    const spec = specRows.get(ref);
    if (!spec) {
      findings.push({ severity: 'high', title: `${row.item || ref} missing from spec register`, detail: `Spec ref ${ref} is not found.` });
      continue;
    }

    if (row.unit && spec.unit && row.unit !== spec.unit) {
      findings.push({ severity: 'medium', title: `${row.item || ref} unit mismatch`, detail: `${row.unit} in BOQ vs ${spec.unit} in spec register.` });
    }
  }

  const stats = [
    { label: 'BOQ rows', value: String(boqRows.length) },
    { label: 'Spec refs', value: String(specRows.size) },
    { label: 'Missing refs', value: String(findings.filter((finding) => finding.title.includes('missing')).length) },
    { label: 'Findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('BOQ Spec Cross Checker', stats, findings),
  };
}

export function analyzeTenderAddendumImpact(leftSource: string, rightSource: string): AuditResult {
  const diff = buildRevisionDiff(leftSource, rightSource);
  const findings: AuditFinding[] = [];

  findings.push(
    ...keywordFlag(
      diff.numberChanges,
      'high',
      'Numeric or date change',
      (line) => line,
    ),
  );

  const scopeLines = diff.rows
    .filter((row) => row.kind === 'changed' || row.kind === 'added' || row.kind === 'removed')
    .map((row) => `${row.leftValue} ${row.rightValue}`.trim())
    .filter((line) => /\b(scope|exclude|include|cost|allowance|days|week|programme|traffic)\b/i.test(line));

  findings.push(
    ...keywordFlag(scopeLines, 'medium', 'Scope-sensitive wording changed', (line) => line),
  );

  const stats = [
    { label: 'Changed lines', value: String(diff.summary.changed) },
    { label: 'Added lines', value: String(diff.summary.added) },
    { label: 'Removed lines', value: String(diff.summary.removed) },
    { label: 'Risk flags', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Tender Addendum Impact Checker', stats, findings),
  };
}

export function analyzeCableScheduleQa(source: string): AuditResult {
  const parsed = parseLooseCsv(source);

  if (!parsed) {
    return {
      stats: [{ label: 'Status', value: 'Need a cable schedule CSV' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide a cable schedule with one cable per row.' }],
      report: 'Cable Schedule QA Checker\nStatus: Need a cable schedule CSV',
    };
  }

  const rows = toRecordList(parsed);
  const seenTags = new Set<string>();
  const findings: AuditFinding[] = [];

  for (const row of rows) {
    const tag = row.tag || 'Untitled';
    if (seenTags.has(tag)) {
      findings.push({ severity: 'high', title: `${tag} duplicate tag`, detail: 'Cable tag appears more than once.' });
    }
    seenTags.add(tag);

    if (!row.from || !row.to) {
      findings.push({ severity: 'high', title: `${tag} missing endpoint`, detail: 'Cable schedule row is missing from/to equipment.' });
    }

    if (Number(row.lengthm) <= 0) {
      findings.push({ severity: 'medium', title: `${tag} invalid length`, detail: 'Length must be greater than zero.' });
    }

    if (Number(row.sizemm2) <= 0 || Number(row.cores) <= 0) {
      findings.push({ severity: 'high', title: `${tag} invalid conductor data`, detail: 'Core count and size must be positive.' });
    }
  }

  const stats = [
    { label: 'Cables reviewed', value: String(rows.length) },
    { label: 'Duplicate tags', value: String(findings.filter((finding) => finding.title.includes('duplicate')).length) },
    { label: 'Endpoint gaps', value: String(findings.filter((finding) => finding.title.includes('endpoint')).length) },
    { label: 'Findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Cable Schedule QA Checker', stats, findings),
  };
}

export function analyzePanelRevisionQa(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two panel schedules' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new panel schedule tables.' }],
      report: 'Panel Revision QA Checker\nStatus: Need two panel schedules',
    };
  }

  const left = toRecordList(leftParsed);
  const right = toRecordList(rightParsed);
  const comparison = compareKeyedRecords(left, right, 'circuit', [
    { field: 'description', label: 'description' },
    { field: 'breakeramps', label: 'breaker' },
    { field: 'phase', label: 'phase' },
    { field: 'loadwatts', label: 'load' },
  ], 'Circuit');

  const oldTotalLoad = left.reduce((sum, row) => sum + Number(row.loadwatts || 0), 0);
  const newTotalLoad = right.reduce((sum, row) => sum + Number(row.loadwatts || 0), 0);
  const stats = [
    { label: 'Circuits reviewed', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Load delta', value: `${((newTotalLoad - oldTotalLoad) / 1000).toFixed(2)} kW` },
    { label: 'Findings', value: String(comparison.findings.length) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('Panel Revision QA Checker', stats, comparison.findings),
  };
}

export function analyzeLoadListReconciliation(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need load list and single-line tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide both the load list and the compared schedule.' }],
      report: 'Load List Reconciler\nStatus: Need load list and single-line tables',
    };
  }

  const comparison = compareKeyedRecords(
    toRecordList(leftParsed),
    toRecordList(rightParsed),
    'tag',
    [
      { field: 'kw', label: 'load' },
      { field: 'phase', label: 'phase' },
      { field: 'panel', label: 'panel' },
    ],
    'Load',
  );

  const stats = [
    { label: 'Load tags', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Missing tags', value: String(comparison.addedCount + comparison.removedCount) },
    { label: 'Findings', value: String(comparison.findings.length) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('Load List Reconciler', stats, comparison.findings),
  };
}

export function analyzeClinicalHandoverCompleteness(source: string): AuditResult {
  const text = source.trim();
  const findings: AuditFinding[] = [];
  const requiredChecks = [
    { label: 'Patient / identifier', pattern: /\b(patient|mrn|urn|bed|room)\b/i },
    { label: 'Current issue', pattern: /\b(issue|problem|reason|diagnosis)\b/i },
    { label: 'Action / plan', pattern: /\b(plan|action|follow up|review)\b/i },
    { label: 'Owner', pattern: /\b(owner|dr|doctor|nurse|team|consultant)\b/i },
    { label: 'Review time', pattern: /\b\d{1,2}:\d{2}\b|\b\d{1,2}(?:am|pm)\b/i },
  ];

  for (const check of requiredChecks) {
    if (!check.pattern.test(text)) {
      findings.push({ severity: 'high', title: `${check.label} missing`, detail: 'The handover does not clearly contain this element.' });
    }
  }

  const actionLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /\b(follow up|review|call|monitor|repeat|chase)\b/i.test(line));

  for (const line of actionLines) {
    if (!/\b(dr|doctor|nurse|team|consultant|owner)\b/i.test(line) || !/\b\d{1,2}:\d{2}\b|\b\d{1,2}(?:am|pm)\b/i.test(line)) {
      findings.push({ severity: 'medium', title: 'Action line is not fully owned', detail: line });
    }
  }

  const stats = [
    { label: 'Required checks', value: String(requiredChecks.length) },
    { label: 'Missing items', value: String(findings.filter((finding) => finding.title.endsWith('missing')).length) },
    { label: 'Loose action lines', value: String(findings.filter((finding) => finding.title === 'Action line is not fully owned').length) },
    { label: 'Input chars', value: String(text.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Clinical Handover Completeness Linter', stats, findings),
  };
}

export function analyzeDischargeInstructionDelta(leftSource: string, rightSource: string): AuditResult {
  const diff = buildRevisionDiff(leftSource, rightSource);
  const candidateLines = diff.rows
    .filter((row) => row.kind === 'changed' || row.kind === 'added' || row.kind === 'removed')
    .map((row) => `${row.leftValue} ${row.rightValue}`.trim());

  const findings = [
    ...keywordFlag(candidateLines.filter((line) => /\b(mg|tablet|capsule|once daily|twice daily|dose|medication)\b/i.test(line)), 'high', 'Medication wording changed', (line) => line),
    ...keywordFlag(candidateLines.filter((line) => /\b(review|follow-up|clinic|gp|appointment|days|weeks)\b/i.test(line)), 'medium', 'Follow-up wording changed', (line) => line),
    ...keywordFlag(candidateLines.filter((line) => /\b(return|seek help|warning|fever|pain|bleeding|shortness of breath)\b/i.test(line)), 'medium', 'Safety advice wording changed', (line) => line),
  ];

  const stats = [
    { label: 'Changed lines', value: String(diff.summary.changed) },
    { label: 'Added lines', value: String(diff.summary.added) },
    { label: 'Removed lines', value: String(diff.summary.removed) },
    { label: 'Priority flags', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Discharge Instruction Delta Audit', stats, findings),
  };
}

export function buildReferralPacketChecklist(source: string): AuditResult {
  const text = source.trim();
  const checklist = [
    { label: 'Reason for referral', pattern: /\b(reason|referral for|referred for)\b/i },
    { label: 'Relevant history or diagnosis', pattern: /\b(history|diagnosis|background)\b/i },
    { label: 'Medication list', pattern: /\b(medication|meds)\b/i },
    { label: 'Allergy status', pattern: /\b(allergy|allergies|nka)\b/i },
    { label: 'Recent results or imaging', pattern: /\b(result|results|imaging|scan|pathology)\b/i },
    { label: 'Contact / callback detail', pattern: /\b(phone|contact|callback|team)\b/i },
  ];

  const findings = checklist.flatMap((item) =>
    item.pattern.test(text)
      ? []
      : [{ severity: 'medium' as const, title: `${item.label} missing`, detail: 'Referral draft does not clearly mention this packet element.' }],
  );

  const sections = [
    {
      title: 'Checklist',
      lines: checklist.map((item) => `${item.pattern.test(text) ? '[x]' : '[ ]'} ${item.label}`),
    },
  ];

  const stats = [
    { label: 'Checklist items', value: String(checklist.length) },
    { label: 'Present', value: String(checklist.length - findings.length) },
    { label: 'Missing', value: String(findings.length) },
    { label: 'Input chars', value: String(text.length) },
  ];

  return {
    stats,
    findings,
    sections,
    report: buildAuditReport('Referral Packet Checklist Builder', stats, findings, sections),
  };
}

export function analyzeDewateringShiftLog(source: string): AuditResult {
  const parsed = parseLooseCsv(source);

  if (!parsed) {
    return {
      stats: [{ label: 'Status', value: 'Need a dewatering shift log CSV' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide runtime, flow, and level data for each pump run.' }],
      report: 'Dewatering Shift Log Reconciler\nStatus: Need a dewatering shift log CSV',
    };
  }

  const rows = toRecordList(parsed);
  const findings: AuditFinding[] = [];
  let totalExpected = 0;
  let totalObserved = 0;

  for (const row of rows) {
    const runtime = Number(row.runtimehr);
    const flow = Number(row.flowls);
    const area = Number(row.pondaream2);
    const start = Number(row.startlevelm);
    const end = Number(row.endlevelm);
    const expectedVolume = runtime * flow * 3.6;
    const observedVolume = (start - end) * area;
    const variance = expectedVolume - observedVolume;
    totalExpected += expectedVolume;
    totalObserved += observedVolume;

    if (runtime <= 0 || flow <= 0 || area <= 0) {
      findings.push({ severity: 'high', title: `${row.pumpid || 'Pump'} invalid runtime or geometry`, detail: 'Runtime, flow, and pond area must all be positive.' });
      continue;
    }

    if (Math.abs(variance) > Math.max(20, expectedVolume * 0.25)) {
      findings.push({
        severity: 'high',
        title: `${row.pumpid || 'Pump'} water balance mismatch`,
        detail: `Expected ${expectedVolume.toFixed(1)} m3 vs observed ${observedVolume.toFixed(1)} m3.`,
      });
    }
  }

  const stats = [
    { label: 'Runs reviewed', value: String(rows.length) },
    { label: 'Expected volume', value: `${totalExpected.toFixed(1)} m3` },
    { label: 'Observed volume', value: `${totalObserved.toFixed(1)} m3` },
    { label: 'Findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Dewatering Shift Log Reconciler', stats, findings),
  };
}

export function analyzeIsolationMatrixChange(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two isolation matrices' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new isolation tables.' }],
      report: 'Isolation Matrix Change Checker\nStatus: Need two isolation matrices',
    };
  }

  const comparison = compareKeyedRecords(
    toRecordList(leftParsed),
    toRecordList(rightParsed),
    'isolationid',
    [
      { field: 'energytype', label: 'energy type' },
      { field: 'lockpoint', label: 'lock point' },
      { field: 'verifystep', label: 'verify step' },
      { field: 'owner', label: 'owner' },
    ],
    'Isolation',
  );

  const stats = [
    { label: 'Isolation points', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Added / removed', value: String(comparison.addedCount + comparison.removedCount) },
    { label: 'Findings', value: String(comparison.findings.length) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('Isolation Matrix Change Checker', stats, comparison.findings),
  };
}

export function analyzeProductionShiftReconciliation(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need haul and plant tally tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide both haul tally and plant tally CSVs.' }],
      report: 'Production Shift Reconciliation Checker\nStatus: Need haul and plant tally tables',
    };
  }

  const comparison = compareKeyedRecords(
    toRecordList(leftParsed),
    toRecordList(rightParsed),
    'source',
    [{ field: 'tonnes', label: 'tonnes' }],
    'Source',
  );

  const oldTotal = toRecordList(leftParsed).reduce((sum, row) => sum + Number(row.tonnes || 0), 0);
  const newTotal = toRecordList(rightParsed).reduce((sum, row) => sum + Number(row.tonnes || 0), 0);
  const delta = newTotal - oldTotal;
  const stats = [
    { label: 'Sources reviewed', value: String(comparison.totalKeys) },
    { label: 'Total variance', value: `${delta.toFixed(1)} t` },
    { label: 'Changed rows', value: String(comparison.changedCount) },
    { label: 'Findings', value: String(comparison.findings.length) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('Production Shift Reconciliation Checker', stats, comparison.findings),
  };
}

export function analyzeShiftCommitmentReconciliation(leftSource: string, rightSource: string): AuditResult {
  const priorLines = leftSource.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const currentLines = rightSource.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const findings: AuditFinding[] = [];

  for (const line of priorLines) {
    if (!currentLines.some((candidate) => sharesTokens(line, candidate))) {
      findings.push({ severity: 'high', title: 'Commitment may have been dropped', detail: line });
    }
  }

  const unownedCurrentLines = currentLines.filter(
    (line) => /\b(action|follow up|confirm|close|verify|review)\b/i.test(line) && !/\b(owner|team|shift|ops|maint|supervisor)\b/i.test(line),
  );
  findings.push(...keywordFlag(unownedCurrentLines, 'medium', 'Current action lacks owner', (line) => line));

  const stats = [
    { label: 'Prior commitments', value: String(priorLines.length) },
    { label: 'Current lines', value: String(currentLines.length) },
    { label: 'Dropped candidates', value: String(findings.filter((finding) => finding.title === 'Commitment may have been dropped').length) },
    { label: 'Findings', value: String(findings.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Shift Commitment Reconciler', stats, findings),
  };
}

export function analyzeWorkInstructionChange(leftSource: string, rightSource: string): AuditResult {
  const diff = buildRevisionDiff(leftSource, rightSource);
  const candidateLines = diff.rows
    .filter((row) => row.kind === 'changed' || row.kind === 'added' || row.kind === 'removed')
    .map((row) => `${row.leftValue} ${row.rightValue}`.trim());

  const findings = [
    ...keywordFlag(candidateLines.filter((line) => /\bwarning|hazard|ppe|permit|loto|isolation\b/i.test(line)), 'high', 'Safety wording changed', (line) => line),
    ...keywordFlag(candidateLines.filter((line) => /\btorque|pressure|temperature|setpoint|clearance|mm|bar|psi|volt|amp\b/i.test(line)), 'high', 'Setpoint or numeric instruction changed', (line) => line),
    ...keywordFlag(candidateLines.filter((line) => /\btool|fixture|jig|gauge\b/i.test(line)), 'medium', 'Tooling wording changed', (line) => line),
  ];

  const stats = [
    { label: 'Changed lines', value: String(diff.summary.changed) },
    { label: 'Added / removed', value: String(diff.summary.added + diff.summary.removed) },
    { label: 'Risk flags', value: String(findings.length) },
    { label: 'Numeric changes', value: String(diff.numberChanges.length) },
  ];

  return {
    stats,
    findings,
    report: buildAuditReport('Work Instruction Change Checker', stats, findings),
  };
}

export function analyzePermitScopeChange(leftSource: string, rightSource: string): AuditResult {
  const leftParsed = parseLooseCsv(leftSource);
  const rightParsed = parseLooseCsv(rightSource);

  if (!leftParsed || !rightParsed) {
    return {
      stats: [{ label: 'Status', value: 'Need two permit tables' }],
      findings: [{ severity: 'high', title: 'Input missing', detail: 'Provide old and new permit scope tables.' }],
      report: 'Permit Scope Change Checker\nStatus: Need two permit tables',
    };
  }

  const comparison = compareKeyedRecords(
    toRecordList(leftParsed),
    toRecordList(rightParsed),
    'permit',
    [
      { field: 'area', label: 'area' },
      { field: 'task', label: 'task' },
      { field: 'isolations', label: 'isolations' },
      { field: 'expires', label: 'expiry' },
      { field: 'owner', label: 'owner' },
    ],
    'Permit',
  );

  const stats = [
    { label: 'Permits reviewed', value: String(comparison.totalKeys) },
    { label: 'Changed fields', value: String(comparison.changedCount) },
    { label: 'Added / removed', value: String(comparison.addedCount + comparison.removedCount) },
    { label: 'Findings', value: String(comparison.findings.length) },
  ];

  return {
    stats,
    findings: comparison.findings,
    report: buildAuditReport('Permit Scope Change Checker', stats, comparison.findings),
  };
}
