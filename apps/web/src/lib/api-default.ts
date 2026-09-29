import api from "./api";

export const BASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.BASE_URL;

export default api;
