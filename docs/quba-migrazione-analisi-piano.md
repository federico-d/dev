# QuBA – Piano di migrazione operativo da workbook Excel a webapp React

## 1) Obiettivo e perimetro
Questo documento estende il piano precedente con un **blueprint operativo** per migrare `QuBA-libre.xlsx` verso webapp React + Tailwind + Vite, preservando la **semantica di calcolo** del workbook.

> Vincolo fase corrente: analisi e pianificazione, **senza sviluppo applicativo**.

## 2) Contesto CRA (stato al 6 aprile 2026)
- Regolamento: **(UE) 2024/2847 – Cyber Resilience Act**.
- In vigore: **10 dicembre 2024**.
- Obblighi principali applicabili: **11 dicembre 2027**.
- Obblighi di reporting (Art. 14): **11 settembre 2026**.
- Disposizioni su organismi di valutazione (specifiche parti): **11 giugno 2026**.

## 3) Fonti di verità e regole di precedenza
1. Workbook `.xlsx` (comportamento osservabile).
2. Documenti QuBA di business logic.
3. Specifiche QuBA funzionali.

In caso di conflitto, prevale la **parità comportamentale workbook-first**.

---

## 4) Workbook forensics e implicazioni
- Sheet: **24**.
- Hidden: **User Information**, **Profile Definitions**, **Helper**.
- Formule: **10.311**.
- Defined names: **48**.
- Named LAMBDA: **45**.
- Formula-heavy: `Risks`, `Result Summary`, `Questionnaire`, `README`, `Countermeasures`.

### Implicazioni architetturali
- Vietato dipendere da esecuzione formule Excel in runtime browser.
- Obbligo di porting logico in **domain engines TypeScript puri**.
- Hidden sheets da mantenere come route advanced/debug.

---

## 5) Principi architetturali vincolanti
1. **Single canonical state** (store unico).
2. **Cataloghi immutabili** separati da dati analisi mutabili.
3. **No business logic nei componenti UI**.
4. Derivati solo via selector/engine deterministici.
5. **Parity harness** obbligatorio per KPI e workflow chiave.

---

## 6) Modello dominio dettagliato

### 6.1 Entità statiche (cataloghi)

#### QuestionDefinition
Campi:
- `id`, `kind`, `group`, `section`, `order`
- `label`, `helpText`
- `answer1Type`, `answer1Options`
- `hasAnswer2`, `answer2Label`, `answer2Type`, `answer2Options`
- `detailsRequiredWhen`, `rationaleRequiredWhen`, `inactiveWhen`, `tags`

Esempi ID: `QI1..QI16`, `QA1..QA21`.

#### DamageRule
Campi:
- `questionId`, `answerValue`, `category`, `damageLevelLabel`, `damageLevelValue`, `notes`

#### AttackStepDefinition
Campi:
- `id`, `name`, `description`, `group`
- `activationRules`, `baseEase`
- `proposedCountermeasureIds`, `proposedAssumptionIds`, `additionalAssumptionIds`
- `damageScenarioRefs`, `notes`

#### CountermeasureDefinition
Campi:
- `id`, `name`, `type`, `stakeholder`, `reference`, `description`
- `easeDelta`, `forcedMinimumRap`, `annexMappings`
- `isDefault`, `isConfigurable`

#### AssumptionDefinition
Campi:
- `id`, `name`, `stakeholder`, `reference`, `description`
- `effects`, `annexMappings`, `damageTransformations`

#### RiskMatrixDefinition
Campi:
- `rapLabel`, `damageLevelValue`, `riskLevelLabel`, `riskLevelValue`

### 6.2 Entità transazionali (stato analisi)

#### DocumentationState
Campi:
- `toeName`, `author`, `pmContact`, `rdContact`, `css`, `csts`, `version`, `changeHistory`
- `manufacturerName`, `manufacturerAddress`, `manufacturerEmail`, `vulnerabilityContact`
- `sbomUrl`, `euDeclarationUrl`

#### QuestionnaireAnswer
Campi:
- `questionId`, `answer1`, `answer2`, `rationale`, `updatedAt`

