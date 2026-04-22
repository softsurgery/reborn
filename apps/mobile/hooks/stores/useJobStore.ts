import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GalleryItem } from "~/components/shared/form-builder/GalleryPictureUploader";
import { setDeepValue } from "~/lib/object.lib";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "~/types";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto: UpdateJobDto;
  location: {
    latitude: number;
    longitude: number;
  };
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
  searchHistory: ResponseJobDto[];
  pictures: GalleryItem[];
}

export interface JobStore extends JobStoreData {
  set: <K extends keyof JobStoreData>(name: K, value: JobStoreData[K]) => void;
  setNested: <T>(path: string, value: T) => void;
  addJobToSearchHistory: (job: ResponseJobDto) => void;
  reset: () => void;
}

const initialState: JobStoreData = {
  createDto: {
    title: "",
    description: "",
    location: "",
    price: 0,
    tagIds: [],
    categoryId: undefined,
    style: undefined,
    difficulty: undefined,
    uploads: [],
  },
  location: {
    latitude: 0,
    longitude: 0,
  },
  updateDto: {
    title: "",
    description: "",
    price: 0,
    tagIds: [],
    categoryId: undefined,
    style: undefined,
    difficulty: undefined,
    uploads: [],
  },
  pictures: [],
  createDtoErrors: {},
  updateDtoErrors: {},
  searchHistory: [],
};

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
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
            { ...state[rootKey as keyof JobStoreData] },
            nestedPath,
            value,
          );
          return {
            ...state,
            [rootKey]: updatedRoot,
          };
        });
      },
      addJobToSearchHistory: (job) => {
        set((state) => {
          if (state.searchHistory.find((item) => item.id === job.id)) {
            return state;
          }
          const updatedSearchHistory = [...state.searchHistory, job];
          return {
            ...state,
            searchHistory: updatedSearchHistory,
          };
        });
      },
      reset: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "job-store", // key in localStorage
      partialize: (state) => ({ searchHistory: state.searchHistory }), // only persist searchHistory
    },
  ),
);
