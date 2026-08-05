"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { LockKeyHoleIcon, TrangleIcon } from "@/components/_core/dashboard/svg";
import { CustmDropdownIcon } from "@/components/_core/dashboard/internship-program/svg";
import OnboardingSession from "@/components/_core/dashboard/internship-program/internship-details/career-stage/onboarding";
import PreDiagnostic from "@/components/_core/dashboard/internship-program/internship-details/career-stage/pre-diagnostic";
import UniformityStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/uniformitive-stage";
import FormativeStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/formative-stage";
import TransitionalStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/transitional-stage";
import EmergingStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/emerging-stage";
import CollaborativeStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/collaborative-stage";
import ProfessionalStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage/professional-stage";
import { isOnboardingEnrollmentStepComplete } from "@/features/internship/use-update-completed-onboarding-step";
import {
  isPreDiagnosticEnrollmentStepComplete,
  PRE_DIAGNOSTIC_STEP_KEYS,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import {
  isOnboardingNotFoundError,
  useGetOnboarding,
} from "@/features/onboarding/use-get-onboarding";
import {
  isPreDiagnosticNotFoundError,
  useGetPreDiagnostic,
} from "@/features/pre-diagnostic/use-get-pre-diagnostic";
import { ONBOARDING_STEP_KEYS } from "@/features/onboarding/types";
import type {
  OnboardingStepsCompletedState,
  PreDiagnosticStepsCompletedState,
} from "@/types/user/enrollment";

type CareerStageStatus = "completed" | "active" | "upcoming" | "locked";

type CareerStageNavItem = {
  id: string;
  label: string;
  status: CareerStageStatus;
};

type CareerStageCardData = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  status: CareerStageStatus;
};

type LiveStageState = {
  status: CareerStageStatus;
  progress: number;
};

const CAREER_STAGE_NAV: CareerStageNavItem[] = [
  { id: "onboarding", label: "On-boarding", status: "locked" },
  { id: "pre-entry-diagnostic", label: "Pre-entry diagnostic", status: "locked" },
  { id: "uniformity-stage", label: "Uniformity stage", status: "active" },
  { id: "formative-stage", label: "Formative stage", status: "upcoming" },
  { id: "transitional-stage", label: "Transitional stage", status: "locked" },
  { id: "emerging-stage", label: "Emerging stage", status: "locked" },
  { id: "collaborative-stage", label: "Collaborative stage", status: "locked" },
  { id: "professional-stage", label: "Professional stage", status: "locked" },
];

const CAREER_STAGE_CARDS: CareerStageCardData[] = [
  {
    id: "onboarding",
    title: "On-boarding",
    subtitle: "Getting ready",
    progress: 0,
    status: "locked",
  },
  {
    id: "pre-entry-diagnostic",
    title: "Pre-entry diagnostic",
    subtitle: "Getting ready",
    progress: 0,
    status: "locked",
  },
  {
    id: "uniformity-stage",
    title: "Uniformity stage",
    subtitle: "Week 1-2",
    progress: 40,
    status: "active",
  },
  {
    id: "formative-stage",
    title: "Formative stage",
    subtitle: "Week 3-6",
    progress: 0,
    status: "upcoming",
  },
  {
    id: "transitional-stage",
    title: "Transitional stage",
    subtitle: "Week 7-10",
    progress: 0,
    status: "locked",
  },
  {
    id: "emerging-stage",
    title: "Emerging stage",
    subtitle: "Week 11-12",
    progress: 0,
    status: "locked",
  },
  {
    id: "collaborative-stage",
    title: "Collaborative stage",
    subtitle: "Week 13-14",
    progress: 0,
    status: "locked",
  },
  {
    id: "professional-stage",
    title: "Professional stage",
    subtitle: "Week 15-16",
    progress: 0,
    status: "locked",
  },
];

function getOnboardingProgress(
  steps: OnboardingStepsCompletedState | undefined,
): number {
  if (!steps || ONBOARDING_STEP_KEYS.length === 0) return 0;

  const completedCount = ONBOARDING_STEP_KEYS.filter((step) =>
    isOnboardingEnrollmentStepComplete(steps, step),
  ).length;

  return Math.round((completedCount / ONBOARDING_STEP_KEYS.length) * 100);
}