#### MitigationSelection
Campi:
- `attackStepId`, `rawInput`, `parsedItems`
- `selectedCountermeasureIds`, `selectedAssumptionIds`
- `forcedMinimumRap`, `validationErrors`

#### RiskRecord
Campi:
- `riskId`, `attackPath`, `attackStepIds`, `damageScenarioIds`
- `damageLevel`, `factorExplanation`, `rap`, `riskLevel`
- `nRap`, `nRiskLevel`, `tRap`, `tRiskLevel`
- `dominant`, `highestRiskWithThisAs`

#### RiskTreatmentEntry
Campi:
- `riskId`, `proposal`, `manualTreatment`, `decision`, `rationale`, `comment`

#### TracingEntry
Campi:
- `riskId`, `plannedItems`, `confirmedItems`, `deltaMissingItems`, `remainingRiskLevel`

### 6.3 Entità derivate

#### DamageScenario
Campi:
- `id`, `sourceQuestionIds`, `category`, `damageLevel`, `transformedDamageLevel`
- `transformedScenarioIds`, `comment`, `active`

#### AttackStepInstance
Campi:
- `id`, `active`, `inactiveReasons`, `baseEase`, `rap`
- `damageScenarioIds`, `proposedCountermeasureIds`, `proposedAssumptionIds`

#### QualityIndicator
Campi:
- `id`, `title`, `severity`, `count`, `details`, `sheetRefs`

#### AnnexRequirementStatus
Campi:
- `letter`, `requirementText`, `status`, `implementedByIds`, `notes`

---

## 7) Contratti di calcolo (engine contracts)

### 7.1 Damage level
- Funzione: `computeDamageCategories(answers, damageRules)`
- Formula: `DL_category = max(map(answer -> damageLevelValue))`
- Note:
  - enum numerico 1..5 per confronto;
  - mantenere label testuale;
  - stage separato per transformations da assumptions.

### 7.2 Activation rules
- Funzione: `computeAttackStepActivation(answers, attackStepDefinitions)`
- Formula: `active = not(any(inactiveRuleMatches))`
- Regola: AS inattivo => No Risk.

### 7.3 RAP
- Funzione: `classifyRap(sumEase)`
- Formula: `sum = ET + EX + KT + WO + EQ`
- Soglie attese: 0 Basic, 10 Enhanced-Basic, 14 Moderate, 20 High, 25 Beyond High.

### 7.4 Risk matrix
- Funzione: `computeRiskLevel(rap, damageLevel, active)`
- Regola: matrice 5x5 RAP x DL, con override No Risk quando `active=false`.

### 7.5 Attack paths
- Funzione: `computeDominantPaths(paths)`
- Regola: `RAP_path = max(RAP_AS_i)`; percorso dominante = `min(RAP_path)`.

### 7.6 Mitigation
- Funzione: `computeNetRap(baseEase, selectedCountermeasures, forcedMinimumRap)`
- Regola:
  - CM aumentano EASE;
  - assumptions trasformano/eliminano DS senza cambiare RAP base;
  - `N-RAP = max(classify(base + deltas), forcedMinimumRap)`.

### 7.7 Tracing
- Funzione: `computeTracedRisk(planned, confirmed, baseEase, damageLevel)`
- Regola: T-RAP usa solo misure confermate.

### 7.8 Quality indicators
- Funzione: `computeQualityIndicators(state)`
- Include: unanswered, missing details/rationale, QA2/QA6 inconsistency, lifetime/support mismatch, coverage treatment ecc.

### 7.9 Annex report
- Funzione: `computeAnnexReport(activeItems, risks, answers)`
- Nota: alcune lettere Annex richiedono regole composte (non semplice “presenza ID”).

### 7.10 JSON export
- Funzione: `buildExportJson(state)`
- Output: serializzazione di Questionnaire, Risk Treatment, Result Summary.

---

## 8) Mappatura Excel → React (sheet-by-sheet)
Principio: sheet = route, formule = engine/selectors, tabelle statiche = cataloghi immutable.

