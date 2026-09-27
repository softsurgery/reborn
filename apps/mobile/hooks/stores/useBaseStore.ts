import { StateCreator } from "zustand";
import { setDeep } from "@/lib/object.lib";

export type BaseActions<T> = {
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  setNested: (path: string, value: any) => void;
  reset: () => void;
};

export function createBaseSlice<TState extends object>(initialState: TState) {
  const base = structuredClone(initialState);

  const slice: StateCreator<TState & BaseActions<TState>> = (set) => ({
    ...base,

    set: (key, value) =>
      set((state) => ({
        ...state,
        [key]: value,
      })),

    setNested: (path, value) =>
      set((state) => setDeep({ ...state }, path, value)),

    reset: () => set(() => structuredClone(base)),
  });

  return slice;
}
