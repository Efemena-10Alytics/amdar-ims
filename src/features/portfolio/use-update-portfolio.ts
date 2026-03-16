import { useCallback, useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";

type ExternalPortfoliosResponse = {
  success?: boolean;
  data?: unknown;
};

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } }; message?: string })
      ?.response?.data?.message ??
    (error as Error)?.message ??
    "Request failed"
  );
}

export function useUpdateProject() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateProject = useCallback(async (formData: FormData) => {
    setIsUpdating(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.put<ExternalPortfoliosResponse>(
        "external-portfolios",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res?.data?.success !== true) {
        setErrorMessage(getErrorMessage(new Error("Request failed")));
        return;
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

  return { updateProject, isUpdating, errorMessage };
}
