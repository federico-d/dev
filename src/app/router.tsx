import { Navigate, createBrowserRouter } from 'react-router-dom';
import { SHEET_METADATA } from '../domain/catalogs/sheet-metadata';
import { WorkbookShellLayout } from './layout/WorkbookShellLayout';
import { PAGE_COMPONENTS } from './page-registry';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <WorkbookShellLayout />,
    children: [
      { index: true, element: <Navigate replace to="/license" /> },
      ...SHEET_METADATA.map((sheet) => ({
        path: sheet.route,
        element: PAGE_COMPONENTS[sheet.id],
      })),
    ],
  },
]);
