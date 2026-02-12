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
      name: "James A.",
      role: "Data Analyst",
      quote: `I signed up with Amdari because of the reviews I saw on social media, and truly when I joined,
         they really lived up to expectations .. The whole company is well structured, highly focused and
          they are really bombarding us with projects, classes and mentorship meetings.. Lol. The facilitator of my cohort,
           @remilekun is really doing a great job, fantastic job and I don't ever regret joining them..Thanks`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 2,
      name: "Aliagha Gladys",
      role: "Data Analyst",
      quote: `My Experience has been amazing
My Experience has been amazing, from the mentors to my fellow consultants.
It has been a great experience from the project task and the collaboration with other departments such BA, PM, DS etc.
So far the journey and transition has been a smooth journey for me.

I started my internship around August and all the projects I have worked on so far really challenged me to becoming a better and more professional Aata Analyst. Like PrimeCart E-commerce Project which I collaborated with other departments, Horizon Healthcare project which we are collaborating with DS team.
The support from our Coordinator Miss Moriam has been helpful.
Am happy to be part of Amdari's Intern Team`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 3,
      name: "Oluseun Akanni",
      role: "Data Analyst",
      quote: `My experience at Amdari has been nothing short of amazing.
Honestly, joining this program is one of the best decisions I have made this year. Wish I knew about AMDARI earlier than now.
They are very intentional about the growth of every Intern. I highly recommend them.`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 4,
      name: "Simon chuks",
      role: "Business Analyst",
      quote: `I completed my Business Analyst internship with Amdari UK as a consultant, and it was a genuinely valuable experience. The program was well-structured and gave me hands-on exposure to real-world business analysis tasks rather than just theory.
I worked on practical projects that helped me strengthen my skills in requirements gathering, stakeholder communication, documentation, and problem-solving. The consultants and mentors at Amdari were supportive, knowledgeable, and always willing to guide me when needed, while still encouraging independent thinking.
What I appreciated most was the professional consulting environment ,it gave me a clear understanding of how Business Analysts operate within client-focused projects. This internship has definitely helped boost my confidence and prepared me for future roles in the field.
I would recommend Amdari to anyone looking to gain practical experience and grow as a Business Analyst.`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 5,
      name: "Sarah Williams",
      role: "Cybersecurity Expert",
      quote: `I am currently completing my internship with Amdari in Ethical Hacking, and it has been an incredible experience so far. The team has been brilliant — supportive, knowledgeable, and genuinely committed to helping me grow as a cybersecurity penetration tester.
My tutor, Christopher Essien, has been outstanding. He’s patient, approachable, and always willing to guide me through every concept to ensure I fully understand the practical and technical aspects of ethical hacking. His mentorship has truly helped me build confidence and sharpen my skills in this field.
I’m very grateful for the opportunity to learn with Amdari. The experience is not only helping me strengthen my foundation in cybersecurity but also preparing me for a successful career ahead. I’m proud to be part of this internship and excited for what’s next!`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 6,
      name: "Charlotte Newman",
      role: "Business Analyst",
      quote: `My work experience with Amdari was an incredibly enriching and transformative professional journey.
       As part of the Amdari team, I was exposed to real-world consulting projects that required critical thinking, 
       collaboration, and problem-solving. These skills are essential for success in today’s competitive job market.
During my time at Amdari, I worked on several client-based projects, where we were tasked with identifying business
 challenges, developing data-driven strategies, and delivering actionable solutions. Each project simulated the 
 dynamics of a real consulting environment from research and analysis to teamwork, communication, and presentation of deliverables.
A key highlight of my experience was the exceptional mentorship provided by Edidiong, our coach. Her guidance went
 far beyond technical skills; she helped us understand how to navigate professional environments, structure consulting
  tasks, and communicate our ideas effectively. Through her mentorship, we learned how to think and operate like
   consultants, balancing analytical rigor with creativity and client-focus.
Amdari’s approach to professional development is deeply experiential. Rather than a typical training program, 
it offers a hands-on consulting work experience where participants engage with real tasks, meet deadlines, and contribute
 to meaningful project outcomes. This environment not only strengthened my technical and soft skills but 
also boosted my confidence and readiness for the job market. I am deeply grateful for the opportunity and for
 Edidiong’s dedication in guiding us through every stage of the journey.`,
      avatar: "/images/pngs/Fintech.png",
    },
    {
      id: 7,
      name: "Precious Ijezie",
      role: "Cybersecurity Consultant",
      quote: `It has been a learning and growing experience for me. My confidence is been built with every project done. The experience have been nothing short of amazing for me from handling projects alone, to report writing and to presenting my findings and giving recommendation. It keeps getting better.
The class facilitator is always willing to help when ever I encounter issues.
The mentorship sessions constantly boost my confidence to succeed in this career path.
Thank you Amdari`,
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
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] mb-4">
            Success Stories
          </h2>
          <p className="text-[#092A31]/80 text-base lg:text-lg max-w-md mx-auto">
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
            <p className="text-lg text-gray-800 font-medium mb-6 leading-relaxed">
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
