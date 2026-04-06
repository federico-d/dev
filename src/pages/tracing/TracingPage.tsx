import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function TracingPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/tracing'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
