import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "The Fast-Track Hiring Bundle | Amdari",
  },
  description:
    "Everything included in your Amdari experience, built to get you hired in the UK, US & Canada, with your own tailored applications ready in 48 hours.",
  keywords:
    "Amdari, Fast-Track Hiring Bundle, UK tech jobs, North America tech jobs, CV matching, Skilled Worker Sponsorship, Global Talent Visa, Interview Fast-Track",
  openGraph: {
    title: "The Fast-Track Hiring Bundle | Amdari",
    description:
      "Everything included in your Amdari experience, built to get you hired with your own tailored applications ready in 48 hours.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fast-Track Hiring Bundle | Amdari",
    description:
      "Everything included in your Amdari experience, built to get you hired with your own tailored applications ready in 48 hours.",
  },
};

export default function FastTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
