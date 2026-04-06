import { render, screen } from '@testing-library/react';
import { QualityIndicatorsPage } from '../../pages/quality-indicators/QualityIndicatorsPage';
import { useAnalysisStore } from '../../store/analysis-store';

describe('QualityIndicatorsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnalysisStore.getState().resetAnalysis();
  });

  it('renders quality summary and indicator details', () => {
    useAnalysisStore.getState().setMetadataField('toeName', 'Device');
    useAnalysisStore.getState().setQuestionAnswer1('QA2', 'internet-facing-gateway');
    useAnalysisStore.getState().setQuestionAnswer1('QA6', 'no');

    render(<QualityIndicatorsPage />);

    expect(screen.getByText('Initial Analysis Quality Summary')).toBeInTheDocument();
    expect(screen.getByText('QA2 / QA6 inconsistency')).toBeInTheDocument();
    expect(screen.getByText('QA2 is Internet-facing gateway while QA6 is No.')).toBeInTheDocument();
  });
});
