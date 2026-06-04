"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { resolveEnrollmentJourneyRedirect } from "@/features/internship/resolve-enrollment-journey";

function DashboardEnrollmentGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    data: enrollment,
    isLoading,
    isError,
    isFetching,
    isSuccess,
  } = useGetUserEnrollment();

  const enrollmentReady = isSuccess && !isFetching && enrollment != null;

  const redirectHref = enrollmentReady
    ? resolveEnrollmentJourneyRedirect(enrollment)
    : null;

  useEffect(() => {
    if (!enrollmentReady || isError || !redirectHref) return;
    router.replace(redirectHref);
  }, [enrollmentReady, isError, redirectHref, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-[#64748B]">Loading your enrollment...</p>
      </div>
    );
  }

  if (isError || !redirectHref) {
    return children;
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-sm text-[#64748B]">Redirecting to continue your journey...</p>
    </div>
  );
}

export default DashboardEnrollmentGuard;
