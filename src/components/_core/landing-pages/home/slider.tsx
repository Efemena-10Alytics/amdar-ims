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
            <span
              className="text-amdari-yellow lg:whitespace-nowrap block"
              style={{ lineHeight: "1.2em" }}
            >
              {item} {" "}
              <span className="text-white">Project</span>
            </span>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Slider;
