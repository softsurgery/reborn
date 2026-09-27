import { z } from "zod";
import { JobDifficulty, JobStyle } from "../job-management";

type Translate = (key: string) => string;

export const getDefineJobValidationSchemas = (t: Translate) =>
  z.object({
    title: z
      .string({
        error: t("form.validation.titleRequired"),
      })
      .min(10, { message: t("form.validation.titleMin") })
      .max(255, { message: t("form.validation.titleMax") }),

    description: z.string({
      error: t("form.validation.descriptionRequired"),
    }),

    price: z
      .number({
        error: t("form.validation.priceRequired"),
      })
      .positive({ message: t("form.validation.pricePositive") }),
    longitude: z
      .number({
        error: t("form.validation.longitudeNumber"),
      })
      .optional(),

    latitude: z
      .number({
        error: t("form.validation.latitudeNumber"),
      })
      .optional(),
  });

export const getDetailedJobValidationSchemas = (t: Translate) =>
  z.object({
    tagIds: z
      .array(
        z.number({
          error: t("form.validation.tagIdNumber"),
        }),
        {
          error: t("form.validation.tagsRequired"),
        },
      )
      .min(1, { message: t("form.validation.tagsMin") }),

    categoryId: z
      .number({
        error: t("form.validation.categoryRequired"),
      })
      .positive({ message: t("form.validation.categoryPositive") }),

    style: z.nativeEnum(JobStyle, {
      error: () => ({ message: t("form.validation.invalidStyle") }),
    }),

    difficulty: z.nativeEnum(JobDifficulty, {
      error: () => ({ message: t("form.validation.invalidDifficulty") }),
    }),
  });

export const getImagesJobValidationSchemas = (t: Translate) =>
  z.object({
    uploads: z
      .array(
        z.object({
          uploadId: z.number({
            error: t("form.validation.uploadIdRequired"),
          }),
        }),
        {
          error: t("form.validation.uploadsRequired"),
        },
      )
      .min(1, { message: t("form.validation.imagesMin") }),
  });

