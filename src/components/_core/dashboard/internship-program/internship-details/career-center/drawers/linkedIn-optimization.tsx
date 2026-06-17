"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type FormEvent,
} from "react";
import { Upload, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import UserDetails from "./user-details";

const COMPANY_LOCATIONS = [
    "United Kingdom",
    "United States",
    "Canada",
    "Nigeria",
] as const;

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

type LinkedInOptimizationDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type LinkedInOptimizationFormState = {
    roleTitle: string;
    companyName: string;
    companyLocation: string;
    cvFile: File | null;
};

const INITIAL_FORM_STATE: LinkedInOptimizationFormState = {
    roleTitle: "",
    companyName: "",
    companyLocation: "",
    cvFile: null,
};

const LinkedInOptimizationDrawer = ({
    open,
    onOpenChange,
}: LinkedInOptimizationDrawerProps) => {
    const cvInputId = useId();
    const cvInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<LinkedInOptimizationFormState>(
        INITIAL_FORM_STATE,
    );
    const [cvError, setCvError] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        if (!open) {
            setForm(INITIAL_FORM_STATE);
            setCvError("");
            setIsDragOver(false);
        }
    }, [open]);

    const handleCvSelect = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setCvError("Please upload a JPEG or PNG file.");
            return;
        }

        if (file.size > MAX_CV_SIZE_BYTES) {
            setCvError("File must be 5 MB or smaller.");
            return;
        }

        setCvError("");
        setForm((current) => ({ ...current, cvFile: file }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onOpenChange(false);
    };

    const canSubmit =
        form.roleTitle.trim() &&
        form.companyName.trim() &&
        form.companyLocation &&
        form.cvFile &&
        !cvError;

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
                            Book LinkedIn Optimization
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
                                    htmlFor="linkedin-role-title"
                                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                                >
                                    Role title
                                </label>
                                <Input
                                    id="linkedin-role-title"
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
                                    htmlFor="linkedin-company-name"
                                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                                >
                                    Company name
                                </label>
                                <Input
                                    id="linkedin-company-name"
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

                            <div>
                                <label
                                    htmlFor={cvInputId}
                                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                                >
                                    Upload your CV
                                </label>
                                <input
                                    ref={cvInputRef}
                                    id={cvInputId}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    className="sr-only"
                                    onChange={(event) =>
                                        handleCvSelect(event.target.files?.[0] ?? null)
                                    }
                                />
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => cvInputRef.current?.click()}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            cvInputRef.current?.click();
                                        }
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        setIsDragOver(false);
                                        handleCvSelect(event.dataTransfer.files?.[0] ?? null);
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setIsDragOver(true);
                                    }}
                                    onDragLeave={() => setIsDragOver(false)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F6F8FA] px-4 py-8 transition-colors",
                                        isDragOver && "border-[#0A66C2] bg-[#E8F0FF]",
                                        cvError && "border-red-300 bg-red-50/50",
                                    )}
                                >
                                    <Upload className="size-8 text-[#0A66C2]" strokeWidth={1.75} />
                                    <p className="text-sm font-semibold text-[#0A66C2]">
                                        {form.cvFile ? form.cvFile.name : "Click to upload CV"}
                                    </p>
                                    <p className="text-xs text-[#64748B]">Jpeg, png (max 5mb)</p>
                                </div>
                                {cvError ? (
                                    <p className="mt-1.5 text-xs text-red-600">{cvError}</p>
                                ) : null}
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

export default LinkedInOptimizationDrawer;
