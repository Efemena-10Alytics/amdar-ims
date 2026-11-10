"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { resolveUserFullName, unwrapUser } from "@/lib/user-profile";
import {
  localeToPayout,
  parseReferralLocale,
  toAmount,
  toReferralCurrency,
} from "@/features/referral/locale";
import { exportReferralsCsv, exportWithdrawalsCsv } from "@/features/referral/referral-api";
import { useGetReferralCode } from "@/features/referral/use-get-referral-code";
import {
  useReferralLeaderboard,
  useReferralPaymentSummary,
  useReferralSummary,
  useReferralTracking,
} from "@/features/referral/use-referral-dashboard";
import { useWithdrawalHistory } from "@/features/referral/use-referral-withdrawal";
import { ReferralStatsCards } from "./stats-cards";
import { InviteEarnBanner } from "./invite-earn-banner";
import { ReferralTrackingTable } from "./referral-tracking-table";
import { ReferralPaymentSummaryCard } from "./payment-summary-card";
import { TopReferrersCard } from "./top-referrers-card";
import { WithdrawalHistoryTable } from "./withdrawal-history-table";
import { ApiWithdrawalDrawer } from "./withdrawal-request-drawer-api";
import { WithdrawalSuccessModal } from "./withdrawal-success-modal";

/** Matches the sheet's closed-state animation duration. */
const SHEET_CLOSE_MS = 320;
/** Rows per page on both tables, matching the designs. */
const PER_PAGE = 9;

function initialsFrom(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ME";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ReferralsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // An `ln` param is a request to review a particular payout form, so open the
  // drawer on arrival. Lazy initialiser rather than an effect — this only
  // applies to the first render, and setting state in an effect is a lint error.
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(
    () => searchParams.get("ln") !== null,
  );
  const [withdrawSuccessOpen, setWithdrawSuccessOpen] = useState(false);
  const [trackingPage, setTrackingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const isWithdrawalHistoryView = searchParams.get("view") === "withdrawal-history";
  const lnParam = searchParams.get("ln");

  const user = useAuthStore((state) => state.user);
  const fullName = resolveUserFullName(unwrapUser(user)) || "Your account";

  const referralCode = useGetReferralCode();
  const summary = useReferralSummary();
  const paymentSummary = useReferralPaymentSummary();
  const leaderboard = useReferralLeaderboard("all");
  const tracking = useReferralTracking({ page: trackingPage, per_page: PER_PAGE });
  // Only fetched on the history view, so the main screen doesn't pay for it.
  const history = useWithdrawalHistory(
    { page: historyPage, per_page: PER_PAGE },
    isWithdrawalHistoryView,
  );

  // Every amount on the screen is in the wallet's currency.
  const currency = toReferralCurrency(summary.data?.currency);

  // `ln` no longer picks a hand-built form — the payout forms come from the
  // withdrawal-options endpoint — but it still preselects a country/currency so
  // the existing review links keep landing on the right one.
  const preselect = lnParam ? localeToPayout(parseReferralLocale(lnParam)) : null;

  const buildHref = (view?: string, lnOverride?: string | null) => {
    const params = new URLSearchParams();
    if (view) params.set("view", view);
    // `null` clears the locale outright; `undefined` keeps whatever is there.
    const ln = lnOverride === null ? null : (lnOverride ?? lnParam);
    if (ln) params.set("ln", ln);
    const query = params.toString();
    return query ? `/dashboard/referrals?${query}` : "/dashboard/referrals";
  };

  const openWithdrawDrawer = () => setWithdrawDrawerOpen(true);

  /**
   * Closing — button, Escape or overlay — drops `ln` so the URL goes back
   * clean, deferred past the sheet's exit animation.
   */
  const handleWithdrawOpenChange = (nextOpen: boolean) => {
    setWithdrawDrawerOpen(nextOpen);
    if (nextOpen || !lnParam) return;

    window.setTimeout(() => {
      router.replace(buildHref(undefined, null), { scroll: false });
    }, SHEET_CLOSE_MS);
  };

  const goToHistoryPage = (page: number) => {
    setHistoryPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isWithdrawalHistoryView) {
    return (
      <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(buildHref())}
            className="font-sora text-sm font-medium text-[#156374] hover:underline"
          >
            ← Back to Referrals
          </button>
        </div>
        <WithdrawalHistoryTable
          withdrawals={history.items}
          currency={currency}
          pagination={history.pagination}
          onPageChange={goToHistoryPage}
          onExport={() => exportWithdrawalsCsv({})}
          isLoading={history.isPending}
          errorMessage={history.errorMessage}
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
      <ReferralStatsCards
        stats={{
          confirmedEarnings: toAmount(summary.data?.confirmed_earnings),
          expectedEarnings: toAmount(summary.data?.expected_earnings),
          totalReferrals: summary.data?.total_referrals ?? 0,
          pendingReferrals: summary.data?.pending_referrals ?? 0,
          confirmedReferrals: summary.data?.confirmed_referrals ?? 0,
          failedReferrals: summary.data?.failed_referrals ?? 0,
        }}
        currency={currency}
        isLoading={summary.isPending}
        errorMessage={summary.errorMessage}
      />

      <InviteEarnBanner
        referralLink={referralCode.referralLink}
        isLoading={referralCode.isPending}
        errorMessage={referralCode.errorMessage}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ReferralTrackingTable
          referrals={tracking.items}
          currency={currency}
          pagination={tracking.pagination}
          onPageChange={setTrackingPage}
          onExport={() => exportReferralsCsv({})}
          isLoading={tracking.isPending}
          errorMessage={tracking.errorMessage}
        />

        <div className="flex flex-col gap-4">
          <ReferralPaymentSummaryCard
            summary={{
              paid: toAmount(paymentSummary.data?.paid),
              remaining: toAmount(paymentSummary.data?.remaining),
              total: toAmount(paymentSummary.data?.total),
            }}
            percentPaid={paymentSummary.data?.paid_percentage}
            currency={currency}
            canWithdraw={summary.data?.can_withdraw !== false}
            onWithdraw={openWithdrawDrawer}
            onViewHistory={() => router.push(buildHref("withdrawal-history"))}
          />
          <TopReferrersCard
            top={leaderboard.data?.top ?? []}
            me={leaderboard.data?.me ?? null}
            currency={toReferralCurrency(leaderboard.data?.currency ?? summary.data?.currency)}
            isLoading={leaderboard.isPending}
            errorMessage={leaderboard.errorMessage}
          />
        </div>
      </div>

      <ApiWithdrawalDrawer
        open={withdrawDrawerOpen}
        onOpenChange={handleWithdrawOpenChange}
        profile={{
          name: fullName,
          initials: initialsFrom(fullName),
          status: referralCode.data?.is_blocked ? "Blocked" : "Active",
        }}
        initialCountry={preselect?.country ?? null}
        initialCurrency={preselect?.currency ?? null}
        onSuccess={() => {
          setWithdrawDrawerOpen(false);
          setWithdrawSuccessOpen(true);
        }}
      />

      <WithdrawalSuccessModal open={withdrawSuccessOpen} onOpenChange={setWithdrawSuccessOpen} />
    </div>
  );
}
