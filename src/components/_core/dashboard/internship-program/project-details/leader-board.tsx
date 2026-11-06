"use client";

import { Flame, Search, Star, } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LeaderBoardEntry } from "@/features/interns-project/leader-board/leader-board.types";
import { useGetLeaderBoard } from "@/features/interns-project/leader-board/use-get-leader-board";
import { TrophyIcon } from "../svg";

type Leader = {
  id: string;
  name: string;
  handle: string;
  position: number;
  positionLabel: string;
  points: number;
  task: string;
  taskScore: number;
  streakDays: number;
  avatarSrc: string;
  avatarTone: string;
};

const AVATARS = [
  "/images/svgs/illustration/Smug%202.svg",
  "/images/svgs/illustration/Super%20Excited%203.svg",
  "/images/svgs/illustration/Meh%202.svg",
  "/images/svgs/illustration/Tired%202.svg",
  "/images/svgs/illustration/Fainted%202.svg",
];

const AVATAR_TONES = [
  "bg-[#F6D7C3]",
  "bg-[#F3E4C4]",
  "bg-[#D7EDE4]",
  "bg-[#E4D7F2]",
  "bg-[#F8D7E4]",
  "bg-[#D7E4F6]",
];

function formatPosition(position: number) {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

function toLeader(entry: LeaderBoardEntry): Leader {
  const index = Math.abs(entry.userId) % AVATARS.length;

  return {
    id: String(entry.userId),
    name: entry.name,
    handle: entry.buddyName?.trim() ? `@${entry.buddyName.trim()}` : "",
    position: entry.position,
    positionLabel: entry.positionLabel?.trim() || formatPosition(entry.position),
    points: entry.points,
    task: `${entry.taskDone}/${entry.taskTotal}`,
    taskScore: entry.taskScore,
    streakDays: entry.streakDays,
    avatarSrc: AVATARS[index],
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
  };
}

function LeaderAvatar({
  leader,
  className,
}: {
  leader: Leader;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-xl",
        leader.avatarTone,
        className,
      )}
    >
      <Image
        src={leader.avatarSrc}
        alt=""
        fill
        className="object-cover object-[center_18%]"
      />
    </span>
  );
}

function MedalBadge({ place }: { place: 1 | 2 | 3 }) {
  const src = {
    1: "/images/svgs/gold.svg",
    2: "/images/svgs/Silver.svg",
    3: "/images/svgs/bronze.svg",
  }[place];

  return (
    <div className="absolute -top-7 right-3 size-16 sm:right-4 sm:size-[4.5rem]">
      <Image
        src={src}
        alt={`${formatPosition(place)} place medal`}
        width={72}
        height={72}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </div>
  );
}

function TopLeaderCard({ leader }: { leader: Leader }) {
  const isFirst = leader.position === 1;
  const place = leader.position as 1 | 2 | 3;

  return (
    <article
      className={cn(
        "relative self-end overflow-visible rounded-xl p-4 sm:p-5",
        isFirst
          ? "border border-[#93B7BF] bg-[#0F6675] text-white lg:-translate-y-3"
          : "bg-[#FFF8EE] text-[#092A31]",
        place === 2 && "border-[1.5px] border-[#EDD3A7] bg-[#FBF5EC]",
        place === 3 && "border-[1.5px] border-[#CBC4B1] bg-[#EEECE6]",
      )}
    >
      <MedalBadge place={place} />

      <div className="flex items-center gap-3 pr-12">
        <LeaderAvatar leader={leader} className="size-12" />
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-base font-semibold",
              isFirst ? "text-white" : "text-[#092A31]",
            )}
          >
            {leader.name}
          </p>
          <p
            className={cn(
              "truncate text-sm",
              isFirst ? "text-white/70" : "text-[#94A3B8]",
            )}
          >
            {leader.handle}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <p className={cn("text-xs", isFirst ? "text-white/70" : "text-[#94A3B8]")}>
            Position
          </p>
          <p className="mt-1 text-sm font-bold">{leader.positionLabel}</p>
        </div>
        <div>
          <p className={cn("text-xs", isFirst ? "text-white/70" : "text-[#94A3B8]")}>
            Points
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold">
            <Star
              className="size-3.5 fill-[#FACC15] text-[#FACC15]"
              aria-hidden
            />
            {leader.points}
          </p>
        </div>
        <div>
          <p className={cn("text-xs", isFirst ? "text-white/70" : "text-[#94A3B8]")}>
            Task
          </p>
          <p className="mt-1 text-sm font-bold">{leader.task}</p>
        </div>
      </div>

      <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-[#F8E7C0] px-2 py-1 text-xs font-semibold text-[#C2410C]">
        <Flame className="size-3.5 fill-[#F97316] text-[#F97316]" aria-hidden />
        {leader.streakDays} days
      </span>
    </article>
  );
}

