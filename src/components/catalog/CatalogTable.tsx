type Props = {
  title: string;
  headers: string[];
  rows: string[][];
};

export function CatalogTable({ title, headers, rows }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {headers.map((header) => (
                <th className="px-3 py-2 text-left" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className="border-t border-slate-200" key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className="px-3 py-2" key={`${rowIndex}-${cellIndex}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
