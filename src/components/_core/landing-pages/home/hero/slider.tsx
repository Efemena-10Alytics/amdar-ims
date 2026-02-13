"use client";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const MOBILE_BREAKPOINT = 768;

const Slider = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const slidesItem = [
    "Business Analytics",
    "Cybersecurity",
    "Project Management",
    "DevOps",
    "Data Engineer",
  ];

  const [api, setApi] = React.useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  );

  const orientation = isMobile ? "horizontal" : "vertical";

  useEffect(() => {
    if (!api) return;
  }, [api]);

  return (
    <Carousel
      key={orientation}
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      orientation={orientation}
      className={
        orientation === "horizontal"
          ? "inline-block h-[1.2em] w-full max-w-[min(90vw,20ch)]"
          : "inline-block h-[1.2em] w-auto"
      }
    >
      <CarouselContent className="mt-0 h-[1.2em]">
        {slidesItem.map((item, index) => (
          <CarouselItem key={index} className="pt-0">
            <div
              className="text-primary lg:whitespace-nowrap gap-3 flex items-start justify-start shrink-0"
              style={{ lineHeight: "1.2em" }}
            >
              <h1>{item} </h1>
              {/* <h1 className="text-white">Project</h1> */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Slider;