| Sheet | Tipo web | Fonte stato | Motori | Componenti principali |
|---|---|---|---|---|
| Documentation | editable_form | metadata | - | DocumentationForm, MetadataStatusCard |
| Questionnaire | editable_form | questionnaire | quality-engine (base) | QuestionnaireSectionRenderer, QuestionRow, QuestionProgressBar |
| Definitions | readonly_catalog | catalogs | - | DefinitionsTabs, RiskMatrixHeatmap, ScaleTable |
| Damage Scenarios | derived_table | computed | damage-engine | DamageScenarioTable, ScenarioTransformationBadge |
| Attack Steps | derived_table | computed | activation-engine, rap-engine | AttackStepTable, EaseFactorCell |
| Risks | derived_table | computed | attack-path-engine, risk-engine | RiskRegisterTable, RiskMatrixInlineBadge, AttackPathPanel |
| Mitigation | editable_derived_table | mitigations | mitigation-engine | MitigationRow, MitigationParserInput, MitigationSuggestionPanel |
| Risk Treatment | editable_derived_table | riskTreatment | treatment-engine | RiskTreatmentTable, DecisionSelect, RationaleEditor |
| Tracing | editable_derived_table | tracing | tracing-engine | TracingCompareTable, ConfirmedItemsSelector |
| Result Summary | derived_summary | computed | result-summary-engine | ActiveItemsTable, StakeholderBadge |
| Annex I 1.2 Report | derived_report | computed | annex-engine | AnnexComplianceTable, RequirementStatusBadge |
| Quality Indicators | derived_dashboard | computed | quality-engine | QualityIndicatorCards, IssueDetailsDrawer |
| JSON | derived_export | computed | json-export-engine | JsonViewer, CopyExportButton |
| User Information | editable_plus_derived | metadata+computed | user-information-engine | UserInformationChecklist, GeneratedInstructionBlocks |
| Profile Definitions | fixture_loader | fixtures | - | ProfileLoader, FixtureDiffPanel |
| Helper | advanced_debug | computed | helper-counts-selectors | CounterCards, ParityDebugPanel |

---

## 9) Strategia parity con Excel

### 9.1 Obiettivo
Dimostrare che, a parità di input, la webapp produce output allineati al workbook su KPI/casi chiave.

### 9.2 Livelli di parity
- **L1 Catalog parity**: cardinalità e contenuto strutture statiche.
- **L2 Formula parity**: equivalenza risultati motori (DL, activation, RAP, risk matrix, N/T-RAP).
- **L3 Workflow parity**: equivalenza end-to-end tra pagine/output principali.

### 9.3 Fixture minime
- `empty-template`
- `profile-a`
- `no-connectivity`
- `internet-facing-config`
- `update-disabled`

### 9.4 Tooling suggerito
Script:
1. extract workbook metadata;
2. extract named ranges/tables;
3. build normalized fixtures;
4. compare TS outputs vs workbook snapshots.

Artefatti:
- `parity-report.json`
- `parity-report.html`

---

## 10) Backlog tecnico fine-grained

### Epic 1 – Foundation
- RouteRegistry unico.
- SheetMetadata centralizzato.
- Shell con sidebar + advanced toggle.
- Template placeholder condiviso.
- Store persistente.

### Epic 2 – Catalog extraction
- Questions JSON typed.
- Definitions + risk matrix.
- Attack Steps catalog.
- Assumptions catalog.
- Countermeasures catalog.
- Flag item incompleti/configurabili (es. CM2a).

### Epic 3 – Domain engine
- Enums stabili.
- Engine: damage, activation, RAP, risk.
- Parser mitigation input.
- Engine: tracing, annex, quality.

### Epic 4 – UI business
- Questionnaire schema renderer.
- Risk register data grid.
- Mitigation parser + validation.
- Treatment grid con rationale required.
- Quality dashboard con deep links.

### Epic 5 – Reporting
- Annex table.
- Result Summary.
- JSON export viewer.
- User Information builder.
- Snapshot export/import.

### Epic 6 – Hardening
- Unit test per engine.
- Integration flow tests.
- Playwright regression su fixture.
- Performance checks tabelle grandi.
- Error boundaries + dirty-state protection.

