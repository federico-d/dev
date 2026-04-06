import { AttackStepStatus } from '../../domain/enums';

type Props = {
  status: AttackStepStatus;
};

export function AttackStepStatusBadge({ status }: Props) {
  const classes =
    status === AttackStepStatus.Active
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  return <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}
