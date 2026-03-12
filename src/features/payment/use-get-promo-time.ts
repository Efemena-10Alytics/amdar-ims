import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";

export const PROMO_URGENCY_QUERY_KEY = ["payment", "promo-urgency"] as const;

export type PromoUrgencyData = {
  end_date?: string;
  slots_left?: number;
  registered?: number;
  registered_interval_hours?: number;
  viewing?: number;
} & Record<string, unknown>;

type PromoUrgencyResponse = {
  data?: PromoUrgencyData;
};

export function useGetPromoUrgency() {
  return useQuery({
    queryKey: PROMO_URGENCY_QUERY_KEY,
    queryFn: async (): Promise<PromoUrgencyData> => {
      const { data } = await axiosInstance.get<PromoUrgencyResponse>(
        "/payment/promo-urgency",
      );
      const payload = data?.data ?? data;
      return payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as PromoUrgencyData)
        : {};
    },
    enabled: !!apiBaseURL,
    staleTime: 2 * 60 * 1000, // 2 minutes – avoid refetching on every countdown re-render
  });
}
