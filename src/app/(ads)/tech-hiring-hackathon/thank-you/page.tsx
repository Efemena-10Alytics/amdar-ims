"use client";

import Link from "next/link";
import Image from "next/image";

const WHATSAPP_LINK = "https://chat.whatsapp.com/Jt1XfqhcofE8bkIf5jCBTB";

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

          <h1 className="mb-3 text-2xl font-black tracking-[-0.02em] text-white">
            You&apos;re registered!
          </h1>

          <p className="mb-8 text-[15px] leading-[1.65] text-[#C7D5D6]">
            Check your inbox — we&apos;ll be in touch with the job description
            and everything you need to prepare. Join the WhatsApp community
            below to stay updated and connect with other participants.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFE082] py-3.5 text-sm font-bold uppercase tracking-[0.02em] text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F]"
          >
            Join Community
          </a>

          <Link
            href="/tech-hiring-hackathon"
            className="text-[13px] text-[#2B7F95] underline-offset-2 hover:underline"
          >
            Back to event page
          </Link>
        </div>
      </div>
    </div>
  );
}
