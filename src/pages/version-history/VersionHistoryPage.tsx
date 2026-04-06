const RELEASE_NOTES = [
  { version: '0.1.0', date: '2026-04-06', note: 'Sprint 1A foundation layer: shell, routing, store base.' },
];

export function VersionHistoryPage() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Version History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="px-3 py-2">Version</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {RELEASE_NOTES.map((item) => (
              <tr key={item.version} className="border-t border-slate-200">
                <td className="px-3 py-2">{item.version}</td>
                <td className="px-3 py-2">{item.date}</td>
                <td className="px-3 py-2">{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
