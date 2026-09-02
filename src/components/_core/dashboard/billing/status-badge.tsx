import type { InstallmentStatus } from "@/features/payment/types";
import {
  DueSoonStatusIcon,
  OverdueStatusIcon,
  PaidStatusIcon,
  UpcomingStatusIcon,
} from "./icons";

const STATUS_CONFIG: Record<
  InstallmentStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Paid",
    bg: "#C7F5D8",
    text: "#297A46",
    icon: <PaidStatusIcon />,
  },
  "due-soon": {
    label: "Due soon",
    bg: "#F3E1C4",
    text: "#5A431B",
    icon: <DueSoonStatusIcon />,
  },
  upcoming: {
    label: "Upcoming",
    bg: "#EBECEE",
    text: "#76808D",
    icon: <UpcomingStatusIcon />,
  },
  overdue: {
    label: "Overdue",
    bg: "#FAC5C5",
    text: "#AA3030",
    icon: <OverdueStatusIcon />,
  },
};

export function StatusBadge({ status }: { status: InstallmentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex h-7.25 items-center gap-1 rounded-full px-2 font-sora text-xs font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

export function getRowHighlightClass(status: InstallmentStatus): string {
  if (status === "due-soon") return "bg-[#FFF5D8]";
  if (status === "overdue") return "bg-[#FDECEC]";
  return "bg-white";
}
