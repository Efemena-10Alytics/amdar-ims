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
                            onChange(date.toISOString().slice(0, 10));
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