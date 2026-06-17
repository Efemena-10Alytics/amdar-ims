"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";


import UserDetails from "./user-details";

const COMPANY_LOCATIONS = [
    "United Kingdom",
    "United States",
    "Canada",
    "Nigeria",
] as const;

type EmployabilitySessionDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type EmployabilitySessionFormState = {
    roleTitle: string;
    companyName: string;
    companyLocation: string;
};

const INITIAL_FORM_STATE: EmployabilitySessionFormState = {
    roleTitle: "",
    companyName: "",
    companyLocation: "",
};




const EmployabilitySessionDrawer = ({
    open,
    onOpenChange,
}: EmployabilitySessionDrawerProps) => {



    const [form, setForm] = useState<EmployabilitySessionFormState>(
        INITIAL_FORM_STATE,
    );



    useEffect(() => {
        if (!open) {
            setForm(INITIAL_FORM_STATE);
        }
    }, [open]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onOpenChange(false);
    };

    const canSubmit =
        form.roleTitle.trim() &&
        form.companyName.trim() &&
        form.companyLocation;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="w-full border-l-0 p-0 sm:max-w-xl"
            >
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
                        <SheetClose className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
                            <X className="size-3.5" />
                            Close
                        </SheetClose>
                        <SheetTitle className="mt-1 text-xl font-semibold text-[#173740] sm:text-2xl">
                            Book employability session
                        </SheetTitle>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <UserDetails />

                        <p className="mt-6 text-sm font-medium text-[#64748B]">
                            Fill in this section
                        </p>

                        <div className="mt-3 space-y-4">
                            <div>
                                <label
                                    htmlFor="employability-role-title"
                                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                                >
                                    Role title
                                </label>
                                <Input
                                    id="employability-role-title"
                                    value={form.roleTitle}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            roleTitle: event.target.value,
                                        }))
                                    }
                                    placeholder="Enter role title"
                                    className="h-11 rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="employability-company-name"
                                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                                >
                                    Company name
                                </label>
                                <Input
                                    id="employability-company-name"
                                    value={form.companyName}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            companyName: event.target.value,
                                        }))
                                    }
                                    placeholder="Enter company name"
                                    className="h-11 rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                                    Company location (Country)
                                </label>
                                <Select
                                    value={form.companyLocation}
                                    onValueChange={(value) =>
                                        setForm((current) => ({
                                            ...current,
                                            companyLocation: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-11 w-full rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] data-placeholder:text-[#94A3B8]">
                                        <SelectValue placeholder="Select your location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMPANY_LOCATIONS.map((location) => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#E2EBEF] px-6 py-4">
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="h-12 w-full rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
                        >
                            Book session
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default EmployabilitySessionDrawer;
