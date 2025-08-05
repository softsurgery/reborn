import { z } from "zod";

export const updateClientSchema = z.object({
  firstName: z
    .string({
      error: "First name is required.",
    })
    .min(3, { message: "First name must be at least 3 characters long." })
    .max(50, { message: "First name must be at most 50 characters long." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First name must contain only letters and spaces.",
    }),
  lastName: z
    .string({
      error: "Last name is required.",
    })
    .min(3, { message: "Last name must be at least 3 characters long." })
    .max(50, { message: "Last name must be at most 50 characters long." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name must contain only letters and spaces.",
    }),
  email: z
    .string({
      error: "Email is required.",
    })
    .min(3, { message: "Email must be at least 3 characters long." })
    .max(255, { message: "Email must be at most 255 characters long." })
    .email({ message: "Email must be a valid email address." }),
  dateOfBirth: z
    .preprocess(
      (value) =>
        value === null || value === "" ? null : new Date(value as string),
      z.union([z.date(), z.null()]).refine(
        (birthDate) => {
          if (!birthDate) return true;

          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const isBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
              today.getDate() >= birthDate.getDate());

          return age > 18 || (age === 18 && isBirthdayPassed);
        },
        { message: "A user must be at least 18 years old." }
      )
    )
    .optional(),
});

export const updateProfileSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(value);
      },
      {
        message: "Phone number must be a valid international format.",
      }
    ),
  bio: z
    .string()
    .max(255, {
      message: "Bio must be at most 255 characters long.",
    })
    .optional(),
  regionId: z
    .number({
      message: "Region is required.",
    })
    .optional(),
  isPrivate: z.boolean().optional(),
});
