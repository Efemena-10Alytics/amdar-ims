"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { portfolioInputStyle } from "./portfolio-styles";

export type EducationEntry = {
  schoolName: string;
  qualification: string;
};

export type EducationBackgroundData = {
  entries: EducationEntry[];
};

const defaultEntry: EducationEntry = {
  schoolName: "",
  qualification: "",
};

type EducationBackgroundProps = {
  value: EducationBackgroundData;
  onChange: (data: EducationBackgroundData) => void;
};

export function EducationBackground({
  value,
  onChange,
}: EducationBackgroundProps) {
  const updateEntry = (index: number, updates: Partial<EducationEntry>) => {
    const next = value.entries.map((entry, i) =>
      i === index ? { ...entry, ...updates } : entry
    );
    onChange({ entries: next });
  };

  const addMore = () => {
    onChange({ entries: [...value.entries, { ...defaultEntry }] });
  };

  const removeEntry = (index: number) => {
    if (value.entries.length <= 1) return;
    onChange({
      entries: value.entries.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">
        Education Background
      </h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Add your education background to wrap up.
      </p>

      <div className="space-y-6">
        {value.entries.map((entry, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-white p-6 shadow-sm"
          >
            {value.entries.length > 1 && index >= 1 && (
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="absolute top-4 right-4 p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                aria-label="Remove education entry"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor={`school-${index}`}
                  className="text-sm font-medium text-zinc-900 block"
                >
                  School name
                </label>
                <Input
                  id={`school-${index}`}
                  value={entry.schoolName}
                  onChange={(e) =>
                    updateEntry(index, { schoolName: e.target.value })
                  }
                  placeholder="e.g. Salzburg University"
                  className={portfolioInputStyle}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor={`qualification-${index}`}
                  className="text-sm font-medium text-zinc-900 block"
                >
                  Qualification
                </label>
                <Input
                  id={`qualification-${index}`}
                  value={entry.qualification}
                  onChange={(e) =>
                    updateEntry(index, { qualification: e.target.value })
                  }
                  placeholder="e.g. Masters"
                  className={portfolioInputStyle}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addMore}
            className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
          >
            Add more
          </button>
        </div>
      </div>
    </div>
  );
}
