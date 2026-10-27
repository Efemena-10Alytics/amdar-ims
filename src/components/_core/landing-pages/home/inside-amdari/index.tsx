"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import ReactPlayer from "react-player";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getYoutubeThumbnail } from "@/features/testimonials/constants";
import {
  ArrowLeftCurve,
  ArrowRightCurve,
} from "@/components/_core/landing-pages/home/svg";
import { cn } from "@/lib/utils";

const INSIDE_AMDARI_VIDEOS = [
  // { id: 1, videoUrl: "https://youtu.be/FHdp8c-Y7fg" },
  { id: 2, videoUrl: "https://youtu.be/XsaBrA9vlAs" },
  { id: 3, videoUrl: "https://youtu.be/VcXN9FrCtmg" },
  { id: 4, videoUrl: "https://youtu.be/AnP2jFk7ZAo" },
];

const InsideAmdari = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setPlayingVideoId(null);
    };

    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="app-width">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-[#092A31] sm:text-4xl lg:text-5xl">
            Inside Amdari Consulting
          </h2>
          <p className="mt-3 text-sm text-[#5E7278] sm:text-base">
            Our Consultants Work in Action Across Multiple Projects for
            companies in the UK/US/Canada
          </p>
        </div>
      </div>

      <div className="mt-8 w-full pl-4 sm:pl-6 xl:pl-[max(4rem,calc((100vw-100rem)/2+4rem))] lg:mt-10">
        <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
          <CarouselContent className="items-center">
            {INSIDE_AMDARI_VIDEOS.map((video, index) => {
              const isActive = index === selectedIndex;
              const isPlaying = playingVideoId === video.id;

              return (
                <CarouselItem key={video.id} className="basis-[88vw] pr-4">
                  {isPlaying ? (
                    <div
                      className={cn(
                        "relative w-full overflow-hidden rounded-[28px] bg-black",
                        isActive ? "aspect-[16/7.2]" : "aspect-[16/6.4]",
                      )}
                    >
                      <ReactPlayer
                        src={video.videoUrl}
                        playing
                        controls
                        width="100%"
                        height="100%"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingVideoId(video.id)}
                      className={cn(
                        "group relative block w-full overflow-hidden rounded-[28px] bg-[#E8EFF1] text-left transition-[aspect-ratio] duration-500",
                        isActive ? "aspect-[16/7.2]" : "aspect-[16/6.4]",
                      )}
                      aria-label="Play project experience video"
                    >
                      {!imageErrors[video.id] ? (
                        <Image
                          src={getYoutubeThumbnail(video.videoUrl)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 90vw, 100vw"
                          onError={() =>
                            setImageErrors((current) => ({
                              ...current,
                              [video.id]: true,
                            }))
                          }
                        />
                      ) : null}

                      <span className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-md bg-[#FF0000]">
                        <Play className="size-4 fill-white text-white" />
                      </span>

                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex size-16 items-center justify-center rounded-full bg-[#156374]/90 shadow-lg transition-transform group-hover:scale-105">
                          <Play className="ml-1 size-7 fill-white text-white" />
                        </span>
                      </span>
                    </button>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="app-width">
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Previous video"
            className="flex size-11 items-center justify-center rounded-full bg-[#E8EFF1] text-[#5E7278] transition-colors hover:bg-[#D5DEE2]"
          >
            <ArrowLeftCurve />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Next video"
            className="flex size-11 items-center justify-center rounded-full bg-[#156374] text-white transition-colors hover:bg-[#0E4C58]"
          >
            <ArrowRightCurve />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InsideAmdari;
