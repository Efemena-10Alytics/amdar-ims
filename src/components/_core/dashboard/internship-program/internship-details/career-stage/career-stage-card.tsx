import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LockKeyHoleIcon } from "@/components/_core/dashboard/svg";
import { CustmDropdownIcon } from "@/components/_core/dashboard/internship-program/svg";
import OnboardingSession from "@/components/_core/dashboard/internship-program/internship-details/career-stage/onboarding";
import PreDiagnostic from "@/components/_core/dashboard/internship-program/internship-details/career-stage/pre-diagnostic";
import UniformityStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/uniformitive-stage";
import FormativeStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/formative-stage";
import TransitionalStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/transitional-stage";
import EmergingStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/emerging-stage";
import CollaborativeStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/collaborative-stage";
import ProfessionalStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/professional-stage";
import type { StageProjectScheduleTone } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/stage-project-schedule";

export type CareerStageStatus = "completed" | "active" | "upcoming" | "locked";

export type CareerStageCardData = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  status: CareerStageStatus;
};

function scheduleToneFromStatus(
  status: CareerStageStatus,
): StageProjectScheduleTone {
  if (status === "locked") return "locked";
  if (status === "upcoming") return "upcoming";
  return "active";
}

function CareerStageProgressRing({
  progress,
  variant = "default",
}: {
  progress: number;
  variant?: "default" | "completed" | "active" | "muted";
}) {
  const strokeColor =
    variant === "completed"
      ? "#FFE082"
      : variant === "active"
        ? "#238A50"
        : variant === "muted"
          ? "#CBD5E1"
          : "#94A3B8";

  const textColor =
    variant === "completed"
      ? "text-white"
      : variant === "active"
        ? "text-[#238A50]"
        : "text-[#94A3B8]";

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center">
      <svg className="size-10 -rotate-90" viewBox="0 0 40 40" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white/20"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={cn("absolute text-[10px] font-semibold", textColor)}>
        {progress === 100 ? "100" : `${progress}%`}
      </span>
    </div>
  );
}

function CareerStageCheckIcon({ completed = false }: { completed?: boolean }) {
  if (completed) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amdari-yellow text-primary">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </span>
    );
  }

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#DCE5E9] bg-white text-[#94A3B8]">
      <span className="size-3.5 rounded-sm border border-[#CBD5E1]" aria-hidden />
    </span>
  );
}

export default function CareerStageCard({
  card,
  isExpanded,
  onToggle,
}: {
  card: CareerStageCardData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const isCompleted = card.status === "completed";
  const isActive = card.status === "active";
  const isUpcoming = card.status === "upcoming";
  const isLocked = card.status === "locked";
  const isExpandedCompleted = isCompleted && isExpanded;
  const scheduleTone = scheduleToneFromStatus(card.status);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border transition",
        isCompleted && !isExpanded && "border-primary bg-primary text-white",
        isExpandedCompleted && "border-[#E2E8F0] bg-white",
        isActive && "border-[#86E9AA] bg-[#EDFCF2]",
        isUpcoming && "border-[#F0D9C4] bg-[#FFF4EA]",
        isLocked && "border-[#E2E8F0] bg-[#F8FAFC]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={isLocked}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5",
          isLocked && "cursor-default",
        )}
      >
        {isCompleted ? (
          isExpanded ? (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Check className="size-4" strokeWidth={3} aria-hidden />
            </span>
          ) : (
            <CareerStageCheckIcon completed />
          )
        ) : isUpcoming ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amdari-yellow/90 text-primary">
            <span className="size-3.5 rounded-full border-2 border-primary" />
          </span>
        ) : isActive ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#238A50] text-white">
            <span className="size-3 rounded-sm bg-white/90" aria-hidden />
          </span>
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E2E8F0]">
            <LockKeyHoleIcon />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-semibold sm:text-base",
              isCompleted && !isExpanded && "text-white",
              (isExpandedCompleted || isActive || isUpcoming) && "text-[#092A31]",
              isLocked && "text-[#64748B]",
            )}
          >
            {card.title}
          </p>
          <p
            className={cn(
              "text-xs sm:text-sm",
              isCompleted && !isExpanded && "text-white/75",
              (isExpandedCompleted || isActive || isUpcoming) && "text-[#64748B]",
              isLocked && "text-[#94A3B8]",
            )}
          >
            {card.subtitle}
          </p>
        </div>

        <CareerStageProgressRing
          progress={card.progress}
          variant={
            isExpandedCompleted || isActive
              ? "active"
              : isCompleted
                ? "completed"
                : "muted"
          }
        />

        {isLocked ? (
          <span
            className="flex size-4 shrink-0 rotate-90 items-center justify-center text-[#94A3B8]"
            aria-hidden
          >
            <CustmDropdownIcon />
          </span>
        ) : isExpanded ? (
          <span
            className={cn(
              "flex size-4 shrink-0 rotate-90 items-center justify-center",
              isCompleted && !isExpanded ? "text-white/80" : "text-[#64748B]",
            )}
            aria-hidden
          >
            <CustmDropdownIcon />
          </span>
        ) : (
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center",
              isCompleted ? "text-white/80" : "text-[#64748B]",
            )}
            aria-hidden
          >
            <CustmDropdownIcon />
          </span>
        )}
      </button>

      {isExpanded && card.id === "onboarding" ? (
        <OnboardingSession />
      ) : isExpanded && card.id === "pre-entry-diagnostic" ? (
        <PreDiagnostic />
      ) : isExpanded && card.id === "uniformity-stage" ? (
        <UniformityStage tone={scheduleTone} />
      ) : isExpanded && card.id === "formative-stage" ? (
        <FormativeStage tone={scheduleTone} />
      ) : isExpanded && card.id === "transitional-stage" ? (
        <TransitionalStage tone={scheduleTone} />
      ) : isExpanded && card.id === "emerging-stage" ? (
        <EmergingStage tone={scheduleTone} />
      ) : isExpanded && card.id === "collaborative-stage" ? (
        <CollaborativeStage tone={scheduleTone} />
      ) : isExpanded && card.id === "professional-stage" ? (
        <ProfessionalStage tone={scheduleTone} />
      ) : null}
    </article>
  );
}
