"use client";

import { Suspense } from "react";
import { JourneyLayoutHeader } from "@/components/_core/onboarding/journey-layout-header";
import Aside from "@/components/_core/setup/aside";

const RIGHT_PANEL_STYLE = {
  backgroundColor: "#E8EFF1",
  backgroundImage: "url(/images/pngs/auth-pattern.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "0 0",
} as const;

export default function SetupShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white p-3 2xl:p-5">
      <Suspense fallback={<div className="hidden lg:flex lg:w-[45%] xl:w-[42%]" />}>
        <Aside />
      </Suspense>
      <div
        className="relative h-full min-h-0 w-full overflow-y-auto sm:pl-10"
        style={RIGHT_PANEL_STYLE}
      >
        <JourneyLayoutHeader activeStep={3} />
        <div className="pb-8">{children}</div>
      </div>
    </div>
  );
}
