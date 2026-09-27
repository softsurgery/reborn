import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createBaseSlice, BaseActions } from "./useBaseStore";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "~/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageFile } from "@/components/shared/form-builder/types";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto?: UpdateJobDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;

  images: ImageFile[];
  locationName?: string;

  uploads: { id?: number; file: File; progress: number }[];

  searchHistory: ResponseJobDto[];
}

export interface JobStore extends JobStoreData, BaseActions<JobStoreData> {
  addJobToSearchHistory: (job: ResponseJobDto) => void;
  setServerImage: (uri: string, serverId: number, progress: number) => void;
}

const initialState: JobStoreData = {
  createDto: {
    title: "",
    description: "",
    status: "Draft",
    price: undefined,
    pricingType: undefined,
    tagIds: [],
    categoryId: undefined,
    style: undefined,
    difficulty: undefined,
    uploads: [],
    latitude: undefined,
    longitude: undefined,
  },

  createDtoErrors: {},
  updateDtoErrors: {},
  searchHistory: [],
  images: [],
  locationName: "",

  uploads: [],
};

export const useJobStore = create<JobStore>()(
  persist(
    (set, get, api) => ({
      ...createBaseSlice<JobStoreData>(initialState)(set, get, api),

      addJobToSearchHistory: (job) => {
        const history = get().searchHistory;

        if (history.some((j) => j.id === job.id)) return;

        set({
          searchHistory: [job, ...history].slice(0, 20),
        });
      },

      setImageProgressById: (id: number, progress: number) => {
        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, progress } : img,
          ),
        }));
      },

      setServerImage: (uri: string, serverId: number, progress: number) => {
        set((state) => ({
          images: state.images.map((img) =>
            img.uri === uri ? { ...img, serverId, progress } : img,
          ),
        }));
      },
    }),
    {
      name: "job-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    },
  ),
);
