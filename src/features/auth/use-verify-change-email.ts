import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

type VerifyChangeEmailResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Verification failed"
  );
}

export function useVerifyChangeEmail() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyChangeEmail = useCallback(async (new_email: string) => {
    setIsVerifying(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.post<VerifyChangeEmailResponse>(
        "change-email/verify",
        { new_email },
      );
      if (res?.data?.success !== true) {
        setErrorMessage(getErrorMessage(new Error("Verification failed")));
        return;
      }
      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { verifyChangeEmail, isVerifying, errorMessage };
}
