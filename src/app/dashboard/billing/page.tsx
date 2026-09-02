import { PaymentBanner } from "@/components/_core/dashboard/billing/payment-banner";
import { StatsCards } from "@/components/_core/dashboard/billing/stats-cards";
import { PaymentScheduleTable } from "@/components/_core/dashboard/billing/payment-schedule-table";
import { CurrentPlanCard } from "@/components/_core/dashboard/billing/current-plan-card";
import { PaymentSummaryCard } from "@/components/_core/dashboard/billing/payment-summary-card";
import { ReceiptView } from "@/components/_core/dashboard/billing/receipt-view";
import { mockBillingData, mockReceipts } from "@/features/payment/mock-data";

type BillingPageProps = {
  searchParams: Promise<{ receiptid?: string }>;
};

const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const { receiptid } = await searchParams;
  const { plan, summary, nextPayment, schedule, hasActivePlan } = mockBillingData;

  const receipt = receiptid ? mockReceipts[receiptid] : undefined;

  if (receipt) {
    return (
      <div className="space-y-6 px-4 py-6 lg:px-6">
        <ReceiptView receipt={receipt} />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      {hasActivePlan ? <PaymentBanner nextPayment={nextPayment} /> : null}

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <PaymentScheduleTable schedule={schedule} />

        <div className="flex flex-col gap-4">
          <CurrentPlanCard plan={plan} />
          <PaymentSummaryCard summary={summary} />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
