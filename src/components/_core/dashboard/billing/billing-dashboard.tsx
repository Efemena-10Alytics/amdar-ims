"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPaymentStats } from "@/features/payment/use-get-payment-stats";
import { useGetUserInvoices } from "@/features/payment/use-get-user-invoices";
import { mapApiDataToBillingData } from "@/features/payment/adapt-api-data";
import { PaymentBanner } from "./payment-banner";
import { StatsCards } from "./stats-cards";
import { PaymentScheduleTable } from "./payment-schedule-table";
import { CurrentPlanCard } from "./current-plan-card";
import { PaymentSummaryCard } from "./payment-summary-card";

function BillingSkeleton() {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <Skeleton className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
        <Skeleton className="h-27.5 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function BillingDashboard() {
  const { data: stats, isLoading: isLoadingStats } = useGetPaymentStats();
  const { data: invoices, isLoading: isLoadingInvoices } = useGetUserInvoices();

  if (isLoadingStats || isLoadingInvoices) {
    return <BillingSkeleton />;
  }

  if (!stats) {
    return (
      <div className="space-y-6 px-4 py-6 lg:px-6">
        <StatsCards
          summary={{
            totalPlanAmount: 0,
            totalPaid: 0,
            remainingBalance: 0,
            paymentStatus: "Nil",
          }}
        />
        <PaymentScheduleTable schedule={[]} />
      </div>
    );
  }

  const billingData = mapApiDataToBillingData(stats, invoices ?? []);
  const { plan, summary, nextPayment, schedule, hasActivePlan } = billingData;

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {hasActivePlan ? (
        <PaymentBanner
          nextPayment={nextPayment}
          nextInvoiceId={stats.next_payment?.next_invoice_id}
          paymentPlanId={stats.payment_plan.id}
          cohort={stats.payment_plan.cohort_display || stats.payment_plan.cohort}
          program={stats.payment_plan.program}
        />
      ) : null}

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <PaymentScheduleTable schedule={schedule} installmentsCount={plan.installmentsCount} />

        <div className="flex flex-col gap-4">
          <CurrentPlanCard plan={plan} nextDueDate={nextPayment.dueDate} />
          <PaymentSummaryCard summary={summary} />
        </div>
      </div>
    </div>
  );
}
