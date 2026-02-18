import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "../../store/auth-store";

export type LoginCredentials = {
  email?: string;
  password?: string;
  [key: string]: unknown;
};

const login = async (
  user: LoginCredentials,
  redirectURL?: string,
  skipRedirect?: boolean,
) => {
  try {
    const res = await axiosInstance.post<{ data: AuthUser }>("login", user);
    if (res.status === 200 && res.data?.data) {
      useAuthStore.getState().setUser(res.data.data);
      if (typeof window !== "undefined" && !skipRedirect) {
        window.location.replace(redirectURL ?? "/internship-program");
      }
    }
  } catch (error) {
    const message =
      (error as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ??
      (error as Error)?.message ??
      "Login failed";
    throw new Error(message);
  }
};

export function useLogin() {
  const { isLoggingIn, setIsLoggingIn } = useAuthStore()
  const [errorMessage, setErrorMessage] = useState("");

  const userLogin = useCallback(
    async (
      user: LoginCredentials,
      redirectURL?: string,
      skipRedirect?: boolean,
    ): Promise<boolean> => {
      setIsLoggingIn(true);
      setErrorMessage("");
      try {
        await login(user, redirectURL, skipRedirect);
        return true;
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Login failed");
        return false;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [setIsLoggingIn],
  );

  return { login: userLogin, isLoggingIn, errorMessage };
}
