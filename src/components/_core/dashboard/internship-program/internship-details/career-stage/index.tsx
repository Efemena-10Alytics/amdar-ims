"use client";

import { useEffect, useMemo, useState } from "react";
import CareerStageCard, {
  type CareerStageCardData,
  type CareerStageStatus,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-card";
import CareerStageSidebar, {
  type CareerStageNavItem,
} from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-sidebar";
import type {
  EnrollmentCareerStageProgress,
  EnrollmentProgressSection,
} from "@/features/interns-project/use-get-internship-progress";
import { useGetInternshipProgress } from "@/features/interns-project/use-get-internship-progress";
import { InternProjectCareerStage } from "@/features/interns-project/internship-project.types";
import { usePublishedProjectsUnlockByStages } from "@/features/interns-project/use-get-project-by-stage";
import { isTenAlyticsEnrollment } from "@/features/internship/is-10alytics-cohort";
import {
  isOnboardingNotFoundError,
  useGetOnboarding,
} from "@/features/onboarding/use-get-onboarding";
import {
  isPreDiagnosticNotFoundError,
  useGetPreDiagnostic,
} from "@/features/pre-diagnostic/use-get-pre-diagnostic";
import { useSelectedEnrollmentIds } from "@/store/enrollment-selection-store";

type LiveStageState = {
  status: CareerStageStatus;
  progress: number;
};

const CAREER_STAGE_ID_BY_API_STAGE: Record<string, string> = {
  uniformity: "uniformity-stage",
  formative: "formative-stage",
  transitional: "transitional-stage",
  emerging: "emerging-stage",
  collaborative: "collaborative-stage",
  professional: "professional-stage",
};

const ALL_PROJECT_CAREER_STAGES = [
  InternProjectCareerStage.Uniformity,
  InternProjectCareerStage.Formative,
  InternProjectCareerStage.Transitional,
  InternProjectCareerStage.Emerging,
  InternProjectCareerStage.Collaborative,
  InternProjectCareerStage.Professional,
] as const;

const CAREER_STAGE_NAV: CareerStageNavItem[] = [
  { id: "onboarding", label: "On-boarding", status: "locked" },
  { id: "pre-entry-diagnostic", label: "Pre-entry diagnostic", status: "locked" },
  { id: "uniformity-stage", label: "Uniformity stage", status: "locked" },
  { id: "formative-stage", label: "Formative stage", status: "locked" },
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
    progress: 0,
    status: "locked",
  },
  {
    id: "formative-stage",
    title: "Formative stage",
    subtitle: "Week 3-6",
    progress: 0,
    status: "locked",
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

/**
 * 10Alytics cohorts join at the emerging stage, so onboarding, the pre-entry
 * diagnostic and the first three career stages are hidden for them and the
 * remaining stages are re-labelled to start from week 1.
 */
const TEN_ALYTICS_STAGE_IDS = [
  "emerging-stage",
  "collaborative-stage",
  "professional-stage",
] as const;

const TEN_ALYTICS_STAGE_ID_SET = new Set<string>(TEN_ALYTICS_STAGE_IDS);

const TEN_ALYTICS_STAGE_SUBTITLES: Record<string, string> = {
  "emerging-stage": "Week 1-2",
  "collaborative-stage": "Week 3-4",
  "professional-stage": "Week 5-6",
};

function clampPercent(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function resolveResourceStageState({
  hasResource,
  isResolvingResource,
  notFound,
  section,
}: {
  hasResource: boolean;
  isResolvingResource: boolean;
  notFound: boolean;
  section: EnrollmentProgressSection | undefined;
}): LiveStageState {
  if (isResolvingResource || notFound || !hasResource) {
    return { status: "locked", progress: 0 };
  }

  const progress = clampPercent(section?.percent);
  if (section?.isComplete || progress >= 100) {
    return { status: "completed", progress: 100 };
  }

  // Onboarding / pre-entry stay locked (not expandable) until every step is done.
  // Progress % still reflects enrollment completion so far.
  return { status: "locked", progress };
}

/**
 * Unlocks from Active/Completed (published) projects. Enrollment percent still
 * drives completed / active / upcoming once unlocked.
 */
function resolveCareerStageState({
  stage,
  hasUnlockingProject,
  isResolvingProjects,
}: {
  stage: EnrollmentCareerStageProgress | undefined;
  hasUnlockingProject: boolean;
  isResolvingProjects: boolean;
}): LiveStageState {
  if (isResolvingProjects || !hasUnlockingProject) {
    return { status: "locked", progress: 0 };
  }

  const progress = clampPercent(stage?.percent);

  if (stage?.isComplete || progress >= 100) {
    return { status: "completed", progress: 100 };
  }

  if (progress > 0) {
    return { status: "active", progress };
  }

  return { status: "upcoming", progress: 0 };
}

const CareerStage = () => {
  const {
    data: onboarding,
    isLoading: isOnboardingQueryLoading,
    isPending: isOnboardingPending,
    isError: isOnboardingError,
    error: onboardingError,
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
    cohortId: preDiagnosticCohortId,
    programId: preDiagnosticProgramId,
    isEnrollmentLoading: isPreDiagnosticEnrollmentLoading,
  } = useGetPreDiagnostic();

  const {
    data: enrollmentProgress,
    isLoading: isProgressLoading,
    isPending: isProgressPending,
    isEnrollmentLoading: isProgressEnrollmentLoading,
    enrollment,
    cohortId: progressCohortId,
    programId: progressProgramId,
  } = useGetInternshipProgress();

  const { cohortId: selectedCohortId, programId: selectedProgramId } =
    useSelectedEnrollmentIds();
  const cohortId = progressCohortId ?? selectedCohortId;
  const programId = progressProgramId ?? selectedProgramId;

  const isTenAlytics = isTenAlyticsEnrollment(enrollment);

  const visibleProjectStages = useMemo(
    () =>
      (isTenAlytics
        ? ALL_PROJECT_CAREER_STAGES.filter((stage) =>
            TEN_ALYTICS_STAGE_ID_SET.has(CAREER_STAGE_ID_BY_API_STAGE[stage]),
          )
        : [...ALL_PROJECT_CAREER_STAGES]) as InternProjectCareerStage[],
    [isTenAlytics],
  );

  const {
    unlockingByApiStage,
    isResolving: isResolvingPublishedProjects,
  } = usePublishedProjectsUnlockByStages(visibleProjectStages, {
    cohortId,
    programId,
  });

  const unlockSignature = visibleProjectStages
    .map((stage) => `${stage}:${unlockingByApiStage[stage] ? "1" : "0"}`)
    .join("|");

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

  const isResolvingProgress =
    isProgressEnrollmentLoading || isProgressPending || isProgressLoading;

  const onboardingStage = useMemo(
    () =>
      resolveResourceStageState({
        hasResource: !!onboarding,
        isResolvingResource: isResolvingOnboarding || isResolvingProgress,
        notFound: onboardingNotFound,
        section: enrollmentProgress?.onboarding,
      }),
    [
      enrollmentProgress?.onboarding,
      isResolvingOnboarding,
      isResolvingProgress,
      onboarding,
      onboardingNotFound,
    ],
  );

  const preDiagnosticStage = useMemo(
    () =>
      resolveResourceStageState({
        hasResource: !!preDiagnostic,
        isResolvingResource: isResolvingPreDiagnostic || isResolvingProgress,
        notFound: preDiagnosticNotFound,
        section: enrollmentProgress?.preDiagnostic,
      }),
    [
      enrollmentProgress?.preDiagnostic,
      isResolvingPreDiagnostic,
      isResolvingProgress,
      preDiagnostic,
      preDiagnosticNotFound,
    ],
  );

  const careerStageStates = useMemo(() => {
    const states = new Map<string, LiveStageState>();
    const allStages = enrollmentProgress?.careerStages ?? [];

    if (isResolvingProgress || isResolvingPublishedProjects) {
      return states;
    }

    const progressByApiStage = new Map(
      allStages.map((stage) => [stage.stage, stage] as const),
    );

    visibleProjectStages.forEach((apiStage) => {
      const cardId = CAREER_STAGE_ID_BY_API_STAGE[apiStage];
      if (!cardId) return;

      states.set(
        cardId,
        resolveCareerStageState({
          stage: progressByApiStage.get(apiStage),
          hasUnlockingProject: unlockingByApiStage[apiStage] === true,
          isResolvingProjects: false,
        }),
      );
    });

    return states;
  }, [
    enrollmentProgress?.careerStages,
    isResolvingProgress,
    isResolvingPublishedProjects,
    unlockSignature,
    unlockingByApiStage,
    visibleProjectStages,
  ]);

  const stageNav = useMemo(
    () =>
      CAREER_STAGE_NAV.filter(
        (item) => !isTenAlytics || TEN_ALYTICS_STAGE_ID_SET.has(item.id),
      ).map((item) => {
        if (item.id === "onboarding") {
          return { ...item, status: onboardingStage.status };
        }
        if (item.id === "pre-entry-diagnostic") {
          return { ...item, status: preDiagnosticStage.status };
        }

        const live = careerStageStates.get(item.id);
        return live ? { ...item, status: live.status } : item;
      }),
    [
      careerStageStates,
      isTenAlytics,
      onboardingStage.status,
      preDiagnosticStage.status,
    ],
  );

  const stageCards = useMemo(
    () =>
      CAREER_STAGE_CARDS.filter(
        (card) => !isTenAlytics || TEN_ALYTICS_STAGE_ID_SET.has(card.id),
      ).map((card) => {
        const base = isTenAlytics
          ? {
              ...card,
              subtitle: TEN_ALYTICS_STAGE_SUBTITLES[card.id] ?? card.subtitle,
            }
          : card;

        if (base.id === "onboarding") {
          return {
            ...base,
            status: onboardingStage.status,
            progress: onboardingStage.progress,
          };
        }
        if (base.id === "pre-entry-diagnostic") {
          return {
            ...base,
            status: preDiagnosticStage.status,
            progress: preDiagnosticStage.progress,
          };
        }

        const live = careerStageStates.get(base.id);
        return live
          ? { ...base, status: live.status, progress: live.progress }
          : base;
      }),
    [
      careerStageStates,
      isTenAlytics,
      onboardingStage.progress,
      onboardingStage.status,
      preDiagnosticStage.progress,
      preDiagnosticStage.status,
    ],
  );

  const defaultExpandedStageId = useMemo(() => {
    const activeCard = stageCards.find((card) => card.status === "active");
    if (activeCard) return activeCard.id;

    const completedCard = [...stageCards]
      .reverse()
      .find((card) => card.status === "completed");
    return completedCard?.id ?? "";
  }, [stageCards]);

  const [activeStageId, setActiveStageId] = useState("");
  const [expandedStageId, setExpandedStageId] = useState("");
  const [hasUserSelectedStage, setHasUserSelectedStage] = useState(false);

  useEffect(() => {
    if (hasUserSelectedStage) return;
    if (!defaultExpandedStageId) return;

    setActiveStageId(defaultExpandedStageId);
    setExpandedStageId(defaultExpandedStageId);
  }, [defaultExpandedStageId, hasUserSelectedStage]);

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

  useEffect(() => {
    const card = stageCards.find((item) => item.id === expandedStageId);
    if (card?.status === "locked") {
      setExpandedStageId("");
    }
  }, [expandedStageId, stageCards]);

  const handleSelectStage = (stageId: string) => {
    setHasUserSelectedStage(true);
    setActiveStageId(stageId);
    const card = stageCards.find((item) => item.id === stageId);
    if (card && card.status !== "locked") {
      setExpandedStageId(stageId);
    }
  };

  const handleToggleCard = (stageId: string) => {
    const card = stageCards.find((item) => item.id === stageId);
    if (!card || card.status === "locked") return;

    setHasUserSelectedStage(true);
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
