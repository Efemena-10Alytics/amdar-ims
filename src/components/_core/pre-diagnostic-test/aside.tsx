"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import {
  isPreDiagnosticAsideStepLocked,
  isPreDiagnosticEnrollmentStepComplete,
} from "@/features/internship/use-update-completed-pre-diagnostic";
import {
  getCareerKnowledgeDiscoveryLastActiveStep,
  isCareerKnowledgeDiscoveryGroupCompleteOnBackend,
  useCareerKnowledgeDiscoveryProgress,
} from "@/features/pre-diagnostic/career-knowledge-discovery-progress";
import {
  getPracticalWalkthroughLastActiveStep,
  isPracticalWalkthroughGroupCompleteOnBackend,
  usePracticalWalkthroughProgress,
} from "@/features/pre-diagnostic/practical-walkthrough-progress";
import {
  buildCareerKnowledgeDiscoveryStepKey,
  isCareerKnowledgeDiscoveryStep,
} from "@/features/pre-diagnostic/career-knowledge-discovery-steps";
import {
  buildPracticalWalkthroughStepKey,
  isPracticalWalkthroughStep,
} from "@/features/pre-diagnostic/practical-walkthrough-steps";
import { useGetPreDiagnostic } from "@/features/pre-diagnostic/use-get-pre-diagnostic";
import type { PreDiagnosticStepsCompletedState } from "@/types/user/enrollment";
import { TriagleSVG } from "../onboarding/svg";
import ExpandCollapse from "./expand-collapse";

type StepItem = {
  key: string;
  label: string;
};

type GroupItem = {
  key: string;
  label: string;
  children: StepItem[];
};

type AsideEntry = StepItem | GroupItem;

function isGroupItem(entry: AsideEntry): entry is GroupItem {
  return "children" in entry;
}

type ReadinessGroup = {
  key: string;
  title: string;
  href: string;
  items: AsideEntry[];
};

function buildReadinessGroups(
  careerKnowledgeDiscoveryCount: number,
  practicalWalkthroughCount: number,
): ReadinessGroup[] {
  const careerKnowledgeChildren = Array.from(
    { length: careerKnowledgeDiscoveryCount },
    (_, index) => ({
      key: buildCareerKnowledgeDiscoveryStepKey(index),
      label: `Career knowledge discovery ${index + 1}`,
    }),
  );

  const practicalWalkthroughChildren = Array.from(
    { length: practicalWalkthroughCount },
    (_, index) => ({
      key: buildPracticalWalkthroughStepKey(index),
      label: `Practical walkthrough ${index + 1}`,
    }),
  );

  return [
    {
      key: "career-readiness",
      title: "Career Readiness",
      href: "/pre-diagnostic-test",
      items: [
        { key: "welcome-video", label: "Welcome video" },
        {
          key: "career-knowledge",
          label: "Career Knowledge discovery",
          children: careerKnowledgeChildren,
        },
        { key: "career-path-diagnostics", label: "Career path diagnostics" },
      ],
    },
    {
      key: "technology-readiness",
      title: "Technology Readiness",
      href: "/pre-diagnostic-test/technology-readiness",
      items: [
        { key: "technology-use-case", label: "Technology use case" },
        {
          key: "practical-walkthrough",
          label: "Practical walkthrough",
          children: practicalWalkthroughChildren,
        },
        { key: "technology-diagnostics", label: "Technology diagnostics" },
      ],
    },
    {
      key: "ims-readiness",
      title: "IMS Process",
      href: "/pre-diagnostic-test/ims-readiness",
      items: [
        { key: "how-the-ims-works", label: "How the IMS works" },
        { key: "ims-diagnostics", label: "IMS Diagnostics" },
      ],
    },
  ];
}

function getFlatStepsForGroup(group: ReadinessGroup) {
  return group.items.flatMap((item) =>
    isGroupItem(item) ? item.children : [item],
  );
}

function getActiveGroup(pathname: string, groups: ReadinessGroup[]) {
  return groups.find((group) => group.href === pathname) ?? groups[0];
}

