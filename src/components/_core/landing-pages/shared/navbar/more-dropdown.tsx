"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowUpRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TEAL = "#0F4652";
const TEAL_LIGHT = "#156374";
const YELLOW_BG = "#FFE082";

export type MoreGridItem = {
  title: string;
  description: string;
  href: string;
};

const DEFAULT_GRID_ITEMS: MoreGridItem[] = [
  {
    title: "Hackaton",
    description:
      "Show your skills, collaborate with top talents & solve problems by top organizations.",
    href: "/hackathon",
  },
  {
    title: "Blog",
    description: "Get more resources and knowledge from Amdari",
    href: "/blog",
  },
  {
    title: "Job board",
    description: "Check out some jobs you can apply to here",
    href: "/talent-loop",
  },
  {
    title: "Chat with us",
    description: "Chat with us to learn more about what we offer",
    href: "/contact",
  },
];

const DEFAULT_FOOTER_ITEM = {
  title: "Faqs",
  description: "Chat with us more of what we offer",
  href: "/faqs",
};

export type MoreDropdownProps = {
  gridItems?: MoreGridItem[];
  footerItem?: { title: string; description: string; href: string };
  showWhiteNav?: boolean;
  isActive?: boolean;
  className?: string;
};

const CLOSE_DELAY_MS = 120;

export function MoreDropdown({
  gridItems = DEFAULT_GRID_ITEMS,
  footerItem = DEFAULT_FOOTER_ITEM,
  showWhiteNav = true,
  isActive = false,
  className,
}: MoreDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  useEffect(() => () => clearCloseTimeout(), []);

  const triggerClass = cn(
    "text-sm transition-colors relative pb-0.5 flex items-center gap-0.5",
    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-current after:transition-[width] after:duration-300 after:ease-out",
    open || isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
    showWhiteNav
      ? "text-[#156374] hover:text-[#0f4d5a]"
      : "text-primary hover:text-[#0f4d5a]",
  );

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => {
        clearCloseTimeout();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
      >
        More Program
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          className="absolute top-7 left-0 -translate-x-1/2 pt-3 z-50 w-[min(90vw,520px)]"
          onMouseLeave={scheduleClose}
        >
          {/* Tail: white with curved top */}
          <svg
            className="absolute top-0 left-2/3 -translate-x-1/2 w-6 h-3 block overflow-visible"
            viewBox="0 0 24 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M0 12 L6 2 Q8 0 18 2 L24 12 Z"
              fill="#E8EFF1"
              stroke="#E8EFF1"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
          <div className="rounded-xl overflow-hidden shadow-xl">
            {/* Header */}
            {/* <div
              className="flex items-center gap-2 px-4 py-3 text-white"
              style={{ backgroundColor: TEAL }}
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-white/20 text-white font-bold text-sm">
                A
              </div>
              <span className="font-semibold text-sm">More from Amdari</span>
            </div> */}

            {/* Main: 2x2 grid */}
            <div
              className="relative grid grid-cols-2 gap-4 bg-[#E8EFF1] p-3"
              style={{
                backgroundColor: "#E5E7EB",
                backgroundImage:
                  "linear-gradient(135deg, transparent 60%, rgba(253,224,71,0.08) 80%, rgba(192,132,252,0.06) 100%)",
              }}
            >
              {gridItems.map(({ title, description, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-start gap-2 rounded-lg p-3 hover:bg-[#EEF9FC] transition-colors group"
                >
                  <Image
                    src={"/images/svgs/shadow-chat-icon.svg"}
                    height={40}
                    width={40}
                    alt="chat"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1f2937] group-hover:text-[#0F4652]">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-0.5 px-4 py-3 text-white"
              style={{ backgroundColor: TEAL }}
            >
              <Image
                src={"/images/svgs/shadow-chat-icon.svg"}
                height={40}
                width={40}
                alt="chat"
                className="mt-2"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{footerItem.title}</p>
                <p className="text-xs text-white/80 truncate">
                  {footerItem.description}
                </p>
              </div>
              <Link
                href={footerItem.href}
                className="shrink-0 size-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{ backgroundColor: YELLOW_BG }}
                aria-label={`Go to ${footerItem.title}`}
              >
                <ArrowUpRight className="size-4 text-[#0F4652]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
