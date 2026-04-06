import { NavLink } from 'react-router-dom';
import { NavGroup } from '../../domain/enums';
import { getVisibleSheets } from '../../domain/catalogs/sheet-metadata';
import { useAnalysisStore } from '../../store/analysis-store';

const GROUP_ORDER: NavGroup[] = [
  NavGroup.Meta,
  NavGroup.Cataloghi,
  NavGroup.Input,
  NavGroup.Analisi,
  NavGroup.Trattamento,
  NavGroup.Output,
  NavGroup.Controlli,
  NavGroup.Advanced,
];

export function SidebarNav() {
  const advancedMode = useAnalysisStore((state) => state.ui.advancedMode);
  const toggleAdvancedMode = useAnalysisStore((state) => state.toggleAdvancedMode);
  const sidebarCollapsed = useAnalysisStore((state) => state.ui.sidebarCollapsed);
  const setSidebarCollapsed = useAnalysisStore((state) => state.setSidebarCollapsed);

  const visibleSheets = getVisibleSheets(advancedMode);

  return (
    <aside className={`border-r border-slate-200 bg-white ${sidebarCollapsed ? 'w-20' : 'w-80'} p-3`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        {!sidebarCollapsed && <p className="font-semibold text-slate-900">QuBA Sheets</p>}
        <button
          className="rounded border border-slate-300 px-2 py-1 text-xs"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          type="button"
        >
          {sidebarCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {!sidebarCollapsed && (
        <label className="mb-3 flex cursor-pointer items-center gap-2 rounded border border-slate-200 px-2 py-2 text-xs text-slate-700">
          <input checked={advancedMode} onChange={toggleAdvancedMode} type="checkbox" />
          Advanced mode
        </label>
      )}

      <nav className="space-y-4">
        {GROUP_ORDER.map((group) => {
          const entries = visibleSheets.filter((sheet) => sheet.navGroup === group);
          if (entries.length === 0) {
            return null;
          }

          return (
            <section key={group}>
              {!sidebarCollapsed && <h3 className="mb-1 text-xs font-bold uppercase text-slate-500">{group}</h3>}
              <ul className="space-y-1">
                {entries.map((sheet) => (
                  <li key={sheet.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block rounded px-2 py-1 text-sm ${isActive ? 'bg-blue-100 text-blue-800' : 'text-slate-700 hover:bg-slate-100'}`
                      }
                      to={sheet.route}
                    >
                      {sidebarCollapsed ? sheet.sheetName.slice(0, 2) : sheet.sheetName}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
