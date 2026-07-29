import type { InternProject } from "@/features/interns-project/internship-project.types";
import { RichTextContent } from "../project-content";

type LessonsProps = {
  project: InternProject;
};

export default function Lessons({ project }: LessonsProps) {
  return (
    <section className="space-y-6 pt-1">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">
          Key takeaways and reflection prompts
        </h3>
        <RichTextContent
          value={project.keyTakeaways}
          className="text-lg [&_p]:text-lg"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[#173740]">Summary</h3>
        <RichTextContent
          value={project.closingNote}
          className="text-xl [&_p]:text-xl"
        />
      </div>
    </section>
  );
}
