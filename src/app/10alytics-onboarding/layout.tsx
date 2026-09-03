import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "10Alytics Onboarding",
  description:
    "Proceed from 10Alytics into your Amdari internship and build real-world experience.",
};

export default function TenAnalyticsOnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(108.58deg, #FFEFE1 -1.63%, #F4EFE9 19.17%, #EEEFED 32.73%, #E8EFF1 98.27%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(9, 42, 49, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(9, 42, 49, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
        }}
      />
      <div className="relative z-10">
        <Suspense fallback={null}>{children}</Suspense>
      </div>
    </div>
  );
}
