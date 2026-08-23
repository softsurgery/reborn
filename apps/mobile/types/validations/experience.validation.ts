import { z } from "zod";
import { LocationTypes, WorkTypes } from "../user-management";

const baseExperienceSchema = z.object({
  title: z
    .string({
      error: "experience.validation.titleRequired",
    })
    .min(1, {
      message: "experience.validation.titleEmpty",
    })
    .max(255, {
      message: "experience.validation.titleTooLong",
    }),

  company: z
    .string({
      error: "experience.validation.companyRequired",
    })
    .min(1, {
      message: "experience.validation.companyEmpty",
    })
    .max(50, {
      message: "experience.validation.companyTooLong",
    }),

  startDate: z
    .preprocess(
      (value) =>
        value === null || value === "" ? null : new Date(value as string),
      z.date({
        message: "experience.validation.startDateRequired",
      }),
    )
    .refine(
      (date) => {
        if (!date) return false;
        return date <= new Date();
      },
      {
        message: "experience.validation.startDateInFuture",
      },
    ),

  location: z
    .string()
    .max(50, {
      message: "experience.validation.locationTooLong",
    })
    .optional(),

  workType: z.nativeEnum(WorkTypes, {
    error: "experience.validation.invalidWorkType",
  }),

  locationType: z.nativeEnum(LocationTypes, {
    error: "experience.validation.invalidLocationType",
  }),

  endDate: z
    .preprocess(
      (value) =>
        value === null || value === "" ? null : new Date(value as string),
      z.union([z.date(), z.null()]),
    )
    .optional(),

  description: z.string().optional(),
});

const dateRefinements = (schema: typeof baseExperienceSchema) =>
  schema
    .refine(
      (data) => {
        if (data.endDate && data.startDate) {
          return data.endDate > data.startDate;
        }
        return true;
      },
      {
        message: "experience.validation.endDateBeforeStart",
        path: ["endDate"],
      },
    )
    .refine(
      (data) => {
        if (data.endDate) {
          return data.endDate <= new Date();
        }
        return true;
      },
      {
        message: "experience.validation.endDateInFuture",
        path: ["endDate"],
      },
    );

const createExperienceSchema = dateRefinements(baseExperienceSchema);
const updateExperienceSchema = dateRefinements(baseExperienceSchema);

export { baseExperienceSchema, createExperienceSchema, updateExperienceSchema };
