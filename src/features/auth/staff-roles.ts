"use client";

import { useMemo } from "react";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import type { AuthUser } from "@/store/auth-store";

export const INTERNSHIP_SPECIALIST_ROLE = "internship-specialist";

function normalizeRole(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim().toLowerCase() || null;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["slug", "name", "role"] as const) {
      const nested = normalizeRole(record[key]);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * Staff role slugs from user info. The API sends `staff` as an array of slugs
 * (e.g. `["internship-specialist"]`); a bare string or role objects are also
 * tolerated. Non-staff users get an empty array — note that `staff: []` and
 * `staff: null` both mean "not staff", so never test `staff` for null directly.
 */
export function getStaffRoles(user: AuthUser | null | undefined): string[] {
  if (!user || typeof user !== "object") return [];

  const staff = (user as Record<string, unknown>).staff;
  if (staff == null) return [];

  const values = Array.isArray(staff) ? staff : [staff];

  return values.flatMap((value) => {
    const role = normalizeRole(value);
    return role ? [role] : [];
  });
}

export function hasStaffRole(
  user: AuthUser | null | undefined,
  role: string,
): boolean {
  return getStaffRoles(user).includes(role.trim().toLowerCase());
}

export function isStaffUser(user: AuthUser | null | undefined): boolean {
  return getStaffRoles(user).length > 0;
}

/**
 * `isRoleReady` is false only while user info is actually being fetched — a
 * disabled query (no user id) resolves to "not staff" rather than hanging.
 */
export function useStaffRoles() {
  const { data, isLoading } = useGetUserInfo();
  const roles = useMemo(() => getStaffRoles(data ?? null), [data]);

  return { roles, isRoleReady: !isLoading };
}

export function useIsStaff() {
  const { roles, isRoleReady } = useStaffRoles();

  return { isStaff: roles.length > 0, isRoleReady };
}

export function useIsInternshipSpecialist() {
  const { roles, isRoleReady } = useStaffRoles();

  return {
    isInternshipSpecialist: roles.includes(INTERNSHIP_SPECIALIST_ROLE),
    isRoleReady,
  };
}
