import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export type TreasureListItem = {
  id: number;
  units: number;
};

export type GetTreasuresResponse = {
  success: boolean;
  message: string;
  data: TreasureListItem[];
};

export const TREASURES_QUERY_KEY = (hunterId: number | null | undefined) =>
  ["treasure-hunt", "treasures", hunterId ?? null] as const;

/** GET /api/v3/treasures?hunter_id= */
export async function fetchTreasures(
  hunterId: number,
): Promise<TreasureListItem[]> {
  const { data } = await axiosInstance.get<GetTreasuresResponse>("v3/treasures", {
    params: { hunter_id: hunterId },
  });

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to retrieve treasures.");
  }

  return Array.isArray(data.data) ? data.data : [];
}

export function useGetTreasures(hunterId: number | null | undefined) {
  return useQuery({
    queryKey: TREASURES_QUERY_KEY(hunterId),
    queryFn: () => fetchTreasures(hunterId as number),
    enabled: !!apiBaseURL && typeof hunterId === "number" && hunterId > 0,
  });
}
