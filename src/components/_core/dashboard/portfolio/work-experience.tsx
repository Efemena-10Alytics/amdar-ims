"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoToastBanner } from "@/components/ui/info-toast-banner";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";
import { cn } from "@/lib/utils";
import { FillCalendaSvg } from "../../landing-pages/internship-program/svg";
import { portfolioInputStyle } from "./portfolio-styles";

function formatDateDisplay(ymd: string): string {
    if (!ymd) return "";
    const d = new Date(ymd + "T12:00:00");
    if (Number.isNaN(d.getTime())) return ymd;
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDateToLocalYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

type DatePickerFieldProps = {
    value: string;
    onChange: (ymd: string) => void;
    placeholder?: string;
    id?: string;
};

function DatePickerField({
    value,
    onChange,
    placeholder = "Select date",
    id,
}: DatePickerFieldProps) {
    const [open, setOpen] = useState(false);
    const display = value ? formatDateDisplay(value) : placeholder;
    const date = value ? new Date(value + "T12:00:00") : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    id={id}
                    className={cn(
                        portfolioInputStyle,
                        "relative w-full flex items-center justify-between text-left",
                        !value && "text-[#94A3B8]",
                    )}
                >
                    <span>{display}</span>
                    <FillCalendaSvg
                        aria-hidden
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    defaultMonth={date}
                    selected={date}
                    onSelect={(d) => {
                        if (d) {
                            onChange(formatDateToLocalYmd(d));
                            setOpen(false);
                        }
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export type WorkExperienceEntry = {
    id: string;
    companyName: string;
    jobTitle: string;
    industry: string;
    jobDescription: string[];
    startDate: string;
    endDate: string;
    currentlyWorkHere: boolean;
};

export type WorkExperienceData = {
    entries: WorkExperienceEntry[];
};

/** API payload item (camelCase). endDate is null when currentlyWorkThere is true. */
export type WorkExperiencePayloadItem = {
    companyName: string;
    jobTitle: string;
    industry: string;
    jobDescription: string[];
    startDate: string;
    endDate: string | null;
    currentlyWorkThere: boolean;
};

export type WorkExperiencePayload = {
    workExperience: WorkExperiencePayloadItem[];
};

/** Normalize date to YYYY-MM for API (accepts YYYY-MM or YYYY-MM-DD). */
function toYearMonth(date: string): string {
    if (!date) return "";
    return date.length >= 7 ? date.slice(0, 7) : date;
}

function normalizeJobDescription(lines: string[]): string[] {
    return lines.map((line) => line.trim()).filter(Boolean);
}

function textToJobDescription(value: string): string[] {
    return normalizeJobDescription(value.split(/\r?\n/));
}

/** Convert form data to API payload format (camelCase). */
export function workExperienceToPayload(
    data: WorkExperienceData,
): WorkExperiencePayload {
    const workExperience: WorkExperiencePayloadItem[] = data.entries
        .filter(
            (e) =>
                e.companyName.trim() ||
                e.jobTitle.trim() ||
                e.industry.trim() ||
                e.jobDescription.some((line) => line.trim()) ||
                e.startDate ||
                e.endDate,
        )
        .map((entry) => ({
            companyName: entry.companyName.trim(),
            jobTitle: entry.jobTitle.trim(),
            industry: entry.industry.trim(),
            jobDescription: normalizeJobDescription(entry.jobDescription),
            startDate: toYearMonth(entry.startDate),
            endDate: entry.currentlyWorkHere ? null : toYearMonth(entry.endDate),
            currentlyWorkThere: entry.currentlyWorkHere,
        }));
    return { workExperience };
}

/** Parse API work experience into form data (e.g. for prefilling). */
export function payloadToWorkExperience(payload: {
    workExperience?: Array<{
        companyName?: string | null;
        jobTitle?: string | null;
        industry?: string | null;
        jobDescription?: string[] | string | null;
        startDate?: string | null;
        endDate?: string | null;
        currentlyWorkThere?: boolean;
    }>;
}): WorkExperienceData {
    const raw = payload.workExperience ?? [];
    const entries = raw.map((e) => ({
        id: crypto.randomUUID(),
        companyName: e.companyName ?? "",
        jobTitle: e.jobTitle ?? "",
        industry: e.industry ?? "",
        jobDescription: Array.isArray(e.jobDescription)
            ? normalizeJobDescription(e.jobDescription)
            : textToJobDescription(e.jobDescription ?? ""),
        startDate: e.startDate ?? "",
        endDate: e.endDate ?? "",
        currentlyWorkHere: !!e.currentlyWorkThere,
    }));
    return {
        entries: entries.length > 0 ? entries : [createWorkExperienceEntry()],
    };
}

function createWorkExperienceEntry(
    overrides?: Partial<Omit<WorkExperienceEntry, "id">>,
): WorkExperienceEntry {
    return {
        id: crypto.randomUUID(),
        companyName: "",
        jobTitle: "",
        industry: "",
        jobDescription: [],
        startDate: "",
        endDate: "",
        currentlyWorkHere: false,
        ...overrides,
    };
}

export const initialWorkExperienceData: WorkExperienceData = {
    entries: [createWorkExperienceEntry()],
};

/** Fresh initial state for useState (avoids shared reference). */
export function getInitialWorkExperienceData(): WorkExperienceData {
    return { entries: [createWorkExperienceEntry()] };
}

type WorkExperienceProps = {
    value: WorkExperienceData;
    onChange: (data: WorkExperienceData) => void;
    onReordered?: () => void;
};

export function WorkExperience({ value, onChange, onReordered }: WorkExperienceProps) {
    const { data: portfolioData } = useGetPortfolio();
    const [warningToast, setWarningToast] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showWarningToast = (message: string) => {
        setWarningToast(message);
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
        }
        warningTimerRef.current = setTimeout(() => {
            setWarningToast(null);
            warningTimerRef.current = null;
        }, 3500);
    };

    useEffect(() => {
        return () => {
            if (warningTimerRef.current) {
                clearTimeout(warningTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!portfolioData?.workExperience?.length) return;
        const isEmpty = value.entries.every(
            (e) =>
                !e.companyName.trim() &&
                !e.jobTitle.trim() &&
                !e.industry.trim() &&
                e.jobDescription.length === 0 &&
                !e.startDate &&
                !e.endDate
        );
        if (!isEmpty) return;
        const prefill = payloadToWorkExperience(portfolioData);
        const hasData = prefill.entries.some(
            (e) =>
                e.companyName.trim() ||
                e.jobTitle.trim() ||
                e.industry.trim() ||
                e.jobDescription.length > 0 ||
                e.startDate ||
                e.endDate
        );
        if (!hasData) return;
        onChange(prefill);
    }, [portfolioData]);

    const updateEntry = (index: number, updates: Partial<WorkExperienceEntry>) => {
        const next = value.entries.map((entry, i) =>
            i === index ? { ...entry, ...updates } : entry
        );
        onChange({ entries: next });
    };

    const addJobDescription = (index: number) => {
        const nextEntries = value.entries.map((entry, i) =>
            i === index
                ? {
                    ...entry,
                    jobDescription: [...entry.jobDescription, ""],
                }
                : entry,
        );
        onChange({ entries: nextEntries });
    };

    const updateJobDescription = (
        index: number,
        descriptionIndex: number,
        nextValue: string,
    ) => {
        const nextEntries = value.entries.map((entry, i) =>
            i === index
                ? {
                    ...entry,
            jobDescription:
              entry.jobDescription.length === 0
                ? [nextValue]
                : entry.jobDescription.map((description, itemIndex) =>
                    itemIndex === descriptionIndex ? nextValue : description,
                  ),
                }
                : entry,
        );
        onChange({ entries: nextEntries });
    };

    const removeJobDescription = (index: number, descriptionIndex: number) => {
        const nextEntries = value.entries.map((entry, i) =>
            i === index
                ? {
                    ...entry,
                    jobDescription: entry.jobDescription.filter(
                        (_, itemIndex) => itemIndex !== descriptionIndex,
                    ),
                }
                : entry,
        );
        onChange({ entries: nextEntries });
    };

    const addMore = () => {
        onChange({ entries: [...value.entries, createWorkExperienceEntry()] });
    };

    const removeEntry = (index: number) => {
        if (value.entries.length <= 1) return;
        onChange({
            entries: value.entries.filter((_, i) => i !== index),
        });
    };

    const reorderEntries = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const nextEntries = [...value.entries];
        const [movedEntry] = nextEntries.splice(fromIndex, 1);
        nextEntries.splice(toIndex, 0, movedEntry);
        onChange({ entries: nextEntries });
        onReordered?.();
    };

    const canReorder = value.entries.length > 1;

    return (
        <div className="max-w-md">
            <h2 className="text-lg font-semibold text-zinc-900">Work Experience</h2>
            <p className="mt-1 text-sm text-zinc-500 mb-6">
                Let&apos;s know some of your work experience.
                {canReorder ? " Drag to reorder entries." : ""}
            </p>

            <div className="space-y-6">
                {value.entries.map((entry, index) => (
                    <div
                        key={entry.id}
                        className={cn(
                            "relative rounded-xl bg-white p-5 shadow-sm transition-[box-shadow,opacity]",
                            draggedIndex === index && "opacity-50",
                            dragOverIndex === index &&
                                draggedIndex !== null &&
                                draggedIndex !== index &&
                                "ring-2 ring-[#3B82F6]/40",
                        )}
                        onDragOver={(event) => {
                            if (!canReorder || draggedIndex === null) return;
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            if (draggedIndex !== index) {
                                setDragOverIndex(index);
                            }
                        }}
                        onDragLeave={() => {
                            if (dragOverIndex === index) {
                                setDragOverIndex(null);
                            }
                        }}
                        onDrop={(event) => {
                            event.preventDefault();
                            const fromIndex =
                                draggedIndex ??
                                Number.parseInt(
                                    event.dataTransfer.getData("text/plain"),
                                    10,
                                );
                            if (!Number.isNaN(fromIndex)) {
                                reorderEntries(fromIndex, index);
                            }
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                        }}
                    >
                        {value.entries.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEntry(index)}
                                className="absolute top-4 right-4 rounded-md p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                                aria-label="Remove work experience entry"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        )}
                        <div className="flex items-start gap-3">
                            {canReorder ? (
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(event) => {
                                        setDraggedIndex(index);
                                        event.dataTransfer.effectAllowed = "move";
                                        event.dataTransfer.setData(
                                            "text/plain",
                                            String(index),
                                        );
                                    }}
                                    onDragEnd={() => {
                                        setDraggedIndex(null);
                                        setDragOverIndex(null);
                                    }}
                                    className="mt-1 shrink-0 cursor-grab touch-none rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:cursor-grabbing"
                                    aria-label={`Reorder work experience ${index + 1}`}
                                >
                                    <GripVertical className="size-5" aria-hidden />
                                </button>
                            ) : null}
                            <div className="flex min-w-0 flex-1 flex-col gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor={`company-${index}`}
                                        className="text-sm font-medium text-zinc-900 block"
                                    >
                                        Company name
                                    </label>
                                    <Input
                                        id={`company-${index}`}
                                        value={entry.companyName}
                                        onChange={(e) =>
                                            updateEntry(index, { companyName: e.target.value })
                                        }
                                        placeholder="e.g. Amdari"
                                        className={portfolioInputStyle}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor={`job-title-${index}`}
                                        className="text-sm font-medium text-zinc-900 block"
                                    >
                                        Job title
                                    </label>
                                    <Input
                                        id={`job-title-${index}`}
                                        value={entry.jobTitle}
                                        onChange={(e) =>
                                            updateEntry(index, { jobTitle: e.target.value })
                                        }
                                        placeholder="e.g. Product designer"
                                        className={portfolioInputStyle}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor={`industry-${index}`}
                                        className="text-sm font-medium text-zinc-900 block"
                                    >
                                        Industry
                                    </label>
                                    <Input
                                        id={`industry-${index}`}
                                        value={entry.industry}
                                        onChange={(e) =>
                                            updateEntry(index, { industry: e.target.value })
                                        }
                                        placeholder="e.g. Education"
                                        className={portfolioInputStyle}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor={`job-desc-${index}`}
                                    className="text-sm font-medium text-zinc-900 block"
                                >
                                    Job description
                                </label>
                                <div className="space-y-2">
                                    {(entry.jobDescription.length > 0
                                        ? entry.jobDescription
                                        : [""]).map((description, descriptionIndex) => (
                                            <div key={`${index}-${descriptionIndex}`} className="flex gap-2">
                                                <Input
                                                    id={
                                                        descriptionIndex === 0
                                                            ? `job-desc-${index}`
                                                            : undefined
                                                    }
                                                    value={description}
                                                    onChange={(e) =>
                                                        updateJobDescription(
                                                            index,
                                                            descriptionIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Created wireframes"
                                                    className={portfolioInputStyle}
                                                />
                                                {entry.jobDescription.length > 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeJobDescription(
                                                                index,
                                                                descriptionIndex,
                                                            )
                                                        }
                                                        className="shrink-0 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                                                        aria-label="Remove job description"
                                                    >
                                                        <Trash2 className="size-4" aria-hidden />
                                                    </button>
                                                ) : null}
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        onClick={() => addJobDescription(index)}
                                        className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
                                    >
                                        Add description
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-medium text-zinc-900 block">
                                    Duration of work
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <DatePickerField
                                            value={entry.startDate}
                                            onChange={(startDate) =>
                                                updateEntry(index, { startDate })
                                            }
                                            placeholder="Select start date"
                                            id={`start-date-${index}`}
                                        />
                                    </div>
                                    <div className="relative">
                                        {entry.currentlyWorkHere ? (
                                            <div
                                                className={cn(
                                                    portfolioInputStyle,
                                                    "relative pr-10 bg-zinc-50 text-zinc-600 flex items-center",
                                                )}
                                            >
                                                <span>Present</span>
                                                <CalendarIcon
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none"
                                                    aria-hidden
                                                />
                                            </div>
                                        ) : (
                                            <DatePickerField
                                                value={entry.endDate}
                                                onChange={(endDate) =>
                                                    updateEntry(index, { endDate })
                                                }
                                                placeholder="Select end date"
                                                id={`end-date-${index}`}
                                            />
                                        )}
                                    </div>
                                </div>
                                <label className="flex items-center justify-end gap-2 cursor-pointer mt-2">
                                    <Checkbox
                                        checked={entry.currentlyWorkHere}
                                        onCheckedChange={(checked) => {
                                            const isChecking = !!checked;
                                            const currentSelectedCount = value.entries.filter(
                                                (item) => item.currentlyWorkHere,
                                            ).length;
                                            const isAlreadyChecked = entry.currentlyWorkHere;

                                            if (
                                                isChecking &&
                                                !isAlreadyChecked &&
                                                currentSelectedCount >= 1
                                            ) {
                                                showWarningToast(
                                                    "it\u2019s advice to have one work place as current work place",
                                                );
                                            }

                                            updateEntry(index, {
                                                currentlyWorkHere: !!checked,
                                                ...(!!checked && { endDate: "" }),
                                            });
                                        }}
                                    />
                                    <span className="text-sm text-zinc-600">
                                        I currently work here
                                    </span>
                                </label>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addMore}
                    className="text-sm text-[#3B82F6] hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 rounded"
                >
                    Add more
                </button>
            </div>
            {warningToast ? (
                <InfoToastBanner
                    message={warningToast}
                    onDismiss={() => {
                        if (warningTimerRef.current) {
                            clearTimeout(warningTimerRef.current);
                            warningTimerRef.current = null;
                        }
                        setWarningToast(null);
                    }}
                />
            ) : null}
        </div>
    );
}
