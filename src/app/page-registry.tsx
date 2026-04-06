import type { ReactElement } from 'react';
import type { SheetId } from '../domain/types';
import { LicensePage } from '../pages/license/LicensePage';
import { ReadmePage } from '../pages/readme/ReadmePage';
import { VersionHistoryPage } from '../pages/version-history/VersionHistoryPage';
import { DefinitionsPage } from '../pages/definitions/DefinitionsPage';
import { QuestionsPage } from '../pages/questions/QuestionsPage';
import { DamageScenariosPage } from '../pages/damage-scenarios/DamageScenariosPage';
import { AttackStepsPage } from '../pages/attack-steps/AttackStepsPage';
import { AssumptionsPage } from '../pages/assumptions/AssumptionsPage';
import { CountermeasuresPage } from '../pages/countermeasures/CountermeasuresPage';
import { DocumentationPage } from '../pages/documentation/DocumentationPage';
import { QuestionnairePage } from '../pages/questionnaire/QuestionnairePage';
import { DSOverviewPage } from '../pages/ds-overview/DSOverviewPage';
import { RisksPage } from '../pages/risks/RisksPage';
import { MitigationPage } from '../pages/mitigation/MitigationPage';
import { RiskTreatmentPage } from '../pages/risk-treatment/RiskTreatmentPage';
import { ResultSummaryPage } from '../pages/result-summary/ResultSummaryPage';
import { AnnexI12ReportPage } from '../pages/annex-i-1-2-report/AnnexI12ReportPage';
import { TracingPage } from '../pages/tracing/TracingPage';
import { TasksPage } from '../pages/tasks/TasksPage';
import { QualityIndicatorsPage } from '../pages/quality-indicators/QualityIndicatorsPage';
import { JsonExportPage } from '../pages/json-export/JsonExportPage';
import { UserInformationPage } from '../pages/user-information/UserInformationPage';
import { ProfileDefinitionsPage } from '../pages/profile-definitions/ProfileDefinitionsPage';
import { HelperPage } from '../pages/helper/HelperPage';

export const PAGE_COMPONENTS: Record<SheetId, ReactElement> = {
  license: <LicensePage />,
  readme: <ReadmePage />,
  'version-history': <VersionHistoryPage />,
  definitions: <DefinitionsPage />,
  questions: <QuestionsPage />,
  'damage-scenarios': <DamageScenariosPage />,
  'attack-steps': <AttackStepsPage />,
  assumptions: <AssumptionsPage />,
  countermeasures: <CountermeasuresPage />,
  documentation: <DocumentationPage />,
  questionnaire: <QuestionnairePage />,
  'ds-overview': <DSOverviewPage />,
  risks: <RisksPage />,
  mitigation: <MitigationPage />,
  'risk-treatment': <RiskTreatmentPage />,
  'result-summary': <ResultSummaryPage />,
  'annex-i-1-2-report': <AnnexI12ReportPage />,
  tracing: <TracingPage />,
  tasks: <TasksPage />,
  'quality-indicators': <QualityIndicatorsPage />,
  'json-export': <JsonExportPage />,
  'user-information': <UserInformationPage />,
  'profile-definitions': <ProfileDefinitionsPage />,
  helper: <HelperPage />,
};
