import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

type InitiateChangeEmailResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to initiate email change"
  );
}

export function useInitiateChangeEmail() {
  const [isInitiating, setIsInitiating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initiateChangeEmail = useCallback(async (new_email: string) => {
    setIsInitiating(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.post<InitiateChangeEmailResponse>(
        "change-email/initiate",
        { new_email },
      );
      if (res?.data?.success !== true) {
        setErrorMessage(getErrorMessage(new Error("Initiation failed")));
        return;
      }
      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsInitiating(false);
    }
  }, []);

  return { initiateChangeEmail, isInitiating, errorMessage };
}
