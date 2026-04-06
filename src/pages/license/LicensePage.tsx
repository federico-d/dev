import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';

export function LicensePage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/license'];

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{sheet.sheetName}</h2>
      <p className="text-sm text-slate-700">
        Questa sezione ospita la licenza del template QuBA e le condizioni d’uso del modello.
      </p>
      <p className="text-sm text-slate-600">
        Sprint 1A: pagina base pronta, contenuti normativi estesi da completare in iterazioni successive.
      </p>
    </section>
  );
}
