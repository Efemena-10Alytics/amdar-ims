import type { Metadata, Viewport } from "next";
import "../_diagnostic-shared/diagnostic.css";

export const viewport: Viewport = {
  themeColor: "#092A31",
};

export const metadata: Metadata = {
  title: {
    absolute:
      "Upload Your CV | UK Skilled Worker Sponsorship & ATS Checker | Amdari",
  },
  description:
    "Upload your CV for an automated UK Skilled Worker sponsorship (£41,700 threshold) and £50,271 5-Year ILR evaluation in 30 seconds.",
  keywords:
    "UK CV checker, Skilled Worker sponsorship CV audit, ATS CV checker UK, £41700 threshold, 5-year ILR, Amdari",
  openGraph: {
    title:
      "Upload Your CV | UK Skilled Worker Sponsorship & ATS Checker | Amdari",
    description:
      "Upload your CV for an automated UK Skilled Worker sponsorship (£41,700 threshold) and £50,271 5-Year ILR evaluation in 30 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Upload Your CV | UK Skilled Worker Sponsorship & ATS Checker | Amdari",
    description:
      "Upload your CV for an automated UK Skilled Worker sponsorship (£41,700 threshold) and £50,271 5-Year ILR evaluation in 30 seconds.",
  },
};

export default function UkCvCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