---

## 11) Ambiguità e decision log bloccante
- **X-01** Attack Path RAP: formula esplicita prioritaria.
- **X-02** Conteggio attack steps: baseline funzionale AS1–AS41, verificare helper row tecnica.
- **X-03** Conteggi unanswered: replicare formula workbook.
- **X-04** Delta EASE completi: estrazione strutturata workbook-first.

---

## 12) Rischi di migrazione e mitigazioni
1. **R-01** Traduzione incompleta LAMBDA/named formulas.
   - Mitigazione: matrice `formula -> engine -> test`.
2. **R-02** Mix cataloghi statici e stato utente.
   - Mitigazione: separazione immutable/mutable.
3. **R-03** Focus su look Excel invece che semantica.
   - Mitigazione: parity funzionale come DoD.
4. **R-04** Scarsa explainability per utenti business.
   - Mitigazione: ogni vista derivata mostra “calculated from”.
5. **R-05** Parametri CM incompleti.
   - Mitigazione: configurazione separata + segnalazioni Quality/Tasks.

---

## 13) Definition of Done globale

### Funzionale
- Ogni sheet workbook ha route dedicata.
- Ogni calcolo chiave è centralizzato in engine TS.
- Ogni output primario workbook è riprodotto in webapp.

### Tecnica
- Nessuna formula business nella UI.
- Copertura test significativa su domain engines.
- Persistenza stabile + fixture riproducibili.

### Parity
- `empty-template` e `profile-a` allineati su KPI chiave.
- Verifica esplicita su risk matrix, RAP thresholds, activation rules, JSON export.

### UX
- Navigazione più veloce del workbook.
- Validazioni in tempo reale.
- Deep links tra pagine correlate.

---

## 14) Piano sprint consolidato (2 settimane ciascuno)
- **Sprint 1**: foundation + route complete + documentation/questionnaire + quality base.
- **Sprint 2**: cataloghi + damage/activation + DS overview.
- **Sprint 3**: RAP + attack paths + risks.
- **Sprint 4**: mitigation + result summary.
- **Sprint 5**: treatment + tracing + annex + tasks + user information.
- **Sprint 6**: json export + helper/profile + parity harness + hardening.

---

## 15) Prossimi output consigliati
1. JSON operativo con shape completa store Zustand + selectors.
2. Breakdown Sprint 1 in task giornalieri con dipendenze.

---

## 16) Cataloghi TypeScript operativi (blueprint implementativo)
Obiettivo: portare i contenuti statici workbook in cataloghi versionati/testabili, separati dallo stato utente.

### 16.1 File map cataloghi
- `src/domain/catalogs/questions.ts` → catalogo master QI/QA renderizzabile.
- `src/domain/catalogs/documentation-fields.ts` → campi metadata Documentation + User Information.
- `src/domain/catalogs/definitions.ts` → Damage levels, EASE, RAP thresholds, risk matrix, scale QA18/QA19.
- `src/domain/catalogs/damage-rules.ts` → mapping QI answer → categoria danno → livello.
- `src/domain/catalogs/attack-steps.ts` → AS1-AS41 con activation rules/base EASE/riferimenti CM/A.
- `src/domain/catalogs/assumptions.ts` → catalogo A* con effect model e Annex mapping.
- `src/domain/catalogs/countermeasures.ts` → catalogo C*/CM* con easeDelta, forced RAP semantics.
- `src/domain/catalogs/annex-requirements.ts` → testi Annex I 1.2 lettere a-m.
- `src/domain/catalogs/sheet-metadata.ts` → nav/advanced/status/dependencies per 24 sheet.

### 16.2 Shape raccomandata `QuestionDefinition`
Campi:
- `id: string`
- `kind: 'QI' | 'QA'`
- `group: string`
- `section: string`
- `order: number`
- `title: string`
- `subtitle: string | null`
- `helpText: string | null`
- `answer1Type: 'boolean' | 'singleSelect' | 'text' | 'duration' | 'enum'`
- `answer1Options: QuestionOption[]`
- `hasAnswer2: boolean`
- `answer2Label: string | null`
- `answer2Type: 'singleSelect' | 'text' | 'duration' | null`
- `answer2Options: QuestionOption[]`
- `detailsRequiredWhen: QuestionCondition[]`
- `rationaleRequiredWhen: QuestionCondition[]`
- `tags: string[]`
- `sourceSheet: 'Questions' | 'Questionnaire'`

