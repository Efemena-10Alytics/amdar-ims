"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  getYoutubeThumbnail,
  TESTIMONIAL_VIDEOS,
} from "@/features/testimonials/constants";
import { VideoPlayerModal } from "@/components/_core/landing-pages/shared/video-player-modal";
import {
  ArrowLeftCurve,
  ArrowRightCurve,
} from "@/components/_core/landing-pages/home/svg";
import { cn } from "@/lib/utils";

const ProjectExperience = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!api) return;

    const update = () => setSelectedIndex(api.selectedScrollSnap());

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
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-[#092A31] sm:text-4xl lg:text-5xl">
            Project experience
          </h2>
          <p className="mt-3 text-sm text-[#5E7278] sm:text-base">
            Our interns have gone on to secure roles across the UK, US, Canada,
            and Africa
          </p>
        </div>

      </div>

      <div className="mt-8 w-full pl-4 sm:pl-6 xl:pl-[max(4rem,calc((100vw-100rem)/2+4rem))] lg:mt-10">
        <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
          <CarouselContent className="items-center">
            {TESTIMONIAL_VIDEOS.map((video, index) => {
              const isActive = index === selectedIndex;

              return (
              <CarouselItem key={video.id} className="basis-[88vw] pr-4">
                <button
                  type="button"
                  onClick={() => setPlayingVideoUrl(video.videoUrl)}
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

      <VideoPlayerModal
        open={!!playingVideoUrl}
        onOpenChange={(open) => !open && setPlayingVideoUrl(null)}
        videoUrl={playingVideoUrl}
        title="Project experience"
      />
    </section>
  );
};

export default ProjectExperience;
