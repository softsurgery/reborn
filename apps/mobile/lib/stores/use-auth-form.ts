import { create } from "zustand";

interface AuthManager {
  username: string;
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  confirmPassword: string;
  set: (
    attribute: keyof Omit<AuthManager, "set" | "isAuthenticated" | "reset">,
    value: string
  ) => void;
  isAuthenticated: () => boolean;
  reset: () => void;
  resetErrors: () => void;
}

const AuthManagerDefaults: Omit<
  AuthManager,
  "set" | "isAuthenticated" | "reset" | "resetErrors"
> = {
  username: "",
  email: "",
  emailError: "",
  passwordError: "",
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
  resetErrors: () => {
    set((state) => ({
      ...state,
      emailError: "",
      passwordError: "",
    }));
  },
}));
