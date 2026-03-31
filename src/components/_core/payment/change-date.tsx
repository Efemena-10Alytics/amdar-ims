"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ChangeDateProps {
    value: string;
    onChange: (ymd: string) => void;
}

function formatDateToLocalYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export const ChangeDate = ({ value, onChange }: ChangeDateProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="text-sm font-medium text-primary border-primary border px-2 py-1 rounded-md hover:text-primary/90"
                >
                    Edit date
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    mode="single"
                    defaultMonth={
                        value
                            ? new Date(value + "T12:00:00")
                            : undefined
                    }
                    selected={
                        value
                            ? new Date(value + "T12:00:00")
                            : undefined
                    }
                    onSelect={(date) => {
                        if (date) {
                            onChange(formatDateToLocalYmd(date));
                            setCalendarOpen(false);
                        }
                    }}
                    disabled={(date) => {
                        if (!value) return false;
                        const [valueYear, valueMonth] = value
                            .split("-")
                            .map(Number);
                        return (
                            date.getFullYear() > valueYear ||
                            (date.getFullYear() === valueYear &&
                                date.getMonth() >= valueMonth)
                        );
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}