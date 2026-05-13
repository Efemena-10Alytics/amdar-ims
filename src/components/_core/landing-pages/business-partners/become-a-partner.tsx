"use client";

import React from "react";
import Aos from "aos";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import SuccessModal from "./success-modal";

const TRUST_NOTES = [
  "No sensitive data required",
  "We'll respond within 2 business days",
  "No contracts or commitments at this stage",
  "We shape the brief, you just point us in the right direction",
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
  "h-9 border-transparent bg-[#F8FAFC] px-3 text-xs font-medium text-[#092A31] shadow-none placeholder:text-[#B4C0CC] focus-visible:border-primary focus-visible:ring-primary/15";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-bold text-[#4B5F72]"
    >
      {children}
    </label>
  );
}

export default function BecomeAPartner() {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  React.useEffect(() => {
    Aos.init({ duration: 600, once: true });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("workEmail");
    setSubmittedEmail(typeof email === "string" && email ? email : "example@gmail.io");
    setSuccessOpen(true);
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-white py-14 text-[#092A31] sm:py-16 lg:py-20"
        aria-labelledby="become-partner-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[linear-gradient(#E8EFF1_1px,transparent_1px),linear-gradient(90deg,#E8EFF1_1px,transparent_1px)] bg-[size:5rem_5rem]" />
          <div className="absolute left-[29%] top-[24%] h-36 w-28 bg-[#E8EFF1]/70" />
          <div className="absolute bottom-[25%] left-[29%] h-20 w-36 bg-[#E8EFF1]/70" />
        </div>

        <div className="app-width relative z-10 grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
          <div data-aos="fade-right" className="pt-3 lg:pt-8">
            <h2
              id="become-partner-heading"
              className="font-clash-display text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]"
            >
              Become a partner
            </h2>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#64748B] sm:text-lg">
              Fill in the form below and we&apos;ll be in touch within 2 business
              days to confirm fit and walk you through the next steps.
            </p>

            <ul className="mt-12 space-y-3">
              {TRUST_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-center gap-3 text-sm font-medium text-[#64748B]"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-[#C9F5D7] text-[#22A957]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            data-aos="fade-left"
            className="rounded-xl border border-[#BFD2D8] bg-white p-5 shadow-[0_28px_55px_rgba(21,99,116,0.16)] sm:p-5 lg:p-6"
            onSubmit={handleSubmit}
          >
          <div>
            <h3 className="text-lg font-bold text-[#253F4B]">Register Here</h3>
            <p className="mt-0.5 text-xs font-medium text-[#B4C0CC]">
              Fill in your appropriate details below
            </p>
          </div>

          <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
              <Input
                id="company-name"
                name="companyName"
                placeholder="Enter your email address"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="industry">Industry</FieldLabel>
              <Select name="industry">
                <SelectTrigger
                  id="industry"
                  className={cn(fieldClassName, "h-9")}
                >
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FieldLabel htmlFor="company-size">Company Size</FieldLabel>
              <Input
                id="company-size"
                name="companySize"
                placeholder="Enter your email address"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="your-name">Your Name</FieldLabel>
              <Input
                id="your-name"
                name="yourName"
                placeholder="Enter your email address"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="job-title">Your Role / Job Title</FieldLabel>
              <Input
                id="job-title"
                name="jobTitle"
                placeholder="Enter your email address"
                className={fieldClassName}
              />
            </div>

            <div>
              <FieldLabel htmlFor="work-email">Work Email</FieldLabel>
              <Input
                id="work-email"
                name="workEmail"
                type="email"
                placeholder="Enter your email address"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="mt-3">
            <FieldLabel htmlFor="challenge">
              What kind of challenge would you like interns to work on?
            </FieldLabel>
            <textarea
              id="challenge"
              name="challenge"
              rows={4}
              placeholder="Describe the business problem or scenario. It doesn't need to be formal; a paragraph is enough."
              className={cn(
                fieldClassName,
                "min-h-18 w-full resize-none rounded-md py-2.5 leading-relaxed outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
              )}
            />
          </div>

          <div className="mt-3">
            <FieldLabel htmlFor="extra-info">
              Anything else we should know? (optional)
            </FieldLabel>
            <textarea
              id="extra-info"
              name="extraInfo"
              rows={3}
              placeholder="Ask"
              className={cn(
                fieldClassName,
                "min-h-16 w-full resize-none rounded-md py-2.5 leading-relaxed outline-none transition-[color,box-shadow] focus-visible:ring-[3px]",
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-white hover:bg-[#0F4D5A]"
          >
            Submit Partner Interest →
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
}
