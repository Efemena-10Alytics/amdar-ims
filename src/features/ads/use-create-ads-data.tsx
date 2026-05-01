import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type CreateNaRolesPayload = {
  source: string;
  firstName: string;
  email: string;
  location: string;
  phone: string;
  lastName?: string | null;
  visaType?: string | null;
};

type CreateNaRolesResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to submit details"
  );
}

export function useCreateAdsData() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createNaRole = useCallback(async (payload: CreateNaRolesPayload) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const body = {
        source: payload.source,
        firstName: payload.firstName,
        lastName: payload.lastName ?? null,
        email: payload.email,
        location: payload.location,
        phone: payload.phone,
        visaType: payload.visaType ?? null,
      };

      const res = await axiosInstance.post<CreateNaRolesResponse>(
        "/na-roles",
        body,
      );

      if (res?.data?.success !== true) {
        const backendMsg =
          (res?.data as { message?: string })?.message ??
          "Request was not successful";
        setErrorMessage(backendMsg);
        return null;
      }

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createNaRole, isSubmitting, errorMessage };
}
