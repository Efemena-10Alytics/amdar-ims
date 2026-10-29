"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockReferralData } from "@/features/referral/mock-data";
import {
  parseReferralLocale,
  REFERRAL_LOCALES,
  usesBankDrawer,
  type ReferralLocale,
} from "@/features/referral/locale";
import { ReferralStatsCards } from "./stats-cards";
import { InviteEarnBanner } from "./invite-earn-banner";
import { ReferralTrackingTable } from "./referral-tracking-table";
import { ReferralPaymentSummaryCard } from "./payment-summary-card";
import { TopReferrersCard } from "./top-referrers-card";
import { WithdrawalHistoryTable } from "./withdrawal-history-table";
import { WithdrawalRequestDrawer } from "./withdrawal-request-drawer";
import { BankWithdrawalDrawer } from "./withdrawal-request-drawer-bank";
import { WithdrawalSuccessModal } from "./withdrawal-success-modal";

/** Matches the sheet's closed-state animation duration. */
const SHEET_CLOSE_MS = 320;

export function ReferralsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // An `ln` param is a request to review that locale's drawer, so open it on
  // arrival. Lazy initialiser rather than an effect — this only applies to the
  // first render, and setting state in an effect is a lint error here.
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(
    () => searchParams.get("ln") !== null,
  );
  const [withdrawSuccessOpen, setWithdrawSuccessOpen] = useState(false);

  const data = mockReferralData;
  const isWithdrawalHistoryView = searchParams.get("view") === "withdrawal-history";
  // `ln` picks the withdrawal form. With no param the drawer still has to render
  // something the moment it opens, and that default is UK/GBP — falling back to
  // `ng` here made the Nigerian form flash before the URL caught up.
  const withdrawalLocale = parseReferralLocale(searchParams.get("ln") ?? "uk");
  const currency = REFERRAL_LOCALES[withdrawalLocale].currency;

  // Keep `ln` across in-page navigation, otherwise the locale (and so the
  // currency) silently resets when moving to or from the history view.
  const buildHref = (view?: string, lnOverride?: string | null) => {
    const params = new URLSearchParams();
    if (view) params.set("view", view);
    // `null` clears the locale outright; `undefined` keeps whatever is there.
    const ln = lnOverride === null ? null : lnOverride ?? searchParams.get("ln");
    if (ln) params.set("ln", ln);
    const query = params.toString();
    return query ? `/dashboard/referrals?${query}` : "/dashboard/referrals";
  };

  /** Withdraw defaults to the UK form (GBP); the drawer can switch from there. */
  const openWithdrawDrawer = () => {
    setWithdrawDrawerOpen(true);
    if (!searchParams.get("ln")) {
      router.replace(buildHref(undefined, "uk"), { scroll: false });
    }
  };

  /**
   * Closing — button, Escape or overlay — drops `ln` so the URL goes back clean.
   * Deferred past the sheet's exit animation: the drawer is keyed on the locale,
   * so clearing immediately would remount it mid-close and flash the skeleton.
   */
  const handleWithdrawOpenChange = (nextOpen: boolean) => {
    setWithdrawDrawerOpen(nextOpen);
    if (nextOpen || !searchParams.get("ln")) return;

    window.setTimeout(() => {
      router.replace(buildHref(undefined, null), { scroll: false });
    }, SHEET_CLOSE_MS);
  };

  const changeWithdrawalLocale = (next: ReferralLocale) => {
    router.replace(buildHref(undefined, next), { scroll: false });
  };

  const openWithdrawalHistory = () => {
    router.push(buildHref("withdrawal-history"));
  };

  const backToReferrals = () => {
    router.push(buildHref());
  };

  if (isWithdrawalHistoryView) {
    return (
      <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={backToReferrals}
            className="font-sora text-sm font-medium text-[#156374] hover:underline"
          >
            ← Back to Referrals
          </button>
        </div>
        <WithdrawalHistoryTable withdrawals={data.withdrawals} currency={currency} />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 px-4 py-6 lg:px-6">
      <ReferralStatsCards stats={data.stats} currency={currency} />

      <InviteEarnBanner referralLink={data.referralLink} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ReferralTrackingTable referrals={data.referrals} currency={currency} />

        <div className="flex flex-col gap-4">
          <ReferralPaymentSummaryCard
            summary={data.paymentSummary}
            currency={currency}
            onWithdraw={openWithdrawDrawer}
            onViewHistory={openWithdrawalHistory}
          />
          <TopReferrersCard referrers={data.topReferrers} currency={currency} />
        </div>
      </div>

      {usesBankDrawer(withdrawalLocale) ? (
        <BankWithdrawalDrawer
          key={withdrawalLocale}
          onLocaleChange={changeWithdrawalLocale}
          open={withdrawDrawerOpen}
          onOpenChange={handleWithdrawOpenChange}
          profile={data.withdrawalProfile}
          onSuccess={() => setWithdrawSuccessOpen(true)}
          locale={withdrawalLocale}
        />
      ) : (
        <WithdrawalRequestDrawer
          open={withdrawDrawerOpen}
          onOpenChange={handleWithdrawOpenChange}
          profile={data.withdrawalProfile}
          onSuccess={() => setWithdrawSuccessOpen(true)}
          locale={withdrawalLocale}
        />
      )}

      <WithdrawalSuccessModal open={withdrawSuccessOpen} onOpenChange={setWithdrawSuccessOpen} />
    </div>
  );
}
