import { z } from "zod";

const dateOrNull = z.preprocess(
  (value) =>
    value === null || value === "" ? null : new Date(value as string),
  z.date().nullable(),
);

const baseEducationSchema = z.object({
  title: z
    .string({
      error: "education.validation.titleTooShort",
    })
    .min(2, { message: "education.validation.titleTooShort" })
    .max(255, { message: "education.validation.titleTooLong" }),

  institution: z
    .string({
      error: "education.validation.institutionTooShort",
    })
    .min(2, { message: "education.validation.institutionTooShort" })
    .max(100, { message: "education.validation.institutionTooLong" }),

  startDate: dateOrNull
    .refine((date) => date === null || date <= new Date(), {
      message: "education.validation.startDateInFuture",
    })
    .optional(),

  endDate: dateOrNull.optional(),

  description: z
    .string()
    .max(500, { message: "education.validation.descriptionTooLong" })
    .optional(),
});

const dateRefinements = (schema: typeof baseEducationSchema) =>
  schema
    .refine(
      (data) => {
        if (data.endDate && data.startDate) {
          return data.endDate > data.startDate;
        }
        return true;
      },
      { message: "education.validation.endDateBeforeStart", path: ["endDate"] },
    )
    .refine(
      (data) => {
        if (data.endDate) {
          return data.endDate <= new Date();
        }
        return true;
      },
      { message: "education.validation.endDateInFuture", path: ["endDate"] },
    );

const createEducationSchema = dateRefinements(baseEducationSchema);
const updateEducationSchema = dateRefinements(baseEducationSchema);

export { baseEducationSchema, createEducationSchema, updateEducationSchema };
