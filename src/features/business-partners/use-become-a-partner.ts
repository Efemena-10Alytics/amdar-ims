import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import type { BecomeAPartnerPayload } from "./types";

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Something went wrong. Please try again."
  );
}

export function useBecomeAPartner() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitBecomeAPartner = useCallback(
    async (payload: BecomeAPartnerPayload) => {
      setIsSubmitting(true);
      setErrorMessage("");

      try {
        await axiosInstance.post("/become-a-partner", payload);
        return true;
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { submitBecomeAPartner, isSubmitting, errorMessage };
}
