import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type WorkflowProps = {
  project: InternProject;
};

export default function Workflow({ project }: WorkflowProps) {
  return (
    <section className="space-y-5 pt-1">
      <article className="space-y-2">
        <h3 className="text-3xl font-semibold text-[#173740]">Project phases</h3>
        <RichTextContent
          value={project.projectPhases}
          className="text-xl [&_p]:text-xl"
        />
      </article>

      {project.expectedDeliverables ? (
        <article className="space-y-2">
          <h3 className="text-3xl font-semibold text-[#173740]">
            Expected deliverables
          </h3>
          <RichTextContent
            value={project.expectedDeliverables}
            className="text-xl [&_p]:text-xl"
          />
        </article>
      ) : null}
    </section>
  );
}
