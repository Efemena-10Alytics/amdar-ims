import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type VerifySessionStatus =
  | "idle"
  | "verifying"
  | "success"
  | "cancelled"
  | "processing";

export interface SessionVerificationData {
  status?: string;
  payment_plan_status?: string;
  [key: string]: unknown;
}

interface VerifySessionResponse {
  success: boolean;
  message?: string;
  data?: SessionVerificationData;
}

export interface UseVerifyStripeSessionOptions {
  sessionId: string | null;
  /** If true, verify automatically when sessionId is set (default true) */
  enabled?: boolean;
  onSuccess?: (data: SessionVerificationData) => void;
  onError?: (message: string) => void;
}

export function useVerifyStripeSession({
  sessionId,
  enabled = true,
  onSuccess,
  onError,
}: UseVerifyStripeSessionOptions) {
  const [status, setStatus] = useState<VerifySessionStatus>("idle");
  const [sessionData, setSessionData] = useState<SessionVerificationData | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!sessionId?.trim()) {
      setStatus("idle");
      setErrorMessage("No session ID");
      return;
    }

    setStatus("verifying");
    setErrorMessage(null);

    try {
      const response = await axiosInstance.get<VerifySessionResponse>(
        `payment/verify-session?session_id=${encodeURIComponent(sessionId.trim())}`
      );
      const data = response.data;

      if (!data.success) {
        setStatus("cancelled");
        const msg =
          data.message ?? "Unable to verify payment status. Please contact support.";
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      const session = data.data;
      if (!session) {
        setStatus("cancelled");
        setErrorMessage("Invalid verification response.");
        onError?.("Invalid verification response.");
        return;
      }

      const paymentStatus = session.status;
      const planStatus = session.payment_plan_status;

      if (
        paymentStatus === "paid" &&
        (planStatus === "active" || planStatus === "completed")
      ) {
        setStatus("success");
        setSessionData(session);
        onSuccess?.(session);
      } else if (
        paymentStatus === "unpaid" ||
        planStatus === "inactive"
      ) {
        setStatus("cancelled");
        setErrorMessage("Payment was not completed. Please try again.");
        onError?.("Payment was not completed. Please try again.");
      } else {
        setStatus("processing");
        setSessionData(session);
        setErrorMessage("Payment is being processed. Please wait...");
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      setStatus("cancelled");

      if (err.response?.status === 401) {
        const msg = "Authentication failed. Please log in again.";
        setErrorMessage(msg);
        onError?.(msg);
      } else if (err.response?.status === 404) {
        const msg = "Session not found. Please try again.";
        setErrorMessage(msg);
        onError?.(msg);
      } else {
        const msg =
          err.response?.data?.message ??
          "Error verifying payment. Please contact support.";
        setErrorMessage(msg);
        onError?.(msg);
      }
    }
  }, [sessionId, onSuccess, onError]);

  useEffect(() => {
    if (enabled && sessionId?.trim()) {
      verify();
    } else if (!sessionId?.trim()) {
      setStatus("idle");
      setSessionData(null);
      setErrorMessage(null);
    }
  }, [enabled, sessionId, verify]);

  return {
    status,
    sessionData,
    errorMessage,
    isVerifying: status === "verifying",
    verify,
  };
}
