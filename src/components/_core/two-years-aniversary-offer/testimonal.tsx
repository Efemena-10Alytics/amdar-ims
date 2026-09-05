"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getYoutubeThumbnail } from "@/features/testimonials/constants";

type TestimonialMode = "video" | "text";

const FEATURED_VIDEO_URL = "https://youtu.be/8LGJkze6k_U";

function getYoutubeVideoId(urlOrId: string): string | null {
  const match = urlOrId.match(
    /(?:v=|\/vi\/|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/,
  );
  if (match) return match[1];
  return urlOrId.length === 11 ? urlOrId : null;
}

type TextTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  outcomeRole: string;
  company: string;
  avatarBg: string;
  flag: string;
};

const TEXT_TESTIMONIALS: TextTestimonial[] = [
  {
    id: "1",
    name: "Obinna Nnamdi Nkemakolam",
    role: "",
    quote:
      "I signed up with Amdari because of the ads, reviews, and testimonials I came across, and honestly, they truly lived up to my expectations. From the moment I joined, I was impressed by how well structured, focused, and organized the company is. There were plenty of projects, classes, mentorship sessions, and opportunities. A special shout out to the preceptor of my cohort, @Remilekun, for the guidance, support, and dedication throughout the journey. He's doing an amazing job! Also @Damilola for checking up how things was going during the journey and the rest of the teams Truly, joining Amdari has been a great and smooth experience, and I'm genuinely grateful. Thank you, Amdari! 🙌",
    outcomeRole: "",
    company: "",
    avatarBg: "#F3C6B0",
    flag: "/images/svgs/country/UK.svg",
  },
  {
    id: "2",
    name: "Rilwan Olakunle Bolaji",
    role: "",
    quote:
      "This program, helped me grow by teaching what I needed to do to be an experienced professional",
    outcomeRole: "",
    company: "",
    avatarBg: "#C5D4D8",
    flag: "/images/svgs/country/NG.svg",
  },
  {
    id: "3",
    name: "Ndiana-Abasi Okon",
    role: "",
    quote:
      "Amdari work experience programme has been an impactful journey that truly helped me transform my career. The individual projects, group discussions, feedback sessions, mentorship sessions, interview preparation, CV guidance, and LinkedIn optimisation support were all incredibly valuable. I met great minds and the mentors are super Amazing.",
    outcomeRole: "",
    company: "",
    avatarBg: "#F97316",
    flag: "/images/svgs/country/UK.svg",
  },
];

