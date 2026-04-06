type Props = {
  total: number;
  active: number;
  inactive: number;
};

export function AttackStepSummaryCards({ total, active, inactive }: Props) {
  const cards = [
    { label: 'Total Attack Steps', value: total },
    { label: 'Active', value: active },
    { label: 'Inactive', value: inactive },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
