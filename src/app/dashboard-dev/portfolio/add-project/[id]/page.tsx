"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  ViewProjectContent,
  mapProjectToViewData,
} from "./view-project-content";
import { useGetProjectByUserId } from "@/features/portfolio/use-get-project-by-id";
import { useDeletePortfolioProject } from "@/features/portfolio/use-delete-portfolio-project";
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

  const { data, isLoading, isError, error } = useGetProjectByUserId(userId, idParam);
  const { deleteProject, isDeleting } = useDeletePortfolioProject();

  const project = useMemo(
    () => (data ? mapProjectToViewData(data) : null),
    [data],
  );

  const handleEdit = () => {
    if (idParam) {
      router.push(
        `/dashboard-dev/portfolio/add-project/${encodeURIComponent(idParam)}/edit`,
      );
    }
  };

  const handleDelete = async () => {
    if (!idParam) return;
    if (
      typeof window === "undefined" ||
      !window.confirm("Delete this project? This cannot be undone.")
    ) {
      return;
    }
    const result = await deleteProject(idParam);
    if (result.ok) {
      router.push("/dashboard-dev/portfolio");
    } else {
      window.alert(result.message);
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
      isDeletePending={isDeleting}
    />
  );
}
