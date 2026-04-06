import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function ResultSummaryPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/result-summary'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
