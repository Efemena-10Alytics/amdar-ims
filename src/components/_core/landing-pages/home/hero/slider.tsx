"use client";
import React, { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const Slider = () => {
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

  useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
        axis: "y",
      }}
      orientation="vertical"
      className="inline-block h-[1.2em] w-auto"
    >
      <CarouselContent className="mt-0 h-[1.2em]">
        {slidesItem.map((item, index) => (
          <CarouselItem key={index} className="pt-0">
            <div
              className="text-amdari-yellow lg:whitespace-nowrap gap-3 flex items-center justify-center"
              style={{ lineHeight: "1.2em" }}
            >
              <h1>{item} </h1>
              <h1 className="text-white">Project</h1>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Slider;
