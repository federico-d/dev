# QuBA Workbook Entity Inventory (Macro Sprint 1 Baseline)

## Sheet list
License, README, Version History, Definitions, Questions, Documentation, Questionnaire, Damage Scenarios, DS Overview, Attack Steps, Assumptions, Countermeasures, Risks, Mitigation, Risk Treatment, Result Summary, Annex I 1.2 Report, Tracing, Tasks, Quality Indicators, JSON, User Information, Profile Definitions, Helper.

## Main static entities
- Question definitions (QI1-16, QA1-21 including QA10a/QA10b and QA11a/QA11b).
- Definitions catalogs: Damage Levels, RAP thresholds, Risk Levels, Risk Matrix, EASE scales.
- Assumptions and Countermeasures catalogs (partial parity).
- Sheet metadata registry.

## Main derived entities
- Damage scenarios derived from questionnaire answers.
- Attack-step activation and RAP.
- Preliminary risks from RAP x Damage matrix.
- Mitigation net-risk projections.
- Quality indicators and validation maps.

## Known calculation rules (implemented baseline)
- RAP thresholds: 0 Basic, 10 Enhanced-Basic, 14 Moderate, 20 High, 25 Beyond High.
- Risk matrix lookup strictly from Definitions catalog.
- No Risk assigned only when attack step is inactive.
- Questionnaire validation: unanswered, missing details, missing rationale, QA2/QA6 consistency, QA20 > QA21 warning.

## Known quality checks
- Required metadata completeness.
- Unanswered questions.
- Missing details/rationale according to question rules.
- QA2 Internet-facing gateway with QA6 = No inconsistency.
- Lifetime/support duration consistency.

## Known final outputs
- Current baseline outputs: risks table, mitigation view, quality indicators.
- Deferred outputs: Annex report, tracing, risk treatment decision tables, production JSON export.
