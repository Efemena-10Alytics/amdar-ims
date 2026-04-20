"use client";
import { useEffect, useMemo } from "react";
import { initClassicAos } from "./init-classic-aos";

export type ToolItem = {
  name: string;
  iconUrl?: string;
  skillLevel?: number;
  percentage?: number;
};

const DEFAULT_TOOL_ICONS: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
  Trello: "/images/svgs/tools/trello.svg",
  Photoshop: "/images/svgs/tools/photoshop.svg",
  "Adobe Illustrator": "/images/svgs/tools/adobe-illustrator.svg",
};

const MAX_VISIBLE_TOOLS = 7;

type MyToolsProps = {
  tools?: ToolItem[];
  /** Large faded title on the right (e.g. "Product Designer"). */
  title?: string;
  showToolsRate?: boolean;
  temp?: string;
};

/** Higher skillLevel first; items without skillLevel rank by percentage after all rated ones. */
function compareToolsBySkill(a: ToolItem, b: ToolItem): number {
  const sa = a.skillLevel;
  const sb = b.skillLevel;
  if (sa != null && sb != null) return sb - sa;
  if (sa != null) return -1;
  if (sb != null) return 1;
  return (b.percentage ?? 0) - (a.percentage ?? 0);
}

export function MyTools({
  tools = [],
  title = "Product Designer",
  showToolsRate = true,
  temp
}: MyToolsProps) {
  const trimmed = title.trim();
  const spaceIdx = trimmed.indexOf(" ");
  const firstLine =
    spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const restLine =
    spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1).trimStart();

  const displayedTools = useMemo(
    () =>
      [...tools].sort(compareToolsBySkill).slice(0, MAX_VISIBLE_TOOLS),
    [tools]
  );

  useEffect(() => {
    initClassicAos();
  }, []);

  return (
    <div data-aos="fade-up" className="mt-20">
      <div className="text-xl font-semibold text-[#A1A8B1] mb-4">My Tools</div>
      <section
        className="flex flex-col md:flex-row gap-8 md:gap-20 items-center"
        aria-label="My tools"
      >
        {/* Left: My Tools list */}
        <div className="flex-1 w-full">
          <ul className="">
            {displayedTools.map((tool, index) => {
              const iconSrc = tool.iconUrl ?? DEFAULT_TOOL_ICONS[tool.name];
              const pct = tool.skillLevel ?? tool.percentage ?? 80;
              return (
                <li key={tool.name + index} className="hover:bg-[#B6CFD4] hover:px-4 group cursor-alias">
                  <div className="flex justify-between flex-1 md:items-center gap-3 py-3">
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
                    {showToolsRate ? (
                      <h2 className="text-lg text-[#B6CFD4] font-black tabular-nums group-hover:text-primary">
                        {pct}%
                      </h2>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Large faded title */}
        {temp !== "bold" &&<div className="flex-1 flex w-full items-center justify-center h-full md:min-h-0">
          <div className="">
            <h1
            data-aos="fade-right"
              className="block text-4xl md:text-5xl lg:text-6xl font-black text-[#E8EFF1] leading-tight"
              aria-hidden
            >
              {firstLine}
            </h1>
            <h1
            data-aos="fade-left"
              className="ml-auto translate-x-20 text-4xl md:text-5xl lg:text-6xl font-semibold text-[#B6CFD4] leading-tight mt-0.5"
              aria-hidden
            >
              {restLine}
            </h1>
          </div>
        </div>}
      </section>
    </div>
  );
}
