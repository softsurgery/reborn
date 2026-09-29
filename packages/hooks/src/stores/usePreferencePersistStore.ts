import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistStorage } from "./persistStorage";

interface PreferencePersistData {
  language: "en" | "fr" | "ar" | "system";
  theme: "dark" | "light" | "system";
}

interface PreferencePersistStore extends PreferencePersistData {
  isReady: boolean;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setLanguage: (language: "en" | "fr" | "ar" | "system") => void;
  toggleTheme: () => void;
}

const preferencePersistStore: PreferencePersistData = {
  language: "system",
  theme: "system",
};

export const usePreferencePersistStore = create<PreferencePersistStore>()(
  persist(
    (set, get) => ({
      ...preferencePersistStore,
      isReady: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "preference-storage",
      storage: createJSONStorage(() => getPersistStorage()),
      onRehydrateStorage: () => () => {
        usePreferencePersistStore.setState({ isReady: true });
      },
    },
  ),
);

const markPreferencePersistReady = () => {
  usePreferencePersistStore.setState({ isReady: true });
};

if (usePreferencePersistStore.persist?.hasHydrated()) {
  markPreferencePersistReady();
} else {
  usePreferencePersistStore.persist?.onFinishHydration(
    markPreferencePersistReady,
  );
}
