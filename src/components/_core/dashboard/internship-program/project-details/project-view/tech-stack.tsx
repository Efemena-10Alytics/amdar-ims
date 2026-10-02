import type { InternProject } from "@/features/interns-project/internship-project.types";

type TechStackProps = {
  project: InternProject;
};

export default function TechStack({ project }: TechStackProps) {
  const tools = project.tools ?? [];

  return (
    <section className="pt-1">
      <div className="overflow-hidden rounded-2xl border border-[#E8EEF0] bg-white shadow-[0px_2px_15px_10px_#1563741A]">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h3 className="text-xl font-semibold text-[#173740]">
            Tools you will need
          </h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#94A3B8] uppercase sm:px-6">
                  Tool
                </th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#94A3B8] uppercase sm:px-6">
                  Description
                </th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#94A3B8] uppercase sm:px-6">
                  Link
                </th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#94A3B8] uppercase sm:px-6">
                  Install guide
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.length ? (
                tools.map((tool) => (
                  <tr key={tool.id || tool.name}>
                    <td className="px-5 py-4 text-sm font-medium text-[#173740] sm:px-6 sm:text-base">
                      {tool.name}
                    </td>
                    <td className="max-w-[280px] truncate px-5 py-4 text-sm text-[#64748B] sm:px-6 sm:text-base">
                      {tool.description?.trim() || "—"}
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      {tool.link ? (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-[#3B82F6] underline underline-offset-2 transition-colors hover:text-[#2563EB] sm:text-base"
                        >
                          Download link
                        </a>
                      ) : (
                        <span className="text-sm text-[#94A3B8] sm:text-base">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      {tool.videoLink ? (
                        <a
                          href={tool.videoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-[#3B82F6] underline underline-offset-2 transition-colors hover:text-[#2563EB] sm:text-base"
                        >
                          See guide
                        </a>
                      ) : (
                        <span className="text-sm text-[#94A3B8] sm:text-base">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-sm text-[#94A3B8] sm:px-6"
                  >
                    No tools listed for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
