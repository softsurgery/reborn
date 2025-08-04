import { z } from "zod";

export const requestSignInDtoSchema = z.object({
  email: z
    .string({
      error: "Email is required.",
    })
    .min(3, {
      message: "Email must be at least 3 characters long.",
    })
    .max(255, {
      message: "Email must be at most 255 characters long.",
    }),
  password: z
    .string({
      error: "Password is required.",
    })
    .min(8, {
      error: "Password must be at least 8 characters long.",
    })
    .max(32, {
      error: "Password must be at most 32 characters long.",
    }),
});
