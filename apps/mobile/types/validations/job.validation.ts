import { z } from "zod";
import { JobDifficulty, JobStyle } from "../job-management";

export const defineJobValidationSchemas = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(10, { message: "Title must be at least 10 characters" })
    .max(255, { message: "Title must not exceed 255 characters" }),

  description: z.string({
    error: "Description is required",
  }),

  price: z
    .number({
      error: "Price is required",
    })
    .positive({ message: "Price must be greater than 0" }),
  longitude: z
    .number({
      error: "Longitude must be a number",
    })
    .optional(),

  latitude: z
    .number({
      error: "Latitude must be a number",
    })
    .optional(),
});

export const detailedJobValidationSchemas = z.object({
  tagIds: z
    .array(
      z.number({
        error: "Each tag ID must be a number",
      }),
      {
        error: "Tags are required",
      },
    )
    .min(1, { message: "At least one tag is required" }),

  categoryId: z
    .number({
      error: "Category is required",
    })
    .positive({ message: "Category ID must be positive" }),

  style: z.nativeEnum(JobStyle, {
    error: () => ({ message: "Invalid job style" }),
  }),

  difficulty: z.nativeEnum(JobDifficulty, {
    error: () => ({ message: "Invalid job difficulty" }),
  }),
});

export const imagesJobValidationSchemas = z.object({
  uploads: z
    .array(
      z.object({
        uploadId: z.number({
          error: "Upload ID is required",
        }),
      }),
      {
        error: "Uploads are required",
      },
    )
    .min(1, { message: "At least one image is required" }),
});
