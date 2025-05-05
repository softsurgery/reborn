import { create } from "zustand";

interface AuthManager {
  name: string;
  nameError: string;
  surname: string;
  surnameError: string;
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
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
  name: "",
  nameError: "",
  surname: "",
  surnameError: "",
  email: "",
  emailError: "",
  passwordError: "",
  password: "",
  confirmPassword: "",
  confirmPasswordError: "",
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
      nameError: "",
      surnameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    }));
  },
}));
