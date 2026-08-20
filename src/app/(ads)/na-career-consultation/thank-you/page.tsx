"use client";

import Link from "next/link";
import Image from "next/image";

// TODO: add the North America WhatsApp community link and surface a
// "Join WhatsApp Community" button here, matching /career-consultation/thank-you.

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
            You&apos;re booked!
          </h1>

          <p className="mb-8 text-[15px] leading-[1.65] text-[#C7D5D6]">
            Check your email for more details about this session. We will also
            be calling to remind you before we go live.
          </p>

          <Link
            href="/na-career-consultation"
            className="text-[13px] text-[#2B7F95] underline-offset-2 hover:underline"
          >
            Back to consultation page
          </Link>
        </div>
      </div>
    </div>
  );
}
