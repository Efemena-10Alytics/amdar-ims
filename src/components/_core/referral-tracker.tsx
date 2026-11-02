"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setStoredReferralCode } from "@/features/referral/referral-storage";

function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim()) {
      setStoredReferralCode(ref.trim());
    }
  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralCapture />
    </Suspense>
  );
}
