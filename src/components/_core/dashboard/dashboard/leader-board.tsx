"use client";

import Image from "next/image";
import { Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type PodiumEntry = {
  rank: 1 | 2 | 3;
  name: string;
  points: number;
  avatarSrc: string;
  ringClass: string;
  /** Bar height as % of tallest bar (rank 1 = 100%) */
  barPercent: number;
};

const MAX_BAR_HEIGHT_PX = 112;

/** Display order: 3rd, 2nd, 1st (left to right) */
const PODIUM: PodiumEntry[] = [
  {
    rank: 3,
    name: "Abiola",
    points: 200,
    avatarSrc: "/images/svgs/become-partners/hero-avatar-1.svg",
    ringClass: "bg-[#B8D9E8]",
    barPercent: 48,
  },
  {
    rank: 2,
    name: "Jay",
    points: 200,
    avatarSrc: "/images/svgs/become-partners/hero-avatar-2.svg",
    ringClass: "bg-[#F9C4D2]",
    barPercent: 72,
  },
  {
    rank: 1,
    name: "Amber",
    points: 200,
    avatarSrc: "/images/svgs/become-partners/hero-avatar-3.svg",
    ringClass: "bg-[#F4A261]",
    barPercent: 100,
  },
];

function PodiumChartColumn({ entry }: { entry: PodiumEntry }) {
  const barHeightPx = Math.round((entry.barPercent / 100) * MAX_BAR_HEIGHT_PX);

  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center justify-end"
      role="img"
      aria-label={`${entry.name}, rank ${entry.rank}, ${entry.points} points`}
    >
      <div
        className={cn(
          "relative mb-2 flex size-10 items-center justify-center overflow-hidden rounded-full",
          entry.ringClass,
        )}
      >
        <Image
          src={entry.avatarSrc}
          alt=""
          width={40}
          height={40}
          className="size-11 object-contain sm:size-12"
        />
      </div>
      <p className="mb-0.5 text-sm font-medium text-[#667085]">{entry.name}</p>
      <p className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0B2B33]">
        <Star className="size-3.5 fill-[#FAC5C5] text-[#FAC5C5]" aria-hidden />
        {entry.points}
      </p>

      <div
        className="flex w-11 items-end justify-center rounded-t-xl bg-[#D9E8EC] sm:w-12"
        style={{ height: barHeightPx }}
      >
        <span className="pb-1.5 text-2xl font-bold leading-none text-[#134E5E]">
          {entry.rank}
        </span>
      </div>
    </div>
  );
}

const LeaderBoard = () => {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5E6D3] text-[#C9A227]"
          aria-hidden
        >
          <Trophy className="size-5" strokeWidth={2} />
        </span>
        <h3 className="text-lg font-semibold text-[#0B2B33]">Leader Board</h3>
      </div>

      <div
        className="mt-6 border-b border-[#C5DDE3] pb-0"
        aria-label="Top three leaderboard chart"
      >
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          {PODIUM.map((entry) => (
            <PodiumChartColumn key={entry.rank} entry={entry} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl bg-[#134E5E] px-4 py-3 sm:gap-6 sm:px-5">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F9C4D2]">
          <Image
            src="/images/svgs/become-partners/hero-avatar-4.svg"
            alt=""
            width={44}
            height={44}
            className="size-9 object-contain"
          />
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-3 gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-medium text-white/90">Points</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-white">
              <Star className="size-3.5 fill-[#FAC5C5] text-[#FAC5C5]" aria-hidden />
              0
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white/90">Streak</p>
            <p className="mt-0.5 text-sm font-semibold text-white/75">
              <span aria-hidden>🔥</span> 0 days
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-white/90">Position</p>
            <p className="mt-0.5 text-sm font-semibold text-white/75">Nil</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderBoard;
