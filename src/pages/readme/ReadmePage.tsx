import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';

export function ReadmePage() {
  const sheet = SHEET_METADATA_BY_ROUTE['/readme'];

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{sheet.sheetName}</h2>
      <p className="text-sm text-slate-700">Guida rapida alla compilazione dell’analisi QuBA in versione web.</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
        <li>Compila Documentation e Questionnaire.</li>
        <li>Usa la sidebar per navigare i fogli equivalenti al workbook.</li>
        <li>Attiva “Advanced mode” per visualizzare le sheet tecniche nascoste.</li>
      </ul>
    </section>
  );
}
