"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockReferralData } from "@/features/referral/mock-data";
import { ReferralStatsCards } from "./stats-cards";
import { InviteEarnBanner } from "./invite-earn-banner";
import { ReferralTrackingTable } from "./referral-tracking-table";
import { ReferralPaymentSummaryCard } from "./payment-summary-card";
import { TopReferrersCard } from "./top-referrers-card";
import { WithdrawalHistoryTable } from "./withdrawal-history-table";
import { WithdrawalRequestDrawer } from "./withdrawal-request-drawer";
import { WithdrawalSuccessModal } from "./withdrawal-success-modal";

export function ReferralsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [withdrawSuccessOpen, setWithdrawSuccessOpen] = useState(false);

  const data = mockReferralData;
  const isWithdrawalHistoryView = searchParams.get("view") === "withdrawal-history";

  const openWithdrawalHistory = () => {
    router.push("/dashboard/referrals?view=withdrawal-history");
  };

  const backToReferrals = () => {
    router.push("/dashboard/referrals");
  };

  if (isWithdrawalHistoryView) {
    return (
      <div className="space-y-6 px-4 py-6 lg:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={backToReferrals}
            className="font-sora text-sm font-medium text-[#156374] hover:underline"
          >
            ← Back to Referrals
          </button>
        </div>
        <WithdrawalHistoryTable withdrawals={data.withdrawals} />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">
      <ReferralStatsCards stats={data.stats} />

      <InviteEarnBanner referralLink={data.referralLink} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <ReferralTrackingTable referrals={data.referrals} />

        <div className="flex flex-col gap-4">
          <ReferralPaymentSummaryCard
            summary={data.paymentSummary}
            onWithdraw={() => setWithdrawDrawerOpen(true)}
            onViewHistory={openWithdrawalHistory}
          />
          <TopReferrersCard referrers={data.topReferrers} />
        </div>
      </div>

      <WithdrawalRequestDrawer
        open={withdrawDrawerOpen}
        onOpenChange={setWithdrawDrawerOpen}
        profile={data.withdrawalProfile}
        onSuccess={() => setWithdrawSuccessOpen(true)}
      />

      <WithdrawalSuccessModal open={withdrawSuccessOpen} onOpenChange={setWithdrawSuccessOpen} />
    </div>
  );
}
