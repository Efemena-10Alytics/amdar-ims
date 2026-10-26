"use client";

// import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
// import Autoplay from "embla-carousel-autoplay";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { getImageUrl } from "@/lib/utils";
import type { InternshipProgram } from "@/types/internship-program";

const CARD_BACKGROUNDS = ["bg-[#F6F1E8]", "bg-[#E7F3EE]", "bg-[#F7F6F2]"];
const FALLBACK_IMAGE = "/images/pngs/internship.png";
const TITLE_NOISE =
  /\b(work experience|internship|programme|program|career|track)\b/gi;
const SHORT_FORMS: Array<[RegExp, string]> = [
  [/\bsoc\b/, "SOC"],
  [/\bgrc\b/, "GRC"],
  [/cybersecurity|cyber security/, "Cybersecurity"],
  [/data analy/, "Data Analysis"],
  [/data science/, "Data Science"],
  [/data engineer/, "Data Engineering"],
  [/product design/, "Product Design"],
  [/product manage/, "Product Management"],
  [/project manage/, "Project Management"],
  [/business analy/, "Business Analytics"],
  [/ethical hack/, "Ethical Hacking"],
  [/app and cloud|cloud security/, "Cloud Security"],
];

function getProgramShortTitle(title: string) {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, shortTitle] of SHORT_FORMS) {
    if (pattern.test(normalized)) return shortTitle;
  }

  const words = normalized
    .replace(new RegExp(TITLE_NOISE.source, "gi"), " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return title.trim();

  return words
    .split(" ")
    .map((word) =>
      word.length <= 3
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

const ConsultantsDeliver = () => {
  const { data, isLoading } = useGetInternshipPrograms();
  const programs = (
    Array.isArray(data)
      ? data
      : ((data as { data?: InternshipProgram[] } | undefined)?.data ?? [])
  ) as InternshipProgram[];
  // const autoplay = useRef(
  //   Autoplay({
  //     delay: 3200,
  //     stopOnInteraction: false,
  //     stopOnMouseEnter: true,
  //   }),
  // );

  return (
    <div className="relative z-10 -mt-8 grid items-center gap-8 rounded-t-[32px] bg-[#187F8C] pt-8 lg:-mt-12 lg:grid-cols-[minmax(280px,440px)_1fr] lg:gap-10 lg:rounded-t-[48px] lg:pt-10">
      <div className="px-2 sm:px-4 lg:px-6">
        <h2 className="text-3xl leading-tight font-semibold text-white sm:text-4xl">
          Where our consultants deliver
        </h2>
        <p className="mt-3 max-w-sm text-sm text-white/85 sm:text-base">
          Some of our current Work Experience Programmes
        </p>
        <Link
          href="/internship"
          className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#F6D56A] py-2 pr-2 pl-5 text-sm font-semibold text-[#0E4C58] transition-colors duration-300 hover:bg-[#0E4C58] hover:text-[#F6D56A] sm:text-base"
        >
          Explore careers
          <span className="flex size-8 items-center justify-center rounded-full bg-[#0E4C58] text-[#F6D56A] transition-colors duration-300 group-hover:bg-[#F6D56A] group-hover:text-[#0E4C58]">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>

      <div className="consultants-deliver relative min-w-0 overflow-hidden">
        {isLoading ? (
          <div className="flex gap-4 pb-2 pl-2 sm:pl-4 lg:pl-0">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 w-[280px] shrink-0 animate-pulse rounded-3xl bg-white/20 sm:w-[320px]"
              />
            ))}
          </div>
        ) : (
          <>
          {/* <Carousel
            opts={{ align: "start", loop: true, duration: 35 }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="items-stretch">
              {programs.map((program, index) => {
                const imageSrc = getImageUrl(program.image) || FALLBACK_IMAGE;
                return (
                  <CarouselItem
                    key={program.id}
                    className="flex basis-[85%] lg:basis-[calc(100%*3/7)]"
                  >
                    <Link
                      href={`/internship/${program.slug}`}
                      className={`flex h-full w-full flex-col rounded-3xl p-4 ${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`}
                    >
                      <h3
                        className="text-lg font-semibold text-[#092A31]"
                        title={program.title}
                      >
                        {getProgramShortTitle(program.title)}
                      </h3>
                      <div className="relative mt-3 aspect-4/3 overflow-hidden rounded-2xl">
                        <Image
                          src={imageSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                          unoptimized={!imageSrc.startsWith("/")}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel> */}
          <div className="consultants-deliver-scroll flex w-max pb-2">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 gap-4 pr-4"
                aria-hidden={copy === 1}
              >
                {programs.map((program, index) => {
                  const imageSrc = getImageUrl(program.image) || FALLBACK_IMAGE;
                  return (
                    <Link
                      key={`${program.id}-${copy}`}
                      href={`/internship/${program.slug}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className={`flex w-[280px] shrink-0 flex-col rounded-3xl p-4 sm:w-[320px] ${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`}
                    >
                      <h3
                        className="text-lg font-semibold text-[#092A31]"
                        title={program.title}
                      >
                        {getProgramShortTitle(program.title)}
                      </h3>
                      <div className="relative mt-3 aspect-4/3 overflow-hidden rounded-2xl">
                        <Image
                          src={imageSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="320px"
                          unoptimized={!imageSrc.startsWith("/")}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          <style>{`
            .consultants-deliver-scroll {
              animation: consultants-deliver-scroll 40s linear infinite;
            }
            .consultants-deliver:hover .consultants-deliver-scroll {
              animation-play-state: paused;
            }
            @keyframes consultants-deliver-scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .consultants-deliver-scroll { animation: none; }
            }
          `}</style>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsultantsDeliver;
