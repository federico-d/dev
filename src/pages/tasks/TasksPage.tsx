import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function TasksPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/tasks'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
