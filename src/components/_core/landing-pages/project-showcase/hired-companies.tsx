import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COMPANY_LOGOS } from "@/constants/company-logos";

export default function HiredCompanies() {
  return (
    <section className="bg-[#E8EFF1] py-14 lg:py-20">
      <div className="app-width grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h2 className="max-w-lg font-clash-display text-3xl leading-[1.1] font-semibold tracking-tight text-[#092A31] sm:text-4xl lg:text-5xl">
            Companies who have hired our interns
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#64748B] sm:text-base">
            Our interns have gone on to work with leading companies across
            tech, finance, care, and beyond, proof that the right experience
            opens the right doors.
          </p>
          <Link
            href="/business-partners"
            className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#156374] py-1.5 pr-1.5 pl-5 text-sm font-medium text-white transition-colors hover:bg-[#0f4d5a] sm:h-13 sm:text-base"
          >
            Be a business partners
            <span className="flex size-7 items-center justify-center rounded-full bg-[#FFE082] text-[#156374] sm:size-8">
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>

        <ul className="grid w-full max-w-md grid-cols-3 gap-2.5 justify-self-end sm:max-w-lg sm:gap-3">
          {COMPANY_LOGOS.map((company) => (
            <li
              key={company.src}
              className="flex aspect-square items-center justify-center rounded-lg bg-[#C5D5DB] p-2.5 sm:p-3.5"
            >
              <Image
                src={company.src}
                alt={company.alt}
                width={120}
                height={60}
                className="max-h-9 w-auto max-w-[82%] object-contain sm:max-h-11"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
