import { create } from "zustand";

interface FinanceState {
  isAuthenticatedInSession: boolean;
  detailsVisible: boolean;
  setAuthenticatedInSession: (authenticated: boolean) => void;
  setDetailsVisible: (visible: boolean) => void;
  resetSession: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  isAuthenticatedInSession: false,
  detailsVisible: false,
  setAuthenticatedInSession: (authenticated) =>
    set({ isAuthenticatedInSession: authenticated }),
  setDetailsVisible: (visible) => set({ detailsVisible: visible }),
  resetSession: () =>
    set({ isAuthenticatedInSession: false, detailsVisible: false }),
}));
