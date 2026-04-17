"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ChoosePath from "@/components/_core/landing-pages/internship-program/choose-path";
import WhyTakeTheInternship from "@/components/_core/landing-pages/internship-program/why-take-the-internship";
import JobReady from "@/components/_core/landing-pages/internship-program/job-ready";
import {
  getSessionOptionByKey,
  SESSION_INFLUENCED_STORAGE_KEY,
} from "@/features/payment/session-options";

function SessionParamCapture() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session = searchParams.get("session");
    if (session == null) return;

    if (typeof window !== "undefined" && getSessionOptionByKey(session)) {
      window.localStorage.setItem(SESSION_INFLUENCED_STORAGE_KEY, session);
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("session");
    const nextQuery = next.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}

export default function InternshipPageClient() {
  return (
    <div>
      <Suspense fallback={null}>
        <SessionParamCapture />
      </Suspense>
      <ChoosePath />
      <WhyTakeTheInternship />
      <JobReady />
    </div>
  );
}
