"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { portfolioInputStyle } from "./portfolio-styles";

type AddMorePopoverProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    inputLabel: string;
    inputId: string;
    value: string;
    onChange: (value: string) => void;
    onDone: () => void;
    placeholder?: string;
    children: React.ReactNode;
};

export function AddMorePopover({
    open,
    onOpenChange,
    title,
    inputLabel,
    inputId,
    value,
    onChange,
    onDone,
    placeholder = "Enter title",
    children,
}: AddMorePopoverProps) {
    return (
        <Popover
            open={open}
            onOpenChange={onOpenChange}
        >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-80 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg"
            >
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">
                    {title}
                </h3>
                <div className="space-y-2">
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-zinc-900 block"
                    >
                        {inputLabel}
                    </label>
                    <Input
                        id={inputId}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onDone();
                            }
                        }}
                        placeholder={placeholder}
                        className={cn(
                            portfolioInputStyle,
                            "rounded-lg border-zinc-200",
                        )}
                    />
                </div>
                <div className="pt-4">
                    <Button
                        type="button"
                        onClick={onDone}
                        className="w-full rounded-lg bg-primary text-white hover:bg-primary/90 h-10 font-medium"
                    >
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
