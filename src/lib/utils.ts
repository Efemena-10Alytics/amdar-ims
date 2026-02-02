import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imageBaseurl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL ?? "";
export const imageUrl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL ?? "";

export function getImageUrl(image: string | undefined | null): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/images")) return image;
  const apiBase = (process.env.NEXT_PUBLIC_REACT_APP_API_URL ?? "").replace(
    /\/$/,
    "",
  );
  return `${apiBase}/storage/images/${image.replace(/^\//, "")}`;
}
