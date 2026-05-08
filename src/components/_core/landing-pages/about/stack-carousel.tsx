"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  StackedCarousel,
  type StackedCarouselSlideProps,
} from "react-stacked-center-carousel";

export type TeamSlide = {
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
};

type TeamCardProps = StackedCarouselSlideProps & {
  data: TeamSlide[];
};

const TeamCard = ({ data, dataIndex }: TeamCardProps) => {
  const slide = data[dataIndex];
  if (!slide) return null;

  return (
    <article className="relative h-60 overflow-hidden rounded-[14px] border border-[#2A7B89] bg-linear-to-r from-[#0A3F4E] via-[#0A4A5A] to-[#0A6675] p-6 text-white">
      <div className="relative flex gap-5">
        <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-white/10 font-bold">
          {slide.badge}
        </div>
        <div>
          <h2 className="mb-2 text-xl font-bold leading-none">{slide.title}</h2>
          <p className="text-sm text-white/90">{slide.description}</p>
        </div>
      </div>
      <div className="absolute top-6 right-6 text-3xl opacity-30">↗</div>
    </article>
  );
};

type StackCarouselProps = {
  slides: TeamSlide[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  initialIndex?: number;
};

const StackCarousel = ({
  slides,
  activeIndex,
  onActiveIndexChange,
  initialIndex = 0,
}: StackCarouselProps) => {
  const CAROUSEL_HEIGHT = 320;
  const AUTOPLAY_DELAY = 2600;
  const carouselRef = useRef<StackedCarousel | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (!carouselRef.current) return;
    if (activeIndex === currentIndex) return;
    carouselRef.current.swipeTo(activeIndex - currentIndex);
  }, [activeIndex, currentIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      carouselRef.current?.goNext();
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [AUTOPLAY_DELAY]);

  return (
    <div className="w-full py-4">
      <div className="w-full">
        <ResponsiveContainer
          carouselRef={carouselRef}
          render={(parentWidth, ref) => (
            <StackedCarousel
              ref={ref}
              data={slides}
              slideComponent={TeamCard}
              carouselWidth={parentWidth}
              slideWidth={Math.min(parentWidth * 0.96, 760)}
              height={CAROUSEL_HEIGHT}
              maxVisibleSlide={5}
              currentVisibleSlide={5}
              // customScales={[1, 0.76, 0.54, 0.36]}
              // fadeDistance={0.7}
              useGrabCursor
              onActiveSlideChange={(index) => {
                setCurrentIndex(index);
                onActiveIndexChange(index);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default StackCarousel;
