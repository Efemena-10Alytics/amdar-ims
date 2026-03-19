"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, Square } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { AddMorePopover } from "./add-more-popover";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { cn } from "@/lib/utils";
import { portfolioInputStyle } from "./portfolio-styles";

const CATEGORIES = [
    "Data Analytics",
    "Data Engineering",
    "Data Science",
    "Ethical Hacking",
    "Product Design",
    "Project management",
] as const;

const SPECIALIZATIONS_BY_CATEGORY: Record<string, string[]> = {
    "Data Analytics": [
        "Business intelligence",
        "Reporting",
        "Statistical analysis",
        "Dashboard design",
    ],
    "Data Engineering": [
        "ETL",
        "Data pipelines",
        "Data warehousing",
        "Big data",
    ],
    "Data Science": [
        "Machine learning",
        "Analytics",
        "Data engineering",
        "Visualization",
    ],
    "Ethical Hacking": [
        "Penetration testing",
        "Security auditing",
        "Vulnerability assessment",
    ],
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
    "Project management": [
        "Agile",
        "Scrum",
        "Stakeholder management",
        "Resource planning",
    ],
};

export type YourSpecializationData = {
    category: string;
    selectedSpecializations: string[];
};

export type CategoryPayload = {
    category: {
        title: string | null;
        specializationData: string[];
    };
};

/** Convert form data to API payload format (camelCase). Only title and specializationData. */
export function categoryToPayload(data: YourSpecializationData): CategoryPayload {
    return {
        category: {
            title: data.category.trim() || null,
            specializationData: data.selectedSpecializations,
        },
    };
}

/** Parse API category into form data (e.g. for prefilling). */
export function payloadToCategory(payload: {
    category?: {
        title?: string | null;
        specializationData?: unknown[];
    };
}): YourSpecializationData {
    const c = payload.category;
    const raw = c?.specializationData ?? [];
    const selectedSpecializations = Array.isArray(raw)
        ? raw.map((s) => (typeof s === "string" ? s : String((s as { title?: string })?.title ?? s)))
        : [];
    return {
        category: c?.title ?? "",
        selectedSpecializations,
    };
}

type YourSpecializationProps = {
    value: YourSpecializationData;
    onChange: (data: YourSpecializationData) => void;
};

export function YourSpecialization({ value, onChange }: YourSpecializationProps) {
    const { data: portfolioData } = useGetPortfolio();
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [addMoreOpen, setAddMoreOpen] = useState(false);
    const [addTitle, setAddTitle] = useState("");

    useEffect(() => {
        if (!portfolioData?.category) return;
        const isEmpty = !value.category && value.selectedSpecializations.length === 0;
        if (!isEmpty) return;
        const prefill = payloadToCategory(portfolioData);
        if (!prefill.category && prefill.selectedSpecializations.length === 0)
            return;
        onChange({ ...value, ...prefill });
    }, [portfolioData]);

    const displayedSpecializations = useMemo(() => {
        const base = SPECIALIZATIONS_BY_CATEGORY[value.category] ?? [];
        const custom = value.selectedSpecializations.filter(
            (s) => !base.includes(s),
        );
        return [...base, ...custom];
    }, [value.category, value.selectedSpecializations]);
    const count = value.selectedSpecializations.length;

    const filteredCategories = useMemo(() => {
        const q = categorySearch.trim().toLowerCase();
        if (!q) return [...CATEGORIES];
        return CATEGORIES.filter((c) => c.toLowerCase().includes(q));
    }, [categorySearch]);

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
        setCategoryOpen(false);
        setCategorySearch("");
    };

    const handleAddDone = () => {
        const title = addTitle.trim();
        if (!title) return;
        if (value.selectedSpecializations.includes(title)) {
            setAddMoreOpen(false);
            return;
        }
        onChange({
            ...value,
            selectedSpecializations: [...value.selectedSpecializations, title],
        });
        setAddTitle("");
        setAddMoreOpen(false);
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
                    <Popover open={categoryOpen} onOpenChange={(open) => {
                        setCategoryOpen(open);
                        if (!open) setCategorySearch("");
                    }}>
                        <PopoverTrigger asChild>
                            <button
                                id="specialization-category"
                                type="button"
                                className={cn(
                                    portfolioInputStyle,
                                    "flex w-full items-center justify-between text-left",
                                )}
                            >
                                <span className={value.category ? "text-[#092A31]" : "text-[#94A3B8]"}>
                                    {value.category || "Select category"}
                                </span>
                                <ChevronDown className="size-4 shrink-0 text-zinc-500" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            className="w-(--radix-popover-trigger-width) rounded-lg border border-zinc-200 bg-white p-0 shadow-md"
                        >
                            <div className="p-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        placeholder="Search"
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="h-9 rounded-md bg-[#F8FAFC] border-0 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-[#156374]"
                                    />
                                </div>
                            </div>
                            <ul className="max-h-60 overflow-auto border-t border-zinc-100 py-1">
                                {filteredCategories.length === 0 ? (
                                    <li className="px-3 py-2 text-sm text-zinc-500">No results</li>
                                ) : (
                                    filteredCategories.map((c) => (
                                        <li key={c}>
                                            <button
                                                type="button"
                                                onClick={() => handleCategoryChange(c)}
                                                className={cn(
                                                    "w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100",
                                                    value.category === c && "bg-primary/5 text-primary font-medium",
                                                )}
                                            >
                                                {c}
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                        {count} selected
                    </span>
                    <AddMorePopover
                        open={addMoreOpen}
                        onOpenChange={(open) => {
                            setAddMoreOpen(open);
                            if (!open) setAddTitle("");
                        }}
                        title="Add specialization"
                        inputLabel="Specialization title"
                        inputId="add-specialization-title"
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
                    {displayedSpecializations.map((name) => {
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
