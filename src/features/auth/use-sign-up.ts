import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "../../store/auth-store";

export type SignUpCredentials = {
  email?: string;
  password?: string;
  password_confirmation?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  phoneNumber?: string;
  [key: string]: unknown;
};

export type SignUpFn = (
  data: SignUpCredentials,
  redirect?: string,
  program?: string
) => Promise<void>;

const signUp = async (
  data: SignUpCredentials,
  redirect?: string,
  program?: string
) => {
  try {
    const res = await axiosInstance.post<{ data: AuthUser }>("register", data);
    if (res.status === 200 && res.data?.data) {
      useAuthStore.getState().setUser(res.data.data);
      if (typeof window !== "undefined") {
        const params = new URLSearchParams();
        if (redirect) params.set("redirect", redirect);
        if (program) params.set("program", program);
        params.set("u-status", "new");
        const query = params.toString();
        window.location.replace(
          query ? `/auth/otp?${query}` : "/auth/otp"
        );
      }
    }
  } catch (error) {
    const message =
      (error as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ??
      (error as Error)?.message ??
      "Sign up failed";
    throw new Error(message);
  }
};

export function useSignUp(): {
  signUp: SignUpFn;
  isSigningUp: boolean;
  errorMessage: string;
  clearError: () => void;
} {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = useCallback(() => setErrorMessage(""), []);

  const doSignUp = useCallback<SignUpFn>(
    async (data, redirect, program) => {
      setIsSigningUp(true);
      setErrorMessage("");
      try {
        await signUp(data, redirect, program);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Sign up failed"
        );
      } finally {
        setIsSigningUp(false);
      }
    },
    []
  );

  return { signUp: doSignUp, isSigningUp, errorMessage, clearError };
}
