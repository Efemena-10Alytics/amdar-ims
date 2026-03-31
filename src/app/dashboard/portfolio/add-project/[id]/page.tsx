"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  ViewProjectContent,
  mapProjectToViewData,
  stableProjectListId,
  type OtherProjectLink,
} from "./view-project-content";
import { useGetProjectByUserId } from "@/features/portfolio/use-get-project-by-id";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { getImageUrl } from "@/lib/utils";
import { useDeletePortfolioProject } from "@/features/portfolio/use-delete-portfolio-project";
import { useConfirm } from "@/hooks/use-confirm";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";

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
  const { confirm, ConfirmDialog } = useConfirm({
    title: "Delete project?",
    description: "This project will be permanently removed and cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "destructive",
  });

  const { data, isLoading, isError, error } = useGetProjectByUserId(userId, idParam);
  const { data: portfolioData } = useGetPortfolio();
  const { deleteProject, isDeleting } = useDeletePortfolioProject();

  const project = useMemo(
    () => (data ? mapProjectToViewData(data) : null),
    [data],
  );

  const otherProjects = useMemo((): OtherProjectLink[] => {
    const list = portfolioData?.projects ?? [];
    if (!idParam || list.length === 0) return [];
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
      .filter((p) => p.id !== idParam)
      .map((p) => ({
        href: `/dashboard/portfolio/add-project/${encodeURIComponent(p.id)}`,
        title: p.title,
        coverImageUrl: p.coverImageUrl,
        tag: p.tag,
      }));
  }, [portfolioData?.projects, idParam]);

  const handleEdit = () => {
    if (idParam) {
      router.push(
        `/dashboard/portfolio/add-project/${encodeURIComponent(idParam)}/edit`,
      );
    }
  };

  const handleDelete = async () => {
    if (!idParam) return;
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }
    const result = await deleteProject(idParam);
    if (result.ok) {
      router.push("/dashboard/portfolio");
    } else {
      window.alert(result.message);
    }
  };

  if (!idParam) {
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-zinc-600">Invalid project link.</p>
        <Link
          href="/dashboard/portfolio"
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
          href="/dashboard/portfolio"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <>
      <ViewProjectContent
        project={project}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeletePending={isDeleting}
        otherProjects={otherProjects}
      />
      {ConfirmDialog}
    </>
  );
}
