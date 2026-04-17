import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "Work experience that helps you land tech jobs easily",
  },
  description:
    "Gain real work experience in Data, Cybersecurity, Project Management, Business Analysis & Product Design",
};

export default function InternshipHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
