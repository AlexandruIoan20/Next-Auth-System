import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";

import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";


export const { handlers, signIn, signOut, auth } = NextAuth({ 
    adapter: PrismaAdapter(db), 
    session: { strategy: "jwt"}, 
    providers: [
        Credentials({ 
            name: "Credentials", 
            credentials: { 
                email: { label: "Email", type: "email" }, 
                password: { label: "Password", type: "password" }
            }, 
            authorize: async (credentials) => { 
                if(!credentials || !credentials.email || !credentials.password) return null; 

                const email = credentials.email as string; 

                let user: any = await db.user.findUnique({ 
                    where: { 
                        email
                    }
                }); 

                if(user) { 
                    console.log("User found: ", user); 
                    const isMatch = await bcrypt.compare(credentials.password as string, user.hashedPassword); 

                    if(!isMatch) throw new Error("Invalid credentials!");
                } else { 
                    throw new Error("User not found!"); 
                }
                return user; 
            }
        })
    ], 
}); 