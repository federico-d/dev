type Props = {
  title: string;
  answered: number;
  total: number;
  issues: number;
};

export function SectionProgressCard({ title, answered, total, issues }: Props) {
  return (
    <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">Answered: {answered}/{total}</p>
      <p className="text-sm text-slate-600">Issues: {issues}</p>
    </header>
  );
}
