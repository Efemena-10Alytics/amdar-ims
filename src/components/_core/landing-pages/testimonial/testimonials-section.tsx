"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import ReactPlayer from "react-player";
import { VideoFullscreenButton } from "@/components/_core/shared/video-fullscreen-button";
import { useVideoFullscreen } from "@/hooks/use-video-fullscreen";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftCurve, ArrowRightCurve } from "@/components/_core/landing-pages/home/svg";
import {
  getYoutubeThumbnail,
  TESTIMONIAL_VIDEOS,
} from "@/features/testimonials/constants";
import { useYoutubeCaptions } from "@/features/youtube/use-youtube-caption";
import SuccessStories from "../home/success-stories";

type TestimonialVideoCardProps = {
  testimonial: (typeof TESTIMONIAL_VIDEOS)[number];
  caption: string;
  isPlaying: boolean;
  hasImageError: boolean;
  onImageError: () => void;
  onPlay: () => void;
};

function TestimonialVideoCard({
  testimonial,
  caption,
  isPlaying,
  hasImageError,
  onImageError,
  onPlay,
}: TestimonialVideoCardProps) {
  const { containerRef, isFullscreen, toggleFullscreen } = useVideoFullscreen();

  if (isPlaying) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl bg-black sm:min-h-112",
          "[&:fullscreen]:flex [&:fullscreen]:aspect-auto [&:fullscreen]:h-screen [&:fullscreen]:max-h-none [&:fullscreen]:w-screen [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none",
        )}
      >
        <ReactPlayer
          src={testimonial.videoUrl}
          playing
          controls
          width="100%"
          height="100%"
          className={cn(isFullscreen && "max-h-screen max-w-screen")}
        />

        <div className="absolute right-4 bottom-4 z-10">
          <VideoFullscreenButton
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
      onClick={onPlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay();
        }
      }}
      aria-label={`Play video: ${caption}`}
    >
      <div className="relative aspect-video w-full bg-[#E8EFF1] sm:min-h-112">
        {!hasImageError ? (
          <Image
            src={getYoutubeThumbnail(testimonial.videoUrl)}
            alt={caption}
            fill
            className="object-cover"
            sizes="90vw"
            onError={onImageError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/40">
            <Play className="h-16 w-16 text-white/50" />
          </div>
        )}

        <div className="absolute top-4 left-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF0000]">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F6A79]/85 shadow-lg transition group-hover:scale-105">
            <Play className="ml-1 h-7 w-7 fill-white text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselPrevious({
  api,
  className,
}: {
  api: CarouselApi | undefined;
  className?: string;
}) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCanScrollPrev(api.canScrollPrev());

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
      className={cn("h-10 w-10 rounded-full", className)}
      disabled={!canScrollPrev}
      onClick={() => api?.scrollPrev()}
      aria-label="Previous testimonial"
    >
      <ArrowLeftCurve />
    </Button>
  );
}

function CarouselNext({
  api,
  className,
}: {
  api: CarouselApi | undefined;
  className?: string;
}) {
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCanScrollNext(api.canScrollNext());

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
      className={cn("h-10 w-10 rounded-full", className)}
      disabled={!canScrollNext}
      onClick={() => api?.scrollNext()}
      aria-label="Next testimonial"
    >
      <ArrowRightCurve />
    </Button>
  );
}

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [playingId, setPlayingId] = useState<number | null>(null);

  const videoUrls = TESTIMONIAL_VIDEOS.map((item) => item.videoUrl);
  const { captions, isLoaded } = useYoutubeCaptions(videoUrls);

  const getCaption = (videoUrl: string) =>
    captions[videoUrl] ?? (isLoaded ? "Intern testimonial" : "Loading...");

  useEffect(() => {
    if (!api) return;

    const stopPlayback = () => setPlayingId(null);

    api.on("select", stopPlayback);
    return () => {
      api.off("select", stopPlayback);
    };
  }, [api]);

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="app-width">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-[#092A31] sm:text-4xl lg:text-5xl">
            What Our Interns Say
          </h1>
          <p className="mt-4 text-base text-[#092A31]/70 sm:text-lg">
            Our interns have gone on to secure roles across the UK, US, Canada,
            and Africa
          </p>
        </div>
      </div>

      <div className="relative mt-12 w-full lg:mt-16 pl-6 xl:pl-16">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {TESTIMONIAL_VIDEOS.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="min-w-0 shrink-0 grow-0 basis-[90vw] pr-4"
              >
                <TestimonialVideoCard
                  testimonial={testimonial}
                  caption={getCaption(testimonial.videoUrl)}
                  isPlaying={playingId === testimonial.id}
                  hasImageError={!!imageErrors[testimonial.id]}
                  onImageError={() => {
                    setImageErrors((prev) => ({
                      ...prev,
                      [testimonial.id]: true,
                    }));
                  }}
                  onPlay={() => setPlayingId(testimonial.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="app-width">
        <div className="mt-8 flex justify-end gap-2">
          <CarouselPrevious
            api={api}
            className="border-0 bg-[#E8EFF1] text-[#092A31] hover:bg-[#D1D9DC]"
          />
          <CarouselNext
            api={api}
            className="border-0 bg-primary text-white hover:bg-[#0f4d5a]"
          />
        </div>
      </div>
      <div className="mt-12">
        <SuccessStories />
      </div>

    </section>
  );
};

export default TestimonialsSection;
