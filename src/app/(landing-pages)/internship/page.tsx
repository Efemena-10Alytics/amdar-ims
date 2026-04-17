import type { Metadata } from "next";
import InternshipPageClient from "@/components/_core/landing-pages/internship-program/internship-page-client";

export const metadata: Metadata = {
  title: "Work experience that helps you land tech jobs easily",
  description:
    "Gain real work experience in Data, Cybersecurity, Project Management, Business Analysis & Product Design",
};

export default function ChoosePathPage() {
  return <InternshipPageClient />;
}
