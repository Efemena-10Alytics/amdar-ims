"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ProjectForm } from "../project-form";
import { useGetProjectByUserId } from "@/features/portfolio/use-get-project-by-id";
import { useUpdatePortfolioProject } from "@/features/portfolio/use-update-portfolio-project";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";

function paramId(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = paramId(params?.id);

  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const { data, isLoading, isError, error } = useGetProjectByUserId(
    userId,
    projectId ?? null,
  );
  const { updateProject, isSubmitting, errorMessage } =
    useUpdatePortfolioProject();

  const viewHref =
    projectId != null
      ? `/dashboard-dev/portfolio/add-project/${encodeURIComponent(projectId)}`
      : "/dashboard-dev/portfolio";

  if (!projectId) {
    return (
      <div className="app-width flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm text-zinc-600">Invalid project.</p>
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
        <p className="text-sm text-zinc-600">Sign in to edit this project.</p>
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

  if (isError || !data) {
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
    <ProjectForm
      initialProject={data}
      prefillKey={projectId}
      headline={{
        title: "Edit project",
        subtitle: "Update your project details and save your changes",
      }}
      backHref={viewHref}
      submitLabel="Save changes"
      submittingLabel="Saving…"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSubmit={async (formData) => {
        const ok = await updateProject(projectId, formData);
        if (ok) router.push(viewHref);
        return ok;
      }}
    />
  );
}