function getPreDiagnosticProgress(
  steps: PreDiagnosticStepsCompletedState | undefined,
): number {
  if (!steps || PRE_DIAGNOSTIC_STEP_KEYS.length === 0) return 0;

  const completedCount = PRE_DIAGNOSTIC_STEP_KEYS.filter((step) =>
    isPreDiagnosticEnrollmentStepComplete(steps, step),
  ).length;

  return Math.round((completedCount / PRE_DIAGNOSTIC_STEP_KEYS.length) * 100);
}

function resolveLiveStageState({
  hasResource,
  isResolving,
  notFound,
  progress,
}: {
  hasResource: boolean;
  isResolving: boolean;
  notFound: boolean;
  progress: number;
}): LiveStageState {
  if (isResolving || notFound || !hasResource) {
    return { status: "locked", progress: 0 };
  }

  if (progress >= 100) {
    return { status: "completed", progress: 100 };
  }

  return { status: "active", progress };
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

function CareerStageSidebar({
  items,
  onSelect,
}: {
  items: CareerStageNavItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-[#092A31] sm:text-base">
        Career stage
      </h3>

      <ul className="mt-3 space-y-0.5">
        {items.map((item) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "active";

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition sm:text-sm",
                  isCompleted && "bg-primary text-white",
                  isInProgress && "bg-[#CFF6DA] text-[#156374]",
                  !isCompleted &&
                    !isInProgress &&
                    "text-[#98A2B3] hover:bg-[#F6F8FA] hover:text-[#64748B]",
                )}
              >
                <span className="min-w-0 leading-snug">{item.label}</span>
                {isCompleted ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-amdari-yellow text-primary">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                ) : isInProgress ? (
                  <Loader
                    className="size-4 shrink-0 animate-spin text-[#156374]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : (
                  <TrangleIcon />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function CareerStageCard({
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

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border transition",
        isCompleted && !isExpanded && "border-primary bg-primary text-white",
        isExpandedCompleted && "border-[#E2E8F0] bg-white",
        isActive && "border-[#9FD4B0] bg-[#E8F7EC]",
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
        <UniformityStage />
      ) : isExpanded && card.id === "formative-stage" ? (
        <FormativeStage />
      ) : isExpanded && card.id === "transitional-stage" ? (
        <TransitionalStage />
      ) : isExpanded && card.id === "emerging-stage" ? (
        <EmergingStage />
      ) : isExpanded && card.id === "collaborative-stage" ? (
        <CollaborativeStage />
      ) : isExpanded && card.id === "professional-stage" ? (
        <ProfessionalStage />
      ) : null}
    </article>
  );
}

const CareerStage = () => {
  const {
    data: onboarding,
    isLoading: isOnboardingQueryLoading,
    isPending: isOnboardingPending,
    isError: isOnboardingError,
    error: onboardingError,
    enrollment: onboardingEnrollment,
    cohortId: onboardingCohortId,
    programId: onboardingProgramId,
    isEnrollmentLoading: isOnboardingEnrollmentLoading,
  } = useGetOnboarding();

  const {
    data: preDiagnostic,
    isLoading: isPreDiagnosticQueryLoading,
    isPending: isPreDiagnosticPending,
    isError: isPreDiagnosticError,
    error: preDiagnosticError,
    enrollment: preDiagnosticEnrollment,
    cohortId: preDiagnosticCohortId,
    programId: preDiagnosticProgramId,
    isEnrollmentLoading: isPreDiagnosticEnrollmentLoading,
  } = useGetPreDiagnostic();

  const isOnboardingLoading = isOnboardingPending || isOnboardingQueryLoading;
  const isResolvingOnboarding =
    isOnboardingEnrollmentLoading ||
    (onboardingCohortId != null &&
      onboardingProgramId != null &&
      isOnboardingLoading);
  const onboardingNotFound =
    onboardingCohortId != null &&
    onboardingProgramId != null &&
    !isOnboardingLoading &&
    !isOnboardingEnrollmentLoading &&
    isOnboardingError &&
    isOnboardingNotFoundError(onboardingError);

  const isPreDiagnosticLoading =
    isPreDiagnosticPending || isPreDiagnosticQueryLoading;
  const isResolvingPreDiagnostic =
    isPreDiagnosticEnrollmentLoading ||
    (preDiagnosticCohortId != null &&
      preDiagnosticProgramId != null &&
      isPreDiagnosticLoading);
  const preDiagnosticNotFound =
    preDiagnosticCohortId != null &&
    preDiagnosticProgramId != null &&
    !isPreDiagnosticLoading &&
    !isPreDiagnosticEnrollmentLoading &&
    isPreDiagnosticError &&
    isPreDiagnosticNotFoundError(preDiagnosticError);

  const onboardingStage = useMemo(
    () =>
      resolveLiveStageState({
        hasResource: !!onboarding,
        isResolving: isResolvingOnboarding,
        notFound: onboardingNotFound,
        progress: getOnboardingProgress(
          onboardingEnrollment?.isOnboardingStepsCompleted,
        ),
      }),
    [
      isResolvingOnboarding,
      onboarding,
      onboardingEnrollment?.isOnboardingStepsCompleted,
      onboardingNotFound,
    ],
  );

  const preDiagnosticStage = useMemo(
    () =>
      resolveLiveStageState({
        hasResource: !!preDiagnostic,
        isResolving: isResolvingPreDiagnostic,
        notFound: preDiagnosticNotFound,
        progress: getPreDiagnosticProgress(
          preDiagnosticEnrollment?.isPreDiagnosticStepsCompleted,
        ),
      }),
    [
      isResolvingPreDiagnostic,
      preDiagnostic,
      preDiagnosticEnrollment?.isPreDiagnosticStepsCompleted,
      preDiagnosticNotFound,
    ],
  );

  const stageNav = useMemo(
    () =>
      CAREER_STAGE_NAV.map((item) => {
        if (item.id === "onboarding") {
          return { ...item, status: onboardingStage.status };
        }
        if (item.id === "pre-entry-diagnostic") {
          return { ...item, status: preDiagnosticStage.status };
        }
        return item;
      }),
    [onboardingStage.status, preDiagnosticStage.status],
  );

  const stageCards = useMemo(
    () =>
      CAREER_STAGE_CARDS.map((card) => {
        if (card.id === "onboarding") {
          return {
            ...card,
            status: onboardingStage.status,
            progress: onboardingStage.progress,
          };
        }
        if (card.id === "pre-entry-diagnostic") {
          return {
            ...card,
            status: preDiagnosticStage.status,
            progress: preDiagnosticStage.progress,
          };
        }
        return card;
      }),
    [
      onboardingStage.progress,
      onboardingStage.status,
      preDiagnosticStage.progress,
      preDiagnosticStage.status,
    ],
  );

  const [activeStageId, setActiveStageId] = useState("uniformity-stage");
  const [expandedStageId, setExpandedStageId] = useState("uniformity-stage");

  useEffect(() => {
    if (
      (onboardingStage.status === "locked" &&
        expandedStageId === "onboarding") ||
      (preDiagnosticStage.status === "locked" &&
        expandedStageId === "pre-entry-diagnostic")
    ) {
      setExpandedStageId("");
    }
  }, [
    expandedStageId,
    onboardingStage.status,
    preDiagnosticStage.status,
  ]);

  const handleSelectStage = (stageId: string) => {
    setActiveStageId(stageId);
    const card = stageCards.find((item) => item.id === stageId);
    if (card && card.status !== "locked") {
      setExpandedStageId(stageId);
    }
  };

  const handleToggleCard = (stageId: string) => {
    const card = stageCards.find((item) => item.id === stageId);
    if (!card || card.status === "locked") return;

    setActiveStageId(stageId);
    setExpandedStageId((current) => (current === stageId ? "" : stageId));
  };

  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-4">
      <CareerStageSidebar items={stageNav} onSelect={handleSelectStage} />

      <div className="space-y-3">
        {stageCards.map((card) => (
          <CareerStageCard
            key={card.id}
            card={card}
            isExpanded={expandedStageId === card.id}
            onToggle={() => handleToggleCard(card.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default CareerStage;
