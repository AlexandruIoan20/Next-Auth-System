import { LoginForm } from "../(components)/LoginForm"; 
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthPage () { 
    const session = await auth(); 

    if(session && session?.user) redirect("/");
    return ( 
        <LoginForm /> 
    )
}