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
  const { data: enrollment, isLoading, isError, isFetching } = useGetUserEnrollment();

  const redirectHref = enrollment
    ? resolveEnrollmentJourneyRedirect(enrollment)
    : null;

  useEffect(() => {
    if (isLoading || isFetching || isError || !enrollment || !redirectHref) return;
    router.replace(redirectHref);
  }, [enrollment, isLoading, isFetching, isError, redirectHref, router]);

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
