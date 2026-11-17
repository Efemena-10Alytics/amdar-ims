import type { Metadata } from "next";
import { CreateJobForm } from "@/components/create-job/create-job-form";

export const metadata: Metadata = {
  title: "Create a job | Amdari Recruitment",
};

export default function CreateJobPage() {
  return <CreateJobForm />;
}
