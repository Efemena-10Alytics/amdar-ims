import { BillingDashboard } from "@/components/_core/dashboard/billing/billing-dashboard";
import { ReceiptView } from "@/components/_core/dashboard/billing/receipt-view";
import { mockReceipts } from "@/features/payment/mock-data";

type BillingPageProps = {
  searchParams: Promise<{ receiptid?: string }>;
};

const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const { receiptid } = await searchParams;
  const receipt = receiptid ? mockReceipts[receiptid] : undefined;

  if (receipt) {
    return (
      <div className="space-y-6 px-4 py-6 lg:px-6">
        <ReceiptView receipt={receipt} />
      </div>
    );
  }

  return <BillingDashboard />;
};

export default BillingPage;
