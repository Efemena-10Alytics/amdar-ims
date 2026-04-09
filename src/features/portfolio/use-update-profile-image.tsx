"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { getUserId } from "@/lib/get-user-id";
import { useAuthStore } from "@/store/auth-store";
import { PORTFOLIO_QUERY_KEY } from "./use-get-portfolio";

type UpdateProfileImageResponse = {
  success?: boolean;
  data?: unknown;
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Failed to update profile image"
  );
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateProfileImage = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setErrorMessage("");
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axiosInstance.post<UpdateProfileImageResponse>(
          "user-portfolio/personal-info/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (res?.data?.success !== true) {
          const backendMsg = res?.data?.message ?? res?.data?.error;
          setErrorMessage(backendMsg || "Failed to update profile image");
          return false;
        }

        if (userId != null && userId !== "") {
          await queryClient.invalidateQueries({
            queryKey: PORTFOLIO_QUERY_KEY(userId),
          });
        }
        await queryClient.invalidateQueries({
          queryKey: ["user-info"],
        });

        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        setErrorMessage(message);
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [queryClient, userId],
  );

  return { updateProfileImage, isUploading, errorMessage };
}
