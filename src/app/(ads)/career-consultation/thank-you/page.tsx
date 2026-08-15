"use client";

import Image from "next/image";

const WHATSAPP_LINK = "https://chat.whatsapp.com/EM3wjWuucD1AD9HphClDKS";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#092A31] text-[#F2F7F7]">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px] rounded-2xl border border-[#156374]/45 bg-[#0C3640] px-7 py-10 text-center">
          <Image
            src="/logo-white.svg"
            width={140}
            height={20}
            alt="Amdari"
            className="mx-auto mb-8"
          />

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-3xl">
            ✅
          </div>

          {/* Visually removed by design; kept so the page still has a heading
              for screen readers. */}
          <h1 className="sr-only">You&apos;re booked</h1>

          <p className="mb-8 text-[15px] leading-[1.65] text-[#C7D5D6]">
            Check your email for more details about this session. We will also
            be calling to remind you of the session. Don&apos;t forget to join
            community.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFE082] py-3.5 text-sm font-bold uppercase tracking-[0.02em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F]"
          >
            Join WhatsApp Community
          </a>
        </div>
      </div>
    </div>
  );
}
