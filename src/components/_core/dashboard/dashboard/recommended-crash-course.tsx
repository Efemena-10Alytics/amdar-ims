"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RecommendedCrashCourse = () => {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-[#0B2B33]">Recommended Crash Course</h3>

      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#E8EFF1]">
        <Image
          src="/images/pngs/laptop.png"
          alt=""
          fill
          className="object-cover"
          sizes="380px"
        />
      </div>

      <h4 className="mt-4 text-base font-semibold leading-snug text-[#0B2B33] sm:text-lg">
        Agile Project Management Tool
      </h4>
      <p className="mt-1 text-sm text-[#667085]">By: Amdari training instructor</p>

      <Button
        asChild
        className="mt-5 h-11 w-full rounded-full bg-[#134E5E] text-sm font-semibold text-white hover:bg-[#0E6174]"
      >
        <Link href="#">Explore course</Link>
      </Button>
    </section>
  );
};

export default RecommendedCrashCourse;
