"use client";

import React from "react";
import Image from "next/image";
import { Play, MoreVertical } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowLeftCurve, ArrowRightCurve } from "./svg";
import { YoutubeVideo } from "../shared/youtube-video";
import { useYoutubeCaptions } from "../../../../features/youtube/use-youtube-caption";
import Aos from "aos";

// Custom Curved Arrow Icons

// Custom Navigation Buttons
const CustomCarouselPrevious = ({
  className,
  api,
}: {
  className?: string;
  api: CarouselApi | undefined;
}) => {
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);

  React.useEffect(() => {
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
      className={cn("w-10 h-10 rounded-full", className)}
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
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
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

  React.useEffect(() => {
    Aos.init();
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("w-10 h-10 rounded-full", className)}
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      aria-label="Next slide"
    >
      <ArrowRightCurve />
    </Button>
  );
};

/** Get YouTube thumbnail image URL from a watch URL or video ID. */
function getYoutubeThumbnail(urlOrId: string): string {
  const match = urlOrId.match(/(?:v=|\/vi\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : urlOrId;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const WhatOurInternsSays = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [imageErrors, setImageErrors] = React.useState<Record<number, boolean>>(
    {},
  );
  const [playingVideoUrl, setPlayingVideoUrl] = React.useState<string | null>(
    null,
  );

  const testimonials = [
    {
      id: 1,
      videoUrl:
        "https://www.youtube.com/watch?v=MME05VFUbUY&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z",
    },
    {
      id: 2,
      videoUrl:
        "https://www.youtube.com/watch?v=OzipG-7I3bU&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=3",
    },
    {
      id: 3,
      videoUrl:
        "https://www.youtube.com/watch?v=ab_c-mPVzEA&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=8",
    },
    {
      id: 4,
      videoUrl:
        "https://www.youtube.com/watch?v=GRSz3ndb-tQ&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=9",
    },
    {
      id: 5,
      videoUrl:
        "https://www.youtube.com/watch?v=kX1LWvJx9Ks&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=10",
    },
    {
      id: 6,
      videoUrl:
        "https://www.youtube.com/watch?v=jY-j0xYXzpo&list=PLZNtzcTK9hBYzlV-VPg-JZjbRjl4PP52Z&index=12",
    },
  ];

  const videoUrls = testimonials.map((t) => t.videoUrl);
  const { captions, isLoaded } = useYoutubeCaptions(videoUrls);

  const getCaption = (videoUrl: string) =>
    captions[videoUrl] ?? (isLoaded ? "Testimonial" : "Loading...");

  return (
    <div data-aos="fade-up" className="bg-white py-12 relative overflow-hidden">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] mb-4">
            What Our Interns Say
          </h2>
          <p className="text-[#092A31]/70 text-base lg:text-lg max-w-2xl mx-auto">
            Our interns have gone on to secure roles across the UK, US, Canada,
            and Africa.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-[28.57%]"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="relative group rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setPlayingVideoUrl(testimonial.videoUrl)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPlayingVideoUrl(testimonial.videoUrl);
                      }
                    }}
                    aria-label={`Play video: ${getCaption(testimonial.videoUrl)}`}
                  >
                    {/* Testimonial Image */}
                    <div className="relative w-full h-87.5 aspect-video bg-gray-200">
                      {!imageErrors[testimonial.id] ? (
                        <Image
                          src={getYoutubeThumbnail(testimonial.videoUrl)}
                          alt={`Testimonial ${testimonial.id}`}
                          fill
                          className="object-cover"
                          onError={() => {
                            setImageErrors((prev) => ({
                              ...prev,
                              [testimonial.id]: true,
                            }));
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Play className="w-16 h-16 text-white/50" />
                        </div>
                      )}

                      {/* Red YouTube-style play button (top-left) */}
                      <div className="absolute top-3 left-3">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      {/* Circular play button (center) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                        </div>
                      </div>

                      {/* Caption Overlay (bottom) */}
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white text-sm font-medium line-clamp-2 flex-1">
                            {getCaption(testimonial.videoUrl)}
                          </p>
                          <button
                            type="button"
                            className="text-white/80 hover:text-white transition-colors p-1"
                            aria-label="More options"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <CustomCarouselPrevious
                api={api}
                className={cn(
                  "bg-[#E8EFF1] text-[#092A31] hover:bg-[#D1D9DC] border-0",
                )}
              />
              <CustomCarouselNext
                api={api}
                className={cn(
                  "bg-primary text-white hover:bg-[#0f4d5a] border-0",
                )}
              />
            </div>
          </Carousel>
        </div>

        <Dialog
          open={!!playingVideoUrl}
          onOpenChange={(open) => !open && setPlayingVideoUrl(null)}
        >
          <DialogContent className="max-w-4xl w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden">
            <DialogTitle className="sr-only">Play testimonial video</DialogTitle>
            {playingVideoUrl && (
              <YoutubeVideo
                videoUrl={playingVideoUrl}
                autoplay
                title="Intern testimonial"
                className="w-full"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WhatOurInternsSays;
