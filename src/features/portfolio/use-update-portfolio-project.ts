import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";
import { PROJECT_BY_ID_QUERY_KEY } from "./use-get-project-by-id";
import { buildProjectFormData, type AddProjectFormData } from "./build-project-form-data";

type UpdateProjectResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to update project"
  );
}

export function useUpdatePortfolioProject() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateProject = useCallback(
    async (
      projectId: string | number,
      data: AddProjectFormData,
    ): Promise<boolean> => {
      if (userId == null || userId === "") {
        setErrorMessage("You must be signed in to update a project.");
        return false;
      }
      setIsSubmitting(true);
      setErrorMessage("");
      try {
        const formData = buildProjectFormData(data);
        const res = await axiosInstance.post<UpdateProjectResponse>(
          `user-portfolio/projects/${projectId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        if (res?.data?.success !== true) {
          const backendMsg =
            (res?.data as { message?: string })?.message ??
            (res?.data as { error?: string })?.error;
          setErrorMessage(
            backendMsg || getErrorMessage(new Error("Request failed")),
          );
          return false;
        }
        await queryClient.invalidateQueries({
          queryKey: PORTFOLIO_QUERY_KEY(userId ?? ""),
        });
        await queryClient.invalidateQueries({
          queryKey: PROJECT_BY_ID_QUERY_KEY(userId, projectId),
        });
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient, userId],
  );

  return { updateProject, isSubmitting, errorMessage };
}
