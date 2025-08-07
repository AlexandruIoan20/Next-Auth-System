"use server"

import { signIn, signOut } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { saltAndHashPassword } from "@/utils/helpers";
import { email } from "zod";

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

export const loginWithCreds = async (formData: FormData) => { 
    const rawFormData = {
        email: formData.get("email") as string, 
        password: formData.get("password") as string, 
    }; 

    try { 
        await signIn("credentials", rawFormData); 
        revalidatePath("/");
    } catch (error) { 
        throw error; 
    }
}

export const register = async (formData: FormData) => { 
    const rawFormData = { 
        name: formData.get("name") as string, // ? as string: s-ar putea sa fie un bug la astea, 
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }; 

    const existingUser = await getUserByNameOrEmail(rawFormData.name, rawFormData.email); 

    if(existingUser) { 
        if(existingUser.name == rawFormData.name) throw new Error("User with this name already exists.");
        else if(existingUser.email == rawFormData.email) throw new Error("User with this email already exists.");
    }

    try { 
        await db.user.create({ 
            data: { 
                name: rawFormData.name, 
                email: rawFormData.email,
            }
        }); 

        console.log("User created successfully.");
    } catch(error) { 
        console.log(error); 
        throw new Error("Failed to create user.");
    }
}