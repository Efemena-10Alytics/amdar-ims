"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronRight, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

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

const READINESS_GROUPS = [
  {
    key: "career-readiness",
    title: "Career Readiness",
    href: "/pre-diagnostic-test",
    items: [
      { key: "welcome-video", label: "Welcome video" },
      {
        key: "career-knowledge",
        label: "Career Knowledge discovery",
        children: [
          {
            key: "internship-structure-video",
            label: "Career knowledge discovery 1",
          },
          { key: "cohort-lead", label: "Career knowledge discovery 2" },
        ],
      },
      { key: "career-path-diagnostics", label: "Career path diagnostics" },
    ] satisfies AsideEntry[],
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
        children: [
          {
            key: "practical-walkthrough-1",
            label: "Practical walkthrough 1",
          },
          { key: "practical-walkthrough-2", label: "Practical walkthrough 2" },
        ],
      },
      { key: "technology-diagnostics", label: "Technology diagnostics" },
    ] satisfies AsideEntry[],
  },
  {
    key: "ims-readiness",
    title: "IMS Process",
    href: "/pre-diagnostic-test/ims-readiness",
    items: [
      { key: "how-the-ims-works", label: "How the IMS works" },
      { key: "ims-diagnostics", label: "IMS Diagnostics" },
    ] satisfies StepItem[],
  },
] as const;

type ReadinessGroup = (typeof READINESS_GROUPS)[number];

function getFlatStepsForGroup(group: ReadinessGroup) {
  return group.items.flatMap((item) =>
    isGroupItem(item) ? item.children : [item],
  );
}

const STEP_INDEX_MAP = (() => {
  const map = new Map<string, number>();
  let index = 0;

  for (const group of READINESS_GROUPS) {
    for (const item of getFlatStepsForGroup(group)) {
      map.set(`${group.key}:${item.key}`, index);
      index += 1;
    }
  }

  return map;
})();

function getActiveGroup(pathname: string) {
  return READINESS_GROUPS.find((group) => group.href === pathname) ?? READINESS_GROUPS[0];
}

function resolveCurrentStep(group: ReadinessGroup, stepParam: string | null) {
  const flatSteps = getFlatStepsForGroup(group);
  const defaultStep = flatSteps[0]?.key ?? "welcome-video";
  if (!stepParam) return defaultStep;

  const matchedStep = flatSteps.find((item) => item.key === stepParam)?.key;
  return matchedStep ?? defaultStep;
}

function getGlobalStepIndex(groupKey: string, stepKey: string) {
  return STEP_INDEX_MAP.get(`${groupKey}:${stepKey}`) ?? 0;
}

function getItemStatus(itemIndex: number, currentIndex: number) {
  return itemIndex < currentIndex ? "done" : "todo";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeGroup = getActiveGroup(pathname);
  const activeGroupKey = activeGroup.key;
  const currentStepKey = resolveCurrentStep(activeGroup, searchParams.get("step"));
  const currentGlobalIndex = getGlobalStepIndex(activeGroupKey, currentStepKey);

  return (
    <aside className="hidden overflow-y-auto rounded-l-xl bg-[#156F7D] px-5 py-6 text-white lg:flex lg:w-[45%] lg:flex-col xl:w-[42%] xl:px-6 xl:py-7">
      <Link href="/" className="inline-flex w-fit">
        <Image src="/logo-white.svg" height={25} width={126} alt="amdari" />
      </Link>

      <div className="mt-10 flex grow flex-col">
        <div className="px-1">
          <h2 className="text-base font-bold tracking-tight text-white">
            PRE-ENTRY DIAGNOSTIC
          </h2>
          <p className="mt-1 text-sm font-medium text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          {READINESS_GROUPS.map((group) => {
            const isOpen = group.key === activeGroupKey;

            return (
              <section
                key={group.key}
                className={cn(
                  "overflow-hidden rounded-xl bg-[#0F6371] transition-colors",
                  isOpen && "bg-[#0E6370]",
                )}
              >
                <Link
                  href={group.href}
                  className="flex min-h-12 items-center justify-between gap-4 px-4 py-3"
                >
                  <h3 className="text-base font-semibold text-white">{group.title}</h3>
                  <ChevronRight
                    className={cn("size-4 text-white transition-transform", isOpen && "rotate-90")}
                    strokeWidth={3}
                    aria-hidden
                  />
                </Link>

                {isOpen ? (
                  <ul className="space-y-3 px-4 pt-1 pb-4">
                    {group.items.map((entry) => {
                      if (isGroupItem(entry)) {
                        const childIndexes = entry.children.map((child) =>
                          getGlobalStepIndex(group.key, child.key),
                        );
                        const groupDone = childIndexes.every(
                          (index) => index < currentGlobalIndex,
                        );

                        return (
                          <li key={entry.key} className="space-y-2">
                            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                              <div className="flex min-w-0 items-center gap-2.5">
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
                                <span className="truncate text-sm font-medium text-[#A9D0D7]">
                                  {entry.label}
                                </span>
                              </div>
                              <StatusBadge isDone={groupDone} />
                            </div>

                            <ul className="space-y-4">
                              {entry.children.map((child, childIndex) => {
                                const childGlobalIndex = getGlobalStepIndex(
                                  group.key,
                                  child.key,
                                );
                                const isChildDone = childGlobalIndex < currentGlobalIndex;
                                const isChildCurrent =
                                  group.key === activeGroupKey &&
                                  child.key === currentStepKey;
                                const isChildLocked =
                                  childGlobalIndex > currentGlobalIndex;
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
                                    <Link
                                      href={`${group.href}?step=${child.key}`}
                                      aria-current={isChildCurrent ? "step" : undefined}
                                      className={cn(
                                        "relative flex items-start gap-2.5",
                                        isChildLocked && "pointer-events-none",
                                      )}
                                    >
                                      <span className="relative z-10 mt-0.5 flex size-3.5 shrink-0 items-center justify-center">
                                        {isChildDone ? (
                                          <Check
                                            className="size-3 text-[#BDF3D0]"
                                            strokeWidth={3}
                                          />
                                        ) : isChildCurrent ? (
                                          <Loader
                                            className="size-3.5 animate-spin text-[#BDF3D0]"
                                            strokeWidth={2.5}
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
                                        )}
                                      >
                                        {child.label}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      }

                      const itemGlobalIndex = getGlobalStepIndex(group.key, entry.key);
                      const isDone = getItemStatus(itemGlobalIndex, currentGlobalIndex) === "done";
                      const isCurrent =
                        group.key === activeGroupKey && entry.key === currentStepKey;

                      return (
                        <li
                          key={entry.key}
                          className="grid grid-cols-[1fr_auto] items-center gap-3"
                        >
                          <Link
                            href={`${group.href}?step=${entry.key}`}
                            aria-current={isCurrent ? "step" : undefined}
                            className="flex min-w-0 items-center gap-2.5"
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
                                isCurrent ? "text-white" : "text-[#A9D0D7]",
                              )}
                            >
                              {entry.label}
                            </span>
                          </Link>
                          <StatusBadge isDone={isDone} />
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
