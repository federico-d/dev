import { render, screen } from '@testing-library/react';
import { AssumptionsPage } from '../../pages/assumptions/AssumptionsPage';
import { CountermeasuresPage } from '../../pages/countermeasures/CountermeasuresPage';
import { DamageScenariosPage } from '../../pages/damage-scenarios/DamageScenariosPage';
import { DefinitionsPage } from '../../pages/definitions/DefinitionsPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('Sprint 2A real pages', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders Definitions page with matrix and thresholds', () => {
    render(<DefinitionsPage />);
    expect(screen.getByText('Damage Levels')).toBeInTheDocument();
    expect(screen.getByText('RAP Thresholds')).toBeInTheDocument();
    expect(screen.getByText('Risk Matrix (RAP x Damage Level)')).toBeInTheDocument();
  });

  it('renders Assumptions catalog', () => {
    render(<AssumptionsPage />);
    expect(screen.getByText('Assumptions Catalog')).toBeInTheDocument();
    expect(screen.getByText('A17')).toBeInTheDocument();
  });

  it('renders Countermeasures catalog', () => {
    render(<CountermeasuresPage />);
    expect(screen.getByText('Countermeasures Catalog')).toBeInTheDocument();
    expect(screen.getByText('CM2a')).toBeInTheDocument();
  });


  it('shows clear empty state when no damage scenarios are derivable', () => {
    render(<DamageScenariosPage />);
    expect(screen.getByText('No damage scenarios derived from current questionnaire answers.')).toBeInTheDocument();
  });

  it('renders Damage Scenarios derived from store questionnaire answers', () => {
    useAnalysisStore.getState().setQuestionAnswer1('QI2', 'ruinous');
    render(<DamageScenariosPage />);
    expect(screen.getByText('Damage Scenarios')).toBeInTheDocument();
    expect(screen.getAllByText('QI2').length).toBeGreaterThan(0);
    expect(screen.getByText('Personal data disclosure (ruinous)')).toBeInTheDocument();
  });
});
