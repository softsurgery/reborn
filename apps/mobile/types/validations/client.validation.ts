import { z } from "zod";

export const updateClientSchema = z.object({
  firstName: z
    .string({
      error: "settings.account.screens.profile.validation.firstNameRequired",
    })
    .min(3, {
      message: "settings.account.screens.profile.validation.firstNameTooShort",
    })
    .max(50, {
      message: "settings.account.screens.profile.validation.firstNameTooLong",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message:
        "settings.account.screens.profile.validation.firstNameLettersOnly",
    }),
  lastName: z
    .string({
      error: "settings.account.screens.profile.validation.lastNameRequired",
    })
    .min(3, {
      message: "settings.account.screens.profile.validation.lastNameTooShort",
    })
    .max(50, {
      message: "settings.account.screens.profile.validation.lastNameTooLong",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message:
        "settings.account.screens.profile.validation.lastNameLettersOnly",
    }),
  email: z
    .string({
      error: "settings.account.screens.profile.validation.emailRequired",
    })
    .min(3, {
      message: "settings.account.screens.profile.validation.emailRequired",
    })
    .max(255, {
      message: "settings.account.screens.profile.validation.emailRequired",
    })
    .email({
      message: "settings.account.screens.profile.validation.emailInvalid",
    }),
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
        {
          message: "settings.account.screens.profile.validation.ageMin18",
        },
      ),
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
        message: "settings.account.screens.profile.validation.phoneInvalid",
      },
    ),
  bio: z
    .string()
    .max(255, {
      message: "settings.account.screens.profile.validation.bioTooLong",
    })
    .optional(),
  regionId: z
    .number({
      message: "settings.account.screens.profile.validation.regionRequired",
    })
    .optional(),
  gender: z.string().optional(),
  isPrivate: z.boolean().optional(),
});
