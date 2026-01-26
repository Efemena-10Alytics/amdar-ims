"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import Mentors from "./mentors";

const Right = () => {
  const [countdown, setCountdown] = useState({
    days: 21,
    hours: 3,
    minutes: 50,
    seconds: 48,
  });

  const skills = [
    "Prototyping",
    "Interface design",
    "User research",
    "Quantitative research",
    "Qualitative research",
    "Wireframing",
    "Presentations",
    "Slides",
    "Animation",
    "Brain storming",
    "Mood board",
  ];

  const mentors = [
    {
      id: 1,
      name: "Somadina Uche",
      title: "Data Science Specialist",
      image: "/images/testimonials/intern-1.jpg",
      linkedin: "#",
    },
    {
      id: 2,
      name: "John Doe",
      title: "DevOps Engineer",
      image: "/images/testimonials/intern-2.jpg",
      linkedin: "#",
    },
  ];

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 mt-20">
      {/* Video Player Section */}
      <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video">
        <Image
          src="/images/pngs/woman.png"
          alt="Video thumbnail"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-end p-3 justify-start bg-black/40">
          <div className="flex items-center gap-2">
            <div className="border-2 border-gray-500 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-white text-sm font-medium">Play to view</span>
          </div>
        </div>
      </div>

      {/* Secure Your Seat Section */}
      <div className="bg-[#F8FAFB] rounded-lg p-6">
        <h3 className="font-semibold text-[#092A31] mb-4">Secure your seat</h3>

        {/* Countdown Timer */}
        <div className="flex gap-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.days).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">D</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.hours).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">Hrs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-[#092A31] mb-1">
              {String(countdown.minutes).padStart(2, "0")} :
            </div>
            <div className="text-xs text-[#092A31]">Min</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#092A31] mb-1">
              {String(countdown.seconds).padStart(2, "0")}
            </div>
            <div className="text-xs text-[#092A31]">Sec</div>
          </div>
        </div>

        <a href="#" className="text-primary underline text-sm font-medium">
          Apply for the next cohort
        </a>
      </div>

      {/* Skills You Will Learn Section */}
      <div className="bg-[#F8FAFB] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#092A31] mb-4">
          Skills you will learn
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-full bg-[#E8EFF1] text-sm text-[#092A31] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Mentors Section */}
      <div>
        <h3 className="text-xl font-bold text-[#092A31] mb-4">Mentors</h3>
        <Mentors mentors={mentors} />
      </div>
    </div>
  );
};

export default Right;
