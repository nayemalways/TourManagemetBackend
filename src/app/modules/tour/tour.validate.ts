import z from "zod";

export const TourTypesZodScehma = z.object({
    name: z
            .string("Tour type name must be string")
            .min(3, "Must be at least 3 char!")
            .max(200, "Must be at least 200 char!")
})