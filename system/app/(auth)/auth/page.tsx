import { LoginForm } from "../(components)/LoginForm"; 
import { register, loginWithCreds } from "@/app/(auth)/actions";

export default function AuthPage () { 
    return ( 
        <LoginForm /> 
    )
}