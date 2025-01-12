import { create } from "zustand";

interface UpdateProfileData {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date;
  nationalId?: string;
}

interface UpdateProfileManager extends UpdateProfileData {
  set: (attribute: keyof UpdateProfileData, value: any) => void;
  getUpdateProfile: () => UpdateProfileData;
  setUpdateProfile: (data: UpdateProfileData) => void;
  reset: () => void;
}

const updateProfileDataInitials: UpdateProfileData = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  bio: "",
  dateOfBirth: new Date(),
  nationalId: "",
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
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        dateOfBirth: data.dateOfBirth,
        nationalId: data.nationalId,
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
