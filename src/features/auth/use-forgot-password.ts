import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type UseForgotPasswordOptions = {
  onSuccess?: () => void;
};

function getForgotPasswordErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to send reset link"
  );
}

export function useForgotPassword(options: UseForgotPasswordOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = useCallback(
    async (email: string) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await axiosInstance.post("forgot-password", { email });
        options.onSuccess?.();
        if (typeof window !== "undefined") {
          const params = new URLSearchParams();
          params.set("email", email);
          window.location.replace(`/auth/reset-password?${params.toString()}`);
        }
      } catch (error) {
        const message = getForgotPasswordErrorMessage(error);
        setErrorMessage(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options.onSuccess],
  );

  return { submit, isLoading, errorMessage };
}
