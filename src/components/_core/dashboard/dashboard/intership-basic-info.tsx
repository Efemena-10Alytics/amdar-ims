"use client";

import { useMemo } from "react";
import { Pencil, Timer, Users } from "lucide-react";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg bg-[#E8F4F8] text-[#156374]">
        {icon}
      </div>
      <p className="pr-12 text-sm text-[#64748B]">{label}</p>
      <p className="mt-1 pr-12 text-lg font-semibold text-[#092A31] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function getCohortPeriodLabel(cohort?: {
  month?: string | null;
  start_date?: string | null;
} | null) {
  const monthName = cohort?.month?.trim();
  if (monthName) return monthName;

  const startDate = cohort?.start_date?.trim();
  if (!startDate) return "—";

  const date = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", { month: "long" });
}

function getDurationLabel(duration?: number | null) {
  if (duration == null || duration <= 0) return "—";
  return `${duration} ${duration === 1 ? "Month" : "Months"}`;
}

const InternshipBasicInfo = () => {
  const { data: enrollment } = useGetUserEnrollment();

  const cohortPeriod = useMemo(
    () => getCohortPeriodLabel(enrollment?.cohort),
    [enrollment?.cohort],
  );

  const duration = useMemo(
    () => getDurationLabel(enrollment?.cohort?.duration),
    [enrollment?.cohort?.duration],
  );

  const totalProjects =
    enrollment?.projectCount != null ? String(enrollment.projectCount) : "—";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      <StatCard
        label="Cohort Period"
        value={cohortPeriod}
        icon={<Users className="size-4" strokeWidth={2} />}
      />
      <StatCard
        label="Duration"
        value={duration}
        icon={<Timer className="size-4" strokeWidth={2} />}
      />
      <StatCard
        label="Total Projects"
        value={totalProjects}
        icon={<Pencil className="size-4" strokeWidth={2} />}
      />
    </div>
  );
};

export default InternshipBasicInfo;
