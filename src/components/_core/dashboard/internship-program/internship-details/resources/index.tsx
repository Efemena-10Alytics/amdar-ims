"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import { TrangleIcon } from "../../../svg";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import type {
  Resource,
  ResourceCategory,
} from "@/features/resources/resources.types";
import { useGetResources } from "@/features/resources/use-get-resources";
import { useGetProjectResources } from "@/features/interns-project/resources/use-get-project-resources";
import { cn } from "@/lib/utils";

/** Only the fields the list UI actually renders — satisfied by both the general
 *  (program/cohort-scoped) and project-scoped `Resource` API response shapes. */
type ResourceListItem = Pick<
  Resource,
  "id" | "title" | "format" | "url" | "fileUrl" | "createdAt"
>;

const RESOURCE_CATEGORIES = [
  { label: "Onboarding", value: "onboarding" },
  { label: "Mentorship Session", value: "mentorship" },
  { label: "Drop-In Session", value: "drop-in-session" },
  { label: "Employability Hub", value: "employability-session" },
  { label: "Meeting Link", value: "meeting-link" },
  { label: "FAQs", value: "faqs" },
  { label: "Others", value: "others" },
] as const;

const RESOURCE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Links", value: "link" },
  { label: "Materials", value: "material" },
] as const;

type ResourceFilterValue = (typeof RESOURCE_FILTERS)[number]["value"];
type ResourceCategoryValue = (typeof RESOURCE_CATEGORIES)[number]["value"];

function normalizeResourceFormat(format?: string | null): "link" | "material" {
  const value = format?.trim().toLowerCase();
  if (value === "material" || value === "document" || value === "file") {
    return "material";
  }
  return "link";
}

function getResourceHref(resource: ResourceListItem) {
  return resource.url?.trim() || resource.fileUrl?.trim() || null;
}

function formatResourceDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ResourceTypeIcon({ format }: { format: "link" | "material" }) {
  if (format === "link") return <Link2 className="size-4" aria-hidden />;
  return <FileText className="size-4" aria-hidden />;
}

const Resources = ({
  excludeCategories = [],
  projectId = null,
}: {
  excludeCategories?: readonly ResourceCategoryValue[];
  /** When set, resources are scoped to this project instead of the globally-selected program/cohort. */
  projectId?: number | string | null;
} = {}) => {
  const isProjectScoped = projectId != null && String(projectId).trim() !== "";

  const { cohortId, programId, isLoading: isEnrollmentLoading } =
    useEnrollmentCohortProgramIds();

  const categories = useMemo(
    () =>
      RESOURCE_CATEGORIES.filter(
        (category) => !excludeCategories.includes(category.value),
      ),
    [excludeCategories],
  );

  const [activeCategory, setActiveCategory] =
    useState<ResourceCategoryValue>("onboarding");
  const [activeFilter, setActiveFilter] = useState<ResourceFilterValue>("all");

  const canFetchGeneral = !isProjectScoped && programId != null && cohortId != null;

  const generalQuery = useGetResources(
    {
      program_id: programId ?? undefined,
      cohort_id: cohortId ?? undefined,
      category: activeCategory as ResourceCategory | string,
      format: activeFilter === "all" ? undefined : activeFilter,
      per_page: 50,
      page: 1,
    },
    {
      enabled: canFetchGeneral,
    },
  );

  const projectQuery = useGetProjectResources(
    {
      project_id: projectId ?? undefined,
      category: activeCategory as ResourceCategory | string,
      format: activeFilter === "all" ? undefined : activeFilter,
      per_page: 50,
      page: 1,
    },
    {
      enabled: isProjectScoped,
    },
  );

  const resourcesQuery = isProjectScoped ? projectQuery : generalQuery;
  const canFetch = isProjectScoped ? true : canFetchGeneral;

  const resources = useMemo<ResourceListItem[]>(() => {
    const items = resourcesQuery.data?.resources ?? [];
    return items.filter((item) => {
      const format = item.format?.trim().toLowerCase();
      return format !== "video";
    });
  }, [resourcesQuery.data?.resources]);

  const isLoading = isProjectScoped
    ? resourcesQuery.isLoading
    : isEnrollmentLoading || (canFetch && resourcesQuery.isLoading);

  const isError = canFetch && resourcesQuery.isError;

  const handleOpenResource = (resource: ResourceListItem) => {
    const href = getResourceHref(resource);
    if (!href || typeof window === "undefined") return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <aside className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <h2 className="text-base font-semibold text-[#092A31]">Resources</h2>

          <ul className="mt-3 space-y-1">
            {categories.map((category) => {
              const isActive = activeCategory === category.value;

              return (
                <li key={category.value}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(category.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-left text-sm font-medium transition",
                      isActive
                        ? "bg-[#E8EFF1] text-[#156374]"
                        : "text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#334155]",
                    )}
                  >
                    <span>{category.label}</span>
                    {isActive ? <TrangleIcon /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-4 pb-1">
            {RESOURCE_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "cursor-pointer border-b-2 pb-2 text-sm font-medium transition",
                    isActive
                      ? "border-[#156374] text-[#156374]"
                      : "border-transparent text-[#9AA7B3] hover:text-[#64748B]",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <p className="px-1 py-6 text-sm text-[#94A3B8]">Loading resources...</p>
          ) : isError ? (
            <div className="space-y-2 px-1 py-6">
              <p className="text-sm text-[#C0392B]">
                Failed to load resources.
              </p>
              <button
                type="button"
                onClick={() => {
                  void resourcesQuery.refetch();
                }}
                className="text-xs font-medium text-[#156374] underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : !canFetch ? (
            <p className="px-1 py-6 text-sm text-[#94A3B8]">
              {isProjectScoped
                ? "Project details are required to view resources."
                : "Enrollment details are required to view resources."}
            </p>
          ) : resources.length ? (
            <div className="space-y-2.5">
              {resources.map((item) => {
                const format = normalizeResourceFormat(item.format);
                const href = getResourceHref(item);

                return (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#156374] text-white">
                        <ResourceTypeIcon format={format} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-[#173740]">
                          {item.title}
                        </p>
                        <p className="text-sm text-[#64748B]">
                          {formatResourceDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenResource(item)}
                      disabled={!href}
                      className="cursor-pointer text-[#1A6B8A] transition hover:text-[#0E6174] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Open ${item.title}`}
                    >
                      <ExternalLink className="size-4" aria-hidden />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="px-1 py-6 text-sm text-[#94A3B8]">
              No resources found for this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Resources;
