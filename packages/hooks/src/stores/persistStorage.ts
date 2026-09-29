import type { StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

/** Web: localStorage. React Native: AsyncStorage. */
export function getPersistStorage(): StateStorage {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("__reborn_persist_probe__", "1");
      localStorage.removeItem("__reborn_persist_probe__");
      return localStorage;
    } catch {
      // RN can expose a broken localStorage stub — fall through to AsyncStorage.
    }
  }

  try {
    return require("@react-native-async-storage/async-storage").default;
  } catch {
    return noopStorage;
  }
}
