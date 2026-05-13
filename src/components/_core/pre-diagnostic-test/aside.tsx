"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const READINESS_GROUPS = [
  {
    key: "career-readiness",
    title: "Career Readiness",
    href: "/pre-diagnostic-test",
    items: [
      { key: "welcome-video", label: "Welcome video", status: "done" },
      { key: "career-curriculum", label: "Career curriculum", status: "done" },
      {
        key: "career-path-diagnostics",
        label: "Career path diagnostics",
        status: "done",
      },
    ],
  },
  {
    key: "technology-readiness",
    title: "Technology Readiness",
    href: "/pre-diagnostic-test/technology-readiness",
    items: [
      { key: "technology-use-case", label: "Technology use case", status: "done" },
      { key: "practical-walkthrough", label: "Practical walkthrough", status: "todo" },
      {
        key: "technology-diagnostics",
        label: "Technology diagnostics",
        status: "todo",
      },
    ],
  },
  {
    key: "ims-readiness",
    title: "IMS Process",
    href: "/pre-diagnostic-test/ims-readiness",
    items: [
      { key: "how-the-ims-works", label: "How the IMS works", status: "done" },
      { key: "ims-diagnostics", label: "IMS Diagnostics", status: "todo" },
    ],
  },
] as const;

function getActiveGroupKey(pathname: string) {
  return (
    READINESS_GROUPS.find((group) => pathname === group.href)?.key ??
    READINESS_GROUPS[0].key
  );
}

const Aside = () => {
  const pathname = usePathname();
  const activeGroupKey = getActiveGroupKey(pathname);

  return (
    <aside className="hidden overflow-y-auto rounded-l-xl bg-[#156F7D] px-5 py-6 text-white lg:flex lg:w-[45%] lg:flex-col xl:w-[42%] xl:px-6 xl:py-7">
      <Link href="/" className="inline-flex w-fit">
        <Image src="/logo-white.svg" height={25} width={126} alt="amdari" />
      </Link>

      <div className="mt-10 flex grow flex-col">
        <div className="px-1">
          <h2 className="text-base font-bold tracking-tight text-white">
            PRE-ENTRY DIAGNOSTIC
          </h2>
          <p className="mt-1 text-sm font-medium text-[#C4DEE3]">
            Let&apos;s make your onboarding journey smooth
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          {READINESS_GROUPS.map((group) => {
            const isOpen = group.key === activeGroupKey;

            return (
              <section
                key={group.key}
                className={cn(
                  "overflow-hidden rounded-xl bg-[#0F6371] transition-colors",
                  isOpen && "bg-[#0E6370]",
                )}
              >
                <Link
                  href={group.href}
                  className="flex min-h-12 items-center justify-between gap-4 px-4 py-3"
                >
                  <h3 className="text-base font-semibold text-white">{group.title}</h3>
                  <ChevronRight
                    className={cn("size-4 text-white transition-transform", isOpen && "rotate-90")}
                    strokeWidth={3}
                    aria-hidden
                  />
                </Link>

                {isOpen ? (
                  <ul className="space-y-3 px-4 pb-4 pt-1">
                    {group.items.map((item) => {
                      const isDone = item.status === "done";

                      return (
                        <li
                          key={item.key}
                          className="grid grid-cols-[1fr_auto] items-center gap-3"
                        >
                          <Link
                            href={`${group.href}?step=${item.key}`}
                            className="flex min-w-0 items-center gap-2.5"
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
                                isDone
                                  ? "border-transparent bg-[#BDF3D0] text-[#1F7A4A]"
                                  : "border-[#8BB9C1] text-transparent",
                              )}
                            >
                              {isDone ? <Check className="size-3" strokeWidth={3} /> : null}
                            </span>
                            <span className="truncate text-sm font-medium text-[#A9D0D7]">
                              {item.label}
                            </span>
                          </Link>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[10px] font-semibold leading-none",
                              isDone
                                ? "bg-[#CFF6DA] text-[#238A50]"
                                : "border border-[#7EAAB2] text-[#9EC5CC]",
                            )}
                          >
                            {isDone ? "Done" : "Todo"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Aside;
