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
import {
  resolveUserEmail,
  resolveUserFullName,
  unwrapUser,
} from "@/lib/user-profile";
import { formatCohortLabel } from "@/types/internship-program/user-program";

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

function formatStatusLabel(status?: string | null) {
  const value = status?.trim();
  if (!value) return "Active";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function isActiveStatus(status?: string | null) {
  const value = status?.trim().toLowerCase();
  return !value || value === "active" || value === "enrolled";
}

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

  const userRecord = unwrapUser(userInfo ?? null);
  const displayName = resolveUserFullName(userRecord) || "Intern";
  const email = resolveUserEmail(userRecord);
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);

  const enrollment = enrollmentQuery.data;
  const details = detailsQuery.data;
  const current = currentProjectQuery.data;

  const stageLabel = current?.project
    ? formatCareerStageLabel(current.project.careerStage)
    : null;
  const currentWeek = current?.currentWeek ?? enrollment?.cohort.active_week;
  const totalWeeks = current?.duration ?? enrollment?.cohort.duration;
  const taskProgress =
    typeof current?.stageProgress === "number" ? current.stageProgress : null;

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
  const statusLabel = formatStatusLabel(enrollment?.status);
  const active = isActiveStatus(enrollment?.status);

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href="/dashboard/internship-program"
          className="inline-flex items-center gap-2 text-2xl font-semibold text-[#092A31] transition-colors hover:text-[#156374]"
        >
          <ArrowLeft className="size-5 shrink-0" aria-hidden />
          Profile
        </Link>

        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#C7F5D8] py-1.5 pr-3 pl-1.5 text-sm font-medium text-[#092A31]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1F5D36] text-white">
                <FlagIcon />
              </span>
              {currentProjectQuery.isLoading
                ? "Loading..."
                : stageLabel || "No current stage"}
            </span>
            <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#C7F5D8] px-3 text-sm font-medium text-[#092A31]">
              <span
                className="size-1.5 shrink-0 rounded-full bg-[#092A31]"
                aria-hidden
              />
              {currentProjectQuery.isLoading ||
              currentWeek == null ||
              !totalWeeks
                ? "—"
                : `Week ${currentWeek} of ${totalWeeks}`}
            </span>
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
      </div>

      <section className="space-y-5">
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
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-[#238A50]" : "bg-[#B91C1C]",
                )}
                aria-hidden
              />
              {statusLabel}
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

        <div className="grid grid-cols-2 gap-y-4 border-y border-[#EEF2F6] py-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-[#EEF2F6]">
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
