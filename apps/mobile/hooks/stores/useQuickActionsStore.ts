import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface QuickActionsState {
  activeIds: string[];
  isEditMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  reorderActions: (newOrder: string[]) => void;
  addAction: (id: string) => void;
  removeAction: (id: string) => void;
}

const DEFAULT_ACTIVE_IDS: string[] = [
  "work",
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
