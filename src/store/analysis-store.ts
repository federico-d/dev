import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AnalysisSnapshot, AnalysisStoreState, MetadataState, MitigationSelection } from '../domain/types';
import { PERSIST_KEY } from './persist';

type AnalysisActions = {
  toggleAdvancedMode: () => void;
  setActiveRoute: (route: string) => void;
  setSidebarCollapsed: (value: boolean) => void;
  setMetadataField: <K extends keyof MetadataState>(fieldId: K, value: string) => void;
  patchMetadata: (partial: Partial<MetadataState>) => void;
  setQuestionAnswer1: (questionId: string, value: string) => void;
  setQuestionAnswer2: (questionId: string, value: string) => void;
  setQuestionRationale: (questionId: string, value: string) => void;
  setMitigationRawInput: (attackStepId: string, rawInput: string) => void;
  clearMitigation: (attackStepId: string) => void;
  patchMitigationEntry: (attackStepId: string, partial: Partial<MitigationSelection>) => void;
  resetAnalysis: () => void;
  loadSnapshot: (snapshot: AnalysisSnapshot) => void;
};

export type AnalysisStore = AnalysisStoreState & AnalysisActions;

const now = () => new Date().toISOString();

const createInitialState = (): AnalysisStoreState => ({
  analysisMeta: {
    analysisId: crypto.randomUUID(),
    createdAt: now(),
    updatedAt: now(),
    templateVersion: 'quba-libre-v1',
    dirty: false,
  },
  metadata: {},
  questionnaire: { byId: {} },
  mitigations: { byAttackStepId: {} },
  riskTreatment: { byRiskId: {} },
  tracing: { byRiskId: {} },
  ui: {
    advancedMode: false,
    activeRoute: '/license',
    sidebarCollapsed: false,
    filters: {
      questionnaireSection: null,
      riskLevel: null,
      showOnlyIssues: false,
    },
  },
});

export const useAnalysisStore = create<AnalysisStore>()(
  persist<AnalysisStore>(
    (set) => {
      const actions: AnalysisActions = {
        toggleAdvancedMode: () =>
          set((state) => ({
            ui: { ...state.ui, advancedMode: !state.ui.advancedMode },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        setActiveRoute: (route: string) =>
          set((state) => ({
            ui: { ...state.ui, activeRoute: route },
          })),
        setSidebarCollapsed: (value: boolean) =>
          set((state) => ({
            ui: { ...state.ui, sidebarCollapsed: value },
          })),
        setMetadataField: (fieldId, value) =>
          set((state) => ({
            metadata: { ...state.metadata, [fieldId]: value },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        patchMetadata: (partial) =>
          set((state) => ({
            metadata: { ...state.metadata, ...partial },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        setQuestionAnswer1: (questionId, value) =>
          set((state) => ({
            questionnaire: {
              byId: {
                ...state.questionnaire.byId,
                [questionId]: { ...state.questionnaire.byId[questionId], questionId, answer1: value },
              },
            },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        setQuestionAnswer2: (questionId, value) =>
          set((state) => ({
            questionnaire: {
              byId: {
                ...state.questionnaire.byId,
                [questionId]: { ...state.questionnaire.byId[questionId], questionId, answer2: value },
              },
            },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        setQuestionRationale: (questionId, value) =>
          set((state) => ({
            questionnaire: {
              byId: {
                ...state.questionnaire.byId,
                [questionId]: { ...state.questionnaire.byId[questionId], questionId, rationale: value },
              },
            },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        setMitigationRawInput: (attackStepId, rawInput) =>
          set((state) => ({
            mitigations: {
              byAttackStepId: {
                ...state.mitigations.byAttackStepId,
                [attackStepId]: {
                  ...state.mitigations.byAttackStepId[attackStepId],
                  attackStepId,
                  rawInput,
                },
              },
            },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        clearMitigation: (attackStepId) =>
          set((state) => {
            const next = { ...state.mitigations.byAttackStepId };
            delete next[attackStepId];
            return {
              mitigations: { byAttackStepId: next },
              analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
            };
          }),
        patchMitigationEntry: (attackStepId, partial) =>
          set((state) => ({
            mitigations: {
              byAttackStepId: {
                ...state.mitigations.byAttackStepId,
                [attackStepId]: {
                  ...state.mitigations.byAttackStepId[attackStepId],
                  attackStepId,
                  ...partial,
                },
              },
            },
            analysisMeta: { ...state.analysisMeta, updatedAt: now(), dirty: true },
          })),
        resetAnalysis: () =>
          set(() => ({
            ...createInitialState(),
            ...actions,
          })),
        loadSnapshot: (snapshot: AnalysisSnapshot) =>
          set(() => ({
            ...snapshot,
            ...actions,
          })),
      };

      return {
        ...createInitialState(),
        ...actions,
      };
    },
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
