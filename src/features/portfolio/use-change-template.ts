import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

type ChangeTemplateResponse = {
  success?: boolean;
  data?: unknown;
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to change template"
  );
}

export type ChangeTemplatePayload = {
  template: string;
};

export function useChangeTemplate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = getUserId(user);

  const [isChangingTemplate, setIsChangingTemplate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const changeTemplate = useCallback(
    async ({ template }: ChangeTemplatePayload): Promise<boolean> => {
      if (!template?.trim()) {
        setErrorMessage("Template is required.");
        return false;
      }

      setIsChangingTemplate(true);
      setErrorMessage("");

      try {
        const res = await axiosInstance.patch<ChangeTemplateResponse>(
          "/user-portfolio",
          {
            setting: {
              template: template.trim(),
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (res?.data?.success !== true) {
          const backendMessage = res?.data?.message ?? res?.data?.error;
          setErrorMessage(
            backendMessage || getErrorMessage(new Error("Request failed")),
          );
          return false;
        }

        await queryClient.invalidateQueries({
          queryKey: PORTFOLIO_QUERY_KEY(userId ?? ""),
        });

        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        return false;
      } finally {
        setIsChangingTemplate(false);
      }
    },
    [queryClient, userId],
  );

  return {
    changeTemplate,
    isChangingTemplate,
    errorMessage,
  };
}
