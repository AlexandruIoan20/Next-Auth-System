import * as z from "zod";

export enum FormVariant { 
    LOGIN = "login", 
    REGISTER = "register", 
}; 

export const authFormSchema = z.object({ 
    name: z
        .string()
        .optional(),
    email: z
        .string() 
        .email("Please enter a valid email address." ),
    password: z
        .string()
})

export type authFormValues = z.infer<typeof authFormSchema>; 