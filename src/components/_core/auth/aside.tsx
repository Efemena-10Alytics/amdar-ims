"use client";

import { useCallback, useEffect, useState } from "react";
import { Play } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Flag from "../landing-pages/home/hero/flag";

const TESTIMONIALS = [
  {
    heading: "TRUSTED BY OVER 10K+ USERS",
    quote:
      "Within 3 months of completing the program, I got 4 job offers. The interview prep were game-changers",
    author: "Amber Jay",
  },
  {
    heading: "TRUSTED BY OVER 10K+ USERS",
    quote:
      "Within 3 months of completing the program, I got 4 job offers. The interview prep were game-changers",
    author: "Adaji Mukhtar",
  },
  {
    heading: "TRUSTED BY OVER 10K+ USERS",
    quote:
      "Within 3 months of completing the program, I got 4 job offers. The interview prep were game-changers",
    author: "Eden Hazard",
  },
];

const Aside = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((carouselApi: CarouselApi | undefined) => {
    if (carouselApi) setSelectedIndex(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    const carouselApi = api;
    if (!carouselApi) return;
    onSelect(carouselApi);
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <aside className="hidden rounded-l-xl overflow-y-auto lg:flex lg:w-[45%] xl:w-[42%] flex-col bg-[#0F4652] text-white p-4 xl:p-5">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-tight">
        <Image src={"/logo-white.svg"} height={52} width={100} alt="amdari" />
      </Link>

      {/* Video thumbnail */}
      <div className="mt-8 relative aspect-video max-w-md rounded-xl overflow-hidden bg-[#156374]">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#0F4652] hover:bg-white transition-colors"
            aria-label="Play welcome video"
          >
            <Play className="h-6 w-6 ml-1" fill="currentColor" />
          </button>
        </div>
        <p className="absolute bottom-3 left-3 right-3 text-sm font-medium">
          Welcome here
        </p>
      </div>

      {/* Testimonial carousel */}
      <div className="mt-8 w-full bg-[#135A6A]/60 p-3 rounded-xl overflow-hidden">
        <p className="text-lg font-semibold tracking-wide text-[#93B7BF] uppercase">
          TRUSTED BY OVER 10K+ USERS
        </p>
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        >
          <CarouselContent>
            {TESTIMONIALS.map((item, index) => (
              <CarouselItem key={index}>
                <blockquote className="mt-3 text-sm leading-relaxed text-[#E8EFF1]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="flex justify-between">
                  <div className="mt-4 flex items-center gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => api && api.scrollTo(i)}
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors",
                          i === selectedIndex ? "bg-[#FFE082]" : "bg-white/40",
                        )}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-right text-xs text-white/80">
                    {item.author}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Bottom stat */}
      <div className="mt-4 flex items-center text-xs text-[#B6CFD4]">
        <Flag width={18} />
        <span>+10K interns Across the world Got hired</span>
      </div>
    </aside>
  );
};

export default Aside;
