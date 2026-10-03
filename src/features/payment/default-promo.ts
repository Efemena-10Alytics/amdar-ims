import { useSearchParams } from "next/navigation";

/** Promo code applied automatically when none is present in the URL. */
export const DEFAULT_PROMO_CODE = "EMBER";

/** Returns the URL promo code, falling back to {@link DEFAULT_PROMO_CODE} when absent/blank. */
export function resolvePromoCode(value: string | null | undefined): string {
  return value?.trim() || DEFAULT_PROMO_CODE;
}

/**
 * For the internship pages: resolves the active promo code and builds the query
 * string (`?promo_code=...&unique=1`) that carries it, plus `unique`, on to the
 * next page (internship hub -> internship detail -> payment).
 */
export function useCarriedCheckoutQuery() {
  const searchParams = useSearchParams();
  const promoCode = resolvePromoCode(searchParams.get("promo_code"));

  const params = new URLSearchParams();
  params.set("promo_code", promoCode);
  if (searchParams.get("unique") === "1") params.set("unique", "1");

  return { promoCode, querySuffix: `?${params.toString()}` };
}
