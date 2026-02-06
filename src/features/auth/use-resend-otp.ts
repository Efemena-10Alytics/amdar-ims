import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

/** Cooldown in seconds before resend is allowed (5 minutes). */
export const RESEND_COOLDOWN_SECONDS = 300;

export type UseResendOtpOptions = {
  /** Called after a successful resend so the page can reset countdown. */
  onResendSuccess?: () => void;
};

function getResendErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to resend OTP"
  );
}

export function useResendOtp(options: UseResendOtpOptions = {}) {
  const [isResending, setIsResending] = useState(false);
  const [resendErrorMessage, setResendErrorMessage] = useState("");

  const resend = useCallback(async () => {
    setIsResending(true);
    setResendErrorMessage("");

    try {
      await axiosInstance.post("resend-verification-email");
      options.onResendSuccess?.();
    } catch (error) {
      setResendErrorMessage(getResendErrorMessage(error));
      throw error;
    } finally {
      setIsResending(false);
    }
  }, [options.onResendSuccess]);

  return { resend, isResending, resendErrorMessage };
}
