"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBecomeAPartner } from "@/features/business-partners/use-become-a-partner";
import type { BecomeAPartnerPayload } from "@/features/business-partners/types";
import SuccessModal from "@/components/_core/landing-pages/business-partners/success-modal";
import { cn } from "@/lib/utils";

const TRUST_NOTES = [
    { icon: "check", text: "🔒 No sensitive data required" },
    { icon: "check", text: "⚡ We'll respond within 2 business days" },
    { icon: "check", text: "💬 No contracts or commitments at this stage" },
    {
        icon: "check",
        text: "🎯 We shape the brief  you just point us in the right direction",
    },
] as const;

const INDUSTRIES = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Non-profit",
    "Other",
] as const;

const fieldClassName =
    "h-11 border-transparent bg-[#F4F7F8] px-3 text-sm text-[#092A31] shadow-none placeholder:text-[#B4C0CC] focus-visible:border-[#156374] focus-visible:ring-[#156374]/15";

function FieldLabel({
    htmlFor,
    children,
}: {
    htmlFor: string;
    children: ReactNode;
}) {
    return (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-[#334155]">
            {children}
        </label>
    );
}

function payloadFromForm(formData: FormData, industry: string): BecomeAPartnerPayload {
    const extraInfo = String(formData.get("extraInfo") ?? "").trim();
    return {
        companyName: String(formData.get("companyName") ?? "").trim(),
        industry,
        companySize: String(formData.get("companySize") ?? "").trim(),
        yourName: String(formData.get("yourName") ?? "").trim(),
        jobTitle: String(formData.get("jobTitle") ?? "").trim(),
        workEmail: String(formData.get("workEmail") ?? "").trim(),
        challenge: String(formData.get("challenge") ?? "").trim(),
        ...(extraInfo ? { extraInfo } : {}),
    };
}

function isPayloadComplete(payload: BecomeAPartnerPayload) {
    return Boolean(
        payload.companyName &&
        payload.industry &&
        payload.companySize &&
        payload.yourName &&
        payload.jobTitle &&
        payload.workEmail &&
        payload.challenge,
    );
}

const BecomeAPartner = () => {
    const [successOpen, setSuccessOpen] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [industry, setIndustry] = useState("");
    const [clientError, setClientError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const { submitBecomeAPartner, isSubmitting, errorMessage } = useBecomeAPartner();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setClientError("");

        const payload = payloadFromForm(new FormData(event.currentTarget), industry);
        if (!isPayloadComplete(payload)) {
            setClientError("Please fill in all required fields.");
            return;
        }

        const ok = await submitBecomeAPartner(payload);
        if (!ok) return;

        setSubmittedEmail(payload.workEmail);
        setSuccessOpen(true);
        setIndustry("");
        formRef.current?.reset();
    };

    const displayError = clientError || errorMessage;

    return (
        <>
            <section
                id="become-a-partner"
                className="relative overflow-hidden bg-[#E8EFF1] py-14 text-[#092A31] lg:py-20"
            >
                <Image
                    src="/images/svgs/partners-ellipse.svg"
                    alt=""
                    fill
                    unoptimized
                    className="pointer-events-none object-cover object-center"
                    aria-hidden
                />

                <div className="app-width relative z-10 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div className="pt-2 lg:pt-8">
                        <h2 className="text-4xl leading-tight font-semibold sm:text-5xl">
                            Become a Partner
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-[#64748B] sm:text-lg">
                            Fill in the form below and we&apos;ll be in touch within 2
                            business days to confirm fit and walk you through the next steps.
                        </p>

                        <ul className="mt-10 space-y-3.5">
                            {TRUST_NOTES.map((note) => (
                                <li key={note.text} className="flex items-center gap-3 text-sm text-[#64748B]">

                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#D8F5E3] text-[#22A957]">
                                        <Check className="size-3" strokeWidth={3} />
                                    </span>

                                    <span>{note.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_18px_50px_rgba(15,70,82,0.08)] sm:p-7"
                    >
                        <h3 className="text-lg font-semibold text-[#0B2B33]">Register Here</h3>
                        <p className="mt-1 text-sm text-[#94A3B8]">
                            Fill in your appropriate details below
                        </p>

                        <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
                            <div>
                                <FieldLabel htmlFor="partner-company-name">Company Name</FieldLabel>
                                <Input
                                    id="partner-company-name"
                                    name="companyName"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="E.g AssetGuard LTD"
                                    className={fieldClassName}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="partner-industry">Industry</FieldLabel>
                                <Select value={industry} onValueChange={setIndustry} disabled={isSubmitting}>
                                    <SelectTrigger id="partner-industry" className={cn(fieldClassName, "w-full")}>
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INDUSTRIES.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <FieldLabel htmlFor="partner-company-size">Company Size</FieldLabel>
                                <Input
                                    id="partner-company-size"
                                    name="companySize"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Enter company size"
                                    className={fieldClassName}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="partner-your-name">Your Name</FieldLabel>
                                <Input
                                    id="partner-your-name"
                                    name="yourName"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Enter Full name"
                                    className={fieldClassName}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="partner-job-title">Your Role / Job Title</FieldLabel>
                                <Input
                                    id="partner-job-title"
                                    name="jobTitle"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="E.g Head of Operations"
                                    className={fieldClassName}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="partner-work-email">Work Email</FieldLabel>
                                <Input
                                    id="partner-work-email"
                                    name="workEmail"
                                    type="email"
                                    required
                                    disabled={isSubmitting}
                                    placeholder="you@company.co"
                                    className={fieldClassName}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <FieldLabel htmlFor="partner-challenge">
                                What kind of challenge would you like consultants to work on?
                            </FieldLabel>
                            <textarea
                                id="partner-challenge"
                                name="challenge"
                                required
                                disabled={isSubmitting}
                                rows={4}
                                placeholder="Describe the business problem or scenario. It doesn't need to be formal; a paragraph is enough."
                                className={cn(
                                    fieldClassName,
                                    "min-h-24 w-full resize-none rounded-md py-2.5 leading-relaxed outline-none focus-visible:ring-[3px]",
                                )}
                            />
                        </div>

                        <div className="mt-4">
                            <FieldLabel htmlFor="partner-extra-info">
                                Anything else we should know? (optional)
                            </FieldLabel>
                            <textarea
                                id="partner-extra-info"
                                name="extraInfo"
                                disabled={isSubmitting}
                                rows={3}
                                placeholder="Ask"
                                className={cn(
                                    fieldClassName,
                                    "min-h-20 w-full resize-none rounded-md py-2.5 leading-relaxed outline-none focus-visible:ring-[3px]",
                                )}
                            />
                        </div>

                        {displayError ? (
                            <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                                {displayError}
                            </p>
                        ) : null}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-5 h-12 w-full rounded-lg bg-[#156374] text-sm font-semibold text-white hover:bg-[#0E4C58] disabled:opacity-60"
                        >
                            {isSubmitting ? "Submitting…" : "Submit Partner Interest →"}
                        </Button>
                    </form>
                </div>
            </section>

            <SuccessModal
                open={successOpen}
                onOpenChange={setSuccessOpen}
                email={submittedEmail}
            />
        </>
    );
};

export default BecomeAPartner;
