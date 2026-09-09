import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { TreasureHunterTreasure } from "./use-register";

export type TreasureListItem = {
  id: number;
  units: number;
};

export type TreasureHunter = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  treasure_id: number | null;
  treasure: TreasureHunterTreasure | null;
};

export type GetTreasuresData = {
  hunter: TreasureHunter;
  treasures: TreasureListItem[];
};

export type GetTreasuresResponse = {
  success: boolean;
  message: string;
  data: GetTreasuresData;
};

export const TREASURES_QUERY_KEY = ["treasure-hunt", "treasures", "me"] as const;

/** GET /api/v3/treasures/me */
export async function fetchTreasures(): Promise<GetTreasuresData> {
  const { data } = await axiosInstance.get<GetTreasuresResponse>("v3/treasures/me");

  if (data.success === false) {
    throw new Error(data.message?.trim() || "Failed to retrieve treasures.");
  }

  return {
    hunter: data.data.hunter,
    treasures: Array.isArray(data.data.treasures) ? data.data.treasures : [],
  };
}

export function useGetTreasures() {
  return useQuery({
    queryKey: TREASURES_QUERY_KEY,
    queryFn: fetchTreasures,
    enabled: !!apiBaseURL,
  });
}
