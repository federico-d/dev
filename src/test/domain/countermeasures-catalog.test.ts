import { COUNTERMEASURES_CATALOG } from '../../domain/catalogs/countermeasures';

const REQUIRED_IDS = [
  'CM1', 'CM2a', 'CM2b', 'CM3', 'CM4', 'CM5', 'CM6', 'CM7', 'CM8', 'CM10', 'CM11', 'CM12', 'CM14',
  'CM15', 'CM16', 'CM17', 'CM18', 'CM19', 'CM20', 'CM21', 'CM22', 'CM23', 'CM24', 'CM25', 'CM26',
  'CM27', 'CM28', 'C3', 'C15', 'C17', 'C20', 'C21', 'C27', 'C29', 'C30', 'C32', 'C35', 'C0', 'C13',
  'C24', 'C33', 'C34',
];

describe('countermeasures catalog integrity', () => {
  it('contains required countermeasure IDs', () => {
    const ids = COUNTERMEASURES_CATALOG.map((item) => item.id);
    for (const id of REQUIRED_IDS) {
      expect(ids).toContain(id);
    }
  });

  it('contains required baseline fields on each countermeasure', () => {
    for (const item of COUNTERMEASURES_CATALOG) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.stakeholder).toBeTruthy();
      expect(item.reference).toBeTruthy();
      expect(item.type).toBeTruthy();
      expect(item.easeDelta).toBeTruthy();
      expect(item.configFlags).toBeTruthy();
    }
  });

  it('marks CM2a as OEM-specific and incomplete template', () => {
    const cm2a = COUNTERMEASURES_CATALOG.find((item) => item.id === 'CM2a');
    expect(cm2a).toBeDefined();
    expect(cm2a?.configFlags.requiresOemConfiguration).toBe(true);
    expect(cm2a?.configFlags.incompleteInTemplate).toBe(true);
  });
});
