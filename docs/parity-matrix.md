# QuBA Macro Sprint Parity Matrix

| Area | Workbook source sheet | Code files/components | Current status | Known gap | Parity test | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation | Documentation | `src/features/documentation/DocumentationForm.tsx`, `src/domain/catalogs/documentation-fields.ts` | Baseline aligned | CRA user-information final content pending | `src/test/features/documentation-form.test.tsx` | Metadata and completeness active |
| Questions | Questions | `src/domain/catalogs/questions.ts`, `src/pages/questions/QuestionsPage.tsx` | Baseline aligned | Minor wording review only | `src/test/domain/questions-catalog-parity.test.ts` | QA10a/10b and QA11a/11b split |
| Questionnaire | Questionnaire | `src/features/questionnaire/*`, `src/pages/questionnaire/QuestionnairePage.tsx` | Baseline aligned | Richer per-question contextual help can be expanded | `src/test/features/questionnaire-page.test.tsx` | Workbook text fidelity in place |
| Definitions | Definitions | `src/domain/catalogs/definitions.ts`, `src/pages/definitions/DefinitionsPage.tsx` | Baseline aligned | RAP/risk linked workflows continue in later macro sprints | `src/test/domain/definitions-catalog.test.ts`, `src/test/engines/risk-engine.test.ts` | Risk matrix exactness locked |
| Assumptions catalog | Assumptions | `src/domain/catalogs/assumptions.ts`, `src/pages/assumptions/AssumptionsPage.tsx` | **Advanced in Macro Sprint 2** | Full text parity per row may need workbook-by-workbook wording pass | `src/test/domain/assumptions-catalog.test.ts`, `src/test/features/macro-sprint-2-pages.test.tsx` | Effect model and filters added |
| Countermeasures catalog | Countermeasures | `src/domain/catalogs/countermeasures.ts`, `src/pages/countermeasures/CountermeasuresPage.tsx` | **Advanced in Macro Sprint 2** | Some EASE deltas remain explicit assumptions flagged in catalog | `src/test/domain/countermeasures-catalog.test.ts`, `src/test/features/macro-sprint-2-pages.test.tsx` | CM2a explicitly incomplete/OEM-specific |
| Damage rules | Damage Scenarios | `src/domain/catalogs/damage-rules.ts` | **Advanced in Macro Sprint 2** | Fine-grained workbook row mapping can still be tightened | `src/test/domain/damage-rules-catalog.test.ts` | Scenario semantics expanded |
| Damage scenarios | Damage Scenarios | `src/domain/engines/damage-engine.ts`, `src/pages/damage-scenarios/DamageScenariosPage.tsx` | **Advanced in Macro Sprint 2** | AS↔DS linking remains partial by design | `src/test/engines/damage-engine.test.ts`, `src/test/features/macro-sprint-2-pages.test.tsx` | Transformation layer introduced |
| DS Overview | DS Overview | `src/pages/ds-overview/DSOverviewPage.tsx`, `src/components/damage/DamageCategorySummary.tsx` | **Advanced in Macro Sprint 2** | Final parity KPIs may evolve | `src/test/features/macro-sprint-2-pages.test.tsx` | Includes transformed/excluded summary |
| Attack Steps | Attack Steps | `src/domain/catalogs/attack-steps.ts`, `src/domain/engines/activation-engine.ts` | **Advanced in Macro Sprint 3** | Several AS literals still flagged `missingWorkbookLiteral` and require workbook text pass | `src/test/domain/attack-steps-catalog.test.ts`, `src/test/engines/activation-engine.test.ts` | QA10a/10b and QA11a/11b handled separately; AS40 constrained by QA11b=no |
| Risks | Risks | `src/domain/engines/risk-engine.ts`, `src/pages/risks/RisksPage.tsx` | **Advanced in Macro Sprint 3** | Dominating/multi-step workbook paths still open (single-step preliminary paths in place) | `src/test/engines/risk-engine.test.ts`, `src/test/features/risks-page.test.tsx` | AS↔DS typed linking + path sourceStrategy surfaced |
| Mitigation | Mitigation | `src/domain/engines/mitigation-engine.ts`, `src/pages/mitigation/MitigationPage.tsx` | Partial | Mitigation parity completeness pending | `src/test/engines/mitigation-engine.test.ts` | Out of Macro Sprint 2 scope |
| Risk Treatment | Risk Treatment | `src/pages/risk-treatment/RiskTreatmentPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Tracing | Tracing | `src/pages/tracing/TracingPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Result Summary | Result Summary | `src/pages/result-summary/ResultSummaryPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Annex I 1.2 Report | Annex I 1.2 Report | `src/pages/annex-i-1-2-report/AnnexI12ReportPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Quality Indicators | Quality Indicators | `src/domain/engines/quality-engine.ts`, `src/pages/quality-indicators/QualityIndicatorsPage.tsx` | Partial | Final cross-sheet checks deferred | `src/test/engines/quality-engine.test.ts` | Baseline checks active |
| JSON | JSON | `src/pages/json-export/JsonExportPage.tsx` | Placeholder | Real export deferred | Smoke only | Out of scope |
| User Information | User Information | `src/pages/user-information/UserInformationPage.tsx` | Placeholder | Real implementation deferred | Smoke only | Out of scope |
| Profile Definitions | Profile Definitions | `src/pages/profile-definitions/ProfileDefinitionsPage.tsx`, `src/parity/fixtures.ts` | Partial baseline | Loader/apply workflow pending | `src/test/parity/parity-fixtures-smoke.test.ts` | Baseline fixtures maintained |
| Helper | Helper | `src/pages/helper/HelperPage.tsx` | Placeholder | Debug diagnostics deferred | Smoke only | Out of scope |

## Explicitly open for next macro sprints
- Full mitigation parity and downstream Risk Treatment.
- Tracing and confirmed-controls flow.
- Result summary final workbook parity.
- Annex report generation.
- JSON export parity.
- User Information generation.
- Final cross-sheet quality model.
- Final global workbook parity closure.
