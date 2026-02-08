import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type ResetPasswordPayload = {
  token: string; // OTP
  password: string;
  password_confirmation: string;
};

function getResetPasswordErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to reset password"
  );
}

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reset = useCallback(async (payload: ResetPasswordPayload) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axiosInstance.post("reset-password", payload);
      if (typeof window !== "undefined") {
        window.location.replace("/auth/success?type=forgot-password");
      }
    } catch (error) {
      const message = getResetPasswordErrorMessage(error);
      setErrorMessage(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { reset, isLoading, errorMessage };
}
