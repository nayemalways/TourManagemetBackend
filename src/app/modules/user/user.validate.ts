import z from "zod";
import { IsActive, Role } from "./user.interface";

   export const UserZodSchema = z.object({
        name: z
            .string({ error: "Name should be string" })
            .min(2, { message: "Name must be at least 3 characters"})
            .max(50, {message: "Name too long. Maximum length 50"}),
        email: z
            .string()
            .email(),
        password : z.
                    string()
                    .min(6, {message: "Password must be at least 6 length"})
                    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/, {message: "Password must be at least 1 uppercase character, 1 special character, 1 number and at least 6 character"})
                    .optional(),
        phone : z
                .string({message: "Phone number should be string"})
                .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {message: "Not a valid number"})
                .optional(),
        address: z
                .string({message: "Address should be string"})
                .max(200, { message: "Address is too long, maximum 200 character"})
                .optional()
    })


   export const UserUpdateZodSchema = z.object({
        name: z.string({ error: "Name should be string" })
            .min(2, { message: "Name must be at least 3 characters"})
            .max(50, {message: "Name too long. Maximum length 50"})
            .optional(),
        phone : z
                .string({message: "Phone number should be string"})
                .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {message: "Not a valid number"})
                .optional(),
        address: z
                .string({message: "Address should be string"})
                .max(200, { message: "Address is too long, maximum 200 character"})
                .optional(),
        isDeleted: z.boolean({ message: "isDeleted must be true or false" }).optional(),
        isActive: z.enum(Object.values(IsActive) as [string]).optional(),
        isVerifid: z.boolean({ message: "isVerifid must be true or false" }).optional(),
        role: z.enum(Object.values(Role) as [string]).optional(),
    })





