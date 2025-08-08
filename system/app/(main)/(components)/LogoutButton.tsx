"use client"; 
import { logout } from "@/app/(auth)/actions";

import { Button } from "@/components/ui/button";

export const LogoutButton = () => { 
    return ( 
        <Button onClick = { () => logout()}> Logout </Button>
    )
}