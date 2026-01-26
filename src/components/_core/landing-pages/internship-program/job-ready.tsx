"use client";

import { useState } from "react";
import Image from "next/image";

const JobReady = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const benefits = [
    {
      id: 1,
      title: "A clear score showing how 'job-ready' you are.",
      icon: "/images/svgs/job-ready/eighty.svg",
    },
    {
      id: 2,
      title: "Insights into the exact gaps holding you back.",
      icon: "/images/svgs/job-ready/binocular.svg",
    },
    {
      id: 3,
      title: "A personalized diagnostic roadmap with practical next steps.",
      icon: "/images/svgs/job-ready/diagnostic.svg",
    },
    {
      id: 4,
      title: "Direct recommendations for programs that fix those gaps fast.",
      icon: "/images/svgs/job-ready/recommendation.svg",
    },
  ];

  return (
    <div className="bg-gray-100 pt-12 lg:pt-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Assessment Form */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/images/pngs/job-ready.png"
              alt="AAMDARI"
              width={618}
              height={722}
              className="mb-4 translate-y-5"
            />
          </div>

          {/* <div>
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#092A31] mb-6">
                Let's test your job readiness
              </h2>

              <div className="flex items-center gap-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amdari-yellow">
                  <div className="flex items-center justify-center bg-[#FFE082] h-6 w-6 rounded-full">
                    <Lightbulb className="w-4 h-4 text-[#8B6914]" />
                  </div>
                  <span className="text-sm font-medium text-[#8B6914]">
                    Take this job readiness job
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/svgs/flags.svg"
                    alt="Flags"
                    width={40}
                    height={24}
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-[#092A31] mb-3">
                  Assessment guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Answer each question based on how accurately it represents
                      you
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Ensure all questions are answered</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#092A31] mb-4">
                  Questions
                </h3>
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id}>
                      <p className="text-sm text-gray-700 mb-3">
                        {question.text}
                      </p>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="yes"
                            checked={answers[question.id] === "yes"}
                            onChange={() =>
                              handleAnswerChange(question.id, "yes")
                            }
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value="no"
                            checked={answers[question.id] === "no"}
                            onChange={() =>
                              handleAnswerChange(question.id, "no")
                            }
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className={cn(
                  "w-full bg-primary text-white hover:bg-[#0f4d5a] rounded-lg py-6 text-base font-medium",
                )}
              >
                Continue assessment
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>+30K interns Across the world Got hired</span>
              <Image
                src="/images/svgs/flags.svg"
                alt="Flags"
                width={40}
                height={24}
              />
            </div>
          </div> */}

          {/* Right Column - Benefits */}
          <div className="lg:mt-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#092A31] mb-4">
              Are You Job Ready?
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-8 leading-relaxed">
              At Amdari we help you discover what's stopping you from getting
              hired. Under 3 minutes you get:
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2">
              {benefits.map((benefit, index) => {
                let borderClasses = "rounded-lg p-6 border-t border-gray-200";

                if (index === 0) {
                  // First item: border bottom
                  borderClasses = "rounded-lg p-6 border-b border-gray-200";
                } else if (index === 1) {
                  // Second item: border left
                  borderClasses =
                    "rounded-lg p-6 border-l border-gray-200 -translate-x-1";
                } else if (index === 2) {
                  // Third item: border right
                  borderClasses = "rounded-lg p-6 border-r border-gray-200";
                }
                // Fourth item (index 3): no border (borderless)

                return (
                  <div key={benefit.id} className={borderClasses}>
                    <div>
                      <p className="text-sm text-gray-700">{benefit.title}</p>
                      <div className="mt-4 flex justify-end">
                        <Image
                          src={benefit.icon}
                          height={82}
                          width={66}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReady;
