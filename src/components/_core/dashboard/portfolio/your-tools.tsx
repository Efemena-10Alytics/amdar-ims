"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, SlidersHorizontal, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddToolsPopover } from "./add-tools-popover";
import { cn } from "@/lib/utils";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { useGetTools } from "@/features/portfolio/use-get-tools";

const DEFAULT_CATEGORY = "Product Design";
const DEFAULT_SKILL_LEVEL = 60;
const TOOLS_PER_PAGE = 12;

const TOOLS = [
  "Figma",
  "Sketch",
  "Jira",
  "Photoshop",
  "Canva",
  "Adobe illustration",
  "Trello",
  "Light room",
];

const TOOL_FILTER_CATEGORIES = [
  "all",
  "Project Management",
  "Data Analytics",
  "SOC Analyst",
  "Ethical Hacking",
  "Data Engineering",
] as const;

const TOOL_CATEGORY_LOOKUP: Record<(typeof TOOL_FILTER_CATEGORIES)[number], Set<string>> = {
  all: new Set(),
  "Project Management": new Set([
    "slack",
    "microsoft excel",
    "confluence",
    "asana",
    "jira",
    "trello",
    "microsoft project",
    "google workspace",
    "microsoft office suite",
  ]),
  "Data Analytics": new Set([
    "sql",
    "microsoft excel",
    "power bi",
    "powerbi",
    "tableau",
    "looker studio",
    "mysql",
    "postgresql",
    "aws",
    "azure",
    "gcp",
    "databricks",
    "amazon athena",
    "amazon redshift",
  ]),
  "SOC Analyst": new Set([
    "misp",
    "wazuh",
    "splunk",
    "microsoft sentinel",
    "ubuntu",
    "qualys",
    "nessus",
    "kali linux",
  ]),
  "Ethical Hacking": new Set([
    "gophish",
    "bloodhound",
    "john the ripper",
    "netexec",
  ]),
  "Data Engineering": new Set([
    "apache airflow",
    "docker",
    "terraform",
    "microsoft azure",
    "google cloud platform (gcp)",
    "google cloud platform",
    "amazon web services (aws)",
    "amazon web services",
    "sql",
    "apache kafka",
    "python",
  ]),
};

const TOOL_IMAGES: Record<string, string> = {
  Figma: "/images/svgs/tools/figma.svg",
  Sketch: "/images/svgs/tools/sketch.svg",
  Jira: "/images/svgs/tools/jira.svg",
  Photoshop: "/images/svgs/tools/photoshop.svg",
  Canva: "/images/svgs/tools/canva.svg",
  "Adobe illustration": "/images/svgs/tools/adobe-illustrator.svg",
  Trello: "/images/svgs/tools/trello.svg",
  "Light room": "/images/svgs/tools/light-room.svg",
};

