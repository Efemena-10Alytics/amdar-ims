"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
                            onChange(d.toISOString().slice(0, 10));
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
    companyName: string;
    jobTitle: string;
    industry: string;
    jobDescription: string;
    startDate: string;
    endDate: string;
    currentlyWorkHere: boolean;
};

export type WorkExperienceData = {
    entries: WorkExperienceEntry[];
};

/** API payload item (snake_case). Omit end_date when currently_work_there is true. */
export type WorkExperiencePayloadItem = {
    company_name: string;
    job_title: string;
    industry: string;
    job_description: string;
    start_date: string;
    end_date?: string;
    currently_work_there: boolean;
};

export type WorkExperiencePayload = {
    work_experience: WorkExperiencePayloadItem[];
};

/** Normalize date to YYYY-MM for API (accepts YYYY-MM or YYYY-MM-DD). */
function toYearMonth(date: string): string {
    if (!date) return "";
    return date.length >= 7 ? date.slice(0, 7) : date;
}

/** Convert form data to API payload format. */
export function workExperienceToPayload(
    data: WorkExperienceData,
): WorkExperiencePayload {
    const work_experience: WorkExperiencePayloadItem[] = data.entries
        .filter(
            (e) =>
                e.companyName.trim() ||
                e.jobTitle.trim() ||
                e.industry.trim() ||
                e.jobDescription.trim() ||
                e.startDate ||
                e.endDate,
        )
        .map((entry) => {
            const item: WorkExperiencePayloadItem = {
                company_name: entry.companyName.trim(),
                job_title: entry.jobTitle.trim(),
                industry: entry.industry.trim(),
                job_description: entry.jobDescription.trim(),
                start_date: toYearMonth(entry.startDate),
                currently_work_there: entry.currentlyWorkHere,
            };
            if (!entry.currentlyWorkHere && entry.endDate) {
                item.end_date = toYearMonth(entry.endDate);
            }
            return item;
        });
    return { work_experience };
}

/** Parse API work_experience into form data (e.g. for prefilling). */
export function payloadToWorkExperience(payload: {
    work_experience?: Array<{
        company_name?: string;
        job_title?: string;
        industry?: string;
        job_description?: string;
        start_date?: string;
        end_date?: string;
        currently_work_there?: boolean;
    }>;
}): WorkExperienceData {
    const entries = (payload.work_experience ?? []).map((e) => ({
        companyName: e.company_name ?? "",
        jobTitle: e.job_title ?? "",
        industry: e.industry ?? "",
        jobDescription: e.job_description ?? "",
        startDate: e.start_date ?? "",
        endDate: e.end_date ?? "",
        currentlyWorkHere: !!e.currently_work_there,
    }));
    return {
        entries: entries.length > 0 ? entries : [{ ...defaultEntry }],
    };
}

const defaultEntry: WorkExperienceEntry = {
    companyName: "",
    jobTitle: "",
    industry: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    currentlyWorkHere: false,
};

export const initialWorkExperienceData: WorkExperienceData = {
    entries: [{ ...defaultEntry }],
};

/** Fresh initial state for useState (avoids shared reference). */
export function getInitialWorkExperienceData(): WorkExperienceData {
    return { entries: [{ ...defaultEntry }] };
}

type WorkExperienceProps = {
    value: WorkExperienceData;
    onChange: (data: WorkExperienceData) => void;
    onSave?: (data: WorkExperienceData) => void | Promise<void>;
    isSaving?: boolean;
    saveError?: string;
};

export function WorkExperience({
    value,
    onChange,
    onSave,
    isSaving = false,
    saveError,
}: WorkExperienceProps) {
    const updateEntry = (index: number, updates: Partial<WorkExperienceEntry>) => {
        const next = value.entries.map((entry, i) =>
            i === index ? { ...entry, ...updates } : entry
        );
        onChange({ entries: next });
    };

    const addMore = () => {
        onChange({ entries: [...value.entries, { ...defaultEntry }] });
    };

    return (
        <div className="max-w-md">
            <h2 className="text-lg font-semibold text-zinc-900">Work Experience</h2>
            <p className="mt-1 text-sm text-zinc-500 mb-6">
                Let&apos;s know some of your work experience.
            </p>

            <div className="space-y-6">
                {value.entries.map((entry, index) => (
                    <div
                        key={index}
                        className="rounded-xl bg-white p-5 shadow-sm"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2 min-w-0">
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
                                {/* <label className="flex shrink-0 items-center gap-2 cursor-pointer mt-8">
                  <Checkbox
                    checked={entry.currentlyWorkHere}
                    onCheckedChange={(checked) =>
                      updateEntry(index, {
                        currentlyWorkHere: !!checked,
                        ...(!!checked && { endDate: "" }),
                      })
                    }
                  />
                  <span className="text-sm text-zinc-700 whitespace-nowrap">
                    I currently work here
                  </span>
                </label> */}
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
                                <textarea
                                    id={`job-desc-${index}`}
                                    value={entry.jobDescription}
                                    onChange={(e) =>
                                        updateEntry(index, { jobDescription: e.target.value })
                                    }
                                    placeholder="e.g. Created wireframes, Presentations to stakeholders..."
                                    rows={4}
                                    className={cn(
                                        portfolioInputStyle,
                                        "h-auto min-h-20 resize-y py-3",
                                    )}
                                />
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
                                        onCheckedChange={(checked) =>
                                            updateEntry(index, {
                                                currentlyWorkHere: !!checked,
                                                ...(!!checked && { endDate: "" }),
                                            })
                                        }
                                    />
                                    <span className="text-sm text-zinc-600">
                                        I currently work here
                                    </span>
                                </label>
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

                {onSave && (
                    <div className="pt-4 flex flex-col gap-2">
                        <Button
                            type="button"
                            onClick={() => onSave(value)}
                            disabled={isSaving}
                            className="h-10 rounded-lg bg-primary text-white hover:bg-primary/90"
                        >
                            {isSaving ? "Saving…" : "Save"}
                        </Button>
                        {saveError && (
                            <p className="text-sm text-red-600" role="alert">
                                {saveError}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
