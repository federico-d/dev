import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SidebarNav } from '../../components/shell/SidebarNav';
import { SHEET_METADATA_BY_ROUTE } from '../../domain/catalogs/sheet-metadata';
import { SheetPageHeader } from '../../components/shell/SheetPageHeader';
import { useAnalysisStore } from '../../store/analysis-store';

export function WorkbookShellLayout() {
  const location = useLocation();
  const setActiveRoute = useAnalysisStore((state) => state.setActiveRoute);

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname, setActiveRoute]);

  const currentSheet = SHEET_METADATA_BY_ROUTE[location.pathname] ?? SHEET_METADATA_BY_ROUTE['/license'];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <SidebarNav />
      <main className="flex-1 p-6">
        <SheetPageHeader sheet={currentSheet} />
        <Outlet />
      </main>
    </div>
  );
}
