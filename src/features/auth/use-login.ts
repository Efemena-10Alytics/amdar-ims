import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "../../store/auth-store";

export type LoginCredentials = {
  email?: string;
  password?: string;
  [key: string]: unknown;
};

/** Extract a user-facing message from API error (422, 4xx, network, etc.). */
function getLoginErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: unknown; status?: number };
    message?: string;
  };
  const data = err?.response?.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.message === "string" && d.message) return d.message;
    if (typeof d.error === "string" && d.error) return d.error;
    const errors = d.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && typeof (first as { message?: string }).message === "string") {
        return (first as { message: string }).message;
      }
    }
  }
  return err?.message && typeof err.message === "string" ? err.message : "Login failed";
}

const login = async (
  user: LoginCredentials,
  redirectURL?: string,
  skipRedirect?: boolean,
): Promise<AuthUser | null> => {
  try {
    const res = await axiosInstance.post<{ data: AuthUser }>("login", user);
    if (res.status === 200 && res.data?.data) {
      useAuthStore.getState().setUser(res.data.data);
      if (typeof window !== "undefined" && !skipRedirect) {
        window.location.replace(redirectURL ?? "/internship");
      }
      return res.data.data;
    }
    return null;
  } catch (error) {
    throw new Error(getLoginErrorMessage(error));
  }
};

export function useLogin() {
  const { isLoggingIn, setIsLoggingIn } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState("");

  const userLogin = useCallback(
    async (
      user: LoginCredentials,
      redirectURL?: string,
      skipRedirect?: boolean,
    ): Promise<AuthUser | null> => {
      setIsLoggingIn(true);
      setErrorMessage("");
      try {
        const authUser = await login(user, redirectURL, skipRedirect);
        return authUser;
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : getLoginErrorMessage(error),
        );
        return null;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [setIsLoggingIn],
  );

  return { login: userLogin, isLoggingIn, errorMessage };
}
