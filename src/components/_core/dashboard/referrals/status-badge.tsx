import type { ReferralPaymentStatus, WithdrawalStatus } from "@/features/referral/types";
import {
  ReferralPaidIcon,
  ReferralPendingIcon,
  ReferralRefundedIcon,
  WithdrawalFailedIcon,
  WithdrawalPendingIcon,
  WithdrawalSuccessfulIcon,
} from "./icons";

const STATUS_CONFIG: Record<
  ReferralPaymentStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Paid",
    bg: "#C7F5D8",
    text: "#359E5B",
    icon: <ReferralPaidIcon />,
  },
  pending: {
    label: "Pending",
    bg: "#F3E1C4",
    text: "#564103",
    icon: <ReferralPendingIcon />,
  },
  refunded: {
    label: "Refunded",
    bg: "#FDECEC",
    text: "#AA3030",
    icon: <ReferralRefundedIcon />,
  },
};

export function ReferralPaymentPlanBadge({
  current,
  total,
  status,
}: {
  current: number;
  total: number;
  status: ReferralPaymentStatus;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex h-7 items-center gap-1 rounded-full px-2.5 font-sora text-xs font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      {current}/{total}
      {config.icon}
      {config.label}
    </span>
  );
}

const WITHDRAWAL_STATUS_CONFIG: Record<
  WithdrawalStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  successful: {
    label: "Successful",
    bg: "#C7F5D8",
    text: "#359E5B",
    icon: <WithdrawalSuccessfulIcon />,
  },
  pending: {
    label: "Pending",
    bg: "#F3E1C4",
    text: "#564103",
    icon: <WithdrawalPendingIcon />,
  },
  failed: {
    label: "Failed",
    bg: "#FDECEC",
    text: "#AA3030",
    icon: <WithdrawalFailedIcon />,
  },
};

export function WithdrawalStatusBadge({ status }: { status: WithdrawalStatus }) {
  const config = WITHDRAWAL_STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex h-7 items-center gap-1 rounded-full px-2.5 font-sora text-xs font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
