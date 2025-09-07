import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PreferencePersistData {
  theme: "dark" | "light";
}

interface PreferencePersistStore extends PreferencePersistData {
  isReady: boolean;
  toggleTheme: () => void;
}

const preferencePersistStore: PreferencePersistData = {
  theme: "light",
};

let _set: (fn: Partial<PreferencePersistStore>) => void;

export const usePreferencePersistStore = create<PreferencePersistStore>()(
  persist(
    (set, get) => {
      _set = set;

      return {
        ...preferencePersistStore,
        isReady: false,
        toggleTheme: () =>
          set((state) => ({
            ...state,
            theme: state.theme === "light" ? "dark" : "light",
          })),
      };
    },
    {
      name: "preference-storage",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: () => {
        return () => {
          _set({ isReady: true });
        };
      },
    }
  )
);