function normalizeSkillLevel(value: unknown): number {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_SKILL_LEVEL;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function getDisplayToolName(name: string): string {
  return name === "Adobe illustration" ? "Adobe Illustration" : name;
}

export function ToolIcon({
  name,
  customImageUrl,
  apiImageUrl,
}: {
  name: string;
  customImageUrl?: string | null;
  apiImageUrl?: string | null;
}) {
  const src = customImageUrl ?? apiImageUrl ?? TOOL_IMAGES[name];
  if (src) {
    const useImg = !!customImageUrl || !!apiImageUrl;
    return (
      <span
        className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
        aria-hidden
      >
        {useImg ? (
          <img
            src={src}
            alt=""
            className="size-full object-contain"
          />
        ) : (
          <Image
            src={src}
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        )}
      </span>
    );
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600"
      aria-hidden
    >
      {initial}
    </span>
  );
}

export type YourToolsData = {
  selectedTools: string[];
  toolSkillLevels?: Record<string, number>;
  /** Object URLs for custom tool icons (from upload). Revoke when no longer needed. */
  customToolImages?: Record<string, string>;
  /** File objects for custom tools (for upload). */
  customToolFiles?: Record<string, File>;
};

/** Map of tool name -> icon URL (from API). */
export type ToolIconMap = Record<string, string>;

/** Parse API tools into form data (e.g. for prefilling). */
export function payloadToTools(payload: {
  tools?: Array<{
    name?: string | null;
    url?: string | null;
    skillLevel?: string | number | null;
    skill_level?: string | number | null;
  }>;
}): YourToolsData {
  const raw = payload.tools ?? [];
  const toolSkillLevels = raw.reduce<Record<string, number>>((acc, tool) => {
    const name = tool.name?.trim();
    if (!name) return acc;
    acc[name] = normalizeSkillLevel(tool.skillLevel ?? tool.skill_level);
    return acc;
  }, {});
  return {
    selectedTools: raw.map((t) => t.name ?? "").filter(Boolean),
    toolSkillLevels:
      Object.keys(toolSkillLevels).length > 0 ? toolSkillLevels : undefined,
    customToolImages: undefined,
    customToolFiles: undefined,
  };
}

type YourToolsProps = {
  value: YourToolsData;
  onChange: (data: YourToolsData) => void;
};

export function YourTools({ value, onChange }: YourToolsProps) {
  const [addToolsOpen, setAddToolsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof TOOL_FILTER_CATEGORIES)[number]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: portfolioData } = useGetPortfolio();
  const { data: apiTools = [] } = useGetTools();

  useEffect(() => {
    if (!portfolioData?.tools?.length) return;
    const isEmpty = value.selectedTools.length === 0;
    if (!isEmpty) return;
    const prefill = payloadToTools(portfolioData);
    if (prefill.selectedTools.length === 0) return;
    onChange(prefill);
  }, [portfolioData]);

  const toolNameToIcon = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of apiTools) {
      const name = t.name?.trim();
      const icon = t.icon ?? t.url ?? t.image;
      if (name && icon) map[name] = icon;
    }
    for (const t of portfolioData?.tools ?? []) {
      const name = t.name?.trim();
      const icon = t.image ?? t.url;
      if (name && icon && !map[name]) map[name] = icon;
    }
    return map;
  }, [apiTools, portfolioData?.tools]);

  const portfolioToolNames = useMemo((): string[] => {
    return (portfolioData?.tools ?? [])
      .map((t) => t.name?.trim())
      .filter((n): n is string => !!n);
  }, [portfolioData?.tools]);

  const baseToolNames = useMemo((): string[] => {
    const fromApi = apiTools
      .map((t) => t.name?.trim())
      .filter((n): n is string => !!n);
    return fromApi.length > 0 ? fromApi : [...TOOLS];
  }, [apiTools]);

  const displayedTools = useMemo((): string[] => {
    const rest = baseToolNames.filter((t) => !portfolioToolNames.includes(t));
    const custom = value.selectedTools.filter(
      (t) => !portfolioToolNames.includes(t) && !rest.includes(t)
    );
    return [...portfolioToolNames, ...rest, ...custom];
  }, [baseToolNames, portfolioToolNames, value.selectedTools]);
  const filteredTools = useMemo((): string[] => {
    const query = searchTerm.trim().toLowerCase();
    return displayedTools.filter((name) => {
      const normalizedName = name.trim().toLowerCase();
      const displayName = getDisplayToolName(name).toLowerCase();
      const categorySet = TOOL_CATEGORY_LOOKUP[selectedCategory];
      const matchesCategory =
        selectedCategory === "all" || categorySet.has(normalizedName);
      if (!matchesCategory) return false;
      if (!query) return true;
      return normalizedName.includes(query) || displayName.includes(query);
    });
  }, [displayedTools, searchTerm, selectedCategory]);
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / TOOLS_PER_PAGE));
  const paginatedTools = useMemo((): string[] => {
    const start = (currentPage - 1) * TOOLS_PER_PAGE;
    return filteredTools.slice(start, start + TOOLS_PER_PAGE);
  }, [currentPage, filteredTools]);
  const count = value.selectedTools.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggle = (name: string) => {
    const isRemoving = value.selectedTools.includes(name);
    const next = isRemoving
      ? value.selectedTools.filter((t) => t !== name)
      : [...value.selectedTools, name];
    let nextSkillLevels = value.toolSkillLevels
      ? { ...value.toolSkillLevels }
      : undefined;
    let nextCustomImages = value.customToolImages;
    let nextCustomFiles = value.customToolFiles;
    if (isRemoving) {
      if (nextSkillLevels?.[name] != null) {
        delete nextSkillLevels[name];
        if (Object.keys(nextSkillLevels).length === 0) nextSkillLevels = undefined;
      }
      if (value.customToolImages?.[name]) {
        URL.revokeObjectURL(value.customToolImages[name]);
        nextCustomImages = { ...value.customToolImages };
        delete nextCustomImages[name];
        if (Object.keys(nextCustomImages).length === 0) nextCustomImages = undefined;
      }
      if (value.customToolFiles?.[name]) {
        nextCustomFiles = { ...value.customToolFiles };
        delete nextCustomFiles[name];
        if (Object.keys(nextCustomFiles).length === 0) nextCustomFiles = undefined;
      }
    } else {
      nextSkillLevels = {
        ...(nextSkillLevels ?? {}),
        [name]: normalizeSkillLevel(value.toolSkillLevels?.[name]),
      };
    }
    onChange({
      selectedTools: next,
      ...(nextSkillLevels && { toolSkillLevels: nextSkillLevels }),
      ...(nextCustomImages && { customToolImages: nextCustomImages }),
      ...(nextCustomFiles && { customToolFiles: nextCustomFiles }),
    });
  };

  const updateSkillLevel = (name: string, skillLevel: number) => {
    onChange({
      ...value,
      toolSkillLevels: {
        ...(value.toolSkillLevels ?? {}),
        [name]: normalizeSkillLevel(skillLevel),
      },
    });
  };

  const handleAddDone = (toolName: string, imageFile: File | null) => {
    if (value.selectedTools.includes(toolName)) return;
    const nextSelected = [...value.selectedTools, toolName];
    const nextSkillLevels = {
      ...(value.toolSkillLevels ?? {}),
      [toolName]: DEFAULT_SKILL_LEVEL,
    };
    const nextCustomImages: Record<string, string> = { ...value.customToolImages };
    const nextCustomFiles: Record<string, File> = { ...value.customToolFiles };
    if (imageFile) {
      nextCustomImages[toolName] = URL.createObjectURL(imageFile);
      nextCustomFiles[toolName] = imageFile;
    }
    onChange({
      selectedTools: nextSelected,
      toolSkillLevels: nextSkillLevels,
      customToolImages: Object.keys(nextCustomImages).length ? nextCustomImages : undefined,
      customToolFiles: Object.keys(nextCustomFiles).length ? nextCustomFiles : undefined,
    });
    setAddToolsOpen(false);
  };

  return (
    <div className="">
      <h2 className="text-lg font-semibold text-zinc-900">Your Tools</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Select tools or technologies you excel in
      </p>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="space-y-1 mb-3 max-w-md">
            <div className="text-sm text-[#092A31]">Category</div>
            <div className="p-2 bg-[#F8FAFC] rounded-lg text-[#092A31]">
              {portfolioData?.category?.title ?? DEFAULT_CATEGORY}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{count} selected</span>
              <AddToolsPopover
                open={addToolsOpen}
                onOpenChange={setAddToolsOpen}
                onDone={handleAddDone}
              >
                <button
                  type="button"
                  className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
                >
                  Add tools
                </button>
              </AddToolsPopover>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tool-search"
                className="text-sm font-medium text-[#092A31]"
              >
                Search tools
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  id="tool-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by tool name"
                  className="border-zinc-200 bg-white"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="Filter tools by category"
                      className={cn(
                        "inline-flex h-9 items-center justify-center rounded-md border border-input bg-transparent px-3 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        selectedCategory !== "all" && "border-primary text-primary",
                      )}
                    >
                      <SlidersHorizontal className="size-4" /> {" "}
                      Filter
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-2">
                    <div className="space-y-1">
                      {TOOL_FILTER_CATEGORIES.map((categoryOption) => {
                        const isActive = selectedCategory === categoryOption;
                        const label =
                          categoryOption === "all"
                            ? "All categories"
                            : categoryOption;
                        return (
                          <button
                            key={categoryOption}
                            type="button"
                            onClick={() => setSelectedCategory(categoryOption)}
                            className={cn(
                              "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-primary text-white"
                                : "text-[#092A31] hover:bg-zinc-100",
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {paginatedTools.map((name) => {
                const selected = value.selectedTools.includes(name);
                const displayName = getDisplayToolName(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggle(name)}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm border transition-colors",
                      "bg-[#E8EFF1] border-[#E8EFF1] text-[#2c4652]",
                      "hover:bg-[#dce4e8] hover:border-[#dce4e8]",
                      selected &&
                      "bg-primary border-primary text-white hover:bg-primary hover:border-primary",
                    )}
                  >
                    <ToolIcon
                      name={name}
                      customImageUrl={value.customToolImages?.[name]}
                      apiImageUrl={toolNameToIcon[name]}
                    />
                    <span>{displayName}</span>
                    {selected ? (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded bg-[#F7D25A]">
                        <Check className="size-3 text-primary" strokeWidth={3} />
                      </span>
                    ) : (
                      <Square className="size-4 shrink-0 rounded-md text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
            </div>

            {filteredTools.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No tools match your search.
              </p>
            ) : (
              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-sm text-zinc-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-[#092A31] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-[#092A31] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {count > 0 ? (
          <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#092A31]">Selected tools</h3>
            <div className="mt-4 space-y-3">
              {value.selectedTools.map((name) => {
                const displayName = getDisplayToolName(name);
                const skillLevel = normalizeSkillLevel(value.toolSkillLevels?.[name]);
                return (
                  <div
                    key={`selected-${name}`}
                    className="py-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ToolIcon
                          name={name}
                          customImageUrl={value.customToolImages?.[name]}
                          apiImageUrl={toolNameToIcon[name]}
                        />
                        <span className="truncate text-sm font-medium text-[#092A31]">
                          {displayName}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-xl bg-[#EEF3F3] px-2.5 py-1 text-xs font-semibold text-[#71858A]">
                        {skillLevel} %
                      </span>
                    </div>
                    <div className="relative mt-3">
                      <div className="h-1 rounded-full bg-[#CFE9D9]" />
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-[#2AA56F]"
                        style={{ width: `${skillLevel}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={skillLevel}
                        onChange={(e) =>
                          updateSkillLevel(name, Number(e.target.value))
                        }
                        aria-label={`Skill level for ${displayName}`}
                        className={cn(
                          "absolute inset-0 h-1 w-full cursor-pointer appearance-none bg-transparent",
                          "[&::-webkit-slider-runnable-track]:h-1",
                          "[&::-webkit-slider-runnable-track]:bg-transparent",
                          "[&::-webkit-slider-thumb]:mt-[-5px]",
                          "[&::-webkit-slider-thumb]:size-3.5",
                          "[&::-webkit-slider-thumb]:appearance-none",
                          "[&::-webkit-slider-thumb]:rounded-full",
                          "[&::-webkit-slider-thumb]:border-0",
                          "[&::-webkit-slider-thumb]:bg-[#2AA56F]",
                          "[&::-moz-range-track]:h-1",
                          "[&::-moz-range-track]:bg-transparent",
                          "[&::-moz-range-thumb]:size-3.5",
                          "[&::-moz-range-thumb]:rounded-full",
                          "[&::-moz-range-thumb]:border-0",
                          "[&::-moz-range-thumb]:bg-[#2AA56F]",
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
