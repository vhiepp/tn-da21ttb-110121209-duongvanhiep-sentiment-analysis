import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isURL(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
