import { useMemo, useState } from 'react';
import { ASSUMPTIONS_CATALOG } from '../../domain/catalogs/assumptions';

export function AssumptionsPage() {
  const [stakeholder, setStakeholder] = useState<string>('all');
  const [effectType, setEffectType] = useState<string>('all');
  const [activeOnly, setActiveOnly] = useState(false);
  const [annex, setAnnex] = useState<string>('all');

  const stakeholders = useMemo(
    () => Array.from(new Set(ASSUMPTIONS_CATALOG.map((item) => item.stakeholder))).sort(),
    [],
  );
  const effectTypes = useMemo(
    () => Array.from(new Set(ASSUMPTIONS_CATALOG.map((item) => item.effectType))).sort(),
    [],
  );
  const annexLetters = useMemo(
    () => Array.from(new Set(ASSUMPTIONS_CATALOG.flatMap((item) => item.annexMappings))).sort(),
    [],
  );

  const rows = ASSUMPTIONS_CATALOG.filter((item) => {
    if (stakeholder !== 'all' && item.stakeholder !== stakeholder) return false;
    if (effectType !== 'all' && item.effectType !== effectType) return false;
    if (activeOnly && !item.activeByTemplate) return false;
    if (annex !== 'all' && !item.annexMappings.includes(annex)) return false;
    return true;
  });

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Assumptions Catalog</h3>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-sm">
            Stakeholder
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={stakeholder} onChange={(e) => setStakeholder(e.target.value)}>
              <option value="all">All</option>
              {stakeholders.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm">
            Effect type
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={effectType} onChange={(e) => setEffectType(e.target.value)}>
              <option value="all">All</option>
              {effectTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm">
            Annex letter
            <select className="mt-1 w-full rounded border border-slate-300 p-2" value={annex} onChange={(e) => setAnnex(e.target.value)}>
              <option value="all">All</option>
              {annexLetters.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="mt-6 inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />
            Active by template only
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              {['ID', 'Name', 'Stakeholder', 'Reference', 'Description', 'Status', 'Effect', 'Annex', 'Flags'].map((header) => (
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
                <td className="px-3 py-2">{item.reference}</td>
                <td className="px-3 py-2">{item.description}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">{item.effectType}</td>
                <td className="px-3 py-2">{item.annexMappings.join(', ') || '-'}</td>
                <td className="px-3 py-2">{item.activeByTemplate ? 'Template active' : item.allowedInMitigation ? 'Mitigation allowed' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
