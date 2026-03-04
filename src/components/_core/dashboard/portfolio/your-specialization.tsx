"use client";

import { Check, Square } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { portfolioInputStyle } from "./portfolio-styles";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    "Product Design",
    "Engineering",
    "Marketing",
    "Data Science",
    "Writing",
    "Other",
] as const;

const SPECIALIZATIONS_BY_CATEGORY: Record<string, string[]> = {
    "Product Design": [
        "Graphics design",
        "Product design",
        "Brand design",
        "Fliers",
        "Architecture",
        "Foundation design",
        "UI/UX design",
        "Interaction design",
        "Design systems",
    ],
    Engineering: [
        "Frontend",
        "Backend",
        "Full stack",
        "DevOps",
        "Mobile",
        "Cloud",
    ],
    Marketing: [
        "Digital marketing",
        "Content marketing",
        "SEO",
        "Social media",
        "Growth",
    ],
    "Data Science": [
        "Machine learning",
        "Analytics",
        "Data engineering",
        "Visualization",
    ],
    Writing: ["Technical writing", "Copywriting", "Content strategy"],
    Other: ["Other"],
};

export type YourSpecializationData = {
    category: string;
    selectedSpecializations: string[];
};

type YourSpecializationProps = {
    value: YourSpecializationData;
    onChange: (data: YourSpecializationData) => void;
};

export function YourSpecialization({ value, onChange }: YourSpecializationProps) {
    const specializations =
        SPECIALIZATIONS_BY_CATEGORY[value.category] ??
        SPECIALIZATIONS_BY_CATEGORY.Other;
    const count = value.selectedSpecializations.length;

    const toggle = (name: string) => {
        const next = value.selectedSpecializations.includes(name)
            ? value.selectedSpecializations.filter((s) => s !== name)
            : [...value.selectedSpecializations, name];
        onChange({ ...value, selectedSpecializations: next });
    };

    const handleCategoryChange = (category: string) => {
        onChange({
            category,
            selectedSpecializations: [],
        });
    };

    return (
        <div className="max-w-md">
            <h2 className="text-lg font-semibold text-zinc-900">
                Your Specialization
            </h2>
            <p className="mt-1 text-sm text-zinc-500 mb-6">
                Select your area of job category & specialization
            </p>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="specialization-category"
                        className="text-sm font-medium text-zinc-900 block"
                    >
                        Category
                    </label>
                    <Select
                        value={value.category || undefined}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger
                            id="specialization-category"
                            className={portfolioInputStyle}
                        >
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                        {count} selected
                    </span>
                    <button
                        type="button"
                        className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
                    >
                        Add more
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {specializations.map((name) => {
                        const selected = value.selectedSpecializations.includes(name);
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
                                    <Square className="size-4 shrink-0 rounded border border-current text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
