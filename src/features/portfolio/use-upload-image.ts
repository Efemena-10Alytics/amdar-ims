import { useCallback, useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

type UploadResponse = {
  success?: boolean;
  url?: string;
  data?: { url?: string };
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Upload failed"
  );
}

/**
 * Uploads an image file and returns the URL.
 * Expects backend endpoint to return { url: "..." } or { data: { url: "..." } }
 */
export function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pendingCount = useRef(0);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    pendingCount.current += 1;
    setIsUploading(true);
    setErrorMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await axiosInstance.post<UploadResponse>(
        "upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const url = data?.url ?? data?.data?.url ?? null;
      return url;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      pendingCount.current -= 1;
      if (pendingCount.current <= 0) {
        pendingCount.current = 0;
        setIsUploading(false);
      }
    }
  }, []);

  return { uploadImage, isUploading, errorMessage };
}
