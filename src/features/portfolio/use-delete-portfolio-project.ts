import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";
import { PROJECT_BY_ID_QUERY_KEY } from "./use-get-project-by-id";

type DeleteProjectResponse = {
  success?: boolean;
  message?: string;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to delete project"
  );
}

export type DeletePortfolioProjectResult =
  | { ok: true }
  | { ok: false; message: string };

export function useDeletePortfolioProject() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deleteProject = useCallback(
    async (
      projectId: string | number,
    ): Promise<DeletePortfolioProjectResult> => {
      if (userId == null || userId === "") {
        const message = "You must be signed in to delete a project.";
        setErrorMessage(message);
        return { ok: false, message };
      }
      setIsDeleting(true);
      setErrorMessage("");
      try {
        const res = await axiosInstance.delete<DeleteProjectResponse>(
          `user-portfolio/projects/${projectId}`,
        );
        const body = res.data;
        if (
          body &&
          typeof body === "object" &&
          body.success === false
        ) {
          const message =
            body.message ?? getErrorMessage(new Error("Request failed"));
          setErrorMessage(message);
          return { ok: false, message };
        }
        await queryClient.invalidateQueries({
          queryKey: PORTFOLIO_QUERY_KEY(userId),
        });
        queryClient.removeQueries({
          queryKey: PROJECT_BY_ID_QUERY_KEY(userId, projectId),
        });
        return { ok: true };
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        return { ok: false, message };
      } finally {
        setIsDeleting(false);
      }
    },
    [queryClient, userId],
  );

  return { deleteProject, isDeleting, errorMessage };
}
