import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imageStorageUrl = process.env.NEXT_PUBLIC_REACT_IMAGE_STORAGE_URL ?? "";
export const imageUrl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL ?? "";
export const baseUrl = process.env.NEXT_PUBLIC_REACT_IMAGE_URL_ALT ?? "";

export function getImageUrl(image: string | undefined | null): string {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/images")) return image;
  const apiBase = (process.env.NEXT_PUBLIC_REACT_APP_API_URL ?? "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
  return `${apiBase}/storage/images/${image.replace(/^\//, "")}`;
}

export function pickRandomTwo<T>(array: T[]): T[] {
  if (array.length <= 2) return [...array];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 2);
}
