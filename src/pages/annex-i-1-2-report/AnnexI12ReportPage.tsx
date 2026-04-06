import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function AnnexI12ReportPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/annex-i-1-2-report'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
