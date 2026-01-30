"use client";

import React, { useState } from "react";
import { Plus, Minus, ArrowRight, MessageCircle } from "lucide-react";
import Aos from "aos";

const Faq = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  React.useEffect(() => {
    Aos.init();
  }, []);

  const faqs = [
    {
      id: 1,
      question: "What is Amdari and what do you offer?",
      answer:
        "Amdari is a platform that provides internship programs and real-world project opportunities to help individuals gain practical experience and build their portfolios. We offer structured programs with expert guidance and curated project videos.",
    },
    {
      id: 2,
      question: "Who is Amdari for?",
      answer:
        "Amdari is designed for individuals looking to transition into tech careers, recent graduates seeking practical experience, and professionals wanting to upskill in data science, product design, software engineering, and related fields.",
    },
    {
      id: 3,
      question: "How does the Amdari internship program work?",
      answer:
        "Our internship program provides hands-on experience through real-world projects. You'll work on carefully curated projects, receive expert-guided instruction, build a professional portfolio, and get interview preparation support to help you land your dream job.",
    },
    {
      id: 4,
      question:
        "Do I need prior experience to join Amdari's internship programs?",
      answer:
        "No prior experience is required! Our programs are designed to help individuals at all levels, from beginners to those looking to advance their careers. We provide comprehensive guidance and resources to support your learning journey.",
    },
    {
      id: 5,
      question: "What fields does Amdari offer internships in?",
      answer:
        "Amdari offers internships in various fields including Data Science, Product Design, Software Engineering, UX Design, Product Management, Data Analysis, and more. We continuously expand our offerings based on industry demand.",
    },
    {
      id: 6,
      question: "Is Amdari's internship program remote or on-site?",
      answer:
        "Amdari's internship programs are fully remote, allowing you to participate from anywhere in the world. This flexibility enables you to learn at your own pace while balancing other commitments.",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div data-aos="fade-up" className="bg-[#F8FAFB] py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="lg:max-w-105 text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#092A31] mb-8">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-12">
          {/* Left Section - FAQ */}
          <div className="lg:w-[55%] gap-4">
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openItems.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="bg-[#E8EFF1] rounded-lg border border-gray-200 overflow-hidden transition-colors duration-200"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full flex items-center justify-between p-4 lg:p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <span className="text-base lg:text-lg font-medium text-gray-800 pr-4">
                        {faq.question}
                      </span>
                      <div className="shrink-0 transition-transform duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          {isOpen ? (
                            <Minus className="w-4 h-4 text-white" />
                          ) : (
                            <Plus className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>

                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                          <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Section - Chat CTA */}
          <div className="flex-1">
            <div className="lg:w-[80%] ml-auto">
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#092A31] mb-6">
                Need To Talk To Us?
              </h2>
              <div className="bg-[#15535E] rounded-lg p-6 flex items-center gap-4 cursor-pointer hover:bg-[#124a54] transition-colors">
                {/* Chat Icon */}
                <div className="shrink-0 relative">
                  <div className="w-12 h-12 rounded-full bg-amdari-yellow flex items-center justify-center border-2 border-[#15535E]">
                    <MessageCircle className="w-6 h-6 text-[#092A31]" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-white/90 text-sm mb-1">
                    Couldn't find an answer?
                  </p>
                  <p className="text-white font-semibold text-base">
                    Chat with us
                  </p>
                </div>

                {/* Arrow */}
                <div className="shrink-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
