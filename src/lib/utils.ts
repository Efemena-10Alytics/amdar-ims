import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imageBaseurl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL ?? "";
export const imageUrl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL ?? "";
