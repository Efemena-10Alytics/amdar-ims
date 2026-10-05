"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useSyncEnrollmentSelection } from "@/features/internship/use-sync-enrollment-selection";
import { resolveEnrollmentJourneyRedirect } from "@/features/internship/resolve-enrollment-journey";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";

function DashboardEnrollmentGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Prefer switcher selection; fall back to hook's existing resolution when empty.
  const switcherProgramId = useEnrollmentSelectionStore((s) => s.programId);
  const switcherCohortId = useEnrollmentSelectionStore((s) => s.cohortId);
  const hasSwitcherSelection =
    switcherProgramId != null && switcherCohortId != null;
  const { data: enrollment, isPending, isError, isAuthReady } =
    useGetUserEnrollment(
      hasSwitcherSelection
        ? { programId: switcherProgramId, cohortId: switcherCohortId }
        : undefined,
    );

  useSyncEnrollmentSelection(enrollment);

  // Portfolio owns its own missing/incomplete redirects (→ create-portfolio).
  // Don't let the enrollment journey guard steal those navigations to pre-diagnostic.
  const isPortfolioRoute = pathname.startsWith("/dashboard/portfolio");

  // Specialists in preview mode are skipped inside resolveEnrollmentJourneyRedirect
  // (`is_specialist_preview`). Specialists on their own enrollment still get
  // redirected to finish onboarding / pre-diagnostic like any other intern.
  const redirectHref = enrollment
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
