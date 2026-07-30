import { Download } from "lucide-react";
import type { InternProject } from "@/features/interns-project/internship-project.types";

type TechStackProps = {
  project: InternProject;
};

export default function TechStack({ project }: TechStackProps) {
  const tools = project.tools ?? [];

  return (
    <section className="pt-1">
      <div className="rounded-2xl border border-[#E5EDF0] bg-[#F8FCFD] p-4 shadow-[0_8px_20px_rgba(15,62,73,0.08)] sm:p-5">
        <h3 className="text-xl font-semibold text-[#173740]">
          How to install your tools
        </h3>

        <div className="mt-3 space-y-2.5">
          {tools.length ? (
            tools.map((tool) => (
              <div
                key={tool.id || tool.name}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#EAF1F4] px-3 py-2.5 sm:px-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-[#3E6771]">
                    {tool.name}
                  </p>
                  {tool.videoLink || tool.link ? (
                    <a
                      href={tool.videoLink || tool.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-semibold text-[#6E97A3] underline underline-offset-2 transition-colors hover:text-[#156374]"
                    >
                      How to install
                    </a>
                  ) : (
                    <p className="text-sm text-[#94A3B8]">No install guide</p>
                  )}
                </div>

                {tool.link ? (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#B6DAE0] px-2.5 py-1.5 text-lg font-semibold text-[#347A8A] transition-colors hover:bg-[#a8d1d9]"
                  >
                    <Download className="size-4" />
                    Click to download
                  </a>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-[#94A3B8]">No tools listed for this project.</p>
          )}
        </div>
      </div>
    </section>
  );
}
