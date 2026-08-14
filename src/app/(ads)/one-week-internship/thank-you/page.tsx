"use client";

import Link from "next/link";
import Image from "next/image";

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
            You&apos;re in!
          </h1>

          <p className="mb-8 text-[15px] leading-[1.65] text-[#C7D5D6]">
            Check your inbox — we&apos;ll be in touch shortly to confirm your
            internship week and share everything you need to get started on
            day one.
          </p>

          <Link
            href="/one-week-internship"
            className="text-[13px] text-[#2B7F95] underline-offset-2 hover:underline"
          >
            Back to internship page
          </Link>
        </div>
      </div>
    </div>
  );
}
