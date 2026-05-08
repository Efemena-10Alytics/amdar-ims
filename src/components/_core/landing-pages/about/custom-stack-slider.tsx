"use client";

import React, { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export type TeamSlide = {
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
};

type StackSliderProps = {
  slides: TeamSlide[];
  setApi: (api: CarouselApi) => void;
  initialIndex?: number;
};

export default function CustomStackSlider({
  slides,
  setApi,
  initialIndex = 0,
}: StackSliderProps) {
  const [internalApi, setInternalApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!internalApi) return;
    internalApi.scrollTo(initialIndex, true);
  }, [initialIndex, internalApi]);

  const handleSetApi = (api: CarouselApi) => {
    setInternalApi(api);
    setApi(api);
  };

  return (
    <div className="flex w-full justify-center bg-transparent py-4">
      <div className="relative h-84 w-full max-w-135">
        {[6, 5, 4, 3, 2, 1].map((layer) => (
          <div
            key={layer}
            className="pointer-events-none absolute left-1/2 h-52 -translate-x-1/2 rounded-[14px] border border-[#1E6B78] bg-linear-to-r from-[#0A3F4E] via-[#0A4A5A] to-[#0A6675]"
            style={{
              width: `${96 - layer * 2.2}%`,
              bottom: `${-layer * 6}px`,
              opacity: 0.95 - layer * 0.08,
              zIndex: layer,
            }}
          />
        ))}

        <Carousel
          setApi={handleSetApi}
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 2600,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="absolute top-31 left-1/2 z-20 w-[96%] -translate-x-1/2"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.badge}>
                <article className="h-52 overflow-hidden rounded-[14px] border border-[#2A7B89] bg-linear-to-r from-[#0A3F4E] via-[#0A4A5A] to-[#0A6675] p-6 text-white shadow-[0_10px_22px_rgba(6,43,51,0.34)]">
                  <div className="relative flex gap-5">
                    <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-white/10 font-bold">
                      {slide.badge}
                    </div>
                    <div>
                      <h2 className="mb-2 text-xl font-bold leading-none">
                        {slide.title}
                      </h2>
                      <p className="text-sm text-white/90">{slide.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 text-3xl opacity-30">↗</div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}