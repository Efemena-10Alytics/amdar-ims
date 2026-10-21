"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type SuccessStoryItem = {
  id: number;
  flag: string;
  name: string;
  story: string;
};

const DEFAULT_ITEMS: SuccessStoryItem[] = [
  {
    id: 1,
    flag: "🇩🇪",
    name: "Amber Jay",
    story:
      "He joined our April 2025 Cohort and Landed a Data Analyst Job in the UK in August 2025",
  },
  {
    id: 2,
    flag: "🇬🇧",
    name: "James A.",
    story:
      "Landed a Data Analyst role within 3 months of completing the program. The portfolio projects made all the difference.",
  },
  {
    id: 3,
    flag: "🇺🇸",
    name: "Sarah Williams",
    story:
      "Completed the Cybersecurity internship and secured a role as a penetration tester. The mentorship was invaluable.",
  },
  {
    id: 4,
    flag: "🇳🇬",
    name: "Aliagha Gladys",
    story:
      "From intern to consultant—the real-world projects and cross-team collaboration prepared me for my current role.",
  },
  {
    id: 5,
    flag: "🇨🇦",
    name: "Simon Chuks",
    story:
      "The Business Analyst internship gave me hands-on experience that directly led to my job offer at a UK consultancy.",
  },
];

const AUTO_SCROLL_MS = 4500;

const VerticalCarousel = ({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: SuccessStoryItem[];
  className?: string;
}) => {
  const [api, setApi] = useState<CarouselApi>(undefined);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTO_SCROLL_MS);
    return () => clearInterval(interval);
  }, [api]);

  const viewportHeight = 140;

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
        skipSnaps: false,
      }}
      orientation="vertical"
      className={cn("w-full max-w-sm overflow-hidden", className)}
      style={{ height: viewportHeight }}
    >
      <CarouselContent className="flex flex-col" style={{ height: viewportHeight }}>
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pt-4 shrink-0"
            style={{ height: viewportHeight, minHeight: viewportHeight }}
          >
            <div className="h-full flex flex-col justify-center bg-[#F1F5F9] p-2 rounded-xl">
              <div className="flex gap-4">
                <span className="text-2xl shrink-0 border rounded-full h-12 w-12 flex items-center justify-center" aria-hidden>
                  {item.flag}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#092A31] text-base mb-1">
                    {item.name}
                  </p>
                  <p className="text-sm text-[#64748B] leading-snug">
                    {item.story}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default VerticalCarousel;
