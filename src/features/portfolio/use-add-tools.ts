import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";
import { TOOLS_QUERY_KEY } from "./use-get-tools";

type AddToolsResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to add tools"
  );
}

export type AddToolItem = {
  name: string;
  image?: File | string | null;
};

export type AddToolsFormData = {
  tools: AddToolItem[];
};

function buildFormData(data: AddToolsFormData): FormData {
  const formData = new FormData();
  formData.append("append", "1");

  data.tools.forEach((tool, i) => {
    const prefix = `tools[${i}]`;
    formData.append(`${prefix}[name]`, tool.name.trim());
    if (tool.image != null && tool.image !== "") {
      formData.append(`${prefix}[image]`, tool.image);
    }
  });

  return formData;
}

export function useAddTools() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addTools = useCallback(
    async (data: AddToolsFormData) => {
      setIsSubmitting(true);
      setErrorMessage("");
      try {
        const formData = buildFormData(data);
        const res = await axiosInstance.post<AddToolsResponse>(
          "user-portfolio/tools",
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
        queryClient.invalidateQueries({ queryKey: TOOLS_QUERY_KEY });
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

  return { addTools, isSubmitting, errorMessage };
}
