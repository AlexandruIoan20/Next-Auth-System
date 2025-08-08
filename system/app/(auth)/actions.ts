'use server'; 

import { signIn, signOut } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { saltAndHashPassword } from "@/utils/helpers";
import { FormState } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { authFormSchema } from "@/schemas/authFormSchema";

const getUserByNameOrEmail = async (name: string, email: string) => { 
    try { 
        const user = await db.user.findFirst({ 
            where: { 
                OR: [ 
                    { name }, 
                    { email }, 
                ]
            }
        }); 

        return user; 
    } catch (error) { 
        console.log(error); 
    }
}

export const login = async (provider: string) => { 
    await signIn(provider, { redirectTo: "/" });
    revalidatePath("/");
}

export const logout = async () => { 
    await signOut({ redirectTo: "/"}); 
    revalidatePath("/");
}

export async function loginWithCreds (formData: FormData): Promise<FormState> { 
    const loginFormData = Object.fromEntries(formData); 
    const verifyFormData = authFormSchema.safeParse(loginFormData); 

    if(!verifyFormData.success) { 
        const issues = verifyFormData.error.issues.map(issue => issue.message); 
        return { message: "Validation failed.", issues };
    }

    const rawFormData = verifyFormData.data; 

    try { 
        await signIn("credentials", rawFormData); 
        revalidatePath("/");;
    } catch (error) { 
        console.log(error); 
        if(error instanceof PrismaClientKnownRequestError) return { message: error.message };
    }

    return { message: "Login successful." }
}

export async function register(formData: FormData): Promise<FormState> { 
    const registerFormData = Object.fromEntries(formData); 
    const verifyFormData = authFormSchema.safeParse(registerFormData); 

    if(!verifyFormData.success) {
        const issues = verifyFormData.error.issues.map(issue => issue.message);
        return { message: "Validation failed.", issues };
    }

    const rawFormData = verifyFormData.data; 

    const existingUser = await getUserByNameOrEmail(rawFormData.name as string, rawFormData.email as string); 

    if(existingUser) { 
        if(existingUser.name == rawFormData.name) return { message: "User with this name already exists." };
        else if(existingUser.email == rawFormData.email) return { message: "User with this email already exists." };
    }

    try { 
        await db.user.create({ 
            data: { 
                name: rawFormData.name as string, 
                email: rawFormData.email as string,
                hashedPassword: saltAndHashPassword(rawFormData.password as string),
            }
        }); 

        console.log("User created successfully.");
    } catch(error) { 
        console.log(error); 
        if(error instanceof PrismaClientKnownRequestError) { 
            return { message: error.message } 
        }
    }

    return { message: "User created successfully." };
}