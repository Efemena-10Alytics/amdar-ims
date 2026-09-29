"use client";

import Image from "next/image";
import { WHATSAPP_URL } from "@/components/_core/landing-pages/shared/whatsapp-widget";
import { SidebarFooter as SidebarFooterSlot } from "@/components/ui/sidebar";

const SUPPORT_AVATAR = "/images/svgs/illustration/Super Excited 3.svg";

export function SidebarSupportFooter() {
  return (
    <SidebarFooterSlot className="mt-auto p-3">
      <div
        className="flex flex-col gap-4 rounded-2xl p-4 group-data-[collapsible=icon]:hidden"
        style={{
          background:
            "linear-gradient(290.83deg, #FFE082 -25.01%, #156374 19.22%, #156374 51.69%, #022027 91.44%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ACF0C5]">
            <Image
              src={SUPPORT_AVATAR}
              alt=""
              width={36}
              height={36}
              className="size-9 object-cover object-[center_20%]"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Contact Support</p>
            <p className="text-xs text-white">Mon - Fri (2pm - 11pm)</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-white">
          Reach out to support to log complains or issues you have with your
          Projects or the IMS
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#FFF5D8] text-sm font-semibold text-[#5A431B] transition-colors hover:bg-[#FFE082]"
        >
          Contact support
        </a>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact support"
        title="Contact support"
        className="mx-auto hidden size-10 items-center justify-center overflow-hidden rounded-xl bg-[#156374] transition-opacity hover:opacity-90 group-data-[collapsible=icon]:flex"
      >
        <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-[#ACF0C5]">
          <Image
            src={SUPPORT_AVATAR}
            alt=""
            width={32}
            height={32}
            className="size-8 object-cover object-[center_20%]"
          />
        </span>
      </a>
    </SidebarFooterSlot>
  );
}
