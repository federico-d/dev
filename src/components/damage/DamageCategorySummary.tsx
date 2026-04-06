import type { DamageCategoryResult } from '../../domain/types';

type Props = {
  categoryResult: DamageCategoryResult;
  totalScenarios: number;
};

export function DamageCategorySummary({ categoryResult, totalScenarios }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-slate-900">Damage Overview</h3>
      <p className="text-sm text-slate-700">Total active scenarios: {totalScenarios}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
        <li>Confidentiality: {categoryResult.C.label}</li>
        <li>Integrity: {categoryResult.I.label}</li>
        <li>Availability: {categoryResult.A.label}</li>
        <li>Financial & Legal: {categoryResult.F.label}</li>
      </ul>
    </section>
  );
}
