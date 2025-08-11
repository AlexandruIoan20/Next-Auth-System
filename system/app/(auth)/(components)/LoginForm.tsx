"use client"

import { useState } from "react"; 
import { useForm  } from "react-hook-form";
import { authFormSchema, authFormValues, FormVariant } from "@/schemas/authFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineEye } from "react-icons/hi";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AlertText } from "@/components/AlertText";

// Shadcn components
import { Button } from "@/components/ui/button";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage, 
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { register, loginWithCreds } from "../actions";

export const LoginForm = () => { 
    const router = useRouter();
    const [ formVariant, setFormVariant ] = useState<FormVariant.LOGIN | FormVariant.REGISTER> (FormVariant.LOGIN); 
    const [ passwordInputType, setPasswordInputType ] = useState<"password" | "text"> ("password");

    // State for handling errors
    const [ alertTitle, setAlertTitle ] = useState<string> (""); 
    const [ alertDescription, setAlertDescription] = useState<string> (""); 
    const [ isSubmited, setIsSubmited ] = useState<boolean> (false); 
    const [ errorState, setErrorState ] = useState<boolean> (false); 

    const [ loading, setLoading ] = useState<boolean> (false); 
    const form = useForm<authFormValues>({ 
        resolver: zodResolver(authFormSchema), 
        defaultValues: { 
            name: "", 
            email: "", 
            password: "", 
        }
    }); 
    
    useEffect( () => { 
        const handleSubmitChange = () => { 
            setTimeout( () => { 
                setIsSubmited(false);
                setErrorState(false);
                setAlertTitle("");
                setAlertDescription("");
            }, 5000); 
        }

        handleSubmitChange();
    }, [ isSubmited, errorState, alertTitle, alertDescription ]);

    const submitForm = async (formData: FormData) => { 
        try { 
            setLoading(true); 
            if(formVariant === FormVariant.LOGIN) { 
                const response = await loginWithCreds(formData); 
                console.log({ response })
                if(response.success) { 
                    router.push("/"); 
                    setAlertTitle("Success");
                    setAlertDescription(response.message);
                } else { 
                    setAlertTitle("Error");
                    setAlertDescription(response.message);
                    setErrorState(true); 
                }
            }
            else if(formVariant === FormVariant.REGISTER) { 
                const response = await register(formData);
                if(response.success)  { 
                    form.reset(); 
                    setFormVariant(FormVariant.LOGIN);
                    setAlertTitle("Success");
                    setAlertDescription(response.message);
                } else { 
                    setAlertTitle("Error");
                    setAlertDescription(response.message);
                    setErrorState(true); 
                }
            }

            console.log("Form submitted successfully.");
        } catch(error) { 
            console.log(error); 
        } finally { 
            setLoading(false); 
            setIsSubmited(true); 
        }
    }

    const handleSubmit = form.handleSubmit((data) => {
        const formData = new FormData(); 
        formData.append("name", data.name || "");
        formData.append("email", data.email);
        formData.append("password", data.password);

        console.log("Form data: ", { formData });

        submitForm(formData);
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
                <form onSubmit={ handleSubmit }>
                    { formVariant === FormVariant.REGISTER &&
                        <FormField
                            control={form.control} 
                            name="name"
                            render={ ({ field }) => (
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
                                <FormMessage />
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
                        <Button type = "button" onClick = { handleVariant }> Register </Button>
                    </div>
                ) : 
                ( 
                    <div className = "flex">
                        <p> Do you already have an account? </p>
                        <Button type = "button" onClick = { handleVariant }> Sign in </Button>
                    </div>
                )
            }    

            { isSubmited && 
                <AlertText 
                    errorState = { errorState }
                    alertTitle = { alertTitle }
                    alertDescription = { alertDescription }
                />
            }
        </div>
    )
}