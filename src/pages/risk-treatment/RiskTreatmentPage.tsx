import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function RiskTreatmentPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/risk-treatment'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
