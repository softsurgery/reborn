import { create } from "zustand";

interface UpdateProfileData {
  uid?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isMale?: boolean;
  dateOfBirth?: Date;
  region?: string;
  nationalId?: string;
  isPublic?: boolean;
}

interface UpdateProfileManager extends UpdateProfileData {
  set: (attribute: keyof UpdateProfileData, value: any) => void;
  getUpdateProfile: () => UpdateProfileData;
  setUpdateProfile: (data: UpdateProfileData) => void;
  reset: () => void;
}

const updateProfileDataInitials: UpdateProfileData = {
  uid: "",
  name: "",
  surname: "",
  email: "",
  phone: "",
  bio: "",
  isMale: true,
  dateOfBirth: new Date(),
  region: "",
  nationalId: "",
  isPublic: true,
};

export const useUpdateProfileManager = create<UpdateProfileManager>(
  (set, get) => ({
    ...updateProfileDataInitials,
    set: (attribute: keyof UpdateProfileData, value: string) => {
      set((state) => ({
        ...state,
        [attribute]: value,
      }));
    },
    getUpdateProfile: (): UpdateProfileData => {
      const data = get();
      return {
        uid: data.uid,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        isMale: data.isMale,
        dateOfBirth: data.dateOfBirth,
        region: data.region,
        nationalId: data.nationalId,
        isPublic: data.isPublic,
      };
    },
    setUpdateProfile: (data: UpdateProfileData) => {
      set((state) => ({
        ...state,
        ...data,
      }));
    },
    reset: () => {
      set(updateProfileDataInitials);
    },
  })
);
