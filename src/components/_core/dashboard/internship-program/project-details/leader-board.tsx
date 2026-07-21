"use client";

import { Flame, Search, SlidersHorizontal, Star, Trophy } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Leader = {
  id: string;
  name: string;
  handle: string;
  position: number;
  points: number;
  task: string;
  streakDays: number;
  avatarTone: string;
};

const TOP_LEADERS: Leader[] = [
  {
    id: "2",
    name: "Adams Ojay",
    handle: "@buddy name",
    position: 2,
    points: 89,
    task: "8/12",
    streakDays: 9,
    avatarTone: "bg-[#FFE4C4] text-[#C2410C]",
  },
  {
    id: "1",
    name: "Adams Ojay",
    handle: "@buddy name",
    position: 1,
    points: 89,
    task: "8/12",
    streakDays: 9,
    avatarTone: "bg-[#FDE68A] text-[#B45309]",
  },
  {
    id: "3",
    name: "Adams Ojay",
    handle: "@buddy name",
    position: 3,
    points: 89,
    task: "8/12",
    streakDays: 9,
    avatarTone: "bg-[#E0F2FE] text-[#0369A1]",
  },
];

const OTHER_LEADERS: Leader[] = [
  {
    id: "6",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 6,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#FFE4C4] text-[#C2410C]",
  },
  {
    id: "7",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 7,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#E0E7FF] text-[#4338CA]",
  },
  {
    id: "8",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 8,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#FCE7F3] text-[#BE185D]",
  },
  {
    id: "9",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 9,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#DCFCE7] text-[#15803D]",
  },
  {
    id: "10",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 10,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#FEF3C7] text-[#B45309]",
  },
  {
    id: "11",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 11,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#E0F2FE] text-[#0369A1]",
  },
  {
    id: "12",
    name: "Amber Ojay",
    handle: "@buddy name",
    position: 12,
    points: 89,
    task: "3/12",
    streakDays: 9,
    avatarTone: "bg-[#F3E8FF] text-[#7E22CE]",
  },
];

function formatPosition(position: number) {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MedalBadge({ place }: { place: 1 | 2 | 3 }) {
  const src = {
    1: "/images/svgs/gold.svg",
    2: "/images/svgs/Silver.svg",
    3: "/images/svgs/bronze.svg",
  }[place];

  return (
    <div className="absolute -top-6 right-4 size-14 sm:size-16">
      <Image
        src={src}
        alt={`${formatPosition(place)} place medal`}
        width={64}
        height={64}
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
        "relative self-end overflow-visible rounded-2xl p-4 sm:p-5",
        isFirst
          ? "bg-[#0F6675] text-white lg:min-h-52"
          : "bg-[#E8EFF1] text-[#092A31]",
      )}
    >
      <MedalBadge place={place} />

      <div className="flex items-center gap-3 pr-10">
        <span
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            leader.avatarTone,
          )}
          aria-hidden
        >
          {getInitials(leader.name)}
        </span>
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
          <p className="mt-1 text-sm font-bold">{formatPosition(leader.position)}</p>
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

      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
          isFirst
            ? "bg-[#FEF3C7] text-[#B45309]"
            : "bg-[#FEF3C7] text-[#B45309]",
        )}
      >
        <Flame className="size-3.5 fill-[#F97316] text-[#F97316]" aria-hidden />
        {leader.streakDays} days
      </span>
    </article>
  );
}

export default function LeadershipBoard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOthers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return OTHER_LEADERS;
    }

    return OTHER_LEADERS.filter(
      (leader) =>
        leader.name.toLowerCase().includes(query) ||
        leader.handle.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const topLeadersOrdered = useMemo(() => {
    const first = TOP_LEADERS.find((leader) => leader.position === 1)!;
    const second = TOP_LEADERS.find((leader) => leader.position === 2)!;
    const third = TOP_LEADERS.find((leader) => leader.position === 3)!;
    return [second, first, third];
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-bold text-[#092A31]">Leader board track</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
              className="h-10 rounded-xl border-[#DCE5E9] bg-white pl-9 text-sm text-[#092A31] placeholder:text-[#94A3B8]"
            />
          </div>

          <Button
            type="button"
            className="h-10 rounded-xl bg-[#0F6675] px-4 text-white hover:bg-[#0C5360]"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filter
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold text-[#092A31]">
          <Trophy className="size-4 text-[#F59E0B]" aria-hidden />
          Top 3
        </h3>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-end">
          {topLeadersOrdered.map((leader) => (
            <TopLeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold text-[#092A31]">
          <Trophy className="size-4 text-[#F59E0B]" aria-hidden />
          Other leads
        </h3>

        <ul className="space-y-1 overflow-hidden rounded-2xl">
          {filteredOthers.length === 0 ? (
            <li className="bg-[#F8FAFC] px-5 py-10 text-center text-sm text-[#64748B]">
              No interns found.
            </li>
          ) : (
            filteredOthers.map((leader) => (
              <li
                key={leader.id}
                className="grid gap-4 bg-[#F8FAFC] px-4 py-4 sm:px-5 lg:grid-cols-5 lg:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      leader.avatarTone,
                    )}
                    aria-hidden
                  >
                    {getInitials(leader.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#092A31]">
                      {leader.name}
                    </p>
                    <p className="truncate text-xs text-[#94A3B8]">
                      {leader.handle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:contents">
                  <div className="min-w-16">
                    <p className="text-xs text-[#94A3B8]">Position</p>
                    <p className="mt-1 text-sm font-bold text-[#092A31]">
                      {formatPosition(leader.position)}
                    </p>
                  </div>
                  <div className="min-w-16">
                    <p className="text-xs text-[#94A3B8]">Points</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#092A31]">
                      <Star
                        className="size-3.5 fill-[#FACC15] text-[#FACC15]"
                        aria-hidden
                      />
                      {leader.points}
                    </p>
                  </div>
                  <div className="min-w-20">
                    <p className="text-xs text-[#94A3B8]">Streak</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#092A31]">
                      <Flame
                        className="size-3.5 fill-[#F97316] text-[#F97316]"
                        aria-hidden
                      />
                      {leader.streakDays} days
                    </p>
                  </div>
                  <div className="min-w-16">
                    <p className="text-xs text-[#94A3B8]">Task</p>
                    <p className="mt-1 text-sm font-bold text-[#092A31]">
                      {leader.task}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
