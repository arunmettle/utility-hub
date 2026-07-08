import { describe, expect, it } from 'vitest';
import { diffBoqCsv, estimateMaterialTakeoffCarbon, findCivilFormulas } from '../src/lib/industryTools';

describe('civil tools', () => {
  it('estimates takeoff carbon from a simple CSV export', () => {
    const result = estimateMaterialTakeoffCarbon(`item,quantity,unit,carbonFactorKgCo2e,description
Concrete C32/40,12,m3,320,Footing and slab concrete
Rebar N16,1.8,tonne,1850,Reinforcement steel`);

    expect(result.error).toBe('');
    expect(result.output?.rows).toHaveLength(2);
    expect(result.output?.totalCarbonKgCo2e).toBeGreaterThan(0);
    expect(result.output?.report).toContain('kgCO2e');
  });

  it('detects BOQ quantity and description changes', () => {
    const result = diffBoqCsv(
      `item,qty,unit,description
C1,120,m,Kerb line
D1,18,ea,Drain pit lid`,
      `item,qty,unit,description
C1,140,m,Kerb line
D1,18,ea,Drain pit lid revised
R1,2,ea,Road barrier`,
    );

    expect(result.error).toBe('');
    expect(result.output?.quantityChanged[0]).toContain('C1');
    expect(result.output?.descriptionChanged[0]).toContain('D1');
    expect(result.output?.added[0]).toContain('R1');
  });

  it('finds civil formulas by topic and category', () => {
    const formulas = findCivilFormulas('head loss', 'Hydraulics');

    expect(formulas.length).toBeGreaterThan(0);
    expect(formulas.some((formula) => formula.title.toLowerCase().includes('darcy'))).toBe(true);
    expect(formulas.every((formula) => formula.category === 'Hydraulics')).toBe(true);
  });
});
