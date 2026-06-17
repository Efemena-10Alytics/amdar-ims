import React, { ReactNode } from 'react'
import type { AuthUser } from "@/store/auth-store";
import type { EnrollmentCohort } from "@/types/user/enrollment";
import { useGetUserEnrollment } from '@/features/internship/use-get-user-enrollment';
import { Calendar, MapPin, Pencil, User, } from "lucide-react";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useAuthStore } from "@/store/auth-store";
import { CohortIcon } from '@/components/_core/dashboard/svg';


function DetailItem({
    icon,
    children,
}: {
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 shrink-0 text-[#64748B]" aria-hidden>
                {icon}
            </span>
            <div className="min-w-0 text-sm text-[#092A31]">{children}</div>
        </div>
    );
}

function getUserFullName(user: AuthUser | null | undefined): string {
    if (!user || typeof user !== "object") return "Oluwajuwonlo Olunga";

    const record = user as Record<string, unknown>;
    const nested =
        record.user && typeof record.user === "object"
            ? (record.user as Record<string, unknown>)
            : record;

    const firstName = nested.firstName ?? nested.first_name ?? nested.name;
    const lastName = nested.lastName ?? nested.last_name;
    const first =
        typeof firstName === "string" ? firstName.trim() : "";
    const last = typeof lastName === "string" ? lastName.trim() : "";
    const fullName = [first, last].filter(Boolean).join(" ").trim();

    return fullName || "Oluwajuwonlo Olunga";
}

function formatCohortLabel(cohort: EnrollmentCohort | undefined): string {
    if (!cohort) return "Feb Cohort, 2025.";

    const name = cohort.name?.trim();
    if (name) return name.endsWith(".") ? name : `${name}.`;

    const month = cohort.month?.trim();
    const year = cohort.year?.trim();
    if (month && year) return `${month} Cohort, ${year}.`;

    return "—";
}
const UserDetails = () => {
    const { data: enrollment } = useGetUserEnrollment();
    const authUser = useAuthStore((state) => state.user);
    const { data: userInfo } = useGetUserInfo();
    const displayName = getUserFullName(userInfo ?? authUser);
    const cohortLabel = formatCohortLabel(enrollment?.cohort);
    const programTitle =
        enrollment?.program?.title?.trim() ||
        enrollment?.program?.intern_title?.trim() ||
        enrollment?.program?.internship_title?.trim() ||
        "Product design";
    const skillLevel = enrollment?.program?.level?.trim() || "Professional";
    const locationLabel = "United Kingdom";
    const affiliationLabel = "Uniformity stage";
    return (
        <div>
            <p className="text-sm font-medium text-[#64748B]">Your details</p>

            <div className="mt-2 rounded-xl bg-[#F6F8FA] p-4">
                <p className="text-base font-semibold text-[#092A31]">
                    {displayName}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailItem icon={<CohortIcon />}>
                        {cohortLabel}
                    </DetailItem>
                    <DetailItem icon={<Pencil className="size-4" />}>
                        <span className="flex flex-wrap items-center gap-2">
                            <span>{programTitle}</span>
                            <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 text-xs font-medium text-[#092A31]">
                                {skillLevel}
                            </span>
                        </span>
                    </DetailItem>
                    <DetailItem icon={<MapPin className="size-4" />}>
                        {locationLabel}
                    </DetailItem>
                    <DetailItem icon={<User className="size-4" />}>
                        {affiliationLabel}
                    </DetailItem>
                </div>
            </div>
        </div>
    )
}

export default UserDetails
