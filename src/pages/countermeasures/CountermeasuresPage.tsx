import { useMemo, useState } from 'react';
import { COUNTERMEASURES_CATALOG } from '../../domain/catalogs/countermeasures';

function formatEaseDelta(delta: { elapsedTime: number; expertise: number; knowledgeOfToe: number; windowOfOpportunity: number; equipment: number }) {
  return `ET ${delta.elapsedTime} / EX ${delta.expertise} / KT ${delta.knowledgeOfToe} / WO ${delta.windowOfOpportunity} / EQ ${delta.equipment}`;
}

export function CountermeasuresPage() {
  const [stakeholder, setStakeholder] = useState<string>('all');
  const [type, setType] = useState<string>('all');
  const [annex, setAnnex] = useState<string>('all');
  const [forcedOnly, setForcedOnly] = useState(false);
  const [oemOnly, setOemOnly] = useState(false);
  const [incompleteOnly, setIncompleteOnly] = useState(false);

  const stakeholders = useMemo(
    () => Array.from(new Set(COUNTERMEASURES_CATALOG.map((item) => item.stakeholder))).sort(),
    [],
  );
  const types = useMemo(() => Array.from(new Set(COUNTERMEASURES_CATALOG.map((item) => item.type))).sort(), []);
  const annexLetters = useMemo(
    () => Array.from(new Set(COUNTERMEASURES_CATALOG.flatMap((item) => item.annexMappings))).sort(),
    [],
  );

  const rows = COUNTERMEASURES_CATALOG.filter((item) => {
    if (stakeholder !== 'all' && item.stakeholder !== stakeholder) return false;
    if (type !== 'all' && item.type !== type) return false;
    if (annex !== 'all' && !item.annexMappings.includes(annex)) return false;
    if (forcedOnly && !item.forcedMinimumRap) return false;
    if (oemOnly && !item.configFlags.requiresOemConfiguration) return false;
    if (incompleteOnly && !item.configFlags.incompleteInTemplate) return false;
    return true;
  });

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Countermeasures Catalog</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm">Stakeholder
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={stakeholder} onChange={(e) => setStakeholder(e.target.value)}>
              <option value="all">All</option>
              {stakeholders.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm">Type
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All</option>
              {types.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm">Annex letter
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={annex} onChange={(e) => setAnnex(e.target.value)}>
              <option value="all">All</option>
              {annexLetters.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={forcedOnly} onChange={(e) => setForcedOnly(e.target.checked)} />Has forced RAP</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={oemOnly} onChange={(e) => setOemOnly(e.target.checked)} />Requires OEM config</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={incompleteOnly} onChange={(e) => setIncompleteOnly(e.target.checked)} />Incomplete in template</label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {['ID', 'Name', 'Stakeholder', 'Type', 'Reference', 'Description', 'EASE Δ', 'Forced RAP', 'Annex', 'Flags'].map((header) => (
                <th key={header} className="px-3 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-slate-200 align-top">
                <td className="px-3 py-2 font-medium">{item.id}</td>
                <td className="px-3 py-2">{item.name}</td>
                <td className="px-3 py-2">{item.stakeholder}</td>
                <td className="px-3 py-2">{item.type}</td>
                <td className="px-3 py-2">{item.reference}</td>
                <td className="px-3 py-2">{item.description}</td>
                <td className="px-3 py-2">{formatEaseDelta(item.easeDelta)}</td>
                <td className="px-3 py-2">{item.forcedMinimumRap ?? '-'}</td>
                <td className="px-3 py-2">{item.annexMappings.join(', ') || '-'}</td>
                <td className="px-3 py-2">
                  {item.configFlags.incompleteInTemplate
                    ? 'Incomplete template'
                    : item.configFlags.requiresOemConfiguration
                      ? 'OEM specific'
                      : item.configFlags.needsManualEaseValues
                        ? 'Manual EASE values'
                        : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