Esempi minimi:
- `QI2` (singleSelect, rationale required se answer1 valorizzata).
- `QA20` (duration, lifetime prevista prodotto).

### 16.3 Shape `DocumentationFieldDefinition`
Campi:
- `id`, `label`
- `group: 'core' | 'contacts' | 'release' | 'cra-user-info'`
- `required: boolean`
- `fieldType: 'text' | 'email' | 'textarea' | 'date' | 'url'`
- `placeholder: string | null`
- `helpText: string | null`

Campi minimi obbligatori Sprint 1:
- `toeName`, `author`, `pmContact`, `rdContact`, `css`, `csts`, `version`, `changeHistory`.

### 16.4 Shape `DefinitionsCatalog`
Campi:
- `damageLevels`, `riskLevels`, `rapThresholds`, `riskMatrix`
- `easeScales`, `qa18ProductionScale`, `qa19SupplyChainScale`

Must include:
- damage 1..5 = Immaterial/Low/Medium/High/Critical;
- soglie RAP 0/10/14/20/25;
- risk matrix 5x5 RAP x DL.

### 16.5 Shape `DamageRule`
Campi:
- `questionId`, `answerValue`
- `category: 'C' | 'I' | 'A' | 'F'`
- `damageLevelLabel: 'Immaterial' | 'Low' | 'Medium' | 'High' | 'Critical'`
- `damageLevelValue: 1 | 2 | 3 | 4 | 5`

Esempi:
- `QI2 + Yes—Personal data (significant) -> C, High (4)`
- `QI10 + Yes—Life-threatening injury -> I, Critical (5)`

### 16.6 Shape `AttackStepDefinition`
Campi:
- `id`, `title`, `description`, `group`
- `baseEase: { elapsedTime, expertise, knowledgeOfToe, windowOfOpportunity, equipment }`
- `inactiveWhen: QuestionConditionGroup[]`
- `proposedCountermeasureIds`, `proposedAssumptionIds`, `additionalAssumptionIds`
- `annexTags`, `notes`

Esempi riferimento:
- `AS15` con proposta `CM1`.
- `AS29` con proposta `C32` e assumption `A22`.

### 16.7 Shape `AssumptionDefinition`
Campi:
- `id`, `name`, `reference`, `stakeholder`, `description`
- `effects: AssumptionEffect[]`
- `annexMappings: string[]`
- `status: 'default' | 'potentialAdditional' | 'activeByTemplate' | 'conditional'`

### 16.8 Shape `CountermeasureDefinition`
Campi:
- `id`, `name`, `reference`, `stakeholder`
- `type: 'Default' | 'Additional' | 'Baseline' | 'CM'`
- `description`
- `easeDelta`
- `forcedMinimumRap: 'Basic' | 'Enhanced-Basic' | 'Moderate' | 'High' | 'Beyond High' | null`
- `annexMappings`
- `configFlags: { requiresOemConfiguration, incompleteInTemplate }`

Regola speciale:
- `CM2a` deve risultare `requiresOemConfiguration=true` e `incompleteInTemplate=true`.

### 16.9 Shape `SheetDefinition`
Campi:
- `id`, `sheetName`, `route`, `navGroup`
- `advanced: boolean`
- `status: 'implemented' | 'partial' | 'placeholder'`
- `description`
- `dependsOn: string[]`

---

## 17) Shape completa store Zustand (`useAnalysisStore`)
Principio: lo store contiene solo **document state + UI state**; tutto il resto è derivato da selector/engines puri.

### 17.1 Stato
- `analysisMeta`
  - `analysisId`, `createdAt`, `updatedAt`, `templateVersion`, `dirty`
- `metadata`
  - campi Documentation + User Information (es. toeName, author, contacts, sbomUrl, euDeclarationUrl)
