import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

type ExternalPortfoliosResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Request failed"
  );
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateProject = useCallback(
    async (payload: Record<string, unknown>) => {
      setIsUpdating(true);
      setErrorMessage("");
      try {
        const res = await axiosInstance.patch<ExternalPortfoliosResponse>(
          "user-portfolio",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (res?.data?.success !== true) {
          setErrorMessage(getErrorMessage(new Error("Request failed")));
          return;
        }
        if (userId != null && userId !== "") {
          await queryClient.invalidateQueries({
            queryKey: PORTFOLIO_QUERY_KEY(userId),
          });
        }
        return res.data;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [queryClient, userId],
  );

  return { updateProject, isUpdating, errorMessage };
}
