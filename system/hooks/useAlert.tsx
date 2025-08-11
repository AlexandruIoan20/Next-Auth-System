import { useState, useEffect } from "react";

export const useAlert = () => { 
    const [ alertTitle, setAlertTitle ] = useState<string> (""); 
    const [ alertDescription, setAlertDescription] = useState<string> (""); 
    const [ isSubmited, setIsSubmited ] = useState<boolean> (false); 
    const [ errorState, setErrorState ] = useState<boolean> (false); 

    useEffect( () => { 
        const timeout = setTimeout( () => { 
            setIsSubmited(false);
            setErrorState(false);
            setAlertTitle("");
            setAlertDescription("");
        }, 5000); 

        return () => clearTimeout(timeout);

    }, [ isSubmited, errorState, alertTitle, alertDescription ]);

    const setAlert = (title: string, description: string, error: boolean) => {
        setAlertTitle(title); 
        setAlertDescription(description);
        setErrorState(error);
    }

    return { alertTitle, alertDescription, isSubmited, errorState, setIsSubmited, setAlert };
}