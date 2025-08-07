"use client"

import { useState } from "react"; 
import { useForm, SubmitHandler  } from "react-hook-form";
import { authFormSchema, authFormValues, FormVariant } from "@/schemas/authFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineEye } from "react-icons/hi";

// Shadcn components
import { Button } from "@/components/ui/button";
import { 
    Form, 
    FormControl,
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage, 
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SubmitInterface { 
    variant: "login" | FormVariant.REGISTER; 
    name?: string; 
    email: string; 
    password: string; 
}

export const LoginForm = () => { 
    const [ formVariant, setFormVariant ] = useState<FormVariant.LOGIN | FormVariant.REGISTER> (FormVariant.LOGIN); 
    const [ passwordInputType, setPasswordInputType ] = useState<"password" | "text"> ("password");

    const [ loading, setLoading ] = useState<boolean> (false); 
    const form = useForm<authFormValues>({ 
        resolver: zodResolver(authFormSchema), 
        defaultValues: { 
            variant: FormVariant.LOGIN,
            name: "", 
            email: "", 
            password: "", 
        }
    }); 

    const onSubmit = async(formData: FormData) => { 
        try { 
            setLoading(true); 
        } catch(error) { 
            console.log(error); 
        } finally { 
            setLoading(false); 
        }
    }

    const handleSubmit = form.handleSubmit((data) => {
        const formData = new FormData(); 
        formData.append("variant", data.variant);
        formData.append("name", data.name || "");
        formData.append("email", data.email);
        formData.append("password", data.password);

        onSubmit(formData);
    })

    const handleVariant = () => { 
        setFormVariant(() => formVariant === FormVariant.LOGIN ? FormVariant.REGISTER : FormVariant.LOGIN);
    }

    const handlePasswordInputType = () => {
        setPasswordInputType(() => passwordInputType === "password" ? "text" : "password");
    }

    return ( 
        <div>   
            <Form {...form}>
                <form onSubmit = { handleSubmit }>
                    { formVariant === FormVariant.REGISTER &&
                        <FormField
                            control = { form.control } 
                            name = "name"
                            render = { ({ field }) => (
                                <FormItem>
                                    <FormLabel> Name </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled = { loading }
                                            placeholder = "Name..."
                                            { ...field }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> 
                    }
                    <FormField
                        control = { form.control }
                        name = "email"
                        render = { ({ field }) => ( 
                            <FormItem>
                                <FormLabel> Email </FormLabel>
                                <FormControl>
                                    <Input
                                        type = "email"
                                        disabled = { loading }
                                        placeholder = "Email..."
                                        { ...field }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> 

                    <FormField 
                        control = { form.control }
                        name = "password"
                        render = { ({ field }) => ( 
                            <FormItem>
                                <FormLabel> Password </FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            type = { passwordInputType}
                                            placeholder = "Password..."
                                            { ...field }
                                        />
                                        <button
                                            type = "button"
                                            tabIndex = { -1 }
                                            className = "focus:outline-none"
                                            onClick = { handlePasswordInputType }
                                        >
                                            <HiOutlineEye className = "text-gray-400 text-lg"/>
                                        </button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />  

                    <Button type = "submit" disabled = { loading }>
                        { formVariant === FormVariant.LOGIN ? "Sign in" : "Register" }
                    </Button>
                </form>    
            </Form>         
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