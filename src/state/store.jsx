import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { stepOrder, getStepById } from "../data/steps";

const DEFAULT_PARAMS = {
  S0: 100,
  mu: 0.08,
  sigma: 0.2,
  T: 1,
  steps: 252,
  paths: 2000,
  seed: 0,
};

const initialState = {
  activeStepId: stepOrder[0],
  params: { ...DEFAULT_PARAMS },
  pinned: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_STEP":
      return { ...state, activeStepId: action.stepId };
    case "SET_PARAM":
      return { ...state, params: { ...state.params, [action.key]: action.value } };
    case "SET_PARAMS":
      return { ...state, params: { ...state.params, ...action.partial } };
    case "RESET_PARAMS":
      return { ...state, params: { ...DEFAULT_PARAMS } };
    case "PIN_STEP": {
      const already = state.pinned.some((p) => p.stepId === action.stepId);
      if (already) return state;
      const step = getStepById(action.stepId);
      if (!step) return state;
      return {
        ...state,
        pinned: [...state.pinned, { stepId: step.id, widgetKey: step.widgetKey, title: step.title }],
      };
    }
    case "UNPIN_STEP":
      return { ...state, pinned: state.pinned.filter((p) => p.stepId !== action.stepId) };
    case "CLEAR_PINNED":
      return { ...state, pinned: [] };
    case "HYDRATE":
      return { ...state, ...action.slice };
    default:
      return state;
  }
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hydrateFromHash = useCallback(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(hash));
      const slice = {};
      if (parsed.activeStepId) slice.activeStepId = parsed.activeStepId;
      if (parsed.params) slice.params = { ...DEFAULT_PARAMS, ...parsed.params };
      if (Array.isArray(parsed.pinnedStepIds)) {
        slice.pinned = parsed.pinnedStepIds.reduce((acc, id) => {
          const step = getStepById(id);
          if (step) acc.push({ stepId: step.id, widgetKey: step.widgetKey, title: step.title });
          return acc;
        }, []);
      }
      dispatch({ type: "HYDRATE", slice });
    } catch {
      // invalid hash, do nothing
    }
  }, []);

  const writeToHash = useCallback(() => {
    if (typeof window === "undefined") return;
    const payload = {
      activeStepId: state.activeStepId,
      params: state.params,
      pinnedStepIds: state.pinned.map((p) => p.stepId),
    };
    window.location.hash = encodeURIComponent(JSON.stringify(payload));
  }, [state]);

  useEffect(() => {
    hydrateFromHash();
  }, []);

  const setActiveStep = useCallback((stepId) => dispatch({ type: "SET_ACTIVE_STEP", stepId }), []);
  const setParam = useCallback((key, value) => dispatch({ type: "SET_PARAM", key, value }), []);
  const setParams = useCallback((partial) => dispatch({ type: "SET_PARAMS", partial }), []);
  const resetParams = useCallback(() => dispatch({ type: "RESET_PARAMS" }), []);
  const pinStep = useCallback((stepId) => dispatch({ type: "PIN_STEP", stepId }), []);
  const unpinStep = useCallback((stepId) => dispatch({ type: "UNPIN_STEP", stepId }), []);
  const clearPinned = useCallback(() => dispatch({ type: "CLEAR_PINNED" }), []);

  const value = {
    state,
    setActiveStep,
    setParam,
    setParams,
    resetParams,
    pinStep,
    unpinStep,
    clearPinned,
    hydrateFromHash,
    writeToHash,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}