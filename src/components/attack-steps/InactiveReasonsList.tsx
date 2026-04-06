import type { ActivationReason } from '../../domain/types';

type Props = {
  reasons: ActivationReason[];
};

export function InactiveReasonsList({ reasons }: Props) {
  if (reasons.length === 0) {
    return <span className="text-slate-500">—</span>;
  }

  return (
    <ul className="list-disc pl-5 text-xs text-slate-700">
      {reasons.map((reason) => (
        <li key={reason.ruleId}>{reason.message}</li>
      ))}
    </ul>
  );
}
