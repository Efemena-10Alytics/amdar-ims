"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowLeftCurve, ArrowRightCurve } from "../home/svg";

const galleryImages = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
];

const TeamGallery = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="app-width pr-0">
        <h3 className="text-5xl font-semibold text-[#113640]">Team Gallery</h3>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="mt-8 w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3 p-6">
            {galleryImages.map((image, index) => (
              <CarouselItem key={`${image}-${index}`} className="pl-2 hover:p-6 md:basis-1/3 md:pl-3">
                <div
                  className="h-76 overflow-hidden rounded-md bg-[#8EA3AD] hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label={`Team gallery image ${index + 1}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-10 flex justify-end gap-3 px-5">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="inline-flex size-10 items-center justify-center rounded-full border border-[#9AB1BA] text-[#7E97A0]"
            aria-label="Previous gallery image"
          >
            <ArrowLeftCurve />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="inline-flex size-10 items-center justify-center rounded-full bg-[#1B7687] text-white"
            aria-label="Next gallery image"
          >
            <ArrowRightCurve />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamGallery;
