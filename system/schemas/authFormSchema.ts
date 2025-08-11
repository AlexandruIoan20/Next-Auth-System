import * as z from "zod";

export enum FormVariant { 
    LOGIN = "login", 
    REGISTER = "register", 
}; 

export const authFormSchema = z.object({ 
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long.")
        .optional()
        .or(z.literal("")), 
    email: z
        .string() 
        .email("Please enter a valid email address." ),
    password: z
        .string()
})

export type authFormValues = z.infer<typeof authFormSchema>; 