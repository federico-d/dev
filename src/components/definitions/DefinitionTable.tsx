type Props<T> = {
  title: string;
  columns: Array<{ key: keyof T; label: string }>;
  rows: T[];
};

export function DefinitionTable<T extends Record<string, string | number>>({ title, columns, rows }: Props<T>) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {columns.map((column) => (
                <th className="px-3 py-2 text-left" key={String(column.key)}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className="border-t border-slate-200" key={rowIndex}>
                {columns.map((column) => (
                  <td className="px-3 py-2" key={String(column.key)}>
                    {String(row[column.key])}
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
