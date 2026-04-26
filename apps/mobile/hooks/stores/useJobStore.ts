import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createBaseSlice, BaseActions } from "./useBaseStore";
import { CreateJobDto, ResponseJobDto, UpdateJobDto } from "~/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageFile } from "@/components/shared/form-builder/types";

interface JobStoreData {
  response?: ResponseJobDto;
  createDto: CreateJobDto;
  updateDto: UpdateJobDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
  searchHistory: ResponseJobDto[];
  images: ImageFile[];
  locationName?: string;
}

export interface JobStore extends JobStoreData, BaseActions<JobStoreData> {
  addJobToSearchHistory: (job: ResponseJobDto) => void;
  setImageProgress: (uri: string, progress: number) => void;
  appendUploadId: (
    dto: "create" | "update",
    upload: { id?: number; uploadId: number },
  ) => void;
  updateImages: (dto: "create" | "update", newImages: ImageFile[]) => void;
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
  images: [],
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

      setImageProgress: (uri, progress) => {
        set((state) => ({
          ...state,
          images: state.images.map((image) =>
            image.uri === uri ? { ...image, progress } : image,
          ),
        }));
      },

      appendUploadId: (dto, upload) => {
        set((state) => ({
          ...state,
          [`${dto}Dto`]: {
            ...state[`${dto}Dto`],
            uploads: [...(state[`${dto}Dto`].uploads ?? []), upload],
          },
        }));
      },

      updateImages: (dto: "create" | "update", newImages: ImageFile[]) => {
        set((state) => {
          const oldImages = state.images;
          const oldUploads = state[`${dto}Dto`].uploads ?? [];

          const uploadMap = new Map<
            string,
            { id?: number; uploadId: number }
          >();
          oldImages.forEach((img, idx) => {
            const upload = oldUploads[idx];
            if (upload?.uploadId) uploadMap.set(img.id, upload);
          });

          const newUploads = newImages
            .map((img) => {
              const existingUpload = uploadMap.get(img.id);
              if (existingUpload) {
                return existingUpload;
              }
              return undefined;
            })
            .filter(Boolean) as { id?: number; uploadId: number }[];

          return {
            ...state,
            images: newImages,
            [`${dto}Dto`]: {
              ...state[`${dto}Dto`],
              uploads: newUploads,
            },
          };
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
