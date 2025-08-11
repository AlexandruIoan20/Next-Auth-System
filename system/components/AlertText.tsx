"use client"; 

import { cn } from "@/lib/utils"; 
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

interface AlertTextProps { 
    errorState: boolean; 
    alertTitle: string; 
    alertDescription: string;
}; 

export const AlertText = ({ errorState, alertTitle, alertDescription }: AlertTextProps) => { 
    return ( 
        <Alert
            variant={errorState ? "destructive" : "default"}
            className={cn(
                "fixed bottom-4 right-4 w-[300px] z-50 border rounded-lg shadow-md p-4",
                errorState
                ? "bg-red-100 text-red-800 border-red-700"
                : "bg-green-100 text-green-800 border-green-300"
            )}
        >
        <AlertTitle className="font-bold mb-1">
            { alertTitle }
        </AlertTitle>
        <AlertDescription>
            { alertDescription }
        </AlertDescription>
        </Alert>
    )
}