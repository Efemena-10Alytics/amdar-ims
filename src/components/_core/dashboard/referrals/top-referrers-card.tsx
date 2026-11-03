import { formatReferralAmount, toAmount, type ReferralCurrency } from "@/features/referral/locale";
import type { LeaderboardEntry } from "@/features/referral/referral-api.types";

/**
 * The leaderboard endpoint sends a name and an initial but no colour, so the
 * avatar colour is derived from the name - stable across renders and reloads,
 * and the same referrer keeps the same colour in every row.
 */
const AVATAR_COLORS = ["#F97432", "#C13584", "#6366F1", "#F16B6B", "#0EA5E9", "#7C3AED"];

function avatarColor(name: string): string {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 100000;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

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

type ReferrerRow = {
  key: string;
  rank: number | string;
  name: string;
  initials: string;
  amount: number;
  isMe: boolean;
};

function toRows(top: LeaderboardEntry[], me: LeaderboardEntry | null): ReferrerRow[] {
  const rows: ReferrerRow[] = top.map((entry) => ({
    key: `top-${entry.rank}-${entry.name}`,
    rank: entry.rank,
    name: entry.name,
    initials: entry.initial,
    amount: toAmount(entry.total_earned),
    isMe: entry.is_me === true,
  }));

  // The user's own standing comes separately and is pinned to the bottom,
  // unless they are already inside the top list.
  if (me && !rows.some((row) => row.isMe)) {
    rows.push({
      key: "me",
      rank: me.rank || "-",
      name: "ME",
      initials: me.initial || "ME",
      amount: toAmount(me.total_earned),
      isMe: true,
    });
  }

  return rows;
}

export function TopReferrersCard({
  top,
  me,
  currency,
  isLoading = false,
  errorMessage = null,
}: {
  top: LeaderboardEntry[];
  me: LeaderboardEntry | null;
  currency: ReferralCurrency;
  isLoading?: boolean;
  errorMessage?: string | null;
}) {
  const rows = toRows(top, me);

  return (
    <div className="rounded-2xl bg-white p-5 shadow">
      <h2 className="mb-4 flex items-center gap-2 font-clash-display text-lg font-semibold text-[#092A31]">
        <span aria-hidden>🏆</span>
        Top Referrers
      </h2>

      {isLoading && rows.length === 0 ? (
        <div className="flex flex-col gap-1" aria-busy>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-3 py-2.5">
              <span className="h-3 w-3 animate-pulse rounded bg-[#E8EFF1]" />
              <span className="size-8 shrink-0 animate-pulse rounded-full bg-[#E8EFF1]" />
              <span className="h-3 flex-1 animate-pulse rounded bg-[#E8EFF1]" />
              <span className="h-3 w-12 animate-pulse rounded bg-[#E8EFF1]" />
            </div>
          ))}
        </div>
      ) : errorMessage ? (
        <p className="font-sora text-sm text-[#AA3030]">{errorMessage}</p>
      ) : rows.length === 0 ? (
        <p className="font-sora text-sm text-[#64748B]">No referrers to show yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {rows.map((referrer) => (
            <div
              key={referrer.key}
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
              <ReferrerAvatar
                initials={referrer.initials}
                color={referrer.isMe ? "#F16B6B" : avatarColor(referrer.name)}
              />
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
                    referrer.isMe
                      ? "size-2 rounded-sm bg-[#FFE082]"
                      : "size-2 rounded-sm bg-[#E4BF7F]"
                  }
                  aria-hidden
                />
                {formatReferralAmount(referrer.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
