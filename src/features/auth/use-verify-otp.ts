import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

export type VerifyEmailOptions = {
  /** Redirect path after verification (e.g. "/dashboard"). */
  redirect?: string;
  /** If true, redirect URL gets ?u-status=new (or &u-status=new). */
  newUser?: boolean;
  /** Program id to pass to success/next route (e.g. for payment). */
  program?: string;
  /** When true, do not redirect after verification (e.g. for modal flow). */
  skipRedirect?: boolean;
};

type VerifyEmailResponse = {
  success?: boolean;
  data?: unknown;
};

function getVerifyErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Verification failed"
  );
}

export function useVerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verify = useCallback(
    async (otp: string, options: VerifyEmailOptions = {}) => {
      setIsVerifying(true);
      setErrorMessage("");

      try {
        const res = await axiosInstance.post<VerifyEmailResponse>(
          "verify-email",
          { token: otp }
        );

        if (res?.data?.success === true && typeof window !== "undefined") {
          if (options.skipRedirect) return;
          const { redirect, newUser, program } = options;
          const params = new URLSearchParams();
          if (redirect) params.set("redirect", redirect);
          if (newUser) params.set("u-status", "new");
          if (program) params.set("program", program);
          const query = params.toString();
          const successUrl = query
            ? `/auth/success?${query}`
            : "/auth/success";
          window.location.replace(successUrl);
        }
      } catch (error) {
        const message = getVerifyErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  return { verify, isVerifying, errorMessage };
}
