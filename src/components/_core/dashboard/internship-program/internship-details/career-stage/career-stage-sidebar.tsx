import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrangleIcon } from "@/components/_core/dashboard/svg";
import type { CareerStageStatus } from "@/components/_core/dashboard/internship-program/internship-details/career-stage/career-stage-card";

export type CareerStageNavItem = {
  id: string;
  label: string;
  status: CareerStageStatus;
};

export default function CareerStageSidebar({
  items,
  onSelect,
}: {
  items: CareerStageNavItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="rounded-xl border border-[#E2E8F0] bg-white p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-[#092A31] sm:text-base">
        Career stage
      </h3>

      <ul className="mt-3 space-y-0.5">
        {items.map((item) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "active";

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition sm:text-sm",
                  isCompleted && "bg-primary text-white",
                  isInProgress && "bg-[#CFF6DA] text-[#156374]",
                  !isCompleted &&
                    !isInProgress &&
                    "text-[#98A2B3] hover:bg-[#F6F8FA] hover:text-[#64748B]",
                )}
              >
                <span className="min-w-0 leading-snug">{item.label}</span>
                {isCompleted ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-amdari-yellow text-primary">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                ) : isInProgress ? (
                  <Loader
                    className="size-4 shrink-0 animate-spin text-[#156374]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : (
                  <TrangleIcon />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