- `questionnaire`
  - `byId: Record<QuestionId, QuestionnaireAnswer>`
- `mitigations`
  - `byAttackStepId: Record<AttackStepId, MitigationSelection>`
- `riskTreatment`
  - `byRiskId: Record<RiskId, RiskTreatmentEntry>`
- `tracing`
  - `byRiskId: Record<RiskId, TracingEntry>`
- `ui`
  - `advancedMode`, `activeRoute`, `sidebarCollapsed`
  - `filters: { questionnaireSection, riskLevel, showOnlyIssues }`

### 17.2 Actions
- Metadata:
  - `setMetadataField(fieldId, value)`
  - `patchMetadata(partial)`
  - `resetMetadata()`
- Questionnaire:
  - `setQuestionAnswer1(questionId, value)`
  - `setQuestionAnswer2(questionId, value)`
  - `setQuestionRationale(questionId, value)`
  - `patchQuestion(questionId, partial)`
  - `clearQuestion(questionId)`
- Mitigations:
  - `setMitigationRawInput(attackStepId, rawInput)`
  - `setMitigationParsed(attackStepId, parsedSelection)`
  - `clearMitigation(attackStepId)`
- Risk treatment:
  - `setRiskTreatmentField(riskId, field, value)`
  - `clearRiskTreatment(riskId)`
- Tracing:
  - `setTracingEntry(riskId, partial)`
  - `clearTracingEntry(riskId)`
- UI:
  - `toggleAdvancedMode()`
  - `setActiveRoute(route)`
  - `setSidebarCollapsed(value)`
  - `setFilter(key, value)`
  - `resetUiFilters()`
- Documento:
  - `loadSnapshot(snapshot)`
  - `resetAnalysis()`
  - `markSaved()`

### 17.3 Persist strategy
- Persistere: document state + `ui.advancedMode`.
- Escludere da persist:
  - dati derivati,
  - validation state temporaneo,
  - `activeRoute`.
- Storage key: `quba-analysis-v1`.

---

## 18) Selector contracts
Regola: ogni selector derivato deve essere puro, memoizzabile e indipendente dalla UI.

### 18.1 Foundational selectors (Sprint 1)
1. `selectMetadataCompleteness(metadata)`
   - Output:
     - `missingRequiredFields: string[]`
     - `completionPercent: number`
2. `selectQuestionnaireProgress(questionnaire.byId, questionsCatalog)`
   - Output:
     - `answeredCount`, `totalCount`
     - `bySection: Record<section, { answered, total }>`
3. `selectQualityIndicatorsBasic(metadata, questionnaire.byId)`
   - Output: `QualityIndicator[]`
4. `selectVisibleSheets(ui.advancedMode, sheetMetadata)`
   - Output: `SheetDefinition[]`

### 18.2 Future selectors (Sprint 2+)
- `selectDamageCategories`
- `selectDamageScenarios`
- `selectAttackSteps`
- `selectRisks`
- `selectMitigationRows`
- `selectResultSummary`
- `selectAnnexReport`
- `selectJsonExport`

---

## 19) Contratto Quality Indicators (Sprint 1)

### 19.1 Da implementare in Sprint 1
1. `QI-META-MISSING`
   - Conta campi Documentation obbligatori vuoti.
2. `QI-ANSWERS-MISSING`
   - Conta domande con `answer1` vuota.
3. `QI-DETAILS-MISSING`
   - Se `detailsRequiredWhen` matcha, `answer2` deve esistere.
4. `QI-RATIONALE-MISSING`
   - Se `rationaleRequiredWhen` matcha, rationale non vuota.
5. `QI-QA2-QA6-INCONSISTENT`
   - Se `QA2='Internet-facing gateway'` e `QA6='No'`, segnalare incoerenza.
6. `QI-LIFETIME-SUPPORT`
   - Se `QA20 > QA21`, segnalare anomalia.

### 19.2 Deferred (Sprint successivi)
- Risk table too small.
- Selected mitigations ≠ proposed.
- Inactive AS con mitigazioni.
- Risks non presenti in Risk Treatment.
- Undefined/Duplicate Risk IDs.
- Treatment senza rationale.
- A&C table too small.
- C27 attivo con QA11a=No.

