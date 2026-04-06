import { render, screen } from '@testing-library/react';
import { AssumptionsPage } from '../../pages/assumptions/AssumptionsPage';
import { CountermeasuresPage } from '../../pages/countermeasures/CountermeasuresPage';
import { DamageScenariosPage } from '../../pages/damage-scenarios/DamageScenariosPage';
import { DSOverviewPage } from '../../pages/ds-overview/DSOverviewPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Macro Sprint 2 catalog and damage pages', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders Assumptions page with extended catalog fields', () => {
    render(<AssumptionsPage />);
    expect(screen.getByText('Assumptions Catalog')).toBeInTheDocument();
    expect(screen.getByText('A21')).toBeInTheDocument();
    expect(screen.getByText('A43')).toBeInTheDocument();
    expect(screen.getAllByText('scopeReduction').length).toBeGreaterThan(0);
  });

  it('renders Countermeasures page with CM2a flags', () => {
    render(<CountermeasuresPage />);
    expect(screen.getByText('Countermeasures Catalog')).toBeInTheDocument();
    expect(screen.getByText('CM2a')).toBeInTheDocument();
    expect(screen.getByText('Incomplete template')).toBeInTheDocument();
  });

  it('renders transformed/excluded information in Damage Scenarios page', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI15', 'major-disturbance');
    render(<DamageScenariosPage />);
    expect(screen.getByText('Damage Scenarios')).toBeInTheDocument();
    expect(screen.getAllByText('Transformed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Excluded').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Yes').length).toBeGreaterThan(0);
  });

  it('renders DS Overview summary cards and transformation summary', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI6', 'severe-injury');
    render(<DSOverviewPage />);
    expect(screen.getByText('Damage Overview')).toBeInTheDocument();
    expect(screen.getByText('Transformation Summary')).toBeInTheDocument();
    expect(screen.getByText(/Transformed:/)).toBeInTheDocument();
  });
});
