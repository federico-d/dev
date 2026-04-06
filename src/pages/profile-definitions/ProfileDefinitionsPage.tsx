import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function ProfileDefinitionsPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/profile-definitions'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
