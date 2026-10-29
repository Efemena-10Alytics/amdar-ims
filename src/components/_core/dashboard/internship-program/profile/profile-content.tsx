"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  Briefcase,
  Copy,
  Check,
  Users,
  Award,
} from "lucide-react";
import { DefermentDialog } from "@/components/_core/dashboard/layout/deferment-dialog";
import { formatCareerStageLabel } from "@/components/_core/dashboard/internship-program/project-details/project-content";
import { UserAvatar } from "@/components/_core/landing-pages/internship-program/svg";
import {
  getAvatarUrlFromUser,
  useGetUserInfo,
} from "@/features/auth/use-get-user-info";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import {
  useGetInternshipDetails,
  type InternshipDetails,
} from "@/features/interns-project/use-get-internship-details";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { cn } from "@/lib/utils";
import { formatCohortLabel } from "@/types/internship-program/user-program";



function formatOrdinalDay(day: number) {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatJoinedDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = formatOrdinalDay(date.getDate());
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function formatProgramCohort(details: InternshipDetails): string {
  const programTitle = details.program?.title?.trim() ?? "";
  const cohortName = details.cohort?.name?.trim() ?? "";
  if (programTitle && cohortName) return `${cohortName} ${programTitle}`;
  return programTitle || cohortName;
}

function formatHoursPerWeek(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/hour/i.test(trimmed)) return trimmed;
  return `${trimmed} hours`;
}

// const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
//
// function isActiveFromLastSeen(lastSeen?: string | null): boolean {
//   if (!lastSeen?.trim()) return false;
//   const seenAt = new Date(lastSeen).getTime();
//   if (Number.isNaN(seenAt)) return false;
//   return Date.now() - seenAt < ACTIVE_WINDOW_MS;
// }

function assessmentCaption(score: number | null) {
  if (score == null) return null;
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Improvement";
}

function taskCaption(progress: number | null) {
  if (progress == null) return null;
  if (progress >= 100) return "Completed";
  if (progress > 0) return "Ongoing";
  return "Not started";
}

function attendanceCaption(score: number | null) {
  if (score == null) return null;
  if (score >= 80) return "On target";
  return "Below 80% target";
}

