import { buildRevisionDiff, type RevisionDiffOutput } from './industryTools';

export function compareClinicalReports(left: string, right: string): RevisionDiffOutput {
  return buildRevisionDiff(left, right);
}

export interface ClinicalDeidentifyOutput {
  redacted: string;
  replacements: number;
  report: string;
}

function applyReplacement(source: string, pattern: RegExp, replacement: string, counter: { value: number }) {
  return source.replace(pattern, () => {
    counter.value += 1;
    return replacement;
  });
}

export function deidentifyClinicalText(input: string): ClinicalDeidentifyOutput {
  const counter = { value: 0 };
  let redacted = input.trim();

  redacted = applyReplacement(redacted, /\b(?:mrn|patient id|pid|urn|ur|nhs number|medicare(?: no\.)?)\s*[:#-]?\s*[A-Za-z0-9-]+\b/gi, '[REDACTED ID]', counter);
  redacted = applyReplacement(redacted, /\b(?:dob|date of birth|admission date|discharge date|visit date)\s*[:#-]?\s*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/gi, '[REDACTED DATE]', counter);
  redacted = applyReplacement(redacted, /\b(?:patient name|name|pt)\s*[:#-]?\s*[^\n,;]+/gi, '[REDACTED NAME]', counter);
  redacted = applyReplacement(redacted, /\b(?:address|home address|residential address)\s*[:#-]?\s*[^\n,;]+/gi, '[REDACTED ADDRESS]', counter);
  redacted = applyReplacement(redacted, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED EMAIL]', counter);
  redacted = applyReplacement(redacted, /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, '[REDACTED PHONE]', counter);

  const report = [
    'Clinical de-identification summary',
    `Input characters: ${input.length}`,
    `Redacted characters: ${redacted.length}`,
    `Replacements: ${counter.value}`,
  ].join('\n');

  return {
    redacted,
    replacements: counter.value,
    report,
  };
}
