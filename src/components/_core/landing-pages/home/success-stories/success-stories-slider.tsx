"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftCurve, ArrowRightCurve } from "../svg";

// Custom Navigation Buttons
const CustomCarouselPrevious = ({
  className,
  api,
}: {
  className?: string;
  api: CarouselApi | undefined;
}) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "w-10 h-10 rounded-full bg-white border-primary/30 text-gray-600 hover:bg-white/80",
        className
      )}
      disabled={!canScrollPrev}
      onClick={() => api?.scrollPrev()}
      aria-label="Previous slide"
    >
      <ArrowLeftCurve />
    </Button>
  );
};

const CustomCarouselNext = ({
  className,
  api,
}: {
  className?: string;
  api: CarouselApi | undefined;
}) => {
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 border-0",
        className
      )}
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      aria-label="Next slide"
    >
      <ArrowRightCurve />
    </Button>
  );
};

const AVATAR_BG_COLORS = [
  "#0f766e", // teal
  "#1d4ed8", // blue
  "#15803d", // green
  "#7c3aed", // violet
  "#c2410c", // orange
  "#be123c", // rose
  "#0e7490", // cyan
  "#4f46e5", // indigo
  "#a16207", // amber
  "#9f1239", // pink
];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarBgColor(id: number): string {
  return AVATAR_BG_COLORS[id % AVATAR_BG_COLORS.length];
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

interface SuccessStoriesSliderProps {
  testimonials: Testimonial[];
  current: number;
  onApiChange?: (api: CarouselApi | undefined) => void;
}

const AUTO_SLIDE_INTERVAL_MS = 5000;

const SuccessStoriesSlider = ({
  testimonials,
  current,
  onApiChange,
}: SuccessStoriesSliderProps) => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (onApiChange) {
      onApiChange(api);
    }
  }, [api, onApiChange]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative mb-8 px-12">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-2xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={testimonial.id}
              className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <div className="relative flex py-10 items-center justify-center">
                <div
                  className={cn(
                    "relative flex w-16 h-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white transition-all duration-300",
                    current === index
                      ? "ring-2 ring-pink-200 scale-110"
                      : "blur-xs opacity-60"
                  )}
                  style={{ backgroundColor: getAvatarBgColor(testimonial.id) }}
                  aria-hidden
                >
                  {getInitials(testimonial.name)}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center absolute -left-12 -right-12 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="pointer-events-auto">
            <CustomCarouselPrevious api={api} />
          </div>
          <div className="pointer-events-auto">
            <CustomCarouselNext api={api} />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default SuccessStoriesSlider;
