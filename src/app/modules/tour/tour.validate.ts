import z from "zod";

export const TourTypesZodScehma = z.object({
    name: z
            .string("Tour type name must be string")
            .min(3, "Must be at least 3 char!")
            .max(200, "Must be at least 200 char!")
})


export const TourZodScehma = z.object({
    title: z
            .string("Tour title must be string")
            .min(5, "Tour title must be minimum 5 char")
            .max(250, "Too long title, should be maximum 250 char"),
    description: z
                    .string("Description must be string")
                    .min(5, "Description must be minumum 5 char.")
                    .optional(),
    image: z
            .array(z.string("Image must be string"))
            .optional(),
    location: z
                .string("Location must be string")
                .optional(),
    costFrom: z
                .number("Cost must be number")
                .optional(),
    startDate: z
                .string("startDate must be date type")
                .transform((val) => new Date(val))
                .optional(),
    endDate: z
                .string("endDate must be Date type")
                 .transform((val) => new Date(val))
                .optional(),
    includes: z
                .array(z.string("includes element must be string"))
                .optional(),
    excluded: z
                .array(z.string("excluded element must be string"))
                .optional(),
    amenities: z
                .array(z.string("amenities element must be string"))
                .optional(),
    tourPlan: z
                .array(z.string("tourPlan element must be string"))
                .optional(),
    maxGuest: z
                .number("Max Guets must be number")
                .optional(),
    minAge: z
             .number("minAge must be number")
             .optional(),
    division: z
                .string("division must be string"),
    tourType: z
                .string("tourType be string")
                
})
export const UpdateTourZodScehma = z.object({
    title: z
            .string("Tour title must be string")
            .min(5, "Tour title must be minimum 5 char")
            .max(250, "Too long title, should be maximum 250 char")
            .optional(),

    description: z
                    .string("Description must be string")
                    .min(5, "Description must be minumum 5 char.")
                    .optional(),
    image: z
            .array(z.string("Image must be string"))
            .optional(),
    location: z
                .string("Location must be string")
                .optional(),
    costFrom: z
                .number("Cost must be number")
                .optional(),
    startDate: z
                .string("startDate must be date type")
                .transform((val) => new Date(val))
                .optional(),
    endDate: z
                .string("endDate must be Date type")
                 .transform((val) => new Date(val))
                .optional(),
    includes: z
                .array(z.string("includes element must be string"))
                .optional(),
    excluded: z
                .array(z.string("excluded element must be string"))
                .optional(),
    amenities: z
                .array(z.string("amenities element must be string"))
                .optional(),
    tourPlan: z
                .array(z.string("tourPlan element must be string"))
                .optional(),
    maxGuest: z
                .number("Max Guets must be number")
                .optional(),
    minAge: z
             .number("minAge must be number")
             .optional(),
    division: z
                .string("division must be string")
                .optional(),
    tourType: z
                .string("tourType be string")
                .optional()
                
})