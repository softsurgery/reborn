import { create } from "zustand";

interface AuthManager {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  set: (attribute: keyof Omit<AuthManager, "set" | "isAuthenticated" | "reset"  >, value: string) => void;
  isAuthenticated: () => boolean;
  reset: () => void;
}

const AuthManagerDefaults: Omit<AuthManager, "set" | "isAuthenticated" | "reset"> = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const useAuthManager = create<AuthManager>((set) => ({
  ...AuthManagerDefaults,
  set: (attribute: keyof Omit<AuthManager, "set">, value: string) => {
    set((state) => ({
      ...state,
      [attribute]: value,
    }));
  },
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  },
  reset: () => {
    set(AuthManagerDefaults);
  },
}));