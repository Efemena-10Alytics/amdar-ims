import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type ProjectBriefProps = {
  project: InternProject;
};

export default function ProjectBrief({ project }: ProjectBriefProps) {
  return (
    <section className="space-y-5 pt-1 text-[#173740]">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Project summary</h3>
        <RichTextContent value={project.summary} />
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-[#173740]">Business context</h4>
        <RichTextContent value={project.businessContext} />
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-[#173740]">Project purpose</h4>
        <RichTextContent value={project.purpose} />
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-[#173740]">Expected outcomes</h4>
        <RichTextContent value={project.expectedOutcomes} />
      </div>
    </section>
  );
}
