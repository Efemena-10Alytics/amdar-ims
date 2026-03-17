import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

type InitializePortfolioResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to initialize portfolio"
  );
}

export function useInitializePortfolio() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [isInitializing, setIsInitializing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initializePortfolio = useCallback(async () => {
    setIsInitializing(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.post<InitializePortfolioResponse>(
        "user-portfolio",
        {},
      );
      if (res?.data?.success !== true) {
        setErrorMessage(getErrorMessage(new Error("Request failed")));
        return;
      }
      queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY(userId ?? "") });
      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsInitializing(false);
    }
  }, [queryClient, userId]);

  return { initializePortfolio, isInitializing, errorMessage };
}
