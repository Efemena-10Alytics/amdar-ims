import { Download } from "lucide-react";

const TOOLS = [
  { name: "Google Sheet", href: "#" },
  { name: "Excel", href: "#" },
  { name: "PowerP", href: "#" },
];

export default function TechStack() {
  return (
    <section className="pt-1">
      <div className="rounded-2xl border border-[#E5EDF0] bg-[#F8FCFD] p-4 shadow-[0_8px_20px_rgba(15,62,73,0.08)] sm:p-5">
        <h3 className="text-xl font-semibold text-[#173740]">How to install your tools</h3>

        <div className="mt-3 space-y-2.5">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#EAF1F4] px-3 py-2.5 sm:px-4"
            >
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-[#3E6771]">{tool.name}</p>
                <a
                  href={tool.href}
                  className="text-base font-semibold text-[#6E97A3] underline underline-offset-2 transition-colors hover:text-[#156374]"
                >
                  How to install
                </a>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#B6DAE0] px-2.5 py-1.5 text-lg font-semibold text-[#347A8A] transition-colors hover:bg-[#a8d1d9]"
              >
                <Download className="size-4" />
                Click to download
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
