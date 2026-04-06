import { CatalogTable } from '../../components/catalog/CatalogTable';
import { COUNTERMEASURES_CATALOG } from '../../domain/catalogs/countermeasures';

export function CountermeasuresPage() {
  return (
    <CatalogTable
      headers={['ID', 'Name', 'Stakeholder', 'Type', 'Reference', 'Forced RAP', 'Flags']}
      rows={COUNTERMEASURES_CATALOG.map((item) => [
        item.id,
        item.name,
        item.stakeholder,
        item.type,
        item.reference,
        item.forcedMinimumRap ?? '-',
        item.configFlags.incompleteInTemplate ? 'Incomplete template' : item.configFlags.requiresOemConfiguration ? 'OEM config required' : '-',
      ])}
      title="Countermeasures Catalog"
    />
  );
}
