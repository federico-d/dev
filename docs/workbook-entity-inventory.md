# QuBA Workbook Entity Inventory

## Sheet list
License, README, Version History, Definitions, Questions, Documentation, Questionnaire, Damage Scenarios, DS Overview, Attack Steps, Assumptions, Countermeasures, Risks, Mitigation, Risk Treatment, Result Summary, Annex I 1.2 Report, Tracing, Tasks, Quality Indicators, JSON, User Information, Profile Definitions, Helper.

## Main static entities
- Question definitions (QI1-16, QA1-21 including QA10a/QA10b and QA11a/QA11b).
- Definitions catalogs: Damage Levels, RAP thresholds, Risk Levels, Risk Matrix, EASE scales, QA18/QA19 scales.
- Assumptions catalog with typed effects (`noEffect`, `scopeReduction`, `damageTransformation`, `attackStepConstraint`, `operationalConstraint`, `outputOnly`).
- Countermeasures catalog with EASE deltas, forced minimum RAP, annex mappings, and explicit data-quality flags.
- Attack-step catalog AS1-AS41 with typed linking hints, quality flags, workbook notes and base EASE vectors.

## Main derived entities
- Base damage scenarios generated from damage-rules and questionnaire answers.
- Final damage scenarios after transformation layer driven by active assumptions.
- Damage category aggregation (MAX by C/I/A/F) over final in-scope scenarios.
- Attack-step activation + RAP with activation metadata/adjustments.
- Typed AS↔DS linking resolution (question/category driven with explicit fallback tracking).
- Preliminary typed AttackPath model (`sourceStrategy`, notes, path id, target scenarios).
- Risk rows generated from applicable AS + applicable DS + preliminary paths (not cartesian as primary strategy).
- Mitigation preview (planned controls only).
- Quality indicators and validation maps.

## Known calculation rules (current baseline)
- Damage levels: Immaterial(1), Low(2), Medium(3), High(4), Critical(5).
- RAP thresholds: 0 Basic, 10 Enhanced-Basic, 14 Moderate, 20 High, 25 Beyond High.
- Risk matrix from Definitions catalog (No Risk excluded from matrix; applied when AS inactive).
- Damage transformation layer supports assumption-driven exclusions/reductions (not final parity complete).
- Quality checks baseline: unanswered, missing details, missing rationale, QA2/QA6 consistency, QA20 > QA21.

## Known quality checks
- Metadata completeness.
- Questionnaire completeness and rationale/detail requirements.
- QA inconsistency checks (gateway/internet mismatch; lifetime vs support).
- Mitigation parse/selection consistency checks (planned controls).

## Known final outputs
- Available now: enriched assumptions/countermeasures catalogs, transformed damage-scenarios layer, workbook-oriented attack-step catalog/activation/linking, typed preliminary risk paths and evolved risks register page.
- Deferred to next macro sprints: mitigation parity completeness, risk treatment, tracing, result summary, annex report, JSON export, user information output, final cross-sheet quality, final global parity.
