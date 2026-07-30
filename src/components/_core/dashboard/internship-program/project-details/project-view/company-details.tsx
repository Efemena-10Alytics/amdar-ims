import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type CompanyDetailsProps = {
  project: InternProject;
};

export default function CompanyDetails({ project }: CompanyDetailsProps) {
  return (
    <section className="space-y-6 pt-1">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Company overview</h3>
        {project.companyName ? (
          <h4 className="text-base font-semibold text-[#173740]">
            {project.companyName}
          </h4>
        ) : null}
        <RichTextContent value={project.companyOverview} />
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-semibold text-[#173740]">Business challenge</h4>
        <RichTextContent value={project.businessChallenge} />
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-semibold text-[#173740]">
          Rationale for this project
        </h4>
        <RichTextContent value={project.rationale} />
      </div>
    </section>
  );
}
