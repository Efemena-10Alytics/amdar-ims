import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import type { ApiResponse, ConfigData } from "./types";

export function useCVReviewConfig() {
  return useQuery({
    queryKey: ["cv-review-config"],
    queryFn: async (): Promise<ConfigData> => {
      const res = await axiosInstance.get<ApiResponse<ConfigData>>(
        "cv-review/config",
      );
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
