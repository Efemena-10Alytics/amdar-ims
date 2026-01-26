import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ChoosePath = () => {
  const careerPaths = [
    {
      id: 1,
      title: "Project Management / Scrum",
      description:
        "Lead projects successfully, manage resources, mitigate risks, and ensure timely delivery. Transition into a crucial role in functional initiatives.",
      price: "USD 390",
      image: "/images/pngs/internship.png", // Placeholder - replace with actual image
    },
    {
      id: 2,
      title: "Cybersecurity",
      description:
        "Protect systems against threats, identify vulnerabilities, implement security protocols, and fortify industry best practices to ensure robust security postures.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 3,
      title: "Data Analytics",
      description:
        "Turn complex data into insights that drive strategic decisions. Develop predictive models, and communicate findings to key stakeholders.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 4,
      title: "Product Design",
      description:
        "Create user-centric designs, analyze user behavior, and iterate on prototypes. Develop intuitive interfaces that align with industry standards.",
      price: "USD 599",
      image: "/images/pngs/internship.png",
    },
    {
      id: 5,
      title: "Data Science",
      description:
        "Develop algorithms, manage pipelines, optimize databases, and interpret complex data to derive actionable insights.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 6,
      title: "Business Analytics",
      description:
        "Work with stakeholders, use data to provide strategic recommendations, and generate feedback loops to optimize business processes.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 7,
      title: "Data Engineering",
      description:
        "Build scalable data insights that drive strategic decisions. Develop predictive models, and communicate findings to key stakeholders.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 8,
      title: "Cloud & DevOps",
      description:
        "Deploy, automate, monitor, & administer cloud environments. Implement CI/CD pipelines & ensure system reliability and efficiency.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 9,
      title: "SOC Analytics",
      description:
        "Monitor, evaluate, monitor and respond to security incidents. Implement security controls & ensure compliance with industry procedures.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 10,
      title: "Ethical Hacking",
      description:
        "Identify, evaluate, monitor, and implement security controls and compliance with industry procedures.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
    {
      id: 11,
      title: "Governance Risk & Compliance",
      description:
        "Deploy, automate, monitor, and administer cloud environments. Implement CI/CD pipelines and ensure system reliability and efficiency.",
      price: "USD 390",
      image: "/images/pngs/internship.png",
    },
  ];

  return (
    <div className="bg-white py-12 lg:py-20">
      <div className="max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Title */}
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#092A31] leading-tight">
                Choose & Explore A Career Path
              </h2>
            </div>

            {/* Subtitle */}
            <div>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                Each internship runs for 6 months, with 2 major projects
                designed from real business challenges & a portfolio worth
                $2000.
              </p>
            </div>
          </div>
        </div>

        {/* Career Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((career) => (
            <div
              key={career.id}
              className="bg-[#E8EFF1] p-4 md:p-6 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={career.image}
                  alt={career.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-[#092A31] mb-3">
                  {career.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {career.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#092A31]">
                    {career.price}
                  </span>
                  <Button
                    className={cn(
                      "bg-primary text-white hover:bg-[#0f4d5a] rounded-full px-4 py-2 text-sm font-medium",
                    )}
                  >
                    Apply here
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoosePath;
