"use client";
import Aos from "aos";
import { useEffect } from "react";

export type ToolItem = {
  name: string;
  iconUrl?: string;
  percentage?: number;
};

const DEFAULT_TOOL_ICONS: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
  Trello: "/images/svgs/tools/trello.svg",
  Photoshop: "/images/svgs/tools/photoshop.svg",
  "Adobe Illustrator": "/images/svgs/tools/adobe-illustrator.svg",
};

type MyToolsProps = {
  tools?: ToolItem[];
  /** Large faded title on the right (e.g. "Product Designer"). */
  title?: string;
};

export function MyTools({
  tools = [],
  title = "Product Designer",
}: MyToolsProps) {
  const lines = title.split(" ");
  const firstLine = lines[0] ?? "";
  const restLine = lines.slice(1).join(" ");

  useEffect(() => {
    Aos.init()
  }, [])

  return (
    <div data-aos="fade-up" className="mt-20">
      <div className="text-xl font-semibold text-[#A1A8B1] mb-4">My Tools</div>
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center"
        aria-label="My tools"
      >
        {/* Left: My Tools list */}
        <div>
          <ul className="">
            {tools.map((tool, index) => {
              const iconSrc = tool.iconUrl ?? DEFAULT_TOOL_ICONS[tool.name];
              const pct = tool.percentage ?? 80;
              return (
                <li key={tool.name + index}>
                  <div className="flex items-center gap-3 py-3">
                    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded bg-white border border-zinc-100">
                      {iconSrc ? (
                        <img
                          src={iconSrc}
                          alt=""
                          className="size-5 object-contain"
                        />
                      ) : (
                        <span className="text-xs font-semibold font-clash-display! text-zinc-500">
                          {tool.name.charAt(0)}
                        </span>
                      )}
                    </span>
                    <h3 className="flex-1 min-w-0 text-sm font-semibold font-clash-display! text-[#092A31]">
                      {tool.name}
                    </h3>
                    <h2 className="text-lg text-[#B6CFD4] font-black tabular-nums">
                      {pct}%
                    </h2>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Large faded title */}
        <div className="flex w-full items-center justify-center h-full md:min-h-0">
          <div className="">
            <h1
              className="block text-4xl md:text-5xl lg:text-6xl font-black text-[#E8EFF1] leading-tight"
              aria-hidden
            >
              {firstLine}
            </h1>
            <h1
              className="ml-auto translate-x-20 text-4xl md:text-5xl lg:text-6xl font-semibold text-[#B6CFD4] leading-tight mt-0.5"
              aria-hidden
            >
              {restLine}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
}
