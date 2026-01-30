"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import SuccessStoriesSlider from "./success-stories-slider";
import Aos from "aos";

const SuccessStories = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    Aos.init();
  }, []);
  const testimonials = [
    {
      id: 1,
      name: "Amber Jay",
      role: "Product Designer",
      quote:
        "Within 3 months of completing the program, I got 4 job offers. The interview prep and portfolio building were game-changers!",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 2,
      name: "John Doe",
      role: "Data Analyst",
      quote:
        "The program gave me the confidence and skills I needed to land my dream job. Highly recommend!",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 3,
      name: "Jane Smith",
      role: "Software Engineer",
      quote:
        "Best investment I've made in my career. The mentorship and real-world projects were invaluable.",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 4,
      name: "Mike Johnson",
      role: "UX Designer",
      quote:
        "From zero experience to landing a role at a top company. This program works!",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 5,
      name: "Sarah Williams",
      role: "Product Manager",
      quote:
        "The structured approach and expert guidance helped me transition careers successfully.",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 6,
      name: "David Brown",
      role: "Data Scientist",
      quote:
        "The portfolio projects were exactly what employers were looking for. Got multiple offers!",
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 7,
      name: "David Brown",
      role: "Data Scientist",
      quote:
        "The portfolio projects were exactly what employers were looking for. Got multiple offers!",
      avatar: "/images/pngs/Fintech.png",
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div data-aos="fade-up" className="bg-[#F8FAFB] py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] mb-4">
            Success Stories
          </h2>
          <p className="text-[#092A31]/80 text-base lg:text-lg max-w-2xl mx-auto">
            Our interns have gone on to secure roles across the UK, US, Canada,
            and Africa
          </p>
        </div>

        {/* Avatar Carousel */}
        <SuccessStoriesSlider
          testimonials={testimonials}
          current={current}
          onApiChange={setApi}
        />

        {/* Testimonial Content */}
        {testimonials[current] && (
          <div data-aos="fade-up" className="text-center max-w-3xl mx-auto">
            {/* Quote */}
            <p className="text-xl lg:text-2xl text-gray-800 font-medium mb-6 leading-relaxed">
              "{testimonials[current].quote}"
            </p>

            {/* Author */}
            <div className="mb-4">
              <span className="text-lg font-semibold text-gray-800">
                {testimonials[current].name}
              </span>
              <span className="text-gray-600 mx-2">|</span>
              <span className="text-gray-600">
                {testimonials[current].role}
              </span>
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-orange-500 text-orange-500"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;
