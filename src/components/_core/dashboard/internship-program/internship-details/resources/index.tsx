"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import { TrangleIcon } from "../../../svg";
import { useEnrollmentCohortProgramIds } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/use-stage-project-schedule-data";
import type {
  Resource,
  ResourceCategory,
} from "@/features/resources/resources.types";
import { useGetProjectResources } from "@/features/interns-project/resources/use-get-project-resources";
import { useGetProjectResourcesByCategory } from "@/features/interns-project/resources/use-get-project-resources-by-cat";
import { useGetResources } from "@/features/resources/use-get-resources";
import { cn } from "@/lib/utils";

/** Only the fields the list UI actually renders — satisfied by both the general
 *  (program/cohort-scoped) and project-scoped `Resource` API response shapes. */
type ResourceListItem = Pick<
  Resource,
  "id" | "title" | "category" | "format" | "url" | "fileUrl" | "createdAt"
>;

const INTERNSHIP_RESOURCE_CATEGORIES = [
  { label: "Drop-In Session", value: "drop-in-session" },
  { label: "Project Hub", value: "project-hub" },
  { label: "More Materials", value: "more-materials" },
  { label: "Onboarding", value: "onboarding" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Employability", value: "employability-session" },
  { label: "Others", value: "others" },
] as const;

/** Categories that surface under the Others tab. */
const OTHERS_API_CATEGORIES = new Set(["others", "drop-in-session"]);

/** Internship categories that load via /intern-project-resources/by-category. */
const PROJECT_BY_CATEGORY_VALUES = [
  "drop-in-session",
  "project-hub",
  "more-materials",
] as const;

type ProjectByCategoryValue = (typeof PROJECT_BY_CATEGORY_VALUES)[number];

function isProjectByCategoryValue(
  value: string,
): value is ProjectByCategoryValue {
  return (PROJECT_BY_CATEGORY_VALUES as readonly string[]).includes(value);
}

/** Maps sidebar values to the API `category` query param. */
function getByCategoryApiCategory(value: ProjectByCategoryValue): string {
  if (value === "more-materials") return "others";
  return value;
}

const PROJECT_RESOURCE_CATEGORIES = [
  { label: "Drop-In Session", value: "drop-in-session" },
  { label: "Project Hub", value: "project-hub" },
  { label: "Others", value: "others" },
] as const;

const RESOURCE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Links", value: "link" },
  { label: "Files", value: "material" },
] as const;

type ResourceFilterValue = (typeof RESOURCE_FILTERS)[number]["value"];
type InternshipResourceCategoryValue =
  (typeof INTERNSHIP_RESOURCE_CATEGORIES)[number]["value"];
type ProjectResourceCategoryValue =
  (typeof PROJECT_RESOURCE_CATEGORIES)[number]["value"];
export type ResourceCategoryValue =
  | InternshipResourceCategoryValue
  | ProjectResourceCategoryValue;

type ResourceCategoryOption = {
  label: string;
  value: ResourceCategoryValue;
};

function normalizeResourceFormat(format?: string | null): "link" | "material" {
  const value = format?.trim().toLowerCase();
  if (value === "material" || value === "document" || value === "file") {
    return "material";
  }
  return "link";
}

