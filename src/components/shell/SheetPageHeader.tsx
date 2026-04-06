import type { SheetDefinition } from '../../domain/types';
import { StatusBadge } from '../common/StatusBadge';

type Props = {
  sheet: SheetDefinition;
};

export function SheetPageHeader({ sheet }: Props) {
  return (
    <header className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{sheet.sheetName}</h1>
          <p className="text-sm text-slate-600">{sheet.description}</p>
        </div>
        <StatusBadge status={sheet.status} />
      </div>
    </header>
  );
}
