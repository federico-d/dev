import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function MitigationPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/mitigation'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
