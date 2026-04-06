import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function JsonExportPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/json-export'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
