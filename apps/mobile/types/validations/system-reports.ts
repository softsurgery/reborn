import { z } from "zod";
import { BugVariant } from "../system-reports";

export const BugVariantEnum = z.enum(
  Object.values(BugVariant) as [string, ...string[]],
  {
    error: () => ({ message: "You must select a Bug Variant." }),
  }
);

export const createBugSchema = z.object({
  variant: BugVariantEnum,
  title: z
    .string({ error: "Title is required." })
    .min(10, { message: "Title must be at least 10 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." }),
  description: z
    .string({ error: "Description is required." })
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(1024, {
      message: "Description must be at most 1024 characters long.",
    }),
});
