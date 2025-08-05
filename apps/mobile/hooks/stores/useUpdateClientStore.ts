import { create } from "zustand";
import { setDeepValue } from "~/lib/object.lib";
import { UpdateClientDto } from "~/types";

interface UpdateClientData {
  updateDto: UpdateClientDto;
  errors: Record<string, string[]>;
}

export interface UpdateClientStore extends UpdateClientData {
  set: <K extends keyof UpdateClientData>(
    name: K,
    value: UpdateClientData[K]
  ) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: UpdateClientData = {
  updateDto: {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    isActive: true,
    password: "",
    email: "",
    profile: {
      phone: "",
      cin: "",
      bio: "",
      gender: undefined,
      isPrivate: true,
      regionId: 0,
    },
  },
  errors: {},
};

export const useUpdateClientStore = create<UpdateClientStore>((set, get) => ({
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
        { ...state[rootKey as keyof UpdateClientData] },
        nestedPath,
        value
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
