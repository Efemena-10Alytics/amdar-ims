import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { id: 1, label: "Personal Information" },
  { id: 2, label: "Your Social" },
  { id: 3, label: "Your Bio" },
  { id: 4, label: "Your Specialization" },
  { id: 5, label: "Your Skills" },
  { id: 6, label: "Your Tools" },
  { id: 7, label: "Work Experience" },
  { id: 8, label: "Education Background" },
] as const;

type AsideProps = {
  step: number;
  onStepChange: (step: number) => void;
};

const Aside = ({ step, onStepChange }: AsideProps) => {
  return (
    <aside className="w-75 shrink-0 flex flex-col">
      <nav className="rounded-xl w-full bg-[#F8FAFC] p-4" aria-label="Portfolio steps">
        <ul className="space-y-1">
          {STEPS.map((s, i) => {
            const isActive = step === s.id;
            const isCompleted = i < step - 1;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onStepChange(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-zinc-100",
                    isActive
                      ? "font-semibold text-[#092A31]"
                      : isCompleted
                        ? "font-medium text-[#4a5568]"
                        : "font-normal text-[#6b7280]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      isCompleted && "bg-primary text-white",
                      isActive && !isCompleted && "bg-primary text-white",
                      !isCompleted &&
                        !isActive &&
                        "bg-[#B6CFD4] text-[#6b7280]",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4" strokeWidth={2.5} />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-[#9ca3af]">
          Click here to switch section faster
        </p>
      </nav>
    </aside>
  );
};

export default Aside;
