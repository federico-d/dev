type Props = {
  totalAttackSteps: number;
  mitigatedAttackSteps: number;
  parseErrorCount: number;
  highestRemainingRiskPresent: string | null;
};

export function MitigationSummaryCards({ totalAttackSteps, mitigatedAttackSteps, parseErrorCount, highestRemainingRiskPresent }: Props) {
  const cards = [
    ['Total Attack Steps', totalAttackSteps],
    ['Mitigated Attack Steps', mitigatedAttackSteps],
    ['Parse Errors', parseErrorCount],
    ['Highest Remaining Risk', highestRemainingRiskPresent ?? 'n/a'],
  ] as const;

  return (
    <div className="grid gap-3 lg:grid-cols-4">
      {cards.map(([label, value]) => (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={label}>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
