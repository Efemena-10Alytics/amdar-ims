export const REFERRAL_STORAGE_KEY = "referral_code";

/**
 * Safely retrieve the stored referral code from localStorage.
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const code = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    return code?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Safely persist a referral code to localStorage.
 */
export function setStoredReferralCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = code.trim();
    if (trimmed) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, trimmed);
    }
  } catch {
    // Ignore localStorage errors (e.g. storage disabled or quota exceeded)
  }
}

/**
 * Safely remove the stored referral code from localStorage.
 */
export function clearStoredReferralCode(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    // Ignore localStorage errors
  }
}
