"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "./project-form";
import { useAddProject } from "@/features/portfolio/use-add-project";

export default function AddProjectPage() {
  const router = useRouter();
  const { addProject, isSubmitting, errorMessage } = useAddProject();

  return (
    <ProjectForm
      headline={{
        title: "Add Project",
        subtitle: "Add one of your best project here",
      }}
      backHref="/dashboard-dev/portfolio"
      submitLabel="Add project"
      submittingLabel="Adding project…"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSubmit={async (data) => {
        const ok = await addProject(data);
        if (ok) router.push("/dashboard-dev/portfolio");
        return ok;
      }}
    />
  );
}
