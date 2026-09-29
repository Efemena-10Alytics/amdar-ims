"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import InternshipInfo from "@/components/_core/dashboard/internship-program/internship-details/internship-info";
import CareerStage from "@/components/_core/dashboard/internship-program/internship-details/career-stage";
import CareerCenter from "@/components/_core/dashboard/internship-program/internship-details/career-center";
import Resources from "@/components/_core/dashboard/internship-program/internship-details/resources";
import { useGetCurrentProject } from "@/features/interns-project/use-get-current-project";
import { useGetInternshipProgress } from "@/features/interns-project/use-get-internship-progress";

const TABS = [
  { id: "career-stage", label: "Career Stage" },
  { id: "internship-info", label: "Internship info" },
  // { id: "performance", label: "Performance" },
  { id: "career-center", label: "Career center" },
  { id: "resources", label: "Resources" },
] as const;

export type InternshipProgramTabId = (typeof TABS)[number]["id"];

function isInternshipProgramTabId(
  value: string | null,
): value is InternshipProgramTabId {
  return TABS.some((tab) => tab.id === value);
}

type InternshipDetailsProps = {
  defaultTab?: InternshipProgramTabId;
  onWhoIsOnlineClick?: () => void;
};

function buildCurrentTaskHref({
  projectSlug,
  todoId,
  typeId,
}: {
  projectSlug: string;
  todoId: number;
  typeId?: number | null;
}) {
  const base = `/dashboard/internship-program/projects/${encodeURIComponent(projectSlug)}/classroom/${todoId}`;
  return typeId != null ? `${base}?type=${typeId}` : base;
}

function ContinueTaskButton() {
  const progressQuery = useGetInternshipProgress();
  const currentProjectQuery = useGetCurrentProject();

  const taskTracker = progressQuery.data?.taskTracker;
  const currentTask = taskTracker?.currentTask ?? null;
  const preAssessmentDone = taskTracker?.preAssessmentDone === true;
  const projectSlug = currentProjectQuery.data?.project?.slug?.trim() || null;
  const isLoading =
    progressQuery.isLoading ||
    progressQuery.isEnrollmentLoading ||
    currentProjectQuery.isLoading;

  const label = preAssessmentDone ? "Continue Task" : "Start Task";

  const href = (() => {
    if (!projectSlug) return null;

    if (!preAssessmentDone) {
      return `/dashboard/internship-program/projects/${encodeURIComponent(projectSlug)}?tab=assessment`;
    }

    if (!currentTask) return null;

    return buildCurrentTaskHref({
      projectSlug,
      todoId: currentTask.todoId,
      typeId: currentTask.type?.id,
    });
  })();

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white opacity-70"
      >
        {label}
      </button>
    );
  }

  if (!href) return null;

  return (
    <Link
      href={href}
      className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] px-5 text-sm font-semibold text-white transition hover:bg-[#0C5662]"
    >
      {label}
    </Link>
  );
}

const InternshipDetails = ({
  defaultTab = "career-stage",
}: InternshipDetailsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const activeTab = isInternshipProgramTabId(queryTab) ? queryTab : defaultTab;

  useEffect(() => {
    if (isInternshipProgramTabId(queryTab)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", defaultTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [defaultTab, pathname, queryTab, router, searchParams]);

  const handleTabChange = (tabId: InternshipProgramTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "internship-info":
        return <InternshipInfo />;
      case "career-stage":
        return <CareerStage />;
      case "career-center":
        return <CareerCenter />;
      case "resources":
        return <Resources />;
      default:
        return <CareerStage />;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 overflow-x-auto">
          <div
            className="inline-flex min-w-max rounded-full bg-[#EEF2F6] p-2"
            role="tablist"
            aria-label="Internship program sections"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-[#C5D6DC] text-[#092A31] shadow-sm"
                      : "text-[#98A2B3] hover:text-[#64748B]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <ContinueTaskButton />
      </div>

      <div role="tabpanel">{renderTabContent()}</div>
    </section>
  );
};

export default InternshipDetails;
