import z from "zod";


export const DivisionZodSchema = z.object({
  name: z
            .string("Division name must type String")
            .min(3, "Division at least 3 char")
            .max(100, "Division should be maximum 100 char"),
    thumbnail: z
            .string("Thumbnail must type String")
            .optional(),
    description: z
            .string("Slug must type String")
           .optional()
})

export const UpdateDivisionZodSchema = z.object({
  name: z
            .string("Division name must type String")
            .min(3, "Division at least 3 char")
            .max(100, "Division should be maximum 100 char")
            .optional(),
    thumbnail: z
            .string("Thumbnail must type String")
            .optional(),
    description: z
            .string("Slug must type String")
           .optional()
})