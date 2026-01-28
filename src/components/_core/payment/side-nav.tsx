import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SideNav = () => {
  const STEPS = [
    { id: "checkout", label: "Checkout", active: true },
    { id: "personal", label: "Personal Details", active: false },
    { id: "payment", label: "Payment", active: false },
  ];
  return (
    <aside className="shrink-0 lg:w-52">
      <nav
        className=""
        aria-label="Enrollment steps"
      >
        <ul className="space-y-1">
          {STEPS.map((step, i) => (
            <li key={step.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg py-2.5 text-left text-sm transition-colors",
                  step.active
                    ? "font-semibold text-[#092A31]"
                    : "font-normal text-[#6b7280]",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    step.active
                      ? "bg-primary text-white"
                      : "bg-[#B6CFD4] text-[#6b7280]",
                  )}
                >
                  {step.active ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </span>
                {step.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[#9ca3af]">
          Click here to switch section faster.
        </p>
      </nav>
    </aside>
  );
};

export default SideNav;
