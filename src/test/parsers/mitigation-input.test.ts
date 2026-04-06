import { describe, expect, it } from 'vitest';
import { parseMitigationInput } from '../../domain/parsers/mitigation-input';

describe('mitigation parser', () => {
  it('parses single countermeasure {CM1}', () => {
    const result = parseMitigationInput('{CM1}');
    expect(result.parsedItems[0]).toMatchObject({ kind: 'countermeasure', id: 'CM1' });
  });

  it('parses forced RAP {CM5: Moderate}', () => {
    const result = parseMitigationInput('{CM5: Moderate}');
    expect(result.parsedItems[0]).toMatchObject({ id: 'CM5', forcedMinimumRap: 'Moderate' });
  });

  it('parses assumption {A21}', () => {
    const result = parseMitigationInput('{A21}');
    expect(result.parsedItems[0]).toMatchObject({ kind: 'assumption', id: 'A21' });
  });

  it('parses multi list', () => {
    const result = parseMitigationInput('{CM1}, {CM5: High}, {A21}');
    expect(result.parsedItems).toHaveLength(3);
  });

  it('returns parse error for malformed syntax', () => {
    const result = parseMitigationInput('CM1');
    expect(result.parseErrors.length).toBeGreaterThan(0);
  });

  it('tolerates whitespace', () => {
    const result = parseMitigationInput('  { CM1 }  ,   { A21 } ');
    expect(result.parsedItems.map((i) => i.id)).toEqual(['CM1', 'A21']);
  });
});
