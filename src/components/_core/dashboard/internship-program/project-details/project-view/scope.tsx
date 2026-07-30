import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type ScopeProps = {
  project: InternProject;
};

export default function Scope({ project }: ScopeProps) {
  return (
    <section className="space-y-6 pt-1">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Project objectives</h3>
        <RichTextContent value={project.projectObjectives} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold text-[#173740]">In scope</h4>
          <RichTextContent value={project.inScope} />
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-semibold text-[#173740]">Out of scope</h4>
          <RichTextContent value={project.outOfScope} />
        </div>
      </div>
    </section>
  );
}
