"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type PaymentStepId = "checkout" | "personal";

const STEPS: { id: PaymentStepId; label: string }[] = [
  { id: "checkout", label: "Checkout" },
  { id: "personal", label: "Personal Details" },
  // { id: "payment", label: "Payment" },
];

type SideNavProps = {
  activeStep: PaymentStepId;
  onStepChange: (step: PaymentStepId) => void;
};

const SideNav = ({ activeStep, onStepChange }: SideNavProps) => {
  return (
    <aside className="shrink-0 ">
      <nav
        className="rounded-xl bg-[#E8EFF1] p-4"
        aria-label="Enrollment steps"
      >
        <ul className="space-y-1 flex justify-between lg:flex-col gap-2 overflow-x-auto">
          {STEPS.map((step, i) => {
            const isActive = activeStep === step.id;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onStepChange(step.id)}
                  className={cn(
                    "whitespace-nowrap flex flex-col lg:flex-row w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "font-semibold text-[#092A31]"
                      : "font-normal text-[#6b7280]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-[#B6CFD4] text-[#6b7280]",
                    )}
                  >
                    {isActive ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </span>
                  {step.label}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-[#9ca3af] hidden lg:block">
          Click here to switch section faster.
        </p>
      </nav>
    </aside>
  );
};

export default SideNav;