function resolveCurrentStep(group: ReadinessGroup, stepParam: string | null) {
  const flatSteps = getFlatStepsForGroup(group);
  const defaultStep = flatSteps[0]?.key ?? "welcome-video";

  if (!stepParam) return defaultStep;

  const matchedStep = flatSteps.find((item) => item.key === stepParam)?.key;
  if (matchedStep) return matchedStep;

  if (
    isCareerKnowledgeDiscoveryStep(stepParam) ||
    isPracticalWalkthroughStep(stepParam)
  ) {
    return stepParam;
  }

  return defaultStep;
}

function getPlayingSubStepKey(
  entryKey: string,
  stepParam: string | null,
  activeGroupKey: string,
  enrollmentId: number | undefined,
): string | null {
  if (entryKey === "career-knowledge") {
    if (stepParam && isCareerKnowledgeDiscoveryStep(stepParam)) {
      return stepParam;
    }
    if (activeGroupKey === "career-readiness") {
      return getCareerKnowledgeDiscoveryLastActiveStep(enrollmentId);
    }
    return null;
  }

  if (entryKey === "practical-walkthrough") {
    if (stepParam && isPracticalWalkthroughStep(stepParam)) {
      return stepParam;
    }
    if (activeGroupKey === "technology-readiness") {
      return getPracticalWalkthroughLastActiveStep(enrollmentId);
    }
    return null;
  }

  return null;
}

function isPreDiagnosticGroupComplete(
  preDiagnosticSteps: PreDiagnosticStepsCompletedState | undefined,
  groupKey: "career-knowledge" | "practical-walkthrough",
  locallyCompletedDiscoverySteps: string[] = [],
  careerKnowledgeDiscoveryCount = 1,
  locallyCompletedWalkthroughSteps: string[] = [],
  practicalWalkthroughCount = 1,
) {
  if (groupKey === "career-knowledge") {
    if (isCareerKnowledgeDiscoveryGroupCompleteOnBackend(preDiagnosticSteps)) {
      return true;
    }

    const requiredSteps = Array.from(
      { length: careerKnowledgeDiscoveryCount },
      (_, index) => buildCareerKnowledgeDiscoveryStepKey(index),
    );

    return requiredSteps.every((stepKey) =>
      locallyCompletedDiscoverySteps.includes(stepKey),
    );
  }

  if (isPracticalWalkthroughGroupCompleteOnBackend(preDiagnosticSteps)) {
    return true;
  }

  const requiredWalkthroughSteps = Array.from(
    { length: practicalWalkthroughCount },
    (_, index) => buildPracticalWalkthroughStepKey(index),
  );

  return requiredWalkthroughSteps.every((stepKey) =>
    locallyCompletedWalkthroughSteps.includes(stepKey),
  );
}

function StatusBadge({ isDone }: { isDone: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[10px] font-semibold leading-none",
        isDone
          ? "bg-[#CFF6DA] text-[#238A50]"
          : "border border-[#7EAAB2] text-[#9EC5CC]",
      )}
    >
      {isDone ? "Done" : "Todo"}
    </span>
  );
}

