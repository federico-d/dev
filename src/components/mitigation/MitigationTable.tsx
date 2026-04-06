import { MitigationRowEditor } from './MitigationRowEditor';
import type { MitigationRow } from '../../domain/types';

type Props = {
  rows: MitigationRow[];
  onRawInputChange: (attackStepId: string, rawInput: string) => void;
};

export function MitigationTable({ rows, onRawInputChange }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">Mitigation Planning</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">AS ID</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Proposed CMs</th>
              <th className="px-3 py-2 text-left">Proposed A</th>
              <th className="px-3 py-2 text-left">Additional A</th>
              <th className="px-3 py-2 text-left">Raw input</th>
              <th className="px-3 py-2 text-left">Parse</th>
              <th className="px-3 py-2 text-left">Base RAP</th>
              <th className="px-3 py-2 text-left">Net RAP</th>
              <th className="px-3 py-2 text-left">Highest remaining risk</th>
              <th className="px-3 py-2 text-left">Affected risks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <MitigationRowEditor
                key={row.attackStepId}
                row={row}
                onRawInputChange={(value) => onRawInputChange(row.attackStepId, value)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
