import { describe, expect, it } from 'vitest';
import {
  buildEvalDataset,
  buildPromptStudio,
  compactContext,
  extractPromptVariables,
  repairJsonOutput,
  reviewGrounding,
  runConsistencyCheck,
  validateToolPayload,
} from '../src/lib/aiWorkbench';

describe('aiWorkbench helpers', () => {
  it('extracts prompt variables from moustache templates', () => {
    expect(extractPromptVariables('Summarize {{incident_summary}} for {{audience}}.')).toEqual([
      'incident_summary',
      'audience',
    ]);
  });

  it('assembles prompt studio sections and variables', () => {
    const result = buildPromptStudio({
      goal: 'Summarize {{incident_summary}}',
      audience: 'Internal stakeholders',
      variables: '{{incident_summary}}',
      examples: '',
      constraints: 'No speculation',
      outputFormat: 'Bullets',
    });

    expect(result.sections).toBe(5);
    expect(result.variables).toContain('incident_summary');
    expect(result.prompt).toContain('Goal:');
  });

  it('repairs common malformed JSON output patterns', () => {
    const result = repairJsonOutput('{\nsummary: "incident",\nitems: ["a",],\n}');

    expect(result.error).toBe('');
    expect(result.output).toContain('"summary": "incident"');
  });

  it('flags unsupported answer claims during grounding review', () => {
    const report = reviewGrounding('The outage affected API latency only.', 'The outage affected API latency. Customer data was lost.');

    expect(report.supportedClaims.length).toBeGreaterThan(0);
    expect(report.unsupportedClaims.length).toBeGreaterThan(0);
  });

  it('detects missing required payload fields', () => {
    const result = validateToolPayload('endpointId\ninput\npolicy', '{"endpointId":"ep","input":{}}');

    expect(result.error).toBe('');
    expect(result.output?.missingFields).toContain('policy');
    expect(result.output?.valid).toBe(false);
  });

  it('compacts context to a token budget', () => {
    const result = compactContext('One. Two. Three. Four.', 4);

    expect(result.keptSentences).toBeGreaterThan(0);
    expect(result.usedTokens).toBeLessThanOrEqual(4);
  });

  it('calculates consistency signals across multiple outputs', () => {
    const result = runConsistencyCheck('API latency only.\n\nAPI latency only and no data loss.\n\nLatency only.');

    expect(result.consensusScore).toBeGreaterThan(0);
    expect(result.repeatedClaims).toContain('latency');
  });

  it('builds eval dataset rows from shorthand lines', () => {
    const rows = buildEvalDataset('summarize outage|short summary|grounding');

    expect(rows).toEqual([
      {
        input: 'summarize outage',
        expected: 'short summary',
        rubric: 'grounding',
      },
    ]);
  });
});
