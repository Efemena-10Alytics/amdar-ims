import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { useAuthStore, type AuthUser } from "@/store/auth-store";

export type UpdateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  countryCode: string;
  phone: string;
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

export function useUpdateUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateUser = useCallback(
    async (payload: UpdateUserPayload) => {
      setIsUpdating(true);
      setErrorMessage("");
      const body = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        location: payload.location,
        country: payload.location,
        phoneNumber: payload.countryCode
          ? `${payload.countryCode} ${payload.phone}`.trim()
          : payload.phone,
      };
      try {
        const res = await axiosInstance.post<UpdateUserResponse>(
          "update-user",
          body,
        );
        if (res?.data?.success !== true) {
          setErrorMessage(getErrorMessage(new Error("Update failed")));
          return;
        }
        if (res?.data?.data) {
          setUser(res.data.data);
        }
        return res.data;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        throw new Error(message);
      } finally {
        setIsUpdating(false);
      }
    },
    [setUser],
  );

  return { updateUser, isUpdating, errorMessage };
}
