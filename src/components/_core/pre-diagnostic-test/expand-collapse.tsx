import { ChevronsLeft, ChevronsRight } from "lucide-react";

type ExpandCollapseProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export default function ExpandCollapse({
  isCollapsed,
  onToggle,
}: ExpandCollapseProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute top-7 right-0 z-[1000] inline-flex size-9 translate-x-1/2 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0F6371] text-white shadow-lg transition hover:bg-[#0C5662]"
      aria-label={isCollapsed ? "Expand side navigation" : "Collapse side navigation"}
      aria-expanded={!isCollapsed}
    >
      {isCollapsed ? (
        <ChevronsRight className="size-4" strokeWidth={2.5} />
      ) : (
        <ChevronsLeft className="size-4" strokeWidth={2.5} />
      )}
    </button>
  );
}
