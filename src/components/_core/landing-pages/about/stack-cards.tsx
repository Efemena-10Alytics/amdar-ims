"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { TeamSlide } from "./stack-carousel";

const LAYER_Y_STEP_PX = 14;
const LAYER_WIDTH_SHRINK_PX = 22;
const CARD_HEIGHT_PX = 260;

function StackCardFace({
  slide,
  descriptionClamp,
}: {
  slide: TeamSlide;
  /** Tighter copy on stacked cards so layers stay within card height */
  descriptionClamp?: string;
}) {
  return (
    <>
      <div className="relative flex gap-5">
        <div className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
          {slide.badge}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="mb-2 text-xl font-bold leading-tight">{slide.title}</h2>
          <p
            className={cn(
              "text-sm leading-relaxed text-white/90",
              descriptionClamp,
            )}
          >
            {slide.description}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute top-6 right-6 text-3xl opacity-30 select-none">
        ↗
      </div>
    </>
  );
}

type StackCardsProps = {
  slides: TeamSlide[];
  /** 0 = first card on top; slides.length - 1 = only last card visible */
  scrollLinear: number;
  onActiveIndexChange?: (index: number) => void;
  initialIndex?: number;
};

const StackCards = ({ slides, scrollLinear, onActiveIndexChange }: StackCardsProps) => {
  const last = Math.max(0, slides.length - 1);
  const fromIndex = Math.min(Math.floor(scrollLinear + 1e-9), last);
  const partial = fromIndex >= last ? 0 : Math.min(1, Math.max(0, scrollLinear - fromIndex));

  useEffect(() => {
    onActiveIndexChange?.(fromIndex);
  }, [fromIndex, onActiveIndexChange]);

  const slide = slides[fromIndex];
  if (!slide) return null;

  const layersBehind = Math.max(0, slides.length - 1 - fromIndex);
  const depths = Array.from({ length: layersBehind }, (_, i) => layersBehind - i);

  const peelTranslate = -partial * (CARD_HEIGHT_PX * 0.45 + 40);

  return (
    <div className="w-full overflow-x-hidden py-4 rounded-2xl">
      <div
        className="relative mx-auto w-full"
        style={{
          minHeight: CARD_HEIGHT_PX + Math.max(layersBehind, 1) * LAYER_Y_STEP_PX + 16,
        }}
      >
        {depths.map((depth) => {
          const slideIndex = fromIndex + depth;
          const behindSlide = slides[slideIndex];
          if (!behindSlide) return null;

          const isNextCard = depth === 1;

          return (
            <article
              key={`stack-${fromIndex}-${slideIndex}-${depth}`}
              aria-hidden
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-[14px] border border-[#2A7B89]/70 bg-linear-to-r from-[#0A3F4E] via-[#0A4A5A] to-[#0A6675] p-6 text-white shadow-md shadow-black/20"
              style={{
                width: `calc(100% - ${depth * LAYER_WIDTH_SHRINK_PX}px)`,
                maxWidth: "100%",
                top: `${depth * LAYER_Y_STEP_PX}px`,
                height: `${CARD_HEIGHT_PX}px`,
                zIndex: slides.length - depth,
              }}
            >
              <StackCardFace
                slide={behindSlide}
                descriptionClamp={
                  isNextCard ? "line-clamp-5" : "line-clamp-3 sm:line-clamp-4"
                }
              />
            </article>
          );
        })}

        <article
          className="relative z-50 mx-auto w-full overflow-hidden rounded-[14px] border border-[#2A7B89] bg-linear-to-r from-[#0A3F4E] via-[#0A4A5A] to-[#0A6675] p-6 text-white shadow-lg shadow-black/25 will-change-transform"
          style={{
            minHeight: `${CARD_HEIGHT_PX}px`,
            transform: `translateY(${peelTranslate}px)`,
          }}
        >
          <StackCardFace slide={slide} />
        </article>
      </div>
    </div>
  );
};

export default StackCards;
