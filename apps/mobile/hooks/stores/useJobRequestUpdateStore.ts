import { setDeepValue } from "@/lib/object.lib";
import { create } from "zustand";
import { UpdateJobRequestDto } from "~/types";

interface JobRequestUpdateData {
  updateDto: UpdateJobRequestDto;
  rawProposedPrice: string;
  errors: Record<string, string[]>;
}

export interface JobRequestUpdateStore extends JobRequestUpdateData {
  set: <K extends keyof JobRequestUpdateData>(name: K, value: JobRequestUpdateData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: JobRequestUpdateData = {
  updateDto: {
    message: undefined,
    proposedPrice: undefined,
  },
  rawProposedPrice: "",
  errors: {},
};

export const useJobRequestUpdateStore = create<JobRequestUpdateStore>((set) => ({
  ...initialState,
  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value,
    }));
  },
  setNested: (path, value) => {
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");
    set((state) => {
      const updatedRoot = setDeepValue(
        { ...(state[rootKey as keyof JobRequestUpdateData] as any) },
        nestedPath,
        value,
      );
      return {
        ...state,
        [rootKey]: updatedRoot,
      };
    });
  },
  reset: () => {
    set({ ...initialState });
  },
}));
