import { PlaceholderSheet } from '../../components/common/PlaceholderSheet';
import type { SheetDefinition } from '../../domain/types';

type Props = {
  sheet: SheetDefinition;
};

export function SheetPlaceholderPage({ sheet }: Props) {
  return <PlaceholderSheet sheet={sheet} />;
}
