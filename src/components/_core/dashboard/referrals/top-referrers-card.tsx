import { formatReferralCurrency } from "@/features/referral/mock-data";
import type { TopReferrer } from "@/features/referral/types";

function ReferrerAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full font-sora text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

export function TopReferrersCard({ referrers }: { referrers: TopReferrer[] }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 flex items-center gap-2 font-clash-display text-lg font-semibold text-[#092A31]">
        <span aria-hidden>🏆</span>
        Top Referrers
      </h2>

      <div className="flex flex-col gap-1">
        {referrers.map((referrer) => (
          <div
            key={`${referrer.rank}-${referrer.name}`}
            className={
              referrer.isMe
                ? "flex items-center gap-3 rounded-lg bg-[#156374] px-3 py-2.5 text-white"
                : "flex items-center gap-3 px-3 py-2.5"
            }
          >
            <span
              className={
                referrer.isMe
                  ? "w-5 shrink-0 font-sora text-sm font-semibold text-white"
                  : "w-5 shrink-0 font-sora text-sm font-semibold text-[#092A31]"
              }
            >
              {referrer.rank}
            </span>
            <ReferrerAvatar initials={referrer.initials} color={referrer.color} />
            <span
              className={
                referrer.isMe
                  ? "flex-1 truncate font-sora text-sm font-medium text-white"
                  : "flex-1 truncate font-sora text-sm font-medium text-[#092A31]"
              }
            >
              {referrer.name}
            </span>
            <span
              className={
                referrer.isMe
                  ? "flex items-center gap-1 font-sora text-sm font-semibold text-white"
                  : "flex items-center gap-1 font-sora text-sm font-semibold text-[#092A31]"
              }
            >
              <span
                className={
                  referrer.isMe ? "size-2 rounded-sm bg-[#FFE082]" : "size-2 rounded-sm bg-[#E4BF7F]"
                }
                aria-hidden
              />
              {formatReferralCurrency(referrer.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
