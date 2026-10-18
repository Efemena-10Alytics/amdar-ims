"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { getImageUrl } from "@/lib/utils";
import type { InternshipProgram } from "@/types/internship-program";

const CARD_BACKGROUNDS = ["bg-[#F6F1E8]", "bg-[#E7F3EE]", "bg-[#F7F6F2]"];
const FALLBACK_IMAGE = "/images/pngs/internship.png";

const ConsultantsDeliver = () => {
  const { data, isLoading } = useGetInternshipPrograms();
  const programs = (
    Array.isArray(data)
      ? data
      : ((data as { data?: InternshipProgram[] } | undefined)?.data ?? [])
  ) as InternshipProgram[];
  const autoplay = useRef(
    Autoplay({
      delay: 3200,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <div className="relative z-10 -mt-8 grid items-center gap-8 rounded-t-[32px] bg-[#187F8C] pt-8 lg:-mt-12 lg:grid-cols-[minmax(220px,320px)_1fr] lg:gap-10 lg:rounded-t-[48px] lg:pt-10">
      <div className="px-2 sm:px-4 lg:px-6">
        <h2 className="text-3xl leading-tight font-semibold text-white sm:text-4xl">
          Where our consultants deliver
        </h2>
        <p className="mt-3 max-w-xs text-sm text-white/85 sm:text-base">
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

      <div className="relative min-w-0 overflow-hidden">
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
          <Carousel
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
                    className="flex basis-[280px] sm:basis-[320px]"
                  >
                    <Link
                      href={`/internship/${program.slug}`}
                      className={`flex h-full w-full flex-col rounded-3xl p-4 ${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`}
                    >
                      <h3 className="text-lg font-semibold text-[#092A31]">
                        {program.title}
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
                      <p className="mt-3 line-clamp-3 text-sm leading-snug text-[#3D4F55]">
                        {program.description}
                      </p>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default ConsultantsDeliver;