export default function LeadershipBoard({
  projectId,
}: {
  projectId: number | string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const {
    podium,
    leaders,
    hasLoaded,
    isError,
    errorMessage,
    refetch,
  } = useGetLeaderBoard(projectId, {
    search: debouncedSearch || undefined,
  });
  const isLoading = !hasLoaded && !isError;

  const topLeadersOrdered = useMemo(() => {
    const ranked = podium.map(toLeader);
    const first = ranked.find((leader) => leader.position === 1);
    const second = ranked.find((leader) => leader.position === 2);
    const third = ranked.find((leader) => leader.position === 3);
    return [second, first, third].filter((leader): leader is Leader =>
      Boolean(leader),
    );
  }, [podium]);

  const otherLeaders = useMemo(() => leaders.map(toLeader), [leaders]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-[#173740]">Leader board track</h2>

      <div className="space-y-8 rounded-2xl border border-[#E4EBF0] bg-[#F7F9FB] p-4 sm:p-6">
        <section className="space-y-4">
          <h3 className="inline-flex items-center gap-2 text-base font-semibold text-[#092A31]">
            <TrophyIcon />
            Top 3
          </h3>

          {isLoading ? (
            <p className="rounded-2xl bg-[#F8FAFC] px-5 py-10 text-center text-sm text-[#64748B]">
              Loading leader board...
            </p>
          ) : isError ? (
            <div className="rounded-2xl bg-[#F8FAFC] px-5 py-10 text-center">
              <p className="text-sm text-[#64748B]">
                {errorMessage || "Something went wrong while loading the leader board."}
              </p>
              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-full bg-[#156374] px-5 text-sm font-medium text-white hover:bg-[#124F5D]"
              >
                Retry
              </button>
            </div>
          ) : topLeadersOrdered.length === 0 ? (
            <p className="rounded-2xl bg-[#F8FAFC] px-5 py-10 text-center text-sm text-[#64748B]">
              No leader board rankings yet.
            </p>
          ) : (
            <div className="grid gap-4 pt-8 lg:grid-cols-3 lg:items-end">
              {topLeadersOrdered.map((leader) => (
                <TopLeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          )}
        </section>

        {!isError ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="inline-flex items-center gap-2 text-base font-semibold text-[#173740]">
                <TrophyIcon />
                Other leads
              </h3>

              <div className="relative w-full sm:w-64">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
                  aria-hidden
                />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search intern"
                  className="h-10 rounded-xl border-[#E2E8F0] bg-white pl-9 text-sm text-[#173740] shadow-none placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            <ul className="space-y-2">
              {otherLeaders.length === 0 ? (
                <li className="rounded-xl bg-[#F4F7F8] px-5 py-10 text-center text-sm text-[#64748B]">
                  {isLoading ? "Loading leader board..." : "No interns found."}
                </li>
              ) : (
                otherLeaders.map((leader) => (
                  <li
                    key={leader.id}
                    className="grid gap-4 rounded-xl bg-[#EEF3F6] px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <LeaderAvatar leader={leader} className="size-10" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173740]">
                          {leader.name}
                        </p>
                        {leader.handle ? (
                          <p className="truncate text-xs text-[#94A3B8]">
                            {leader.handle}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:contents">
                      <div>
                        <p className="text-xs text-[#94A3B8]">Position</p>
                        <p className="mt-1 text-sm font-bold text-[#173740]">
                          {leader.positionLabel}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#94A3B8]">Task</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#173740]">
                          <Star
                            className="size-3.5 fill-[#FACC15] text-[#FACC15]"
                            aria-hidden
                          />
                          {leader.taskScore}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#94A3B8]">Streak</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#173740]">
                          <Flame
                            className="size-3.5 fill-[#F97316] text-[#F97316]"
                            aria-hidden
                          />
                          {leader.streakDays} days
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#94A3B8]">Points</p>
                        <p className="mt-1 text-sm font-bold text-[#173740]">
                          {leader.points}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
