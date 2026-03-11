import type { AuthUser } from "@/store/auth-store";

/**
 * Returns the user id from auth user, supporting both flat and nested shapes
 * (e.g. { id } or { user: { id } }).
 */
export function getUserId(user: AuthUser | null): string | number | null {
  if (!user || typeof user !== "object") return null;
  const id = (user as Record<string, unknown>).id;
  if (id != null && (typeof id === "string" || typeof id === "number"))
    return id;
  const nested = (user as Record<string, unknown>).user;
  if (nested && typeof nested === "object" && "id" in nested) {
    const nestedId = (nested as Record<string, unknown>).id;
    if (
      nestedId != null &&
      (typeof nestedId === "string" || typeof nestedId === "number")
    )
      return nestedId;
  }
  return null;
}
