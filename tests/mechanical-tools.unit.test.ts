import { describe, expect, it } from 'vitest';
import { analyzeToleranceStack, calculateHoleShaftFit, diffBomCsv, findMechanicalFormulas } from '../src/lib/industryTools';

describe('mechanical tools', () => {
  it('analyzes a simple tolerance stack', () => {
    const result = analyzeToleranceStack(`label,nominal,plusTol,minusTol,direction
A,50,0.1,0.1,+
B,20,0.05,0.05,-
`);

    expect(result.error).toBe('');
    expect(result.output?.rows).toHaveLength(2);
    expect(result.output?.totalMax).toBeGreaterThan(result.output?.totalMin ?? 0);
  });

  it('diffs BOM rows by part and quantity', () => {
    const result = diffBomCsv(
      `part,qty,description
100,2,Bracket
200,1,Motor`,
      `part,qty,description
100,4,Bracket
300,1,Shim`,
    );

    expect(result.error).toBe('');
    expect(result.output?.quantityChanged[0]).toContain('100');
    expect(result.output?.added[0]).toContain('300');
    expect(result.output?.removed[0]).toContain('200');
  });

  it('classifies a hole and shaft pair', () => {
    const result = calculateHoleShaftFit({
      holeNominal: 25,
      holePlusTol: 0.021,
      holeMinusTol: 0,
      shaftNominal: 25,
      shaftPlusTol: 0,
      shaftMinusTol: 0.013,
    });

    expect(result.fitType).toBe('Transition fit');
    expect(result.maxClearance).toBeGreaterThan(result.minClearance);
  });

  it('finds mechanical formulas by topic and category', () => {
    const formulas = findMechanicalFormulas('deflection', 'Strength');

    expect(formulas.length).toBeGreaterThan(0);
    expect(formulas.some((formula) => formula.title.toLowerCase().includes('deflection'))).toBe(true);
    expect(formulas.every((formula) => formula.category === 'Strength')).toBe(true);
  });
});
