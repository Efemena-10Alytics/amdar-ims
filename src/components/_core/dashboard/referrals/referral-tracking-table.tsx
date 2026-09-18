import { formatReferralCurrency } from "@/features/referral/mock-data";
import type { ReferralEntry } from "@/features/referral/types";
import { ExportIcon } from "./icons";
import { ReferralPaymentPlanBadge } from "./status-badge";
import { EmptyReferralState } from "./empty-referral-state";

export function ReferralTrackingTable({ referrals }: { referrals: ReferralEntry[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">
          Referral Tracking
        </h2>
        <button
          type="button"
          className="flex h-8.5 items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-colors hover:bg-[#B6CFD4]/80"
        >
          <ExportIcon />
          {referrals.length > 0 ? "Export" : "Download"}
        </button>
      </div>

      {referrals.length === 0 ? (
        <EmptyReferralState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 border-collapse">
            <thead>
              <tr className="h-13 bg-[#E8EFF1] font-sora text-sm text-[#5C6777]">
                <th className="rounded-l-lg px-4 text-left">#</th>
                <th className="px-4 text-left">Referee Name</th>
                <th className="px-4 text-left">Email</th>
                <th className="px-4 text-left">Programme</th>
                <th className="px-4 text-left">Payment Plan</th>
                <th className="px-4 text-left">Joined On</th>
                <th className="rounded-r-lg px-4 text-left">Reward</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral, index) => (
                <tr
                  key={referral.id}
                  className="h-14 border-b border-[#EEF2F6] font-sora text-sm font-medium text-[#092A31] last:border-b-0"
                >
                  <td className="px-4 text-[#94A3B8]">{index + 1}</td>
                  <td className="px-4">{referral.refereeName}</td>
                  <td className="px-4 text-[#64748B]">{referral.email}</td>
                  <td className="px-4">{referral.programme}</td>
                  <td className="px-4">
                    <ReferralPaymentPlanBadge
                      current={referral.paymentPlan.current}
                      total={referral.paymentPlan.total}
                      status={referral.paymentPlan.status}
                    />
                  </td>
                  <td className="px-4 text-[#64748B]">{referral.joinedOn}</td>
                  <td className="px-4 text-[#156374]">
                    {formatReferralCurrency(referral.reward)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
