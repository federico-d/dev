import { SheetStatus } from '../../domain/enums';

type Props = {
  status: SheetStatus;
};

const statusClasses: Record<SheetStatus, string> = {
  [SheetStatus.Implemented]: 'bg-emerald-100 text-emerald-800',
  [SheetStatus.Partial]: 'bg-amber-100 text-amber-800',
  [SheetStatus.Placeholder]: 'bg-slate-200 text-slate-700',
};

export function StatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