---

## 20) Sprint 1 – task giornalieri (10 giorni lavorativi)

### Giorno 1 – Bootstrap e convenzioni
- Vite React TS, Tailwind, Router, Zustand, RHF, Zod, Vitest, RTL, Playwright.
- `tsconfig` strict.
- Struttura cartelle base.

### Giorno 2 – Routing e shell workbook
- `sheet-metadata.ts` con 24 route.
- `router.tsx`, `WorkbookShellLayout`, sidebar per gruppi.
- Advanced toggle e gestione hidden sheets.

### Giorno 3 – Domain base e store
- `types.ts`, `enums.ts`.
- Stato Zustand + persist + actions base.
- Selector `selectVisibleSheets`.

### Giorno 4 – Cataloghi Documentation/Questions
- `documentation-fields.ts`.
- `questions.ts` con QI1..QI16, QA1..QA21.
- Option sets + condizioni `detailsRequiredWhen`/`rationaleRequiredWhen`.

### Giorno 5 – Documentation page
- `DocumentationForm` con RHF+Zod.
- Binding store e summary completezza.

### Giorno 6 – Questionnaire renderer
- `QuestionnaireSectionRenderer`, `QuestionRow`.
- Supporto `answer1`, `answer2`, rationale.

### Giorno 7 – UX/validazioni
- Helper text, validazione inline.
- Progress by section.
- Stati empty/error.

### Giorno 8 – Quality engine base
- `quality-engine.ts`, `selectQualityIndicatorsBasic`.
- `/quality-indicators` con cards + dettagli problemi.

### Giorno 9 – Placeholder e navigazione
- Placeholder strutturati per pagine fuori scope Sprint 1.
- Header con status badge e dipendenze.

### Giorno 10 – Test/hardening
- Unit test quality engine.
- Integration test Documentation+Questionnaire.
- E2E navigazione + persistenza.
- Build finale e bugfix.

---

## 21) Dipendenze implementative
- `sheet-metadata.ts` → `router.tsx`, shell, placeholder pages.
- `types.ts` + `enums.ts` → store, cataloghi, forms, quality-engine.
- `questions.ts` → Questionnaire renderer + quality-engine.
- `documentation-fields.ts` → DocumentationForm + quality-engine.

---

## 22) Anti-pattern da evitare
1. **AP-01** Domande hardcoded in JSX.
   - Correzione: catalogo + renderer schema-driven.
2. **AP-02** Salvataggio dati derivati nello store.
   - Correzione: solo selectors puri.
3. **AP-03** Logica dominio dentro RHF.
   - Correzione: RHF/Zod=input validation, engine=business rules.
4. **AP-04** Hidden sheets senza route.
   - Correzione: route advanced sempre presenti.
5. **AP-05** Stringhe sparse route/IDs/labels.
   - Correzione: centralizzazione enum/type literals.

---

## 23) Criteri Done Sprint 1 ultra-specifici
- Sidebar naviga tutte le 24 sheet.
- 3 sheet advanced nascoste con `advancedMode=false`, visibili con `advancedMode=true`.
- Documentation salva/ripristina almeno 8 campi core.
- Questionnaire mostra QI1..QI16 e QA1..QA21 in ordine/sezioni.
- Ogni riga supporta `answer1`; dove previsto `answer2`; rationale sempre disponibile.
- Quality engine espone live i 6 controlli Sprint 1.
- `/quality-indicators` mostra count + dettagli per controllo.
- Placeholder presenti/coerenti per Risks, Mitigation, Risk Treatment, Tracing, Annex, JSON, User Information, Profile Definitions, Helper.
- Build e test minimi passati.

---

## 24) Prossima estensione logica raccomandata
1. Definire contenuti reali completi di `questions.ts` (option set + condizioni precise).
2. Definire `damage-rules.ts` completo workbook-aligned.
3. Definire `definitions.ts` con risk matrix/soglie RAP definitive.
4. Avviare parity harness minimo su `empty-template` e `profile-a`.
