import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createBaseSlice, BaseActions } from "./useBaseStore";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "~/types";
import { GalleryItem } from "~/components/shared/form-builder/GalleryPictureUploader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto: UpdateJobDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
  searchHistory: ResponseJobDto[];
  pictures: GalleryItem[];
  locationName?: string;
}

export interface JobStore extends JobStoreData, BaseActions<JobStoreData> {
  addJobToSearchHistory: (job: ResponseJobDto) => void;
}

const initialState: JobStoreData = {
  createDto: {
    title: "",
    description: "",
    price: undefined,
    tagIds: [],
    categoryId: undefined,
    style: undefined,
    difficulty: undefined,
    uploads: [],
    latitude: undefined,
    longitude: undefined,
  },
  updateDto: {
    title: "",
    description: "",
    price: undefined,
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
  pictures: [],
  locationName: "",
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
