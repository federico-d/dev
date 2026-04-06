import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function HelperPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/helper'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
