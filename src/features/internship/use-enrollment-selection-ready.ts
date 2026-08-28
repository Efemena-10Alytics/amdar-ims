"use client";

import { useSyncExternalStore } from "react";
import { useEnrollmentSelectionStore } from "@/store/enrollment-selection-store";

function getPersistApi() {
  return useEnrollmentSelectionStore.persist;
}

function subscribe(onStoreChange: () => void) {
  const persistApi = getPersistApi();
  if (!persistApi?.onFinishHydration) return () => {};
  return persistApi.onFinishHydration(onStoreChange);
}

function getSnapshot(): boolean {
  const persistApi = getPersistApi();
  // No persist middleware means nothing to wait for.
  if (!persistApi?.hasHydrated) return true;
  return persistApi.hasHydrated();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether the persisted enrollment selection has been read back from
 * localStorage.
 *
 * Queries that key off the selection must wait for this, or they fire once with
 * an empty selection and again once it rehydrates — which for a specialist
 * means one request against the wrong cohort before the right one.
 */
export function useEnrollmentSelectionReady(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
