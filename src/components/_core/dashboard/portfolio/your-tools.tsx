"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Check, Square } from "lucide-react";
import { AddToolsPopover } from "./add-tools-popover";
import { cn } from "@/lib/utils";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { useGetTools } from "@/features/portfolio/use-get-tools";

const DEFAULT_CATEGORY = "Product Design";

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
  }>;
}): YourToolsData {
  const raw = payload.tools ?? [];
  return {
    selectedTools: raw.map((t) => t.name ?? "").filter(Boolean),
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
  const count = value.selectedTools.length;

  const toggle = (name: string) => {
    const isRemoving = value.selectedTools.includes(name);
    const next = isRemoving
      ? value.selectedTools.filter((t) => t !== name)
      : [...value.selectedTools, name];
    let nextCustomImages = value.customToolImages;
    let nextCustomFiles = value.customToolFiles;
    if (isRemoving) {
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
    }
    onChange({
      selectedTools: next,
      ...(nextCustomImages && { customToolImages: nextCustomImages }),
      ...(nextCustomFiles && { customToolFiles: nextCustomFiles }),
    });
  };

  const handleAddDone = (toolName: string, imageFile: File | null) => {
    if (value.selectedTools.includes(toolName)) return;
    const nextSelected = [...value.selectedTools, toolName];
    const nextCustomImages: Record<string, string> = { ...value.customToolImages };
    const nextCustomFiles: Record<string, File> = { ...value.customToolFiles };
    if (imageFile) {
      nextCustomImages[toolName] = URL.createObjectURL(imageFile);
      nextCustomFiles[toolName] = imageFile;
    }
    onChange({
      selectedTools: nextSelected,
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

        <div className="flex flex-wrap gap-2">
          {displayedTools.map((name) => {
            const selected = value.selectedTools.includes(name);
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
                <span>{name}</span>
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
      </div>
    </div>
  );
}
