"use client";

import { useEffect } from "react";
import Image from "next/image";
import Aos from "aos";
import { cn } from "@/lib/utils";
import CustomButton from "../shared/custom-button";

const COMPANY_LOGOS: { src: string; alt: string }[] = [
  { src: "/images/svgs/companies/un.svg", alt: "United Nations" },
  { src: "/images/svgs/companies/nhs.svg", alt: "NHS" },
  { src: "/images/svgs/companies/age-uk.svg", alt: "Age UK" },
  { src: "/images/svgs/companies/nhf.svg", alt: "National Housing Federation" },
  { src: "/images/svgs/companies/hsbc.svg", alt: "HSBC" },
  { src: "/images/svgs/companies/rgs.svg", alt: "Royal Geographical Society" },
  { src: "/images/svgs/companies/ukri.svg", alt: "UK Research and Innovation" },
  { src: "/images/svgs/companies/amdari.svg", alt: "Amdari" },
  { src: "/images/svgs/companies/croydon.svg", alt: "Croydon Council" },
  { src: "/images/svgs/companies/national-grid.svg", alt: "National Grid" },
  { src: "/images/svgs/companies/deloitte.svg", alt: "Deloitte" },
  { src: "/images/svgs/companies/mcc.svg", alt: "Manchester City Council" },
  { src: "/images/svgs/companies/lowry.svg", alt: "The Lowry" },
  { src: "/images/svgs/companies/gu.svg", alt: "GOV.UK" },
  { src: "/images/svgs/companies/fsshsse.svg", alt: "Health and Safety Executive" },
];

export default function Companies() {
  useEffect(() => {
    Aos.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 40,
    });
  }, []);

  return (
    <section
      className="bg-[#F0F4F8] py-14 lg:py-20 -translate-y-25"
      aria-labelledby="companies-heading"
    >
      <div className="">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div
            className="app-width max-w-lg shrink-0 lg:pt-1"
            data-aos="fade-right"
          >
            <h2
              id="companies-heading"
              className="text-3xl font-semibold leading-tight text-[#092A31] lg:text-4xl"
            >
              Companies who have hired our interns
            </h2>
            {/* <p
              className="mt-4 mb-6 text-base leading-relaxed text-[#475467] lg:text-lg"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              Our interns have gone on to work with leading companies across
              tech, finance, care, and beyond — proof that the right experience
              opens the right doors.
            </p> */}
            <div data-aos="fade-up" data-aos-delay="140" className="mt-4">
              <CustomButton btnText="Be a business partner" />
            </div>
          </div>

          <div
            className="relative min-w-0 flex-1 overflow-hidden"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div
              className="flex w-max gap-3 sm:gap-4"
              style={{
                animation: "companies-scroll 45s linear infinite",
              }}
            >
              {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, index) => {
                const isAmdari = company.src.includes("amdari");
                return (
                  <div
                    key={`${company.src}-${index}`}
                    className={cn(
                      "flex size-24 shrink-0 items-center justify-center rounded-xs p-4 sm:size-28 sm:p-5",
                      isAmdari ? "bg-transparent" : "bg-[#E2E8F0]",
                    )}
                  >
                    <Image
                      src={company.src}
                      alt={company.alt}
                      width={140}
                      height={72}
                      className="max-h-14 w-auto max-w-full object-contain sm:max-h-16"
                    />
                  </div>
                );
              })}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#F0F4F8] to-transparent sm:w-12"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#F0F4F8] to-transparent sm:w-12"
              aria-hidden
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes companies-scroll {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                `,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
