"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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

  return (
    <div className="relative mb-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 w-[80%] mx-auto">
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={testimonial.id}
              className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={cn(
                    "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-300",
                    current === index
                      ? "ring-2 ring-pink-200 scale-110"
                      : "blur-sm opacity-60"
                  )}
                >
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center absolute left-0 right-0 top-1/2 -translate-y-1/2 px-4 pointer-events-none">
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
