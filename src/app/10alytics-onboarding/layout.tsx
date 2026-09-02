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
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(108.58deg, #FFEFE1 -1.63%, #F4EFE9 19.17%, #EEEFED 32.73%, #E8EFF1 98.27%)",
      }}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
}
