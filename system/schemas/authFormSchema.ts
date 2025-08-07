import * as z from "zod";

export enum FormVariant { 
    LOGIN = "login", 
    REGISTER = "register", 
}; 

export const authFormSchema = z.object({ 
    variant: z.nativeEnum(FormVariant),
    name: z
        .string()
        .min(2, "Your name must have at least 2 characters.")
        .max(100, "Your name can't have more than 100 characters.")
        .optional(),
    email: z
        .string() 
        .email("Please enter a valid email address." ),
    password: z
        .string()
})

export type authFormValues = z.infer<typeof authFormSchema>; 