const Aside = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: enrollment } = useGetUserEnrollment();
  const { data: preDiagnostic } = useGetPreDiagnostic();

  const careerKnowledgeDiscoveryCount = Math.max(
    preDiagnostic?.career_readiness.careerKnowledgeDiscovery.length ?? 2,
    1,
  );
  const practicalWalkthroughCount = Math.max(
    preDiagnostic?.technology_readiness.PracticalWalkthrough.length ?? 2,
    1,
  );
  const stepOptions = useMemo(
    () => ({
      careerKnowledgeDiscoveryCount,
      practicalWalkthroughCount,
      enrollmentId: enrollment?.id,
    }),
    [careerKnowledgeDiscoveryCount, practicalWalkthroughCount, enrollment?.id],
  );
  const readinessGroups = useMemo(
    () =>
      buildReadinessGroups(
        careerKnowledgeDiscoveryCount,
        practicalWalkthroughCount,
      ),
    [careerKnowledgeDiscoveryCount, practicalWalkthroughCount],
  );

  const activeGroup = getActiveGroup(pathname, readinessGroups);
  const activeGroupKey = activeGroup.key;
  const stepParam = searchParams.get("step");
  const currentStepKey = resolveCurrentStep(activeGroup, stepParam);
  const preDiagnosticStepsCompleted = enrollment?.isPreDiagnosticStepsCompleted;
  const locallyCompletedDiscoverySteps =
    useCareerKnowledgeDiscoveryProgress(enrollment?.id);
  const locallyCompletedWalkthroughSteps =
    usePracticalWalkthroughProgress(enrollment?.id);

  return (
    <aside
      className={cn(
        "relative hidden overflow-visible rounded-l-xl bg-[#156F7D] py-6 text-white transition-[width,padding] duration-300 lg:flex lg:flex-col xl:py-7",
        isCollapsed
          ? "lg:w-24 px-4 xl:px-4"
          : "lg:w-[45%] px-5 xl:w-[42%] xl:px-6",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link href="/" className="inline-flex w-fit">
          {isCollapsed ? (
            <Image
              src="/favicon-white.svg"
              height={25}
              width={36}
              alt="amdari"
              className="h-7 w-7 object-contain object-left"
            />
          ) : (
            <Image
              src="/logo-white.svg"
              height={25}
              width={126}
              alt="amdari"
              className="object-contain object-left"
            />
          )}

        </Link>
        <ExpandCollapse
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((value) => !value)}
        />
      </div>

      <div className="mt-10 flex min-h-0 grow flex-col overflow-y-auto">
        <div className={cn("px-1", isCollapsed && "sr-only")}>
          <h2 className="text-base font-bold tracking-tight text-white">
            PRE-ENTRY DIAGNOSTIC
          </h2>
          <p className="mt-1 text-sm font-medium text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <div className={cn("space-y-2.5", isCollapsed ? "mt-8" : "mt-8")}>
          {readinessGroups.map((group) => {
            const isOpen = group.key === activeGroupKey;

            return (
              <section
                key={group.key}
                className={cn(
                  "overflow-hidden rounded-xl bg-[#0F6371] transition-colors",
                  isOpen && "bg-[#0E6370]",
                )}
              >
                <div
                  className={cn(
                    "flex min-h-12 items-center gap-4 px-4 py-3",
                    isCollapsed ? "justify-center px-0" : "justify-between",
                  )}
                >
                  <h3
                    className={cn(
                      "text-base font-semibold text-white",
                      isCollapsed && "sr-only",
                    )}
                  >
                    {group.title}
                  </h3>
                  <div
                    className={cn("size-4 text-white transition-transform", isOpen && "rotate-90")}>
                    <TriagleSVG
                      aria-hidden
                    />
                  </div>

                </div>

                {isOpen ? (
                  <ul
                    className={cn(
                      "space-y-3 pt-1 pb-4",
                      isCollapsed ? "px-0" : "px-4",
                    )}
                  >
                    {group.items.map((entry) => {
                      if (isGroupItem(entry)) {
                        const groupDone = isPreDiagnosticGroupComplete(
                          preDiagnosticStepsCompleted,
                          entry.key as "career-knowledge" | "practical-walkthrough",
                          locallyCompletedDiscoverySteps,
                          careerKnowledgeDiscoveryCount,
                          locallyCompletedWalkthroughSteps,
                          practicalWalkthroughCount,
                        );

                        return (
                          <li key={entry.key} className="space-y-2">
                            <div
                              className={cn(
                                "grid items-center gap-3",
                                isCollapsed ? "grid-cols-1 justify-items-center" : "grid-cols-[1fr_auto]",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex min-w-0 items-center gap-2.5",
                                  isCollapsed && "justify-center",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
                                    groupDone
                                      ? "border-transparent bg-[#BDF3D0] text-[#1F7A4A]"
                                      : "border-[#8BB9C1] text-transparent",
                                  )}
                                >
                                  {groupDone ? (
                                    <Check className="size-3" strokeWidth={3} />
                                  ) : null}
                                </span>
                                <span
                                  className={cn(
                                    "truncate text-sm font-medium text-[#A9D0D7]",
                                    isCollapsed && "sr-only",
                                  )}
                                >
                                  {entry.label}
                                </span>
                              </div>
                              {!isCollapsed ? <StatusBadge isDone={groupDone} /> : null}
                            </div>

                            <ul
                              className={cn(
                                "space-y-4",
                                isCollapsed && "flex flex-col items-center",
                              )}
                            >
                              {entry.children.map((child, childIndex) => {
                                const playingSubStepKey = getPlayingSubStepKey(
                                  entry.key,
                                  stepParam,
                                  activeGroupKey,
                                  enrollment?.id,
                                );
                                const isChildDone = isPreDiagnosticEnrollmentStepComplete(
                                  preDiagnosticStepsCompleted,
                                  child.key,
                                  stepOptions,
                                );
                                const isChildCurrent =
                                  group.key === activeGroupKey &&
                                  playingSubStepKey != null &&
                                  child.key === playingSubStepKey;
                                const isChildLocked = isPreDiagnosticAsideStepLocked(
                                  preDiagnosticStepsCompleted,
                                  child.key,
                                  stepOptions,
                                );
                                const isLastChild =
                                  childIndex === entry.children.length - 1;

                                return (
                                  <li key={child.key} className="relative">
                                    {!isLastChild && (
                                      <span
                                        aria-hidden
                                        className="absolute top-4 left-1.75 z-0 h-full w-px bg-[#5A9AA4]"
                                      />
                                    )}
                                    <div
                                      aria-current={isChildCurrent ? "step" : undefined}
                                      className="relative flex items-start gap-2.5"
                                    >
                                      <span className="relative z-10 mt-0.5 flex size-3.5 shrink-0 items-center justify-center">
                                        {isChildCurrent ? (
                                          <Loader
                                            className="size-3.5 animate-spin text-[#BDF3D0]"
                                            strokeWidth={2.5}
                                          />
                                        ) : isChildDone ? (
                                          <Check
                                            className="size-3 text-[#BDF3D0]"
                                            strokeWidth={3}
                                          />
                                        ) : (
                                          <span className="size-2.5 rounded-full border border-[#8BB9C1]" />
                                        )}
                                      </span>
                                      <span
                                        className={cn(
                                          "text-sm font-medium leading-tight",
                                          isChildCurrent
                                            ? "text-white"
                                            : isChildLocked
                                              ? "text-[#7EAAB2]"
                                              : "text-[#A9D0D7]",
                                          isCollapsed && "sr-only",
                                        )}
                                      >
                                        {child.label}
                                      </span>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      }

                      const isDone = isPreDiagnosticEnrollmentStepComplete(
                        preDiagnosticStepsCompleted,
                        entry.key,
                        stepOptions,
                      );
                      const isCurrent =
                        group.key === activeGroupKey && entry.key === currentStepKey;
                      const isLocked = isPreDiagnosticAsideStepLocked(
                        preDiagnosticStepsCompleted,
                        entry.key,
                        stepOptions,
                      );

                      return (
                        <li
                          key={entry.key}
                          className={cn(
                            "grid items-center gap-3",
                            isCollapsed ? "grid-cols-1 justify-items-center" : "grid-cols-[1fr_auto]",
                          )}
                        >
                          <div
                            aria-current={isCurrent ? "step" : undefined}
                            className={cn(
                              "flex min-w-0 items-center gap-2.5",
                              isCollapsed && "justify-center",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
                                isDone
                                  ? "border-transparent bg-[#BDF3D0] text-[#1F7A4A]"
                                  : "border-[#8BB9C1] text-transparent",
                              )}
                            >
                              {isDone ? <Check className="size-3" strokeWidth={3} /> : null}
                            </span>
                            <span
                              className={cn(
                                "truncate text-sm font-medium",
                                isCurrent
                                  ? "text-white"
                                  : isLocked
                                    ? "text-[#7EAAB2]"
                                    : "text-[#A9D0D7]",
                                isCollapsed && "sr-only",
                              )}
                            >
                              {entry.label}
                            </span>
                          </div>
                          {!isCollapsed ? <StatusBadge isDone={isDone} /> : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Aside;
