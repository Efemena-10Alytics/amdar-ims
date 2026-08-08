import type { AuthUser } from "@/store/auth-store";

export type UserRecord = Record<string, unknown>;

/**
 * Normalises an auth/user-info object, supporting both flat and nested
 * (`{ user: {...} }`) shapes — the same duality `getUserId` handles.
 */
export function unwrapUser(user: AuthUser | null | undefined): UserRecord | null {
  if (!user || typeof user !== "object") return null;
  const record = user as UserRecord;
  const nested = record.user;
  if (nested && typeof nested === "object") return nested as UserRecord;
  return record;
}

/** Returns the first non-empty value among `keys`, trimmed, or "" when absent. */
export function readUserString(
  source: UserRecord | null,
  ...keys: string[]
): string {
  if (!source) return "";
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

/** Full name from an explicit field, else first + last. "" when unresolvable. */
export function resolveUserFullName(source: UserRecord | null): string {
  const direct = readUserString(source, "fullName", "full_name");
  if (direct) return direct;

  const first = readUserString(source, "firstName", "first_name", "name");
  const last = readUserString(source, "lastName", "last_name");
  return [first, last].filter(Boolean).join(" ").trim();
}

/** Email as stored by the API, checking the shapes seen across endpoints. */
export function resolveUserEmail(source: UserRecord | null): string {
  return readUserString(source, "email", "emailAddress", "email_address");
}

/** Phone as stored by the API. Often absent — callers must handle "". */
export function resolveUserPhone(source: UserRecord | null): string {
  return readUserString(source, "phoneNumber", "phone_number", "phone");
}
