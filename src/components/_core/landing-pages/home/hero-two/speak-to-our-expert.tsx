"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { WHATSAPP_URL } from "@/components/_core/landing-pages/shared/whatsapp-widget";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BOOK_CONSULTATION_URL =
  "https://calendly.com/efemena-amdari/land-a-data-role-via-work-experience";

const EXPERT_AVATARS = [
  {
    src: "/images/svgs/become-partners/hero-avatar-1.svg",
    alt: "Expert",
  },
  {
    src: "/images/svgs/become-partners/hero-avatar-2.svg",
    alt: "Expert",
  },
  {
    src: "/images/svgs/become-partners/hero-avatar-3.svg",
    alt: "Expert",
  },
] as const;

function MessagesIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M8.75 4.66669H19.25C21.0449 4.66669 22.5 6.12178 22.5 7.91669V14.5834C22.5 16.3783 21.0449 17.8334 19.25 17.8334H12.8333L8.16667 21.5834V17.8334H8.75C6.95507 17.8334 5.5 16.3783 5.5 14.5834V7.91669C5.5 6.12178 6.95507 4.66669 8.75 4.66669Z"
        stroke="#5A431B"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 8.16669H18.6667"
        stroke="#5A431B"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M11.6667 11.6667H16.3333"
        stroke="#5A431B"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15.1667 4.66669H19.8333C21.6282 4.66669 23.0833 6.12178 23.0833 7.91669V12.25"
        stroke="#5A431B"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5.24328 17.1891L5.5676 17.3513C6.91895 18.1621 8.43247 18.5405 9.94598 18.5405C14.7027 18.5405 18.5946 14.6486 18.5946 9.89181C18.5946 7.62154 17.6757 5.40533 16.0541 3.7837C14.4325 2.16208 12.2703 1.24316 9.94598 1.24316C5.18922 1.24316 1.29733 5.13506 1.35139 9.94587C1.35139 11.5675 1.83787 13.1351 2.64868 14.4864L2.8649 14.8107L2.00004 17.9999L5.24328 17.1891Z"
        fill="#5A431B"
      />
      <path
        d="M14.7568 12.1622L14.1622 11.8919C14.1622 11.8919 13.2973 11.5135 12.7568 11.2432C12.7027 11.2432 12.6486 11.1892 12.5946 11.1892C12.4324 11.1892 12.3243 11.2432 12.2162 11.2973C12.2162 11.2973 12.1622 11.3514 11.4054 12.2162C11.3514 12.3243 11.2432 12.3784 11.1351 12.3784H11.0811C11.027 12.3784 10.9189 12.3243 10.8649 12.2703L10.5946 12.1622C10 11.8919 9.45946 11.5676 9.02703 11.1351C8.91892 11.027 8.75676 10.9189 8.64865 10.8108C8.27027 10.4324 7.89189 10 7.62162 9.51351L7.56757 9.40541C7.51351 9.35135 7.51351 9.2973 7.45946 9.18919C7.45946 9.08108 7.45946 8.97297 7.51351 8.91892C7.51351 8.91892 7.72973 8.64865 7.89189 8.48649C8 8.37838 8.05405 8.21622 8.16216 8.10811C8.27027 7.94595 8.32432 7.72973 8.27027 7.56757C8.21622 7.2973 7.56757 5.83784 7.40541 5.51351C7.2973 5.35135 7.18919 5.2973 7.02703 5.24324H6.86486C6.75676 5.24324 6.59459 5.24324 6.43243 5.24324C6.32432 5.24324 6.21622 5.2973 6.10811 5.2973L6.05405 5.35135C5.94595 5.40541 5.83784 5.51351 5.72973 5.56757C5.62162 5.67568 5.56757 5.78378 5.45946 5.89189C5.08108 6.37838 4.86486 6.97297 4.86486 7.56757C4.86486 8 4.97297 8.43243 5.13514 8.81081L5.18919 8.97297C5.67568 10 6.32432 10.9189 7.18919 11.7297L7.40541 11.9459C7.56757 12.1081 7.72973 12.2162 7.83784 12.3784C8.97297 13.3514 10.2703 14.0541 11.7297 14.4324C11.8919 14.4865 12.1081 14.4865 12.2703 14.5405C12.4324 14.5405 12.6486 14.5405 12.8108 14.5405C13.0811 14.5405 13.4054 14.4324 13.6216 14.3243C13.7838 14.2162 13.8919 14.2162 14 14.1081L14.1081 14C14.2162 13.8919 14.3243 13.8378 14.4324 13.7297C14.5405 13.6216 14.6486 13.5135 14.7027 13.4054C14.8108 13.1892 14.8649 12.9189 14.9189 12.6486C14.9189 12.5405 14.9189 12.3784 14.9189 12.2703C14.9189 12.2703 14.8649 12.2162 14.7568 12.1622Z"
        fill="#FFE082"
      />
    </svg>
  );
}

function ExpertAvatars() {
  return (
    <div className="flex -space-x-2.5 shrink-0">
      {EXPERT_AVATARS.map((avatar, index) => (
        <div
          key={avatar.src}
          className="relative size-9 overflow-hidden rounded-full border-2 border-[#3A8E53] bg-white"
          style={{ zIndex: EXPERT_AVATARS.length - index }}
        >
          <Image
            src={avatar.src}
            alt={avatar.alt}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
      ))}
    </div>
  );
}

type SpeakToExpertPopoverProps = {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SpeakToExpertPopover({
  children,
  side = "bottom",
  align = "center",
  sideOffset = 12,
  open,
  onOpenChange,
}: SpeakToExpertPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-auto border-0 bg-transparent p-0 shadow-none"
      >
        <SpeakToOurExpertPanel />
      </PopoverContent>
    </Popover>
  );
}

const SpeakToOurExpertPanel = () => {
  return (
    <div className="w-[min(90vw,22.5rem)] rounded-2xl bg-[#FFF4D6] p-5 shadow-[0_12px_40px_rgba(18,57,67,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <MessagesIcon />
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-[#5A431B]">
              Speak to an expert
            </h3>
            <p className="mt-0.5 text-sm font-medium text-[#5A431B]/85">
              Let&apos;s help you get started
            </p>
          </div>
        </div>
        <ExpertAvatars />
      </div>

      <a
        href={BOOK_CONSULTATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center gap-3 rounded-2xl bg-primary p-3 transition-colors hover:bg-[#125a68]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amdari-yellow">
          <Calendar className="size-5 text-[#5A431B]" strokeWidth={2} aria-hidden />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-base font-bold text-white">
            Book consultation
          </span>
          <span className="block text-sm text-white/85">1pm - 1:30pm daily</span>
        </span>
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-3 rounded-2xl bg-[#C9BC8E] p-3 transition-colors hover:bg-[#BFB28A]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amdari-yellow">
          <WhatsAppIcon />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-base font-bold text-[#5A431B]">
            Chat with an expert
          </span>
          <span className="block text-sm text-[#5A431B]/85">
            Get answers in real time
          </span>
        </span>
      </a>
    </div>
  );
};

export default SpeakToOurExpertPanel;
