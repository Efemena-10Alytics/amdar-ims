import type { Metadata } from "next";
import DashboardBlogContent from "@/components/_core/dashboard/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Career insights and educational contents for tech job seekers in the UK, US & Canada",
};

const DashboardBlogPage = () => {
  return <DashboardBlogContent />;
};

export default DashboardBlogPage;