function DetailField({
  label,
  value,
  placeholder = "—",
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
}) {
  const display = value?.trim() || placeholder;
  const isPlaceholder = !value?.trim();

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-medium text-[#334155]">{label}</p>
      <div
        className={cn(
          "flex min-h-11 items-center rounded-lg bg-white px-3 py-2.5 text-sm",
          isPlaceholder ? "text-[#94A3B8]" : "text-[#092A31]",
        )}
      >
        {display}
      </div>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 first:pl-0 last:pr-0 sm:px-4">
      <p className="text-xs text-[#94A3B8] sm:text-sm">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-[#092A31] sm:text-base">
        {value}
      </p>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  caption?: string | null;
  icon: React.ReactNode;
  iconClassName?: string;
  valueClassName?: string;
};

function MetricCard({
  label,
  value,
  caption,
  icon,
  iconClassName,
  valueClassName,
}: MetricCardProps) {
  return (
    <div className="relative min-w-0 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div
        className={cn(
          "absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg",
          iconClassName ?? "bg-[#156374] text-white",
        )}
      >
        {icon}
      </div>
      <p className="pr-12 text-sm font-medium text-[#64748B]">{label}</p>
      <p
        className={cn(
          "mt-2 pr-12 text-3xl font-semibold tracking-tight",
          valueClassName ?? "text-[#092A31]",
        )}
      >
        {value}
      </p>
      {caption ? (
        <p className="mt-2 text-sm text-[#94A3B8]">{caption}</p>
      ) : null}
    </div>
  );
}

export default function ProfileContent() {
  const [deferOpen, setDeferOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: userInfo } = useGetUserInfo();
  const enrollmentQuery = useGetUserEnrollment();
  const detailsQuery = useGetInternshipDetails();
  const currentProjectQuery = useGetCurrentProject();

  const displayName =
    [userInfo?.firstName, userInfo?.lastName]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(" ")
      .trim() || "Intern";
  const email = userInfo?.email?.trim() ?? "";
  const avatarUrl = getAvatarUrlFromUser(userInfo);

  const enrollment = enrollmentQuery.data;
  const details = detailsQuery.data;
  const project = currentProjectQuery.data?.currentProject;

  const taskProgress =
    typeof project?.stageProgress === "number" ? project.stageProgress : null;

  const cohortLabel = enrollment?.cohort
    ? formatCohortLabel(enrollment.cohort)
    : details?.cohort?.name?.trim() || "—";
  const programLabel =
    enrollment?.program?.title?.trim() ||
    details?.program?.title?.trim() ||
    "—";
  const locationLabel = details?.location?.trim() || "—";
  const businessLabel = enrollment?.program?.company_name?.trim() || "—";
  const joinedLabel = formatJoinedDate(enrollment?.joined_at);
  // const active = isActiveFromLastSeen(userInfo?.last_seen);
  // const statusLabel = active ? "Active" : "Inactive";
  const active = true;

  const metaItems = useMemo(
    () => [
      { label: "Cohort", value: cohortLabel },
      { label: "Program", value: programLabel },
      { label: "Location", value: locationLabel },
      { label: "Business", value: businessLabel },
      { label: "Date joined", value: joinedLabel },
    ],
    [businessLabel, cohortLabel, joinedLabel, locationLabel, programLabel],
  );

  const handleCopyEmail = async () => {
    if (!email || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 lg:px-6">

      <section className="space-y-5 bg-[#F8FAFC] rounded-2xl p-4 sm:p-5">
        <div className="flex justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative shrink-0 pb-3">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-[#156374] text-white sm:size-20">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    width={80}
                    height={80}
                    className="size-full object-cover"
                    unoptimized={avatarUrl.startsWith("http")}
                  />
                ) : (
                  <span className="scale-150 text-white [&_path]:fill-white">
                    <UserAvatar />
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-0.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  active
                    ? "bg-[#CFF6DA] text-[#1F7A4A]"
                    : "bg-[#FEE2E2] text-[#B91C1C]",
                  active
                    ? "bg-[#CFF6DA] text-[#1F7A4A]"
                    : "bg-[#FEE2E2] text-[#B91C1C]",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    // active ? "bg-[#238A50]" : "bg-[#B91C1C]",
                    active ? "bg-[#238A50]" : "bg-[#238A50]",
                  )}
                  aria-hidden
                />
                {/* {statusLabel} */}
                Active
              </span>
            </div>
            <div className="min-w-0 pt-1">
              <h1 className="truncate text-xl font-semibold text-[#092A31] sm:text-2xl">
                {displayName}
              </h1>
              {email ? (
                <button
                  type="button"
                  onClick={() => {
                    void handleCopyEmail();
                  }}
                  className="mt-1 inline-flex max-w-full items-center gap-1.5 text-sm text-[#64748B] transition-colors hover:text-[#156374]"
                  aria-label="Copy email"
                >
                  <span className="truncate">{email}</span>
                  {copied ? (
                    <Check className="size-3.5 shrink-0 text-[#1F7A4A]" />
                  ) : (
                    <Copy className="size-3.5 shrink-0 text-[#156374]" />
                  )}
                </button>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeferOpen(true)}
            className="inline-flex h-11 w-fit cursor-pointer items-center gap-2 rounded-xl bg-[#FFE082] px-4 text-sm font-semibold text-[#092A31] transition-colors hover:bg-[#FFD54F]"
          >
            <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
            Defer internship
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 py-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-[#EEF2F6]">
          {metaItems.map((item) => (
            <MetaCell key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Assessment score"
          value="—"
          caption={assessmentCaption(null)}
          icon={<Users className="size-4" strokeWidth={2.25} aria-hidden />}
          valueClassName="text-[#C47A2C]"
        />
        <MetricCard
          label="Task progress"
          value={taskProgress == null ? "—" : `${Math.round(taskProgress)}%`}
          caption={taskCaption(taskProgress)}
          icon={<Users className="size-4" strokeWidth={2.25} aria-hidden />}
          iconClassName="bg-[#CFF6DA] text-[#1F7A4A]"
          valueClassName="text-[#C47A2C]"
        />
        <MetricCard
          label="Attendance"
          value="—"
          caption={attendanceCaption(null)}
          icon={<Award className="size-4" strokeWidth={2.25} aria-hidden />}
          valueClassName="text-[#C47A2C]"
        />
        <MetricCard
          label="Sessions booked"
          value="—"
          icon={<Briefcase className="size-4" strokeWidth={2.25} aria-hidden />}
          iconClassName="bg-[#E8EFF1] text-[#156374]"
          valueClassName="text-[#156374]"
        />
      </section>

      <section className="rounded-2xl bg-[#E8EFF1] p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#092A31] sm:text-lg">
          Internship details
        </h2>

        {detailsQuery.isLoading || !detailsQuery.isAuthReady ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="min-w-0">
                <div className="mb-1.5 h-4 w-32 animate-pulse rounded bg-white/70" />
                <div className="h-11 animate-pulse rounded-lg bg-white/80" />
              </div>
            ))}
          </div>
        ) : detailsQuery.isError ? (
          <div className="mt-4 rounded-lg bg-white px-4 py-5">
            <p className="text-sm text-[#64748B]">
              Failed to load internship details.
            </p>
            <button
              type="button"
              onClick={() => {
                void detailsQuery.refetch();
              }}
              className="mt-3 text-sm font-medium text-[#156374] underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
            {details?.isSpecialistPreview ? (
              <p className="rounded-lg bg-white px-4 py-3 text-sm text-[#64748B] sm:col-span-2">
                You&apos;re viewing this cohort as a specialist. Personal fields
                are blank here.
              </p>
            ) : null}
            <DetailField
              label="Your Cohort/Program"
              value={details ? formatProgramCohort(details) : undefined}
            />
            <DetailField label="Your skill level" value={details?.skillLevel} />
            <DetailField
              label="Internship location"
              value={details?.location}
            />
            <DetailField label="Your gender" value={details?.gender} />
            <DetailField
              label="How did you hear about Amdari?"
              value={details?.findOut}
            />
            <DetailField
              label="Reason for decision"
              value={details?.decisionInfluenced}
              placeholder="Select for decision"
            />
            <DetailField
              label="Session of decision"
              value={details?.sessionInfluenced}
            />
            <DetailField
              label="How much time can you commit weekly?"
              value={formatHoursPerWeek(details?.hoursPerWeek)}
            />
          </div>
        )}
      </section>

      <DefermentDialog open={deferOpen} onOpenChange={setDeferOpen} />
    </div>
  );
}
