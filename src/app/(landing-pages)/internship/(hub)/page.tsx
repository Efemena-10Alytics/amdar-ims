import type { Metadata } from "next";
import ChoosePath from "@/components/_core/landing-pages/internship-program/choose-path";
import WhyTakeTheInternship from "@/components/_core/landing-pages/internship-program/why-take-the-internship";
import JobReady from "@/components/_core/landing-pages/internship-program/job-ready";
import { InternshipSessionCapture } from "@/components/_core/landing-pages/internship-program/internship-session-capture";
import { getInternshipProgramsAll } from "@/features/internship/use-get-all-internship-programs";
import type { InternshipProgram } from "@/types/internship-program";

const PAGE_TITLE =
  "Work experience that helps you land tech jobs easily";
const PAGE_DESCRIPTION =
  "Gain real work experience in Data, Cybersecurity, Project Management, Business Analysis & Product Design";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default async function InternshipHubPage() {
  let internshipPrograms: InternshipProgram[] = [];
  try {
    const data = await getInternshipProgramsAll();
    internshipPrograms = Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    internshipPrograms = [];
  }

  return (
    <div>
      <h1 className="sr-only">{PAGE_TITLE}</h1>
      <p className="sr-only">{PAGE_DESCRIPTION}</p>
      <InternshipSessionCapture />
      <ChoosePath internshipPrograms={internshipPrograms} />
      <WhyTakeTheInternship />
      <JobReady />
    </div>
  );
}
