import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOB_OPENINGS } from "@/components/_core/landing-pages/hr-job-listing/data";
import ApplyForm from "@/components/_core/landing-pages/hr-job-listing/apply/apply-form";

type ApplyPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = JOB_OPENINGS.find((item) => item.id === id);

  if (!job) return { title: "Role not found | Amdari Careers" };

  return {
    title: `Apply: ${job.detailTitle} | Amdari Careers`,
    description: `Submit your application for the ${job.detailTitle} role at Amdari.`,
  };
}

const ApplyPage = async ({ params }: ApplyPageProps) => {
  const { id } = await params;
  const job = JOB_OPENINGS.find((item) => item.id === id);

  if (!job) notFound();

  return <ApplyForm job={job} />;
};

export default ApplyPage;
