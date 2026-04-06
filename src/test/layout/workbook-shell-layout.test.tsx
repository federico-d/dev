import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { WorkbookShellLayout } from '../../app/layout/WorkbookShellLayout';

describe('WorkbookShellLayout', () => {
  it('renders sidebar, header and page content', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <WorkbookShellLayout />,
          children: [{ path: '/license', element: <div>Page Content</div> }],
        },
      ],
      { initialEntries: ['/license'] },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('QuBA Sheets')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'License' })).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
