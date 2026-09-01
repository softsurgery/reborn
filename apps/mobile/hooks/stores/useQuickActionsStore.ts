import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type QuickActionId =
  | "myJobs"
  | "requests"
  | "savedJobs"
  | "reviews"
  | "viewed";

interface QuickActionsState {
  activeIds: QuickActionId[];
  isEditMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  reorderActions: (newOrder: QuickActionId[]) => void;
  addAction: (id: QuickActionId) => void;
  removeAction: (id: QuickActionId) => void;
}

const DEFAULT_ACTIVE_IDS: QuickActionId[] = [
  "myJobs",
  "requests",
  "savedJobs",
  "reviews",
  "viewed",
];

export const useQuickActionsStore = create<QuickActionsState>()(
  persist(
    (set) => ({
      activeIds: DEFAULT_ACTIVE_IDS,
      isEditMode: false,
      setEditMode: (isEditMode) => set({ isEditMode }),
      reorderActions: (newOrder) => set({ activeIds: newOrder }),
      addAction: (id) =>
        set((state) => ({
          activeIds: [...state.activeIds, id],
        })),
      removeAction: (id) =>
        set((state) => ({
          activeIds: state.activeIds.filter((activeId) => activeId !== id),
        })),
    }),
    {
      name: "quick-actions-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ activeIds: state.activeIds }),
    },
  ),
);
