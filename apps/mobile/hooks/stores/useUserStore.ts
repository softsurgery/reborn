import { create } from "zustand";
import { setDeepValue } from "~/lib/object.lib";
import {
  CreateEducationDto,
  CreateExperienceDto,
  ResponseEducationDto,
  ResponseExperienceDto,
  ResponseFollowCountsDto,
  ResponseFollowDto,
  ResponseUserDto,
  UpdateEducationDto,
  UpdateExperienceDto,
  UpdateUserDto,
} from "~/types";

interface UserData {
  response?: ResponseUserDto;
  updateDto: UpdateUserDto;
  updatePasswordDto: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  //experiences
  experiences?: ResponseExperienceDto[];
  responseExperience?: ResponseExperienceDto;
  createExperienceDto: CreateExperienceDto;
  updateExperienceDto: UpdateExperienceDto;

  //educations
  educations?: ResponseEducationDto[];
  responseEducation?: ResponseEducationDto;
  createEducationDto: CreateEducationDto;
  updateEducationDto: UpdateEducationDto;

  present: boolean;

  responseFollowCountsDto: ResponseFollowCountsDto;
  followers: ResponseFollowDto[];
  followings: ResponseFollowDto[];

  picture?: string;
  hasInitializedPicture: boolean;
  progress: number;
  errors: Record<string, string[]>;
  experienceErrors: Record<string, string[]>;
  educationErrors: Record<string, string[]>;
}

export interface UserStore extends UserData {
  set: <K extends keyof UserData>(name: K, value: UserData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  reset: () => void;
}

const initialState: UserData = {
  response: undefined,
  responseFollowCountsDto: {
    followers: 0,
    following: 0,
  },
  updatePasswordDto: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  createExperienceDto: {
    title: "",
    company: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  },
  updateExperienceDto: {
    title: "",
    company: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  },
  present: false,
  createEducationDto: {
    title: "",
    institution: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  },
  updateEducationDto: {
    title: "",
    institution: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
  },
  followers: [],
  followings: [],
  updateDto: {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    isActive: true,
    password: "",
    email: "",
    phone: "",
    cin: "",
    bio: "",
    gender: undefined,
    isPrivate: true,
    regionId: undefined,
  },
  picture: undefined,
  hasInitializedPicture: false,
  progress: 0,
  errors: {},
  experienceErrors: {},
  educationErrors: {},
};

import { createStore, useStore } from "zustand";
import React, { createContext, useContext, useRef } from "react";

export const createUserStore = () =>
  createStore<UserStore>((set) => ({
    ...initialState,
    set: (name, value) =>
      set((state) => ({
        ...state,
        [name]: value,
      })),
    setNested: (path: string, value: unknown) => {
      if (!path.includes(".")) {
        set((state) => ({
          ...state,
          [path]: value,
        }));
        return;
      }

      const [rootKey, ...restPath] = path.split(".");
      const nestedPath = restPath.join(".");

      set((state) => {
        const rootValue = state[rootKey as keyof UserData];
        if (typeof rootValue !== "object" || rootValue === null) {
          throw new Error(`Cannot set nested path on non-object: ${rootKey}`);
        }

        const updatedRoot = setDeepValue(
          { ...(rootValue as object) },
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

export const globalUserStore = createUserStore();

export const UserStoreContext = createContext<ReturnType<typeof createUserStore> | null>(null);

export const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof createUserStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }
  return React.createElement(UserStoreContext.Provider, { value: storeRef.current }, children);
};

export function useUserStore(): UserStore;
export function useUserStore<T>(selector: (state: UserStore) => T): T;
export function useUserStore<T>(selector?: (state: UserStore) => T) {
  const store = useContext(UserStoreContext) || globalUserStore;
  return useStore(store, selector as any);
}
