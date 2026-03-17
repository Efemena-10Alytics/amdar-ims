import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const TOOLS_QUERY_KEY = ["tools"] as const;

export type ToolItem = {
  id?: number;
  name?: string;
  icon?: string | null;
  url?: string | null;
  image?: string | null;
};

export function useGetTools() {
  return useQuery({
    queryKey: TOOLS_QUERY_KEY,
    queryFn: async (): Promise<ToolItem[]> => {
      const { data } = await axiosInstance.get<
        ToolItem[] | { data: ToolItem[] }
      >("tools");
      if (!data || typeof data !== "object") return [];
      if ("data" in data && Array.isArray(data.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    },
    enabled: !!apiBaseURL,
  });
}
