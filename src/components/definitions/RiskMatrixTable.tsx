import { DAMAGE_LEVELS, RAP_LEVELS, RISK_MATRIX } from '../../domain/catalogs/definitions';

export function RiskMatrixTable() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-slate-900">Risk Matrix (RAP x Damage Level)</h3>
      <p className="mb-3 text-xs text-slate-600">No Risk is not part of the matrix and is assigned only to inactive attack steps.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">RAP \ DL</th>
              {DAMAGE_LEVELS.map((level) => (
                <th className="px-3 py-2 text-left" key={level.value}>
                  {level.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RAP_LEVELS.map((rap) => (
              <tr className="border-t border-slate-200" key={rap}>
                <td className="px-3 py-2 font-semibold">{rap}</td>
                {DAMAGE_LEVELS.map((level) => {
                  const cell = RISK_MATRIX.find((item) => item.rap === rap && item.damageLevelValue === level.value);
                  return (
                    <td className="px-3 py-2" key={`${rap}-${level.value}`}>
                      {cell?.riskLevel ?? '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
