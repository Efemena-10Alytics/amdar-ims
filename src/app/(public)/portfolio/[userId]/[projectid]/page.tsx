"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  ViewProjectContent,
  mapProjectToViewData,
  stableProjectListId,
  type OtherProjectLink,
} from "@/app/dashboard-dev/portfolio/add-project/[id]/view-project-content";
import { useGetProjectByUserId } from "@/features/portfolio/use-get-project-by-id";
import { useGetPortfolioByUserId } from "@/features/portfolio/use-get-portfolio-by-id";
import { getImageUrl } from "@/lib/utils";

function paramPart(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default function PublicProjectDetailsPage() {
  const params = useParams();
  const userId = paramPart(params?.userId);
  const projectId = paramPart(params?.projectid);

  const { data, isLoading, isError, error } = useGetProjectByUserId(
    userId ?? null,
    projectId ?? null,
  );
  const { data: portfolioData } = useGetPortfolioByUserId(userId ?? null);

  const project = useMemo(
    () => (data ? mapProjectToViewData(data) : null),
    [data],
  );

  const otherProjects = useMemo((): OtherProjectLink[] => {
    const list = portfolioData?.projects ?? [];
    if (!userId || !projectId || list.length === 0) return [];
    return list
      .map((p, i) => {
        const id = stableProjectListId(p, i);
        return {
          id,
          title: p.title?.trim() || "Untitled",
          coverImageUrl: getImageUrl(p.coverImage) || undefined,
          tag: p.category?.trim() || undefined,
        };
      })
      .filter((p) => p.id !== projectId)
      .map((p) => ({
        href: `/portfolio/${encodeURIComponent(userId)}/${encodeURIComponent(p.id)}`,
        title: p.title,
        coverImageUrl: p.coverImageUrl,
        tag: p.tag,
      }));
  }, [portfolioData?.projects, userId, projectId]);

  const backHref =
    userId != null && userId !== ""
      ? `/portfolio/${encodeURIComponent(userId)}`
      : "/portfolio";

  if (!userId || !projectId) {
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-zinc-600">Invalid project link.</p>
        <Link
          href="/portfolio"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to portfolios
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-width flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-zinc-600">Loading project…</p>
      </div>
    );
  }

  if (isError || !project) {
    const message =
      error instanceof Error ? error.message : "Could not load this project.";
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-red-600 text-center">{message}</p>
        <Link
          href={backHref}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="app-width mt-10">
      <ViewProjectContent
        project={project}
        backHref={backHref}
        backLabel="Back to portfolio"
        otherProjects={otherProjects}
      />
    </div>
  );
}
