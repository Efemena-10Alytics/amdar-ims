import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Your Sponsorship Diagnostic Report | Amdari",
  },
  description:
    "Your personalised UK Skilled Worker sponsorship readiness score, critical blockers, and consultation roadmap.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UkCareerDiagnosticThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
