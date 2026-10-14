"use client";

import Link from "next/link";
import { Timer, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PencilIcon } from "../svg";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import { useIsSpecialistPreview } from "@/features/internship/use-is-specialist-preview";
import PageHeader from "../dashboard/header";

/**
 * These three cards count one intern's completion. A specialist servicing the
 * cohort has none, so a zero would read as "nobody has done anything" rather
 * than "this figure isn't about you".
 */
const PERSONAL_STAT_HINT =
  "Tracks an individual intern's completion. You're viewing this cohort as a specialist, so it doesn't apply to you.";

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: "primary" | "muted";
  /** Explains a non-value (e.g. "—") on hover, rather than leaving it bare. */
  title?: string;
};

function StatCard({
  label,
  value,
  icon,
  variant = "muted",
  title,
}: StatCardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      title={title}
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

const InternshipProgramOverview = () => {
  const currentProjectQuery = useGetCurrentProject();
  const current = currentProjectQuery.data;


  const currentWeek = current?.currentWeek ?? 0;
  const stageProgress = current?.stageProgress ?? 0;
  const activitiesDone = current?.activitiesDone ?? 0;
  const activitiesTotal = current?.activitiesTotal ?? 0;
  const stagesCompleted = current?.stagesCompleted ?? 0;
  const totalStages = current?.stagesTotal ?? 0;
  const isLoading = currentProjectQuery.isLoading;
  const { isPreview } = useIsSpecialistPreview();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/internship-program/announcement"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#D7EEF4] px-4 py-2.5 text-sm font-semibold text-[#156374] transition hover:bg-[#C8E6EE]"
        >
          <Volume2 className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
          Announcement
        </Link>

        <PageHeader />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current week"
          value={isLoading ? "—" : `Week ${currentWeek}`}
          variant="primary"
          icon={<Timer className="size-4" strokeWidth={2.25} aria-hidden />}
        />
        <StatCard
          label="Stage progress"
          value={isLoading ? "—" : isPreview ? "—" : `${stageProgress}%`}
          title={isPreview ? PERSONAL_STAT_HINT : undefined}
          icon={
            <Timer
              className="size-4 text-amdari-yellow"
              strokeWidth={2.25}
              aria-hidden
            />
          }
        />
        <StatCard
          label="Task done"
          value={
            isLoading
              ? "—"
              : isPreview
                ? "—"
                : `${activitiesDone}/${activitiesTotal}`
          }
          title={isPreview ? PERSONAL_STAT_HINT : undefined}
          icon={<PencilIcon />}
        />
        <StatCard
          label="Stages completed"
          value={
            isLoading
              ? "—"
              : isPreview
                ? "—"
                : `${stagesCompleted}/${totalStages}`
          }
          title={isPreview ? PERSONAL_STAT_HINT : undefined}
          icon={<PencilIcon />}
        />
      </div>
    </section>
  );
};

export default InternshipProgramOverview;
