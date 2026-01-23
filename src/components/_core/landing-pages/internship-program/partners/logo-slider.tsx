"use client";

import React, { useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const LogoSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );

  const partners = [
    {
      name: "AssetGuard",
      logo: "/images/svgs/partners-logo/asset-guard.svg",
    },
    {
      name: "Credify",
      logo: "/images/svgs/partners-logo/credify.svg",
    },
    {
      name: "CryptoNest",
      logo: "/images/svgs/partners-logo/cryptonest.svg",
    },
    {
      name: "EcoNest",
      logo: "/images/svgs/partners-logo/eco-nest.svg",
    },
  ];

  return (
    <div className="max-w-225 mx-auto overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {partners.map((partner, index) => (
            <CarouselItem
              key={`${partner.name}-${index}`}
              className="basis-1/2 md:basis-1/4"
            >
              <div className="relative w-full h-20 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default LogoSlider;
