"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ViewProjectContent } from "./view-project-content";
import type { ViewProjectData } from "./view-project-content";
import {
  useGetProjectByUserId,
  type UserPortfolioProjectDetail,
} from "@/features/portfolio/use-get-project-by-id";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { getImageUrl } from "@/lib/utils";

function mapProjectToViewData(data: UserPortfolioProjectDetail): ViewProjectData {
  const category = data.category?.trim();
  return {
    title: data.title?.trim() || "Untitled",
    tags: category ? [category] : undefined,
    coverImageUrl: getImageUrl(data.coverImage) || undefined,
    overview: data.overview?.trim() || undefined,
    tools: (data.tools ?? [])
      .map((t) => {
        const name = t.name?.trim();
        if (!name) return null;
        const iconUrl = getImageUrl(t.image ?? t.url ?? undefined) || undefined;
        return { name, ...(iconUrl && { iconUrl }) };
      })
      .filter((t): t is { name: string; iconUrl?: string } => t != null),
    rationale: data.rationale?.trim() || undefined,
    aim: data.aim?.trim() || undefined,
    solutionUrl: data.solutionUrl?.trim() || undefined,
    mediaLink: data.mediaLink?.trim() || undefined,
  };
}

export default function ViewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;
  const idParam =
    typeof projectId === "string"
      ? projectId
      : Array.isArray(projectId)
        ? projectId[0]
        : undefined;

  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const { data, isLoading, isError, error } = useGetProjectByUserId(userId, idParam);

  const project = useMemo(
    () => (data ? mapProjectToViewData(data) : null),
    [data],
  );

  const handleEdit = () => {
    router.push("/dashboard-dev/portfolio/add-project");
  };

  const handleDelete = () => {
    if (typeof window !== "undefined" && window.confirm("Delete this project?")) {
      router.push("/dashboard-dev/portfolio");
    }
  };

  if (!idParam) {
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-zinc-600">Invalid project link.</p>
        <Link
          href="/dashboard-dev/portfolio"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to portfolio
        </Link>
      </div>
    );
  }

  if (userId == null || userId === "") {
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-zinc-600">Sign in to view this project.</p>
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          Sign in
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
          href="/dashboard-dev/portfolio"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <ViewProjectContent
      project={project}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
