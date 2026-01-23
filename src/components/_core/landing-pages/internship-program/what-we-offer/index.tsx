"use client";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import Internship from "./internship";
import RealWorldProject from "./real-world-project";
import TalentLoop from "./talent-loop";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const WhatWeOffer = () => {
  const [activeTab, setActiveTab] = React.useState<
    "Internship" | "Real-world Projects" | "Talent loop"
  >("Internship");
  const [api, setApi] = React.useState<CarouselApi>();

  const tabs = [
    { id: "Internship", label: "Internship", index: 0 },
    { id: "Real-world Projects", label: "Real-world Projects", index: 1 },
    { id: "Talent loop", label: "Talent loop", index: 2 },
  ];

  // Update active tab when carousel slide changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      const selectedTab = tabs.find((tab) => tab.index === selectedIndex);
      if (selectedTab) {
        setActiveTab(selectedTab.id as any);
      }
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle tab click - scroll to corresponding slide
  const handleTabClick = (tabId: string, index: number) => {
    setActiveTab(tabId as any);
    api?.scrollTo(index);
  };

  return (
    <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8 mt-10 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <p className="text-sm text-gray-500 mb-4">Use switch tab</p>
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 rounded-full bg-[#E8EFF1] py-2 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.index)}
                className={cn(
                  "py-2 rounded-full text-xs md:text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-[#B6CFD4] text-primary px-4"
                    : "text-gray-600 hover:text-gray-900 px-2",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          <CarouselItem>
            <Internship />
          </CarouselItem>
          <CarouselItem>
            <RealWorldProject />
          </CarouselItem>
          <CarouselItem>
            <TalentLoop />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default WhatWeOffer;
