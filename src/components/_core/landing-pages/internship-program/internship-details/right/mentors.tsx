"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftCurve, ArrowRightCurve } from "../../../home/svg";

interface Mentor {
  id: number;
  name: string;
  title: string;
  image: string;
  linkedin: string;
}

interface MentorsProps {
  mentors: Mentor[];
}

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
        "w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={() => api?.scrollPrev()}
      aria-label="Previous mentor"
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
        "w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50",
        className,
      )}
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      aria-label="Next mentor"
    >
      <ArrowRightCurve />
    </Button>
  );
};

const Mentors = ({ mentors }: MentorsProps) => {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="relative mb-10">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {mentors.map((mentor) => (
            <CarouselItem key={mentor.id} className="basis-full">
              <div className="relative bg-[#E8EFF1] rounded-lg overflow-hidden mb-4">
                <div className="relative w-full h-92">
                  <Image
                    src={"/images/pngs/woman.png"}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay with Name and Title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">
                          {mentor.name}
                        </h4>
                        <p className="text-white/90 text-sm">{mentor.title}</p>
                      </div>

                      {/* LinkedIn Icon */}
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-[#092A31] rounded flex items-center justify-center hover:bg-[#0f4d5a] transition-colors"
                        aria-label="LinkedIn profile"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-end gap-4 mt-4">
          <CustomCarouselPrevious api={api} />
          <CustomCarouselNext api={api} />
        </div>
      </Carousel>
    </div>
  );
};

export default Mentors;
