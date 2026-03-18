"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Square } from "lucide-react";
import { AddMorePopover } from "./add-more-popover";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { cn } from "@/lib/utils";

const SKILLS = [
  "Prototyping",
  "Interface design",
  "User research",
  "Qualitative research",
  "Quantitative research",
  "Brain storming",
  "Wireframing",
  "Presentations",
  "Slides",
  "Animation",
  "Mood board",
  "Business intelligence",
  "Reporting",
  "Statistical analysis",
  "Dashboard design",
];

export type YourSkillsData = {
  selectedSkills: string[];
};

export type CategorySkillsPayload = {
  category: {
    skills: string[];
  };
};

/** Convert form data to API payload format (camelCase). Only skills. */
export function skillsToPayload(data: YourSkillsData): CategorySkillsPayload {
  return {
    category: {
      skills: data.selectedSkills,
    },
  };
}

/** Parse API category.skills into form data (e.g. for prefilling). */
export function payloadToSkills(payload: {
  category?: {
    skills?: unknown[];
  };
}): YourSkillsData {
  const raw = payload.category?.skills ?? [];
  const selectedSkills = Array.isArray(raw)
    ? raw.map((s) =>
        typeof s === "string"
          ? s
          : String(
              (s as { title?: string; name?: string })?.title ??
                (s as { name?: string })?.name ??
                s,
            ),
      )
    : [];
  return { selectedSkills };
}

type YourSkillsProps = {
  value: YourSkillsData;
  onChange: (data: YourSkillsData) => void;
};

export function YourSkills({ value, onChange }: YourSkillsProps) {
  const { data: portfolioData } = useGetPortfolio();
  const [addMoreOpen, setAddMoreOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");

  useEffect(() => {
    if (!portfolioData?.category) return;
    const isEmpty = value.selectedSkills.length === 0;
    if (!isEmpty) return;
    const prefill = payloadToSkills(portfolioData);
    if (prefill.selectedSkills.length === 0) return;
    onChange(prefill);
  }, [portfolioData]);

  const displayedSkills = useMemo(() => {
    const base = [...SKILLS];
    const custom = value.selectedSkills.filter((s) => !base.includes(s));
    return [...base, ...custom];
  }, [value.selectedSkills]);
  const count = value.selectedSkills.length;

  const toggle = (name: string) => {
    const next = value.selectedSkills.includes(name)
      ? value.selectedSkills.filter((s) => s !== name)
      : [...value.selectedSkills, name];
    onChange({ selectedSkills: next });
  };

  const handleAddDone = () => {
    const title = addTitle.trim();
    if (!title) return;
    if (value.selectedSkills.includes(title)) {
      setAddMoreOpen(false);
      return;
    }
    onChange({
      selectedSkills: [...value.selectedSkills, title],
    });
    setAddTitle("");
    setAddMoreOpen(false);
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">Your Skills</h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Select skills you excel in
      </p>
      <div className="space-y-1 mb-3">
        <div className="text-sm text-[#092A31]">Category</div>
        <div className="p-2 bg-[#F8FAFC] rounded-lg text-[#092A31]">
          {portfolioData?.category?.title ?? " Product design"}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">{count} selected</span>
          <AddMorePopover
            open={addMoreOpen}
            onOpenChange={(open) => {
              setAddMoreOpen(open);
              if (!open) setAddTitle("");
            }}
            title="Add skill"
            inputLabel="Skill title"
            inputId="add-skill-title"
            value={addTitle}
            onChange={setAddTitle}
            onDone={handleAddDone}
          >
            <button
              type="button"
              className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
            >
              Add more
            </button>
          </AddMorePopover>
        </div>

        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((name) => {
            const selected = value.selectedSkills.includes(name);
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
