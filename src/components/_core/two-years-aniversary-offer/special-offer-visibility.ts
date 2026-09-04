"use client";

/**
 * Coordinates the anniversary modal and banner so they never appear together.
 * Banner is allowed after the modal is dismissed (or on pages where the modal
 * does not auto-open).
 */
export const SPECIAL_OFFER_STORAGE_KEY = "amdari-special-offer-dismissed";

const listeners = new Set<() => void>();

let modalOpen = false;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeSpecialOfferVisibility(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getSpecialOfferModalOpen(): boolean {
  return modalOpen;
}

export function setSpecialOfferModalOpen(open: boolean) {
  if (modalOpen === open) return;
  modalOpen = open;
  emit();
}

export function getSpecialOfferDismissed(): boolean {
  try {
    return sessionStorage.getItem(SPECIAL_OFFER_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissSpecialOffer() {
  try {
    sessionStorage.setItem(SPECIAL_OFFER_STORAGE_KEY, "true");
  } catch {
    // ignore (e.g. private mode)
  }
  emit();
}

/** Server snapshot — assume not dismissed so SSR and first paint stay consistent. */
export function getSpecialOfferDismissedServerSnapshot(): boolean {
  return false;
}

export function getSpecialOfferModalOpenServerSnapshot(): boolean {
  return false;
}
