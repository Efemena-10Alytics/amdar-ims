import { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type ReenrollmentVerifyStatus =
  | "idle"
  | "verifying"
  | "success"
  | "pending"
  | "failed";

export type ReenrollmentSessionData = {
  status?: string;
  payment_status?: string;
  [key: string]: unknown;
};

type VerifyReenrollmentResponse = {
  success?: boolean;
  message?: string;
  data?: ReenrollmentSessionData;
};

const POLL_INTERVAL_MS = 3000;

function resolveVerifyPhase(
  session: ReenrollmentSessionData | undefined,
): ReenrollmentVerifyStatus {
  const status = String(session?.status ?? session?.payment_status ?? "")
    .trim()
    .toLowerCase();

  if (status === "paid" || status === "success" || status === "completed") {
    return "success";
  }

  if (
    status === "pending" ||
    status === "processing" ||
    status === "unpaid"
  ) {
    return "pending";
  }

  if (status === "failed" || status === "cancelled" || status === "canceled") {
    return "failed";
  }

  return "pending";
}

export interface UseVerifyReenrollmentSessionOptions {
  sessionId: string | null;
  enabled?: boolean;
  onSuccess?: (data: ReenrollmentSessionData) => void;
  onError?: (message: string) => void;
}

export function useVerifyReenrollmentSession({
  sessionId,
  enabled = true,
  onSuccess,
  onError,
}: UseVerifyReenrollmentSessionOptions) {
  const [status, setStatus] = useState<ReenrollmentVerifyStatus>("idle");
  const [sessionData, setSessionData] = useState<ReenrollmentSessionData | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const verify = useCallback(async () => {
    if (!sessionId?.trim()) {
      setStatus("idle");
      setErrorMessage("No session ID provided.");
      return;
    }

    setStatus("verifying");
    setErrorMessage(null);

    try {
      const response = await axiosInstance.get<VerifyReenrollmentResponse>(
        `payment/verify-reenrollment-session?session_id=${encodeURIComponent(sessionId.trim())}`,
      );
      const payload = response.data;

      if (payload.success === false) {
        const msg =
          payload.message?.trim() ||
          "Unable to verify re-enrollment payment. Please contact support.";
        setStatus("failed");
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      const session = payload.data;
      const nextStatus = resolveVerifyPhase(session);

      if (nextStatus === "success") {
        clearPollTimer();
        setStatus("success");
        setSessionData(session ?? null);
        onSuccess?.(session ?? {});
        return;
      }

      if (nextStatus === "failed") {
        clearPollTimer();
        setStatus("failed");
        const msg =
          payload.message?.trim() ||
          "Re-enrollment payment could not be verified.";
        setErrorMessage(msg);
        onError?.(msg);
        return;
      }

      setStatus("pending");
      setSessionData(session ?? null);
      setErrorMessage("Payment is being processed. Please wait...");
    } catch (error: unknown) {
      clearPollTimer();
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      let msg = "Error verifying re-enrollment payment. Please contact support.";

      if (err.response?.status === 401) {
        msg = "Please sign in to verify your payment.";
      } else if (err.response?.status === 404) {
        msg = "Payment session not found. Please try again.";
      } else if (typeof err.response?.data?.message === "string") {
        msg = err.response.data.message;
      }

      setStatus("failed");
      setErrorMessage(msg);
      onError?.(msg);
    }
  }, [sessionId, onSuccess, onError, clearPollTimer]);

  useEffect(() => {
    if (!enabled || !sessionId?.trim()) {
      clearPollTimer();
      setStatus("idle");
      setSessionData(null);
      setErrorMessage(null);
      return;
    }

    void verify();

    return () => {
      clearPollTimer();
    };
  }, [enabled, sessionId, verify, clearPollTimer]);

  useEffect(() => {
    if (status !== "pending" || !enabled || !sessionId?.trim()) {
      clearPollTimer();
      return;
    }

    pollTimerRef.current = setTimeout(() => {
      void verify();
    }, POLL_INTERVAL_MS);

    return () => {
      clearPollTimer();
    };
  }, [status, enabled, sessionId, verify, clearPollTimer]);

  return {
    status,
    sessionData,
    errorMessage,
    isVerifying: status === "verifying",
    verify,
  };
}
