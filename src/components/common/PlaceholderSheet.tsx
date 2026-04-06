import type { SheetDefinition } from '../../domain/types';

type Props = {
  sheet: SheetDefinition;
};

export function PlaceholderSheet({ sheet }: Props) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{sheet.sheetName} — Placeholder</h2>
        <p className="text-sm text-slate-600">{sheet.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">Dipendenze future</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {sheet.dependsOn.map((dep) => (
            <li key={dep}>{dep}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">Dati attesi</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {sheet.expectedData.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
