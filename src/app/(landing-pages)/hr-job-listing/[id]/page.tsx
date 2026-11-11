import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOB_OPENINGS } from "@/components/_core/landing-pages/hr-job-listing/data";
import JobDetail from "@/components/_core/landing-pages/hr-job-listing/job-detail";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** The roles are static, so every detail page is prerendered. */
export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = JOB_OPENINGS.find((item) => item.id === id);

  if (!job) return { title: "Role not found | Amdari Careers" };

  return {
    title: `${job.detailTitle} | Amdari Careers`,
    description: `Apply for the ${job.detailTitle} role at Amdari — ${job.jobType}, ${job.level}.`,
  };
}

const JobDetailPage = async ({ params }: JobDetailPageProps) => {
  const { id } = await params;
  const job = JOB_OPENINGS.find((item) => item.id === id);

  if (!job) notFound();

  return <JobDetail job={job} />;
};

export default JobDetailPage;
