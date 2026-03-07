"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Square } from "lucide-react";
import { AddToolsPopover } from "./add-tools-popover";
import { cn } from "@/lib/utils";

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

function ToolIcon({
  name,
  customImageUrl,
}: {
  name: string;
  customImageUrl?: string | null;
}) {
  const src = customImageUrl ?? TOOL_IMAGES[name];
  if (src) {
    const isCustom = !!customImageUrl;
    return (
      <span
        className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
        aria-hidden
      >
        {isCustom ? (
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
};

type YourToolsProps = {
  value: YourToolsData;
  onChange: (data: YourToolsData) => void;
};

export function YourTools({ value, onChange }: YourToolsProps) {
  const [addToolsOpen, setAddToolsOpen] = useState(false);
  const displayedTools = useMemo(() => {
    const base = [...TOOLS];
    const custom = value.selectedTools.filter((t) => !base.includes(t));
    return [...base, ...custom];
  }, [value.selectedTools]);
  const count = value.selectedTools.length;

  const toggle = (name: string) => {
    const isRemoving = value.selectedTools.includes(name);
    const next = isRemoving
      ? value.selectedTools.filter((t) => t !== name)
      : [...value.selectedTools, name];
    let nextCustom = value.customToolImages;
    if (isRemoving && value.customToolImages?.[name]) {
      URL.revokeObjectURL(value.customToolImages[name]);
      nextCustom = { ...value.customToolImages };
      delete nextCustom[name];
      if (Object.keys(nextCustom).length === 0) nextCustom = undefined;
    }
    onChange({
      selectedTools: next,
      ...(nextCustom && { customToolImages: nextCustom }),
    });
  };

  const handleAddDone = (toolName: string, imageFile: File | null) => {
    if (value.selectedTools.includes(toolName)) return;
    const nextSelected = [...value.selectedTools, toolName];
    const nextCustom: Record<string, string> = { ...value.customToolImages };
    if (imageFile) {
      nextCustom[toolName] = URL.createObjectURL(imageFile);
    }
    onChange({
      selectedTools: nextSelected,
      customToolImages: Object.keys(nextCustom).length ? nextCustom : undefined,
    });
    setAddToolsOpen(false);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">Your Tools</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Select tools or technologies you excel in
      </p>
      <div className="space-y-1 mb-3">
        <div className="text-sm text-[#092A31]">Category</div>
        <div className="p-2 bg-[#F8FAFC] rounded-lg text-[#092A31]">
          {DEFAULT_CATEGORY}
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
