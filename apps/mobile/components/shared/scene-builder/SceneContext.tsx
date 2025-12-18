import React from "react";
import { DynamicScene } from "./types";

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------
export interface SceneStore {
  scenes: Record<string, DynamicScene | undefined>;
  setScenes: React.Dispatch<
    React.SetStateAction<Record<string, DynamicScene | undefined>>
  >;

  push: (id: string, scene: DynamicScene) => void;
  pop: (id: string) => void;
  get: (id: string) => DynamicScene | undefined;
}

// -------------------------------------------------------------
// No-op defaults (prevent undefined crashes)
// -------------------------------------------------------------
const noop = () => {};

const defaultStore: SceneStore = {
  scenes: {},
  setScenes: () => {},
  push: noop,
  pop: noop,
  get: () => undefined,
};

// -------------------------------------------------------------
// Context
// -------------------------------------------------------------
export const SceneContext = React.createContext<SceneStore>(defaultStore);

// -------------------------------------------------------------
// Provider
// -------------------------------------------------------------
interface SceneProviderProps {
  value: {
    scenes: Record<string, DynamicScene | undefined>;
    setScenes: React.Dispatch<
      React.SetStateAction<Record<string, DynamicScene | undefined>>
    >;
  };
  children: React.ReactNode;
}

export const SceneProvider = ({ value, children }: SceneProviderProps) => {
  const { scenes, setScenes } = value;

  // push()
  const push = React.useCallback(
    (id: string, scene: DynamicScene) => {
      setScenes((prev) => ({
        ...prev,
        [id]: scene,
      }));
    },
    [setScenes]
  );

  // pop()
  const pop = React.useCallback(
    (id: string) => {
      setScenes((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    },
    [setScenes]
  );

  // get()
  const get = React.useCallback((id: string) => scenes[id], [scenes]);

  // Memoize context value to avoid re-renders
  const storeValue = React.useMemo(
    () => ({
      scenes,
      setScenes,
      push,
      pop,
      get,
    }),
    [scenes, setScenes, push, pop, get]
  );

  return (
    <SceneContext.Provider value={storeValue}>{children}</SceneContext.Provider>
  );
};

// -------------------------------------------------------------
// Hook
// -------------------------------------------------------------
export const useSceneContext = () => React.useContext(SceneContext);
