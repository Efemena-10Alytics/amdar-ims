"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsInternshipSpecialist } from "@/features/auth/staff-roles";
import { useGetPaymentStatus } from "@/features/payment/use-get-payment-status";
import { PaymentStatusModal } from "../payment-status/payment-status-modal";

function LockedDashboardPlaceholder() {
  return (
    <div
      className="pointer-events-none select-none space-y-6 px-4 py-6 lg:px-6"
      aria-hidden
    >
      <div className="flex justify-end">
        <Skeleton className="h-9 w-56 rounded-full" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-52 w-full rounded-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-44 w-full rounded-2xl" />
    </div>
  );
}

export function PaymentStatusGuard({
  header,
  banner,
  children,
}: {
  header: React.ReactNode;
  banner: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBillingRoute = pathname.startsWith("/dashboard/billing");
  const { isInternshipSpecialist, isRoleReady } = useIsInternshipSpecialist();

  const shouldCheckStatus = isRoleReady && !isInternshipSpecialist;
  const {
    data: paymentStatus,
    isPending: isStatusPending,
    isError: isStatusError,
  } = useGetPaymentStatus({
    enabled: shouldCheckStatus,
  });

  const isGatedRoute = shouldCheckStatus && !isBillingRoute;
  const isLocked =
    isGatedRoute &&
    !isStatusPending &&
    !isStatusError &&
    paymentStatus != null &&
    (paymentStatus.status === "locked" || !paymentStatus.can_access_dashboard);

  const shouldShowModal =
    isGatedRoute &&
    !isStatusPending &&
    !isStatusError &&
    paymentStatus != null &&
    (paymentStatus.show_modal || isLocked);

  let content: React.ReactNode;
  if (!isRoleReady || (isGatedRoute && isStatusPending)) {
    content = (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-[#64748B]">Loading your dashboard...</p>
      </div>
    );
  } else if (isLocked) {
    content = <LockedDashboardPlaceholder />;
  } else {
    content = children;
  }

  return (
    <>
      {header}
      {banner}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden rounded-2xl shadow">
        {content}
      </div>
      {shouldShowModal && paymentStatus ? (
        <PaymentStatusModal paymentStatus={paymentStatus} />
      ) : null}
    </>
  );
}
