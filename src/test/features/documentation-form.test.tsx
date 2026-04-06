import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { DocumentationPage } from '../../pages/documentation/DocumentationPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('DocumentationPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders completeness and inline validation for missing required metadata', async () => {
    render(<DocumentationPage />);

    const formRegion = screen.getByText('TOE / Product Name').closest('form');
    expect(formRegion).not.toBeNull();
    expect(within(formRegion as HTMLElement).getByText('TOE / Product Name is required.')).toBeInTheDocument();

    const toeInput = screen.getByPlaceholderText('Nome del prodotto') as HTMLInputElement;
    fireEvent.change(toeInput, { target: { value: 'QuBA Device' } });

    await waitFor(() => {
      expect(useAnalysisStore.getState().metadata.toeName).toBe('QuBA Device');
    });

    expect(screen.getByText(/Metadata completeness:/i)).toBeInTheDocument();
  });
});
