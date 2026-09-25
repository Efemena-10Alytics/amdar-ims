import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type CompanyDetailsProps = {
  project: InternProject;
};

export default function CompanyDetails({ project }: CompanyDetailsProps) {
  const customSections = (project.customType ?? []).filter(
    (section) => section.title?.trim() || section.description?.trim(),
  );

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

      {customSections.map((section, index) => (
        <div
          key={`${section.title.trim() || "custom"}-${index}`}
          className="space-y-2"
        >
          {section.title?.trim() ? (
            <h4 className="text-xl font-semibold text-[#173740]">
              {section.title.trim()}
            </h4>
          ) : null}
          <RichTextContent value={section.description} />
        </div>
      ))}
    </section>
  );
}
