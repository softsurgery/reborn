import { create } from "zustand";
import { setDeepValue } from "~/lib/object.lib";
import { ResponseClientDto, UpdateClientDto } from "~/types";

interface UpdateClientData {
  response?: ResponseClientDto;
  updateDto: UpdateClientDto;
  picture?: string;
  progress: number;
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
  picture: undefined,
  progress: 0,
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
setNested: (path: string, value: unknown) => {
    if (!path.includes(".")) {
      // No nesting — set directly
      set((state) => ({
        ...state,
        [path]: value,
      }));
      return;
    }

    // Nested path case
    const [rootKey, ...restPath] = path.split(".");
    const nestedPath = restPath.join(".");

    set((state) => {
      const rootValue = state[rootKey as keyof UpdateClientData];
      if (typeof rootValue !== "object" || rootValue === null) {
        throw new Error(`Cannot set nested path on non-object: ${rootKey}`);
      }

      const updatedRoot = setDeepValue(
        { ...(rootValue as object) },
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
