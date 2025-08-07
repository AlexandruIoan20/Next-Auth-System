"use client"

import { useState } from "react"; 
import { useForm, SubmitHandler  } from "react-hook-form";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

enum FormVariant { 
    LOGIN = "login", 
    REGISTER = "register", 
}; 

interface SubmitInterface { 
    variant: "login" | FormVariant.REGISTER; 
    name?: string; 
    email: string; 
    password: string; 
}

export const LoginForm = () => { 
    const { 
        register, 
        handleSubmit,
        formState: { errors }
    } = useForm<SubmitInterface>(); 
    const onSubmit: SubmitHandler<SubmitInterface> = (data) => console.log(data); 

    const [ formVariant, setFormVariant ] = useState<FormVariant.LOGIN | FormVariant.REGISTER> (FormVariant.LOGIN); 

    const handleVariant = () => { 
        setFormVariant(() => formVariant === FormVariant.LOGIN ? FormVariant.REGISTER : FormVariant.LOGIN);
    }

    return ( 
        <div>             
        { formVariant === FormVariant.LOGIN ? 
            ( 
                <div className = "flex"> 
                    <p> You don't have an account? </p>
                    <Button onClick = { handleVariant }> Register </Button>
                </div>
            ) : 
            ( 
                <div className = "flex">
                    <p> Do you already have an account? </p>
                    <Button onClick = { handleVariant }> Sign in </Button>
                </div>
            )
        }    
        </div>
    )
}