function normalizeResourceCategory(category?: string | null): string {
  return category?.trim().toLowerCase() || "others";
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

function formatProjectWeekLabel(project: {
  weeks?: string | null;
  startWeek?: number | null;
  endWeek?: number | null;
}) {
  const weeks = project.weeks?.trim();
  if (weeks) {
    return /^week\b/i.test(weeks) ? weeks : `Week ${weeks}`;
  }

  const start = project.startWeek;
  const end = project.endWeek;
  if (start != null && end != null) {
    return start === end ? `Week ${start}` : `Week ${start}-${end}`;
  }
  if (start != null) return `Week ${start}`;
  if (end != null) return `Week ${end}`;
  return null;
}

function ResourceRow({
  item,
  onOpen,
  variant = "default",
}: {
  item: ResourceListItem;
  onOpen: (item: ResourceListItem) => void;
  variant?: "default" | "by-category";
}) {
  const format = normalizeResourceFormat(item.format);
  const href = getResourceHref(item);
  const isByCategory = variant === "by-category";

  return (
    <article
      className={cn(
        "flex min-w-0 items-center justify-between gap-3 rounded-xl px-3 py-3",
        isByCategory ? "bg-[#EDF2FF]" : "bg-[#F8FAFC]",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            isByCategory
              ? "bg-[#D6E4FF] text-[#3B82F6]"
              : "bg-[#156374] text-white",
          )}
        >
          <ResourceTypeIcon format={format} />
        </span>
        <div className="min-w-0 flex-1">
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
        onClick={() => onOpen(item)}
        disabled={!href}
        className={cn(
          "shrink-0 cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-40",
          isByCategory
            ? "text-[#3B82F6] hover:text-[#2563EB]"
            : "text-[#1A6B8A] hover:text-[#0E6174]",
        )}
        aria-label={`Open ${item.title}`}
      >
        <ExternalLink className="size-4" aria-hidden />
      </button>
    </article>
  );
}

function ProjectResourcesByCategoryList({
  categoryLabel,
  projects,
  onOpen,
}: {
  categoryLabel: string;
  projects: Array<{
    projectId: number;
    projectTitle: string;
    weeks?: string | null;
    startWeek?: number | null;
    endWeek?: number | null;
    materials: ResourceListItem[];
  }>;
  onOpen: (item: ResourceListItem) => void;
}) {
  const [openProjectId, setOpenProjectId] = useState<number | null>(
    () => projects[0]?.projectId ?? null,
  );

  return (
    <div className="min-w-0 space-y-3">
      <h3 className="text-base font-semibold text-[#092A31]">{categoryLabel}</h3>

      <div className="min-w-0 space-y-3">
        {projects.map((project) => {
          const materials = project.materials.filter((item) => {
            const format = item.format?.trim().toLowerCase();
            return format !== "video";
          });
          if (!materials.length) return null;

          const isOpen = openProjectId === project.projectId;
          const weekLabel = formatProjectWeekLabel(project);

          return (
            <section
              key={project.projectId}
              className="min-w-0 overflow-hidden rounded-xl bg-[#F8FAFC] px-3 py-3 shadow-[0px_1px_4px_0px_rgba(15,23,42,0.04)]"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenProjectId((current) =>
                    current === project.projectId ? null : project.projectId,
                  )
                }
                className="flex w-full cursor-pointer items-start justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#156374]">
                    {project.projectTitle}
                  </p>
                  {weekLabel ? (
                    <p className="mt-0.5 text-sm text-[#94A3B8]">{weekLabel}</p>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "mt-0.5 shrink-0 transition-transform",
                    isOpen ? "rotate-90" : "rotate-0",
                  )}
                >
                  <TrangleIcon />
                </span>
              </button>

              {isOpen ? (
                <div className="mt-3 min-w-0 space-y-2.5">
                  {materials.map((item) => (
                    <ResourceRow
                      key={item.id}
                      item={item}
                      onOpen={onOpen}
                      variant="by-category"
                    />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

const Resources = ({
  excludeCategories = [],
  projectId = null,
  title = "Resources",
  categoryPreset = "internship",
}: {
  excludeCategories?: readonly ResourceCategoryValue[];
  /** When set, resources are scoped to this project instead of the globally-selected program/cohort. */
  projectId?: number | string | null;
  title?: string;
  /** Internship Resources vs project Material category sets. */
  categoryPreset?: "internship" | "project";
} = {}) => {
  const isProjectScoped = projectId != null && String(projectId).trim() !== "";
  const categoryOptions: readonly ResourceCategoryOption[] =
    categoryPreset === "project"
      ? PROJECT_RESOURCE_CATEGORIES
      : INTERNSHIP_RESOURCE_CATEGORIES;

  const {
    cohortId,
    programId,
    isLoading: isEnrollmentLoading,
  } = useEnrollmentCohortProgramIds();

  const categories = useMemo(
    () =>
      categoryOptions.filter(
        (category) => !excludeCategories.includes(category.value),
      ),
    [categoryOptions, excludeCategories],
  );

  const [activeCategory, setActiveCategory] = useState<ResourceCategoryValue>(
    () => categories[0]?.value ?? "onboarding",
  );
  const [activeFilter, setActiveFilter] = useState<ResourceFilterValue>("all");

  const canFetchGeneral =
    !isProjectScoped && programId != null && cohortId != null;
  const isByCategoryView =
    !isProjectScoped && isProjectByCategoryValue(activeCategory);

  // "Others" omits the API category filter and keeps others + drop-in-session client-side.
  const requestCategory =
    activeCategory === "others"
      ? undefined
      : (activeCategory as ResourceCategory | string);

  const generalQuery = useGetResources(
    {
      program_id: programId ?? undefined,
      cohort_id: cohortId ?? undefined,
      category: requestCategory,
      format: activeFilter === "all" ? undefined : activeFilter,
      per_page: 50,
      page: 1,
    },
    {
      enabled: canFetchGeneral && !isByCategoryView,
    },
  );

  const byCategoryQuery = useGetProjectResourcesByCategory(
    {
      program_id: programId ?? undefined,
      cohort_id: cohortId ?? undefined,
      category: isByCategoryView
        ? getByCategoryApiCategory(activeCategory)
        : "project-hub",
      format: activeFilter === "all" ? undefined : activeFilter,
      per_page: 50,
      page: 1,
    },
    {
      enabled: canFetchGeneral && isByCategoryView,
    },
  );

  const projectQuery = useGetProjectResources(
    {
      project_id: projectId ?? undefined,
      category: requestCategory,
      format: activeFilter === "all" ? undefined : activeFilter,
      per_page: 50,
      page: 1,
    },
    {
      enabled: isProjectScoped,
    },
  );

  const listQuery = isProjectScoped ? projectQuery : generalQuery;
  const canFetch = isProjectScoped ? true : canFetchGeneral;

  const byCategoryProjects = useMemo(() => {
    if (!isByCategoryView) return [];

    return (byCategoryQuery.data ?? []).flatMap((group) =>
      group.projects.filter((project) =>
        project.materials.some((item) => {
          const format = item.format?.trim().toLowerCase();
          return format !== "video";
        }),
      ),
    );
  }, [byCategoryQuery.data, isByCategoryView]);

  const resources = useMemo<ResourceListItem[]>(() => {
    const items = listQuery.data?.resources ?? [];
    return items.filter((item) => {
      const format = item.format?.trim().toLowerCase();
      if (format === "video") return false;

      const category = normalizeResourceCategory(item.category);

      if (activeCategory === "others") {
        return OTHERS_API_CATEGORIES.has(category);
      }

      return category === activeCategory;
    });
  }, [activeCategory, listQuery.data?.resources]);

  const isLoading = isProjectScoped
    ? listQuery.isLoading
    : isByCategoryView
      ? isEnrollmentLoading || (canFetch && byCategoryQuery.isLoading)
      : isEnrollmentLoading || (canFetch && listQuery.isLoading);

  const isError =
    canFetch &&
    (isByCategoryView ? byCategoryQuery.isError : listQuery.isError);

  const handleOpenResource = (resource: ResourceListItem) => {
    const href = getResourceHref(resource);
    if (!href || typeof window === "undefined") return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
          <h2 className="text-base font-semibold text-[#092A31]">{title}</h2>

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

        <div className="min-w-0 space-y-3 overflow-hidden">
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
            <p className="px-1 py-6 text-sm text-[#94A3B8]">
              Loading resources...
            </p>
          ) : isError ? (
            <div className="space-y-2 px-1 py-6">
              <p className="text-sm text-[#C0392B]">
                Failed to load resources.
              </p>
              <button
                type="button"
                onClick={() => {
                  void (isByCategoryView
                    ? byCategoryQuery.refetch()
                    : listQuery.refetch());
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
          ) : isByCategoryView && byCategoryProjects.length ? (
            <ProjectResourcesByCategoryList
              categoryLabel={
                categories.find((category) => category.value === activeCategory)
                  ?.label ?? activeCategory
              }
              projects={byCategoryProjects}
              onOpen={handleOpenResource}
            />
          ) : resources.length ? (
            <div className="min-w-0 space-y-2.5">
              {resources.map((item) => (
                <ResourceRow
                  key={item.id}
                  item={item}
                  onOpen={handleOpenResource}
                />
              ))}
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
