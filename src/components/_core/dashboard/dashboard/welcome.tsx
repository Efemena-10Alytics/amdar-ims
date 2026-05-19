"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useGetNextCohort } from "@/features/internship/use-get-next-cohort";

function getDisplayName(user: Record<string, unknown> | null | undefined) {
  if (!user) return "Oluwajuwonlo";

  const nested =
    user.user && typeof user.user === "object"
      ? (user.user as Record<string, unknown>)
      : null;

  const candidates = [
    user.first_name,
    user.firstName,
    user.name,
    nested?.first_name,
    nested?.firstName,
    nested?.name,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Oluwajuwonlo";
}

function getCountdownTo(targetDateStr: string | null) {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const target = new Date(`${targetDateStr}T00:00:00`).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((target - now) / 1000));

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-2 sm:px-3">
      <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs font-medium text-white/80">{label}</span>
    </div>
  );
}

const DashboardWelcome = () => {
  const { data: userInfo } = useGetUserInfo();
  const { data: internshipStartDate } = useGetNextCohort();
  const displayName = getDisplayName(userInfo as Record<string, unknown> | undefined);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setCountdown(getCountdownTo(internshipStartDate ?? null));
  }, [internshipStartDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownTo(internshipStartDate ?? null));
    }, 1000);

    return () => clearInterval(interval);
  }, [internshipStartDate]);

  return (
    <section className="h-full w-full min-h-52 overflow-hidden rounded-2xl bg-[#134E5E]">
      <div className="grid items-center gap-6 p-6 lg:grid-cols-[1fr_auto] lg:gap-4 lg:p-8">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome {displayName}! <span aria-hidden>👋</span>
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              Welcome to Amdari where we guide you with real world project into landing
              a job
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-xl bg-black/25 px-3 py-3 sm:px-4">
            <CountdownUnit value={countdown.days} label="Ds" />
            <span className="pb-4 text-xl font-bold text-white/70">:</span>
            <CountdownUnit value={countdown.hours} label="Hrs" />
            <span className="pb-4 text-xl font-bold text-white/70">:</span>
            <CountdownUnit value={countdown.minutes} label="Min" />
            <span className="pb-4 text-xl font-bold text-white/70">:</span>
            <CountdownUnit value={countdown.seconds} label="Sec" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-sm">
          <Image
            src="/images/svgs/dashboard/cuate.svg"
            alt="Interns working at their desks"
            width={400}
            height={280}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardWelcome;
