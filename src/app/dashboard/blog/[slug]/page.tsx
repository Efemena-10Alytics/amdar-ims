import type { Metadata } from "next";
import DashboardBlogDetail from "@/components/_core/dashboard/blog/blog-detail";

export const metadata: Metadata = {
  title: "Blog",
};

type DashboardBlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const DashboardBlogDetailPage = async ({ params }: DashboardBlogDetailPageProps) => {
  const { slug } = await params;
  return <DashboardBlogDetail slug={slug} />;
};

export default DashboardBlogDetailPage;
