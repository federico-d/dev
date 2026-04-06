import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPlaceholderPage } from '../shared/SheetPlaceholderPage';

export function UserInformationPage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/user-information'];
  return <SheetPlaceholderPage sheet={sheet} />;
}
