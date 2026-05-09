"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import Aos from "aos";

interface FeatureSplitSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  overlayQuote: string;
  footerContent?: ReactNode;
}

const FeatureSplitSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  overlayQuote,
  footerContent,
}: FeatureSplitSectionProps) => {
  useEffect(() => {
    Aos.init({
      once: false,
      mirror: true,
    });
  }, []);
  return (
    <div data-aos="fade-up" className="bg-[#F1F5F6] py-12 lg:py-20">
      <div className="app-width">
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-1 justify-center">
            <div className="w-full max-w-160 bg-primary p-4 lg:p-6">
              <div className="relative aspect-4/3 min-h-70 overflow-hidden rounded-lg bg-[#0F4652] lg:min-h-0">
                <Image src={imageSrc} alt={imageAlt} fill className="h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute right-0 bottom-0 left-0 m-2 rounded-xl bg-black/70 p-4 lg:m-4">
                  <p className="text-sm leading-relaxed text-white/95 lg:text-base">
                    {overlayQuote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <h2 className="mb-4 text-2xl font-semibold text-[#092A31] lg:text-3xl xl:text-4xl">
              {title}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-[#64748B] lg:text-lg">
              {description}
            </p>
            {footerContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSplitSection;
