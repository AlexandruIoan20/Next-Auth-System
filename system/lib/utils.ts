import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FormState = { 
  message: string; 
  success: boolean; 
  issues?: string[]; 
}