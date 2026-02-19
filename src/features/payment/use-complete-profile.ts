import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "@/store/auth-store";

export type UpdateUserPayload = {
  gender: string;
  projectInterest: string;
  skillLevel: string;
  session_influenced: string;
  decision_influenced: string;
  ref: string;
  find_out: string;
};

type UpdateUserResponse = {
  success?: boolean;
  data?: AuthUser;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Update failed"
  );
}

export function useCompleteProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateUser = useCallback(async (payload: UpdateUserPayload) => {
    setIsUpdating(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.post<UpdateUserResponse>(
        "update-user",
        payload,
      );
      if (res?.data?.success !== true) {
        setErrorMessage(getErrorMessage(new Error("Update failed")));
        return;
      }
      if (res?.data?.data) {
        useAuthStore.getState().setUser(res.data.data);
      }
      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      throw new Error(message);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { updateUser, isUpdating, errorMessage };
}
