import { setDeepValue } from "@/lib/object.lib";
import { create } from "zustand";
import { CreateJobRequestDto } from "~/types";

interface JobApplyData {
  createDto: CreateJobRequestDto;
  rawProposedPrice: string;
  errors: Record<string, string[]>;
}

export interface JobApplyStore extends JobApplyData {
  set: <K extends keyof JobApplyData>(name: K, value: JobApplyData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: JobApplyData = {
  createDto: {
    jobId: "",
    message: undefined,
    proposedPrice: undefined,
  },
  rawProposedPrice: "",
  errors: {},
};

export const useJobApplyStore = create<JobApplyStore>((set) => ({
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
        { ...(state[rootKey as keyof JobApplyData] as any) },
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
