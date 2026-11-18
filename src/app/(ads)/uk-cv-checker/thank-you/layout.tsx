import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Your UK CV Sponsorship Audit | Amdari",
  },
  description:
    "Your personalised UK CV sponsorship readiness score, critical missing signals, and 3-step rebuild roadmap.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UkCvCheckerThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
