"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useSyncEnrollmentSelection } from "@/features/internship/use-sync-enrollment-selection";
import { resolveEnrollmentJourneyRedirect } from "@/features/internship/resolve-enrollment-journey";

function DashboardEnrollmentGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: enrollment, isPending, isError, isAuthReady } =
    useGetUserEnrollment();
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();

  useSyncEnrollmentSelection(enrollment);

  // Portfolio owns its own missing/incomplete redirects (→ create-portfolio).
  // Don't let the enrollment journey guard steal those navigations to pre-diagnostic.
  const isPortfolioRoute = pathname.startsWith("/dashboard/portfolio");

  // Specialists switch between cohorts they service. Their own entry steps —
  // for whichever cohort they happen to be enrolled in — must never bounce them
  // out of a cohort they are here to work on.
  const isExempt = isRoleReady && isInternshipSpecialist;

  const redirectHref =
    enrollment && !isExempt
      ? resolveEnrollmentJourneyRedirect(enrollment)
      : null;

  useEffect(() => {
    if (isPending || isError || !redirectHref || isPortfolioRoute) return;
    router.replace(redirectHref);
  }, [isPending, isError, redirectHref, isPortfolioRoute, router]);

  if (!isAuthReady || isPending) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-[#64748B]">Loading your enrollment...</p>
      </div>
    );
  }

  if (isError || !redirectHref || isPortfolioRoute) {
    return children;
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-sm text-[#64748B]">Redirecting to continue your journey...</p>
    </div>
  );
}

export default DashboardEnrollmentGuard;
