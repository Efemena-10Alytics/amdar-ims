import { useQuery } from "@tanstack/react-query";
import { apiBaseURL, axiosInstance } from "@/lib/axios-instance";
import type { CheckoutData } from "@/types/payment";

const CHECKOUT_QUERY_KEY = (slug: string, promoCode?: string | null) =>
  ["payment", "checkout", slug, promoCode ?? ""] as const;

export type { CheckoutData } from "@/types/payment";

export function useGetCheckoutData(
  slug: string | undefined | null,
  promoCode?: string | null
) {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEY(slug ?? "", promoCode),
    queryFn: async (): Promise<CheckoutData> => {
      const programSlug = slug ?? "";
      const params = new URLSearchParams({ program_slug: programSlug });
      if (promoCode?.trim()) params.set("promo_code", promoCode.trim());
      const { data } = await axiosInstance.get<{ data: CheckoutData }>(
        `/payment/checkout?${params.toString()}`
      );
      return data.data;
    },
    enabled: !!apiBaseURL && !!slug?.trim(),
  });
}
