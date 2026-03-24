import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

type AddProjectResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to add project"
  );
}

export type ProjectTool = {
  name: string;
  image?: string;
};

export type AddProjectFormData = {
  title: string;
  category: string;
  overview: string;
  rationale: string;
  aim: string;
  scope: string;
  expert: string;
  solutionUrl: string;
  mediaLink: string;
  tools: ProjectTool[];
  coverFile: File | null;
  projectFiles: File[];
};

function buildFormData(data: AddProjectFormData): FormData {
  const formData = new FormData();

  const prefix = "projects[0]";
  formData.append(`${prefix}[title]`, data.title.trim());
  formData.append(`${prefix}[category]`, data.category.trim());
  formData.append(`${prefix}[overview]`, data.overview.trim());
  formData.append(`${prefix}[rationale]`, data.rationale.trim());
  formData.append(`${prefix}[aim]`, data.aim.trim());
  formData.append(`${prefix}[scope]`, data.scope.trim());
  formData.append(`${prefix}[excerpt]`, data.expert.trim());
  formData.append(`${prefix}[solutionUrl]`, data.solutionUrl.trim());
  formData.append(`${prefix}[mediaLink]`, data.mediaLink.trim());

  if (data.coverFile) {
    formData.append(`${prefix}[coverImage]`, data.coverFile);
  }

  data.projectFiles.slice(0, 6).forEach((file, i) => {
    formData.append(`${prefix}[images][${i}]`, file);
  });

  data.tools.forEach((tool, i) => {
    formData.append(`${prefix}[tools][${i}][name]`, tool.name.trim());
    if (tool.image?.trim()) {
      formData.append(`${prefix}[tools][${i}][image]`, tool.image.trim());
    }
  });

  return formData;
}

export function useAddProject() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addProject = useCallback(
    async (data: AddProjectFormData) => {
      setIsSubmitting(true);
      setErrorMessage("");
      try {
        const formData = buildFormData(data);
        const res = await axiosInstance.post<AddProjectResponse>(
          "user-portfolio/projects",
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
            backendMsg || getErrorMessage(new Error("Request failed"))
          );
          return false;
        }
        queryClient.invalidateQueries({
          queryKey: PORTFOLIO_QUERY_KEY(userId ?? ""),
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

  return { addProject, isSubmitting, errorMessage };
}
