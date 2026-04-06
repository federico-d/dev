# QuBA Macro Sprint 1 Parity Matrix

| Area | Workbook source sheet | Code files/components | Current status | Known gap | Parity test | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation | Documentation | `src/features/documentation/DocumentationForm.tsx`, `src/domain/catalogs/documentation-fields.ts` | Partial parity baseline | Full CRA user information still pending | `src/test/features/documentation-form.test.tsx` | Required metadata validation active |
| Questions | Questions | `src/domain/catalogs/questions.ts`, `src/pages/questions/QuestionsPage.tsx` | **Baseline aligned** | Minor wording refinements may remain | `src/test/domain/questions-catalog-parity.test.ts` | Real QI/QA texts, QA10a/10b and QA11a/11b split |
| Questionnaire | Questionnaire | `src/features/questionnaire/*`, `src/pages/questionnaire/QuestionnairePage.tsx` | **Baseline aligned** | Some per-question help text may be enriched later | `src/test/features/questionnaire-page.test.tsx` | Real text rendering and rule-driven warnings |
| Definitions | Definitions | `src/domain/catalogs/definitions.ts`, `src/pages/definitions/DefinitionsPage.tsx` | **Baseline aligned** | EASE parity still iterative | `src/test/domain/definitions-catalog.test.ts` | Risk matrix corrected to workbook |
| Damage Scenarios | Damage Scenarios | `src/domain/catalogs/damage-rules.ts`, `src/domain/engines/damage-engine.ts` | Partial | Full workbook mapping in next sprints | `src/test/engines/damage-engine.test.ts` | Kept stable for downstream compatibility |
| Attack Steps | Attack Steps | `src/domain/catalogs/attack-steps.ts`, `src/domain/engines/activation-engine.ts` | Partial | Complete attack path parity deferred | `src/test/engines/activation-engine.test.ts` | Out of scope for this sprint |
| Risks | Risks | `src/domain/engines/risk-engine.ts`, `src/pages/risks/RisksPage.tsx` | Partial with corrected matrix | Full workbook risk linking deferred | `src/test/engines/risk-engine.test.ts` | Matrix exactness now enforced |
| Mitigation | Mitigation | `src/domain/engines/mitigation-engine.ts`, `src/pages/mitigation/MitigationPage.tsx` | Partial | Complete mitigation parity deferred | `src/test/features/sprint-3b-mitigation-page.test.tsx` | Kept build-safe only |
| Risk Treatment | Risk Treatment | `src/pages/risk-treatment/RiskTreatmentPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Tracing | Tracing | `src/pages/tracing/TracingPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Result Summary | Result Summary | `src/pages/result-summary/ResultSummaryPage.tsx` | Placeholder | Full implementation deferred | Smoke only | Out of scope |
| Annex I 1.2 Report | Annex I 1.2 Report | `src/pages/annex-i-1-2-report/AnnexI12ReportPage.tsx` | Placeholder | Real report generation deferred | Smoke only | Out of scope |
| Quality Indicators | Quality Indicators | `src/domain/engines/quality-engine.ts`, `src/pages/quality-indicators/QualityIndicatorsPage.tsx` | Partial aligned to sprint scope | Additional cross-sheet checks deferred | `src/test/engines/quality-engine.test.ts` | Includes QA2/QA6 and QA20/QA21 checks |
| JSON | JSON | `src/pages/json-export/JsonExportPage.tsx` | Placeholder | Real export deferred | Smoke only | Out of scope |
| User Information | User Information | `src/pages/user-information/UserInformationPage.tsx` | Placeholder | Real form deferred | Smoke only | Out of scope |
| Profile Definitions | Profile Definitions | `src/pages/profile-definitions/ProfileDefinitionsPage.tsx`, `src/parity/fixtures.ts` | Partial baseline | No import/apply workflow yet | `src/test/parity/parity-fixtures-smoke.test.ts` | Baseline fixtures introduced |
| Helper | Helper | `src/pages/helper/HelperPage.tsx` | Placeholder | Helper diagnostics deferred | Smoke only | Out of scope |
