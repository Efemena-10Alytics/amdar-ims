import type { Metadata, Viewport } from "next";
import "../_diagnostic-shared/diagnostic.css";

export const viewport: Viewport = {
  themeColor: "#092A31",
};

export const metadata: Metadata = {
  title: {
    absolute: "UK Sponsorship Readiness Check | Amdari",
  },
  description:
    "Evaluate your UK Skilled Worker visa sponsorship readiness (£41,700 threshold), ATS compatibility, and £50,271 5-Year ILR alignment in 60 seconds.",
  keywords:
    "UK sponsorship readiness, Skilled Worker visa UK, £41700 salary threshold, 5-year ILR, UK tech career diagnostic, Amdari",
  openGraph: {
    title: "UK Sponsorship Readiness Check | Amdari",
    description:
      "Evaluate your UK Skilled Worker visa sponsorship readiness (£41,700 threshold), ATS compatibility, and £50,271 5-Year ILR alignment in 60 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Sponsorship Readiness Check | Amdari",
    description:
      "Evaluate your UK Skilled Worker visa sponsorship readiness (£41,700 threshold), ATS compatibility, and £50,271 5-Year ILR alignment in 60 seconds.",
  },
};

export default function UkCareerDiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
