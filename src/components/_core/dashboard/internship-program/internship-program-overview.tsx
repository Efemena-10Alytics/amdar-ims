"use client";

import { Timer, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PencilIcon } from "../svg";

type InternshipProgramOverviewProps = {
  stageLabel?: string;
  currentWeek?: number;
  totalWeeks?: number;
  stageProgress?: number;
  activitiesDone?: number;
  stagesCompleted?: number;
  totalStages?: number;
};

function FlagIcon() {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11.7075 1.04636C11.6202 1.00672 11.5234 0.993017 11.4285 1.00687C11.3337 1.02072 11.2448 1.06155 11.1725 1.12448C9.4225 2.63823 7.94 1.90448 6.22188 1.05386C4.44188 0.171982 2.42375 -0.826143 0.1725 1.12448C0.11871 1.17111 0.0754953 1.22868 0.0457468 1.29335C0.0159983 1.35802 0.000401672 1.4283 0 1.49948V11.9995C0 12.1321 0.0526785 12.2593 0.146447 12.353C0.240215 12.4468 0.367392 12.4995 0.5 12.4995C0.632608 12.4995 0.759785 12.4468 0.853553 12.353C0.947321 12.2593 1 12.1321 1 11.9995V9.23511C2.67438 7.91261 4.11687 8.62573 5.77812 9.44823C7.55875 10.3289 9.57625 11.327 11.8275 9.37761C11.8813 9.33098 11.9245 9.27341 11.9543 9.20874C11.984 9.14407 11.9996 9.07379 12 9.00261V1.49948C11.9997 1.40389 11.9719 1.31041 11.9201 1.2301C11.8682 1.14979 11.7945 1.08603 11.7075 1.04636ZM11 2.47448V5.01511C10.125 5.70636 9.3125 5.84136 8.5 5.69511V2.95823C9.36424 3.09324 10.2485 2.92214 11 2.47448ZM7.5 2.70948V5.39698C7.08375 5.23011 6.66063 5.02198 6.22188 4.80448C5.67063 4.53136 5.09688 4.24761 4.5 4.04323V1.35573C4.91625 1.52198 5.33937 1.73073 5.77812 1.94823C6.32937 2.22136 6.90375 2.50511 7.5 2.70948ZM3.5 1.05636V3.79261C2.63568 3.65784 1.75144 3.82916 1 4.27698V1.73573C1.875 1.04448 2.6875 0.910107 3.5 1.05636ZM2.91125 7.49948C2.23846 7.50066 1.57836 7.68263 1 8.02636V5.48573C1.875 4.79448 2.6875 4.65948 3.5 4.80573V7.54323C3.30506 7.51452 3.1083 7.4999 2.91125 7.49948ZM4.5 7.79136V5.10386C4.91625 5.27011 5.33937 5.47886 5.77812 5.69636C6.32937 5.96948 6.90312 6.25261 7.5 6.45698V9.14448C7.08375 8.97761 6.66063 8.76948 6.22188 8.55198C5.67063 8.27886 5.09625 7.99573 4.5 7.79136ZM8.5 9.44448V6.70698C8.69491 6.73611 8.89167 6.75115 9.08875 6.75198C9.76175 6.7499 10.4218 6.56707 11 6.22261V8.76511C10.125 9.45636 9.3125 9.59073 8.5 9.44448Z"
        fill="#ACF0C5"
      />
    </svg>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: "primary" | "muted";
};

function StatCard({ label, value, icon, variant = "muted" }: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={cn(
        "relative min-w-0 flex-1 rounded-xl p-4 sm:p-5",
        isPrimary ? "bg-primary text-white" : "border border-[#E2E8F0] bg-[#F6F8FA]",
      )}
    >
      <div
        className={cn(
          "absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg",
          isPrimary ? "bg-amdari-yellow text-primary" : "bg-primary text-white",
        )}
      >
        {icon}
      </div>
      <p
        className={cn(
          "pr-12 text-sm font-medium",
          isPrimary ? "text-white/80" : "text-[#64748B]",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 pr-12 text-2xl font-bold sm:text-[1.75rem]",
          isPrimary ? "text-white" : "text-[#092A31]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

const InternshipProgramOverview = ({
  stageLabel = "Uniformity stage",
  currentWeek = 1,
  totalWeeks = 16,
  stageProgress = 0,
  activitiesDone = 0,
  stagesCompleted = 0,
  totalStages = 6,
}: InternshipProgramOverviewProps) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#D7EEF4] px-4 py-2.5 text-sm font-semibold text-[#156374] transition hover:bg-[#C8E6EE]"
        >
          <Volume2 className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
          Announcement
        </button>

        <div className="inline-flex items-stretch overflow-hidden rounded-full bg-[#CFF6DA] text-sm font-semibold text-[#1F7A4A]">
          <span className="inline-flex items-center gap-2 py-2 pl-1.5 pr-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#238A50] text-white">
              <FlagIcon />
            </span>
            {stageLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 border-l border-[#B8E6C6] px-3 py-2">
            <span className="size-1.5 shrink-0 rounded-full bg-[#238A50]" aria-hidden />
            Week {currentWeek} of {totalWeeks}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current week"
          value={`Week ${currentWeek}`}
          variant="primary"
          icon={<Timer className="size-4" strokeWidth={2.25} aria-hidden />}
        />
        <StatCard
          label="Stage progress"
          value={`${stageProgress}%`}
          icon={<Timer className="size-4 text-amdari-yellow" strokeWidth={2.25} aria-hidden />}
        />
        <StatCard
          label="Activities done"
          value={String(activitiesDone)}
          icon={<PencilIcon />}
        />
        <StatCard
          label="Stages completed"
          value={`${stagesCompleted}/${totalStages}`}
          icon={<PencilIcon />}
        />
      </div>
    </section>
  );
};

export default InternshipProgramOverview;
