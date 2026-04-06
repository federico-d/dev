import { CatalogTable } from '../../components/catalog/CatalogTable';
import { ASSUMPTIONS_CATALOG } from '../../domain/catalogs/assumptions';

export function AssumptionsPage() {
  return (
    <CatalogTable
      headers={['ID', 'Name', 'Stakeholder', 'Reference', 'Description', 'Status']}
      rows={ASSUMPTIONS_CATALOG.map((item) => [
        item.id,
        item.name,
        item.stakeholder,
        item.reference,
        item.description,
        item.status,
      ])}
      title="Assumptions Catalog"
    />
  );
}