const CARDS_PER_PAGE = 3;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 32V17.6C0 12.8 1.07 8.93 3.2 6C5.33 2.93 8.53 1.07 12.8 0.4V7.2C10.67 7.73 9.07 8.8 8 10.4C6.93 12 6.4 14.27 6.4 17.2H12.8V32H0ZM27.2 32V17.6C27.2 12.8 28.27 8.93 30.4 6C32.53 2.93 35.73 1.07 40 0.4V7.2C37.87 7.73 36.27 8.8 35.2 10.4C34.13 12 33.6 14.27 33.6 17.2H40V32H27.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: TestimonialMode;
  onChange: (mode: TestimonialMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full bg-[#E8EFF1] p-1"
      role="tablist"
      aria-label="Testimonial type"
    >
      {(
        [
          { id: "video", label: "Video Testimonial" },
          { id: "text", label: "Text Testimonial" },
        ] as const
      ).map((option) => {
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              isActive
                ? "bg-[#C5D4D8] text-[#0C3640] shadow-sm"
                : "text-[#64748B] hover:text-[#0C3640]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function TextTestimonialCard({ item }: { item: TextTestimonial }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,70,82,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#1F2937]"
            style={{ backgroundColor: item.avatarBg }}
            aria-hidden
          >
            {getInitials(item.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#092A31] sm:text-base">
              {item.name}
            </p>
            {item.role ? (
              <p className="truncate text-xs text-[#64748B] sm:text-sm">
                {item.role}
              </p>
            ) : null}
          </div>
        </div>
        <Image
          src={item.flag}
          alt=""
          width={22}
          height={22}
          className="mt-0.5 shrink-0 rounded-full"
        />
      </div>

      <QuoteMark className="mt-5 size-7 text-[#C8D5DA] sm:size-8" />

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#0C3640] sm:text-[15px]">
        {item.quote}
      </p>

      {item.outcomeRole || item.company ? (
        <div className="mt-5 rounded-xl bg-[#E8EFF1] px-4 py-3">
          {item.outcomeRole ? (
            <p className="text-sm font-semibold text-[#092A31]">
              {item.outcomeRole}
            </p>
          ) : null}
          {item.company ? (
            <p className="text-xs text-[#64748B] sm:text-sm">{item.company}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function FeaturedVideoTestimonial({ videoUrl }: { videoUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoId = getYoutubeVideoId(videoUrl);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.isIntersecting);
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-64 w-full overflow-hidden rounded-2xl bg-[#0F4652] sm:h-80 sm:rounded-3xl md:h-96 lg:h-112"
    >
      {isPlaying && videoId ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Video testimonial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={getYoutubeThumbnail(videoUrl)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <span className="absolute bottom-5 left-5 flex items-center gap-3 sm:bottom-7 sm:left-7 sm:gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/20 sm:size-16">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#156374] text-white sm:size-11">
                <Play className="ml-0.5 size-5 fill-current" />
              </span>
            </span>
            <span className="text-base font-medium text-white sm:text-lg">
              Play to view
            </span>
          </span>
        </>
      )}
    </div>
  );
}

function PageDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mt-8 flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Testimonial pages"
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to page ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              isActive ? "w-10 bg-[#0F4652]" : "w-5 bg-[#D0D9DD] hover:bg-[#B6C4C9]",
            )}
          />
        );
      })}
    </div>
  );
}

export type SuccessStoriesShowcaseProps = {
  className?: string;
};

export function SuccessStoriesShowcase({
  className,
}: SuccessStoriesShowcaseProps) {
  const [mode, setMode] = useState<TestimonialMode>("video");
  const [api, setApi] = useState<CarouselApi>();
  const [pageIndex, setPageIndex] = useState(0);
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  const textPages = useMemo(() => {
    const pages: TextTestimonial[][] = [];
    for (let i = 0; i < TEXT_TESTIMONIALS.length; i += CARDS_PER_PAGE) {
      pages.push(TEXT_TESTIMONIALS.slice(i, i + CARDS_PER_PAGE));
    }
    return pages;
  }, []);

  const pageCount = textPages.length;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setPageIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    setPageIndex(0);
    api?.scrollTo(0);
  }, [mode, api]);

  const handleSelectPage = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <section
      className={cn("w-full pb-12 sm:pb-16 lg:pb-20 bg-[#E8EFF1]/10 -translate-y-18 sm:-translate-y-20 md:-translate-y-30", className)}
      aria-labelledby="success-stories-showcase-heading"
    >
      <div className="app-width">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              id="success-stories-showcase-heading"
              className="font-clash-display text-3xl font-semibold text-[#092A31] sm:text-4xl"
            >
              Success Stories Showcase
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">
              A handful of the careers that have changed course through
              Amdari&apos;s programmes and internships.
            </p>
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div className="mt-8 sm:mt-10">
          {mode === "video" ? (
            <FeaturedVideoTestimonial videoUrl={FEATURED_VIDEO_URL} />
          ) : (
            <>
              <Carousel
                setApi={setApi}
                plugins={[autoplay.current]}
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 py-4">
                  {textPages.map((page, pageIdx) => (
                    <CarouselItem key={`text-page-${pageIdx}`} className="pl-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {page.map((item) => (
                          <TextTestimonialCard key={item.id} item={item} />
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {pageCount > 1 ? (
                <PageDots
                  count={pageCount}
                  activeIndex={pageIndex}
                  onSelect={handleSelectPage}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SuccessStoriesShowcase;
